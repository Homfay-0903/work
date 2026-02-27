<template>
    <div class="my">
        <div ref="growth" class="growthChart"></div>
        <div class="gridBG">
            <img class="leftGrid" src="@/assets/images/new_girth_111.svg" alt="">
            <img class="bottomGrid" src="@/assets/images/new_girth_111.svg" alt="">
            <img class="bottomGrid2" src="@/assets/images/new_girth_111.svg" alt="">
            <img class="rightGrid" src="@/assets/images/new_girth_111.svg" alt="">
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { womanHeight, womanWeight, manHeight, manWeight } from './config/baseData'

export default {
    props: {
        userInfo: {
            type: Object,
            default: () => {
                return {
                    birthday: '1514736000', // 时间戳
                    height: 160, // 身高
                    weight: 40, // 体重
                    sex: 1, // 1: 男, 2: 女
                    age: 0,
                }
            }
        },
    },
    data() {
        return {
            // x轴刻度
            xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            // y轴刻度
            yAxis: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
            // 网格样式
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#B4D1F6'],
                    width: 1,
                    type: 'solid',
                },
            },
            // 轴样式
            axisLine: {
                lineStyle: {
                    color: '#B4D1F6'
                }
            },
            // 刻度样式
            axisTick: {
                inside: true,
                length: 15,         // 刻度线长度
                lineStyle: {       // 刻度线样式
                    width: 1,
                    type: 'solid'
                }
            }
        }
    },
    watch: {
        userInfo() {
            this.initChart()
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            let chartDom = this.$refs.growth
            const { sex, age, weight, height } = this.userInfo
            let myChart = echarts.init(chartDom)
            const LineA = this.makeLine(true, sex)
            const LineB = this.makeLine(false, sex)
            let option = {
                grid: {
                    bottom: '23px',
                    right: '9px',
                    top: '0',
                    left: '8px',
                    show: false
                },
                xAxis: {
                    type: 'category',
                    data: this.xAxis,
                    boundaryGap: false,
                    splitLine: this.splitLine,
                    axisLine: this.axisLine,
                    axisTick: this.axisTick,
                    axisLabel: {
                        show: true,
                        color: '#999',
                        interval: 0,
                        fontSize: 10,
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#B4D1F6'
                            }
                        },
                        formatter: value => {
                            return value % 2 === 1 ? '' : value
                        },
                    },
                },
                yAxis: {
                    type: 'value',
                    // 显示Y轴
                    show: true,
                    // 坐标轴最大值
                    max: 200,
                    min: 40,
                    interval: 10,
                    scale: true,
                    axisTick: this.axisTick,
                    data: this.yAxis,
                    splitLine: this.splitLine,
                    axisLine: this.axisLine,
                    axisLabel: {
                        show: false
                    }
                },
                series: [
                    ...LineA,
                    ...LineB,
                    {
                        name: '当前身高',
                        type: 'scatter',
                        symbolSize: 12,
                        data: [[age - 1, height]],  // [年龄, BMI]
                        itemStyle: {
                            color: '#B63F5E',
                            borderWidth: 4,
                            borderColor: '#FFFFFF',
                            zIndex: 10
                        },
                        label: {
                            show: false,
                        }
                    },
                    {
                        name: '当前体重',
                        type: 'scatter',
                        symbolSize: 12,
                        data: [[age - 1, weight + 40]],  // [年龄, BMI]
                        itemStyle: {
                            color: '#0180FE',
                            borderWidth: 4,
                            zIndex: 10,
                            borderColor: '#FFFFFF'
                        },
                        label: {
                            show: false,
                        }
                    },
                ]
            }
            this.$nextTick(() => {
                myChart.setOption(option)
            })
        },
        makeLine(isHeight = true, sex = 1) {
            let arr
            let color = '#c7311f'
            if (isHeight) {
                if (sex === 1) {
                    arr = manHeight
                } else {
                    arr = womanHeight
                }
            } else {
                color = '#2c94fd'
                if (sex === 1) {
                    arr = manWeight
                } else {
                    arr = womanWeight
                }
                arr = arr.map(i => {
                    return i.map(j => j + 40)
                })
            }
            const line = arr.map((i, index) => {
                return {
                    data: i.map(J => Math.round(J)).slice(1),
                    type: 'line',
                    // 不设置线上的点
                    symbol: 'none',
                    lineStyle: {
                        color,
                        width: 1,
                    },
                    smooth: true,
                }
            })
            return line
        }
    }
}
</script>
<style>
.my {
    position: relative;
    height: 300px;
    z-index: 1;
}

.growthChart {
    width: 334px;
    height: 300px;
    margin-left: 49px;
}

.leftGrid {
    position: absolute;
    top: 0px;
    height: 295px;
    left: -250px;
}
.rightGrid {
    position: absolute;
    transform: rotate(180deg);
    top: 0px;
    height: 295px;
    right: -250px;
    z-index: -1;
}

.bottomGrid {
    display: none;
    position: absolute;
    transform: rotate(270deg);
    height: 300px;
    left: 0;
    bottom: -273px;
    z-index: -1;
}

.bottomGrid2 {
    display: none;
    position: absolute;
    transform: rotate(270deg);
    height: 300px;
    left: 300px;
    bottom: -273px;
    z-index: -1;
}

.gridBG {
    position: absolute;
    width: 316px;
    height: 278px;
    top: 0;
    margin: 0 58px;
    overflow: hidden;
}
</style>