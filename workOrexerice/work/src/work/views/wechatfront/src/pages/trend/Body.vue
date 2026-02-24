<template>
    <!--趋势对比图-->
    <div class="body-composition-trend">
        <div class="header-timer">
            <p @click="popupVisible = true">
                <img src="@/assets/images/share/icon_date_history.svg" class="icon-date-picker" alt />
                <span>{{ selectTime }} ~</span>
                <span>{{ lastSelectTime }}</span>
            </p>
            <!-- <p @click="goToShare()" v-if="!noHistoryData">
                <img src="@/assets/images/share/icon_share_transparent.svg" alt class="time-icon" />
            </p>-->
        </div>
        <!--折线图-->
        <div class="trend-defer-container">
            <!--<p v-if="!selectTime" class="no-trend-data">请选择趋势对比时间段!</p>-->
            <ul>
                <trend-charts :key="index" :idx="index" :abbr="item.dataColumn" :name="item.name" :unit="item.unit"
                    :idValue="item.idValue" :val="toDecimal2(Number(item.max / 3), 1)" :times="item.timeList"
                    :lineData="item.lineData" :min="item.min" :max="item.max" v-for="(item, index) in trendList"
                    v-show="index < trendList.length - 1 && notTang(item) && item.timeList.length"></trend-charts>
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
import { findBmBIAScanTrueHistory, findBmMassQuotaTrend } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime, formatMonth, formatDay } from '@/assets/js/util.js'

export default {
    components: {
        TrendTime,
        trendCharts
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            reportMode: window.localStorage.getItem('reportMode'),
            select: false,
            // 要选择的对比时间
            selectTime: '',
            defaultScanId: '',
            lastSelectTime: '',
            originNoCheckScanIds: [], // 原始未选中scanid数据
            originDate: '', // 初始日期
            scanIds: [],
            trendList: [],
            popupVisible: false,
            timeList: [],
            index: 0,
            lineTimes: [],
            lineData: [],
            noHistoryData: false // 无历史数据
        }
    },
    mounted() {
        // 开启加载动画
        this.$indicator.open({
            spinnerType: 'fading-circle'
        })
        window.sessionStorage.removeItem('trendData')
        this.findBmBIAScanTrueHistory()
    },
    methods: {
        notTang(item) {
            if (this.reportMode.indexOf('011') > -1 && (item.dataColumn === 'ECW' || item.dataColumn === 'ICW' || item.dataColumn === 'METABOLICAGE')) {
                return false
            }
            return true
        },
        // 跳转分享页面
        goToShare() {
            this.$hmt.trackEvent('share', 'enter', 'bodyTrend')
            this.$router.push({
                path: '/share/trend'
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
                    this.makeUpData(res)
                })
        },
        // 组装趋势数据
        makeUpData(res) {
            const data = res.data.findBmBIAScanTrueHistory
            if (data.code === 200) {
                this.timeList = clone(data.data)
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
                            isChecked: true
                        })
                        tmpScanIds.push(item.scanId)
                    })
                    time.options.reverse()
                    time.data.reverse()
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
                    newArray.reverse().forEach(ite => {
                        this.scanIds.push(ite.scanId)
                    })
                    if (indexDate + 1 === this.timeList.length) {
                        tmpScanIds = tmpScanIds.reverse()
                        // 使scanIds保持为全量的 正序 数组
                        this.scanIds = tmpScanIds
                        // 如果缓存中有比较时间段信息，过滤timeList
                        tmpScanIds = this.initExistDate(tmpScanIds)
                        // 记录原始数据
                        this.originNoCheckScanIds = [...tmpScanIds]
                        this.originDate = this.selectTime
                        this.findBmMassQuotaTrend()
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
                if (this.timeList.length <= 1 && this.timeList[0].data.length <= 1) {
                    this.noHistoryData = true
                } else {
                    this.noHistoryData = false
                }
            }
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
        findBmMassQuotaTrend() {
            const that = this
            this.$apollo
                .query({
                    query: findBmMassQuotaTrend,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanIds: this.scanIds
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBmMassQuotaTrend
                    if (data && data.code === 200) {
                        this.trendList = clone(data.data)
                        this.trendList[this.trendList.length - 1].trendData.reverse()
                        this.trendList = [...this.trendList, this.trendList[this.trendList.length - 1]]
                        this.trendList.forEach((trend, index) => {
                            trend.idValue = ''
                            trend.min = ''
                            trend.max = ''
                            trend.timeList = []
                            trend.lineData = []
                            trend.trendData.reverse()
                            this.$lodash.each(trend.trendData, (item, idx) => {
                                // 上下限为0的细胞内外液数据不计入趋势图
                                if (trend.dataColumn === 'ICW' || trend.dataColumn === 'ECW') {
                                    if (item.l === 0 && item.h === 0) {
                                        return
                                    }
                                }
                                if (trend.dataColumn === 'METABOLICAGE') {
                                    const sns = ['34', '36', '50', '51', '52', 'M3', 'N3']
                                    const sn = item.scanId.substring(0, 2)
                                    if (item.v === 0 || sns.indexOf(sn) === -1) {
                                        return
                                    }
                                }
                                let idTime = ''
                                if (idx > 0 && trend.timeList.length > 0) {
                                    let month = new Date(item.measureTime).getMonth()
                                    let monthAga = new Date(trend.trendData[idx - 1].measureTime).getMonth()
                                    if (month === monthAga) {
                                        idTime = formatDay(new Date(item.measureTime))
                                    } else {
                                        idTime = formatMonth(new Date(item.measureTime))
                                    }
                                } else {
                                    idTime = formatMonth(new Date(item.measureTime))
                                }
                                trend.timeList.push(idTime)
                                if (trend.dataColumn === 'WHR') {
                                    trend.lineData.push(this.toDecimal2(Number(item.v).toFixed(2), 2))
                                } else if (trend.dataColumn === 'METABOLICAGE') {
                                    if (item.v !== 0) {
                                        trend.lineData.push(item.v)
                                    }
                                } else {
                                    trend.lineData.push(this.toDecimal2(Number(item.v).toFixed(1), 1))
                                }
                                // trend.lineData.push(this.toDecimal2(Number(item.v).toFixed(1), 1));
                                trend.idValue = trend.trendData[0].m
                                // trend.min = trend.trendData[0].l;
                                trend.min = Math.min(...trend.lineData)
                                trend.max = Math.max(...trend.lineData)
                            })
                        })
                    }

                    // 关闭加载动画
                    that.$indicator.close()
                })
        },

        // 缓存对比日期和scanid
        saveStorage(date, scanId) {
            window.sessionStorage.setItem(
                'trendData',
                JSON.stringify({
                    date,
                    scanId
                })
            )
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
            this.saveStorage(this.selectTime, this.tcScanId)
            if (this.selectTime) {
                this.findBmMassQuotaTrend()
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

    .icon-date-picker {
        width: 13px;
        height: 13px;
    }
}
</style>
