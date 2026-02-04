<!--
 * @Description: 身体成分体重秤引导页面
 * @Author: wangmingdong
 * @Date: 2020-02-04 11:39:03
 * @LastEditTime: 2026-01-06 19:50:13
 * @LastEditors: liutq
 -->
<template>
    <div class="mass-guide">
        <div class="center-img">
            <!-- <img src="@img/weight/foot_table_com.png" class="foot-img" alt="脚底板" />
            <img v-if="showfoot" src="@img/weight/foot_table_twinkle.png" class="twinkle-foot" alt="脚印" /> -->
            <img v-if="deviceInfo.teenagerIsOpen" class="fade-png" src="@/assets/img/shape/guideTurntab_t.png" alt="" />
            <img
                v-else-if="this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2"
                class="foot-img"
                src="@/assets/img/shape/guideTurntablemm.png"
                alt=""
            />
            <img
                v-else-if="this.deviceInfo.deviceType === 5"
                class="foot-img"
                src="@/assets/img/shape/guideTurntablemm.png"
                alt=""
            />
            <img v-else class="foot-img" src="@/assets/img/shape/guideTurntable.png" alt="" />
        </div>
        <div class="tip-info">
            <transition name="fade-move" appear>
                <msg-card key="successEnd" class="success">
                    <ul slot="info-content">
                        <li class="msg">{{ $t('mass.weight.guide1') }}</li>
                        <li class="msg">{{ $t('mass.weight.guide2') }}</li>
                    </ul>
                </msg-card>
            </transition>
        </div>
        <cut-down-load @cut-down-over="cutDownOver" :duration="30" :suffixType="2"></cut-down-load>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MsgCard from '@/components/MsgCard.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import { EventBus } from '@/util/event-bus'
export default {
    name: 'WeightGuide',
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.query?.typeSort) {
                vm.updateNavMeta(Number(to.query.typeSort))
            }
            // if (to.query?.typeSort) {
            //     const type = to.query?.typeSort
            //     if (type == 3) {
            //         to.meta.nav.prev = 'navigation-bar.wu-dian-liu'
            //     } else if (type == 1) {
            //         to.meta.nav.prev =
            //             vm.deviceInfo.deviceType === 3
            //                 ? 'common.ti-zhong-ce-liang'
            //                 : this.settingInfo.combineMeasureEnable
            //                 ? '身体评估'
            //                 : 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
            //     }
            // }
        })
    },
    components: {
        MsgCard,
        CutDownLoad
    },
    data() {
        return {
            clockNum: 0,
            clockTimer: null,
            // 日志启动时间戳
            logTimestap: new Date().getTime(),
            // 脚印闪烁
            showfoot: true,
            // 脚印倒计时开关
            isShow: false,
            // 是否可跳过此测量
            canSkip: true
        }
    },
    computed: {
        ...mapGetters(['standPeople', 'deviceErrors', 'measureInfo', 'deviceUsable', 'deviceInfo', 'settingInfo'])
    },
    watch: {
        // 监听站人状态
        standPeople: {
            handler(val) {
                this.standPeopleHandler(val)
            },
            deep: true
        },
        // 监听设备异常
        deviceErrors: {
            handler(val) {
                this.deviceErrorsHandler(val)
            },
            deep: true
        }
    },
    created() {
        // if (this.$route.query.typeSort == 3) {
        //     console.log(this.$route.meta.nav.prev)
        //     this.$route.meta.nav.prev == '123456'
        //     console.log(this.$route, 9888)
        // }
        // this.measureInfo.isMeasureWd && this.measureInfo.isMeasureWu
        if (this.$route.query?.typeSort) {
            if (
                this.deviceInfo.deviceType === 5 &&
                parseInt(this.$route.query?.typeSort) == 1 &&
                this.measureInfo.isMeasureWu
            ) {
                window.logger.info('无电流测量完成进入体围测量' + this.$route.query.canSkip)
            } else if (this.measureInfo.isMeasureWd || this.measureInfo.isMeasureWu) {
                this.$changeViewPage('Acquire', { typeSort: this.$route.query.typeSort })
            }
        }
        window.logger.info('进入体重转盘引导页' + this.$route.query.canSkip)
        this.canSkip = this.$route.query.canSkip === true
        this.$store.commit('CHANGE_SCAN_STATE', true)
        // 播放金属电极片引导语音
        this.$emit('on-audio-event', 'playAudio', 'standPeopleGuide')
        // 检测体重硬件异常
        this.goToStartError()
        // 启动脚印闪烁
        this.startTime()
        this.$store.commit('CHANGE_MEASURE_INFO', {
            weight: { isMeasured: true }
        })
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ]
        })
        this.$algClient.closeDepthCamera()
    },
    mounted() {
        // 监听检测结果
        EventBus.$on('EventAction', async (type, result) => {
            if (type === 'StandState' && result) {
                this.standPeopleHandler(result)
            }
        })
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
        this.clearClockTimer()
    },
    methods: {
        updateNavMeta(type) {
            if (type === 3) {
                // this.$route.meta.nav.prev = 'navigation-bar.wu-dian-liu'
                this.$route.meta.nav.prev = '项目选择'
            } else if (type === 1) {
                this.$route.meta.nav.prev =
                    this.deviceInfo.deviceType === 3
                        ? 'common.ti-zhong-ce-liang'
                        : // : this.settingInfo.combineMeasureEnable && this.settingInfo.triMode
                          // ? '身体评估'
                          '测量准备'
            }
        },
        // 体围异常处理逻辑
        goToStartError() {
            if (!this.deviceUsable.weight) {
                this.$changeViewPage('ButtonContinue')
            }
        },
        clearClockTimer() {
            if (this.clockTimer) {
                this.clockNum = 0
                clearInterval(this.clockTimer)
            }
        },
        // 定时检测
        runSecondClock(second, fn) {
            this.clockNum = 0
            this.clearClockTimer()

            this.clockTimer = setInterval(() => {
                this.clockNum++

                if (this.clockNum === second && fn) {
                    fn()
                }
            }, 1000)
        },
        // 倒计时结束
        cutDownOver() {
            this.$changeViewPage('getReport')
        },
        // 判断启动还是提醒
        readyJump() {
            // 即将启动测量
            if (this.standPeople) {
                // 如果站人 播放启动测量
                // if (!this.deviceUsable.weight) {
                //     this.$changeViewPage('GirthGuide')
                // } else {
                this.$changeViewPage('WeightMeasure', { canSkip: this.canSkip, typeSort: this.$route.query.typeSort })
                // }
            } else {
                // 如果未站人 5s后重新播放引导语音
                this.runSecondClock(5, () => {
                    // 播放金属电极片引导语音
                    this.$emit('on-audio-event', 'playAudio', 'standPeopleGuide')
                })
            }
        },
        // 语音结束
        audioEndCallback(file) {
            if (file === 'standPeopleGuide') {
                this.readyJump()
            }
        },
        // 开始倒计时
        startTime() {
            this.startCountDownInter(6)
            clearInterval(this.showFootCountDown)
            this.showFootCountDown = setInterval(() => {
                if (this.isShow) {
                    return
                } else {
                    this.startCountDownInter(6)
                }
            }, 2500)
        },
        // 启动脚印闪烁倒计时计时器
        startCountDownInter(count) {
            this.clearCountDownInter()
            this.isShow = true
            if (count > 0) {
                this.countDownInter = setInterval(() => {
                    if (count === 1) {
                        this.showfoot = true
                        this.isShow = false
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        count--
                        this.showfoot = !this.showfoot
                    }
                }, 200)
            }
        },
        // 销毁脚印闪烁倒计时计时器
        clearCountDownInter() {
            clearInterval(this.countDownInter)
        },
        // 站人处理程序
        standPeopleHandler(personStatus) {
            // 如果站人跳转到体重测量页面
            if (personStatus) {
                this.clearClockTimer()
                this.readyJump()
            }
        },
        // 设备异常处理程序
        deviceErrorsHandler(errors) {
            if (errors.length) {
                //  体重模块硬件异常
                this.goToStartError()
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.mass-guide {
    margin-top: 463px;

    .center-img {
        line-height: 700px;
        text-align: center;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .foot-img {
            width: 316px;
            height: auto;
            position: relative;
        }

        .twinkle-foot {
            position: absolute;
            z-index: 1;
            width: 212px;
            bottom: 950px;
        }
    }

    .tip-info {
        position: absolute;
        bottom: 130px;
        margin: 0 auto;
        left: 0;
        right: 0;

        .success {
            .title {
                font-size: 64px;
                font-family: OPPOSansM;
                font-weight: normal;
                color: #ffffff;
                line-height: 96px;
            }

            .msg {
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #ffffff;
                line-height: 72px;
                margin: 0 auto;
                // text-align: center;
            }
        }
    }
}
</style>
