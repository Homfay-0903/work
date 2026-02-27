<!--
 * @Description: 体成分历史趋势
 * @Author: gaoyuanyuan
 * @Date: 2020-01-06 14:59:40
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-01-18 14:30:57
 -->
<template>
    <div class="mass-trend">
        <h2>历史趋势</h2>
        <div :class="isTangCenBei ? 'trend-items1' : 'trend-items'">
            <div class="item">
                <p>
                    <span class="name">体重</span>
                    <em>kg</em>
                </p>
                <div class="info">
                    <div id="weight"></div>
                </div>
            </div>
            <div class="item">
                <p>
                    <span class="name">肌肉量</span>
                    <em>kg</em>
                </p>
                <div class="info">
                    <div id="muscle"></div>
                </div>
            </div>
            <div class="item">
                <p>
                    <span class="name">体脂率</span>
                    <em>%</em>
                </p>
                <div class="info">
                    <div id="body-fat"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { bmMassTrendInfo } from '@/assets/js/apolloGql.js'
export default {
    name: 'MassTrend',
    props: {
        // 用户id
        memberId: {
            type: Number,
            default: 0
        },
        // 设备id
        deviceId: {
            type: String,
            default: '0'
        },
        // 测量时间（趋势范围）
        scanTime: {
            type: String,
            default: 0
        },
        // kangbeijian
        isTangCenBei: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            init: [0, 0, 0, 0, 0, 0, 0, 0],
            scanTimes: [],
            // 体重
            WT: [],
            // 肌肉量
            LM: [],
            // 体脂肪率
            PBF: [],
            loaded: 0
        }
    },
    created() {
        this.bmMassTrendInfo()
    },
    methods: {
        setEcharts(cla, arr, scanTimes) {
            let myChart = this.$echarts.init(document.getElementById(cla), null, { devicePixelRatio: 2.5 })
            const width = '80%'
            const interval = scanTimes.length === 1 ? 10 : 0
            let options = {
                grid: {
                    // x: scanTimes.length === 1 ? 14 : 26,
                    // y: 10,
                    // x2: 26,
                    // y2: 15,
                    top: '18px',
                    bottom: '28px',
                    containLabel: false,
                    height: function () {
                        return '10px'
                    },
                    width,
                    right: '14px',
                    left: '18px'
                    // width: `${width}px`
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    show: true,
                    data: scanTimes,
                    // 设置为类目的序数
                    max: 5,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval,
                        formatter: function (value) {
                            if (!value) {
                                return
                            }
                            let ret = '' // 拼接加\n返回的类目项
                            let maxLength = 5 // 每项显示文字个数
                            let valLength = value.length // X轴类目项的文字个数
                            let rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                            if (rowN > 1) {
                                // 如果类目项的文字大于4,
                                for (let i = 0; i < rowN; i++) {
                                    let temp = '' // 每次截取的字符串
                                    let start = i * maxLength // 开始截取的位置
                                    let end = start + maxLength // 结束截取的位置
                                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧 replace(/\/$/, '') replace('/', '')
                                    temp = value.substring(start, end).replace(/\/$/, '') + ','
                                    ret += temp // 凭借最终的字符串
                                }
                                // console.log(ret.split(',')[1] + '\n' + ret.split(',')[0])
                                return ret.split(',')[1] + '\n' + ret.split(',')[0]
                            } else {
                                return value
                            }
                        },
                        fontFamily: 'OPPOSans M',
                        color: '#999999',
                        fontSize: '8px'
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    // min: 'dataMin',
                    // max: 'dataMax',
                    min: function (value) {
                        if (value.max - value.min > 8) {
                            return value.min
                        } else {
                            return (value.max + value.min) / 2 - 4
                        }
                    },
                    max: function (value) {
                        if (value.max - value.min > 8) {
                            return value.max
                        } else {
                            return (value.max + value.min) / 2 + 4
                        }
                    },
                    show: false,
                    minInterval: '5'
                },
                series: [
                    {
                        type: 'line',
                        data: arr,
                        symbol: 'circle',
                        symbolSize: 5,
                        // 空白数据连线
                        connectNulls: true,
                        silent: true,
                        itemStyle: {
                            normal: {
                                color: '#5698F5'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#5698F5',
                                width: 0.8
                            }
                        },
                        label: {
                            normal: {
                                formatter: params => {
                                    if (params.data > 99.99) {
                                        return '{valueMax|' + params.data + '}'
                                    } else {
                                        return '{valueMin|' + params.data + '}'
                                    }
                                },
                                rich: {
                                    valueMax: {
                                        fontSize: 10
                                    },
                                    valueMin: {
                                        fontSize: 12
                                    }
                                },
                                show: true,
                                position: 'top',
                                color: '#5698F5',
                                offset: [0, 3],
                                fontSize: 10,
                                textBorderColor: '#FFFFFF',
                                textBorderWidth: '2px'
                            }
                        }
                    }
                ]
            }
            myChart.setOption(options)
            myChart.on('finished', () => {
                this.loaded++
                if (this.loaded === 3) {
                    console.log('MASS_TREND_OVER')
                    this.$emit('load-mass-report')
                }
            })
        },
        // 体成分趋势
        async bmMassTrendInfo() {
            const userInfo = {
                memberId: this.memberId,
                scanTime: this.scanTime,
                deviceId: this.deviceId
            }
            await this.$apollo
                .query({
                    query: bmMassTrendInfo,
                    variables: userInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.bmMassTrendInfo
                    if (info.code === 200) {
                        const massData = info.data
                        massData.forEach((mass, idx) => {
                            // 只取前6组
                            if (idx < 6) {
                                const scanTime = mass.scanTime.replace(/-/g, '/').split(' ')[0]
                                // .slice(2)
                                this.scanTimes.unshift(scanTime)
                                this.WT.unshift(mass.data.WT.v.toFixed(1))
                                this.LM.unshift(mass.data.LM.v.toFixed(1))
                                this.PBF.unshift(mass.data.PBF.v.toFixed(1))
                            }
                        })
                    }
                    this.$nextTick(() => {
                        this.setEcharts('weight', this.WT, this.scanTimes)
                        this.setEcharts('muscle', this.LM, this.scanTimes)
                        this.setEcharts('body-fat', this.PBF, this.scanTimes)
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>
<style lang="less" scoped>
.mass-trend {
    margin-top: 10px;

    h2 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-family: OPPOSans R;
        font-weight: normal;
        color: #333333;
        line-height: 32px;
    }

    .trend-items, .trend-items1 {
        display: flex;

        .item {
            padding-bottom: 4px;
            border-right: 1px solid #5698f5;
            border-bottom: 1px solid #5698f5;

            p {
                margin: 0px;
                line-height: 24px;
                background: rgba(242, 248, 255, 1);
                border-bottom: 1px solid #5698f5;
                border-top: 1px solid #5698f5;

                .name {
                    margin: 0 0 0 6px;
                    font-size: 15px;
                    font-family: OPPOSans M;
                    font-weight: 500;
                    color: #333333;
                    line-height: 20px;
                }

                em {
                    font-size: 12px;
                    font-family: OPPOSans R;
                    font-weight: normal;
                    font-style: normal;
                    color: #666666;
                    line-height: 16px;
                }
            }

            &:first-of-type {
                border-left: 1px solid #5698f5;
            }

            .info {
                background: url('../assets/images/forms.svg') no-repeat 6px 14px;
                background-size: 90% 105px;
            }
        }
    }
    .trend-items1 {
        .item{
           width: 33.333%;
           p {
            line-height: 30px;
           }
        }
    }
}

#weight,
#body-fat,
#muscle {
    width: 187px;
    height: 92px;
}
/deep/.trend-items1{
    #weight,
    #body-fat,
    #muscle {
        width: 327px;
        height: 140px;
    }
}
</style>
