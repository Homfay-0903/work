<!--
 * @Author: liyunfei12354 3090384495@qq.com
 * @Date: 2025-04-02 17:18:04
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-06-05 16:06:38
 * @FilePath: \vr-pro3-wechat-frontend\src\pages\wifih5\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="main1">
    <img src="@/assets/images/wifi/apro7wifi.png" alt="" class="img" />
    <h3 class="h3">WiFi配置</h3>
    <span class="class">请输入以下 WiFi 网络的密码</span>
    <div class="content">
      <div class="info">
        <img src="@/assets/images/wifi/wifi.png" class="wifi-icon" alt="" />
        <input type="text" v-model="ssid" disabled class="wifi" />
      </div>
      <h3 class="label">WIFI 密码</h3>
      <div class="info">
        <input :type="password2" v-model="password" class="password2" placeholder="请输入 WiFi 密码" max="100" />
        <span class="tips">密码区分大小写，请确保输入正确</span>
        <span class="eye-icon" @click="togglePassword">
          <img :src="!showPassword
            ? require('@/assets/images/wifi/eyes-open.png')
            : require('@/assets/images/wifi/eyes-off.png')
            " />
        </span>
      </div>
      <div class="text-wrapper_2 flex-col" :class="password ? 'text-wrapper_3' : ''" @click="onConnect()">
        <span class="text_8">生成二维码</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ssid: '',
      password: '',
      t: '',
      showPassword: false,
      password2: 'password',
    }
  },
  mounted() {
    // 假设你使用的是 Vue Router
    this.ssid = this.$route.query.ssid
    document.title = '配置WIFI信息'
  },
  methods: {
    onConnect() {
      if (!this.password) return
      console.log('onConnect', this.ssid, this.password, this.t)
      this.$router.push({ path: '/wifi/qrcode', query: { ssid: this.ssid, password: this.password, t: this.t }})
    },
    togglePassword() {
      this.showPassword = !this.showPassword
      this.password2 = this.showPassword ? 'text' : 'password'
    }
  }
}
</script>

<style scoped lang="less">
.main1 {
  width: 100%;
  height: 100%;
  position: absolute;

  .img {
    margin: 30px auto;

  }

  .h3 {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: #333333;
    line-height: 25px;
    text-align: center;
    font-style: normal;
    margin: 20px 0 10px 0;
  }

  .class {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 13px;
    color: #999999;
    line-height: 18px;
    text-align: center;
    font-style: normal;
  }

  .content {
    position: relative;
    width: 90%;
    margin: 0 auto;
    top: 30px;

    .label {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 13px;
      color: #000000;
      line-height: 18px;
      text-align: left;
      font-style: normal;
      margin-bottom: 5px;
    }

    .info {
      width: 100%;
      height: 40px;
      margin-bottom: 20px;
      position: relative;

      .wifi-icon {
        position: absolute;
        top: 14px;
        left: 10px;
        width: 17px;
      }

      .wifi {
        background: #F1F6FF;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        padding-left: 10%;
      }

      .password2 {
        width: 100%;
        height: 100%;
        background: #FAFAFA;
        border-radius: 5px;
        border: 1px solid #DBDBDB;
        padding-left: 5%;
      }

      .tips {
        position: absolute;
        top: 40px;
        left: 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 17px;
        font-style: normal;
      }
    }

    .text-wrapper_2 {
      background-color: rgba(231, 233, 240, 1);
      border-radius: 5px;
      margin-top: 44px;
      padding: 10px 125px 9px 126px;
    }

    .text-wrapper_3 {
      background-color: rgba(100, 156, 255, 1);
      border-radius: 5px;
      padding: 10px 125px 9px 126px;
    }

    .text_8 {
      overflow-wrap: break-word;
      color: #FFFFFF;
      font-size: 15px;
      letter-spacing: 0.11250000447034836px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
      line-height: 21px;
    }
  }
}

.eye-icon {
  cursor: pointer;
  // margin-left: 10px; /* 根据需要调整图标的位置 */
  position: absolute;
  top: 10px;
  right: 10px;
  width: 14px;
  height: 11px;
}

.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .select {
      width: 260px;
    }
  }
}
</style>