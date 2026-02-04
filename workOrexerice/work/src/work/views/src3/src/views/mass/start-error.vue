<!--
 * @Author: yangsheng
 * @Date: 2022-04-08 19:30:06
 * @LastEditTime: 2022-04-14 15:30:38
 * @LastEditors: WendyGao
 * @Description: 身体成分启动失败
 * @FilePath: /vr-3.0-device-client/src/views/error/massStartErr.vue
-->
<template>
    <div class="mass-scan">
        <!-- 底部提醒 -->
        <div class="info">
            <!-- 启动失败 -->
            <transition name="fade-move" mode="out-in" appear>
                <!-- 非倒计时 测量准备中状态 -->
                <!-- 测量失败 -->
                <error-card
                    key="scanErr"
                    ref="scanErrCard"
                    :scanType="1"
                    :scanErrors="scanErrors"
                    :isStartError="true"
                ></error-card>
            </transition>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ErrorCard from './components/ErrorCard.vue'

export default {
    name: 'MassStartErr',
    components: {
        ErrorCard
    },
    data() {
        return {
            // 测量异常
            scanErrors: []
        }
    },
    computed: {
        ...mapGetters(['standPeople', 'measureInfo', 'deviceUsable', 'deviceErrors', 'sucItemNum']),
        currentAudio() {
            return this.sucItemNum ? 14 : 12
        }
    },
    created() {
        window.logger.info('进入体成分启动异常页面')
        // events.emit('playAudio', this.currentAudio)
        if (!this.deviceUsable.mass) {
            // scanErrIds
            let scanErrIds = []
            if (this.scanErrors.length) {
                this.scanErrors.forEach((v) => {
                    scanErrIds.push(v.id)
                })
            }

            this.deviceErrors.forEach((v) => {
                if (v.affectBm && !scanErrIds.includes(v.id)) {
                    this.scanErrors.push(v)
                }
            })
        }
        window.logger.info('体成分异常列表', this.scanErrors, this.deviceErrors)
    },
    mounted() {},
    beforeDestroy() {},
    methods: {
        // 按键事件
        btnClick(btnType) {
            if (this.$refs.scanErrCard && this.$refs.scanErrCard.btnClick) {
                this.$refs.scanErrCard.btnClick(btnType)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.mass-scan {
    .info {
        position: absolute;
        top: 580px;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        z-index: 101;
        margin: auto;
    }
}
</style>
