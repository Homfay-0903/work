<template>
    <div class="cardBox">
        <div class="cardTitle">
            骨盆专项风险评估
        </div>
        <div class="cardContent">
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/pelvis/pelvicTilt_${pelvicTiltScore.level}.png`)" alt="">
                    <p :style="{ color: pelvicTiltScore.color }">{{ pelvicTiltScore.rank }}</p>
                </div>
                <div class="chartbox">
                    <p>
                        <span>骨盆前倾风险分数</span>
                        <span><i class="sourceS" :style="{ color: pelvicTiltScore.color }">{{ pelvicTiltScore.source }}</i>分</span>
                    </p>
                    <div class="processLine">
                        <div class="texts"><span>0</span><span>无风险</span><span>30</span><span>高风险</span><span> </span>
                        </div>
                        <div class="processCurrentLine"
                            :style="{ background: pelvicTiltScore.color, width: pelvicTiltScore.left + 'px' }">
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/pelvis/retroversion_${retroversionScore.level}.png`)" alt="">
                    <p :style="{ color: retroversionScore.color }">{{ retroversionScore.rank }}</p>
                </div>
                <div class="chartbox">
                    <p>
                        <span>骨盆后倾风险分数</span>
                        <span><i class="sourceS" :style="{ color: retroversionScore.color }">{{ retroversionScore.source }}</i>分</span>
                    </p>
                    <div class="processLine">
                        <div class="texts"><span>0</span><span>无风险</span><span>30</span><span>高风险</span><span> </span>
                        </div>
                        <div class="processCurrentLine"
                            :style="{ background: retroversionScore.color, width: retroversionScore.left + 'px' }">
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/pelvis/rotation_${rotationScore.level}.png`)" alt="">
                    <p :style="{ color: rotationScore.color }">{{ rotationScore.rank }}</p>
                </div>
                <div class="chartbox">
                    <p>
                        <span>骨盆旋转风险分数</span>
                        <span><i class="sourceS" :style="{ color: rotationScore.color }">{{ rotationScore.source }}</i>分</span>
                    </p>
                    <div class="processLine">
                        <div class="texts"><span>0</span><span>无风险</span><span>25</span><span>高风险</span><span> </span>
                        </div>
                        <div class="processCurrentLine"
                            :style="{ background: rotationScore.color, width: rotationScore.left + 'px' }">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cardInfo">
            <div class="tipsBox">
                <p class="tipsTitle">肌肉评估结果:</p>
                <ul>
                    <li v-if="pelvicTiltScore.level !== 0 || retroversionScore.level !== 0">
                        <template v-if="pelvicTiltScore.level === 1">
                            髂腰肌/竖脊肌下部紧张 、腹横肌薄弱。
                        </template>
                        <template v-if="retroversionScore.level === 1">
                            股后肌群、臀肌、竖脊肌紧张、髂腰肌弱。
                        </template>
                    </li>
                    <li v-if="rotationScore.level === 1">单侧臀中肌薄弱 / 腰方肌不平衡。</li>
                    <li v-if="pelvicTiltScore.level !== 1 && retroversionScore.level !== 1 && rotationScore.level !== 1">骨盆相关肌肉评估正常，请继续保持良好的生活习惯。</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
// 阈值划分
const t = {
    '0': [0, 30, 50],
    '1': [0, 30, 50],
    '2': [0, 25, 40]
}
// 等级颜色
const c = ['#48D597', '#C32613']
export default {
    props: {
        // 风险值
        pelvicRisk: {
            type: Object,
            default: () => ({
                // 骨盆前倾风险分数
                pelvicTiltScore: 0,
                // 骨盆后倾风险分数
                retroversionScore: 0,
                // 骨盆旋转风险分数
                rotationScore: 0
            })
        },
    },
    data() {
        return {
        }
    },
    computed: {
        pelvicTiltScore() {
            return this.format(this.pelvicRisk.pelvicTiltScore, 0)
        },
        retroversionScore() {
            return this.format(this.pelvicRisk.retroversionScore, 1)
        },
        rotationScore() {
            return this.format(this.pelvicRisk.rotationScore, 2)
        },
    },
    methods: {
        rank: function (value, type = 0) {
            if (value <= t[type][1]) {
                return '无异常'
            } else {
                return '高风险'
            }
        },
        level: function (value, type = 0) {
            if (value <= t[type][1]) {
                return 0
            } else {
                return 1
            }
        },
        color: function (value, type = 0) {
            if (value <= t[type][1]) {
                return c[0]
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
            let left = 0
            if (source <= t[type][1]) {
                left = (source / t[type][1]) * 100
            } else {
                left = 100 * ((source - t[type][1]) / (t[type][2] - t[type][1])) + 100
            }
            if (source > t[type][2]) {
                left = 200
            }
            return Math.ceil(left)
        }
    }
}
</script>

<style lang="less" scoped>
.cardBox {
    width: 863px;
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
                width: 201px;

                p {
                    margin: 0;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;

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

                .processLine {
                    position: relative;
                    width: 201px;
                    height: 3px;
                    background-color: #CED7E0;
                    font-size: 12px;
                    color: #666666;

                    .processCurrentLine {
                        position: absolute;
                        height: 3px;
                        left: 0;
                        top: 0;
                    }

                    .texts {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;

                        span {
                            margin-top: 7px;
                        }
                    }
                }
            }
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

        .img {
            width: 46px;
            height: 46px;
            margin-right: 18px;
            margin-top: 13px;
        }

        .tipsBox {
            .tipsTitle {
                font-weight: bold;
                font-size: 12px;
                color: #5698F5;
                margin-top: 10px;
            }

            ul {
                margin-top: 2px;
                // display: flex;
                // flex-wrap: wrap;
                list-style: none;
                padding: 0;

                li {
                    font-size: 12px;
                    color: #9B9B9B;
                    line-height: 18px;
                    width: 360px;
                    padding-left: 14px;
                    position: relative;

                    &::before {
                        content: "";
                        position: absolute;
                        width: 2px;
                        height: 2px;
                        left: 4px;
                        top: 8px;
                        background-color: #9B9B9B;
                    }
                }
            }
        }
    }
}
.sourceS{
    position: relative;
    top: 1px;
}
</style>