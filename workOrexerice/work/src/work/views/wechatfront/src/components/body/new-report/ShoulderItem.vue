<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-07-07 17:22:50
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-07-26 18:17:35
-->
<template>
    <div>
        <div class="neck-assess-data">
            <!-- 外展上举-左手 -->
            <neck-data-item v-if="shoulderInfo.leftAbuction" :item="shoulderInfo.leftAbuction"></neck-data-item>
            <!-- 外展上举-右手 -->
            <neck-data-item v-if="shoulderInfo.rightAbuction" :item="shoulderInfo.rightAbuction"></neck-data-item>
            <!-- 前屈上举-左手 -->
            <neck-data-item v-if="shoulderInfo.leftAntexion" :item="shoulderInfo.leftAntexion"></neck-data-item>
            <!-- 前屈上举-右手 -->
            <neck-data-item v-if="shoulderInfo.rightAntexion" :item="shoulderInfo.rightAntexion"></neck-data-item>
        </div>
    </div>
</template>
<script>
import { findBsShoulderConclusion } from '@/assets/js/apolloGql.js'
import { toDecimal2 } from '@/assets/js/util.js'
import NeckDataItem from '@/components/common/new-report/NeckDataItem'
export default {
    components: {
        NeckDataItem,
    },
    props: {
        massInfo: Object
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            popupAssess: false,
            body: {},
            form: {
                name: '',
                desc: '',
                advice: '',
                result: 0
            },
            shoulderInfo: {},
            conclusion: [],
            isShow: false,
            bsShoulderNoMeasure: false,
            loading: false,
        }
    },
    mounted() {
        this.findBsShoulderConclusion()
        if (this.modelInfo.shoulderEval === 0) {
            this.bsShoulderNoMeasure = true
        } else if (this.modelInfo.bsShoulderScanResult === 1) {
            this.findBsShoulderConclusion()
        } else if (!this.modelInfo.bsShoulderScanResult || this.modelInfo.bsShoulderScanResult === 0) {
            this.isShow = true
        }
        // this.$hmt.trackPageview('/tab/shoulder')
    },
    methods: {
        toDecimal(num, digit) {
            return toDecimal2(num, digit)
        },
        // 获取肩部评估结论
        findBsShoulderConclusion() {
            this.$apollo
                .query({
                    query: findBsShoulderConclusion,
                    variables: {
                        scanId: this.massInfo.scanId,
                        scanTime: this.massInfo.createTime
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBsShoulderConclusion
                    this.loading = false
                    if (data && data.code === 200) {
                        this.shoulderInfo = data.data.shoulderInfo
                        this.conclusion = data.data.conclusion
                    } else {
                        this.isShow = true
                    }
                })
        }
    }
}
</script>
<style lang="less" scoped>
.neck-assess-data {
    // background-color: brown;
    padding: 0px 10px;
}

.detail-content {
    display: flex;
    justify-content: center;

    .neck-assessment-list {
        width: 100%;
    }
}
</style>

