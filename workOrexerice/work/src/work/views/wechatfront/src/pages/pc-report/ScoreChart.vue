<template>
    <div class="score-chart" ref="chart"></div>
</template>

<script>
import echarts from 'echarts'

export default {
    name: 'ScoreChart',
    props: {
        // 分数值
        value: {
            type: Number,
            default: 80
        }
    },
    data() {
        return {
            chartInstance: null
        }
    },
    watch: {
        // 监听 value 变化，重新渲染图表
        value() {
            this.$nextTick(() => {
                this.initChart()
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy() {
        if (this.chartInstance) {
            this.chartInstance.dispose()
            this.chartInstance = null
        }
    },
    methods: {
        initChart() {
            // 如果已存在图表实例，先销毁
            if (this.chartInstance) {
                this.chartInstance.dispose()
            }
            this.chartInstance = echarts.init(this.$refs.chart)
            const chart = this.chartInstance
            const value = this.value

            // 先渲染饼图，不显示小圆点
            const option = {
                series: [
                    {
                        type: 'pie',
                        radius: ['85%', '100%'],
                        startAngle: 270, // 起点位置：6点钟方向（正下方）
                        clockwise: true, // 顺时针方向
                        hoverAnimation: false,
                        label: {
                            show: true,
                            position: 'center',
                            formatter: String(value),
                            color: '#FFFFFF',
                            fontSize: 36,
                            fontWeight: 'bold'
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value: value,
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            {
                                                offset: 0,
                                                color: '#4C83FF'// 0% 处的颜色
                                            },
                                            {
                                                offset: 1,
                                                color: '#7F5BFF' // 100% 处的颜色
                                            }
                                        ],
                                        globalCoord: false
                                    }
                                }
                            },
                            {
                                value: 100 - value,
                                itemStyle: {
                                    color: '#35377A'
                                },
                                label: {
                                    show: false
                                }
                            }
                        ]
                    }
                ]
            }
            chart.setOption(option)

            // 等待饼图动画完成后再显示小圆点（默认动画时长约 1000ms）
            setTimeout(() => {
                if (!this.chartInstance) return
                // 计算小圆点位置
                // 饼图从6点钟方向(270度)开始，顺时针旋转
                // 角度计算：270 - 360 * (百分比)
                const angle = (270 - 360 * (value / 100)) * (Math.PI / 180)
                const width = this.chartInstance.getWidth()
                const height = this.chartInstance.getHeight()
                const cx = width / 2
                const cy = height / 2
                const R = Math.min(width, height) / 2
                const r = R * (0.85 + 1) / 2 // 半径 = (外圆半径 + 内圆半径) / 2
                const x = cx + r * Math.cos(angle)
                const y = cy - r * Math.sin(angle)

                chart.setOption({
                    graphic: {
                        elements: [{
                            type: 'circle',
                            shape: {
                                cx: x,
                                cy: y,
                                r: 4
                            },
                            style: {
                                fill: '#fff',
                                shadowBlur: 2,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            z: 10
                        }]
                    }
                })
            }, 300)
        }
    }
}
</script>

<style scoped lang="less">
.score-chart {
    width: 100%;
    height: 100%;
}
</style>
