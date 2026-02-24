<!--
 * @Description:
 * @Author: fanyunbo
 * @Date: 2025-12-18 13:32:37
 * @LastEditTime: 2025-12-25 11:12:00
 * @LastEditors: liutq
 * @Reference:
-->
<template>
    <div class="pc-report">
        <pc-shoulder-data></pc-shoulder-data>
    </div>
</template>

<script>
import PcShoulderData from '@/components/body/PcShoulderData'

export default {
    name: 'ShoulderTab',
    components: {
        PcShoulderData
    }
}
</script>

<style scoped lang="less">
.pc-report {
    // 覆盖全局字体，不使用 PingFang SC
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}
</style>
