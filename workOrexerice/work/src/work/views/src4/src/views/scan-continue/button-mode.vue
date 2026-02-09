<!--
 * @Description: 继续选择页-按钮模式
 * @Author: gaoyuanyuan
 * @Date: 2021-05-06 15:41:20
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-29 11:46:31
-->
<template>
    <div class="continue-scan">
        <div v-if="!isStandardMode" class="top-tips">{{ $t('home.top-tip') }}</div>
        <div v-if="settingInfo.Athlete" class="top-tips2">{{ $t('Athlete.tips') }}</div>
        <div class="scan-project animated fast fadeIn">
            <scan-project-card
                :activePro="activePro"
                :styleType="2"
                @eventType="isTouchScreen"
                :projectList="projectList"
            ></scan-project-card>
        </div>
        <cut-down-load
            v-if="cutDownStatus"
            ref="cutDown"
            @cut-down-over="cutDownOver"
            :duration="60"
            :suffixType="1"
        ></cut-down-load>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import ScanProjectCard from '@/components/ScanProjectCard.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
export default {
    name: 'ButtonContinue',
    components: {
        ScanProjectCard,
        CutDownLoad
    },
    data() {
        return {
            // 高亮的项目 默认高亮第一项
            activePro: 0,
            // 已经按下后不允许再次点击
            btnDisabled: false,
            projectList: [],
            downLoadTime: 60,
            cutDownStatus: true, // 动态时间
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
                {
                    // 标题
                    title: this.$t('item-select.dong-tai-shi-yan-shi'),
                    // 内容
                    content: this.$t('item-select.dong-tai-shi-yan-shi_desc1'),
                    // 按钮样式图标
                    listIcon: 'item_beta',
                    // 测量项 0 存在二级菜单
                    active: 0,
                    subProject: [
                        {
                            // 标题
                            title: this.$t('item-select.jian-bu-gong-neng'),
                            // 内容
                            content: this.$t('item-select.jian-bu-gong-neng_desc'),
                            // 按钮样式图标
                            listIcon: 'item_shoulder',
                            // 测量项
                            active: 4
                        }
                    ]
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
            projectItemsVa: [
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
                    title: this.$t('item-select.wu-dian-liu'),
                    // 内容
                    content: this.$t('item-select.ti-wei-wu-dian_desc'),
                    // 按钮样式图标
                    listIcon: 'posture@2x',
                    active: 3
                },
                {
                    // 标题
                    title: this.$t('item-select.dong-tai-shi-yan-shi'),
                    // 内容
                    content: this.$t('item-select.dong-tai-shi-yan-shi_desc1'),
                    // 按钮样式图标
                    listIcon: 'item_beta',
                    // 测量项 0 存在二级菜单
                    active: 0,
                    subProject: [
                        {
                            // 标题
                            title: this.$t('item-select.jian-bu-gong-neng'),
                            // 内容
                            content: this.$t('item-select.jian-bu-gong-neng_desc'),
                            // 按钮样式图标
                            listIcon: 'item_shoulder',
                            // 测量项
                            active: 4
                        }
                    ]
                }
            ], // vapro3 无电流营养项
            // 引导语音重复播放计时器
            repeatTimer: null,
            // 引导语音是否已重复播放
            isRepeatPlay: false,
            // 自定表头
            title: {
                prev: '',
                title: this.$t('item-select.shi-fou-ji-xu-ce-liang'),
                align: 'center',
                icon: undefined,
                leave: true
            },
            // 是否允许改变表头
            isStatus: false,
            // 防止多次触发监听事件
            isRecovery: false,
            typeSort: 1
        }
    },
    watch: {
        meteTitle: {
            handler(v, older) {
                if (v.leave === older.leave) {
                    if (!v.leave && this.isStatus) {
                        this.isStatus = false
                        this.isRecovery = true
                        this.settingMeteTitle(true)
                    } else if (this.isRecovery) {
                        this.activePro = 0
                        this.isRecovery = false
                        this.settingMeteTitle(false)
                        this.getNormalProjects()
                        this.cutDownStatus = false
                        setTimeout(() => {
                            this.cutDownStatus = true
                            this.downLoadTime = 60
                        }, 200)
                    }
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'measureInfo',
            'deviceUsable',
            'scanQueue',
            'meteTitle',
            'deviceInfo',
            'settingInfo',
            'initMesInfo'
        ]),
        // 选择项目语音音频id
        continueAudioId() {
            return this.deviceInfo.deviceType === 5 ? 'quirckContinue' : 'continueScanBtn'
        },
        // 筛选未测量项
        unScanItems() {
            // 所有未测量项
            let unScanItems = this.measureInfo.unScanItems
            console.log('unScanItems:', unScanItems)
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
            if (this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2) {
                unScanItems = unScanItems.filter((item) => item !== 3)
            }
            console.log('unScanItems2:', unScanItems)
            unScanItems.forEach((item) => {
                // 项目异常
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
            return this.unScanItems.length
        },
        // 已成功测量项目
        alreadyScan() {
            let currentScan = this.measureInfo
            let result = []
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
                        result.push(this.isTriMode ? '身体评估' : '身体成分围度测量')
                    } else {
                        result.push(this.isTriMode ? '身体评估' : '身体成分围度')
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
                if (currentScan.mass && currentScan.mass.isMeasurement) {
                    result.push(this.$t('item-select.shen-ti-cheng-fen-celiang'))
                }
                if (currentScan.shoulder && currentScan.shoulder.active > 1) {
                    result.push(this.$t('common.jian-bu-gong-neng'))
                }
            }
            if (result.length > 1) {
                return this.$t('item-select.yi-ce-xiang-mu-de')
            } else {
                return result[0]
            }
        },
        isStandardMode() {
            return this.settingInfo.deviceMode === 2
        },
        isShowNutrition() {
            const isFlag = this.initMesInfo.unScanItems.indexOf(3) > -1 && this.initMesInfo.unScanItems.indexOf(1) > -1
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
    created() {
        if (this.deviceInfo.operationMode != 1) this.activePro = 1
        this.settingMeteTitle()
        if (this.deviceInfo.deviceType === 5) {
            // vapro5 兼容 vapro3 顺序
            this.projectItemsVa.splice(1, 1)
            this.projectItemsVa.push({
                // 标题
                title: this.$t('item-select.wu-dian-liu'),
                // 内容
                content: this.$t('item-select.ti-wei-wu-dian_desc'),
                // 按钮样式图标
                listIcon: 'postureWu',
                active: 3
            })
        }
        window.logger.info('进入继续测量页面-按钮模式')
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
            this.updateUnScanItems()
            this.getNormalProjects()
            // 播放继续测量语音
            this.$emit('on-audio-event', 'playAudio', this.continueAudioId)
        } else {
            this.$changeViewPage('getReport')
        }
    },
    beforeDestroy() {
        clearTimeout(this.repeatTimer)
    },
    methods: {
        ...mapMutations(['METE_TITLE']),
        updateUnScanItems() {
            if (this.deviceInfo.deviceType !== 5) {
                return
            }
            const item = {
                // 标题
                title: this.isTriMode ? '身体评估' : '身体成分围度测量',
                // 内容
                content: this.isTriMode
                    ? '了解您的身体成分、身体围度、体态评估'
                    : this.deviceInfo.healthPackageEnable === 2
                    ? ''
                    : '了解您的体重、体脂率、脂肪量等',
                // 按钮样式图标
                listIcon: this.deviceInfo.healthPackageEnable === 2 ? 'girth2' : 'body_composition',
                active: 1
            }
            this.projectItems = this.projectItems.filter((item) => item.active !== 1 && item.active !== 3)
            this.projectItems.splice(2, 0, item)
            this.projectItemsVa.splice(2, 0, item)
        },
        // 倒计时结束事件
        cutDownOver() {
            this.$changeViewPage('Home')
        },
        // 按键处理
        isNotLeftKey() {
            let btnList = []
            // 显示确认键
            if (this.unScanLen > 0) {
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
            if (this.activePro !== 0) {
                btnList.push({
                    btn: 'switch',
                    msg: '电源'
                })
            }

            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList
            })
        },
        // 获取可测量的项目
        getNormalProjects() {
            window.logger.info('未测量项:', JSON.stringify(this.unScanItems))
            // 根据wu营养分析 选测量报告
            let newProject = this.isShowNutrition ? this.projectItemsVa : this.projectItems
            let continueItems = newProject.filter((item) => {
                const active = item.active ? item.active : item.subProject[0].active
                return this.unScanItems.indexOf(active) > -1
            })
            continueItems.push({
                // 标题
                title: this.$t('item-select.jie-shu-ce-liang'),
                // 内容
                content: this.$t('item-select.jie-shu-ce-liang_desc', [this.alreadyScan]),
                // 按钮样式图标
                listIcon: 'item_end',
                // 测量项
                active: -2
            })
            // 测了无电流没有测身体围度
            if (
                this.deviceInfo.deviceType === 5 &&
                this.isMeasure31 &&
                !this.measureInfo.isMeasureWd &&
                this.measureInfo.isMeasureWu
            ) {
                this.typeSort = 1
                continueItems.splice(this.projectList.length - 1, 0, {
                    title: this.isTriMode ? '身体评估' : '身体成分围度测量',
                    // 内容
                    content: this.isTriMode ? '了解您的身体成分、身体围度、体态评估' : '了解您的体重、体脂率、脂肪量等',
                    // 按钮样式图标
                    listIcon: 'body_composition',
                    active: 1
                })
            }
            // 测了身体围度没有测无电流
            if (
                this.deviceInfo.deviceType === 5 &&
                this.isMeasure31 &&
                this.measureInfo.isMeasureWd &&
                !this.measureInfo.isMeasureWu &&
                this.deviceInfo.healthPackageEnable !== 2
            ) {
                this.typeSort = 3
                continueItems.splice(this.projectList.length - 1, 0, {
                    // 标题
                    title: this.$t('item-select.wu-dian-liu'),
                    // 内容
                    content: this.$t('item-select.ti-wei-wu-dian_desc'),
                    // 按钮样式图标
                    listIcon: 'postureWu',
                    active: 3
                })
            }
            this.projectList = continueItems
            // console.log(
            //     this.projectList,
            //     8888,
            //     this.deviceInfo.deviceType,
            //     this.isShowNutrition || !this.isStandardMode
            // )
            this.isNotLeftKey()
        },
        // 触屏选择
        isTouchScreen(active, index) {
            this.activePro = index + 1
            const setTimer = setInterval(() => {
                if (active === -2) {
                    this.$changeViewPage('getReport')
                } else {
                    this.handleContinue()
                }
                window.clearInterval(setTimer)
            }, 300)
        },
        // 设置表头
        settingMeteTitle(project) {
            if (project) {
                this.title.prev = 'navigation-bar.xiang-mu-xuan-ze'
                this.title.icon = true
                this.title.leave = false
                this.title.title = this.$t('navigation-bar.xuan-ze-ce-liang-xiang-mu')
            } else {
                this.title.prev = 'navigation-bar.shou-ye'
                this.title.icon = true
                this.title.leave = true
                this.title.title = this.$t('navigation-bar.shi-fou-ji-xu-ce-liang')
            }
            this.METE_TITLE(this.title)
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (audioId === 'continueScanBtn' || audioId === 'quirckContinue') {
                if (!this.isRepeatPlay) {
                    this.isRepeatPlay = true
                    // 5s后再次播放引导语音
                    this.repeatTimer = setTimeout(() => {
                        // 播放继续测量语音
                        this.$emit('on-audio-event', 'playAudio', this.continueAudioId)
                    }, 5 * 1000)
                }
            }
        },
        // 按键事件
        btnClick(btnType) {
            this.isNotLeftKey()
            // 重复按下无效
            if (this.btnDisabled) {
                return
            }
            // 上
            if (btnType === 1) {
                if (this.activePro === 1) {
                    this.activePro = this.projectList.length
                } else {
                    this.activePro--
                }
                // 下
            } else if (btnType === 2) {
                if (this.activePro === this.projectList.length) {
                    this.activePro = 1
                } else {
                    this.activePro++
                }
                // 确定
            } else if (btnType === 3) {
                if (this.activePro !== 0) {
                    this.handleContinue()
                }
            } else if (btnType === 7) {
                if (this.projectList[0].active === 4) {
                    if (this.deviceInfo.operationMode != 1) this.activePro = 1
                    this.settingMeteTitle()
                    this.getNormalProjects()
                }
            }
            // TODO: 等待处理长按返回键
            // else if (btnType === 9) {
            //     // 长按返回键
            //     this.$algClient.stopGestureDetect()
            //     this.$changeViewPage('Home')
            // }
        },
        // 按钮按下后回调
        btnFeedback(active) {
            window.logger.info('继续测量项目页-按钮模式:', `进入测量项目 ${active}`)
            const PAGE_PATTEN = {
                3: 'GirthGuide',
                2: 'ShapeGuide',
                4: 'ShoulderPrepare',
                1: this.deviceInfo.deviceType === 5 ? 'WeightGuide' : 'WeightGuide'
            }
            this.btnDisabled = true

            if (active === 3 && !this.deviceUsable.weight && this.deviceInfo.deviceType !== 5) {
                this.$changeViewPage('GirthGuide')
            } else {
                if (this.isShowNutrition && active === 3) {
                    this.$changeViewPage('WeightGuide', {
                        typeSort: this.deviceInfo.deviceType === 5 ? active : null
                    })
                } else {
                    const pageName = PAGE_PATTEN[active]
                    if (pageName === 'WeightGuide') {
                        if (this.deviceInfo.deviceType === 5 && active === 1) {
                            this.$changeViewPage('ZhunBei', { typeSort: active })
                        } else {
                            this.$changeViewPage(pageName, {
                                canSkip: true,
                                typeSort: this.deviceInfo.deviceType === 5 ? this.typeSort : null
                            })
                        }
                    } else {
                        if (this.measureInfo.isMeasureWd && this.deviceInfo.deviceType === 5 && active === 3) {
                            // 针对vapro5 测量了围度要跳转 点击营养分析跳转体重页面
                            this.$changeViewPage('WeightGuide', {
                                typeSort: active
                            })
                        } else {
                            this.$changeViewPage(pageName)
                        }
                    }
                }
            }
        },
        // 确认或识别成功后处理
        handleContinue() {
            // 继续测量的项目
            const type = this.projectList[this.activePro - 1]
            const active = type.active
            if (active === 0) {
                // 是否允许改变表头 及恢复
                this.isStatus = true
                this.settingMeteTitle(true)
            }
            window.logger.info('继续测量项目页-按钮模式:', `选择测量项目 ${type.title}`)
            if (active > 0) {
                // 继续测量
                this.btnFeedback(active)
                // 动态实验室二级菜单
            } else if (active === 0) {
                this.cutDownStatus = false
                setTimeout(() => {
                    this.cutDownStatus = true
                    this.downLoadTime = 60
                }, 200)
                this.projectList = type.subProject
                this.activePro = 1
                const pageInfo = {
                    btnList: [
                        {
                            btn: 'switch',
                            msg: '电源'
                        }
                    ]
                }
                this.$store.commit('CHANGE_PAGE_INFO', pageInfo)
                // 播放选择测量语音
                this.$emit('on-audio-event', 'playAudio', 'shoulderSelectShd')
            } else {
                this.$changeViewPage('getReport')
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.continue-scan {
    .scan-project {
        margin-top: 390px;
    }
    .top-tips {
        position: relative;
        top: 370px;
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        height: 56px;
        text-align: center;
        margin-bottom: 32px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 32px;
        color: #ff791f;
        line-height: 56px;
        font-style: normal;
    }

    .top-tips2 {
        position: relative;
        top: 370px;
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        // height: 56px;
        text-align: center;
        margin-bottom: 32px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 32px;
        color: #ff791f;
        line-height: 40px;
        font-style: normal;
    }

    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 101;
        margin-bottom: 96px;
    }
}
</style>
