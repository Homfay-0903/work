<template>
    <div class="reset-box">
        <div class="reset-int" v-if="!type && isStandPeople">
            <img v-if="deviceInfo.deviceType === 5" src="@/assets/img/foreign-body-md-apro5.png" alt="" />
            <img v-else src="@/assets/img/foreign-body-md@2x.png" alt="" />
            <span class="content-title">{{ $t('reset.content-title') }}</span>
            <div class="content-tip">
                <img src="@/assets/img/alarm-warning-line@2x.png" alt="" class="tip-img" />
                <span>{{ $t('reset.content-tip') }}</span>
            </div>
        </div>
        <div v-else>
            <div class="reset-int-js">
                <span>{{ $t('reset.title') }}</span>
                <img v-if="deviceInfo.teenagerIsOpen" src="@/assets/img/body-height.png" alt="" />
                <img v-else-if="deviceInfo.deviceType === 5" src="@/assets/img/body-js-new-apro5.png" alt="" />
                <img v-else src="@/assets/img/body-js-new.png" alt="" />
            </div>
            <tip-card class="reset-int-card" type="gray-p" title-icon="1" :title="$t('reset.title-tips')"></tip-card>
        </div>
    </div>
</template>
<script>
import TipCard from './home/components/TipCard.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'ResetPage',
    components: {
        TipCard
    },
    computed: {
        ...mapGetters(['standPeople', 'deviceInfo'])
    },
    data() {
        return {
            type: false, // 设备初始中
            isStandPeople: true // 跳转页面
        }
    },
    watch: {
        standPeople: {
            handler(val) {
                if (val === false) {
                    this.jumpPage()
                }
            },
            deep: true
        }
    },
    created() {
        this.type = this.$router.currentRoute.query.type
        if (this.$router.currentRoute.query.isStandPeople) {
            this.isStandPeople = !this.$router.currentRoute.query.isStandPeople
        }
        window.logger.info(`当前传入值${this.$router.currentRoute.query.standPeople} ${this.standPeople}`)
        const queryParam = this.$router.currentRoute.query.standPeople
        if (!this.standPeople && queryParam) {
            this.jumpPage()
        }
    },
    mounted() {
        if (!this.type) {
            this.$emit('on-audio-event', 'playAudio', 'deviceInt')
        } else {
            this.$emit('on-audio-event', 'playAudio', 'deviceRec')
        }
    },
    methods: {
        jumpPage() {
            if (this.type == false && this.isStandPeople) {
                this.$changeViewPage('CheckSelf')
            } else {
                this.$changeViewPage('Home')
            }
        }
    }
}
</script>
<style lang="less" scoped>
.reset-box {
    overflow: hidden;

    .reset-int {
        text-align: center;

        img {
            margin: 565px 297px 168px 297px;
            display: inline-block;
            width: 485px;
            height: 323px;
        }

        .content-title {
            display: inline-block;
            text-align: center;
            font-size: 64px;
            font-family: OPPOSans-M, OPPOSans;
            font-weight: normal;
            color: #649cff;
            line-height: 96px;
        }

        .content-tip {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            margin-left: 60px;
            margin-right: 60px;
            margin-top: 24px;

            .tip-img {
                // display: inline-block;
                width: 40px;
                height: 40px;
                margin: 6px 16px 0px 0px;
                // padding-right: 16px;
                // vertical-align: middle;
            }

            span {
                display: inline-block;
                font-size: 36px;
                font-family: OPPOSans-R, OPPOSans;
                font-weight: normal;
                color: #e7e9f0;
                line-height: 56px;
                text-align: left;
            }
        }
    }

    .reset-int-js {
        text-align: center;
        margin-top: 168px;

        img {
            // margin: 541px 297px 73px 297px;
            display: inline-block;
            width: 627px;
            height: 912px;
        }

        span {
            display: inline-block;
            width: 900px;
            height: 192px;
            font-size: 64px;
            font-family: OPPOSans-R, OPPOSans;
            font-weight: normal;
            color: #e7e9f0;
            line-height: 96px;
        }
    }

    .reset-int-card {
        margin-top: 190px;
    }
}
</style>
