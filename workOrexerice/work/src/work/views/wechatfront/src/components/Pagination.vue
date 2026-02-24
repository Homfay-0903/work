<!--
 * @Descripttion: 页码
 * @Author: gaoyuanyuan
 * @Date: 2020-02-27 17:58:10
 * @LastEditors: gaoyuanyuan
 * @LastEditTime: 2020-02-28 11:05:59
 -->
<template>
    <svg class="pagination" width="2297px" height="48px" viewBox="0 0 2297 48" version="1.1"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="打印报告" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Group">
                <polygon id="Path" fill="#009FE8" points="0 48 0 42 1828.09 42 1863.72307 0 2297 0 2256.27693 48">
                </polygon>
                <text id="360°全维度体测报告-01" font-size="32" font-weight="400" fill="#FFFFFF">
                    <tspan x="1865" y="35">360°全维度体测报告&ensp; &ensp; 0{{ newNum }}</tspan>
                </text>
            </g>
        </g>
    </svg>
</template>
<script>
export default {
    name: 'Pagination',
    props: {
        // 页码下标
        num: {
            type: Number,
            default: 1
        },
        ch: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            newNum: 0,
        }
    },
    mounted() {
        if (this.ch) {
            this.newNum = this.ch()
        }
    },
}
</script>
<style lang="less" scoped>
.pagination {
    position: absolute;
    width: 883px;
    bottom: 0px;
}
</style>
