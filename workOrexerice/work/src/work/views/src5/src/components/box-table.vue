<!--
 * @Author: Don 18137802527@163.com
 * @Date: 2024-04-18 23:41:36
 * @LastEditors: liutq
 * @LastEditTime: 2024-05-23 11:37:12
 * @FilePath: \vr-pro3-report-frontend\src\components\box-table.vue
 * @Description:
-->
<template>
    <div class="body-table tbody-line">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr v-if="title">
                            <th colspan="2" style="text-align: left; padding-left: 42px;"><span class="top-tips">当前阶段: <span class="content-tips">{{ title }}</span></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, ide) in contentList" :key="ide">
                            <td style="border-right: none;width: 50%;">
                                <span style="font-size:17px" class="left-key">{{ item.title }}</span>
                            </td>

                            <td style="border-left: none;">
                                <span class="right-value">{{ item.value }}</span>
                            </td>
                        </tr>
                        <tr v-for="(item, ide) in contentList1" :key="ide">
                            <td style="border-right: none;width: 50%;">
                                <span class="left-key">{{ item.title }}</span>
                            </td>

                            <td style="border-left: none;">
                                <span class="right-value">{{ item.value }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
</template>
<script>
export default {
    name: 'BoxTable',
    props: {
        title: String,
        contentList: Array,
        contentList1: Array
    },
}
</script>
<style scoped lang="less" media="all">
.body-table {
        position: relative;

        .extra-bone {
            position: absolute;
            z-index: 1;
            width: 100%;
            bottom: 0;
            margin: 0;
            color: #5e687b;
            text-align: start;
            text-indent: 14px;
            font-size: 8px;

            &:after {
                position: absolute;
                display: block;
                content: '';
                z-index: -1;
                width: 100%;
                height: 4px;
                bottom: -1px;
                border-top: 1px dashed #b4d1f6;
                border-bottom: 1px dashed #b4d1f6;
                background: #f2f8ff;
            }
        }
        .top-tips{
            font-family: OPPOSans, OPPOSans;
            font-weight: normal;
            font-size: 14px;
            color: #666666;
            line-height: 18px;
            text-align: left;
            font-style: normal;
        }
        .content-tips {
            font-family: OPPOSans, OPPOSans;
            font-weight: normal;
            font-size: 14px;
            color: #5698F5;
            line-height: 22px;
            text-align: left;
            font-style: normal;
        }
        .left-key {
            font-family: OPPOSans, OPPOSans;
            font-weight: normal;
            font-size: 14px;
            color: #333333;
            line-height: 23px;
            text-align: left;
            font-style: normal;
            margin-left: 42px;
        }
        .right-value {
            font-family: OPPOSans, OPPOSans;
            font-weight: normal;
            font-size: 14px;
            color: #5698F5;
            line-height: 22px;
            text-align: left;
            font-style: normal;
        }
        table{
            table-layout:fixed;
            width: 100%;
        }
    }
</style>
