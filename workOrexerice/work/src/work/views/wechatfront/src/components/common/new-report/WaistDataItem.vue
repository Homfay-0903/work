<template>
    <div class="report-result">
        <div class="shape-title" v-if="name !== null">
            <span>{{ name }}</span>
        </div>
        <div class="result-wrapper" v-if="!canvas">
            <div class="result-box" v-if="title !== null">
                {{ title }}<span v-if="title == '腰臀比'">正常范围：{{ sex === 2 ? '0.75~0.8' : '0.85~0.9' }}</span>
            </div>
            <div class="result-box" v-if="title == '腰部分数'">
                超越人群比例：<span style="background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;">37.3% ↑3.9 36.9%</span>
            </div>
            <div class="comparison-list-box1" v-for="(item, index) in arr" :key="index">
                <div v-if="showGirthData(item)">
                    <p class="item-lang">{{ item.title }}</p>
                    <div class="comparison-list">
                        <div class="comparison-list-first">
                            <div v-if="item.lastvalue != 0">
                                <span v-if="item.lastvalue">
                                    <span class="comparison-list-span" v-if="item.title === '背部体积'">{{
                                        toDecimal(item.lastvalue, 2) > 0 ? toDecimal(item.lastvalue, 2) : '-'
                                    }}</span>
                                    <span class="comparison-list-span" v-else-if="title !== '腰臀比'">{{
                                        toDecimal(item.lastvalue, 1) > 0 ? toDecimal(item.lastvalue, 1) : '-'
                                    }}</span>
                                    <span class="comparison-list-span" v-else>{{
                                        toDecimal(item.lastvalue, 2) > 0 ? toDecimal(item.lastvalue, 2) : '-'
                                    }}</span>
                                </span>
                                <span v-else class="comparison-list-span1" style="color: #8aa3be"> -- </span>
                                <span>{{ unit }}</span>
                            </div>
                            <div v-else>
                                <span class="comparison-list-none">-- </span>
                                <span>{{ unit }}</span>
                            </div>
                        </div>
                        <!-- 体围数据数据对比 -->
                        <div :class="['comparison-list-second', isDeviceReport ? 'isDeviceReport' : '']">
                            <div v-if="item.lastvalue != 0">
                                <img v-if="item.value - item.lastvalue == 0" src="@/assets/images/new-report/icon1_just.png"
                                    alt="" />
                                <img v-else-if="item.value - item.lastvalue > 0"
                                    src="@/assets/images/new-report/icon1_rise.png" alt="" />
                                <img v-else src="@/assets/images/new-report/icon1_decline.png" alt="" />
                                <span v-if="item.title === '背部体积'">
                                    {{
                                        item.value > 0 && item.lastvalue > 0 ? toDecimal(Math.abs((item.value - item.lastvalue).toFixed(2)), 2) : '-'}}
                                </span>
                                <span v-else-if="title !== '腰臀比'">
                                    {{
                                        item.value > 0 && item.lastvalue > 0 ? toDecimal(Math.abs((item.value - item.lastvalue).toFixed(1)), 1) : '-'}}
                                </span>
                                <span v-else>
                                    {{
                                        item.value > 0 && item.lastvalue > 0 ? toDecimal(Math.abs((item.value - item.lastvalue).toFixed(2)), 2) : '-'}}
                                </span>
                            </div>
                            <div v-else>
                                <span class="comparison-none"> -- </span>
                            </div>
                        </div>
                        <!-- 体围数据最新数据 -->
                        <div class="comparison-list-first">
                            <span v-if="item.value">
                                <span class="comparison-list-span" v-if="item.title === '背部体积'">{{
                                    toDecimal(item.value, 2) > 0 ? toDecimal(item.value, 2) : '-'
                                }}</span>
                                <span class="comparison-list-span" v-else-if="title !== '腰臀比'">{{
                                    toDecimal(item.value, 1) > 0 ? toDecimal(item.value, 1) : '-'
                                }}</span>
                                <span class="comparison-list-span" v-else>{{
                                    toDecimal(item.value, 2) > 0 ? toDecimal(item.value, 2) : '-'
                                }}</span>
                            </span>
                            <span v-else class="comparison-list-span1" style="color: #8aa3be"> -- </span>
                            <span>{{ unit }}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="result-wrapper" v-else>
            <div class="result-box" v-if="title !== null">
                {{ title }}
            </div>
            <div :class="['result-wrapper2', isDeviceReport ? 'isDeviceReport' : '']">
                <span class="pang-title pang-title1" style="height: 30px">后</span>
                <span class="pang-title pang-title2">前</span>
                <span class="pang-title pang-title3" style="top:140px" v-if="arr.length > 3">后</span>
                <span class="pang-title pang-title4" style="top:210px" v-if="arr.length > 3">前</span>
                <span class="pang-title pang-title5" style="top: 350px" v-if="arr.length > 6">后</span>
                <span class="pang-title pang-title6" style="top: 420px" v-if="arr.length > 6">前</span>
                <div class="waist-canvas-box">
                    <div class="waist-box-item" v-for="(item, index) in arr" :key="index + 'rr'">
                        <waist-canvas :arr="item"></waist-canvas>
                        <ul class="custom-bullet-list">
                            <li>上次：{{ item.lastvalue > 0 ? item.lastvalue : '-' }}</li>
                            <li>本次：{{ item.value > 0 ? item.value : '-' }}</li>
                        </ul>
                        <p :style="{ marginTop: '10px',
                            width: isDeviceReport ? '300px' : '100px'
                        }">{{item.title}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { _toDecimal } from '@/assets/js/util.js'
import WaistCanvas from '@/components/common/new-report/Waistcanvas.vue'
export default {
    components: {
        WaistCanvas
    },
    props: {
        name: {
            type: String,
            default: null
        },
        arr: {
            type: Array,
            default: null
        },
        title: {
            type: String,
            default: null
        },
        unit: {
            type: String,
            default: null
        },
        canvas: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            sex: JSON.parse(window.localStorage.getItem('memberInfo')).sex,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    watch: {
        arr: {
            handler(newVal, oldVal) {
                this.drawWaistGirth()
            },
            deep: true
        }
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        showGirthData(item) {
            return item.width !== 0
        }
    },
}
</script>

<style lang="less" scoped>
.report-result {
    margin: 15px 15px 0 11px;
    font-family: PingFangSC, PingFang SC;

    .shape-title {
        width: 100px;
        height: 28px;
        margin-bottom: -2px;
        line-height: 26px;
        color: #222222;
        font-family: PingFangSC, PingFang SC;
        background: url(../../../assets/images/new-report/report/shape_over_en.png) center no-repeat;
        background-size: 100% 100%;

        span {
            letter-spacing: 0.2px;
            width: 98px;
            height: 14px;
            margin-left: -45px;
            font-size: 14px;
        }
    }

    .result-wrapper {
        width: 353px;
        background: url(../../../assets/images/new-report/waistbg1.png) center no-repeat;
        background-size: 100% 100%;
        // border: white 1px solid;
        color: #8AA3BE;
        .result-wrapper2 {
            width: 353px;
        background-size: 100% 100%;
        // border: white 1px solid;
        color: #8AA3BE;
        position: relative;
        }
        .isDeviceReport{
            .pang-title1{
                height: 40px!important;
            }
            .pang-title2{
                top: 30px!important;
            }
            .pang-title3{
                top: 130px!important;
            }
            .pang-title4{
                top: 210px!important;
            }
            .pang-title5{
                top: 340px!important;
            }
            .pang-title6{
                top: 420px!important;
            }
        }
    }

    .result-box {
        text-align: left;
        padding: 10px 15px;
        // opacity: 0.2;
        font-size: 14px;
    }

}

.comparison-list-box1 {
    position: relative;
    margin: 0 10px;
    overflow: hidden;

    p {
        width: 215px;
        margin: 12px auto 4px;
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #ffffff;
    }

    &::before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #ffffff;
        opacity: 0.2;
    }
}

.comparison-list {
    //   min-height: 70px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-around;
    padding: 0 10px;
    position: relative;

    .comparison-list-first {
        width: 42.33%;

        span {
            display: inline-block;
            font-size: 13px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #8aa3be;
            line-height: 12px;
        }

        .comparison-list-span {
            background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
            padding: 0 0.01px;  /* 防止文本裁剪异常 */
        }

        .comparison-list-span1 {
            // line-height: 70px;
            font-size: 22px;
        }

        .comparison-list-none,
        .comparison-list-span {
            display: inline-block;
            font-size: 22px;
            font-family: PingFangSC, PingFang SC;
            line-height: 22px;
            // line-height: 70px;
        }
    }

    .comparison-list-second {
        // margin-top: 17px;
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        color: #ffffff;
        line-height: 15px;
        width: 33.33%;

        div {
            margin-top: 4px;

            img {
                display: inline-block;
                margin-top: 2px;
                width: 14px;
                height: 14px;
                position: relative;
                top: 2px;
            }

            span {
                font-size: 13px;
                font-family: PingFangSC, PingFang SC;
                color: #8aa3be;
                line-height: 13px;
            }
        }

        .comparison-none {
            line-height: 20px;
        }
    }
    .isDeviceReport{
        div{
            margin-top: 0px;
        }
    }
}
.pang-title {
    writing-mode: vertical-rl;
    position: absolute;
    right: 325px;
    height: 150px;
    font-size: 14px;
}
.waist-canvas-box{
    width: 313px;
        background: url(../../../assets/images/new-report/waistlbg.png) center no-repeat;
        background-size: 100% 100%;
        // border: white 1px solid;
        color: #8AA3BE;
        margin-left: 40px;
        display: flex;
        justify-content: space-between; /* 控制子元素在主轴上的间距 */
    align-items: flex-start; /* 控制子元素在交叉轴上的对齐方式 */
    flex-wrap: wrap;
        .waist-box-item{
            width: 100px;
            height: 180px;
            margin: 0px !important;
            flex: 1;
            border-top: 1px solid #444A7A;
            border-bottom: 1px solid #444A7A;
            p{
                font-size: 14px!important;
            }
            .custom-bullet-list {
    list-style-type: disc; /* 确保使用小圆点 */
    padding-left: 35px; /* 根据需要调整缩进 */
}

.custom-bullet-list li:first-child::marker {
    color: #F05656; /* 设置小圆点的颜色 */
}
.custom-bullet-list li:last-child::marker {
    color: #00E3C9; /* 设置小圆点的颜色 */
}
.custom-bullet-list li:first-child {
    font-family: PingFangSC, PingFang SC;
font-weight: 400;
font-size: 12px;
color: #F05656;
line-height: 17px;
text-align: left;
font-style: normal;
}
.custom-bullet-list li:last-child {
    color: #00E3C9; /* 设置小圆点的颜色 */
    font-family: PingFangSC, PingFang SC;
font-weight: 400;
font-size: 12px;
line-height: 17px;
text-align: left;
font-style: normal;
}
        }
}
</style>
