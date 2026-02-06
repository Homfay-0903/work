<template>
    <div class="content">
        <p>整体评分</p>
        <div ref="chart" class="itemContent">
        </div>
        <ul>
            <li><span></span>正常</li>
            <li><span></span>轻度</li>
            <li><span></span>中度</li>
            <li><span></span>重度</li>
        </ul>
        <div class="tips">
            <div class="warn">!</div>
            <div>
                <div v-if="spineStatus === 0">脊柱整体排列基本正常</div>
                <div v-if="spineStatus === 1">脊柱结构轻度异常，建议加强姿势管理和核心肌群训练</div>
                <div v-if="spineStatus === 2">脊柱结构中度异常，建议专业矫正干预并定期复查评估</div>
                <div v-if="spineStatus === 3">脊柱结构重度异常，建议就医进行多学科会诊评估</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        spineScore: {
            type: Number,
            default: 0,
        },
        spineStatus: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
        }
    },
    watch: {
        spineScore(newVal) {
            this.initChart()
        },
        spineStatus(newVal) {
            this.initChart()
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            // 分数
            const source = Math.round(this.spineScore)
            // 颜色
            const color = this.color(source)
            // 占比
            let percentage = source / 50 || 0
            if (source >= 50) {
                percentage = 50 / 50
            }
            // 标题
            const title = this.rank(source)
            let chart = this.$echarts.init(this.$refs.chart)
            let option = {
                title: [
                    {
                        text: title,
                        x: 'center',
                        top: '52%',
                        textStyle: {
                            color,
                            fontSize: 11,
                        },
                    },
                    {
                        text: source,
                        x: 'center',
                        top: '32%',
                        textStyle: {
                            fontSize: 23,
                            color,
                            foontWeight: '600',
                        },
                    },
                ],
                polar: {
                    radius: ['44%', '50%'],
                    center: ['50%', '50%'],
                },
                angleAxis: {
                    max: 100,
                    show: false,
                },
                radiusAxis: {
                    type: 'category',
                    show: true,
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                },
                color: ['rgb(71,79,102)'],

                series: [
                    {
                        name: '小环',
                        type: 'gauge',
                        splitNumber: 8,
                        color: ['#fff'],
                        radius: '76%',
                        center: ['50%', '50%'],
                        startAngle: 0,
                        endAngle: 359.9999,

                        // axisTick: {
                        //     show: true,
                        //     lineStyle: {
                        //         color: '#fff',
                        //         width: 1,
                        //     },
                        //     length: 5,
                        //     splitNumber: 3,
                        // },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: [[1, 'transparent']],  // 关键点3：轴线透明
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        // 刻度线
                        axisTick: {
                            distance: -45,
                            splitNumber: 3,
                            lineStyle: {
                                width: 1,
                                color: '#dddddd'
                            }
                        },
                        detail: {
                            show: false,
                        },
                        pointer: {
                            show: false
                        }
                    },

                    {
                        name: 'circle',
                        type: 'pie',
                        clockWise: true,
                        radius: ['56%', '70%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        },
                        hoverAnimation: false,
                        data: [

                            {
                                value: percentage,
                                name: '占比',
                                itemStyle: {
                                    normal: {
                                        color,
                                        label: {
                                            show: false,
                                        },
                                        labelLine: {
                                            show: false,
                                        },
                                    },
                                    emphasis: {
                                        color // 与正常状态颜色一致
                                    }
                                },
                            },
                            {
                                name: '剩余',
                                value: 1 - percentage,
                                itemStyle: {
                                    normal: {
                                        color: '#D9D9D9',
                                    },
                                    emphasis: {
                                        color: '#D9D9D9',
                                    }
                                },
                            },
                        ],
                    },
                ],
            }
            chart.setOption(option)
        },
        rank: function (value) {
            if (value < 6) {
                return '正常'
            } else if (value >= 6 && value < 16) {
                return '轻度异常'
            } else if (value >= 16 && value < 31) {
                return '中度异常'
            } else {
                return '重度异常'
            }
        },
        color: function (value) {
            if (value < 6) {
                return '#48d497'
            } else if (value >= 6 && value < 16) {
                return '#e6b12a'
            } else if (value >= 16 && value < 31) {
                return '#e45e15'
            } else {
                return '#ca4131'
            }
        },
    }
}
</script>

<style lang="less" scoped>
.content {
    position: relative;
    width: 100%;
    height: 172px;

    p {
        font-size: 18px;
        color: #333333;
        margin: 19px 0 0 11px;
    }

    ul {
        position: absolute;
        left: 15px;
        top: 50px;
        margin: 0;
        padding: 0;


        li {
            list-style-type: none;
            font-weight: 400;
            font-size: 12px;
            color: #666666;
            line-height: 18px;

            &:nth-child(1) span {
                background-color: #48D597;
            }

            &:nth-child(2) span {
                background-color: #E6B12A;
            }

            &:nth-child(3) span {
                background-color: #E56016;
            }

            &:nth-child(4) span {
                background-color: #C32613;
            }

            span {
                width: 6px;
                height: 8px;
                margin-right: 7px;
                display: inline-block;

            }
        }
    }

    .tips {
        position: absolute;
        font-size: 12px;
        left: 12px;
        bottom: 6px;
        color: #9B9B9B;
        line-height: 18px;
        margin: 0px;
        display: flex;

        .warn {
            display: inline-block;
            position: relative;
            flex-shrink: 0;
            width: 10px;
            height: 10px;
            padding: 1px;
            background: #5698F5;
            text-align: center;
            line-height: 10px;
            color: #fff;
            font-size: 10px;
            border-radius: 50%;
            margin-right: 4px;
            left: 0px;
            top: 3px;
        }
    }
}

.itemContent {
    position: absolute;
    right: 0;
    top: 0;
    width: 70%;
    height: 130px;

}
</style>