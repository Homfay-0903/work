<template>
    <!-- 身体成分模型节段对比 -->
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
import { findBmScanFileInfos, getSegDisFileInfos } from '@/assets/js/apolloGql.js'

export default {
    components: {
        IframeTemplate,
        ModelLoading
    },
    props: {
        type: String
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'segment/index.html?ver=1.0.1',
                modelPath: '',
                muscleJsPath: '',
                muscleJpgPath: '',
                fatJsPath: '',
                fatJpgPath: '',
                width: '150px',
                height: '250px',
                failed: false,
                showBiaMode: false
            },
            isLoad: true
        }
    },
    watch: {
        type(val) {
            // this.$refs.model.changeSegment(val)
        }
    },
    created: function() {
        if (this.modelInfo.biaStatus === 1) {
            this.iframeOptions.showBiaMode = true
            this.loadModelOver()
        } else {
            this.loadFailed()
        }
    },
    methods: {
        findModelFile() {
            // 体测
            if (this.modelInfo.biaStatus === 1) {
                this.iframeOptions.showBiaMode = true
                this.loadModelOver()
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        getModelFile() {
            // 体测
            let pro1 = this.$apollo.query({
                query: findBmScanFileInfos,
                variables: {
                    scanId: this.modelInfo.scanId
                },
                fetchPolicy: 'network-only'
            })
            // 节段分布模型
            let pro2 = this.$apollo.query({
                query: getSegDisFileInfos,
                variables: {
                    scanId: this.modelInfo.scanId
                },
                fetchPolicy: 'network-only'
            })
            Promise.all([pro1, pro2])
                .then(res => {
                    clearTimeout(this.timer)
                    const data1 = res[0].data.findBmScanFileInfos
                    const data2 = res[1].data.getSegDisFileInfos
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
                                arr[10] = 'fatJsPath'
                                arr[11] = 'fatJpgPath'
                                arr[12] = 'muscleJsPath'
                                arr[13] = 'muscleJpgPath'
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
                                }, 5000)
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
            if (errObj.type === 'segment') {
                this.loadFailed()
            }
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
        },
        loadModelOver() {
            this.isLoad = false
            // this.changeSegment(this.type)
        },
        changeSegment(type) {
            this.$refs.model.changeSegment(type)
        }
    }
}
</script>