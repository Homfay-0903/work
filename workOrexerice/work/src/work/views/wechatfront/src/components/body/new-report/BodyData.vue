<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-06-30 17:44:21
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-05 22:24:00
-->
<template>
    <!--身体成分下半部分-->
    <div>
        <div class="segment-fat-data">
            <div class="thermal-title">
                <!-- <span>{{ tcScanId }}</span> -->
            </div>
            <div v-for="(item, index) in newDataArray" :key="index" v-if="showItem(item)">
                <bodydata-item :chart="item" :index="index"
                    :styleChildren="styleContent"></bodydata-item>
            </div>
        </div>
    </div>
</template>
<script>
import BodydataItem from '@/components/common/new-report/BodyDataItem'
import { findBmMassQuotaInfos, findBmBIAScanTrueHistory, findBmMassMeasureType } from '@/assets/js/apolloGql.js'
import { clone, formatDate, formatTime, _toDecimal } from '@/assets/js/util.js'
import { mapState } from 'vuex'
// import { E_M30_REPORT_ITEM } from '@/types/device.js'
export default {
    components: {
        BodydataItem
    },
    props: {
        massInfo: Object,
        styleContent: Number,
        tcScanId: String,
    },
    emits: ['measureType'],
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            ytb: false,
            select: false,
            selectTime: '',
            lastSelectTime: '',
            timePopupVisible: false,
            timeList: [],
            scanId: '',

            originDate: '', // 初始日期
            isMoreTime: true,
            unit: window.localStorage.getItem('unit'),
            newDataArray: [],
        }
    },
    computed: {
        ...mapState(['composition', 'historyScanId', 'historyData']),
    },
    watch: {
        composition: {
            // eslint-disable-next-line no-unused-vars
            handler: function (val) {
                this.newDataArray = val
                console.log(this.newDataArray)
            },
            deep: true,
        },
        tcScanId: {
            deep: true,
            handler: function (val) {
                console.log(`scanId变化${val}`)
                this.bmMassContrasInfo()
            },
        }

    },
    mounted() {
        console.log('体成分内容展示')
        if (this.historyScanId) {
            this.scanId = this.historyScanId
        } else {
            this.scanId = this.modelInfo.scanId
        }
        let compareDataStorage = window.sessionStorage.getItem('compareData')
        let savedCompareData = compareDataStorage ? JSON.parse(compareDataStorage) : null
        if (savedCompareData) {
            this.selectTime = savedCompareData.date || ''
            this.defaultScanId = savedCompareData.scanId || ''
        }
        // 新用户没有历史数据时调用
        this.findBmMassMeasureType()
        // this.$hmt.trackPageview('/tab/body')
    },
    methods: {
        isSpecial(item) {
            return true
        },
        isStatus(item) {
            return item.dataColumn === 'ICW' || item.dataColumn === 'ECW'
        },
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        // 获取体成分计算方式
        findBmMassMeasureType() {
            this.$apollo
                .query({
                    query: findBmMassMeasureType,
                    variables: {
                        scanId: this.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBmMassMeasureType
                    if (data.code === 200) {
                        this.$emit('measureType', data.data)
                        this.findBmBIAScanTrueHistory(data.data)
                    }
                })
        },
        // 获取用户体测BIA合成成功历史记录
        findBmBIAScanTrueHistory(measureType) {
            console.log('切换历史数据')
            this.$apollo
                .query({
                    query: findBmBIAScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: this.massInfo.createTime,
                        measureType: measureType
                    }
                })
                .then(res => {
                    const data = res.data.findBmBIAScanTrueHistory
                    console.log(`获取体成分时间列表${data.code}`)
                    if (data.code === 200) {
                        let historyDate = []
                        for (let index = 0; index < data.data.length; index++) {
                            for (let aa = 0; aa < data.data[index].data.length; aa++) {
                                historyDate.push(data.data[index].data[aa])
                            }
                        }
                        this.$store.commit('setDataArrayMass', historyDate)
                        this.timeList = clone(data.data)
                        // eslint-disable-next-line no-unused-vars
                        this.timeList.forEach((time, index) => {
                            time.options = []
                            // eslint-disable-next-line no-unused-vars
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
                        if (this.scanId === '') {
                            this.scanId = lastData[lastDataLen - 1].scanId
                        }

                        window.localStorage.setItem('BmLastScanId', this.scanId)

                        // 最后一组时间有对比
                        if (lastDataLen >= 2) {
                            // 是否存在缓存数据
                            this.isDefaultDate(lastData)
                            lastData[lastDataLen - 2].isChecked = true
                            this.defaultScanId = lastData[lastDataLen - 2].scanId
                            this.selectTime = lastData[lastDataLen - 2].value
                            // 上一组时间判断
                        } else if (timeLen >= 2) {
                            let preData = this.timeList[timeLen - 2].options
                            // 是否存在缓存数据
                            this.isDefaultDate(preData)
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
        isDefaultDate(data) {
            if (this.selectTime && this.defaultScanId) {
                if (this.initExistDate(data)) {
                    this.bmMassContrasInfo()
                    return
                }
            }
        },
        // 缓存中有数据，直接从缓存拉去
        // eslint-disable-next-line no-unused-vars
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
        bmMassContrasInfo() {
            let oldScanId = ''
            if (this.tcScanId && this.tcScanId.length > 0) {
                oldScanId = this.tcScanId
            }
            this.$apollo
                .query({
                    query: findBmMassQuotaInfos,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.scanId,
                        tcScanId: oldScanId,
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBmMassQuotaInfos
                    if (data.code === 200) {
                        let newArray = clone(data.data)
                        // newArray = [...data.data, data.data[data.data.length - 1]];
                        newArray.forEach(item => {
                            if (item.contrastData) {
                                item.contrast = item.contrastData.v
                            } else {
                                item.contrast = 0
                            }
                            if (item.latestData) item.latestData.v = this.toDecimal(item.latestData.v, 1)
                            if (item.contrastData) {
                                item.contrastData.v = this.toDecimal(item.contrastData.v, 1)
                                item.contrast = item.contrastData.v || 0
                            }
                            item.lates = item.latestData.v || 0
                            if (item.dataColumn === 'BMI') {
                                item.unit = 'kg/㎡'
                            }
                            item.diff = item.lates - item.contrast
                            if (item.dataColumn === 'PROTEIN' && (item.lates <= 0 || item.contrast <= 0)) {
                                // 蛋白质如果出现数值未0  diff强制为0
                                item.diff = 0
                            }
                        })
                        console.log(newArray)
                        this.$store.commit('setComposition', newArray)
                    }
                })
        },
        showItem(item) {
            if (item.dataColumn === 'METABOLICAGE' || item.dataColumn === 'vaGrade') {
                // 仅pro3 pro5显示
                if (this.scanId.slice(0, 2) === 'M7' || this.scanId.slice(0, 2) === 'N7') {
                    return true
                }
                return false
            }
            if (item.dataColumn === 'PROTEIN') {
                // 仅pro3 pro5显示
                return item.lates > 0
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

