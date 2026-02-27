<!--
 * @Description: 待机页底部打印状态
 * @Author: WendyGao
 * @Date: 2022-02-21 20:23:31
 * @LastEditors: zhaoqianqian
 * @LastEditTime: 2022-10-27 16:20:08
-->
<template>
    <div class="bottom-info">
        <p class="print-info">
            <!-- 关闭打印不显示 -->
            <template v-if="settingInfo.printMode !== 0">
                <!-- 打印机异常 -->
                <template v-if="totalPrintStatus.indexOf(7) > -1 || external.printer === 2">{{
                    $t('home.print-info.msg0')
                }}</template>
                <!-- 打印请求超时、打印请求失败 -->
                <template v-else-if="totalPrintStatus.indexOf(3) > -1 || totalPrintStatus.indexOf(8) > -1">
                    <i18n path="home.print-info.msg1">
                        <i class="iconfont icon-print" place="icon"></i>
                    </i18n>
                </template>
                <!-- 生成中，打印中，打印排队中、用户注册中 -->
                <template v-else-if="printWaitNum > 0">
                    <i18n path="home.print-info.msg2">
                        <span place="num">{{ printWaitNum }}</span>
                        <i place="icon" class="iconfont icon-print"></i>
                    </i18n>
                </template>
                <!-- 无生成中，打印中，打印排队中、用户注册中、打印请求超时、打印请求失败、打印机异常时 -->
                <template v-else>
                    <i18n path="home.print-info.msg3">
                        <i class="iconfont icon-print" place="icon"></i>
                    </i18n>
                </template>
            </template>
        </p>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'PrintInfo',
    computed: {
        ...mapGetters(['settingInfo', 'printQueue', 'external']),
        // 包含的打印机状态
        totalPrintStatus() {
            let statusArray = []
            // 暂时未用到
            this.printQueue.forEach((v) => {
                statusArray.push(v.statusCode)
            })

            window.logger.info(JSON.stringify(this.external), '-----------', statusArray)
            return statusArray
        },
        // 处于生成中，打印中，打印排队中、用户注册中个数
        printWaitNum() {
            let resultNum = 0
            let repeatPrintObj = this.getRepeatNum(this.totalPrintStatus)
            if (this.totalPrintStatus.indexOf(0) > -1) {
                resultNum = repeatPrintObj[0]
            } else if (this.totalPrintStatus.indexOf(1) > -1) {
                resultNum = repeatPrintObj[1]
            } else if (this.totalPrintStatus.indexOf(4) > -1) {
                resultNum = repeatPrintObj[4]
            }
            return resultNum
        }
    },
    methods: {
        getRepeatNum(arr) {
            return arr.reduce(function (prev, next) {
                prev[next] = prev[next] + 1 || 1
                return prev
            }, {})
        }
    }
}
</script>
<style lang="less" scoped>
.bottom-info {
    .print-info {
        font-size: 24px;
        font-family: OPPOSansM, OPPOSans;
        font-weight: normal;
        color: #999999;
        line-height: 24px;
        position: absolute;
        bottom: 0;
        padding-left: 60px;
        .icon-print {
            content: '\e609';
            display: inline-block;
            font-size: 24px;
        }
        span {
            font-size: 24px;
        }

        i {
            font-size: 30px;
        }
    }
}
</style>
