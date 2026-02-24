<template>
    <!-- 首页报告模型 -->
    <div class="measure-model">
        <model-loading v-show="isLoad" :open-overlay="openOverlay"></model-loading>
        <iframe-template ref="model" :options="iframeOptions" @isIframeLoad="findModelFile" @isModelLoad="loadModelOver"
            @isModelLoadError="onModelLoadError"></iframe-template>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/IframeTemplate'
import ModelLoading from '@/components/model/Loading'
import { findBmScanFileInfos, findBsScanFileInfos } from '@/assets/js/apolloGql.js'
import { isVAPro3, isVAPro5, isVAPro7 } from '@/types/device.js'
export default {
    components: {
        IframeTemplate,
        ModelLoading
    },
    props: {
        openOverlay: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'main'
        }
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'measure/index.html',
                modelPath: '',
                width: '100%',
                height: '250px',
                showShapeMode: false,
                failed: false,
                showBiaMode: false,
                type: this.type
            },
            isLoad: true
        }
    },
    created: function () {
        // console.log(this.modelInfo, 'moding====>')
        // if (this.modelInfo.biaMeasure === 1 && this.modelInfo.staticEval === 0) {
        //     if (this.modelInfo.biaStatus === 1) {
        //         this.iframeOptions.showBiaMode = true
        //         this.loadModelOver()
        //     } else {
        //         this.loadFailed()
        //     }
        //     // 仅体态
        // } else if (this.modelInfo.biaMeasure === 0 && this.modelInfo.staticEval === 1) {
        //     if (this.modelInfo.evalStatus !== 1) {
        //         this.loadFailed()
        //     }
        //     // 体测 + 体态 优先加载体态模型
        // } else if (this.modelInfo.biaMeasure === 1 && this.modelInfo.staticEval === 1) {
        //     if (this.modelInfo.evalStatus !== 1 && this.modelInfo.biaStatus === 1) {
        //         this.iframeOptions.showBiaMode = true
        //         this.loadModelOver()
        //     } else if (this.modelInfo.evalStatus !== 1 && this.modelInfo.biaStatus !== 1) {
        //         this.loadFailed()
        //     }
        // } else if (isVAPro3() || isVAPro5()) {
        //     this.loadFailed()
        // }
        this.initModelStatus()
    },
    methods: {
        initModelStatus() {
            const biaStatus = this.modelInfo.biaMeasure === 1 && this.modelInfo.biaStatus === 1
            const staticEvalStatus = this.modelInfo.staticEval === 1 && this.modelInfo.evalStatus === 1
            const bdaStatus = this.modelInfo.girthMeasure === 1 && this.modelInfo.bdaStatus === 1
            if (!bdaStatus && !staticEvalStatus && !biaStatus) {
                this.loadFailed()
            } else if (!bdaStatus && !staticEvalStatus && biaStatus) {
                this.iframeOptions.showBiaMode = true
                this.loadModelOver()
            }
        },
        findModelFile() {
            if (isVAPro3() || isVAPro5() || isVAPro7()) {
                if (this.modelInfo.staticEval === 1) {
                    if (this.modelInfo.evalStatus === 1) {
                        // 显示ipose模型
                        this.findBsScanFileInfos()
                    } else {
                        this.loadFailed()
                    }
                } else if (this.modelInfo.girthMeasure === 1 && this.modelInfo.staticEval !== 1) {
                    // 仅体围
                    if (this.modelInfo.bdaStatus === 1 && this.modelInfo.staticEval !== 1) {
                        // 显示体围模型
                        this.findBmScanFileInfos()
                    } else {
                        this.loadFailed()
                    }
                } else if (this.modelInfo.girthMeasure === 1 && this.modelInfo.staticEval === 1) {
                    // 体测 + 体态 优先加载体态模型
                    if (this.modelInfo.evalStatus === 1) {
                        // 显示ipose模型
                        this.findBsScanFileInfos()
                    } else if (this.modelInfo.bdaStatus === 1) {
                        this.findBmScanFileInfos()
                    } else {
                        this.loadFailed()
                    }
                }
            } else {
                // 仅体测
                if (this.modelInfo.biaMeasure === 1 && this.modelInfo.staticEval === 0) {
                    if (this.modelInfo.biaStatus === 1) {
                        this.iframeOptions.showBiaMode = true
                        this.loadModelOver()
                    } else {
                        this.loadFailed()
                    }
                    // 仅体态
                } else if (this.modelInfo.biaMeasure === 0 && this.modelInfo.staticEval === 1) {
                    if (this.modelInfo.evalStatus === 1) {
                        // 显示ipose模型
                        this.findBsScanFileInfos()
                    } else {
                        this.loadFailed()
                    }
                    // 体测 + 体态 优先加载体态模型
                } else if (this.modelInfo.biaMeasure === 1 && this.modelInfo.staticEval === 1) {
                    if (this.modelInfo.evalStatus === 1) {
                        // 显示ipose模型
                        this.findBsScanFileInfos()
                    } else if (this.modelInfo.biaStatus === 1) {
                        this.iframeOptions.showBiaMode = true
                        this.loadModelOver()
                    } else {
                        this.loadFailed()
                    }
                }
            }

        },
        // 获取模型数据
        // 体测+体围
        findBmScanFileInfos() {
            this.$apollo
                .query({
                    query: findBmScanFileInfos,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBmScanFileInfos
                    if (data && data.code === 200) {
                        this.iframeOptions.failed = false
                        this.$lodash.each(data.data, (model, index) => {
                            if (model.fileType.id === 2) {
                                if (model.filePath !== '') {
                                    this.iframeOptions.modelPath = model.filePath
                                    this.$refs.model.loadMeasureModel()
                                } else {
                                    this.loadFailed()
                                }
                            }
                        })
                    } else {
                        this.loadFailed()
                    }
                })
        },
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
                                if (model.filePath !== '') {
                                    this.iframeOptions.modelPath = model.filePath
                                    this.$refs.model.loadMeasureModel()
                                } else {
                                    this.loadFailed()
                                }
                            }
                        })
                    } else {
                        this.loadFailed()
                    }
                })
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
        },
        loadModelOver() {
            this.isLoad = false
        },
        onModelLoadError(errObj) {
            if (errObj.type === this.type) {
                this.loadFailed()
            }
        }
    }
}
</script>
