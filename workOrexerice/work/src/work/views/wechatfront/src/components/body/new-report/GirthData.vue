<template>
    <div>
        <!-- 体围数据 -->
        <div :class="['comparison-list-box1', isDeviceReport ? 'isDeviceReport' : '']" v-for="(item, index) in isRoundness" :key="index" v-if="showGirthData(item)">
            <p class="item-lang">{{ item.title }}</p>
            <div class="comparison-list">
                <div :class="['comparison-list-first', isDeviceReport ? 'isDeviceReport' : '']">
                    <div v-if="item.lastWidth > 0">
                        <span v-if="item.lastWidth">
                            <span class="comparison-list-span">{{
                                toDecimal(item.lastWidth, 1)
                            }}</span>
                        </span>
                        <span v-else class="comparison-list-span1" style="color: #8aa3be"> -- </span>
                        <span>cm</span>
                    </div>
                    <div v-else>
                        <span class="comparison-list-none">-- </span>
                        <span>cm</span>
                    </div>
                </div>
                <!-- 体围数据数据对比 -->
                <div :class="['comparison-list-second', isDeviceReport ? 'isDeviceReport' : '']">
                    <div v-if="item.width > 0 && item.lastWidth > 0">
                        <img v-if="item.width - item.lastWidth == 0" src="@/assets/images/new-report/icon1_just.png"
                            alt="" />
                        <img v-else-if="item.width - item.lastWidth > 0" src="@/assets/images/new-report/icon1_rise.png"
                            alt="" />
                        <img v-else src="@/assets/images/new-report/icon1_decline.png" alt="" />
                        <span>
                            {{
                                toDecimal(Math.abs((item.width - item.lastWidth).toFixed(1)), 1) }}
                        </span>
                    </div>
                    <div v-else>
                        <span class="comparison-none"> -- </span>
                    </div>
                </div>
                <!-- 体围数据最新数据 -->
                <div :class="['comparison-list-first', isDeviceReport ? 'isDeviceReport' : '']">
                    <span v-if="item.width > 0">
                        <span class="comparison-list-span">{{
                            toDecimal(item.width, 1)
                        }}</span>
                    </span>
                    <span v-else class="comparison-list-span1" style="color: #8aa3be"> -- </span>
                    <span>cm</span>
                </div>
            </div>
            <!-- 新增字段：超越人群、超越人群比例、低|标准|高 -->
            <div class="girth-additional-info">
                <!-- 分隔线 -->
                <div class="divider"></div>
                <!-- 超越人群信息 -->
                <div class="girth-comparison">
                    <div class="girth-comparison-item">
                        <span class="girth-label">超越人群</span>
                        <span class="girth-value">{{ item.beyondPeople || '-0.2' }}</span>
                    </div>
                    <div class="girth-comparison-item">
                        <span class="girth-label">超越人群比例</span>
                        <span class="girth-value">{{ item.beyondPeopleRatio || '52.4' }}%</span>
                    </div>
                </div>
                <!-- 进度条 -->
                <div v-if="item.rangeStatus" class="range-slider-container">
                    <!-- 刻度数值 (上浮) -->
                    <div class="tick-labels">
                        <div class="tick-label" style="left: 33%">{{ item.rangeValues.low || '23.5' }}</div>
                        <div class="tick-label" style="left: 66%">{{ item.rangeValues.high || '27.1' }}</div>
                    </div>

                    <!-- 进度条主体 -->
                    <div class="range-track">
                        <!-- 背景分段层 (3段) -->
                        <div class="track-bg-layer">
                            <div class="bg-segment"></div>
                            <div class="bg-gap"></div>
                            <div class="bg-segment"></div>
                            <div class="bg-gap"></div>
                            <div class="bg-segment"></div>
                        </div>

                        <!-- 实际值进度条 (悬浮在背景层之上) -->
                        <div class="active-track" :class="item.statusColor" :style="{ width: item.percentage + '%' }"></div>

                        <!-- 指示圆圈 -->
                        <div class="indicator-dot" :class="item.statusColor" :style="{ left: item.percentage + '%' }"></div>
                    </div>
                    <!-- 低|标准|高标签 -->
                    <div class="range-labels">
                        <div class="range-label">低</div>
                        <div class="range-label">标准</div>
                        <div class="range-label">高</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    props: {
        isRoundness: Array,
        item: {}
    },
    data() {
        return {
            unit: window.localStorage.getItem('unit'),
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    created() {
        // console.log(`当前传入围度信息${JSON.stringify(this.isRoundness)}`)
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
.comparison-list-box1 {
    position: relative;
    margin: 10px;
    overflow: hidden;
    background-color: #262543;
    border-radius: 8px;

    p {
        width: 215px;
        margin: 12px auto 4px;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
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
.isDeviceReport{
    p {
        font-family: inherit !important;
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
        width: 33.33%;

        span {
            display: inline-block;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
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
            font-family: AppleSystemUIFont;
            line-height: 22px;
            // line-height: 70px;
        }
    }

    .comparison-list-second {
        // margin-top: 17px;
        font-size: 15px;
        font-family: AppleSystemUIFont;
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
                font-family: AppleSystemUIFont;
                color: #8aa3be;
                line-height: 13px;
            }
        }

        .comparison-none {
            line-height: 20px;
        }
    }
    .isDeviceReport{
        span {
           font-family: inherit !important;
        }
    }
}
    .girth-additional-info {
        margin-top: 12px;
        padding: 0 10px;

        .divider {
            width: 80%;
            height: 1px;
            background-color: #8aa3be;
            margin: 0 auto 12px;
            opacity: 0.2;
        }

        .girth-comparison {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;

            .girth-comparison-item {
                display: flex;
                align-items: center;

                .girth-label {
                    font-size: 12px;
                    color: #8aa3be;
                    margin-right: 8px;
                }

                .girth-value {
                    font-size: 12px;
                    color: #ffffff;
                }
            }
        }
    }

    .range-slider-container {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 10px; // 防止圆圈在0%或100%时被截断

        // 1. 顶部的数值
        .tick-labels {
            position: relative;
            height: 20px;
            margin-bottom: 4px;

            .tick-label {
                position: absolute;
                top: 0;
                transform: translateX(-50%);
                font-size: 10px;
                color: #8aa3be;
                font-family: PingFangSC-Regular, PingFang SC;
            }
        }

        // 2. 进度条轨道区
        .range-track {
            position: relative;
            height: 3px; // 加粗轨道
            width: 100%;
            margin-bottom: 8px;

            // 背景分段层
            .track-bg-layer {
                display: flex;
                width: 100%;
                height: 100%;
                //gap: 6px; // 关键：控制断点间隙大小

                .bg-segment {
                    flex: 1;
                    background-color: #262543; // 背景
                    border-radius: 2px; // 轻微圆角
                }
                .bg-gap {
                    flex: 0 0 3px; // 关键：控制断点间隙大小
                    background-color: #4B4C60; // 间隙
                    z-index: 2;
                }
            }

            // 有色进度条
            .active-track {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                border-radius: 2px;
                z-index: 1; // 位于背景之上

                &.red {
                    background: #dc3545;
                }
                &.yellow {
                    background: #ffc107;
                }
                &.blue {
                    background: #009fe8;
                }
                &.green {
                    background: #28a745;
                }
            }

            // 指示圆圈
            .indicator-dot {
                width: 6px; // 稍微加大
                height: 6px;
                background: #fff;
                border: 3px solid; // 加粗边框
                border-radius: 50%;
                position: absolute;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.1); // 增加一点立体感

                &.red {
                    border-color: #dc3545;
                }
                &.yellow {
                    border-color: #ffc107;
                }
                &.blue {
                    border-color: #009fe8;
                }

                &.green {
                    border-color: #28a745;
                }
            }
        }

        // 3. 低|标准|高标签
        .range-labels {
            display: flex;
            justify-content: space-between;
            padding: 0 5px;
            margin-top: 4px;

            .range-label {
                font-size: 10px;
                color: #8aa3be;
                font-family: PingFangSC-Regular, PingFang SC;
                flex: 1;
                text-align: center;
            }
        }
    }
</style>
