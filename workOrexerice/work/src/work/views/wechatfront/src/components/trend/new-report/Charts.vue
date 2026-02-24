<template>
    <li>
        <div :class="['top-title', isDeviceReport ? 'isDeviceReport' : '']">
            <span>
                <!-- <img src="../../assets/images/svg/WT.svg" alt v-if="abbr === 'WT'" />
        <img src="../../assets/images/svg/BFM.svg" alt v-if="abbr === 'BFM'" />
        <img src="../../assets/images/svg/BMI.svg" alt v-if="abbr === 'BMI'" />
        <img src="../../assets/images/svg/BMR.svg" alt v-if="abbr === 'BMR'" />
        <img src="../../assets/images/svg/FFM.svg" alt v-if="abbr === 'FFM'" />
        <img src="../../assets/images/svg/LM.svg" alt v-if="abbr === 'LM'" />
        <img src="../../assets/images/svg/PBF.svg" alt v-if="abbr === 'PBF'" />
        <img src="../../assets/images/svg/PLM.svg" alt v-if="abbr === 'PLM'" />
        <img src="../../assets/images/svg/PROTEIN.svg" alt v-if="abbr === 'PROTEIN'" />
        <img src="../../assets/images/svg/PTBW.svg" alt v-if="abbr === 'PTBW'" />
        <img src="../../assets/images/svg/SM.svg" alt v-if="abbr === 'SM'" />
        <img src="../../assets/images/svg/TBW.svg" alt v-if="abbr === 'TBW'" />
        <img src="../../assets/images/svg/TM.svg" alt v-if="abbr === 'TM'" />
        <img src="../../assets/images/svg/WHR.svg" alt v-if="abbr === 'WHR'" />
        <img src="../../assets/images/svg/ICW.svg" alt v-if="abbr === 'ICW'" />
        <img src="../../assets/images/svg/ECW.svg" alt v-if="abbr === 'ECW'" />
        <img src="../../assets/images/svg/NZZF.svg" alt v-if="abbr === 'vaGrade'" />

        <img class="girth-icon" src="../../assets/images/round_bust.png" alt v-if="abbr === 'bustGirth'" />
        <img class="girth-icon" src="../../assets/images/round_waistline.png" alt v-if="abbr === 'waistGirth'" />
        <img class="girth-icon" src="../../assets/images/round_hipCircumference.png" alt v-if="abbr === 'hipGirth'" />
        <img
          class="girth-icon"
          src="../../assets/images/ther_leftupperlimb.png"
          alt
          v-if="abbr === 'leftUpperArmGirth'"
        />
        <img
          class="girth-icon"
          src="../../assets/images/ther_rightupperlimb.png"
          alt
          v-if="abbr === 'rightUpperArmGirth'"
        />
        <img class="girth-icon" src="../../assets/images/round_leftthigh.png" alt v-if="abbr === 'leftThighGirth'" />
        <img class="girth-icon" src="../../assets/images/round_rightthigh.png" alt v-if="abbr === 'rightThighGirth'" />
        <img class="girth-icon" src="../../assets/images/round_leftleg.png" alt v-if="abbr === 'leftCalfGirth'" />
        <img class="girth-icon" src="../../assets/images/round_rightlowerleg.png" alt v-if="abbr === 'rightCalfGirth'" /> -->
                <div class="img-block"></div>
                {{ name }}
                <i v-if="unit" class="unit">&nbsp;&nbsp;</i>
                <span class="unit">{{ unit }}</span>
            </span>
            <!-- <span>理想值：{{ idValue }}</span> -->
        </div>
        <div :class="['bottom-chart', isDeviceReport ? 'isDeviceReport' : '']" :style="{ height: isDeviceReport ? '180px' : '160px' }">
            <div :class="`body-weight echarts-${idx}`" :style="{ width: 'auto', height: '190px' }"></div>
            <p v-if="!min && !max"><img src="@/assets/images/new-report/error-warning-line.svg" alt="icon" /> {{
                $t('girth.noHistory')
            }}
            </p>
        </div>
    </li>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')

export default {
    props: [
        'idx',
        'abbr', // 缩写
        'name', // 类别
        'unit', // 单位
        'idValue', // 理想值
        'times', // 横坐标
        'lineData', // 类别值
        'min',
        'max',
        'val'
    ],
    data() {
        return {
             isDeviceReport: window.sessionStorage.getItem('isDeviceReport'),
        }
    },
    watch: {
        lineData: {
            immediate: true,
            handler() {
                setTimeout(() => {
                    this.drawLine()
                }, 0)
            }
        }
    },
    methods: {
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.querySelector(`.echarts-${this.idx}`))

            // 绘制图表
            let options = {
                tooltip: {
                    show: false
                },
                grid: {
                    x: 46,
                    x2: 20,
                    containLabel: false,
                    left: this.isDeviceReport ? '9.6%' : '14%'
                },
                textStyle: {
                    fontSize: 11,
                    color: '#8c8d96'
                },
                xAxis: {
                    // 横坐标时间
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#3f3f7e'
                        }
                    },
                    // boundaryGap: false,
                    boundaryGap: true,
                    axisTick: {
                        inside: true,
                        length: 6,
                        lineStyle: {
                            shadowOffsetY: 0
                        },
                        alignWithLabel: true,
                        interval: 0
                    },
                    axisLabel: {
                        showMinLabel: true,
                        showMaxLabel: true,
                        interval: 0,
                        fontSize: this.isDeviceReport ? 22 : 11,
                        // eslint-disable-next-line no-unused-vars
                        formatter: function (value, index) {
                            if (value.indexOf('*') > -1) {
                                return value.replace(/\*/g, '') + '\n失败'
                            } else {
                                return value
                            }
                        }
                    }
                },
                yAxis: {
                    min: '',
                    splitNumber: '3',
                    max: '',
                    interval: 3,
                    splitLine: {
                        show: false
                    },
                    // 刻度值颜色
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#3f3f7e'
                        }
                    },
                    axisTick: {
                        inside: true,
                        length: 6,
                        lineStyle: {
                            shadowOffsetX: 0
                        },
                    },
                    axisLabel: {
                        showMinLabel: true,
                        showMaxLabel: true,
                        fontSize: this.isDeviceReport ? 20 : 11,
                        // eslint-disable-next-line no-unused-vars
                        formatter: function (value, index) {
                            return value.toFixed(1)
                        }
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'line',
                        // 折线点颜色
                        symbol: 'circle',
                        symbolSize: 6,
                        connectNulls: true,
                        itemStyle: {
                            normal: {
                                color: '#fff',
                                borderColor: '#2ec7c9',
                                lineStyle: {
                                    color: '#2ec7c9'
                                },
                                label: {
                                    show: false,
                                    formatter: function (param) {
                                        // if (param.dataIndex === 0) {
                                        //     param.value = ''
                                        //     param.data = null
                                        // }
                                        return param.value
                                    }
                                }
                            }
                        },
                        // 折线线条颜色
                        lineStyle: {
                            normal: {
                                color: '#2ec7c9',
                                lineStyle: {
                                    color: '#2ec7c9'
                                }
                            }
                        },
                        // 区域渐变颜色
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#326280' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#202445' // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        // 平均值线
                        markLine: {
                            symbol: 'none',
                            data: [
                                {
                                    yAxis: '',
                                    // type: 'average',
                                    lineStyle: {
                                        normal: {
                                            color: '#fff',
                                            width: 0,
                                            type: 'solid'
                                        }
                                    }
                                }
                            ],
                            animation: false,
                            label: {
                                show: false
                            }
                        },
                        // 对应值显示
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         position: 'insideTop',
                        //     },
                        // },
                        // 各个时间对应的坐标值
                        data: []
                    }
                ]
            }
            let option = {
                tooltip: {
                    show: false
                },
                grid: {
                    x: 46,
                    x2: 20,
                    containLabel: false,
                    left: this.isDeviceReport ? '12%' : '14%',
                },
                textStyle: {
                    fontSize: 11,
                    color: '#8c8d96'
                },
                xAxis: {
                    // 横坐标时间
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#3f3f7e'
                        }
                    },
                    // boundaryGap: false,
                    boundaryGap: true,
                    axisTick: {
                        inside: true,
                        length: 6,
                        lineStyle: {
                            shadowOffsetY: 0
                        },
                        alignWithLabel: true,
                        interval: 0
                    },
                    axisLabel: {
                        showMinLabel: true,
                        showMaxLabel: true,
                        interval: 0,
                        fontSize: this.isDeviceReport ? 20 : 11,
                        // eslint-disable-next-line no-unused-vars
                        formatter: function (value, index) {
                            if (value.indexOf('*') > -1) {
                                return value.replace(/\*/g, '') + '\n失败'
                            } else {
                                return value
                            }
                        }
                    }
                },
                yAxis: {
                    min: '',
                    splitNumber: '3',
                    max: '',
                    interval: 3,
                    splitLine: {
                        show: false
                    },
                    // 刻度值颜色
                    axisLine: {
                        lineStyle: {
                            color: '#3f3f7e'
                        }
                    },
                    axisTick: {
                        inside: true,
                        length: 6,
                        lineStyle: {
                            shadowOffsetX: 0
                        }
                    },
                    axisLabel: {
                        showMinLabel: true,
                        showMaxLabel: true,
                        fontSize: this.isDeviceReport ? 20 : 11,
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'line',
                        // 折线点颜色
                        symbol: 'circle',
                        symbolSize: 6,
                        // 空白数据连接
                        connectNulls: true,
                        itemStyle: {
                            normal: {
                                color: '#fff',
                                borderColor: '#2ec7c9',
                                lineStyle: {
                                    color: '#2ec7c9'
                                },
                                label: {
                                    show: false,
                                    formatter: function (param) {
                                        if (option.xAxis.data.length === 8) {
                                            if (
                                                param.dataIndex === 0 ||
                                                param.dataIndex === 2 ||
                                                param.dataIndex === 4 ||
                                                param.dataIndex === 6
                                            ) {
                                                param.value = ''
                                                param.data = null
                                            }
                                        } else if (option.xAxis.data.length === 7) {
                                            if (
                                                param.dataIndex === 0 ||
                                                param.dataIndex === 2 ||
                                                param.dataIndex === 4 ||
                                                param.dataIndex === 6
                                            ) {
                                                param.value = ''
                                                param.data = null
                                            }
                                        }
                                        return param.value
                                    }
                                }
                            }
                        },
                        // 折线线条颜色
                        lineStyle: {
                            normal: {
                                color: '#2ec7c9',
                                lineStyle: {
                                    color: '#2ec7c9'
                                }
                            }
                        },
                        // 区域渐变颜色
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#326280' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#202445' // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        // 平均值线
                        markLine: {
                            symbol: 'none',
                            data: [
                                {
                                    yAxis: '',
                                    // type: 'average',
                                    lineStyle: {
                                        normal: {
                                            color: '#fff',
                                            width: 0,
                                            type: 'solid'
                                        }
                                    }
                                }
                            ],
                            animation: false,
                            label: {
                                show: false
                            }
                        },
                        // 对应值显示
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         position: 'insideTop',
                        //     },
                        // },
                        // 各个时间对应的坐标值
                        data: []
                    }
                ]
            }
            let optiones = {
                tooltip: {
                    show: false
                },
                grid: {
                    x: 46,
                    x2: 20,
                    containLabel: false
                },
                textStyle: {
                    fontSize: 11,
                    color: '#8c8d96'
                },
                xAxis: {
                    // 横坐标时间
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#3f3f7e'
                        }
                    },
                    // boundaryGap: false,
                    boundaryGap: true,
                    axisTick: {
                        inside: true,
                        length: 6,
                        lineStyle: {
                            shadowOffsetY: 0
                        },
                        alignWithLabel: true,
                        interval: 0
                    },
                    axisLabel: {
                        showMinLabel: true,
                        showMaxLabel: true,
                        interval: 0,
                        fontSize: this.isDeviceReport ? 20 : 11,
                        // eslint-disable-next-line no-unused-vars
                        formatter: function (value, index) {
                            if (value.indexOf('*') > -1) {
                                return value.replace(/\*/g, '') + '\n失败'
                            } else {
                                return value
                            }
                        }
                    }
                },
                yAxis: {
                    min: '',
                    splitNumber: '3',
                    max: '',
                    interval: 3,
                    splitLine: {
                        show: false
                    },
                    // 刻度值颜色
                    axisLine: {
                        lineStyle: {
                            color: '#3f3f7e'
                        }
                    },
                    axisTick: {
                        inside: true,
                        length: 6,
                        lineStyle: {
                            shadowOffsetX: 0
                        }
                    },
                    axisLabel: {
                        showMinLabel: true,
                        showMaxLabel: true,
                        fontSize: this.isDeviceReport ? 20 : 11,
                        // eslint-disable-next-line no-unused-vars
                        formatter: function (value, index) {
                            return value.toFixed(2)
                        }
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'line',
                        // 折线点颜色
                        symbol: 'circle',
                        symbolSize: 6,
                        connectNulls: true,
                        itemStyle: {
                            normal: {
                                color: '#fff',
                                borderColor: '#2ec7c9',
                                lineStyle: {
                                    color: '#2ec7c9'
                                },
                                label: {
                                    show: false,
                                    formatter: function (param) {
                                        return param.value
                                    }
                                }
                            }
                        },
                        // 折线线条颜色
                        lineStyle: {
                            normal: {
                                color: '#2ec7c9',
                                lineStyle: {
                                    color: '#2ec7c9'
                                }
                            }
                        },
                        // 区域渐变颜色
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#326280' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#202445' // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        // 平均值线
                        markLine: {
                            symbol: 'none',
                            data: [
                                {
                                    yAxis: '',
                                    // type: 'average',
                                    lineStyle: {
                                        normal: {
                                            color: '#fff',
                                            width: 0,
                                            type: 'solid'
                                        }
                                    }
                                }
                            ],
                            animation: false,
                            label: {
                                show: false
                            }
                        },
                        // 对应值显示
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         position: 'insideTop',
                        //     },
                        // },
                        // 各个时间对应的坐标值
                        data: []
                    }
                ]
            }
            // 基础代谢 数据为1-6 7 8 不同展示
            if (this.abbr === 'BMR') {
                option.xAxis.data = this.times
                option.series[0].data = this.lineData
                option.series[0].markLine.data[0].yAxis = this.idValue
                option.yAxis.min = (this.min * 0.8).toFixed(1)
                option.yAxis.max = (this.max * 1.2).toFixed(1)
                option.yAxis.interval = this.val
                myChart.setOption(option)
            } else if (this.abbr === 'WHR') {
                // 腰臀比保留两位小数
                optiones.xAxis.data = this.times
                optiones.series[0].data = this.lineData
                optiones.series[0].markLine.data[0].yAxis = this.idValue
                optiones.yAxis.min = (this.min * 0.8).toFixed(2)
                optiones.yAxis.max = (this.max * 1.2).toFixed(2)
                optiones.yAxis.interval = this.val
                myChart.setOption(optiones)
            } else {
                options.xAxis.data = this.times
                let nameArrg = []
                for (let index = 0; index < this.lineData.length; index++) {
                    console.log(!this.lineData[index])
                    if (this.lineData[index] === '0.0') {
                        nameArrg.push('')
                    } else {
                        nameArrg.push(this.lineData[index])
                    }

                }
                options.series[0].data = nameArrg
                options.series[0].markLine.data[0].yAxis = this.idValue
                // options.yAxis.min = 'dataMin';
                // options.yAxis.max = 'dataMax';
                options.yAxis.min = (this.min * 0.8).toFixed(1)
                options.yAxis.max = (this.max * 1.2).toFixed(1)
                options.yAxis.interval = this.val
                myChart.setOption(options)
            }
            window.onresize = function () {
                myChart.resize({ width: window.innerWidth, height: window.innerHeight })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.top-title {
    span {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        font-family: PingFang SC;

        .img-block {
            margin: 14px 14px 0 4px;
            width: 2px;
            height: 12px;
            background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
        }

        // 禁止部分安卓机下图片自动放大
        img {
            pointer-events: none;
            margin-right: 10px;
        }

        .unit {
            color: #8aa3be;
        }

        .help-icon {
            width: 10px;
            height: 10px;
            margin-top: 16px;
            margin-left: 5px;
        }
    }

    .girth-icon {
        width: 20px;
        height: 20px;
        margin-top: 10px;
    }
}

.bottom-chart {
    position: relative;

    p {
        position: absolute;
        top: 37px;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8AA3BE;
        line-height: 18px;

        img {
            width: 12px;
            height: 12px;
            position: relative;
            top: 1.4px;
        }

        span {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid #8AA3BE;
            border-radius: 50%;
            text-align: center;
            font-size: 12px;

        }
    }
}
.isDeviceReport{
    span, p{
        font-family: inherit !important;
    }
}
</style>

