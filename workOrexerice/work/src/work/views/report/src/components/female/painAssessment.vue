<template>
    <div class="cardBox">
        <div class="cardTitle">
            疼痛潜在风险评估
        </div>
        <div class="cardContent">
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/pain/cervicalPain_${cervicalPainScore.level}.png`)" alt="">
                    <p :style="{ color: cervicalPainScore.color }">{{ cervicalPainScore.rank }}</p>
                </div>
                <div class="chartbox">
                    <p>
                        <span>颈部疼痛风险</span>
                        <span><i class="sourceS" :style="{ color: cervicalPainScore.color }">{{ cervicalPainScore.source }}</i>分</span>
                    </p>
                    <ul>
                        <li>
                            <span class="sourceStart">0</span>
                            <span>低风险</span>
                        </li>
                        <li>
                            <span class="sourceFill">10</span>
                            <span>中风险</span>
                        </li>
                        <li class="lflex">
                            <span class="sourceFill">40</span>
                            <span>高风险</span>
                        </li>
                        <div class="trangle" :style="{ left: cervicalPainScore.left + 'px' }"></div>
                    </ul>
                </div>
            </div>
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/pain/thoracicPain_${thoracicPainScore.level}.png`)" alt="">
                    <p :style="{ color: thoracicPainScore.color }">{{ thoracicPainScore.rank }}</p>
                </div>
                <div class="chartbox">
                    <p>
                        <span>背部疼痛风险</span>
                        <span><i class="sourceS" :style="{ color: thoracicPainScore.color }">{{ thoracicPainScore.source }}</i>分</span>
                    </p>
                    <ul>
                        <li>
                            <span class="sourceStart">0</span>
                            <span>低风险</span>
                        </li>
                        <li>
                            <span class="sourceFill">15</span>
                            <span>中风险</span>
                        </li>
                        <li class="lflex">
                            <span class="sourceFill">30</span>
                            <span>高风险</span>
                        </li>
                        <div class="trangle" :style="{ left: thoracicPainScore.left + 'px' }"></div>
                    </ul>
                </div>
            </div>
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/pain/lumbarPainMan_${lumbarPainScore.level}.png`)" alt="">
                    <p :style="{ color: lumbarPainScore.color }">{{ lumbarPainScore.rank }}</p>
                </div>
                <div class="chartbox">
                    <p>
                        <span>腰部疼痛风险</span>
                        <span><i class="sourceS" :style="{ color: lumbarPainScore.color }">{{ lumbarPainScore.source }}</i>分</span>
                    </p>
                    <ul>
                        <li>
                            <span class="sourceStart">0</span>
                            <span>低风险</span>
                        </li>
                        <li>
                            <span class="sourceFill">10</span>
                            <span>中风险</span>
                        </li>
                        <li class="lflex">
                            <span class="sourceFill">25</span>
                            <span>高风险</span>
                            <span>&nbsp;&nbsp;</span>
                        </li>
                        <div class="trangle" :style="{ left: lumbarPainScore.left + 'px' }"></div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 阈值划分
const t = {
    '0': [10, 40, 60],
    '1': [15, 30, 50],
    '2': [10, 25, 40]
}
// 等级颜色
const c = ['#48D597', '#E6B12A', '#C32613']
export default {
    props: {
        // 风险值
        painRisk: {
            type: Object,
            default: () => ({
                // 颈部疼痛潜在分数
                cervicalPainScore: 0,
                // 胸椎疼痛风险评分
                thoracicPainScore: 0,
                // 腰椎疼痛风险评分
                lumbarPainScore: 0
            })
        },
    },
    data() {
        return {
        }
    },
    computed: {
        cervicalPainScore() {
            return this.format(this.painRisk.cervicalPainScore, 0)
        },
        thoracicPainScore() {
            return this.format(this.painRisk.thoracicPainScore, 1)
        },
        lumbarPainScore() {
            return this.format(this.painRisk.lumbarPainScore, 2)
        },
    },
    methods: {
        rank: function (value, type = 0) {
            if (value <= t[type][0]) {
                return '低风险'
            } else if (value >= t[type][1]) {
                return '高风险'
            } else {
                return '中风险'
            }
        },
        level: function (value, type = 0) {
            if (value <= t[type][0]) {
                return 0
            } else if (value >= t[type][1]) {
                return 2
            } else {
                return 1
            }
        },
        color: function (value, type = 0) {
            if (value <= t[type][0]) {
                return c[0]
            } else if (value >= t[type][1]) {
                return c[2]
            } else {
                return c[1]
            }
        },
        format(Osource, type = 0) {
            const source = Math.round(Osource)
            return {
                color: this.color(source, type),
                rank: this.rank(source, type),
                source: Math.round(source),
                level: this.level(source, type),
                left: this.colorWidth(source, type)
            }
        },
        colorWidth(source, type = 0) {
            // 使用left浮动分数
            // 注意分块间的间隔
            const intervalWidth = 1
            const baseWidth = 66
            let sourceWidth = 0
            let interval = 0
            if (source <= t[type][0]) {
                sourceWidth = baseWidth * source / (t[type][0] + 1)
            } else if (source >= t[type][1]) {
                interval += 2
                sourceWidth = baseWidth * 2 + baseWidth * (source - t[type][1]) / (t[type][2] - t[type][1] + 1)
                if (source >= t[type][2]) {
                    sourceWidth = baseWidth * 3 - 3
                }
            } else {
                interval += 1
                sourceWidth = baseWidth + baseWidth * (source - t[type][0]) / (t[type][1] - t[type][0] + 1)
            }
            const left = sourceWidth + interval * intervalWidth
            return Math.ceil(left)
        }
    }
}
</script>

<style lang="less" scoped>
.cardBox {
    width: 863px;
    height: 114px;
    margin-top: 24px;

    .cardTitle {
        font-weight: 400;
        font-size: 24px;
        color: #333333;
        line-height: 29px;
        margin-bottom: 8px;
    }

    .cardContent {
        width: 863px;
        height: 77px;
        border: 1px solid #009FE8;
        display: grid;
        grid-template-columns: 288px 288px 288px;
        grid-template-rows: 77px;

        .grid-item {
            border-right: 1px solid #009FE8;
            display: flex;
            align-items: center;

            &:last-child {
                border-right: none;
            }

            .imgbox {
                width: 46px;
                height: max-content;
                text-align: center;
                font-size: 12px;
                line-height: 1;
                margin: 0px 16px 0 11px;
                display: flex;
                flex-direction: column;

                img {
                    width: 46px;
                    height: 46px;
                }
            }

            .chartbox {
                height: 100%;
                margin-top: 8px;

                p {
                    margin: 0;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 13px;

                    span {
                        &:first-child {
                            font-size: 15px;
                            color: #333333;
                        }

                        &:last-child {
                            font-size: 12px;
                            color: #333333;

                            i {
                                font-style: normal;
                                font-weight: bold;
                                font-size: 21px;
                            }
                        }
                    }
                }

                ul {
                    display: flex;
                    margin: 0px;
                    padding: 0;
                    margin-bottom: 2px;
                    position: relative;

                    .trangle {
                        width: 0;
                        height: 0;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        border-top: 8px solid #276ED3;
                        top: -12px;
                        position: absolute;
                    }

                    // span {
                    //     padding-top: 7px;
                    // }

                    .lr10 {
                        margin-right: 10px;
                    }

                    li {
                        width: 66px;
                        height: 2px;
                        display: flex;
                        background-color: #48D597;
                        list-style: none;
                        margin-right: 2px;
                        font-weight: 400;
                        font-size: 11px;
                        color: #666666;

                        &:nth-child(2) {
                            background-color: #E6B12A;

                        }

                        &:nth-child(3) {
                            background-color: #C32613;

                        }
                    }

                    .lflex {
                        display: flex;
                        justify-content: space-between;

                    }
                }
            }
        }
    }
}

.sourceStart {
    position: absolute;
    padding-top: 10px;
}

.sourceFill {
    position: absolute;
    left: -6px;
    padding-top: 10px;
}

li {
    position: relative;
}

li>span:nth-child(2) {
    display: block;
    padding-top: 8px;
    width: 100%;
    text-align: center;
    line-height: normal;
    font-weight: 400;
    font-size: 11px;
    color: #666666;
}

li>span:nth-child(3) {
    position: absolute;
}
.sourceS{
    position: relative;
    top: 1px;
}
</style>