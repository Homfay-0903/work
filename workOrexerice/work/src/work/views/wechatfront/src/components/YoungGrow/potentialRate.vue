<template>
    <div class="cardBox">
        <div class="cardTitle">生长潜力评分</div>
        <div class="chartbox">
            <p class="chartTitle">生长潜力总得分</p>
            <dashboardView :totalScore="growth.totalScore"></dashboardView>
        </div>
        <div class="cardItem">
            <p><img src="../../assets/image/young/parent.png" alt=""> 父母身高</p>
            <div class="tabs">
                <div class="tab-pot">父亲身高：<span> <i class="moreColor">{{ growth.fatherHeight }}</i> cm</span></div>
                <div class="tab-pot">母亲身高：<span> <i class="moreColor">{{ growth.motherHeight }}</i> cm</span></div>
            </div>

        </div>
        <div class="cardItem">
            <div class="linebox notop">
                <span>遗传目标：</span>
                <span><i class="moreColor">{{ growth.targetHeight - ff }} - {{ growth.targetHeight + ff }}</i> cm</span>
            </div>
            <div class="linebox">
                <span>遗传空间：</span>
                <span><i class="moreColor">
                    <template v-if="(growth.geneticSpace + ff) <= 0">0</template>
                    <template v-else>{{ 0 > (growth.geneticSpace - ff) ? 0 : growth.geneticSpace - ff }} - {{ growth.geneticSpace + ff }}</template>
                </i> cm</span>
            </div>
        </div>
        <div class="scoreItem">
            <div class="scorebg"></div>
            <p class="scoreTitle">遗传空间得分</p>
            <p class="scoreValue"><span class="moreColor">{{ growth.getGeneticScore }}</span>/30 分</p>
            <div class="processbar">
                <div class="curbar" :style="{ width: (growth.getGeneticScore / 30 * 100) + '%' }"></div>
            </div>
        </div>
        <div class="scoreItem">
            <div class="scorebg"></div>
            <p class="scoreTitle">生长速率得分</p>
            <p class="scoreValue"><span class="moreColor">{{ growth.growthRateRatioScore }}</span>/30 分</p>
            <div class="processbar">
                <div class="curbar" :style="{ width: (growth.growthRateRatioScore / 30 * 100) + '%' }"></div>
            </div>
        </div>
        <div class="scoreItem">
            <div class="scorebg"></div>
            <p class="scoreTitle">体态影响得分</p>
            <p class="scoreValue"><span class="moreColor">{{ growth.evalScore }}</span>/20 分</p>
            <div class="processbar">
                <div class="curbar" :style="{ width: (growth.evalScore / 20 * 100) + '%' }"></div>
            </div>
        </div>
        <div class="scoreItem">
            <div class="scorebg"></div>
            <p class="scoreTitle">BMI发育协调指数</p>
            <p class="scoreValue"><span class="moreColor">{{ growth.BMIScore }}</span>/20 分</p>
            <div class="processbar">
                <div class="curbar" :style="{ width: (growth.BMIScore / 20 * 100) + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<script>
import dashboardView from './dashboardView.vue'
export default {
    components: {
        dashboardView
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
                sex: 1,
            })
        }
    },
    data() {
        return {

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
i {
    font-style: normal;
}

.cardBox {
    margin: 0 auto 24px;
    width: 350px;
    padding-bottom: 3px;
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
        width: 350px;
        height: 248px;
        margin: 0 auto;
        position: relative;

        .chartTitle {
            font-weight: 500;
            font-size: 14px;
            color: #FFFFFF;
            position: absolute;
            left: 16px;
            top: 12px;
        }
    }

    .cardItem {
        width: 330px;
        min-height: 98px;
        background: rgba(8, 20, 59, 0.75);
        border-radius: 6px 6px 6px 6px;
        margin: 0 auto 8px;
        padding: 15px 13px 13px;
        box-sizing: border-box;

        p {
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 17px;
            display: flex;
            align-items: center;

            img {
                width: 21px;
                height: 17px;
                margin-right: 2px;
            }
        }

        .tabs {
            display: flex;
            justify-content: space-between;
            width: 302px;
            height: 32px;
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            box-sizing: border-box;

            .tab-pot {
                width: 149px;
                height: 32px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px 3px 3px 3px;
                line-height: 20px;
                padding: 6px 10px;
                box-sizing: border-box;
                margin-top: 16px;
                white-space: nowrap;

                i {
                    font-style: normal;
                    margin-left: 13px;
                }
            }
        }

        .linebox {
            width: 302px;
            height: 32px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px 3px 3px 3px;
            display: flex;
            justify-content: space-between;
            line-height: 20px;
            padding: 6px 10px;
            box-sizing: border-box;
            margin: 12px auto 0;
            font-size: 14px;
            color: #FFFFFF;
        }

        .notop {
            margin-top: 0;
        }
    }

    .moreColor {
        background: -webkit-gradient(linear, left top, right top, from(#00e3c9), to(#009fe8));
        background: linear-gradient(90deg, #00e3c9, #009fe8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
            letter-spacing: 0px;
    }

    .scoreItem {
        width: 330px;
        height: 62px;
        border-radius: 6px 6px 6px 6px;
        margin: 0 auto 10px;
        overflow: hidden;
        position: relative;
        color: #fff;

        .scoreTitle {
            text-align: left;
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            padding: 10px 0 0 13px;
        }

        .scoreValue {
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            margin-top: -17px;
            float: right;
            margin-right: 19px;
            letter-spacing: 2px;

            span {
                font-weight: bold;
                font-size: 26px;
                line-height: 30px;
            }
        }

        .processbar {
            width: 288px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px 6px 6px 6px;
            margin: 20px 13px 0;
        }

        .curbar {
            height: 4px;
            background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
            border-radius: 6px 6px 6px 6px;
        }

        .scorebg {
            position: absolute;
            left: 0;
            top: 0;
            width: 330px;
            height: 62px;
            background: linear-gradient(90deg, rgba(192, 90, 228, 1) 0%, rgba(1, 111, 255, 1) 100%);
            filter: blur(165px);
        }
    }
}
</style>