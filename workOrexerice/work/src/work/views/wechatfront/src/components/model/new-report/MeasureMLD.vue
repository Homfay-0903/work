<template>
    <!-- 首页报告模型 -->
    <div class="measure-model">
        <model-loading v-show="isLoad" class="model-loading"></model-loading>
        <iframe-template
            :class="['iframe-box', istatus ? 'iframe-left' : '',]"
            ref="model"
            :options="iframeOptions"
            :iframeId="'frameIdwaist'"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @isModelLoadError="onModelLoadError">
        </iframe-template>
        <div v-if="oldModel.path && newModel.path">
            <img :class="['iframe-bottomleft']" src="@/assets/images/new-report/girth/transform@2x.png" alt />
            <img :class="['iframe-bottomright']" src="@/assets/images/new-report/girth/transform@2x.png" alt />
        </div>
        <div v-else-if="!newModel.failed">
            <img class="iframe-bottom" src="@/assets/images/new-report/girth/transform@2x.png" alt />
        </div>
        <div class="error-model">
            <div class="model-svg left" v-if="oldModel.failed">
                <img src="@/assets/images/mobel@2x.png" alt />
                <span class="faild-msg"></span>
                <!-- <img class="iframe-bottom" src="@/assets/images/girth/transform@2x.png" alt /> -->
            </div>
            <div class="model-svg right" v-if="newModel.failed">
                <img src="@/assets/images/mobel@2x.png" alt />
                <span class="faild-msg"></span>
                <!-- <img class="iframe-bottom" src="@/assets/images/girth/transform@2x.png" alt /> -->
            </div>
        </div>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/IframeTemplate'
import ModelLoading from '@/components/model/Loading'
import { findBmScanFileInfos, findBsScanTrueHistory } from '@/assets/js/apolloGql.js'
import { setTimeout } from 'timers'
import { mapState } from 'vuex'

export default {
    components: {
        IframeTemplate,
        ModelLoading,
    },
    props: {
        showGirth: Boolean,
        tcScanId: String,
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            iframeOptions: {
                url: 'measureDoubleMLD/index.html',
                oldModelPath: '',
                newModelPath: '',
                // modelPath: '',
                jsonPath: '',
                jsonPath1: '',
                width: '100%',
                height: '95%!important',
                showGirth: this.showGirth,
                showShapeMode: false,
                failed: false,
            },
            oldModel: {
                path: '',
                date: '',
                failed: false,
                msg: '',
            },
            newModel: {
                path: '',
                date: '',
                failed: false,
                msg: '',
            },
            isLoad: true,
            isNewOne: false, // 是新用户
            dateList: [],
        }
    },
    computed: {
        ...mapState(['waistdataArray']),
        istatus() {
            return (!this.oldModel.path && this.newModel.path) || (this.oldModel.path && !this.newModel.path)
        },
        isStyle() {
            console.log('aaaa1')
            console.log(navigator.userAgent)
            console.log(navigator.userAgent.indexOf('iPhone'))

            return navigator.userAgent.indexOf('iPhone') > 1
        }
    },
    // created: function() {
    //     if (this.modelInfo.bdaStatus !== 1) {
    //         this.loadFailed()
    //     }
    // },
    methods: {
        // 初始化模型相关数据
        initModelInfo() {
            let compareDataStorage = window.sessionStorage.getItem('compareData')
            this.compareData = compareDataStorage ? JSON.parse(compareDataStorage) : null
            this.oldModel = {
                path: '',
                date: '',
                failed: false,
                msg: '',
            }
            this.newModel = {
                path: '',
                date: '',
                failed: false,
                msg: '',
            }
            this.timer = 0
            // 防止渲染报错后无法再次渲染模型
            this.iframeOptions.failed = false
            this.isLoad = true
        },
        findModelFile(tcScanId) {
            // 体测
            // if (this.modelInfo.bdaStatus > 0) {
            //     this.getBmScanFileInfos()
            // } else {
            //     this.loadFailed()
            // }
            if (tcScanId && typeof tcScanId === 'string') {
                this.selectedScanId = tcScanId
            }
            this.initModelInfo()
            // 清空场景模型
            if (this.$refs.model) {
                this.$refs.model.clearSence()
            }
            // 查询历史数据 判断角色
            this.getStorageScanId()
            // 历史记录接口
        },

        // 如果缓存有比较的scanid 缓存取，没有 则取传的selectedScanid
        getStorageScanId() {
            if (!this.selectedScanId) {
                if (this.compareData && this.compareData.scanId) {
                    this.selectedScanId = this.compareData.scanId
                } else {
                    if (!this.isNewOne) {
                        this.$apollo
                            .query({
                                query: findBsScanTrueHistory,
                                variables: {
                                    memberId: this.modelInfo.memberId,
                                    scanTime: this.modelInfo.createTime,
                                }
                            })
                            .then(res => {
                                const data = res.data.findBsScanTrueHistory
                                this.historyDate = []
                                if (data && data.code === 200) {
                                    for (let index = 0; index < data.data.length; index++) {
                                        for (let aa = 0; aa < data.data[index].data.length; aa++) {
                                            this.historyDate.push(data.data[index].data[aa])
                                        }
                                    }
                                }
                                this.dateList = this.historyDate
                                this.selectedScanId = this.dateList[1].scanId
                                if (!this.compareData && this.dateList.length > 1) {
                                    const compareDataObj = {
                                        date: this.dateList[1].createDate,
                                        scanId: this.dateList[1].scanId,
                                    }
                                    this.compareData = compareDataObj
                                    window.sessionStorage.setItem('compareData', JSON.stringify(compareDataObj))
                                }
                            })
                    }
                }
            }
            this.loadMeasureDoubleModel()
        },
        // 如果本次模型合成成功，渲染模型
        loadMeasureDoubleModel() {
            console.log('如果本次模型合成成功，渲染模型')
            this.getBmScanFileInfos(this.tcScanId || this.modelInfo.scanId, 'newModel', () => {
                this.timer++
            })
            if (this.waistdataArray.length > 1) this.getHistoryBmScanFileInfos(this.selectedScanId, 'oldModel', () => { })
            setTimeout(() => {
                console.log('模型文件路径', this.newModel.path, this.oldModel.path)
                if (this.newModel.path && !this.oldModel.path) {
                    this.$refs.model.loadMeasureDoubleModel(this.newModel.path)
                    this.isLoad = false
                } else if (!this.newModel.path && this.oldModel.path) {
                    this.$refs.model.loadMeasureDoubleModel(this.oldModel.path)
                    this.isLoad = false
                } else if (this.newModel.path && this.oldModel.path) {
                    this.$refs.model.loadMeasureDoubleModel(this.oldModel.path, this.newModel.path)
                }
                if (this.newModel.path && this.oldModel.path) {
                    this.$emit('statusDispaly', 2)
                } else {
                    this.$emit('statusDispaly', 1)
                }
            }, 2000)
            // this.modelInfo.bmBdaScanResult = 2
            // if (this.modelInfo.bmBdaScanResult === 1) {
            //     console.log('=====')
            //     // 如果首次 直接加载newModel
            //     if (this.isNewOne) {
            //         this.getBmScanFileInfos(this.modelInfo.scanId, 'newModel', () => {
            //             this.timer++
            //             this.$refs.model.loadMeasureDoubleModel(this.newModel.path)
            //         })
            //     } else {
            //         this.getBmScanFileInfos(this.modelInfo.scanId, 'newModel', () => {
            //             this.getBmScanFileInfos(this.selectedScanId, 'oldModel', () => {
            //                 if (!this.$refs.model) {
            //                     return
            //                 }
            //                 if (this.newModel.path && !this.oldModel.path) {
            //                     this.$refs.model.loadMeasureDoubleModel(this.newModel.path)
            //                 } else if (!this.newModel.path && this.oldModel.path) {
            //                     this.$refs.model.loadMeasureDoubleModel(this.oldModel.path)
            //                 } else if (this.newModel.path && this.oldModel.path) {
            //                     this.$refs.model.loadMeasureDoubleModel(this.newModel.path, this.oldModel.path)
            //                 }
            //             })
            //         })
            //     }
            // } else {
            //     // 本次合成失败，最新模型不加载
            //     this.newModel.failed = true
            //     this.newModel.msg = '本次测量未合成成功，可到设备再次测量'
            //     this.timer++
            //     this.$emit('modelLoadError', {
            //         type: 'shapeDouble',
            //         isNew: true,
            //     })
            //     if (!this.isNewOne) {
            //         this.getBmScanFileInfos(this.selectedScanId, 'oldModel', () => {
            //             this.$refs.model.loadMeasureDoubleModel('', this.oldModel.path)
            //         })
            //     } else {
            //         // 首次测量合成失败
            //         this.timer++
            //         this.$emit('modelLoadError', {
            //             type: 'shapeDouble',
            //             isNew: false,
            //         })
            //         this.chargeModelLoadOver()
            //     }
            //     // this.loadFailed();
            // }
        },
        // 获取模型数据
        getBmScanFileInfos(scanId, modelType, fn) {
            this.$apollo
                .query({
                    query: findBmScanFileInfos,
                    variables: {
                        scanId: scanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.findBmScanFileInfos
                    if (data && data.code === 200) {
                        this.$lodash.each(data.data, (model) => {
                            // 体测模型文件
                            if (model.fileType.id === 2) {
                                if (model.filePath !== '') {
                                    this[modelType].path = model.filePath
                                } else {
                                    this[modelType].failed = true
                                    this[modelType].msg = '该日期无模型，请选择其他对比日期'
                                    // this.isLoad = false
                                    this.timer++
                                    this.$emit('modelLoadError', {
                                        type: 'shapeDouble',
                                        isNew: modelType === 'newModel',
                                    })
                                }
                            }
                            if (model.fileType.id === 1) {
                                this.iframeOptions.jsonPath = model.filePath
                            }
                        })

                        if (this[modelType].path && this.iframeOptions.jsonPath) {
                            this.$refs.model.loadMeasureModel()
                        } else {
                            this.loadFailed()
                        }

                    } else {
                        this.oldModel.date = this.compareData ? this.compareData.date : ''
                        // this.isLoad = false
                        this.timer++
                        // this.$emit('modelLoadOver', 'shapeDouble')
                        this.chargeModelLoadOver()
                        this.$emit('modelLoadError', {
                            type: 'shapeDouble',
                            isNew: modelType === 'newModel',
                        })
                    }
                    if (fn) {
                        fn()
                    }
                })
        },
        getHistoryBmScanFileInfos(scanId, modelType, fn) {
            this.$apollo
                .query({
                    query: findBmScanFileInfos,
                    variables: {
                        scanId: window.localStorage.getItem('tcScanId'), // 选择的scanid
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.findBmScanFileInfos
                    if (data && data.code === 200) {
                        this.$lodash.each(data.data, (model) => {
                            // 体测模型文件
                            if (model.fileType.id === 2) {
                                if (model.filePath !== '') {
                                    this[modelType].path = model.filePath
                                    console.log(this[modelType].path, '6666')
                                } else {
                                    this[modelType].failed = true
                                    // this.isLoad = false
                                    this.timer++
                                    this.$emit('modelLoadError', {
                                        type: 'shapeDouble',
                                        isNew: modelType === 'oldModel',
                                    })
                                }
                            }
                            if (model.fileType.id === 1) {
                                this.iframeOptions.jsonPath1 = model.filePath
                            }
                        })
                    } else {
                        this.oldModel.date = this.compareData ? this.compareData.date : ''
                        // this.isLoad = false
                        this.timer++
                        // this.$emit('modelLoadOver', 'shapeDouble')
                        this.chargeModelLoadOver()
                        this.$emit('modelLoadError', {
                            type: 'shapeDouble',
                            isNew: modelType === 'newModel',
                        })
                    }
                    if (fn) {
                        fn()
                    }
                })
        },
        // // 获取模型数据
        // // 体测
        // findBmScanFileInfos() {
        //     this.$apollo
        //         .query({
        //             query: findBmScanFileInfos,
        //             variables: {
        //                 scanId: this.modelInfo.scanId
        //             },
        //             fetchPolicy: 'network-only'
        //         })
        //         .then(res => {
        //             const data = res.data.findBmScanFileInfos
        //             if (data && data.code === 200) {
        //                 this.iframeOptions.failed = false
        //                 this.$lodash.each(data.data, (model) => {
        //                     if (model.fileType.id === 2) {
        //                         this.iframeOptions.modelPath = model.filePath
        //                     }

        //                     if (model.fileType.id === 1) {
        //                         this.iframeOptions.jsonPath = model.filePath
        //                     }
        //                 })

        //                 if (this.iframeOptions.modelPath && this.iframeOptions.jsonPath) {
        //                     this.$refs.model.loadMeasureModel(true)
        //                 } else {
        //                     this.loadFailed()
        //                 }
        //             } else {
        //                 this.loadFailed()
        //             }
        //         })
        // },
        // onModelLoadError(errObj) {
        //     if (errObj.type === 'measure') {
        //         this.loadFailed()
        //     }
        // },
        onModelLoadError(errObj) {
            if (errObj.type === 'measureDouble') {
                if (errObj.isNew) {
                    this.newModel.failed = true
                    this.newModel.msg = '模型加载失败，请刷新页面尝试一下'
                } else {
                    this.oldModel.failed = true
                    this.oldModel.msg = '模型加载失败，请刷新页面尝试一下'
                }
                this.timer++
                this.chargeModelLoadOver()
                this.$emit('modelLoadError', {
                    type: 'shapeDouble',
                    isNew: errObj.isNew,
                })
            }
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
        },
        loadModelOver() {
            this.timer++
            this.chargeModelLoadOver()
        },
        selectCurve(girth) {
            console.log(`选择面${girth}`)
            this.$refs.model.selectCurve(girth)
        },
        setSlideIdx(idx) {
            console.log(`setSlideIdx${idx}`)
            this.$parent.setSlideIdx(idx)
        },
        // 判定模型加载结束（成功或失败）
        chargeModelLoadOver() {
            if (this.timer === 2) {
                this.isLoad = false
                this.$emit('modelLoadOver', 'shapeDouble')
            }
        }
    },
}
</script>
<style scoped lang="less">
.measure-model {
    display: flex;
    position: relative;
    // top: -18px;
    flex-direction: column;

    .model-loading {
        width: 98%;
        // height: 112%;
        left: 1%;
        top: -33px;
    }

    .iframe-bottom {
        position: absolute;
        width: 135px;
        height: 57px;
        left: 31%;
        bottom: 45px;
        z-index: 0;
    }

    .iframe-left {
        margin-left: 31.0% !important;
    }

    .iframe-iph {
        position: relative;
        top: 6px;
        left: 2px !important;
    }

    .measure-top {
        background-size: 80%, 100%;
        position: relative;
        left: 15px;
        right: 15px;
    }

    .iframe-box {
        // display: flex;
        // justify-content: space-between;
        // left: -10px;
    }

    .iframe-bottomleft {
        width: 135px;
        height: 57px;
        position: absolute;
        bottom: 50px;
        left: 1%;
        z-index: 0;
    }

    .iframe-bottomright {
        width: 135px;
        height: 57px;
        position: absolute;
        bottom: 50px;
        right: 1%;
        z-index: 0;
        // left: 3.5rem;
    }

    .iframe-img {
        left: -6%;
    }

    .iframe-img1 {
        right: -6%;
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
                padding-right: 50px;

                .faild-msg {
                    right: 17px;
                }
            }

            &.right {
                left: 50%;
                width: 50%;
                justify-content: flex-start;
                padding-left: 155px;

                .faild-msg {
                    left: 30px;
                }
            }

            .faild-msg {
                position: absolute;
                width: 80px;
                color: #fff;
                font-size: 12px;
            }

            img {
                margin-bottom: 0;
                height: 215px;
                margin-top: -30px;
                margin-left: -110px;
            }

            .iframe-bottom {
                width: 135px;
                height: 57px;
                position: relative;
                top: 100px;
            }
        }
    }
}
</style>
