<template>
    <div class="body-composition-share-page">
        <div class="body-composition-page" id="shareDom" ref="shareDom">
            <div class="share-header-menu">
                <div class="back-step">
                    <!-- <img class="back-step-img" @click="goBackStep()" src="@/assets/images/icon_arrow_left.png" alt="返回"> -->
                    <img
                        class="back-step-img"
                        v-if="isAppLogin === '1'"
                        @click="goBackStep()"
                        src="@/assets/images/icon_arrow_left.png"
                        alt="返回"
                    />
                </div>

                <!-- 分享 -->
                <span class="next-step" v-if="modelLoad" @click="createImage()">继续</span>
                <span class="next-step disabled" v-else>继续</span>
            </div>
            <!-- tab-container -->

            <div class="share-tab-container">
                <div v-if="selected == 'compare'" class="tab-container-item is-model">
                    <!-- 模型对比 -->
                    <div class="share-model-container" ref="shapeDoubleModel" id="shapeDoubleModel">
                        <shape-double-item
                            datePosition="top"
                            @modelItemLoadOver="modelItemLoadOver"
                            @modelItemLoadError="modelItemLoadError"
                            :iframeId="shapeIframeId"
                        ></shape-double-item>
                    </div>
                    <!-- 身体成分对比数据 -->
                    <div class="body-data-container">
                        <template v-for="item in bodyCompare">
                            <div class="body-data-list" :key="item.order">
                                <div class="data-name">{{ item.name }}</div>
                                <div class="data-value">{{ item.diff }}{{ item.unit }}</div>
                            </div>
                        </template>
                    </div>
                    <!-- 模型旋转提示 -->
                    <div class="model-tip" v-if="!isModelFailed">— 模型可旋转至您喜欢的角度后再分享 —</div>
                </div>
                <!-- <div v-if="selected == 'prediction'"
                class="tab-container-item is-model">-->
                <!-- 体型预测 -->
                <!-- <div class="share-model-container"
                        id="predictionModel">
                        <prediction-item @modelItemLoadOver="modelItemLoadOver"
                            @modelItemLoadError="modelItemLoadError"
                            textPosition="top"
                            :iframeId="preIframeId"></prediction-item>
                </div>-->
                <!-- 预测调节量数据 -->
                <!-- <div class="body-data-container">
                        <template v-for="item in bodyAdjust">
                            <div class="body-data-list"
                                :key="item.order">
                                <div class="data-name">{{ item.name }}</div>
                                <div class="data-value">{{ item.data }}{{ item.unit }}</div>
                            </div>
                        </template>
                </div>-->
                <!-- 模型旋转提示 -->
                <!-- <div class="model-tip"
                        v-if="!isModelFailed">
                        — 模型可旋转至您喜欢的角度后再分享 —
                </div>-->
                <!-- </div> -->
                <div v-if="selected == 'trend'" class="tab-container-item">
                    <!--折线图-->
                    <div class="trend-defer-container" ref="trendDeferDom">
                        <trend-item ref="trend"></trend-item>
                    </div>
                </div>
            </div>

            <div class="share-tab-bar-list" v-if="!isNewOne">
                <div
                    :class="{'tab-bar-btn': true, 'active': selected === 'compare', 'screen-btn': showModelImg}"
                    @click="changeTabType('compare')"
                >
                    <img
                        v-if="selected === 'compare'"
                        class="tab-bar-img"
                        src="@/assets/images/share/icon_compare_active.svg"
                        alt
                    />
                    <img v-else class="tab-bar-img" src="@/assets/images/share/icon_compare.svg" alt />
                    <span>体型对比</span>
                </div>
                <!-- 屏蔽体型预测tab -->
                <!-- <div :class="{'tab-bar-btn': true, 'active': selected === 'prediction', 'screen-btn': showModelImg}"
                    @click="changeTabType('prediction')">
                    <img v-if="selected === 'prediction'" class="tab-bar-img"
                        src="@/assets/images/share/icon_prediction_active.svg"
                        alt="">
                    <img v-else class="tab-bar-img"
                        src="@/assets/images/share/icon_prediction.svg"
                        alt="">
                    <span>体型预测</span>
                </div>-->
                <div
                    :class="{'tab-bar-btn': true, 'active': selected === 'trend', 'screen-btn': showModelImg}"
                    @click="changeTabType('trend')"
                >
                    <img
                        v-if="selected === 'trend'"
                        class="tab-bar-img"
                        src="@/assets/images/share/icon_trend_active.svg"
                        alt
                    />
                    <img v-else class="tab-bar-img" src="@/assets/images/share/icon_trend.svg" alt />
                    <span>趋势变化</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import html2canvas from 'html2canvas';
// import PredictionItem from '@/components/body/PredictionItem'
import ShapeDoubleItem from '@/components/body/ShapeDoubleItem'
// import domtoimage from 'dom-to-image';
import TrendItem from '@/components/share/BmTrend'
import { findBmBIAScanTrueHistory, findBmMassQuotaInfos, bodyAdjustInfo } from '@/assets/js/apolloGql.js'
import { clone, toDecimal2 } from '@/assets/js/util.js'
// import vConsole from '@/assets/js/vconsole'

export default {
    components: {
        // 体型预测
        // PredictionItem,
        ShapeDoubleItem,
        TrendItem
    },
    data() {
        return {
            showModelImg: false,
            selected: '',
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            scanIds: [],
            shapeIframeId: 'shapeIframe',
            preIframeId: 'preIframeId',
            compareData: null,
            // 趋势对比时间信息
            trendData: null,
            selectedScanId: '',
            selectedTime: '',
            dateList: [],
            isNewOne: false,
            // 模型加载完毕
            modelLoad: true,
            bodyCompare: [],
            bodyAdjust: [],
            isModelFailed: false, // 模型加载全失败
            shareModelInfo: {
                type: '',
                oldModel: true,
                newModel: true
            },
            isAppLogin: window.sessionStorage.getItem('isAppLogin'),
            // 分享模型类型
            shareModelType: this.$route.params.type
        }
    },
    mounted() {
        this.initData()
        // console.log(vConsole)
    },
    methods: {
        // 初始化数据
        initData() {
            let compareDataStorage = window.sessionStorage.getItem('compareData')
            this.compareData = compareDataStorage ? JSON.parse(compareDataStorage) : null
            let trendDataStorage = window.sessionStorage.getItem('trendData')
            this.trendData = trendDataStorage ? JSON.parse(trendDataStorage) : null
            this.selected = this.shareModelType
            if (['compare', 'prediction'].indexOf(this.selected) > -1) {
                this.modelLoad = false
                // 如果不是从趋势对比进来，清空趋势日期
                window.localStorage.removeItem('trendData')
            } else {
                this.modelLoad = true
            }
            this.$hmt.trackPageview(`/share/preview/${this.selected}`)
            this.findBmBIAScanTrueHistory()
        },
        // 如果缓存有比较的scanid 缓存取，没有 则取传的selectedScanid
        getStorageScanId() {
            if (!this.selectedScanId) {
                if (this.compareData && this.compareData.scanId) {
                    this.selectedScanId = this.compareData.scanId
                    this.selectedTime = this.compareData.date
                } else {
                    // 查询scanid
                    if (this.dateList.length > 1) {
                        const historyData = this.dateList[1]
                        this.selectedScanId = historyData.scanId
                        this.selectedTime = historyData.createDate
                        window.sessionStorage.setItem(
                            'compareData',
                            JSON.stringify({
                                date: this.selectedTime,
                                scanId: this.selectedScanId
                            })
                        )
                    }
                }
            }
            // this.loadMeasureDoubleModel();
        },
        // 返回上一步
        goBackStep() {
            if (this.selected === 'trend') {
                this.$router.push({
                    path: `/body/${this.selected}`
                })
            } else {
                this.$router.push({
                    path: `/main/${this.selected}`
                })
            }
        },

        // 获取体态数据对比
        getBodyStateData() {
            this.$apollo
                .query({
                    query: findBmMassQuotaInfos,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.modelInfo.scanId,
                        tcScanId: this.selectedScanId
                    }
                })
                .then(res => {
                    const data = res.data.findBmMassQuotaInfos
                    if (data.code === 200) {
                        const newArray = clone(data.data)
                        this.bodyCompare = []
                        newArray.forEach(value => {
                            // 体重 肌肉量 体脂率
                            if (['WT', 'PBF', 'LM'].indexOf(value.dataColumn) > -1) {
                                let item = {
                                    order: value.order,
                                    name: value.name,
                                    data: toDecimal2(value.latestData.v, 1),
                                    unit: value.unit
                                }
                                if (value.contrastData) {
                                    let diff = value.latestData.v - value.contrastData.v
                                    diff = toDecimal2(diff, 1)
                                    item.diff = diff > 0 ? `+${diff}` : diff
                                } else {
                                    // 无对比数据 及 BIA失败
                                    item.diff = '--'
                                }
                                // 对数据排序
                                this.bodyCompare.push(item)
                            }
                        })
                    }
                })
        },
        // 获取身体调节量
        getBodyAdjustData() {
            this.$apollo
                .query({
                    query: bodyAdjustInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    const data = res.data.bodyAdjustInfo
                    if (data && data.code === 200) {
                        const info = data.data
                        const weight = info.weight > 0 ? `+${toDecimal2(info.weight, 1)}` : toDecimal2(info.weight, 1)
                        const muscle = info.muscle > 0 ? `+${toDecimal2(info.muscle, 1)}` : toDecimal2(info.muscle, 1)
                        const bodyFat =
                            info.bodyFat > 0 ? `+${toDecimal2(info.bodyFat, 1)}` : toDecimal2(info.bodyFat, 1)
                        const adjust = [
                            {
                                order: 1,
                                name: '体重',
                                data: weight,
                                unit: 'kg'
                            },
                            {
                                order: 2,
                                name: '肌肉量',
                                data: muscle,
                                unit: 'kg'
                            },
                            {
                                order: 3,
                                name: '体脂肪',
                                data: bodyFat,
                                unit: 'kg'
                            }
                        ]
                        this.bodyAdjust = adjust
                    }
                })
        },

        // 跳转到生成图片界面
        createImage() {
            let modelIframe = null
            if (this.selected === 'compare') {
                modelIframe = window.frames[this.shapeIframeId]
            } else if (this.selected === 'prediction') {
                modelIframe = window.frames[this.preIframeId]
            }
            if (!!modelIframe && (this.selected === 'compare' || this.selected === 'prediction')) {
                let canvasArray = modelIframe.document.getElementsByTagName('canvas')
                let modelCanvas = canvasArray[0]
                // 把模型图片放到缓存
                if (modelCanvas) {
                    window.localStorage.setItem('modelImage', modelCanvas.toDataURL('image/png'))
                } else {
                    window.localStorage.removeItem('modelImage')
                }
            }
            // 模型失败情况放入缓存
            window.localStorage.setItem('shareModelInfo', JSON.stringify(this.shareModelInfo))
            this.$router.push({
                path: `/share/preview/${this.selected}`
            })
        },
        // 切换tab类型
        changeTabType(type) {
            // 防止重复次点击tab
            if (this.selected === type) {
                return
            }
            this.selected = type
            this.isModelFailed = false
            this.shareModelInfo = {
                type: '',
                oldModel: true,
                newModel: true
            }
            if (['compare', 'prediction'].indexOf(this.selected) > -1) {
                this.modelLoad = false
            } else {
                this.modelLoad = true
            }
            // 改变url，便于回退到指定tab
            this.$router.replace({
                path: `/share/${this.selected}`
            })
            this.$hmt.trackPageview(`/share/preview/${this.selected}`)
            if (type === 'trend') {
                this.$nextTick(() => {
                    this.$refs.trend.init(this.scanIds)
                })
            }
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
                            return new Date(`${a.createTime}`).getTime() - new Date(`${b.createTime}`).getTime()
                        })
                        // 过滤趋势变化日期
                        this.dateList.forEach(ite => {
                            if (this.trendData) {
                                if (
                                    new Date(ite.createDate).getTime() >=
                                    new Date(this.trendData.date.replace(/\./g, '/')).getTime()
                                ) {
                                    this.scanIds.push(ite.scanId)
                                }
                            } else {
                                this.scanIds.push(ite.scanId)
                            }
                        })

                        window.sessionStorage.setItem('scanIds', JSON.stringify(this.scanIds))

                        // 模拟新用户情况
                        // this.dateList = this.dateList.slice(0, 1);
                        if (this.dateList.length > 1) {
                            this.isNewOne = false
                            // this.selected = '1';
                            // 老用户
                            this.getStorageScanId()
                        } else {
                            // 新用户

                            this.isNewOne = true
                            this.selected = 'prediction'
                        }
                        if (this.selected === 'trend') {
                            this.$nextTick(() => {
                                this.$refs.trend.init(this.scanIds)
                            })
                        }
                        this.getBodyStateData()
                        this.getBodyAdjustData()
                        // this.selectedTime = this.dateList[0].createDate;
                    }
                })
        },
        // 模型生成成功
        predictionLoad(type) {
            // console.log(type)
        },
        // 模型加载失败
        modelItemLoadError(res) {
            if (res) {
                if (res.isNew) {
                    this.shareModelInfo.newModel = false
                } else {
                    this.shareModelInfo.oldModel = false
                }
                this.shareModelInfo.type = res.type
                this.isModelFailed = this.shareModelInfo.newModel === false && this.shareModelInfo.oldModel === false
                // 如果体型预测失败，清空模型图片
                if (res.type === 'prediction') {
                    window.localStorage.removeItem('modelImage')
                }
            }
        },
        // 模型加载完成
        modelItemLoadOver(type) {
            if (type) {
                console.log('模型加载完毕！（包含成功或失败）', type)
                this.modelLoad = true
            }
        }
    }
}
</script>

<style lang="less" scoped>
.body-composition-share-page {
    position: absolute;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);
}
.body-composition-hidden {
    top: 100% !important;
    transition: all linear 0.25s;
}
.body-composition-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
// tab切换
.share-tab-container {
    flex: 1;
    .tab-container-item {
        min-height: 200px;
    }
    .share-model-image {
        width: 300px;
        height: 257px;
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        margin: auto;
    }
}
.share-tab-bar-list {
    display: flex;
    justify-content: center;
    margin: 10px 0;

    .tab-bar-btn {
        width: 30%;
        padding: 10px;
        // border: 1px solid #fff;
        border-radius: 4px;
        margin: 5px;
        color: #fff;
        background-color: #191b31;
        font-size: 13px;
        display: flex;
        align-items: center;
        border: 1px transparent solid;
        cursor: pointer;
        display: flex;
        flex-direction: column;

        &.active {
            // border: 1px solid #04798C;
            border: 1px solid transparent;
            background-image: linear-gradient(#191b31, #191b31),
                /* 底色，即原有的背景 */ linear-gradient(to right, #06b0a2, #067eb9); /* 模拟渐变边框 */
            background-clip: padding-box, border-box;
            background-origin: border-box;

            &.screen-btn {
                border: 2px solid #06b0a2;
            }
        }

        .tab-bar-img {
            width: 24px;
            margin-bottom: 10px;
        }
    }
}
.body-composition-page {
    position: absolute;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);
    .share-header-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 15px;
        padding-bottom: 0;
        position: relative;
        width: 100%;
        top: 0;
        z-index: 1;

        .back-step {
            display: flex;

            .back-step-img {
                width: 18px;
                height: 18px;
            }
        }

        .next-step {
            color: #009fe8;

            &.disabled {
                color: #84848a;
            }
        }
    }
    .model-canvas {
        width: 300px;
        height: 250px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }
    .share-model-container {
        position: relative;
    }
}
.model-tab-comtainer {
    margin-top: -50px;
}
.share-img-container {
    position: fixed;
    width: 100%;
    height: 100%;
    margin: auto;
    z-index: 99;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    padding: 5%;
    .share-img {
        width: 90%;
        // width: 100%;
        border-radius: 4px;
        border: 1px solid #fff;
    }
    .share-model-img {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 57%;
        top: 45px;
        border: 1px solid #fff;
    }
    .final-img {
        position: absolute;
        width: 90%;
        // width: 100%;
        left: 0;
        right: 0;
        margin: auto;
        border: 1px solid #fff;
    }
}
// 身体数据list
.body-data-container {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: 13px;
    margin-top: 20px;

    .body-data-list {
        display: flex;
        width: 33%;
        justify-content: center;
        border-right: 1px solid #4a4a4a;

        &:last-of-type {
            border-right: none;
        }

        .data-name {
            color: #9b9b9b;
        }

        .data-value {
            color: #ffffff;
            margin-left: 10px;
        }
    }
}
.model-tip {
    font-size: 13px;
    color: #9b9b9b;
    margin-top: 20px;
}
</style>
