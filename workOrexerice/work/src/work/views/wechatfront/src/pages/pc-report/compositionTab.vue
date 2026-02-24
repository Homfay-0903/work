<template>
    <div class="pc-report">
        <div class="summary" v-loading="scoreLoading">
            <div class="summary-left">
                <div class="score-chart">
                    <ScoreChart :value="bodyScore.massScore" />
                </div>
                <div class="summary-left-content">
                    <div class="summary-left-content-title">本次测量得分</div>
                    <div class="summary-left-content-time">
                        <img src="@/assets/images/pc-report/time.png" />
                        <span>{{ measureTime || '--' }}</span>
                    </div>
                    <!-- <div class="summary-left-content-desc">*身体成分分数规则已于{{ scoreUpdateDate || '--' }}更新</div> -->
                </div>
            </div>
            <div class="summary-right" v-if="scoreType === 1 ? bodyScore.massConScore : bodyScore.evalConScore">
                <span>与上次得分对比</span>
                <img v-if="bodyScore.massScore - bodyScore.massConScore >= 0"
                    src="@/assets/images/pc-report/icona6.png" style="filter: brightness(0) saturate(100%) invert(47%) sepia(67%) saturate(1857%) hue-rotate(334deg) brightness(95%) contrast(88%);" />
                <img v-else src="@/assets/images/pc-report/icona4.png" style="filter: brightness(0) saturate(100%) invert(47%) sepia(67%) saturate(1857%) hue-rotate(334deg) brightness(95%) contrast(88%);" />
                <span>{{ Math.abs(bodyScore.massScore - bodyScore.massConScore) }}</span>
            </div>
        </div>

        <!-- 人体成分概览 -->
        <div class="title">
            <div class="title-left">
                <img src="@/assets/images/pc-report/icon5.png" />
                <span>人体成分概览</span>
            </div>
            <div class="title-right" @click="openHelpDialog('composition')">
                <img src="@/assets/images/pc-report/icon6.png" />
            </div>
        </div>
        <div class="card-list">
            <!-- 骨架屏 -->
            <template v-if="quotaLoading">
                <div class="card1 skeleton-card" v-for="n in 8" :key="'skeleton-overview-' + n">
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-value"></div>
                    <div class="skeleton-line skeleton-range"></div>
                </div>
            </template>
            <!-- 真实数据 -->
            <template v-else>
                <div class="card1" v-for="item in compositionOverviewList" :key="item.id">
                    <div class="card1-top">
                        <span>{{ item.title }}</span>
                        <img :src="require(`@/assets/images/pc-report/${item.icon}`)" />
                    </div>
                    <div class="card1-content">
                        <div class="card1-content-value">
                            <div class="card1-content-value-left">
                                <span>{{ item.value }}</span>
                                <span>{{ item.unit }}</span>
                            </div>
                            <div class="card1-content-value-right" v-if="item.showdiffIcon">
                                <img v-if="item.diffDirection === 'up'" src="@/assets/images/pc-report/icona6.png" />
                                <img v-else-if="item.diffDirection === 'equal'" src="@/assets/images/pc-report/icona5.png" />
                                <img v-else src="@/assets/images/pc-report/icona4.png" />
                                <span v-if="item.diffDirection === 'equal' && item.dataColumn === 'METABOLICAGE'">0.0</span>
                                <span v-else-if="item.diffDirection === 'equal' && item.dataColumn === 'vaGrade'">0.00</span>
                                <span v-else>{{ item.diffValue }}</span>
                            </div>
                        </div>
                        <img v-if="item.showchartIcon" src="@/assets/images/pc-report/icon8.png" @click="handleCardClick(item)" />
                    </div>
                    <div class="card1-bottom" v-if="item.showrange">
                        <span>[{{ item.range }}]</span>
                        <div class="card1-bottom-tag" :class="`card1-bottom-tag-${item.tagType}`">{{ item.tagText }}</div>
                    </div>
                </div>
            </template>
        </div>

        <!-- 趋势弹窗 -->
        <transition name="dialog-fade">
            <div class="trend-dialog-overlay" v-if="showTrendDialog" @click="closeTrendDialog" @wheel.prevent @touchmove.prevent @scroll.prevent>
                <transition name="dialog-zoom">
                    <div class="trend-dialog" v-if="showTrendDialog" @click.stop @wheel.stop @touchmove.stop @scroll.stop>
                        <div class="trend-dialog-header">
                            <div class="trend-dialog-title">
                                <img src="@/assets/images/pc-report/dialog_icon.png" />
                                <span>{{ currentTrendItem ? currentTrendItem.title : '' }}趋势</span>
                                <span class="trend-dialog-unit">{{ currentTrendItem ? currentTrendItem.unit : ''
                                }}</span>
                            </div>
                            <div class="trend-dialog-close" @click="closeTrendDialog">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" stroke="#787B8F" stroke-width="1.5" />
                                    <path d="M8 8L16 16M16 8L8 16" stroke="#787B8F" stroke-width="1.5"
                                        stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="trend-dialog-chart" ref="trendChart" v-loading="trendLoading"></div>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- 帮助弹窗 -->
        <transition name="dialog-fade">
            <div class="trend-dialog-overlay" v-if="showHelpDialog" @click="closeHelpDialog" @wheel.prevent @touchmove.prevent @scroll.prevent>
                <transition name="dialog-zoom">
                    <div class="help-dialog" v-if="showHelpDialog" @click.stop @wheel.stop @touchmove.stop @scroll.stop>
                        <div class="help-dialog-header">
                            <div class="help-dialog-title">
                                <img src="@/assets/images/pc-report/icon6.png" />
                                <span>帮助</span>
                            </div>
                            <div class="help-dialog-close" @click="closeHelpDialog">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" stroke="#787B8F" stroke-width="1.5" />
                                    <path d="M8 8L16 16M16 8L8 16" stroke="#787B8F" stroke-width="1.5"
                                        stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="help-dialog-content">
                            <div class="help-dialog-item" v-for="(item, index) in currentHelpList" :key="index">
                                <div class="help-dialog-item-title">
                                    <span>{{ item.title }}</span>
                                    <img :src="require(`@/assets/images/pc-report/${item.icon}`)" />
                                </div>
                                <div class="help-dialog-item-desc">{{ item.msg }}</div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- 肥胖分析 -->
        <div class="title">
            <div class="title-left">
                <img src="@/assets/images/pc-report/icon23.png" />
                <span>肥胖分析</span>
            </div>
            <div class="title-right" @click="openHelpDialog('obesity')">
                <img src="@/assets/images/pc-report/icon6.png" />
            </div>
        </div>
        <div class="card-list">
            <!-- 骨架屏 -->
            <template v-if="quotaLoading">
                <div class="card2 skeleton-card" v-for="n in 3" :key="'skeleton-obesity-' + n">
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-tag"></div>
                    <div class="skeleton-line skeleton-value"></div>
                    <div class="skeleton-line skeleton-bar"></div>
                </div>
            </template>
            <!-- 真实数据 -->
            <template v-else>
                <div class="card2" v-for="item in obesityAnalysisList" :key="item.id">
                    <div class="card2-top">
                        <div class="card2-top-left">
                            <span>{{ item.title }}</span>
                            <img :src="require(`@/assets/images/pc-report/${item.icon}`)" />
                        </div>
                        <img v-if="item.showchartIcon" class="card2-top-right" src="@/assets/images/pc-report/icon8.png" @click="handleCardClick(item)" />
                    </div>
                    <div class="card2-tag" :class="`card2-tag-${item.tagType}`">{{ item.tagText }}</div>
                    <div class="card2-content">
                        <div class="card2-content-value" :style="{ left: item.indicatorPosition, transform: item.valueTransform }">
                            <div class="card2-content-value-left">
                                <span>{{ item.value }}</span>
                                <span>{{ item.unit }}</span>
                            </div>
                            <div class="card2-content-value-right" v-if="item.showdiffIcon">
                                <img v-if="item.diffDirection === 'up'" src="@/assets/images/pc-report/icona6.png" />
                                <img v-else-if="item.diffDirection === 'equal'" src="@/assets/images/pc-report/icona5.png" />
                                <img v-else src="@/assets/images/pc-report/icona4.png" />
                                <span v-if="item.diffDirection === 'equal' && item.dataColumn === 'METABOLICAGE'">0.0</span>
                                <span v-else-if="item.diffDirection === 'equal' && item.dataColumn === 'vaGrade'">0.00</span>
                                <span v-else>{{ item.diffValue }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card2-bottom">
                        <img :src="getObesityIndicatorImage(item)" :style="{ left: item.indicatorPosition }" />
                        <div class="card2-bottom-item card2-bottom-item1"></div>
                        <div class="card2-bottom-item card2-bottom-item2"></div>
                        <div class="card2-bottom-item card2-bottom-item3"></div>
                    </div>
                    <div class="card2-bottom-text">
                        <span>{{ item.rangeLow }}</span>
                        <span>{{ item.rangeHigh }}</span>
                    </div>
                </div>
            </template>
        </div>

        <!-- 身体参数 -->
        <div class="title">
            <div class="title-left">
                <img src="@/assets/images/pc-report/icon17.png" />
                <span>身体参数</span>
            </div>
            <div class="title-right" @click="openHelpDialog('bodyParams')">
                <img src="@/assets/images/pc-report/icon6.png" />
            </div>
        </div>
        <div class="card-list">
            <!-- 骨架屏 -->
            <template v-if="quotaLoading">
                <div class="card1 skeleton-card" v-for="n in 5" :key="'skeleton-params-' + n">
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-value"></div>
                    <div class="skeleton-line skeleton-range"></div>
                </div>
            </template>
            <!-- 真实数据 -->
            <template v-else>
                <div class="card1" v-for="item in bodyParametersList" :key="item.id">
                    <div class="card1-top">
                        <span>{{ item.title }}</span>
                        <img :src="require(`@/assets/images/pc-report/${item.icon}`)" />
                    </div>
                    <div class="card1-content">
                        <div class="card1-content-value">
                            <div class="card1-content-value-left">
                                <span>{{ item.value }}</span>
                                <span>{{ item.unit }}</span>
                            </div>
                            <div class="card1-content-value-right" v-if="item.showdiffIcon">
                                <img v-if="item.diffDirection === 'up'" src="@/assets/images/pc-report/icona6.png" />
                                <img v-else-if="item.diffDirection === 'equal'" src="@/assets/images/pc-report/icona5.png" />
                                <img v-else src="@/assets/images/pc-report/icona4.png" />
                                <span v-if="item.diffDirection === 'equal' && item.dataColumn === 'METABOLICAGE'">0.0</span>
                                <span v-else-if="item.diffDirection === 'equal' && item.dataColumn === 'vaGrade'">0.00</span>
                                <span v-else>{{ item.diffValue }}</span>
                            </div>
                        </div>
                        <img v-if="item.showchartIcon" src="@/assets/images/pc-report/icon8.png" @click="handleCardClick(item)" />
                    </div>
                    <div class="card1-bottom" v-if="item.showrange">
                        <span>[{{ item.range }}]</span>
                        <div class="card1-bottom-tag" :class="`card1-bottom-tag-${item.tagType}`">{{ item.tagText }}</div>
                    </div>
                </div>
            </template>
        </div>

        <!-- 节段脂肪 节段肌肉 -->
        <div class="segment" v-loading="segmentLoading">
            <div class="segment-item" v-for="item in segmentList" :key="item.id">
                <div class="segment-item-title">
                    <img :src="require(`@/assets/images/pc-report/${item.icon}`)" />
                    <span>{{ item.title }}</span>
                </div>
                <div class="segment-item-content">
                    <img class="segment-item-content-bg" src="@/assets/images/pc-report/body.png" />
                    <div class="segment-item-content-card segment-item-content-card-center">
                        <span>躯干</span>
                        <div class="segment-item-content-card-value">
                            <span>{{ item.trunk.value }}</span>
                            <span>{{ item.trunk.unit }}</span>
                        </div>
                        <span class="segment-item-content-card-tag"
                            :class="`segment-item-content-card-tag-${item.trunk.tagType}`">{{ item.trunk.tagText
                            }}</span>
                    </div>
                    <div class="segment-item-content-card segment-item-content-card-top-left">
                        <span>左上肢</span>
                        <div class="segment-item-content-card-value">
                            <span>{{ item.leftArm.value }}</span>
                            <span>{{ item.leftArm.unit }}</span>
                        </div>
                        <span class="segment-item-content-card-tag"
                            :class="`segment-item-content-card-tag-${item.leftArm.tagType}`">{{ item.leftArm.tagText
                            }}</span>
                    </div>
                    <div class="segment-item-content-card segment-item-content-card-top-right">
                        <span>右上肢</span>
                        <div class="segment-item-content-card-value">
                            <span>{{ item.rightArm.value }}</span>
                            <span>{{ item.rightArm.unit }}</span>
                        </div>
                        <span class="segment-item-content-card-tag"
                            :class="`segment-item-content-card-tag-${item.rightArm.tagType}`">{{ item.rightArm.tagText
                            }}</span>
                    </div>
                    <div class="segment-item-content-card segment-item-content-card-bottom-left">
                        <span>左下肢</span>
                        <div class="segment-item-content-card-value">
                            <span>{{ item.leftLeg.value }}</span>
                            <span>{{ item.leftLeg.unit }}</span>
                        </div>
                        <span class="segment-item-content-card-tag"
                            :class="`segment-item-content-card-tag-${item.leftLeg.tagType}`">{{ item.leftLeg.tagText
                            }}</span>
                    </div>
                    <div class="segment-item-content-card segment-item-content-card-bottom-right">
                        <span>右下肢</span>
                        <div class="segment-item-content-card-value">
                            <span>{{ item.rightLeg.value }}</span>
                            <span>{{ item.rightLeg.unit }}</span>
                        </div>
                        <span class="segment-item-content-card-tag"
                            :class="`segment-item-content-card-tag-${item.rightLeg.tagType}`">{{ item.rightLeg.tagText
                            }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 调节建议 -->
        <div class="title">
            <div class="title-left">
                <img src="@/assets/images/pc-report/icon_suggess.png" />
                <span>调节建议</span>
            </div>
        </div>
        <div class="adjust">
            <!-- 骨架屏 -->
            <template v-if="adjustLoading">
                <div class="adjust-item skeleton-adjust" v-for="n in 3" :key="'skeleton-adjust-' + n">
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-value"></div>
                    <div class="skeleton-line skeleton-chart"></div>
                </div>
            </template>
            <!-- 真实数据 -->
            <template v-else>
                <div class="adjust-item" v-for="item in adjustList" :key="item.id">
                    <div class="adjust-item-title">{{ item.title }}</div>
                    <div class="adjust-item-row">
                        <span class="adjust-item-val">{{ item.value }}</span>
                        <span class="adjust-item-unit">{{ item.unit }}</span>
                        <span class="adjust-item-tag" :class="`adjust-item-tag-${item.tagType}`">{{ item.tagText }}</span>
                    </div>
                    <div class="adjust-chart">
                        <!-- 背景线 -->
                        <div class="chart-line line-1"></div>
                        <div class="chart-line line-2"></div>
                        <div class="chart-line line-3"></div>

                        <!-- 调节量为 0：显示直线 -->
                        <template v-if="item.isZero">
                            <div class="chart-label label-measured left">
                                测量值：<span :style="{ color: getColor(item.tagType), fontSize: '18px', fontWeight: 'bold' }">{{
                                    item.measured }}</span>
                            </div>
                            <div class="chart-label label-ideal left">
                                理想值：<span style="color: #10B981; font-size: 18px; font-weight: bold">{{ item.ideal }}</span> <img
                                    src="@/assets/images/pc-report/icon_star.png" />
                            </div>
                        </template>
                        <!-- 非标准状态：根据 direction 决定位置 -->
                        <template v-else>
                            <div class="chart-label label-measured" :class="item.direction">
                                测量值：<span :style="{ color: getColor(item.tagType), fontSize: '18px', fontWeight: 'bold' }">{{
                                    item.measured }}</span>
                            </div>
                            <div class="chart-label label-ideal" :class="item.direction">
                                理想值：<span style="color: #10B981; font-size: 18px; font-weight: bold">{{ item.ideal }}</span> <img
                                    src="@/assets/images/pc-report/icon_star.png" />
                            </div>
                        </template>

                        <svg class="chart-svg" width="100%" height="100%">
                            <defs>
                                <linearGradient :id="'grad-' + item.id" x1="35%" y1="0%" x2="65%" y2="0%" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" :stop-color="getColor(item.tagType)" />
                                    <stop offset="100%" stop-color="#10B981" />
                                </linearGradient>
                            </defs>
                            <!-- 调节量为 0：水平直线 -->
                            <template v-if="item.isZero">
                                <line x1="35%" y1="50%" x2="65%" y2="50%" :stroke="`url(#grad-${item.id})`" stroke-width="2" />
                            </template>
                            <!-- 非标准状态：left: 向左倾斜（左上到右下），right: 向右倾斜（左下到右上） -->
                            <template v-else>
                                <line x1="35%" :y1="item.direction === 'left' ? '20%' : '80%'" x2="65%"
                                    :y2="item.direction === 'left' ? '80%' : '20%'" :stroke="`url(#grad-${item.id})`"
                                    stroke-width="2" />
                            </template>
                        </svg>

                        <!-- 调节量为 0：两个点都在中间 -->
                        <template v-if="item.isZero">
                            <div class="chart-dot dot-measured" :style="{
                                background: getColor(item.tagType),
                                left: '35%',
                                top: '50%'
                            }"></div>
                            <div class="chart-dot dot-ideal" :style="{
                                background: '#10B981',
                                left: '65%',
                                top: '50%'
                            }"></div>
                        </template>
                        <!-- 非标准状态：left: 测量值左上、理想值右下，right: 测量值左下、理想值右上 -->
                        <template v-else>
                            <div class="chart-dot dot-measured" :style="{
                                background: getColor(item.tagType),
                                left: '35%',
                                top: item.direction === 'left' ? '20%' : '80%'
                            }"></div>
                            <div class="chart-dot dot-ideal" :style="{
                                background: '#10B981',
                                left: '65%',
                                top: item.direction === 'left' ? '80%' : '20%'
                            }"></div>
                        </template>
                    </div>
                </div>
            </template>
        </div>

        <div class="tip">
            *报告内容仅供参考，不作为诊断或医疗依据
        </div>
    </div>
</template>

<script>
import ScoreChart from './ScoreChart.vue'
import echarts from 'echarts'
import {
    findBodyScore,
    findBmMassQuotaInfos,
    bmSegInfo,
    bodyAdjustInfo,
    findBmBIAScanTrueHistory,
    findBmMassQuotaTrend,
    findBodyState
} from '@/assets/js/apolloGql.js'

export default {
    name: 'CompositionTab',
    components: {
        ScoreChart
    },
    data() {
        return {
            // 模型信息（从 localStorage 获取）
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')) || {},
            // 评分数据
            bodyScore: {
                massScore: 0,
                massConScore: null,
                evalScore: 0,
                evalConScore: null
            },
            // scoreType: 1=身体成分, 2=体态评估, 3=两者都有
            scoreType: 0,
            measureTime: '',
            scoreUpdateDate: '',
            // 趋势弹窗
            showTrendDialog: false,
            trendChartInstance: null,
            currentTrendItem: null,
            trendData: [],
            trendDialogOpenTime: 0,
            // 帮助弹窗
            showHelpDialog: false,
            currentHelpType: '',
            helpDialogOpenTime: 0,
            // 人体成分概览帮助列表
            compositionHelpList: [
                { title: '体重', icon: 'icona20.png', msg: '体重是身体水分、蛋白质、无机盐和体脂肪的总和。' },
                { title: '体脂肪', icon: 'icona18.png', msg: '体脂肪是皮下脂肪，内脏脂肪和肌肉之间脂肪的总和。' },
                { title: '肌肉量', icon: 'icona7.png', msg: '肌肉量是人体的瘦组织群，包括了骨骼肌、平滑肌和心肌。' },
                { title: '骨骼肌', icon: 'icona15.png', msg: '骨骼肌又称横纹肌，附着在骨骼上的肌肉，肌肉中的一种，此处计算的是骨骼肌的含量。' },
                { title: '去脂体重', icon: 'icona17.png', msg: '去脂体重是体重扣除脂肪的部分。' },
                { title: '无机盐', icon: 'icona10.png', msg: '人体是由有机物、无机物和水组成的，人体里的无机物叫无机盐，无机盐大约占人体重量的5%。' },
                { title: '蛋白质', icon: 'icona14.png', msg: '蛋白质是含氮的固态物质，存在于人体所有细胞内，参与细胞构成。是肌肉量的主要成分。' },
                { title: '总水分', icon: 'icona21.png', msg: '身体水分在人体成分中占的含量最多，占体重的50%~70%，身体水分分布于人体细胞和体液中，其中大部分存在于肌肉细胞中。' }
            ],
            // 肥胖分析帮助列表
            obesityHelpList: [
                { title: '体脂率', icon: 'icona19.png', msg: '体脂肪率是指体脂肪占体重的比率。' },
                { title: 'BMI', icon: 'icona22.png', msg: 'BMI主要用于评估外观肥胖度，国际上常作为衡量人体胖瘦程度的标准。' },
                { title: '腰臀比', icon: 'icona13.png', msg: '腰臀比是腰围和臀围的比值，是判定中心性肥胖的重要指标。' }
            ],
            // 身体参数帮助列表
            bodyParamsHelpList: [
                { title: '代谢年龄', icon: 'icona3.png', msg: '代谢年龄是根据基础代谢率计算得出的年龄，反映身体的代谢水平。' },
                { title: '基础代谢', icon: 'icona16.png', msg: '基础代谢指人体在清醒而安静的状况下，不受运动、食物、神经紧张、外界温度变化等影响时一天消耗的总能量。' },
                { title: '内脏脂肪等级', icon: 'icona9.png', msg: '内脏脂肪等级是评价是否属于隐性肥胖的重要指标。' },
                { title: '细胞内液', icon: 'icona11.png', msg: '细胞内液是肌体细胞总体所含的体液，是原生质的基本组成部分。' },
                { title: '细胞外液', icon: 'icona12.png', msg: '细胞外液通常指存在于细胞外的体液，包括血浆以及介于血管和组织细胞之间的组织间液。' }
            ],
            // 历史记录
            historyList: [],
            // 当前测量的 scanId（从历史记录最后一条获取）
            currentScanId: '',
            tcScanId: '',
            // 调节建议数据
            adjustList: [],
            // 身体状态数据
            bodyState: {
                weight: null,       // 体重
                weightStatus: null, // 体重状态 (1=不足, 2=标准, 3=过量)
                bodyFat: null,      // 体脂肪重量
                bodyFatStatus: null, // 体脂肪状态
                muscle: null,       // 肌肉量
                muscleStatus: null  // 肌肉量状态
            },
            // 节段数据
            segmentList: [
                {
                    id: 1,
                    title: '节段脂肪',
                    icon: 'icon_segment_left.png',
                    trunk: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    leftArm: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    rightArm: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    leftLeg: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    rightLeg: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' }
                },
                {
                    id: 2,
                    title: '节段肌肉',
                    icon: 'icon_segment_right.png',
                    trunk: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    leftArm: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    rightArm: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    leftLeg: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' },
                    rightLeg: { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' }
                }
            ],
            // 人体成分概览数据
            compositionOverviewList: [],
            // 身体参数数据
            bodyParametersList: [],
            // dataColumn 与图标的映射
            iconMap: {
                'WT': 'icona20.png',
                'BFM': 'icona18.png',
                'LM': 'icona7.png',
                'SM': 'icona15.png',
                'FFM': 'icona17.png',
                'TM': 'icona10.png',
                'PROTEIN': 'icona14.png',
                'TBW': 'icona21.png',
                'METABOLICAGE': 'icona3.png',
                'BMR': 'icona16.png',
                'vaGrade': 'icona9.png',
                'ICW': 'icona11.png',
                'ECW': 'icona12.png',
                'PBF': 'icona19.png',
                'BMI': 'icona22.png',
                'WHR': 'icona13.png'
            },
            // 人体成分概览的字段列表（按顺序）
            overviewColumns: ['WT', 'BFM', 'LM', 'SM', 'FFM', 'TM', 'PROTEIN', 'TBW'],
            // 身体参数的字段列表（按顺序）
            bodyParamsColumns: ['METABOLICAGE', 'BMR', 'vaGrade', 'ICW', 'ECW'],
            // 肥胖分析数据
            obesityAnalysisList: [],
            // loading 状态
            scoreLoading: false,       // 评分数据加载中
            quotaLoading: false,       // 体成分指标数据加载中
            segmentLoading: false,     // 节段数据加载中
            adjustLoading: false,      // 调节建议数据加载中
            trendLoading: false        // 趋势数据加载中
        }
    },
    computed: {
        // 当前帮助列表
        currentHelpList() {
            switch (this.currentHelpType) {
                case 'composition':
                    return this.compositionHelpList
                case 'obesity':
                    return this.obesityHelpList
                case 'bodyParams':
                    return this.bodyParamsHelpList
                default:
                    return []
            }
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        if (this.trendChartInstance) {
            this.trendChartInstance.dispose()
            this.trendChartInstance = null
        }
        // 恢复body滚动，防止组件销毁时弹窗还在打开状态
        document.body.style.overflow = ''
    },
    methods: {
        // 初始化数据
        init() {
            if (!this.modelInfo.scanId) {
                console.error('scanId 不存在')
                return
            }
            // 计算 scoreType（与 Index.vue 保持一致）
            if (this.modelInfo.biaStatus === 1 && this.modelInfo.evalStatus === 1) {
                this.scoreType = 3
            } else if (this.modelInfo.biaStatus === 1) {
                this.scoreType = 1
            } else if (this.modelInfo.evalStatus === 1) {
                this.scoreType = 2
            }
            // 并行请求数据
            this.getBodyScore()
            this.getHistoryAndQuotaInfos()
            this.getSegmentInfo()
            // 先获取身体状态数据，再获取调节建议数据（参考 Index.vue）
            this.getBodyState()
        },
        // 获取评分数据
        getBodyScore() {
            this.scoreLoading = true
            this.$apollo
                .query({
                    query: findBodyScore,
                    variables: {
                        scanId: this.modelInfo.scanId,
                        scanTime: this.modelInfo.createTime,
                        // 与 Index.vue 保持一致，使用 scoreType
                        scanType: this.scoreType
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBodyScore
                    if (data && data.code === 200 && data.data) {
                        // 与 Index.vue 完全一致的处理方式
                        const scoreInfo = JSON.parse(JSON.stringify(data.data))
                        if (this.scoreType === 1 || this.scoreType === 3) {
                            scoreInfo.massScore = scoreInfo.massScore ? parseInt(scoreInfo.massScore, 10) : null
                            scoreInfo.massConScore = scoreInfo.massConScore
                                ? parseInt(scoreInfo.massConScore, 10)
                                : null
                        }
                        if (this.scoreType === 2 || this.scoreType === 3) {
                            scoreInfo.evalScore = scoreInfo.evalScore ? parseInt(scoreInfo.evalScore, 10) : null
                            scoreInfo.evalConScore = scoreInfo.evalConScore
                                ? parseInt(scoreInfo.evalConScore, 10)
                                : null
                        }
                        this.bodyScore = scoreInfo
                        // 格式化测量时间
                        if (scoreInfo.createTime) {
                            const date = new Date(scoreInfo.createTime * 1000)
                            this.measureTime = this.formatDateTime(date)
                            // 格式化评分规则更新日期（使用测量时间的年月）
                            this.scoreUpdateDate = `${date.getFullYear()}年${date.getMonth() + 1}月`
                        }
                    }
                })
                .catch((err) => {
                    console.error('获取评分数据失败:', err)
                })
                .finally(() => {
                    this.scoreLoading = false
                })
        },
        // 获取历史记录和体成分指标数据
        getHistoryAndQuotaInfos() {
            this.quotaLoading = true
            this.$apollo
                .query({
                    query: findBmBIAScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: this.modelInfo.createTime
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBmBIAScanTrueHistory
                    if (data && data.code === 200 && data.data) {
                        // 处理历史数据
                        let allHistory = []
                        data.data.forEach((yearData) => {
                            if (yearData.data) {
                                allHistory = allHistory.concat(yearData.data)
                            }
                        })
                        // 按时间升序排序（最早的在前，用于趋势图）
                        allHistory.sort((a, b) => {
                            return new Date(a.createTime * 1000).getTime() - new Date(b.createTime * 1000).getTime()
                        })
                        this.historyList = allHistory
                        // 获取当前测量的 scanId（历史记录最后一条）
                        if (allHistory.length > 0) {
                            this.currentScanId = allHistory[allHistory.length - 1].scanId
                        }
                        // 获取对比 scanId（上一次测量，倒数第二条）
                        if (allHistory.length > 1) {
                            this.tcScanId = allHistory[allHistory.length - 2].scanId
                        }
                        // 获取体成分指标数据
                        this.getQuotaInfos()
                    }
                })
                .catch((err) => {
                    console.error('获取历史记录失败:', err)
                    // 即使历史记录获取失败，也尝试获取指标数据
                    this.getQuotaInfos()
                })
        },
        // 获取体成分指标数据
        getQuotaInfos() {
            // 使用从历史记录获取的 scanId，如果没有则使用 modelInfo.scanId
            const scanId = this.currentScanId || this.modelInfo.scanId
            this.$apollo
                .query({
                    query: findBmMassQuotaInfos,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: scanId,
                        tcScanId: this.tcScanId || ''
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBmMassQuotaInfos
                    if (data && data.code === 200 && data.data) {
                        this.processQuotaData(data.data)
                    }
                })
                .catch((err) => {
                    console.error('获取体成分指标数据失败:', err)
                })
                .finally(() => {
                    this.quotaLoading = false
                })
        },
        // 处理体成分指标数据
        processQuotaData(quotaList) {
            // 创建 dataColumn 到数据的映射
            const quotaMap = {}
            quotaList.forEach((item) => {
                quotaMap[item.dataColumn] = item
            })

            // 处理人体成分概览数据
            const overviewList = []
            this.overviewColumns.forEach((column, index) => {
                const item = quotaMap[column]
                if (item && item.latestData) {
                    overviewList.push(this.formatQuotaItem(item, index + 1))
                }
            })
            this.compositionOverviewList = overviewList

            // 处理身体参数数据
            const paramsList = []
            this.bodyParamsColumns.forEach((column, index) => {
                const item = quotaMap[column]
                if (item && item.latestData) {
                    paramsList.push(this.formatQuotaItem(item, index + 1))
                }
            })
            this.bodyParametersList = paramsList

            // 处理肥胖分析数据（体脂率、BMI、腰臀比）
            const obesityColumns = ['PBF', 'BMI', 'WHR']
            const obesityList = []
            obesityColumns.forEach((column, index) => {
                const item = quotaMap[column]
                if (item && item.latestData) {
                    obesityList.push(this.formatObesityItem(item, index + 1))
                }
            })
            this.obesityAnalysisList = obesityList
        },
        // 格式化单个指标数据
        formatQuotaItem(item, id) {
            const latestData = item.latestData || {}
            const contrastData = item.contrastData
            // 计算差值
            let diffValue = null
            let diffDirection = null
            if (contrastData && contrastData.v != null && latestData.v != null) {
                diffValue = Math.abs(latestData.v - contrastData.v)
                if (diffValue === 0) {
                    diffDirection = 'equal'
                } else {
                    diffDirection = latestData.v > contrastData.v ? 'up' : 'down'
                }
            }
            // 获取状态类型和文本
            const { tagType, tagText } = this.getStatusInfo(latestData.status)
            // 是否显示范围（代谢年龄不显示范围）
            const showrange = item.dataColumn !== 'METABOLICAGE'
            return {
                id,
                dataColumn: item.dataColumn,
                title: item.name,
                icon: this.iconMap[item.dataColumn] || 'icona13.png',
                value: this.formatValue(latestData.v, item.dataColumn),
                unit: item.unit || '',
                range: `${this.formatValue(latestData.l, item.dataColumn)}~${this.formatValue(latestData.h, item.dataColumn)}`,
                tagType,
                tagText,
                showchartIcon: true,
                showdiffIcon: diffValue !== null,
                showrange,
                diffValue: diffValue !== null ? this.formatValue(diffValue, item.dataColumn) : null,
                diffDirection,
                latestData,
                contrastData
            }
        },
        // 获取状态信息
        getStatusInfo(status) {
            // status: 1=低标准, 2=标准, 3=高标准
            switch (status) {
                case 1:
                    return { tagType: 'blue', tagText: '低标准' }
                case 2:
                    return { tagType: 'green', tagText: '标准' }
                case 3:
                    return { tagType: 'red', tagText: '高标准' }
                default:
                    return { tagType: 'green', tagText: '标准' }
            }
        },
        // 格式化数值
        formatValue(value, dataColumn) {
            if (value == null) return '--'
            // 腰臀比保留2位小数
            if (dataColumn === 'WHR') {
                return value.toFixed(2)
            }
            // 代谢年龄取整
            if (dataColumn === 'METABOLICAGE') {
                return Math.round(value)
            }
            // 其他保留1位小数
            return value.toFixed(1)
        },
        // 格式化肥胖分析数据项
        formatObesityItem(item, id) {
            const latestData = item.latestData || {}
            const contrastData = item.contrastData
            // 计算差值
            let diffValue = null
            let diffDirection = null
            if (contrastData && contrastData.v != null && latestData.v != null) {
                diffValue = Math.abs(latestData.v - contrastData.v)
                if (diffValue === 0) {
                    diffDirection = 'equal'
                } else {
                    diffDirection = latestData.v > contrastData.v ? 'up' : 'down'
                }
            }
            // 获取状态类型和文本
            const { tagType, tagText } = this.getStatusInfo(latestData.status)

            // 计算指示器位置（根据数值在范围中的百分比位置）
            let indicatorPosition = '10px'
            let positionPercent = 50 // 用于计算 transform 的百分比值
            if (latestData.v != null && latestData.l != null && latestData.h != null) {
                const v = latestData.v
                const l = latestData.l
                const h = latestData.h
                const rangeWidth = h - l // 标准区域的宽度

                if (latestData.status === 1) {
                    // 低标准区域：v < l，映射到 0% - 33.33%
                    // 下界 = l - rangeWidth，上界 = l
                    const lowerBound = l - rangeWidth
                    const ratio = Math.max(0, Math.min(1, (v - lowerBound) / rangeWidth))
                    positionPercent = ratio * 33.33
                    indicatorPosition = `${positionPercent}%`
                } else if (latestData.status === 2) {
                    // 标准区域：l <= v <= h，映射到 33.33% - 66.66%
                    const ratio = (v - l) / rangeWidth
                    positionPercent = 33.33 + ratio * 33.33
                    indicatorPosition = `${positionPercent}%`
                } else if (latestData.status === 3) {
                    // 高标准区域：v > h，映射到 66.66% - 100%
                    // 下界 = h，上界 = h + rangeWidth
                    // const upperBound = h + rangeWidth
                    const ratio = Math.max(0, Math.min(1, (v - h) / rangeWidth))
                    positionPercent = 66.66 + ratio * 33.33
                    indicatorPosition = `${positionPercent}%`
                }
            }

            // 计算动态 transform，避免数值超出边界
            // 左侧边界：位置 0-25% 时，transform 从 0% 过渡到 -50%
            // 右侧边界：位置 75-100% 时，transform 从 -50% 过渡到 -100%
            // 中间区域：保持 -50%
            let translateX = -50
            if (positionPercent <= 25) {
                // 左侧边界：从 0% 线性过渡到 -50%
                translateX = -2 * positionPercent
            } else if (positionPercent >= 75) {
                // 右侧边界：从 -50% 线性过渡到 -100%
                translateX = -50 - 2 * (positionPercent - 75)
            }
            const valueTransform = `translateX(${translateX}%)`

            // BMI 默认单位为 kg/m²
            let unit = item.unit || ''
            if (item.dataColumn === 'BMI' && !unit) {
                unit = 'kg/m²'
            }

            return {
                id,
                dataColumn: item.dataColumn,
                title: item.name,
                icon: this.iconMap[item.dataColumn] || 'icona13.png',
                value: this.formatValue(latestData.v, item.dataColumn),
                unit,
                rangeLow: this.formatValue(latestData.l, item.dataColumn),
                rangeHigh: this.formatValue(latestData.h, item.dataColumn),
                tagType,
                tagText,
                showchartIcon: true,
                showdiffIcon: diffValue !== null,
                diffValue: diffValue !== null ? this.formatValue(diffValue, item.dataColumn) : null,
                diffDirection,
                indicatorPosition,
                valueTransform,
                latestData,
                contrastData
            }
        },
        // 获取肥胖指标图片
        getObesityIndicatorImage(item) {
            // 根据状态返回不同的指示器图片
            const imageMap = {
                blue: require('@/assets/images/pc-report/delta_blue.png'),
                green: require('@/assets/images/pc-report/delta_green.png'),
                red: require('@/assets/images/pc-report/delta_red.png')
            }
            return imageMap[item.tagType] || imageMap.green
        },
        // 获取节段数据
        getSegmentInfo() {
            this.segmentLoading = true
            this.$apollo
                .query({
                    query: bmSegInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.bmSegInfo
                    if (data && data.code === 200 && data.data) {
                        this.processSegmentData(data.data)
                    }
                })
                .catch((err) => {
                    console.error('获取节段数据失败:', err)
                })
                .finally(() => {
                    this.segmentLoading = false
                })
        },
        // 处理节段数据
        processSegmentData(segData) {
            const { bmSegBFM, bmSegLM } = segData
            // 处理节段脂肪
            if (bmSegBFM) {
                this.segmentList[0] = {
                    id: 1,
                    title: '节段脂肪',
                    icon: 'icon_segment_left.png',
                    trunk: this.formatSegmentItem(bmSegBFM.BFMTR),
                    leftArm: this.formatSegmentItem(bmSegBFM.BFMLA),
                    rightArm: this.formatSegmentItem(bmSegBFM.BFMRA),
                    leftLeg: this.formatSegmentItem(bmSegBFM.BFMLL),
                    rightLeg: this.formatSegmentItem(bmSegBFM.BFMRL)
                }
            }
            // 处理节段肌肉
            if (bmSegLM) {
                this.segmentList[1] = {
                    id: 2,
                    title: '节段肌肉',
                    icon: 'icon_segment_right.png',
                    trunk: this.formatSegmentItem(bmSegLM.LMTR),
                    leftArm: this.formatSegmentItem(bmSegLM.LMLA),
                    rightArm: this.formatSegmentItem(bmSegLM.LMRA),
                    leftLeg: this.formatSegmentItem(bmSegLM.LMLL),
                    rightLeg: this.formatSegmentItem(bmSegLM.LMRL)
                }
            }
        },
        // 格式化节段数据项
        formatSegmentItem(item) {
            if (!item) {
                return { value: '--', unit: 'kg', tagType: 'green', tagText: '标准' }
            }
            const { tagType, tagText } = this.getStatusInfo(item.status)
            return {
                value: item.v != null ? item.v.toFixed(1) : '--',
                unit: 'kg',
                tagType,
                tagText
            }
        },
        // 获取身体状态数据
        getBodyState() {
            this.adjustLoading = true
            this.$apollo
                .query({
                    query: findBodyState,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBodyState
                    if (data && data.code === 200 && data.data) {
                        const stateData = data.data
                        // 参考 Index.vue 处理方式，同时保存 status 字段
                        this.bodyState = {
                            weight: stateData.WT ? stateData.WT.v : null,
                            weightStatus: stateData.WT ? stateData.WT.status : null,
                            // 体脂肪重量 = 体重 × 体脂率 / 100，状态用 PBF 的状态
                            bodyFat: (stateData.WT && stateData.PBF) ? (stateData.WT.v * stateData.PBF.v / 100) : null,
                            bodyFatStatus: stateData.PBF ? stateData.PBF.status : null,
                            muscle: stateData.LM ? stateData.LM.v : null,
                            muscleStatus: stateData.LM ? stateData.LM.status : null
                        }
                    }
                    // 获取身体状态后再获取调节建议数据
                    this.getAdjustInfo()
                })
                .catch((err) => {
                    console.error('获取身体状态数据失败:', err)
                    // 即使失败也尝试获取调节建议数据
                    this.getAdjustInfo()
                })
        },
        // 获取调节建议数据
        getAdjustInfo() {
            this.$apollo
                .query({
                    query: bodyAdjustInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.bodyAdjustInfo
                    if (data && data.code === 200 && data.data) {
                        this.processAdjustData(data.data)
                    }
                })
                .catch((err) => {
                    console.error('获取调节建议数据失败:', err)
                })
                .finally(() => {
                    this.adjustLoading = false
                })
        },
        // 处理调节建议数据
        processAdjustData(adjustData) {
            console.log('========== 调节建议数据分析 ==========')
            console.log('原始 adjustData:', adjustData)
            console.log('身体状态 bodyState:', this.bodyState)

            const list = []
            // 体重调节
            if (adjustData.weight != null) {
                const weight = adjustData.weight
                const measured = this.bodyState.weight
                const ideal = measured != null ? measured + weight : null
                const weightStatus = this.bodyState.weightStatus

                console.log('--- 体重调节 ---')
                console.log('  测量值 (measured):', measured)
                console.log('  理想值 (ideal):', ideal)
                console.log('  调节差值 (weight):', weight)
                console.log('  状态 (status):', weightStatus)
                console.log('  标签:', this.getAdjustTagText(weightStatus), '/', this.getAdjustTagType(weightStatus))

                // 根据测量值和理想值大小关系决定方向：测量值大在上，理想值大在上
                let direction = 'left'
                if (measured != null && ideal != null) {
                    direction = measured > ideal ? 'left' : 'right'
                }

                list.push({
                    id: 1,
                    title: '体重',
                    value: this.formatAdjustValue(weight),
                    unit: 'kg',
                    tagText: this.getAdjustTagText(weightStatus),
                    tagType: this.getAdjustTagType(weightStatus),
                    measured: measured != null ? measured.toFixed(1) : '--',
                    ideal: ideal != null ? ideal.toFixed(1) : '--',
                    direction,
                    isZero: weight === 0 // 调节量为 0 时显示直线
                })
            }
            // 体脂肪调节
            if (adjustData.bodyFat != null) {
                const bodyFat = adjustData.bodyFat
                const measured = this.bodyState.bodyFat
                const ideal = measured != null ? measured + bodyFat : null
                const bodyFatStatus = this.bodyState.bodyFatStatus

                console.log('--- 体脂肪调节 ---')
                console.log('  数据：', this.bodyState)
                console.log('  测量值 (measured):', measured)
                console.log('  理想值 (ideal):', ideal)
                console.log('  调节差值 (bodyFat):', bodyFat)
                console.log('  状态 (status):', bodyFatStatus)
                console.log('  标签:', this.getAdjustTagText(bodyFatStatus), '/', this.getAdjustTagType(bodyFatStatus))

                // 根据测量值和理想值大小关系决定方向
                let direction = 'left'
                if (measured != null && ideal != null) {
                    direction = measured > ideal ? 'left' : 'right'
                }

                list.push({
                    id: 2,
                    title: '体脂肪',
                    value: this.formatAdjustValue(bodyFat),
                    unit: 'kg',
                    tagText: this.getAdjustTagText(bodyFatStatus),
                    tagType: this.getAdjustTagType(bodyFatStatus),
                    measured: measured != null ? measured.toFixed(1) : '--',
                    ideal: ideal != null ? ideal.toFixed(1) : '--',
                    direction,
                    isZero: bodyFat === 0 // 调节量为 0 时显示直线
                })
            }
            // 肌肉量调节
            if (adjustData.muscle != null) {
                const muscle = adjustData.muscle
                const measured = this.bodyState.muscle
                const ideal = measured != null ? measured + muscle : null
                const muscleStatus = this.bodyState.muscleStatus

                console.log('--- 肌肉量调节 ---')
                console.log('  测量值 (measured):', measured)
                console.log('  理想值 (ideal):', ideal)
                console.log('  调节差值 (muscle):', muscle)
                console.log('  状态 (status):', muscleStatus)
                console.log('  标签:', this.getAdjustTagText(muscleStatus), '/', this.getAdjustTagType(muscleStatus))

                // 根据测量值和理想值大小关系决定方向
                let direction = 'left'
                if (measured != null && ideal != null) {
                    direction = measured > ideal ? 'left' : 'right'
                }

                list.push({
                    id: 3,
                    title: '肌肉量',
                    value: this.formatAdjustValue(muscle),
                    unit: 'kg',
                    tagText: this.getAdjustTagText(muscleStatus),
                    tagType: this.getAdjustTagType(muscleStatus),
                    measured: measured != null ? measured.toFixed(1) : '--',
                    ideal: ideal != null ? ideal.toFixed(1) : '--',
                    direction,
                    isZero: muscle === 0 // 调节量为 0 时显示直线
                })
            }
            console.log('最终调节建议列表:', list)
            console.log('====================================')
            this.adjustList = list
        },
        // 格式化调节值
        formatAdjustValue(value) {
            if (value == null) return '--'
            const prefix = value > 0 ? '+' : ''
            return `${prefix}${value.toFixed(1)}`
        },
        // 获取调节标签文本（基于后端返回的 status 字段）
        // status: 1=不足, 2=标准, 3=过量
        getAdjustTagText(status) {
            switch (status) {
                case 1:
                    return '不足'
                case 2:
                    return '标准'
                case 3:
                    return '过量'
                default:
                    return '标准'
            }
        },
        // 获取调节标签类型（基于后端返回的 status 字段）
        // 不足=蓝色, 标准=绿色, 过量=红色
        getAdjustTagType(status) {
            switch (status) {
                case 1:
                    return 'blue'
                case 2:
                    return 'green'
                case 3:
                    return 'red'
                default:
                    return 'green'
            }
        },
        // 格式化日期时间
        formatDateTime(date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },
        getColor(type) {
            const map = {
                red: '#F43F5E',
                green: '#10B981',
                blue: '#818CF8'
            }
            return map[type] || '#10B981'
        },
        // 处理卡片点击
        handleCardClick(item) {
            // 防止弹窗已打开时重复触发
            if (this.showTrendDialog) {
                return
            }
            this.currentTrendItem = item
            this.showTrendDialog = true
            this.trendDialogOpenTime = Date.now()
            // 禁止body滚动
            document.body.style.overflow = 'hidden'

            this.$nextTick(() => {
                // 加载真实数据
                this.loadTrendData(item.dataColumn)
            })
        },
        // 加载趋势数据
        loadTrendData(dataColumn) {
            this.trendLoading = true
            // 获取历史 scanId 列表
            const scanIds = this.historyList.map((h) => h.scanId)
            if (scanIds.length === 0) {
                this.trendData = []
                this.initTrendChart()
                this.trendLoading = false
                return
            }
            this.$apollo
                .query({
                    query: findBmMassQuotaTrend,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanIds
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBmMassQuotaTrend
                    if (data && data.code === 200 && data.data) {
                        // 找到对应的指标数据
                        const trendItem = data.data.find((item) => item.dataColumn === dataColumn)
                        if (trendItem && trendItem.trendData && trendItem.trendData.length > 0) {
                            // 按时间正序排列（与趋势对比页面保持一致）
                            const sortedData = [...trendItem.trendData].sort((a, b) => {
                                return new Date(a.measureTime).getTime() - new Date(b.measureTime).getTime()
                            })
                            this.trendData = sortedData.map((t) => {
                                // measureTime 是毫秒级时间戳
                                const date = new Date(t.measureTime)
                                const year = date.getFullYear()
                                const month = date.getMonth() + 1
                                const day = date.getDate()
                                return {
                                    date: `${month}/${day}`,
                                    year: year,
                                    fullDate: date,
                                    value: dataColumn === 'WHR' ? Number(t.v.toFixed(2)) : Number(t.v.toFixed(1))
                                }
                            })
                        } else {
                            this.trendData = []
                        }
                    } else {
                        this.trendData = []
                    }
                    this.initTrendChart()
                })
                .catch((err) => {
                    console.error('获取趋势数据失败:', err)
                    this.trendData = []
                    this.initTrendChart()
                })
                .finally(() => {
                    this.trendLoading = false
                })
        },
        // 关闭弹窗
        closeTrendDialog() {
            // 检查弹窗是否已打开超过0.5秒，防止误触
            const timeSinceOpen = Date.now() - this.trendDialogOpenTime
            if (timeSinceOpen < 500) {
                return
            }
            this.showTrendDialog = false
            this.currentTrendItem = null
            // 恢复body滚动
            document.body.style.overflow = ''
            if (this.trendChartInstance) {
                this.trendChartInstance.dispose()
                this.trendChartInstance = null
            }
        },
        // 打开帮助弹窗
        openHelpDialog(type) {
            this.currentHelpType = type
            this.showHelpDialog = true
            this.helpDialogOpenTime = Date.now()
            // 禁止body滚动
            document.body.style.overflow = 'hidden'
        },
        // 关闭帮助弹窗
        closeHelpDialog() {
            // 检查弹窗是否已打开超过0.5秒，防止误触
            const timeSinceOpen = Date.now() - this.helpDialogOpenTime
            if (timeSinceOpen < 500) {
                return
            }
            this.showHelpDialog = false
            this.currentHelpType = ''
            // 恢复body滚动
            document.body.style.overflow = ''
        },
        // 初始化趋势图表
        initTrendChart() {
            const chartDom = this.$refs.trendChart
            if (!chartDom) return

            this.trendChartInstance = echarts.init(chartDom)

            // 用于跟踪每年的第一次出现
            const yearFirstOccurrence = {}

            // 在准备数据时就构造好标签
            const xData = this.trendData.map(item => {
                const year = item.year

                // 检查是否是该年的第一次出现
                if (!yearFirstOccurrence[year]) {
                    yearFirstOccurrence[year] = true
                    // 第一次出现，显示月/日和年份（年份在下方）
                    return `{date|${item.date}}\n{year|${year}}`
                }

                // 不是第一次出现，只显示月/日
                return `{date|${item.date}}`
            })

            const yData = this.trendData.map(item => item.value)

            const option = {
                backgroundColor: 'transparent',
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '15%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#787B8F',
                        fontSize: 14,
                        interval: 0,
                        margin: 15,
                        rich: {
                            date: {
                                color: '#787B8F',
                                fontSize: 14,
                                lineHeight: 20
                            },
                            year: {
                                color: '#787B8F',
                                fontSize: 14,
                                lineHeight: 20
                            }
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    show: true,
                    scale: true,
                    boundaryGap: ['10%', '10%'],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            type: 'solid'
                        }
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: [
                    {
                        type: 'line',
                        data: yData,
                        smooth: false,
                        symbol: 'circle',
                        symbolSize: 8,
                        itemStyle: {
                            color: '#5B8FF9'
                        },
                        lineStyle: {
                            color: '#5B8FF9',
                            width: 2
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(91, 143, 249, 0.3)' },
                                { offset: 1, color: 'rgba(91, 143, 249, 0.05)' }
                            ])
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#FFFFFF',
                            fontSize: 14,
                            formatter: '{c}'
                        }
                    }
                ]
            }

            this.trendChartInstance.setOption(option)
        }
    }
}
</script>

<style scoped lang="less">
// 渐变边框 mixin
.gradient-border() {
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 8px;
        padding: 1px; // 边框宽度
        background: linear-gradient(208deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        pointer-events: none;
    }
}

.pc-report {
    // 覆盖全局字体，不使用 PingFang SC
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

    .summary {
        width: 100%;
        height: 155px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(235, 235, 245, 0.16);
        border-radius: 8px;
        box-sizing: border-box;
        padding: 0 40px 0 65px;

        &-left {
            display: flex;
            align-items: center;

            .score-chart {
                width: 110px;
                height: 110px;
            }

            &-content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                margin-left: 60px;

                &-title {
                    font-size: 20px;
                    color: #FFFFFF;
                }

                &-time {
                    display: flex;
                    align-items: center;
                    margin-top: 8px;

                    &>img {
                        width: 16px;
                        height: 16px;
                    }

                    &>span {
                        font-size: 18px;
                        color: #787B8F;
                        margin-left: 8px;
                    }
                }

                &-desc {
                    font-size: 15px;
                    color: #787B8F;
                    margin-top: 8px;
                }
            }
        }

        &-right {
            font-size: 17px;
            color: #787B8F;
            display: flex;
            align-items: center;
            justify-content: center;

            &>img {
                width: 16px;
                object-fit: cover;
                margin-left: 16px;
            }

            &>span:last-child {
                font-size: 32px;
                color: #E45750;
                margin-left: 4px;
            }
        }

    }

    .title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 40px;
        margin-bottom: 16px;

        &-left {
            display: flex;
            align-items: center;

            &>img {
                width: 18px;
                object-fit: cover;
                margin-right: 7px;
            }

            &>span {
                font-size: 20px;
                color: #E5E6EB;
                line-height: 20px;
            }
        }

        &-right {
            // 增大点击区域
            width: 40px;
            height: 40px;
            margin-right: -10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            &>img {
                width: 20px;
                object-fit: cover;
            }
        }
    }

    .card-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }

    .card1 {
        .gradient-border();
        width: calc((100% - 48px) / 4);
        height: 174px;
        border-radius: 8px;
        background: #262627;
        box-sizing: border-box;
        padding: 14px 16px 0 16px;

        &-top {
            display: flex;
            align-items: center;

            &>span {
                font-size: 16px;
                color: #E5E5EA;
                font-weight: 500;
            }

            &>img {
                width: 20px;
                object-fit: cover;
                margin-left: 8px;
            }
        }

        &-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 40px;

            &-value {
                display: flex;
                align-items: center;

                &-left {
                    &>span:first-child {
                        font-size: 24px;
                        color: #FFFFFF;
                        font-weight: bold;
                    }

                    &>span:last-child {
                        font-size: 14px;
                        color: #999999;
                        margin-left: 5px;
                    }

                }

                &-right {
                    display: flex;
                    align-items: center;
                    margin-bottom: -8px;
                    margin-left: 5px;
                    font-size: 14px;
                    color: #787B8F;

                    &>img {
                        width: 16px;
                        object-fit: cover;
                        margin-right: 1px;
                    }
                }
            }

            &>img {
                width: 20px;
                object-fit: cover;
            }
        }

        &-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;

            &>span {
                font-size: 14px;
                color: #999999;
                font-weight: 500;
            }

            &-tag {
                padding: 1px 8px;
                border-radius: 4px;
                font-size: 14px;

                &-red {
                    background: rgba(244, 63, 94, 0.2);
                    border: 1px solid rgba(244, 63, 94, 0.2);
                    color: #F43F5E;
                }

                &-blue {
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    background: rgba(99, 102, 241, 0.2);
                    color: #818CF8;
                }

                &-green {
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    background: rgba(16, 185, 129, 0.2);
                    color: #10B981;
                }
            }
        }
    }

    .card2 {
        .gradient-border();
        width: calc((100% - 34px) / 3);
        height: 174px;
        border-radius: 8px;
        background: #262627;
        box-sizing: border-box;
        padding: 14px 16px 0 16px;

        &-top {
            display: flex;
            align-items: center;
            justify-content: space-between;

            &-left {
                display: flex;
                align-items: center;
                font-size: 16px;
                color: #E5E5EA;
                font-weight: 500;
                height: 24px; // 固定高度，确保中英文标题高度一致

                &>span {
                    line-height: 24px; // 固定行高，与父容器高度一致
                }

                &>img {
                    width: 20px;
                    object-fit: cover;
                    margin-left: 8px;
                }
            }

            &-right {
                width: 20px;
                object-fit: cover;
            }
        }

        &-tag {
            margin-top: 8px;
            padding: 1px 8px;
            width: fit-content;
            border-radius: 4px;
            font-size: 14px;

            &-red {
                background: rgba(244, 63, 94, 0.2);
                border: 1px solid rgba(244, 63, 94, 0.2);
                color: #F43F5E;
            }

            &-blue {
                border: 1px solid rgba(99, 102, 241, 0.2);
                background: rgba(99, 102, 241, 0.2);
                color: #818CF8;
            }

            &-green {
                border: 1px solid rgba(16, 185, 129, 0.2);
                background: rgba(16, 185, 129, 0.2);
                color: #10B981;
            }
        }

        &-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 16px;
            position: relative;
            height: 32px;

            &-value {
                position: absolute;
                display: flex;
                align-items: center;
                // transform 由 inline style 动态控制
                bottom: 100%;
                margin-bottom: -30px;

                &-left {
                    display: flex;
                    align-items: baseline;

                    &>span:first-child {
                        font-size: 24px;
                        color: #FFFFFF;
                        font-weight: bold;
                    }

                    &>span:last-child {
                        font-size: 14px;
                        color: #999999;
                        margin-left: 4px;
                    }
                }

                &-right {
                    display: flex;
                    align-items: center;
                    margin-left: 12px;
                    font-size: 14px;
                    color: #787B8F;

                    &>img {
                        width: 16px;
                        object-fit: cover;
                        margin-right: 1px;
                    }
                }
            }
        }

        &-bottom {
            margin-top: 25px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;

            &>img {
                width: 14px;
                object-fit: cover;
                position: absolute;
                bottom: -1px;
                transform: translateX(-50%);
                z-index: 2;
            }

            &-item {
                width: calc((100% - 10px) / 3);
                height: 5px;
                border-radius: 2.5px;
                background: #3E3E3F;

                &1 {
                    background: #818CF8;
                }

                &2 {
                    background: #10B981;
                }

                &3 {
                    background: #F43F5E;
                }
            }
        }

        &-bottom-text {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 15px;
            position: relative;

            &>span {
                font-size: 14px;
                font-weight: 500;
                color: #757575;
                position: absolute;
                transform: translateX(-50%);

                &:first-child {
                    left: 33.33%;
                }

                &:last-child {
                    left: 66.66%;
                }
            }
        }
    }

    .segment {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 40px;

        &-item {
            width: calc((100% - 16px) / 2);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            &-title {
                display: flex;
                align-items: center;
                font-size: 20px;
                color: #E5E6EB;

                &>img {
                    width: 20px;
                    object-fit: cover;
                    margin-right: 7px;
                }
            }

            &-content {
                .gradient-border();
                margin-top: 16px;
                width: 100%;
                height: 320px;
                background: #262627;
                border-radius: 8px;
                box-sizing: border-box;
                padding: 12px;

                &-bg {
                    width: 265px;
                    object-fit: cover;
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    top: 50%;
                    z-index: 1;
                }

                &-card {
                    .gradient-border();
                    width: 120px;
                    height: 103px;
                    border-radius: 8px;
                    background: transparent;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    box-sizing: border-box;

                    &>span:first-child {
                        font-size: 16px;
                        color: #C7C7CC;
                    }

                    &-value {
                        margin: 8px 0;

                        &>span:first-child {
                            font-size: 20px;
                            color: #FFFFFF;
                            font-weight: bold;
                        }

                        &>span:last-child {
                            font-size: 14px;
                            color: #999999;
                            margin-left: 8px;
                        }
                    }

                    &-tag {
                        padding: 1px 8px;
                        border-radius: 4px;
                        font-size: 14px;

                        &-red {
                            color: #F43F5E;
                        }

                        &-blue {
                            color: #818CF8;
                        }

                        &-green {
                            color: #10B981;
                        }
                    }

                    &-center {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 2;
                    }

                    &-top-left {
                        position: absolute;
                        left: 3%;
                        top: 15%;
                        z-index: 2;
                        align-items: flex-start;

                        .segment-item-content-card-value {
                            align-self: flex-start;
                        }

                        .segment-item-content-card-tag {
                            align-self: flex-start;
                            justify-content: flex-start;
                        }
                    }

                    &-top-right {
                        position: absolute;
                        right: 3%;
                        top: 15%;
                        z-index: 2;
                        align-items: flex-end;

                        .segment-item-content-card-value {
                            align-self: flex-end;
                            text-align: right;
                        }

                        .segment-item-content-card-tag {
                            align-self: flex-end;
                            justify-content: flex-end;
                        }
                    }

                    &-bottom-left {
                        position: absolute;
                        left: 3%;
                        bottom: 15%;
                        z-index: 2;
                        align-items: flex-start;

                        .segment-item-content-card-value {
                            align-self: flex-start;
                        }

                        .segment-item-content-card-tag {
                            align-self: flex-start;
                            justify-content: flex-start;
                        }
                    }

                    &-bottom-right {
                        position: absolute;
                        right: 3%;
                        bottom: 15%;
                        z-index: 2;
                        align-items: flex-end;

                        .segment-item-content-card-value {
                            align-self: flex-end;
                            text-align: right;
                        }

                        .segment-item-content-card-tag {
                            align-self: flex-end;
                            justify-content: flex-end;
                        }
                    }
                }
            }
        }
    }

    .adjust {
        .gradient-border();
        width: 100%;
        height: 250px;
        background: #262627;
        border-radius: 8px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        padding: 16px;
        gap: 53px;

        &-item {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start; // 确保左对齐

            &-title {
                font-size: 16px;
                color: #C7C7CC;
                width: 100%; // 占满宽度
                text-align: left; // 文字左对齐
            }

            &-row {
                display: flex;
                align-items: center;
                margin-top: 16px;
            }

            &-val {
                font-size: 24px;
                color: #FFFFFF;
                font-weight: bold;
            }

            &-unit {
                font-size: 14px;
                color: #787B8F;
                margin-left: 8px;
                margin-top: 6px;
            }

            &-tag {
                margin-left: 27px;
                padding: 1px 8px;
                border-radius: 4px;
                font-size: 14px;

                &-red {
                    background: rgba(244, 63, 94, 0.2);
                    border: 1px solid rgba(244, 63, 94, 0.2);
                    color: #F43F5E;
                }

                &-blue {
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    background: rgba(99, 102, 241, 0.2);
                    color: #818CF8;
                }

                &-green {
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    background: rgba(16, 185, 129, 0.2);
                    color: #10B981;
                }
            }

            .adjust-chart {
                flex: 1;
                position: relative;
                margin-top: 23px;
                width: 100%;

                .chart-line {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background: #3E3E3F;
                    z-index: 0;

                    &.line-1 {
                        top: 20%;
                    }

                    &.line-2 {
                        top: 50%;
                    }

                    &.line-3 {
                        top: 80%;
                    }
                }

                .chart-svg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 2;
                }

                .chart-dot {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 3;
                }

                .chart-label {
                    position: absolute;
                    font-size: 14px;
                    color: #757575;
                    white-space: nowrap;
                    z-index: 3;

                    // 测量值标签
                    &.label-measured {
                        left: 35%;
                        transform: translateX(-50%);

                        // 向左倾斜：测量值在左上方
                        &.left {
                            bottom: 80%;
                            margin-bottom: 12px;
                        }

                        // 向右倾斜：测量值在左下方
                        &.right {
                            top: 80%;
                            margin-top: 12px;
                        }
                    }

                    // 理想值标签
                    &.label-ideal {
                        left: 65%;
                        transform: translateX(-50%);
                        display: flex;
                        align-items: center;

                        img {
                            width: 16px;
                            object-fit: cover;
                            margin-left: 11px;
                        }

                        // 向左倾斜：理想值在右下方
                        &.left {
                            top: 80%;
                            margin-top: 12px;
                        }

                        // 向右倾斜：理想值在右上方
                        &.right {
                            bottom: 80%;
                            margin-bottom: 12px;
                        }
                    }
                }
            }
        }
    }

    .tip {
        font-size: 16px;
        color: #787B8F;
        padding: 16px 0;
        text-align: left;
    }

    // 趋势弹窗样式
    .trend-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .trend-dialog {
        width: 800px;
        height: 450px;
        background: #262628;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 24px 32px;
        box-sizing: border-box;
        position: relative;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &-title {
            display: flex;
            align-items: center;

            img {
                width: 24px;
                height: 24px;
                object-fit: contain;
                margin-right: 10px;
            }

            span:first-of-type {
                font-size: 20px;
                color: #FFFFFF;
                font-weight: 500;
            }
        }

        &-unit {
            font-size: 16px;
            color: #787B8F;
            margin-left: 8px;
        }

        &-close {
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.7;
            }
        }

        &-chart {
            width: 100%;
            height: calc(100% - 50px);
            margin-top: 16px;
        }
    }

    // 帮助弹窗样式
    .help-dialog {
        width: 900px;
        max-height: 80vh;
        background: #262628;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 30px 40px;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }

        &-title {
            display: flex;
            align-items: center;

            img {
                width: 20px;
                object-fit: contain;
                margin-right: 8px;
            }

            span {
                font-size: 21px;
                color: #E5E6EB;
            }
        }

        &-close {
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.7;
            }
        }

        &-content {
            margin-top: 24px;
            overflow-y: auto;
            flex: 1;

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
            }
        }

        &-item {
            margin-bottom: 24px;

            &:last-child {
                margin-bottom: 0;
            }

            &-title {
                display: flex;
                align-items: center;
                margin-bottom: 8px;

                span {
                    font-size: 16px;
                    color: #C7C7CC;
                }

                img {
                    width: 16px;
                    margin-left: 8px;
                }
            }

            &-desc {
                font-size: 14px;
                color: #8E8E93;
                margin-top: 9px;
                text-align: left;
            }
        }
    }

    // 弹窗动画
    .dialog-fade-enter-active,
    .dialog-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .dialog-fade-enter,
    .dialog-fade-leave-to {
        opacity: 0;
    }

    .dialog-zoom-enter-active,
    .dialog-zoom-leave-active {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .dialog-zoom-enter,
    .dialog-zoom-leave-to {
        transform: scale(0.9);
        opacity: 0;
    }

    // 骨架屏样式
    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    .skeleton-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .skeleton-adjust {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .skeleton-line {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.05) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
    }

    .skeleton-title {
        width: 60%;
        height: 20px;
    }

    .skeleton-value {
        width: 80%;
        height: 28px;
    }

    .skeleton-range {
        width: 100%;
        height: 21px;
    }

    .skeleton-tag {
        width: 50px;
        height: 21px;
    }

    .skeleton-bar {
        width: 100%;
        height: 5px;
        margin-top: auto;
    }

    .skeleton-chart {
        flex: 1;
        min-height: 80px;
    }
}
</style>
