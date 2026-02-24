<template>
    <div class="growth">
        <!-- 坐标 -->
        <div class="coordinates">
            <!-- 上 -->
            <div class="title">身高/体重生长曲线</div>
            <!-- 下 -->
            <div class="bottom">
                <div class="number">
                    <p v-for="(item, key) in xAxis" :key="key"><span v-if="key % 2 !== 0">{{ item }}</span></p>
                </div>
                <div class="title">(岁)</div>
            </div>
            <!-- 左 -->
            <div class="left CustomList">
                <div class="height">
                    <div class="title">
                        <p class="text">身高</p>
                        <p class="unit">(cm)</p>
                    </div>
                    <div class="number">
                        <div v-for="(item, key) in yAxisLeft1" :key="key">{{ item }}</div>
                    </div>
                </div>
                <div class="weight">
                    <div class="number">
                        <div v-for="(item, key) in yAxisLeft2" :key="key">{{ item }}</div>
                    </div>
                    <div class="title">
                        <p class="text">体重</p>
                        <p class="unit">(kg)</p>
                    </div>
                </div>
            </div>
            <!-- 右 -->
            <div class="right CustomList">
                <div class="height">
                    <div class="title">
                        <p class="text">身高</p>
                        <p class="unit">(cm)</p>
                    </div>
                    <div class="number">
                        <div v-for="(item, key) in yAxisRight1" :key="key">{{ item }}</div>
                    </div>
                </div>
                <div class="weight">
                    <div class="number">
                        <div v-for="(item, key) in yAxisRight2" :key="key">{{ item }}</div>
                    </div>
                    <div class="title">
                        <p class="text">体重</p>
                        <p class="unit">(kg)</p>
                    </div>
                </div>
            </div>
            <!-- 标线说明框 -->
            <!-- <div class="instructions">
                <div class="margin">
                    <div :style="ageStyleTop" class="age-top">{{ age }}岁</div>
                    <div :style="ageStyleBottom" class="age-bottom">{{ age }}岁</div>
                    <div :style="heightStyle" class="height">{{ height }}cm</div>
                    <div :style="weightStyle" class="weight">{{ weight }}kg</div>
                </div>
            </div> -->
        </div>
        <myChart :userInfo="userInfo" />
    </div>
</template>

<script>
import myChart from './myChart.vue'

export default {
    components: {
        myChart,
    },
    props: {
        userInfo: {
            type: Object,
            default: () => {
                return {
                    birthday: '1514736000', // 时间戳
                    height: 160, // 身高
                    weight: 40, // 体重
                    sex: 2, // 1: 男, 2: 女
                    age: 0,
                }
            }
        },
    },

    data() {
        return {
            isShow: true,
            xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            yAxisLeft1: [200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100, 90, 80, 70],
            yAxisLeft2: [20, 10],
            yAxisRight1: [200, 190, 180, 170, 160, 150, 140],
            yAxisRight2: [90, 80, 70, 60, 50, 40, 30, 20, 10]
        }
    },
}


</script>

<style scoped lang="less">
.growth {
    position: relative;
    padding: 0;

    .growth-legend {
        width: 262px;
        height: 423px;
        margin: 0 33px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.10);
    }

    .coordinates {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;

        &>.title {
            color: #fff;
            padding-top: 7px;
            font-weight: bold;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 22px;
            text-align: center;
        }

        .top,
        .bottom {
            left: 0;
            right: 0;
            height: 26px;
            position: absolute;

            .title {
                font-size: 16px;
                transform: scale(0.6);
                font-weight: 500;
                color: rgba(255, 255, 255, 0.5);
                text-align: center;
            }

            .number {
                display: flex;
                font-size: 10px;
                font-weight: bold;
                color: #fff;
                display: flex;
                padding: 0 27px;

                &>* {
                    position: relative;
                    flex: 1;

                    &:first-child {
                        color: #00000000;
                    }
                }
            }
        }

        .top {
            top: 0;
            background: #d4f6fa;

            .title {
                padding-top: 1px;
            }

            .number {
                margin-top: 1px;
            }
        }

        .bottom {
            bottom: -33px;

            .title {

                margin-top: -3px;
                color: rgba(255, 255, 255, 0.5);
            }

            .number {
                margin-bottom: 1px;
            }
        }

        .left,
        .right {
            width: 33px;
            position: absolute;
            top: 40px;

            .height,
            .weight {
                background: rgba(182, 63, 94, 0.1);

                .title {
                    font-size: 14px;
                    transform: scale(0.6) translate(0px, -62px);
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.5);
                    width: 33px;

                    .text {
                        width: 33px;
                        line-height: 13px;
                        text-align: center;
                    }

                    .unit {
                        width: 33px;
                        text-align: center;
                    }
                }

                .number {
                    font-size: 12px;
                    font-weight: bold;
                    color: #FFFFFF;
                    // padding-top: 12px;
                    width: 33px;

                    p {
                        display: block;
                        transform: scale(0.6);
                        flex: 1;
                        text-align: center;
                        width: 33px;
                        height: 5px;
                        // margin-top: -5px;
                    }
                }
            }

            .height {
                height: 315px;
                position: relative;
                top: 2px;

                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    left: 0;
                    top: 0;
                    background: #B63F5E;
                }

                &::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    left: 0;
                    bottom: 0;
                    background: #B63F5E;
                }
            }

            .weight {
                height: 52px;
                margin-top: 14px;
                background: rgba(1, 128, 254, 0.1);
                position: relative;

                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    left: 0;
                    top: 0;
                    background: #0180FE;
                }

                &::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    left: 0;
                    bottom: 0;
                    background: #0180FE;
                }

                .title {
                    margin-top: -4px !important;
                    padding-top: 0;

                    position: absolute;
                    bottom: -70px;
                }

                .number {
                    p {}
                }
            }
        }

        .left {
            left: 0;

            .height {
                font-weight: 400;

                .number {
                    margin-top: 6px;
                    height: 315px;
                    position: absolute;
                    top: 0;
                }
            }

            .weight {
                .number {
                    padding-top: 3px;
                    height: 52px;

                    p {
                        margin-left: 2px;
                    }
                }
            }
        }

        .right {
            right: 1px;

            .height {
                height: 156px;

                .title {
                    padding-top: 0px;
                }

                .number {
                    margin-top: 6px;
                    text-align: left;
                    position: absolute;
                    top: 0;
                    height: 156px;
                }
            }

            .weight {
                height: 212px;

                .number {
                    margin-top: 2px;
                    text-align: left;
                    height: 212px;
                    position: absolute;
                    top: 0;
                }
            }
        }

        .instructions {
            position: absolute;
            top: 26px;
            bottom: 26px;
            left: 30px;
            right: 30px;
            overflow: hidden;

            .margin {
                position: relative;
                width: 100%;
                height: 100%;

                div {
                    position: absolute;
                    display: inline-block;
                    background: #6DB7FE;
                    padding: 2px 5px;
                    font-size: 11px;
                    font-weight: 400;
                    color: #FFFFFF;
                    border-radius: 2px;
                    text-align: center;
                }
            }

        }
    }
}

.growth>.coordinates>.CustomList>.height>.number> {
    overflow: hidden;

    &>div {
        position: relative;
        font-size: 10px;
        text-align: center;
        height: 23px;
        display: flex;
        align-items: start;
        justify-content: center;
        top: -5px;

        &:first-child {
            top: 0px;
        }
    }
}

.growth>.coordinates>.CustomList>.weight>.number> {

    &>div {
        position: relative;
        font-size: 10px;
        text-align: center;
        height: 23px;
        display: flex;
        align-items: start;
        justify-content: center;
        top: -5px;

        &:first-child {
            top: 0px;
        }
    }
}
</style>
