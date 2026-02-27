<!--
 * @Description: 
 * @Author: fanyunbo
 * @Date: 2024-09-04 14:10:37
 * @LastEditTime: 2024-09-08 15:27:33
 * @LastEditors: liutq
 * @Reference: 
-->
<template>
    <div class="run-box">
        <!-- <button @click="gainn()">anna</button> -->
        <h2>即将结束测量</h2>
        <div class="run-num">{{ cutdown }}</div>
        <!-- 底部提醒 -->
        <div>
            <transition name="fade-move" mode="out-in" appear>
                <msg-card class="tip">
                    <ul slot="info-content">
                        <li>返回转台可继续测量</li>
                    </ul>
                </msg-card>
            </transition>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MsgCard from '@/components/MsgCard.vue'
export default {
    name: 'RunTime',
    components: {
        MsgCard
    },
    data() {
        return {
            cutdown: 10,
            timer: null
        }
    },
    computed: {
        ...mapGetters(['standPeople']),
        isStand() {
            return this.standPeople
        }
    },
    watch: {
        isStand: {
            handler(val) {
                if (val) {
                    window.clearInterval(this.timer)
                    window.history.go(-1)
                }
            },
            deep: true
        }
    },
    mounted() {
        this.$emit('on-audio-event', 'playAudio', 'runTime')
        this.timer = setInterval(() => {
            this.cutdown--
            if (this.cutdown === 0) {
                window.clearInterval(this.timer)
                this.$changeViewPage('getReport')
            }
        }, 1000)
    },
    methods: {
        gainn() {
            this.$store.commit('CHANGE_STAND_PEOPLE', true)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.run-box {
    margin-top: 264px;
    h2 {
        font-weight: normal;
        font-size: 64px;
        color: #ffffff;
        line-height: 96px;
        text-align: center;
    }
    .run-num {
        width: 1080px;
        height: 1218px;
        background: url('../../assets/img/runBack@2x.png');
        background-size: 100%, 100%;
        font-weight: 200;
        font-size: 560px;
        color: #ffffff;
        line-height: 1218px;
        text-align: center;
        font-family: Akrobat-ExtraLight;
        font-style: normal;
    }
}
</style>
