<template>
    <div class="growth">
        <!-- 坐标 -->
        <div class="coordinates">
            <!-- 上 -->

            <!-- 下 -->
            <div class="bottom">
                <div class="number">
                    <p v-for="(item, key) in xAxis" :key="key"><span v-if="key % 2 === 0">{{ item }}</span></p>
                </div>
            </div>
            <!-- 左 -->
            <div class="left CustomList">
                <div class="height">
                    <div class="title">
                        <p class="text">身高</p>
                        <p class="growth-unit">(cm)</p>
                    </div>
                    <div class="number">
                        <div v-for="(item, key) in yAxisLeft1" :key="key">{{ item }}</div>
                    </div>
                </div>
                <div class="weight">
                    <div class="title">
                        <p class="text">体重</p>
                        <p class="growth-unit">(kg)</p>
                    </div>
                    <div class="number">
                        <div v-for="(item, key) in yAxisLeft2" :key="key">{{ item }}</div>
                    </div>
                </div>
            </div>
            <!-- 右 -->
            <div class="right CustomList">
                <div class="height">
                    <div class="number">
                        <div v-for="(item, key) in yAxisRight1" :key="key">{{ item }}</div>
                    </div>
                    <div class="title">
                        <p class="text">身高</p>
                        <p class="growth-unit">(cm)</p>
                    </div>
                </div>
                <div class="weight">
                    <div class="number">
                        <div v-for="(item, key) in yAxisRight2" :key="key">{{ item }}</div>
                    </div>
                    <div class="title">
                        <p class="text">体重</p>
                        <p class="growth-unit">(kg)</p>
                    </div>
                </div>
            </div>
        </div>
        <myChart :userInfo="userInfo"/>
    </div>
</template>

<script>
import myChart from './myChart.vue'

export default {
    components: {
        myChart
    },
    props: {
        userInfo: {
            type: Object,
            default: () => {
                return {
                    birthday: '1514736000', // 时间戳
                    height: 160, // 身高
                    weight: 40, // 体重
                    sex: 1, // 1: 男, 2: 女
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
        width: 318px;
        height: 305px;
        margin: 0 57px;
    }

    .coordinates {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;

        .top,
        .bottom {
            left: 0;
            right: 0;
            height: 26px;
            position: absolute;
            display: none;

            .title {
                font-size: 11px !important;
                transform: scale(0.6);
                font-weight: 500;
                color: #999999;
                ;
                text-align: center;
            }

            .number {
                display: flex;
                font-size: 12px;
                font-weight: bold;
                color: #999999;
                justify-content: space-between;
                padding: 2px 43px 0 61px;

                // p {
                //     transform: scale(0.6);
                //     flex: 1;
                // }
            }
        }

        .top {
            top: 0;
            background: #F2F8FF;

            .title {
                padding-top: 1px;
            }

            .number {
                margin-top: 1px;
            }
        }

        .bottom {
            bottom: -19px;

            .title {

                margin-top: -3px;
                color: #999999;
            }

            .number {
                margin-bottom: 1px;
            }
        }

        .left,
        .right {
            width: 57px;
            position: absolute;
            top: 0px;

            .height,
            .weight {

                width: 57px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                .title {
                    font-size: 11px !important;
                    // transform: scale(0.6) translate(0px, -62px);
                    font-weight: 500;
                    color: #999999;
                    ;
                    width: 33px;

                    .text {
                        width: 33px;
                        line-height: 13px;
                        text-align: center;
                    }

                    .growth-unit {
                        width: 33px;
                        text-align: center;
                    }
                }

                .number {
                    font-size: 12px;
                    font-weight: bold;
                    color: #999;
                    // padding-top: 12px;
                    width: 23px;


                    // p {
                    //     display: block;
                    //     transform: scale(0.6);
                    //     flex: 1;
                    //     text-align: center;
                    //     width: 23px;
                    //     height: 5px;
                    //     // margin-top: -5px;
                    // }
                }
            }

            .height {
                height: 237px;
                position: relative;


            }

            .weight {
                box-sizing: border-box;
                padding-top: 5px;
                position: relative;



                .title {
                    margin-top: -4px !important;

                }

                .number {
                    position: relative;
                    background: #F2F8FF;

                    p {}
                }
            }
        }

        .left {
            left: 0;

            .height {
                font-weight: 400;

                .number {
                    height: 237px;
                    background: #FCF4F3;
                }
            }

            .weight {
                .number {
                    height: 36px;

                    p {
                        margin-left: 2px;
                    }
                }
            }
        }

        .right {
            right: -2px;

            .height {
                height: 115px;
                display: flex;
                align-items: center;
                justify-content: center;

                .title {
                    padding-top: 0px;
                }

                .number {
                    // margin-top: 6px;
                    text-align: center;
                    height: 115px;
                    background: #FCF4F3;
                    position: relative;
                }
            }

            .weight {
                margin-top: 2px;
                height: 159px;
                display: flex;

                .number {
                    text-align: left;
                height: 158px;
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
                    font-size: 11px !important;
                    font-weight: 400;
                    color: #FFFFFF;
                    border-radius: 2px;
                    text-align: center;
                }
            }

        }
    }
}
.growth > .coordinates > .CustomList > .height > .number >{
    overflow: hidden;

    & > div{
        position: relative;
        font-size: 10px;
        text-align: center;
        height: 17px;
        display: flex;
        align-items: start;
        justify-content: center;
        top: -5px;
        &:first-child{
            top: 0px;
        }
    }
}
.growth > .coordinates > .CustomList > .weight > .number >{

    & > div{
        position: relative;
        font-size: 10px;
        text-align: center;
        height: 17.5px;
        display: flex;
        align-items: start;
        justify-content: center;
        top: -5px;
        &:first-child{
            top: 0px;
        }
    }
}
.number{
    color: #999999 !important;
    // background-color: #999 !important;
}
</style>
