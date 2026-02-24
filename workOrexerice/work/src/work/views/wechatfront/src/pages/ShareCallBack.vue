<template>
    <div class="page">
        <mt-spinner :size="50" color="rgb(100, 100, 100)" type="fading-circle" v-if="loading"></mt-spinner>
    </div>
</template>

<script>
import { getWechatSignature, ifLogoCloudEnable, findScanTrueByScanId } from '@/assets/js/apolloGql.js'
import { getProductTypeByOrigin, isWeiXin } from '@/assets/js/util.js'
import wx from 'weixin-js-sdk'
import { isVAPro3, isVAPro5 } from '@/types/device.js'
// import vConsole from '@/assets/js/vconsole'

export default {
    data() {
        return {
            loading: true,
            scanType: null,
            isShare: 1,
        }
    },
    created() {
        window.sessionStorage.setItem('entryUrl', window.location.href.split('#')[0])
        window.localStorage.removeItem('logoCloudEnable')
        window.localStorage.removeItem('healthPackageEnable')
        const origin = location.origin
        console.log('当前请求域名', origin)
        const productType = getProductTypeByOrigin(origin)
        window.localStorage.setItem('productType', productType)
        window.localStorage.removeItem('modelInfo')
        window.localStorage.removeItem('loginInfo')
        // 自定义菜单登录 显示侧边栏
        window.sessionStorage.setItem('setIsShowMenu', false)
        // 非app登录
        window.sessionStorage.setItem('isAppLogin', 0)
        window.sessionStorage.setItem('isShareLogin', 1)
        // 登录类型 1 普通登录 2 授权登录
        const type = 1
        const token = this.$route.query.token
        const scanId = this.$route.query.scan_id
        console.log('=========share', `token:${token}   scanId:${scanId}`)
        // 第二次进入页面判断新用户或跳过登录步骤
        if (type && token && scanId) {
            this.memberLogin(type, token, scanId)
        } else {
            // 登录失败
            this.$toast({
                message: '链接非法请登录',
                duration: 3000
            })
            this.$router.push({
                path: '/exception/login'
            })
        }
    },
    methods: {
        async memberLogin(type, token, scanId) {
            // 保存登录信息
            let loginInfo = {
                token: token,
                expiresIn: '-1',
                type: 'shareLogin'
            }
            window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
            // 分享登录
            window.sessionStorage.setItem('isShare', 1)
            this.hideMenuItems()
            // 获取云端是否显示logo
            // debugLog('ShareCallBack.vue','query.scan_id',scanId)
            this.ifLogoCloudEnable(scanId.split('-')[0])
            // 数据统计
            this.$hmt.trackEvent('login', 'shareLogin')
            this.findScanTrueByScanId(scanId)
        },
        // 根据scanId获取详情
        findScanTrueByScanId(scanId) {
            this.$apollo
                .query({
                    query: findScanTrueByScanId,
                    fetchPolicy: 'network-only',
                    variables: { scanId: scanId }
                })
                .then(res => {
                    const info = res.data.findScanTrueByScanId
                    if (info.code === 200) {
                        const data = info.data
                        /**
                         * 判断合成结果
                         * -10： 默认状态当合成中处理
                         * -1：  合成未返回
                         * 0：   失败
                         * 1：   成功
                         * 2：   超时
                         * staticEval-bsScanInfo    体态
                         * bmBiaScanInfo    体成分BIA
                         * bmBdaScanInfo    体成分BDA
                         * 测量项目(1 测量 0 未测量)与模块状态的关系
                         * 身体成分(biaMeasure)-bmBiaScanInfo
                         * 体态评估(staticEval)-bsScanInfo
                         *                     bmBdaScanInfo 存在未测量的情况
                         * 肩部评估(shoulderJointEval)-bsShoulderScanInfo
                         */
                        // 保存测量信息
                        const modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            shoulderEval: data.shoulderJointEval,
                            createTime: data.createTime,
                            biaStatus: data.bmBiaScanInfo ? data.bmBiaScanInfo.result : 4,
                            bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : 4,
                            evalStatus: data.bsScanInfo ? data.bsScanInfo.result : 4,
                            bsShoulderScanResult: data.bsShoulderScanInfo ? data.bsShoulderScanInfo.result : 4,
                            girthMeasure: data.girthMeasure,
                            scanMode: data.scanMode,
                            questionReport: data.questionReport
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        const scanStatus = [modelInfo.biaStatus, modelInfo.bdaStatus, modelInfo.evalStatus, modelInfo.bsShoulderScanResult]
                        // 有合成中的项目
                        if (scanStatus.indexOf(-1) > -1 || scanStatus.indexOf(-10) > -1) {
                            // 跳转到合成中
                            this.$router.push({
                                path: '/modeling'
                            })
                        } else {
                            // 所有测量项目都失败 无法生成报告 bda是否成功 不影响报告生成
                            const reportStatus = [modelInfo.biaStatus, modelInfo.evalStatus, modelInfo.bsShoulderScanResult]
                            if (isVAPro3() || isVAPro5()) {
                                reportStatus.push(modelInfo.bdaStatus)
                            }
                            let scanNum = 0
                            let errScanNum = 0
                            reportStatus.forEach(item => {
                                if (item !== 4) {
                                    scanNum++
                                }
                                if ([0, 2].indexOf(item) > -1) {
                                    errScanNum++
                                }
                            })
                            // 所有项目都失败
                            if (scanNum === errScanNum) {
                                this.$router.push({
                                    path: '/exception/report'
                                })
                            } else {
                                this.pushReport(modelInfo)
                            }
                        }
                    } else if (info.code === 404) {
                        // 当前微信号下没有报告
                        this.$router.push({
                            path: '/exception/report'
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },

        pushReport(modelInfo) {
            // 有至少有一项成功
            if (isVAPro3() || isVAPro5()) {
                // 如果只测量了颈部则直接跳转到首页
                if (modelInfo.biaStatus === 4 && modelInfo.evalStatus === 4 && (modelInfo.bsShoulderScanResult === 1 || modelInfo.bdaStatus === 1)) {
                    this.$router.push({
                        path: '/main'
                    })
                } else {
                    this.$router.push({
                        path: '/report'
                    })
                }
            } else {
                // 如果只测量了颈部则直接跳转到首页
                if (modelInfo.biaStatus === 4 && modelInfo.evalStatus === 4 && modelInfo.bsShoulderScanResult === 1) {
                    this.$router.push({
                        path: '/main'
                    })
                } else {
                    if (window.localStorage.getItem('healthPackageEnable') === '2') {
                        this.$router.push({
                            path: '/main',
                        })
                    } else {
                        this.$router.push({
                            path: '/report',
                        })
                    }
                }
            }
        },
        ifLogoCloudEnable(deviceId) {
            this.$apollo.query({
                query: ifLogoCloudEnable,
                variables: { deviceId }
            }).then(res => {
                if (res.data.findDeviceInfo.data && res.data.findDeviceInfo.data.logoCloudEnable === 1) {
                    document.title = 'Visbody'
                    window.localStorage.setItem('logoCloudEnable', '1')
                }
                if (res.data.findDeviceInfo.data && res.data.findDeviceInfo.data.healthPackageEnable === 2) {
                    document.title = '麦澜德佳澜 | Visbody'
                    window.localStorage.setItem('healthPackageEnable', 2)
                }
                if (res.data.findDeviceInfo.data && res.data.findDeviceInfo.data.spineReportEnabled === 1 && res.data.findDeviceInfo.data.isPillowRecommendReport === 1) {
                    document.title = '华住会'
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 跳转报告页
        jumpToReport(viewStatus) {
            console.log('jumpToReport')
            this.$router.push({
                path: viewStatus === 1 ? window.localStorage.getItem('healthPackageEnable') === '2' ? '/main' : '/report' : '/modeling'
            })
        },
        // 隐藏分享按钮
        hideMenuItems() {
            if (isWeiXin()) {
                console.log(`ShareCallBack---------->isWeiXin: ${isWeiXin()} isShare: ${this.isShare}`)
                const url = window.location.href.split('#')[0]
                this.$apollo
                    .query({
                        query: getWechatSignature,
                        variables: {
                            url: url
                        }
                    }).then(res => {
                        const data = res.data.getWechatSignature
                        if (data && data.code === 200) {
                            const signatureInfo = data.data
                            wx.config({
                                debug: false,
                                appId: signatureInfo.appid, // 必填，公众号的唯一标识
                                timestamp: signatureInfo.timestamp, // 必填，生成签名的时间戳
                                nonceStr: signatureInfo.noncestr, // 必填，生成签名的随机串
                                signature: signatureInfo.signature, // 必填，签名
                                jsApiList: ['checkJsApi', 'hideMenuItems']
                            })
                            wx.ready(function () {
                                wx.checkJsApi({
                                    jsApiList: ['hideMenuItems'],
                                    success(res) {
                                        if (res.checkResult.getLocation === false) {
                                            console.log('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本')
                                            this.$toast({
                                                message: '你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本',
                                                duration: 3000,
                                            })
                                        } else {
                                            wx.hideMenuItems(['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:share:weiboApp'])
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
                            wx.error(function (res) {
                                console.log(`错误：${JSON.stringify(res)}`)
                            })
                        }
                    })
            }
        }
    }
}
</script>

<style scoped lang="less">
.page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#262849), to(#07090f));
    background-image: linear-gradient(180deg, #262849, #07090f);
}
</style>
