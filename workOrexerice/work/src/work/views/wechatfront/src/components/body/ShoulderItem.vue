<template>
    <!--肩部功能-->
    <div
        class="shoulder-assess"
        :class="{'no-container-background': !isSupportWebgl.webgl}"
    >
        <div class="left-prediction-edit"></div>
        <div class="person-img" v-if="isSupportWebgl.webgl">
            <img src="@/assets/images/Shoulder/Bitmap@2x.png">
        </div>
    </div>
</template>

<script>
import isSupportWebgl from '@/assets/js/webgl.js'

export default {
    props: ['iframeId', 'textPosition'],
    data() {
        return {
            isSupportWebgl
        }
    },
}
</script>
<style lang="less" scoped>
.shoulder-assess {
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .person-img {
        padding-left: 0 !important;
    }
}
</style>
