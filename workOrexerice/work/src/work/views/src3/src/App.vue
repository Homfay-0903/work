<!--
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-08 14:42:01
 * @LastEditors: liutq
 * @LastEditTime: 2022-03-25 14:05:15
-->
<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
    created() {
        // 定时检测设备到期时间 - 存储在store
        window.logger.info('main')
    }
}
</script>

<style lang="less"></style>
