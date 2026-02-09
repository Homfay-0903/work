<!--
 * @Description: 打印机状态组件
 * @Author: gaoyuanyuan
 * @Date: 2019-10-15 18:24:30
 * @LastEditTime: 2022-04-20 17:39:20
 * @LastEditors: Please set LastEditors 
 -->
<template>
    <div class="print-status">
        <img class="print-icon" :src="require('@img/top/print.svg')" alt="打印机状态" />
        <img
            v-if="external.printer === 3"
            :src="require('@img/top/print_status_working.svg')"
            class="status working"
            alt="打印机打印中动画"
        />
        <i v-else :class="['dot', external.printer === 2 ? 'error' : '']"></i>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'PrintStatus',
    computed: mapGetters({
        external: 'external'
    })
}
</script>
<style lang="less" scoped>
.print-status {
    position: relative;
    display: flex;
    align-items: center;
    .print-icon {
        width: 48px;
    }
    .status {
        position: absolute;
        width: 16px;
        height: 16px;
        top: 23px;
        right: -3px;
    }
    .dot {
        position: absolute;
        top: 25px;
        right: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50em;
        background: #2bc472;
        &.error {
            background: #ff3d1f;
        }
    }
    .working {
        animation: rotating 1.5s linear infinite;
    }
}
@keyframes rotating {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
