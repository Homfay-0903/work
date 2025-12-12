<!-- components/HumanMuscleChart.vue -->
<template>
  <div class="muscle-container">
    <svg
      :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 循环渲染每一块肌肉 -->
      <path
        v-for="muscle in muscles"
        :key="muscle.id"
        :d="muscle.path"
        :fill="getMuscleColor(muscle.strength)"
        :stroke="strokeColor"
        stroke-width="1"
        class="muscle-path"
        @click="handleMuscleClick(muscle)"
        @mouseenter="handleMouseEnter(muscle)"
        @mouseleave="handleMouseLeave"
      />
    </svg>
    <!-- 可以在这里添加图例或信息面板 -->
    <div v-if="hoveredMuscle" class="tooltip">
      肌肉: {{ hoveredMuscle.name }} | 强度: {{ hoveredMuscle.strength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Muscle } from "../../types/muscle";
import { strengthColorMap } from '../../types/muscle';

// 定义组件Props，肌肉数据可以从父组件传入
const props = defineProps<{
  muscles: Muscle[];
}>();

const viewBoxWidth = 800;
const viewBoxHeight = 1200;
const strokeColor = '#333';

// 交互状态
const hoveredMuscle = ref<Muscle | null>(null);

// 颜色计算函数
const getMuscleColor = (strength: number): string => {
  // 确保强度值在映射范围内
  const level = Math.max(0, Math.min(5, Math.floor(strength)));
  return strengthColorMap[level] || strengthColorMap[0];
};

// 交互事件
const handleMuscleClick = (muscle: Muscle) => {
  console.log('点击肌肉:', muscle);
  // 可以触发事件或更新状态
};

const handleMouseEnter = (muscle: Muscle) => {
  hoveredMuscle.value = muscle;
};

const handleMouseLeave = () => {
  hoveredMuscle.value = null;
};
</script>

<style scoped>
.muscle-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.muscle-path {
  cursor: pointer;
  transition: fill 0.3s ease, filter 0.2s ease; /* 添加平滑的颜色过渡效果 */
}

.muscle-path:hover {
  filter: brightness(1.1); /* 高亮效果 */
}

.tooltip {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}
</style>