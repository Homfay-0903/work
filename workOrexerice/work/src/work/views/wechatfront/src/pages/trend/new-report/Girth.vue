<template>
    <!--趋势对比图-->
    <div class="body-composition-trend">
        <div class="header-timer" style="background-image: none;background-color: #242444">
            <span @click.prevent="goBack()">
                <img src="@/assets/images/new-report/sidebar/arrow-left.png" class="menu-info" alt />
            </span>
            <div class="time">
                <span>{{ selectTime }} ~</span>
                <span>{{ lastSelectTime }}</span>
            </div>
        </div>
        <!--折线图-->
        <div class="trend-defer-container">
            <!--<p v-if="!selectTime" class="no-trend-data">请选择趋势对比时间段!</p>-->
            <ul>
                <trend-charts :key="index" :idx="index" :abbr="item.dataColumn" :name="item.name" :unit="item.unit"
                    :idValue="item.idValue" :val="toDecimal2(Number(item.max / 3), 1)" :times="item.timeList"
                    :lineData="item.lineData" :min="item.min ? item.min : 1" :max="item.max"
                    v-for="(item, index) in girthTrendList" v-show="index < girthTrendList.length - 1" v-if="item.timeList.length > 0"></trend-charts>
            </ul>
        </div>
    </div>
</template>

<script>
/* eslint max-nested-callbacks: ["error", 4] */
import trendCharts from '@/components/trend/new-report/Charts'
import { findBsScanTrueHistory, findBmGirthTrend } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime, formatMonth, formatDay, _toDecimal } from '@/assets/js/util.js'

export default {
    components: {
        trendCharts
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            unit: window.localStorage.getItem('unit'),
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
                    name: this.$t('girth.tpl[0].title'),
                    dataColumn: 'neckGirth',
                    unit: 'cm',
                    order: 1
                },
                {
                    name: this.$t('girth.tpl[1].title'),
                    dataColumn: 'leftUpperArmGirth',
                    unit: 'cm',
                    order: 2
                },
                {
                    name: this.$t('girth.tpl[2].title'),
                    dataColumn: 'rightUpperArmGirth',
                    unit: 'cm',
                    order: 3
                },
                {
                    name: this.$t('girth.tpl[3].title'),
                    dataColumn: 'bustGirth',
                    unit: 'cm',
                    order: 4
                },
                {
                    name: this.$t('girth.tpl[4].title'),
                    dataColumn: 'waistGirth',
                    unit: 'cm',
                    order: 5
                },
                {
                    name: this.$t('girth.tpl[5].title'),
                    dataColumn: 'midWaistGirth',
                    unit: 'cm',
                    order: 6
                },
                {
                    name: '低腰围',
                    dataColumn: 'lowWaistGirth',
                    unit: 'cm'
                },
                {
                    name: this.$t('girth.tpl[6].title'),
                    dataColumn: 'hipGirth',
                    unit: 'cm',
                    order: 7
                },
                {
                    name: this.$t('girth.tpl[7].title'),
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
                    name: this.$t('girth.tpl[9].title'),
                    dataColumn: 'leftMinThighGirth',
                    unit: 'cm',
                    order: 10
                },
                {
                    name: this.$t('girth.tpl[10].title'),
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
                    name: this.$t('girth.tpl[12].title'),
                    dataColumn: 'rightMinThighGirth',
                    unit: 'cm',
                    order: 13
                },
                {
                    name: this.$t('girth.tpl[13].title'),
                    dataColumn: 'leftCalfGirth',
                    unit: 'cm',
                    order: 14
                },
                {
                    name: this.$t('girth.tpl[14].title'),
                    dataColumn: 'rightCalfGirth',
                    unit: 'cm',
                    order: 15
                },
                {
                    name: this.$t('girth.tpl[14].title'),
                    dataColumn: 'rightCalfGirth',
                    unit: 'cm',
                    order: 15
                }
            ],
        }
    },
    mounted() {
        // 开启加载动画
        this.$indicator.open({
            spinnerType: 'fading-circle'
        })
        this.findBsScanTrueHistory()
        console.log('加载页面')
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num * 2.54, digit)
        },
        goBack() {
            this.$router.go(-1)
        },
        // 获取用户体态合成成功历史记录
        findBsScanTrueHistory() {
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
                        // eslint-disable-next-line no-unused-vars
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
                                        if (girth.value === 0 || girth.value === null) {
                                            return
                                        }
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
                                            if (this.unit === 'metric') {
                                                trend.lineData.unshift(this.toDecimal(Number(girth.value).toFixed(1), 1))
                                                trend.girthMinList.unshift(girth.value)
                                            } else {
                                                trend.lineData.unshift(this.toDecimal2(Number(girth.value).toFixed(1), 1))
                                                trend.girthMinList.unshift(girth.value)

                                            }
                                        }
                                        trend.timeList.unshift(idTime)
                                        trend.idValue = girth.value
                                        // trend.min = trend.trendData[0].l;
                                        trend.max = Math.max(...trend.lineData)
                                        trend.min = Math.min(...trend.girthMinList)
                                    })
                                }
                            })
                            if (this.unit === 'imperial') {
                                trend.unit = 'Inches'
                            }
                        })
                    }
                    this.girthTrendList = this.trendList
                    console.log('趋势对比数据', this.girthTrendList)
                    if (window.localStorage.getItem('healthPackageEnable') === '2') {
                        const keysToRemove = [
                            'waistGirth',
                            'lowWaistGirth',
                            'midWaistGirth',
                            'neckGirth'
                        ]
                        this.girthTrendList = this.girthTrendList.filter((item) => !keysToRemove.includes(item.dataColumn))
                    }
                    if (window.sessionStorage.getItem('girthShowNumber') === '0') {
                        const keysToRemove = [
                            'neckGirth',
                            'lowWaistGirth',
                            'midWaistGirth',
                            'leftMinThighGirth',
                            'rightMinThighGirth',
                        ]
                        this.girthTrendList = this.girthTrendList.filter((item) => !keysToRemove.includes(item.dataColumn))
                    }
                    // 关闭加载动画
                    that.$indicator.close()
                    this.popupVisible = false
                })
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
</style>
