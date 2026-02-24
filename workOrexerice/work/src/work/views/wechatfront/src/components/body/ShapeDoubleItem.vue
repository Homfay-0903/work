<template>
    <!--体型预测-->
    <div
        class="body-shape-double"
        :class="{'no-container-background': !isSupportWebgl.webgl, 'share-shape': datePosition === 'top'}"
    >
        <div class="person-img" v-if="isSupportWebgl.webgl">
            <shape-double-model
                ref="measureDoubleModel"
                @modelLoadError="modelItemLoadError"
                @modelLoadOver="modelItemLoadOver"
                :datePosition="datePosition"
                :iframeId="iframeId"
            ></shape-double-model>
        </div>
        <!-- 判断浏览器支持 -->
        <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" :title="isSupportWebgl.title" msgStyle="msg-style"></version-tip>
    </div>
</template>

<script>
import ShapeDoubleModel from '@/components/model/ShapeDouble'

import isSupportWebgl from '@/assets/js/webgl.js'
import VersionTip from '@/components/model/VersionTip.vue'

export default {
    components: {
        ShapeDoubleModel,
        VersionTip
    },
    props: {
        iframeId: String,
        datePosition: String // 日期显示位置，默认下方
    },
    data() {
        return {
            // iframeId: this.iframeId,
            isSupportWebgl,
            popupVisible: false
        }
    },
    mounted() {
        // 不支持webgl清空缓存图片信息
        if (!this.isSupportWebgl.webgl) {
            this.$emit('modelItemLoadOver', 'shapeDouble')
            window.localStorage.removeItem('modelImage')
        }
    },
    methods: {
        changeHistoryScanId(tcScanId) {
            if (this.$refs.measureDoubleModel) {
                this.$refs.measureDoubleModel.findModelFile(tcScanId)
            }
        },
        // 监听失败事件
        modelItemLoadError(res) {
            this.$emit('modelItemLoadError', res)
        },
        // 监听加载完成(success or failed)
        modelItemLoadOver(type) {
            this.$emit('modelItemLoadOver', type)
        }
    }
}
</script>
<style lang="less" scoped>
.body-shape-double {
    display: flex;
    justify-content: center;
    padding-top: 35px;
    background-image: url(../../assets/images/share/bg_model_ground.png);
    background-size: 100% 62px;
    background-repeat: no-repeat;
    background-position: 0 250px;
    // background-position: 0 230px;
    position: relative;
    height: 320px;

    &.share-shape {
        background-size: 100% 36px;
        background-position: 0 257px;
        // background-position: 0 235px;
    }
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .person-img {
        // padding-left: 0 !important;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
    }
}
</style>
