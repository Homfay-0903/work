<template>
    <div class="pc-iframe-template">
        <div class="model-bia" v-if="options.showBiaMode">
            <div class="person-bia-img">
                <img src="@/assets/images/bia-model@2x.png" alt />
            </div>
        </div>
        <template v-else>
            <iframe v-if="!options.failed" :id="frameId" :name="frameId" frameborder="0" scrolling="no" ref="modelView"
                class="pc-iframe" :src="`../../../static/model-iframe/${options.url}?version=${version}`"
                :style="{ width: options.width, height: options.height }"></iframe>
            <div class="model-failed" v-if="options.failed" :style="{ width: options.width, height: options.height }">
                <div class="person-failed-img">
                    <img src="@/assets/images/mobel@2x.png" alt />
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { version } from '@/assets/js/config.js'
export default {
    name: 'PcIframeTemplate',
    props: {
        options: Object,
        iframeId: String
    },
    data() {
        return {
            frameId: this.iframeId || 'pcModelIframe',
            tipMsg: '',
            webgl: true,
            popupVisible: true,
            MODEL_STORE: window.MODEL_STORE,
            // 模型场景唯一id
            uuid: '',
            version: version
        }
    },
    watch: {
        'options.modelPath': function (val, oldval) {
            // this.$refs.modelView.contentWindow.location.reload();
        }
    },
    created: function () {
        // 初始化全局组件实例注册表（如果不存在）
        if (!this.MODEL_STORE._instanceMap) {
            this.MODEL_STORE._instanceMap = new Map()
        }

        // 初始化全局 options 映射表（如果不存在）
        if (!this.MODEL_STORE._optionsMap) {
            this.MODEL_STORE._optionsMap = new Map()
        }

        // 将当前组件的 options 存储到 Map 中，使用 frameId 作为 key
        this.MODEL_STORE._optionsMap.set(this.frameId, this.options)

        // 注册组件实例，使用 frameId 作为 key
        this.MODEL_STORE._instanceMap.set(this.frameId, this)

        // 保持向后兼容
        this.MODEL_STORE.options = this.options

        /* iframe加载完成回调 - 支持多实例 */
        this.MODEL_STORE.onIframeLoad = (uuid, frameId) => {
            console.log('PC onIframeLoad:', uuid, 'frameId:', frameId)
            const instance = (frameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(frameId) : this
            if (instance) {
                instance.uuid = uuid
                instance.$emit('isIframeLoad', true)
            }
        }

        /* 模型加载完成回调 - 支持多实例 */
        this.MODEL_STORE.onModelLoad = (uuid, frameId) => {
            console.log('PC onModelLoad:', uuid, 'frameId:', frameId)
            const instance = (frameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(frameId) : this
            if (instance) {
                instance.$emit('isModelLoad', true)
            }
        }

        /* 模型加载失败回调 - 支持多实例 */
        this.MODEL_STORE.onModelLoadError = (type, isNew, uuid, frameId) => {
            console.log('PC onModelLoadError:', uuid, 'frameId:', frameId)
            const instance = (frameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(frameId) : this
            if (instance && uuid === instance.uuid) {
                instance.$emit('isModelLoadError', {
                    type,
                    isNew
                })
            }
        }

        /* 体态模型旋转完成回调 - 支持多实例 */
        this.MODEL_STORE.onRotateShape = (idx, frameId) => {
            // idx 1 正 2 右侧 3 背 4 左侧
            const instance = (frameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(frameId) : this
            if (instance) {
                instance.$emit('changeShapeIndex', idx)
            }
        }

        /* 切换围度回调 */
        this.MODEL_STORE.selectCurve = idx => {
            this.$parent.setSlideIdx(idx)
        }
    },
    beforeDestroy() {
        // 组件销毁时从注册表中移除
        if (this.frameId && this.MODEL_STORE._instanceMap) {
            this.MODEL_STORE._instanceMap.delete(this.frameId)
        }
        if (this.frameId && this.MODEL_STORE._optionsMap) {
            this.MODEL_STORE._optionsMap.delete(this.frameId)
        }
    },
    methods: {
        selectCurve(girth) {
            document.getElementById(this.frameId).contentWindow.changeCurveValue(girth.delta, girth.curveName)
        },

        // 节段模型切换
        changeSegment(type) {
            if (document.getElementById(this.frameId)) {
                document.getElementById(this.frameId).contentWindow.changeSegment(type)
            }
        },

        /* 加载体型预测对比模型效果 */
        loadPredictionModel() {
            document
                .getElementById(this.frameId)
                .contentWindow.loadPredictionModel(this.options.oldModelPath, this.options.newModelPath)
        },

        /* 加载围度模型效果 */
        loadMeasureModel() {
            if (document.getElementById(this.frameId)) {
                document.getElementById(this.frameId).contentWindow.loadMeasureModel()
            }
        },

        /* 加载体态模型效果 */
        loadShapeModel(isShowPoints) {
            document.getElementById(this.frameId).contentWindow.loadShapeModel(isShowPoints)
        },

        /* 加载节段对比模型效果 */
        loadHeatmapModel() {
            document.getElementById(this.frameId).contentWindow.clearModel()
            document.getElementById(this.frameId).contentWindow.loadHeatmapModel()
        },

        /* 加载模型对比效果 */
        loadMeasureDoubleModel(oldModelPath, newModelPath) {
            let frameDom = document.getElementById(this.frameId)
            if (frameDom) {
                let contentWindow = frameDom.contentWindow
                if (contentWindow && contentWindow.loadMeasureDoubleModel) {
                    contentWindow.loadMeasureDoubleModel(oldModelPath, newModelPath)
                }
            }
        },

        /* 清空模型 */
        clearModel() {
            if (!this.options.failed) {
                let clearTypeof = typeof document.getElementById(this.frameId).contentWindow.clearModel
                if (clearTypeof !== 'undefined') {
                    document.getElementById(this.frameId).contentWindow.clearModel()
                }
            }
        },

        /* 清空场景 */
        clearSence() {
            if (!this.options.failed && document.getElementById(this.frameId)) {
                let clearTypeof = typeof document.getElementById(this.frameId).contentWindow.clearSence
                if (clearTypeof !== 'undefined') {
                    document.getElementById(this.frameId).contentWindow.clearSence()
                }
            }
        },

        /* 控制模型旋转 */
        turnModel(direction) {
            document.getElementById(this.frameId).contentWindow.turnModel(direction)
        }
    }
}
</script>

<style scoped lang="less">
// PC端专用样式 - 不限制固定尺寸
.pc-iframe-template {
    display: flex;
    align-items: center;
    justify-content: center;
}

.pc-iframe {
    position: relative;
    z-index: 1;
    display: block;
}

.model-failed {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .person-failed-img {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            // 失败态人物图固定尺寸（PC端）
            width: 100px;
            height: 220px;
            object-fit: contain;
            opacity: 0.6;
            pointer-events: none;
            display: inline-block;
        }
    }
}

.model-bia {
    height: 100%;

    .person-bia-img {
        position: relative;
        height: 92%;

        img {
            width: 66px;
            height: 240px;
            margin-bottom: 5px;
            pointer-events: none;
            display: inline-block;
        }
    }
}
</style>
