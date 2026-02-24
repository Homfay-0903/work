<template>
    <div class="cardBox1">
        <div id="dashboardView" class="dashboardBox">

        </div>
        <div class="line" :style="{ top: isDeviceReport ? '48.6%' : undefined }"></div>
    </div>

</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        totalScore: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            props: {
                number: {
                    type: Number,
                    default: 0,
                }
            },
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    watch: {
        totalScore(totalScore) {
            console.log('NUMBER', totalScore)
            this.initChart()
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            let chart = echarts.init(document.getElementById("dashboardView"))
            let max = 100
            let isDeviceReport = window.sessionStorage.getItem('isDeviceReport')
            let deviceWidth = window.innerWidth
            let proportion = deviceWidth / 375
            let option = {
                xAxis: {
                    type: 'value',
                    show: false,
                    min: -50,
                    max: 50
                },
                grid: {
                    left: '15%',
                    right: '15%',
                    bottom: '2%',
                    top: '2%'
                },
                yAxis: {
                    show: false,
                    type: 'value',
                    min: -50,
                    max: 50
                },
                title: [
                    {
                        text: "总分100",
                        x: "center",
                        top: "54%",
                        textStyle: {
                            color: "#8AA3BE",
                            fontSize: isDeviceReport ? 30 : 12,
                            fontWeight: "400",
                        },
                    },
                    {
                        text: this.totalScore,
                        x: "center",
                        top: "36%",
                        textStyle: {
                            fontSize: isDeviceReport ? 62 : 26,
                            color: "#EAB04D",
                            fontWeight: "600",
                        },
                    },
                    {
                        text: '分',
                        x: isDeviceReport ? "53.4%" : "53%",
                        top: isDeviceReport ? "38.6%" : "39%",
                        textStyle: {
                            fontSize: isDeviceReport ? 34 : 14,
                            color: "#8AA3BE",
                            fontWeight: "600",
                        },
                    },
                ],
                series: [
                    {
                        type: 'custom',
                        z: 9,
                        renderItem: function (params, api) {
                            // 获取传入的数据 [radius, currentValue, totalScore]

                            const radius = api.value(0) * proportion // 半径值
                            const currentValue = api.value(1) // 当前值
                            const totalScore = api.value(2) // 总分

                            const angle = ((currentValue / totalScore) * 360) % 360 - 90 // -90使起点在顶部
                            console.log(angle, "angle")
                            const center = api.coord([0, 0])

                            const x = radius * Math.cos(angle * Math.PI / 180)
                            const y = radius * Math.sin(angle * Math.PI / 180)


                            return {
                                type: 'circle',
                                shape: {
                                    cx: center[0] + x,
                                    cy: center[1] + y,
                                    r: isDeviceReport ? 20 : 8
                                },
                                style: {
                                    fill: '#EAB04D',
                                    stroke: '#fff',
                                    lineWidth: isDeviceReport ? 8 : 4
                                }
                            }
                        },
                        data: [[72.5, this.totalScore, max]] // [半径,当前值，最大值]
                    },
                    {
                        name: "小环",
                        type: "gauge",
                        splitNumber: 8,
                        color: ["#fff"],
                        radius: "78%",
                        center: ["50%", "50%"],
                        startAngle: 0,
                        endAngle: 359.9999,

                        axisTick: {
                            show: true,
                            lineStyle: {
                                color: "#fff",
                                width: isDeviceReport ? 2 : 1,
                            },
                            length: isDeviceReport ? 12 : 5,
                            splitNumber: 3,
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: [[1, "transparent"]], // 关键点3：轴线透明
                            },
                        },
                        splitLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: false,
                        },
                        detail: {
                            show: false,
                        },
                        pointer: {
                            show: false,
                        },
                    },
                    {
                        name: "circle",
                        type: "pie",
                        clockWise: true,
                        roundCap: true,
                        radius: ["53%", "66%"],
                        hoverAnimation: false,

                        data: [
                            {
                                value: this.totalScore,
                                name: "占比",
                                grouGap: true,
                                itemStyle: {
                                    normal: {
                                        color: "#EAB04D",
                                        label: {
                                            show: false,
                                        },
                                        labelLine: {
                                            show: false,
                                        },
                                    },
                                },
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                    emphasis: {
                                        show: false,
                                    },
                                },
                            },

                            {
                                // 画剩余的刻度圆环
                                name: "",
                                value: max - this.totalScore,
                                label: {
                                    show: false,
                                },
                                itemStyle: {
                                    normal: {
                                        color: "rgb(71,79,102)",
                                    },
                                },
                                labelLine: {
                                    show: false,
                                    emphasis: {
                                        show: false,
                                    },
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
.cardBox1 {

    width: 330px;
    height: 240px;
    position: relative;
    margin: 0 auto;

    .line {
        position: absolute;
        width: 44px;
        height: 1px;
        background-color: #8AA3BE;
        top: 50%;
        margin: 0 auto;
        left: 0;
        right: 0;
    }
}

.dashboardBox {
    width: 330px;
    height: 240px;
    margin: 0 auto;


}
</style>