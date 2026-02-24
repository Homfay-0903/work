/* eslint-disable camelcase */
<template>
    <!--围度信息数据模块-->
    <div>
        <mt-spinner type="fading-circle" v-if="!latest.bustGirth && modelInfo.bdaStatus === 1"
            class="loading-box"></mt-spinner>
        <div class="roundness-information body-thermal-wrapper" v-else>
            <!--没有测量体测-->
            <div class="no-thermal-data"
                v-if="(modelInfo.staticEval === 0 && !isVAPro3) || (modelInfo.bdaStatus === 0 && isVAPro3)">
                <div>
                    <p>围度信息未测量，所以暂无测量结果~</p>
                    <p>让努力的汗水看得见！</p>
                    <p>下次记得围度信息测量哟！</p>
                </div>
            </div>
            <!--体围未测量-->
            <div class="no-thermal-data" v-if="modelInfo.bdaStatus === 4">
                <div class="no-eval">
                    <p class="title">
                        <img src="../../assets/images/icon/tip.svg" alt />
                        <span>本次未测量</span>
                    </p>
                    <p v-if="!isVAPro3">找到 3D 智能体测精灵，进行一次测量吧！</p>
                    <p v-else>找到 3D 智能体测镜，进行一次测量吧！</p>
                </div>
            </div>
            <!--测量失败-->
            <div class="no-thermal-data" v-else-if="modelInfo.bdaStatus !== 1">
                <div>
                    <p></p>
                    <p>体测模型合成失败~</p>
                    <p>小编猜可能是网络原因导致的</p>
                </div>
            </div>
            <!--围度对比数据-->
            <div class="segment-fat-data" v-else>
                <div class="thermal-title">
                    <span>围度单位：cm</span>
                    <!-- v2.2.0 需求屏蔽 -->
                    <!-- <div @click="popupVisible = true" v-if="isMoreTime">
                        <p>
                            <span>{{ selectTime }}</span>
                            <span v-if="selectTime">对比</span>
                            <span>{{ lastSelectTime }}</span>
                        </p>
                        <img src="@/assets/images/icon_history.png" alt />
                    </div> -->
                </div>
                <div class="thermal-data">
                    <div>
                        <!-- <girthdata-item name="胸围" unit="cm" :thermalImg="thermal.img1" :latest="latest.bustGirth"
                            :contrast="contrast && contrast.bustGirth"></girthdata-item>
                        <girthdata-item name="腰围" unit="cm" :thermalImg="thermal.img2" :latest="latest.waistGirth"
                            :contrast="contrast && contrast.waistGirth"></girthdata-item>
                        <girthdata-item name="臀围" unit="cm" :thermalImg="thermal.img3" :latest="latest.hipGirth"
                            :contrast="contrast && contrast.hipGirth"></girthdata-item>
                        <girthdata-item name="左上臂围" unit="cm" :thermalImg="thermal.img4" :latest="latest.leftUpperArmGirth"
                            :contrast="contrast && contrast.leftUpperArmGirth"></girthdata-item>
                        <girthdata-item name="右上臂围" unit="cm" :thermalImg="thermal.img5" :latest="latest.rightUpperArmGirth"
                            :contrast="contrast && contrast.rightUpperArmGirth"></girthdata-item>
                        <girthdata-item name="左大腿围" unit="cm" :thermalImg="thermal.img6" :latest="latest.leftThighGirth"
                            :contrast="contrast && contrast.leftThighGirth"></girthdata-item>
                        <girthdata-item name="右大腿围" unit="cm" :thermalImg="thermal.img7" :latest="latest.rightThighGirth"
                            :contrast="contrast && contrast.rightThighGirth"></girthdata-item>
                        <girthdata-item name="左小腿围" unit="cm" :thermalImg="thermal.img8" :latest="latest.leftCalfGirth"
                            :contrast="contrast && contrast.leftCalfGirth"></girthdata-item>
                        <girthdata-item name="右小腿围" unit="cm" :thermalImg="thermal.img9" :latest="latest.rightCalfGirth"
                            :contrast="contrast && contrast.rightCalfGirth"></girthdata-item> -->
                        <girthdata-item :key="index" v-for="(item, index) in roundness" :name="item.title" unit="cm"
                            :thermalImg="item.img" :latest="item.latestData" :contrast="item.contrastData"></girthdata-item>
                    </div>
                </div>
            </div>
            <!--时间选择弹出框-->
            <select-time :select="select" :selectTime="selectTime" :lastSelectTime="lastSelectTime"
                :popupVisible="popupVisible" :timeList="timeList" @handelChange="handelChange" @handleClose="handleClose"
                @handleSureTime="handleSureTime" v-if="isMoreTime"></select-time>
        </div>
    </div>
</template>

<script>
import SelectTime from '@/components/time/Select'
import GirthdataItem from '@/components/common/GirthDataItem'
import { bmGirthContrasInfo, findBsScanTrueHistory } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime } from '@/assets/js/util.js'

import thermalImg1 from '@/assets/images/round_bust.png'
import thermalImg2 from '@/assets/images/round_waistline.png'
import thermalImg3 from '@/assets/images/round_hipCircumference.png'
import thermalImg4 from '@/assets/images/ther_leftupperlimb.png'
import thermalImg5 from '@/assets/images/ther_rightupperlimb.png'
import thermalImg6 from '@/assets/images/round_leftthigh.png'
import thermalImg7 from '@/assets/images/round_rightthigh.png'
import thermalImg8 from '@/assets/images/round_leftleg.png'
import thermalImg9 from '@/assets/images/round_rightlowerleg.png'
import thermalImg10 from '@/assets/images/svg/neck_img.svg'
import thermalImg11 from '@/assets/images/svg/midWaistGirth_img.svg'
// left_min_thigh_girth_img
import thermalImg12 from '@/assets/images/svg/left_min_thigh_girth_img.svg'
import thermalImg13 from '@/assets/images/svg/right_min_thigh_girth_img.svg'
import { isVAPro3 } from '@/types/device.js'
export default {
    components: {
        SelectTime,
        GirthdataItem
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            isMoreTime: true,
            girthTpl: [
                {
                    title: '颈围',
                    key: 'neckGirth',
                    img: thermalImg10,
                },
                {
                    title: '左上臂围',
                    key: 'leftUpperArmGirth',
                    img: thermalImg4,
                },
                {
                    title: '右上臂围',
                    key: 'rightUpperArmGirth',
                    img: thermalImg5,
                },
                {
                    title: '胸围',
                    key: 'bustGirth',
                    img: thermalImg1,
                },
                {
                    title: '高腰围',
                    key: 'waistGirth',
                    img: thermalImg2,
                },
                {
                    title: '中腰围',
                    key: 'midWaistGirth',
                    img: thermalImg11
                },
                {
                    title: '低腰围',
                    key: 'lowWaistGirth',
                    img: thermalImg11
                },
                {
                    title: '臀围',
                    key: 'hipGirth',
                    img: thermalImg3,
                },
                {
                    title: '左大腿围',
                    key: 'leftThighGirth',
                    img: thermalImg6,
                },
                {
                    title: '左大腿最小围',
                    key: 'leftMinThighGirth',
                    img: thermalImg12
                },
                {
                    title: '右大腿围',
                    key: 'rightThighGirth',
                    img: thermalImg7,
                },
                {
                    title: '右大腿最小围',
                    key: 'rightMinThighGirth',
                    img: thermalImg13
                },
                {
                    title: '左小腿围',
                    key: 'leftCalfGirth',
                    img: thermalImg8,
                },
                {
                    title: '右小腿围',
                    key: 'rightCalfGirth',
                    img: thermalImg9,
                }
            ],
            roundness: [],
            select: false,
            selectTime: '',
            lastSelectTime: '',
            popupVisible: false,
            timeList: [],
            scanId: '',
            tcScanId: '',
            // 对比最新数据的上一次
            defaultScanId: '',
            originDate: '', // 初始日期
            compared: false,
            contrast: {},
            latest: {},
            isNewMath: false,
        }
    },
    computed: {
        isVAPro3() {
            return isVAPro3()
        }
    },
    mounted() {
        // 本次BDA成功获取数据
        if (this.modelInfo.bdaStatus === 1) {
            this.findBsScanTrueHistory()
        }
        this.$hmt.trackPageview('/tab/girth')
    },
    methods: {
        // 获取用户体态合成成功历史记录
        findBsScanTrueHistory() {
            this.$apollo
                .query({
                    query: findBsScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: this.modelInfo.createTime
                    }
                })
                .then(res => {
                    const data = res.data.findBsScanTrueHistory
                    if (data.code === 200) {
                        if (data.data.length) {
                            this.timeList = clone(data.data)
                            this.timeList.forEach((time, index) => {
                                time.options = []
                                this.$lodash.each(time.data, (item, itemIndex) => {
                                    time.options.push({
                                        scanId: item.scanId,
                                        label: formatDate(new Date(item.createDate)),
                                        value: formatTime(new Date(item.createDate)),
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

                            // 最后一组时间有对比
                            if (lastDataLen >= 2) {
                                if (this.selectTime && this.defaultScanId) {
                                    if (this.initExistDate(lastData)) {
                                        this.bmGirthContrasInfo()
                                        return
                                    }
                                }
                                lastData[lastDataLen - 2].isChecked = true
                                this.defaultScanId = lastData[lastDataLen - 2].scanId
                                this.selectTime = lastData[lastDataLen - 2].value
                                // 上一组时间判断
                            } else if (timeLen >= 2) {
                                let preData = this.timeList[timeLen - 2].options
                                if (this.selectTime && this.defaultScanId) {
                                    if (this.initExistDate(preData)) {
                                        this.bmGirthContrasInfo()
                                        return
                                    }
                                }
                                let preDataLen = preData.length
                                preData[preDataLen - 1].isChecked = true
                                this.defaultScanId = preData[preDataLen - 1].scanId
                                this.selectTime = preData[preDataLen - 1].value
                            } else {
                                this.isMoreTime = false
                            }
                            this.originDate = this.selectTime
                            this.bmGirthContrasInfo()
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
        },

        // 围度信息
        bmGirthContrasInfo() {
            let tcScanId = ''
            if (!this.compared) {
                tcScanId = this.defaultScanId
            } else {
                tcScanId = this.tcScanId
            }
            this.$apollo
                .query({
                    query: bmGirthContrasInfo,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.scanId,
                        tcScanId: tcScanId
                    }
                })
                .then(res => {
                    const data = res.data.bmGirthContrasInfo
                    if (data && data.code === 200) {
                        this.contrast = data.data.contrastBmGirth
                        this.latest = data.data.latestBmGirth
                        this.isNewMath = data.data.latestBmGirth.isNewMath === 1 ? true : false
                        this.girthTpl.forEach((girth) => {
                            if (this.showGirthItem(girth.key)) {
                                const contrastData = data.data.contrastBmGirth ? data.data.contrastBmGirth[girth.key] : null
                                const latestData = data.data.latestBmGirth ? data.data.latestBmGirth[girth.key] : null
                                const item = { ...girth, contrastData, latestData }
                                this.roundness.push(item)
                            }
                        })
                    }
                })
        },
        showGirthItem(key) {
            if (isVAPro3()) {
                return true
            }
            console.log(`传入key${key}`)
            if (this.isNewMath) {
                return key !== 'leftMidThighGirth' && key !== 'rightMidThighGirth'
            } else {
                return key !== 'neckGirth' && key !== 'leftMidThighGirth' && key !== 'rightMidThighGirth' && key !== 'leftMinThighGirth' && key !== 'rightMinThighGirth' && key !== 'midWaistGirth' && key !== 'lowWaistGirth'
            }
        },
        // 选择时间
        handelChange(data) {
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
            this.saveStorage(this.selectTime, this.tcScanId)
            if (this.tcScanId) {
                this.bmGirthContrasInfo()
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
.roundness-information {

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .no-thermal-data {
        .no-eval {
            text-align: left;
            padding-left: 15vw;
            padding-right: 6vw;

            .title {
                display: flex;
                align-items: center;
                margin-bottom: 1vw;
                position: relative;
                left: -28px;

                span {
                    font-size: 3.8vw;
                    margin-left: 2vw;
                }
            }
        }
    }
}
</style>
