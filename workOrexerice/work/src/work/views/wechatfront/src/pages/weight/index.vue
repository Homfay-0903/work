<template>
    <div class="report-wrapper fix-background">
        <img src="@/assets/images/new-report/logo@2x.png" alt class="top-logo">
        <div class="middle">
            <div class="result-title">
                <span>您本次体重测量结果</span>
            </div>
            <div class="result-wrapper">
                <div class="con-box">
                    <img src="@/assets/images/new-report/left_icon.png" alt="">
                    <div class="mass-score">
                        <p class="score">{{ weight > 0 ? weight : '--' }}</p>
                        <span class="unit">kg</span>
                    </div>
                    <img src="@/assets/images/new-report/right_icon.png" alt="">
                </div>
                <div class="date">
                    <span>检测时间：{{ date }}</span>
                </div>
            </div>
            <div class="tips">
                <img src="@/assets/images/new-report/error-warning-fill@2x.png" alt class="tips-icon">
                <span>如需获取完整报告，请去完成其他测量项目</span>
            </div>
        </div>
        <img src="@/assets/images/new-report/qrcode@2x.png" alt class="qrcode">
    </div>
</template>
<script>
import { getSignature } from '@/assets/js/apolloGql.js'
import { isWeiXin, getDomainFromString } from '@/assets/js/util.js'
import wx from 'weixin-js-sdk'

export default {
    data() {
        return {
            weight: 0,
            date: '',
            // 是否分享进入
            isShare: 0,
        }
    },
    created() {
        if (this.$route.query.isShare === '1') {
            this.isShare = '1'
        }
        this.weight = this.$route.query.weight
        const timestamp = this.$route.query.date
        console.log(`传入参数${timestamp}`)
        if (timestamp > 0) {
            this.date = this.$moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
        document.title = 'Visbody'
        this.shareClick()
    },
    methods: {
        // 设置分享
        shareClick() {
            if (isWeiXin()) {
                const url = window.location.href.split('#')[0]
                const isShare = this.isShare
                console.log(`weight---------->isWeiXin: ${isWeiXin()} isShare: ${isShare}   url: ${url}`)
                this.$apollo
                    .query({
                        query: getSignature,
                        variables: {
                            url: url
                        }
                    }).then(res => {
                        const data = res.data.getSignature
                        if (data && data.code === 200) {
                            const signatureInfo = data.data
                            const modelInfoObj = JSON.parse(window.localStorage.getItem('modelInfo'))
                            const domain = getDomainFromString(url)
                            console.log(`==========domain:  ${domain}`)
                            let shareUrl = ''
                            // 解决苹果手机有的系统无法隐藏分享菜单 使分享出去的链接失效
                            if (isShare !== '1') {
                                shareUrl = `${url}&isShare=1`
                            } else {
                                shareUrl = url
                            }
                            console.log(`========>url: ${url}  =======>scanId: ${modelInfoObj.scanId}   =======>shareUrl: ${shareUrl}`)
                            wx.config({
                                debug: false,
                                appId: signatureInfo.appid, // 必填，公众号的唯一标识
                                timestamp: signatureInfo.timestamp, // 必填，生成签名的时间戳
                                nonceStr: signatureInfo.noncestr, // 必填，生成签名的随机串
                                signature: signatureInfo.signature, // 必填，签名
                                jsApiList: ['checkJsApi', 'updateTimelineShareData', 'updateAppMessageShareData', 'showMenuItems', 'hideMenuItems']
                            })
                            wx.ready(function () {
                                wx.checkJsApi({
                                    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'showMenuItems', 'hideMenuItems'],
                                    success(res) {
                                        if (res.checkResult.getLocation === false) {
                                            console.log('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本')
                                            this.$toast({
                                                message: '你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本',
                                                duration: 3000,
                                            })
                                        } else {
                                            if (isShare !== '1') {
                                                console.log('显示分享菜单=========main')
                                                wx.showMenuItems({
                                                    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:share:weiboApp']
                                                })
                                                wx.updateAppMessageShareData(
                                                    {
                                                        title: signatureInfo.title, // 分享标题
                                                        desc: signatureInfo.desc, // 分享描述
                                                        link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                        imgUrl: signatureInfo.imgUrl, // 分享图标
                                                        success: function () {
                                                        }
                                                    }
                                                )

                                                wx.updateTimelineShareData(
                                                    {
                                                        title: signatureInfo.title, // 分享标题
                                                        link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                        imgUrl: signatureInfo.imgUrl, // 分享图标
                                                        success: function () {
                                                        }
                                                    }
                                                )
                                            } else {
                                                console.log('隐藏分享菜单=========main')
                                                wx.hideMenuItems({
                                                    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:share:weiboApp']
                                                })
                                            }
                                        }
                                    },
                                    fail(res) {
                                        const message = 'checkJsApi fail=' + JSON.stringify(res)
                                        this.$toast({
                                            message: message,
                                            duration: 3000,
                                        })
                                        console.log(message)
                                    }
                                })
                            })
                            wx.error(function(res) {
                                console.log(`错误：${JSON.stringify(res)}`)
                            })
                        }
                    })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.report-wrapper {
    overflow: scroll;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);
    display: flex;
    flex-direction: column;
    align-items: center;

    .top-logo {
        width: 186px;
        margin-top: 40px;
    }

    .middle {
        margin-top: 53px;
        display: flex;
        flex-direction: column;
    }

    .result-title {
        max-width: 301px;
        width: fit-content;
        min-height: 30px;
        margin-bottom: -2px;
        line-height: 26px;
        color: #222222;
        background: url(../../assets/images/new-report/report/body_over_en.png) center no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        span {
            letter-spacing: 0.1px;
            margin-left: 10px;
            margin-right: 15px;
            font-size: 14px;
            text-align: left;
        }
    }

    .result-wrapper {
        width: 353px;
        background: url(../../assets/images/new-report/report/bj1.png) center no-repeat;
        background-size: 100% 100%;

        .con-box {
            margin-top: 17px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;

            .mass-score {
                display: -webkit-box;
                flex-direction: row;
                align-items: baseline;
                background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                padding: 0 0.01px;  /* 防止文本裁剪异常 */

                .score {
                    font-size: 48px;
                    font-family: OPPOSans-B, OPPOSans;
                    font-weight: normal;
                }

                .unit {
                    font-size: 24px;
                    font-family: OPPOSans-M, OPPOSans;
                    font-weight: normal;
                    margin-left: 5px;
                }
            }
        }

        .date {
            margin-top: 8px;
            margin-bottom: 32px;

            span {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8AA3BE;
                line-height: 17px;

            }
        }

    }

    .tips {
        margin-top: 15px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .tips-icon {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }

        span {
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #8AA3BE;
            line-height: 21px;
        }
    }

    .qrcode {
        margin-top: 80px;
        width: 96px;
    }
}
</style>
