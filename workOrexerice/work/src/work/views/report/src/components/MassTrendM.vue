<!--
 * @Description: 体成分历史趋势
 * @Author: DonWangWQ
 * @Date: 2023-04-13 16:22:34
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2024-09-12 17:53:38
 -->
 <template>
    <div class="mass-trend">
        <h2>历史趋势</h2>
        <div class="trend-items">
            <div class="item">
                <p style="border-top: 1px solid #5698f5;">
                    <span class="name">体重</span>
                    <em> kg </em>
                    <!-- <em>{{ unit === 'imperial' ? isImperial : isMetric }}</em> -->
                </p>
                <div :class="['info', {'no-bg': !isShowWeight}]">
                    <div id="weight-id"></div>
                    <div class="no-mass-tip" v-if="!isShowWeight">
                        <div>
                            <img src="@/assets/images/placeholder.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <p>
                    <span class="name">骨骼肌</span>
                    <em>kg</em>
                    <!-- <em>{{ unit === 'imperial' ? isImperial : isMetric }}</em> -->
                </p>
                <div :class="['info', {'no-bg': !isShowSM}]" ref="ref">
                    <div id="fat-id"></div>
                    <div class="no-mass-tip" v-if="!isShowSM">
                        <div>
                            <img src="@/assets/images/placeholder.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="item item-body">
                <p>
                    <span class="name">体脂率</span>
                    <em>%</em>
                </p>
                <div :class="['info', {'no-bg': !isShowBodyFat}]">
                    <div id="body-fat-id"></div>
                    <div class="no-mass-tip" v-if="!isShowBodyFat">
                        <div>
                            <img src="@/assets/images/placeholder.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="item1">
                <p>
                    <span class="name"> 体重：</span>
                    <em>体重是身体水分、蛋白质、无机盐和体脂肪的总和。</em>
                </p>
                <p>
                    <span class="name"> 体脂率：</span>
                    <em>体脂肪率是指体脂肪占体重的比率。</em>
                </p>
                <p>
                    <span class="name"> 体脂肪：</span>
                    <em>体脂肪是皮下脂肪，内脏脂肪和肌肉之间脂肪的总和。</em>
                </p>
                <p>
                    <span class="name"> 去脂体重：</span>
                    <em>去脂体重是体重扣除脂肪的部分。</em>
                </p>
            </div> -->
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
        // 扫描id
        scanId: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            init: [0, 0, 0, 0, 0, 0, 0, 0],
            scanTimes: [],
            // 体重
            WT: [],
            // 体脂肪率
            PBF: [],
            // 骨骼肌
            SM: [],
            loaded: 0,
            unit: ''
        }
    },
    computed: {
        // 是否显示体重没数据图标
        isShowWeight() {
            return this.WT.some((item) => item && item > 0)
        },
        // 是否显示体脂率没数据图标
        isShowBodyFat() {
            return this.PBF.some((item) => item && item > 0)
        },
        // 是否显示体脂肪没数据图标
        isShowSM() {
            return this.SM.some((item) => item && item > 0)
        }
    },
    created() {
        this.bmMassTrendInfo()
    },
    methods: {
        setEcharts(cla, arr, scanTimes, isLang = false) {
            // console.log(`当前视图宽${this.$refs.ref.offsetWidth}`)
            let myChart = this.$echarts.init(document.getElementById(cla), null, {
                devicePixelRatio: 2.5,
                width: this.$refs.ref.offsetWidth
            })
            const width = '90%'
            let interval = scanTimes.length === 1 ? 10 : 0
            let xData = []

            scanTimes.forEach((element, index) => {
                if (arr[index]) {
                    xData.push(element)
                } else {
                    xData.push({
                        value: element,
                        textStyle: {
                            color: 'rgba(0,0,0,0)'
                        }
                    })
                }
            })
            let options = {
                grid: {
                    top: '23px',
                    bottom: '10px',
                    // 25-06-16  提出的Bug，根据产品需求，需要取消掉第一个时间的隐藏  BUG: #69554043
                    containLabel: true,
                    height: function () {
                        return '10px'
                    },
                    width,
                    right: '30px',
                    left: '0px'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    show: true,
                    data: xData,
                    // 设置为类目的序数
                    max: 8,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval,
                        boundaryGap: false,
                        formatter: function (value) {
                            if (!value) {
                                return
                            }
                            return value
                        },
                        fontFamily: 'OPPOSans-R',
                        color: '#999999',
                        fontSize: '8px'
                    },
                    splitLine: {
                        show: false
                    },
                    inverse: false
                },
                yAxis: {
                    type: 'value',
                    min: function (value) {
                        if (value.max - value.min > 8) {
                            return value.min
                        } else if (value.max - value.min > 1 && value.max - value.min <= 8) {
                            return value.min - 0.5
                            // return (value.max + value.min) / 2 - 4
                        } else {
                            return value.min - 0.5
                        }
                    },
                    max: function (value) {
                        if (value.max - value.min > 8) {
                            return value.max
                        } else if (value.max - value.min > 1 && value.max - value.min <= 8) {
                            return value.max + 1.5
                            // return (value.max + value.min) / 2 + 4
                        } else {
                            return value.max + 1.5
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
                        connectNulls: false,
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
                    this.$emit('load-mass-report')
                }
            })
        },
        // 体成分趋势
        async bmMassTrendInfo() {
            const userInfo = {
                memberId: this.memberId,
                scanTime: this.scanTime,
                deviceId: this.deviceId,
                scanId: this.scanId
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
                        // this.unit = window.localStorage.getItem('unit')
                        const massData = info.data
                        massData.forEach((mass, idx) => {
                            // 取前10组
                            if (idx < 10) {
                                // console.log(`接收到的时间${mass.scanTime}`)
                                const scanTime = mass.scanTime.split(' ')[0]
                                // console.log(`接收到的时间111 ${scanTime}`)
                                // if (this.$i18n.locale === 'ar-AR') {
                                //     this.scanTimes.unshift(
                                //         scanTime
                                //             .split('/')
                                //             .reverse()
                                //             .join('/')
                                //     )
                                // } else {
                                this.scanTimes.unshift(scanTime)
                                // }
                                const wtV = mass.data.WT.v || null
                                const pbfV = mass.data.PBF.v || null
                                const smV = mass.data.SM.v || null
                                // if (this.unit === 'imperial') {
                                this.WT.unshift(wtV ? wtV.toFixed(1) : wtV)
                                this.PBF.unshift(pbfV ? pbfV.toFixed(1) : pbfV)
                                this.SM.unshift(smV ? smV.toFixed(1) : smV)
                                // } else {
                                //     this.WT.unshift(wtV ? (wtV * 0.45359237).toFixed(1) : wtV)
                                //     this.PBF.unshift(pbfV ? pbfV.toFixed(1) : pbfV)
                                //     this.SM.unshift(smV ? (smV * 0.45359237).toFixed(1) : smV)
                                // }
                            }
                        })
                    }

                    this.$nextTick(() => {
                        const language = false
                        this.setEcharts('weight-id', this.WT, this.scanTimes, language)
                        this.setEcharts('fat-id', this.SM, this.scanTimes, language)
                        this.setEcharts('body-fat-id', this.PBF, this.scanTimes, language)
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
    margin-top: 20px;
    width: 100%;

    h2 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-family: 'OPPOSans-M', 'Noto Kufi Arabic SemiBold';
        font-weight: normal;
        color: #333333;
        line-height: 32px;
    }

    .trend-items {
        vertical-align: middle;
        width: 100%;

        .item {
            // margin-bottom: 19px;
            border-right: 1px solid #5698f5;
            border-left: 1px solid #5698f5;
            border-bottom: 1px solid #5698f5;

            p {
                font-size: 18px;
                color: #333333;
                margin: 0px;
                line-height: 24px;
                // background: rgba(242, 248, 255, 1);
                // border-bottom: 1px solid #5698f5;
                span, em{
                    position: relative;
                    top: 10px;
                }

                .name {
                    margin: 0 0 0 14px;
                    font-size: 12px;
                    font-family: 'OPPOSans-M', 'Noto Kufi Arabic SemiBold';
                    font-weight: normal;
                    color: #333333;
                    line-height: 20px;
                }

                em {
                    font-size: 12px;
                    font-family: 'OPPOSans R', 'OPPOSans-R', 'Noto Kufi Arabic SemiBold';
                    font-weight: normal;
                    font-style: normal;
                    color: #666666;
                    line-height: 16px;
                }
            }

            .info {
                background: url('../assets/images/forms.svg') 0px 23px;
                background-size: auto 75px;
                margin-left: 30px;
                margin-right: 30px;
                position: relative;
                &.no-bg {
                    background: none;
                    .no-mass-tip {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        div {
                            width: 421px;
                            height: 70px;
                            margin: 23px auto 0;
                            border-radius: 3px;
                            border: 1px dashed #CED7E0;
                            text-align: center;
                            img {
                                width: 52px;
                                margin-top: 17px;
                            }
                        }
                    }
                }
            }
        }

        .item1 {
            padding: 15px 0;
            margin-top: 27px;
            margin-bottom: 50px;
            border-right: 1px solid #5698f5;
            border-left: 1px solid #5698f5;
            border-bottom: 1px solid #5698f5;
            border-top: 1px solid #5698f5;

            p {
                margin: 0px;
                line-height: 24px;

                .name {
                    margin: 0 0 0 6px;
                    font-size: 12px;
                    font-family: 'OPPOSans-M', 'Noto Kufi Arabic SemiBold';
                    font-weight: 500;
                    color: #333333;
                    line-height: 20px;
                }

                em {
                    font-size: 12px;
                    font-family: 'OPPOSans R', 'OPPOSans-R', 'Noto Kufi Arabic SemiBold';
                    font-weight: normal;
                    font-style: normal;
                    color: #666666;
                    line-height: 16px;
                }
            }
        }
    }
}


#weight-id,
#body-fat-id,
#fat-id {
    width: 100%;
    height: 122px;
}
</style>
