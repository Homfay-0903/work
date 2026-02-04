<!--
 * @Description: 继续选择页-手势模式-默认手势，如果手势服务异常则使用按钮模式
 * @Author: gaoyuanyuan
 * @Date: 2021-05-06 15:41:56
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-29 23:47:29
-->
<template>
    <div class="continue-scan">
        <div class="scan-project animated fast fadeIn">
            <div v-if="settingInfo.Athlete" class="top-tips2">{{ $t('Athlete.tips') }}</div>
            <scan-project-card
                @on-gesture-feedback="handleGesture"
                @eventType="isTouchScreen"
                :activePro="activePro"
                :styleType="1"
                :projectList="projectList"
                :available="available"
                :isAbleClick="isAbleClick"
                :isfinishClick="isfinishClick"
            ></scan-project-card>
            <div v-if="!isStandardMode" class="top-tips">{{ $t('home.top-tip') }}</div>
        </div>
        <p class="jumpTxt" v-show="activeLow < unScanLen - 1 && !isJump" @touchend="handleJump">
            {{ $t('click-skip') }}
        </p>
        <cut-down-load ref="cutDown" @cut-down-over="cutDownOver" :duration="60" :suffixType="1"></cut-down-load>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ScanProjectCard from '@/components/ScanProjectCard.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'

export default {
    name: 'TouchContinue',
    components: {
        ScanProjectCard,
        CutDownLoad
    },
    data() {
        return {
            // 高亮的项目 手势默认默认不高亮任何项目
            activePro: 0,
            // 已经按下后不允许再次点击
            btnDisabled: false,
            projectList: [],
            projectItems: [
                {
                    // 标题
                    title: this.$t('item-select.ti-tai-ping-gu'),
                    // 内容
                    content: this.$t('item-select.ti-tai-ping-gu_desc[1]'),
                    // 按钮样式图标
                    listIcon: 'item_shape',
                    active: 2
                },
                {
                    // 标题
                    title: this.$t('item-select.ti-wei-ce-liang'),
                    // 内容
                    content: this.$t('item-select.ti-wei-ce-liang_desc'),
                    // 按钮样式图标
                    listIcon: 'item_mass',
                    active: 3
                },
                // 手势模式取消动态实验室二级菜单直接显示肩部功能
                {
                    // 标题
                    title: this.$t('item-select.jian-bu-gong-neng'),
                    // 内容
                    content: this.$t('item-select.jian-bu-gong-neng_desc'),
                    // 按钮样式图标
                    listIcon: 'item_shoulder',
                    // 测量项
                    active: 4
                },
                {
                    // 标题
                    title: this.$t('item-select.ti-zhong-ce-liang'),
                    // 内容
                    content: this.$t('item-select.ti-zhong-ce-liang-desc'),
                    // 按钮样式图标
                    listIcon: 'item_weight',
                    active: 1
                }
            ],
            // 引导语音重复播放计时器
            repeatTimer: null,
            // 引导语音是否已重复播放
            isRepeatPlay: false,
            // 页面跳转定时器
            pageJumpTimer: null,
            // 手势识别是否可用
            available: true,
            // 底部按钮控制
            isAbleClick: false,
            // 手势按钮点击状态
            isfinishClick: false,
            // 动态选择项目下标
            activeLow: 0,
            // 跳转
            isJump: false,
            delayTimer: null
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'deviceUsable', 'deviceInfo', 'initMesInfo']),
        // 手势是否可用 手势开启且手势功能正常下可用
        gestureUsable() {
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        },
        // 选择项目语音音频ID
        continueAudioId() {
            // 长按下可跳过语音
            console.log(`当前判断逻辑${this.deviceInfo.operationMode} ${this.activeLow} ${this.unScanLen}`)
            if (this.unScanLen > 1 && this.projectList[0].active !== this.unScanItems[1]) {
                if (this.deviceInfo.operationMode === 2) {
                    if (this.activeLow === this.unScanLen - 1) {
                        return 'continueScanGesture_a'
                    } else {
                        return 'continueScanGesture'
                    }
                } else {
                    return 'continueScanGesture_touch'
                }
                // 无长按跳过
            } else {
                if (this.deviceInfo.operationMode === 2) {
                    return 'continueScanGesture_a'
                } else {
                    return 'continueScanGesture_touch'
                }
            }
        },
        // 筛选未测量项
        unScanItems() {
            // 所有未测量项
            let unScanItems = this.measureInfo.unScanItems
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
            console.log('未测量项', unScanItems)
            unScanItems.forEach((item) => {
                // 项目异常
                // console.log(`为测量项目${item}`)
                if (!this.deviceUsable[itemPatten[item]]) {
                    errPatten.push(item)
                }
            })
            window.logger.info('异常测量项:', JSON.stringify(errPatten))
            // 再次筛选未异常的未测量项目
            unScanItems = unScanItems.filter((item) => {
                return errPatten.indexOf(item) === -1
            })
            // 重新设置未测量项目
            this.$store.commit('CHANGE_MEASURE_INFO', {
                unScanItems: unScanItems
            })
            return unScanItems
        },
        // 未测量项目长度
        unScanLen() {
            let length = this.unScanItems.length
            if (this.isShowNutrition && this.deviceInfo.deviceType !== 5) {
                // 产康模式下 未测量无电流则未测量项目减1
                length = length - 1
            }
            if (
                this.deviceInfo.deviceType === 5 &&
                this.deviceInfo.healthPackageEnable !== 2 &&
                this.isMeasure31 &&
                ((!this.measureInfo.isMeasureWd && this.measureInfo.isMeasureWu) ||
                    (this.measureInfo.isMeasureWd && !this.measureInfo.isMeasureWu))
            ) {
                length = length + 1
            }
            return length
        },
        // 已成功测量项目
        alreadyScan() {
            let currentScan = this.measureInfo
            let result = []
            window.logger.info('已成功测量项目', JSON.stringify(currentScan))
            if (this.deviceInfo.deviceType === 5) {
                if (this.measureInfo.isMeasureWu) {
                    result.push('无电流营养分析')
                }
                if (currentScan.shape && currentScan.shape.isMeasurement) {
                    result.push(this.$t('common.ti-tai-ping-gu'))
                }
                if (
                    (currentScan.mass &&
                        currentScan.mass.isMeasurement &&
                        currentScan.girth &&
                        currentScan.girth.isMeasurement) ||
                    this.measureInfo.isMeasureWd
                ) {
                    if (this.deviceInfo.healthPackageEnable === 2) {
                        result.push('身体成分围度测量')
                    } else {
                        result.push('身体成分围度')
                    }
                }
                if (currentScan.shoulder && currentScan.shoulder.active > 1) {
                    result.push(this.$t('common.jian-bu-gong-neng'))
                }
            } else if (currentScan) {
                if (currentScan.girth && currentScan.girth.isMeasurement) {
                    result.push(this.$t('common.ti-wei-ce-liang'))
                }
                if (currentScan.shape && currentScan.shape.isMeasurement) {
                    result.push(this.$t('common.ti-tai-ping-gu'))
                }
                if (currentScan.shoulder && currentScan.shoulder.active > 1) {
                    result.push(this.$t('common.jian-bu-gong-neng'))
                }
                if (currentScan.weight && currentScan.weight.isMeasurement) {
                    result.push(this.$t('common.ti-zhong-ce-liang'))
                }
            }
            if (result.length > 1) {
                return this.$t('item-select.yi-ce-xiang-mu-de')
            } else {
                return result[0]
            }
        },
        // 是否为标准模式
        isStandardMode() {
            return this.settingInfo.deviceMode === 2
        },
        isShowNutrition() {
            const isFlag = this.unScanItems.indexOf(3) > -1 && this.unScanItems.indexOf(1) > -1
            return !this.isStandardMode && isFlag
        },
        isMeasure31() {
            const isMeasure31 =
                this.measureInfo.unScanItems.indexOf(3) < 0 && this.measureInfo.unScanItems.indexOf(1) < 0
            return !this.isStandardMode && isMeasure31
        },
        isTriMode() {
            return this.settingInfo.combineMeasureEnable && this.settingInfo.triMode
        }
    },
    watch: {
        projectList(val) {
            if (val.length === 1) {
                window.logger.info('选择项目只有一项', val)
                // const pageInfo = {
                //     btnList: [
                //         {
                //             btn: 'switch',
                //             msg: '电源'
                //         }
                //     ]
                // }
                // this.$store.commit('CHANGE_PAGE_INFO', pageInfo)
            }
        }
    },
    created() {
        this.$emit('on-audio-event', 'playAudio', 'btnEffect')
        // 跳转至按钮模式
        if (
            this.measureInfo.unScanItems.length === 0 &&
            this.deviceInfo.deviceType === 5 &&
            this.deviceInfo.healthPackageEnable === 2
        ) {
            window.logger.info('无未测量项目，进入报告页面')
            this.$changeViewPage('getReport')
        }
        if (!this.gestureUsable) {
            this.$changeViewPage('ButtonContinue')
        } else {
            window.logger.info('TouchContinue 进入继续测量页面-手势模式')
            window.logger.info(`测量信息${JSON.stringify(this.measureInfo)}`)
            // || 后者为vaPro5 都测量完，有无电流或 身体成分围度未测量的情况
            if (
                this.unScanLen > 0 ||
                (this.deviceInfo.deviceType &&
                    this.unScanLen === 0 &&
                    this.isMeasure31 &&
                    ((!this.measureInfo.isMeasureWd && this.measureInfo.isMeasureWu) ||
                        (this.measureInfo.isMeasureWd && !this.measureInfo.isMeasureWu)) &&
                    this.deviceInfo.healthPackageEnable !== 2)
            ) {
                this.isNotLeftKey()
                window.logger.info('未测量项:', JSON.stringify(this.unScanItems))
                this.updateUnScanItems()
                // 处理测量项List
                this.isUnScanItems()
                //  播放继续测量语音
                const that = this
                this.delayTimer = setTimeout(function () {
                    that.$emit('on-audio-event', 'playAudio', that.continueAudioId)
                }, 500)
                // this.$emit('on-audio-event', 'playAudio', this.continueAudioId)
            } else {
                window.logger.info('测量完成')
                this.$changeViewPage('getReport')
            }
        }
    },
    beforeDestroy() {
        clearTimeout(this.repeatTimer)
        if (this.delayTimer !== null) {
            clearTimeout(this.delayTimer)
        }

        this.clearPageJumpTimer()
    },
    methods: {
        updateUnScanItems() {
            if (this.deviceInfo.deviceType !== 5) {
                return
            }
            const item = this.projectItems.filter((item) => item.active === 1)[0]
            item.title = this.isTriMode ? '身体评估' : '身体成分<br />围度测量'
            item.content = this.isTriMode
                ? '了解您的身体成分、身体围度、体态评估'
                : this.deviceInfo.healthPackageEnable === 2
                ? ''
                : '了解您的体重、体脂率、脂肪量等'
            item.listIcon = this.deviceInfo.healthPackageEnable === 2 ? 'girth2' : 'body_composition'
            //  标准模式去掉体围
            if (this.isStandardMode) {
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    unScanItems: this.measureInfo.unScanItems.filter((e) => {
                        return e !== 3
                    })
                })
            }
        },
        isUnScanItems() {
            // console.log(`当前可测量项目${JSON.stringify(this.projectItems)}`)
            if (!this.isStandardMode) {
                const isFlag =
                    this.unScanItems.indexOf(3) > -1 &&
                    (this.deviceInfo.deviceType === 5
                        ? this.initMesInfo.unScanItems.indexOf(1) > -1
                        : this.unScanItems.indexOf(1) > -1) &&
                    this.deviceInfo.healthPackageEnable !== 2
                const deviceType = this.deviceInfo.deviceType
                //产康模式
                this.projectItems =
                    deviceType === 5
                        ? this.projectItems.filter((item) => item.active !== 3)
                        : this.projectItems.filter((item) => item.active !== 3 && item.active !== 1)
                if (isFlag) {
                    // 产康模式下 配置了体围和体重测量项目才能显示无电流营养分析
                    this.projectItems.splice(0, 0, {
                        // 标题
                        title: this.$t('item-select.wu-dian-liu-sub'),
                        // 内容
                        content: this.$t('item-select.ti-wei-wu-dian_desc'),
                        // 按钮样式图标
                        listIcon: 'postureWu',
                        active: 3
                    })
                }
            }
            const unScanItems = this.unScanItems
            // vapro5 项目逻辑处理
            if (
                this.deviceInfo.deviceType === 5 &&
                this.isMeasure31 &&
                !this.measureInfo.isMeasureWd &&
                this.measureInfo.isMeasureWu
            ) {
                if (unScanItems.indexOf(1) < 0) {
                    unScanItems.push(1)
                }
            }
            // 测了身体围度没有测无电流
            if (
                this.deviceInfo.deviceType === 5 &&
                this.isMeasure31 &&
                this.measureInfo.isMeasureWd &&
                !this.measureInfo.isMeasureWu &&
                this.deviceInfo.healthPackageEnable !== 2
            ) {
                // console.log(this.projectItems, 8898)
                if (unScanItems.indexOf(3) < 0) {
                    this.projectItems.splice(2, 0, {
                        // 标题
                        title: this.$t('item-select.wu-dian-liu-sub'),
                        // 内容
                        content: this.$t('item-select.ti-wei-wu-dian_desc'),
                        // 按钮样式图标
                        listIcon: 'postureWu',
                        active: 3
                    })
                    unScanItems.push(3)
                }
            }
            let continueItem = this.projectItems.find((item) => {
                return item.active === unScanItems[0]
            })
            // window.logger.info(`continueItem${JSON.stringify(continueItem)}`)
            console.log(11111111, this.alreadyScan, continueItem)
            // let secondItem
            // if (this.unScanLen > 1) {
            //     secondItem = this.projectItems.find((item) => {
            //         return item.active === this.measureInfo.unScanItems[1]
            //     })
            //     this.isAbleClick = true
            //     continueItem.skip = true
            // } else {
            //     secondItem = {
            //         // 标题
            //         title: this.$t('item-select.jie-shu-ce-liang'),
            //         // 内容
            //         content: this.$t('item-select.jie-shu-ce-liang_desc', [this.alreadyScan]),
            //         // 按钮样式图标
            //         listIcon: 'item_end',
            //         // 测量项
            //         active: -2
            //     }
            // }
            let secondItem = {
                // 标题
                title: this.$t('item-select.jie-shu-ce-liang'),
                // 内容
                content: this.$t('item-select.jie-shu-ce-liang_desc', [this.alreadyScan]),
                // 按钮样式图标
                listIcon: 'item_end',
                // 测量项
                active: -2
            }
            // 如果剩余两项未测量，显示长按跳过
            if (this.unScanLen > 1) {
                if (
                    this.deviceInfo.deviceType === 5 &&
                    this.isMeasure31 &&
                    this.unScanItems.length < 2 &&
                    ((!this.measureInfo.isMeasureWd && this.measureInfo.isMeasureWu) ||
                        (this.measureInfo.isMeasureWd && !this.measureInfo.isMeasureWu))
                ) {
                    console.log('varo5 wu/wd 做了其中一项不做处理')
                } else {
                    continueItem.skip = true
                }
            }
            console.log(`当前继续测量项目${JSON.stringify(continueItem)}`)
            this.projectList = [continueItem, secondItem]
        },
        isTouchScreen(active, index, gestureState) {
            // 关闭手势识别
            this.$algClient.stopGestureDetect()
            this.isfinishClick = gestureState
            this.activePro = index + 1
            const setTimer = setInterval(() => {
                if (active === 5 || active === -2) {
                    this.$changeViewPage('getReport')
                } else {
                    this.btnFeedback(active)
                }
                window.clearInterval(setTimer)
            }, 300)
        },
        // 按键处理
        isNotLeftKey() {
            let btnList = [
                {
                    btn: 'switch',
                    msg: '电源'
                },
                {
                    btn: 'add',
                    msg: '加'
                },
                {
                    btn: 'sub',
                    msg: '减'
                }
            ]
            // if (this.activePro !== 0) {
            //     btnList.push(
            //         {
            //             btn: 'add',
            //             msg: '加'
            //         },
            //         {
            //             btn: 'sub',
            //             msg: '减'
            //         }
            //     )
            // }
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList
            })
        },
        // 倒计时结束事件
        cutDownOver() {
            this.$changeViewPage('Home')
        },
        // 清楚页面跳转定时器
        clearPageJumpTimer() {
            if (this.pageJumpTimer) {
                clearTimeout(this.pageJumpTimer)
            }
        },
        // 页面跳转定时器 延迟1s 等待手势识别成功音效
        runPageJumpTimer(fn, second) {
            this.clearPageJumpTimer()
            this.pageJumpTimer = setTimeout(() => {
                if (fn) {
                    fn()
                }
            }, second * 1000)
        },
        // 语音结束
        audioEndCallback(audioId) {
            console.log(audioId)
            if (['selectGuideBmAndShd', 'continueScanGesture', 'continueScanGesture_a'].indexOf(audioId) > -1) {
                if (!this.isRepeatPlay) {
                    // this.isRepeatPlay = true
                    // 5s后再次播放引导语音
                    console.log('重新开始播放')
                    this.repeatTimer = setTimeout(() => {
                        // 播放继续测量语音
                        this.$emit('on-audio-event', 'playAudio', this.continueAudioId)
                    }, 5 * 1000)
                }
            }
        },
        // 按键事件
        btnClick(btnType) {
            // 重复按下无效
            if (this.btnDisabled) {
                return
            }
            // 上
            if (btnType === 1) {
                this.available = false
                if (this.activePro === 2) {
                    this.activePro = 1
                } else if (this.activePro === 1) {
                    this.activePro = 2
                } else {
                    this.activePro = 1
                }
                // 下
            } else if (btnType === 2) {
                this.available = false
                if (this.activePro === 2) {
                    this.activePro = 1
                } else if (this.activePro === 1) {
                    this.activePro = 2
                } else {
                    this.activePro = 1
                }
                // 确定
            } else if (btnType === 3) {
                if (this.activePro !== 0) {
                    window.logger.info('继续测量项目页-手势模式:', '手势开启情况下按钮操作取消算法')
                    // 停止手势服务算法
                    this.$algClient.stopGestureDetect()
                    this.handleContinue()
                }
                // 长按下键跳过
            } else if (btnType === 5) {
                // 长按下键测量项目暂不响应， 做无触屏用到
                // 选择下一个未测量项目
                // window.logger.info(
                //     '是否跳过该项目',
                //     this.measureInfo.unScanItems,
                //     this.unScanLen,
                //     this.activeLow,
                //     this.isJump
                // )
                if (this.unScanLen > 1) {
                    console.log(this.unScanLen, 666, this.activeLow)
                    if (this.unScanLen.length !== this.activeLow && !this.isJump) {
                        ++this.activeLow
                        this.isJump = true
                        setTimeout(() => {
                            this.isJump = false
                        }, 200)
                    }
                    let unScanItems = this.measureInfo.unScanItems
                    // vapro5 项目逻辑处理
                    if (
                        this.deviceInfo.deviceType === 5 &&
                        this.isMeasure31 &&
                        !this.measureInfo.isMeasureWd &&
                        this.measureInfo.isMeasureWu
                    ) {
                        if (unScanItems.indexOf(1) < 0) {
                            unScanItems.push(1)
                        }
                    }
                    // 测了身体围度没有测无电流
                    if (
                        this.deviceInfo.deviceType === 5 &&
                        this.isMeasure31 &&
                        this.measureInfo.isMeasureWd &&
                        !this.measureInfo.isMeasureWu &&
                        this.deviceInfo.healthPackageEnable !== 2
                    ) {
                        // console.log(this.projectItems, 8898)
                        if (unScanItems.indexOf(3) < 0) {
                            this.projectItems.splice(2, 0, {
                                // 标题
                                title: this.$t('item-select.wu-dian-liu-sub'),
                                // 内容
                                content: this.$t('item-select.ti-wei-wu-dian_desc'),
                                // 按钮样式图标
                                listIcon: 'postureWu',
                                active: 3
                            })
                            unScanItems.push(3)
                        }
                    }
                    let continueItem = this.projectItems.find((item) => {
                        return item.active === unScanItems[this.activeLow]
                    })

                    if (this.projectList[0].active === continueItem.active) {
                        return
                    }
                    // 判断继续测量项目已经是最后一个测量项目
                    if (this.activeLow !== this.unScanLen - 1) {
                        if (
                            (this.deviceInfo.deviceType === 5 &&
                                this.isMeasure31 &&
                                !this.measureInfo.isMeasureWd &&
                                this.measureInfo.isMeasureWu) ||
                            (this.measureInfo.isMeasureWd && !this.measureInfo.isMeasureWu)
                        ) {
                            console.log('varo5 wu/wd 做了其中一项不做处理')
                        } else {
                            continueItem.skip = true
                        }
                    }
                    this.projectList = [
                        continueItem,
                        {
                            // 标题
                            title: this.$t('item-select.jie-shu-ce-liang'),
                            // 内容
                            content: this.$t('item-select.jie-shu-ce-liang_desc', [this.alreadyScan]),
                            // 按钮样式图标
                            listIcon: 'item_end',
                            // 测量项
                            active: -2
                        }
                    ]
                    // 重置倒计时组件
                    this.$refs.cutDown.init(30)
                    window.logger.info(JSON.stringify(this.projectList))
                }
            }
            // TODO: 等待处理长按返回键
            // else if (btnType === 9) {
            //     // 长按返回键
            //     // 关闭手势识别
            //     this.$algClient.stopGestureDetect()
            //     this.$changeViewPage('Home')
            // }
            // 手势报告按钮样式
            if (this.activePro === 3) {
                this.isfinishClick = true
            } else {
                this.isfinishClick = false
            }
            this.isNotLeftKey()
        },
        // 按钮按下后回调
        btnFeedback(active) {
            window.logger.info('继续测量项目页-手势模式:', `进入测量项目 ${active}`)
            const PAGE_PATTEN = {
                3: 'GirthGuide',
                2: 'ShapeGuide',
                4: 'ShoulderPrepare',
                1: this.deviceInfo.deviceType === 5 ? 'WeightGuide' : 'WeightGuide'
            }
            this.btnDisabled = true
            // 修改未测量项目数组
            this.runPageJumpTimer(() => {
                // 跳转
                if (active === 3 && !this.deviceUsable.weight) {
                    if (!this.isShowNutrition) {
                        this.$changeViewPage('GirthGuide')
                    }
                } else {
                    if (this.isShowNutrition && active === 3) {
                        const massStatus = this.measureInfo.mass.status
                        // 无电流测量
                        if (this.deviceInfo.deviceType === 5 && massStatus) {
                            // 如果 已经测量体成分直接测量体围
                            this.$changeViewPage('GirthGuide')
                        } else {
                            // this.$changeViewPage('WeightGuide')

                            if (this.deviceInfo.deviceType === 5 && active === 1) {
                                this.$changeViewPage('ZhunBei', { typeSort: active })
                            } else {
                                this.$changeViewPage('WeightGuide', {
                                    typeSort: this.deviceInfo.deviceType === 5 ? active : null
                                })
                            }
                        }
                    } else {
                        const pageName = PAGE_PATTEN[active]
                        if (pageName === 'WeightGuide') {
                            if (this.deviceInfo.deviceType === 5 && active === 1) {
                                this.$changeViewPage('ZhunBei', { typeSort: active })
                            } else {
                                this.$changeViewPage(PAGE_PATTEN[active], { canSkip: true, typeSort: active })
                            }
                        } else {
                            if (this.deviceInfo.deviceType === 5 && active === 3) {
                                this.$changeViewPage('WeightGuide', {
                                    typeSort: this.deviceInfo.deviceType === 5 ? active : null
                                })
                            } else {
                                this.$changeViewPage(PAGE_PATTEN[active])
                            }
                        }
                    }
                }
            }, 1)
        },
        // 手势识别成功 1 左 2 右
        handleGesture(type) {
            window.logger.info('继续测量项目页-手势模式:', `手势识别${type === 1 ? '左' : '右'}手成功并取消算法`)
            this.activePro = type
            // 播放识别成功音效
            this.$emit('on-audio-event', 'playAudio', 'gestureEffect', 2)
            // 只要识别成功就取消算法
            this.$algClient.stopGestureDetect()
            this.handleContinue()
        },
        // 确认或识别成功后处理
        handleContinue() {
            // 关闭手势识别
            this.$algClient.stopGestureDetect()
            let active
            // 触屏点击进入报告页
            if (this.activePro !== 3) {
                // 继续测量的项目
                const type = this.projectList[this.activePro - 1]
                active = type.active
            } else {
                active = 0
            }
            if (active > 0) {
                // 继续测量
                this.btnFeedback(active)
            } else {
                this.runPageJumpTimer(() => {
                    // 跳转
                    this.$changeViewPage('getReport')
                }, 1)
            }
        },
        handleJump() {
            this.btnClick(5)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.continue-scan {
    .scan-project {
        margin-top: 328px;
    }

    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 101;
        margin-bottom: 96px;
    }
    .top-tips {
        position: absolute;
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        height: 56px;
        text-align: center;
        top: 384px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 32px;
        color: #ff791f;
        line-height: 56px;
        font-style: normal;
    }
    .top-tips2 {
        position: absolute;
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        // height: 56px;
        text-align: center;
        top: 354px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 28px;
        color: #ff791f;
        line-height: 40px;
        font-style: normal;
        z-index: 99;
    }
}
.jumpTxt {
    width: 100%;
    height: 67px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 48px;
    color: #75a6fc;
    line-height: 67px;
    text-align: center;
    font-style: normal;
    margin-top: 104px;
}
</style>
