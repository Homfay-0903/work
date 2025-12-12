<template>
    <div class="box">
        <div class="legend-icon green-line">
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
    .box {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    
    .legend-icon {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid;
        position: relative;

        &.green-line {
            background: green;
        }

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -8px;
            right: -8px;
            height: 2px;
            background: red; // 继承border颜色
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
    }
</style>