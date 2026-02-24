<template>
    <div class="content">
        <p class="title">生长潜力评分</p>
        <div class="gridbox">
            <div class="chartbox">
                <scorePie :totalScore="growth.totalScore" />
            </div>
            <div class="info">
                <div class="infoItem">
                    <p>
                        <span class="fontWeight">父母身高</span>
                        <span>父亲：</span>
                        <span style="color: #666666">{{ growth.fatherHeight }} <i>cm</i></span>
                    </p>
                    <p>
                        <span>&emsp;&emsp;&emsp;&emsp;</span>
                        <span>母亲：</span>
                        <span style="color: #666666">{{ growth.motherHeight }} <i>cm</i></span>
                    </p>
                </div>
                <div class="infoItem">
                    <p><span>遗传目标：</span><span style="color: #666666">{{ growth.targetHeight - ff }} - {{ growth.targetHeight + ff }} <i>cm</i></span></p>
                    <p><span>遗传空间：</span><span style="color: #666666"><template v-if="(growth.geneticSpace + ff) <= 0">0</template><template v-else>{{ (growth.geneticSpace - ff) < 0 ? 0 : growth.geneticSpace - ff }} - {{ growth.geneticSpace + ff }}</template> <i>cm</i></span></p>
                </div>
                <div class="infoItem scoreItem">
                    <p class="scoreTitle">遗传空间得分</p>
                    <p class="scoreValue"><span class="moreColor">{{ growth.getGeneticScore }}</span> 分</p>
                    <div class="processbar">
                        <span class="startNum">0</span>
                        <span class="endNum">30</span>
                        <div class="curbar" :style="{ width: (growth.getGeneticScore / 30 * 100) + '%' }"></div>
                    </div>
                </div>
                <div class="infoItem scoreItem">
                    <p class="scoreTitle">生长速率得分</p>
                    <p class="scoreValue"><span class="moreColor">{{ growth.growthRateRatioScore }}</span> 分</p>
                    <div class="processbar">
                        <span class="startNum">0</span>
                        <span class="endNum">30</span>
                        <div class="curbar" :style="{ width: (growth.growthRateRatioScore / 30 * 100) + '%' }"></div>
                    </div>
                </div>
                <div class="infoItem scoreItem">
                    <p class="scoreTitle">体态影响得分</p>
                    <p class="scoreValue"><span class="moreColor">{{ growth.evalScore }}</span> 分</p>
                    <div class="processbar">
                        <span class="startNum">0</span>
                        <span class="endNum">20</span>
                        <div class="curbar" :style="{ width: (growth.evalScore / 20 * 100) + '%' }"></div>
                    </div>
                </div>
                <div class="infoItem scoreItem">
                    <p class="scoreTitle">BMI发育协调指数</p>
                    <p class="scoreValue"><span class="moreColor">{{ growth.BMIScore }}</span> 分</p>
                    <div class="processbar">
                        <span class="startNum">0</span>
                        <span class="endNum">20</span>
                        <div class="curbar" :style="{ width: (growth.BMIScore / 20 * 100) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import scorePie from './scorePie.vue'
export default {
    components: {
        scorePie
    },
    props: {
        growth: {
            type: Object,
            default: () => ({
                // "生长潜力总分"
                totalScore: 0,
                // ------------
                //  "父身高"
                fatherHeight: 0,
                // "母身高"
                motherHeight: 0,
                // "遗传空间"
                geneticSpace: 0,
                // "遗传目标"
                targetHeight: 0,
                // ------------
                // "遗传（空间）得分"
                getGeneticScore: 0,
                // "生长速率得分"
                growthRateRatioScore: 0,
                // "体态影响得分"
                evalScore: 0,
                // "指数发育得分"
                BMIScore: 0,
                // "性别"
                sex: 0,
            })
        }
    },
    computed: {
        // 计算遗传空间得分
        ff() {
            return this.growth.sex === 1 ? 7 : 5
        }
    },
}
</script>

<style lang="less" scoped>
.content {
    width: 863px;
    margin: 24px auto 0;

    .title {
        font-weight: 400;
        font-size: 24px;
        color: #333333;
        line-height: 29px;
        margin-bottom: 8px;
    }

    .gridbox {
        width: 863px;
        height: 239px;
        border: 1px solid #009FE8;
        display: flex;

        .chartbox {
            width: 232px;
            height: 239px;
            border-right: 1px solid #009FE8;
        }

        .info {
            display: grid;
            grid-template-columns: 315px 315px;
            grid-template-rows: 74px 83px 82px;

            .infoItem {
                border-bottom: 1px solid #CED7E0;
                border-right: 1px solid #CED7E0;

                i {
                    font-style: normal;
                }

                &:nth-child(2),
                &:nth-child(4),
                &:nth-child(6) {
                    border-right: none;
                }

                &:nth-child(5),
                &:nth-child(6) {
                    border-bottom: none;
                }


                p {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 400;
                    font-size: 15px;
                    color: #333;
                    height: 30px;
                    line-height: 30px;
                }

                &:nth-child(1) {
                    padding: 7px 12px;
                }

                &:nth-child(2) {
                    padding: 7px 20px;
                }

                i {
                    font-size: 12px;
                    color: #666666;
                }

                .fontWeight {
                    font-weight: 500;
                }
            }

            .scoreItem {
                overflow: hidden;
                position: relative;
                color: #333;

                .scoreTitle {
                    font-weight: 400;
                    font-size: 14px;
                    color: #333;
                    padding: 10px 0 0 13px;
                }

                .scoreValue {
                    font-weight: 400;
                    font-size: 9px;
                    color: #333;
                    margin-top: -20px;
                    float: right;
                    margin-right: 15px;
                    letter-spacing: 2px;

                    span {
                        font-weight: bold;
                        font-size: 26px;
                        line-height: 30px;
                    }

                    .moreColor {
                        color: #5698F5;
                    }
                }

                .processbar {
                    width: 230px;
                    height: 4px;
                    background: #CED7E0;
                    border-radius: 6px 6px 6px 6px;
                    margin: 15px 13px 0;
                    position: relative;
                    font-weight: 400;
                    font-size: 11px;
                    color: #525252;

                    .startNum {
                        position: absolute;
                        left: 0;
                        top: 6px;
                    }

                    .endNum {
                        position: absolute;
                        right: 0;
                        top: 6px;
                    }
                }

                .curbar {
                    height: 4px;
                    background: #5698F5;
                    border-radius: 6px 6px 6px 6px;
                    position: relative;

                    &::after {
                        content: "";
                        position: absolute;
                        top: -2px;
                        right: 0px;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #5698F5;
                    }
                }

            }
        }
    }
}
</style>