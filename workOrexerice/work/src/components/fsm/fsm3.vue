<template>
  <div class="fms-assessment-container">
    <a-row :gutter="24">
      <!-- 左侧：评分概览与雷达图 -->
      <a-col :span="6">
        <div class="left-panel">
          <!-- 总分区域 -->
          <div class="score-card">
            <div class="score-main">
              <span class="score-val">11</span>
              <span class="score-total">分</span>
            </div>
            <div class="score-sub">(满分 21 分)</div>
          </div>
          <!-- 风险评级 -->
          <div class="risk-card">
            <div class="risk-header">
              <span class="risk-label high">高风险</span>
              <span class="risk-icons">
                <icon-fire style="color: #f53f3f" />
                <icon-fire style="color: #f53f3f" />
                <icon-fire style="color: #f53f3f" />
                <icon-fire style="color: #f53f3f" />
                <icon-fire style="color: #f53f3f" />
              </span>
            </div>
            <div class="risk-desc">
              <p>高风险：评估中存在 0 分项目，或总分低于 14 分</p>
              <p>中风险：评估中存在 1 分项目，或总分等于 14 分</p>
              <p>低风险：评估中无 2 分以下项目，且总分高于 14 分</p>
            </div>
          </div>
          <a-divider />
          <!-- 雷达图 1: 动作协调性 -->
          <div class="chart-section first-chart">
            <div class="radar-container pentagon" ref="coordinationChartRef"></div>
          </div>
          <a-divider />
          <!-- 雷达图 2: 水平/冠状面稳定性 删除后，刷新钩子？-->
          <div class="chart-section">
            <div class="radar-container triangle" ref="stabilityChartRef"></div>
          </div>
        </div>
      </a-col>
      <!-- 右侧：详情数据（完全保留原结构，无修改） -->
      <a-col :span="18">
        <div class="section-container">
          <div class="section-header">
            <span class="title">动作分值</span>
            <a-link href="#" class="video-link">
              <icon-video-camera style="margin-right: 4px" /> 查看动作视频
            </a-link>
          </div>
          <a-table 
            :data="tableData" 
            :pagination="false" 
            :bordered="{ cell: true }"
            column-resizable
            class="score-table"
          >
            <template #columns>
              <a-table-column title="项目名称" data-index="name" />
              <a-table-column title="结果值（分）" data-index="result" align="center">
                <template #cell="{ record }">
                  <span class="primary-text">{{ record.result }}</span>
                </template>
              </a-table-column>
              <a-table-column title="是否有疼痛" data-index="pain" align="center">
                <template #cell="{ record }">
                  <span class="primary-text">{{ record.pain }}</span>
                </template>
              </a-table-column>
              <a-table-column title="最终得分（分）" data-index="finalScore" align="center">
                <template #cell="{ record }">
                  <span class="primary-text" :class="{ 'total-score': record.isTotal }">
                    {{ record.finalScore }}
                  </span>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
        <div class="section-container" style="margin-top: 20px;">
          <div class="section-header">
            <span class="title">分析详情</span>
          </div>
          <div class="analysis-list">
            <div 
              v-for="(item, index) in analysisList" 
              :key="index" 
              class="analysis-card"
            >
              <div class="card-header">
                <span class="card-title">{{ item.title }}</span>
              </div>
              <div class="card-status">
                <a-tag :color="item.tagColor" size="small">{{ item.tagName }}</a-tag>
                <div class="progress-wrapper">
                  <a-progress 
                    :percent="item.percent" 
                    :color="item.progressColor" 
                    :show-text="false" 
                    size="small"
                    class="custom-progress"
                  />
                </div>
                <span class="score-text" :style="{ color: item.progressColor }">{{ item.score }}分</span>
              </div>
              <a-row :gutter="48" class="card-content">
                <a-col :span="12">
                  <div class="text-content">
                    {{ item.description }}
                  </div>
                </a-col>
                <a-col :span="12">
                  <div class="text-content">
                    <span class="label">运动建议：</span><br/>
                    <div style="white-space: pre-wrap;">{{ item.suggestion }}</div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IconFire, IconVideoCamera } from '@arco-design/web-vue/es/icon';
import * as echarts from 'echarts'; // 仅导入ECharts核心库，无其他依赖

// --- 类型定义（完全保留原定义）---
interface AssessmentItem {
  name: string;
  result: string | number;
  pain: string;
  finalScore: number | string;
  isTotal?: boolean;
}
interface AnalysisItem {
  title: string;
  tagName: string;
  tagColor: string;
  percent: number;
  progressColor: string;
  score: number;
  description: string;
  suggestion: string;
}

// --- 模拟数据（完全保留原数据）---
const tableData = ref<AssessmentItem[]>([
  { name: '深蹲', result: 3, pain: '无', finalScore: 3 },
  { name: '跨栏步', result: '3  |  3', pain: '无', finalScore: 3 },
  { name: '直线弓步蹲', result: '3  |  3', pain: '有', finalScore: 0 },
  { name: '肩部灵活性', result: '3  |  3', pain: '无', finalScore: 2 },
  { name: '直腿主动上抬', result: '2  |  2', pain: '无', finalScore: 2 },
  { name: '稳定性俯卧撑', result: 1, pain: '有', finalScore: 1 },
  { name: '旋转稳定性', result: '1  |  2', pain: '无', finalScore: 0 },
  { name: '合计', result: '', pain: '', finalScore: 11, isTotal: true },
]);

const analysisList = ref<AnalysisItem[]>([
  {
    title: '躯干稳定性',
    tagName: '功能性缺陷',
    tagColor: 'orange',
    percent: 0.2,
    progressColor: '#ff7d00',
    score: 2,
    description: '您的躯干稳定性为xx级，几乎无法执行要求的稳定动作。您的核心肌群极度弱化，无法有效地支撑脊柱和骨盆，已严重影响日常活动和运动。',
    suggestion: '1.着重进行基础核心稳定性训练，如：桥式、死虫等；\n2.躯干肌肉群加强训练，如：平板支撑、卷腹等。'
  },
  {
    title: '髋膝踝关节灵活性',
    tagName: '动力学限制',
    tagColor: 'gold',
    percent: 0.4,
    progressColor: '#F7BA1E',
    score: 4,
    description: '您的髋膝踝关节的灵活性为xx级，虽能完成基础动作，但在复杂或高要求任务中表现受限，关节灵活性不足以支持高效运动。',
    suggestion: '1.进行强化关节灵活性训练，如：弹力带辅助下的关节松动术、蝴蝶式伸展、青蛙趴、PNF伸展。\n2.增强肌肉控制能力训练，如：提踵训练、单脚站立、直腿靠墙钟摆等、弹力带屈髋训练等平衡训练、功能性训练。'
  },
  {
    title: '髋与躯干的协调性',
    tagName: '动力学限制',
    tagColor: 'gold',
    percent: 0.4,
    progressColor: '#F7BA1E',
    score: 4,
    description: '您的髋与躯干的协调性为xx级，表明存在一定障碍，只能够完成基础动作。可能是由于肌肉力量不足、关节活动范围限制或神经肌肉控制不精确。',
    suggestion: '1.提高髋关节和躯干的肌肉力量，如：深蹲、硬拉。\n2.改善关节活动范围和提升神经肌肉协调性，如：髋关节旋转伸展、平衡垫训练。'
  },
  {
    title: '髋膝踝关节的稳定性',
    tagName: '功能性适应',
    tagColor: 'green',
    percent: 0.5,
    progressColor: '#00b42a',
    score: 5,
    description: '您的髋膝踝关节的稳定性为xx级，可以支持基本运动模式和日常活动，但在执行高级运动技巧和面对高强度挑战时可能存在局限。',
    suggestion: '1.提高髋关节和躯干的肌肉力量，如：深蹲、硬拉。\n2.改善关节活动范围和提升神经肌肉协调性，如：髋关节旋转伸展、平衡垫训练。'
  },
  {
    title: '双侧对称性',
    tagName: '功能性适应',
    tagColor: 'green',
    percent: 0.6,
    progressColor: '#00b42a',
    score: 6,
    description: '您的双侧对称性为xx级，有足够的双侧力量、灵活性和协调性，可以有效地完成日常活动和基础运动，但在高强度或高技巧性运动中可能仍存在轻微的双侧不对称。',
    suggestion: '1. 建议增加多方向稳定性训练，如：多平面单腿运动。\n2. 增强关节本体感觉训练，如：使用不稳定设备进行的复杂运动。'
  },
  {
    title: '下肢力量',
    tagName: '高度协调',
    tagColor: 'arcoblue',
    percent: 0.8,
    progressColor: '#165dff',
    score: 8,
    description: '您的下肢力量为xx级，与能在复杂和高负荷的运动中维持高效的动作执行和力量输出。有效提高运动效率和技能学习效率，同时降低受伤风险。',
    suggestion: '1.定期进行高级力量和爆发力训练，如：高强度深蹲、箱子跳等训练。\n2.专业的运动技巧训练，以保持和提升下肢力量和运动表现。'
  },
]);

// --- ECharts核心逻辑（对标index2简洁风格）---
// 1. 绑定图表容器ref
const coordinationChartRef = ref<HTMLElement | null>(null);
const stabilityChartRef = ref<HTMLElement | null>(null);

//雷达图数据
const coordinationDataValues = [100, 80, 70, 65, 85];
const stabilityDataValues = [60, 50, 55];

// 2. 图表实例变量
let coordinationChart: echarts.ECharts | null = null;
let stabilityChart: echarts.ECharts | null = null;

// 3. 图表配置项（保留原维度、样式，仅简化结构）
const coordinationOption = {
  radar: {
    shape: 'polygon', // 五边形
    radius: '70%',
    center: ['50%', '55%'],
    indicator: [
      { name: '动作协调性', max: 100 },
      { name: '关节灵敏度', max: 100 },
      { name: '力量平衡', max: 100 },
      { name: '稳定性掌控', max: 100 },
      { name: '双侧对称性', max: 100 },
    ],
    axisName: { fontSize: 15, color: '#666', distance: 15 },
    splitLine: { lineStyle: { color: '#e5e6eb' } },
    splitArea: { areaStyle: { color: '#f2f3f5' } },
    axisLine: { show: false },
  },
  series: [{
    type: 'radar',
    symbol: 'none',
    data: [{
      value: coordinationDataValues,
      areaStyle: { color: 'rgba(22,93,255,0.2)' },
      lineStyle: { color: '#165DFF', width: 2 },
      itemStyle: { color: '#165DFF' },
    }],
  }],
  tooltip: { show: false },
  legend: { show: false },
};

const stabilityOption = {
  radar: {
    shape: 'polygon', // 三角形
    radius: '70%',
    center: ['50%', '55%'],
    indicator: [
      { name: '水平面稳定性', max: 100 },
      { name: '矢状面稳定性', max: 100 },
      { name: '冠状面稳定性', max: 100 },
    ],
    axisName: { fontSize: 15, color: '#666', distance: 15 },
    splitLine: { lineStyle: { color: '#e5e6eb' }, show: false },
    splitArea: { areaStyle: { color: '#f2f3f5' } },
    axisLine: { show: false },
  },
  series: [{
    type: 'radar',
    symbol: 'none',
    data: [{
      value: stabilityDataValues,
      areaStyle: { color: 'rgba(22,93,255,0.2)' },
      lineStyle: { color: '#165DFF', width: 2 },
      itemStyle: { color: '#165DFF' },
    }],
  }],
  tooltip: { show: false },
  legend: { show: false },
};

// 4. 初始化图表（对标index2的极简初始化逻辑）
const initCharts = () => {
  // 初始化动作协调性雷达图
  if (coordinationChartRef.value) {
    coordinationChart = echarts.init(coordinationChartRef.value);
    coordinationChart.setOption(coordinationOption);
  }
  // 初始化水平面稳定性雷达图
  if (stabilityChartRef.value) {
    stabilityChart = echarts.init(stabilityChartRef.value);
    stabilityChart.setOption(stabilityOption);
  }
};

// 5. 生命周期：挂载时初始化 + 窗口resize适配
onMounted(() => {
  initCharts();
  window.addEventListener('resize', () => {
    coordinationChart?.resize();
    stabilityChart?.resize();
  });
});
</script>

<style lang="less" scoped>
// 变量（完全保留原定义）
@gray-1: #f7f8fa;
@gray-6: #86909c;
@gray-10: #1d2129;
@primary-color: #165dff;
@border-color: #e5e6eb;

.fms-assessment-container {
  padding: 20px;
  background-color: #fff;
  color: @gray-10;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

// 左侧样式（仅修改雷达图容器样式，确保图表渲染）
.left-panel {
  border: 1px solid @border-color;
  border-radius: 4px;
  padding: 24px 16px;
  background-color: #fff;
  height: 100%;
}

.score-card {
  text-align: center;
  margin-bottom: 24px;
  
  .score-main {
    .score-val {
      font-size: 48px;
      font-weight: 500;
      line-height: 1;
    }
    .score-total {
      font-size: 14px;
      color: @gray-6;
      margin-left: 4px;
    }
  }
  .score-sub {
    margin-top: 8px;
    font-size: 12px;
    color: @gray-6;
  }
}

.risk-card {
  margin-bottom: 24px;
  
  .risk-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .risk-label {
      font-size: 16px;
      font-weight: bold;
      &.high {
        color: #f53f3f;
      }
    }
    .risk-icons {
      display: flex;
      font-size: 12px;
    }
  }
  
  .risk-desc {
    p {
      margin: 4px 0;
      font-size: 12px;
      color: @gray-6;
      line-height: 1.5;
    }
  }
}

.chart-section {
  margin-top: 24px;
  text-align: center;
  
  
  .chart-title {
    font-size: 12px;
    color: @gray-6;
    margin-bottom: 8px;
  }
  
  // 关键：确保图表容器有固定宽高，适配ECharts渲染
  .radar-container {
    width: 100%;
    height: 180px;
    margin: 0 auto;
  }
}

//.chart-section:nth-child(2) {
//    border-bottom: 1px solid black;
//}
//
//.first-chart {
//    border-bottom: 1px solid black;
//}

// 右侧样式（完全保留原样式，无修改）
.section-container {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .title {
      font-size: 16px;
      font-weight: 500;
      color: @gray-10;
    }
    
    .video-link {
      font-size: 14px;
    }
  }
}

:deep(.arco-table-th) {
  background-color: @gray-1;
  font-weight: 500;
}

:deep(.arco-table-cell) {
  color: @primary-color;
}

:deep(.arco-table-td) {
  &:first-child .arco-table-cell {
    color: @gray-10;
  }
}

.primary-text {
  color: @primary-color;
  &.total-score {
    font-weight: bold;
    font-size: 16px;
  }
}

.analysis-list {
  background-color: #fff;
}

.analysis-card {
  background-color: #f7f8fa;
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 2px;
  
  .card-header {
    margin-bottom: 12px;
    .card-title {
      font-size: 15px;
      font-weight: 500;
    }
  }
  
  .card-status {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 16px;
    
    :deep(.arco-tag) {
      border-radius: 2px;
    }
    .progress-wrapper {
      width: 150px;
    }
    
    .score-text {
      font-weight: bold;
    }
  }
  
  .card-content {
    .text-content {
      font-size: 13px;
      line-height: 1.8;
      color: #4e5969;
      
      .label {
        color: @gray-6;
      }
    }
  }
}
</style>