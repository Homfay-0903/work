<!--
 * @Description:
 * @Author: fanyunbo
 * @Date: 2023-12-26 17:14:14
 * @LastEditTime: 2023-12-28 18:16:56
 * @LastEditors: liutq
 * @Reference:
-->
<template>
  <div class="record">
    <div class="record-tittle">体成分标准修改记录</div>
    <div class="record-box">
      <el-table :data="tableData" border :header-cell-style="tableStyle">
        <el-table-column label="操作时间">
            <template slot-scope="scope">
                    {{ scope.row.operationTime*1000 | dealTime }}
            </template>
        </el-table-column>
        <el-table-column label="修改前">
            <template slot-scope="scope">
                    {{ scope.row.preStandard | standard }}
            </template>
        </el-table-column>
        <el-table-column label="修改后">
            <template slot-scope="scope">
                    {{ scope.row.currStandard | standard }}
            </template>
        </el-table-column>
      </el-table>
    </div>
    <p>如有疑问可咨询维塑官方客服。</p>
  </div>
</template>
<script>
import { findDeviceIdRecords } from '@/assets/js/apolloGql.js'
import { formatDate, formatTime } from '@/assets/js/util.js'
export default {
    filters: {
        dealTime(e) {
            return formatDate(new Date(e)) + ' ' + formatTime(new Date(e))
        },
        standard(type) {
            switch (type) {
                case 0:
                    return '维塑实验专研标准'
                case 1:
                    return '维塑实验专研标准升级版'
                case 2:
                    return 'WHO(World Health Organization)标准'
                default:
                    return ''
            }
        }
    },
    data() {
        return {
            sleeted: '0',
            tableData: [],
        }
    },
    mounted() {
        this.$apollo
            .query({
                query: findDeviceIdRecords,
                variables: {
                    deviceId: window.localStorage.getItem('deviceId')
                },
                fetchPolicy: 'no-cache'
            })
            .then(res => {
                const result = res.data.findDeviceIdRecords
                if (result.code === 200) {
                    this.tableData = result.data
                }
            })
    },
    methods: {
        tableStyle() {
            return { 'text-align': 'center', 'color': 'rgba(74, 74, 74, 1)', 'background': '#F5F6FA', 'border-right': '0.5px solid #D7D7DA' }
        },
    },
}
</script>
<style lang="less" scoped>
.record {
  .record-tittle {
    width: 100%;
    height: 136px;
    font-size: 24px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 136px;
    text-align: left;
    padding-left: 96px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.14);
  }
  .record-box {
    margin: 56px 106px 10px;
    .el-table{
        border: 1px solid #D7D7DA;
    }
    /deep/.el-table__row {
      background: #F5F6FA !important;
      font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #4A4A4A;
      td{
        border-right: 1px solid #D7D7DA;
        border-top: 1px solid #D7D7DA;
      }
    }
  }
  p{
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #4A4A4A;
    line-height: 20px;
    text-align: right;
    margin-right: 106px;
  }
}
</style>
