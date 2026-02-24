<template>
    <div class="cardBox">
        <div class="cardContent">
            <div class="left">
                <header>床垫推荐</header>
                <div class="rankContainer">
                    <div class="rankTitle">推荐硬度：</div>
                    <div class="rankBox">
                        <div v-for="(itm, inx) in hardnessGrade" :key="inx"
                            :class="mattressRec.mattress.indexOf(itm) > -1 ? 'choose' : ''">{{ itm }}星度</div>
                    </div>
                </div>
                <div>
                    异常程度：{{ errorList[mattressRec.level] }}
                </div>
                <footer>(基于胸曲、腰曲、骨盆、背部评分计算)</footer>
            </div>
            <div class="right">
                <header>枕头推荐</header>
                <div class="rankContainer">
                    <div class="rankBox">
                        <div v-for="(itm, inx) in pillowStyles" :key="inx"
                            :class="pillowRec.recommendation.indexOf(itm) > -1 ? 'choose' : ''">{{ itm }}款</div>
                    </div>
                </div>
                <div>
                    异常程度：{{ errorList[pillowRec.pillowLevel] }}
                </div>
                <footer>(基于头部、肩部和颈曲结果计算)</footer>
            </div>
        </div>
        <p class="remark">* 该推荐星度床垫与枕头匹配使用，改善效果更佳。</p>
    </div>
</template>
<script>

export default {
    props: {
        // 枕头推荐
        pillowRec: {
            type: Object,
            default: () => ({
                // 枕头推荐状态
                pillowLevel: 0,
                // 星级描述
                recommendation: '',
            })
        },
        // 床垫推荐
        mattressRec: {
            type: Object,
            default: () => ({
                // 床垫推荐水平状态
                level: 0,
                // 那类评判异常
                source: '',
                // 星级描述
                mattress: '',
            })
        }
    },
    data() {
        return {
            // 硬度等级
            hardnessGrade: ['一', '二', '三', '四', '五'],
            // 枕头款式
            pillowStyles: ['A', 'B', 'C', 'D'],
            // 异常状态
            errorList: ['无异常', '轻度异常', '中度异常', '重度异常'],
        }
    }
}
</script>
<style lang="less" scoped>
.cardBox {
    width: 863px;
    height: 114px;
    margin-top: 24px;
    box-sizing: border-box;

    .cardContent {
        width: 863px;
        height: 105px;
        border: 1px solid #009FE8;
        display: flex;
        box-sizing: border-box;
        padding: 0 18px;

        &>div {
            position: relative;
            flex: 1;

            header {
                font-size: 15px;
                color: #333;
            }

            &>div {
                font-size: 12px;
                color: #666666;
                line-height: 20px;
                margin: 3px 0;
            }

            .rankContainer {
                display: flex;
                align-items: center;
                height: 24px;

                &>div.rankBox {
                    position: relative;
                    flex: 1;
                    display: flex;

                    &>div {
                        flex: 1;
                        text-align: center;
                        background: #EAF4FF;
                        color: rgba(0,0,0,0.25);
                        border-radius: 2px;
                        margin-right: 6px;

                        &:last-child {
                            margin-right: 0;
                        }
                    }

                    &>div.choose {
                        background: #0091ff;
                        color: #fff;
                        font-weight: bold;
                    }
                }
            }

            &>footer {
                font-size: 12px;
                color: #9B9B9B;
            }
        }

        &>.left {
            position: relative;
            padding: 6px 18px 6px 0;
        }

        &>.right {
            border-left: 1px solid #009FE8;
            padding: 6px 0px 6px 18px;
        }
    }

    .cardInfo {
        border: 1px solid #009FE8;
        border-top: none;
        width: 865px;
        height: 78px;
        display: flex;
        align-items: center;
        padding-left: 11px;
        box-sizing: border-box;
        align-items: flex-start;
    }
}

p.remark {
    font-size: 12px;
    color: #666666;
    line-height: 20px;
}
</style>