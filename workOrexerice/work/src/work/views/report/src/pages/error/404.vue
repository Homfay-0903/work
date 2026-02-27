<template>
    <div class="error-page">
        <div class="error-page-content">
            <img src="@/assets/images/home/404.png" />
            <p>你要的页面可能去健身了！</p>
            <el-button type="text" @click="goBack">返回</el-button>
            <el-button type="text" @click="refresh">刷新</el-button>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        refresh() {
            this.$router.go(0)
        }
    }
}
</script>
<style lang="less" scoped>
html,
body,
.error-page {
    width: 100vw;
    height: 100vh;
    .error-page-content {
        position: relative;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            margin-bottom: 80px;
        }
    }
}
</style>