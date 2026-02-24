<template>
    <!-- 分享 - 体测结果（身体围度/身体成分） -->
    <div class="share-result-data">
        <div class="title">
            <h5>{{ type === 'girth' ? '身体围度结果' : '身体成分结果' }}</h5>
            <div>
                <span>本次测量</span>
                <span v-if="tcScanId !== ''">对比{{ diffDateNum() }}天前</span>
            </div>
        </div>
        <template v-for="(item, index) in items">
            <div class="result-item" v-bind:key="index">
                <span class="item-name">{{ item.name }}</span>
                <div>
                    <span>{{ item.data }} {{ item.unit }}</span>
                    <span v-if="tcScanId !== ''">{{ item.diff }}</span>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { bmGirthContrasInfo, findBmMassQuotaInfos } from '@/assets/js/apolloGql.js'
import { toDecimal2 } from '@/assets/js/util.js'
export default {
    props: {
        // 对比扫描ID
        tcScanId: {
            type: String,
            default: ''
        },
        // 对比扫描日期
        tcScanDate: {
            type: String,
            default: ''
        },
        // 组件类型 girth 围度 body 体成分
        type: {
            type: String,
            default: 'girth'
        }
    },
    data() {
        return {
            // 本次扫描信息
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            items: {},
            massItems: [],
            girthItems: [
                {
                    name: '胸围',
                    dataColumn: 'bustGirth'
                },
                {
                    name: '腰围',
                    dataColumn: 'waistGirth'
                },
                {
                    name: '臀围',
                    dataColumn: 'hipGirth'
                },
                {
                    name: '左上臂围',
                    dataColumn: 'leftUpperArmGirth'
                },
                {
                    name: '右上臂围',
                    dataColumn: 'rightUpperArmGirth'
                },
                {
                    name: '左大腿围',
                    dataColumn: 'leftThighGirth'
                },
                {
                    name: '右大腿围',
                    dataColumn: 'rightThighGirth'
                },
                {
                    name: '左小腿围',
                    dataColumn: 'leftCalfGirth'
                },
                {
                    name: '右小腿围',
                    dataColumn: 'rightCalfGirth'
                }
            ]
        }
    },
    created() {
        if (this.type === 'girth') {
            this.getGirthContrasInfo()
        } else {
            this.getBodyContrasInfo()
        }
    },
    methods: {
        calculateComparativeData(massInfo, oldMassInfo, key) {
            if (key === 'ICW' || key === 'ECW') {
                if ((massInfo.l === 0 && massInfo.h === 0) || (oldMassInfo.l === 0 && oldMassInfo.h === 0)) {
                    // 细胞内外液 如果没有上下限 认为和无细胞内外液数据在比较 直接返回空
                    return '--'
                }
            }
            const diff = massInfo.v - oldMassInfo.v
            // 腰臀比保留2位 其他保留1位
            return key === 'WHR' ? toDecimal2(diff, 2) : toDecimal2(diff, 1)
        },
        // 获取体成分对比信息
        getBodyContrasInfo() {
            let that = this
            this.$apollo
                .query({
                    query: findBmMassQuotaInfos,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.modelInfo.scanId,
                        tcScanId: this.tcScanId
                    }
                })
                .then(res => {
                    const data = res.data.findBmMassQuotaInfos
                    if (data && data.code === 200) {
                        const massItems = data.data

                        this.$lodash.forEach(massItems, function (value, key) {
                            // 处理数据精度
                            const num =
                                value.dataColumn === 'WHR'
                                    ? toDecimal2(value.latestData.v, 2)
                                    : toDecimal2(value.latestData.v, 1)
                            let item = {
                                name: value.name,
                                data: num,
                                unit: value.unit
                            }
                            // 有对比数据
                            if (value.contrastData) {
                                item.diff = this.calculateComparativeData(value.latestData, value.contrastData, value.dataColumn)
                            } else {
                                // 无对比数据 及 BIA失败
                                item.diff = '--'
                            }

                            that.massItems.push(item)
                        })
                        this.items = this.massItems
                        this.$nextTick(() => {
                            this.$emit('loadOver', 'BodyContras')
                        })
                    } else {
                        this.dataLoadErr('findBmMassQuotaInfos')
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('findBmMassQuotaInfos')
                })
        },

        // 获取围度对比信息
        getGirthContrasInfo() {
            const that = this
            this.$apollo
                .query({
                    query: bmGirthContrasInfo,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.modelInfo.scanId,
                        tcScanId: this.tcScanId
                    }
                })
                .then(res => {
                    const data = res.data.bmGirthContrasInfo
                    if (data && data.code === 200) {
                        // 对比围度数据
                        const contrastBmGirth = data.data.contrastBmGirth
                        // 本次扫描围度数据
                        const latestBmGirth = data.data.latestBmGirth

                        this.$lodash.forEach(this.girthItems, function (value, key) {
                            that.girthItems[key].data = toDecimal2(latestBmGirth[value.dataColumn], 1)
                            that.girthItems[key].unit = 'cm'
                            // 有对比数据
                            if (contrastBmGirth) {
                                const diff = toDecimal2(
                                    latestBmGirth[value.dataColumn] - contrastBmGirth[value.dataColumn],
                                    1
                                )
                                that.girthItems[key].diff = diff > 0 ? `+${diff}` : diff
                            } else {
                                // 无对比数据 及 BDA失败
                                that.girthItems[key].diff = '--'
                            }
                        })
                        this.items = this.girthItems
                        this.$nextTick(() => {
                            this.$emit('loadOver', 'GirthContras')
                        })
                    } else {
                        this.dataLoadErr('bmGirthContrasInfo')
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('bmGirthContrasInfo')
                })
        },
        diffDateNum() {
            const tsDate = new Date(this.tcScanDate.replace(/\./g, '/'))
            const days = this.modelInfo.createTime - tsDate.getTime() / 1000
            return parseInt(days / (60 * 60 * 24), 10)
        },
        // 接口加载失败
        dataLoadErr(name) {
            console.error('bmData中接口加载失败！失败接口:', name)
            this.$nextTick(() => {
                this.$emit('loadError', 'bmData')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.share-result-data {
    width: 90%;
    margin: 0 auto;
    padding: 20px 0;
    text-align: left;

    .title {
        display: flex;
        align-items: middle;
        justify-content: space-between;
        margin-bottom: 10px;

        h5 {
            font-size: 4.7vw;
            font-weight: normal;
            color: rgba(0, 159, 232, 1);
            margin-left: 10vw;
        }

        div {
            span {
                font-size: 4vw;
                color: #ffffff;
                display: inline-block;

                &:first-of-type {
                    min-width: 25vw;
                    margin-right: 10vw;
                }

                &:last-of-type {
                    min-width: 25vw;
                    // margin-right: 20px;
                }
            }
        }
    }

    .result-item {
        display: flex;
        align-items: middle;
        justify-content: space-between;
        height: 45px;
        line-height: 45px;
        border-width: 0 0 1px 0;
        border-style: solid;
        border-color: #4a4a4a;

        .item-name {
            font-size: 4.4vw;
            color: #d7d7da;
            margin-left: 10vw;
        }

        div {
            span {
                font-size: 4.3vw;
                color: #8b8b8b;
                display: inline-block;

                &:first-of-type {
                    min-width: 25vw;
                    margin-right: 10vw;
                }

                &:last-of-type {
                    min-width: 25vw;
                    // margin-right: 20px;
                }
            }
        }
    }
}
</style>

