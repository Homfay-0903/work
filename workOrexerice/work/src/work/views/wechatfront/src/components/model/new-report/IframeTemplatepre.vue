<template>
    <div class="iframe-template">
        <iframe
            v-if="!options.failed"
            :id="frameId"
            :name="frameId"
            frameborder="0"
            scrolling="no"
            ref="modelView"
            class="iframe1"
            :src="`../../../static/model-iframe/predictionnew/index.html`"
            :style="{ width: options.width, height: options.height }"
        ></iframe>
        <div class="model-failed" v-if="options.failed">
            <div class="person-failed-img">
                <img src="@/assets/images/mobel@2x.png" alt />
            </div>
        </div>
    </div>
</template>

<script>
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
            MODEL_STORE: window.MODEL_STORE
        }
    },
    watch: {
        'options.modelPath': function(val, oldval) {
            // this.$refs.modelView.contentWindow.location.reload();
        }
    },
    created: function() {
        this.MODEL_STORE.options = this.options
        console.log('options', this.options)
        /* iframe加载完成回调 */
        this.MODEL_STORE.onIframeLoad = () => {
            console.log('iframe加载完成')
            this.$emit('isIframeLoad', true)
        }

        /* 模型加载完成回调 */
        this.MODEL_STORE.onModelLoad = () => {
            this.$emit('isModelLoad', true)
        }

        /* 模型加载失败回调 */
        this.MODEL_STORE.onModelLoadError = (type, isNew) => {
            this.$emit('isModelLoadError', {
                type,
                isNew
            })
        }

        /* 体态模型旋转完成回调 */
        this.MODEL_STORE.onRotateShape = (idx) => {
            // idx 1 正 2 右侧 3 背 4 左侧
            this.$emit('changeShapeIndex', idx)
        }

        /* 切换围度回调 */
        this.MODEL_STORE.selectCurve = idx => {
            this.$parent.setSlideIdx(idx)
        }

        /* 脊椎模型旋转完成回调 */
        this.MODEL_STORE.onRotateSpine = idx => {
            // idx 1 正 2 右侧 3 背 4 左侧
            this.$emit('changeSpineIndex', idx)
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

        /* 加载脊柱模型效果 */
        loadSpineModel(isShowPoints) {
            document.getElementById(this.frameId).contentWindow.loadSpineModel(isShowPoints)
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
.iframe-template {
    min-width: 110px;
    width: 100%;
    height: 270px;
}
iframe {
    margin-top: -10px;
    *width: 85.8% !important;
    min-width: 85.8% !important;
    height: 100% !important;
}
.model-loader {
    margin: 100px auto;
    width: 50px;
    height: 40px;
    text-align: center;
    font-size: 10px;

    > div {
        background-color: #fff;
        height: 100%;
        width: 6px;
        display: inline-block;

        -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
        animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }

    .rect2 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }

    .rect3 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
    }

    .rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }

    .rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }
}

.model-failed {
    height: 100%;
    .person-failed-img {
        position: relative;
        height: 92%;
        img {
            width: auto;
            height: 100%;
            margin-bottom: 5px;
            // 禁止部分安卓机下图片自动放大
            pointer-events: none;
            display: inline-block;
        }
        > div {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            p {
                color: #222;
                font-size: 13px;
                padding: 0 10px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-radius: 6px;
                background-color: #fff;
            }
        }
    }
}

@-webkit-keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
        -webkit-transform: scaleY(0.4);
    }
    20% {
        -webkit-transform: scaleY(1);
    }
}

@keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
    }
    20% {
        transform: scaleY(1);
        -webkit-transform: scaleY(1);
    }
}

.version-tip-msg {
    width: 70%;
    margin: 0 auto;
    text-align: left;
    p {
        color: #fff;
        font-size: 12px;
    }
}
</style>
