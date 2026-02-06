<template>
    <div class="report-interpret">
        <template v-if="showInterpretList">
            <el-row :key="item.name" v-for="item in data.interpretList">
                <p class="name">
                    {{ item.name }}
                </p>
                <p class="interpret">
                <pre v-html="item.interpret"></pre>
                </p>
            </el-row>
        </template>
        <template v-if="showBsAbnormalItemList && data.bsAbnormalItemList.length">
            <el-row :key="item.name" v-for="item in data.bsAbnormalItemList">
                <p class="name abnormal">
                    <i
                        style="width:8px;height:8px;border-radius:50%;background-color:#6D7278; display: inline-block; vertical-align:middle;"></i>
                    {{ item.name + '风险' }}
                </p>
                <p class="interpret abnormal">
                <pre>{{ item.analysis }}</pre>
                </p>
            </el-row>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        // 解读数据
        data: {
            type: Array,
            default: []
        },
        showInterpretList: {
            type: Boolean,
            default: false
        },
        showBsAbnormalItemList: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            bmInfos: [
                {
                    name: '身体成分概述',
                    interpret:
                        '您的体重为<b>71.6kg</b>，超出了正常范围（51.9-70.3kg），去脂体重和肌肉量均处于正常范围内。然而，您的体脂肪为<b>26.6kg</b>，超出了正常范围（9.9-19.8kg），体脂率为<b>37.1%</b>，也超出了正常范围（18.0-28.0%）。'
                },
                {
                    name: '肥胖分析',
                    interpret:
                        '您的BMI为<b>28.0kg/m^2</b>，超出了正常范围（18.5-24.0kg/m^2），属于肥胖。腰臀比为<b>0.89</b>，超出了正常范围（0.75-0.85），这意味着您的腹部脂肪较多。为了减轻体重，建议您将体重降至61.1kg，体脂肪降至15.9kg。'
                },
                {
                    name: '基础代谢分析',
                    interpret:
                        '您的基础代谢为<u>1385.0kcal/d</u>，处于正常范围（1138.4-1391.4kcal/d）。这意味着您的身体在静息状态下消耗的能量正常。'
                },
                {
                    name: '水分分析',
                    interpret:
                        '您的总水分为<u>32.5kg</u>，处于正常范围（27.3-33.3kg）。细胞内液和细胞外液也都处于正常范围内。这表明您的水分平衡良好。'
                },
                {
                    name: '体态情况概述',
                    interpret:
                        '根据您的体态评估数据，您可能存在<b>头前引</b>、<b>头侧外(偏右)</b>、<b>左圆肩</b>、<b>右圆肩</b>、<b>高低肩(左高)</b>和<b>身体倾斜（偏右）</b>的情况。这些异常体态可能会影响您的日常生活和运动表现，建议您关注这些问题并采取相应的措施进行改善。同时，您的<u>左膝评估</u>、<u>右膝评估</u>、<u>腿型左</u>和<u>腿型右</u>均处于正常范围，这是一个积极的信号。'
                },
                {
                    name: '常见体态评估',
                    interpret:
                        '在常见体态评估中，您的头前引偏移值为13.2d，可能存在<b>头前引</b>；头侧歪偏移值为-4.6d，可能存在<b>头侧外(偏右)</b>；左圆肩偏移值为16.1d，可能存在<b>左圆肩</b>；右圆肩偏移值为24.3d，可能存在<b>右圆肩</b>；高低肩偏移值为0.7cm，可能存在<b>高低肩(左高)</b>；身体倾斜偏移值为-1.2d，可能存在<b>身体倾斜（偏右）</b>。同时，您的<u>左膝评估</u>偏移值为173.9d，<u>右膝评估</u>偏移值为175.1d，<u>腿型左</u>偏移值为186.0d，<u>腿型右</u>偏移值为183.5d，这些指标均处于正常范围。'
                },
                {
                    name: '潜在健康分险分析',
                    interpret:
                        '您的<b>体重超出了健康范围</b>，可能增加患病风险。体脂率和腰臀比也超出正常范围，表示<u>体脂过高</u>。内脏脂肪等级接近上限值，需注意避免过度增加。体态偏差可能影响运动能力和生活质量。'
                },
                {
                    name: '总结',
                    interpret:
                        '您的体重和体脂偏高，需要关注健康风险。基础代谢和水分分布正常。部分体态偏差可能需要进一步评估和调整。'
                }
            ]
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
.report-interpret {
    .el-row {
        margin-top: 16px;
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
        font-size: 25px;
        font-family: OPPOSans L;
        font-weight: normal;
        line-height: 40px;

        &.abnormal {

            font-size: 17px;
            font-family: OPPOSans M;
            line-height: 30px;
        }
    }

    .interpret {
        margin-top: 2px;
        font-size: 17px;
        font-family: OPPOSans L;
        font-weight: normal;
        line-height: 30px;

        &.abnormal {
            margin-left: 12px;
        }
    }
}
</style>
