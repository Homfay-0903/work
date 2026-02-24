<template>
    <div class="exception-page exception-failure-page" style="height:100%">
        <div class="model-generating">
            <div class="generation-waiting generation-waiting-100">
                <div class="three-dimensional-bg"></div>
                <div class="data-close">
                    <p class="data-title" @click="closePage">
                        <img src="@/assets/images/comp_close_icon.png" alt />
                    </p>
                </div>
                <div class="body-model">
                    <span>
                        <img src="@/assets/images/mobel@2x.png" />
                    </span>
                </div>
            </div>
            <div class="hint-info">
                <div class="hint-msg">
                    <p class="msg-title">温馨提示</p>
                    <p
                        class="msg-success"
                    >{{scanType === 1 ? '体成分报告未成功生成' : (scanType === 2 ? '体态评估未成功' : '报告未成功生成')}}，请到设备端重新体验哦~</p>
                </div>
                <div style="margin-top: 20px">
                    <p>
                        <span class="entry-report-but" @click="closePage">关闭页面</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            scanType: parseInt(this.$route.params.type, 10)
        }
    },
    methods: {
        closePage() {
            // 关闭页面
            window.WeixinJSBridge.call('closeWindow')
        }
    }
}
</script>
<style lang="less" scoped>
.model-generating {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #262849, #07090f);
    font-size: 14px;
    color: #fff;
    .generation-waiting {
        position: relative;
        width: 100%;
        height: 385px;
        padding-top: 30px;
        z-index: 0;
        .three-dimensional-bg {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 76px;
            background: url(../../assets/images/sidebar/model/ground_bg.png) no-repeat;
            background-size: cover;
            z-index: 1;
        }
    }
    .generation-waiting-100 {
        height: auto !important;
        padding-bottom: 10px;
    }
}

.body-box {
    display: inline-block;
    height: 285px;
    background: url(../../assets/images/sidebar/model/moxing_bg.png) no-repeat center bottom;
    background-size: 125px 50px;
    width: 50%;
    img {
        display: none !important;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}
.body-model {
    position: relative;
    z-index: 10;
    img {
        width: 112px;
        margin-top: 10px;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}
.speed-shadow {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99;
    width: 100%;
    height: 290px;
    overflow: hidden;
    .speed-box {
        position: absolute;
        top: 0;
        animation: go 12s linear normal infinite;
        z-index: 100;
        width: 100%;
        height: 200px;
        // border-top: 1px solid rgba(0, 227, 201, .4);
        .speed-padd {
            position: relative;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(180deg, rgb(0, 227, 201), rgba(0, 0, 0, 0.1));
            opacity: 0.09;
            z-index: 111;
        }
    }
}

.hint-info {
    padding-top: 25px;
    text-align: center;
}
.entry-report-but {
    display: inline-block;
    width: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-radius: 6px;
    background-image: linear-gradient(to right, #00e3c9, #00a4e6);
    margin-top: 20px;
}
.hint-msg {
    padding: 0 48px;
}
.msg-title {
    font-size: 16px;
    padding-bottom: 10px;
}
.msg-cont {
    font-size: 12px;
    line-height: 1.5;
    height: 50px;
}
.msg-success {
    font-size: 12px;
    line-height: 1.5;
}
.data-close {
    position: relative;
    height: 30px;
}
.data-title {
    position: absolute;
    left: 13px;
    padding-bottom: 10px;
    img {
        height: 50%;
        width: 50%;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}
</style>