<template>
    <div class="content2">
        <p class="title">生长潜力总得分</p>
        <div id="scorePie" class="itemContent"></div>
    </div>
</template>

<script>
export default {
    props: {
        totalScore: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {

        }
    },
    watch: {
        totalScore() {
            this.initChart()
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            let chart = this.$echarts.init(document.getElementById('scorePie'))
            let option = {
                title: [
                    {
                        text: '总分100',
                        x: 'center',
                        top: '52%',
                        textStyle: {
                            color: '#333',
                            fontSize: 14,
                            fontWeight: '500',
                        },
                    },
                    {
                        text: this.totalScore,
                        x: 'center',
                        top: '32%',
                        textStyle: {
                            fontSize: 26,
                            color: '#5698F5',
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
                hoverAnimation: false,

                series: [
                    {
                        name: '小环',
                        type: 'gauge',
                        splitNumber: 8,
                        color: ['#fff'],
                        radius: '78%',
                        center: ['50%', '50%'],
                        startAngle: 0,
                        endAngle: 359.9999,
                        hoverAnimation: false,

                        axisTick: {
                            show: true,
                            lineStyle: {
                                color: '#dddddd',
                                width: 1,
                            },
                            length: 5,
                            splitNumber: 3,
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: [[1, 'transparent']],  // 关键点3：轴线透明
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
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
                        radius: ['56%', '66%'],
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
                                value: this.totalScore,
                                name: '占比',
                                itemStyle: {
                                    normal: {
                                        color: '#5698F5',
                                        label: {
                                            show: false,
                                        },
                                        labelLine: {
                                            show: false,
                                        },
                                    },
                                    emphasis: {
                                        color: '#5698F5' // 与正常状态颜色一致
                                    }
                                },
                            },
                            {
                                name: '剩余',
                                value: 100 - this.totalScore,
                                itemStyle: {
                                    normal: {
                                        color: '#D9D9D9',
                                    },
                                    // 重点添加这里：悬停时保持相同颜色
                                    emphasis: {
                                        color: '#D9D9D9' // 与正常状态颜色一致
                                    }
                                },
                            },
                        ],
                    },
                ],
            }
            chart.setOption(option)
        }
    }
}
</script>

<style lang="less" scoped>
.content2 {
    position: relative;
    width: 232px;
    height: 239px;

    .title {
        margin: 15px 0 0 10px;
    }

    p {
        font-weight: 500;
        font-size: 18px;
        color: #333333;
    }

    ul {
        position: absolute;
        left: 15px;
        top: 56px;
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

        span {
            display: inline-block;
            width: 12px;
            height: 12px;
            padding: 2px;
            background: #5698F5;
            text-align: center;
            line-height: 12px;
            color: #fff;
            font-size: 12px;
            border-radius: 50%;
            margin-right: 3px;
        }
    }
}

.itemContent {
    position: absolute;
    left: 0;
    top: 25px;
    width: 100%;
    height: 172px;
}
</style>