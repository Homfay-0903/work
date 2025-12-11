<template>
    <a-card class="fitness-assessment" :bordered="false">
        <!-- 顶部：总评分 + 简要说明 -->
        <div class="fa-header">
            <div class="fa-score-block">
                <div class="fa-score-main">
                    <span class="fa-score-number">{{ score }}</span>
                    <span class="fa-score-unit">分</span>
                </div>
                <div class="fa-score-text">
                    综合体适能处于<span class="fa-score-highlight">一般水平</span>。
                    建议每周保持 <span class="fa-score-highlight">2–3 次力量训练</span>，
                    配合<span class="fa-score-highlight">有氧运动 3 次以上</span>。
                </div>
            </div>

            <div class="fa-summary-block">
                <div class="fa-summary-row">
                    <span class="fa-summary-label">综合评价</span>
                    <a-tag size="small" color="orange">一般</a-tag>
                </div>
                <div class="fa-summary-row">
                    <span class="fa-summary-label">优势项目</span>
                    <span class="fa-summary-value">下肢肌肉力量、肩关节灵活性</span>
                </div>
                <div class="fa-summary-row">
                    <span class="fa-summary-label">待提升项目</span>
                    <span class="fa-summary-value">核心肌耐力、平衡协调性</span>
                </div>
            </div>
        </div>

        <!-- 分割线 -->
        <a-divider class="fa-divider" />

        <!-- 主要表格区域：项目测试结果 -->
        <div class="fa-content">
            <div class="fa-section-title">
                项目测试结果
            </div>

            <a-table class="fa-table" :columns="columns" :data="items" :bordered="false" :pagination="false"
                row-key="id">
                <!-- 测量结果 -->
                <template #result="{ record }">
                    <span class="fa-result-value">{{ record.value }}</span>
                    <span v-if="record.unit" class="fa-result-unit">{{ record.unit }}</span>
                </template>

                <!-- 理想范围：进度条 + 文本 -->
                <template #range="{ record }">
                    <div class="fa-range">
                        <a-progress class="fa-range-bar" :percent="record.progress" :show-text="false" />
                        <div class="fa-range-text">
                            <span>{{ record.rangeText }}</span>
                            <span class="fa-range-benchmark">（同龄平均值 {{ record.benchmark }}）</span>
                        </div>
                    </div>
                </template>

                <!-- 评估等级 -->
                <template #level="{ record }">
                    <a-tag size="small" :color="levelColorMap[record.level]">
                        {{ record.level }}
                    </a-tag>
                </template>

                <!-- 肌肉分布占位：小人示意，可根据设计替换成图片 -->
                <template #body="{ record }">
                    <div class="fa-body-indicator">
                        <div v-for="(part, index) in record.bodyParts" :key="index" class="fa-body-dot" />
                    </div>
                </template>
            </a-table>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'

interface FitnessItem {
    id: number
    name: string
    value: number | string
    unit?: string
    progress: number // 当前值在进度条中的位置（0-100）
    rangeText: string
    benchmark: string
    level: '偏低' | '良好' | '优秀'
    bodyParts: string[]
}

const score = ref(68)

const items = ref<FitnessItem[]>([
    {
        id: 1,
        name: '上肢肌肉力量评估',
        value: 26,
        unit: '次',
        progress: 60,
        rangeText: '10 – 28 为理想区间',
        benchmark: '24 次',
        level: '良好',
        bodyParts: ['肩部', '手臂'],
    },
    {
        id: 2,
        name: '下肢肌肉力量评估',
        value: 40,
        unit: '次',
        progress: 80,
        rangeText: '16 – 32 为理想区间',
        benchmark: '28 次',
        level: '优秀',
        bodyParts: ['大腿', '小腿'],
    },
    {
        id: 3,
        name: '核心肌耐力评估',
        value: 14.5,
        unit: '次',
        progress: 45,
        rangeText: '15 – 30 为理想区间',
        benchmark: '20 次',
        level: '偏低',
        bodyParts: ['核心'],
    },
    {
        id: 4,
        name: '平衡能力评估',
        value: 34,
        unit: '秒',
        progress: 55,
        rangeText: '30 – 45 为理想区间',
        benchmark: '32 秒',
        level: '良好',
        bodyParts: ['下肢', '核心'],
    },
    {
        id: 5,
        name: '肩关节灵活性评估',
        value: 40,
        unit: '°',
        progress: 75,
        rangeText: '30 – 45 为理想区间',
        benchmark: '35°',
        level: '优秀',
        bodyParts: ['肩部'],
    },
    {
        id: 6,
        name: '髋关节灵活性评估',
        value: 16,
        unit: 'cm',
        progress: 65,
        rangeText: '10 – 18 为理想区间',
        benchmark: '14 cm',
        level: '良好',
        bodyParts: ['髋部'],
    },
    {
        id: 7,
        name: '爆发力评估',
        value: 34,
        unit: 'kg',
        progress: 70,
        rangeText: '24 – 36 为理想区间',
        benchmark: '30 kg',
        level: '优秀',
        bodyParts: ['下肢'],
    },
    {
        id: 8,
        name: '肺活量评估',
        value: 3300,
        unit: 'ml',
        progress: 55,
        rangeText: '2800 – 3800 为理想区间',
        benchmark: '3100 ml',
        level: '良好',
        bodyParts: ['胸部'],
    },
    {
        id: 9,
        name: '腰椎稳定性评估',
        value: 0.69,
        unit: 's',
        progress: 40,
        rangeText: '0.8 – 1.2 为理想区间',
        benchmark: '0.9 s',
        level: '偏低',
        bodyParts: ['腰部'],
    },
])

const columns = ref<TableColumnData[]>([
    {
        title: '项目名称',
        dataIndex: 'name',
        align: 'left',
        width: 180,
    },
    {
        title: '测量结果',
        dataIndex: 'value',
        slotName: 'result',
        align: 'left',
        width: 120,
    },
    {
        title: '理想范围',
        dataIndex: 'range',
        slotName: 'range',
    },
    {
        title: '评估等级',
        dataIndex: 'level',
        slotName: 'level',
        width: 120,
        align: 'center',
    },
    {
        title: '肌肉分布',
        dataIndex: 'body',
        slotName: 'body',
        width: 120,
        align: 'center',
    },
])

const levelColorMap: Record<FitnessItem['level'], string> = {
    偏低: 'red',
    良好: 'orange',
    优秀: 'green',
}
</script>

<style lang="less" scoped>
.fitness-assessment {
    padding: 24px 28px;
    background: #ffffff;

    .fa-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;

        .fa-score-block {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .fa-score-main {
                display: flex;
                align-items: baseline;
                gap: 4px;

                .fa-score-number {
                    font-size: 40px;
                    font-weight: 600;
                    color: #1d2129;
                    line-height: 1;
                }

                .fa-score-unit {
                    font-size: 14px;
                    color: #4e5969;
                }
            }

            .fa-score-text {
                font-size: 12px;
                color: #86909c;
                max-width: 420px;
                line-height: 1.6;

                .fa-score-highlight {
                    color: #165dff;
                }
            }
        }

        .fa-summary-block {
            min-width: 320px;
            font-size: 12px;
            color: #4e5969;

            .fa-summary-row {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-bottom: 6px;

                .fa-summary-label {
                    width: 72px;
                    color: #86909c;
                }

                .fa-summary-value {
                    flex: 1;
                    color: #1d2129;
                }
            }
        }
    }

    .fa-divider {
        margin: 16px 0;
    }

    .fa-content {
        .fa-section-title {
            font-size: 14px;
            font-weight: 500;
            color: #1d2129;
            margin-bottom: 12px;
        }

        .fa-table {
            .fa-result-value {
                font-size: 14px;
                color: #1d2129;
                margin-right: 4px;
            }

            .fa-result-unit {
                font-size: 12px;
                color: #86909c;
            }

            .fa-range {
                .fa-range-bar {
                    margin-bottom: 4px;
                }

                .fa-range-text {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #86909c;

                    .fa-range-benchmark {
                        color: #c0c4cc;
                    }
                }
            }

            .fa-body-indicator {
                display: flex;
                justify-content: center;
                gap: 4px;

                .fa-body-dot {
                    width: 8px;
                    height: 16px;
                    border-radius: 4px;
                    background: #165dff;
                    opacity: 0.4;

                    &:first-child {
                        opacity: 1;
                    }
                }
            }
        }
    }
}
</style>
