<template>
    <div ref="processBar" :class="[pWidth===1?'p300':'p205','processBar']" >
        <div :class="[isPure === 0 ? 'pg1' : nums.length === 5 ? 'pg2' : 'pg3', 'processbg',pWidth===1?'p300':'p205']">
            <!-- 设置灰块的宽度 -->
            <div class="processbgGray" :style="{ width: grayWidth + 'px' }"></div>
            <!-- 排列黑块的位置 -->
            <div v-for="(itm, inx) in evenNumbers" :key="'line' + inx"
                :style="{ left: -4 + inx * (barWidth / evenNumbers.length) + 'px' }" class="processVerLine"></div>
        </div>
        <ul :class="pWidth===1?'p300':'p205'" v-if="list.length==0">
            <!-- 排列数字的位置 -->
            <li v-for="(itm, inx) in evenNumbers" :key="inx + 'num'"
                :style="{ width: (barWidth) / (nums.length - 1) + 'px' }">
                <span>{{ itm }}</span><span v-if="inx == evenNumbers.length ">{{ nums[nums.length - 1] }}</span>
            </li>
        </ul>
        <ul v-else :class="pWidth===1?'p300':'p205'">
            <!-- 排列数字的位置 -->
            <li v-for="(itm, inx) in list" :key="inx + 'num'"
                :style="{ width: (barWidth) / (nums.length - 1) + 'px' }">
                <span class="size-style">{{ itm }}</span><span v-if="inx == evenNumbers.length ">{{ nums[nums.length - 1] }}</span>
            </li>
        </ul>


    </div>
</template>

<script>
export default {
    props: {
        // 中高低风险的临界数值数组
        nums: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        // 当前的风险数值
        currentNum: {
            type: Number,
            required: true,
            default: 0

        },
        // 组件的宽度 ，默认205
        pWidth: {
            type: Number,
            default: 205
        },
        // 是否纯色 0彩色过渡，1纯色
        isPure: {
            type: Number,
            default: 0
        },
        // 字体
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            // 宽度
            barWidth: 205,
        }
    },
    computed: {
        // 计算文字显示分段
        evenNumbers() {
            let temp = JSON.parse(JSON.stringify(this.nums))
            return temp.splice(0, temp.length - 1) // 返回过滤后的数组
        },
        // 根据传入的数据判断计算灰块宽度
        grayWidth() {
            // 计算每个方块的宽度
            let blockWidth = this.barWidth / (this.nums.length - 1)
            let grayWidth = 0

            for (let inx = 1; inx <= this.nums.length - 1; inx++) {
                if (this.nums[inx - 1] < this.currentNum && this.currentNum <= this.nums[inx]) {
                    // 设置基础的条宽度
                    grayWidth = (inx - 1) * blockWidth

                    // 当前区域每一个单位代表宽度
                    let tempWidth = blockWidth / (this.nums[inx] - this.nums[inx - 1]) * (this.currentNum - this.nums[inx - 1])

                    return this.barWidth - (tempWidth + grayWidth)
                }

                // 如果已经超过最大值,显示全彩色
                if (this.currentNum >= this.nums[this.nums.length - 1]) {
                    return 0
                }
            }

            console.log('default')

            return 0
        }
    },
    mounted() {
        this.$nextTick(() => {
            const rect = this.$refs.processBar.getBoundingClientRect()
            console.log('组件宽度:', rect.width)
            this.barWidth = rect.width
        })
    },
}
</script>

<style scoped lang="less">
.p300{
    width: 300px;
    position: relative;
}
.p205{
    width: 205px;
    position: relative;
}
.processBar {
    text-align: left;
    height: 6px;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin: 18px auto 0;

    // 彩色背景
    .pg1 {
        background: linear-gradient(to right, rgba(45, 160, 104, 1), rgba(234, 176, 77, 1), rgba(235, 119, 59, 1), rgba(166, 64, 69, 1));
    }

    // 纯色5格背景
    .pg2 {
        background: linear-gradient(to right,
                #2DA068 0 75px,
                #EAB04D 75px 150px,
                #EB773B 150px 225px,
                #FD3741 225px 300px);
    }

    // 纯色4格背景
    .pg3 {
        background: linear-gradient(to right,
                #2DA068 0 100px,
                #EAB04D 100px 200px,
                #FD3741 200px 300px);
    }

    .processbg {
        height: 6px;
        border-radius: 6px;
        margin-left: 1px;
        background-color: #8A90A2;
        position: absolute;
        // background: linear-gradient(to right, rgba(45, 160, 104, 1), rgba(234, 176, 77, 1), rgba(235, 119, 59, 1), rgba(166, 64, 69, 1));


        .processbgGray {
            width: 100%;
            height: 6px;
            border-radius: 0 6px 6px 0;
            position: absolute;
            background-color: #8A90A2;
            right: 0;
            top: 0px;
            // transition: all 1s ease-in-out;
        }
    }

    .processVerLine {
        height: 6px;
        width: 4px;
        background: rgba(8, 20, 59, 1);
        position: absolute;
        top: 0;

        &:nth-child(2) {
            left: 70px;
        }

        &:nth-child(3) {
            left: 140px;
        }

    }

    ul {
        display: flex;
        justify-content: space-between;
        margin-left: 1px;

        li {
            width: 70px;
            height: 16px;
            display: flex;
            justify-content: space-between;

            span {
                font-size: 12px;
                color: #8AA3BE;
                margin-top: 14px;
                line-height: 17px;
                width: 100%;
                height: 6px;

                &:nth-child(2) {
                    text-align: right;
                }
            }
            .size-style{
                margin-top: 12px!important;
                color: #666666!important;
                text-align:center;
                font-size:12px;
            }

        }
    }

}
</style>