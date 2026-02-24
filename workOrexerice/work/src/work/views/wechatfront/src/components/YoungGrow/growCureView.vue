<template>
    <div class="cardBox1">
        <div class="labels">
            <p class="lefttitle">BMI <br />(kg/㎡)</p>
            <div :class="['scale', isDeviceReport ? '' : 'nodevice']">
                <div>29</div>
                <div>28</div>
                <div>26</div>
                <div>24</div>
                <div>22</div>
                <div>20</div>
                <div>18</div>
                <div>16</div>
                <div>14</div>
                <div>13</div>
            </div>
        </div>
        <div id="growCureViewSS" class="dashboardBox">
        </div>
        <div class="labels rightlabel">
            <p class="righttitle">BMI <br />(kg/㎡)</p>
            <div :class="['scale', isDeviceReport ? '' : 'nodevice']">
                <div>29</div>
                <div>28</div>
                <div>26</div>
                <div>24</div>
                <div>22</div>
                <div>20</div>
                <div>18</div>
                <div>16</div>
                <div>14</div>
                <div>13</div>
            </div>
        </div>
        <p class="yearTxt">(岁)</p>
    </div>

</template>

<script>
import * as echarts from 'echarts'
let ageData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

// 不同百分位数的BMI曲线
let p3 = [13.2, 14.8, 15.2, 15.0, 14.8, 14.6, 14.4, 14.3, 14.2, 14.1, 14.2, 14.4, 14.7, 15.1, 15.5, 15.9, 16.3, 16.6, 16.9].slice(1)
let p15 = [14.0, 15.8, 16.2, 16.0, 15.8, 15.6, 15.4, 15.3, 15.2, 15.1, 15.2, 15.4, 15.7, 16.1, 16.5, 16.9, 17.3, 17.6, 17.9].slice(1)
let p50 = [15.0, 16.8, 17.2, 17.0, 16.8, 16.6, 16.4, 16.3, 16.2, 16.1, 16.2, 16.4, 16.7, 17.1, 17.5, 17.9, 18.3, 18.6, 18.9].slice(1)
let p85 = [16.2, 18.0, 18.4, 18.2, 18.0, 17.8, 17.6, 17.5, 17.4, 17.3, 17.4, 17.6, 17.9, 18.3, 18.7, 19.1, 19.5, 19.8, 20.1].slice(1)
let p97 = [17.6, 19.4, 19.8, 19.6, 19.4, 19.2, 19.0, 18.9, 18.8, 18.7, 18.8, 19.0, 19.3, 19.7, 20.1, 20.5, 20.9, 21.2, 21.5].slice(1)

export default {
    props: {
        GrowthCurveViewData: {
            type: Object,
            default: {
                BMI: 0,
                age: 17,
            }
        }
    },
    data() {
        return {
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    watch: {
        GrowthCurveViewData() {
            this.initChart()
        }
    },
    mounted() {
        this.initChart()

    },
    methods: {
        initChart() {
            const dom = document.getElementById("growCureViewSS")
            let chart = echarts.init(dom)
            const { age, BMI } = this.GrowthCurveViewData
            let formatBMI = Math.round(BMI) >= 29 ? 28.5 : Math.round(BMI) <= 12 ? 12.5 : Math.round(BMI) // 如果BMI大于30，则显示30.5，否则显示实际值

            let option = {
                title: {
                    text: 'BMI标准生长曲线',
                    left: 'center',
                    textStyle: {
                        "color": "#fff",
                         fontSize: this.isDeviceReport ? 44 : 16
                    },
                    top: this.isDeviceReport ? 34 : 7
                },

                grid: {
                    left: '10%',
                    right: this.isDeviceReport ? '10.4%' : '10%',
                    bottom: this.isDeviceReport ? '5.8%' : '4%',
                    top: this.isDeviceReport ? '13.6%' : '13%',
                    containLabel: true,
                    show: false,
                },
                xAxis: {
                    type: 'value',
                    position: 'center',
                    left: 'center',
                    min: 1,
                    max: 18,
                    interval: 1,  // 每1岁一个刻度
                    axisLabel: {
                        formatter: value => {
                            return value % 2 === 0 ? value : ''
                        },
                        fontSize: this.isDeviceReport ? 24 : 12,
                        fontWeight: 500,
                        splitNumber: 5,
                        interval: (index) => {
                            return '1'
                        },
                        color: "#fff"
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.10)'
                        }
                    },
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    // 网格样式
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#B4D1F6'],
                            width: 1,
                            type: 'solid',
                        },
                    },
                },
                yAxis: [{
                    type: 'value',
                    position: 'left',
                    left: 30,
                    min: 12,
                    max: 29,
                    interval: 1,  // 每1kg/m²一个刻度
                    backGround: '#fff',
                    axisLabel: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.10)'
                        }
                    },
                    // 网格样式
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#B4D1F6'],
                            width: 1,
                            type: 'solid',
                        },
                    },
                }],
                series: [
                    {
                        name: 'P3 (第3百分位)',
                        type: 'line',
                        smooth: true,
                        data: ageData.map((age, index) => [age, p3[index]]),
                        lineStyle: {
                            width: 1,
                            color: '#FBC516'
                        },
                        symbol: 'none'
                    },
                    {
                        name: 'P15 (第15百分位)',
                        type: 'line',
                        smooth: true,
                        data: ageData.map((age, index) => [age, p15[index]]),
                        lineStyle: {
                            width: 1,
                            color: '#FBC516'
                        },
                        symbol: 'none'
                    },
                    {
                        name: 'P50 (第50百分位)',
                        type: 'line',
                        smooth: true,
                        data: ageData.map((age, index) => [age, p50[index]]),
                        lineStyle: {
                            width: 1,
                            color: '#FBC516'
                        },
                        symbol: 'none'
                    },
                    {
                        name: 'P85 (第85百分位)',
                        type: 'line',
                        smooth: true,
                        data: ageData.map((age, index) => [age, p85[index]]),
                        lineStyle: {
                            width: 1,
                            color: '#FBC516'
                        },
                        symbol: 'none'
                    },
                    {
                        name: 'P97 (第97百分位)',
                        type: 'line',
                        smooth: true,
                        data: ageData.map((age, index) => [age, p97[index]]),
                        lineStyle: {
                            width: 1,
                            color: '#FBC516'
                        },
                        symbol: 'none'
                    },
                    {
                        name: '当前BMI',
                        type: 'scatter',
                        symbolSize: this.isDeviceReport ? 24 : 12,
                        data: [[age, formatBMI]],  // [年龄, BMI]
                        itemStyle: {
                            color: '#FBC516',
                            borderWidth: this.isDeviceReport ? 8 : 4,
                            borderColor: '#FFFFFF',
                        },
                        label: {
                            show: false,
                        }
                    }
                ]
            }
            chart.setOption(option)
        }
    }
}
</script>

<style lang="less" scoped>
.cardBox1 {

    width: 100%;
    height: 100%;
    position: relative;
    margin: 0 auto;

}

.dashboardBox {
    width: 330px;
    height: 407px;
    margin: 0 auto;
}

.labels.rightlabel {
    left: auto !important;
    right: 4px;
}
.lefttitle{
     font-size: 10px;
     position: relative;
     top: -20px;
}

.righttitle {
    transform: translate(-4px, 0px);
    font-size: 10px;
    position: relative;
    top: -20px;
}

.labels {
    position: absolute;
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    left: 4px;
    top: 30px;

    div.scale {
        position: relative;
        width: 29px;
        height: 318px;
        background: rgba(251, 197, 22, 0.1);
        padding: 4px 0;
        box-sizing: border-box;
        position: relative;

        &::before {
            content: "";
            width: 100%;
            height: 1px;
            background-color: #FBC516;
            position: absolute;
            left: 0;
            top: 0;
        }

        &::after {
            content: "";
            width: 100%;
            height: 1px;
            background-color: #FBC516;
            position: absolute;
            left: 0;
            bottom: 0;
        }

        div {
            position: relative;
            height: 12%;
            font-weight: 400;
            font-size: 10px;
            color: #FFFFFF;
            text-align: center;
            top: 10px;

            &:first-child {
                position: absolute;
                top: 0px;
                width: 100%;
                text-align: center;
            }

            &:last-child {
                position: absolute;
                top: 92.5%;
                width: 100%;
                text-align: center;
            }
        }
    }
    .nodevice {
        height: 321px !important;
        position: absolute !important;
        top: 22px;
    }
}

.yearTxt {
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 49%;
    bottom: 5px;
}

</style>