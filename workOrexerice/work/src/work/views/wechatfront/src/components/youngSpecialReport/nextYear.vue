<template>
    <div class="content4">
        <div class="advise">
            <p class="adviseTitle">个性化建议：</p>
            <p class="adviseContent">{{ suggestConclusion.personalizedRec }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        suggestConclusion: {
            type: Object,
            default: {
                suggestion: '暂无建议',
                personalizedRec: '暂无建议',
                personExerciseRec: '暂无建议',
            }
        }
    }
}
</script>

<style lang="less" scoped>
i {
    font-style: normal;
}

.content4 {
    width: 863px;
    height: auto;
    margin: 24px auto 0;

    .title {
        font-weight: 400;
        font-size: 24px;
        color: #333333;
        line-height: 29px;
        margin-bottom: 8px;
    }

    .con4box {
        width: 862px;
        height: 119px;
        background: #FFFFFF;
        border: 1px solid #009FE8;
        display: flex;

        .item1 {
            width: 491px;
            border-right: 1px solid #CED7E0;

            .itemTitle {
                display: flex;
                justify-content: space-between;
                padding: 12px 16px 0 13px;

                span {
                    &:first-child {
                        font-weight: 500;
                        font-size: 15px;
                        color: #333333;
                    }

                    &:last-child {
                        font-weight: 400;
                        font-size: 15px;
                        color: #333333;
                        margin-top: 9px;

                        i {
                            color: #48D597;
                            margin-left: 5px;
                        }
                    }
                }
            }

            .futurebox {
                display: flex;
                margin: 11px 11px 0 12px;

                .futureItem {
                    width: 312px;
                    height: 57px;

                    &:last-child {
                        width: 126px;
                        height: 57px;
                    }

                    .upNum {
                        width: 126px;
                        height: 57px;
                        background-color: #EDFBF5;

                        .imgicon {
                            width: 16px;
                            height: 16px;
                            background: #48D597;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            float: right;
                            margin: 8px 9px;

                            img {
                                width: 9px;
                                height: 9px;
                            }
                        }

                        .unit {
                            padding: 15px 9px;
                            font-weight: 400;
                            font-size: 15px;
                            color: #666666;

                            span {
                                font-weight: bold;
                                font-size: 27px;
                                color: #48D597;
                            }
                        }
                    }

                    .nowFuture {
                        font-weight: 400;
                        font-size: 12px;
                        color: #666666;
                        display: flex;
                        align-items: center;
                        height: 15px;

                        &:last-child {
                            margin-top: 23px;
                        }

                        .fullbar {
                            width: 162px;
                            height: 2px;
                            margin: 0 14px 0 10px;
                            display: flex;

                            // background: #CED7E0;
                            .curbar {
                                width: 129px;
                                height: 2px;
                                background: #CED7E0;
                            }

                            .nextbar {
                                width: 33px;
                                height: 4px;
                                background: #48D597;
                                margin-top: -1px;
                            }
                        }
                    }
                }
            }
        }

        .item2 {
            width: 413px;

            p {
                display: flex;
                justify-content: space-between;
                line-height: 18px;
                border-bottom: 1px solid #CED7E0;
                padding: 10px 26px 10px;

                &:last-child {
                    border-bottom: none;
                }

                span {
                    &:first-child {
                        font-weight: 400;
                        font-size: 15px;
                        color: #333333;
                    }

                    &:last-child {
                        font-weight: 500;
                        font-size: 15px;
                        color: #5698F5;
                    }
                }
            }
        }
    }

    .advise {
        width: 862px;
        height: 69px;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #009FE8;
        margin-top: 24px;

        .adviseTitle {
            font-weight: bold;
            font-size: 12px;
            color: #5698F5;
            margin: 10px 0 0 15px;
        }

        .adviseContent {
            font-weight: 400;
            font-size: 12px;
            color: #666666;
            margin-left: 15px;
        }
    }
}
</style>