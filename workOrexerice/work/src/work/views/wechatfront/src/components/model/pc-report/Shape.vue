<template>
    <!-- PC端体态模型 - 使用原生 IframeTemplate 保持功能正常 -->
    <div class="measure-model pc-shape-model">
        <!-- 简单的 loading 动画 -->
        <div class="simple-loading" v-if="isLoad">
            <div class="spinner"></div>
        </div>
        <!-- 点位渲染遮罩层 - 透明阻止手动拖拽 -->
        <div class="point-rendering-mask" v-if="!isLoad && !isModelReady"></div>
        <iframe-template-new v-if="isVAPro6" ref="model" :options="iframeOptions" :iframe-id="iframeId"
                @isIframeLoad="findModelFile" @isModelLoad="loadModelOver" @changeShapeIndex="changeShapeIndex"
                @isModelLoadError="onModelLoadError"></iframe-template-new>
        <iframe-template
            v-else
            ref="model"
            :options="iframeOptions"
            :iframe-id="iframeId"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @changeShapeIndex="changeShapeIndex"
            @isModelLoadError="onModelLoadError"
        ></iframe-template>
    </div>
</template>
<script>
import IframeTemplate from './IframeTemplate'
import IframeTemplateNew from '@/components/model/new-report/IframeTemplateNew'
import { findBsScanFileInfos } from '@/assets/js/apolloGql.js'
import { isVAPro6 } from '@/types/device.js'

export default {
    name: 'PcShapeModel',
    components: {
        IframeTemplate,
        IframeTemplateNew
    },
    props: {
        errorOptions: Object
    },
    data() {
        // 生成唯一的实例 ID（在 data 初始化前生成，确保每个实例都有唯一 ID）
        const instanceId = `shapeModel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            // 实例唯一标识
            instanceId: instanceId,
            // 生成唯一的 iframe ID，避免多个模型实例冲突
            iframeId: instanceId,
            // PC端使用更大的尺寸
            iframeOptions: {
                url: 'shape/index.html',
                modelPath: '',
                pointPath: '',
                width: '500px',
                height: '680px',
                showShapeMode: true,
                failed: false,
                errorInfo: this.errorOptions
            },
            isLoad: true,
            rotateIndex: 1,
            isVAPro6: isVAPro6(),
            // 标记组件是否已销毁
            isDestroyed: false,
            // 标记模型是否真正加载完成（包括点位数据）
            isModelReady: false,
            // 点位渲染定时器
            pointRenderTimer: null
        }
    },
    watch: {
        // 监听点位数据变化，重新等待渲染完成
        errorOptions: {
            handler(newVal, oldVal) {
                if (this.isDestroyed) return

                console.log(`[Shape] 点位数据已更新，实例ID: ${this.instanceId}`)
                console.log('[Shape] errorPoints:', (newVal && newVal.errorPoints && newVal.errorPoints.length) || 0, '个点位')
                console.log('[Shape] errorLines:', (newVal && newVal.errorLines && newVal.errorLines.length) || 0, '条线段')

                // 更新 iframe 的 errorInfo
                if (this.iframeOptions && newVal) {
                    this.iframeOptions.errorInfo = newVal
                }

                // 如果有点位数据，启动渲染等待
                if (newVal && ((newVal.errorPoints && newVal.errorPoints.length > 0) || (newVal.errorLines && newVal.errorLines.length > 0))) {
                    // 只有在模型已经加载后才等待点位渲染
                    if (!this.isLoad && this.iframeOptions.modelPath && this.iframeOptions.pointPath) {
                        console.log('[Shape] 检测到点位数据，触发渲染等待')
                        this.waitForPointsRender()
                    } else if (this.isLoad) {
                        console.log('[Shape] 模型还在加载中，暂不触发点位渲染等待')
                    }
                } else {
                    console.log('[Shape] 点位数据为空，跳过渲染等待')
                }
            },
            deep: true,
            immediate: true // 改为 true，确保初始化时也检查
        }
    },
    mounted() {
        console.log(`[Shape] 模型实例已挂载，实例ID: ${this.instanceId}`)
    },
    beforeDestroy() {
        console.log(`[Shape] 模型实例开始销毁，实例ID: ${this.instanceId}`)
        // 标记为已销毁
        this.isDestroyed = true
        // 清理点位渲染定时器
        if (this.pointRenderTimer) {
            clearTimeout(this.pointRenderTimer)
            this.pointRenderTimer = null
        }
        // 组件销毁时通知父组件模型已卸载
        this.$emit('modelUnloaded', this.instanceId)
    },
    methods: {
        findModelFile() {
            // 体态
            if (this.modelInfo.evalStatus === 1) {
                this.findBsScanFileInfos()
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        // 体态
        findBsScanFileInfos() {
            this.$apollo
                .query({
                    query: findBsScanFileInfos,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBsScanFileInfos
                    if (data && data.code === 200) {
                        this.iframeOptions.failed = false
                        this.$lodash.each(data.data, (model, index) => {
                            if (model.fileType.id === 3) {
                                this.iframeOptions.modelPath = model.filePath
                            }

                            if (model.fileType.id === 4) {
                                this.iframeOptions.pointPath = model.filePath
                            }
                        })

                        if (this.iframeOptions.modelPath && this.iframeOptions.pointPath) {
                            this.$refs.model.loadShapeModel(true)
                        } else {
                            this.loadFailed()
                        }
                    } else {
                        this.loadFailed()
                    }
                })
        },
        onModelLoadError(errObj) {
            if (errObj.type === 'shape') {
                this.loadFailed()
            }
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
        },
        loadModelOver() {
            // 如果组件已销毁，忽略此事件
            if (this.isDestroyed) {
                console.warn(`[Shape] 模型加载完成事件被忽略，实例已销毁: ${this.instanceId}`)
                return
            }
            console.log(`[Shape] 模型网格加载完成，实例ID: ${this.instanceId}`)
            this.isLoad = false

            // 先通知父组件模型已加载（但还不能旋转）
            this.$emit('modelLoaded', this.instanceId)

            // 检查点位数据是否已存在
            const hasPoints = this.errorOptions &&
                ((this.errorOptions.errorPoints && this.errorOptions.errorPoints.length > 0) ||
                 (this.errorOptions.errorLines && this.errorOptions.errorLines.length > 0))

            if (hasPoints) {
                console.log(`[Shape] 点位数据已存在，等待渲染，点位数:`, (this.errorOptions.errorPoints && this.errorOptions.errorPoints.length) || 0)
                this.waitForPointsRender()
            } else {
                // 即使没有点位数据，也要等待一段时间，因为点位数据可能稍后才会到达
                console.log(`[Shape] 点位数据暂时为空，启动兜底等待机制`)
                this.startFallbackWait()
            }
        },
        // 兜底等待机制：如果点位数据还没到，先等待 2 秒
        startFallbackWait() {
            // 先等待 2 秒，如果这期间点位数据到了，会触发 watch 并调用 waitForPointsRender
            // 如果 2 秒后还没有点位数据，就假设没有异常点位，允许旋转
            this.pointRenderTimer = setTimeout(() => {
                if (!this.isDestroyed) {
                    const hasPoints = this.errorOptions &&
                        ((this.errorOptions.errorPoints && this.errorOptions.errorPoints.length > 0) ||
                         (this.errorOptions.errorLines && this.errorOptions.errorLines.length > 0))

                    if (hasPoints) {
                        // 如果点位数据已到达，再等待 1200ms 让它渲染
                        console.log('[Shape] 兜底检查：点位数据已到达，启动正式等待')
                        this.waitForPointsRender()
                    } else {
                        // 没有点位数据，可能是正常体态，允许旋转
                        this.isModelReady = true
                        console.log(`✓ [Shape] 兜底检查：无点位数据，允许旋转，实例ID: ${this.instanceId}`)
                    }
                }
            }, 2000) // 兜底等待 2 秒
        },
        // 等待点位渲染完成
        waitForPointsRender() {
            // 清理之前的定时器
            if (this.pointRenderTimer) {
                clearTimeout(this.pointRenderTimer)
            }
            // 重置状态
            this.isModelReady = false
            console.log(`[Shape] 开始等待点位渲染，实例ID: ${this.instanceId}`)
            // 启动新的定时器
            this.pointRenderTimer = setTimeout(() => {
                if (!this.isDestroyed && this.iframeOptions.modelPath && this.iframeOptions.pointPath) {
                    this.isModelReady = true
                    console.log(`✓ [Shape] 点位渲染完成，实例ID: ${this.instanceId}`)
                } else {
                    console.warn(`[Shape] 点位渲染等待超时，模型可能未正确加载，实例ID: ${this.instanceId}`)
                }
            }, 1200) // 增加到 1200ms，给点位更多渲染时间
        },
        changeShapeIndex(index) {
            // 如果组件已销毁或模型未准备好，忽略此事件
            if (this.isDestroyed) {
                console.warn(`[Shape] 模型旋转事件被忽略，实例已销毁: ${this.instanceId}`)
                return
            }
            if (!this.isModelReady) {
                console.warn(`[Shape] 模型旋转事件被忽略，模型未准备好: ${this.instanceId}`)
                return
            }
            this.$emit('modelRotate', index, this.instanceId) // 带上实例ID
        },
        turnModel(direction) {
            this.$refs.model.turnModel(direction)
        }
    }
}
</script>

<style scoped lang="less">
.pc-shape-model {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

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
        }
    }

    // 点位渲染遮罩层 - 完全透明，用户看不到但阻止拖拽
    .point-rendering-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 15;
        background: transparent;
        cursor: default;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
