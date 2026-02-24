<template>
  <div>
    <div class="foot-box">
      <p v-if="!isDeviceReport">
        <img
          src="@/assets/images/new-report/sidebar/arrow-left.png"
          alt
          class="menu-info"
          @click.prevent="goBack()"
        />
        常见食物营养表
      </p>
      <van-tabs v-model="activeName" @click="onClick(activeName)" sticky :ellipsis="false">
        <van-tab title="叶酸含量" name="folic"> </van-tab>
        <van-tab title="钙含量" name="calcium"> </van-tab>
        <van-tab title="铁含量" name="iron"> </van-tab>
      </van-tabs>
      <div class="foot-box-img">
        <table style="border-collapse: collapse">
          <tr>
            <th>食物</th>
            <th>{{activeName | activeNameHandler }} (每100g)</th>
          </tr>
          <tr v-for=" (item, index) in footContent[active]" :key="index">
            <td>{{item.title}}</td>
            <td>{{item.value}} {{active===1 || active===2?"mg":'ug'}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { footContent } from '@/assets/js/nutritional.js'
export default {
    filters: {
        activeNameHandler(text) {
            return text === 'folic' ? '叶酸含量' : text === 'calcium' ? '钙含量' : '铁含量'
        }

    },
    data() {
        return {
            activeName: 'folic',
            footContent,
            active: 0,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    methods: {
        goBack() {
            this.$router.push({
                path: '/new-report',
                query: { type: 1 }
            })
        },
        onClick(name) {
            if (name === 'folic') {
                this.active = 0
            } else if (name === 'calcium') {
                this.active = 1
            } else {
                this.active = 2
            }
        }
    },
}
</script>

<style scoped lang="less">
.foot-box {
  background: -webkit-gradient(linear, left top, left bottom, from(#262849), to(#07090f));
  height: 100vh;
  overflow-y: auto;
  p {
    font-weight: 400;
    font-size: 15px;
    color: #8aa3be;
    line-height: 15px;
    text-align: center;
    font-style: normal;
    position: relative;
    padding-top: 17px;
    .menu-info {
      display: inline-block;
      position: absolute;
      left: 14px;
      top: 12px;
      width: 24px;
      height: 24px;
    }
  }
  .foot-box-img {
    margin: 9px auto;
    width: 352px;
    background-image: url("../../assets/images/new-report/report/footBack.png");
    background-size: 100% 100%;
    min-height: 470px;
    overflow: hidden;
    table {
      margin: 11px 12px;
      font-weight: 400;
      font-size: 12px;
      color: #8aa3be;
      line-height: 18px;
      width: 330px;
      tr {
        height: 28px;
        td {
          text-align: left;
          text-indent: 63px;
          width: 165px;
          border: 0.5px solid #464d67;
          letter-spacing: 0.5px;
        }
        th{
            width: 165px;
            text-align: left;
            text-indent: 63px;
            border: 0.5px solid #464d67;
            &:last-child{
                text-align: center;
                text-indent: 0px;
            }
        }
      }
    }
  }
}

.van-tabs {
  /deep/.van-tabs__wrap {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      border: 0.5px solid #ffffff;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      opacity: 0.1;
    }
  }

  /deep/.van-tabs__nav {
    background-color: #232543;
  }

  /deep/.van-tab {
    color: #8aa3be;
  }

  /deep/.van-tab--active {
    display: inline-block;
    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    line-height: 42px;
    align-items: center;
    padding: 0 0.01px;  /* 防止文本裁剪异常 */
  }
}
</style>
<style>
.van-tabs__line {
  bottom: 14px;
  background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
}
</style>
