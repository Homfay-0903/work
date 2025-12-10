<template>
    <div class="fitness-container">
        <a-row :gutter="24">
            <!-- 左侧边栏：雷达图与总评 -->
            <a-col :span="6">
                <div class="left-panel card-box">
                    <div class="radar-header">
                        <div class="legend">
                            <span class="legend-item blue">2023.12.28 - 16:30</span>
                            <span class="legend-item green">本次</span>
                        </div>
                    </div>

                    <!-- 模拟雷达图区域 -->
                    <div class="radar-chart-container">
                        <!-- 这里使用 SVG 模拟雷达图结构，实际项目中建议使用 ECharts -->
                        <svg viewBox="0 0 200 180" class="radar-svg">
                            <!-- 背景网格 -->
                            <polygon points="100,10 190,70 155,160 45,160 10,70" class="radar-bg-level" />
                            <polygon points="100,40 160,80 135,130 65,130 40,80" class="radar-bg-level" />
                            <!-- 数据区域 (模拟蓝色填充) -->
                            <polygon points="100,20 170,75 140,145 50,140 20,75" class="radar-data-area" />
                            <!-- 顶点文字 -->
                            <text x="100" y="5" text-anchor="middle" class="radar-label">上肢肌力</text>
                            <text x="195" y="70" text-anchor="middle" class="radar-label">下肢肌力</text>
                            <text x="160" y="175" text-anchor="middle" class="radar-label">核心稳定性</text>
                            <text x="40" y="175" text-anchor="middle" class="radar-label">柔韧性</text>
                            <text x="5" y="70" text-anchor="middle" class="radar-label">平衡能力</text>
                        </svg>
                        <!-- 中心的图标示意 -->
                        <div class="center-icon">
                            <icon-heart-fill style="color: #6da6ea; font-size: 24px;" />
                        </div>
                    </div>

                    <!-- 左侧底部列表 -->
                    <div class="left-metrics">
                        <div class="metric-legend">
                            <span>● 较弱</span><span>● 中等</span><span>● 良好</span><span>● 优秀</span>
                        </div>
                        <div class="metric-row" v-for="item in leftMetrics" :key="item.name">
                            <span class="label">{{ item.name }}</span>
                            <a-tag :color="getLevelColor(item.level)" size="small" class="level-tag">
                                {{ item.levelText }}
                            </a-tag>
                        </div>
                    </div>
                </div>
            </a-col>

            <!-- 右侧内容：详细分析 -->
            <a-col :span="18">
                <!-- 顶部评分 -->
                <div class="score-header card-box">
                    <div class="score-num">68 <span class="unit">分</span></div>
                    <div class="divider"></div>
                    <div class="score-desc">
                        你的运动能力一般，每周至少进行3天有氧、力量运动，每次坚持做30分钟以上，运动需要注意有序提升上肢能力、下肢能力、核心能力、平衡性和柔韧性。
                    </div>
                </div>

                <div class="section-title">肌肉能力分析</div>

                <!-- 肌肉能力分析面板 -->
                <div class="muscle-analysis card-box">
                    <a-row :gutter="24" align="middle">
                        <a-col :span="8" class="body-map-container">
                            <!-- 模拟人体肌肉图占位 -->
                            <div class="body-img-placeholder">
                                <div class="human-shape front">
                                    <div class="muscle-highlight orange" style="top: 20%; left: 20%;"></div>
                                    <div class="muscle-highlight blue" style="top: 50%; left: 30%;"></div>
                                    <span>正面视图</span>
                                </div>
                                <div class="human-shape back">
                                    <div class="muscle-highlight green" style="top: 20%; right: 20%;"></div>
                                    <span>背面视图</span>
                                </div>
                            </div>
                        </a-col>
                        <a-col :span="16">
                            <a-row :gutter="[24, 16]">
                                <a-col :span="12" v-for="muscle in muscleData" :key="muscle.name">
                                    <div class="muscle-bar-item">
                                        <div class="mb-header">
                                            <span class="mb-name">{{ muscle.name }}</span>
                                            <span class="mb-grade" :class="getGradeColorClass(muscle.grade)">{{
                                                muscle.grade }}</span>
                                        </div>
                                        <div class="mb-track">
                                            <div class="mb-fill"
                                                :style="{ width: muscle.percent + '%', background: getGradeColor(muscle.grade) }">
                                            </div>
                                        </div>
                                    </div>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </div>

                <div class="section-title">项目测试结果</div>

                <!-- 详细测试列表 -->
                <div class="test-results-list">
                    <div class="list-header">
                        <a-row>
                            <a-col :span="6" class="th">项目名称</a-col>
                            <a-col :span="12" class="th center">测量结果</a-col>
                            <a-col :span="6" class="th right">肌肉分布</a-col>
                        </a-row>
                    </div>

                    <div class="list-item card-box" v-for="(test, index) in testResults" :key="index">
                        <a-row align="middle">
                            <!-- 项目名称 + 图标 -->
                            <a-col :span="6" class="col-name">
                                <div class="test-icon">
                                    <!-- 使用 Arco 图标代替特定的健身图标 -->
                                    <component :is="test.icon" />
                                </div>
                                <span>{{ test.name }}</span>
                            </a-col>

                            <!-- 测量结果 + 进度条 -->
                            <a-col :span="12" class="col-result">
                                <a-row align="middle" :gutter="12">
                                    <a-col :span="6" class="val-box">
                                        <span class="val-num">{{ test.value }}</span>
                                        <span class="val-unit">{{ test.unit }}</span>
                                        <span class="val-trend" v-if="test.trend">
                                            <icon-arrow-up v-if="test.trend === 'up'" style="color:#f7ba1e" />
                                            <icon-arrow-down v-else style="color:green" />
                                            <span class="trend-num">6</span>
                                        </span>
                                    </a-col>
                                    <a-col :span="18">
                                        <!-- 自定义分段进度条 -->
                                        <div class="custom-slider">
                                            <!-- 刻度值 -->
                                            <div class="slider-marks">
                                                <span style="left: 0%"></span>
                                                <span style="left: 33%">16</span>
                                                <span style="left: 66%">28</span>
                                                <span style="left: 100%">35</span>
                                            </div>
                                            <!-- 轨道 -->
                                            <div class="slider-track">
                                                <div class="slider-fill"
                                                    :style="{ width: getSliderPos(test.value, 35) + '%', background: getStatusColor(test.status) }">
                                                </div>
                                                <!-- 圆点 -->
                                                <div class="slider-thumb"
                                                    :style="{ left: getSliderPos(test.value, 35) + '%' }"></div>
                                            </div>
                                            <!-- 底部文字 -->
                                            <div class="slider-labels">
                                                <span :class="{ active: test.status === 'weak' }">较弱</span>
                                                <span :class="{ active: test.status === 'avg' }">中等</span>
                                                <span :class="{ active: test.status === 'good' }">良好</span>
                                                <span :class="{ active: test.status === 'excellent' }">优秀</span>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-col>

                            <!-- 肌肉分布缩略图 -->
                            <a-col :span="6" class="col-muscle">
                                <div class="mini-muscle-map">
                                    <div class="shape"></div>
                                    <div class="shape"></div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>

                    <!-- 立位体前屈 (特殊样式，因为是最后一项且设计稿有个'本次'标记) -->
                    <div class="list-item card-box">
                        <a-row align="middle">
                            <a-col :span="6" class="col-name">
                                <div class="test-icon"><icon-user /></div>
                                <span>立位体前屈</span>
                            </a-col>
                            <a-col :span="12" class="col-result">
                                <div class="custom-slider simple">
                                    <div class="current-tag" style="left: 40%">
                                        本次
                                        <icon-caret-down />
                                    </div>
                                    <div class="slider-track simple-track">
                                        <div class="mark-bar" style="width: 40%; background-color: #f7ba1e;"></div>
                                    </div>
                                    <div class="slider-labels simple-labels">
                                        <span>较弱</span>
                                        <span class="active" style="color:#f7ba1e">中等</span>
                                        <span>良好</span>
                                        <span>优秀</span>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="6" class="col-muscle center">
                                <span class="link-text">上次较弱</span>
                            </a-col>
                        </a-row>
                    </div>

                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IconHeartFill, IconArrowUp, IconArrowDown, IconUser, IconThunderbolt,
    IconInteraction, IconCommon, IconTrophy, IconExperiment, IconDashboard, IconCaretDown
} from '@arco-design/web-vue/es/icon';

// --- 类型定义与工具函数 ---  
const getLevelColor = (level: string) => {
    switch (level) {
        case '较弱': return 'orange';
        case '中等': return 'gold'; // Arco preset  
        case '良好': return 'cyan';
        case '优秀': return 'green';
        default: return 'gray';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'weak': return '#ff7d00'; // Orange  
        case 'avg': return '#f7ba1e'; // Yellow/Gold  
        case 'good': return '#165dff'; // Blue  
        case 'excellent': return '#00b42a'; // Green  
        default: return '#ccc';
    }
}

const getGradeColor = (grade: string) => {
    switch (grade) {
        case 'A': return '#00b42a';
        case 'B': return '#165dff';
        case 'C': return '#f7ba1e';
        case 'D': return '#ff7d00';
        default: return '#ccc';
    }
};

const getGradeColorClass = (grade: string) => {
    return `grade-${grade}`;
}

// 简单的百分比计算模拟，实际业务需根据具体 range 算法  
const getSliderPos = (val: number | string, max: number) => {
    const num = parseFloat(val as string);
    // 简单模拟设计稿视觉位置  
    // 假设 0-16 是前33%，16-28是中间33%，28-35是后33%  
    if (num <= 16) return (num / 16) * 33;
    if (num <= 28) return 33 + ((num - 16) / 12) * 33;
    return 66 + ((num - 28) / 7) * 34;
};


// --- 数据 ---  

const leftMetrics = ref([
    { name: '上肢肌力', levelText: '较弱', level: '较弱' },
    { name: '下肢肌力', levelText: '中等', level: '中等' },
    { name: '平衡能力', levelText: '优秀', level: '优秀' },
    { name: '核心稳定性', levelText: '良好', level: '良好' },
    { name: '柔韧性', levelText: '良好', level: '良好' },
]);

const muscleData = ref([
    { name: '上肢', grade: 'D', percent: 20 },
    { name: '背部', grade: 'A', percent: 90 },
    { name: '肩部', grade: 'C', percent: 40 },
    { name: '臀部', grade: 'C', percent: 45 },
    { name: '胸部', grade: 'B', percent: 60 },
    { name: '大腿', grade: 'C', percent: 45 },
    { name: '腹部', grade: 'C', percent: 35 },
    { name: '小腿', grade: 'B', percent: 70 },
]);

const testResults = ref([
    { name: '上肢肌耐力评估', value: 26, unit: '次', trend: 'up', status: 'weak', icon: 'IconThunderbolt' },
    { name: '下肢肌耐力评估', value: 40, unit: '次', trend: 'up', status: 'avg', icon: 'IconInteraction' },
    { name: '核心肌耐力评估', value: 14, unit: 's', trend: 'up', status: 'avg', icon: 'IconCommon' },
    { name: '平衡能力评估', value: 34, unit: 's', trend: 'up', status: 'good', icon: 'IconTrophy' },
    { name: '柔韧性评估', value: 40, unit: '°', trend: 'up', status: 'excellent', icon: 'IconUser' },
    { name: '垂直纵跳', value: 16, unit: 'cm', trend: 'up', status: 'avg', icon: 'IconArrowUp' },
    { name: '选择反应时评估', value: 0.69, unit: 's', trend: 'flat', status: 'avg', icon: 'IconExperiment' },
    { name: '握力评估', value: 34, unit: 'kg', trend: 'down', status: 'excellent', icon: 'IconDashboard' },
    { name: '肺活量评估', value: 3300, unit: 'ml', trend: 'up', status: 'avg', icon: 'IconHeartFill' },
    { name: '原地开合跳', value: 20, unit: '次', trend: 'up', status: 'avg', icon: 'IconUser' },
]);

</script>

<style lang="less" scoped>
/* 颜色变量 */
@color-weak: #ff7d00;
@color-avg: #f7ba1e;
@color-good: #165dff;
@color-excellent: #00b42a;
@bg-color: #f7f8fa;
@border-color: #f2f3f5;
@text-primary: #1d2129;
@text-secondary: #86909c;

.fitness-container {
    background-color: @bg-color;
    padding: 20px;
    min-height: 100vh;
    font-family: 'PingFang SC', sans-serif;
    color: @text-primary;
}

.card-box {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.section-title {
    font-size: 14px;
    color: @text-primary;
    margin-bottom: 12px;
    font-weight: 500;
}

/* 左侧面板 */
.left-panel {
    display: flex;
    flex-direction: column;
    align-items: center;

    .radar-header {
        width: 100%;
        margin-bottom: 20px;

        .legend {
            display: flex;
            flex-direction: column;
            font-size: 12px;

            .legend-item {
                margin-bottom: 4px;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 8px;
                    height: 2px;
                    margin-right: 6px;
                    vertical-align: middle;
                }

                &.blue::before {
                    background: #165dff;
                    border-radius: 2px;
                    height: 4px;
                    width: 4px;
                    border: 1px solid #165dff;
                    background: white;
                }

                &.green::before {
                    background: #00b42a;
                    height: 2px;
                }
            }
        }
    }

    .radar-chart-container {
        position: relative;
        width: 200px;
        height: 180px;
        margin-bottom: 30px;

        .radar-svg {
            width: 100%;
            height: 100%;

            .radar-bg-level {
                fill: #f2f3f5;
                stroke: #e5e6eb;
                stroke-width: 1;
            }

            .radar-bg-level:nth-child(2) {
                fill: #fff;
            }

            .radar-data-area {
                fill: rgba(22, 93, 255, 0.2);
                stroke: #165dff;
                stroke-width: 1.5;
            }

            .radar-label {
                font-size: 10px;
                fill: #4e5969;
            }
        }

        .center-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -40%);
            opacity: 0.5;
        }
    }

    .left-metrics {
        width: 100%;

        .metric-legend {
            font-size: 12px;
            color: @text-secondary;
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            transform: scale(0.9);
            transform-origin: left center;
        }

        .metric-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 12px;

            .label {
                color: #4e5969;
            }

            /* 强制修改 Tag 样式以匹配设计稿 */
            .level-tag {
                border: none;
                width: 48px;
                text-align: center;
                justify-content: center;
            }

            .arco-tag-orange {
                background: #fff7e8;
                color: @color-weak;
            }

            .arco-tag-gold {
                background: #fff7e8;
                color: @color-avg;
            }

            // 设计稿中较弱和中等都是偏橙黄色  
            .arco-tag-cyan {
                background: #e8f3ff;
                color: @color-good;
            }

            .arco-tag-green {
                background: #e8ffea;
                color: @color-excellent;
            }
        }
    }
}

/* 右侧 - 评分头 */
.score-header {
    display: flex;
    align-items: center;
    padding: 24px;

    .score-num {
        font-size: 48px;
        font-weight: 400;
        color: #1d2129;
        line-height: 1;

        .unit {
            font-size: 14px;
            color: @text-secondary;
            margin-left: 4px;
        }
    }

    .divider {
        width: 1px;
        height: 40px;
        background: #e5e6eb;
        margin: 0 30px;
    }

    .score-desc {
        font-size: 13px;
        color: #4e5969;
        line-height: 1.6;
        flex: 1;
    }
}

/* 右侧 - 肌肉分析 */
.muscle-analysis {
    .body-map-container {
        display: flex;
        justify-content: center;

        .body-img-placeholder {
            display: flex;
            gap: 20px;

            .human-shape {
                width: 80px;
                height: 160px;
                background: #f2f3f5;
                border-radius: 40px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: flex-end;
                padding-bottom: 10px;
                font-size: 10px;
                color: #86909c;

                .muscle-highlight {
                    position: absolute;
                    width: 10px;
                    height: 20px;
                    border-radius: 4px;

                    &.orange {
                        background: @color-weak;
                        box-shadow: 0 0 5px @color-weak;
                    }

                    &.blue {
                        background: @color-good;
                        box-shadow: 0 0 5px @color-good;
                    }

                    &.green {
                        background: @color-excellent;
                        box-shadow: 0 0 5px @color-excellent;
                    }
                }
            }
        }
    }

    .muscle-bar-item {
        margin-bottom: 8px;

        .mb-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 12px;
            color: @text-secondary;

            .mb-grade {
                font-weight: bold;

                &.grade-A {
                    color: @color-excellent;
                }

                &.grade-B {
                    color: @color-good;
                }

                &.grade-C {
                    color: @color-avg;
                }

                &.grade-D {
                    color: @color-weak;
                }
            }
        }

        .mb-track {
            height: 6px;
            background: #f2f3f5;
            border-radius: 3px;
            overflow: hidden;

            .mb-fill {
                height: 100%;
                border-radius: 3px;
            }
        }
    }
}

/* 右侧 - 测试列表 */
.test-results-list {
    .list-header {
        padding: 0 20px;
        margin-bottom: 10px;
        font-size: 12px;
        color: @text-secondary;

        .th {
            &.center {
                text-align: center;
                padding-left: 40px;
            }

            &.right {
                text-align: right;
            }
        }
    }

    .list-item {
        padding: 16px 20px;
        transition: all 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .col-name {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #1d2129;
            font-size: 14px;

            .test-icon {
                width: 32px;
                height: 32px;
                background: #f7f8fa; // 浅蓝背景  
                color: #165dff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-size: 18px;
            }
        }

        .col-result {
            .val-box {
                display: flex;
                align-items: baseline;

                .val-num {
                    font-size: 18px;
                    color: #165dff;
                    font-weight: bold;
                }

                .val-unit {
                    font-size: 12px;
                    color: @text-secondary;
                    margin-left: 4px;
                    margin-right: 8px;
                }

                .val-trend {
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    color: @text-secondary;
                }
            }
        }

        .col-muscle {
            display: flex;
            justify-content: flex-end;

            &.center {
                justify-content: center;
            }

            .mini-muscle-map {
                display: flex;
                gap: 6px;

                .shape {
                    width: 20px;
                    height: 40px;
                    background: #f2f3f5;
                    border-radius: 10px;
                }
            }

            .link-text {
                color: #165dff;
                font-size: 13px;
                cursor: pointer;
            }
        }
    }
}

/* 自定义 Slider 组件样式 */
.custom-slider {
    position: relative;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 20px;

    .slider-marks {
        position: relative;
        height: 10px;
        font-size: 10px;
        color: #c9cdd4;

        span {
            position: absolute;
            transform: translateX(-50%);
            top: -16px;
        }
    }

    .slider-track {
        position: relative;
        height: 2px;
        background: #e5e6eb;
        width: 100%;

        .slider-fill {
            position: absolute;
            height: 100%;
            left: 0;
            top: 0;
            transition: width 0.3s;
        }

        .slider-thumb {
            position: absolute;
            width: 8px;
            height: 8px;
            border: 2px solid #165dff;
            background: #fff;
            border-radius: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
        }

        &.simple-track {
            height: 4px;
            background: #f2f3f5;
            border-radius: 2px;
            margin-top: 8px;

            .mark-bar {
                height: 100%;
                border-radius: 2px;
            }
        }
    }

    .slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #86909c;
        margin-top: 6px;

        span {
            flex: 1;
            text-align: center;

            &.active {
                color: #1d2129;
                font-weight: bold;
            }
        }

        &.simple-labels {
            span.active {
                font-weight: bold;
            }
        }
    }

    /* 特殊的 simple 样式 (立位体前屈) */
    &.simple {
        padding-top: 25px;
        padding-bottom: 0;

        .current-tag {
            position: absolute;
            top: 0;
            transform: translateX(-50%);
            color: #165dff;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 1;

            .arco-icon {
                margin-top: -2px;
            }
        }
    }
}
</style>
