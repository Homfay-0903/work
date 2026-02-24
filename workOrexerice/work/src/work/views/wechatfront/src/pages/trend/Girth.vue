<template>
    <!--趋势对比图-->
    <div class="body-composition-trend">
        <div class="header-timer">
            <p @click="popupVisible = true">
                <img src="@/assets/images/share/icon_date_history.svg" class="icon-date-picker" alt />
                <span>{{ selectTime }} ~</span>
                <span>{{ lastSelectTime }}</span>
            </p>
        </div>
        <!--折线图-->
        <div class="trend-defer-container">
            <!--<p v-if="!selectTime" class="no-trend-data">请选择趋势对比时间段!</p>-->
            <ul>
                <trend-charts :key="index" :idx="index" :abbr="item.dataColumn" :name="item.name" :unit="item.unit"
                    :idValue="item.idValue" :val="toDecimal2(Number(item.max / 3), 1)" :times="item.timeList"
                    :lineData="item.lineData" :min="item.min" :max="item.max" v-for="(item, index) in girthTrendList"
                    v-show="showSpecialItem(index, item)"></trend-charts>
            </ul>
        </div>
        <!--时间选择弹出框-->
        <trend-time :select="select" :selectTime="selectTime" :lastSelectTime="lastSelectTime" :popupVisible="popupVisible"
            :timeList="timeList" @handelChange="handelChange" @handleClose="handleClose"
            @handleSureTime="handleSureTime"></trend-time>
    </div>
</template>

<script>
/* eslint max-nested-callbacks: ["error", 4] */
import TrendTime from '@/components/time/Trend'
import trendCharts from '@/components/trend/Charts'
import { findBsScanTrueHistory, findBmGirthTrend } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime, formatMonth, formatDay } from '@/assets/js/util.js'
import { isVAPro3 } from '@/types/device.js'
export default {
    components: {
        TrendTime,
        trendCharts
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            select: false,
            // 要选择的对比时间
            selectTime: '',
            lastSelectTime: '',
            scanIds: [],
            girthTrendList: [],
            girthMinList: [],
            popupVisible: false,
            originNoCheckScanIds: [], // 原始未选中scanid数据
            originDate: '', // 初始日期
            defaultScanId: '',
            timeList: [],
            index: 0,
            lineTimes: [],
            lineData: [],
            trendList: [
                {
                    name: '颈围',
                    dataColumn: 'neckGirth',
                    unit: 'cm',
                    order: 1
                },
                {
                    name: '左上臂围',
                    dataColumn: 'leftUpperArmGirth',
                    unit: 'cm',
                    order: 2
                },
                {
                    name: '右上臂围',
                    dataColumn: 'rightUpperArmGirth',
                    unit: 'cm',
                    order: 3
                },
                {
                    name: '胸围',
                    dataColumn: 'bustGirth',
                    unit: 'cm',
                    order: 4
                },
                {
                    name: '腰围',
                    dataColumn: 'waistGirth',
                    unit: 'cm',
                    order: 5
                },
                {
                    name: '中腰围',
                    dataColumn: 'midWaistGirth',
                    unit: 'cm',
                    order: 6
                },
                {
                    name: '臀围',
                    dataColumn: 'hipGirth',
                    unit: 'cm',
                    order: 7
                },
                {
                    name: '左大腿围',
                    dataColumn: 'leftThighGirth',
                    unit: 'cm',
                    order: 8
                },
                // {
                //     name: this.$t('girth.tpl[8].title'),
                //     dataColumn: 'leftMidThighGirth',
                //     unit: 'cm',
                //     order: 9
                // },
                {
                    name: '左大腿最小围',
                    dataColumn: 'leftMinThighGirth',
                    unit: 'cm',
                    order: 10
                },
                {
                    name: '右大腿围',
                    dataColumn: 'rightThighGirth',
                    unit: 'cm',
                    order: 11
                },
                // {
                //     name: this.$t('girth.tpl[11].title'),
                //     dataColumn: 'rightMidThighGirth',
                //     unit: 'cm',
                //     order: 12
                // },
                {
                    name: '右大腿最小围',
                    dataColumn: 'rightMinThighGirth',
                    unit: 'cm',
                    order: 13
                },
                {
                    name: '左小腿围',
                    dataColumn: 'leftCalfGirth',
                    unit: 'cm',
                    order: 14
                },
                {
                    name: '右小腿围',
                    dataColumn: 'rightCalfGirth',
                    unit: 'cm',
                    order: 15
                },
            ]
        }
    },
    mounted() {
        // 开启加载动画
        this.$indicator.open({
            spinnerType: 'fading-circle'
        })
        this.findBsScanTrueHistory()
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
                        this.timeList = clone(data.data)
                        if (this.timeList === null || this.timeList.length === 0) {
                            return
                        }
                        // 临时存储scanid 记录index
                        let tmpScanIds = []
                        this.timeList.forEach((time, index) => {
                            let indexDate = ''
                            indexDate = index
                            time.options = []
                            this.$lodash.each(time.data, (item, itemIndex) => {
                                time.options.push({
                                    scanId: item.scanId,
                                    label: formatDate(new Date(item.createDate)),
                                    value: formatTime(new Date(item.createDate)),
                                    // isChecked: false
                                    isChecked: true
                                })
                                tmpScanIds.push(item.scanId)
                            })
                            time.options.reverse()
                            let newArray = []
                            for (let i = time.options.length - 1; i >= 0; i -= 1) {
                                newArray.push(time.options[i])
                                if (newArray.length === 8) {
                                    newArray.forEach(m => {
                                        m.isChecked = true
                                    })
                                    break
                                }
                            }
                            newArray.forEach(ite => {
                                this.scanIds.push(ite.scanId)
                            })
                            if (indexDate + 1 === this.timeList.length) {
                                // this.selectTime = newArray[newArray.length - 1].value;
                                // this.scanIds = this.scanIds.reverse();
                                tmpScanIds = tmpScanIds.reverse()
                                // 使scanIds保持为全量的 正序 数组
                                this.scanIds = tmpScanIds
                                // 如果缓存中有比较时间段信息，过滤timeList
                                tmpScanIds = this.initExistDate(tmpScanIds)
                                // 记录原始数据
                                this.originNoCheckScanIds = [...tmpScanIds]
                                this.originDate = this.selectTime
                                this.findBmGirthTrend()
                            }
                        })
                        // 数组倒序排列
                        this.timeList.reverse()
                        let lastData = this.timeList[this.timeList.length - 1].options
                        if (!this.selectTime && this.timeList.length && this.timeList[0].options.length) {
                            this.selectTime = this.timeList[0].options[0].value
                            this.originDate = this.selectTime
                        }
                        this.lastSelectTime = lastData[lastData.length - 1].value
                        lastData[lastData.length - 1].disabled = true
                    }
                })
        },
        // 从缓存中拿取时间点数组，组合时间段timelist
        initExistDate(tmpScanIds) {
            let scanIdsResult = tmpScanIds
            let currentIndex = scanIdsResult.indexOf(this.defaultScanId)
            if (currentIndex > -1) {
                // scanids截取为激活状态数组
                this.scanIds = scanIdsResult.splice(currentIndex)
                for (let i = 0; i < this.timeList.length; i++) {
                    for (let j = 0; j < this.timeList[i].options.length; j++) {
                        if (this.scanIds.indexOf(this.timeList[i].options[j].scanId) === -1) {
                            this.timeList[i].options[j].isChecked = false
                        }
                        // 用于记录选中的第一个时间点
                        if (this.scanIds[0].indexOf(this.timeList[i].options[j].scanId) > -1) {
                            this.selectTime = this.timeList[i].options[j].value
                        }
                    }
                }
            } else {
                // compareData 为空，默认全选中
                scanIdsResult = []
            }
            return scanIdsResult
        },

        // 获取趋势对比数据
        findBmGirthTrend() {
            const that = this
            this.$apollo
                .query({
                    query: findBmGirthTrend,
                    variables: {
                        scanIds: this.scanIds
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.getBmGirthTrend
                    if (data && data.code === 200) {
                        const trendData = clone(data.data)
                        // 更新dom
                        this.trendList = [...this.trendList]
                        this.trendList.forEach((trend, index) => {
                            trend.idValue = ''
                            trend.min = ''
                            trend.max = ''
                            trend.timeList = []
                            trend.lineData = []
                            trend.girthMinList = []
                            // trend.trendData.reverse();
                            this.$lodash.each(trendData, (item, idx) => {
                                if (trend.dataColumn === idx) {
                                    this.$lodash.each(item, (girth, gidx) => {
                                        let idTime = ''
                                        if (gidx < item.length - 1) {
                                            let month = new Date(girth.scanTime).getMonth()
                                            let monthAga = new Date(item[gidx + 1].scanTime).getMonth()
                                            if (month === monthAga) {
                                                idTime = formatDay(new Date(girth.scanTime))
                                            } else {
                                                idTime = formatMonth(new Date(girth.scanTime))
                                            }
                                        } else {
                                            idTime = formatMonth(new Date(girth.scanTime))
                                        }
                                        if (girth.value === null) {
                                            idTime += '*'
                                            trend.lineData.unshift('')
                                        } else {
                                            trend.lineData.unshift(this.toDecimal2(Number(girth.value).toFixed(1), 1))
                                            trend.girthMinList.unshift(girth.value)
                                        }
                                        trend.timeList.unshift(idTime)
                                        trend.idValue = girth.value
                                        // trend.min = trend.trendData[0].l;
                                        trend.max = Math.max(...trend.lineData)
                                        trend.min = Math.min(...trend.girthMinList)
                                    })
                                }
                            })
                        })
                    }
                    this.girthTrendList = this.trendList
                    // 关闭加载动画
                    that.$indicator.close()
                    this.popupVisible = false
                })
        },
        showSpecialItem(index, item) {
            const key = item.dataColumn
            if (isVAPro3()) {
                return index <= this.girthTrendList.length - 1
            }
            if (index > this.girthTrendList.length - 1) {
                return false
            }
            return key !== 'neckGirth' && key !== 'leftMidThighGirth' && key !== 'rightMidThighGirth' && key !== 'leftMinThighGirth' && key !== 'rightMinThighGirth' && key !== 'midWaistGirth'
        },
        // 选择时间
        handelChange(data) {
            this.select = true
            this.selectTime = data.item.value
            this.tcScanId = data.item.scanId
            let scanIds = []
            this.$lodash.each(this.timeList, (time, idx) => {
                let itemTime = time
                if (data.parentIndex === idx) {
                    this.$lodash.each(itemTime.options, (item, i) => {
                        let itemOpt = item
                        if (data.childIndex <= i) {
                            itemOpt.isChecked = true
                            scanIds.push(item.scanId)
                        } else {
                            itemOpt.isChecked = false
                        }
                        this.$set(itemTime.options, i, itemOpt)
                    })
                    this.$set(this.timeList, idx, itemTime)
                } else if (data.parentIndex <= idx) {
                    this.$lodash.each(itemTime.options, (item, i) => {
                        let itemOpt = item
                        itemOpt.isChecked = true
                        scanIds.push(item.scanId)
                        this.$set(itemTime.options, i, itemOpt)
                    })
                    this.$set(this.timeList, idx, itemTime)
                } else if (data.parentIndex > idx) {
                    this.$lodash.each(itemTime.options, (item, i) => {
                        let itemOpt = item
                        itemOpt.isChecked = false
                        this.$set(itemTime.options, i, itemOpt)
                    })
                    this.$set(this.timeList, idx, itemTime)
                }
            })
            this.scanIds = scanIds
        },
        // 关闭时间组件
        handleClose() {
            this.selectTime = this.originDate
            for (let i = 0; i < this.timeList.length; i++) {
                for (let j = 0; j < this.timeList[i].options.length; j++) {
                    this.timeList[i].options[j].isChecked =
                        this.originNoCheckScanIds.indexOf(this.timeList[i].options[j].scanId) === -1
                }
            }
            this.popupVisible = false
        },
        handleSureTime() {
            this.popupVisible = false
            this.currentDate = this.selectTime
            this.originDate = this.selectTime
            // this.saveStorage(this.selectTime, this.tcScanId);
            if (this.selectTime) {
                this.findBmGirthTrend()
            }
        },
        toDecimal2(x, y) {
            let f = Math.round(x * 100) / 100
            let s = f.toString()
            let rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            return s
        }
    }
}
</script>
<style lang="less" scoped>
.body-composition-trend {

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }
}
</style>
