<template>
    <!--体型预测趋势图-->
    <div class="prediction-trend body-composition-trend">
        <div class="no-thermal-data result-failed-tip" v-if="isFailed">
            <div>
                <p>体型预测结果合成失败~</p>
                <p>小编猜测可能是网络原因导致的</p>
            </div>
        </div>
        <!-- 加载动画 -->
        <div class="loading" v-if="loading">
            <mt-spinner type="fading-circle" class="loading-dot"></mt-spinner>
        </div>
        <div class="trend-defer-container" v-else>
            <div class="header-title">
                <p>调节建议</p>
                <p>建议调节量</p>
            </div>
            <ul>
                <li>
                    <div class="top-title">
                        <span>体重&nbsp;&nbsp;kg</span>
                        <span
                            v-cloak
                        >{{ body.weight > 0 ? '+' + toDecimal2(body.weight, 1) : toDecimal2(body.weight, 1)}}</span>
                    </div>
                </li>
                <li>
                    <div class="top-title">
                        <span>体脂肪&nbsp;&nbsp;kg</span>
                        <span
                            v-cloak
                        >{{ body.bodyFat > 0 ? '+' + toDecimal2(body.bodyFat, 1) : toDecimal2(body.bodyFat, 1)}}</span>
                    </div>
                </li>
                <li>
                    <div class="top-title">
                        <span>肌肉量&nbsp;&nbsp;kg</span>
                        <span
                            v-cloak
                        >{{ body.muscle > 0 ? '+' + toDecimal2(body.muscle, 1) : toDecimal2(body.muscle, 1)}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { bodyAdjustInfo } from '@/assets/js/apolloGql.js'

export default {
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            body: {},
            isFailed: false,
            loading: true
        }
    },
    mounted() {
        this.$apollo
            .query({
                query: bodyAdjustInfo,
                variables: {
                    scanId: this.modelInfo.scanId
                }
            })
            .then(res => {
                const data = res.data.bodyAdjustInfo
                this.loading = false
                if (data && data.code === 200) {
                    this.body = data.data
                } else {
                    this.isFailed = true
                }
            })
        this.$hmt.trackPageview('/tab/prediction')
    },
    methods: {
        toDecimal2(x, y) {
            let f = Math.round(x * 100) / 100
            let s = f.toString()
            let rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            return s
        }
    }
}
</script>

<style lang="less" scoped>
.no-thermal-data {
    padding: 0 4vw;
    > div {
        padding: 8.533vw 0;
        background-image: -webkit-gradient(linear, left top, left bottom, from(#13142e), to(#0f122b));
        background-image: linear-gradient(180deg, #13142e, #0f122b);
        border-radius: 1.333vw;
        color: #fff;
        font-size: 3.2vw;
        -webkit-box-shadow: 0 0.533vw 3.733vw 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 0.533vw 3.733vw 0 rgba(0, 0, 0, 0.2);
        text-align: center;
        margin-bottom: 10.667vw;
        > p {
            line-height: 1.64;
        }
    }
}
.prediction-trend {
    display: flex;
    justify-content: center;
}

.trend-defer-container {
    width: 100%;
}
</style>
