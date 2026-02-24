<template>
    <!--体型预测趋势图-->
    <div class="prediction-trend body-composition-trend">
        <div class="no-thermal-data result-failed-tip" v-if="isFailed">
            <div>
                <p>体型预测结果合成失败~</p>
                <p>小编猜测可能是网络原因导致的</p>
            </div>
        </div>
        <!-- 加载动画 -->
        <!-- <div class="loading" v-if="loading">
            <mt-spinner type="fading-circle" class="loading-dot"></mt-spinner>
        </div>-->
        <div class="trend-defer-container">
            <!-- <div class="header-title">
                <p>调节建议</p>
                <p>建议调节量</p>
            </div>-->
            <ul>
                <li>
                    <div class="prediction-title">
                        <div class="name">
                            <span class="weight-icon">
                                <span>
                                    <img src="@/assets/images/new-report/WT.png" alt />
                                </span>
                            </span>
                            体重
                            <span class="unit">&nbsp;/&nbsp;</span>
                            <span class="unit">kg</span>
                            <!-- <img
                                class="help-icon"
                                src="../../../assets/images/new-report/report/help.png"
                                alt
                                @click.prevent="handelHelp(charts.name)"
                            />-->
                        </div>
                        <div class="top-title">
                            <div id="weight"></div>
                            <div class="num">
                                <span>调节量</span>
                                <span v-cloak class="adjust-num">{{ body.weight > 0 ? '+' + toDecimal2(body.weight, 1) :
                                    toDecimal2(body.weight, 1)}}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="prediction-title">
                        <div class="name">
                            <span class="weight-icon">
                                <span>
                                    <img src="@/assets/images/new-report/BFM.png" alt />
                                </span>
                            </span>
                            体脂肪
                            <span class="unit">&nbsp;/&nbsp;</span>
                            <span class="unit">kg</span>
                            <!-- <img
                                class="help-icon"
                                src="../../../assets/images/new-report/report/help.png"
                                alt
                                @click.prevent="handelHelp(charts.name)"
                            />-->
                        </div>
                        <div class="top-title">
                            <div id="body-fat"></div>
                            <div class="num">
                                <span>调节量</span>
                                <span v-cloak class="adjust-num">{{ body.bodyFat > 0 ? '+' + toDecimal2(body.bodyFat, 1)
                                    : toDecimal2(body.bodyFat, 1)}}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="prediction-title">
                        <div class="name">
                            <span class="weight-icon">
                                <span>
                                    <img src="@/assets/images/new-report/SM.png" alt />
                                </span>
                            </span>
                            肌肉量
                            <span class="unit">&nbsp;/&nbsp;</span>
                            <span class="unit">kg</span>
                            <!-- <img
                                class="help-icon"
                                src="../../../assets/images/new-report/report/help.png"
                                alt
                                @click.prevent="handelHelp(charts.name)"
                            />-->
                        </div>
                        <div class="top-title">
                            <div id="muscle"></div>
                            <div class="num">
                                <span>调节量</span>
                                <span v-cloak class="adjust-num">{{ body.muscle > 0 ? '+' + toDecimal2(body.muscle, 1) :
                                    toDecimal2(body.muscle, 1)}}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { bodyAdjustInfo, findBmMassQuotaInfos } from '@/assets/js/apolloGql.js'
// 按需引入
const echarts = require('echarts/lib/echarts')
// 折线图
require('echarts/lib/chart/line')

export default {
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            body: {},
            isFailed: false,
            loading: true,
            mass: [],
            max: 100,
            min: 0,
        }
    },
    created() {
        this.findBmMassQuotaInfos()
    },
    mounted() {
        this.$apollo
            .query({
                query: bodyAdjustInfo,
                variables: {
                    scanId: this.modelInfo.scanId,
                },
            })
            .then((res) => {
                const data = res.data.bodyAdjustInfo
                this.loading = false
                if (data && data.code === 200) {
                    this.body = data.data
                    console.log(
                        '开始绘制》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》',
                        this.body
                    )
                    this.echartsInit()
                } else {
                    this.isFailed = true
                }
            })
        this.$hmt.trackPageview('/tab/prediction')
    },
    methods: {
        toDecimal2(x, y) {
            let f = Math.round(x * 100) / 100
            let s = f.toString()
            let rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            return s
        },
        findBmMassQuotaInfos() {
            this.$apollo
                .query({
                    query: findBmMassQuotaInfos,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.findBmMassQuotaInfos
                    if (data && data.code === 200) {
                        this.mass[0] = data.data[0].latestData.v
                        this.mass[1] = data.data[1].latestData.v
                        this.mass[2] = data.data[4].latestData.v
                        console.log('=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', this.mass)
                        this.echartsInit()
                    }
                })
        },
        echartsInit() {
            // this.max = Math.max(this.mass[0], this.mass[1], this.mass[2], this.mass[0]+ this.body.weight, this.mass[1]+ this.body.bodyFat, this.mass[2]+ this.body.muscle)
            //         this.min = Math.min(this.mass[0], this.mass[1], this.mass[2], this.mass[0]+ this.body.weight, this.mass[1]+ this.body.bodyFat, this.mass[2]+ this.body.muscle)
            this.max = Math.max(Math.abs(this.body.weight), Math.abs(this.body.bodyFat), Math.abs(this.body.muscle))
            // this.setEcharts('weight', [this.mass[0], parseFloat(this.mass[0]+ this.body.weight).toFixed(1)], '体重')
            // this.setEcharts('body-fat', [this.mass[1], parseFloat(this.mass[1]+ this.body.weight).toFixed(1)], '体脂肪')
            // this.setEcharts('muscle', [this.mass[2], parseFloat(this.mass[2] + this.body.muscle).toFixed(1)], '肌肉量')
            this.setEcharts(
                'weight',
                [this.mass[0], parseFloat(this.mass[0] + this.body.weight).toFixed(1)],
                '体重',
                [this.max / 2 - this.body.weight / 2, this.max / 2 + this.body.weight / 2]
            )
            this.setEcharts(
                'body-fat',
                [this.mass[1], parseFloat(this.mass[1] + this.body.bodyFat).toFixed(1)],
                '体脂肪',
                [this.max / 2 - this.body.bodyFat / 2, this.max / 2 + this.body.bodyFat / 2]
            )
            this.setEcharts(
                'muscle',
                [this.mass[2], parseFloat(this.mass[2] + this.body.muscle).toFixed(1)],
                '肌肉量',
                [this.max / 2 - this.body.muscle / 2, this.max / 2 + this.body.muscle / 2]
            )
        },
        setEcharts(cla, arr, name, arr2) {
            console.log('开始绘制' + cla)
            let myChart = echarts.init(document.getElementById(cla))
            let options = {
                xAxis: {
                    type: 'category',
                    show: false, // 隐藏X轴
                    data: ['', ''], // 设置两个位置的标签
                },
                yAxis: {
                    type: 'value',
                    show: false, // 隐藏Y轴
                    min: 0, // 纵坐标最小值设为0
                    max: this.max, // 纵坐标最大值设为100，可以根据实际情况调整
                },
                grid: {
                    left: '0%', // 调整图表距离左边的距离
                    right: '20%', // 调整图表距离右边的距离
                    bottom: '30%', // 调整图表距离下边的距离
                    top: '30%', // 调整图表距离上边的距离
                    containLabel: true, // 调整图表大小以包含标签
                },
                series: [
                    {
                        type: 'line',
                        data: arr2,
                        symbol: 'circle',
                        symbolSize: 10,
                        connectNulls: true,
                        silent: true,
                        itemStyle: {
                            color: function (params) {
                                if (params.dataIndex === 0) {
                                    return '#409EFF' // 第一个数据点的颜色
                                } else if (params.dataIndex === 1) {
                                    return '#33C070' // 第二个数据点的颜色
                                }
                            },
                        },
                        label: {
                            formatter: function (params) {
                                if (params.dataIndex === 0) {
                                    return `{currentValue|当前值：}{currentVal|${arr[0]}}`
                                } else if (params.dataIndex === 1) {
                                    return `{predictedValue|理想值：}{predictedVal|${arr[1]}}`
                                }
                            },
                            rich: {
                                currentValue: {
                                    fontSize: 11,
                                    color: '#8AA3BE',
                                },
                                currentVal: {
                                    fontSize: 11,
                                    color: '#409EFF',
                                    width: 100,
                                    align: 'left',
                                },
                                predictedValue: {
                                    fontSize: 11,
                                    color: '#8AA3BE',
                                    width: 140,
                                    align: 'right',
                                },
                                predictedVal: {
                                    fontSize: 11,
                                    color: '#33C070',
                                    align: 'right',
                                },
                            },
                            show: true,
                            // position: 'top',
                            // position: function (params) {
                            //     console.log(params, '>>>>>>>>>>>>params2')
                            //     if (params.dataIndex === 0) {
                            //         return 'top'
                            //     } else if (params.dataIndex === 1) {
                            //         return 'bottom'
                            //     }
                            //     },
                            offset: [0, 3]
                        },
                        lineStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#5698F5' }, // 蓝色
                                { offset: 1, color: '#33C070' }, // 绿色
                            ]),
                            width: 5,
                        },
                    },
                ],
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
    },
}
</script>

<style lang="less" scoped>
.no-thermal-data {
    padding: 0 4vw;

    >div {
        padding: 8.533vw 0;
        background-image: -webkit-gradient(linear, left top, left bottom, from(#13142e), to(#0f122b));
        background-image: linear-gradient(180deg, #13142e, #0f122b);
        border-radius: 1.333vw;
        color: #fff;
        font-size: 3.2vw;
        -webkit-box-shadow: 0 0.533vw 3.733vw 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 0.533vw 3.733vw 0 rgba(0, 0, 0, 0.2);
        text-align: center;
        margin-bottom: 10.667vw;

        >p {
            line-height: 1.64;
        }
    }
}

.prediction-trend {
    display: flex;
    justify-content: center;
}

.trend-defer-container {
    width: 100%;
    margin-top: 1.333vw;

    li {
        color: #2c3e50;
    }
}

.prediction-title {
    height: 130px;
    background: linear-gradient(126deg, #1d1e3b 0%, rgba(16, 38, 80, 0.95) 100%);
    border-radius: 4px;
    border: 1px solid;
    margin-top: 10px;

    // color:white;
    .name {
        margin-top: 10px;
        color: white;
    }

    .name img {
        width: 16px;
        margin-left: 5px;
    }
}

.weight-icon {
    display: inline-block;
    margin: 0 5px;
    background-size: contain;
    vertical-align: middle;

    img {
        margin-top: 2px;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}

.num {
    position: relative;
    top: -13px;
    right: 30px;

    .span {
        padding: 0 !important;
        background: #fff;
        text-align: center !important;
    }

    .adjust-num {
        display: inline-block;
        background-color: #33C070 !important;
        width: 60px !important;
        height: 20px !important;
        padding: 0 !important;
    }

    .adjust-num2 {
        display: inline-block;
        background-image: url(../../../assets/images/new-report/bgjv2.png) !important;
        width: 60px !important;
        height: 20px !important;
        padding: 0 !important;
    }
}

.top-title {
    height: 100px !important;
    padding: 0 0px !important;
    color: white;
}

#weight,
#body-fat,
#muscle {
    width: 237px;
    height: 100px;
    padding-left: 10px;
}

.top-title {
    span {
        background: none !important; // 移除背景图像
        padding-left: 10px !important; // 移除左边的填充
    }
}
</style>
