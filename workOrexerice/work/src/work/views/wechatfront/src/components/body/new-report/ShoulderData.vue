<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-07-04 15:17:07
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-07-06 18:11:05
-->
<template>
    <!-- 肩部评估 -->
    <div class="neck-assess-data body-thermal-wrapper">
        <div class="neck-assessment-list data-problem">
            <div v-if="!isStatus">
                <img src="@/assets/images/new-report/report_completion_icon.png" alt="" class="conclusion-icon">
                <p class="name">{{ $t('shoulder.conclusion') }}</p>
            </div>
            <template v-for="(item, idx) in conclusion">
                <p class="title" :key="`${idx}-title`" v-if="isStatus">{{ item.title }}</p>
                <p class="conclusion" v-else :key="`${idx}-title`">{{ item.title }}</p>
                <div class="last-suggest" v-if="item.msg" :key="`${idx}-msg`">
                    <div class="suggest-msg">
                        <span class="suggest-lists">
                            <img src="@/assets/images/new-report/report_completion_icon.png" alt="" class="analyse">
                            <h5 class="head">{{ $t('shoulder.analyse') }}</h5>
                        </span>
                        <span class="content">{{ item.msg }}</span>
                    </div>
                    <div>
                        <span class="suggest-list" v-if="item.msg" :key="`${idx}-advice`">
                            <img src="@/assets/images/new-report/report_suggest_icon.png" alt="" class="suggest">
                            <h5 class="suggest-head">{{ $t('shoulder.suggest') }}</h5>
                            <span>{{ $t('shoulder.cause') }}</span>
                        </span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { findBsShoulderConclusion } from '@/assets/js/apolloGql.js'
export default {
    props: {
        massInfo: Object
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            conclusion: [],
            shoulderInfo: {},
            isShow: false,
            bsShoulderNoMeasure: false,
            isStatus: true
        }
    },
    mounted() {
        // 获取肩部评估结论
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
                        if (this.conclusion[0].title.indexOf(this.$t('shoulder.normal')) > 0 || this.conclusion[0].title.indexOf(this.$t('normal')) > 0 || this.conclusion[0].title.indexOf('暂未发现明显异常') > 0) {
                            this.isStatus = false
                        }
                    } else {
                        this.isShow = true
                    }
                })
        },
    }
}
</script>
<style lang="less" scoped>
.neck-assess-data {
    padding: 10px 10px;

    .neck-assessment-list {
        position: relative;
        width: 353px;
        color: #ffffff;
        background: url(../../../assets/images/new-report/report/bj1.png) center no-repeat;
        background-size: 100% 100%;
        padding-bottom: 15px;

        .name {
            font-size: 15px;
            background-size: 19px 19px;
            line-height: 22px;
            text-align: left;
            padding-top: 21px;
            margin: 0 0 4px 39px;
        }

        .conclusion-icon {
            position: absolute;
            top: 23px;
            left: 14px;
            width: 16px;
            height: 16px;
        }

        .conclusion {
            font-size: 14px;
            text-align: left;
            margin-left: 39px;
            margin-right: 8px;
        }

        .title {
            font-size: 13px;
            padding: 22px 10px 5px 39px;
            text-align: left;
            color: #E64444;
            background: url(../../../assets/images/new-report/report/notice.png) no-repeat 11px 23px;

            &:nth-last-of-type(1) {
                &::before {
                    content: '';
                    width: 110%;
                    display: block;
                    height: 1px;
                    background: #ffffff;
                    margin: auto;
                    position: relative;
                    top: -25px;
                    opacity: 0.2;
                    left: -33px;
                }
            }
        }

        .suggest {
            width: 16px;
            height: 16px;
            margin-left: -30px;
        }

        .last-suggest {
            text-align: left;
            padding-top: 10px;
            padding-bottom: 25px;
        }

        .suggest-list {
            font-size: 12px;
            text-align: left;
            padding: 0 14px 17px 39px;

            .suggest-head {
                font-size: 12px;
                font-weight: 400;
                text-align: left;
                margin: -20px 0 5px 35px;
            }

            span {
                padding-bottom: 10px;
                color: #8AA3BE;
                margin-left: 36px;
                width: 80%;
                display: inline-block
            }
        }

        .suggest-lists {
            font-size: 12px;
            margin-left: 39px;

            .analyse {
                width: 16px;
                height: 16px;
                margin-left: -40px;
            }

            .head {
                font-size: 12px;
                font-weight: 400;
                text-align: left;
                margin-left: 25px;
                margin-top: -18px;
            }
        }

        .suggest-msg {
            padding: 14px 15px 17px 11px;

            .content {
                font-size: 12px;
                color: #8AA3BE;
                width: 305px;
                display: inline-block;
                padding: 5px 0 5px 22px;
            }
        }
    }
}
</style>

