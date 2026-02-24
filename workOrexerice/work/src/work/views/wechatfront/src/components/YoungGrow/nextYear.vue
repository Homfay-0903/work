<template>
    <div class="cardBox">
        <div class="cardTitle">未来一年生长趋势预测</div>
        <div class="chartbox">
            <div class="leftbox">
                <p class="boxTitle">预计未来一年身高增长</p>
                <p class="boxSubTitle"><img src="../../assets/image/young/upicon.png" alt=""><span>6.2</span>cm</p>
                <div>
                    <p class="futureArea">预测区间</p>
                    <p class="areaValue"><span>5.6-6.8</span>cm</p>
                </div>
            </div>
            <div class="rightbox">
                <div class="item itemone">
                    <p class="height">140cm</p>
                    <div class="fullbar">
                        <div class="nextbar nocolor"></div>
                        <div class="curbar"></div>
                    </div>
                    <p class="timeTxt">当前</p>
                </div>
                <div class="item">
                    <p class="height">145cm</p>
                    <div class="fullbar">
                        <div class="nextbar "></div>
                        <div class="curbar hasCur"></div>
                    </div>
                    <p class="timeTxt">预计</p>
                </div>
            </div>
        </div>
        <div class="accordingTo">
            <p>预测依据</p>
            <div class="line">
                <span>标准增长速率</span>
                <span>6.5cm/年</span>
            </div>
            <div class="line">
                <span>体态影响修正</span>
                <span>95%</span>
            </div>
            <div class="line">
                <span>遗传潜力校准</span>
                <span>100%</span>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style lang="less" scoped>
.cardBox {
    margin: 0 auto 24px;
    width: 350px;
    height: 420px;
    padding-bottom: 10px;
    background: linear-gradient(126deg, #1D1E3B 0%, rgba(16, 38, 80, 0.95) 100%);
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #63A5C1;
    position: relative;

    .cardTitle {
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: url(../../assets/image/spine/titlebg.png) 0 0;
        background-size: 100% 100%;
        width: 100%;
        height: 44px;
        line-height: 44px;
    }

    .chartbox {
        width: 330px;
        height: 155px;
        background: rgba(8, 20, 59, 0.75);
        border-radius: 6px 6px 6px 6px;
        margin: 25px auto 12px;
        display: flex;

        .leftbox {
            width: 191px;
            height: 100%;

            .boxTitle {
                font-weight: 400;
                font-size: 14px;
                color: #FFFFFF;
                margin: 13px 0 0 14px;
            }

            .boxSubTitle {
                font-size: 12px;
                color: #8AA3BE;
                text-align: center;
                margin-top: 16px;

                img {
                    width: 7px;
                    height: 18px;
                    margin-right: 3px;
                }

                span {
                    font-weight: bold;
                    font-size: 26px;
                    color: #2DA068;
                }
            }

            div {
                width: 121px;
                height: 46px;
                margin: 8px 0 0 27px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px 3px 3px 3px;
                text-align: center;
                font-weight: 400;
                font-size: 12px;
                color: #8AA3BE;
                padding-top: 6px;
                line-height: 18px;

                .areaValue {
                    line-height: 18px;
                    color: #8AA3BE;

                    span {
                        color: #fff;
                    }
                }
            }
        }

        .rightbox {
            display: flex;

            .itemone {
                margin-right: 32px;
            }

            .item {
                font-weight: 400;
                font-size: 12px;
                color: #FFFFFF;
                width: 37px;
                text-align: center;
                line-height: 18px;

                .height {
                    margin: 28px 0 0 0;
                }

                .fullbar {
                    height: 72px;
                    width: 19px;
                    margin: 0 auto;

                    .curbar {
                        width: 19px;
                        height: 58px;
                        background: #EAB04D;
                        border-radius: 3px 3px 3px 3px;
                    }

                    .nextbar {
                        width: 19px;
                        height: 14px;
                        background: #2DA068;
                        border-radius: 3px 3px 0px 0px;
                    }

                    .hasCur {
                        border-radius: 0px 0px 3px 3px;
                    }

                    .nocolor {
                        background: none;
                    }
                }

                .timeTxt {
                    line-height: 18px;
                    margin-top: 3px;
                }
            }
        }
    }

    .accordingTo {
        width: 330px;
        height: 172px;
        background: rgba(8, 20, 59, 0.75);
        border-radius: 6px 6px 6px 6px;
        margin: 12px auto 0;
        padding: 14px 13px;
        box-sizing: border-box;

        p {
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
        }

        .line {
            display: flex;
            justify-content: space-between;
            line-height: 32px;
            width: 302px;
            height: 32px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px 3px 3px 3px;
            margin: 10px auto 0;
            font-weight: 400;
            font-size: 12px;
            color: #8AA3BE;
            padding: 0 10px;
            box-sizing: border-box;

            span {
                &:last-child {
                    font-weight: 400;
                    font-size: 14px;
                    color: #FFFFFF;
                }
            }
        }
    }
}
</style>