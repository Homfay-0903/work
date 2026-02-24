<template>
    <div class="exception-wrapper">
        <div class="background-image">
            <img :src="exception.picture" alt />
        </div>
        <p class="title">{{ exception.title }}</p>
        <p class="desc">
            {{ exception.desc }}
            <span v-if="exception.loader" @click="reLoad">重新加载</span>
        </p>
        <div class="history-result" v-if="exception.look">
            <span class="look-btn" v-if="exception.close" @click="look">查看历史结果</span>
            <span class="close-btn" @click="close">关闭页面</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        exception: Object
    },
    methods: {
        reLoad() {
            this.$emit('reLoad')
        },
        look() {
            this.$emit('look')
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style lang="less" scoped>
.exception-wrapper {
    position: absolute;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);
    .background-image {
        padding-top: 72px;
        padding-bottom: 30px;
        img {
            max-width: 180px;
            display: inline-block;
            // 禁止部分安卓机下图片自动放大
            pointer-events: none;
        }
    }
    > p {
        color: #6468ae;
        &.title {
            line-height: 1.5;
            font-size: 16px;
        }
        &.desc {
            line-height: 1.71;
            font-size: 14px;
            max-width: 75%;
            margin: 4px auto;
            span {
                color: #fff;
                text-decoration: underline;
            }
        }
    }
    .history-result {
        display: inline-block;
        span {
            display: block;
            font-size: 16px;
            width: 200px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            border-radius: 6px;
        }
        span:first-child {
            background-image: linear-gradient(to right, #00e3c9, #00a4e6);
            margin-bottom: 16px;
            margin-top: 118px;
        }
    }
}
@media (min-width: 992px) {
    .exception-wrapper {
        .background-image {
            padding-top: 40px !important;
            padding-bottom: 20px;
            img {
            }
        }
        > p.title {
            font-size: 10px;
        }
    }
}
</style>