<template>
    <li>
        <div class="top-title">
            <span>
                <img src="../../assets/images/svg/WT.svg" alt v-if="abbr === 'WT'" />
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
                <img src="../../assets/images/svg/age.svg" alt v-if="abbr === 'METABOLICAGE'" />
                <img class="girth-icon" src="../../assets/images/round_bust.png" alt v-if="abbr === 'bustGirth'" />
                <img class="girth-icon" src="../../assets/images/round_waistline.png" alt v-if="abbr === 'waistGirth'" />
                <img class="girth-icon" src="../../assets/images/round_hipCircumference.png" alt
                    v-if="abbr === 'hipGirth'" />
                <img class="girth-icon" src="../../assets/images/ther_leftupperlimb.png" alt
                    v-if="abbr === 'leftUpperArmGirth'" />
                <img class="girth-icon" src="../../assets/images/ther_rightupperlimb.png" alt
                    v-if="abbr === 'rightUpperArmGirth'" />
                <img class="girth-icon" src="../../assets/images/round_leftthigh.png" alt
                    v-if="abbr === 'leftThighGirth'" />
                <img class="girth-icon" src="../../assets/images/round_rightthigh.png" alt
                    v-if="abbr === 'rightThighGirth'" />
                <img class="girth-icon" src="../../assets/images/round_leftleg.png" alt v-if="abbr === 'leftCalfGirth'" />
                <img class="girth-icon" src="../../assets/images/round_rightlowerleg.png" alt
                    v-if="abbr === 'rightCalfGirth'" />

                <img class="girth-icon" src="../../assets/images/svg/neck_img.svg" alt v-if="abbr === 'neckGirth'" />
                <img class="girth-icon" src="../../assets/images/svg/midWaistGirth_img.svg" alt
                    v-if="abbr === 'midWaistGirth'" />
                <img class="girth-icon" src="../../assets/images/svg/left_min_thigh_girth_img.svg" alt
                    v-if="abbr === 'leftMinThighGirth'" />
                <img class="girth-icon" src="../../assets/images/svg/right_min_thigh_girth_img.svg" alt
                    v-if="abbr === 'rightMinThighGirth'" />
                {{ name }}
                <i v-if="unit">&nbsp;|&nbsp;</i>
                {{ unit }}
            </span>
            <!-- <span>理想值：{{ idValue }}</span> -->
        </div>
        <div class="bottom-chart">
            <div :class="`body-weight echarts-${idx}`"></div>
        </div>
    </li>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
// import thermalImg10 from '@/assets/images/svg/neck_img.svg'
// import thermalImg11 from '@/assets/images/svg/midWaistGirth_img.svg'
// // left_min_thigh_girth_img
// import thermalImg12 from '@/assets/images/svg/left_min_thigh_girth_img.svg'
// import thermalImg13 from '@/assets/images/svg/right_min_thigh_girth_img.svg'
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
            const el = document.querySelector(`.echarts-${this.idx}`)
            if (!el) return
            // 销毁已有实例避免内存泄漏
            if (this._chart) {
                try {
                    this._chart.dispose()
                } catch (e) {}
                this._chart = null
            }
            this._chart = echarts.init(el)


            const baseWidth = 375 // 基准宽度，用于缩放
            const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
            const getScale = () => clamp(el.clientWidth / baseWidth, 0.6, 1.6)
            const applyScale = (opt, scale) => {
                const s = (v) => Math.max(1, Math.round(v * scale))
                // 全局文字大小
                opt.textStyle = opt.textStyle || {}
                opt.textStyle.fontSize = s(11)
                // grid 缩放
                if (opt.grid) {
                    opt.grid.x = s(46)
                    opt.grid.x2 = s(20)
                    // top/bottom 控制上下间距
                    opt.grid.top = s(30)
                    opt.grid.bottom = s(30)
                }
                // x/y 轴刻度长度与文字
                if (opt.xAxis) {
                    opt.xAxis.axisTick = opt.xAxis.axisTick || {}
                    opt.xAxis.axisTick.length = s(6)
                    opt.xAxis.axisLabel = opt.xAxis.axisLabel || {}
                    opt.xAxis.axisLabel.textStyle = { fontSize: s(10) }
                }
                if (opt.yAxis) {
                    opt.yAxis.axisTick = opt.yAxis.axisTick || {}
                    opt.yAxis.axisTick.length = s(6)
                    opt.yAxis.axisLabel = opt.yAxis.axisLabel || {}
                    opt.yAxis.axisLabel.textStyle = { fontSize: s(10) }
                }
                // series 点大小、label 大小
                if (opt.series && opt.series[0]) {
                    opt.series[0].symbolSize = s(6)
                    opt.series[0].itemStyle = opt.series[0].itemStyle || {}
                    opt.series[0].itemStyle.normal = opt.series[0].itemStyle.normal || {}
                    opt.series[0].itemStyle.normal.label = opt.series[0].itemStyle.normal.label || {}
                    opt.series[0].itemStyle.normal.label.fontSize = s(10)
                    // 若使用 option.xAxis.data length 控制隐藏点逻辑，需要保持原逻辑不变
                }
            }
            // 绘制图表
            let options = {
                tooltip: {
                    show: false
                },
                grid: {
                    x: 46,
                    x2: 20,
                    top: 20,
                    bottom: 20,
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
                                    show: true,
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
                    top: 20,
                    bottom: 20,
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
                        showMaxLabel: true
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
                                    show: true,
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
                    top: 20,
                    bottom: 20,
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
                                    show: true,
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
            let selectedOption
            if (this.abbr === 'BMR') {
                option.xAxis.data = this.times
                option.series[0].data = this.lineData
                option.series[0].markLine.data[0].yAxis = this.idValue
                option.yAxis.min = (this.min * 0.8).toFixed(1)
                option.yAxis.max = (this.max * 1.2).toFixed(1)
                option.yAxis.interval = this.val
                selectedOption = option
            } else if (this.abbr === 'WHR') {
                optiones.xAxis.data = this.times
                optiones.series[0].data = this.lineData
                optiones.series[0].markLine.data[0].yAxis = this.idValue
                optiones.yAxis.min = (this.min * 0.8).toFixed(2)
                optiones.yAxis.max = (this.max * 1.2).toFixed(2)
                optiones.yAxis.interval = this.val
                selectedOption = optiones
            } else {
                options.xAxis.data = this.times
                options.series[0].data = this.lineData
                options.series[0].markLine.data[0].yAxis = this.idValue
                options.yAxis.min = (this.min * 0.8).toFixed(1)
                options.yAxis.max = (this.max * 1.2).toFixed(1)
                options.yAxis.interval = this.val
                selectedOption = options
            }

            // 应用初始缩放
            const scale = getScale()
            applyScale(selectedOption, scale)
            this._chart.setOption(selectedOption, true)

            // 响应容器尺寸变化：优先使用 ResizeObserver，fallback 到 window.onresize
            if (typeof ResizeObserver !== 'undefined') {
                if (this._ro) this._ro.disconnect()
                this._ro = new ResizeObserver(() => {
                    const newScale = getScale()
                    applyScale(selectedOption, newScale)
                    try {
                        this._chart.resize()
                        this._chart.setOption(selectedOption, true)
                    } catch (e) {}
                })
                this._ro.observe(el)
            } else {
                // 保持旧逻辑以兼容不支持 ResizeObserver 的环境
                window.onresize = () => {
                    try {
                        this._chart.resize({ width: window.innerWidth, height: window.innerHeight })
                    } catch (e) {}
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.top-title {
    span {
        display: flex;
        flex-direction: row;
        align-items: center;

        // 禁止部分安卓机下图片自动放大
        img {
            pointer-events: none;
            margin-right: 10px;
        }
    }

    i {
        font-style: normal;
    }

    img {
        width: 18px;
        height: 18px;
    }

    .girth-icon {
        width: 20px;
        height: 20px;
    }
}
.bottom-chart {
    .body-weight {
        width: auto;
        height: 130px;
    }
}
</style>

