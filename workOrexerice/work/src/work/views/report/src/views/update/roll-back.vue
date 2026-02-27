<!--
 * @Description: 版本回滚页面
 * @Author: gaoyuanyuan
 * @Date: 2019-12-16 15:17:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-18 19:56:02
 -->
<template>
    <div class="update-client">
        <!-- <button @click="test()" style="position: absolute; z-index: 2000">test</button> -->
        <!-- 回滚 -->
        <div class="roll-back">
            <transition name="fade" mode="out-in">
                <!-- 回滚中 -->
                <div key="progress" v-if="status === 0" class="progress-spin">
                    <img src="@img/update/update_spin.svg" class="spin running animated fast fadeIn" alt="回滚图标" />
                    <img src="@img/update/shadow_bg.svg" class="icon-border" alt="回滚图标" />
                </div>
                <!-- 回滚成功 -->
                <img
                    key="success"
                    v-else-if="status === 1"
                    src="@img/update/upd_success.svg"
                    class="icon-border"
                    alt="回滚成功"
                />
                <!-- 回滚失败 -->
                <img key="failed" v-else src="@img/update/roll_failed.svg" class="icon-border" alt="回滚失败" />
            </transition>
        </div>

        <!-- 标题 -->
        <p v-if="title" class="animated fast fadeInUp">{{ title }}</p>
        <!-- 提醒 -->
        <p v-if="msg" class="animated fast fadeInUp msg">
            <span>{{ msg }}</span>
        </p>
        <!-- 底部提醒 -->
        <div class="info">
            <transition name="fade-move" mode="out-in">
                <msg-card v-if="openTipBox" type="info">
                    <ul slot="info-content">
                        <!-- <li style="margin-bottom: 24px">{{ tip }}</li> -->
                        <!-- <li>请勿断电关机</li> -->
                        <li>{{ $t('update.tips0') }}</li>
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
    name: 'RollBackClient',
    components: {
        MsgCard
    },
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['updateInfo']),
        // 回滚状态 0 回滚中/更新失败 1 回滚完成/成功 2 回滚失败
        status() {
            return this.updateInfo.rollBackStatus
        },
        title() {
            return this.status === 0
                ? this.$t('update.title.failed')
                : this.status === 1
                ? this.$t('update.title.rolled-back')
                : this.$t('update.title.roll-back-failed')
        },
        msg() {
            return this.status === 0 ? '' : this.status === 1 ? this.$t('update.tips2') : this.$t('update.tips3')
        },
        tip() {
            return this.$t('update.tips0')
        },
        tipTwo() {
            return this.status === 0 ? '更新过程中请勿断电关机' : ''
        },
        // 底部提醒弹窗
        openTipBox() {
            return this.tip !== '' ? true : false
        }
    },
    created() {
        // NOTE: 包含客户端的更新需要重启，重启前需要关闭屏幕等待更新服务重启设备
        // 包含客户端的更新
        if (this.status === 1) {
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
        // 更新进度处理
        handleUpdateProgress(data) {
            // 更新失败 回滚中
            if (data.state === 6) {
                this.$store.commit('CHANGE_UPDATE_INFO', {
                    rollBackStatus: 0
                })
                // 回滚成功
            } else if (data.state === 4) {
                this.$store.commit('CHANGE_UPDATE_INFO', {
                    rollBackStatus: 1
                })
                // 不包含客户端的更新
                // 2s后关闭屏幕 防止重启设备后出现桌面
                setTimeout(() => {
                    // 关闭屏幕请求
                    this.$hardwareClient.screenCtrl(2)
                }, 2000)
                // 回滚失败
            } else if (data.state === 5) {
                this.$dotMsg({ action: 'update', msg: 'rollback failed' })
                this.$store.commit('CHANGE_UPDATE_INFO', {
                    rollBackStatus: 2
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
        background: #ffffff;
        &-step {
            height: calc(100% - 8px);
            margin: 4px;
            background-color: #1d6cf5;
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
                #ffffff 25%,
                #ffffff 25%,
                transparent 25%,
                transparent 50%,
                #ffffff 50%,
                #ffffff 75%,
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
        .progress-spin {
            display: flex;
            justify-content: center;
            align-items: center;
        }
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
        color: #e7e9f0;
        line-height: 96px;
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
