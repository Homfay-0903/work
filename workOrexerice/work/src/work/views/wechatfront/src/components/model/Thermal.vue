<template>
    <!-- 热力对比模型 -->
    <div class="measure-model">
        <model-loading v-show="isLoad"></model-loading>
        <iframe-template
            ref="model"
            :options="iframeOptions"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @isModelLoadError="onModelLoadError"
        ></iframe-template>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/IframeTemplate'
import ModelLoading from '@/components/model/Loading'
import { findBmScanFileInfos, getSegConFileInfos } from '@/assets/js/apolloGql.js'
import { formatTime } from '@/assets/js/util.js'

export default {
    components: {
        IframeTemplate,
        ModelLoading
    },
    props: {
        type: String,
        thermalModelDate: String,
        modelParamId: String
    },
    data() {
        return {
            modelingNumber: 0,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'heatmap/index.html?ver=1.0.1',
                modelPath: '',
                muscleJsPath: '',
                muscleJpgPath: '',
                fatJsPath: '',
                fatJpgPath: '',
                width: '150px',
                height: '250px',
                failed: false
            },
            isLoad: true
        }
    },
    watch: {
        type(val) {
            this.$refs.model.changeSegment(val)
        },
        // 选择时间发生变化重新加载模型
        modelParamId(val, oldVal) {
            if (val) {
                this.isLoad = true
                this.$refs.model.clearModel()
                this.findModelFile()
            }
        }
    },
    methods: {
        findModelFile() {
            // 体测
            if (this.modelInfo.bmBdaScanResult === 1) {
                this.getModelFile()
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        getModelFile() {
            let pro1 = this.$apollo.query({
                query: findBmScanFileInfos,
                variables: {
                    scanId: this.modelInfo.scanId
                },
                fetchPolicy: 'network-only'
            })
            let pro2 = this.$apollo.query({
                query: getSegConFileInfos,
                variables: {
                    scanId: this.modelInfo.scanId,
                    conDate: formatTime(new Date(Number(this.thermalModelDate) * 1000), '-'),
                    conScanId: this.modelParamId
                },
                fetchPolicy: 'network-only'
            })
            Promise.all([pro1, pro2])
                .then(res => {
                    clearTimeout(this.timer)
                    const data1 = res[0].data.findBmScanFileInfos
                    const data2 = res[1].data.getSegConFileInfos
                    if (data1 && data1.code === 200) {
                        this.iframeOptions.failed = false
                        this.$lodash.each(data1.data, (model, index) => {
                            if (model.fileType.id === 2) {
                                this.iframeOptions.modelPath = model.filePath
                            }
                        })

                        if (this.iframeOptions.modelPath) {
                            if (data2 && data2.code === 200) {
                                this.iframeOptions.failed = false
                                let arr = []
                                arr[14] = 'fatJsPath'
                                arr[15] = 'fatJpgPath'
                                arr[16] = 'muscleJsPath'
                                arr[17] = 'muscleJpgPath'
                                this.$lodash.each(data2.data, (item, index) => {
                                    this.iframeOptions[arr[item.typeId]] = item.filePath
                                })

                                if (
                                    (this.iframeOptions.fatJsPath && this.iframeOptions.fatJpgPath) ||
                                    (this.iframeOptions.muscleJsPath && this.iframeOptions.muscleJpgPath)
                                ) {
                                    this.$refs.model.loadHeatmapModel()
                                } else {
                                    this.loadFailed()
                                }
                            } else if (data2.code === 401) {
                                // 模型合成中...
                                this.timer = setTimeout(() => {
                                    this.getModelFile()
                                    this.modelingNumber++
                                }, 5000)
                                if (this.modelingNumber >= 12) {
                                    clearTimeout(this.timer)
                                    this.loadFailed()
                                }
                            } else {
                                this.loadFailed()
                            }
                        } else {
                            this.loadFailed()
                        }
                    } else {
                        this.loadFailed()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        onModelLoadError(errObj) {
            if (errObj.type === 'heatmap') {
                this.loadFailed()
            }
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
        },
        loadModelOver() {
            this.isLoad = false
            // 加载热力图节段对比
            this.changeSegment(this.type)
        },
        changeSegment(type) {
            this.$refs.model.changeSegment(type)
        }
    }
}
</script>