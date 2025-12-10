<template>
    <div class="fitness-assessment-container">

        <a-row :gutter="24" class="main-content">

            <a-col :span="6">
                <a-card class="left-panel" :bordered="false">
                    <div class="chart-legend-area">
                        <a-dropdown @select="handleDateSelect">
                            <div class="legend-item interactive">
                                <div class="legend-icon blue-line"></div>
                                <span class="date-text">{{ selectedHistory.date }}</span>
                                <icon-caret-down class="arrow-icon" />
                            </div>
                            <template #content>
                                <a-doption v-for="item in historyOptions" :key="item.id" :value="item">
                                    {{ item.date }}
                                </a-doption>
                            </template>
                        </a-dropdown>

                        <div class="legend-item">
                            <div class="legend-icon green-line"></div>
                            <span class="date-text">本次</span>
                        </div>
                    </div>

                    <div ref="radarChartRef" class="radar-chart-container"></div>

                    <div class="summary-list">
                        <div class="summary-item" v-for="item in summaryList" :key="item.name">
                            <span class="label">{{ item.name }}</span>
                            <span class="status-tag" :class="item.level">
                                {{ item.text }}
                            </span>
                        </div>
                    </div>
                </a-card>
            </a-col>

            <a-col :span="18">
                <div class="right-panel">
                    <div class="score-header">
                        <div class="score-number">68 <span>分</span></div>
                        <div class="score-desc">你的运动能力一般。需要注意有序提升各项耐力。</div>
                    </div>

                    <div class="section-block">
                        <div class="section-header">
                            <div class="col-name">项目名称</div>
                            <div class="col-result">测量结果</div>
                            <div class="col-body">肌肉分布</div>
                        </div>

                        <div class="test-list">
                            <div class="test-row" v-for="(item, index) in testResults" :key="index">

                                <div class="col-name cell-center">
                                    <component :is="item.icon" class="project-icon" />
                                    <span class="project-text">{{ item.name }}</span>
                                </div>

                                <div class="col-result">
                                    <div class="result-container">
                                        <div class="val-wrapper">
                                            <span class="val-num">{{ item.value }}</span>
                                            <span class="val-unit">{{ item.unit }}</span>
                                            <div class="trend-wrapper">
                                                <icon-arrow-up style="color: #86909c; font-size:12px" />
                                                <span class="trend-val">{{ item.trendVal }}</span>
                                            </div>
                                            <div class="val-level-text" :class="item.level">{{ item.levelText }}</div>
                                        </div>

                                        <div class="gauge-wrapper">
                                            <div class="gauge-ticks">
                                                <span class="tick" style="left: 33%">16</span>
                                                <span class="tick" style="left: 66%">28</span>
                                                <span class="tick" style="left: 90%">35</span>
                                            </div>

                                            <div class="gauge-track">
                                                <div class="track-bg"></div>
                                                <div class="track-decor"></div>

                                                <div class="track-fill"
                                                    :style="{ width: getPercentage(item.value, item.max) + '%', background: getLevelColor(item.level) }">
                                                </div>

                                                <div class="track-handle"
                                                    :style="{ left: getPercentage(item.value, item.max) + '%', borderColor: getLevelColor(item.level) }">
                                                </div>
                                            </div>

                                            <div class="gauge-labels">
                                                <span class="g-label" style="left: 16%">较弱</span>
                                                <span class="g-label" style="left: 50%">中等</span>
                                                <span class="g-label" style="left: 78%">良好</span>
                                                <span class="g-label" style="left: 95%">优秀</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-body cell-center">
                                    <div class="skeleton-placeholder">
                                        <div class="sk-body"></div>
                                        <div class="sk-body"></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import {
    IconCaretDown, IconArrowUp,
    IconCommon, IconThunderbolt, IconDashboard // 模拟图标
} from '@arco-design/web-vue/es/icon';

// --- 类型定义 ---
type LevelType = 'poor' | 'avg' | 'good' | 'excellent';

interface HistoryData {
    id: number;
    date: string;
    values: number[]; // 对应雷达图5个维度的值
}

// --- 1. 雷达图数据与逻辑 ---
// 固定的“本次”数据 (绿色)
const currentDataValues = [70, 65, 85, 75, 80];

// 历史数据选项 (蓝色)
const historyOptions = ref<HistoryData[]>([
    { id: 1, date: '2023.12.28 - 16:30', values: [40, 50, 60, 45, 55] },
    { id: 2, date: '2023.11.15 - 10:00', values: [30, 40, 50, 35, 45] },
    { id: 3, date: '2023.10.01 - 14:20', values: [50, 55, 40, 50, 50] },
]);

// 当前选中的历史数据
const selectedHistory = ref<HistoryData>(historyOptions.value[0] as any);

const radarChartRef = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 更新图表函数
const updateChart = () => {
    if (!myChart) return;

    const option = {
        radar: {
            indicator: [
                { name: '上肢肌力', max: 100 },
                { name: '下肢肌力', max: 100 },
                { name: '平衡能力', max: 100 },
                { name: '核心稳定性', max: 100 },
                { name: '柔韧性', max: 100 },
            ],
            center: ['50%', '55%'], // 调整位置
            radius: '65%',
            splitNumber: 4,
            axisName: { color: '#86909c', fontSize: 10 },
            splitArea: { areaStyle: { color: ['#fff', '#f7f8fa', '#fff', '#f7f8fa'] } }
        },
        series: [
            {
                type: 'radar',
                symbolSize: 6,
                data: [
                    // 历史数据 (蓝色)
                    {
                        value: selectedHistory.value.values,
                        name: 'History',
                        symbol: 'emptyCircle', // 空心圆
                        itemStyle: { color: '#165dff' }, // 蓝色点/线
                        lineStyle: { width: 2 },
                        areaStyle: { color: 'rgba(22, 93, 255, 0.1)' }
                    },
                    // 本次数据 (绿色)
                    {
                        value: currentDataValues,
                        name: 'Current',
                        symbol: 'emptyCircle', // 空心圆
                        itemStyle: { color: '#00b42a' }, // 绿色点/线
                        lineStyle: { width: 2 },
                        areaStyle: { color: 'rgba(0, 180, 42, 0.1)' }
                    }
                ]
            }
        ]
    };
    myChart.setOption(option);
};

// 切换日期处理
const handleDateSelect = (val: any) => {
    selectedHistory.value = val;
    updateChart(); // 重新渲染图表
};

onMounted(() => {
    if (radarChartRef.value) {
        myChart = echarts.init(radarChartRef.value);
        updateChart();
        window.addEventListener('resize', () => myChart?.resize());
    }
});

// --- 2. 列表数据 ---
// 颜色映射辅助函数
const getLevelColor = (level: LevelType) => {
    const map = {
        poor: '#ff7d00',      // 橙
        avg: '#f7ba1e',       // 黄
        good: '#165dff',      // 蓝
        excellent: '#00b42a'  // 绿
    };
    return map[level];
};

// 计算百分比位置 (简单模拟：值/最大值 * 100，实际需根据刻度16/28/35非线性计算，这里简化为线性)
const getPercentage = (val: number, max: number) => {
    let p = (val / max) * 100;
    return Math.min(Math.max(p, 0), 100);
};

const summaryList = ref([
    { name: '上肢肌力', text: '较弱', level: 'poor' },
    { name: '下肢肌力', text: '中等', level: 'avg' },
    { name: '平衡能力', text: '优秀', level: 'excellent' },
    { name: '核心稳定性', text: '良好', level: 'good' },
    { name: '柔韧性', text: '良好', level: 'good' },
]);

const testResults = ref([
    {
        name: '上肢肌耐力评估', icon: IconThunderbolt,
        value: 26, unit: '次', trendVal: 6, max: 45, // 假设最大45
        level: 'poor' as LevelType, levelText: '较弱'
    },
    {
        name: '下肢肌耐力评估', icon: IconThunderbolt,
        value: 40, unit: '次', trendVal: 6, max: 50,
        level: 'avg' as LevelType, levelText: '中等'
    },
    {
        name: '核心肌耐力评估', icon: IconCommon,
        value: 14, unit: 's', trendVal: 6, max: 60,
        level: 'avg' as LevelType, levelText: '中等'
    },
    {
        name: '平衡能力评估', icon: IconDashboard,
        value: 34, unit: 's', trendVal: 6, max: 40,
        level: 'good' as LevelType, levelText: '良好'
    },
]);
</script>

<style lang="less" scoped>
// 变量
@color-poor: #ff7d00;
@color-avg: #f7ba1e;
@color-good: #165dff;
@color-excellent: #00b42a;
@bg-color: #f7f8fa;
@border-color: #f2f3f5;

.fitness-assessment-container {
    padding: 20px;
    background-color: @bg-color;
    min-height: 100vh;
    font-family: 'PingFang SC', sans-serif;
}

.left-panel {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    height: 100%;

    // --- 左侧 1: 图例交互 ---
    .chart-legend-area {
        margin-bottom: 20px;

        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            color: #1d2129;

            &.interactive {
                cursor: pointer;

                &:hover .date-text {
                    color: #165dff;
                }
            }

            .legend-icon {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid;
                position: relative;
                margin-right: 12px;

                // 模拟图例中间的横线
                &::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: -4px;
                    right: -4px;
                    height: 2px;
                    background: inherit; // 继承border颜色
                    transform: translateY(-50%);
                    z-index: 0;
                }

                &::after {
                    content: ''; // 遮挡中间让其变成空心圆
                    position: absolute;
                    inset: 0;
                    background: #fff;
                    border-radius: 50%;
                    z-index: 1;
                }

                &.blue-line {
                    border-color: @color-good;
                    background: @color-good;
                }

                &.green-line {
                    border-color: @color-excellent;
                    background: @color-excellent;
                }
            }

            .date-text {
                margin-right: 8px;
                font-weight: 500;
            }

            .arrow-icon {
                color: @color-good;
                font-size: 12px;
            }
        }
    }

    .radar-chart-container {
        width: 100%;
        height: 280px;
    }

    // --- 左侧 2: 概览列表 (浅色背景Tag) ---
    .summary-list {
        margin-top: 10px;

        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f2f3f5;
            font-size: 13px;
            color: #4e5969;

            .status-tag {
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;

                &.poor {
                    background: #fff7e8;
                    color: @color-poor;
                }

                &.avg {
                    background: #fffbe6;
                    color: @color-avg;
                }

                &.good {
                    background: #e8f3ff;
                    color: @color-good;
                }

                &.excellent {
                    background: #e8ffea;
                    color: @color-excellent;
                }
            }
        }
    }
}

.right-panel {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    min-height: 800px;
}

.score-header {
    margin-bottom: 30px;

    .score-number {
        font-size: 48px;
        font-weight: 600;

        span {
            font-size: 16px;
            color: #86909c;
        }
    }

    .score-desc {
        color: #1d2129;
        margin-top: 8px;
    }
}

// --- 右侧 3: 测试结果列表 (深度还原) ---
.section-block {
    .section-header {
        display: flex;
        background: #f7f8fa;
        padding: 12px 0;
        font-size: 12px;
        color: #86909c;
        border-radius: 4px;
        margin-bottom: 12px;
        text-align: center;

        .col-name {
            width: 20%;
        }

        .col-result {
            width: 60%;
        }

        .col-body {
            width: 20%;
        }
    }

    .test-list {
        .test-row {
            display: flex;
            align-items: stretch;
            border: 1px solid #f2f3f5;
            border-radius: 4px;
            margin-bottom: 16px;
            padding: 24px 0;
            transition: all 0.2s;

            &:hover {
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            }

            .cell-center {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            // 第一列
            .col-name {
                width: 20%;
                border-right: 1px solid #f2f3f5;

                .project-icon {
                    font-size: 28px;
                    color: @color-good;
                    margin-bottom: 12px;
                }

                .project-text {
                    font-size: 14px;
                    color: #1d2129;
                    font-weight: 500;
                }
            }

            // 第二列 (复杂的核心)
            .col-result {
                width: 60%;
                padding: 0 30px;
                display: flex;
                align-items: center;

                .result-container {
                    width: 100%;
                    display: flex;
                    align-items: center;

                    // 左侧数值
                    .val-wrapper {
                        width: 140px;
                        text-align: center;
                        margin-right: 20px;

                        .val-num {
                            font-size: 24px;
                            font-weight: bold;
                            color: @color-good;
                        }

                        .val-unit {
                            font-size: 12px;
                            color: #86909c;
                            margin-left: 4px;
                        }

                        .trend-wrapper {
                            display: inline-flex;
                            align-items: center;
                            margin-left: 8px;
                            color: #86909c;
                            font-size: 12px;
                            gap: 2px;
                        }

                        // 下方的状态文字 (较弱)
                        .val-level-text {
                            margin-top: 4px;
                            font-weight: bold;
                            font-size: 14px;

                            &.poor {
                                color: @color-poor;
                            }

                            &.avg {
                                color: @color-avg;
                            }

                            &.good {
                                color: @color-good;
                            }

                            &.excellent {
                                color: @color-excellent;
                            }
                        }
                    }

                    // 右侧进度条
                    .gauge-wrapper {
                        flex: 1;
                        position: relative;
                        height: 40px; // 给刻度留空间
                        margin-top: 10px;

                        // 刻度数字
                        .gauge-ticks {
                            position: absolute;
                            top: -18px;
                            width: 100%;

                            .tick {
                                position: absolute;
                                transform: translateX(-50%);
                                font-size: 12px;
                                color: #c9cdd4;
                            }
                        }

                        // 轨道
                        .gauge-track {
                            position: relative;
                            height: 4px;
                            margin-top: 4px;

                            .track-bg {
                                width: 100%;
                                height: 100%;
                                background: #f2f3f5;
                                border-radius: 2px;
                            }

                            // 填充条
                            .track-fill {
                                position: absolute;
                                left: 0;
                                top: 0;
                                height: 100%;
                                border-radius: 2px;
                                // background 由 style 控制
                            }

                            // 拖拽手柄(圆圈)
                            .track-handle {
                                position: absolute;
                                top: 50%;
                                width: 10px;
                                height: 10px;
                                background: #fff;
                                border: 2px solid; // 颜色动态
                                border-radius: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 2;
                            }
                        }

                        // 底部文字
                        .gauge-labels {
                            position: relative;
                            height: 20px;
                            margin-top: 8px;

                            .g-label {
                                position: absolute;
                                transform: translateX(-50%);
                                font-size: 12px;
                                color: #86909c;
                            }
                        }
                    }
                }
            }

            // 第三列
            .col-body {
                width: 20%;
                border-left: 1px solid #f2f3f5;

                .skeleton-placeholder {
                    display: flex;
                    gap: 10px;

                    .sk-body {
                        width: 30px;
                        height: 60px;
                        background: #e8f3ff;
                        border-radius: 10px;
                        // 此处实际开发应替换为svg图片
                    }
                }
            }
        }
    }
}
</style>