<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-06-27 13:59:40
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-07 16:30:38
-->
<template>
    <!--身体成分上半部分-->
    <div :class="['body-composition body-thermal-wrapper', $i18n.locale]">
      <div class="report-contrast">
        <div class="contrast-title">
          <span>{{ $t('mass.contrast') }}</span>
          <date-select :type="1" :isCreateTime="isCreateTime" @girthContras="onGetMass"></date-select>
        </div>
      </div>
    </div>
  </template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    components: {
        DateSelect: () => import('@/components/common/DateSelect')
    },
    props: {
        isCreateTime: String,
        isHistoryDate: Array
    },
    emits: ['sendTsScanId'],
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            popupVisible: false,
            unit: window.localStorage.getItem('unit'),
        }
    },
    mounted() {
        // 开启加载动画
        // this.$indicator.open({
        //     spinnerType: 'fading-circle'
        // })
        // window.sessionStorage.removeItem('trendData')
    },
    methods: {
        handleCommand(command) {
            this.$message('click on item ' + command)
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
            this.saveStorage(this.selectTime, this.tcScanId)
            if (this.selectTime) {
                this.findBmMassQuotaTrend()
            }
        },
        toDecimal(num, digit) {
            return _toDecimal(num * 0.45359237, digit)
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
        },
        // 获取数据
        onGetMass(tcScanId) {
            console.log(`对比scanid修改${tcScanId}`)
            this.$emit('sendTsScanId', tcScanId)
        }
    }
}
</script>
  <style lang="less" scoped>
  .report-contrast {
      width: 353px;
      height: 75px;
      margin-top: 14px;
      padding: 0 10px;
      background: url(../../../assets/images/new-report/report/bj2_en.png) center no-repeat;
      background-size: 100% 100%;
      .contrast-title {
          span {
              display: inline-block;
              margin-top: 8px;
              font-size: 14px;
              color: #8aa3be;
              font-weight: 400;
              line-height: 14px;
          }
      }
  }

  &.ru-RU,&.tr-TR {
      .contrast-title {
          span {
              font-size: 12.5px;
          }
      }
  }
  &.de-DE {
      .contrast-title {
          span {
              font-size: 10.5px;
          }
      }
  }
  &.id-ID,.fr-FR{
      .contrast-title {
          span {
              font-size: 13px;
          }
      }
  }
  .pt-PT {
      .contrast-title {
          span {
              font-size: 12px;
          }
      }
  }
  .date-select {
      display: flex;
      justify-content: space-around;
      line-height: 58px;
      .date-select-first {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          padding: 0 0.01px;  /* 防止文本裁剪异常 */
      }
      .date-select-second {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8aa3be;
      }
  }
  .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
  }
  .el-icon-arrow-down {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding: 0 0.01px;  /* 防止文本裁剪异常 */
  }
  </style>

