<template>
    <!-- 体态模型 -->
    <div :class="['measure-model', $i18n.locale]">
        <model-loading v-show="isLoad" class="model-loading"></model-loading>
        <div class="model-container">
            <iframe-template-pillow
                ref="model"
                iframeId="pillowiframe"
                :options="iframeOptions"
                @isIframeLoad="findModelFile"
                @isModelLoad="loadModelOver"
                @changeShapeIndex="changeShapeIndex"
                @isModelLoadError="onModelLoadError"
            ></iframe-template-pillow>
            <img class="iframe-bottom" src="@/assets/images/new-report/girth/transform@2x.png" alt />
        </div>
    </div>
</template>
<script>
import IframeTemplatePillow from '@/components/model/new-report/IframeTemplatePillow'
import ModelLoading from '@/components/model/Loading'
import { findBmScanFileInfos } from '@/assets/js/apolloGql.js'
export default {
    components: {
        ModelLoading,
        IframeTemplatePillow
    },
    props: {
        errorOptions: Object
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'pillow/index.html',
                modelPath: '',
                pointPath: '',
                width: '100%',
                height: '100% !important',
                showShapeMode: true,
                failed: false,
                errorInfo: this.errorOptions
            },
            isLoad: true,
            rotateIndex: 1
        }
    },
    computed: {
        errorOptionsData() {
            console.log(`错误信息${JSON.stringify(this.errorOptions)}`)
            return this.errorOptions
        }
    },
    created() {
        console.log('当前页面加载')
    },
    methods: {
        findModelFile() {
            // 体态
            if (this.modelInfo.evalStatus > 0) {
                setTimeout(() => {
                    this.getBmScanFileInfos()
                }, 1000 * 1.5)
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        getBmScanFileInfos() {
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
                        this.$lodash.each(data.data, model => {
                            //  体测模型文件
                            if (model.fileType.id === 2) {
                                this.iframeOptions.modelPath = model.filePath
                                // this.iframeOptions.modelPath = '../../../static/model-iframe/model/model.obj'
                            }
                            if (model.fileType.id === 1) {
                                this.iframeOptions.jsonPath = model.filePath
                                // this.iframeOptions.pointPath = '../../../static/model-iframe/model/model.json'
                            }
                        })
                        if (this.iframeOptions.modelPath) {
                            this.$refs.model.loadShapeModel()
                        } else {
                            this.loadFailed()
                        }
                    } else {
                        this.loadFailed()
                    }
                })
        },
        onModelLoadError(errObj) {
            this.loadFailed()
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
<style lang="less" scoped>
.model-loading {
    width: 98%;
    height: 112%;
    left: 1%;
    top: 1%;
    text-align: center;
}
.measure-model {
    height: 100%;
}
.model-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    flex-direction: column;
    position: relative;
}

&.en-US,
&.ja-JP,
&.zh-CN,
&.it-IT,
&.es-ES {
    .model-loading {
        height: 100%;
    }
}

.iframe-bottom {
    left: auto;
    right: auto;
    position: absolute;
    bottom: 0px;
    width: 135px;
    height: 57px;
    z-index: 0;
}
</style>
