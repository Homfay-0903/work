<template>
    <div class="cardBox1">
        <div class="labels">
            <p class="title">BMI <br />(kg/㎡)</p>
            <ul>
                <li v-for="(item, index ) in new Array(18)" :key="index">{{ 30 - index }}</li>
            </ul>
        </div>
        <div id="growCureView" class="dashboardBox">
        </div>
        <div class="labels rightlabel">
            <!-- <p class="righttitle">BMI <br />(kg/㎡)</p> -->
            <ul>
                <li v-for="(item, index ) in new Array(18)" :key="index">{{ 30 - index }}</li>
            </ul>
            <p class="title righttitle">BMI <br />(kg/㎡)</p>
        </div>
        <p class="yearTxt">(岁)</p>
    </div>

</template>

<script>

let ageData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

// 不同百分位数的BMI曲线
let p3 = [13.2, 14.8, 15.2, 15.0, 14.8, 14.6, 14.4, 14.3, 14.2, 14.1, 14.2, 14.4, 14.7, 15.1, 15.5, 15.9, 16.3, 16.6, 16.9].slice(1)
let p15 = [14.0, 15.8, 16.2, 16.0, 15.8, 15.6, 15.4, 15.3, 15.2, 15.1, 15.2, 15.4, 15.7, 16.1, 16.5, 16.9, 17.3, 17.6, 17.9].slice(1)
let p50 = [15.0, 16.8, 17.2, 17.0, 16.8, 16.6, 16.4, 16.3, 16.2, 16.1, 16.2, 16.4, 16.7, 17.1, 17.5, 17.9, 18.3, 18.6, 18.9].slice(1)
let p85 = [16.2, 18.0, 18.4, 18.2, 18.0, 17.8, 17.6, 17.5, 17.4, 17.3, 17.4, 17.6, 17.9, 18.3, 18.7, 19.1, 19.5, 19.8, 20.1].slice(1)
let p97 = [17.6, 19.4, 19.8, 19.6, 19.4, 19.2, 19.0, 18.9, 18.8, 18.7, 18.8, 19.0, 19.3, 19.7, 20.1, 20.5, 20.9, 21.2, 21.5].slice(1)

export default {
    props: {
        boxData: {
            type: Object,
            default: {
                BMI: 0,
                age: 17,
            }
        }
    },
    data() {
        return {}
    },
    watch: {
        boxData() {
            this.initChart()
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart() {
            let chart = this.$echarts.init(document.getElementById('growCureView'))
            const { age, BMI } = this.boxData

            let formatBMI = Math.round(BMI) >= 31 ? 30.5 : Math.round(BMI) <= 12 ? 12.5 : Math.round(BMI) // 如果BMI大于30，则显示30.5，否则显示实际值
            let option = {
                grid: {
                    left: '15%',
                    right: '15%',
                    bottom: '4%',
                    top: '0%',
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
                        fontSize: 10,
                        splitNumber: 5,
                        interval: (index) => {
                            return '1'
                        },
                        color: '#999'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#B4D1F6'
                        }
                    },
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#B4D1F6',
                            type: 'solid'
                        }
                    }
                },
                yAxis: [{
                    type: 'value',
                    position: 'left',
                    left: 30,
                    min: 12,
                    max: 31,
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
                            color: '#B4D1F6'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#B4D1F6',
                            type: 'solid'
                        }
                    }
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
                        symbolSize: 12,
                        data: [[age, formatBMI]],  // [年龄, BMI]
                        itemStyle: {
                            color: '#FBC516',
                            borderWidth: 4,
                            borderColor: '#FFFFFF'
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

    width: 431px;
    height: 307px;
    position: relative;
    margin: 0 auto;

}

.dashboardBox {
    position: relative;
    width: 431px;
    height: 307px;
    margin: 0 auto;
    z-index: 10;
}

.rightlabel {
    left: auto !important;
    right: 5px;
}

.title.righttitle {
    transform: translate(2px, 0px) !important;
}

.labels {
    position: absolute;
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    left: 5px;
    top: 0px;
    display: flex;
    align-items: center;

    .title {
        font-weight: 400;
        font-size: 11px;
        color: #999999;
        transform: translate(-2px, 0px);
    }

    ul {
        width: 23px;
        height: 272px;
        margin: 0;
        background: #F2F8FF;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px 0;
        box-sizing: border-box;
        position: relative;
        padding-top: 10px;



        li {
            font-weight: 400;
            font-size: 10px;
            color: #999999;
            text-align: right;
            padding: 0;
            margin: 0;
            padding-right: 7px;
            list-style: none;
            line-height: 12px;
        }
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