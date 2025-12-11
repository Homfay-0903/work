<template>
  <div class="report-container">
    <!-- 左侧概览栏（完整保留 index2 结构） -->
    <div class="left-panel">
      <!-- 雷达图区域 -->
      <div class="radar-section">
        <div class="chart-header">
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
          <div class="legend-item green">
            <div class="legend-icon green-line"></div>
            <span class="date-text">本次</span>
          </div>
        </div>
        <!-- 雷达图容器（核心渲染区） -->
        <div ref="radarChartRef" class="radar-chart-container"></div>
        <div class="radar-legend-dots">
          <span><i class="dot red"></i>较弱</span>
          <span><i class="dot yellow"></i>中等</span>
          <span><i class="dot blue"></i>良好</span>
          <span><i class="dot green"></i>优秀</span>
        </div>
      </div>
      <!-- 左侧能力汇总列表 -->
      <div class="stat-list">
        <div class="stat-item" v-for="(item, index) in summaryList" :key="index">
          <span class="label">{{ item.name }}</span>
          <div class="status-badge" :class="item.status">{{ item.statusText }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧详情区（完整保留 index2 结构，无需修改） -->
    <div class="right-panel">
      <!-- 头部评分 -->
      <div class="score-header">
        <div class="score-num">
          68<span class="unit">分</span>
        </div>
        <div class="score-desc">
          你的运动能力一般，每周至少进行3天有氧、力量运动，每次坚持做30分钟以上，运动需要注意有序提升上肢能力、下肢能力、核心能力、平衡性和柔韧性。
        </div>
      </div>

      <!-- 肌肉能力分析 -->
      <div class="section-block">
        <div class="section-title">肌肉能力分析</div>
        <div class="muscle-analysis-content">
          <div class="muscle-map">
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
          <div class="muscle-grids">
            <div class="muscle-grid-item" v-for="item in muscleAnalysisData" :key="item.name">
              <span class="m-name">{{ item.name }}</span>
              <div class="m-bar-container">
                <div class="segment-bar">
                  <div class="segment" :class="{ 'filled': getSegmentLevel(item.grade) >= 1, [getSafeColorType(item)]: true }"></div>
                  <div class="segment" :class="{ 'filled': getSegmentLevel(item.grade) >= 2, [getSafeColorType(item)]: true }"></div>
                  <div class="segment" :class="{ 'filled': getSegmentLevel(item.grade) >= 3, [getSafeColorType(item)]: true }"></div>
                  <div class="segment" :class="{ 'filled': getSegmentLevel(item.grade) >= 4, [getSafeColorType(item)]: true }"></div>
                </div>
              </div>
              <span class="m-grade" :class="item.colorType">{{ item.grade }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目测试结果 -->
      <div class="section-block">
        <div class="section-title">项目测试结果</div>
        <div class="table-header">
          <div class="col-name">项目名称</div>
          <div class="col-result">测量结果</div>
          <div class="col-dist">肌肉分布</div>
        </div>
        <div class="test-list">
          <div class="test-row" v-for="(item, index) in testResults" :key="index">
            <div class="col-name cell-flex">
              <div class="icon-box">
                <component :is="item.icon" size="24" :style="{ color: '#165DFF' }" />
              </div>
              <div class="icon-name">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="col-result cell-content">
              <div class="value-display">
                <span class="val">{{ item.value }}</span>
                <span class="unit">{{ item.unit }}</span>
                <span class="trend" v-if="item.trend">
                  <icon-arrow-up v-if="item.trend === 'up'" style="color: #00B42A; margin-left:8px;" />
                  <icon-arrow-down v-else style="color: #F53F3F; margin-left:8px; " />
                  <span class="trend-val">6</span>
                </span>
                <span class="trend" v-if="item.trendText">
                  <span class="trend-text">{{ item.trendText }}</span>
                </span>
              </div>
              <div class="range-slider-container">
                <div class="tick-labels">
                  <div class="tick-label" style="left: 25%">16</div>
                  <div class="tick-label" style="left: 50%">28</div>
                  <div class="tick-label" style="left: 75%">35</div>
                </div>
                <div class="range-track">
                  <div class="track-bg-layer">
                    <div class="bg-segment"></div>
                    <div class="bg-segment"></div>
                    <div class="bg-segment"></div>
                    <div class="bg-segment"></div>
                  </div>
                  <div class="active-track" :class="item.statusColor" :style="{ width: item.percentage + '%' }"></div>
                  <div class="indicator-dot" :class="item.statusColor" :style="{ left: item.percentage + '%' }"></div>
                </div>
                <div class="range-labels">
                  <span :class="{ active: item.status === 'weak' }">较弱</span>
                  <span :class="{ active: item.status === 'avg' }">中等</span>
                  <span :class="{ active: item.status === 'good' }">良好</span>
                  <span :class="{ active: item.status === 'excellent' }">优秀</span>
                </div>
              </div>
            </div>
            <div class="col-dist cell-center">
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
import { ref, reactive, onMounted } from 'vue';
import * as echarts from 'echarts'; // 仅导入ECharts核心库，无多余依赖
import {
  IconCaretDown, IconArrowUp, IconArrowDown,
  IconMan, IconHeartFill, IconExperiment, IconThunderbolt
} from '@arco-design/web-vue/es/icon';

// --- 类型定义（保留核心，无冗余）---
interface MuscleItem {
  name: string;
  grade: 'A' | 'B' | 'C' | 'D';
  colorType?: string;
}
interface TestItem {
  name: string;
  icon: any;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down';
  trendText?: string;
  percentage: number;
  status: 'weak' | 'avg' | 'good' | 'excellent';
  statusColor: string;
}
interface HistoryData {
  id: number;
  date: string;
  values: number[];
}

// --- 核心数据（完全复用 index2 数据，保证一致性）---
const currentDataValues = [70, 65, 85, 75, 80]; // 本次雷达图数据
const historyOptions = ref<HistoryData[]>([
  { id: 1, date: '2023.12.28 - 16:30', values: [40, 50, 60, 45, 55] },
  { id: 2, date: '2023.11.15 - 10:00', values: [30, 40, 50, 35, 45] },
  { id: 3, date: '2023.10.01 - 14:20', values: [50, 55, 40, 50, 50] },
]);
const selectedHistory = ref<HistoryData>(historyOptions.value[0]); // 默认选中第一条历史数据
const radarChartRef = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null; // 图表实例

// --- 雷达图核心逻辑（极简配置，无多余参数）---
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
      center: ['50%', '55%'],
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
          // 历史数据（蓝色）
          {
            value: selectedHistory.value.values,
            name: 'History',
            symbol: 'emptyCircle',
            itemStyle: { color: '#165dff' },
            lineStyle: { width: 2 },
            areaStyle: { color: 'rgba(22, 93, 255, 0.1)' }
          },
          // 本次数据（绿色）
          {
            value: currentDataValues,
            name: 'Current',
            symbol: 'emptyCircle',
            itemStyle: { color: '#00b42a' },
            lineStyle: { width: 2 },
            areaStyle: { color: 'rgba(0, 180, 42, 0.1)' }
          }
        ]
      }
    ],
    tooltip: { show: true }, // 必要交互保留
    legend: { show: false } // 简化：隐藏图例（如需显示可改为true）
  };
  myChart.setOption(option);
};

// 日期切换：选中历史数据后更新图表
const handleDateSelect = (val: any) => {
  selectedHistory.value = val;
  updateChart();
};

// --- 生命周期：初始化图表 + 窗口适配 ---
onMounted(() => {
  if (radarChartRef.value) {
    myChart = echarts.init(radarChartRef.value);
    updateChart();
    // 窗口 resize 适配
    window.addEventListener('resize', () => myChart?.resize());
  }
});

// --- 其他页面数据（完全复用 index2，保证功能完整）---
const summaryList = reactive([
  { name: '上肢肌力', status: 'weak', statusText: '较弱' },
  { name: '下肢肌力', status: 'avg', statusText: '中等' },
  { name: '平衡能力', status: 'excellent', statusText: '优秀' },
  { name: '核心稳定性', status: 'good', statusText: '良好' },
  { name: '柔韧性', status: 'good', statusText: '良好' },
]);

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

// --- 辅助函数（保留核心，无冗余）---
const getSafeColorType = (item: MuscleItem): string => item.colorType || 'default-color';
const getSegmentLevel = (grade: string) => {
  const map: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
  return map[grade] || 0;
};
</script>

<style lang="less" scoped>
// 设计稿核心颜色（保留 index2 原始定义）
@color-red: #FF7D00;
@color-yellow: #FFC72E;
@color-blue: #165DFF;
@color-green: #00B42A;
@color-bg: #F7F8FA;
@color-border: #f2f2f2;
@text-main: #1D2129;
@text-sub: #86909C;

// 页面整体样式（完全复用 index2，保证视觉一致）
.report-container {
  display: flex;
  gap: 16px;
  background-color: #fff;
  padding: 20px;
  color: @text-main;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif;
  min-height: 100vh;
}

// 左侧面板样式
.left-panel {
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid @color-border;
  padding-right: 20px;

  .radar-section {
    margin-bottom: 10px;

    .chart-header {
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
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid;
          position: relative;
          margin-right: 12px;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -8px;
            right: -8px;
            height: 2px;
            background: inherit;
            transform: translateY(-50%);
            z-index: 0;
          }

          &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: #fff;
            border-radius: 50%;
            z-index: 1;
          }

          &.blue-line {
            border-color: @color-blue;
            background: @color-blue;
          }

          &.green-line {
            border-color: @color-green;
            background: @color-green;
          }
        }

        .date-text {
          margin-right: 8px;
          font-weight: 500;
        }

        .arrow-icon {
          color: @color-blue;
          font-size: 12px;
        }
      }
    }

    // 雷达图容器（关键：固定宽高保证渲染）
    .radar-chart-container {
      width: 100%;
      height: 280px;
    }

    .radar-legend-dots {
      display: flex;
      justify-content: right;
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

        &.red { background: @color-red; }
        &.yellow { background: @color-yellow; }
        &.blue { background: @color-blue; }
        &.green { background: @color-green; }
      }
    }
  }

  .stat-list {
    .stat-item {
      display: flex;
      justify-content: space-between;
      background-color: #F7F8FA;
      border-radius: 10px;
      align-items: center;
      padding: 5px 0;
      margin-bottom: 10px;

      .label {
        font-size: 12px;
        margin-left: 20px;
        color: #4E5969;
      }

      .status-badge {
        width: 40px;
        height: 24px;
        margin-right: 20px;
        line-height: 24px;
        text-align: center;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;

        &.weak {
          background-color: #FFF7E8;
          color: @color-red;
        }

        &.avg {
          background-color: #FFFBE6;
          color: @color-yellow;
        }

        &.good {
          background-color: #E8F3FF;
          color: @color-blue;
        }

        &.excellent {
          background-color: #E8FFEA;
          color: @color-green;
        }
      }
    }
  }
}

// 右侧面板样式（完全复用 index2，保证功能完整）
.right-panel {
  flex: 1;
  margin-left: 20px;

  .score-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .score-num {
      font-size: 48px;
      font-weight: 500;
      line-height: 1;
      margin-right: 24px;
      margin-left: 20px;

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
      border-right: 1px solid transparent;

      .human-shape {
        text-align: center;

        .shape-body {
          width: 100px;
          height: 150px;
          background: #e5e6eb;
          margin-bottom: 10px;
          border-radius: 8px;
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

          .red { background: @color-red; }
          .yellow { background: @color-yellow; }
          .blue { background: @color-blue; }
          .green { background: @color-green; }
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
                &.red { background: @color-red; }
                &.yellow { background: @color-yellow; }
                &.blue { background: @color-blue; }
                &.green { background: @color-green; }
              }
            }
          }
        }

        .m-grade {
          width: 20px;
          text-align: right;
          font-weight: bold;
          font-size: 14px;

          &.red { color: @color-red; }
          &.yellow { color: @color-yellow; }
          &.blue { color: @color-blue; }
          &.green { color: @color-green; }
        }
      }
    }
  }

  .table-header {
    display: flex;
    gap: 20px;
    padding: 10px 0px;
    border-radius: 4px;
    color: @text-sub;
    font-size: 12px;
    margin-bottom: 10px;

    .col-name {
      width: 25%;
      text-align: center;
      height: 50px;
      line-height: 50px;
      background: @color-border;
    }

    .col-result {
      flex: 1;
      text-align: center;
      height: 50px;
      line-height: 50px;
      background: @color-border;
    }

    .col-dist {
      width: 15%;
      text-align: center;
      height: 50px;
      line-height: 50px;
      background: @color-border;
    }
  }

  .test-list {
    .test-row {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      gap: 20px;
    }

    .cell-flex {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafd;
      flex-direction: column;
      gap: 20px;
      height: 200px;
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 10px;

        .tick-labels {
          position: relative;
          height: 20px;
          margin-bottom: 4px;

          .tick-label {
            position: absolute;
            top: 0;
            transform: translateX(-50%);
            font-size: 12px;
            color: #86909C;
            font-family: 'Inter';
          }
        }

        .range-track {
          position: relative;
          height: 6px;
          width: 100%;
          margin-bottom: 8px;

          .track-bg-layer {
            display: flex;
            width: 100%;
            height: 100%;
            gap: 6px;

            .bg-segment {
              flex: 1;
              background-color: #dedede;
              border-radius: 2px;
            }
          }

          .active-track {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            border-radius: 2px;
            z-index: 1;

            &.red { background: @color-red; }
            &.yellow { background: @color-yellow; }
            &.blue { background: @color-blue; }
            &.green { background: @color-green; }
          }

          .indicator-dot {
            width: 12px;
            height: 12px;
            background: #fff;
            border: 3px solid;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            box-shadow: 0 0 2px rgba(0,0,0,0.1);

            &.red { border-color: @color-red; }
            &.yellow { border-color: @color-yellow; }
            &.blue { border-color: @color-blue; }
            &.green { border-color: @color-green; }
          }
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #86909C;

          span {
            flex: 1;
            text-align: center;

            &.active {
              color: @text-main;
              font-weight: 500;
            }

            &:first-child { text-align: left; padding-left: 10%; }
            &:last-child { text-align: right; padding-right: 10%; }
          }
        }
      }
    }

    .cell-content {
      background: #f8fafd;
      height: 200px;
    }

    .col-dist {
      width: 15%;
      display: flex;
      justify-content: center;
    }

    .cell-center {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafd;
      height: 200px;
    }
  }
}

// 响应式适配（保留 index2 原始逻辑）
@media (max-width: 1200px) {
  .muscle-analysis-content .muscle-grids {
    grid-template-columns: 1fr;
  }
}
</style>