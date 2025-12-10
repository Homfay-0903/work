<template>
    <div class="report-container">
        <!-- 左侧概览栏 -->
        <div class="left-panel">
            <!-- 原型雷达图区域 (使用图片或Canvas替代，此处用模拟结构) -->
            <div class="radar-section">
                <div class="chart-header">
                    <div class="legend-item blue">
                        <span class="line"></span> 2023.12.28 - 16:30 <icon-caret-down />
                    </div>
                    <div class="legend-item green">
                        <span class="line"></span> 本次
                    </div>
                </div>

                <!-- 模拟雷达图占位 -->
                <div class="radar-placeholder">
                    <div class="radar-shape"></div>
                    <div class="label top">上肢肌力</div>
                    <div class="label right">下肢肌力</div>
                    <div class="label bottom-right">核心稳定性</div>
                    <div class="label bottom-left">柔韧性</div>
                    <div class="label left">平衡能力</div>
                </div>

                <div class="radar-legend-dots">
                    <span><i class="dot red"></i>较弱</span>
                    <span><i class="dot yellow"></i>中等</span>
                    <span><i class="dot blue"></i>良好</span>
                    <span><i class="dot green"></i>优秀</span>
                </div>
            </div>

            <!-- 左侧列表 -->
            <div class="stat-list">
                <div class="stat-item" v-for="(item, index) in summaryList" :key="index">
                    <span class="label">{{ item.name }}</span>
                    <a-tag :color="getStatusColor(item.status)" size="small" bordered>{{ item.statusText }}</a-tag>
                </div>
            </div>
        </div>

        <!-- 右侧详情区 -->
        <div class="right-panel">

            <!-- 1. 头部评分 -->
            <div class="score-header">
                <div class="score-num">
                    68<span class="unit">分</span>
                </div>
                <div class="score-desc">
                    你的运动能力一般，每周至少进行3天有氧、力量运动，每次坚持做30分钟以上，运动需要注意有序提升上肢能力、下肢能力、核心能力、平衡性和柔韧性。
                </div>
            </div>

            <!-- 2. 肌肉能力分析 -->
            <div class="section-block">
                <div class="section-title">肌肉能力分析</div>
                <div class="muscle-analysis-content">
                    <!-- 模拟左侧人体肌肉图 -->
                    <div class="muscle-map">
                        <!-- 仅示意结构，实际应为SVG或图片 -->
                        <div class="human-shape">
                            <div class="shape-body"></div>
                            <div class="legend-row">
                                <span><i class="dot red"></i> D</span>
                                <span><i class="dot yellow"></i> C</span>
                                <span><i class="dot blue"></i> B</span>
                                <span><i class="dot green"></i> A</span>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧条形图 -->
                    <div class="muscle-grids">
                        <div class="muscle-grid-item" v-for="item in muscleAnalysisData" :key="item.name">
                            <span class="m-name">{{ item.name }}</span>
                            <div class="m-bar-container">
                                <!-- 4段式进度条 -->
                                <div class="segment-bar">
                                    <div class="segment"
                                        :class="{ 'filled': getSegmentLevel(item.grade) >= 1, [getSafeColorType(item)]: true }">
                                    </div>
                                    <div class="segment"
                                        :class="{ 'filled': getSegmentLevel(item.grade) >= 2, [getSafeColorType(item)]: true }">
                                    </div>
                                    <div class="segment"
                                        :class="{ 'filled': getSegmentLevel(item.grade) >= 3, [getSafeColorType(item)]: true }">
                                    </div>
                                    <div class="segment"
                                        :class="{ 'filled': getSegmentLevel(item.grade) >= 4, [getSafeColorType(item)]: true }">
                                    </div>
                                </div>
                            </div>
                            <span class="m-grade" :class="item.colorType">{{ item.grade }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. 项目测试结果 -->
            <div class="section-block">
                <div class="section-title">项目测试结果</div>

                <!-- 表头 -->
                <div class="table-header">
                    <div class="col-name">项目名称</div>
                    <div class="col-result">测量结果</div>
                    <div class="col-dist">肌肉分布</div>
                </div>

                <!-- 列表内容 -->
                <div class="test-list">
                    <div class="test-row" v-for="(item, index) in testResults" :key="index">
                        <!-- 1. 项目名称 + 图标 -->
                        <div class="col-name cell-flex">
                            <div class="icon-box">
                                <!-- 这里使用Arco图标代替具体运动图标 -->
                                <component :is="item.icon" size="24" :style="{ color: '#165DFF' }" />
                            </div>
                            <span>{{ item.name }}</span>
                        </div>

                        <!-- 2. 测量结果 (核心复杂部分) -->
                        <div class="col-result cell-content">
                            <div class="value-display">
                                <span class="val">{{ item.value }}</span>
                                <span class="unit">{{ item.unit }}</span>
                                <span class="trend" v-if="item.trend">
                                    <icon-arrow-up v-if="item.trend === 'up'"
                                        style="color: #00B42A; margin-left:8px;" />
                                    <icon-arrow-down v-else style="color: #F53F3F; margin-left:8px; " />
                                    <span class="trend-val">6</span>
                                </span>
                                <span class="trend" v-if="item.trendText">
                                    <span class="trend-text">{{ item.trendText }}</span>
                                </span>
                            </div>

                            <!-- 自定义范围滑块条 -->
                            <div class="range-slider-container">
                                <div class="range-bg"></div>
                                <!-- 进度条主体 (背景灰线) -->
                                <div class="range-track">
                                    <!-- 范围刻度点 -->
                                    <div class="tick" style="left: 25%"></div>
                                    <div class="tick" style="left: 50%"></div>
                                    <div class="tick" style="left: 75%"></div>

                                    <!-- 范围数值 (假数据定位) -->
                                    <div class="tick-label" style="left: 25%">16</div>
                                    <div class="tick-label" style="left: 50%">28</div>
                                    <div class="tick-label" style="left: 75%">35</div>

                                    <!-- 实际值进度条 (有色部分) -->
                                    <div class="active-track" :class="item.statusColor"
                                        :style="{ width: item.percentage + '%' }"></div>

                                    <!-- 指示圆圈 -->
                                    <div class="indicator-dot" :class="item.statusColor"
                                        :style="{ left: item.percentage + '%' }"></div>
                                </div>

                                <!-- 底部文字描述 -->
                                <div class="range-labels">
                                    <span :class="{ active: item.status === 'weak' }">较弱</span>
                                    <span :class="{ active: item.status === 'avg' }">中等</span>
                                    <span :class="{ active: item.status === 'good' }">良好</span>
                                    <span :class="{ active: item.status === 'excellent' }">优秀</span>
                                </div>
                            </div>
                        </div>

                        <!-- 3. 肌肉分布 -->
                        <div class="col-dist cell-center">
                            <!-- 模拟肌肉分布图 -->
                            <div class="mini-muscle-map">
                                <icon-man size="40" style="opacity: 0.3" />
                                <icon-man size="40" style="opacity: 0.3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import {
    IconCaretDown, IconArrowUp, IconArrowDown,
    IconMan, IconHeartFill, IconExperiment, IconThunderbolt
} from '@arco-design/web-vue/es/icon';

// --- 类型定义 ---
interface MuscleItem {
    name: string;
    grade: 'A' | 'B' | 'C' | 'D'; // A:优秀, B:良好, C:中等, D:较弱
    colorType?: string; // used for css class
}

interface TestItem {
    name: string;
    icon: any;
    value: string | number;
    unit: string;
    trend?: 'up' | 'down';
    trendText?: string;
    percentage: number; // 0-100 用于UI展示
    status: 'weak' | 'avg' | 'good' | 'excellent';
    statusColor: string; // css class helper
}

// --- 数据 ---

// 左侧列表数据
const summaryList = reactive([
    { name: '上肢肌力', status: 'weak', statusText: '较弱' },
    { name: '下肢肌力', status: 'avg', statusText: '中等' },
    { name: '平衡能力', status: 'good', statusText: '优秀' },
    { name: '核心稳定性', status: 'good', statusText: '良好' },
    { name: '柔韧性', status: 'good', statusText: '良好' },
]);

// 肌肉分析数据
const muscleAnalysisData = reactive<MuscleItem[]>([
    { name: '上肢', grade: 'D', colorType: 'red' },
    { name: '背部', grade: 'A', colorType: 'green' },
    { name: '肩部', grade: 'C', colorType: 'yellow' },
    { name: '臀部', grade: 'C', colorType: 'yellow' },
    { name: '胸部', grade: 'B', colorType: 'blue' },
    { name: '大腿', grade: 'C', colorType: 'yellow' },
    { name: '腹部', grade: 'C', colorType: 'yellow' },
    { name: '小腿', grade: 'B', colorType: 'blue' },
]);

// 测试项目列表数据
const testResults = reactive<TestItem[]>([
    {
        name: '上肢肌肉耐力评估',
        icon: IconThunderbolt,
        value: 26, unit: '次',
        trend: 'up', percentage: 20,
        status: 'weak', statusColor: 'red'
    },
    {
        name: '下肢肌肉耐力评估',
        icon: IconThunderbolt,
        value: 40, unit: '次',
        trend: 'up', percentage: 40,
        status: 'avg', statusColor: 'yellow'
    },
    {
        name: '核心肌肉耐力评估',
        icon: IconHeartFill,
        value: 14, unit: 's',
        trend: 'up', percentage: 45,
        status: 'avg', statusColor: 'yellow'
    },
    {
        name: '平衡能力评估',
        icon: IconMan,
        value: 34, unit: 's',
        trend: 'up', percentage: 80,
        status: 'good', statusColor: 'blue'
    },
    {
        name: '柔韧性评估',
        icon: IconExperiment,
        value: 40, unit: '°',
        trend: 'up', percentage: 95,
        status: 'excellent', statusColor: 'green'
    },
    {
        name: '垂直纵跳',
        icon: IconThunderbolt,
        value: 16, unit: 'cm',
        trend: 'up', percentage: 40,
        status: 'avg', statusColor: 'yellow'
    },
    {
        name: '选择反应时评估',
        icon: IconThunderbolt,
        value: 0.69, unit: 's',
        trendText: '→ 0', percentage: 35,
        status: 'avg', statusColor: 'yellow'
    },
    {
        name: '握力评估',
        icon: IconThunderbolt,
        value: 34, unit: 'kg',
        trend: 'down', percentage: 85,
        status: 'excellent', statusColor: 'green'
    },
]);

// --- Helper Functions ---

const getStatusColor = (status: string) => {
    switch (status) {
        case 'weak': return 'orange'; // Arco orange
        case 'avg': return 'gold';
        case 'good': return 'cyan';
        case 'excellent': return 'green';
        default: return 'gray';
    }
};

const getSafeColorType = (item: MuscleItem): string => {
    return item.colorType || 'default-color';
};

const getSegmentLevel = (grade: string) => {
    // A=4, B=3, C=2, D=1
    const map: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    return map[grade] || 0;
};
</script>

<style lang="less" scoped>
//设计稿颜色
@color-red: #FF7D00; // 较弱 
@color-yellow: #FFC72E; // 中等
@color-blue: #165DFF; // 良好
@color-green: #00B42A; // 优秀
@color-bg: #F7F8FA;
@color-border: #F2F3F5;
@text-main: #1D2129;
@text-sub: #86909C;

.report-container {
    display: flex;
    gap: 16px;
    background-color: #fff;
    padding: 20px;
    color: @text-main;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif;
    min-height: 100vh;
}

// --- 左侧面板 ---
.left-panel {
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid @color-border;
    padding-right: 20px;

    .radar-section {
        margin-bottom: 40px;

        .chart-header {
            margin-bottom: 20px;

            .legend-item {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: @text-main;
                margin-bottom: 4px;
                cursor: pointer;

                .line {
                    width: 12px;
                    height: 2px;
                    margin-right: 8px;
                    border-radius: 2px;
                }

                &.blue {
                    color: @color-blue;

                    .line {
                        background: @color-blue;
                    }
                }

                &.green {
                    color: @color-green;

                    .line {
                        background: @color-green;
                    }
                }
            }
        }

        .radar-placeholder {
            width: 200px;
            height: 200px;
            margin: 20px auto;
            background: #F8F9FB;
            border-radius: 50%;
            position: relative;
            border: 1px dashed #ddd; // 模拟图表

            .radar-shape {
                position: absolute;
                top: 20%;
                left: 20%;
                right: 20%;
                bottom: 20%;
                background: fade(@color-green, 20%);
                border: 2px solid @color-green;
                // 简单模拟个形状
                clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            }

            .label {
                position: absolute;
                font-size: 12px;
                color: @text-sub;
                white-space: nowrap;

                &.top {
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                &.right {
                    top: 50%;
                    right: -30px;
                    transform: translateY(-50%);
                }

                &.left {
                    top: 50%;
                    left: -30px;
                    transform: translateY(-50%);
                }

                &.bottom-right {
                    bottom: -10px;
                    right: -10px;
                }

                &.bottom-left {
                    bottom: -10px;
                    left: -10px;
                }
            }
        }

        .radar-legend-dots {
            display: flex;
            justify-content: center;
            gap: 12px;
            font-size: 10px;
            color: @text-sub;
            margin-top: 30px;

            span {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;

                &.red {
                    background: @color-red;
                }

                &.yellow {
                    background: @color-yellow;
                }

                &.blue {
                    background: @color-blue;
                }

                &.green {
                    background: @color-green;
                }
            }
        }
    }

    .stat-list {
        .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid @color-border;

            .label {
                font-size: 14px;
                color: @text-main;
            }
        }
    }
}

// --- 右侧面板 ---
.right-panel {
    flex: 1;

    // 头部
    .score-header {
        display: flex;
        align-items: flex-start;
        margin-bottom: 30px;

        .score-num {
            font-size: 48px;
            font-weight: 500;
            line-height: 1;
            margin-right: 24px;

            .unit {
                font-size: 16px;
                margin-left: 4px;
                color: @text-main;
            }
        }

        .score-desc {
            flex: 1;
            font-size: 14px;
            color: @text-sub;
            padding-left: 24px;
            border-left: 1px solid @color-border;
            line-height: 1.6;
        }
    }

    .section-block {
        margin-bottom: 40px;

        .section-title {
            font-size: 16px;
            font-weight: 500;
            color: @text-main;
            margin-bottom: 20px;
        }
    }

    // 肌肉分析
    .muscle-analysis-content {
        background: @color-bg;
        padding: 24px;
        border-radius: 4px;
        display: flex;

        .muscle-map {
            width: 30%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 1px solid transparent; // spacing

            .human-shape {
                text-align: center;

                .shape-body {
                    width: 100px;
                    height: 150px;
                    background: #e5e6eb; // placeholder
                    mask: url('data:image/svg+xml;utf8,<svg ...>...</svg>'); // advanced usage
                    margin-bottom: 10px;
                    border-radius: 8px; // 模拟
                }

                .legend-row {
                    display: flex;
                    gap: 10px;
                    font-size: 12px;

                    .dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        display: inline-block;
                    }

                    .red {
                        background: @color-red;
                    }

                    .yellow {
                        background: @color-yellow;
                    }

                    .blue {
                        background: @color-blue;
                    }

                    .green {
                        background: @color-green;
                    }
                }
            }
        }

        .muscle-grids {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 60px;
            row-gap: 20px;
            padding-left: 40px;

            .muscle-grid-item {
                display: flex;
                align-items: center;

                .m-name {
                    width: 40px;
                    font-size: 12px;
                    color: @text-main;
                }

                .m-bar-container {
                    flex: 1;
                    margin: 0 12px;

                    .segment-bar {
                        display: flex;
                        gap: 4px;
                        height: 8px;

                        .segment {
                            flex: 1;
                            background: #E5E6EB;
                            border-radius: 1px;

                            &.filled {
                                &.red {
                                    background: @color-red;
                                }

                                &.yellow {
                                    background: @color-yellow;
                                }

                                &.blue {
                                    background: @color-blue;
                                }

                                &.green {
                                    background: @color-green;
                                }
                            }
                        }
                    }
                }

                .m-grade {
                    width: 20px;
                    text-align: right;
                    font-weight: bold;
                    font-size: 14px;

                    &.red {
                        color: @color-red;
                    }

                    &.yellow {
                        color: @color-yellow;
                    }

                    &.blue {
                        color: @color-blue;
                    }

                    &.green {
                        color: @color-green;
                    }
                }
            }
        }
    }

    // 项目测试结果表格区
    .table-header {
        display: flex;
        background: @color-border;
        padding: 10px 20px;
        border-radius: 4px;
        color: @text-sub;
        font-size: 12px;
        margin-bottom: 10px;

        .col-name {
            width: 25%;
        }

        .col-result {
            flex: 1;
            text-align: center;
        }

        .col-dist {
            width: 15%;
            text-align: center;
        }
    }

    .test-list {
        .test-row {
            display: flex;
            padding: 24px 20px;
            border-bottom: 1px solid @color-border;
            align-items: center;
            transition: background 0.2s;

            &:hover {
                background: #FAFAFB;
            }
        }

        .cell-flex {
            display: flex;
            align-items: center;
        }

        .col-name {
            width: 25%;
            font-size: 14px;
            color: @text-main;

            .icon-box {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #F2F8FF;
                border-radius: 8px;
                margin-right: 12px;
            }
        }

        .col-result {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0 40px;
            position: relative;

            .value-display {
                width: 100px;
                text-align: right;
                margin-right: 40px;
                white-space: nowrap;

                .val {
                    font-size: 18px;
                    font-weight: 500;
                    color: @color-blue;
                }

                .unit {
                    font-size: 12px;
                    color: @text-sub;
                    margin-left: 4px;
                }

                .trend {
                    font-size: 12px;

                    .trend-val {
                        color: @text-sub;
                        margin-left: 4px;
                    }

                    .trend-text {
                        color: @text-sub;
                        margin-left: 8px;
                        font-size: 12px;
                    }
                }
            }

            .range-slider-container {
                flex: 1;
                position: relative;
                padding-top: 10px; // space for labels if needed above, but design has them below

                .range-track {
                    height: 2px;
                    background: #E5E6EB;
                    position: relative;
                    margin-bottom: 8px;
                }

                .active-track {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    border-radius: 2px;

                    &.red {
                        background: @color-red;
                    }

                    &.yellow {
                        background: @color-yellow;
                    }

                    &.blue {
                        background: @color-blue;
                    }

                    &.green {
                        background: @color-green;
                    }
                }

                .indicator-dot {
                    width: 8px;
                    height: 8px;
                    background: #fff;
                    border: 2px solid;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 2;

                    &.red {
                        border-color: @color-red;
                    }

                    &.yellow {
                        border-color: @color-yellow;
                    }

                    &.blue {
                        border-color: @color-blue;
                    }

                    &.green {
                        border-color: @color-green;
                    }
                }

                .tick {
                    position: absolute;
                    top: -3px;
                    width: 1px;
                    height: 8px;
                    background: #E5E6EB;
                }

                .tick-label {
                    position: absolute;
                    top: -20px;
                    transform: translateX(-50%);
                    font-size: 10px;
                    color: #C9CDD4;
                }

                .range-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #86909C;

                    span {
                        position: relative;
                        width: 25%;
                        text-align: center;

                        &.active {
                            color: @text-main;
                        }
                    }
                }
            }
        }

        .col-dist {
            width: 15%;
            display: flex;
            justify-content: center;
        }
    }
}

// 响应式微调
@media (max-width: 1200px) {
    .muscle-analysis-content .muscle-grids {
        grid-template-columns: 1fr;
    }
}
</style>