<template>
    <div class="fitness-assessment-container">
        <div class="top-bar">
            <a-space>
                <span class="back-btn"><icon-left /> 返回</span>
                <span class="info">ID: hussie.rattle@gmail.com | 男 | 168 cm | 26岁</span>
            </a-space>
            <a-space>
                <a-button type="primary" status="success">
                    <template #icon><icon-download /></template> AI报告解读
                </a-button>
            </a-space>
        </div>

        <a-row :gutter="24" class="main-content">

            <a-col :span="6">
                <a-card class="left-panel" :bordered="false">
                    <div class="date-selector">
                        <span class="active-date">2023.12.28 - 16:30 <icon-caret-down /></span>
                        <div class="status-badge"><icon-check-circle-fill style="color: #00b42a" /> 本次</div>
                    </div>

                    <div ref="radarChartRef" class="radar-chart-container"></div>

                    <div class="summary-table">
                        <div class="summary-row" v-for="item in summaryList" :key="item.name">
                            <span class="label">{{ item.name }}</span>
                            <span class="tag" :class="item.level">{{ item.text }}</span>
                        </div>
                    </div>
                </a-card>
            </a-col>

            <a-col :span="18">
                <div class="right-panel">

                    <div class="score-header">
                        <div class="score-number">
                            68 <span>分</span>
                        </div>
                        <div class="score-desc">
                            你的运动能力一般。每周至少进行3天有氧、力量运动。每次坚持30分钟以上。运动需要注意有序提升上肢耐力、下肢耐力、核心耐力、平衡性和柔韧性。
                        </div>
                    </div>

                    <div class="section-block">
                        <div class="section-title">肌肉耐力分析</div>
                        <div class="muscle-analysis-content">
                            <div class="body-map">
                                <div class="fake-body-img">
                                    <div class="body-front">正面视图</div>
                                    <div class="body-back">背面视图</div>
                                </div>
                                <div class="legend">
                                    <span><i class="dot d"></i> D</span>
                                    <span><i class="dot c"></i> C</span>
                                    <span><i class="dot b"></i> B</span>
                                    <span><i class="dot a"></i> A</span>
                                </div>
                            </div>

                            <div class="muscle-bars">
                                <a-row :gutter="40">
                                    <a-col :span="12" v-for="(group, idx) in muscleGroups" :key="idx">
                                        <div class="muscle-item">
                                            <span class="muscle-name">{{ group.name }}</span>
                                            <div class="grade-bar-container">
                                                <div class="grade-segment"
                                                    :class="{ active: group.grade === 'D', 'is-d': true }"></div>
                                                <div class="grade-segment"
                                                    :class="{ active: group.grade === 'C', 'is-c': true }"></div>
                                                <div class="grade-segment"
                                                    :class="{ active: group.grade === 'B', 'is-b': true }"></div>
                                                <div class="grade-segment"
                                                    :class="{ active: group.grade === 'A', 'is-a': true }"></div>
                                            </div>
                                            <span class="muscle-grade" :class="group.grade">{{ group.grade }}</span>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </div>
                    </div>

                    <div class="section-block">
                        <div class="section-title">项目测试结果</div>
                        <div class="test-list-header">
                            <a-row>
                                <a-col :span="4">项目名称</a-col>
                                <a-col :span="16" style="text-align: center">测量结果</a-col>
                                <a-col :span="4" style="text-align: right">肌肉分布</a-col>
                            </a-row>
                        </div>

                        <div class="test-list">
                            <div class="test-item" v-for="(item, index) in testResults" :key="index">
                                <a-row>
                                    <a-col :span="4" class="item-name-col">
                                        <component :is="item.icon" size="24" class="item-icon" />
                                        <span>{{ item.name }}</span>
                                    </a-col>

                                    <a-col :span="16" class="item-value-col">
                                        <div class="value-display">
                                            <span class="val">{{ item.value }}</span>
                                            <span class="unit">{{ item.unit }}</span>
                                            <span class="trend">
                                                <icon-arrow-up v-if="item.trend === 'up'" />
                                                <span v-else>--</span>
                                                {{ item.trendVal }}
                                            </span>
                                        </div>

                                        <div class="custom-gauge">
                                            <div class="gauge-line"></div>
                                            <div class="gauge-marker" :style="{ left: item.percentage + '%' }">
                                                <div class="marker-dot" :class="item.level"></div>
                                                <div class="marker-tooltip" :class="item.level">{{ item.levelText }}
                                                </div>
                                            </div>
                                            <div class="gauge-labels">
                                                <span>较弱</span>
                                                <span>中等</span>
                                                <span>良好</span>
                                                <span>优秀</span>
                                            </div>
                                        </div>
                                    </a-col>

                                    <a-col :span="4" class="item-img-col">
                                        <div class="mini-body-icon"></div>
                                    </a-col>
                                </a-row>
                            </div>
                        </div>

                        <div class="list-footer">
                            <div class="footer-legend">
                                <span>本次 <icon-caret-down style="color:#165dff" /></span>
                                <span style="margin-left: 20px; color: #86909c">上次比较</span>
                            </div>
                        </div>
                    </div>

                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    IconLeft, IconDownload, IconCaretDown, IconCheckCircleFill,
    IconArrowUp, IconThunderbolt, IconDashboard, IconTrophy
} from '@arco-design/web-vue/es/icon';
import * as echarts from 'echarts';

// --- 类型定义 ---
interface SummaryItem {
    name: string;
    text: string;
    level: 'poor' | 'avg' | 'good' | 'excellent';
}

interface MuscleGroup {
    name: string;
    grade: 'A' | 'B' | 'C' | 'D';
}

interface TestResult {
    name: string;
    icon: any; // 简单起见用 any，实际可以是组件类型
    value: string | number;
    unit: string;
    trend: 'up' | 'flat' | 'down';
    trendVal: number | string;
    percentage: number; // 0-100 用于定位
    level: 'poor' | 'avg' | 'good' | 'excellent';
    levelText: string;
}

// --- Mock 数据 ---
const summaryList = ref<SummaryItem[]>([
    { name: '上肢耐力', text: '较弱', level: 'poor' },
    { name: '下肢耐力', text: '中等', level: 'avg' },
    { name: '平衡能力', text: '优秀', level: 'excellent' },
    { name: '核心稳定性', text: '良好', level: 'good' },
    { name: '柔韧性', text: '良好', level: 'good' },
]);

const muscleGroups = ref<MuscleGroup[]>([
    { name: '上肢', grade: 'D' },
    { name: '臀部', grade: 'A' },
    { name: '背部', grade: 'C' },
    { name: '腹部', grade: 'C' },
    { name: '胸部', grade: 'B' },
    { name: '大腿', grade: 'C' },
    { name: '腹部', grade: 'C' }, // 模拟图中有两个腹部相关? 按图复原
    { name: '小腿', grade: 'B' },
]);

// 复用图标做演示
const testResults = ref<TestResult[]>([
    { name: '上肢肌耐力评估', icon: IconThunderbolt, value: 26, unit: '次', trend: 'up', trendVal: 6, percentage: 20, level: 'poor', levelText: '较弱' },
    { name: '下肢肌耐力评估', icon: IconThunderbolt, value: 40, unit: '次', trend: 'up', trendVal: 6, percentage: 45, level: 'avg', levelText: '中等' },
    { name: '核心肌耐力评估', icon: IconDashboard, value: 14, unit: 's', trend: 'up', trendVal: 6, percentage: 40, level: 'avg', levelText: '中等' },
    { name: '平衡能力评估', icon: IconTrophy, value: 34, unit: 's', trend: 'up', trendVal: 6, percentage: 80, level: 'good', levelText: '良好' },
    { name: '柔韧性评估', icon: IconTrophy, value: 40, unit: '°', trend: 'up', trendVal: 6, percentage: 95, level: 'excellent', levelText: '优秀' },
    { name: '垂直纵跳', icon: IconThunderbolt, value: 16, unit: 'cm', trend: 'up', trendVal: 6, percentage: 38, level: 'avg', levelText: '中等' },
    { name: '选择反应时评估', icon: IconDashboard, value: 0.69, unit: 's', trend: 'flat', trendVal: 0, percentage: 35, level: 'avg', levelText: '中等' },
]);

// --- ECharts 初始化 ---
const radarChartRef = ref<HTMLElement | null>(null);

onMounted(() => {
    if (radarChartRef.value) {
        const myChart = echarts.init(radarChartRef.value);
        const option = {
            radar: {
                indicator: [
                    { name: '上肢肌力', max: 100 },
                    { name: '下肢肌力', max: 100 },
                    { name: '核心稳定性', max: 100 },
                    { name: '柔韧性', max: 100 },
                    { name: '平衡能力', max: 100 },
                ],
                center: ['50%', '50%'],
                radius: '65%',
                splitNumber: 4,
                axisName: {
                    color: '#86909c',
                    fontSize: 10
                },
                splitArea: {
                    areaStyle: {
                        color: ['#fff', '#f2f3f5', '#fff', '#f2f3f5'],
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                    }
                }
            },
            series: [
                {
                    type: 'radar',
                    data: [
                        {
                            value: [40, 60, 80, 70, 90],
                            name: '本次评估',
                            areaStyle: {
                                color: 'rgba(22, 93, 255, 0.2)'
                            },
                            lineStyle: {
                                color: '#165dff'
                            },
                            itemStyle: {
                                color: '#165dff'
                            }
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option);

        window.addEventListener('resize', () => myChart.resize());
    }
});
</script>

<style lang="less" scoped>
// 颜色变量
@color-weak: #ff7d00; // 橙色 D
@color-avg: #f7ba1e; // 黄色 C
@color-good: #165dff; // 蓝色 B
@color-excellent: #00b42a; // 绿色 A
@color-gray-bg: #f2f3f5;
@color-text-main: #1d2129;
@color-text-sub: #86909c;

.fitness-assessment-container {
    padding: 20px;
    background-color: #f7f8fa; // 整体灰底
    min-height: 100vh;
    font-family: 'PingFang SC', sans-serif;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    background: #fff;
    padding: 12px 20px;
    border-radius: 4px;

    .back-btn {
        cursor: pointer;
        font-weight: bold;
        margin-right: 20px;
    }

    .info {
        color: @color-text-sub;
        font-size: 12px;
    }
}

.left-panel {
    background: #fff;
    border-radius: 8px;
    height: 100%;

    .date-selector {
        margin-bottom: 20px;

        .active-date {
            color: @color-good;
            font-weight: bold;
            cursor: pointer;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            margin-top: 4px;
            color: @color-text-main;
        }
    }

    .radar-chart-container {
        width: 100%;
        height: 250px;
    }

    .summary-table {
        margin-top: 20px;

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 12px;
            border-bottom: 1px solid @color-gray-bg;

            .label {
                color: @color-text-main;
            }

            .tag {
                padding: 2px 8px;
                border-radius: 2px;
                color: #fff;
                font-size: 10px;

                &.poor {
                    background: fade(@color-weak, 20%);
                    color: @color-weak;
                }

                &.avg {
                    background: fade(@color-avg, 20%);
                    color: @color-avg;
                }

                &.good {
                    background: fade(@color-good, 20%);
                    color: @color-good;
                }

                &.excellent {
                    background: fade(@color-excellent, 20%);
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

// 1. 分数头部
.score-header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;

    .score-number {
        font-size: 48px;
        font-weight: 600;
        color: #1d2129;
        margin-right: 24px;

        span {
            font-size: 16px;
            font-weight: normal;
            color: @color-text-sub;
        }
    }

    .score-desc {
        color: @color-text-main;
        font-size: 13px;
        line-height: 1.6;
        max-width: 700px;
    }
}

// 通用区块样式
.section-block {
    margin-bottom: 40px;

    .section-title {
        font-size: 14px;
        font-weight: 500;
        color: @color-text-sub;
        margin-bottom: 20px;
    }
}

// 2. 肌肉分析
.muscle-analysis-content {
    display: flex;
    background: #f9f9f9; // 浅灰背景块
    padding: 20px;
    border-radius: 4px;

    .body-map {
        width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-right: 1px dashed @color-gray-bg;
        margin-right: 40px;

        .fake-body-img {
            display: flex;
            gap: 10px;
            height: 160px;

            // 模拟图片
            .body-front,
            .body-back {
                width: 60px;
                background: #e5e6eb;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: @color-text-sub;
                font-size: 10px;
            }
        }

        .legend {
            margin-top: 10px;
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: @color-text-sub;

            .dot {
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-right: 4px;

                &.d {
                    background: @color-weak;
                }

                &.c {
                    background: @color-avg;
                }

                &.b {
                    background: @color-good;
                }

                &.a {
                    background: @color-excellent;
                }
            }
        }
    }

    .muscle-bars {
        flex: 1;

        .muscle-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .muscle-name {
                width: 40px;
                font-size: 12px;
                color: @color-text-main;
                margin-right: 12px;
            }

            .grade-bar-container {
                flex: 1;
                display: flex;
                gap: 4px;
                margin-right: 12px;
                height: 6px;

                .grade-segment {
                    flex: 1;
                    background: @color-gray-bg;
                    border-radius: 2px;

                    // 激活状态颜色逻辑
                    &.active.is-d {
                        background: @color-weak;
                    }

                    &.active.is-c {
                        background: @color-avg;
                    }

                    &.active.is-b {
                        background: @color-good;
                    }

                    &.active.is-a {
                        background: @color-excellent;
                    }
                }
            }

            .muscle-grade {
                font-weight: bold;
                width: 20px;

                &.D {
                    color: @color-weak;
                }

                &.C {
                    color: @color-avg;
                }

                &.B {
                    color: @color-good;
                }

                &.A {
                    color: @color-excellent;
                }
            }
        }
    }
}

// 3. 详细列表
.test-list-header {
    background: @color-gray-bg;
    padding: 10px 16px;
    font-size: 12px;
    color: @color-text-sub;
    border-radius: 4px;
    margin-bottom: 10px;
}

.test-list {
    .test-item {
        padding: 16px 0;
        border-bottom: 1px solid #f2f3f5;

        &:hover {
            background: #fafafa;
        }

        .item-name-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: @color-text-main;
            font-size: 12px;
            gap: 8px;

            .item-icon {
                color: @color-good; // 默认用蓝色图标
            }
        }

        .item-value-col {
            padding: 0 40px;

            .value-display {
                display: flex;
                align-items: baseline;
                margin-bottom: 8px;

                .val {
                    font-size: 18px;
                    font-weight: bold;
                    color: @color-good;
                    margin-right: 4px;
                }

                .unit {
                    font-size: 12px;
                    color: @color-text-sub;
                    margin-right: 12px;
                }

                .trend {
                    font-size: 12px;
                    color: @color-text-sub;
                }
            }

            // 自定义刻度尺
            .custom-gauge {
                position: relative;
                height: 30px;
                padding-top: 10px;

                .gauge-line {
                    height: 4px;
                    background: linear-gradient(to right, @color-weak 25%, @color-avg 25%, @color-avg 50%, @color-good 50%, @color-good 75%, @color-excellent 75%);
                    border-radius: 2px;
                    opacity: 0.3; // 背景淡化
                }

                .gauge-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #c9cdd4;
                    margin-top: 4px;
                }

                .gauge-marker {
                    position: absolute;
                    top: 6px; // 调整以垂直居中
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .marker-dot {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: 2px solid #fff;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

                        &.poor {
                            background: @color-weak;
                        }

                        &.avg {
                            background: @color-avg;
                        }

                        &.good {
                            background: @color-good;
                        }

                        &.excellent {
                            background: @color-excellent;
                        }
                    }

                    .marker-tooltip {
                        margin-top: 2px;
                        font-size: 10px;

                        &.poor {
                            color: @color-weak;
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
            }
        }

        .item-img-col {
            display: flex;
            justify-content: center;

            .mini-body-icon {
                width: 30px;
                height: 40px;
                background: #e5e6eb; // 占位
                mask-image: url('data:image/svg+xml;utf8,<svg ...>'); // 实际可用svg mask
            }
        }
    }
}

.list-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 12px;
}
</style>