<!--
 * @Description: 肩部功能报告
 * @Author: gaoyuanyuan
 * @Date: 2020-10-09 15:12:55
 * @LastEditors: yangsheng
 * @LastEditTime: 2021-01-21 10:00:41
-->
<template>
    <div class="shoulder-report">
        <div class="shoulder-result">
            <h2>肩部功能评估</h2>
            <div class="result-table" id="result-table">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>测量项目</th>
                            <th>测量值</th>
                            <th>正常范围</th>
                            <th>评估</th>
                            <th>与上次对比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in shoulderInfo" :key="idx">
                            <td>
                                <img
                                    v-if="imgSize"
                                    :style="{ width: `${imgSize * 0.56}px` , height: `${imgSize * 0.56}px`, padding: `${imgSize * 0.22}px` }"
                                    :src="require(`@/assets/images/${camelCaseToLine(item.key)}${item.conclusion === '正常' || item.conclusion === null ? '_nor' : '_abnor' }.png`)"
                                    :alt="item.name"
                                    @load="imageLoaded"
                                />
                            </td>
                            <td>
                                <span class="name">{{ item.name }}</span>
                            </td>
                            <td>
                                <span
                                    v-if="item"
                                    class="val"
                                >{{ item.val === null || !item.val ? '--' : `${toDecimal(item.val, 1)}°` }}</span>
                            </td>
                            <td>
                                <span
                                    class="val"
                                >{{ !item.limit || item.val === null || !item.val ? '--' : item.limit }}</span>
                            </td>
                            <td>
                                <span class="msg" v-if="!item.conclusion || item.val === null || !item.val">--</span>
                                <span class="msg" v-else>
                                    {{ item.conclusion === '正常' ? '正常' : `活动度${item.conclusion }` }}
                                </span>
                            </td>
                            <td>
                                <contrast v-if="item" :val="item.contrast" unit="°"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="conclusion" v-if="!isTangCenBei">
            <h2>肩部功能评估结论</h2>
            <div class="footer-part">
                <div class="msg" v-if="conclusion.length !== 0">
                    <template v-for="(item, idx) in conclusion">
                        <p class="title" :key="`${idx}-title`">{{ item.title }}</p>
                        <div class="conclusion-msg" v-if="item.msg" :key="`${idx}-msg`">
                            <div>
                                <p class="head">分析：</p>
                            </div>
                            <p>{{ item.msg }}</p>
                        </div>
                        <p class="advice" :key="`${idx}-advice`" v-if="item.msg && idx === conclusion.length - 1">
                            <span class="head">建议：</span>具体原因请找专业人士做进一步筛查。
                        </p>
                    </template>
                </div>
            </div>
        </div>
        <report-footer v-if="!isTangCenBei" :scanId="reportInfo.scanId"></report-footer>
        <p v-if="isTangCenBei" class="tang">*以上数据来源于仪器分析，仅供参考，如需进一步了解，请咨询医生或药师。</p>
    </div>
</template>
<script>
import Contrast from '@/components/Contrast'
import ReportFooter from '@/components/Footer'
import { findBsShoulderConclusion } from '@/assets/js/apolloGql.js'
import { _toDecimal, _camelCaseToLine } from '@/assets/js/util.js'
export default {
    name: 'ShoulderReprot',
    components: {
        Contrast,
        ReportFooter
    },
    props: {
        reportInfo: Object,
        memberInfo: Object,
        isTangCenBei: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loadedImgNum: 0,
            imgSize: 141,
            shoulderInfo: [
                {
                    key: 'leftAbuction'
                },
                {
                    key: 'rightAbuction'
                },
                {
                    key: 'leftAntexion'
                },
                {
                    key: 'rightAntexion'
                }
            ],
            conclusion: []
        }
    },
    created() {
        this.findBsShoulderConclusion()
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        camelCaseToLine(key) {
            return _camelCaseToLine(key)
        },
        // 获取肩部评估数据
        async findBsShoulderConclusion() {
            const userinfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: findBsShoulderConclusion,
                    variables: userinfo
                })
                .then(res => {
                    const info = res.data.bsShoulderConclusion
                    const shoulderData = info.data
                    if (info.code === 200) {
                        this.conclusion = shoulderData.conclusion
                        const shoulderInfo = shoulderData.shoulderInfo
                        let shoulderItem = []
                        this.shoulderInfo.forEach((item, key) => {
                            const info = { ...shoulderInfo[item.key], ...{ img: item.img, key: item.key }}
                            shoulderItem.push(info)
                        })
                        this.shoulderInfo = shoulderItem
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        imageLoaded() {
            this.loadedImgNum++
            // 图片加载完成
            if (this.loadedImgNum === 4) {
                console.log('SHOULDER_REPORT_OVER')
            }
        }
    }
}
</script>

<style scoped lang="less">
[v-cloak] {
    display: none;
}
.shoulder-report {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 591px;
    width: 100%;
    padding: 15px 0 19px 0;
    h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #333333;
        line-height: 32px;
    }
    .shoulder-result {
        flex: 1;
        .result-table {
            position: relative;
            height: 590px;
            table {
                position: relative;
                height: 100%;
                tbody {
                    position: relative;
                    tr {
                        td {
                            position: relative;
                            height: 141px;
                            border-bottom-color: #009fe8;
                            img {
                                position: absolute;
                                top: 0;
                                border-right: 1px solid #009fe8;
                                background: url('../../assets/images/grid_bg.svg') no-repeat;
                                background-size: cover;
                            }
                            .msg {
                                font-size: 12px;
                                font-family: OPPOSans-R;
                                font-weight: normal;
                                color: #666666;
                                line-height: 20px;
                            }
                            .name {
                                font-weight: 500;
                            }
                        }
                        &:not(:last-of-type) {
                            td {
                                &:not(:first-of-type) {
                                    border-bottom-color: #CED7E0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .conclusion {
        margin-top: 16px;
    }
    .footer-part {
        .msg {
            min-height: 68px;
            padding: 20px;
            border: 1px solid #009fe8;
            p {
                margin: 0;
                padding: 0;
                color: #9b9b9b;
                font-size: 12px;
                font-family: OPPOSans-R;
                font-weight: normal;
                line-height: 18px;
                &.title {
                    color: #5698f5;
                    line-height: 19px;
                }
                & ~ .title {
                    margin-top: 14px;
                }
            }
            .conclusion-msg {
                display: flex;
                .head {
                    width: 36px;
                }
            }
            .advice {
                margin-top: 14px;
                .head {
                    font-family: OPPOSans-R;
                }
            }
        }
    }
    .footer {
        width: 267px;
        margin-top: 150px;
    }
    .tang {
        margin-top: 28px;
        font-size: 14px;
        color: rgba(0,0,0,0.44);
        line-height: 20px;
    }
}
</style>