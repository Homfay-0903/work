<!--
 * @Description: 
 * @Author: fanyunbo
 * @Date: 2024-09-04 14:10:37
 * @LastEditTime: 2024-09-06 18:51:07
 * @LastEditors: liutq
 * @Reference: 
-->
<template>
    <div class="ac-box">
        <div class="ac-box-icon">
            <img src="@/assets/img/qidong.png" alt="" />
        </div>
        <!-- 底部提醒 -->
        <div :class="['ac-bottom', { 'device-pro5': deviceInfo.deviceType === 5 }]">
            <img src="@/assets/img/sucessicon.svg" alt="" />
            <div class="ac-bottom-info">
                <div class="ac-bottom-h">已获取相关数据</div>
                <h6>等待 [{{ desc }}] 生成…</h6>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'acquire',
    beforeRouteEnter(to, from, next) {
        if (to.query?.typeSort) {
            const type = to.query?.typeSort
            if (type == 3) {
                to.meta.nav.prev = 'navigation-bar.wu-dian-liu'
                to.meta.nav.title = 'navigation-bar.wu-dian-liu'
            } else if (type == 1) {
                to.meta.nav.prev = 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
                to.meta.nav.title = 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
            }
        }
        next()
    },
    data() {
        return {
            cutdown: 10,
            timer: null,
            desc: '无电流营养分析报告'
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'deviceInfo'])
    },
    mounted() {
        const typeSort = parseInt(this.$route.query?.typeSort)
        if (typeSort) {
            if (typeSort == 1) {
                this.desc = '身体成分围度测量'
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    isMeasureWd: true,
                    mass: { isMeasurement: true, status: true, isMeasured: true }
                })
            } else if (typeSort == 3) {
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    isMeasureWu: true,
                    nutrition: 1,
                    unScanItems: this.measureInfo.unScanItems.filter((e) => {
                        return e !== 3
                    })
                })
            }
        }
        this.playAudio()
        this.jump()
    },
    methods: {
        playAudio() {
            this.$emit('on-audio-event', 'playAudio', 'getData')
        },
        jump() {
            const timer = setTimeout(() => {
                this.$changeViewPage('GestureContinue')
                window.clearTimeout(timer)
            }, 5 * 1000)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.ac-box {
    margin-top: 567px;
    .ac-box-icon {
        text-align: center;
        img {
            width: 642px;
            height: 642px;
            margin: 0 auto;
        }
    }
    .ac-bottom {
        margin: 183px auto 0;
        position: relative;
        width: 960px;
        height: 432px;
        background: #1f2429;
        border-radius: 32px;
        text-align: center;
        // border: 1px solid #1f2429;
        &.device-pro5 {
            background: #565656;
        }
        .ac-bottom-info {
            width: 100%;
            height: 432px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .ac-bottom-h {
            margin-top: 120px;
            font-weight: normal;
            font-size: 64px;
            color: #ffffff;
            font-style: normal;
        }
        h6 {
            font-weight: normal;
            font-size: 36px;
            color: #0088ff;
            margin-top: 48px;
            font-style: normal;
        }
        img {
            position: absolute;
            top: -48px;
            left: 48px;
            width: 120px;
            height: 96px;
        }
    }
}
</style>
