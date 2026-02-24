<template>
    <div class="my">
        <div ref="growth" class="growthChart"></div>
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
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
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
            // const height = 130
            console.log('???', sex, age, weight, height)
            let myChart = echarts.init(chartDom)
            const LineA = this.makeLine(true, sex)
            const LineB = this.makeLine(false, sex)
            let option = {
                grid: {
                    bottom: this.isDeviceReport ? '62px' : '23px',
                    right: this.isDeviceReport ? '32px' : '10px',
                    top: this.isDeviceReport ? '2px' : '0',
                    left: this.isDeviceReport ? '28px' : '8px',
                    show: false
                },
                xAxis: {
                    type: 'category',
                    data: this.xAxis,
                    boundaryGap: false,
                    splitLine: this.splitLine,
                    axisLine: this.axisLine,
                    axisTick: {
                        inside: true,
                    },
                    axisLabel: {
                        show: false,
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
                    axisTick: {
                        inside: true,
                    },
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
                        symbolSize: this.isDeviceReport ? 24 : 12,
                        data: [[age - 1, height]],  // [年龄, height]
                        itemStyle: {
                            color: '#B63F5E',
                            borderWidth: this.isDeviceReport ? 8 : 4,
                            borderColor: '#FFFFFF'
                        },
                        label: {
                            show: false,
                        }
                    },
                    {
                        name: '当前体重',
                        type: 'scatter',
                        symbolSize: this.isDeviceReport ? 24 : 12,
                        data: [[age - 1, weight + 40]],  // [年龄, weight]
                        itemStyle: {
                            color: '#0180FE',
                            borderWidth: this.isDeviceReport ? 8 : 4,
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
                    data: (i.map(J => Math.round(J))).slice(1),
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
            console.log(line)
            return line
        }
    }
}
</script>
<style>
.my {
    position: relative;
    top:42px;
    width: 279px;
    height: 423px;
    margin: 0 28px 0 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.10);
}

.growthChart {
    height: 400px;
}
</style>