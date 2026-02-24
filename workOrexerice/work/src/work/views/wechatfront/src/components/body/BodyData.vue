<template>
    <!--身体成分下半部分-->
    <div class="body-composition body-thermal-wrapper">
        <div class="segment-fat-data">
            <div class="thermal-title">
                <span></span>
                <div @click="timePopupVisible = true" v-if="isMoreTime">
                    <p>
                        <span>{{ selectTime }}</span>
                        <span v-if="selectTime">对比</span>
                        <span>{{ lastSelectTime }}</span>
                    </p>
                    <img src="@/assets/images/icon_history.png" alt />
                </div>
            </div>
            <div v-for="(item, index) in composition" :key="index">
                <bodydata-item :chart="item" v-if="showItem(item) && notTang(item)"></bodydata-item>
            </div>
            <!-- <div class="btn-action">
                <img src="@/assets/images/comp_personalise_tab.png" alt="" @click="handleClick">
            </div>-->
        </div>

        <!--时间选择弹出框-->
        <select-time :select="select" :selectTime="selectTime" :lastSelectTime="lastSelectTime"
            :popupVisible="timePopupVisible" :timeList="timeList" @handelChange="handelChange" @handleClose="handleClose"
            @handleSureTime="handleSureTime" v-if="isMoreTime"></select-time>
    </div>
</template>

<script>
import SelectTime from '@/components/time/Select'
import BodydataItem from '@/components/common/BodyDataItem'
import { isVAlite6 } from '@/types/device.js'
import { findBmMassQuotaInfos, findBmBIAScanTrueHistory } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime } from '@/assets/js/util.js'

export default {
    components: {
        SelectTime,
        BodydataItem
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            reportMode: window.localStorage.getItem('reportMode'),
            composition: [],
            ytb: false,
            select: false,
            selectTime: '',
            lastSelectTime: '',
            timePopupVisible: false,
            timeList: [],
            scanId: '',
            tcScanId: '',
            isVAlite6: isVAlite6(),
            originDate: '', // 初始日期
            isMoreTime: true
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
        this.$hmt.trackPageview('/tab/body')
    },
    methods: {
        notTang(item) {
            if (this.reportMode.indexOf('011') > -1 && (item.dataColumn === 'ECW' || item.dataColumn === 'ICW' || item.dataColumn === 'METABOLICAGE')) {
                return false
            }
            return true
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
                                    this.bmMassContrasInfo()
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
                                    this.bmMassContrasInfo()
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

                        this.bmMassContrasInfo()
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

        bmMassContrasInfo() {
            let tcScanId = ''
            if (!this.compared) {
                tcScanId = this.defaultScanId
            } else {
                tcScanId = this.tcScanId
            }
            this.$apollo
                .query({
                    query: findBmMassQuotaInfos,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.scanId,
                        tcScanId: tcScanId
                    }
                })
                .then(res => {
                    const data = res.data.findBmMassQuotaInfos
                    if (data.code === 200) {
                        let newArray = clone(data.data)
                        if (this.isVAlite6) {
                            newArray = newArray.filter(item =>
                            item.name !== '细胞内液' && item.name !== '细胞外液')
                        }
                        console.log('newArray', newArray)
                        newArray.forEach(item => {
                            if (item.contrastData) {
                                item.contrast = item.contrastData.v
                            } else {
                                item.contrast = null
                            }
                            item.lates = item.latestData.v
                        })
                        this.composition = newArray
                    }
                })
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
            this.timePopupVisible = false
            this.compared = true
            this.originDate = this.selectTime
            this.saveStorage(this.selectTime, this.tcScanId)
            if (this.tcScanId) {
                this.bmMassContrasInfo()
            }
        },
        handelHelp() {
            this.popupVisible = true
        },
        // handleClick() {
        //     this.$router.push('/body/custom');
        // },
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
            this.timePopupVisible = false
        },
        showItem(item) {
            if (item.dataColumn === 'ICW' || item.dataColumn === 'ECW') {
                // console.log(`当前数据${item.l} ${item.h} ${item.dataColumn} ${JSON.stringify(item)}`)
                return item.latestData.l !== 0 || item.latestData.h !== 0
            }
            if (item.dataColumn === 'METABOLICAGE') {
                // 仅pro3 pro5显示
                const sns = ['34', '36', '50', '51', '52', 'M3', 'N3']
                const sn = this.scanId.substring(0, 2)
                return sns.indexOf(sn) > -1 && item.latestData.v !== 0
            }
            return true
        }
    }
}
</script>

<style lang="less" scoped>
.body-composition {

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    padding: 0 13px;

    // min-height: 525px;
    .btn-action {
        margin-top: 18px;
        margin-bottom: 20px;

        img {
            width: 211px;
            height: 52px;
        }
    }

    .standard-text {
        display: flex;
        justify-content: space-around;
        color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
    }

    >ul {
        text-align: left;

        li.composition-item:nth-child(5) {
            .body-scale {
                >ul {
                    li {
                        &:nth-child(32) {
                            height: 28px;
                            margin-top: -14px;
                        }

                        &:nth-child(22),
                        &:nth-child(43) {
                            height: 0;
                            margin-top: 0;
                        }
                    }
                }
            }
        }

        >li {
            list-style: none;
            color: #fff;
            font-size: 10px;
            height: 110px;
            border-radius: 5px;
            background-image: linear-gradient(to right, #13162e, #0f132a, #12142e, #13162e);
            box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.2);
            margin-bottom: 10px;
            padding: 0 10px;
            position: relative;

            .scale-lift-color {
                background-color: #069cfa !important;
            }

            .scale-lift {
                position: absolute;
                right: 10px;
                top: 0;
                width: 20px;
                height: 22px;
                line-height: 22px;
                text-align: center;
                border-bottom-left-radius: 9px;
                border-bottom-right-radius: 9px;
                background-color: #fcb127;
                color: #fff;
            }

            p.name {
                display: flex;
                align-items: center;
                font-size: 14px;
                line-height: 21px;
                padding-top: 9px;

                img {
                    &:first-child {
                        min-width: 21px;
                        min-height: 21px;
                        margin-right: 4px;
                        padding-left: 0;
                    }

                    padding-left: 12px;
                }
            }

            .body-scale {
                position: relative;

                &:after {
                    position: absolute;
                    display: block;
                    content: '';
                    width: 100%;
                    height: 20px;
                    background-color: #0d0f19;
                    top: 18px;
                    z-index: 5;
                }
            }
        }
    }
}

.thermal-title {
    margin-bottom: 10px;
}
</style>
