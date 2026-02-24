<template>
    <!-- 体型预测模型 -->
    <div class="prediction-model">
        <model-loading v-show="isLoad"></model-loading>
        <iframe-template
            ref="model"
            v-if="!modelFailed"
            :iframeId="iframeId"
            :options="iframeOptions"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @isModelLoadError="onModelLoadError"
        ></iframe-template>
        <div >
            <img :class="['iframe-bottomleft']" src="@/assets/images/new-report/girth/transform@2x.png" alt v-if="!iframeOptions.failed"/>
            <img :class="['iframe-bottomright']" src="@/assets/images/new-report/girth/transform@2x.png" alt v-if="!iframeOptions.failed"/>
        </div>
        <div class="prediction-text" :class="{'top': textPosition === 'top'}" v-if="!iframeOptions.failed">
            <span>预测前</span>
            <img src="@/assets/images/new-report/path.png" alt="">
            <span>预测后</span>
        </div>
        <div :class="{'error-model': true, 'top': textPosition === 'top'}" v-if="textPosition === 'top' && modelFailed">
            <div class="model-svg left">
                <img v-if="userInfo.sex == 2" src="@/assets/images/svg/woman.svg" alt />
                <img v-else src="@/assets/images/svg/man.svg" alt />
                <span class="faild-msg">暂无模型</span>
            </div>

            <div class="model-svg right">
                <img v-if="userInfo.sex == 2" src="@/assets/images/svg/woman.svg" alt />
                <img v-else src="@/assets/images/svg/man.svg" alt />
                <span class="faild-msg">暂无模型</span>
            </div>
        </div>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/new-report/IframeTemplatepre'
import ModelLoading from '@/components/model/Loading'
import { findBmScanFileInfos, findBmPrediction } from '@/assets/js/apolloGql.js'

export default {
    components: {
        IframeTemplate,
        ModelLoading
    },
    props: ['iframeId', 'textPosition'],
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'predictionnew/index.html',
                oldModelPath: '',
                newModelPath: '',
                width: '300px',
                height: '250px',
                showShapeMode: false,
                failed: false
            },
            isLoad: true,
            timer: '',
            modelFailed: false, // 针对分享模型自定义失败缺省图
            // 获取用户基本信息
            userInfo: JSON.parse(window.localStorage.getItem('memberInfo'))
        }
    },
    created: function() {
        if (this.modelInfo.bdaStatus !== 1 || this.modelInfo.biaStatus !== 1) {
            this.loadFailed()
        }
    },
    methods: {
        findModelFile() {
            // this.loadFailed();
            // return;
            // 体测
            console.log('findModelFile回调完成·')
            if (this.modelInfo.bdaStatus === 1 && this.modelInfo.biaStatus === 1) {
                console.log('体测模型加载')
                this.findBmPrediction()
            } else {
                this.loadFailed()
            }
        },
        // 获取预测合成结果
        findBmPrediction() {
            let that = this
            this.$apollo
                .query({
                    query: findBmPrediction,
                    fetchPolicy: 'network-only',
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    clearTimeout(that.timer)
                    const data = res.data.findBmPrediction
                    if (data && data.code === 200) {
                        if (data.data.result === -1) {
                            that.timer = setTimeout(function() {
                                that.findBmPrediction()
                            }, 10000)
                        } else if (data.data.result === 1) {
                            that.findBmScanFileInfos()
                        } else {
                            this.loadFailed()
                        }
                    } else {
                        this.loadFailed()
                    }
                })
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
                            // 体测模型文件
                            if (model.fileType.id === 2) {
                                if (model.filePath !== '') {
                                    this.iframeOptions.oldModelPath = model.filePath
                                }
                            }
                            // 预测模型文件
                            if (model.fileType.id === 9) {
                                if (model.filePath !== '') {
                                    this.iframeOptions.newModelPath = model.filePath
                                }
                            }
                        })

                        if (this.iframeOptions.newModelPath && this.iframeOptions.oldModelPath) {
                            this.$refs.model.loadPredictionModel()
                        } else {
                            this.loadFailed()
                        }
                    } else {
                        this.loadFailed()
                    }
                })
        },
        onModelLoadError(errObj) {
            if (errObj.type === 'prediction') {
                this.loadFailed()
            }
        },
        loadFailed() {
            this.isLoad = false
            this.$emit('modelLoadOver', 'prediction')
            if (this.textPosition && this.textPosition === 'top') {
                this.modelFailed = true
            } else {
                this.iframeOptions.failed = true
            }
            // 两个模型都加载失败
            this.$emit('modelLoadError', {
                type: 'prediction',
                isNew: false
            })
            this.$emit('modelLoadError', {
                type: 'prediction',
                isNew: true
            })
        },
        loadModelOver() {
            this.isLoad = false
            this.$emit('modelLoadOver', 'prediction')
        }
    }
}
</script>
<style lang="less" scope>
.prediction-model {
    .prediction-text {
        font-size: 12px;
        padding-bottom: 10px;

        &.top {
            top: 10px;
            bottom: auto !important;
        }

        span {
            color: #9b9b9b;
        }
        img {
            width: 18px;
            height: 16px;
            margin: 0 40px;
        }
    }
    .error-model {
        position: absolute;
        width: 100%;
        // top: 20px;
        top: 40px;
        left: 0;
        z-index: 1;

        .model-svg {
            position: absolute;
            // width: 50%;
            display: flex;
            align-items: center;

            &.left {
                right: 50%;
                width: 50%;
                justify-content: flex-end;
                // padding-right: 30px;

                .faild-msg {
                    right: 17px;
                }
            }
            &.right {
                left: 50%;
                width: 50%;
                justify-content: flex-start;
                // padding-left: 30px;

                .faild-msg {
                    left: 17px;
                }
            }
            .faild-msg {
                position: absolute;
                width: 80px;
                color: #fff;
                font-size: 12px;
            }
            img {
                // height: 70px;
                margin-bottom: 0;
                // height: 250px;
                height: 215px;
                // margin-top: 20px;
                margin-top: 25px;
            }
        }
    }
}
.iframe-bottomleft {
        width: 135px;
        height: 57px;
        position: absolute;
        bottom: 60px;
        left: 12%;
        z-index: 2;
        opacity: 0.5;
        // z-index: 0;
    }

    .iframe-bottomright {
        width: 135px;
        height: 57px;
        position: absolute;
        bottom: 60px;
        right: 12%;
        // left: 3.5rem;
        z-index: 2;
        opacity: 0.5;
    }
</style>
