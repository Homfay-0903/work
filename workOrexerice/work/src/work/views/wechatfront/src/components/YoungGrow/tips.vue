<template>
    <div class="tipsbox">
        <div class="tips">
            <p class="tipsTitle">
                <span>!</span>个性化建议
            </p>
            <p class="tipsTxt">{{ suggestConclusion.personalizedRec }}</p>
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
.tipsbox {
    width: 350px;
    margin: 0 auto 30px;
    background: linear-gradient(126deg, #1D1E3B 0%, rgba(16, 38, 80, 0.95) 100%);
    border-radius: 6px 6px 6px 6px;
    border: 1px solid;


    .tips {
        width: 330px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px 6px 6px 6px;
        margin: 10px auto;
        padding: 13px 0;

        .tipsTitle {
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            padding: 0 0 0 11px;
            text-align: left;

            span {
                display: inline-block;
                width: 16px;
                height: 16px;
                background: #EAB04D;
                border-radius: 50%;
                text-align: center;
                line-height: 16px;
                margin-right: 9px;
            }
        }

        .tipsTxt {
            font-weight: 400;
            font-size: 12px;
            color: #FFFFFF;
            margin: 7px 18px 0 37px;
            line-height: 18px;
            text-align: left;
        }
    }
}
</style>