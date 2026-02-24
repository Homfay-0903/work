<template>
    <!-- 智眠报告 -->
    <div>
        <div class="pillow-report-wrap" v-if="reportData != null">
            <div class="model-block">
                <div class="model-box">
                    <pillow
                        v-if="isSupportWebgl.webgl"
                        class="measure-model"
                        ref="model"
                        @modelRotate="modelRotate"
                    ></pillow>
                    <!-- 判断浏览器支持 -->
                    <version-tip
                        v-else
                        :tipMsg="isSupportWebgl.tipMsg"
                        :title="isSupportWebgl.title"
                        msgStyle="msg-style"
                        :class="{ 'no-bs-data': notComposition || centerModel }"
                    ></version-tip>
                </div>
                <div class="model-data">
                    <div class="model-options ">
                        <img
                            @click="rotateModel(1)"
                            src="../../../assets/images/new-report/pillow-report/arrow-left.png"
                        />
                        <div>{{ angleMap[slideIdx].label }}</div>
                        <img
                            @click="rotateModel(-1)"
                            src="../../../assets/images/new-report/pillow-report/arrow-right.png"
                        />
                    </div>
                    <div class="model-info-list">
                        <div v-for="(item, i) in angleMap[slideIdx].items" :key="i">
                            <label>{{ item.name }}</label>
                            <div>
                                <span>{{ reportData.measurements[item.key].toFixed(1) }}</span>
                                <span>cm</span>
                            </div>
                        </div>

                        <img
                            :src="
                                require(`../../../assets/images/new-report/pillow-report/${angleMap[slideIdx].imgName}.png`)
                            "
                        />
                    </div>
                </div>
                <img src="../../../assets/images/new-report/pillow-report/grid.png" />
            </div>
            <div class="hd">
                <img src="../../../assets/images/new-report/pillow-report/icon-hd.png" />
                <span>颈脊分析</span>
            </div>
            <div class="block analysis block1">
                <div class="summary">
                    <div class="summary-left">
                        <div>颈脊结构异常评估</div>
                        <!-- <div>整体评分：{{ Math.round(reportData.spineScore) }}分</div> -->
                        <div class="status-label" :class="`status-${reportData.spineStatus}`">
                            {{ statusMap[reportData.spineStatus] }}
                        </div>
                    </div>
                    <!-- <div class="score-chart">
                        <div id="chart-box"></div>
                    </div> -->
                </div>
                <div class="result-desc">
                    <img src="../../../assets/images/new-report/pillow-report/icon-result.png" />
                    <span>{{ reportStatusText }}</span>
                </div>
                <div class="item-box">
                    <div class="item">
                        <div class="item-hd">
                            <div class="item-name">
                                <img src="../../../assets/images/new-report/pillow-report/neck.png" />
                                <span>
                                    颈椎结构异常评分
                                </span>
                            </div>
                            <div class="status-label" :class="`status-${reportData.cervicalStatus}`">
                                {{ statusMap[reportData.cervicalStatus] }}
                            </div>
                        </div>
                        <div class="progress-box">
                            <!-- <div
                                class="progress-score"
                                :class="'status-'+reportData.cervicalStatus"
                                :style="{
                                    left: calcProgressWidth(reportData.cervicalStatus, reportData.cervicalScore)
                                }"
                            >
                                <span>{{ Math.round(reportData.cervicalScore) }}</span>
                                分
                            </div> -->
                            <processBar :nums="interval" :currentNum="reportData.cervicalScore" :list="statusMapArray"> </processBar>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item-hd">
                            <div class="item-name">
                                <img src="../../../assets/images/new-report/pillow-report/bust.png" />
                                <span>
                                    胸椎结构异常评分
                                </span>
                            </div>
                            <div class="status-label" :class="`status-${reportData.thoracicStatus}`">
                                {{ statusMap[reportData.thoracicStatus] }}
                            </div>
                        </div>
                        <div class="progress-box">
                            <!-- <div
                                class="progress-score"
                                :class="'status-'+reportData.thoracicStatus"
                                :style="{
                                    left: calcProgressWidth(reportData.thoracicStatus, reportData.thoracicScore)
                                }"
                            >
                                <span>{{ Math.round(reportData.thoracicScore) }}</span>
                                分
                            </div> -->
                            <processBar :nums="interval" :currentNum="reportData.thoracicScore" :list="statusMapArray"> </processBar>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item-hd">
                            <div class="item-name">
                                <img src="../../../assets/images/new-report/pillow-report/waist.png" />
                                <span>
                                    腰椎结构异常评分
                                </span>
                            </div>
                            <div class="status-label" :class="`status-${reportData.lumbarStatus}`">
                                {{ statusMap[reportData.lumbarStatus] }}
                            </div>
                        </div>
                        <div class="progress-box">
                            <!-- <div
                                class="progress-score"
                                :class="'status-'+reportData.lumbarStatus"
                                :style="{ left: calcProgressWidth(reportData.lumbarStatus, reportData.lumbarScore) }"
                            >
                                <span>{{ Math.round(reportData.lumbarScore) }}</span>
                                分
                            </div> -->
                            <processBar :nums="interval" :currentNum="reportData.lumbarScore" :list="statusMapArray"> </processBar>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hd">
                <img src="../../../assets/images/new-report/pillow-report/icon-hd.png" />
                <span>推荐原理</span>
            </div>
            <div class="block recommend-data" :class="{ half: !answers }">
                <template v-if="!!answers">
                    <div class="sub-hd">
                        <img src="../../../assets/images/new-report/pillow-report/icon-qa.png" />
                        <span>问卷信息</span>
                    </div>
                    <div class="data-box">
                        <div class="data-item">
                            <img src="../../../assets/images/new-report/pillow-report/rec-icon-1.png" />
                            <div class="data-title">
                                主睡姿
                            </div>
                            <div class="data-content">
                                {{ QA_MAP['sleep_position'][answers['sleep_position']] }}
                            </div>
                        </div>
                        <div class="data-item">
                            <img src="../../../assets/images/new-report/pillow-report/rec-icon-2.png" />
                            <div class="data-title">
                                床垫硬度
                            </div>
                            <div class="data-content">
                                {{ QA_MAP['mattress_firmness'][answers['mattress_firmness']] }}
                            </div>
                        </div>
                        <div class="data-item" v-if="answers['neck_shoulder_issue']">
                            <img src="../../../assets/images/new-report/pillow-report/rec-icon-3.png" />
                            <div class="data-title">
                                肩颈不适
                            </div>
                            <div class="data-content">
                                {{ QA_MAP['neck_shoulder_issue'][answers['neck_shoulder_issue']] }}
                            </div>
                        </div>
                        <div class="data-item" v-if="answers['improvement']">
                            <img src="../../../assets/images/new-report/pillow-report/rec-icon-4.png" />
                            <div class="data-title">
                                睡眠问题
                            </div>
                            <div class="data-content">
                                {{ QA_MAP['improvement'][answers['improvement']] }}
                            </div>
                        </div>
                        <div class="data-item" v-if="answers['neck_curvature']">
                            <img src="../../../assets/images/new-report/pillow-report/rec-icon-v1.png" />
                            <div class="data-title">
                                颈椎诊断史
                            </div>
                            <div class="data-content">
                                {{ QA_MAP['neck_curvature'][answers['neck_curvature']] }}
                            </div>
                        </div>
                        <div class="data-item" v-if="answers['neck_curvature_Q1']">
                            <img src="../../../assets/images/new-report/pillow-report/rec-icon-v2.png" />
                            <div class="data-title">
                                {{SUP_QUESTTONS['neck_curvature_Q1'][answers['neck_curvature_Q1']]}}
                            </div>
                            <div class="data-content">
                                {{ QA_MAP['neck_curvature_Q1'][answers['neck_curvature_Q1']] }}
                            </div>
                        </div>
                    </div>
                    <!-- 睡姿 -->
                    <div class="data-box">
                        <div class="data-item" v-if="answers['neck_curvature_Q2']">
                            <img src="../../../assets/images/new-report/pillow-report/rec-icon-v3.png" />
                            <div class="data-title">
                                 {{SUP_QUESTTONS['neck_curvature_Q2'][answers['neck_curvature_Q2']]}}
                            </div>
                            <div class="data-content">
                                {{ QA_MAP['neck_curvature_Q2'][answers['neck_curvature_Q2']] }}
                            </div>
                        </div>
                    </div>
                </template>
                <div class="sub-hd">
                    <img src="../../../assets/images/new-report/pillow-report/icon-data.png" />
                    <span>测量数据</span>
                </div>
                <div class="data-box data-box-test">
                    <div class="data-item">
                        <img src="../../../assets/images/new-report/pillow-report/rec-icon-5.png" />
                        <div class="data-title">
                            单侧肩宽
                        </div>
                        <div class="data-content">{{ (reportData.measurements.shoulderWidth / 2).toFixed(1) }}cm</div>
                    </div>
                    <div class="data-item">
                        <img src="../../../assets/images/new-report/pillow-report/rec-icon-6.png" />
                        <div class="data-title">
                            颈深
                        </div>
                        <div class="data-content">{{ reportData.measurements.neckDepth }}cm</div>
                    </div>
                    <div class="data-item">
                        <img src="../../../assets/images/new-report/pillow-report/rec-icon-7.png" />
                        <div class="data-title">
                            头重
                        </div>
                        <div class="data-content">{{ reportData.headWeight }}kg</div>
                    </div>
                    <!-- <div class="data-item">
                        <img src="../../../assets/images/new-report/pillow-report/rec-icon-8.png" />
                        <div class="data-title">
                            颈椎曲度
                        </div>
                        <div class="data-content">
                            {{ CERVICAL_CURVE_MAP[reportData.cervicalCurve] || '' }}
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="block recommend-refs" :class="{ 'show-refs': showRefsAll }">
                <div class="title">数据-枕高匹配标准</div>
                <div class="refs-box">
                    <img
                        src="https://visbodyfit-test.obs.cn-north-4.myhuaweicloud.com/lyf/%E6%9E%95%E5%A4%B4%E4%B8%8D%E5%90%8C%E6%AF%94%E4%BE%8B%E5%9B%BE%E7%89%87/55%402x.png"
                    />
                    <div class="refs-item" v-for="item in pillowHeightRefs" :key="item.height">
                        <template v-if="item.height === reportData.pillowRecommendHeight">
                            <div>
                                <img src="../../../assets/images/new-report/pillow-report/ph-star.png" />
                                <span>{{ item.height }}</span>
                            </div>
                            <img class="refs-item-bg" :src="item.img" />
                        </template>
                    </div>
                </div>
                <div class="recommend-ref-mask" @click="showRefs" v-if="!showRefsAll">
                    <span>点击查看</span>
                    <span>完整匹配标准</span>
                </div>
            </div>
            <div class="block recommend-plan">
                <div class="title">AI 枕头高度定制方案</div>
                <div class="recommend-height">
                    <span> {{ reportData.pillowRecommendHeight }}cm </span>
                    <img src="../../../assets/images/new-report/pillow-report/star.png" />
                </div>
                <img src="../../../assets/images/new-report/pillow-report/product-demo.png" />
            </div>
            <div class="hd">
                <img src="../../../assets/images/new-report/pillow-report/icon-hd.png" />
                <span>为您推荐</span>
            </div>
            <div class="block product-item-box" v-for="(item, index) in reportData.pillowRecommendProducts" :key="item.productCode">
                <div class="product-item">
                    <img
                    :src="
                        item.image ? item.image : require('../../../assets/images/new-report/pillow-report/pillow.png')
                    "/>
                    <div>
                        <div class="product-name">
                            {{ item.productName }}
                        </div>
                        <div class="product-match">
                            <span v-if="index === 0">最佳匹配：
                                <span>{{ item.matchScore.toFixed(1) }}%</span>
                            </span>
                            <span v-else>匹配度：
                                <span>{{ item.matchScore.toFixed(1) }}%</span>
                            </span>
                            <img :style="{width: index === 1 ? isDeviceReport ? '25px' : '10px': ''}" src="../../../assets/images/new-report/pillow-report/star.png" />
                        </div>
                        <div class="product-material">
                            {{ item.productCode }} | {{ MATERIAL_MAP[item.mainMaterial] || '' }}
                        </div>
                        <div class="product-desc">
                            {{ item.description }}
                        </div>
                        <div class="product-dz">
                            <div @click="onHandler(item.id, 1)" :class="['like', {'selectLike': item.userHealthData === 1, 'selectBadLike': item.userHealthData === 2}]">
                                <svg width="9px" height="10px" viewBox="0 0 9 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <title>hand.thumbsup.fill</title>
                                    <g id="详情页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="新增智眠报告-枕头推荐1" transform="translate(-193, -372)" fill-rule="nonzero">
                                            <g id="编组-42" transform="translate(15, 183)">
                                                <g id="编组-20备份-10" transform="translate(0, 33)">
                                                    <g id="编组-37" transform="translate(162, 150)">
                                                        <g id="编组-38" transform="translate(16, 4)">
                                                            <g id="hand.thumbsup.fill" transform="translate(0, 2)">
                                                                <rect id="矩形" fill="#000000" opacity="0" x="0" y="0" width="9" height="10"></rect>
                                                                <path d="M0,6.684082 C0,8.09029703 0.829181923,9.26841015 1.94073659,9.26841015 L2.7295802,9.26841015 C1.92280488,8.6460796 1.59113486,7.70545713 1.59113486,6.63660333 C1.59561435,5.44895557 2.03037676,4.59858148 2.41583271,4.08551998 L1.77489928,4.08551998 C0.775395984,4.08551998 0,5.22566961 0,6.684082 Z M2.2096571,6.64608933 C2.2096571,8.38008231 3.48704907,9.71974937 5.57122095,9.71974937 L6.18077045,9.71974937 C6.75897274,9.71974937 7.18925107,9.67698939 7.43126256,9.60572274 C7.7808551,9.51543543 8.11700001,9.2874308 8.11700001,8.8408589 C8.11700001,8.65561426 8.07220517,8.52256696 8.01841464,8.4228423 C7.98256958,8.36106165 7.99151937,8.31353434 8.0453099,8.28979501 C8.32321234,8.16628236 8.55177619,7.89075042 8.55177619,7.51544516 C8.55177619,7.30169386 8.49353371,7.11163325 8.39490244,6.98340192 C8.34560976,6.91213528 8.3501076,6.84563595 8.43524534,6.79810864 C8.63246198,6.67459599 8.77588809,6.40855005 8.77588809,6.09979277 C8.77588809,5.87650682 8.70864993,5.64373486 8.59211909,5.52970822 C8.52042898,5.4632089 8.53387661,5.41568158 8.60556672,5.34441493 C8.74449499,5.22090229 8.83413057,5.00715099 8.83413057,4.73635232 C8.83413057,4.28029441 8.49798566,3.90499402 8.05425969,3.90499402 L6.47657246,3.90499402 C6.07768723,3.90499402 5.81323243,3.68646566 5.81323243,3.33492406 C5.81323243,2.70309292 6.5617561,1.53444636 6.5617561,0.698340192 C6.5617561,0.256532695 6.29280345,0 5.94321091,0 C5.62051363,0 5.46363989,0.23277974 5.29331851,0.589076015 C4.62548064,1.96199761 3.73804247,3.07364058 3.06125022,4.02375879 C2.48754577,4.83136316 2.2096571,5.52970822 2.2096571,6.64608933 Z" id="形状" fill-opacity="0.85" :fill="disLikeColor(item.userHealthData)"></path>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <!-- <span v-if="item.userHealthData===1">
                                    已喜欢
                                </span> -->
                                <span>
                                    喜欢
                                </span>
                            </div>
                            <div @click="onHandler(item.id, 2)" :class="['bad', {'selectLike': item.userHealthData === 2, 'badLike1': item.userHealthData === 1}]">
                                <svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <title>hand.thumbsdown.fill</title>
                                    <g id="详情页" stroke="none" stroke-width="1" fill-rule="evenodd">
                                        <g id="新增智眠报告-枕头推荐1" transform="translate(-270, -372)" fill-rule="nonzero">
                                            <g id="编组-42" transform="translate(15, 183)">
                                                <g id="编组-20备份-10" transform="translate(0, 33)">
                                                    <g id="编组-37" transform="translate(162, 150)">
                                                        <g id="编组-40" transform="translate(84, 0)">
                                                            <g id="编组-39" transform="translate(9, 4)">
                                                                <g id="hand.thumbsdown.fill" transform="translate(0, 2)">
                                                                    <rect id="矩形" fill="#000000" opacity="0" x="0" y="0" width="10" height="10"></rect>
                                                                    <path d="M9.8156595,3.11872411 C9.8156595,1.67421081 8.8889059,0.46394551 7.65821751,0.46394551 L6.78126084,0.46394551 C7.67811588,1.1032377 8.07674646,2.06950143 8.05679708,3.16752203 C8.04184779,4.38754991 7.55857262,5.2610801 7.12504337,5.78813758 L7.84255801,5.78813758 C8.95365212,5.78813758 9.8156595,4.61691261 9.8156595,3.11872411 Z M7.38913039,3.15288515 C7.41902896,1.37164374 5.94420294,0.0247360715 3.62730872,0.00521565531 L2.95466234,0.000335536777 C2.30692463,-0.00454456776 1.82859854,0.0442564876 1.55954203,0.117457811 C1.17090145,0.21017985 0.797210147,0.439545052 0.797210147,0.90315375 C0.797210147,1.08860083 0.847037695,1.23012228 0.906824629,1.3326054 C0.946687688,1.3911629 0.941702892,1.44484811 0.876931162,1.46924457 C0.572996388,1.59125186 0.313901304,1.87917706 0.313901304,2.2598258 C0.313901304,2.48430621 0.378675075,2.67463058 0.493273842,2.81127474 C0.548082614,2.88447911 0.538118125,2.94791891 0.44843058,3.00159911 C0.22421529,3.12848369 0.0647732607,3.40176702 0.0647732607,3.71897597 C0.0647732607,3.94833867 0.139512031,4.18746596 0.269058552,4.30458595 C0.353761811,4.37290804 0.338814057,4.42171095 0.254110798,4.49491032 C0.0996510133,4.6217949 0,4.84139802 0,5.11955864 C0,5.58804863 0.37369232,5.97358466 0.866966673,5.97358466 L2.620829,5.97358466 C3.06427682,5.97358466 3.35824711,6.19806008 3.35824711,6.55920964 C3.35824711,7.20824942 2.53114349,8.40388584 2.53114349,9.26275917 C2.53114349,9.72150456 2.82511378,9.98500832 3.21873406,9.98500832 C3.57249638,9.98500832 3.74688769,9.74589103 3.93622319,9.37989416 C4.67862609,7.96952691 5.66516664,6.82761068 6.41752893,5.84670508 C7.05529705,5.01706553 7.36923203,4.30458595 7.38913039,3.15288515 Z" id="形状" fill-opacity="0.85" :fill="disBadColor(item.userHealthData)"></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                不喜欢
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="block footer">
                <div>
                    <img src="../../../assets/images/new-report/pillow-report/tips.png" />
                    <span>贴心提示</span>
                </div>
                <p>感谢体验系统为您科学适配的枕头，若您在试用中感到任何不适，请随时联系客房中心，我们将立即为您调整或更换，您的睡眠体验是我们最重视的事。</p>
            </div>
        </div>
        <div class="pillow-report-wrap center" v-else>
            <mt-spinner type="fading-circle" class="loading-box"></mt-spinner>
        </div>
    </div>
</template>
<script>
import { getPillowReportData, submitLike } from '@/assets/js/apolloGql.js'
import processBar from '../../public/processBar.vue'
import * as echarts from 'echarts'
import isSupportWebgl from '@/assets/js/webgl.js'
import Pillow from '@/components/model/new-report/Pillow.vue'
import VersionTip from '@/components/model/VersionTip.vue'
const COLOR_MAP = {
    0: '#34c759',
    1: '#ffcc00',
    2: '#ff9f0a',
    3: '#ff453a'
}
const TEXT_MAP = {
    cervical: {
        0: '头部姿态和颈椎排列基本正常',
        1: '存在明显的头部前倾或侧歪，颈椎排列轻度偏移',
        2: '头部明显前倾或侧歪，颈椎排列中度偏移',
        3: '头部严重前倾或侧歪，颈椎排列严重偏移'
    },
    thoracic: {
        0: '胸椎排列基本正常，无明显结构异常',
        1: '胸椎排列轻度偏移，可能对生活质量有轻微影响',
        2: '胸椎排列中度偏移，可能影响姿势和生活质量',
        3: '胸椎排列严重偏移，生物力线显著异常，可能造成疼痛及其他继发性问题'
    },
    lumbar: {
        0: '腰椎排列正常，姿势平衡，无明显结构异常',
        1: '腰椎排列轻度偏移，生物力线尚可，但长期可能引发姿势代偿',
        2: '腰椎排列中度偏移，生物力线偏倚，可能影响姿势和生活质量',
        3: '腰椎排列严重偏移，生物力线显著异常'
    }
}
const QA_MAP = {
    // eslint-disable-next-line camelcase
    sleep_position: {
        supine: '仰睡',
        side: '侧睡',
        flat: '俯睡'
    },
    // eslint-disable-next-line camelcase
    mattress_firmness: {
        soft: '软床',
        medium: '适中',
        hard: '硬床',
        none: '我不清楚'
    },
    // eslint-disable-next-line camelcase
    neck_shoulder_issue: {
        yes: '有',
        no: '无'
    },
    improvement: {
        // eslint-disable-next-line camelcase
        asleep_hard: '入睡困难',
        // eslint-disable-next-line camelcase
        light_sleep: '睡眠中易醒',
        exhaustion: '睡醒后疲惫',
        // eslint-disable-next-line camelcase
        neck_hurt: '颈肩酸痛',
        none: '无'
    },
    // eslint-disable-next-line camelcase
    neck_curvature: {
        normal: '正常',
        straightened: '变直',
        reversed: '反弓',
        no: '未检查'
    },
    // eslint-disable-next-line camelcase
    neck_curvature_Q1: {
        A: '低头加重',
        B: '仰头加重',
        C: '无明显不适',
    },
    // eslint-disable-next-line camelcase
    neck_curvature_Q2: {
        A: '有空隙',
        B: '贴合床面',
        C: '被顶着',
    },

}
const CERVICAL_CURVE_MAP = {
    straightened: '变直',
    normal: '正常',
    reversed: '反弓'
}
const MATERIAL_MAP = {
    latex: '乳胶',
    // eslint-disable-next-line camelcase
    memory_foam: '记忆棉'
}

const SUP_QUESTTONS = {
    // eslint-disable-next-line camelcase
    neck_curvature_Q1: {
        A: '变直',
        B: '反弓',
        C: '正常',
    },
    // eslint-disable-next-line camelcase
    neck_curvature_Q2: {
        A: '正常',
        B: '变直',
        C: '反弓',
    },
}
export default {
    components: {
        processBar,
        Pillow,
        VersionTip
    },
    props: {
        isShow: Boolean,
        scanId: String,
        answers: Object | null
    },
    data() {
        return {
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport'),
            QA_MAP,
            CERVICAL_CURVE_MAP,
            MATERIAL_MAP,
            SUP_QUESTTONS,
            slideIdx: 0,
            statusMapArray: ['正常', '轻度异常', '中度异常', '重度异常'],
            statusMap: {
                0: '正常',
                1: '轻度异常',
                2: '中度异常',
                3: '重度异常'
            },
            angleMap: {
                0: {
                    label: '正面',
                    angle: 0,
                    items: [{ key: 'headNeckHeight', name: '头颈高 L7' }, { key: 'headBackHeight', name: '头背高 L8' }],
                    imgName: 'view-front'
                },
                1: {
                    label: '左侧面',
                    angle: Math.PI / 2,
                    items: [
                        { key: 'headBackDistance', name: '头背距 L4' },
                        { key: 'neckDepth', name: '颈深 L5' },
                        { key: 'backDepth', name: '背深 L6' }
                    ],
                    imgName: 'view-side'
                },
                2: {
                    label: '背面',
                    angle: Math.PI,
                    items: [
                        { key: 'earWidth', name: '耳宽 L1' },
                        { key: 'neckWidth', name: '颈宽 L2' },
                        { key: 'shoulderWidth', name: '肩宽 L3' }
                    ],
                    imgName: 'view-back'
                },
                3: {
                    label: '右侧面',
                    angle: -Math.PI / 2,
                    items: [
                        { key: 'headBackDistance', name: '头背距 L4' },
                        { key: 'neckDepth', name: '颈深 L5' },
                        { key: 'backDepth', name: '背深 L6' }
                    ],
                    imgName: 'view-side'
                }
            },
            isSupportWebgl,
            showRefsAll: false,
            interval: [0, 6, 16, 31, 50],
            reportData: null,
            pillowHeightRefs: [
                { height: 6, img: require('../../../assets/images/new-report/pillow-report/ph-7-g.png') },
                { height: 7, img: require('../../../assets/images/new-report/pillow-report/ph-7-g.png') },
                { height: 8, img: require('../../../assets/images/new-report/pillow-report/ph-7-g.png') },
                { height: 9, img: require('../../../assets/images/new-report/pillow-report/ph-9-g.png') },
                { height: 10, img: require('../../../assets/images/new-report/pillow-report/ph-7-g.png') },
                { height: 11, img: require('../../../assets/images/new-report/pillow-report/ph-9-g.png') },
                { height: 12, img: require('../../../assets/images/new-report/pillow-report/ph-7-g.png') }
            ],
            isOnSubmit: false
        }
    },
    computed: {
        reportStatusText() {
            if (this.reportData.cervicalStatus + this.reportData.thoracicStatus + this.reportData.lumbarStatus === 0) {
                return '脊柱整体排列基本正常'
            } else {
                const arr = [
                    { label: 'cervical', status: this.reportData.cervicalStatus },
                    { label: 'thoracic', status: this.reportData.thoracicStatus },
                    { label: 'lumbar', status: this.reportData.lumbarStatus }
                ].sort((a, b) => b.status - a.status)
                return TEXT_MAP[arr[0].label][arr[0].status]
            }
        }
    },
    watch: {
        isShow: {
            handler(newVal) {
                if (newVal && !this.reportData) {
                    this.fetchData(1)
                }
            }
        }
    },
    mounted() {
        this.fetchData(0)
    },
    methods: {
        disLikeColor(type) {
            switch (type) {
                case 0:
                    return '#ffffff'
                case 1:
                    return '#ffffff'
                case 2:
                    return '#AEAEB2'
            }
        },
        disBadColor(type) {
            switch (type) {
                case 0:
                    return '#ffffff'
                case 1:
                    return '#AEAEB2'
                case 2:
                    return '#ffffff'
            }
        },
        onHandler(id, type) {
            if (this.isOnSubmit) {
                return
            }
            this.isOnSubmit = true
            this.$apollo
                .query({
                    query: submitLike,
                    variables: {
                        id: id,
                        userHealthData: type
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.submitLike
                    if (data.code === 200) {
                        this.reportData.pillowRecommendProducts.forEach(item => {
                            if (item.id === id) {
                                item.userHealthData = type
                            }
                        })
                        this.isOnSubmit = false
                    }
                })
        },
        fetchData(retry) {
            this.$apollo
                .query({
                    query: getPillowReportData,
                    variables: {
                        scanId: this.scanId,
                        sleepPosition: this.answers ? this.answers.sleep_position : '',
                        mattressFirmness: this.answers ? this.answers.mattress_firmness : '',
                        neckCurvature: this.answers ? this.answers.neck_curvature ? this.answers.neck_curvature : '' : '',
                        neckCurvatureQ1: this.answers ? this.answers.neck_curvature_Q1 ? this.answers.neck_curvature_Q1 : '' : '',
                        neckCurvatureQ2: this.answers ? this.answers.neck_curvature_Q2 ? this.answers.neck_curvature_Q2 : '' : '',
                        retry
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const { data } = res.data.getPillowReportData
                    if ((!data || data.status === -1) && this.isShow) {
                        if (retry >= 10) {
                            return
                        }
                        setTimeout(() => {
                            this.fetchData(retry + 1)
                        }, 1000)
                    } else if (data.status === 0) {
                        this.$emit('onError')
                    } else {
                        this.reportData = data
                        this.$nextTick(() => {
                            this.initChart()
                        })
                    }
                })
        },
        showRefs() {
            this.showRefsAll = true
        },
        calcProgressWidth(level, score) {
            // interval: [0, 6, 16, 31, 50],
            const w = this.interval[level + 1] - this.interval[level]
            const percent = ((score - this.interval[level]) / w) * 0.25
            const res = (0.25 * level + percent) * 100
            return res > 85 ? '85%' : res + '%'
        },
        initChart() {
            let chart = echarts.init(document.getElementById('chart-box'))
            let option = {
                xAxis: {
                    type: 'value',
                    show: false,
                    min: -50,
                    max: 50
                },
                grid: {
                    left: '15%',
                    right: '15%',
                    bottom: '2%',
                    top: '2%'
                },
                title: [
                    {
                        text: Math.round(this.reportData.spineScore) + '分',
                        x: 'center',
                        top: this.isDeviceReport ? '42%' : '39%',
                        textStyle: {
                            fontSize: this.isDeviceReport ? 32 : 14,
                            color: '#8AA3BE',
                            fontWeight: '600'
                        }
                    }
                ],
                series: [
                    {
                        name: 'circle',
                        type: 'pie',
                        clockWise: true,
                        roundCap: true,
                        radius: ['53%', '66%'],
                        hoverAnimation: false,
                        data: [
                            {
                                value: this.reportData.spineScore,
                                name: '占比',
                                grouGap: true,
                                itemStyle: {
                                    normal: {
                                        color: COLOR_MAP[this.reportData.spineStatus],
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false,
                                    emphasis: {
                                        show: false
                                    }
                                }
                            },
                            {
                                // 画剩余的刻度圆环
                                name: '',
                                value: this.reportData.spineScore > 50 ? 0 : 50 - this.reportData.spineScore,
                                label: {
                                    show: false
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'rgb(71,79,102)'
                                    }
                                },
                                labelLine: {
                                    show: false,
                                    emphasis: {
                                        show: false
                                    }
                                }
                            }
                        ]
                    }
                ]
            }

            chart.setOption(option)
        },
        rotateModel(val) {
            console.log('val', val)
            this.slideIdx = this.slideIdx + val
            if (this.slideIdx < 0) {
                this.slideIdx = 3
            }
            if (this.slideIdx > 3) {
                this.slideIdx = 0
            }

            this.$refs.model.turnModel(val === 1 ? 1 : 2)
        },
        modelRotate(idx) {
            this.slideIdx = idx
        }
    }
}
</script>

<style lang="less" scoped>
.pillow-report-wrap {
    text-align: left;
    &.center {
        text-align: center;
    }
    .model-block {
        padding: 0 15px;
        margin-top: 30px;
        display: flex;
        position: relative;
        > img {
            width: 100%;
            position: absolute;
            bottom: -15px;
            left: 0;
        }
        .model-box {
            position: relative;
            flex: 1;
            height: 270px;
            margin-top: 20px;
            z-index: 10;
            /deep/ .iframe-template.iframe-box.iframe-left {
                margin-left: 0 !important;
            }
            /deep/.iframe-bottom {
                left: 11%;
            }
        }
        .model-data {
            width: 168px;
            position: relative;
            z-index: 10;
            .model-options {
                padding: 10px 15px 10px;
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                align-items: center;
                color: #ffffff;
                img {
                    width: 20px;
                    height: 20px;
                }
            }
            .model-info-list {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                > div {
                    background: #323454;
                    border-radius: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 8px;
                    height: 40px;
                    padding: 0 10px;

                    &:nth-child(2) {
                        span:first-child {
                            color: #6236ff;
                        }
                    }
                    &:nth-child(3) {
                        span:first-child {
                            color: #b620e0;
                        }
                    }
                    label {
                        // font-weight: bold;
                        font-size: 11px;
                        color: #d1d1d6;
                    }
                    span {
                        font-size: 13px;
                        color: #d1d1d6;
                        &:first-child {
                            margin-right: 2px;
                            // font-weight: bold;
                            font-size: 15px;
                            color: #0a84ff;
                        }
                    }
                }
                img {
                    width: 100%;
                }
            }
        }
    }

    .hd {
        margin: 32px 15px 0;
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
        img {
            width: 16px;
        }
    }
    .block {
        margin-top: 12px;
        background: url(../../../assets/images/new-report/report/bj.png) center no-repeat;
        background-size: 100% 100%;
        width: 353px;
        margin: 12px auto 0;
        padding: 18px 15px;
    }
    .block1 {
        padding: 18px 15px 0;
    }
    .analysis {
        background-image: url(../../../assets/images/new-report/pillow-report/bg-902.png);
        min-height: 430px;
        padding-top: 0;
        .status-label {
            background: rgba(255, 204, 0, 0.34);
            border-radius: 4px;
            display: inline-block;
            font-size: 12px;
            color: #ffcc00;
            padding: 2px 10px;
            &.status-0 {
                background: rgba(48, 209, 88, 0.24);
                color: #34c759;
            }
            &.status-1 {
                background: rgba(255, 204, 0, 0.34);
                color: #ffcc00;
            }
            &.status-2 {
                background: rgba(255, 159, 10, 0.34);
                color: #ff9f0a;
            }
            &.status-3 {
                background: rgba(255, 69, 58, 0.24);
                color: #ff453a;
            }
        }
        .summary {
            // display: flex;
            // justify-content: space-between;
            align-items: center;
            height: 52px;
            padding-top: 18px;
            .summary-left {
                div {
                    display: inline;
                    &:nth-child(1) {
                        font-size: 12px;
                        color: #ffffff;
                    }
                    // &:nth-child(2) {
                    //     font-size: 12px;
                    //     color: #898f99;
                    //     margin: 5px 0 10px;
                    // }
                }
                .status-label{
                    margin-left: 8px;
                    border-radius: 4px;
                }
            }
            .score-chart {
                width: 100px;
                height: 100px;
                #chart-box {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .result-desc {
            background: rgba(50, 52, 84, 0.64);
            color: #fff;
            font-size: 12px;
            padding: 12px;
            display: flex;
            align-items: center;
            margin-top: 5px;
            margin-bottom: 10px;
            img {
                width: 12px;
                margin-right: 10px;
            }
        }
        .item-box {
            .item {
                margin-top: 24px;
                padding-bottom: 26+10px;
                margin-bottom: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                &:last-child {
                    border-bottom: none;
                }
            }
            .item-hd {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .item-name {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    color: #e5e5ea;
                    img {
                        width: 17px;
                        margin-right: 4px;
                    }
                }
            }
        }
        .progress-box {
            position: relative;
            padding-top: 8px;
            .progress-score {
                position: absolute;
                top: 10px;
                color: #aeaeb2;
                font-size: 14px;

                &.status-0 {
                    span {
                        color: #34c759;
                    }
                }
                &.status-1 {
                    span {
                        color: #ffcc00;
                    }
                }
                &.status-2 {
                    span {
                        color: #ff9f0a;
                    }
                }
                &.status-3 {
                    span {
                        color: #ff453a;
                    }
                }
            }
        }
        /deep/ .processBar {
            width: 315px;
            height: 4px;
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            position: relative;

            .processbg {
                width: 316px;
                height: 4px;
                border-radius: 6px;
                margin-left: 1px;
                background-color: #344161;
                position: absolute;
                background: linear-gradient(
                    to right,
                    rgba(45, 160, 104, 1) 0,
                    rgba(234, 176, 77, 1) 25%,
                    rgba(235, 119, 59, 1) 48%,
                    rgba(166, 64, 69, 1) 88%,
                    rgba(166, 64, 69, 1) 100%
                );

                .processbgGray {
                    width: 35px;
                    height: 4px;
                    border-radius: 0 6px 6px 0;
                    position: absolute;
                    background-color: #344161;

                    right: 0;
                    top: 0;
                }
            }

            .processVerLine {
                height: 4px;
                width: 4px;
                background: rgba(8, 20, 59, 1);
                position: absolute;
                top: 0;

                &:nth-child(2) {
                    left: 79px;
                    width: 0;
                }

                &:nth-child(3) {
                    left: 158px;
                }

                &:nth-child(4) {
                    left: 237px;
                }
            }

            ul {
                width: 315px;
                display: flex;
                justify-content: space-between;
                margin-left: 1px;

                li {
                    width: 51px;
                    height: 12px;
                    display: flex;
                    justify-content: space-between;

                    span {
                        font-size: 12px;
                        color: #8aa3be;
                        margin-top: 8px;
                        line-height: 17px;
                        width: 100%;
                        height: 6px;

                        &:nth-child(2) {
                            text-align: right;
                        }
                    }
                }
            }
        }
    }
    .recommend-data {
        min-height: 300px;
        background-image: url(../../../assets/images/new-report/pillow-report/bg-604.png);
        &.half {
            height: 150px;
            background-image: url(../../../assets/images/new-report/pillow-report/bg-304.png);
            .sub-hd {
                margin-top: 0;
            }
        }
        .sub-hd {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #d1d1d6;
            margin-top: 14px;
            img {
                width: 15px;
                margin-right: 4px;
            }
        }
        .data-box {
            display: flex;
            // justify-content: space-around;
            margin-bottom: 20px;
        }
        .data-item {
            width: 25%;
            text-align: center;
            img {
                width: 40px;
            }
            .data-title {
                font-size: 12px;
                color: #aeaeb2;
            }
            .data-content {
                font-size: 13px;
                color: #d1d1d6;
                margin-top: 8px;
            }
        }
        .data-box-test{
             margin-bottom: 10px;
        }
    }
    .recommend-refs {
        text-align: center;
        height: 272px;
        padding: 16px 14px 0;
        background-image: url(../../../assets/images/new-report/pillow-report/bg-546.png);
        &.show-refs {
            height: 480px;
            background-image: url(../../../assets/images/new-report/pillow-report/bg-1168.png);
            .refs-box {
                height: calc(100% - 14px);
                &::after {
                    content: none;
                }
            }
        }
        .refs-box {
            height: calc(100% - 74px);
            overflow: hidden;
            position: relative;
            text-align: center;
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 10px;
                background: linear-gradient(180deg, transparent 0%, #10254e 100%);
            }
            > img {
                width: 321px;
            }
            .refs-item {
                display: flex;
                font-size: 12px;
                color: #c7c7cc;
                // margin-bottom: 10px;
                position: absolute;
                width: 107px;
                left: 3px;
                .refs-item-bg {
                    width: 60px;
                    height: 58px;
                }

                &:nth-child(2) {
                    top: 65px;
                    > div {
                        left: 18px;
                    }
                    // .refs-item-bg {
                    //     width: 51px;
                    // }
                }
                &:nth-child(3) {
                    top: 123px;
                    > div {
                        left: 18px;
                    }
                    // .refs-item-bg {
                    //     width: 66px;
                    // }
                }
                &:nth-child(4) {
                    top: 182px;
                    > div {
                        left: 18px;
                    }
                    // .refs-item-bg {
                    //     width: 84px;
                    // }
                }
                &:nth-child(5) {
                    top: 239px;
                    > div {
                        left: 18px;
                    }
                    .refs-item-bg {
                        height: 34px;
                    }
                }
                &:nth-child(6) {
                    top: 274px;
                    > div {
                        left: 18px;
                    }
                    // .refs-item-bg {
                    //     width: 105px;
                    // }
                }
                &:nth-child(7) {
                    top: 332px;
                    > div {
                        left: 18px;
                    }
                    .refs-item-bg {
                        height: 34px;
                    }
                }
                &:nth-child(8) {
                    top: 365px;
                    > div {
                        left: 18px;
                    }
                    // .refs-item-bg {
                    //     height: 34px;
                    // }
                }
                > div {
                    line-height: 20px;
                    margin-right: 8px;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 1;
                    font-weight: 500;
                    font-size: 18px;
                    color: #e9f0ff;
                    display: flex;
                    align-items: center;
                    img {
                        width: 11px;
                    }
                }
            }
        }
        .title {
            font-weight: 500;
            font-size: 14px;
            color: #c7c7cc;
        }
        .recommend-ref-mask {
            padding: 20px 0;
            font-size: 12px;
            color: #666;
            position: static !important;
            > span {
                &:nth-child(1) {
                    color: #0a84ff;
                }
            }
        }
    }
    .recommend-plan {
        height: 224px;
        padding: 24px 18px 0;
        text-align: center;
        background-image: url(../../../assets/images/new-report/pillow-report/bg-450.png);
        > img {
            width: 100%;
            margin-top: 16px;
        }
        .title {
            font-size: 13px;
            color: #e5e5ea;
        }
        .recommend-height {
            font-weight: 500;
            font-size: 24px;
            margin-top: 16px;
            > span {
                background: linear-gradient(90deg, #006aff 0%, #ca55e0 100%);
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
            }
            img {
                width: 10px;
                vertical-align: top;
            }
        }
    }
    .product-item-box{
        background-image: url(../../../assets/images/new-report/pillow-report/bg-304.png);
        // height: 188px;
        padding: 14px;

    }
    .product-item {
        display: flex;
        > img {
            display: inline-block;
            margin-top: 6%;
            width: 124px;
            height: 115px;
            margin-right: 25px;
            flex-shrink: 0;
        }
        > div {
            width: 0;
            flex: 1;
        }
        .product-name {
            font-weight: 500;
            font-size: 14px;
            color: #ffffff;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .product-match {
            background: linear-gradient(180deg, #007aff 0%, #00c7be 100%);
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            margin-top: 12px;
            > span {
                font-size: 12px;
                span {
                    font-size: 14px;
                }
            }
            img {
                width: 12px;
            }
        }
        .product-material {
            font-weight: 400;
            font-size: 12px;
            color: #ffffff;
            margin-top: 12px;
        }
        .product-desc {
            font-size: 12px;
            color: #666666;
            margin-top: 12px;
        }
        .product-dz{
            margin-top: 16px;
            display: flex;
            font-family: OPPOSans, OPPOSans;
            .like, .bad{
                border-radius: 4px;
                height: 22px;
                width: 72px;
                height: 22px;
                // background: #0271E3;
                font-size: 13px;
                line-height: 22px;
                text-align: center;
                color: rgba(255,255,255,0.85);
                // svg {
                //     margin-right: 1px;
                // }
                span{
                    font-family: OPPOSans, OPPOSans;
                    letter-spacing: 2px;
                }
            }
            .like{
                // background: #0271E3;
                margin-right: 12px;
                line-height: 22px;
                svg{
                    width: 9px;
                    height: 10px;
                }
            }
            .bad, .like{
                background: #bac9d9ff;
                background: rgba(2,113,227,0.14);
                border-radius: 4px;
                letter-spacing: 1px;
                border: 1px solid rgba(255,255,255,0.34);
                svg{
                    width: 10px;
                    height: 10px;
                }
            }
            .bad{
                line-height: 23px;
            }
            .selectLike{
                background: #0271E3;
            //    background: linear-gradient( 55deg, #006AFF 0%, #0045FF 25%, #4452F8 50%, #B160EA 75%, #CA55E0 100%);
               border-radius: 4px;
            }
            .selectBadLike{
                background: rgba(2,113,227,0.14);
                border-radius: 4px;
                border: 1px solid rgba(255,255,255,0.34);
                line-height: 22px;
                span{
                    color: rgba(255,255,255,0.55);
                }
            }
            .badLike{
                background: rgba(235,235,245,0.3);
                border-radius: 4px;
                color: #AEAEB2;
                letter-spacing: 1px;
            }
            .badLike1{
               color: rgba(255,255,255,0.55);
            }
        }
    }
    .footer {
        background: url(../../../assets/images/new-report/report/bj.png) center no-repeat;
        background-size: 100% 100%;
        margin-bottom: 50px;
        font-size: 12px;
        color: #666;
        > div {
            display: flex;
            align-items: center;
            img {
                width: 16px;
            }
        }
        p {
            margin-top: 4px;
        }
    }
}
</style>
