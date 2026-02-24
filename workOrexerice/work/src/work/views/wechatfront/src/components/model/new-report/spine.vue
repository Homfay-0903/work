<template>
    <!-- 身体成分模型节段对比 -->
    <div class="measure-model">
        <model-loading v-show="isLoad"></model-loading>
        <iframe-template
            ref="model"
            :options="iframeOptions"
            iframeId="iframeIdSpi"
            @changeSpineIndex="changeSpineIndex"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @isModelLoadError="onModelLoadError"
        ></iframe-template>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/new-report/IframeTemplate'
import ModelLoading from '@/components/model/Loading'
import { findBsScanFileInfos } from '@/assets/js/apolloGql.js'

export default {
    components: {
        IframeTemplate,
        ModelLoading,
    },
    props: {
        massInfo: Object
    },
    data() {
        return {
            // modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'anatomy/index.html',
                modelPath: '',
                muscleJsPath: '',
                muscleJpgPath: '',
                fatJsPath: '',
                fatJpgPath: '',
                width: '150px',
                height: '350px',
                failed: false,
                spine: true
            },
            isLoad: true,
            timer: '',
        }
    },
    created: function() {
        if (this.massInfo.bsSpineStatus !== 1) {
            this.loadFailed()
        }
    },
    methods: {
        findModelFile() {
            // 体测
            if (this.massInfo.bsSpineStatus === 1) {
                this.getModelFile()
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        getModelFile() {
            this.$apollo
                .query({
                    query: findBsScanFileInfos,
                    variables: {
                        scanId: this.massInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBsScanFileInfos
                    if (data && data.code === 200) {
                        this.$lodash.each(data.data, (model, index) => {
                            if (model.fileType.id === 24) {
                                this.iframeOptions.modelPath = model.filePath
                                console.log(this.iframeOptions.modelPath)
                                this.$refs.model.loadSpineModel(true)
                            }
                        })
                    } else {
                        this.checkData()
                        this.dataLoadErr('findBsScanFileInfos')
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('findBsScanFileInfos')
                })
        },
        // 模型旋转
        changeSpineIndex(idx) {
            this.$emit('changeSpine', idx)
        },
        onModelLoadError(errObj) {
            if (errObj.type === 'spine') {
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
    }
}
</script>