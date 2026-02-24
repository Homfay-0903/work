<template>
    <div :class="['cardBox1', isDeviceReport ? 'isDeviceReport' : '']" >
        <div id="da-chart" class="dashboardBox">

        </div>
        <div class="line" :style="{ top: isDeviceReport ? '50.6%' : undefined }"></div>
    </div>

</template>

<script  >
import * as echarts from 'echarts'
export default {
    props: {
        structureAssessment: Object,
    },
    data() {
        return {
            colorStyle: ["#2DA068", "#EAB04D", "#EB773B", "#FD3741"],
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            // const groupImages = {
            //     0: require('@/assets/image/spine/group1.png'),
            //     1: require('@/assets/image/spine/group2.png'),
            //     2: require('@/assets/image/spine/group3.png'),
            //     3: require('@/assets/image/spine/group4.png'),
            // }
            let data = this.structureAssessment.spineScore > 50 ? 50 : this.structureAssessment.spineScore
            let max = 50
            let colorStyle = this.colorStyle[this.structureAssessment.spineStatus]
            let isDeviceReport = window.sessionStorage.getItem('isDeviceReport')
            let deviceWidth = window.innerWidth
            let proportion = deviceWidth / 375
            let chart = echarts.init(document.getElementById("da-chart"))
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
                        text: `${this.dealWith(this.structureAssessment.spineStatus)}`,
                        x: "center",
                        top: isDeviceReport ? "56%" : "55.6%",
                        textStyle: {
                            color: `${this.colorStyle[this.structureAssessment.spineStatus]}`,
                            fontSize: isDeviceReport ? 40 : 15,
                            fontFamily: "PingFang SC,Source Sans Pro,Helvetica Neue,Helvetica,Arial,Noto Sans CJK SC",
                        },
                    },
                    {
                        text: `${Math.round(this.structureAssessment.spineScore)}`,
                        x: "center",
                        top: isDeviceReport ? "36%" : "34%",
                        textStyle: {
                            fontSize: isDeviceReport ? 70 : 30,
                            color: this.colorStyle[this.structureAssessment.spineStatus],
                            foontWeight: "600",
                            fontFamily: "PingFang SC,Source Sans Pro,Helvetica Neue,Helvetica,Arial,Noto Sans CJK SC",
                        },
                    },
                    {
                        text: '分',
                        x: "54%",
                        top: isDeviceReport ? "39.4%" : "38.2%",
                        textStyle: {
                            fontSize: isDeviceReport ? 34 : 14,
                            color: "#8AA3BE",
                            fontWeight: "600",
                            fontFamily: "PingFang SC,Source Sans Pro,Helvetica Neue,Helvetica,Arial,Noto Sans CJK SC",
                        },
                    },
                ],
                // polar: {
                //     radius: ["44%", "50%"],
                //     center: ["50%", "50%"],
                // },
                // angleAxis: {
                //     max: 100,
                //     show: false,
                // },
                // radiusAxis: {
                //     type: "category",
                //     show: true,
                //     axisLabel: {
                //         show: false,
                //     },
                //     axisLine: {
                //         show: false,
                //     },
                //     axisTick: {
                //         show: false,
                //     },
                // },
                // color: ["rgb(71,79,102)"],

                // series: [
                //     {
                //         name: "小环",
                //         type: "gauge",
                //         splitNumber: 8,
                //         color: ["#fff"],
                //         radius: "78%",
                //         center: ["50%", "50%"],
                //         startAngle: 0,
                //         endAngle: 359.9999,

                //         axisTick: {
                //             show: true,
                //             lineStyle: {
                //                 color: "#fff",
                //                 width: 1,
                //             },
                //             length: 5,
                //             splitNumber: 3,
                //         },
                //         axisLine: {
                //             show: false,
                //             lineStyle: {
                //                 color: [[1, 'transparent']],  // 关键点3：轴线透明
                //             }
                //         },
                //         splitLine: {
                //             show: false
                //         },
                //         axisLabel: {
                //             show: false,
                //         },
                //         detail: {
                //             show: false,
                //         },
                //         pointer: {
                //             show: false
                //         }
                //     },

                //     {
                //         name: "circle",
                //         type: "pie",
                //         clockWise: true,
                //         radius: ["50%", "66%"],
                //         itemStyle: {
                //             normal: {
                //                 label: {
                //                     show: false,
                //                 },
                //                 labelLine: {
                //                     show: false,
                //                 },
                //             },
                //         },
                //         hoverAnimation: false,
                //         data: [

                //             {
                //                 value: 14,
                //                 name: "占比",
                //                 itemStyle: {
                //                     normal: {
                //                         color: this.colorStyle[this.structureAssessment.spineStatus],
                //                         label: {
                //                             show: false,
                //                         },
                //                         labelLine: {
                //                             show: false,
                //                         },
                //                     },
                //                 },
                //             },
                //             {
                //                 name: "剩余",
                //                 value: 50 - this.structureAssessment.spineScore,
                //                 itemStyle: {
                //                     normal: {
                //                         color: "rgb(71,79,102)",
                //                     },
                //                 },
                //             },
                //         ],
                //     },
                // ],
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
                                    r: isDeviceReport ? 16 : 6
                                },
                                style: {
                                    fill: colorStyle,
                                    stroke: '#fff',
                                    lineWidth: isDeviceReport ? 10 : 4
                                }
                            }
                        },
                        data: [[72.5, data, max]] // [半径,当前值，最大值]
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
                        radius: ["55%", "66%"],
                        hoverAnimation: false,

                        data: [
                            {
                                value: data,
                                name: "占比",
                                grouGap: true,
                                itemStyle: {
                                    normal: {
                                        color: this.colorStyle[this.structureAssessment.spineStatus],
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
                            // {
                            //     // 画中间的图标
                            //     name: "",
                            //     value: 0,
                            //     label: {
                            //         position: "inner",
                            //         backgroundColor: {
                            //             image: groupImages[this.structureAssessment.spineStatus]
                            //             // image: require(`../../../assets/image/spine/group${this.structureAssessment.spineStatus}.png`)
                            //             // image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAv1QTFRFAAAAxKh+4sGH8NSk89Wl9dqq9N2s9N2r9duq9Nil8tSg7c+b57975LRkOTc80sGm9d+0+/HU/fbj//zx//71///3//30//rt/fXf+u3N+Nyq8MiI47NhdXyOsbK6+ffx//72///6///8///+///////9//78//75//3w//Pa89im68WFaXCDyM3X8/T4//74/vfg++S8471+ipCg1Nji/P7//v//++a+6saKNz9Wv8PP9/n6///4///1//77/vrm9t+y4LFhREpinKGv9/j8//31/vjk9+rH8+K28eCw9eW7+ezO//vs///7//zn7suO3bJrdnyQ1trh//70++vH7MyU5Lpx4bRm37Ji4rZq5Lx38NOg/fLW+Oe+2byKxsnY8vP4//3v+ujE47lx5rBW6rBN6bBP5bFZ6MGB/O/R+vTi4tTBwMLN/f3/+/LV6MKC6bBO6LBQ5bFa7c6W/fbi+vn1t7S32Nvi8NWl5LFc6LFN6LBP47hs9uC0+/v9ubvI7vD2//7s5cKI5rBU6bBN6bFN5LNf8tKZ//7z/f7/ztHf/P7///3m3bZ26LBS6a9M5bJa78mM//3y2d3p+/3+3bd457BS6rBO6rBP5LFb8MuP2dzo8/X4//7t57BT5LRh89OfzM/d4ePn9Nyx5LNh5bx3+OjF+fv9vsLR8PH0/v7//PPZ6caI5LBX5bJc8NKe/vjm9Pb5ztLe09bg9vf5///2+/LX6saI5rFS57BQ6LBR5rBT5bZk7c6X//fi//7/6e3ypqy5lpyo6evv///0/O7R8tam5b584bVs3bJl4bdt58GB89qu/vTc09nlXmd4mp6p+Pn8//////3x//Xc//HQ/+/M//LR//fg/v//6+71U1ty5+nt+vv8/v/69Pf5yM3V6u32/P3+9/r72N7q7/L2+fr9/v/98vT72N3mu7/K8/X5+vv9/v7//v7+/P3/8vX64+fxkJepy8/a5+rx9vj78PL09vf6/Pz++/z/8/X66evv8fP6y9HfnqW4J7N0rgAAAP90Uk5TAAkoVY3D4f/hw4xTJgkGetD3//////////bOeQRK0///////////////zkhF3P7//t1EQN3//91ADcr+/////soNBXj//////////////3cDJ9D/////////////ziZc+f////////////lcnf///////////53R/////////9Hq////////////6vr//////////Or////////q0f/////Rnf//////nV78////////+Vwn0P//////////////zSQDd/////////////93AwbI/v////////7IBkDd/91APN3cPD/H/8U+BHPJ9v/2yG8EAyJTjMPh4cOLUyECh2f8ewAAAbhJREFUeJxVkk9IVFEUxr/f6w9Ug8aAhDLRbASTiLChSLAgFzVLZ9lGIoYgAiOCoDZhGyWCjDahK2nT1pAWLhQLTCSLIiRoMWVmCr4ER5fvdu5906ve4p37zu+dc7/z3YvCw7/PVpoK76b/CN8zcvhPSsmuED81yDHYCaXOf7mcocVATsKvDORjKdnbzBsjZ2DNZ5I2lgvRqvON2mCa81AjgWJjq+U6JJ1+1ccHOUXHM2Ef69Zoswz9vLb6nqAsnevlbumoyb3OvGLKbOe2vQov7POSXAVuT8dyJ9rZcEFfi5GZH+gS3Hsm5/rhW2rTEd9vTKrCg6cu6jgHSynp3DkAj20xwJNHNtq1fbxTF289KxFbTb7K2JCRuyuFOalrUcWaurl1UCqXGB80W1qvUg8FxVquxLCpvA/PuWNoyExcD6ptspuR9BBecMMSI/Cz1Wb1yq5EaNTiLJeNJOOZOwOrBtRsv72HivVLJkL+4h4/8SS0m1lfuOAPJ+oY6VXqnqYohjP9ymZltJqeWl6xJvdTaNyDFc768Kon2JCf4FB2d9aty2m5hVPSgi2b/t4qbYXt57pDiELqNzRJeGvsKJ9+AAAAAElFTkSuQmCC'
                            //         },
                            //         padding: 12,
                            //     },
                            // },
                            {
                                // 画剩余的刻度圆环
                                name: "",
                                value: 50 - data,
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
        },
        dealWith(key) {
            switch (key) {
                case 0:
                    return "正常"
                case 1:
                    return "轻度异常"
                case 2:
                    return "中度异常"
                default:
                    return "重度异常"
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cardBox1{

    width: 330px;
    height: 240px;
    position: relative;
    margin: 0 auto;
     .line {
        position: absolute;
        width: 51px;
        height: 1px;
        background-color:#8AA3BE;
        top: 51%;
        left: calc(50% - 25px);
    }
}
.dashboardBox {
    width: 330px;
    height: 240px;
    margin: 0 auto;
}
</style>