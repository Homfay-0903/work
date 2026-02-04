<template>
    <div class="loading-container" v-if="show">
        <div class="loading-spinner"></div>
        <p class="loading-text" v-if="text">{{ text }}</p>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        show: {
            type: Boolean,
            default: true
        },
        text: {
            type: String,
            default: '加载中...'
        }
    }
}
</script>

<style lang="less" scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-top: 900px;

    .loading-spinner {
        width: 80px;
        height: 80px;
        border: 8px solid #f3f3f3;
        border-top: 8px solid @color-blue;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .loading-text {
        margin-top: 24px;
        font-size: 36px;
        color: #e7e9f0;
        font-family: OPPOSansR;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
