<!--
 * @Description: 身体成分报告
 * @Author: DonWangWQ
 * @Date: 2023-04-14 16:12:07
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-19 16:01:12
 -->
<template>
  <div class="bm-report">
    <!-- 右侧部分 -->
    <div class="locale-free">
      <!-- 脂肪肌肉评估 -->
      <h2>人体成分概览<img v-if="athlete" class="athlete-icon"
                    src="@/assets/images/athlete.svg" /></h2>
      <div class="analysis-table thead-line">
        <table border="1" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th></th>
              <th class="two-block name-mass">低标准</th>
              <th>标准</th>
              <th class="name-mass">超标准</th>
              <th></th>
              <th class="three-block name-measure">标准范围</th>
              <th class="three-block">与上次对比</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span class="name">体重</span>
                <em>{{ unit === "imperial" ? "lbs" : "kg" }}</em>
                <!-- <em>{{ unit === 'imperial' ? isImperial : isMetric }}</em> -->
              </td>
              <td colspan="4">
                <mass-progress
                  v-if="WT"
                  :val="WT.v"
                  :low="WT.l"
                  :hight="WT.h"
                  :isM30="isM30"
                ></mass-progress>
                <!-- <mass-progress
                  v-if="WT && unit === 'metric'"
                  :val="WT.v * 0.45359237"
                  :low="WT.l * 0.45359237"
                  :hight="WT.h * 0.45359237"
                  :isM30="isM30"
                ></mass-progress> -->
              </td>
              <td class="three-block name-measure">
                <span v-if="WT && WT.v" class="limits"
                  >[{{ toDecimal(WT.l, 1) }}~{{ toDecimal(WT.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast v-if="WT" :val="WT.v ? WT.diff : null"></contrast>
              </td>
            </tr>
            <tr>
              <td>
                <span class="name">体脂肪</span>
                <em>{{ unit === "imperial" ? "lbs" : "kg" }}</em>
                <!-- <em>{{ unit === 'imperial' ? isImperial : isMetric }}</em> -->
              </td>
              <td colspan="4">
                <mass-progress
                  v-if="BFM && !isShowTop"
                  :val="BFM.v"
                  :low="BFM.l"
                  :hight="BFM.h"
                  :isM30="isM30"
                ></mass-progress>
                <!-- <mass-progress
                  v-if="BFM && unit === 'metric' && !isShowTop"
                  :val="BFM.v * 0.45359237"
                  :low="BFM.l * 0.45359237"
                  :hight="BFM.h * 0.45359237"
                  :isM30="isM30"
                ></mass-progress> -->
              </td>
              <td class="three-block name-measure">
                <span v-if="BFM && BFM.v" class="limits"
                  >[{{ toDecimal(BFM.l, 1) }}~{{ toDecimal(BFM.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast v-if="BFM" :val="BFM.v ? BFM.diff : null"></contrast>
              </td>
            </tr>
            <tr>
              <td>
                <span class="name">骨骼肌</span>
                <em>{{ unit === "imperial" ? "lbs" : "kg" }}</em>
                <!-- <em>%</em> -->
              </td>
              <td colspan="4">
                <mass-progress
                  :val="SM.v"
                  :low="SM.l"
                  :hight="SM.h"
                  :isM30="isM30"
                  v-if="!isShowTop"
                ></mass-progress>
              </td>
              <td class="three-block name-measure">
                <span v-if="SM && SM.v" class="limits"
                  >[{{ toDecimal(SM.l, 1) }}~{{ toDecimal(SM.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast v-if="SM" :val="SM.v ? SM.diff : null"></contrast>
              </td>
            </tr>
            <tr>
              <td>
                <span class="name">总水分</span>
                <em>{{ unit === "imperial" ? "lbs" : "kg" }}</em>
                <!-- <em>{{ unit === 'imperial' ? isImperial : isMetric }}</em> -->
              </td>
              <td colspan="4">
                <mass-progress
                  v-if="TBW"
                  :val="TBW.v"
                  :low="TBW.l"
                  :hight="TBW.h"
                  :isM30="isM30"
                ></mass-progress>
                <!-- <mass-progress
                  v-if="TBW && unit === 'metric'"
                  :val="TBW.v * 0.45359237"
                  :low="TBW.l * 0.45359237"
                  :hight="TBW.h * 0.45359237"
                  :isM30="isM30"
                ></mass-progress> -->
              </td>
              <td class="three-block name-measure">
                <span v-if="TBW && TBW.v" class="limits"
                  >[{{ toDecimal(TBW.l, 1) }}~{{ toDecimal(TBW.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast v-if="TBW" :val="TBW.v ? TBW.diff : null"></contrast>
              </td>
            </tr>
            <tr v-if="PROTEIN && PROTEIN.v !== 0">
              <td>
                <span class="name">蛋白质</span>
                <em>{{ unit === "imperial" ? "lbs" : "kg" }}</em>
                <!-- <em>{{ unit === 'imperial' ? isImperial : isMetric }}</em> -->
              </td>
              <td colspan="4">
                <mass-progress
                  v-if="PROTEIN"
                  :val="PROTEIN.v"
                  :low="PROTEIN.l"
                  :hight="PROTEIN.h"
                  :isM30="isM30"
                ></mass-progress>
                <!-- <mass-progress
                  v-if="PROTEIN && unit === 'metric'"
                  :val="PROTEIN.v * 0.45359237"
                  :low="PROTEIN.l * 0.45359237"
                  :hight="PROTEIN.h * 0.45359237"
                  :isM30="isM30"
                ></mass-progress> -->
              </td>
              <td class="three-block name-measure">
                <span v-if="PROTEIN && PROTEIN.v" class="limits"
                  >[{{ toDecimal(PROTEIN.l, 1) }}~{{ toDecimal(PROTEIN.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast
                  v-if="PROTEIN"
                  :val="PROTEIN.v ? PROTEIN.diff : null"
                ></contrast>
              </td>
            </tr>
            <tr>
              <td>
                <span class="name">BMI</span>
                <!-- <em>{{ unit === 'imperial' ? 'lbs' : 'kg' }}</em> -->
                <em>kg/m²</em>
              </td>
              <td colspan="4">
                <mass-progress
                  :val="BMI.v"
                  :low="BMI.l"
                  :hight="BMI.h"
                  :isM30="isM30"
                  v-if="!isShowTop"
                ></mass-progress>
              </td>
              <td class="three-block name-measure">
                <span v-if="BMI && BMI.v" class="limits"
                  >[{{ toDecimal(BMI.l, 1) }}~{{ toDecimal(BMI.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast v-if="BMI" :val="BMI.v ? BMI.diff : null"></contrast>
              </td>
            </tr>
            <tr>
              <td>
                <span class="name">体脂率</span>
                <!-- <em>{{ unit === 'imperial' ? 'lbs' : 'kg' }}</em> -->
                <em>%</em>
              </td>
              <td colspan="4">
                <mass-progress
                  :val="PBF.v"
                  :low="PBF.l"
                  :hight="PBF.h"
                  :isM30="isM30"
                  v-if="!isShowTop"
                ></mass-progress>
              </td>
              <td class="three-block name-measure">
                <span v-if="PBF && PBF.v" class="limits"
                  >[{{ toDecimal(PBF.l, 1) }}~{{ toDecimal(PBF.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast v-if="PBF" :val="PBF.v ? PBF.diff : null"></contrast>
              </td>
            </tr>
            <tr>
              <td>
                <span class="name">基础代谢</span>
                <em>kcal/d</em>
                <!-- <em>{{ unit === 'imperial' ? isImperial : isMetric }}</em> -->
              </td>
              <td colspan="4">
                <mass-progress
                  v-if="BMR && !isShowTop"
                  :val="BMR.v"
                  :low="BMR.l"
                  :hight="BMR.h"
                  :isM30="isM30"
                ></mass-progress>
                <!-- <mass-progress
                  v-if="BMR && unit === 'metric' && !isShowTop"
                  :val="BMR.v * 0.45359237"
                  :low="BMR.l * 0.45359237"
                  :hight="BMR.h * 0.45359237"
                  :isM30="isM30"
                ></mass-progress> -->
              </td>
              <td class="three-block name-measure">
                <span v-if="BMR && BMR.v" class="limits"
                  >[{{ toDecimal(BMR.l, 1) }}~{{ toDecimal(BMR.h, 1) }}]</span
                >
                <span class="limits no-data" v-else>- -</span>
              </td>
              <td>
                <contrast v-if="BMR" :val="BMR.v ? BMR.diff : null"></contrast>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 只测体重，没有体脂率、体脂肪、去脂体重时的提示语 -->
        <div class="no-mass-tip" v-if="isShowTop">
          <img src="@/assets/images/placeholder.png" alt="" />
          <p>tip</p>
        </div>
      </div>
      <!-- 历史趋势 -->
      <div class="trend-table">
        <mass-trend-m
          :memberId="memberInfo.memberId"
          :deviceId="reportInfo.deviceId"
          :scanTime="reportInfo.scanTime"
          :scanId = "reportInfo.scanId"
          @load-mass-report="loadMassReport"
        ></mass-trend-m>
      </div>
      <report-footer class="qr-code" :scanId="reportInfo.scanId"></report-footer>
    </div>
  </div>
</template>
<script>
import { bmMassContrastInfo } from '@/assets/js/apolloGql.js'
import { _toDecimal } from '@/assets/js/util.js'
import { promptMessage } from '@/assets/js/config.js'
import ReportFooter from '@/components/Footer'
// 节段脂肪&肌肉
import Segment from '@/components/Segment'
// 体成分历史趋势
import MassTrendM from '@/components/MassTrendM'
// 体成分项进度条
import MassProgress from '@/components/MassProgress'
// 内脏脂肪进度条
import GradeProgress from '@/components/GradeProgress'
import Contrast from '@/components/Contrast'
import NewContrast from '@/components/NewContrast'

export default {
    name: 'BmReport',
    components: {
        Segment,
        Contrast,
        NewContrast,
        MassTrendM,
        MassProgress,
        GradeProgress,
        ReportFooter,
    },
    props: {
        reportInfo: Object,
        memberInfo: Object,
        athlete: Number
    },
    data() {
        return {
            promptMessage,
            dataResult: [],
            dataAnalysis: [],
            adjustData: {}, // 调节量
            // 节段脂肪
            bmSegBFM: {
                BFMTR: {},
                BFMRA: {},
                BFMLA: {},
                BFMRL: {},
                BFMLL: {},
            },
            // 节段肌肉
            bmSegLM: {
                LMTR: {},
                LMRA: {},
                LMLA: {},
                LMRL: {},
                LMLL: {},
            },
            // 内脏脂肪等级
            vaGrade: {
                val: 0,
                diff: '',
            },
            // 体成分信息
            massInfo: {
                PBF: { v: '' },
                SM: { v: '' },
                WT: { v: '' },
            },
            massOver: 0,
            explain: '',
            unit: '',
            isM30: true,
        }
    },
    computed: {
    // 是否显示无数据提示语
        isShowTop() {
            return false
        },
        // 体重
        WT() {
            return this.massInfo['WT']
        },
        // 体脂肪
        BFM() {
            return this.massInfo['BFM']
        },
        // 去脂体重
        FFM() {
            return this.massInfo['FFM']
        },
        // 骨骼肌量
        SM() {
            return this.massInfo['SM']
        },
        // 肌肉量
        LM() {
            return this.massInfo['LM']
        },
        // 总水分
        TBW() {
            return this.massInfo['TBW']
        },
        // 无机盐
        TM() {
            return this.massInfo['TM']
        },
        // 蛋白质
        PROTEIN() {
            return this.massInfo['PROTEIN']
        },
        // 身体质量
        BMI() {
            return this.massInfo['BMI']
        },
        // 体脂肪率
        PBF() {
            return this.massInfo['PBF']
        },
        // 基础代谢量
        BMR() {
            return this.massInfo['BMR']
        },
        // 腰臀比
        WHR() {
            return this.massInfo['WHR']
        },
        // 细胞内液
        ICW() {
            return this.massInfo['ICW']
        },
        // 细胞外液
        ECW() {
            return this.massInfo['ECW']
        },
    },
    created() {
        setTimeout(() => {
            this.getBmMassContrastInfo()
        }, 1000)

        console.log('加载体成分报告')
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        // 体成分报告是否加载完成
        loadMassReport() {
            this.massOver++
            if (this.massOver === 1) {
                console.log('MASS_REPORT_OVER')
            }
        },
        // 体成分数据及对比
        async getBmMassContrastInfo() {
            const userInfo = {
                memberId: this.memberInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime,
            }
            await this.$apollo
                .query({
                    query: bmMassContrastInfo,
                    variables: userInfo,
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const info = res.data.bmMassContrastInfo
                    const massData = info.data
                    if (info.code === 200 && massData.length !== 0) {
                        let massInfo = JSON.parse(JSON.stringify(massData[0]), massData[1])
                        for (let key in massInfo) {
                            if (Object.prototype.hasOwnProperty.call(massInfo, key)) {
                                if (typeof massInfo[key] === 'object') {
                                    // 有对比值
                                    if (massData[1] && massData[1][key] !== '' && massInfo[key]) {
                                        const diff = massInfo[key].v - massData[1][key].v
                                        // 腰臀比保留2位 其他保留1位
                                        const digit = key === 'WHR' ? 2 : 1
                                        massInfo[key].diff = this.toDecimal(diff, digit)
                                    } else if (massInfo[key] !== null) {
                                        massInfo[key].diff = ''
                                    }
                                }
                            }
                        }
                        this.massInfo = massInfo
                        // this.unit = window.localStorage.getItem('unit')
                    }
                })
        },
    },
}
</script>

<style scoped lang="less" media="all">
.bm-report {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 12px 0 16px 0;

  h2 {
    margin: 0 0 5px 0;
    font-size: 24px;
    font-family: "OPPOSans R", "OPPOSans-R", "Noto Kufi Arabic SemiBold";
    font-weight: normal;
    color: #333333;
    line-height: 32px;
  }

  h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-family: "OPPOSans R", "OPPOSans-R", "Noto Kufi Arabic SemiBold";
    font-weight: normal;
    color: #333333;
    line-height: 24px;

    span {
      font-size: 12px;
      font-family: "OPPOSans R", "OPPOSans-R", "Noto Kufi Arabic SemiBold";
      font-weight: normal;
      color: #666666;
      line-height: 16px;
    }

    & ~ .tips {
      margin-bottom: 9px;
    }
  }

  .tips {
    margin: 0;
    font-size: 12px;
    font-family: "OPPOSans R", "OPPOSans-R", "Noto Kufi Arabic SemiBold";
    font-weight: normal;
    color: #9b9b9b;
    line-height: 18px;

    span {
      width: 44px;
      height: 16px;
      float: right;
      text-align: center;
      font-size: 12px;
      font-family: "OPPOSans R", "OPPOSans-R", "Noto Kufi Arabic SemiBold";
      font-weight: normal;
      color: #ffffff;
      line-height: 16px;
      background: #5698f5;
    }
  }

  .right-part {
    width: 100%;
  }

  .body-table {
    position: relative;
    margin-bottom: 20px;

    .extra-bone {
      position: absolute;
      z-index: 1;
      width: 100%;
      bottom: 0;
      margin: 0;
      color: #5e687b;
      text-align: start;
      text-indent: 14px;
      font-size: 10px;

      &:after {
        position: absolute;
        display: block;
        content: "";
        z-index: -1;
        width: 100%;
        height: 4px;
        bottom: -1px;
        border-top: 1px dashed #b4d1f6;
        border-bottom: 1px dashed #b4d1f6;
        background: #f2f8ff;
      }
    }
  }

  .analysis-table {
    margin-bottom: 24px;
    position: relative;

    table {
      table-layout: auto;
    }

    & ~ .tips {
      margin: 6px 0 17px 0;
    }
    .no-mass-tip {
      position: absolute;
      z-index: 10;
      width: 421px;
      height: 98px;
      border-radius: 3px;
      border: 1px dashed #ced7e0;
      left: 137px;
      bottom: 24px;
      text-align: center;
      img {
        width: 52px;
        margin-top: 17px;
      }
      p {
        margin: 5px auto 0;
        font-size: 12px;
        color: #999999;
      }
    }
  }

  .adjust-table {
    table {
      tbody {
        tr {
          td {
            &:first-of-type {
              width: 90px;
            }
          }
        }
      }
    }
  }

  .grade-table {
    table {
      thead {
        tr {
          th:nth-of-type(2) {
            width: 124px;
          }

          th:nth-of-type(3) {
            width: 124px;
          }

          th:nth-of-type(4) {
            width: 42px;
            border-right: none;
          }

          th:nth-of-type(5) {
            width: 80px;
            border-right: none;
          }

          th:nth-of-type(6) {
            padding-left: 0;
            border-right: 1px solid #009fe8;
          }
        }
      }
    }
  }

  // 身体模型
  .body-model {
    margin-top: 34px;

    .model {
      display: flex;
      justify-content: center;
      position: relative;
      margin-top: 27px;
      height: 268px;
      text-align: center;
      background: url("../../assets/images/model_bg.svg");
      background-size: cover;

      img {
        width: auto;
        height: 260px;

        &.default {
          width: 108px;
          height: auto;
        }
      }
    }
  }

  // 围度信息
  .girth {
    margin-top: 56px;

    table {
      thead {
        tr {
          th {
            &:first-of-type {
              text-align: left;
              text-indent: 10px;
            }
          }
        }
      }

      tbody {
        tr {
          td {
            height: 26px;

            &:first-of-type {
              border-left-color: transparent;
            }

            &:last-of-type {
              border-right-color: transparent;
            }
          }

          &:last-of-type {
            td {
              border-bottom-color: transparent;
            }
          }
        }
      }
    }

    .name {
      color: #666666;
      font-size: 12px;
      font-family: "OPPOSans R", "OPPOSans-R", "Noto Kufi Arabic SemiBold";
    }
  }

  // 节段
  .segment {
    margin: 37px 0 20px;
  }

  .icon-warn {
    display: inline-block;
    width: 13px;
    height: 13px;
    vertical-align: middle;
    margin-right: 2px;
    background: url("../../assets/images/icon_warn.svg");
    background-size: cover;

    & ~ span {
      vertical-align: middle;
    }
  }

  .icon-check {
    display: inline-block;
    width: 13px;
    height: 13px;
    vertical-align: middle;
    margin-right: 2px;
    background: url("../../assets/images/icon_check.svg");
    background-size: cover;

    & ~ span {
      vertical-align: middle;
    }
  }

  &.zh-CN {
    table tbody tr td {
      height: 49px;
    }

    .left-part {
      .explain p {
        line-height: 18px;
        margin: 11px 0;
      }
    }

    .locale-free {
      table tbody tr td {
        height: 26px !important;
      }
    }

    .analysis-table {
      margin-bottom: 16px;
    }
  }

  // 中文
  table tbody tr td {
    height: 49px;
  }

  .left-part {
    .explain p {
      line-height: 18px;
      margin: 11px 0;
    }
  }
}

// 边框table
.thead-line {
  table {
    thead {
      tr {
        th {
          &:nth-of-type(1) {
            width: 136px;
          }
          &:nth-of-type(2) {
            border-left: 1px solid #009fe8;
          }

          &:nth-of-type(2),
          &:nth-of-type(3) {
            width: 139px;
            border-right: 1px solid #009fe8;
          }

          &:nth-of-type(4) {
            width: 139px;
            border-right: 1px solid #009fe8;
          }

          &:nth-of-type(5) {
            width: 0px;
          }

          &:nth-of-type(6) {
            width: 163px;
            // padding-left: 70px;
            text-align: center;
            // border-right: 1px solid #009fe8;
          }

          &:nth-of-type(7) {
            width: 141px;
            text-align: center;
            // padding-left: 22px;
          }
        }
      }
    }
    tbody{
      tr {
        td {
          &:nth-of-type(3){
            // padding-left: 70px;
          }
        }
      }
    }
  }
}
.limits {
  margin-left: 55px;
}
.contrast-item{
  margin-left: 42px !important;
}
.qr-code {
  margin-top: 20px;
  width: 30%;
}

.bm-report table tbody tr td[data-v-476d32b7]:first-of-type {
  padding: 0 0 0 8px !important;
}

.athlete-icon {
    width: 31px;
    height: 31px;
    position: relative;
    top: 8px;
}
</style>
