<!--
 * @Description: 身体成分报告
 * @Author: gaoyuanyuan
 * @Date: 2019-12-06 21:46:29
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-05-26 13:38:13
 -->
<template>
    <div class="bm-report" v-cloak>
        <!-- 右侧部分 -->
        <div class="right-part">
            <!-- 人体成分概览 -->
            <h2>人体成分概览</h2>
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
                            <td style="border-bottom-color: #f5f6fa;"></td>
                            <td style="border-bottom-color: #f5f6fa;"></td>
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
                            <td style="border-bottom-color: #f5f6fa;"></td>
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
            <h2>脂肪肌肉评估</h2>
            <div class="analysis-table thead-line default-grade-table" style="margin-bottom: 7px;">
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
                                <span v-if="WT" class="limits">[{{ toDecimal(WT.l, 1) }}~{{ toDecimal(WT.h, 1)
                                }}]</span>
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
                                <span v-if="SM" class="limits">[{{ toDecimal(SM.l, 1) }}~{{ toDecimal(SM.h, 1)
                                }}]</span>
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
                                <span v-if="BFM" class="limits">[{{ toDecimal(BFM.l, 1) }}~{{ toDecimal(BFM.h, 1)
                                }}]</span>
                            </td>
                            <td>
                                <contrast v-if="BFM" :val="BFM.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 肥胖分析 -->
            <h2>肥胖分析</h2>
            <div class="analysis-table thead-line default-grade-table" style="margin-bottom: 7px;">
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
                                <span v-if="PBF" class="limits">[{{ toDecimal(PBF.l, 1) }}~{{ toDecimal(PBF.h, 1)
                                }}]</span>
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
                                <span v-if="BMI" class="limits">[{{ toDecimal(BMI.l, 1) }}~{{ toDecimal(BMI.h, 1)
                                }}]</span>
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
                                <span v-if="WHR" class="limits">[{{ toDecimal(WHR.l, 1) }}~{{ toDecimal(WHR.h, 1)
                                }}]</span>
                            </td>
                            <td>
                                <contrast v-if="WHR" :val="WHR.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 基础代谢 -->
            <div class="analysis-table thead-line default-grade-table" style="margin-bottom: 7px;">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>低标准</th>
                            <th>标准</th>
                            <th>超标准</th>
                            <th></th>
                            <th>标准范围</th>
                            <th style="line-height: 15px;font-size: 11px">与上次对比</th>
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
                                <span v-if="BMR" class="limits">[{{ toDecimal(BMR.l, 1) }}~{{ toDecimal(BMR.h, 1)
                                }}]</span>
                            </td>
                            <td>
                                <contrast v-if="BMR" :val="BMR.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="analysis-table thead-line default-grade-table" style="margin-bottom: 7px;"
                :class="girthshow1 ? 'girthshow1class' : ''">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th :style="girthshow1 ? 'width: 450px' : 'width: 250px'">测量值</th>
                            <th :style="girthshow1 ? 'width: 290px' : 'width: 195px'">与上次对比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span class="name">代谢年龄</span>
                                <em>岁</em>
                            </td>
                            <td>
                                <span v-if="METABOLICAGE" class="limits"> {{ METABOLICAGE.v }}</span>
                            </td>
                            <td>
                                <contrast v-if="METABOLICAGE" :val="METABOLICAGE.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 内脏脂肪等级 -->
            <div class="analysis-table thead-line grade-table" style="margin-bottom: 11px;"
                :class="girthshow1 ? 'girthshow1class' : ''">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th :style="girthshow1 ? 'width:200px' : ''">低标准</th>
                            <th :style="girthshow1 ? 'width:235px' : ''">超标准</th>
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
                                <grade-progress v-if="vaGrade" :val="vaGrade.val" :low="1" :hight="10" :digit="1"
                                    :isvapro7="girthshow1 ? true : false"></grade-progress>
                            </td>
                            <td>
                                <span v-if="BMR" class="limits">[1.0~10.0]</span>
                            </td>
                            <td>
                                <contrast v-if="vaGrade" :val="vaGrade.diff"></contrast>
                            </td>
                        </tr>
                        <tr v-if="showVFA()">
                            <td>
                                <span class="name">内脏脂肪面积</span>
                                <em>cm²</em>
                            </td>
                            <td colspan="3">
                                <grade-progress v-if="VFA" :val="VFA.v" :low="VFA.l" :hight="VFA.h"
                                    :digit="1"></grade-progress>
                            </td>
                            <td>
                                <span v-if="VFA" class="limits">[{{ toDecimal(VFA.l, 1) }}~{{ toDecimal(VFA.h, 1)
                                }}]</span>
                            </td>
                            <td>
                                <contrast v-if="VFA" :val="VFA.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 细胞内外液 -->
            <div class="analysis-table thead-line default-grade-table" :class="girthshow1 ? 'girthshow1class' : ''">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th :style="girthshow1 ? 'width:140px' : ''">低标准</th>
                            <th :style="girthshow1 ? 'width:140px' : ''">标准</th>
                            <th :style="girthshow1 ? 'width:155px' : ''">超标准</th>
                            <th></th>
                            <th :style="girthshow1 ? 'width:80px' : ''">标准范围</th>
                            <th>与上次对比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span class="name">细胞内液</span>
                                <em>kg</em>
                            </td>
                            <td colspan="4">
                                <mass-progress v-if="ICW" :val="ICW.v" :low="ICW.l" :hight="ICW.h"
                                    :isM30="girthshow1 ? true : false"></mass-progress>
                            </td>
                            <td>
                                <span v-if="BMR" class="limits">[{{ toDecimal(ICW.l, 1) }}~{{ toDecimal(ICW.h, 1)
                                }}]</span>
                            </td>
                            <td>
                                <contrast v-if="ICW" :val="ICW.diff"></contrast>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="name">细胞外液</span>
                                <em>kg</em>
                            </td>
                            <td colspan="4">
                                <mass-progress v-if="ECW" :val="ECW.v" :low="ECW.l" :hight="ECW.h"
                                    :isM30="girthshow1 ? true : false"></mass-progress>
                            </td>
                            <td>
                                <span v-if="ECW" class="limits">[{{ toDecimal(ECW.l, 1) }}~{{ toDecimal(ECW.h, 1)
                                }}]</span>
                            </td>
                            <td>
                                <contrast v-if="ECW" :val="ECW.diff"></contrast>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="tips" :style="girthshow1 ? 'width: 150%' : ''">
                *细胞内/外液数据是判断健康状态的重要指标，当细胞外液超标准或细胞内液低标准时说明存在健康风险，需向专家咨询</p>
            <!-- 调节建议 -->
            <div class="adjust-table" :class="girthshow1 ? 'girthshow1class' : ''">
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
            <div class="trend-table">
                <mass-trend :memberId="reportInfo.memberId" :deviceId="reportInfo.deviceId"
                    :scanTime="reportInfo.scanTime" @load-mass-report="loadMassReport"></mass-trend>
            </div>
        </div>
        <!-- 左侧部分 -->
        <div class="left-part">
            <p class="message">{{ promptMessage }}</p>
            <span class="body-tip">*报告内容仅供参考，不作为诊断或医疗依据</span>
            <!-- 身体模型 -->
            <div class="body-model" v-if="!girthshow1">
                <h3>身体模型</h3>
                <div class="model">
                    <canvas ref="myCanvas" width="180" height="268" v-if="modelPath && isVAPro7()"></canvas>
                    <img v-else-if="modelPath && !isVAPro7()" @load="modelLoaded" :src="modelPath"
                        @error="imageLoadError" />
                    <img class="default" v-else-if="isGetImg" @load="modelLoaded"
                        src="@/assets/images/default_model.svg" />
                </div>
            </div>
            <!-- 体围测量 -->
            <div class="girth" v-if="!girthshow1">
                <h3>
                    体围测量
                    <span>cm</span>
                </h3>
                <p class="tips">
                    *为保证数据准确性，需穿着紧身衣服、扎起头发
                    <span>高精度</span>
                </p>
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>项目</th>
                            <th>本次</th>
                            <th>与上次对比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(girth, key) in girthData" :key="key">
                            <td>
                                <span class="name">{{ girth.name }}</span>
                            </td>
                            <td>
                                <span v-if="girth.val !== ''" class="val">{{ girth.val }}</span>
                                <span v-else class="val">--</span>
                            </td>
                            <td>
                                <span v-if="girth.diff !== ''" class="val">{{ girth.diff }}</span>
                                <span v-else class="val">--</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="segment" v-if="!girthshow1">
                <!-- 节段脂肪 -->
                <segment :type="1" v-if="bmSegBFM" :leftUp="bmSegBFM.BFMLA" :leftDown="bmSegBFM.BFMLL"
                    :center="bmSegBFM.BFMTR" :rightUp="bmSegBFM.BFMRA" :rightDown="bmSegBFM.BFMRL" :size="'014'">
                </segment>
                <!-- 节段肌肉 -->
                <segment :type="2" v-if="bmSegLM" :leftUp="bmSegLM.LMLA" :leftDown="bmSegLM.LMLL" :center="bmSegLM.LMTR"
                    :rightUp="bmSegLM.LMRA" :rightDown="bmSegLM.LMRL" :size="'014'"></segment>
            </div>
            <div class="segment2" v-else>
                <!-- 节段脂肪 -->
                <segment :type="1" v-if="bmSegBFM" :leftUp="bmSegBFM.BFMLA" :leftDown="bmSegBFM.BFMLL"
                    :center="bmSegBFM.BFMTR" :rightUp="bmSegBFM.BFMRA" :rightDown="bmSegBFM.BFMRL">
                </segment>
                <!-- 节段肌肉 -->
                <segment :type="2" v-if="bmSegLM" :leftUp="bmSegLM.LMLA" :leftDown="bmSegLM.LMLL" :center="bmSegLM.LMTR"
                    :rightUp="bmSegLM.LMRA" :rightDown="bmSegLM.LMRL"></segment>
            </div>
            <report-footer :scanId="reportInfo.scanId" :isvapro7="girthshow1 ? true : false"></report-footer>
        </div>
    </div>
</template>
<script>
import {
    bodyAdjustInfo,
    bmSegInfo,
    bmGirthContrastInfo,
    bmScanFileInfos,
    bodyState,
    bmMassContrastInfo,
    bmBdaPointInfos
} from '@/assets/js/apolloGql.js'

import { _toDecimal, _contrastVal } from '@/assets/js/util.js'
import { promptMessage } from '@/assets/js/config.js'
// 节段脂肪&肌肉
import Segment from '@/components/Segment'
// 体成分历史趋势
import MassTrend from '@/components/MassTrend'
// 体成分项进度条
import MassProgress from '@/components/MassProgress'
// 底部用户账号信息
import ReportFooter from '@/components/Footer'
import Contrast from '@/components/Contrast'
// 内脏脂肪进度条
import GradeProgress from '@/components/GradeProgress'

export default {
    name: 'BmReport',
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
        girthShowNumber: Number
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
            // 体成分正面模型图片文件
            modelPath: '',
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
                    name: '高腰围',
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
            massOver: 0,
            isGetImg: false,
            bodypoints: {}
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
        // 细胞内液
        ICW() {
            return this.massInfo['ICW']
        },
        // 细胞外液
        ECW() {
            return this.massInfo['ECW']
        },
        // 代谢年龄
        METABOLICAGE() {
            return this.massInfo['METABOLICAGE']
        },
        // 内脏脂肪等级
        VFA() {
            return this.massInfo['VFA']
        },
        girthshow1() {
            return this.girthShowNumber === 1
        }
    },
    created() {
        // BDA成功 获取正面图片&围度信息
        if (this.reportInfo.bmBdaStatus === 1) {
            console.log('BDA_SUCCESS>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<')
        } else {
            this.isGetImg = true
        }
        this.bmGirthContrastInfo()

        this.bmScanFileInfos()
        this.getBmMassContrastInfo()
        this.bodyAdjustInfo()
        this.bmSegInfo()
        this.getBodyState()
        if (this.girthshow1) {
            console.log('MASS_REPORT_OVER')
        }
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        // 体成分报告是否加载完成
        loadMassReport() {
            this.massOver++
            if (this.massOver === 2) {
                console.log('MASS_REPORT_OVER')
            }
        },
        calculateComparativeData(massInfo, oldMassInfo, key) {
            if (key === 'ICW' || key === 'ECW') {
                console.log(`当前数据${massInfo[key].l} ${massInfo[key].h} ${oldMassInfo[key].l} ${oldMassInfo[key].h}`)
                if ((massInfo[key].l === 0 && massInfo[key].h === 0) || (oldMassInfo[key].l === 0 && oldMassInfo[key].h === 0)) {
                    // 细胞内外液 如果没有上下限 认为和无细胞内外液数据在比较 直接返回空
                    return ''
                }
            }
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
        // 模型图片加载完成
        modelLoaded() {
            console.log('MASS_MODEL_OVER')
            this.loadMassReport()
        },
        imageLoadError() {
            this.modelPath = ''
            console.log('MASS_MODEL_LOAD_ERROR')
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
                                    if (massData[1] && massData[1][key] !== null) {
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
        // 围度数据
        async bmGirthContrastInfo() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bmGirthContrastInfo,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bmGirthContrastInfo
                    const girthData = info.data
                    if (info.code === 200 && girthData.length !== 0) {
                        this.girthData.forEach(girth => {
                            // 测量值
                            girth.val = this.toDecimal(girthData[0][girth.key], 1)
                            // 对比值
                            if (girthData[1] && girthData[1][girth.key]) {
                                const diff = _contrastVal(girthData[0][girth.key], girthData[1][girth.key])
                                girth.diff = diff
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 围度数据
        async bmBdaPointInfos() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bmBdaPointInfos,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bmBdaPointInfos
                    this.bodypoints = JSON.parse(JSON.stringify(info.data))
                    let keysToRemove = [
                        'leftUpperArmGirthPoint',
                        'rightUpperArmGirthPoint',
                        'bustGirthPoint',
                        'waistGirthPoint',
                        'hipGirthPoint',
                        'leftThighGirthPoint',
                        'rightThighGirthPoint',
                        'leftCalfGirthPoint',
                        'rightCalfGirthPoint'
                    ]

                    delete this.bodypoints.__typename
                    for (let key in this.bodypoints) {
                        if (typeof this.bodypoints[key] === 'string') {
                            this.bodypoints[key] = JSON.parse(this.bodypoints[key])
                        }
                    }
                    let newpoints = {}
                    keysToRemove.forEach(key => {
                        if (this.bodypoints.hasOwnProperty(key)) {
                            newpoints[key] = this.bodypoints[key]
                        }
                    })
                    this.bodypoints = newpoints
                    console.log(this.bodypoints, '><<<><<<>>')
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 体成分模型文件
        async bmScanFileInfos() {
            const userInfo = {
                scanId: this.reportInfo.scanId
            }
            await this.$apollo
                .query({
                    query: bmScanFileInfos,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bmScanFileInfos
                    const modelData = info.data
                    if (info.code === 200) {
                        this.isGetImg = true
                        modelData.forEach(model => {
                            // 获取体成分正面图片
                            if (model.fileType.id === 18) {
                                this.modelPath = model.filePath
                                if (this.isVAPro7()) {
                                    this.bmBdaPointInfos()
                                }
                                if (this.isVAPro7()) {
                                    setTimeout(() => {
                                        this.drawImage()
                                    }, 1000)
                                }
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 身体状态
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
        },
        isVAPro7() {
            // return true
            return this.reportInfo.scanId.slice(0, 2) === 'M7' || this.reportInfo.scanId.slice(0, 2) === 'N7'
        },
        showVFA() {
            if (!this.isVAPro7()) {
                return false
            } else {
                return this.VFA && (this.VFA.l !== 0 && this.VFA.h !== 0)
            }
        },
        drawImage() {
            if (!this.$refs.myCanvas) {
                console.error('Canvas元素未找到')
                return
            }
            const canvas = this.$refs.myCanvas
            const ctx = canvas.getContext('2d')

            // 创建一个新的Image对象
            const img = new Image()
            img.src = this.modelPath // 替换为你的图片路径

            img.onload = () => {
                // 将图片绘制到canvas上
                console.log('图片加载完成', img.width)
                console.log('>>>>>图片《《《《《', img.width, canvas.width, canvas.width / img.width, img.width * (canvas.width / img.width))
                const scaleFactor = parseFloat((canvas.width / img.width).toFixed(2))
                ctx.drawImage(img, 0, 0, 180, img.height * scaleFactor)
                console.log(this.bodypoints, '>>>>>>>>>>>>>>')
                // if (this.bodypoints.neckGirthPoint) {
                //     ctx.beginPath();
                //     let isFirstPoint = true;
                //     const points = this.bodypoints.neckGirthPoint.point_list
                //     for (let key in points) {
                //         if (points.hasOwnProperty(key)) {
                //             const point = points[key];
                //             if (isFirstPoint) {
                //                 ctx.moveTo(point.x * scaleFactor, point.y * scaleFactor);
                //                 isFirstPoint = false;
                //             } else {
                //                 ctx.lineTo(point.x * scaleFactor, point.y * scaleFactor);
                //             }
                //             // ctx.arc(point.x, point.y, 2, 0, Math.PI * 2); // 绘制点
                //         }
                //     }

                //     ctx.strokeStyle = '#FFFFFF';
                //     ctx.lineWidth = 1;
                //     ctx.stroke(); // 绘制曲线
                //     ctx.fillStyle = 'red';
                //     // ctx.fill(); // 填充点

                // }
                for (let part in this.bodypoints) {
                    if (this.bodypoints.hasOwnProperty(part)) {
                        console.log(`部位: ${part}`)
                        const { start, end } = this.bodypoints[part]
                        // 定义点的坐标和颜色
                        const points = [{ x: start.x * scaleFactor, y: start.y * scaleFactor }, { x: end.x * scaleFactor, y: end.y * scaleFactor }]
                        // const pointColor = 'red';

                        // 在图片上打点
                        points.forEach(point => {
                            ctx.beginPath()
                            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
                            // ctx.fillStyle = pointColor;
                            // ctx.fill();
                            ctx.closePath()
                        })

                        // 定义线的起点和终点
                        const lineStart = points[0]
                        const lineEnd = points[1]
                        const lineColor = '#FFFFFF'

                        // 在图片上画线
                        ctx.beginPath()
                        ctx.moveTo(lineStart.x, lineStart.y)
                        ctx.lineTo(lineEnd.x, lineEnd.y)
                        ctx.strokeStyle = lineColor
                        ctx.lineWidth = 1
                        ctx.stroke()
                        ctx.closePath()
                    }
                }

            }
        }
    }
}
</script>

<style scoped lang="less" media="all">
[v-cloak] {
    display: none;
}

.bm-report {
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 12px 0 16px 0;

    h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #333333;
        line-height: 32px;
    }

    h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #333333;
        line-height: 24px;

        span {
            font-size: 12px;
            font-family: OPPOSans-R;
            font-weight: normal;
            color: #666666;
            line-height: 16px;
        }

        &~.tips {
            margin-bottom: 9px;
        }
    }

    .tips {
        margin: 0;
        font-size: 12px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #9b9b9b;
        line-height: 18px;

        span {
            width: 44px;
            height: 16px;
            float: right;
            text-align: center;
            font-size: 12px;
            font-family: OPPOSans-R;
            font-weight: normal;
            color: #ffffff;
            line-height: 16px;
            background: #5698f5;
        }
    }

    .right-part {
        width: 565px;

        h2 {
            display: flex;
        }
    }

    .left-part {
        width: 267px;

        .message {
            margin: 0;
            margin-top: -9px;
            text-align: end;
            font-size: 12px;
            font-weight: 400;
            color: #9B9B9B;
        }
    }

    .body-table {
        position: relative;
        margin-bottom: 10px;

        .extra-bone {
            position: absolute;
            z-index: 1;
            width: 100%;
            bottom: 0;
            margin: 0;
            color: #5e687b;
            text-align: start;
            text-indent: 14px;
            font-size: 8px;

            &:after {
                position: absolute;
                display: block;
                content: '';
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

    .trend-table {
        position: relative;
        top: -12px;
    }

    .grade-table {
        table {
            thead {
                tr {
                    th:nth-of-type(1) {
                        width: 126px;
                    }

                    th:nth-of-type(2) {
                        width: 122px;
                    }

                    th:nth-of-type(3) {
                        width: 122px;
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

    .default-grade-table {
        table {
            thead {
                tr {
                    height: 19px;

                    th:nth-of-type(1) {
                        width: 126px;
                    }

                    th:nth-of-type(5) {
                        width: 40px;
                        // border-right: none;
                        // border-right: 1px solid #009fe8;
                    }

                }
            }
        }
    }

    .analysis-table {
        table {
            table-layout: auto;
        }

    }

    .body-tip {
        height: 32px;
        line-height: 20px;
        color: #9B9B9B;
        font-size: 12px;
        float: right;
    }

    // 身体模型
    .body-model {
        margin-top: 37px;

        .model {
            display: flex;
            justify-content: center;
            position: relative;
            margin-top: 27px;
            height: 268px;
            text-align: center;
            background: url('../../assets/images/model_bg.svg');
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
            font-family: OPPOSans-R;
        }
    }

    // 节段
    .segment {
        margin: 38px 0 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 300px;
    }

    .segment2 {
        margin: 37px 0 20px;
    }

    .icon-warn {
        display: inline-block;
        width: 13px;
        height: 13px;
        vertical-align: middle;
        margin-right: 2px;
        background: url('../../assets/images/icon_warn.svg');
        background-size: cover;

        &~span {
            vertical-align: middle;
        }
    }

    .icon-check {
        display: inline-block;
        width: 13px;
        height: 13px;
        vertical-align: middle;
        margin-right: 2px;
        background: url('../../assets/images/icon_check.svg');
        background-size: cover;

        &~span {
            vertical-align: middle;
        }
    }
}

.girthshow1class {
    width: 150%;
}
</style>
