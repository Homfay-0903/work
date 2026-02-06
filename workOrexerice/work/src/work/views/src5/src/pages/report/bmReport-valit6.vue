<!--
 * @Description: 身体成分报告 (VALit6)
 * @Author: gaoyuanyuan
 * @Date: 2019-12-06 21:46:29
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2026-02-01 16:55:16
 -->
<template>
    <div>
        <div class="bm-report" v-cloak>
            <!-- 右侧部分 -->
            <div :class="isTangCenBei?'right-part1':'right-part' ">
                <!-- 人体成分概览 -->
                <h2 :class="[!isTangCenBei ? 'low-h2' : '']" :style="isTangCenBei?'margin:0 0 5px':''">人体成分概览</h2>
                <div class="body-table tbody-line">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>测量值</th>
                                <th>体脂肪</th>
                                <th>无机盐</th>
                                <th>蛋白质</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">体重</span>
                                    <em>kg</em>
                                </td>
                                <!-- 体重 -->
                                <td>
                                    <template v-if="WT">
                                        <span class="val">{{ toDecimal(WT.v, 1) }}</span>
                                        <span class="limits">[{{ toDecimal(WT.l, 1) }}~{{ toDecimal(WT.h, 1) }}]</span>
                                    </template>
                                </td>
                                <!-- 体脂肪 -->
                                <td>
                                    <template v-if="BFM">
                                        <span class="val">{{ toDecimal(BFM.v, 1) }}</span>
                                        <span class="limits">[{{ toDecimal(BFM.l, 1) }}~{{ toDecimal(BFM.h, 1) }}]</span>
                                    </template>
                                </td>
                                <td style="border-bottom: 1px solid #fff;"></td>
                                <td style="border-bottom: 1px solid #fff;"></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">去脂体重</span>
                                    <em>kg</em>
                                </td>
                                <!-- 去脂体重 -->
                                <td>
                                    <template v-if="FFM">
                                        <span class="val">{{ toDecimal(FFM.v, 1) }}</span>
                                        <span class="limits">[{{ toDecimal(FFM.l, 1) }}~{{ toDecimal(FFM.h, 1) }}]</span>
                                    </template>
                                </td>
                                <!-- 无机盐 -->
                                <td colspan="2" style="text-align: end; padding-right: 9px;">
                                    <template v-if="TM">
                                        <span class="val">{{ toDecimal(TM.v, 1) }}</span>
                                        <span class="limits">[{{ toDecimal(TM.l, 1) }}~{{ toDecimal(TM.h, 1) }}]</span>
                                    </template>
                                    <p class="extra-bone">骨外含量</p>
                                </td>
                                <td style="border-bottom: 1px solid #fff;"></td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">肌肉量</span>
                                    <em>kg</em>
                                </td>
                                <!-- 肌肉量 -->
                                <td>
                                    <template v-if="LM">
                                        <span class="val">{{ toDecimal(LM.v, 1) }}</span>
                                        <span class="limits">[{{ toDecimal(LM.l, 1) }}~{{ toDecimal(LM.h, 1) }}]</span>
                                    </template>
                                </td>
                                <!-- 蛋白质 -->
                                <td colspan="3" style="text-align: end; padding-right: 18px;">
                                    <template v-if="PROTEIN">
                                        <span class="val">{{ toDecimal(PROTEIN.v, 1) }}</span>
                                        <span class="limits">[{{ toDecimal(PROTEIN.l, 1) }}~{{ toDecimal(PROTEIN.h, 1)
                                        }}]</span>
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">总水分</span>
                                    <em>kg</em>
                                </td>
                                <!-- 总水分 -->
                                <td>
                                    <template v-if="TBW">
                                        <span class="val">{{ toDecimal(TBW.v, 1) }}</span>
                                        <span class="limits">[{{ toDecimal(TBW.l, 1) }}~{{ toDecimal(TBW.h, 1) }}]</span>
                                    </template>
                                </td>
                                <td colspan="3"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 脂肪肌肉评估 -->
                <h2 :class="[!isTangCenBei ? 'low-h2' : '']">脂肪肌肉评估</h2>
                <div class="analysis-table thead-line" style="margin-bottom: 10px;">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>低标准</th>
                                <th>标准</th>
                                <th>超标准</th>
                                <th></th>
                                <th>标准范围</th>
                                <th>与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">体重</span>
                                    <em>kg</em>
                                </td>
                                <td colspan="4">
                                    <mass-progress v-if="WT" :val="WT.v" :low="WT.l" :hight="WT.h"></mass-progress>
                                </td>
                                <td>
                                    <span v-if="WT" class="limits">[{{ toDecimal(WT.l, 1) }}~{{ toDecimal(WT.h, 1) }}]</span>
                                </td>
                                <td>
                                    <contrast v-if="WT" :val="WT.diff"></contrast>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">骨骼肌</span>
                                    <em>kg</em>
                                </td>
                                <td colspan="4">
                                    <mass-progress v-if="SM" :val="SM.v" :low="SM.l" :hight="SM.h"></mass-progress>
                                </td>
                                <td>
                                    <span v-if="SM" class="limits">[{{ toDecimal(SM.l, 1) }}~{{ toDecimal(SM.h, 1) }}]</span>
                                </td>
                                <td>
                                    <contrast v-if="SM" :val="SM.diff"></contrast>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">体脂肪</span>
                                    <em>kg</em>
                                </td>
                                <td colspan="4">
                                    <mass-progress v-if="BFM" :val="BFM.v" :low="BFM.l" :hight="BFM.h"></mass-progress>
                                </td>
                                <td>
                                    <span v-if="BFM" class="limits">[{{ toDecimal(BFM.l, 1) }}~{{ toDecimal(BFM.h, 1) }}]</span>
                                </td>
                                <td>
                                    <contrast v-if="BFM" :val="BFM.diff"></contrast>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 肥胖分析 -->
                <h2 :class="[!isTangCenBei ? 'low-h2' : '']">肥胖分析</h2>
                <div class="analysis-table thead-line" :style="marginBottomCalculation">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>低标准</th>
                                <th>标准</th>
                                <th>超标准</th>
                                <th></th>
                                <th>标准范围</th>
                                <th>与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">体脂率</span>
                                    <em>%</em>
                                </td>
                                <td colspan="4">
                                    <mass-progress v-if="PBF" :val="PBF.v" :low="PBF.l" :hight="PBF.h"></mass-progress>
                                </td>
                                <td>
                                    <span v-if="PBF" class="limits">[{{ toDecimal(PBF.l, 1) }}~{{ toDecimal(PBF.h, 1) }}]</span>
                                </td>
                                <td>
                                    <contrast v-if="PBF" :val="PBF.diff"></contrast>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">BMI</span>
                                    <em>kg/m²</em>
                                </td>
                                <td colspan="4">
                                    <mass-progress v-if="BMI" :val="BMI.v" :low="BMI.l" :hight="BMI.h"></mass-progress>
                                </td>
                                <td>
                                    <span v-if="BMI" class="limits">[{{ toDecimal(BMI.l, 1) }}~{{ toDecimal(BMI.h, 1) }}]</span>
                                </td>
                                <td>
                                    <contrast v-if="BMI" :val="BMI.diff"></contrast>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">腰臀比</span>
                                </td>
                                <td colspan="4">
                                    <mass-progress v-if="WHR" :val="WHR.v" :low="WHR.l" :hight="WHR.h"
                                        :digit="2"></mass-progress>
                                </td>
                                <td>
                                    <span v-if="WHR" class="limits">[{{ toDecimal(WHR.l, 1) }}~{{ toDecimal(WHR.h, 1) }}]</span>
                                </td>
                                <td>
                                    <contrast v-if="WHR" :val="WHR.diff"></contrast>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 基础代谢 -->
                <div v-if="!isTangCenBei" class="analysis-table thead-line" :style="marginBottomCalculation">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>低标准</th>
                                <th>标准</th>
                                <th>超标准</th>
                                <th></th>
                                <th>标准范围</th>
                                <th>与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">基础代谢</span>
                                    <em>kcal/d</em>
                                </td>
                                <td colspan="4">
                                    <mass-progress v-if="BMR" :val="BMR.v" :low="BMR.l" :hight="BMR.h"></mass-progress>
                                </td>
                                <td>
                                    <span v-if="BMR" class="limits">[{{ toDecimal(BMR.l, 1) }}~{{ toDecimal(BMR.h, 1) }}]</span>
                                </td>
                                <td>
                                    <contrast class="bmr-contrast-item" v-if="BMR" :val="BMR.diff"></contrast>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 代谢年龄 -->
                <div v-if="showMetabolicAge && !isTangCenBei" class="analysis-table thead-line age-table" :style="marginBottomCalculation">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>测量值</th>
                                <th>与上次对比</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">代谢年龄</span>
                                    <em>岁</em>
                                </td>
                                <td>
                                    <span v-if="METABOLICAGE" class="age-value"> {{ METABOLICAGE.v }}</span>
                                </td>
                                <td>
                                    <contrast class="metabolic-age-contrast-item" v-if="METABOLICAGE" :val="METABOLICAGE.diff"></contrast>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 内脏脂肪等级 -->
                <div v-if="!isTangCenBei" class="analysis-table thead-line grade-table" :style="marginBottomCalculation">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>标准</th>
                                <th>超标准</th>
                                <th></th>
                                <th>标准范围</th>
                                <th>与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">内脏脂肪等级</span>
                                </td>
                                <td colspan="3">
                                    <grade-progress v-if="vaGrade" :val="vaGrade.val" :low="1" :hight="10"
                                        :digit="1"></grade-progress>
                                </td>
                                <td>
                                    <span v-if="BMR" class="limits">[1.0~10.0]</span>
                                </td>
                                <td>
                                    <contrast v-if="vaGrade" :val="vaGrade.diff"></contrast>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 调节建议 -->
                <div class="adjust-table" v-if="!isTangCenBei">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>测量值</th>
                                <th>肥胖评估</th>
                                <th>黄金比例</th>
                                <th>调节量</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">体重</span>
                                    <em>kg</em>
                                </td>
                                <td>
                                    <div class="status-item" v-if="WT">
                                        <span class="val">{{ toDecimal(WT.v, 1) }}</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="status" v-if="WT">
                                        <i :class="[WT.status === 2 ? 'icon-check' : 'icon-warn']"></i>
                                        <span>{{ WT.status === 1 ? '不足' : WT.status === 2 ? '标准' : '过量' }}</span>
                                    </span>
                                </td>
                                <td>
                                    <span v-if="WT && adjustData" class="val">{{ toDecimal(WT.v + adjustData.weight, 1)
                                    }}</span>
                                </td>
                                <td>
                                    <span v-if="adjustData" class="val">{{ adjustData.weight > 0 ? '+' : '' }}{{
                                        toDecimal(adjustData.weight, 1) }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">体脂肪</span>
                                    <em>kg</em>
                                </td>
                                <td>
                                    <div class="status-item" v-if="BFM">
                                        <span class="val">{{ toDecimal(BFM.v, 1) }}</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="status" v-if="BFM">
                                        <i :class="[BFM.status === 2 ? 'icon-check' : 'icon-warn']"></i>
                                        <span>{{ BFM.status === 1 ? '不足' : BFM.status === 2 ? '标准' : '过量' }}</span>
                                    </span>
                                </td>
                                <td>
                                    <span v-if="BFM && adjustData" class="val">{{ toDecimal(BFM.v + adjustData.bodyFat, 1)
                                    }}</span>
                                </td>
                                <td>
                                    <span v-if="adjustData" class="val">{{ adjustData.bodyFat > 0 ? '+' : '' }}{{
                                        toDecimal(adjustData.bodyFat, 1) }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">肌肉量</span>
                                    <em>kg</em>
                                </td>
                                <td>
                                    <div class="status-item" v-if="LM">
                                        <span class="val">{{ toDecimal(LM.v, 1) }}</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="status" v-if="LM">
                                        <i :class="[LM.status === 2 ? 'icon-check' : 'icon-warn']"></i>
                                        <span>{{ LM.status === 1 ? '不足' : LM.status === 2 ? '标准' : '过量' }}</span>
                                    </span>
                                </td>
                                <td>
                                    <span v-if="LM && adjustData" class="val">{{ toDecimal(LM.v + adjustData.muscle, 1)
                                    }}</span>
                                </td>
                                <td>
                                    <span v-if="adjustData" class="val">{{ adjustData.muscle > 0 ? '+' : '' }}{{
                                        toDecimal(adjustData.muscle, 1) }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 历史趋势 -->
                <div v-if="!isTangCenBei" class="trend-table">
                    <mass-trend :memberId="reportInfo.memberId" :deviceId="reportInfo.deviceId" :scanTime="reportInfo.scanTime"
                        @load-mass-report="loadMassReport"></mass-trend>
                </div>
            </div>
            <!-- 左侧部分 -->
            <div class="left-part">
                <p class="message">{{ promptMessage }}</p>
                <div class="segment">
                    <!-- 节段脂肪 -->
                    <segment :type="1" v-if="bmSegBFM" :leftUp="bmSegBFM.BFMLA" :leftDown="bmSegBFM.BFMLL"
                        :center="bmSegBFM.BFMTR" :rightUp="bmSegBFM.BFMRA" :rightDown="bmSegBFM.BFMRL"></segment>
                    <!-- 节段肌肉 -->
                    <segment :type="2" v-if="bmSegLM" :leftUp="bmSegLM.LMLA" :leftDown="bmSegLM.LMLL" :center="bmSegLM.LMTR"
                        :rightUp="bmSegLM.LMRA" :rightDown="bmSegLM.LMRL"></segment>
                    <div class="explain" v-if="!isTangCenBei">
                        <p>
                            <span>人体成分分析：</span>人体是由体水分、蛋白质、无机盐和体脂肪组成，4种成份之和为体重。维持身体成份均衡可以保持健康状态。
                        </p>
                        <p>
                            <span>脂肪肌肉评估：</span>比较骨骼肌含量与体脂肪含量的横条长度，当骨骼肌含量的横条比体脂肪含量的横条长时，为理想的健康状态。
                        </p>
                        <p>
                            <span>肥胖分析：</span>身体质量指数(BMI)是使用身高和体重来判断身体形态肥胖的指标。体脂百分比是体脂肪在体重当中占的比例，可判断真正的肥胖。两组数据对比结合可更有效更准确地评估肥胖信息。
                        </p>
                        <p>
                            <span>节段脂肪：</span>分析身体各部位脂肪含量的项目。尽量保持各节段脂肪为“正常”的状态，“超标准”是指相应部位脂肪量过多，需进行管理，减少此部位的脂肪量。
                        </p>
                        <p>
                            <span>节段肌肉：</span>分析身体各部位肌肉含量的项目。尽量保持各节段肌肉为“正常”或“超标准”的状态，同时请确认上下肢，左右肢是否均衡。
                        </p>
                    </div>
                </div>
                <report-footer v-if="!isTangCenBei" :scanId="reportInfo.scanId"></report-footer>
            </div>
        </div>
        <div v-if="isTangCenBei" class="isTangCenBei">
             <!-- 基础代谢 -->
            <div class="analysis-table thead-line bash-table" :style="marginBottomCalculation">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>低标准</th>
                            <th>标准</th>
                            <th>超标准</th>
                            <th></th>
                            <th>标准范围</th>
                            <th>与上次对比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span class="name">基础代谢</span>
                                <em>kcal/d</em>
                            </td>
                            <td colspan="4">
                                <mass-progress v-if="BMR" :isTangCenBei="isTangCenBei" :val="BMR.v" :low="BMR.l" :hight="BMR.h"></mass-progress>
                            </td>
                            <td>
                                <span v-if="BMR" class="limits">[{{ toDecimal(BMR.l, 1) }}~{{ toDecimal(BMR.h, 1) }}]</span>
                            </td>
                            <td>
                                <contrast v-if="BMR" :val="BMR.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 代谢年龄 -->
            <!-- <div v-if="showMetabolicAge" class="analysis-table thead-line age-table" :style="marginBottomCalculation">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>测量值</th>
                                <th>与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="name">代谢年龄</span>
                                    <em>岁</em>
                                </td>
                                <td>
                                    <span v-if="METABOLICAGE" class="age-value"> {{ METABOLICAGE.v }}</span>
                                </td>
                                <td>
                                    <contrast v-if="METABOLICAGE" :val="METABOLICAGE.diff"></contrast>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> -->
            <!-- 内脏脂肪等级 -->
            <div class="analysis-table thead-line grade-table" :style="marginBottomCalculation">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>标准</th>
                            <th>超标准</th>
                            <th></th>
                            <th>标准范围</th>
                            <th>与上次对比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span class="name">内脏脂肪等级</span>
                            </td>
                            <td colspan="3">
                                <grade-progress v-if="vaGrade" :isTangCenBei="isTangCenBei" :val="vaGrade.val" :low="1" :hight="10"
                                    :digit="1"></grade-progress>
                            </td>
                            <td>
                                <span v-if="BMR" class="limits">[1.0~10.0]</span>
                            </td>
                            <td>
                                <contrast v-if="vaGrade" :val="vaGrade.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 历史趋势 -->
            <div class="trend-table">
                <mass-trend :memberId="reportInfo.memberId" :isTangCenBei="isTangCenBei" :deviceId="reportInfo.deviceId" :scanTime="reportInfo.scanTime"
                    @load-mass-report="loadMassReport"></mass-trend>
            </div>
        </div>

        <p v-if="isTangCenBei" class="bm-Bei">*以上数据来源于仪器分析，仅供参考，如需进一步了解，请咨询医生或药师。</p>
    </div>
</template>
<script>
import { bodyAdjustInfo, bmSegInfo, bodyState, bmMassContrastInfo } from '@/assets/js/apolloGql.js'
import { _toDecimal } from '@/assets/js/util.js'
import { promptMessage } from '@/assets/js/config.js'
// 节段脂肪&肌肉
import Segment from '@/components/Segment'
// 体成分历史趋势
import MassTrend from '@/components/MassTrend'
// 体成分项进度条
import MassProgress from '@/components/MassProgress'
// 内脏脂肪进度条
import GradeProgress from '@/components/GradeProgress'
// 底部用户账号信息
import ReportFooter from '@/components/Footer'
import Contrast from '@/components/Contrast'

export default {
    name: 'BmReportValit6',
    components: {
        Segment,
        Contrast,
        MassTrend,
        MassProgress,
        GradeProgress,
        ReportFooter
    },
    props: {
        reportInfo: Object,
        memberInfo: Object,
        isTangCenBei: {
            type: Boolean,
            default: true
        }
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
                BFMLL: {}
            },
            // 节段肌肉
            bmSegLM: {
                LMTR: {},
                LMRA: {},
                LMLA: {},
                LMRL: {},
                LMLL: {}
            },
            // 内脏脂肪等级
            vaGrade: {
                val: 0,
                diff: ''
            },
            // 围度数据
            girthData: [
                {
                    name: '左上臂',
                    key: 'leftUpperArmGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '右上臂',
                    key: 'rightUpperArmGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '胸围',
                    key: 'bustGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '腰围',
                    key: 'waistGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '臀围',
                    key: 'hipGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '左大腿',
                    key: 'leftThighGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '右大腿',
                    key: 'rightThighGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '左小腿',
                    key: 'leftCalfGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '右小腿',
                    key: 'rightCalfGirth',
                    val: '',
                    diff: ''
                }
            ],
            // 体成分信息
            massInfo: {},
            massOver: 0
        }
    },
    computed: {
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
        // 代谢年龄
        METABOLICAGE() {
            return this.massInfo['METABOLICAGE']
        },
        showMetabolicAge() {
            // 仅pro3 pro5显示
            const sns = ['34', '36', '50', '51', '52', '54', 'M3', 'N3']
            const sn = this.reportInfo.scanId.substring(0, 2)
            return sns.indexOf(sn) > -1 && this.METABOLICAGE.v > 0
        },
        marginBottomCalculation() {
            if (!this.isTangCenBei) {
                return { 'margin-bottom': '10px' }
            }
            return { 'margin-bottom': '24px' }
        }
    },
    created() {
        this.getBmMassContrastInfo()
        this.bodyAdjustInfo()
        this.bmSegInfo()
        this.getBodyState()
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
        calculateComparativeData(massInfo, oldMassInfo, key) {
            if (key === 'METABOLICAGE') {
                if (massInfo[key].v === 0 || oldMassInfo[key].v === 0) {
                    // 代谢年龄有一个为0则不显示 对比值
                    return ''
                }
            }
            const diff = massInfo[key].v - oldMassInfo[key].v
            // 腰臀比保留2位 其他保留1位
            const digit = key === 'WHR' ? 2 : 1

            const result = this.toDecimal(diff, digit)
            return result
        },
        // 体成分数据及对比
        async getBmMassContrastInfo() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bmMassContrastInfo,
                    variables: userInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.bmMassContrastInfo
                    const massData = info.data
                    if (info.code === 200 && massData.length !== 0) {
                        let massInfo = JSON.parse(JSON.stringify(massData[0]))
                        for (let key in massInfo) {
                            if (Object.prototype.hasOwnProperty.call(massInfo, key)) {
                                if (typeof massInfo[key] === 'object') {
                                    // 有对比值
                                    if (massData[1] && massData[1][key] !== '') {
                                        massInfo[key].diff = this.calculateComparativeData(massInfo, massData[1], key)
                                    } else {
                                        massInfo[key].diff = ''
                                    }
                                }
                            }
                        }
                        this.massInfo = massInfo
                    }
                })
        },
        // 身体调节数据
        async bodyAdjustInfo() {
            const userInfo = {
                scanId: this.reportInfo.scanId
            }
            await this.$apollo
                .query({
                    query: bodyAdjustInfo,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bodyAdjustInfo
                    if (info.code === 200) {
                        this.adjustData = info.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 节段数据
        async bmSegInfo() {
            const userInfo = {
                scanId: this.reportInfo.scanId
            }
            await this.$apollo
                .query({
                    query: bmSegInfo,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bmSegInfo
                    const segData = info.data
                    if (info.code === 200) {
                        this.bmSegBFM = segData.bmSegBFM
                        this.bmSegLM = segData.bmSegLM
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 身体状态数据
        async getBodyState() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bodyState,
                    variables: userInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.bodyState
                    const bodyState = info.data
                    if (info.code === 200) {
                        this.vaGrade.val = bodyState[0].vaGrade
                        if (bodyState[1]) {
                            const diff = bodyState[0].vaGrade - bodyState[1].vaGrade
                            this.vaGrade.diff = diff
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
.bm-report {
    display: flex;
    .right-part {
        flex: 1;
        margin-right: 12px;
        h2 {
            margin: 0 0 12px;
            font-size: 16px;
            font-family: OPPOSans M;
            font-weight: normal;
            color: #333333;
            line-height: 22px;
        }
        .low-h2 {
            margin: 0 0 8px;
        }
        .body-table {
            margin-bottom: 17px;
            table {
                thead {
                    tr {
                        th {
                            &:nth-of-type(2) {
                                width: 106px;
                            }
                            &:nth-of-type(3) {
                                width: 106px;
                            }
                            &:nth-of-type(4) {
                                width: 106px;
                            }
                            &:nth-of-type(5) {
                                width: 106px;
                            }
                        }
                    }
                }
                tbody {
                    tr {
                        &:nth-of-type(1) {
                            td {
                                &:nth-of-type(3) {
                                    border-right-color: #009fe8;
                                }
                            }
                        }
                        &:nth-of-type(2) {
                            td {
                                &:nth-of-type(3) {
                                    border-right-color: #009fe8;
                                }
                                &:nth-of-type(4) {
                                    border-right-color: #009fe8;
                                }
                            }
                        }
                    }
                }
            }
        }
        .analysis-table {
            margin-bottom: 10px;
            table {
                thead {
                    tr {
                        th {
                            &:nth-of-type(2) {
                                width: 81px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(3) {
                                width: 81px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(4) {
                                width: 81px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(5) {
                                width: 42px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(6) {
                                width: 72px;
                                border-left: 1px solid #009fe8;
                                text-align: left;
                            }
                            &:nth-of-type(7) {
                                width: 65px;
                                border-left: 1px solid #009fe8;
                            }
                        }
                    }
                }
                tbody {
                    tr {
                        td {
                            &:nth-of-type(1) {
                                width: 112px;
                            }
                        }
                    }
                }
            }
        }
        .age-table,
        .grade-table {
            table {
                thead {
                    tr {
                        th {
                            &:nth-of-type(2) {
                                width: 162px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(3) {
                                width: 65px;
                                border-left: 1px solid #009fe8;
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
                        th {
                            &:nth-of-type(2) {
                                width: 142px;
                            }
                            &:nth-of-type(3) {
                                width: 142px;
                            }
                            &:nth-of-type(4) {
                                width: 42px;
                            }
                        }
                    }
                }
            }
        }
        .adjust-table {
            margin-bottom: 18px;
            table {
                thead {
                    tr {
                        th {
                            &:nth-of-type(2) {
                                width: 100px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(3) {
                                width: 100px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(4) {
                                width: 100px;
                                border-left: 1px solid #009fe8;
                            }
                            &:nth-of-type(5) {
                                width: 100px;
                                border-left: 1px solid #009fe8;
                            }
                        }
                    }
                }
                tbody {
                    tr {
                        td {
                            &:nth-of-type(1) {
                                width: 112px;
                            }
                        }
                    }
                }
            }
        }
        .trend-table {
            margin-top: 18px;
        }
    }
    .right-part1 {
        width: 650px;
        margin-right: 12px;
        h2 {
            margin: 0 0 12px;
            font-size: 16px;
            font-family: OPPOSans M;
            font-weight: normal;
            color: #333333;
            line-height: 22px;
        }
        .analysis-table {
            margin-bottom: 17px;
            .bash-table {
                margin-bottom: 15px !important;
            }
        }
        .trend-table {
            margin-top: 40px;
        }
    }
    .left-part {
        width: 255px;
        .message {
            margin: 0 0 16px;
            padding: 9px 11px;
            font-size: 12px;
            font-family: OPPOSans R;
            font-weight: normal;
            color: #666666;
            line-height: 17px;
            background: #f2f8ff;
        }
        .segment {
            margin: 30px 0 20px;
            .explain {
                width: 100%;
                font-size: 12px;
                font-family: OPPOSans R;
                font-weight: normal;
                color: #999999;
                line-height: 17px;
                p {
                    margin: 0 0 8px;
                    span {
                        color: #333333;
                    }
                }
            }
        }
    }
}
.isTangCenBei {
    padding: 0 10px;
    .analysis-table {
        margin-bottom: 17px;
        table {
            thead {
                tr {
                    th {
                        &:nth-of-type(2) {
                            width: 81px;
                            border-left: 1px solid #009fe8;
                        }
                        &:nth-of-type(3) {
                            width: 81px;
                            border-left: 1px solid #009fe8;
                        }
                        &:nth-of-type(4) {
                            width: 81px;
                            border-left: 1px solid #009fe8;
                        }
                        &:nth-of-type(5) {
                            width: 42px;
                            border-left: 1px solid #009fe8;
                        }
                        &:nth-of-type(6) {
                            width: 72px;
                            border-left: 1px solid #009fe8;
                            text-align: left;
                        }
                        &:nth-of-type(7) {
                            width: 65px;
                            border-left: 1px solid #009fe8;
                        }
                    }
                }
            }
        }
        .bash-table {
            margin-bottom: 15px !important;
        }
    }
    .trend-table {
        margin-top: 40px;
    }
}
.bm-Bei {
    margin-top: 10px;
    padding-left: 20px;
    font-size: 12px;
    font-family: OPPOSans R;
    font-weight: normal;
    color: #999999;
    line-height: 17px;
}
</style>
