<template>
    <!--趋势对比图-->
    <div :class="['body-composition-trend',$i18n.locale]">
        <div class="header-timer" style="background-image: none;background-color: #242444">
            <span @click.prevent="goBack()">
                <img src="@/assets/images/new-report/sidebar/arrow-left.png" class="menu-info" alt />
            </span>
            <div class="time">
                <span>{{ {'lang': $i18n.locale, 'time': selectTime} | getTime}} ~ </span>
                <span>{{ {'lang': $i18n.locale, 'time': lastSelectTime} | getTime}}</span>
            </div>
        </div>
        <!--折线图-->
        <div class="trend-defer-container">
            <!--<p v-if="!selectTime" class="no-trend-data">请选择趋势对比时间段!</p>-->
            <ul>
                <trend-charts
                    :key="index"
                    :idx="index"
                    :abbr="item.dataColumn"
                    :name="item.name"
                    :unit="item.unit"
                    :idValue="item.idValue"
                    :val="toDecimal2(Number(item.max / 3), 1)"
                    :times="item.timeList"
                    :lineData="item.lineData"
                    :min="item.min"
                    :max="item.max"
                    v-for="(item, index) in trendList"
                    v-show="index < trendList.length - 1"
                    v-if="item.timeList.length > 0"
                ></trend-charts>
            </ul>
        </div>
    </div>
</template>

<script>
/* eslint max-nested-callbacks: ["error", 4] */
import trendCharts from '@/components/trend/new-report/Charts'
import { findBmBIAScanTrueHistory, findBmMassQuotaTrend } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime, formatMonth, formatDay,  _toDecimal } from '@/assets/js/util.js'
import moment from 'moment'

export default {
    components: {
        trendCharts
    },
    filters: {
        getTime(value) {
            if (value.lang === 'ru-RU') {
                return moment(value.time).format('DD.MM.YYYY')
            } else {
                return value.time
            }
        }
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
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
            noHistoryData: false, // 无历史数据
            unit: window.localStorage.getItem('unit'),
            quotaInfo: ['WT', 'BFM', 'SM', 'TBW', 'PROTEIN', 'BMI', 'PBF', 'BMR']
        }
    },
    mounted() {
        // 开启加载动画
        // this.$indicator.open({
        //     spinnerType: 'fading-circle'
        // })
        // window.sessionStorage.removeItem('trendData')
        console.log('海外体成分趋势图' + JSON.stringify(this.$route.query))
        const measureType = Number(this.$route.query.measureType)
        this.findBmBIAScanTrueHistory(measureType)
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num * 0.45359237, digit)
        },
        goBack() {
            this.$router.go(-1)
        },
        // 获取用户体测BIA合成成功历史记录
        findBmBIAScanTrueHistory(measureType) {
            console.log(this.modelInfo.memberId)
            this.$apollo
                .query({
                    query: findBmBIAScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: this.modelInfo.createTime,
                        measureType: measureType
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
                    // eslint-disable-next-line no-unused-vars
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
                        this.trendList = clone(data.data).filter((item) => this.quotaInfo.indexOf(item.dataColumn) > -1)
                        this.trendList[this.trendList.length - 1].trendData.reverse()
                        this.trendList = [...this.trendList, this.trendList[this.trendList.length - 1]]
                        // eslint-disable-next-line no-unused-vars
                        this.trendList.forEach((trend, index) => {
                            trend.idValue = ''
                            trend.min = ''
                            trend.max = ''
                            trend.timeList = []
                            trend.lineData = []
                            trend.trendData.reverse()
                            this.$lodash.each(trend.trendData, (item, idx) => {
                                if (trend.dataColumn === 'PROTEIN') {
                                    if (item.v === 0) {
                                        return
                                    }
                                }
                                let idTime = ''
                                if (idx > 0) {
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

                                if (trend.name === '腰臀比') {
                                    trend.lineData.push(this.toDecimal2(Number(item.v).toFixed(2), 2))
                                } else {
                                    if (this.unit === 'metric' && trend.unit === 'kg') {
                                        trend.lineData.push(this.toDecimal(item.v, 1))
                                    } else {
                                        trend.lineData.push(this.toDecimal2(Number(item.v).toFixed(1), 1))
                                    }
                                }
                                // trend.lineData.push(this.toDecimal2(Number(item.v).toFixed(1), 1));
                                trend.idValue = trend.trendData[0].m
                                // trend.min = trend.trendData[0].l;
                                trend.min = Math.min(...trend.lineData)
                                trend.max = Math.max(...trend.lineData)
                            })
                            if (this.unit === 'imperial' && trend.unit === 'kg') {
                                trend.unit = 'lbs'
                            }
                            if (trend.dataColumn === 'BMI') {
                                trend.unit = 'kg/㎡'
                            }
                        })
                        // 有两个内脏脂肪等级，所以删除最后一个
                        this.trendList = this.trendList.slice(0, this.trendList.length - 1)
                        this.trendList.push(this.trendList[this.trendList.length - 1])
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
    height: 106vh;
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .menu-info {
        width: 24px;
        height: 24px;
    }
    .time {
        background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 0 0.01px;  /* 防止文本裁剪异常 */
    }
}
.ar-AR{
    direction: rtl;
    .header-timer{
        span{
            -webkit-transform: scaleX(-1);
        }
    }
}
</style>
