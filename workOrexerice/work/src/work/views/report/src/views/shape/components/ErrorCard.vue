<!--
 * @Description: 体态、体围测量过程异常
 * @Author: yangsheng
 * @Date: 2020-03-06 10:58:03
 * @LastEditTime: 2024-07-08 11:55:52
 * @LastEditors: DonWang wangwenqiu@suanier.com
 -->
<template>
    <div class="scan-error">
        <div class="error-content">
            <img src="@/assets/img/shape/fail.png" class="fail" alt="失败图标" />
            <p class="content-title">
                {{ errTitle }}
                <!-- {{  }} -->
            </p>
            <!-- <p v-else class="content-title">{{ isTimeout ? '测量超时' : '测量失败' }}</p> -->
            <!-- 硬件异常 -->
            <template v-if="errType === 1">
                <!-- 有成功的报告 -->
                <!-- <p v-if="sucItemNum" class="content-msg">
                    {{ $t('common.error.device-err-desc[0]') }}
                    请点击
                    <i class="iconfont icon-success"></i>
                    键查看报告！
                </p> -->
                <!-- 转台离线 -->
                <p v-if="isTableOffLine" class="content-msg" style="width: 864px, margin: 0px 108px">
                    {{ $t('common.error.device-err-desc[3]') }}
                </p>
                <!-- 深度相机硬件异常 -->
                <p v-else-if="isContain" class="content-msg">{{ $t('common.error.device-err-desc[2]') }}</p>
                <p v-else class="content-msg">
                    {{ canNotRestart ? $t('common.error.device-err-desc[1]') : $t('common.error.device-err-desc[0]') }}
                </p>
                <p class="error-code" v-if="shapeErrors.length">
                    {{ $t('common.error.err-code', [shapeErrors.map((item) => item.title).join('、')]) }}
                    <!-- {{
                        deviceInfo.deviceType === 5 && (isContain || canNotRestart)
                            ? ''
                            : $t('common.error.err-code', [shapeErrors.map((item) => item.title).join('、')])
                    }} -->
                </p>
            </template>
            <!-- 测量异常 -->
            <p v-if="errType === 2 && shapeErrors.length" class="content-msg">
                {{ `${shapeErrors[0].title}！` }}
            </p>
        </div>
        <!-- 测量异常 -->
        <div class="error-bottom">
            <!-- 手动选择 -->
            <div v-if="useBtn || errType === 1">
                <key-select :items="keySelectItems" :select="select" @on-key-feedback="confirmSelection"></key-select>
            </div>
            <!-- 手势选择 -->
            <div v-else-if="useGesture && errType === 2" class="gesture-operation">
                <gesture-select
                    :select="selectGes"
                    @on-gesture-feedback="onGestureCallback"
                    :leftText="leftText"
                    backgroundColor="#454f58"
                    :rightText="$t('common.gesture-select.right.jie-shu-ce-liang')"
                ></gesture-select>
            </div>
        </div>
        <!-- 售后联系二维码 -->
        <error-contact-card
            v-if="deviceInfo.deviceType === 5 && (isContain || canNotRestart) && errType === 1 && isTableOffLine"
            key="timeout"
            title="扫码联系售后"
            :errorCode="shapeErrors.map((item) => item.title).join('、')"
        ></error-contact-card>
        <cut-down-load
            ref="deviceErrCutDown"
            v-if="errType === 1"
            @cut-down-over="ruturnRunPicPage"
            :backSuffix="false"
            :duration="15"
            :suffixType="3"
        ></cut-down-load>
        <cut-down-load
            ref="scanErrCutDown"
            v-else
            @cut-down-over="ruturnRunPicPage"
            :duration="60"
            :suffixType="2"
        ></cut-down-load>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GestureSelect from '@/components/GestureSelect.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import KeySelect from '@/components/KeySelect.vue'
import ErrorContactCard from '@/components/ErrorContactCard.vue'
export default {
    name: 'ShapeErrorCard',
    components: {
        GestureSelect,
        CutDownLoad,
        KeySelect,
        ErrorContactCard
    },
    props: {
        // 类型 0 体态 1 体围
        scanType: {
            type: Number,
            default: 0
        },
        // 手动/手势模式 0手动   1手势
        selectMode: {
            type: Number,
            default: 0
        },
        // 测量失败类型 0无 1 不可重测硬件异常 2 可重测人为异常
        errType: {
            type: Number,
            default: 0
        },
        // 体态异常
        shapeErrors: {
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
        // 是否为超时失败
        isTimeout: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 按钮模式下 0 第一项 1 第二项 手势模式下 0 左 1 右
            select: 0,
            // 手动文字显示
            btnText: '',
            // 左手手势文案
            leftText: '',
            // 是否包含深度相机异常
            isContain: false,
            // 是否包括转台离线
            isTableOffLine: false,
            // 按键选项
            keySelectItems: [],
            selectGes: 0
        }
    },
    computed: {
        ...mapGetters(['standPeople', 'settingInfo', 'sucItemNum', 'deviceUsable', 'deviceInfo']),
        // 标题
        errTitle() {
            // scan-failed-title
            return !this.isStartError
                ? this.$t('common.error.scan-failed-title')
                : this.errType === 2
                ? this.$t('common.error.start-failed-timeout')
                : this.$t('common.error.start-failed-title')
        },
        // 是否包含重启异常
        reStartErrors() {
            // 筛选出当前分类的错误列表
            return this.shapeErrors.filter((item) => {
                return item.canRestart
            })
        },
        canNotRestart() {
            // 是否存在不能重启的异常
            return this.shapeErrors.find((item) => {
                return item.canRestart === false
            })
        },
        // 使用按钮选择
        useBtn() {
            // 按钮模式且是人为异常
            return this.selectMode === 0 && (this.errType === 2 || this.sucItemNum)
        },
        // 使用手势选择
        useGesture() {
            // 手势模式且人为异常或硬件异常有报告
            return this.selectMode === 1 && (this.errType === 2 || (this.errType === 1 && this.sucItemNum))
        },
        // 手势是否可用
        gestureUsable() {
            // 按键启动的后续选择全部使用按键
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        }
    },
    created() {
        const reasonList = this.shapeErrors.map((item) => item.name)
        this.$dotMsg({
            action: 'measure',
            msg: 'measure failed',
            project: this.scanType ? 'shape' : 'girth',
            type: this.isStartError ? 'start error' : 'measure error',
            reason: reasonList.join('、')
        })
        let pageInfo = {}
        this.shapeErrors.forEach((v) => {
            if (v.title === '0011') {
                this.isTableOffLine = true
            }
            if (v.title === '0007') {
                this.isContain = true
            }
        })
        // 测量失败原因是否为不可重测的设备异常
        if (this.errType === 1) {
            // 已有成功项目
            if (this.sucItemNum) {
                pageInfo = {
                    btnList: [
                        {
                            btn: 'check',
                            msg: '查看报告'
                        },
                        {
                            btn: 'return',
                            msg: '结束测量'
                        }
                    ]
                }
                if (this.selectMode === 0 || this.isContain || this.isTableOffLine) {
                    this.keySelectItems = [
                        {
                            icon: 'report',
                            content: this.$t('common.gesture-select.left.cha-kan-bao-gao'),
                            remarks: this.$t('common.key-select.jie-shu-ce-liang_desc1')
                        }
                    ]
                    // 播放按钮语音
                    this.$emit('player-audio', 'scanErrorViewReportBtn')
                } else {
                    // 播放手势语音
                    this.$emit('player-audio', 'scanErrorViewReportGesture')
                }
                this.leftText = this.$t('common.gesture-select.left.cha-kan-bao-gao')
            } else {
                pageInfo = {
                    btnList: [
                        {
                            btn: 'return',
                            msg: '结束测量'
                        }
                    ]
                }
                // 播放结束测量
                this.$emit('player-audio', 'scanErrorEndScan')
            }
            // 可重测
        } else {
            // 按钮
            if (this.selectMode === 0) {
                this.onBtnSelect()
                if (this.isStartError) {
                    // 启动失败
                    this.$emit('player-audio', 'startUpErrorFailReScanBtn_touch')
                } else {
                    // 测量失败
                    this.$emit('player-audio', 'failReScanBtn')
                }
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
                if (this.isStartError) {
                    // 启动失败
                    // this.$emit('player-audio', 'startUpErrorFailReScanGesture')
                } else {
                    // 测量失败
                    this.$emit('player-audio', 'failReScanGesture')
                }
                // const setTimer = setInterval(() => {
                //     this.$emit('player-audio', 'failReScanGesture')
                //     window.clearInterval(setTimer)
                // }, 500)
                setTimeout(() => {
                    if (this.selectMode === 0) {
                        this.onBtnSelect()
                    }
                }, 500)
            }
            this.leftText = this.$t('common.gesture-select.left.zhong-xin-ce-liang')
        }
        this.$store.commit('CHANGE_PAGE_INFO', pageInfo)
    },
    methods: {
        // 返回轮播图页面
        ruturnRunPicPage() {
            this.$changeViewPage('getReport')
        },
        // 按钮模式下的list信息
        onBtnSelect() {
            const pageInfo = {
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
            this.keySelectItems = [
                {
                    icon: 'restart',
                    content: this.$t('common.key-select.zhong-xin-ce-liang'),
                    remarks: this.$t('common.key-select.zhong-xin-ce-liang_desc1', [
                        this.scanType ? this.$t('shape.ti-wei-ce-liang') : this.$t('shape.ti-tai-ce-liang')
                    ])
                }
            ]
            // 体成分成功
            if (this.sucItemNum) {
                this.keySelectItems.push({
                    icon: 'end',
                    content: this.$t('common.key-select.jie-shu-ce-liang'),
                    remarks: this.$t('common.key-select.jie-shu-ce-liang_desc1')
                })
            } else {
                // 都失败
                this.keySelectItems.push({
                    icon: 'end',
                    content: this.$t('common.key-select.jie-shu-ce-liang'),
                    remarks: this.$t('common.key-select.jie-shu-ce-liang_desc3')
                })
            }
            // this.$emit('player-audio', 'failReScanBtn')
            // const setTimer = setInterval(() => {
            //     this.$emit('player-audio', 'failReScanBtn')
            //     window.clearInterval(setTimer)
            // }, 600)
            this.$store.commit('CHANGE_PAGE_INFO', pageInfo)
        },
        // 手势组件响应回调处理 1 左 2 右
        onGestureCallback(data) {
            window.logger.info(`体态测量失败组件${data === 1 ? '左手' : '右手'}识别成功`)
            this.selectGes = data
            this.select = data - 1
            // 播放识别成功音效
            this.$emit('player-audio', 'gestureEffect', 2)
            this.handleGestureConfirm()
        },
        // 手势识别确认逻辑
        handleGestureConfirm() {
            // 硬件异常并且有成功项时
            if (this.errType === 1 && this.sucItemNum) {
                // 左手查看报告
                if (this.select === 0) {
                    this.$changeViewPage('getReport')
                    // 右手直接结束
                } else {
                    this.ruturnRunPicPage()
                }
                // 可重测
            } else {
                // 左手重新测量
                if (this.select === 0) {
                    this.$emit('scan-error-rescan')
                    // 右手结束测量-判断是否有成功项目
                } else {
                    if (this.sucItemNum) {
                        this.$changeViewPage('getReport')
                    } else {
                        this.ruturnRunPicPage()
                    }
                }
            }
        },
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                // 使用按钮 上下切换
                if (this.useBtn) {
                    if (this.select > 0) {
                        this.select = 0
                    } else {
                        this.select = 1
                    }
                }
                if (this.gestureUsable) {
                    if (this.selectGes > 1) {
                        this.selectGes = 1
                    } else {
                        this.selectGes = 2
                    }
                }
                // 下
            } else if (btnType === 2) {
                // 使用按钮 上下切换
                if (this.useBtn) {
                    if (this.select < 1) {
                        this.select = 1
                    } else {
                        this.select = 0
                    }
                }
                if (this.gestureUsable) {
                    if (this.selectGes < 2 && this.selectGes != 0) {
                        this.selectGes = 2
                    } else {
                        this.selectGes = 1
                    }
                }
                // 确定
            } else if (btnType === 3) {
                // 手势按键选择
                if (this.gestureUsable && this.selectGes) {
                    this.select = this.selectGes - 1
                    this.handleGestureConfirm()
                } else {
                    this.confirmSelection(this.select)
                }
                // 返回
            } else if (btnType === 7) {
                // 统一返回首页 由首页处理异常跳转逻辑
                this.$changeViewPage('getReport')
            }
        },
        confirmSelection(select) {
            this.select = select
            setTimeout(() => {
                this.select = -1
                // 硬件异常不可重测时 确认键查看报告
                if (this.errType === 1 && this.sucItemNum) {
                    // 查看报告
                    this.$changeViewPage('getReport')
                    // 人为异常 可重测时根据选择处理确认后的逻辑
                } else if (this.errType === 2) {
                    // 重新测量
                    if (select === 0) {
                        this.$emit('scan-error-rescan')
                        // 结束测量
                    } else {
                        if (this.sucItemNum) {
                            this.$changeViewPage('getReport')
                        } else {
                            this.ruturnRunPicPage()
                        }
                    }
                }
            }, 200)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/css" scoped>
.scan-error {
    position: relative;
    z-index: 101;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .error-content {
        position: relative;
        margin-top: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 480px;
        }

        p {
            margin: 0;
            text-align: center;
        }

        .content-title {
            // margin-top: 48px;
            font-size: 64px;
            font-family: OPPOSansM;
            font-weight: normal;
            color: #ffffff;
        }

        .content-msg {
            margin-top: 24px;
            font-size: 48px;
            font-family: OPPOSansR;
            font-weight: normal;
            color: #ffffff;
            width: 864px;
            line-height: 72px;
            z-index: 102;

            i {
                font-size: 56px;
                vertical-align: text-bottom;
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
            margin-top: 10px;

            span {
                font-size: 40px;
            }
        }
    }

    .error-bottom {
        position: absolute;
        width: 100%;
        bottom: 0;

        .manual-operation {
            display: flex;
            flex-direction: column;
            margin: 0 auto 144px;

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

        .gesture-operation {
            margin-bottom: 86px;
        }
    }
}
</style>
