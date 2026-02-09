<!--
 * @Description: 打印机异常反馈
 * @Author: WendyGao
 * @Date: 2022-02-14 16:58:18
 * @LastEditors: liutq
 * @LastEditTime: 2025-10-14 16:15:03
-->
<template>
    <div class="print-feedback">
        <div class="result-content">
            <div class="result-item">
                <img src="@img/error/printer_error/printer_exception.svg" alt="打印机异常图标" />
                <p class="print-title animated fast fadeInUp">
                    {{ $t('scan-result.printer-error.da-yin-ji-wei-jiu-xu') }}
                </p>
                <!-- TODO：字体大小 -->
                <p class="print-message animated fast fadeInUp">
                    {{ $t('scan-result.printer-error.da-yin-ji-wei-jiu-xu_desc') }}
                </p>
                <p v-if="pageStatus === 2" class="print-msg animated fast fadeInUp">
                    <svg aria-hidden="true">
                        <use xlink:href="#icon-plus-one" />
                    </svg>
                    <span class="print-text">
                        {{ $t('scan-result.printer-error.print-added') }}
                    </span>
                </p>
            </div>
        </div>
        <!-- 底部提醒 -->
        <div class="bottom-msg">
            <transition name="fade-move" mode="out-in" appear>
                <!-- 继续打印提醒 -->
                <key-select
                    v-if="pageStatus === 1"
                    :items="keySelectItems"
                    :select="select"
                    @on-key-feedback="confirmSelection"
                ></key-select>
                <!-- 新用户提醒 -->
                <msg-card key="register" v-if="pageStatus === 2 && isNewOne" class="register-info">
                    <ul slot="info-content">
                        <li>{{ $t('scan-result.result.msg-card.new-user') }}</li>
                    </ul>
                </msg-card>
            </transition>
        </div>
        <cut-down-load
            v-if="pageStatus === 1"
            ref="scanCutDown"
            @cut-down-over="countdownCallback"
            :duration="30"
            :suffixType="1"
        ></cut-down-load>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MsgCard from '@/components/MsgCard.vue'
import KeySelect from '@/components/KeySelect.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
export default {
    name: 'PrintFeedBack',
    components: {
        MsgCard,
        KeySelect,
        CutDownLoad
    },
    data() {
        return {
            // 倒计时
            clockNum: 60,
            pageStatus: 1,
            // 加入打印队列后倒计时
            printOverTimer: null,
            // 加入打印队列后倒计时时间
            printClockNum: 5,
            // 是否打印
            isPrint: false,
            keySelectItems: [
                {
                    icon: 'printer',
                    content: this.$t('scan-result.result.key-select.ji-xu-da-yin'),
                    remarks: this.$t('scan-result.result.key-select.ji-xu-da-yin_desc')
                },
                {
                    icon: 'end',
                    content: this.$t('scan-result.result.key-select.qu-xiao-da-yin'),
                    remarks: this.$t('scan-result.result.key-select.qu-xiao-da-yin_desc')
                }
            ],
            select: 0
        }
    },
    computed: mapGetters(['isNewOne', 'measureInfo', 'settingInfo']),
    created() {
        this.$store.commit('CHANGE_SCAN_STATE', false)
        this.$store.commit('CHANGE_PAGE_INFO', {
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
        })
        this.$emit('on-audio-event', 'playAudio', 'printError')
    },
    beforeDestroy() {
        clearInterval(this.printOverTimer)
        // 离开清空异常队列
        this.$store.commit('CLEAR_SCAN_ERRORS')
    },
    methods: {
        // 添加打印状态数据
        addPrint() {
            if (!this.isPrint) {
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    printType: 0
                })
            }
            // 添加打印队列
            this.$store.commit('PUSH_REPORT_LIST', true)
        },
        // 加入打印队列后倒计时
        runPrintOverClock() {
            if (this.printOverTimer) {
                clearInterval(this.printOverTimer)
            }
            this.printOverTimer = setInterval(() => {
                this.printClockNum--
                if (this.printClockNum === 0) {
                    this.addPrint()
                    this.$changeViewPage('Home')
                    clearInterval(this.printOverTimer)
                }
            }, 1000)
        },
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                if (this.select > 0) {
                    this.select = 0
                } else {
                    this.select = 1
                }
                // 下
            } else if (btnType === 2) {
                if (this.select < 1) {
                    this.select = 1
                } else {
                    this.select = 0
                }
            } else if (btnType === 3) {
                this.confirmSelection(this.select)
            } else if (btnType === 7) {
                this.addPrint()
                this.$changeViewPage('Home')
            }
            console.log(this.select)
        },
        confirmSelection(select) {
            this.select = select
            setTimeout(() => {
                this.select = -1
                if (select === 0 && this.pageStatus === 1) {
                    this.$store.commit('CHANGE_PAGE_INFO', {
                        btnList: [
                            {
                                btn: 'switch',
                                msg: '电源'
                            }
                        ]
                    })
                    // 打印
                    this.isPrint = true
                    this.pageStatus = 2
                    if (this.isNewOne) {
                        this.$emit('on-audio-event', 'playAudio', 'addPrintNewUser')
                    } else {
                        this.$emit('on-audio-event', 'playAudio', 'addPrintOldUser')
                    }
                    this.runPrintOverClock()
                } else {
                    this.addPrint()
                    this.$changeViewPage('Home')
                }
            }, 200)
        },
        // 卡片倒计时回调函数
        countdownCallback() {
            // 打印
            this.addPrint()
            this.$changeViewPage('Home')
            clearInterval(this.printOverTimer)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.print-feedback {
    .result-content {
        margin-top: 583px;
        .result-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                margin-left: 50px;
                width: 288px;
            }
            .print-title {
                width: 614px;
                text-align: center;
                font-size: 64px;
                font-family: 'OPPOSansM';
                font-weight: normal;
                line-height: 96px;
                margin: 58px auto 18px;
            }
            .print-message {
                font-size: 36px;
                font-family: 'OPPOSansR';
                font-weight: normal;
                color: #e7e9f0;
                line-height: 48px;
                margin: 0 auto 24px auto;
                max-width: 1000px;
                text-align: center;
            }
            .print-msg {
                width: 700px;
                font-size: 36px;
                font-family: 'OPPOSansR';
                font-weight: normal;
                color: #e7e9f0;
                line-height: 48px;
                margin: 0 auto 24px auto;
                text-align: center;
                svg {
                    width: 48px;
                    height: 48px;
                    margin-right: 8px;
                    vertical-align: top;
                }
                .print-text {
                    font-size: 32px;
                    font-family: 'OPPOSansR';
                    font-weight: normal;
                    color: #cccccc;
                    line-height: 48px;
                }
            }
        }
    }
    .bottom-msg {
        position: absolute;
        bottom: 0;
        width: 100%;
        .info-msg {
            margin: 0;
            font-size: 36px;
            font-family: 'OPPOSansR';
            font-weight: normal;
            color: #e7e9f0;
            line-height: 56px;
            i {
                font-size: 42px;
            }
        }
        .register-info {
            margin-bottom: 144px;
        }
    }
}
</style>
