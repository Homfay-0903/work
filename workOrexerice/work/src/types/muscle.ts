// types/muscle.ts
export interface Muscle {
  id: string; // 唯一标识，如 'biceps_brachii'
  name: string; // 肌肉名称，如 '肱二头肌'
  path: string; // SVG路径数据 (d属性)
  strength: number; // 肌肉强度值，例如 0-5
}

// 定义强度等级对应的颜色，参考了设计系统的颜色映射理念[citation:6]
export const strengthColorMap: Record<number, string> = {
  0: '#e0e0e0', // 非常弱 - 浅灰
  1: '#ffcc80', // 弱 - 浅橙
  2: '#ffb74d', // 一般 - 橙色
  3: '#ff9800', // 中等 - 亮橙
  4: '#f57c00', // 强 - 深橙
  5: '#e65100', // 非常强 - 红棕
};