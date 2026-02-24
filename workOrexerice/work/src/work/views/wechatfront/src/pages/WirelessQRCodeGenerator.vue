/**
* WIFI配置信息二维码生成器
* 用于设备扫码连接无线网络
*/
<template>
    <div class="qrcode-container">
        <!-- 输入组件 -->
        <div class="part-input" v-if="step === 1">
            <img class="vr" src="@/assets/images/vr-image.png">
            <div class="info-title">Visbody-R WiFi 配置</div>
            <div class="form-contain">
                <div class="form-item">
                    <img class="prefix" src="@/assets/images/vr-name.png" alt>
                    <input class="name" v-model="name" type="text" placeholder="WiFi名称" />
                </div>
                <div class="form-item">
                    <img class="prefix" src="@/assets/images/vr-password.png" alt>
                    <input class="password" v-model="password" type="text" placeholder="WiFi密码" />
                </div>
                <div class="info">* 若WiFi网络未加密，则密码可以不填写</div>
            </div>
            <div :class="['submit-btn', isPass ? 'pass' : 'fail']" @click="go(2)">生成二维码</div>
            <div class="footer">温馨提示：为保障网络的流畅，请为设备配置 5G WiFi</div>
        </div>
        <!-- 展示组件 -->
        <div class="part-show" v-if="step === 2">
            <img class="wifi" src="@/assets/images/vr-wifi.png">
            <div class="part-show-bg">
                <div class="wifi-info">
                    <div class="wifi-info-item">
                        <p class="wifi-info-item-key">WiFi名称：</p>
                        <p class="wifi-info-item-value">{{name}}</p>
                    </div>
                    <div class="wifi-info-item">
                        <p class="wifi-info-item-key">WiFi密码：</p>
                        <p class="wifi-info-item-value">{{password}}</p>
                    </div>
                </div>
                <div class="des">
                    请确认 WiFi 名称和密码无误后，对准设备屏幕下方的相机位置进行扫描。
                </div>
                <div class="qrcode-img" ></div>
                <span class="footer" @click="() => guideFlage = true">使用说明</span>
            </div>
            <div class="submit-btn pass" style="margin-top: 40px;" @click="go(1)">返回</div>
        </div>
        <!-- 遮罩 -->
        <transition name="fade" :duration="300">
            <div class="mask" v-if="guideFlage">
                <div class="card">
                    <div class="img-container"><img src="@/assets/images/vr-scean.png" alt=""></div>
                    <p class="footer">
                        请将 WiFi 二维码对准屏幕下方的<br>相机位置进行扫描。
                    </p>
                    <div class="iknow-btn" @click="() => guideFlage = false">我知道了</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import QRCode from 'easyqrcodejs'

export default {
    name: 'qrcode-generator',
    data() {
        return {
            name: '',
            password: '',
            step: 1,
            guideFlage: false,
            src: ''
        }
    },
    computed: {
        isPass() {
            return this.name !== '' && (this.password === '' || this.password.length >= 8)
        },
        value() {
            return this.name + ',' + this.password
        }
    },
    created() {
        this.setTitle('配置WiFi信息')
    },
    methods: {
        setTitle(t) {
            document.title = t
            let i = document.createElement('iframe')
            i.style.display = 'none'
            i.onload = function() {
                setTimeout(function() {
                    i.remove()
                }, 0)
            }
            document.body.appendChild(i)
        },
        go(step) {
            if (this.isPass) {
                this.step = step
                if (this.step === 2) {
                    this.guideFlage = true
                    this.$nextTick(() => {
                        // eslint-disable-next-line no-new
                        new QRCode(document.querySelector('.qrcode-img'), {
                            text: this.value,
                            width: 256,
                            height: 256,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.H
                        })
                    })
                } else if (this.step === 1) {
                    const dom = document.querySelector('.qrcode-container canvas')
                    dom && dom.remove()
                }
            }
        }
    }
}
</script>

<style scope>
.qrcode-container .vr {
    width: 152px;
    display: block;
    margin: 0 auto;
    padding: 32px 0 8px;
    box-sizing: border-box;
}

.form-item {
    position: relative;
}

.form-contain .prefix {
    position: absolute;
    width: 16px;
    top: 12px;
    z-index: 1;
    left: 34px;
}

.form-contain input {
    width: 327px;
    background: #fafafa;
    border-radius: 5px;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    display: block;
    margin: 16px auto;
    padding-left: 36px;
    position: relative;
}

.form-contain .info {
    height: 18px;
    font-size: 13px;
    padding-left: 30px;
    font-family: PingFangSC-Regular, PingFang SC;
    text-align: left;
    font-weight: 400;
    color: #b5b5b5;
    line-height: 18px;
}

.info-title {
    height: 48px;
    text-align: center;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 48px;
}

.submit-btn {
    width: 327px;
    height: 40px;
    line-height: 40px;
    margin: 22px auto 16px auto;
    border-radius: 5px;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}

.fail {
    background: #e7e9f0;
    color: #ccc;
}

.pass {
    background: #649cff;
    color: #ffffff;
}

.part-input .footer {
    height: 18px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #b5b5b5;
    padding-left: 30px;
    text-align: left;
    line-height: 18px;
}

.part-show {
    overflow: auto;
}

.part-show .wifi {
    display: block;
    width: 40px;
    height: 40px;
    margin: 24px auto 0 auto;
}

.part-show .part-show-bg {
    width: 327px;
    margin: 8px auto 0 auto;
    overflow: auto;
    background-color: #fafafa;
}

.part-show .wifi-info {
    width: 229px;
    font-size: 17px;
    line-height: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin: 24px auto 0 auto;
}

.part-show .wifi-info-item {
    display: flex;
}

.part-show .wifi-info-item-key {
    flex: 0 0 5em;
}

.part-show .wifi-info-item-value {
    text-align: left;
    word-break: break-all;
}
.part-show .des {
    width: 282px;
    height: 36px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    position: relative;
    margin: 16px 16px 24px auto;
    text-align: left;
}

.part-show .des:after {
    content: '*';
    position: absolute;
    left: -0.8em;
    top: 0;
    z-index: 3;
}

.part-show .footer {
    text-align: center;
    text-decoration: underline;
    height: 18px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #649cff;
    line-height: 18px;
    margin-bottom: 8px;
    display: block;
}

.mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    overflow: auto;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
}

.mask .card {
    width: 327px;
    height: 456px;
    margin: 72px auto 0 auto;
    background-color: #fafafa;
    border-radius: 3px;
    overflow: auto;
}

.mask .card .img-container {
    width: 295px;
    height: 255px;
    background-color: #ececec;
    margin: 24px auto 16px auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mask .card .img-container img {
    width: 220px;
    height: 197px;
}

.mask .card .footer {
    height: 36px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
}

.mask .card .iknow-btn {
    width: 149px;
    height: 40px;
    background: #649cff;
    border-radius: 20px;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 40px;
    margin: 40px auto 0 auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>

<style>
.part-show canvas {
    display: block;
    width: 64vw !important;
    height: 64vw !important;
    margin: 6.4vw auto 3.467vw;
    border: 16px solid #fff;
}
</style>
