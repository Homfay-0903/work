<!--
 * @Description: 设备开关机
 * @Author: WendyGao
 * @Date: 2022-02-14 14:37:06
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2025-10-24 15:10:23
-->
<template>
    <div class="content">
        <img
            class="shut-down2"
            v-if="type === 'on' && !devicePre && healthPackageEnable === 2"
            src="@/assets/img/shutdown/powerup2.png"
            alt="开机动画"
        />
        <img
            class="shut-down"
            v-else-if="type === 'on' && deviceInfo.deviceType === 3"
            src="@/assets/img/shutdown/logo.svg"
            alt="开机动画"
        />
        <img
            class="shut-down"
            v-else-if="type === 'on' && !devicePre"
            src="@/assets/img/shutdown/powerUp.png"
            alt="开机动画"
        />
        <img
            class="shut-down2"
            v-if="type === 'off' && this.deviceInfo.healthPackageEnable === 2"
            src="@/assets/img/shutdown/shutdown2.png"
            alt="关机动画"
        />
        <img
            class="shut-down2"
            v-else-if="type === 'off' && deviceInfo.deviceType === 3"
            src="@/assets/img/shutdown/logo.svg"
            alt="关机动画"
        />
        <img class="shut-down" v-else-if="type === 'off'" src="@/assets/img/shutdown/shutDown.png" alt="关机动画" />
        <!-- <video
            id="on"
            v-if="this.type === 'on'"
            src="media-file://video/device-switch/powerUp.mp4"
            @ended="videoEnd(6)"
            name="开机动画"
            preload="auto"
            width="100%"
        >
            您的浏览器不支持 video 标签。
        </video> -->
        <!-- <video
            id="off"
            v-else
            src="media-file://video/device-switch/shutDown.mp4"
            @ended="videoEnd(7)"
            name="关机动画"
            preload="auto"
            width="100%"
        >
            您的浏览器不支持 video 标签。
        </video> -->
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'
import localConfig from '@/config/local'
import { deleteFile } from '@/util'
export default {
    name: 'DeviceSwitch',
    data() {
        return {
            type: 'on'
        }
    },
    computed: {
        ...mapGetters(['deviceInfo', 'emergencyStop', 'updateInfo', 'standPeople']),
        typeInfo() {
            const map = {
                on: '开机动画',
                off: '关机动画'
            }
            return map[this.type]
        },
        devicePre() {
            return this.deviceInfo.deviceId.substring(0, 2) === '50'
        }
    },
    created() {
        this.type = this.$route.query.type
        this.healthPackageEnable = localConfig.getItem('_vf_healthPackageEnable') || 0
        window.logger.info('healthPackageEnable:', localConfig.getItem('_vf_healthPackageEnable'))
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            // 屏幕状态改变
            if (type === 'ScreenStatus') {
                // 关屏后关机
                if (data === 2) {
                    deleteFile()
                    // this.$hardwareClient.screenBright(-1)
                    setTimeout(() => {
                        this.$controlClient.deviceClose()
                        localConfig.removeItem('_vf_healthPackageEnable')
                    }, 1.5 * 1000)
                }
            }
        })
        if (this.devicePre && this.type === 'on') {
            this.videoEnd()
        } else {
            setTimeout(() => {
                this.videoEnd()
            }, 1000 * 5)
        }
    },
    methods: {
        // playVideo() {
        //     window.logger.info(`播放视频: ${this.typeInfo}`)
        //     const video = document.getElementById(this.type)
        //     if (video !== null) {
        //         try {
        //             const playPromise = video.play() // 播放
        //             if (playPromise) {
        //                 playPromise
        //                     .then(() => {
        //                         window.logger.info('播放视频: 成功')
        //                     })
        //                     .catch((err) => {
        //                         window.logger.error(`视频出错: ${err.name}:`, err.message)
        //                     })
        //             }
        //         } catch (err) {
        //             window.logger.error('视频出错:', err)
        //         }
        //     } else {
        //         window.logger.error(`无效视频: ${this.typeInfo}`)
        //     }
        // },
        videoEnd() {
            window.logger.info(`视频结束: ${this.typeInfo}`)
            if (this.type === 'on') {
                // 设备回滚失败 不可用
                if (this.deviceInfo.status === 2) {
                    // 回滚失败页面
                    this.$store.commit('CHANGE_UPDATE_INFO', {
                        rollBackStatus: 2
                    })
                    this.$changeViewPage('RollBackClient')
                    // 如果急停被按下则跳转到制动
                } else if (this.emergencyStop) {
                    this.$changeViewPage('Emergency')
                    // 如果有更新 跳转到更新页面
                } else if (this.updateInfo.hasNewVer) {
                    // 更新中页面
                    this.$store.commit('CHANGE_UPDATE_INFO', {
                        updStatus: 0
                    })
                    this.$changeViewPage('UpdateClient')
                } else {
                    // 跳转到自检页面
                    if (!this.standPeople) {
                        this.$changeViewPage('CheckSelf')
                    } else {
                        this.$changeViewPage('ResetPage', { type: false })
                    }
                }
            } else {
                // 关闭屏幕请求
                this.$hardwareClient.screenCtrl(2)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.content {
    text-align: center;
    .shut-down {
        width: 786px;
        height: 114px;
        margin-top: 868px;
    }
    .shut-down2 {
        width: 1000px;
        height: 200px;
        margin-top: 700px;
    }
}
</style>
