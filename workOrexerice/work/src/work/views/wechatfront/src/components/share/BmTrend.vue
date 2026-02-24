<template>
    <!-- 分享 体成分趋势 -->
    <div class="trend-page">
        <template v-for="(trend, index) in trendList">
            <div class="trend-item" :class="{'compress': isCompress }" v-bind:key="index">
                <p>{{ trend.name }}变化</p>
                <div :id="trend.dataColumn" :style="trendStyle"></div>
            </div>
        </template>
    </div>
</template>
<script>
// 按需引入
const echarts = require('echarts/lib/echarts')
// 折线图
require('echarts/lib/chart/line')
// 标注线
require('echarts/lib/component/markLine')
import { findBmMassQuotaTrend } from '@/assets/js/apolloGql.js'
import { toDecimal2 } from '@/assets/js/util.js'
export default {
    name: 'BmTrend',
    props: {
        styles: Object,
        // 压缩（针对分享截图）
        isCompress: Boolean
    },
    data() {
        return {
            // 本次扫描信息
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            compareData: JSON.parse(window.sessionStorage.getItem('trendData')),
            trendList: [],
            trendStyle: ''
        }
    },
    mounted() {
        // 如果有自定义样式
        this.trendStyle = {
            width: '100vw',
            height: '48vw'
        }
        if (this.styles) {
            this.trendStyle = Object.assign(this.trendStyle, this.styles)
        }
    },
    created() {
        // this.getTrendScanIds()
    },
    methods: {
        init(scanIds) {
            let that = this
            const ids = scanIds
            this.$apollo
                .query({
                    query: findBmMassQuotaTrend,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanIds: ids
                    }
                })
                .then(res => {
                    const data = res.data.findBmMassQuotaTrend
                    if (data && data.code === 200) {
                        const trendList = JSON.parse(JSON.stringify(data.data))
                        trendList.forEach(trend => {
                            if (['WT', 'PBF', 'LM'].indexOf(trend.dataColumn) > -1) {
                                const times = []
                                const values = []
                                // 历史在左边 最新在右边
                                trend.trendData.sort((a, b) => {
                                    return (
                                        new Date(`${a.measureTime}`).getTime() - new Date(`${b.measureTime}`).getTime()
                                    )
                                })
                                trend.trendData.forEach(item => {
                                    const timeAry = item.measureTime.split('-')
                                    times.push(`${timeAry[1]}.${timeAry[2]}`)
                                    values.push(item.v)
                                })
                                trend.times = times
                                trend.values = values
                                // 测量最大值
                                const min = Math.min(...trend.values)
                                // 测量最小值
                                const max = Math.max(...trend.values)
                                // y轴显示最小值
                                const yMin = min - (max - min) / 3
                                // y轴最小值
                                trend.min = yMin < 0 ? 0 : yMin
                                // y轴最大值
                                trend.max = max
                                that.trendList.push(trend)
                                that.$nextTick(() => {
                                    that.drawChart(trend)
                                })
                            }
                        })
                    } else {
                        this.dataLoadErr('findBmMassQuotaTrend')
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('findBmMassQuotaTrend')
                })
        },
        drawChart(item) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById(item.dataColumn))

            // 绘制图表
            let option = {
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
                    type: 'category',
                    // 横坐标时间
                    data: item.times,
                    axisLine: {
                        lineStyle: {
                            color: '#3f3f7e'
                        }
                    },
                    // 两端空白策略 true 留白 false 顶头
                    boundaryGap: item.times.length === 8 ? false : true,
                    axisTick: {
                        inside: true,
                        length: 6,
                        lineStyle: {
                            shadowOffsetY: 0
                        },
                        alignWithLabel: true
                    },
                    // 坐标文本
                    axisLabel: {
                        showMinLabel: true,
                        showMaxLabel: true,
                        formatter: function(value, index) {
                            if (value.indexOf('*') > -1) {
                                return value.replace(/\*/g, '') + '\n失败'
                            } else {
                                return value
                            }
                        }
                    }
                },
                yAxis: {
                    // 最大坐标 最小坐标
                    min: item.min,
                    max: item.max,
                    // 分段数
                    splitNumber: 1,
                    // 分段间隔
                    interval: Number(item.max),
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
                    // 坐标文本
                    axisLabel: {
                        showMinLabel: false,
                        showMaxLabel: false,
                        formatter: function(value, index) {
                            return value.toFixed(1)
                        }
                    }
                },
                // 通用设置
                series: [
                    {
                        type: 'line',
                        // 折线点颜色
                        symbol: 'circle',
                        // 折线图层级 遮盖标注线
                        zlevel: 1,
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
                                    formatter: function(param) {
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
                        // 对应值显示
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        // 标注线
                        markLine: {
                            // 不响应鼠标事件
                            silent: true,
                            // 标线两端类型 为空
                            symbol: '',
                            // 文本
                            label: {
                                // 数值显示位置
                                position: 'start',
                                // 格式化显示精度
                                formatter: function(type) {
                                    return toDecimal2(type.data.value, 1)
                                }
                            },
                            // 线条颜色
                            itemStyle: {
                                normal: {
                                    color: '#606060'
                                }
                            },
                            effect: {
                                show: true
                            },
                            // 最大最小添加标注
                            data: [{ type: 'min', name: '最小值' }, { type: 'max', name: '最大值' }]
                        },
                        // 各个时间对应的坐标值
                        data: item.values
                    }
                ]
            }
            myChart.setOption(option)
        },
        // 接口加载失败
        dataLoadErr(name) {
            console.error('bmTrend中接口加载失败！失败接口:', name)
            this.$nextTick(() => {
                this.$emit('loadError', 'bmTrend')
            })
        }
    }
}
</script>
<style lang="less">
.trend-page {
    .trend-item {
        position: relative;
        width: 100%;
        height: 140px;
        overflow: hidden;
        p {
            position: absolute;
            left: 10px;
            color: #ffffff;
            text-align: left;
            font-size: 0.8em;
        }
        > div {
            margin-top: 5px;
            > div {
                canvas {
                    top: -30px !important;
                    height: 47vw !important;
                }
            }
        }

        &.compress {
            height: 100px;

            > div {
                > div {
                    canvas {
                        top: -30px !important;
                        height: 39vw !important;
                    }
                }
            }
        }
    }
}
</style>

