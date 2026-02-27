<!--
 * @Description: 版本更新页面
 * @Author: gaoyuanyuan
 * @Date: 2019-12-16 15:17:34
 * @LastEditors: WendyGao
 * @LastEditTime: 2022-04-14 11:36:53
 -->
<template>
    <div class="update-client">
        <transition name="fade" mode="out-in">
            <!-- 更新中&更新完成 -->
            <div key="progress" v-if="status === 0" class="progress-bar">
                <div :style="{ width: `${progress}` }" class="progress-bar-step">
                    <div class="progress-bar-stripe"></div>
                </div>
            </div>
            <div key="progress-2" v-else-if="status === 1" class="progress-bar">
                <div style="width: 100%" class="progress-bar-step2">
                    <div class="progress-bar-stripe2"></div>
                </div>
            </div>
            <!-- 更新成功 -->
            <div key="back" v-else class="roll-back">
                <img src="@img/update/upd_success.svg" class="icon-border" alt="更新成功" />
            </div>
        </transition>
        <!-- 标题 -->
        <p v-if="title" class="animated fast fadeInUp">
            <span class="title">{{ title }}</span>
            <!-- <span class="fuTitle">{{ fuTitle }}</span> -->
        </p>
        <!-- 提醒 -->
        <p v-if="msg" :class="['animated', 'fast', 'fadeInUp', 'msg']">
            <svg v-if="status === 4" aria-hidden="true">
                <use xlink:href="#icon-warn" />
            </svg>
            <span>{{ msg }}</span>
        </p>
        <!-- 底部提醒 -->
        <div class="info">
            <transition name="fade-move" mode="out-in">
                <msg-card v-if="openTipBox" type="info">
                    <ul slot="info-content">
                        <!-- <li v-if="status === 0">请勿断电关机</li> -->
                        <li v-if="status === 0">{{ $t('update.tips4') }}</li>
                    </ul>
                </msg-card>
            </transition>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'
import MsgCard from '@/components/MsgCard.vue'
export default {
    name: 'UpdateClient',
    components: {
        MsgCard
    },
    data() {
        return {
            // 单个服务占比
            servicePercent: 0,
            // 进度条定时器
            progressTimer: null,
            dataResult: 0
        }
    },
    computed: {
        ...mapGetters(['updateInfo']),
        // 更新状态 0 更新中 1 更新完成 2 更新成功
        status() {
            return this.updateInfo.updStatus
        },
        // 更新服务总数
        num() {
            return this.updateInfo.services
        },
        percent() {
            return this.servicePercent.toFixed(1)
        },
        title() {
            return this.status === 0
                ? this.$t('update.title.updating', [this.percent])
                : this.status === 1
                ? this.$t('update.title.complete')
                : this.$t('update.title.success')
        },
        fuTitle() {
            return this.status === 0 ? this.$t('update.sub-title') : ''
        },
        msg() {
            return this.status === 2 ? this.$t('update.tips2') : ''
        },
        tip() {
            return this.status === 0 ? this.$t('update.tips0') : ''
        },
        tipTwo() {
            return this.status === 0 ? this.$t('update.tips1') : ''
        },
        progress() {
            return this.percent >= 100 ? 'calc(100% - 8px)' : `${this.percent}%`
        },
        // 底部提醒弹窗
        openTipBox() {
            return this.tip !== '' ? true : false
        }
    },
    watch: {
        percent: {
            handler(newVal) {
                const serviceProgress = 100 / this.updateInfo.services
                const serProgress = serviceProgress - 0.1 + this.dataResult
                if (Number(newVal) > serProgress) {
                    clearInterval(this.progressTimer)
                    this.servicePercent = serProgress
                }
            },
            deep: true
        }
    },
    created() {
        // NOTE: 包含客户端的更新需要重启，重启前需要关闭屏幕等待更新服务重启设备
        this.progressStyle(this.num)
        if (this.status === 0) {
            // 发起更新
            this.$updateClient.startUpdateTask()
            // 包含客户端的更新
        } else if (this.status === 2) {
            // 2s后关闭屏幕 防止重启设备后出现桌面
            setTimeout(() => {
                // 关闭屏幕请求
                this.$hardwareClient.screenCtrl(2)
            }, 2000)
        }
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            if (type === 'UpdateProgress') {
                this.handleUpdateProgress(data)
            }
        })
    },
    // 离开页面
    beforeDestroy() {
        EventBus.$off('EventAction')
    },
    methods: {
        // 进度条变化
        progressStyle(num) {
            if (!this.progressTimer) {
                this.progressTimer = setInterval(() => {
                    const services = 100 / num
                    this.servicePercent += services / 240
                }, 1000)
            }
        },
        // 更新进度处理
        handleUpdateProgress(data) {
            // 更新中
            if (data.state === 3) {
                this.dataResult = data.percent
                // 进度更新中
                this.servicePercent = data.percent
                this.$store.commit('CHANGE_UPDATE_INFO', {
                    updStatus: this.servicePercent === 100 ? 1 : 0,
                    updNumber:
                        this.updateInfo.updNumber >= this.updateInfo.services
                            ? this.updateInfo.services
                            : this.updateInfo.updNumber + 1
                })
                const services = 100 / this.updateInfo.services
                if (this.progressTimer) {
                    clearInterval(this.progressTimer)
                    this.servicePercent = data.percent
                    this.progressTimer = setInterval(() => {
                        this.servicePercent += services / 240
                    }, 1000)
                } else {
                    this.servicePercent = data.percent
                    this.progressTimer = setInterval(() => {
                        this.servicePercent += services / 240
                    }, 1000)
                }
                // 更新成功
            } else if (data.state === 1) {
                this.servicePercent = 100
                this.$store.commit('CHANGE_UPDATE_INFO', {
                    updStatus: 2
                })
                // 不包含客户端的更新
                // 2s后关闭屏幕 防止重启设备后出现桌面
                setTimeout(() => {
                    // 关闭屏幕请求
                    this.$hardwareClient.screenCtrl(2)
                }, 2000)
                // 更新失败 回滚中 跳转到回滚页面
            } else if (data.state === 2) {
                this.$store.commit('CHANGE_UPDATE_INFO', {
                    rollBackStatus: 0
                })
                this.$changeViewPage('RollBackClient')
                this.$dotMsg({
                    action: 'update',
                    msg: 'update failed'
                })
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.update-client {
    .progress-bar {
        width: 962px;
        height: 50px;
        margin: 840px auto 96px;
        border: 2px solid #1d6cf5;
        border-radius: 50em;
        background: #000000;
        &-step {
            height: calc(100% - 8px);
            margin: 4px;
            background-color: #363637;
            overflow: hidden;
            border-radius: 50em;
            transition: width 0.6s ease;
        }
        &-stripe {
            height: 100%;
            width: calc(100% + 200px);
            border-radius: 50em;
            background-size: 40px 40px;
            background-image: linear-gradient(
                135deg,
                #629dfb 25%,
                #629dfb 25%,
                transparent 25%,
                transparent 50%,
                #629dfb 50%,
                #629dfb 75%,
                transparent 75%,
                transparent 100%
            );
            animation: counter-progress 4s linear infinite;
        }
        &-step2 {
            height: calc(100% - 8px);
            margin: 4px;
            background-color: #000000;
            overflow: hidden;
            border-radius: 50em;
            transition: width 0.6s ease;
        }
        &-stripe2 {
            height: 100%;
            width: calc(100% + 200px);
            border-radius: 50em;
            background-size: 40px 40px;
            background-image: linear-gradient(
                135deg,
                #0589ff 25%,
                #0589ff 25%,
                transparent 25%,
                transparent 50%,
                #0589ff 50%,
                #0589ff 75%,
                transparent 75%,
                transparent 100%
            );
            animation: counter-progress 4s linear infinite;
        }
    }
    .roll-back {
        margin: 555px auto 29px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-border {
            width: 346px;
        }
        .spin {
            position: absolute;
            width: 85px;
            height: 85px;
            transform: rotate(0deg);
        }
        .paused {
            animation-play-state: paused;
        }
        .running {
            animation: spin 2s linear infinite;
            animation-play-state: running;
        }
    }
    p {
        margin: 0;
        text-align: center;
        font-size: 64px;
        font-family: OPPOSansM;
        font-weight: normal;
        line-height: 96px;
        color: #e7e9f0;
        span {
            display: block;
        }
        span.title {
            font-size: 64px;
        }
        span.fuTitle {
            font-size: 36px;
            color: #ffffff;
            margin-top: 20px;
            font-family: OPPOSansR;
        }
        &.msg {
            font-family: OPPOSansR;
            margin-top: 25px;
            svg {
                width: 36px;
                height: 36px;
                vertical-align: middle;
            }
            span {
                font-size: 40px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #cccccc;
                line-height: 72px;
            }
        }
        &.blue-text {
            span {
                color: #0088ff;
            }
        }
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
@keyframes counter-progress {
    0% {
        transform: translateX(-200px);
    }
    100% {
        transform: translateX(0);
    }
}
</style>
