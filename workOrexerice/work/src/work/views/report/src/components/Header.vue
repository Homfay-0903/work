<!--
 * @Description: 头部组件
 * @Author: gaoyuanyuan
 * @Date: 2020-01-03 17:51:55
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2025-10-27 10:27:13
 -->
<template>
    <div class="header">
        <div class="scan-time" v-if="!deviceVApro7">
            <span class="key">检测时间:</span>
            <span class="key">{{ reportInfo.scanTime }}</span>
        </div>
        <!-- logo -->
        <div class="logo">
            <!-- 报告logo 无自定义则显示维塑 -->
            <img :src="otherLogo ? otherLogo : vfLogo" class="vf-logo" />
            <h1>{{ reportTitle }}</h1>
            <!-- 配置自定义logo时维塑水印 -->
            <img class="mark" v-if="otherLogo || showWatermark" :src="vfLogo">
            <div :style="{ opacity: [1, 2].indexOf(this.type) > -1 ? '1' : '0' }" class="num">{{ score.val }}分</div>
        </div>
        <!-- 扫描者信息 -->
        <div class="scan-info">
            <div>
                <template v-if="isEduDock">
                    <span class="key">姓名:</span>
                    <span class="val">{{ memberInfo.memberName }}</span>
                    <span class="key" v-if="printInfo.isPrivate">学号:</span>
                    <span class="val" v-if="printInfo.isPrivate">{{ memberInfo.memberCode }}</span>
                </template>
                <template v-else>
                    <span class="key">ID:</span>
                    <span class="val">{{ showId(memberInfo) }}</span>
                </template>
                <span class="key">性别:</span>
                <span class="val">{{ memberInfo.memberSex === 1 ? '男' : '女' }}</span>
                <span class="key">身高:</span>
                <span class="val">{{ memberInfo.memberHeight }}cm</span>
                <span class="key" v-if="showWeight">体重:</span>
                <span class="val" v-if="showWeight">{{ memberInfo.weight > 0 ? `${memberInfo.weight}kg` : '--' }}</span>
                <span class="key">年龄:</span>
                <span class="val">{{ memberInfo.memberAge }}岁</span>
                <span class="key" v-if="deviceVApro7">检测时间:</span>
                <span class="val" v-if="deviceVApro7">{{ reportInfo.scanTime }}</span>
            </div>
            <!-- 报告分数对比 -->
            <p :style="{ opacity: [1, 2].indexOf(this.type) > -1 ? '1' : '0' }" class="contrast">
                <template v-if="score.diff !== ''">
                    与上次得分对比
                    <span>{{ score.diff >= 0 ? `+${score.diff}` : score.diff }}</span>
                </template>
                <template v-else>
                    本次测量分数
                </template>
            </p>
        </div>
    </div>
</template>
<script>
import { getMemberInfo, bodyScore, findUserInfoByScanId } from '@/assets/js/apolloGql.js'
import vfLogo from '@/assets/images/vf_logo.svg'
import { clone, getUserId } from '@/assets/js/util.js'
import { isVAPro3, isVAPro7 } from '@/types/device.js'
export default {
    name: 'Header',
    props: {
        reportInfo: Object,
        // 报告分数类型 1 体成分 2 体态
        type: {
            type: Number,
            default: 1
        },
        showWeight: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            otherLogo: '',
            vfLogo: vfLogo,
            showWatermark: false, // 是否显示水印
            memberInfo: {},
            scoreInfo: {
                mass: {
                    val: '',
                    diff: ''
                },
                eval: {
                    val: '',
                    diff: ''
                }
            },
            printInfo: {},
            pdfIdEncryption: 0,
            deviceVApro3: false,
            methodId: 0,
            deviceVApro7: false,
        }
    },
    computed: {
        score() {
            return this.type === 1 ? this.scoreInfo.mass : this.scoreInfo.eval
        },
        // 手机号脱敏
        mobile() {
            const phone = this.memberInfo.memberMobile
            return phone ? getUserId(phone) : ''
        },
        reportTitle() {
            let title = ''
            switch (this.type) {
                case 1:
                    title = '身体成分测量报告'
                    break

                case 2:
                    title = '体态评估测量报告'
                    break

                case 3:
                    title = '肩部功能测量报告'
                    break

                case 4:
                    title = '脊柱侧弯风险筛查'
                    break
                case 5:
                    title = '身体围度测量报告'
                    break
                case 6:
                    title = '无电流营养分析报告'
                    break
                case 7:
                    title = '身体成分测量报告'
                    break
                case 8:
                    title = '腰腹围度测量报告'
                    break
                // eslint-disable-next-line no-fallthrough
                case 9:
                    // 在CMDB中可以自定义报告名称
                    title = this.reportInfo.reportTitle || '脊柱专项评估报告'
                    break
                case 10:
                    // 青少年成长发育专项报告
                    title = '青少年成长发育专项报告'
                    break
                default:
                    break
            }
            return title
        },
        isEduDock() {
            return [6, 7, 8].includes(this.methodId)
        },
    },
    created() {
        this.deviceVApro3 = isVAPro3(this.reportInfo.scanId)
        this.deviceVApro7 = isVAPro7(this.reportInfo.scanId)

        console.log('===========获取体成分数据' + this.type)
        if ([1, 2].indexOf(this.type) > -1) {
            this.getBodyScore()
        }
        this.getMemberInfo()
        this.findUserInfoByScanId()
        this.getUrlSearch()
    },
    methods: {// 获取url
        getUrlSearch() {
            let urls = window.location.search.split('?')[1]
            let printInfo = {}
            if (urls) {
                let url = urls.split('&')
                url.forEach(el => {
                    let key = el.split('=')[0]
                    let val = el.substring(el.indexOf('=') + 1)
                    printInfo[key] = decodeURIComponent(val)
                })

                this.printInfo = clone(printInfo)
            }
        },
        // ID显示
        showId(data) {
            let mobile = data.memberMobile
            if (data.memberType === 2) {
                let length
                // 兼容vapro3代码
                if (['M5', 'M6', 'M2', 'M7', 'M3', 'N2', 'N7'].includes(this.reportInfo.scanId.substr(0, 2))) {
                    length = 16 + 1
                } else {
                    length = 14 + 1
                }
                if (data.memberMobile.length > length) {
                    const newMobile = data.memberMobile.substr(0, data.memberMobile.length - length)
                    return this.formatMobile(newMobile)
                }

            }
            return this.formatMobile(mobile)
        },
        // 格式化手机号显示
        formatMobile(mobile) {
            let result = mobile || ''
            if (this.pdfIdEncryption === 0) {
                if (result.length > 20) {
                    result = result.substr(0, 20) + '…'
                }
                return result
            }
            return mobile ? getUserId(mobile) : ''
        },
        // 获取账号信息
        async findUserInfoByScanId() {
            await this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.reportInfo.scanId
                    }
                })
                .then(res => {
                    const info = res.data.findUserInfoByScanId
                    const userInfo = info.data
                    if (info.code === 200) {
                        this.showWatermark = userInfo.watermark === 1 ? true : false
                        this.otherLogo = userInfo.logoUrl
                        this.pdfIdEncryption = userInfo.pdfIdEncryption
                        this.methodId = userInfo.methodId
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取扫描用户信息
        async getMemberInfo() {
            const userInfo = {
                scanId: this.reportInfo.scanId
            }
            await this.$apollo
                .query({
                    query: getMemberInfo,
                    variables: userInfo,

                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    if (data.code === 200) {
                        this.memberInfo = data.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取报告分数
        async getBodyScore() {
            console.log('===========获取体成分数据1')
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime,
                scanType: this.type
            }
            await this.$apollo
                .query({
                    query: bodyScore,
                    variables: userInfo
                })
                .then(res => {

                    const info = res.data.bodyScore
                    const scoreData = info.data
                    console.log('===========获取体成分数据2')
                    console.log(info)
                    console.log('===========获取体成分数据2')
                    if (info.code === 200) {
                        this.scoreInfo.mass.val = parseInt(scoreData.massScore, 10)
                        this.scoreInfo.eval.val = parseInt(scoreData.evalScore, 10)
                        // 有对比值
                        if (scoreData.preMassScore) {
                            this.scoreInfo.mass.diff =
                                parseInt(scoreData.massScore, 10) - parseInt(scoreData.preMassScore, 10)
                        }
                        if (scoreData.preEvalScore) {
                            this.scoreInfo.eval.diff =
                                parseInt(scoreData.evalScore, 10) - parseInt(scoreData.preEvalScore, 10)
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>
<style lang="less" scoped>
.header {
    position: relative;

    .scan-time {
        position: absolute;
        top: -22px;
        right: 0px;
        font-size: 14px;
        font-family: OPPOSans R;
        font-weight: normal;
        color: #666666;
        ;
    }

    .logo {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .vf-logo {
            width: 102px;
        }

        h1 {
            margin: 0;
            font-size: 51px;
            font-family: OPPOSans M;
            font-weight: normal;
            color: #333333;
            line-height: 68px;
        }

        .mark {
            position: absolute;
            opacity: 0.2;
            right: 36px;
            width: 102px;
        }

        .num {
            position: relative;
            font-size: 37px;
            font-family: OPPOSans M;
            font-weight: normal;
            color: #333333;
            line-height: 49px;
            padding-right: 9px;

            &:after {
                content: '';
                position: absolute;
                width: 6px;
                height: 33px;
                top: 8px;
                right: 0;
                background: #009fe8;
            }
        }
    }

    .scan-info {
        margin-top: 20px;
        // padding-bottom: 9px;
        border-bottom: 3px solid #009fe8;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        span {
            font-size: 15px;
            font-family: OPPOSans R;
            font-weight: normal;
            line-height: 20px;
        }

        .key {
            margin-right: 7px;
            color: #1f1e1e;
        }

        .val {
            font-family: OPPOSans M;
            margin-right: 15px;
            color: #333333;
            font-weight: 500;
        }

        .contrast {
            float: right;
            // margin-top: 6px;
            font-size: 12px;
            font-family: OPPOSans R;
            font-weight: normal;
            color: #666666;
            line-height: 16px;

            span {
                float: right;
                text-align: center;
                width: 36px;
                height: 16px;
                font-family: OPPOSans M;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                margin-left: 6px;
                color: #131724;
                background: #b4d1f6;
            }
        }
    }
}
</style>
