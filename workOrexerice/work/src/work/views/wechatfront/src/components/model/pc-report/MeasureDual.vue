<template>
    <!-- PC端围度模型（双模型版本） -->
    <div class="measure-model pc-measure-model">
        <!-- 简单的 loading 动画 -->
        <div class="simple-loading" v-if="isLoad">
            <div class="spinner"></div>
        </div>
        <iframe-template-dual
            ref="model"
            :options="iframeOptions"
            :iframe-id="iframeId"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @isModelLoadError="onModelLoadError"
            @cameraRotate="handleCameraRotate"
            @curveSelect="handleCurveSelect"
        ></iframe-template-dual>
    </div>
</template>
<script>
/**
 * 双模型专用的 Measure 组件
 * 用于 stiffnessTab 等需要同时显示两个模型的页面
 */
import IframeTemplateDual from '@/components/model/pc-report/IframeTemplateDual.vue'
import { findBmScanFileInfos } from '@/assets/js/apolloGql.js'

export default {
    name: 'PcMeasureModelDual',
    components: {
        IframeTemplateDual
    },
    props: {
        showGirth: Boolean,
        // 可选的 scanId，用于加载特定扫描ID的模型
        scanId: String
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            // 生成唯一的 iframe ID，避免多个模型实例冲突
            iframeId: 'measureModel_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            // PC端围度模型尺寸
            iframeOptions: {
                url: 'measure-pc/index.html',
                modelPath: '',
                jsonPath: '',
                width: '200px',
                height: '260px',
                showGirth: this.showGirth,
                failed: false
            },
            isLoad: true
        }
    },
    computed: {
        // 使用传入的 scanId 或默认的 modelInfo.scanId
        currentScanId() {
            return this.scanId || (this.modelInfo && this.modelInfo.scanId)
        }
    },
    created: function() {
        if (!this.modelInfo || this.modelInfo.bdaStatus !== 1) {
            this.loadFailed()
        }
    },
    methods: {
        findModelFile() {
            // 体测
            if (this.modelInfo && this.modelInfo.bdaStatus === 1) {
                this.findBmScanFileInfos()
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        findBmScanFileInfos() {
            this.$apollo
                .query({
                    query: findBmScanFileInfos,
                    variables: {
                        scanId: this.currentScanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBmScanFileInfos
                    if (data && data.code === 200) {
                        this.iframeOptions.failed = false
                        this.$lodash.each(data.data, (model, index) => {
                            if (model.fileType.id === 2) {
                                this.iframeOptions.modelPath = model.filePath
                            }

                            if (model.fileType.id === 1) {
                                this.iframeOptions.jsonPath = model.filePath
                            }
                        })

                        if (this.iframeOptions.modelPath && this.iframeOptions.jsonPath) {
                            this.$refs.model.loadMeasureModel()
                        } else {
                            this.loadFailed()
                        }
                    } else {
                        this.loadFailed()
                    }
                })
        },
        onModelLoadError(errObj) {
            if (errObj.type === 'measure') {
                this.loadFailed()
            }
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
        },
        loadModelOver() {
            this.isLoad = false
        },
        selectCurve(girth) {
            this.$refs.model.selectCurve(girth)
        },
        // IframeTemplate 组件会在围度切换时调用父组件的这个方法
        setSlideIdx(idx) {
            // PC报告页面不需要处理围度切换索引
        },
        // 旋转模型
        turnModel(direction) {
            if (this.$refs.model) {
                this.$refs.model.turnModel(direction)
            }
        },
        // 设置相机旋转角度（用于同步）
        setCameraRotation(theta) {
            if (this.$refs.model) {
                this.$refs.model.setCameraRotation(theta)
            }
        },
        // 获取当前相机旋转角度
        getCameraRotation() {
            if (this.$refs.model) {
                return this.$refs.model.getCameraRotation()
            }
            return 0
        },
        // 高亮指定围度（用于同步）
        highlightCurve(curveName) {
            if (this.$refs.model) {
                this.$refs.model.highlightCurve(curveName)
            }
        },
        // 处理相机旋转事件
        handleCameraRotate(data) {
            this.$emit('cameraRotate', data)
        },
        // 处理围度选择事件
        handleCurveSelect(data) {
            this.$emit('curveSelect', data)
        }
    }
}
</script>

<style lang="less" scoped>
.pc-measure-model {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    .simple-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(38, 38, 39, 0.95);
        z-index: 10;

        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 100px;
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
