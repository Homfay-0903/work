<template>
    <div class="iframe-template">
        <iframe
            v-if="!options.failed"
            id="modelIframe"
            name="modelIframe"
            frameborder="0"
            scrolling="no"
            ref="modelView"
            class="iframe1"
            :src="`../../../static/model-iframe-new/${options.url}`"
            :style="{ width: options.width, height: options.height }"
        ></iframe>
    </div>
</template>

<script>
export default {
    props: {
        options: Object
    },
    data() {
        return {
            tipMsg: '',
            webgl: true,
            popupVisible: true,
            MODEL_STORE: window.MODEL_STORE
        }
    },
    watch: {
        'options.modelPath': function(val, oldval) {
            this.$refs.modelView.contentWindow.location.reload()
        }
    },
    created: function() {
        this.MODEL_STORE.options = this.options

        /* iframe加载完成回调 */
        this.MODEL_STORE.onIframeLoad = () => {
            this.$emit('isIframeLoad', true)
        }

        /* 模型加载完成回调 */
        this.MODEL_STORE.onModelLoad = () => {
            this.$emit('isModelLoad', true)
        }

        /* 模型加载失败回调 */
        this.MODEL_STORE.onModelLoadError = () => {
            this.$emit('isModelLoadError', true)
        }

        /* 体态模型旋转完成回调 */
        this.MODEL_STORE.onRotateShape = idx => {
            // idx 1 正 2 右侧 3 背 4 左侧
            this.$emit('changeShapeIndex', idx)
        }

        /* 切换围度回调 */
        this.MODEL_STORE.selectCurve = idx => {
            this.$parent.setSlideIdx(idx)
        }
    },
    methods: {
        selectCurve(girth) {
            document.getElementById('modelIframe').contentWindow.changeCurveValue(girth.delta, girth.curveName)
        },

        // 节段模型切换
        changeSegment(type) {
            if (document.getElementById('modelIframe')) {
                document.getElementById('modelIframe').contentWindow.changeSegment(type)
            }
        },

        /* 加载体型预测对比模型效果 */
        loadPredictionModel() {
            document
                .getElementById('modelIframe')
                .contentWindow.loadPredictionModel(this.options.oldModelPath, this.options.newModelPath)
        },

        /* 加载围度模型效果 */
        loadMeasureModel() {
            if (document.getElementById('modelIframe')) {
                document.getElementById('modelIframe').contentWindow.loadMeasureModel()
            }
        },

        /* 加载体态模型效果 */
        loadShapeModel(isShowPoints) {
            document.getElementById('modelIframe').contentWindow.loadShapeModel(isShowPoints)
        },

        /* 加载节段对比模型效果 */
        loadHeatmapModel() {
            document.getElementById('modelIframe').contentWindow.clearModel()
            document.getElementById('modelIframe').contentWindow.loadHeatmapModel()
        },

        /* 清空模型 */
        clearModel() {
            if (!this.options.failed) {
                let clearTypeof = typeof document.getElementById('modelIframe').contentWindow.clearModel
                if (clearTypeof !== 'undefined') {
                    document.getElementById('modelIframe').contentWindow.clearModel()
                }
            }
        },

        /* 控制模型旋转 */
        turnModel(direction) {
            document.getElementById('modelIframe').contentWindow.turnModel(direction)
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
    100%,
    40% {
        -webkit-transform: scaleY(0.4);
    }
    20% {
        -webkit-transform: scaleY(1);
    }
}

@keyframes sk-stretchdelay {
    0%,
    100%,
    40% {
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
