<template>
    <!--热力对比数据内容-->
    <div>
        <div class="body-thermal-wrapper">
            <!--无对比数据-->
            <!-- <div class="no-thermal-data" v-if="noThermalData">
            <div>
                <p>热力对比可查看您的身体热力增减变化~</p>
                <p>让努力的汗水看得见！</p>
                <p>需要第二次检测后才能看到对比哦！</p>
            </div>
            </div>-->
            <!--节段脂肪对比 && 节段肌肉对比-->
            <div class="segment-fat-data">
                <div class="thermal-title">
                    <span>节段脂肪对比 | kg</span>
                    <div @click="popupVisible = true" v-if="!noThermalData">
                        <p>
                            <span>{{ selectTime }}</span>
                            对比
                            <span>{{ lastSelectTime }}</span>
                        </p>
                        <img src="@/assets/images/icon_history.png" alt />
                    </div>
                </div>
                <!-- 加载动画 -->
                <div class="loading" v-show="loading">
                    <mt-spinner type="fading-circle" class="loading-dot"></mt-spinner>
                </div>
                <div :style="loading ? 'opacity: 0;' :''">
                    <div class="thermal-data">
                        <div>
                            <heatmapdata-item
                                name="右上肢"
                                unit="kg"
                                :thermalImg="thermal.img1"
                                :latest="thermalBFM.BFMRA.v"
                                :contrast="thermalBFM.BFMRA.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="左上肢"
                                unit="kg"
                                :thermalImg="thermal.img2"
                                :latest="thermalBFM.BFMLA.v"
                                :contrast="thermalBFM.BFMLA.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="躯干"
                                unit="kg"
                                :thermalImg="thermal.img3"
                                :latest="thermalBFM.BFMTR.v"
                                :contrast="thermalBFM.BFMTR.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="右下肢"
                                unit="kg"
                                :thermalImg="thermal.img4"
                                :latest="thermalBFM.BFMRL.v"
                                :contrast="thermalBFM.BFMRL.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="左下肢"
                                unit="kg"
                                :thermalImg="thermal.img5"
                                :latest="thermalBFM.BFMLL.v"
                                :contrast="thermalBFM.BFMLL.tcV"
                            ></heatmapdata-item>
                        </div>
                    </div>
                    <div class="thermal-title">
                        <span>节段肌肉对比 | kg</span>
                    </div>
                    <div class="thermal-data">
                        <div>
                            <heatmapdata-item
                                name="右上肢"
                                unit="kg"
                                :thermalImg="thermal.img1"
                                :latest="thermalLM.LMRA.v"
                                :contrast="thermalLM.LMRA.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="左上肢"
                                unit="kg"
                                :thermalImg="thermal.img2"
                                :latest="thermalLM.LMLA.v"
                                :contrast="thermalLM.LMLA.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="躯干"
                                unit="kg"
                                :thermalImg="thermal.img3"
                                :latest="thermalLM.LMTR.v"
                                :contrast="thermalLM.LMTR.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="右下肢"
                                unit="kg"
                                :thermalImg="thermal.img4"
                                :latest="thermalLM.LMRL.v"
                                :contrast="thermalLM.LMRL.tcV"
                            ></heatmapdata-item>
                            <heatmapdata-item
                                name="左下肢"
                                unit="kg"
                                :thermalImg="thermal.img5"
                                :latest="thermalLM.LMLL.v"
                                :contrast="thermalLM.LMLL.tcV"
                            ></heatmapdata-item>
                        </div>
                    </div>
                </div>
            </div>
            <!--时间选择弹出框-->
            <select-time
                :select="select"
                :selectTime="selectTime"
                :lastSelectTime="lastSelectTime"
                :popupVisible="popupVisible"
                :timeList="timeList"
                @handelChange="handelChange"
                @handleClose="handleClose"
                @handleSureTime="handleSureTime"
                v-if="!noThermalData"
            ></select-time>
        </div>
    </div>
</template>

<script>
import SelectTime from '@/components/time/Select'
import HeatmapdataItem from '@/components/common/HeatmapDataItem'
import { bmSegContrastInfo, findBmBIAScanTrueHistory, bmSegInfo } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime } from '@/assets/js/util.js'

import thermalImg1 from '@/assets/images/ther_rightupperlimb.png'
import thermalImg2 from '@/assets/images/ther_leftupperlimb.png'
import thermalImg3 from '@/assets/images/ther_trunk.png'
import thermalImg4 from '@/assets/images/ther_rightlowerlimb.png'
import thermalImg5 from '@/assets/images/ther_leftlowerlimb.png'
export default {
    components: {
        SelectTime,
        HeatmapdataItem
    },
    props: {
        noThermalData: Boolean
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            select: false,
            // 要选择的对比时间
            selectTime: '',
            lastSelectTime: '',
            popupVisible: false,
            timeList: [],
            scanId: '',
            tcScanId: '',
            selectScanId: '',
            originDate: '', // 初始日期
            // 对比最新数据的上一次
            defaultScanId: '',
            thermalBFM: {
                BFMRA: {},
                BFMLA: {},
                BFMTR: {},
                BFMRL: {},
                BFMLL: {}
            },
            thermalLM: {
                LMRA: {},
                LMLA: {},
                LMTR: {},
                LMRL: {},
                LMLL: {}
            },
            compared: false,
            thermal: {
                img1: thermalImg1,
                img2: thermalImg2,
                img3: thermalImg3,
                img4: thermalImg4,
                img5: thermalImg5
            },
            thermalNoData: false,
            loading: false
        }
    },
    watch: {
        selectTime(val) {
            let time = val.split('.')
            let times = time[0] + '-' + time[1] + '-' + time[2]
            this.$emit('changeCompateDate', times)
        },
        selectScanId(val) {
            this.$emit('changeCompateScanId', val)
        }
    },
    mounted() {
        let compareDataStorage = window.sessionStorage.getItem('compareData')
        let savedCompareData = compareDataStorage ? JSON.parse(compareDataStorage) : null
        if (savedCompareData) {
            this.selectTime = savedCompareData.date || ''
            this.defaultScanId = savedCompareData.scanId || ''
        }
        this.findBmBIAScanTrueHistory()
        this.$hmt.trackPageview('/tab/heatmap')
    },
    methods: {
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
                        this.timeList = clone(data.data)
                        this.timeList.forEach((time, index) => {
                            time.options = []
                            this.$lodash.each(time.data, (item, itemIndex) => {
                                time.options.push({
                                    scanId: item.scanId,
                                    label: formatDate(new Date(item.createTime * 1000)),
                                    value: formatTime(new Date(item.createTime * 1000)),
                                    disabled: false,
                                    isChecked: false
                                })
                            })
                            time.options.reverse()
                        })
                        // 数组倒序排列
                        this.timeList.reverse()
                        // 时间组长度
                        let timeLen = this.timeList.length
                        // 最后一组时间
                        let lastData = this.timeList[timeLen - 1].options
                        let lastDataLen = lastData.length
                        // 本次扫描信息
                        lastData[lastDataLen - 1].disabled = true
                        this.lastSelectTime = lastData[lastDataLen - 1].value
                        this.scanId = lastData[lastDataLen - 1].scanId

                        // 上一次扫描信息
                        // 最后一组时间有对比
                        if (lastDataLen >= 2) {
                            if (this.selectTime && this.defaultScanId) {
                                if (this.initExistDate(lastData)) {
                                    // this.$emit('changetcScanId', this.defaultScanId);
                                    this.bmSegContrastInfo()
                                    return
                                }
                            }
                            lastData[lastDataLen - 2].isChecked = true
                            this.defaultScanId = lastData[lastDataLen - 2].scanId
                            this.selectTime = lastData[lastDataLen - 2].value
                            this.originDate = this.selectTime

                            // this.$emit('changetcScanId', this.defaultScanId);
                            this.bmSegContrastInfo()
                            // 上一组时间判断
                        } else if (timeLen >= 2) {
                            let preData = this.timeList[timeLen - 2].options
                            if (this.selectTime && this.defaultScanId) {
                                if (this.initExistDate(preData)) {
                                    // this.$emit('changetcScanId', this.defaultScanId);
                                    this.bmSegContrastInfo()
                                    return
                                }
                            }
                            let preDataLen = preData.length
                            preData[preDataLen - 1].isChecked = true
                            this.defaultScanId = preData[preDataLen - 1].scanId
                            this.selectTime = preData[preDataLen - 1].value
                            this.originDate = this.selectTime

                            // this.$emit('changetcScanId', this.defaultScanId);
                            this.bmSegContrastInfo()
                        } else if (timeLen === 1 && lastDataLen === 1) {
                            // 首次
                            this.bmSegInfo()
                        }
                    }
                })
        },

        // 缓存中有数据，直接从缓存拉去
        initExistDate(dateArray) {
            // 有可能缓存的时间不在数组中
            let isChanged = false
            for (let i = 0; i < this.timeList.length; i++) {
                for (let j = 0; j < this.timeList[i].options.length; j++) {
                    if (
                        this.timeList[i].options[j].scanId === this.defaultScanId &&
                        this.timeList[i].options[j].value === this.selectTime
                    ) {
                        this.timeList[i].options[j].isChecked = true
                        isChanged = true
                        this.originDate = this.selectTime
                        break
                    }
                }
            }
            return isChanged
        },

        // 缓存对比日期和scanid
        saveStorage(date, scanId) {
            window.sessionStorage.setItem(
                'compareData',
                JSON.stringify({
                    date,
                    scanId
                })
            )
            this.$emit('changetcScanId', scanId)
        },

        // 节段对比数据
        bmSegContrastInfo() {
            this.selectScanId = !this.compared ? this.defaultScanId : this.tcScanId
            this.loading = true
            this.$apollo
                .query({
                    query: bmSegContrastInfo,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.scanId,
                        tcScanId: this.selectScanId
                    }
                })
                .then(res => {
                    const data = res.data.bmSegContrastInfo
                    this.loading = false
                    if (data.code === 200) {
                        // 脂肪
                        this.thermalBFM = data.data.bmSegBFMContrast
                        // 肌肉
                        this.thermalLM = data.data.bmSegLMContrast
                    } else if (data.code === 404) {
                        // 体测节段数据不存在(--)
                        this.thermalNoData = true
                    }
                })
        },

        // 节段数据
        bmSegInfo() {
            this.loading = true
            this.$apollo
                .query({
                    query: bmSegInfo,
                    variables: {
                        scanId: this.scanId
                    }
                })
                .then(res => {
                    const data = res.data.bmSegInfo
                    this.loading = false
                    if (data.code === 200) {
                        // 脂肪
                        this.thermalBFM = data.data.bmSegBFM
                        // 肌肉
                        this.thermalLM = data.data.bmSegLM
                    } else if (data.code === 404) {
                        // 体测节段数据不存在(--)
                        this.thermalNoData = true
                    }
                })
        },
        handelChange(data) {
            // this.$emit('changetcScanId', data.scanId);
            this.select = true
            this.selectTime = data.value
            this.tcScanId = data.scanId

            this.$lodash.each(this.timeList, (time, idx) => {
                let itemTime = time
                delete itemTime.radio
                this.$lodash.each(itemTime.options, (item, i) => {
                    let itemOpt = item
                    itemOpt.isChecked = false
                    if (data.value === itemOpt.value) {
                        itemOpt.isChecked = true
                    }
                    this.$set(itemTime.options, i, itemOpt)
                })
                this.$set(this.timeList, idx, itemTime)
            })
        },
        handleSureTime() {
            this.popupVisible = false
            this.compared = true
            this.originDate = this.selectTime
            // 先隐藏时间选择器，等待隐藏完毕再加载模型
            setTimeout(() => {
                this.saveStorage(this.selectTime, this.tcScanId)
            }, 500)
            if (this.tcScanId && this.compared) {
                this.bmSegContrastInfo()
            }
        },
        // 关闭时间组件
        handleClose() {
            let tmpTime = this.selectTime
            this.selectTime = this.originDate
            // 如果没有点击确定，数据恢复原样
            for (let i = 0; i < this.timeList.length; i++) {
                for (let j = 0; j < this.timeList[i].options.length; j++) {
                    if (this.timeList[i].options[j].value === tmpTime) {
                        this.timeList[i].options[j].isChecked = false
                    }
                    if (this.timeList[i].options[j].value === this.selectTime) {
                        this.timeList[i].options[j].isChecked = true
                    }
                }
            }
            this.popupVisible = false
        }
    }
}
</script>
<style lang="less" scoped>
.body-thermal-wrapper {
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }
    .segment-fat-data {
        .thermal-data {
            margin: 10px 0;
        }
        .loading {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            .loading-dot {
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
}
</style>

