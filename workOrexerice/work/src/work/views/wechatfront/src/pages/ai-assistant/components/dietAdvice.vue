<template>
    <div class="diet-advice">
        <template v-if="data">
            <el-row>
                <p class="description">
                <pre v-html="data.text"></pre>
                </p>
            </el-row>
            <el-row>
                <p class="description">菜谱推荐</p>
            </el-row>
            <!-- 菜谱推荐 -->
            <div class="analysis-table thead-line grade-table">
                <table cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>周一</th>
                            <th>周二</th>
                            <th>周三</th>
                            <th>周四</th>
                            <th>周五</th>
                            <th>周六</th>
                            <th>周日</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>早餐</span>
                            </td>
                            <td :key="index" v-for="(meal, index) in data.tableData.breakfastList">
                                <p :key="idx" v-for="(item, idx) in meal">{{ item }}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>午餐</span>
                            </td>
                            <td :key="index" v-for="(meal, index) in data.tableData.lunchList">
                                <p :key="idx" v-for="(item, idx) in meal">{{ item }}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>晚餐</span>
                            </td>
                            <td :key="index" v-for="(meal, index) in data.tableData.dinnerList">
                                <p :key="idx" v-for="(item, idx) in meal">{{ item }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <el-row>
                <p class="description">
                    {{ data.disclaimer }}
                </p>
            </el-row>
        </template>
        <el-row v-else>
            <p class="description" v-html="'未进行<b>身体成分测量</b>，无法生成<b>营养计划</b>'"></p>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        // 饮食建议数据
        data: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            dietInfo: {
                text:
                    '根据您的情况，我建议您在饮食方面要注意<b>平衡摄入营养丰富、低热量的食物</b>，<b>减少高热量食物的摄入</b>，尤其是<b>糖分和不健康脂肪</b>。每餐吃到<b>七分饱</b>，避免过度进食。此外，您的<b>肌肉质量和蛋白质指标较高</b>，建议<b>适当增加蛋白质的摄入</b>，以维持肌肉质量。同时，要注意<b>控制总能量的摄入</b>，以达到减肥的目的。\n' +
                    '\n' +
                    '根据您的身体成分数据，您的<b>体重处于合理区间的上限</b>，<b>体脂肪略高</b>，需要注意<b>减脂</b>。您的<b>肌肉质量和蛋白质指标较高</b>，分别处于合理区间的上限，说明您的身体<b>肌肉比例较高</b>，需要<b>适当增加蛋白质的摄入</b>，以维持肌肉质量。建议您每天的<b>总能量摄入量为1500-1700千卡</b>，三大营养成分比例为<b>碳水化合物占50%-60%</b>，<b>蛋白质占20%-25%</b>，<b>脂肪占15%-20%</b>。此外，您的<b>微量元素摄入也需要注意</b>，建议<b>增加铁、钙、锌等微量元素的摄入</b>，以维持身体健康。\n' +
                    '\n' +
                    '总之，针对您的身体成分数据，建议您在饮食方面<b>注意平衡摄入营养丰富、低热量的食物</b>，<b>控制总能量的摄入</b>，<b>适当增加蛋白质的摄入</b>，以维持肌肉质量。同时，要注意<b>微量元素的摄入</b>，<b>增加铁、钙、锌等微量元素的摄入</b>，以维持身体健康。',
                disclaimer: '请注意，以上建议仅供参考，如您有特殊饮食需求或宗教信仰，请遵循您的实际情况调整。'
            }
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>

<style lang="less">
.diet-advice {
    .el-row {
        margin-top: 23px;
    }

    p {
        margin: 0;
        color: #636366;

        pre {
            margin: 0;
            white-space: pre-wrap;
        }
    }

    .name {
        font-size: 28px;
        font-family: OPPOSans L;
        font-weight: normal;
    }

    .description {
        margin-top: 8px;
        font-size: 18px;
        font-family: OPPOSans L;
        font-weight: normal;
        line-height: 30px;
    }

    .grade-table {
        table {
            border: 1px solid #d8d8d8;
            font-size: 18px;
            font-family: OPPOSans M, OPPOSans;
            font-weight: normal;
            color: #636366;
            line-height: 24px;

            thead {
                background: #d9b90f1a;

                tr {
                    height: 55px;

                    th {
                        border: 1px solid #d8d8d8;
                        width: 111px;
                    }

                    th:nth-of-type(1) {
                        width: 97px;
                    }
                }
            }

            tbody {
                font-size: 18px;

                tr {
                    td {
                        padding-left: 11px;
                        padding-top: 17px;
                        padding-bottom: 17px;
                        border: 1px solid #d8d8d8;
                    }
                }
            }
        }
    }
}
</style>
