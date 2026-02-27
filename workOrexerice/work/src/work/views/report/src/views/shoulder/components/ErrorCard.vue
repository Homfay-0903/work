<!--
 * @Description: 肩部测量过程异常
 * @Author: yangsheng
 * @Date: 2020-10-14 14:03:56
 * @LastEditTime: 2024-07-08 14:08:05
 * @LastEditors: DonWang wangwenqiu@suanier.com
 -->
<template>
    <div class="footer-msg">
        <!-- 测量异常 -->
        <div class="scan-error">
            <!-- 设备异常 -->
            <div v-if="deviceErrors.length" class="scan-error">
                <p slot="title" class="model-title">
                    {{
                        isContain && scanStep === 3 && measureInfo.shoulder.active === 1
                            ? $t('common.error.scan-failed-title')
                            : $t('common.error.scan-failed-title')
                    }}
                </p>
                <p class="model-title free">
                    <span
                        slot="error-content"
                        v-if="!sucItemNum && (!isContain || scanStep !== 3)"
                        class="model-content"
                        >{{
                            checkType === 1
                                ? $t('common.error.device-err-desc[0]')
                                : $t('common.error.device-err-desc[1]')
                        }}</span
                    >
                    <span slot="error-content" v-else-if="!sucItemNum && isContain" class="model-content">
                        {{ $t('common.error.device-err-desc[2]') }}
                    </span>
                    <span slot="error-content" v-else class="model-content">
                        {{
                            checkType === 1
                                ? $t('common.error.device-err-desc[0]')
                                : $t('common.error.device-err-desc[1]')
                        }}
                        <!-- 请点击<i class="iconfont icon-success"></i> 键查看报告 -->
                    </span>
                </p>
                <p class="error-code">
                    {{ $t('common.error.err-code', [deviceErrors.map((item) => item.title).join('、')]) }}
                </p>
            </div>
            <template v-else>
                <p slot="title" class="model-title">{{ $t('common.error.scan-failed-title') }}</p>
                <div slot="error-content" class="model-content">
                    <span>{{ $t('common.error.re-scan', [shdErrors[0].title]) }}</span>
                </div>
            </template>
            <!-- 手动选择 -->
            <key-select
                v-if="selectMode === 0 && !deviceErrors.length"
                class="key-select"
                :select="select"
                :items="itemsContent"
                @on-key-feedback="onKeyFeedback"
            ></key-select>
            <!-- 手势选择 -->
            <div v-else-if="selectMode === 1 && !deviceErrors.length" class="gesture-operation">
                <gesture-select
                    v-if="deviceErrors.length && sucItemNum"
                    @on-gesture-feedback="gestureFeedback"
                    :leftText="$t('common.gesture-select.left.cha-kan-bao-gao')"
                    backgroundColor="rgba(31, 36, 41, 1)"
                    :rightText="$t('common.gesture-select.right.jie-shu-ce-liang')"
                    :select="selectGes"
                ></gesture-select>
                <!-- 测量超时 启动超时 非设备异常的颈部异常 -->
                <gesture-select
                    v-else-if="[1, 2].indexOf(errType) > -1 || (shdErrors.length && !deviceErrors.length)"
                    @on-gesture-feedback="gestureFeedback"
                    :memo="gestureText"
                    :available="available"
                    :leftText="$t('common.gesture-select.left.zhong-xin-ce-liang')"
                    backgroundColor="rgba(31, 36, 41, 1)"
                    :rightText="$t('common.gesture-select.right.jie-shu-ce-liang')"
                    :select="selectGes"
                ></gesture-select>
            </div>
            <key-select
                v-else-if="sucItemNum"
                class="btn-operation"
                :select="select"
                :items="itemsReport"
                @on-key-feedback="gestureFeedback('', 1)"
            ></key-select>
        </div>
        <cut-down-load
            v-if="deviceErrors.length"
            @cut-down-over="returnRunPicPage"
            :backSuffix="false"
            :duration="15"
            :suffixType="3"
        ></cut-down-load>
        <cut-down-load v-else @cut-down-over="returnRunPicPage(2)" :duration="60" :suffixType="2"></cut-down-load>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GestureSelect from '@/components/GestureSelect.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import * as types from '@/store/mutation-types'
import KeySelect from '@/components/KeySelect.vue'
export default {
    name: 'ShdErrorCard',
    components: {
        CutDownLoad,
        GestureSelect,
        KeySelect
    },
    props: {
        // 手动选择项
        select: {
            type: Number,
            default: 0
        },
        // 肩部异常
        shdErrors: {
            type: Array,
            default() {
                return []
            }
        },
        // 手动/手势模式 0手动   1手势
        selectMode: {
            type: Number,
            default: 0
        },
        // 测量失败类型 0无 1 启动测量超时 2 测量超时
        errType: {
            type: Number,
            default: 0
        },
        // 测量步骤
        scanStep: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // 当前显示错误类型 1、硬件 2、其他 3、人为
            showErrorType: 1,
            // 手动文字显示
            btnText: '',
            // 手势提示
            gestureText: '',
            // 1 可重启  2 不可重启
            // checkType: 1,
            // 当前显示设备错误类型 1、硬件 2、其他 3、人为
            showDeviceType: 1,
            available: true,
            // 是否包含深度相机异常
            isContain: false,
            selectGes: 0
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'sucItemNum', 'deviceUsable']),
        // 当前测量类型
        currentScanType() {
            return this.measureInfo.active
        },
        itemsReport() {
            return [
                {
                    icon: 'report',
                    content: this.$t('common.key-select.cha-kan-bao-gao'),
                    remarks: this.$t('common.key-select.cha-kan-bao-gao_desc', [this.alreadyScan])
                }
            ]
        },
        itemsContent() {
            return [
                {
                    icon: 'restart',
                    content: this.$t('common.key-select.zhong-xin-ce-liang'),
                    remarks: this.$t('common.key-select.zhong-xin-ce-liang_desc1', [
                        this.errType === 1 ? this.$t('shoulder.jian-bu-gong-neng-ce-liang') : this.title
                    ])
                },
                {
                    icon: 'end',
                    content: this.$t('common.key-select.jie-shu-ce-liang'),
                    remarks: this.btnText
                }
            ]
        },
        checkType() {
            let _checkType = 1
            let deviceErrorList = this.shdErrors
            const errorInfo = deviceErrorList.find((value) => {
                if (value.id === 3) {
                    return false
                } else {
                    return true
                }
            })
            _checkType = errorInfo ? 2 : 1
            return _checkType
        },
        title() {
            const MODE = {
                0: this.$t('navigation-bar.title4'),
                1: this.$t('navigation-bar.title5')
            }
            return MODE[this.measureInfo.shoulder.active]
        },
        // 是否为硬件异常
        deviceErrors() {
            return this.shdErrors.filter((item) => {
                // 深度相机或者深度相机同步线异常
                return (item.id === 3 || item.id === 4) && !item.canRescan
            })
        },
        // 已成功测量项目
        alreadyScan() {
            let currentScan = this.measureInfo
            let result = []
            if (currentScan) {
                if (currentScan.girth && currentScan.girth.isMeasured) {
                    result.push(this.$t('common.ti-wei-ce-liang'))
                }
                if (currentScan.shape && currentScan.shape.isMeasured) {
                    result.push(this.$t('common.ti-tai-ping-gu'))
                }
                if (currentScan.shoulder && currentScan.shoulder.active > 0) {
                    result.push(this.$t('shoulder.jian-bu-gong-neng'))
                }
            }
            if (result.length > 1) {
                return this.$t('item-select.yi-ce-xiang-mu-de')
            } else {
                return this.$t('item-select.result0-ce-liang', [result[0]])
            }
        },
        // 手势是否可用
        gestureUsable() {
            // 按键启动的后续选择全部使用按键
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        }
    },
    created() {
        const reasonList = this.shdErrors.map((item) => item.name)
        const errorType = ['none', 'start error', 'measure error']
        this.$dotMsg({
            action: 'measure',
            msg: 'measure failed',
            project: 'shoulder',
            type: errorType[this.errType],
            reason: reasonList.join('、')
        })
        this.deviceErrors.forEach((v) => {
            if (v.id === 3) {
                this.isContain = true
            }
        })
        this.$store.commit(types.METE_TITLE, {
            title: this.title
        })
        window.logger.info('手势开关状态：', this.settingInfo.gestureState)
        //  取消肩部检测
        this.$algClient.stopShoulderDetect()
        this.$algClient.stopShoulderLegalityDetect()
        let pageInfo = {}
        window.logger.info('设备异常列表', JSON.stringify(this.deviceErrors))
        this.$emit('on-status', false)
        // 测量失败原因是否为不可重测的设备异常
        if (this.deviceErrors.length !== 0) {
            // 已有成功项目
            if (this.sucItemNum) {
                pageInfo = {
                    btnList: [
                        {
                            btn: 'switch',
                            msg: '电源'
                        }
                    ]
                }
                // 硬件引起的异常
                if (this.deviceErrors) {
                    this.$emit('player-audio', 'scanErrorViewReportBtn')
                } else if (
                    // 播放查看报告
                    this.gestureUsable
                ) {
                    this.$emit('player-audio', 'scanErrorViewReportGesture')
                } else {
                    if (this.alreadyScan.indexOf('undefined') === 0) {
                        this.$emit('player-audio', 'scanErrorEndScan')
                    } else {
                        this.$emit('player-audio', 'failViewReport')
                    }
                }
            } else {
                pageInfo = {
                    btnList: [
                        {
                            btn: 'switch',
                            msg: '电源'
                        }
                    ]
                }
                //  播放结束测量
                this.$emit('player-audio', 'scanErrorEndScan')
            }
            // 可重测
        } else {
            // 按钮
            if (this.selectMode === 0) {
                pageInfo = {
                    btnList: [
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
                }
                this.$emit('player-audio', 'failReScanBtn')
                // 手势
            } else {
                pageInfo = {
                    btnList: [
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
                }
                this.$emit('player-audio', 'failReScanGesture')
            }
        }
        this.$store.commit(types.CHANGE_PAGE_INFO, pageInfo)
        // 体态 体成分成功
        if (this.sucItemNum && !this.deviceErrors.length) {
            this.btnText =
                this.sucItemNum > 1 || this.measureInfo.shoulder.active === 0
                    ? this.$t('common.key-select.jie-shu-ce-liang_desc1')
                    : this.$t('common.key-select.jie-shu-ce-liang_desc2')
            this.gestureText = '查看其他测量报告'
        } else {
            // 都失败
            this.btnText = this.$t('common.key-select.jie-shu-ce-liang_desc3')
            this.gestureText = '将返回首页'
        }
    },

    methods: {
        onKeyFeedback(active) {
            this.$emit('eventType', active)
        },
        // 返回测量结果或首页
        goIndexPage() {
            // 取消算法
            // handleCancelDetectReq()
            // handleSetMotoResetReq()
            if (this.sucItemNum) {
                // 查看报告
                if (this.measureInfo.shoulder.active > 0) {
                    this.$emit('scan-error-result')
                } else {
                    this.$changeViewPage('getReport')
                }
            } else {
                this.$changeViewPage('getReport')
            }
        },
        // 返回轮播图页面
        returnRunPicPage(type) {
            if (type === 2) {
                this.$emit('shoulder-end', 'shoulderEnd')
            }
            this.$changeViewPage('getReport')
        },
        // 获取手势返回 1 左 2 右
        gestureFeedback(data, action) {
            if (action === 1) {
                this.$changeViewPage('getReport')
                return
            }
            window.logger.info('测量失败组件手势识别成功并取消算法')
            this.selectGes = data
            this.select = data - 1
            // 播放识别成功音效
            this.$emit('player-audio', 'gestureEffect', 2)
            this.gestureFeedbackError(data)
        },
        // 非测量手势返回 1 左 2 右
        gestureFeedbackError(data) {
            this.select = data - 1
            // 播放识别成功音效
            this.$emit('player-audio', 'gestureEffect', 2)
            if (this.select === 0) {
                // 查看报告
                if (this.sucItemNum && this.deviceErrors.length) {
                    this.returnRunPicPage()
                } else {
                    this.$emit('scan-error-rescan')
                }
            }
            // 结束测量
            if (this.select === 1) {
                // 查看报告
                if (this.sucItemNum) {
                    // 查看报告
                    if (this.measureInfo.shoulder.active > 0) {
                        this.$emit('scan-error-result')
                    } else {
                        this.$changeViewPage('getReport')
                    }
                } else {
                    this.$changeViewPage('getReport')
                }
            }
        },
        // 按键操作
        rescanAndEnd() {
            console.log(this.select, 444444, this.deviceErrors.length)
            if (this.deviceErrors.length) {
                if (this.selectGes === 1 || this.select === 0) {
                    if (this.sucItemNum) {
                        // 取消手势检测
                        this.$algClient.stopGestureDetect()
                        // 查看报告
                        if (this.measureInfo.shoulder.active > 0) {
                            this.$emit('scan-error-result')
                        } else {
                            this.$changeViewPage('getReport')
                        }
                    }
                }
                // 结束测量
                if (this.selectGes === 2 || this.select === 1) {
                    this.returnRunPicPage()
                }
            } else {
                if (this.gestureUsable) {
                    if (this.selectGes === 1) {
                        // 重新测量
                        this.$emit('scan-error-rescan')
                    }
                    // 结束测量
                    if (this.selectGes === 2) {
                        this.goIndexPage()
                    }
                } else {
                    if (this.select === 0) {
                        // 重新测量
                        this.$emit('scan-error-rescan')
                    }
                    // 结束测量
                    if (this.select === 1) {
                        this.goIndexPage()
                    }
                }
            }
        },
        // 按键事件
        btnClick(btnType) {
            if (btnType === 1) {
                // 上
                if (this.gestureUsable) {
                    if (this.selectGes > 1) {
                        this.selectGes = 1
                    } else {
                        this.selectGes = 2
                    }
                }
                // 设备异常不允许操作
                if (this.deviceErrors.length && this.settingInfo.gestureState) {
                    return
                }
                if (this.select > 0) {
                    this.select = 0
                } else {
                    this.select = 1
                }
                this.available = false
                // if (this.settingInfo.gestureState) {
                //     this.select = 0
                //     // 按键模式下直接跳转页面，手势模式下先取消算法
                //     if (this.selectMode === 0) {
                //         this.rescanAndEnd()
                //     } else {
                //         // 取消算法
                //         // handleCancelDetectReq()
                //     }
                // }
            } else if (btnType === 2) {
                if (this.gestureUsable) {
                    if (this.selectGes < 2 && this.selectGes != 0) {
                        this.selectGes = 2
                    } else {
                        this.selectGes = 1
                    }
                }
                // 设备异常不允许操作
                if (this.deviceErrors.length && this.settingInfo.gestureState) {
                    return
                }
                // 下
                if (this.select < 1) {
                    this.select = 1
                } else {
                    this.select = 0
                }
                this.available = false
                // if (this.settingInfo.gestureState) {
                //     this.select = 1
                //     // 按键模式下直接跳转页面，手势模式下先取消算法
                //     if (this.selectMode === 0) {
                //         this.rescanAndEnd()
                //     } else {
                //         // 取消算法
                //         // handleCancelDetectReq()
                //     }
                // }
            } else if (btnType === 3) {
                // 确定
                this.rescanAndEnd()
            } else if (btnType === 7) {
                // 返回
                // 设备异常按返回，回到首页
                if (this.deviceErrors.length) {
                    this.returnRunPicPage()
                } else {
                    // 测量异常按返回，根据成功数据做判断
                    this.goIndexPage()
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/css" scoped>
.footer-msg {
    position: absolute;
    z-index: 101;
    // margin-top: -764px;
    margin-top: -880px;
    width: 100%;

    .model-title {
        text-align: center;
        margin-bottom: 24px;
        margin-top: 0;
        font-size: 64px;
        font-family: OPPOSansM;
        font-weight: normal;
        color: #ffffff;
        // line-height: 96px;
    }

    .free {
        margin: 0 108px;
    }

    .model-content {
        margin: 0 auto;
        width: 965px;
        text-align: center;
        font-size: 48px;
        font-family: 'OPPOSansR';
        font-weight: normal;
        color: #ffffff;

        i {
            font-size: 56px;
            vertical-align: text-bottom;
            background: @color-blue;
            color: #ffffff;
            border-radius: 10px;
        }
    }

    .scan-error {
        .btn-operation {
            position: relative;
            top: 116px;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .manual-operation {
            display: flex;
            flex-direction: column;
            margin: 144px auto;

            .option-list {
                position: relative;
                border-radius: 32px;
                margin: 12px 65px;
                .normal-border();
                padding: 40px 0;
                display: flex;

                .list-icon {
                    display: flex;
                    align-items: center;
                    margin: 0px 72px;
                }

                .content {
                    color: #e7e9f0;
                    font-size: 48px;
                    font-family: 'OPPOSansR';
                    margin: 0;
                }

                .remarks {
                    color: #cccccc;
                    font-size: 40px;
                    font-family: 'OPPOSansR';
                    margin: 0;
                    margin-top: 10px;
                }

                &.active {
                    .active-border();
                    padding: 40px 0;

                    .content {
                        color: #ffffff;
                    }

                    .remarks {
                        color: #e7e9f0;
                    }
                }
            }
        }

        .error-code {
            font-size: 40px;
            font-family: OPPOSansR;
            font-weight: normal;
            color: #666666;
            margin: 0;
            text-align: center;
            margin-top: -14px;
            line-height: 72px;

            span {
                font-size: 40px;
            }
        }

        .key-select {
            margin-top: 78px;
        }
    }

    .gesture-operation {
        margin-top: 284px;
    }

    .cut-down-container {
        position: fixed;
        bottom: 24px;
    }
}
</style>
