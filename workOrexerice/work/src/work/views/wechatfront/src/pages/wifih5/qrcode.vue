<!--
 * @Author: liyunfei12354 3090384495@qq.com
 * @Date: 2025-04-02 17:18:23
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-06-11 15:22:09
 * @FilePath: \vr-pro3-wechat-frontend\src\pages\wifih5\qrcode.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="main1">
        <div class="box_2">
            <div class="p2">
                <div class="label"><p>WIFI名称：</p></div>
                <div class="value"><P>{{this.ssid}}</P></div>
                <div class="label"><p>WIFI密码：</p></div>
                <div class="value"><P>{{this.password}}</P></div>
            </div>
            <p class="p1">* 请确认 WiFi 名称和密码无误后，对准设备屏幕下方的相机位置进行扫描。</p>
            <div id="classimg"></div>
        </div>
        <div class="box_1">
            <img src="@/assets/images/wifi/QR-image.png" class="qrimg" alt=""/>
            <p class="tips2">请将 WiFi 二维码对准屏幕下方的相机位置进行扫描。</p>
        </div>
        <div class="text-wrapper_3 flex-col" @click="onConnect()">
        <span class="text_8">返回</span>
      </div>
    </div>
</template>

<script>
// import QRCodeStyling from 'qr-code-styling'
import QRCode from 'easyqrcodejs'
export default {
    data() {
    return {
      ssid: 'wskj_5G',
      password: 'wskj1234',
      t: 'WPA3-Personal',
      qrCode: null,
    }
  },
  created() {
        this.ssid = this.$route.query.ssid
        console.log(this.ssid, 'this.ssid')
        this.password = this.$route.query.password
        this.t = this.$route.query.t
        document.title = '配置WIFI信息'
    },
    mounted() {
        this.qrCodeUrl()
    },
    methods: {
        // 生成二维码
        qrCodeUrl() {
            // this.qrCode = new QRCodeStyling({
            //     width: 190,
            //     height: 190,
            //     type: 'svg',
            //     data:`WIFI:S:${this.ssid};T:${this.t};P:${this.password};;`,
            //     dotsOptions: {
            //         color: '#000',
            //         type: ''
            //     },
            //     backgroundOptions: {
            //         color: '#fff'
            //     },
            //     imageOptions: {
            //         crossOrigin: 'anonymous'
            //     },
            //     cornersDotOptions: {
            //         type: ''
            //     },
            //     cornersSquareOptions: {
            //         type: ''
            //     }
            // })
            // this.qrCode.append(document.getElementById('canvas'))
            this.$nextTick(() => {
                        // eslint-disable-next-line no-new
                        new QRCode(document.querySelector('#classimg'), {
                            text: `WIFI:T:${this.t};S:${this.ssid};P:${this.password};;`,
                            width: 190,
                            height: 190,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.H
                        })
                    })
        },
        onConnect() {
            this.$router.push({ path: '/wifi', query: { ssid: this.ssid }})
        }
    },
}
</script>

<style scoped lang="less">
#canvas{
    width: 170px;
    height: 170px;
    position: absolute;
    left: 80px;
}
.main1 {
  width: 100%;
  height: 100%;
  position: absolute;
  .box_2 {
    width: 327px;
    height: 334px;
    background: #FAFAFA;
    margin: 20px auto;
    position: relative;
    padding-top: 20px;
    .p2 {
        width: 90%;
        height: 48px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 2fr;  /* 第一列（标签）和第二列（值）的宽度比例 */
        gap: 10px;  /* 网格项之间的间距 */
        align-items: center;  /* 垂直居中文本 */
        .label{
            // width:40%;
            height: 24px;
            text-align: right;
            word-break: break-all;
        }
        .value{
            // width:60%;
            height: 24px;
            text-align: left;
            word-break: break-all;
            // line-height: 12px;
        }
    }
    .p1{
        width: 90%;
        margin: 20px auto;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #999999;
        line-height: 18px;
        text-align: left;
        font-style: normal;
    }
  }
  .box_1 {
    width: 327px;
    height: 222px;
    background: #FAFAFA;
    margin: 20px auto;
    position: relative;
    padding-top: 20px;
    .qrimg{
        width:153px;
        height:137px;
    }
    .tips2{
        padding:0 64px
    }
    }
    .text-wrapper_3 {
  background-color: #649CFF;
  border-radius: 5px;
  padding: 10px 125px 9px 126px;
  width: 90%;
    margin: 0 auto;
    margin-top: 24px;
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
</style>