<template>
    <div class="exercise-advice">
        <el-row>
            <p class="interpret">
            <pre v-html="data.text"></pre>
            </p>
        </el-row>
        <el-row>
            <p class="interpret">运动周计划</p>
        </el-row>
        <div class="analysis-table thead-line grade-table">
            <table cellspacing="0" cellpadding="0">
                <thead>
                    <tr class="medium">
                        <th colspan="2">周</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                        <th>9</th>
                        <th>10</th>
                        <th>11</th>
                        <th>12</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="medium">
                        <td colspan="2">
                            <span>阶段</span>
                        </td>
                        <td colspan="5">
                            <span>适应期</span>
                        </td>
                        <td colspan="4">
                            <span>提升期</span>
                        </td>
                        <td colspan="3">
                            <span>巩固期</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>有氧训练</span>
                        </td>
                        <td :key="index" v-for="(meal, index) in data.tableData.aerobics">
                            <p>{{ getAerobicsName(meal) }}</p>
                            <p class="aerobics">{{ `(${meal})` }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>力量训练</span>
                        </td>
                        <td :key="index" v-for="(meal, index) in data.tableData.strength">
                            <p :key="idx" v-for="(item, idx) in meal">{{ item + '训练' }}</p>
                        </td>
                    </tr>
                    <tr class="small">
                        <td colspan="2">
                            <span>强度</span>
                        </td>
                        <td :key="index" v-for="(meal, index) in data.tableData.trainingIntensity">
                            <p>{{ meal }}</p>
                        </td>
                    </tr>
                    <tr class="small">
                        <td colspan="2">
                            <span>训练量</span>
                        </td>
                        <td :key="index" v-for="(meal, index) in data.tableData.trainingVolume">
                            <p>{{ meal }}</p>
                        </td>
                    </tr>
                    <tr class="small chart">
                        <td rowspan="5" class="chart-title">
                            <span>强度负荷</span>
                        </td>
                        <td>
                            <span>很高</span>
                        </td>
                        <td colspan="12" rowspan="5">
                            <div id="chart"></div>
                        </td>
                    </tr>
                    <tr class="small chart">
                        <td>
                            <span>高</span>
                        </td>
                    </tr>
                    <tr class="small chart">
                        <td>
                            <span>中高</span>
                        </td>
                    </tr>
                    <tr class="small chart">
                        <td>
                            <span>中</span>
                        </td>
                    </tr>
                    <tr class="small chart">
                        <td>
                            <span>低</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-row class="legend" type="flex" justify="end">
            <span class="line">
                <img src="@/assets/images/green_line.svg" alt="">
                训练量
            </span>
            <span class="line">
                <img src="@/assets/images/orange_line.svg" alt="">
                强度
            </span>
        </el-row>
        <el-row>
            <p class="interpret">
                注意：以上健身计划仅供参考，具体情况应根据个人实际情况进行调整。同时，每个人的身体状况和运动能力不同，切勿过度训练或饮食限制，以避免对身体造成不良影响。
            </p>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        // 运动建议数据
        data: {
            type: Array,
            default: []
        },
        showTips: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            text:
                '根据你的情况，我们可以按照<b>12周</b>进行一个<b>运动规划</b>，你的<b>运动目标</b>是<b>减脂</b>和<b>体态矫正</b>。在<b>适应阶段</b>，我们建议你进行<b>长时低速(LSD)</b>和<b>节奏(PACE)</b>的<b>有氧运动</b>，以提高<b>心肺功能</b>和适应运动强度。力量训练方面，我们建议你注重<b>肩颈部位</b>和<b>核心部位</b>的训练，以改善你的<b>体态异常</b>。在<b>提升阶段</b>，我们建议你进行<b>高强度间歇(HIT)</b>和<b>间歇(INTERVAL)</b>的<b>有氧运动</b>，以加速<b>脂肪燃烧</b>和提高<b>代谢率</b>。力量训练方面，我们建议你注重<b>臀部和腿部</b>的训练，以增加<b>肌肉质量</b>和改善<b>身体比例</b>。在<b>巩固阶段</b>，我们建议你继续进行<b>间歇(INTERVAL)</b>的<b>有氧运动</b>，以巩固<b>减脂效果</b>。力量训练方面，我们建议你注重<b>背部和手臂</b>的训练，以增加<b>肌肉质量</b>和改善<b>身体线条</b>。在整个训练过程中，我们建议你注重<b>体态调整</b>，针对不同的<b>体态异常</b>进行相应的<b>肌肉训练</b>和<b>体态调整</b>，以达到<b>身体平衡</b>和<b>健康</b>的目的。同时，运动时应<b>适中</b>，避免过度运动引发的健康问题。'
        }
    },
    mounted() {
        setTimeout(() => {
            // 绘制图表
            this.setEcharts('chart', this.data.tableData.trainingIntensity, this.data.tableData.trainingVolume)
        }, 2000)
    },
    // created() {},
    methods: {
        getAerobicsName(key) {
            const map = {
                'HIT': '高强度间歇',
                'INTERVAL': '间歇',
                'PACE': '节奏',
                'LSD': '长时低速',
            }
            return map[key]
        },
        setEcharts(cla, arr, arr2) {
            console.log('开始渲染图表')
            let myChart = this.$echarts.init(document.getElementById(cla), null, { devicePixelRatio: 2.5 })
            const width = '100%'
            let options = {
                grid: {
                    // x: scanTimes.length === 1 ? 14 : 26,
                    // y: 10,
                    // x2: 26,
                    // y2: 15,
                    top: '13px',
                    bottom: '13px',
                    containLabel: false,
                    height: function () {
                        return '10px'
                    },
                    width,
                    right: '32px',
                    left: '32px'
                    // width: `${width}px`
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    show: false,
                    // 设置为类目的序数
                    max: 12,
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    min: '1',
                    max: '5',
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
                                lineStyle: {
                                    width: 0.8,
                                    type: 'solid' // 'dotted'虚线 'solid'实线
                                },
                                color: '#F7B500'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#F7B500',
                                width: 0.8
                            }
                        }
                    },
                    {
                        type: 'line',
                        data: arr2,
                        symbol: 'circle',
                        symbolSize: 5,
                        // 空白数据连线
                        connectNulls: true,
                        silent: true,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 0.8,
                                    type: 'dotted' // 'dotted'虚线 'solid'实线
                                },
                                color: '#79BD09'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#79BD09',
                                width: 0.8
                            }
                        }
                    }
                ]
            }
            myChart.setOption(options)
            myChart.on('finished', () => {
                console.log('CHART_OVER')
            })
            myChart.on('error', (error) => {
                console.log('CHART_ERR', error)
            })
        },
        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>

<style lang="less">
.exercise-advice {
    .el-row {
        margin-top: 23px;

        &.legend {
            margin-top: 11px;
            padding-right: 11px;
        }
    }

    p {
        margin: 0;
        color: #636366;

        pre {
            margin: 0;
            white-space: pre-wrap;
        }
    }

    .line {
        margin-left: 27px;
        font-size: 13px;
        font-family: OPPOSans R, OPPOSans;
        font-weight: normal;
        color: #8E8E93;

        img {
            vertical-align: middle;
        }
    }

    .name {
        font-size: 28px;
        font-family: OPPOSans L;
        font-weight: normal;
    }

    .interpret {
        margin-top: 8px;
        font-size: 18px;
        font-family: OPPOSans L;
        font-weight: normal;
        line-height: 36px;
    }

    .grade-table {
        table {
            border: 1px solid #d8d8d8;
            font-size: 13px;
            font-family: OPPOSans M, OPPOSans;
            font-weight: normal;
            color: #636366;
            line-height: 24px;
            text-align: center;

            thead {
                background: rgba(121, 189, 9, 0.1);
                font-size: 18px;

                tr {
                    height: 35px;

                    th {
                        border: 1px solid #d8d8d8;
                        width: 64px;
                    }

                    th:nth-of-type(1) {
                        width: 80px;
                    }
                }
            }

            tbody {
                font-size: 13px;

                tr {
                    &.chart {
                        background: rgba(121, 189, 9, 0.1);
                    }

                    &.small {
                        height: 21px;
                    }

                    &.medium {
                        height: 35px;
                    }

                    td {
                        // padding-left: 11px;
                        // padding-top: 17px;
                        // padding-bottom: 17px;
                        border: 1px solid #d8d8d8;

                        &.chart-title {
                            width: 21px;
                        }

                        .aerobics {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
}

#chart {
    width: 810px;
    height: 130px;
}
</style>
