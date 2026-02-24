<!--
 * @Description:
 * @Author: fanyunbo
 * @Date: 2022-07-07 15:53:46
 * @LastEditTime: 2026-01-29 10:59:25
 * @LastEditors: liyunfei 3090384495@qq.com
 * @Reference:
-->
<template>
    <div class="date-select">
        <div :class="['date-select-first', isDeviceReport ? 'isDeviceReport' : '']" @click="selectDate()">
            <img v-if="athlete && type == 1" class="athlete-icon" src="@/assets/images/athlete2.svg"/>{{ createDate }}<img src="@/assets/images/new-report/arrow-down-s-line.svg" alt="" class="el-icon-arrow-down">
        </div>
        <div class="date-select-img">
            <img src="@/assets/images/new-report/path.png" alt="">
        </div>
        <div :class="['date-select-second', isDeviceReport ? 'isDeviceReport' : '']">
            {{ isCreateTime }} (本次)
        </div>
        <div>
            <!-- 历史选择弹窗 -->
            <div class="trend-dialog-overlay" v-if="isDeviceReport && showHistorySelector" @click="closeHistorySelector" @wheel.prevent @touchmove.prevent @scroll.prevent>
                <transition name="dialog-zoom">
                    <div class="history-dialog" v-if="isDeviceReport && showHistorySelector" @click.stop @wheel.stop @touchmove.stop @scroll.stop>
                        <div class="history-dialog-header">
                            <div class="history-dialog-title">
                                <span>选择历史记录</span>
                            </div>
                            <!-- <div class="history-dialog-close" @click="closeHistorySelector">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" stroke="#787B8F" stroke-width="1.5" />
                                    <path d="M8 8L16 16M16 8L8 16" stroke="#787B8F" stroke-width="1.5"
                                        stroke-linecap="round" />
                                </svg>
                            </div> -->
                        </div>
                        <div class="history-dialog-content">
                            <div class="history-item" v-for="(item, index) in filteredHistoryList" :key="index"
                                :class="{ 'active': item.scanId === tcScanId }" @click="selectHistory(item)">
                                <span>{{ formatHistoryTime(item.createTime) }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <!-- <trend-time :shortType="type" :isShow="show" :defaultDate="defaultDate" @isSure="onShow"></trend-time> -->
             <trend-time
                v-if="!isDeviceReport"
                :isShow="show"
                :defaultDate="defaultDate"
                :shortType="type"
                :date-map="dateMap"
                @isSure="onShow"
                @confirm="onConfirm"
            />
        </div>
    </div>
</template>
<script>
import TrendTime from '@/components/time/new-report/Trend'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
    components: {
        TrendTime,
    },
    props: {
        isCreateTime: String,
        type: Number,
        scanId: String
    },
    data() {
        return {
            // createDate: '无记录',
            // show: false,
            // defaultDate: '',
            show: false,
            createDate: '无记录',
            defaultDate: '',
            isDeviceReport: sessionStorage.getItem('isDeviceReport'),
            lastScanId: null, // 防止重复 emit
            showHistorySelector: false,
            tcScanId: '',
            athlete: 0,
        }
    },
    computed: {
        ...mapState(['dataArray', 'dataArrayMass', 'waistdataArray']),

        // 过滤后的历史记录列表（排除当前扫描）
        filteredHistoryList() {
            if (this.type === 1) return this.dataArrayMass
            if (this.type === 3) return this.waistdataArray
            return this.dataArray
            // return this.historyList.filter(h => h.scanId !== this.scanId)
        },
        /**
            * 当前使用的数据源
         */
        currentList() {
            if (this.type === 1) return this.dataArrayMass
            if (this.type === 3) return this.waistdataArray
            return this.dataArray
        },
        /**
         * 🔥 预处理成 Map（父组件只算一次）
         * key: YYYY-MM-DD
         */
        dateMap() {
            const map = new Map()
            const list = this.currentList || []

            list.forEach(item => {
                let key = ''

                if (this.type === 3 && item.createDate) {
                    key = item.createDate.slice(0, 10)
                } else if (item.createTime) {
                    key = dayjs(item.createTime * 1000).format('YYYY-MM-DD')
                }

                if (key) {
                    map.set(key, item)
                }
            })

            return map
        },

        /**
         * 🔥 计算对比结果（无副作用）
         */
        contrastResult() {
            if (!this.dateMap.size) {
                return {
                    createDate: '无记录',
                    defaultDate: this.isCreateTime,
                    scanId: null
                }
            }

            const currentKey = dayjs(this.isCreateTime).format('YYYY-MM-DD')
            const keys = Array.from(this.dateMap.keys())
            const index = keys.indexOf(currentKey)

            if (index === -1 || index === keys.length - 1) {
                return {
                createDate: '无记录',
                defaultDate: this.isCreateTime,
                scanId: null
                }
            }

            const nextKey = keys[index + 1]
            const nextItem = this.dateMap.get(nextKey)
            return {
                createDate: this.type === 3 && nextItem.createDate.length > 18
                    ? dayjs(nextItem.createDate).format('YYYY/MM/DD HH:mm:ss')
                    : dayjs(nextKey).format('YYYY/MM/DD'),
                defaultDate: dayjs(nextKey).format('YYYY/MM/DD'),
                scanId: nextItem.scanId,
                athlete: nextItem.athlete // 设置 athlete 的值
            }
        }
    },
    watch: {
        // dataArray: {
        //     handler() {
        //         this.dataUpdate()
        //     },
        //     deep: true,
        // // immediate: true
        // },
        // waistdataArray: {
        //     handler() {
        //         this.dataUpdate()
        //     },
        //     deep: true,
        // // immediate: true
        // },
         /**
         * 🔥 只 watch 一个 computed（轻量）
         */
        contrastResult: {
            immediate: true,
            handler(val) {
                this.createDate = val.createDate
                this.athlete = val.athlete // 设置 athlete 的值
                this.defaultDate = val.defaultDate
                this.safeEmit(val.scanId)
            },
        }
    },
    mounted() {
        // 提成分调用
        // if (this.type === 1) {
        //     this.dataUpdate()
        // }
        // this.initTrendChart()
    },
    methods: {
        // 选择历史记录
        selectHistory(item) {
            if (item.scanId === this.tcScanId) {
                return // 不能选择当前的
            }
            this.tcScanId = item.scanId
            this.createDate = this.formatDateTime(new Date(item.createTime * 1000))
            this.closeHistorySelector()
            // this.createDate = contrastTime
            // 重新获取围度数据
            this.safeEmit(item.scanId)
            this.athlete = item.athlete // 设置 athlete 的值
        },
        // 格式化历史时间
        formatHistoryTime(timestamp) {
            if (!timestamp) return '--'
            return this.formatDateTime(new Date(timestamp * 1000))
        },
        // 格式化日期时间
        formatDateTime(date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            // const hours = String(date.getHours()).padStart(2, '0')
            // const minutes = String(date.getMinutes()).padStart(2, '0')
            // const seconds = String(date.getSeconds()).padStart(2, '0')
            return `${year}-${month}-${day}`
        },
         // 关闭历史选择器
        closeHistorySelector() {
            // 检查弹窗是否已打开超过0.5秒，防止误触
            const timeSinceOpen = Date.now() - this.historySelectorOpenTime
            if (timeSinceOpen < 500) {
                return
            }
            this.showHistorySelector = false
            // 恢复body滚动
            document.body.style.overflow = ''
        },
        selectDate() {
            this.show = true
            this.showHistorySelector = true
        },
        /**
             * 子组件选择日期回调
         */
        onConfirm(item) {
            this.show = false
            if (!item) return

            const dateStr =
                this.type === 3 && item.createDate.length > 18
                ? dayjs(item.createDate).format('YYYY/MM/DD HH:mm:ss')
                : dayjs(item.createTime * 1000).format('YYYY/MM/DD')

            this.createDate = dateStr
            this.defaultDate = dateStr
            this.safeEmit(item.scanId)
            this.athlete = item.athlete // 设置 athlete 的值
        },

        /**
         *  emit 防止死循环
         */
        safeEmit(scanId) {
            console.log(this.lastScanId, scanId, 888888)
            if (this.lastScanId === scanId && this.lastScanId !== null) return
            this.lastScanId = scanId
            this.$emit('girthContras', scanId)
        },
        onShow(item) {
            this.show = false
            // if (!data && !scanId) {
            //     return
            // }
            // this.createDate = data
            // this.defaultDate = this.createDate
            // if (data && scanId) {
            //     this.$emit('girthContras', scanId)
            // }
            this.athlete = item.athlete
        }
        // dataUpdate() {
        //     let newDate
        //     if (this.dataArray.length >= 1 && this.type === 2) {
        //         newDate = this.dataArray
        //     } else if (this.dataArrayMass.length >= 1 && this.type === 1) {
        //         newDate = this.dataArrayMass
        //     } else if (this.waistdataArray.length >= 1 && this.type === 3) {
        //         newDate = this.waistdataArray
        //     }
        //     if (newDate && newDate.length >= 1) {
        //         // let i = 1
        //         // this.createDate = this.$moment(newDate[i].createTime * 1000).format("YYYY/MM/DD")
        //         // if (this.createDate == this.isCreateTime) {
        //         //     i = 0
        //         //     this.createDate = this.$moment(newDate[i].createTime * 1000).format("YYYY/MM/DD")
        //         // }
        //         // this.$emit('girthContras', newDate[i].scanId)
        //         let index = null
        //         for (let i = 0; i < newDate.length; i++) {
        //             this.createDate = this.$moment(newDate[i].createTime * 1000).format('YYYY/MM/DD')
        //             if (this.type === 3 && newDate[i].createTime === null) {
        //                 this.createDate = newDate[i].createDate
        //             }
        //             if (this.createDate === this.isCreateTime) {
        //                 index = i
        //                 break
        //             }
        //         }
        //         console.log(index, newDate.length, '>>>>>>>>>>>>>>>>>>>index', newDate)
        //         if (index === null || index === newDate.length - 1) {
        //             this.createDate = '无记录'
        //             this.defaultDate = this.isCreateTime
        //             this.$emit('girthContras', null)
        //         } else {
        //             this.createDate = this.$moment(newDate[index + 1].createTime * 1000).format('YYYY/MM/DD')
        //             if (this.type === 3 && newDate[index + 1].createDate.length > 18) {
        //                 this.createDate = this.$moment(newDate[index + 1].createDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss')
        //             }
        //             this.defaultDate = this.createDate
        //             this.$emit('girthContras', newDate[index + 1].scanId)
        //         }
        //     } else {
        //         this.defaultDate = this.isCreateTime
        //         this.$emit('girthContras', null)
        //     }
        // },
        // selectDate() {
        //     this.show = true
        // },
    }
}
</script>
<style scoped lang="less">
.date-select {
    position: relative;
    z-index: 8;
    display: flex;
    line-height: 58px;

    .date-select-first {
        width: 45%;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 0 0.01px;  /* 防止文本裁剪异常 */

        .el-icon-arrow-down {
            margin-left: 8px;
            width: 10px;
            height: 5.88px;
        }
    }

    .date-select-img {
        width: 10%;

        img {
            width: 18px;
            height: 16px;
        }
    }

    .date-select-second {
        width: 45%;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8AA3BE;
    }
    .isDeviceReport{
        font-family: inherit !important;
    }
}

.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}

.el-icon-arrow-down {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0 0.01px;  /* 防止文本裁剪异常 */
}
// 弹窗相关样式
    .trend-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
         // 历史选择弹窗
    .history-dialog {
        margin: 0 20px;
        width: 400px;
        max-height: 60vh;
        background: #262628;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 24px 32px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        // 禁止文本选择，防止连续点击时选中文本
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        &-title {
            span {
                font-size: 18px;
                color: #E5E6EB;
            }
        }

        &-close {
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
            // 禁止文本选择，防止点击时选中元素
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            &:hover {
                opacity: 0.7;
            }
        }

        &-content {
            overflow-y: auto;
            flex: 1;

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 2px;
            }
        }

        .history-item {
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
            margin-bottom: 8px;
            // 禁止文本选择，防止连续点击时选中文本
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            span {
                font-size: 15px;
                color: #C7C7CC;
            }

            &:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            &.active {
                background: rgba(99, 102, 241, 0.2);

                span {
                    color: #818CF8;
                }
            }
        }
    }
    }
.athlete-icon{
    width: 20px;
    height: 20px;
    position: relative;
    top: 5px;
}
</style>
