<!--
 * @Descripttion: 测量项目引导选择页面
 * @Author: gaoyuanyuan
 * @Date: 2020-03-05 16:36:27
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2025-10-21 11:25:00
 -->
<template>
    <div :class="['scan-project-guide', $i18n.locale]">
        <!-- <div style="margin-top: 60px">
            <button @click="depthCamera()">鱼眼相机异常</button>
            <button @click="weightModuleAbnormal()">体重模块异常</button>
            <button @click="buttonState()">按钮状态</button>
        </div> -->
        <div v-if="!isStandardMode" class="top-tips">{{ $t('home.top-tip') }}</div>
        <div v-if="settingInfo.Athlete" class="top-tips2">{{ $t('Athlete.tips') }}</div>
        <!-- 体围测量项目 体围测量 或 只剩肩部时 -->
        <div
            @touchstart="isTouchScreen(1)"
            v-if="deviceUsable.shape || errProjects.length === 2 || errProjects.length === 3"
            :class="['shape-project', styleType === 1 ? 'finish-click' : '']"
        >
            <div class="left">
                <div class="title">
                    {{
                        deviceUsable.shape
                            ? $t('item-select.ti-tai-ping-gu')
                            : deviceUsable.shoulder
                            ? $t('item-select.jian-bu-gong-neng')
                            : $t('common.ti-zhong-ce-liang')
                    }}
                </div>
                <p class="describe describe-msg">
                    <i18n path="item-select.ti-tai-ping-gu_desc[0]" tag="span">
                        <br place="item" />
                    </i18n>
                </p>
            </div>
            <div class="right">
                <img src="@img/select/model1.png" />
            </div>
        </div>
        <div
            @touchstart="isTouchScreen(2)"
            :class="[{ 'mass-project': true, frame: !deviceUsable.shape }, styleType === 2 ? 'finish-click' : '']"
            v-if="isShowNutrition && isError"
        >
            <div class="left">
                <div class="title">
                    {{ $t('item-select.wu-dian-liu') }}
                    <img
                        :src="styleType === 2 ? require('@img/wudianliu-s.png') : require('@img/wudianliu.png')"
                        alt=""
                    />
                </div>
                <p class="describe">{{ $t('item-select.ti-tai-ping-gu_desc_m30') }}</p>
            </div>
            <div class="right">
                <img src="@img/select/ti_tai.png" />
            </div>
        </div>
        <!-- 体态项目 -->
        <div
            @touchstart="isTouchScreen(2)"
            v-if="isShowGirthMeasure"
            :class="[{ 'mass-project': true, frame: !deviceUsable.shape }, styleType === 2 ? 'finish-click' : '']"
        >
            <div class="left">
                <div class="title">{{ $t('item-select.ti-wei-ce-liang') }}</div>
                <p class="describe">{{ $t('item-select.ti-tai-ping-gu_desc_m30') }}</p>
            </div>
            <div class="right">
                <img src="@img/select/ti_tai.png" />
            </div>
        </div>
        <!-- 动态实验室 肩部正常且异常项为0/1 -->
        <div
            :class="['test-project', styleType === 3 ? 'finish-click' : '']"
            @touchstart="isTouchScreen(3)"
            v-if="isShowCheckButton"
        >
            <div class="title">{{ $t('item-select.dong-tai-shi-yan-shi') }}</div>
            <!-- <p class="btn-tip">
                <i18n path="item-select.dong-tai-shi-yan-shi_desc_m30" tag="span">
                    <img src="@img/error/switch.png" />
                </i18n>
            </p> -->
        </div>
        <!-- 体重测量 -->
        <div
            v-if="isShowWeight"
            :class="['test-project', styleType === 4 ? 'finish-click' : '']"
            @touchstart="isTouchScreen(4)"
        >
            <div class="title">{{ $t('common.ti-zhong-ce-liang') }}</div>
            <!-- <p class="btn-tip">
                <i18n path="item-select.dong-tai-shi-yan-shi_desc_m30" tag="span">
                    <img src="@img/error/switch.png" />
                </i18n>
            </p> -->
        </div>
        <!-- 异常项目提醒 -->
        <div v-if="errProjects.length > 0" class="tips-wrap">
            <img src="@img/abnormal.svg" class="icon" alt="项目异常" />
            <div class="tips-main">
                <!-- 标题 -->
                <h3 class="title">
                    {{ $t('item-select.items_err', [errProjects.join('、')]) }}
                </h3>
                <!-- 消息内容 -->
                <p class="msg" v-if="$i18n.locale == 'zh' ? true : false">{{ deviceUsable.errorTip }}</p>
                <!-- <p class="msg">{{ deviceUsable.errorTip }}</p> -->
            </div>
        </div>
        <cut-down-load @cut-down-over="cutDownOver" :duration="60" :suffixType="1"></cut-down-load>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import CutDownLoad from '@/components/CutDownLoad.vue'
import { EventBus } from '@/util/event-bus'
export default {
    name: 'StandUpSelect',
    components: {
        CutDownLoad
    },
    data() {
        return {
            // 1 体围 2体态 3 动态实验室 4 直接进入肩部
            startType: 0,
            // 是否请求站人检测
            detectRequested: false,
            audios: [
                'selectGuideAllNormal',
                'selectGuideOnlyBm',
                'selectGuideBsAndShd',
                'selectGuideBmAndShd',
                'selectGuideOnlyShd',
                'selectGuideOnlyBs',
                'selectGuideAllNormal2_touch',
                'selectGuideOnlyBm_a',
                'noDianliu'
            ],
            // 手势样式区块 1 体态 2 身体 3 肩部 4体重
            styleType: 0,
            // 按钮测量位置
            btnIndex: 1,
            // 正常项目信息数组
            normalProjects: [],
            isClickStatus: false,
            // 自定表头
            title: {
                prev: 'navigation-bar.shou-ye',
                title: 'navigation-bar.qing-an-tu-shi-dong-zuo-jin-ru-ce-liang-xiang-mu',
                icon: false,
                leave: true
            }
        }
    },
    watch: {
        // 监听项目异常
        errProjects: {
            handler(val, oldVal) {
                if (val.length !== oldVal.length) {
                    // 更新正常项目信息数组
                    this.updateNormalProjects()
                }
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters(['deviceUsable', 'standPeople', 'measureInfo', 'settingInfo', 'initMesInfo']),
        // 是否需要发起站人检测 体态正常或只剩肩部时
        detectUsable() {
            return this.deviceUsable.shape || (this.deviceUsable.shoulder && this.errProjects.length === 2)
        },
        // 异常项目数组
        errProjects() {
            let errorArr = []
            const initUnscan = this.initMesInfo.unScanItems
            if (!this.deviceUsable.shape && initUnscan.indexOf(2) > -1) {
                errorArr.push(this.$t('item-select.ti-tai-ping-gu'))
            }
            if (!this.deviceUsable.shape && initUnscan.indexOf(3) > -1) {
                errorArr.push(this.$t('item-select.ti-wei-ce-liang'))
            }
            if (!this.deviceUsable.weight && initUnscan.indexOf(1) > -1) {
                errorArr.push(this.$t('common.ti-zhong-ce-liang'))
            }
            if (!this.deviceUsable.shoulder && this.settingInfo.dynamicLaboratory && initUnscan.indexOf(4) > -1) {
                errorArr.push(this.$t('common.dong-tai-shi-yan-shi'))
            }
            return errorArr
        },
        audioId() {
            // 3项均正常
            if (this.errProjects.length === 0) {
                if (!this.settingInfo.dynamicLaboratory) {
                    return this.audios[6]
                } else {
                    if (this.isShowNutrition) {
                        return this.audios[8]
                    }
                    return this.audios[0]
                }
                // 体态+肩部
            } else if (!this.deviceUsable.girth && this.errProjects.length === 1) {
                if (!this.settingInfo.dynamicLaboratory) {
                    return this.audios[5]
                }
                if (this.deviceUsable.weight) {
                    return this.audios[2]
                } else {
                    return this.audios[7]
                }

                // 体重+肩部
            } else if (!this.deviceUsable.weight && this.errProjects.length === 1) {
                return this.audios[3]
                // 仅肩部（不会出现仅体态项目正常的情况）
            } else {
                if (this.deviceUsable.shoulder) {
                    return this.audios[4]
                } else {
                    return this.audios[3]
                }
            }
        },
        // 是否显示确认键进入动态实验室 肩部正常且异常项为0/1
        isShowCheckButton() {
            return this.deviceUsable.shoulder && this.errProjects.length < 2 && this.measureInfo.unScanItems.includes(4)
        },
        // 是否体重测量项异常
        isShowWeight() {
            return (
                this.deviceUsable.weight &&
                this.deviceUsable.shoulder &&
                this.measureInfo.unScanItems.includes(1) &&
                this.isStandardMode
            )
        },
        isShowGirthMeasure() {
            return this.deviceUsable.shape && this.isStandardMode
        },
        isStandardMode() {
            return this.settingInfo.deviceMode === 2
        },
        isShowNutrition() {
            const isFlag = this.initMesInfo.unScanItems.indexOf(3) > -1 && this.initMesInfo.unScanItems.indexOf(1) > -1
            return !this.isStandardMode && isFlag
        },
        // vapro3 无电流营养体重异常则不显示
        isError() {
            return this.deviceUsable.weight
        }
    },
    created() {
        this.$emit('on-audio-event', 'playAudio', 'btnEffect')

        // 更新正常项目信息数组
        this.updateNormalProjects()

        // 监听检测结果
        EventBus.$on('EventAction', async (type, result) => {
            if (type === 'GestureIposeResult' && result === 1) {
                // 如果体围正常则启动体围否则为动态实验室
                this.startType = this.deviceUsable.shape ? 2 : 4
                // vaPro3 下地垫站人跳转到对应页面
                // if (this.isShowNutrition) {
                //     this.startType = 1
                // }
                // 取消地毯站人检测
                this.stopGestureDetectHandler()
                // } else if (type === 'StandState' && result) {
                //     // 体成分正常并且站人
                //     if (this.deviceUsable.mass && result) {
                //         this.measureInfo.unScanItems.shift()
                //         // 进入体成分测量页面
                //         this.$changeViewPage('WeightGuide')
                //     }
            } else if (type === 'HardwareStatusEvent') {
                if (this.detectUsable) {
                    this.detectRequested = true
                    // 启动手势Ipose检测
                    this.$algClient.startGestureIposeDetect()
                }
            }
        })
        this.isNotLeftKey()
        this.$store.commit('CHANGE_SCAN_STATE', true)
        if (this.normalProjects.length > 0) {
            console.log(`当前项目${JSON.stringify(this.normalProjects)}`)
            this.handleBtnType(this.normalProjects[this.btnIndex - 1])
        }

        // 如果欢迎页站人 直接进入体重测量
        // if (this.standPeople && this.deviceUsable.mass) {
        //     let unScanItems = this.measureInfo.unScanItems
        //     let activeIdx = unScanItems.indexOf(3)
        //     // 从未测量的项目中移除
        //     if (activeIdx > -1) {
        //         unScanItems.splice(activeIdx, 1)
        //     }
        //     this.$store.commit('CHANGE_MEASURE_INFO', {
        //         unScanItems: unScanItems
        //     })
        //     this.$algClient.closeDepthCamera()
        //     this.$changeViewPage('WeightMeasure')
        //     return
        // }
    },
    mounted() {
        // 判断顶部返回首页是否显示
        if (this.errProjects.length > 1) {
            this.title.prev = ''
            this.title.icon = undefined
            this.METE_TITLE(this.title)
        } else {
            this.title.prev = 'navigation-bar.shou-ye'
            this.title.icon = true
            this.METE_TITLE(this.title)
        }
        if (this.errProjects.length === this.initMesInfo.unScanItems.length) {
            // 所有项目都异常
            this.$changeViewPage('DeviceError')
        }
        setTimeout(() => {
            this.$emit('on-audio-event', 'playAudio', this.audioId)
        }, 1 * 1000)
    },
    beforeDestroy() {
        this.$algClient.stopGestureIposeDetect()
        EventBus.$off('EventAction')
    },
    methods: {
        ...mapMutations(['METE_TITLE']),
        // 更新正常项目信息数组
        updateNormalProjects() {
            this.normalProjects = []
            const status = [
                this.deviceUsable.shape,
                this.deviceUsable.shape,
                this.deviceUsable.shoulder,
                this.deviceUsable.weight
            ]
            // || 指的是vapro3 无电流转台西安异常拔掉鱼眼相机跳转到异常报告页面
            if (
                this.errProjects.length === this.initMesInfo.unScanItems.length ||
                (this.isShowNutrition &&
                    this.deviceUsable.weight &&
                    !this.deviceUsable.shape &&
                    !this.deviceUsable.shoulder)
            ) {
                // 所有项目都异常
                this.$changeViewPage('DeviceError')
            }
            const allProject = [2, 3, 4, 1]
            status.forEach((item, idx) => {
                if (item) {
                    const ScanItems = allProject[idx]
                    const index = this.initMesInfo.unScanItems.indexOf(ScanItems)
                    if (ScanItems && index > -1) {
                        this.normalProjects.push(ScanItems)
                    }
                }
            })
            // if (!this.isStandardMode) {
            //     const isFlag = this.normalProjects.indexOf(3) > -1 && this.normalProjects.indexOf(1) > -1
            //     this.normalProjects = this.normalProjects.filter((item) => item !== 3 && item !== 1)
            //     // 将体围挪到第一位 此时体围代表无电流营养分析
            //     if (isFlag) {
            //         // 产康模式下 配置了体围和体重测量项目才能显示无电流营养分析
            //         this.normalProjects.splice(0, 0, 3)
            //     }
            // }
            window.logger.info('可测量项目1' + JSON.stringify(this.normalProjects))
        },
        // 按键样式处理
        isNotLeftKey() {
            const btnList = [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ]
            // 显示确认键
            console.log(`未测量项目${this.measureInfo.unScanItems}`)
            var unScanItems = this.measureInfo.unScanItems
            const itemPatten = {
                3: 'shape',
                2: 'shape',
                4: 'shoulder',
                1: 'weight'
            }
            let errPatten = []
            unScanItems.forEach((item) => {
                // 项目异常
                // console.log(`为测量项目${item}`)
                if (!this.deviceUsable[itemPatten[item]]) {
                    errPatten.push(item)
                }
            })
            // 异常项目也不再展示之列，所以异常项目刨除
            unScanItems = unScanItems.filter((t) => !errPatten.includes(t))
            if (unScanItems && unScanItems.length > 1) {
                btnList.push(
                    {
                        btn: 'add',
                        msg: '加'
                    },
                    {
                        btn: 'sub',
                        msg: '减'
                    }
                )
            }
            if (this.styleType != 0) {
                btnList.push({
                    btn: 'switch',
                    msg: '电源'
                })
            }
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList
            })
        },
        // 触屏跳转
        isTouchScreen(type) {
            if (this.isClickStatus) {
                return
            } else {
                this.isClickStatus = true
            }
            this.styleType = type
            if (type === 1) {
                // 仅肩部可以测量
                if (!this.deviceUsable.shape && this.deviceUsable.shoulder) {
                    this.touchScreenTimer('ButtonSelect', { startupType: 2, standUp: true })
                } else {
                    if (this.deviceUsable.shape) {
                        this.touchScreenTimer('ShapeGuide')
                    } else {
                        this.touchScreenTimer('WeightGuide', { canSkip: true })
                    }
                    // 体态测量
                }
                // // 直接进入体围
                // if (!this.deviceUsable.weight) {
                //     this.touchScreenTimer('GirthGuide')
                // } else {
                //     // 体重测量
                //     this.touchScreenTimer('WeightGuide')
                // }
            } else if (type === 2) {
                if (!this.isStandardMode) {
                    this.touchScreenTimer('WeightGuide')
                } else {
                    this.touchScreenTimer('GirthGuide')
                }
            } else if (type === 4) {
                // 体态测量
                this.touchScreenTimer('WeightGuide', { canSkip: true })
            } else {
                this.touchScreenTimer('ButtonSelect', { startupType: 2, standUp: true })
            }
        },
        // 触屏时间函数
        touchScreenTimer(page, query) {
            const setTimer = setInterval(() => {
                this.$changeViewPage(page, query)
                this.type = 0
                window.clearInterval(setTimer)
            }, 300)
        },
        // 倒计时结束事件
        cutDownOver() {
            this.$changeViewPage('Home')
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (this.audios.indexOf(audioId) > -1) {
                // 体态评估正常 发起地毯站人检测
                if (this.detectUsable) {
                    this.detectRequested = true
                    // 启动手势Ipose检测
                    this.$algClient.startGestureIposeDetect()
                }
            }
        },
        stopGestureDetectHandler(type) {
            // 停止手势Ipose检测
            this.$algClient.stopGestureIposeDetect()
            if (this.startType === 1) {
                // if (!this.isStandardMode) {
                //     this.touchScreenTimer('WeightGuide')
                // } else {
                this.touchScreenTimer('GirthGuide')
                // }
                // 进入体围测量页
                // if (!this.deviceUsable.weight) {
                //     this.touchScreenTimer('GirthGuide') this.sendScanType()
                // } else {
                //     // 体重测量
                //     this.touchScreenTimer('WeightGuide')
                // }
            } else if (this.startType === 2) {
                // 进入体态测量页
                this.$changeViewPage('ShapeGuide')
            } else if (this.startType === 3) {
                // store中保存本次测量启动方式(按键启动)
                // this.$store.commit('CHANGE_MEASURE_INFO', {
                //     startMode: 1
                // })
                // 进入项目选择-动态实验室
                if (type) return
                this.$changeViewPage('ButtonSelect', { startupType: 2, standUp: true })
            } else if (this.startType === 4) {
                // 进入肩部测量页
                this.$changeViewPage('ShoulderPrepare')
            }
        },
        // 按键事件
        btnClick(btnType) {
            console.log(`按键状态${btnType}`)
            // 上
            if (btnType === 1) {
                // 测量数组下标
                if (this.btnIndex === 1) {
                    if (this.isShowNutrition && this.isError) {
                        this.btnIndex = this.normalProjects.length - 1
                    } else {
                        this.btnIndex = this.normalProjects.length
                    }
                } else if (this.btnIndex === 0) {
                    this.btnIndex = 1
                } else {
                    this.btnIndex--
                }
                this.handleBtnType(this.normalProjects[this.btnIndex - 1])
                // 下
            } else if (btnType === 2) {
                let normalProjectsSum = this.normalProjects.length
                if (this.isShowNutrition && this.isError) {
                    normalProjectsSum = normalProjectsSum - 1
                }
                if (this.btnIndex === normalProjectsSum) {
                    this.btnIndex = 1
                } else {
                    this.btnIndex++
                }
                this.handleBtnType(this.normalProjects[this.btnIndex - 1])
                // 确定
            } else if (btnType === 3) {
                if (this.styleType !== 0) {
                    const cartType = this.normalProjects[this.btnIndex - 1]
                    // 体围测量 btnType 为未测量类型
                    if (cartType === 2) {
                        // 体态测量
                        this.touchScreenTimer('ShapeGuide')
                    } else if (cartType === 3) {
                        // 直接进入体围
                        if (!this.isStandardMode) {
                            this.touchScreenTimer('WeightGuide')
                        } else {
                            this.touchScreenTimer('GirthGuide')
                        }

                        // 肩部
                    } else if (cartType === 4) {
                        this.touchScreenTimer('ShoulderPrepare', { startupType: 2 })
                    } else if (cartType === 1) {
                        // 体重测量
                        this.touchScreenTimer('WeightGuide', { canSkip: true })
                    }
                    if (this.detectRequested) {
                        // 取消地毯站人检测
                        this.$algClient.stopGestureIposeDetect()
                    }
                }
            }

            // 确认
            // if (btnType === 3) {
            //     // 不显示确认按钮时，按下确认键不处理
            //     if (this.isShowCheckButton) {
            //         // 已经发送站人检测但未响应站人结果时
            //         if (this.detectRequested) {
            //             this.startType = 2
            //             // 取消地毯站人检测
            //             this.stopGestureDetectHandler()
            //         } else {
            //             // store中保存本次测量启动方式(按键启动)
            //             this.$store.commit('CHANGE_MEASURE_INFO', {
            //                 startMode: 1
            //             })
            //             // 进入项目选择-动态实验室
            //             // this.$changeViewPage('ButtonSelect', { startupType: 2 })
            //         }
            //     }
            // }
        },
        // 按钮下标样式处理
        handleBtnType(index) {
            console.log(`默认下标${index}`)
            if (index === 2) {
                // 体态
                this.styleType = 1
            } else if (index === 3) {
                // 身体成分测量
                this.styleType = 2
            } else if (index === 4) {
                // 仅肩部可以测量
                if (!this.deviceUsable.shape) {
                    this.styleType = 1
                } else {
                    // 肩部
                    this.styleType = 3
                }
            } else if (index === 1) {
                window.logger.info(
                    '当前异常项目数量' +
                        this.errProjects.length +
                        ' 初始测量项目数量=' +
                        this.initMesInfo.unScanItems.length
                )
                if (this.errProjects.length === this.initMesInfo.unScanItems.length - 1) {
                    // 除体重外全部测量项目异常，则体重测量出现在第一个
                    this.styleType = 1
                } else {
                    this.styleType = 4
                }
            }
            this.isNotLeftKey()
        },
        depthCamera() {
            console.log('相机异常')
            this.$store.commit('ADD_DEVICE_ERROR', 3)
        },
        weightModuleAbnormal() {
            this.$store.commit('ADD_DEVICE_ERROR', 5)
            // 触发全局事件
            EventBus.$emit('EventAction', 'HardwareStatusEvent', { type: 1, status: false, detail: '体重获取超时' })
        },
        buttonState() {
            console.log(`当前状态${this.normalProjects.length} ${this.btnIndex}`)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.title-before {
    content: '';
    width: 12px;
    position: absolute;
    left: -40px;
    top: 10px;
    height: 60px;
    z-index: 10;
    background-color: #045cf5;
}

.scan-project-guide {
    padding-top: 408px;

    .main-title {
        font-size: 64px;
        top: 300px;
        position: relative;
        text-align: center;
    }
    .top-tips {
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        height: 56px;
        text-align: center;
        margin-bottom: 52px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 32px;
        color: #ff791f;
        line-height: 56px;
        font-style: normal;
    }

    .top-tips2 {
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        height: 56px;
        text-align: center;
        margin-bottom: 12px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 32px;
        color: #ff791f;
        line-height: 56px;
        font-style: normal;
    }
    .shape-project {
        margin: 0 auto 24px;
        width: 960px;
        height: 528px;
        border-radius: 32px;
        display: flex;
        background: @color-background;
        // border: 8px solid #367cf6;
        // box-shadow: 0px 2px 44px 0px rgba(54, 124, 246, 0.5);
        box-sizing: border-box;

        .left {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 480px;
            padding: 0 80px;
            .title {
                font-size: 64px;
                // margin: 100px 0;
                margin-top: 100px;
                position: relative;
                color: #ffffff;

                &::before {
                    .title-before();
                    background-color: #367cf6;
                }
            }

            .describe {
                color: #cccccc;
                font-size: 48px;
                line-height: 1.2;
                // margin: 0;
                font-family: OPPOSansR;
                // position: absolute;
                // top: 640px;

                span {
                    font-family: OPPOSansR;
                }
            }

            .describe-msg {
                width: 525px;
            }
        }

        .right {
            display: flex;
            align-items: center;
            flex: 1;

            img {
                height: 422px;
                position: relative;
                left: 40px;
            }
        }
    }
    &.de {
        .left .title {
            margin-top: 50px !important;
            width: 54.3vw !important;
        }
        .left .describe {
            top: 680px !important;
            line-height: 1.3 !important;
        }
    }
    &.es,
    &.tr,
    &.fr,
    &.pt,
    &.it {
        .left .describe {
            top: 680px !important;
            line-height: 1.1 !important;
        }
    }

    .mass-project {
        display: flex;
        width: 960px;
        height: 408px;
        margin: 0 auto 24px;
        background: @color-background;
        border-radius: 32px;
        border: 4px;
        box-sizing: border-box;
        padding: 45px 40px 45px 80px;
        position: relative;
        justify-content: space-between;

        &.frame {
            height: 648px;
            // border: 8px solid #367cf6;
            // box-shadow: 0px 2px 44px 0px rgba(54, 124, 246, 0.5);
            box-sizing: border-box;

            .left .title {
                margin-bottom: 64px;
            }
        }

        .left {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            // padding: 80px;
            justify-content: center;

            .title {
                font-size: 64px;
                margin-bottom: 30px;
                position: relative;
                color: #ffffff;

                &::before {
                    .title-before();
                }
                img {
                    position: relative;
                    top: 10px;
                    width: 160px;
                    height: 58px;
                }
            }

            .describe {
                font-size: 48px;
                line-height: 1.2;
                margin: 0;
                font-family: OPPOSansR;
                color: #cccccc;
            }
        }

        .right {
            display: flex;
            justify-content: center;
            align-items: center;
            // flex: 1;
            width: 328px;

            img {
                width: 254px;
            }
        }
    }

    .test-project {
        display: flex;
        align-items: center;
        width: 960px;
        // height: 185px;
        margin: 0 auto 24px;
        background: @color-background;
        border-radius: 32px;
        border: 4px;
        box-sizing: border-box;
        position: relative;
        padding: 45px 40px 45px 80px;
        justify-content: space-between;

        .title {
            font-size: 64px;
            // margin-bottom: 30px;
            position: relative;
            color: @color-white;

            &::before {
                .title-before();
            }
        }

        .btn-tip {
            margin: 0;

            span {
                display: flex;
                align-items: center;
            }

            img {
                width: 56px;
            }
        }

        .describe {
            display: flex;
            align-items: center;
            font-size: 48px;
            // line-height: 2;
            margin: 0;
            font-family: OPPOSansR;
            color: #cccccc;
            text-align: right;
        }
    }

    .tips {
        &-wrap {
            width: 960px;
            padding: 24px 0;
            margin: 26px 60px 0;
            // border-top: 1px solid #565656;
            // border-bottom: 1px solid #565656;
            display: flex;

            img {
                width: 96px;
                height: 96px;
                margin-right: 23px;
                vertical-align: middle;
            }
        }

        &-main {
            position: relative;
            margin: 0 55px 0 0;

            h3 {
                margin: 0px;
                line-height: 72px;
                text-align: left;
                font-weight: normal;
                font-family: OPPOSansM;
                font-size: 48px;
                color: #c9c9c9;
            }

            p {
                margin: 16px 0 0;
                font-size: 36px;
                color: #9e9e9e;
            }
        }
    }
    &.ru {
        .shape-project {
            .left {
                width: 520px;
                padding: 0 60px;
                .title {
                    margin-top: 30px;
                    line-height: 1.2;
                }
                .describe {
                    line-height: 1.2;
                }
            }
        }

        .mass-project {
            height: 350px;
            .left {
                .title {
                    line-height: 1.1;
                }
            }
        }
        .test-project {
            .title {
                line-height: 1.1;
            }
        }
    }

    &.el {
        .shape-project {
            .left {
                width: 520px;
                padding: 0 60px;
                .title {
                    margin-top: 40px;
                    line-height: 1.2;
                }
                .describe {
                    line-height: 1.2;
                    margin: 30px 0 0 0;
                }
            }
        }

        .mass-project {
            height: 370px;
            .left {
                .title {
                    line-height: 1;
                }

                .describe {
                    line-height: 1;
                    margin: 0;
                }
            }
        }
    }

    &.hu {
        .shape-project {
            .left {
                width: 520px;
                padding: 0 60px;
                .title {
                    margin-top: 30px;
                    line-height: 1.2;
                }
                .describe {
                    line-height: 1.2;
                }
            }
        }
    }
}
</style>
