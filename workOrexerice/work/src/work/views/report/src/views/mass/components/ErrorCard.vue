<!--
 * @Description: 体重/体成分测量失败反馈
 * @Author: gaoyuanyuan
 * @Date: 2020-03-07 09:54:58
 * @LastEditors: liutq
 * @LastEditTime: 2024-09-14 18:30:18
 -->
<template>
    <div :class="['footer-msg', isStartError ? 'footer-error' : '', isMassError ? 'footer-mass-error' : '']">
        <!-- 设备异常 不可重测 -->
        <div v-if="reStartReason" :class="['scan-error', $i18n.locale]">
            <transition name="fade-move">
                <div class="fail-content">
                    <p class="fail-img">
                        <img src="@img/weight/weight_fail.png" />
                    </p>
                    <p class="model-title">{{ errTitle }}</p>
                    <p class="model-content">
                        <span>
                            {{
                                reStartErrors.length !== 0
                                    ? $t('common.error.device-err-desc[0]')
                                    : $t('common.error.device-err-desc[1]')
                            }}
                            <!-- 保留防止非触屏模式下用到 -->
                            <!-- <template v-else>
                                请点击
                                <i class="iconfont icon-success"></i> 键查看报告！
                            </template> -->
                        </span>
                    </p>
                    <p class="error-code">
                        {{ $t('common.error.err-code', [bottomErrorCode.map((item) => item.title).join('、')]) }}
                    </p>
                    <cut-down-load
                        @cut-down-over="handleReturnIndex"
                        :backSuffix="false"
                        :style="{ bottom: isStartError ? '21px' : '21px' }"
                        :duration="15"
                        :suffixType="3"
                    ></cut-down-load>
                </div>
            </transition>
            <key-select
                v-if="this.alreadyScan.indexOf(0) < 0 && btnMode"
                class="btn-operation"
                :select="select"
                :items="itemsReport"
                @on-key-feedback="gestureFeedback(2)"
            ></key-select>
            <!-- 手势选择 -->
            <gesture-select
                v-else-if="this.alreadyScan.indexOf(0) < 0 && !btnMode"
                class="key-select"
                :select="selectGes"
                @on-gesture-feedback="gestureFeedback"
                :leftText="itemsReport[0].content"
                backgroundColor="#454f58"
                :rightText="$t('common.gesture-select.right.jie-shu-ce-liang')"
            ></gesture-select>
        </div>
        <!-- 测量异常 可重测 -->
        <div v-else class="scan-error">
            <!-- 未站人 -->
            <transition name="fade-move">
                <div class="fail-content">
                    <p class="fail-img">
                        <img src="@img/weight/weight_fail.png" />
                    </p>
                    <p class="model-title">{{ errTitle }}</p>
                    <p class="model-content">
                        <span>{{
                            bottomErrorCode[0].id === 6
                                ? `${bottomErrorCode[0].title}!`
                                : $t('common.error.re-scan', [bottomErrorCode[0].title])
                        }}</span>
                    </p>
                </div>
            </transition>
            <!-- 快捷重测 -->
            <key-select
                v-if="btnMode"
                class="key-select"
                :select="select"
                :items="itemsContent"
                @on-key-feedback="onKeyFeedback"
            ></key-select>
            <!-- 手势选择 -->
            <gesture-select
                v-else
                class="key-select"
                :select="selectGes"
                @on-gesture-feedback="gestureFeedback"
                :leftText="itemsContent[0].content"
                backgroundColor="#454f58"
                :rightText="itemsContent[1].content"
            ></gesture-select>
            <cut-down-load @cut-down-over="ruturnRunPicPage" :duration="60" :suffixType="2"></cut-down-load>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CutDownLoad from '@/components/CutDownLoad.vue'
import KeySelect from '@/components/KeySelect.vue'
import GestureSelect from '@/components/GestureSelect.vue'
export default {
    name: 'MassErrorCard',
    components: {
        CutDownLoad,
        GestureSelect,
        KeySelect
    },
    props: {
        // 类型 0 体重 1 体成分
        scanType: {
            type: Number,
            default: 0
        },
        // 手动选择项
        select: {
            type: Number,
            default: 0
        },
        // 测量异常原因
        scanErrors: {
            type: Array,
            default() {
                return []
            }
        },
        // 是否为启动异常
        isStartError: {
            type: Boolean,
            default: false
        },
        // 按钮模式下的确认
        sureBtn: {
            type: Boolean,
            default: false
        },
        // 测量引起的异常
        isMassError: {
            type: Boolean,
            default: false
        },
        // 是否可跳过此测量，默认不可跳过
        canSkip: {
            type: Boolean,
            default: false
        },
        isPro5Error: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['standPeople', 'sucItemNum', 'settingInfo', 'deviceUsable', 'measureInfo', 'deviceInfo']),
        // 选择模式
        btnMode() {
            // 开启手势且手势正常时使用手势识别模式 否则使用按钮模式
            return this.isPro5Error || !this.settingInfo.gestureState || !this.deviceUsable.gesture
        },
        itemsContent() {
            const result = [
                {
                    icon: 'restart',
                    content: this.$t('common.key-select.zhong-xin-ce-liang'),
                    remarks:
                        this.deviceInfo.deviceType === 5
                            ? '再次进行体重测量'
                            : this.standPeople
                            ? this.$t('common.key-select.zhong-xin-ce-liang_desc2')
                            : this.$t('common.key-select.zhong-xin-ce-liang_desc3')
                },
                {
                    icon: 'end',
                    content: this.$t('common.key-select.tiao-guo-ce-liang'),
                    remarks: this.$t('common.key-select.tiao-guo-ce-liang_desc', [this.$t('common.ti-zhong-ce-liang')])
                }
            ]
            if (!this.canSkip) {
                if (this.isPro5Error && this.deviceInfo.deviceType === 5) {
                    result[1].content = this.$t('common.gesture-select.left.cha-kan-bao-gao')
                } else {
                    result[1].content = this.$t('common.key-select.jie-shu-ce-liang')
                }
                result[1].remarks = this.resEndTittle
            }
            return result
        },
        itemsReport() {
            if (!this.canSkip) {
                return [
                    {
                        icon: 'end',
                        content: this.$t('common.key-select.jie-shu-ce-liang'),
                        remarks: this.resEndTittle
                    }
                ]
            }
            return [
                {
                    icon: 'end',
                    content: this.$t('common.key-select.tiao-guo-ce-liang'),
                    remarks: this.$t('common.key-select.tiao-guo-ce-liang_desc', [this.$t('common.ti-zhong-ce-liang')])
                }
            ]
        },
        // 获取结束测量表题
        resEndTittle() {
            // vaPro5提示
            if (this.isPro5Error && this.deviceInfo.deviceType === 5) {
                return this.$t('common.key-select.jie-shu-ce-liang_desc1')
            }
            if (this.standPeople && this.deviceInfo.deviceType !== 5) {
                return this.sucItemNum
                    ? this.$t('common.key-select.jie-shu-ce-liang_desc4')
                    : this.$t('common.key-select.jie-shu-ce-liang_desc5')
            } else {
                return this.sucItemNum
                    ? this.$t('common.key-select.jie-shu-ce-liang_desc1')
                    : this.$t('common.key-select.jie-shu-ce-liang_desc3')
            }
        },
        // 是否包含重启异常
        reStartErrors() {
            // 筛选出当前分类的错误列表
            return this.bottomErrorCode.filter((item) => {
                return item.canRestart
            })
        },
        // 是否为设备异常 包含需要重启的异常或者需要重测的异常为空
        reStartReason() {
            return this.deviceErrors.length > 0
        },
        // 底部异常码
        bottomErrorCode() {
            window.logger.info('去重前的异常原因:', JSON.stringify(this.scanErrors))
            const result = []
            this.scanErrors.map((item) => {
                const l = result.filter((itemR) => itemR.id === item.id)
                if (l.length === 0) {
                    result.push(item)
                }
            })
            window.logger.info('去重后的异常原因:', JSON.stringify(result))
            return result
        },
        // 是否为硬件异常
        deviceErrors() {
            window.logger.info('异常原因:', JSON.stringify(this.bottomErrorCode))
            return this.bottomErrorCode.filter((item) => {
                return !item.canRescan
            })
        },
        audioId() {
            // 可重测
            window.logger.info('重测reStartReason:', this.reStartReason)
            if (!this.reStartReason) {
                // 是否站人状态
                return this.standPeople ? 'weightFail' : 'weightFailNoStand'
            } else {
                // 不可重测 是否有报告 有报告判断是否开启手势
                return !this.sucItemNum ? 'scanErrorEndScan' : 'scanErrorViewReportBtn'
            }
        },
        btnList() {
            let list = []
            // 不可重测
            if (this.reStartReason) {
                // 没有报告
                if (!this.sucItemNum) {
                    list = [
                        {
                            btn: 'switch',
                            msg: '电源'
                        }
                    ]
                } else {
                    list = [
                        {
                            btn: 'switch',
                            msg: '电源'
                        }
                    ]
                }
            } else {
                // 没有报告
                if (!this.sucItemNum) {
                    list = [
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
                } else {
                    list = [
                        {
                            btn: 'switch',
                            msg: '电源'
                        }
                    ]
                }
            }
            return list
        },
        // 标题
        errTitle() {
            return this.isStartError
                ? this.$t('common.error.start-failed-title')
                : this.$t('common.error.scan-failed-title')
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
                if (currentScan.shoulder && currentScan.shoulder.active > 1) {
                    result.push(this.$t('shoulder.jian-bu-gong-neng'))
                }
            }
            if (result.length > 1) {
                return this.$t('item-select.yi-ce-xiang-mu-de')
            } else {
                return this.$t('item-select.result0-ce-liang', result[0] ? [result[0]] : [0])
            }
        },
        // 已成功测量项目
        alreadyLength() {
            let currentScan = this.measureInfo
            let result = []
            if (currentScan) {
                if (currentScan.mass && currentScan.mass.isMeasured) {
                    result.push('身体成分')
                }
                if (currentScan.girth && currentScan.girth.isMeasured) {
                    result.push('体围测量')
                }
                if (currentScan.shape && currentScan.shape.isMeasured) {
                    result.push('体态评估')
                }
                if (currentScan.shoulder && currentScan.shoulder.active > 1) {
                    result.push('肩部功能')
                }
            }
            return result.length
        },
        selectGes() {
            return this.select + 1
        }
    },
    created() {
        const reasonList = this.bottomErrorCode.map((item) => item.name)
        this.$dotMsg({
            action: 'measure',
            msg: 'measure failed',
            project: this.scanType === 0 ? 'weight' : 'mass',
            type: this.isStartError ? 'start error' : 'measure error',
            reason: reasonList.join('、')
        })
        console.log(this.reStartReason, this.sucItemNum, this.select)
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: this.btnList
        })
    },
    mounted() {
        // 播放测量失败语音
        this.$parent.$emit('on-audio-event', 'playAudio', this.audioId)
    },

    methods: {
        onKeyFeedback(active) {
            this.$emit('eventType', active)
        },
        // 返回轮播图页面
        ruturnRunPicPage() {
            if (this.sucItemNum) {
                // 取消手势检测 暂时没有用到
                // handleStopGestureDetectReq()
                this.$changeViewPage('getReport')
            } else {
                this.$changeViewPage('getReport')
            }
        },
        handleReturnIndex() {
            this.$changeViewPage('getReport')
        },
        handleReturnError() {
            this.$changeViewPage('DeviceError')
        },
        // 获取手势返回 1 左 2 右
        gestureFeedback(data) {
            window.logger.info('测量失败组件手势识别成功并取消算法')
            this.select = data - 1
            // 播放识别成功音效
            this.$emit('player-audio', 'gestureEffect', 2)
            this.rescanAndEnd()
        },
        // 按键操作
        rescanAndEnd() {
            console.log(`当前参数${this.btnMode} ${this.select} ${this.reStartReason}`)
            if (!this.btnMode) {
                // 手势
                // 不可重测-跳过  可以重测-重测
                if (this.select === 0) {
                    if (this.reStartReason) {
                        if (this.isPro5Error) {
                            this.$changeViewPage('getReport')
                        } else {
                            this.$changeViewPage('GestureContinue')
                        }
                    } else {
                        this.$emit('scan-error-rescan')
                    }
                }

                // 不可重测-结束  可以重测-跳过
                if (this.select === 1) {
                    console.log('结束测量')
                    this.$changeViewPage('getReport')
                }
            } else {
                // 按键
                if (this.select === 0) {
                    // 重新测量
                    if (this.reStartReason) {
                        if (this.isPro5Error) {
                            this.$changeViewPage('getReport')
                        } else {
                            this.$changeViewPage('ButtonContinue')
                        }
                    } else {
                        this.$emit('scan-error-rescan')
                    }
                }
                // 跳过该项
                if (this.select === 1) {
                    this.$changeViewPage('getReport')
                }
            }
        },
        // 按键事件
        btnClick(btnType) {
            // 任意键结束测量
            // if (!this.canRestartStand && !this.standPeople) {
            //     this.ruturnRunPicPage()
            //     return
            // }
            // 按钮模式下有测量项目
            // if (!this.isShowGestureCard && this.reStartReason) {
            //     this.$changeViewPage('ScanResult')
            // }
            console.log(`当前按键${btnType} ${this.btnMode}  ${this.select}`)
            if (btnType === 1 || btnType === 2) {
                // 上
                // 设备异常不允许操作
                // if (!this.deviceUsable.mass) {
                //     return
                // }
                if (this.select > 0) {
                    this.select = 0
                } else {
                    this.select = 1
                }
            } else if (btnType === 3) {
                this.rescanAndEnd()
                // 返回键 不可重测 结束测量
            } else if (btnType === 7) {
                this.$changeViewPage('getReport')
            }
        },
        // 语音结束
        audioEndCallback(audioId) {
            console.log('audioEndCallback', audioId)
            // 可重测语音结束
            if (audioId === 'weightFail' || audioId === 'weightFailNoStand') {
                // let notRestart = this.bottomErrorCode.filter((item) => {
                //     return item.id === 5
                // })
                // 3s后检测站人则重测
                setTimeout(() => {
                    if (this.standPeople) {
                        // 重新测量
                        // this.$emit('scan-error-rescan')
                    } else {
                        // if (this.alreadyLength > 0) {
                        //     this.$emit('restart-countdown-end')
                        // } else {
                        //     this.$changeViewPage('Home')
                        // }
                        // 倒计时结束
                        this.$emit('restart-countdown-end')
                    }
                }, 3000)
            }
        },
        // 监听控制服务事件
        controlEventListener({ viewStage, data }) {
            if (viewStage === 8) {
                // 下人 反馈测量失败
                if (!data.personStatus && !this.reStartReason) {
                    // 可重试异常中 人离开
                    this.$nextTick(() => {
                        this.$refs.msgCard.startCountDownInter(60)
                    })
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/css" scoped>
.footer-msg {
    position: relative;
    z-index: 101;
    overflow: auto;

    .model-title {
        text-align: center;
        margin-bottom: 24px;
        margin-top: 0;
        font-size: 64px;
        font-family: OPPOSansM;
        font-weight: normal;
        color: #ffffff;
        line-height: 96px;
    }

    .model-content {
        margin: 0 auto 0;
        text-align: center;
        font-size: 48px;
        font-weight: normal;
        color: #ffffff;
        line-height: 72px;
        max-width: 800px;

        span {
            font-family: OPPOSansR;
        }

        i {
            font-size: 65px;
            vertical-align: middle;
            bottom: 10px;
            background: @color-blue;
            color: #ffffff;
            border-radius: 10px;
        }
    }

    .error-code {
        font-size: 40px;
        font-family: OPPOSansR;
        font-weight: normal;
        color: #666666;
        line-height: 72px;
        margin: 0px;

        span {
            font-size: 40px;
        }
    }

    .fail-content {
        width: 100%;
        text-align: center;

        .fail-img {
            margin: 0px;

            // margin-bottom: 1px;
            img {
                width: 480px;
            }
        }

        // &.no-report {
        //     margin-bottom: 550px;
        // }
    }

    .de {
        .btn-operation {
            bottom: 60px !important;
        }
    }

    .scan-error {
        height: 100%;
        position: relative;

        .gesture-operation {
            margin-bottom: 88px;
        }

        .manual-operation {
            display: flex;
            flex-direction: column;
            margin: 178px auto 144px;

            .option-list {
                padding: 40px 0px;
                position: relative;
                margin: 12px 65px;
                display: flex;
                background: @color-background;
                border-radius: 32px;
                border: 2px;

                .option-list-img {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0px 72px;

                    img {
                        width: 96px;
                    }
                }

                &.active {
                    background: @color-blue;
                    border: 2px solid @color-light-blue;

                    .content {
                        color: #ffffff;
                    }

                    .remarks {
                        color: #e7e9f0;
                    }
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

                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }

        .key-select {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 144px;
            margin: 0;
        }

        .btn-operation {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 144px;
            margin: 0;
        }
    }
}

.footer-error {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

.footer-mass-error {
    position: absolute !important;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding-top: 36%;
}
</style>
