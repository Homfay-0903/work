<template>
    <!-- 体态模型 -->
    <div :class="['measure-model', $i18n.locale]">
        <model-loading v-show="isLoad" class="model-loading"></model-loading>
        <div class="model-container" v-if="isVAPro7 || isNewMathTt">
            <iframe-template-new ref="model" :options="iframeOptions" @isIframeLoad="findModelFile"
                @isModelLoad="loadModelOver" @changeShapeIndex="changeShapeIndex"
                @isModelLoadError="onModelLoadError"></iframe-template-new>
            <img class="iframe-bottom" src="@/assets/images/new-report/girth/transform@2x.png" alt />
        </div>
        <div class="model-container" v-else>
            <iframe-template ref="model" :options="iframeOptions" @isIframeLoad="findModelFile"
                @isModelLoad="loadModelOver" @changeShapeIndex="changeShapeIndex"
                @isModelLoadError="onModelLoadError"></iframe-template>
            <img class="iframe-bottom" src="@/assets/images/new-report/girth/transform@2x.png" alt />
        </div>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/new-report/IframeTemplate'
import IframeTemplateNew from '@/components/model/new-report/IframeTemplateNew'
import ModelLoading from '@/components/model/Loading'
import { findBsScanFileInfos } from '@/assets/js/apolloGql.js'
import { isVAPro7 } from '@/types/device.js'
import { mapState } from 'vuex'
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
                url: 'shape-new/index.html',
                modelPath: '',
                pointPath: '',
                width: '100%',
                height: '100% !important',
                showShapeMode: true,
                failed: false,
                errorInfo: this.errorOptions
            },
            isLoad: true,
            rotateIndex: 1,
            isVAPro7: isVAPro7()
        }
    },
    computed: {
        ...mapState(['historyScanId', "isNewMathTt"]),
        errorOptionsData() {
            console.log(`错误信息${JSON.stringify(this.errorOptions)}`)
            return this.errorOptions
        }
    },
    created() {
        console.log('当前页面加载')
    },
    // watch: {
    //     errorOptionsData: {
    //         handler(newName, oldName) {
    //             console.log(`当前错误信息${JSON.stringify(this.iframeOptions.errorInfo)} ${JSON.stringify(newName)} ${JSON.stringify(oldName)}`)
    //         },
    //         immediate: true
    //     }
    // },
    methods: {
        findModelFile() {
            // 体态
            if (this.modelInfo.evalStatus > 0) {
                setTimeout(() => {
                    this.findBsScanFileInfos()
                }, 1000 * 2)
            } else {
                this.loadFailed()
            }
        },
        // 获取模型数据
        // 体态
        findBsScanFileInfos() {
            let scanId = ''
            if (this.historyScanId) {
                scanId = this.historyScanId
            } else {
                scanId = this.modelInfo.scanId
            }
            this.$apollo
                .query({
                    query: findBsScanFileInfos,
                    variables: {
                        scanId: scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBsScanFileInfos
                    if (data && data.code === 200) {
                        this.iframeOptions.failed = false
                        // eslint-disable-next-line no-unused-vars
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
<style lang="less" scoped>
.model-loading {
    width: 98%;
    height: 112%;
    left: 1%;
    top: 1%;
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
