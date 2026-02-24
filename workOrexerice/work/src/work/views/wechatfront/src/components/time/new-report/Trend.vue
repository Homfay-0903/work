<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-06-30 16:05:19
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-17 15:24:17
-->
<template>
    <!--选择时间-->
    <div>
        <!-- <van-calendar :default-date="new Date(defaultDate)" :min-date="minDate" :max-date="maxDate" :show-mark="false"
            :title="$t('mass.contrastReport')" v-model="showTable" :formatter="formatter" @confirm="onConfirm"
            :confirmText="$t('sidebar.btn.confirmBtn')"></van-calendar> -->
          <van-calendar
            v-model="showTable"
            :default-date="new Date(defaultDate)"
            :min-date="minDate"
            :max-date="maxDate"
            :show-mark="false"
            :title="$t('mass.contrastReport')"
            :formatter="formatter"
            :confirm-text="$t('sidebar.btn.confirmBtn')"
            @confirm="onConfirm"
            />
    </div>
</template>
<script>
// import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
    props: {
        isShow: Boolean,
        defaultDate: String,
        shortType: Number,
        dateMap: {
            type: Map,
            required: true
        },
    },
    data() {
        return {
            minDate: new Date(2010, 0, 1),
            maxDate: new Date(2099, 0, 31),
            // dateTimeArray: []
        }
    },
    computed: {
    //     ...mapState(['dataArray', 'dataArrayMass', 'waistdataArray']),
        showTable: {
            get() {
                return this.isShow
            },
            set() {
                this.$emit('isSure')
            }
        }
    },
    methods: {
        // onConfirm(date) {
        //     let flag = true
        //     for (let index = 0; index < this.dateTimeArray.length; index++) {
        //         if (this.dateTimeArray[index].createDate === this.$moment(date).format('YYYY-MM-DD') || (this.$moment(this.dateTimeArray[index].createDate).format('YYYY-MM-DD') === this.$moment(date).format('YYYY-MM-DD') && this.shortType === 3)) {
        //             if (flag && (this.$moment(this.dateTimeArray[index].createDate).format('YYYY-MM-DD') === this.$moment(date).format('YYYY-MM-DD') && this.dateTimeArray[index].createDate.length > 18 && this.shortType === 3)) {
        //                 this.$emit('isSure', this.dateTimeArray[index].scanId, this.$moment(this.dateTimeArray[index].createDate).format('YYYY/MM/DD HH:mm:ss'))
        //                 flag = false
        //             } else if (flag && !(this.shortType === 3 && index === 0 && this.dateTimeArray[1].createDate.length > 18)) {
        //                 this.$emit('isSure', this.dateTimeArray[index].scanId, this.$moment(date).format('YYYY/MM/DD'))
        //                 flag = false
        //             }
        //         }
        //     }
        //     if (flag) {
        //         this.$toast(this.$t('mass.massFrame'))
        //     }
        //     // this.$emit('isSure', undefined, this.$moment(date).format("YYYY/MM/DD"))
        // },
        // formatter(day) {
        //     if (this.shortType === 1) {
        //         this.dateTimeArray = this.dataArrayMass
        //     } else if (this.shortType === 3) {
        //         this.dateTimeArray = this.waistdataArray
        //     } else {
        //         this.dateTimeArray = this.dataArray
        //     }
        //     const month = day.date.getMonth() + 1
        //     const date = day.date.getDate()
        //     const year = day.date.getYear()
        //     if (this.dateTimeArray.length !== 0) {
        //         for (let index = 0; index < this.dateTimeArray.length; index++) {
        //             const data = this.dateTimeArray[index].createDate.split('-')
        //             if (year + 1900 === parseInt(data[0], 10)) {
        //                 if (month === parseInt(data[1], 10)) {
        //                     if (date === parseInt(data[2], 10)) {
        //                         day.topInfo = ' '
        //                     }
        //                 }
        //             }
        //         }
        //     }

        //     return day
        // },

          /**
         * 🔥日历单元格渲染（O(1)）
         */
        formatter(day) {
            const key = dayjs(day.date).format('YYYY-MM-DD')

            if (this.dateMap.has(key)) {
                day.topInfo = ' '
            }

            return day
        },

        /**
         * 🔥 用户确认日期
         */
        onConfirm(date) {
            console.log('888888')
            const key = dayjs(date).format('YYYY-MM-DD')
            const item = this.dateMap.get(key)

            if (!item) {
                this.$toast(this.$t('mass.massFrame'))
                return
            }

            // 直接把 item 丢给父组件
            this.$emit('confirm', item)
        }
    },
}
</script>
<style lang="less" scoped>
/deep/.van-popup--bottom.van-popup--round {
    border-radius: 0px !important;
}

/deep/.van-calendar__header-title {
    color: #ffffff;
    background: #323161;
}

/deep/ .van-calendar__header-subtitle {
    background: #27284f;
    color: #8AA3BE;
}

/deep/ .van-calendar__weekdays {
    background: #27284f;
    color: #8AA3BE;
}

/deep/ .van-calendar__body {
    background: #27284d;
}

/deep/ .van-calendar__footer {
    background: #27284d;
}

/deep/ .van-button--danger {
    color: #000;
    background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
    border: none;
    padding: 0 0.01px;  /* 防止文本裁剪异常 */
}

/deep/ .van-button--round {
    border-radius: 4px;
}

/deep/ .van-calendar__day--multiple-selected {
    width: 32px;
    height: 32px;
    border: 1px solid;
    border-image: linear-gradient(90deg, rgba(0, 227, 201, 1), rgba(0, 159, 232, 1)) 1 1;
}

/deep/ .van-calendar__day--end {
    border-image: linear-gradient(90deg, rgba(0, 227, 201, 1), rgba(0, 159, 232, 1)) 1 1;
}

/deep/ .van-calendar__days,
.van-calendar__month-title {
    color: #8AA3BE;
}

/deep/ .van-calendar__month-title {
    color: #8AA3BE;
    font-weight: bold;
}

/deep/ .van-calendar__top-info {
    background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border: 2px solid #00E3C9;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    // position: relative;
    left: 12px;
    top: 17px
}

/deep/ .van-calendar__selected-day {
    background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    // .van-calendar__top-info{
    //     display: none
    // }
}
</style>
