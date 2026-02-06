<template>
    <div class="login-box" id="login">
        <!-- 登录页面 -->
        <h1 @click="goLogin" class="login-title">登录维塑管理系统</h1>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'Login',
    mounted() {
        this.renderResize()
        // 监听resize方法
        window.addEventListener('resize', this.renderResize, false)
    },
    beforeDestroy() {
        // 移除监听
        window.removeEventListener('resize', this.renderResize, false)
    },
    methods: {
        goLogin() {
            this.$router.push('/')
        },
        renderResize() {
            const height = (window.innerHeight * 1300) / window.innerWidth
            document.getElementById('login').style.minHeight = `${height}px`
        }
    }
}
</script>

<style scoped lang="less">
.login-box {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #f5f6fa;
    background: url(../../assets/images/login/map-bg.png) no-repeat center center;
    background-size: 736px;
    background-color: #f5f6fa;

    .login-title {
        text-align: left;
        cursor: pointer;
        font-size: 29px;
        font-weight: 500;
        padding: 40px 0 0 64px;
        letter-spacing: 0.3px;
        color: #172b4d;
    }
}
</style>