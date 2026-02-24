<template>
    <!-- 首页报告模型 -->
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
import { findBmScanFileInfos } from '@/assets/js/apolloGql.js'

export default {
    components: {
        IframeTemplate,
        ModelLoading
    },
    props: {
        showGirth: Boolean
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'measure/index.html',
                modelPath: '',
                jsonPath: '',
                width: 'auto',
                height: '250px',
                showGirth: this.showGirth,
                failed: false
            },
            isLoad: true
        }
    },
    created: function() {
        if (this.modelInfo.bdaStatus !== 1) {
            this.loadFailed()
        }
    },
    methods: {
        findModelFile() {
            // 体测
            if (this.modelInfo.bdaStatus === 1) {
                this.findBmScanFileInfos()
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        // 体测
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
        setSlideIdx(idx) {
            this.$parent.setSlideIdx(idx)
        }
    }
}
</script>

<style lang="less" scoped>
.measure-model {
    width: -webkit-fill-available;
}
</style>