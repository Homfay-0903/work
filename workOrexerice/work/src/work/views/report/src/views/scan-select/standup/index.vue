<template>
    <!-- vapro5 版本有3必有1模块-->
    <div :class="['scan-project-guide', $i18n.locale]">
        <div class="over-box" v-if="!pageStatus"></div>
        <!-- <div style="margin-top: 60px">
            <button @click="depthCamera()">鱼眼相机异常</button>
            <button @click="weightModuleAbnormal()">体重模块异常</button>
            <button @click="buttonState()">鱼眼相机恢复</button>
        </div> -->
        <div v-if="!isStandardMode" class="top-tips">{{ $t('home.top-tip') }}</div>
        <div v-if="settingInfo.Athlete" class="top-tips2">{{ $t('Athlete.tips') }}</div>
        <div
            @touchstart="isTouchScreen(0)"
            :class="['shape-project', btnIndex === 0 ? 'finish-click' : '']"
            v-if="showItem(0)"
        >
            <div class="left">
                <div class="title">
                    {{ settingInfo.combineMeasureEnable && settingInfo.triMode ? '身体评估' : $t(showItemName(0)) }}
                    <img
                        :src="btnIndex === 1 ? require('@img/wudianliu-s.png') : require('@img/wudianliu.png')"
                        alt=""
                        v-if="showNutritionTips(0)"
                    />
                </div>
                <p class="mass-tips" v-if="showMassTips(0)">{{ $t('home.mass-tips') }}</p>
                <p class="describe describe-msg">
                    <!-- 体围 + 体态 + 体重 -->
                    <span v-if="settingInfo.combineMeasureEnable && settingInfo.triMode">
                        了解您的身体成分、围度 及体态
                    </span>
                    <i18n v-else path="item-select.ti-tai-ping-gu_desc[0]" tag="span">
                        <br place="item" />
                    </i18n>
                </p>
                <p class="mass-tips" v-if="showMassAndGrithTips()" style="margin-top: 0px">
                    {{
                        settingInfo.combineMeasureEnable && settingInfo.triMode
                            ? '*紧身服 | 站立 | 静止2 秒'
                            : $t('home.mass-tips')
                    }}
                </p>
            </div>
            <div class="right">
                <img src="@img/select/model1mm_t.png" v-if="deviceInfo.teenagerIsOpen" />
                <img
                    src="@img/select/model1mm.png"
                    v-else-if="deviceInfo.deviceType === 5 && deviceInfo.healthPackageEnable === 2"
                />
                <img src="@img/select/model1mm.png" v-else-if="deviceInfo.deviceType === 5" />
                <img src="@img/select/model1.png" v-else />
            </div>
        </div>
        <div
            @touchstart="isTouchScreen(1)"
            :class="[{ 'mass-project': true, frame: !deviceUsable.shape }, btnIndex === 1 ? 'finish-click' : '']"
            v-if="showItem(1)"
        >
            <div class="left">
                <div class="title">
                    {{ $t(showItemName(1)) }}
                    <img
                        :src="btnIndex === 1 ? require('@img/wudianliu-s.png') : require('@img/wudianliu.png')"
                        alt=""
                        v-if="showNutritionTips(1) && settingInfo.combineMeasureEnable && settingInfo.triMode"
                    />
                </div>
                <p
                    class="mass-tips"
                    v-if="showNutritionTips(1) && settingInfo.combineMeasureEnable && settingInfo.triMode"
                >
                    *推荐孕期使用
                </p>
                <p class="mass-tips" v-else-if="showMassTips(1)">{{ $t('home.mass-tips') }}</p>
                <p class="mass-tips1" v-else>{{ $t('home.mass-tips') }}</p>
            </div>
            <div class="right" v-if="!settingInfo.combineMeasureEnable && !settingInfo.triMode">
                <img
                    src="@img/select/girth2.png"
                    v-if="deviceInfo.deviceType === 5 && deviceInfo.healthPackageEnable === 2"
                />
                <img src="@img/select/titai.png" v-else-if="deviceInfo.deviceType === 5" />
                <img src="@img/select/ti_tai.png" v-else />
            </div>
        </div>
        <div
            :class="['test-project', btnIndex === 2 ? 'finish-click' : '']"
            @touchstart="isTouchScreen(2)"
            v-if="showItem(2) && this.deviceInfo.healthPackageEnable !== 2"
        >
            <div :class="isStandardMode ? 'content' : 'content1'">
                <div class="title">
                    {{ $t(showItemName(2)) }}
                    <img
                        :src="btnIndex === 2 ? require('@img/wudianliu-s.png') : require('@img/wudianliu.png')"
                        alt=""
                        v-if="showNutritionTips(2)"
                    />
                </div>
                <p class="mass-tips" v-if="showMassTips(2)">*推荐孕期使用</p>
            </div>

            <!-- <p class="btn-tip">
                <i18n path="item-select.dong-tai-shi-yan-shi_desc_m30" tag="span">
                    <img src="@img/error/switch.png" />
                </i18n>
            </p> -->
        </div>
        <!-- 体重测量 -->
        <div
            v-if="showItem(3)"
            :class="['test-project', btnIndex === 3 ? 'finish-click' : '']"
            @touchstart="isTouchScreen(3)"
        >
            <div class="title">{{ $t(showItemName(3)) }}</div>
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
    name: 'StandUpSelectPro5',
    components: {
        CutDownLoad
    },
    data() {
        return {
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
                'noDianliu',
                'shutDownInUse'
            ],
            // 手势样式区块 1 体态 2 身体 3 肩部 4体重
            styleType: 0,
            // 按钮测量位置
            btnIndex: 0,
            // 正常项目信息数组
            normalProjects: [],
            isClickStatus: false,
            // 自定表头
            title: {
                prev: 'navigation-bar.shou-ye',
                title: 'navigation-bar.qing-an-tu-shi-dong-zuo-jin-ru-ce-liang-xiang-mu',
                icon: false,
                leave: true
            },
            pageStatus: false
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
        ...mapGetters(['deviceUsable', 'standPeople', 'measureInfo', 'settingInfo', 'initMesInfo', 'deviceInfo']),
        // 测量模式  标准 or 产康
        isStandardMode() {
            return this.settingInfo.deviceMode === 2
        },
        audiosMap() {
            return {
                1234: this.isStandardMode ? 'StandardModeProject' : 'PostpartumCareModelProject',
                1: 'Singlebodycomponent',
                4: 'selectGuideOnlyShd',
                123: this.isStandardMode ? 'projectStart' : 'projectCK',
                2: this.isStandardMode ? 'projectError' : 'projectCKWeightError',
                23: this.isStandardMode ? 'projectStart' : '',
                13:
                    this.settingInfo.combineMeasureEnable && this.settingInfo.triMode
                        ? 'isFast'
                        : 'singlebodycomponentAndGrith',
                3: 'isOnlyGirgh'
            }
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
                errorArr.push(
                    this.deviceInfo.deviceType === 5
                        ? this.settingInfo.deviceMode === 2
                            ? '身体成分围度测量'
                            : this.deviceInfo.healthPackageEnable === 2
                            ? '身体成分围度测量'
                            : '无电流营养分析和身体成分围度测量'
                        : this.$t('common.ti-zhong-ce-liang')
                )
            }
            if (!this.deviceUsable.shoulder && this.settingInfo.dynamicLaboratory && initUnscan.indexOf(4) > -1) {
                errorArr.push(this.$t('common.dong-tai-shi-yan-shi'))
            }
            return errorArr
        },
        // 产康模式并且可测量无电流营养分析
        isShowNutrition() {
            const isFlag = this.initMesInfo.unScanItems.indexOf(3) > -1 && this.initMesInfo.unScanItems.indexOf(1) > -1
            return !this.isStandardMode && isFlag
        },
        // vapro3 无电流营养体重异常则不显示
        isError() {
            return this.deviceUsable.weight
        },
        audioId() {
            if (this.deviceInfo.deviceType === 5) {
                const project = JSON.parse(JSON.stringify(this.normalProjects))
                project.sort((a, b) => a - b)
                const key = project.join('')
                const audio = this.audiosMap[key]
                window.logger.info(`当前测量项目${project} ---${this.normalProjects} -- ${key} -- ${audio}`)
                return audio
            }

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
        // 是否需要发起站人检测 体态正常或只剩肩部时
        detectUsable() {
            return this.deviceUsable.shape || (this.deviceUsable.shoulder && this.errProjects.length === 2)
        }
    },
    created() {
        console.log(`语音文件${JSON.stringify(Object.values(this.audiosMap))}`)
        this.$emit('on-audio-event', 'playAudio', 'btnEffect')
        this.updateNormalProjects()
        if (
            this.settingInfo.combineMeasureEnable &&
            this.settingInfo.triMode &&
            this.normalProjects.length === 1 &&
            this.normalProjects.includes(3)
        ) {
            window.logger.info(`进入了单个体围测量项目${JSON.stringify(this.normalProjects)}`)
            if (this.$route.params.wecomePage) {
                this.$changeViewPage('ZhunBei', { typeSort: 1 })
            } else {
                this.$changeViewPage('Home')
            }
            // 执行相关逻辑
            return
        }
        this.pageStatus = true
        // 监听检测结果
        this.isNotLeftKey()
        this.$store.commit('CHANGE_SCAN_STATE', true)
    },
    mounted() {
        EventBus.$on('EventAction', async (type, result) => {
            window.logger.info(`监听到消息： ${type}    ${result} `)
            if (type === 'GestureIposeResult' && result === 1) {
                // 如果体围正常则启动体围否则为动态实验室
                if (
                    this.normalProjects.length === 2 &&
                    this.normalProjects.includes(1) &&
                    this.normalProjects.includes(3)
                ) {
                    this.btnIndex = 0
                } else {
                    const startType = this.deviceUsable.shape ? 2 : 4
                    this.btnIndex = this.normalProjects.findIndex((item) => item == startType)
                }
                window.logger.info(`启动测量： ${this.btnIndex} `)
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
        // 倒计时结束事件
        cutDownOver() {
            this.$changeViewPage('Home')
        },
        // 更新正常项目信息数组
        updateNormalProjects() {
            this.normalProjects = []
            let status =
                this.deviceInfo.deviceType === 5
                    ? [
                          this.deviceUsable.shape,
                          this.deviceUsable.shape,
                          this.deviceUsable.mass,
                          this.deviceUsable.shoulder
                      ]
                    : [
                          this.deviceUsable.shape,
                          this.deviceUsable.shape,
                          this.deviceUsable.shoulder,
                          this.deviceUsable.weight
                      ]
            // || 指的是vapro3 无电流转台西安异常拔掉鱼眼相机跳转到异常报告页面 || apro5 鱼眼相机异常直接跳转 error
            if (
                this.errProjects.length === this.initMesInfo.unScanItems.length ||
                (this.isShowNutrition &&
                    !this.deviceUsable.mass &&
                    !this.deviceUsable.shape &&
                    !this.deviceUsable.shoulder) ||
                (this.deviceInfo.deviceType === 5 && !this.deviceUsable.shape && !this.deviceUsable.gesture)
            ) {
                // 所有项目都异常
                this.$changeViewPage('DeviceError')
            }
            const allProject = this.deviceInfo.deviceType === 5 ? [2, 1, 3, 4] : [2, 3, 4, 1]
            // vapro5 体重， 无电流， 体围 相互影响
            if (this.deviceInfo.deviceType === 5) {
                if (!this.deviceUsable.mass || !this.deviceUsable.weight) {
                    status = [this.deviceUsable.shape, false, false, this.deviceUsable.shoulder]
                }
            }
            status.forEach((item, idx) => {
                if (item) {
                    const ScanItems = allProject[idx]
                    const index = this.initMesInfo.unScanItems.indexOf(ScanItems)
                    if (ScanItems && index > -1 && ((ScanItems != 1 && this.isStandardMode) || !this.isStandardMode)) {
                        this.normalProjects.push(ScanItems)
                    }
                }
            })
            // vapro3的体重测量不能单独存在， 及测量项目只有1时，无测量项目。产康模式下不显示体重测量
        },
        // 测量项目是否显示
        showItem(index) {
            if (this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2) {
                // vapro5  1和3是一个测量项
                return this.checkOneThreeAndReturnLengthMinusOne(this.normalProjects) > index
            }
            return this.normalProjects.length > index
        },
        // 测量项目名称
        showItemName(index) {
            window.logger.info(`测量名称顺序${JSON.stringify(this.normalProjects)} ${index}`)
            window.logger.info(
                '测量项目配置this.deviceInfo.healthPackageEnable',
                this.deviceInfo.healthPackageEnable,
                typeof this.deviceInfo.healthPackageEnable
            )
            const projectName =
                this.deviceInfo.healthPackageEnable === 2 || this.isStandardMode
                    ? 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
                    : 'item-select.wu-dian-liu'
            const names =
                this.deviceInfo.deviceType === 5
                    ? this.deviceInfo.healthPackageEnable === 2
                        ? [
                              'item-select.shen-ti-cheng-fen-ce-liang-wei-du',
                              'item-select.ti-tai-ping-gu',
                              projectName,
                              'item-select.dong-tai-shi-yan-shi'
                          ]
                        : [
                              'item-select.shen-ti-cheng-fen-ce-liang-wei-du',
                              'item-select.ti-tai-ping-gu',
                              projectName,
                              'item-select.dong-tai-shi-yan-shi'
                          ]
                    : [
                          'common.ti-zhong-ce-liang',
                          'item-select.ti-tai-ping-gu',
                          projectName,
                          'item-select.dong-tai-shi-yan-shi'
                      ]
            if (index < 0 || index > this.normalProjects.length) {
                return ''
            }
            window.logger.info(`测量名称${JSON.stringify(names)}  ${index}`)
            return names[this.normalProjects[index] - 1]
        },
        // 显示无电流提示
        showNutritionTips(index) {
            // 产康模式 并且体围测量
            return !this.isStandardMode && this.normalProjects[index] === 3
        },
        // 产康模式下 体成分测量显示体成分提示
        showMassTips(index) {
            console.log(`判断是否显示体成分提示${!this.isStandardMode}  ${this.normalProjects[index] === 3}`)
            return !this.isStandardMode && this.normalProjects[index] === 3
        },
        showMassAndGrithTips() {
            // vapro5 体成分体围 单独测量 this.normalProjects = [1, 3] 时显示文案
            if (
                this.normalProjects.length === 2 &&
                this.normalProjects.includes(1) &&
                this.normalProjects.includes(3)
            ) {
                return true
            }
            return false
        },
        // 点击测量项目
        isTouchScreen(index) {
            this.btnIndex = index
            this.touchViewChangePage(this.normalProjects[index])
        },
        touchViewChangePage(projectIndex) {
            switch (projectIndex) {
                case 1:
                    // 体重 或 体成分
                    this.touchScreenTimer('ZhunBei', { typeSort: projectIndex })
                    // if (this.deviceInfo.deviceType === 5) {
                    //     this.touchScreenTimer('MassConfirm')
                    // } else {
                    //     this.touchScreenTimer('WeightGuide', { canSkip: true })
                    // }
                    break
                case 2:
                    this.touchScreenTimer('ShapeGuide')
                    break
                case 3:
                    {
                        // if (!this.isStandardMode) {
                        // this.touchScreenTimer('ZhunBei', { typeSort: projectIndex })
                        // this.$changeViewPage('WeightGuide', { canSkip: true, typeSort: projectIndex })
                        if (this.isStandardMode) {
                            this.touchScreenTimer('ZhunBei', { typeSort: 1 })
                        } else {
                            this.touchScreenTimer('WeightGuide', {
                                canSkip: true,
                                typeSort: projectIndex
                            })
                        }
                        // } else {
                        //     this.touchScreenTimer('GirthGuide')
                        // }
                    }
                    break
                case 4:
                    this.touchScreenTimer('ButtonSelect', { startupType: 2, standUp: true })
                    break
                default:
                    break
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
            if (this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2) {
                unScanItems = unScanItems.filter((item) => item !== 3)
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    unScanItems
                })
            }
            console.log(`未测量项目${unScanItems}`)
            console.log(`正常项目${this.normalProjects}`)
            const itemPatten =
                this.deviceInfo.deviceType === 5
                    ? {
                          3: 'shape',
                          2: 'shape',
                          1: 'mass',
                          4: 'shoulder'
                      }
                    : {
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
        // 按键事件
        btnClick(btnType) {
            console.log(`按键事件 ${btnType} ${this.btnIndex}`)
            switch (btnType) {
                case 1:
                    // 上
                    if (this.deviceInfo.healthPackageEnable === 2) {
                        this.btnIndex = this.btnIndex === 0 ? this.normalProjects.length - 2 : this.btnIndex - 1
                    } else {
                        this.btnIndex = this.btnIndex === 0 ? this.normalProjects.length - 1 : this.btnIndex - 1
                    }
                    break
                case 2:
                    // 下
                    if (this.deviceInfo.healthPackageEnable === 2) {
                        this.btnIndex = this.btnIndex === this.normalProjects.length - 2 ? 0 : this.btnIndex + 1
                    } else {
                        this.btnIndex = this.btnIndex === this.normalProjects.length - 1 ? 0 : this.btnIndex + 1
                    }
                    break
                case 3:
                    this.touchViewChangePage(this.normalProjects[this.btnIndex])
                    break
                default:
                    break
            }
        },
        // 语音结束
        audioEndCallback(audioId) {
            window.logger.info(`varpro5 语言播放结束： ${audioId}    ${this.audios}   ${this.audiosMap}`)
            if (this.audios.indexOf(audioId) > -1 || Object.values(this.audiosMap).indexOf(audioId) > -1) {
                window.logger.info('开启站人检测')
                // 体态评估正常 发起地毯站人检测
                if (this.detectUsable) {
                    this.detectRequested = true
                    // 启动手势Ipose检测
                    this.$algClient.startGestureIposeDetect()
                }
            }
        },
        stopGestureDetectHandler() {
            // 停止手势Ipose检测
            this.$algClient.stopGestureIposeDetect()
            this.touchViewChangePage(this.normalProjects[this.btnIndex])
        },
        depthCamera() {
            console.log('相机异常')
            this.$store.commit('ADD_DEVICE_ERROR', 3)
        },
        buttonState() {
            this.$store.commit('REMOVE_DEVICE_ERROR', 3)
        },
        checkOneThreeAndReturnLengthMinusOne(arr) {
            let hasOne = false
            let hasThree = false

            for (const num of arr) {
                if (num === 1) hasOne = true
                if (num === 3) hasThree = true
                // 提前退出循环优化
                if (hasOne && hasThree) break
            }
            return hasOne && hasThree ? arr.length - 1 : arr.length
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
    .over-box {
        position: fixed;
        top: 98px;
        z-index: 9999;
        width: 1080px;
        background: #000000;
        height: 1920px;
    }
    padding-top: 408px;

    .main-title {
        font-size: 64px;
        top: 300px;
        position: relative;
        text-align: center;
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
    .top-tips {
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        height: 56px;
        text-align: center;
        margin-bottom: 20px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 32px;
        color: #ff791f;
        line-height: 56px;
        font-style: normal;
    }
    .mass-tips,
    .mass-tips1 {
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 40px;
        color: #ff791f;
        // line-height: 56px;
        font-style: normal;
    }
    .mass-tips1 {
        font-size: 40px;
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
            width: 520px;
            padding: 0 80px;

            .title {
                font-size: 64px;
                // margin: 100px 0;
                margin-top: 120px;
                position: relative;
                color: #ffffff;

                &::before {
                    .title-before();
                    background-color: #367cf6;
                }
                img {
                    width: 160px;
                    height: 58px;
                }
            }

            .describe {
                color: #cccccc;
                font-size: 48px;
                line-height: 1.5;
                // margin: 0;
                font-family: OPPOSansR;
                // position: absolute;
                // top: 640px;
                height: 120px !important;

                span {
                    font-family: OPPOSansR;
                }
            }

            .describe-msg {
                width: 530px;
            }
        }

        .right {
            display: flex;
            align-items: center;
            flex: 1;

            img {
                height: 528px;
                position: relative;
                left: 10px;
            }
        }
    }
    &.de {
        .left .title {
            margin-top: 90px !important;
        }
    }
    &.es,
    &.tr,
    &.fr,
    &.pt,
    &.de {
        .left .describe {
            top: 680px !important;
            line-height: 1.1 !important;
        }
    }

    .mass-project {
        display: flex;
        width: 960px;
        height: 336px;
        margin: 0 auto 24px;
        background: @color-background;
        border-radius: 32px;
        border: 4px;
        box-sizing: border-box;
        padding: 72px 40px 45px 80px;
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
                // margin-bottom: 30px;
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
                line-height: 1.5;
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
            width: 308px;

            img {
                width: 234px;
            }
        }
    }

    .test-project {
        display: flex;
        align-items: center;
        width: 960px;
        height: 192px;
        margin: 0 auto 24px;
        background: @color-background;
        border-radius: 32px;
        border: 4px;
        box-sizing: border-box;
        position: relative;
        padding: 45px 40px 45px 80px;
        justify-content: space-between;
        .content,
        .content1 {
            display: flex;
            flex-direction: column;
            .title {
                img {
                    position: relative;
                    top: 10px;
                    width: 160px;
                    height: 58px;
                }
            }
        }
        .content1 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-top: 75px;
            /deep/ .mass-tips {
                position: relative;
                top: -35px;
                font-size: 40px;
            }
        }
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
}
</style>
