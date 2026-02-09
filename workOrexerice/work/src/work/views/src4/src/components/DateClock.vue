<template>
    <div class="date-clock">
        <div v-if="type === 1" class="content">
            <div class="num-item">
                <div class="clock-num">
                    <div class="time-num">{{ hour }}</div>
                    <div class="clock-split">:</div>
                </div>
                <!-- <div class="clock-unit">时</div> -->
            </div>
            <div class="num-item">
                <div class="clock-num">
                    <div class="time-num">{{ minute }}</div>
                    <div class="clock-split">:</div>
                </div>
                <!-- <div class="clock-unit">分</div> -->
            </div>
            <div class="num-item">
                <div class="clock-num">
                    <div class="time-num">{{ second }}</div>
                </div>
                <!-- <div class="clock-unit">秒</div> -->
            </div>
        </div>
        <div v-else class="line-time">
            <span>{{ hour }}</span>
            <span>:</span>
            <span>{{ minute }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DateClock',
    props: {
        // 显示类型 1 首页 时分秒 2 顶部 时分
        type: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            year: '----',
            month: '--',
            day: '--',
            hour: '',
            minute: '',
            second: '',
            clockTimer: null
        }
    },
    created() {
        this.getNowFormatDate()
        this.updateDate(1)
    },
    beforeDestroy() {
        clearInterval(this.clockTimer)
    },
    methods: {
        getNowFormatDate() {
            let date = new Date()
            let month = date.getMonth() + 1
            let strDate = date.getDate()
            let tempHour = date.getHours()
            let hour
            let min
            let seconds
            let tempMin = date.getMinutes()
            let tempSeconds = date.getSeconds()

            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }

            if (tempHour < 10) {
                hour = '0' + tempHour
            } else {
                hour = tempHour
            }

            if (tempMin < 10) {
                min = '0' + tempMin
            } else {
                min = tempMin
            }

            if (tempSeconds < 10) {
                seconds = '0' + tempSeconds
            } else {
                seconds = tempSeconds
            }
            this.year = date.getFullYear()
            this.month = month
            this.day = strDate
            this.hour = hour
            this.minute = min
            this.second = seconds
        },
        updateDate(type) {
            let that = this

            if (type === 1) {
                this.clockTimer = setInterval(function () {
                    that.$nextTick(() => {
                        that.getNowFormatDate()
                    })
                }, 1000)
            } else if (this.clockTimer) {
                clearInterval(this.clockTimer)
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.date-clock {
    display: flex;
    flex-direction: column;
    font-size: 36px;
    .content {
        display: flex;
        justify-content: center;
        .num-item {
            width: 25%;
            display: flex;
            flex-direction: column;
            .clock-num {
                display: flex;
                justify-content: center;
                position: relative;
                .time-num {
                    font-size: 96px;
                    color: #fff;
                }
                .clock-split {
                    position: absolute;
                    right: -20px;
                    font-size: 96px;
                    color: #737d8c;
                    top: -10px;
                }
            }
            .clock-unit {
                display: flex;
                justify-content: center;
                margin-top: 10px;
                font-size: 32px;
                font-family: OPPOSansR;
                font-weight: normal;
            }
        }
    }
    .line-time {
        span {
            font-size: 36px;
            margin: 0;
            vertical-align: middle;
        }
    }
}
</style>
