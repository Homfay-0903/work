<template>
  <div class="muscle-container">
    <!-- 肌肉可视化区域 -->
    <div class="muscle-svg-wrapper">
      <svg
        viewBox="0 0 300 500"
        class="muscle-svg"
        xmlns="http://www.w3.org/2000/svg"
      >

        <path
          id="head"
          d="M115,50 A35,35 0 0,1 185,50 L150,10 Z"  
          fill="#f0f0f0"
        />
        
        <!-- 【优化：身体位置与头部衔接】 -->
        <rect x="100" y="50" width="100" height="300" rx="20" fill="#f0f0f0" />


        <!-- 人体轮廓（背景） -->
        <rect x="100" y="50" width="100" height="300" rx="20" fill="#f0f0f0" />
        <circle cx="150" y="40" r="30" fill="#f0f0f0" />
        
        <!-- 肌肉块：胸肌 -->
        <path
          id="chest"
          d="M100,100 Q150,80 200,100 L190,180 Q150,160 110,180 Z"
          :fill="getMuscleColor('chest')"
          @click="selectMuscle('chest')"
          class="muscle-part"
        />
        <!-- 肌肉块：左二头肌 -->
        <path
          id="bicep-left"
          d="M100,180 L80,280 L90,280 L110,190 Z"
          :fill="getMuscleColor('bicep-left')"
          @click="selectMuscle('bicep-left')"
          class="muscle-part"
        />
        <!-- 肌肉块：右二头肌 -->
        <path
          id="bicep-right"
          d="M200,180 L220,280 L210,280 L190,190 Z"
          :fill="getMuscleColor('bicep-right')"
          @click="selectMuscle('bicep-right')"
          class="muscle-part"
        />
        <!-- 肌肉块：腹肌 -->
        <path
          id="abs"
          d="M120,180 L180,180 L170,250 Q150,240 130,250 Z"
          :fill="getMuscleColor('abs')"
          @click="selectMuscle('abs')"
          class="muscle-part"
        />
        <!-- 肌肉块：左三头肌 -->
        <path
          id="tricep-left"
          d="M80,280 L70,350 L90,350 L100,280 Z"
          :fill="getMuscleColor('tricep-left')"
          @click="selectMuscle('tricep-left')"
          class="muscle-part"
        />
        <!-- 肌肉块：右三头肌 -->
        <path
          id="tricep-right"
          d="M220,280 L230,350 L210,350 L200,280 Z"
          :fill="getMuscleColor('tricep-right')"
          @click="selectMuscle('tricep-right')"
          class="muscle-part"
        />
      </svg>
    </div>

    <!-- 交互控制面板 -->
    <div class="muscle-control-panel">
      <h3>肌肉强度调节</h3>
      
      <!-- 选中肌肉信息 -->
      <div v-if="selectedMuscle" class="selected-info">
        当前选中：<span class="muscle-name">{{ muscleNames[selectedMuscle] }}</span>
      </div>
      <div v-else class="selected-info">
        点击肌肉块选择要调节的部位
      </div>

      <!-- 强度滑块（选中肌肉时显示） -->
      <div v-if="selectedMuscle" class="strength-slider">
        <label>
          强度值 (0-100)：{{ muscleStrength[selectedMuscle] }}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="muscleStrength[selectedMuscle]"
          class="slider-input"
        />
      </div>

      <!-- 肌肉强度对照表 -->
      <div class="muscle-table">
        <h4>所有肌肉强度</h4>
        <table>
          <thead>
            <tr>
              <th>肌肉部位</th>
              <th>强度值</th>
              <th>颜色预览</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(id, index) in muscleIds" :key="index">
              <td>{{ muscleNames[id] }}</td>
              <td>{{ muscleStrength[id] }}</td>
              <td>
                <div
                  class="color-preview"
                  :style="{ backgroundColor: getMuscleColor(id) }"
                ></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 1. 定义核心类型
type MuscleId = 'chest' | 'bicep-left' | 'bicep-right' | 'abs' | 'tricep-left' | 'tricep-right'

// 2. 肌肉ID与中文名称映射
const muscleNames = {
  'chest': '胸肌',
  'bicep-left': '左二头肌',
  'bicep-right': '右二头肌',
  'abs': '腹肌',
  'tricep-left': '左三头肌',
  'tricep-right': '右三头肌'
} as const

// 3. 所有肌肉ID列表
const muscleIds = Object.keys(muscleNames) as MuscleId[]

// 4. 响应式数据：肌肉强度（0-100）
const muscleStrength = ref<Record<MuscleId, number>>({
  chest: 85,
  'bicep-left': 70,
  'bicep-right': 75,
  abs: 90,
  'tricep-left': 60,
  'tricep-right': 65
})

// 5. 选中的肌肉
const selectedMuscle = ref<MuscleId | null>(null)

// 6. 核心逻辑：根据强度计算颜色（0=绿色，100=红色，中间渐变）
const getMuscleColor = computed(() => (muscleId: MuscleId) => {
  const strength = muscleStrength.value[muscleId]
  // HSL颜色模式更易实现渐变（H:色相，S:饱和度，L:亮度）
  // 0→绿色(H=120)，100→红色(H=0)，饱和度70%，亮度50%
  const hue = 120 - (120 * strength) / 100 // 色相从120（绿）降到0（红）
  return `hsl(${hue}, 70%, 50%)`
})

// 7. 选中肌肉的方法
const selectMuscle = (muscleId: MuscleId) => {
  selectedMuscle.value = muscleId
}
</script>

<style scoped>
.muscle-container {
  display: flex;
  gap: 40px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

/* SVG样式 */
.muscle-svg-wrapper {
  flex: 1;
}
.muscle-svg {
    margin-top: 10px;
  width: 100%;
  max-width: 400px;
  height: auto;
}
.muscle-part {
  cursor: pointer;
  transition: opacity 0.2s;
}
.muscle-part:hover {
  opacity: 0.8;
  stroke: #333;
  stroke-width: 1;
}

/* 控制面板样式 */
.muscle-control-panel {
  flex: 1;
  min-width: 400px;
}
.selected-info {
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}
.muscle-name {
  color: #e53935;
  font-weight: bold;
}
.strength-slider {
  margin: 20px 0;
}
.slider-input {
  width: 100%;
  margin: 10px 0;
}

/* 颜色预览与表格 */
.color-preview {
  width: 30px;
  height: 15px;
  border-radius: 2px;
  border: 1px solid #ddd;
}
.muscle-table {
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
th {
  background: #f0f0f0;
}
</style>