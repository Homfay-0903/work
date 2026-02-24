<template>
    <!-- 体型对比模型 -->
    <div class="shape-double-model">
        <!-- <model-loading></model-loading> -->
        <model-loading v-show="isLoad"></model-loading>
        <iframe-template
            ref="model"
            :iframeId="iframeId"
            :options="iframeOptions"
            @isIframeLoad="findModelFile"
            @isModelLoad="loadModelOver"
            @isModelLoadError="onModelLoadError"
        ></iframe-template>
        <div :class="{'error-model': true, 'top': datePosition === 'top'}">
            <div class="model-svg left" v-if="oldModel.failed">
                <img v-if="userInfo.sex == 2" src="@/assets/images/model_woman@2x.png" alt />
                <img v-else src="@/assets/images/model_man@2x.png" alt />
                <span class="faild-msg">{{datePosition === 'top' ? '暂无模型' : oldModel.msg}}</span>
            </div>

            <div class="model-svg right" v-if="newModel.failed">
                <img v-if="userInfo.sex == 2" src="@/assets/images/model_woman@2x.png" alt />
                <img v-else src="@/assets/images/model_man@2x.png" alt />
                <span class="faild-msg">{{datePosition === 'top' ? '暂无模型' : newModel.msg}}</span>
            </div>
        </div>
        <div :class="{'model-describe-text': true, 'top': datePosition === 'top'}">
            <div
                class="model-text"
                :style="{'visibility': !isNewOne ? 'visble' : 'hidden'}"
            >{{oldModel.date || (compareData ? compareData.date : '')}}测量</div>
            <div class="model-text">本次测量</div>
        </div>
    </div>
</template>
<script>
import IframeTemplate from '@/components/model/IframeTemplate'
import ModelLoading from '@/components/model/Loading'
import { findBmScanFileInfos, findBmBIAScanTrueHistory } from '@/assets/js/apolloGql.js'
import { formatTime } from '@/assets/js/util.js'

export default {
    components: {
        IframeTemplate,
        ModelLoading
    },
    props: {
        iframeId: String,
        datePosition: String
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            compareData: null,
            iframeOptions: {
                url: 'measureDouble/index.html',
                oldModelPath: '',
                newModelPath: '',
                width: '300px',
                height: '250px',
                showShapeMode: false,
                failed: false
            },
            oldModel: {
                path: '',
                date: '',
                failed: false,
                msg: ''
            },
            newModel: {
                path: '',
                date: '',
                failed: false,
                msg: ''
            },
            isLoad: true,
            timer: 0,
            historyScanId: '',
            dateList: [],
            isNewOne: false, // 是新用户
            // 获取用户基本信息
            userInfo: JSON.parse(window.localStorage.getItem('memberInfo'))
        }
    },
    mounted() {
        // this.findModelFile();
    },
    methods: {
        // 初始化模型相关数据
        initModelInfo() {
            let compareDataStorage = window.sessionStorage.getItem('compareData')
            this.compareData = compareDataStorage ? JSON.parse(compareDataStorage) : null
            this.oldModel = {
                path: '',
                date: '',
                failed: false,
                msg: ''
            }
            this.newModel = {
                path: '',
                date: '',
                failed: false,
                msg: ''
            }
            this.timer = 0
            // 防止渲染报错后无法再次渲染模型
            this.iframeOptions.failed = false
            this.isLoad = true
        },
        findModelFile(tcScanId) {
            if (tcScanId && typeof tcScanId === 'string') {
                this.selectedScanId = tcScanId
            }
            this.initModelInfo()
            // 清空场景模型
            if (this.$refs.model) {
                this.$refs.model.clearSence()
            }

            // 查询历史数据 判断角色
            this.findBmBIAScanTrueHistory()
        },
        // 如果缓存有比较的scanid 缓存取，没有 则取传的selectedScanid
        getStorageScanId() {
            if (!this.selectedScanId) {
                if (this.compareData && this.compareData.scanId) {
                    this.selectedScanId = this.compareData.scanId
                } else {
                    if (!this.isNewOne) {
                        this.selectedScanId = this.dateList[1].scanId
                        if (!this.compareData && this.dateList.length > 1) {
                            const compareDataObj = {
                                date: this.dateList[1].createDate,
                                scanId: this.dateList[1].scanId
                            }
                            this.compareData = compareDataObj
                            window.sessionStorage.setItem('compareData', JSON.stringify(compareDataObj))
                        }
                    }
                }
            }
            this.loadMeasureDoubleModel()
        },
        // 如果本次模型合成成功，渲染模型
        loadMeasureDoubleModel() {
            // this.modelInfo.bmBdaScanResult = 2
            if (this.modelInfo.bmBdaScanResult === 1) {
                // 如果首次 直接加载newModel
                if (this.isNewOne) {
                    this.getBmScanFileInfos(this.modelInfo.scanId, 'newModel', () => {
                        this.timer++
                        this.$refs.model.loadMeasureDoubleModel(this.newModel.path)
                    })
                } else {
                    this.getBmScanFileInfos(this.modelInfo.scanId, 'newModel', () => {
                        this.getBmScanFileInfos(this.selectedScanId, 'oldModel', () => {
                            if (!this.$refs.model) {
                                return
                            }
                            if (this.newModel.path && !this.oldModel.path) {
                                this.$refs.model.loadMeasureDoubleModel(this.newModel.path)
                            } else if (!this.newModel.path && this.oldModel.path) {
                                this.$refs.model.loadMeasureDoubleModel(this.oldModel.path)
                            } else if (this.newModel.path && this.oldModel.path) {
                                this.$refs.model.loadMeasureDoubleModel(this.newModel.path, this.oldModel.path)
                            }
                        })
                    })
                }
            } else {
                // 本次合成失败，最新模型不加载
                this.newModel.failed = true
                this.newModel.msg = '本次测量未合成成功，可到设备再次测量'
                this.timer++
                this.$emit('modelLoadError', {
                    type: 'shapeDouble',
                    isNew: true
                })
                if (!this.isNewOne) {
                    this.getBmScanFileInfos(this.selectedScanId, 'oldModel', () => {
                        this.$refs.model.loadMeasureDoubleModel('', this.oldModel.path)
                    })
                } else {
                    // 首次测量合成失败
                    this.timer++
                    this.$emit('modelLoadError', {
                        type: 'shapeDouble',
                        isNew: false
                    })
                    this.chargeModelLoadOver()
                }
                // this.loadFailed();
            }
        },
        // 获取模型数据
        getBmScanFileInfos(scanId, modelType, fn) {
            this.$apollo
                .query({
                    query: findBmScanFileInfos,
                    variables: {
                        scanId: scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBmScanFileInfos
                    if (data && data.code === 200) {
                        this.$lodash.each(data.data, (model, index) => {
                            // 体测模型文件
                            if (model.fileType.id === 2) {
                                if (model.filePath !== '') {
                                    this[modelType].path = model.filePath
                                    if (model.createDate) {
                                        this[modelType].date = formatTime(new Date(model.createTime * 1000))
                                    } else {
                                        if (!this.isNewOne && this.dateList[1].createTime) {
                                            if (!this.compareData || !this.compareData.date) {
                                                this[modelType].date = formatTime(
                                                    new Date(this.dateList[1].createTime * 1000)
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    this[modelType].failed = true
                                    this[modelType].msg = '该日期无模型，请选择其他对比日期'
                                    // this.isLoad = false
                                    this.timer++
                                    this.$emit('modelLoadError', {
                                        type: 'shapeDouble',
                                        isNew: modelType === 'newModel'
                                    })
                                }
                            }
                        })
                    } else {
                        this[modelType].failed = true
                        this[modelType].msg = '该日期无模型，请选择其他对比日期'
                        this.oldModel.date = this.compareData ? this.compareData.date : ''
                        // this.isLoad = false
                        this.timer++
                        // this.$emit('modelLoadOver', 'shapeDouble')
                        this.chargeModelLoadOver()
                        this.$emit('modelLoadError', {
                            type: 'shapeDouble',
                            isNew: modelType === 'newModel'
                        })
                    }
                    if (fn) {
                        fn()
                    }
                })
        },
        // 获取用户体测BIA合成成功历史记录
        findBmBIAScanTrueHistory() {
            this.$apollo
                .query({
                    query: findBmBIAScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: this.modelInfo.createTime
                    }
                })
                .then(res => {
                    const data = res.data.findBmBIAScanTrueHistory
                    if (data.code === 200) {
                        let resultList = data.data
                        this.dateList = []
                        resultList.forEach((yearDate, index) => {
                            this.dateList = this.dateList.concat(yearDate.data)
                        })
                        // 确保数据安全 根据createtime排序
                        this.dateList.sort((a, b) => {
                            return new Date(`${b.createTime}`).getTime() - new Date(`${a.createTime}`).getTime()
                        })
                        // 模拟新用户情况
                        // this.dateList = this.dateList.slice(0, 1);
                        if (this.dateList.length > 1) {
                            this.isNewOne = false
                            // 老用户
                            this.getStorageScanId()
                        } else {
                            // 新用户
                            this.isNewOne = true
                            this.oldModel.msg = '首次测量，暂无历史数据'
                            this.oldModel.failed = true
                            this.getStorageScanId()
                        }
                    }
                })
        },
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
                    isNew: errObj.isNew
                })
            }
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
            this.$emit('modelLoadOver', 'shapeDouble')
        },
        loadModelOver() {
            this.timer++
            this.chargeModelLoadOver()
        },
        // 判定模型加载结束（成功或失败）
        chargeModelLoadOver() {
            if (this.timer === 2) {
                this.isLoad = false
                this.$emit('modelLoadOver', 'shapeDouble')
            }
        }
    }
}
</script>
<style lang="less" scope>
.shape-double-model {
    // position: relative;
    height: 290px;
    padding-top: 20px;

    .model-describe-text {
        position: absolute;
        color: #fff;
        font-size: 12px;
        width: 100%;
        bottom: 10px;
        left: 0;

        &.top {
            top: 10px;
            bottom: auto;
            color: #9b9b9b;
        }

        .model-text {
            width: 50%;
            float: left;

            &:first-of-type {
                text-align: right;
                padding-right: 20px;
            }
            &:last-of-type {
                text-align: left;
                padding-left: 45px;
            }
        }
    }
    .iframe-template {
        z-index: 10;
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
                padding-right: 30px;

                .faild-msg {
                    right: 17px;
                }
            }
            &.right {
                left: 50%;
                width: 50%;
                justify-content: flex-start;
                padding-left: 40px;

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
                // height: 70px;
                margin-bottom: 0;
                // height: 250px;
                height: 215px;
                margin-top: 25px;
                // margin-top: 5px;;
            }
        }
    }
}
</style>
