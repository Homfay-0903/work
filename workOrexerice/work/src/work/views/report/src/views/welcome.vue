<!--
 * @Description: 站人事件 欢迎页（倒计时）
 * @Author: wangmingdong
 * @Date: 2019-09-06 17:38:09
 * @LastEditTime: 2025-12-16 19:03:11
 * @LastEditors: liutq
 -->
<template>
    <div :class="dynamicClass">
        <p :class="[`${$i18n.locale}-describe`, 'describe']">
            {{ $t('welcome.huan-ying-ti-yan') }}
        </p>
        <p class="bottom-info" v-if="this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2">
            「 麦澜德佳澜 | 维塑3D智能体测镜 」
        </p>
        <p class="bottom-info-logo" v-else-if="deviceInfo.deviceType === 5 && deviceInfo.logoUrl">
            <img :src="deviceInfo.logoUrl" alt="" />
        </p>
        <p class="bottom-info" v-else>{{ $t('welcome.product-name-va') }}</p>
        <p
            class="bottom-info"
            v-if="deviceInfo.deviceType === 5 && deviceInfo.logoUrl && this.deviceInfo.healthPackageEnable !== 2"
        >
            「 3D智能体测镜 」
        </p>
    </div>
</template>
<script>
import router from '@/router'
import { mapGetters } from 'vuex'
export default {
    name: 'Welcome',
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'deviceInfo', 'initMesInfo']),
        dynamicClass() {
            if (this.deviceInfo.healthPackageEnable === 2) {
                return 'welcome-content2'
            } else if (!this.deviceInfo.logoUrl) {
                return 'welcome-content'
            } else {
                return 'welcome-conten-logo'
            }
        },
        playNoLogo() {
            if (
                this.deviceInfo.deviceType === 5 &&
                this.deviceInfo.logoUrl &&
                this.deviceInfo.healthPackageEnable !== 2
            ) {
                return true
            } else {
                return false
            }
        }
    },
    data() {
        return {
            title: this.$t('welcome.product-name')
        }
    },
    mounted() {
        // 启动测量类型 1 按键进入 2 站上体重秤 3 地垫站人
        // const startupType = ['button', 'weight', 'mat']
        // this.$dotMsg({
        //     action: 'measure',
        //     msg: 'start measure',
        //     type: startupType[this.$route.query.startupType - 1] || 'none'
        // })
        window.logger.info(`当前语言环境${this.$i18n.locale}`)
        // 进入欢迎页后证明 不是由自检引起的网络异常
        this.$store.commit('CHANGE_DEVICE_INFO', { reSelfCheck: false })
        // let audieName = 'welcome'
        // if (this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 3) {
        //     audieName = 'welcome_a'
        //     this.title = this.$t('welcome.product-name-va')
        // }
        if (
            this.deviceInfo.deviceType === 5 &&
            this.deviceInfo.healthPackageEnable === 2 &&
            this.deviceInfo.teenagerIsOpen
        ) {
            this.$emit('on-audio-event', 'playAudio', 'welcome_a_j')
        } else {
            if (this.playNoLogo) {
                this.$emit('on-audio-event', 'playAudio', 'welcome_nologo')
            } else {
                this.$emit('on-audio-event', 'playAudio', 'welcome_a')
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        // 进入当前组件  当前组件不存在  this不存在
        if (from.name === 'Home') {
            next()
        } else {
            router.go(-1)
        }
    },
    methods: {
        // 语音结束
        audioEndCallback(audioId) {
            // apro5 升高测了开启进身高测量页
            if (['welcome', 'welcome_a', 'shutDownInUse', 'welcome_a_j', 'welcome_nologo'].includes(audioId)) {
                if (this.settingInfo.heightOpen && this.deviceInfo.deviceType === 5) {
                    this.$changeViewPage('HeightPrepare')
                    return
                }
            }
            if (
                audioId === 'welcome' ||
                audioId === 'welcome_a' ||
                audioId === 'welcome_a_j' ||
                audioId === 'welcome_nologo'
            ) {
                // 根据启动方式类型跳转页面
                // 按钮触发 跳转到项目选择页
                if (this.$route.query.startupType === 1) {
                    // this.$changeViewPage('ButtonSelect', { startupType: 1 })
                    setTimeout(() => {
                        this.startMeasuring()
                    }, 1000)
                    // 体重秤触发 跳转到体成分测量
                }
                // else if (this.$route.query.startupType === 2) {
                //     this.measureInfo.unScanItems.shift()
                //     setTimeout(() => {
                //         this.$changeViewPage('')
                //     }, 1000)
                //     // 地毯触发 跳转到项目引导选择页
                // }
                else {
                    setTimeout(() => {
                        this.startMeasuring()
                    }, 1000)
                }
            } else if (audioId === 'shutDownInUse') {
                setTimeout(() => {
                    this.startMeasuring()
                }, 1000)
            }
        },
        startMeasuring() {
            window.logger.info('startMeasuring')
            window.logger.info('startMeasuring', `麦澜德 startMeasuring:${this.initMesInfo.unScanItems}`)
            // if (this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2) {
            //     window.logger.info('麦澜德 直接发起测量', `麦澜德 直接发起测量:${this.initMesInfo.unScanItems}`)
            //     window.logger.info(
            //         '麦澜德 直接发起测量',
            //         `麦澜德 直接发起测量:${this.isExactMatch(this.initMesInfo.unScanItems, [1, 3])}`
            //     )
            //     if (this.isExactMatch(this.initMesInfo.unScanItems, [1, 3])) {
            //         // 麦澜德 只有体重 体围直接进入测量
            //         window.logger.info('麦澜德 直接发起测量')
            //         this.touchScreenTimer('ZhunBei', { typeSort: 1 })
            //     } else {
            //         this.$changeViewPage(this.deviceInfo.deviceType === 5 ? 'StandUpSelectPro5' : 'StandUpSelect')
            //     }
            // } else {
            //     this.$changeViewPage(this.deviceInfo.deviceType === 5 ? 'StandUpSelectPro5' : 'StandUpSelect')
            // }
            this.$changeViewPage(this.deviceInfo.deviceType === 5 ? 'StandUpSelectPro5' : 'StandUpSelect', {
                params: {
                    wecomePage: true
                }
            })
        },
        touchScreenTimer(page, query) {
            const setTimer = setInterval(() => {
                this.$changeViewPage(page, query)
                this.type = 0
                window.clearInterval(setTimer)
            }, 300)
        },
        isExactMatch(arr, targetArr) {
            return JSON.stringify(arr) === JSON.stringify(targetArr)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.welcome-content2,
.welcome-conten-logo {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    background: url('../assets/img/weclome2.jpg') no-repeat;
    background-size: 100%;
    color: #cccccc;
}
.welcome-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    background: url('../assets/img/welcome.jpeg') no-repeat;
    background-size: 100%;
    color: #cccccc;
}
.welcome-conten-logo {
    background: none;
}
.describe {
    position: absolute;
    top: 850px;
    font-size: 50px;
    font-family: OPPOSansR;
    text-align: center;
    animation: slowUp 0.8s linear;
}

.zh-describe {
    left: 275px;
    top: 880px !important;
    font-size: 35px !important;
    letter-spacing: 130px;
}

.en-describe {
    letter-spacing: 2px;
}

.bottom-info {
    position: absolute;
    margin: 0;
    bottom: 150px;
    font-size: 40px;
    font-family: OPPOSansR;
}
.bottom-info-logo {
    position: absolute;
    margin: 0;
    font-size: 40px;
    font-family: OPPOSansR;
    overflow: hidden;
    margin-top: 608px;
    width: 800px;
    height: 240px;
    img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        margin: 0 auto;
        object-fit: contain;
    }
}
// @keyframes slowUp {
//     from {
//         top: 1000px;
//         opacity: 0;
//     }
//     to {
//         top: 900px;
//         opacity: 1;
//     }
// }
</style>
