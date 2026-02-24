<template>
    <!-- 体态模型 -->
    <div class="measure-model">
        <model-loading v-show="isLoad"></model-loading>
        <iframe-template-new v-if="isVAPro6" ref="model" :options="iframeOptions" @isIframeLoad="findModelFile"
                @isModelLoad="loadModelOver" @changeShapeIndex="changeShapeIndex"
                @isModelLoadError="onModelLoadError"></iframe-template-new>
        <iframe-template
            v-else
            ref="model"
            :options="iframeOptions"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @changeShapeIndex="changeShapeIndex"
            @isModelLoadError="onModelLoadError"
        ></iframe-template>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/IframeTemplate'
import IframeTemplateNew from '@/components/model/new-report/IframeTemplateNew'
import ModelLoading from '@/components/model/Loading'
import { findBsScanFileInfos } from '@/assets/js/apolloGql.js'
import { isVAPro6 } from '@/types/device.js'

export default {
    components: {
        IframeTemplate,
        ModelLoading,
        IframeTemplateNew
    },
    props: {
        errorOptions: Object
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'shape/index.html',
                modelPath: '',
                pointPath: '',
                width: '150px',
                height: '250px',
                showShapeMode: true,
                failed: false,
                errorInfo: this.errorOptions
            },
            isLoad: true,
            rotateIndex: 1,
            isVAPro6: isVAPro6()
        }
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
                                // this.iframeOptions.modelPath = '../../../static/model-iframe/model/bodyEval.obj'
                            }

                            if (model.fileType.id === 4) {
                                this.iframeOptions.pointPath = model.filePath
                                // this.iframeOptions.pointPath = '../../../static/model-iframe/model/bodyEval.json'
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
            this.isLoad = false
        },
        changeShapeIndex(index) {
            this.$emit('modelRotate', index)
        },
        turnModel(direction) {
            this.$refs.model.turnModel(direction)
        }
    }
}
</script>