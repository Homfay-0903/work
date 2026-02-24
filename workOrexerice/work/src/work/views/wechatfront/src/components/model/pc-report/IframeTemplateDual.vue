<template>
    <div class="iframe-template">
        <div class="model-bia" v-if="options.showBiaMode">
            <div class="person-bia-img">
                <img src="@/assets/images/bia-model@2x.png" alt />
            </div>
        </div>
        <template v-else>
            <iframe v-if="!options.failed" :id="frameId" :name="frameId" frameborder="0" scrolling="no" ref="modelView"
                class="iframe1" :src="`../../../static/model-iframe/${options.url}?version=${version}&frameId=${frameId}`"
                :style="{ width: options.width, height: options.height }"></iframe>
            <div class="model-failed" v-if="options.failed">
                <div class="person-failed-img">
                    <img src="@/assets/images/mobel@2x.png" alt />
                </div>
            </div>
        </template>
    </div>
</template>
<script>
/**
 * 双模型专用的 IframeTemplate 组件
 * 用于 stiffnessTab 等需要同时显示两个模型的页面
 * 通过 frameId 区分不同的模型实例
 */
import { version } from '@/assets/js/config.js'
export default {
    props: {
        options: Object,
        iframeId: String
    },
    data() {
        return {
            frameId: this.iframeId || 'modelIframe',
            tipMsg: '',
            webgl: true,
            popupVisible: true,
            MODEL_STORE: window.MODEL_STORE,
            uuid: '',
            version: version
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

        // 每次都重新注册回调，确保回调函数正确指向当前存在的组件实例
        /* iframe加载完成回调 - 支持多实例 */
        this.MODEL_STORE.onIframeLoad = (uuid, frameId) => {
            console.log('onIframeLoad:', uuid, 'frameId:', frameId)
            // 通过 frameId 查找组件实例，如果没有 frameId 则回退到 this
            const instance = (frameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(frameId) : this
            if (instance) {
                instance.uuid = uuid
                instance.$emit('isIframeLoad', true)
            }
        }

        /* 模型加载完成回调 - 支持多实例 */
        this.MODEL_STORE.onModelLoad = (uuid, frameId) => {
            console.log('onModelLoad:', uuid, 'frameId:', frameId)
            const instance = (frameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(frameId) : this
            if (instance) {
                instance.$emit('isModelLoad', true)
            }
        }

        /* 模型加载失败回调 - 支持多实例 */
        this.MODEL_STORE.onModelLoadError = (type, isNew, uuid, frameId) => {
            console.log('onModelLoadError:', uuid, 'frameId:', frameId)
            const instance = (frameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(frameId) : this
            if (instance && uuid === instance.uuid) {
                instance.$emit('isModelLoadError', {
                    type,
                    isNew
                })
            }
        }

        /* 相机旋转回调 - 用于同步其他模型 */
        this.MODEL_STORE.onCameraRotate = (theta, sourceFrameId) => {
            const instance = (sourceFrameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(sourceFrameId) : this
            if (instance) {
                instance.$emit('cameraRotate', { theta: theta, frameId: sourceFrameId })
            }
        }

        /* 围度选择回调 - 用于同步其他模型 */
        this.MODEL_STORE.onCurveSelect = (curveName, sourceFrameId) => {
            const instance = (sourceFrameId && this.MODEL_STORE._instanceMap) ? this.MODEL_STORE._instanceMap.get(sourceFrameId) : this
            if (instance) {
                instance.$emit('curveSelect', { curveName: curveName, frameId: sourceFrameId })
            }
        }

        /* 体态模型旋转完成回调 - 支持多实例 */
        this.MODEL_STORE.onRotateShape = (idx, frameId) => {
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

        /* 加载围度模型效果 */
        loadMeasureModel() {
            if (document.getElementById(this.frameId)) {
                document.getElementById(this.frameId).contentWindow.loadMeasureModel()
            }
        },

        /* 控制模型旋转 */
        turnModel(direction) {
            const frameDom = document.getElementById(this.frameId)
            if (frameDom && frameDom.contentWindow && frameDom.contentWindow.turnModel) {
                frameDom.contentWindow.turnModel(direction)
            }
        },

        /* 设置相机旋转角度（用于同步） */
        setCameraRotation(theta) {
            try {
                const frameDom = document.getElementById(this.frameId)
                if (frameDom && frameDom.contentWindow && typeof frameDom.contentWindow.setCameraRotation === 'function') {
                    frameDom.contentWindow.setCameraRotation(theta)
                }
            } catch (e) {
                console.error('setCameraRotation error:', e)
            }
        },

        /* 获取当前相机旋转角度 */
        getCameraRotation() {
            try {
                const frameDom = document.getElementById(this.frameId)
                if (frameDom && frameDom.contentWindow && typeof frameDom.contentWindow.getCameraRotation === 'function') {
                    return frameDom.contentWindow.getCameraRotation()
                }
            } catch (e) {
                console.error('getCameraRotation error:', e)
            }
            return 0
        },

        /* 高亮指定围度（用于同步） */
        highlightCurve(curveName, shouldSkipCallback) {
            const skipCallback = shouldSkipCallback !== false
            const frameDom = document.getElementById(this.frameId)
            if (frameDom && frameDom.contentWindow && frameDom.contentWindow.highlightCurve) {
                frameDom.contentWindow.highlightCurve(curveName, skipCallback)
            }
        }
    }
}
</script>

<style scoped lang="less">
.iframe-template {
    min-width: 110px;
    width: 100%;
    height: 270px;
}

.iframe1 {
    position: relative;
    z-index: 1;
}
iframe {
    margin-top: -10px;
    *width: 85.8% !important;
    min-width: 85.8% !important;
    height: 100% !important;
}

.model-failed {
    margin-top: -10px;
    width: 85.8%;
    min-width: 85.8%;
    height: 100%;
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
            max-width: 40%;
            object-fit: cover;
            margin-bottom: 5px;
            margin-top: -30px;
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
