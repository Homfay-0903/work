<template>
    <div class="page">
        <mt-spinner :size="50" color="rgb(100, 100, 100)" type="fading-circle" v-if="loading"></mt-spinner>
    </div>
</template>

<script>
import { memberLogin, findLatestScanTypeInfo, findScanTrueHistory, getWechatSignature, ifLogoCloudEnable, memberTestLogin, getPillowReportQaByScanId } from '@/assets/js/apolloGql.js'
import { getProductTypeByOrigin, isWeiXin, getDomainFromString, debugLog } from '@/assets/js/util.js'
import { isVAPro3, isVAPro5, isVAPro7 } from '@/types/device.js'
import wx from 'weixin-js-sdk'
// import vConsole from '@/assets/js/vconsole'
export default {
    data() {
        return {
            loading: true,
            scanType: null
        }
    },
    created() {
        window.sessionStorage.setItem('entryUrl', window.location.href.split('#')[0])
        window.localStorage.removeItem('logoCloudEnable')
        window.localStorage.removeItem('healthPackageEnable')
        window.localStorage.removeItem('physicalAssessment')
        window.localStorage.removeItem('isDeviceReport')
        const origin = location.origin
        console.log('当前请求域名', origin)
        const productType = getProductTypeByOrigin(origin)
        window.localStorage.setItem('productType', productType)
        window.localStorage.removeItem('modelInfo')
        // 自定义菜单登录 显示侧边栏
        window.sessionStorage.setItem('setIsShowMenu', true)
        // 非app登录
        window.sessionStorage.setItem('isAppLogin', 0)
        // 非分享登录
        window.sessionStorage.setItem('isShare', 0)
        // 登录类型 1 普通登录 2 授权登录
        const type = this.$route.query.appid ? 2 : 1
        // 公众号id
        const appId = this.$route.query.state
        // 微信回调code
        const code = this.$route.query.code
        // 设备类型 1 vrpro3 2 vr3.0
        const deviceType = this.$route.query.device_type === '2' ? 2 : 1
        const wmId = this.$route.query.wmId
        if (wmId) {
            this.memberTestLogin(type, Number(wmId), deviceType)
        } else if (type && appId && code) {
            this.memberLogin(type, appId, code, deviceType)
        } else {
            // 登录失败
            this.$router.push({
                path: '/exception/login'
            })
        }
    },
    methods: {
        memberLogin(type, appId, code, deviceType) {
            this.$apollo
                .query({
                    query: memberLogin,
                    variables: {
                        type,
                        appId,
                        code,
                        deviceType
                    }
                })
                .then(res => {
                    const data = res.data.memberLogin
                    // alert("res data:"+JSON.stringify(res.data))
                    if (data.code === 200) {
                        this.$toast({
                            message: data.message,
                            duration: 3000
                        })
                        // 保存登录信息
                        this.saveLoginInfo(data)
                        // 微信号登录 获取最新一次扫描记录
                        this.findLatestScanTypeInfo()
                        // 数据统计
                        this.$hmt.trackEvent('login', 'menuLogin')
                    } else if (data.code === 403) {
                        // 同样需要保存登录信息
                        this.saveLoginInfo(data)
                        // 登录微信号没有绑定手机号 跳转到注册页面
                        this.$router.push({
                            path: '/register'
                        })
                        // 微信虚拟用户，提醒用户主动授权
                        // https://developers.weixin.qq.com/community/minihome/doc/000c2c34068880629ced91a2f56001?page=1#comment-list
                    } else if (data.code === 405) {
                        this.$router.push({
                            path: '/exception/fake-user'
                        })
                    } else if (data.code === 500) {
                        // 其他错误登录失败
                        this.$router.push({
                            path: '/exception/login'
                        })
                    } else {
                        this.$toast({
                            message: data.message,
                            duration: 3000
                        })
                    }
                    window.setTimeout(() => {
                        this.loading = false
                    }, 1500)
                })
        },
        memberTestLogin(type, wmId, deviceType) {
            console.log('测试登录')
            this.$apollo
                .query({
                    query: memberTestLogin,
                    variables: {
                        type,
                        wmId,
                        deviceType
                    }
                })
                .then(res => {
                    const data = res.data.memberTestLogin
                    console.log(`测试登录${data}`)
                    // alert("res data:"+JSON.stringify(res.data))
                    if (data.code === 200) {
                        this.$toast({
                            message: data.message,
                            duration: 3000
                        })
                        // 保存登录信息
                        this.saveLoginInfo(data)
                        // 微信号登录 获取最新一次扫描记录
                        this.findLatestScanTypeInfo()
                        // 数据统计
                        this.$hmt.trackEvent('login', 'menuLogin')
                    } else if (data.code === 403) {
                        // 同样需要保存登录信息
                        this.saveLoginInfo(data)
                        this.findLatestScanTypeInfo()
                        // 登录微信号没有绑定手机号 跳转到注册页面
                        this.$router.push({
                            path: '/register'
                        })
                        // 微信虚拟用户，提醒用户主动授权
                        // https://developers.weixin.qq.com/community/minihome/doc/000c2c34068880629ced91a2f56001?page=1#comment-list
                    } else if (data.code === 405) {
                        this.$router.push({
                            path: '/exception/fake-user'
                        })
                    } else if (data.code === 500) {
                        // 其他错误登录失败
                        this.$router.push({
                            path: '/exception/login'
                        })
                    } else {
                        this.$toast({
                            message: data.message,
                            duration: 3000
                        })
                    }
                    window.setTimeout(() => {
                        this.loading = false
                    }, 1500)
                })
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
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
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
        // 两者都失败判断历史记录
        findScanTrueHistory() {
            this.$apollo
                .query({
                    query: findScanTrueHistory,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    let history = res.data.findScanTrueHistory.data
                    if (!history) {
                        // 此处做一个跳转，为true跳转无数据页面
                        this.$router.push({
                            path: `/exception/result-no/${this.scanType}`
                        })
                    } else {
                        // 为false跳转查看历史记录页面
                        let modelInfo = {
                            scanId: history.scanId,
                            memberId: history.memberId,
                            biaMeasure: history.biaMeasure,
                            staticEval: history.staticEval,
                            createTime: history.createTime,
                            biaStatus: history.biaStatus,
                            bdaStatus: history.bdaStatus,
                            evalStatus: history.evalStatus,
                            bsShoulderScanResult: history.bsShoulderStatus,
                            girthMeasure: history.girthMeasure,
                            scanMode: history.scanMode,
                            questionReport: history.questionReport,
                            nutrition: history.nutrition,
                            teenagerReport: history.teenagerReport ? history.teenagerReport : 0,
                            mpRecommend: history.mpRecommend ? history.mpRecommend : 0,
                            spineReport: history.spineReport ? history.spineReport : 0,
                            bsSpineStatus: history.bsSpineStatus ? history.bsSpineStatus : 0,
                            isPillowRecommendReport: history.isPillowRecommendReport ? history.isPillowRecommendReport : 0
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))

                        // 如果只测量了颈部或体围 则直接跳转到首页
                        this.pushReport(modelInfo)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 判断模型是否生成
        findLatestScanTypeInfo() {
            this.$apollo
                .query({
                    query: findLatestScanTypeInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.findLatestScanTypeInfo
                    if (info.code === 200) {
                        const data = info.data
                        // window.localStorage.setItem('scanMode', JSON.stringify(data.scanMode))
                        // console.log(data, 88888)
                        debugLog('MenuCallBack.vue', '[findLatestScanTypeInfo]-info.data', JSON.stringify(data))
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
                            scanMode: data.scanMode ? data.scanMode : 0,
                            questionReport: data.questionReport ? data.questionReport : 0,
                            // 2表示未测量
                            nutrition: data.nutrition,
                            teenagerReport: data.teenagerReport ? data.teenagerReport : 0,
                            mpRecommend: data.mpRecommend ? data.mpRecommend : 0,
                            spineReport: data.spineReport ? data.spineReport : 0,
                            bsSpineStatus: data.bsSpineScanInfo ? data.bsSpineScanInfo.result : 0,
                            isPillowRecommendReport: data.isPillowRecommendReport ? data.isPillowRecommendReport : 0
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        const scanStatus = [modelInfo.biaStatus, modelInfo.bdaStatus, modelInfo.evalStatus, modelInfo.bsShoulderScanResult]
                        this.scanType = data.biaMeasure === 1 && data.staticEval === 1 ? 3 : data.biaMeasure === 1 ? 1 : 2
                        // 有合成中的项目
                        if (scanStatus.indexOf(-1) > -1 || scanStatus.indexOf(-10) > -1) {
                            // 跳转到合成中
                            this.shareClick()
                            // 开启hzh模式，需要判断是否填写整头问卷
                            this.checkPillowQuestion(modelInfo, () => {
                                this.$router.push({
                                    path: '/modeling'
                                })
                            })
                        } else {
                            // 所有测量项目都失败 无法生成报告 bda是否成功 不影响报告生成
                            const reportStatus = [modelInfo.biaStatus, modelInfo.evalStatus, modelInfo.bsShoulderScanResult]
                            if (isVAPro3() || isVAPro5() || isVAPro7()) {
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
                                this.findScanTrueHistory()
                            } else {
                                this.pushReport(modelInfo)
                            }
                        }
                        // 获取云端是否显示logo
                        this.ifLogoCloudEnable(data.scanId.split('-')[0])
                    } else if (info.code === 404) {
                        // this.ifLogoCloudEnable('36123456789102')
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
        saveLoginInfo(data) {
            let loginInfo = {
                token: data.data.token,
                expiresIn: data.data.expiresIn,
                type: 'menuLogin'
            }
            window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
        },
        // 判断是否跳去枕头问卷页面
        checkPillowQuestion(modelInfo, callback) {
            if (modelInfo.spineReport === 1 && modelInfo.isPillowRecommendReport === 1 && modelInfo.staticEval === 1 && modelInfo.girthMeasure === 1) {

                this.$apollo
                .query({
                    query: getPillowReportQaByScanId,
                    variables: {
                        scanId: modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.getPillowReportQaByScanId

                    if (!info.data) {
                        this.$router.push({
                        path: '/pillow-questions'
                    })
                    } else {
                        callback()
                    }
                })
            } else {
                callback()
            }
        },
        pushReport(modelInfo) {
            this.shareClick()
            // 有至少有一项成功
            if (isVAPro3() || isVAPro5() || isVAPro7()) {
                // 如果只测量了颈部则直接跳转到首页
                if (modelInfo.evalStatus === 1) {
                    this.$router.push({
                        path: '/report'
                    })
                } else {
                    this.$router.push({
                        path: '/main'
                    })
                }
            } else {
                // 如果只测量了颈部则直接跳转到首页
                if (modelInfo.biaStatus === 4 && modelInfo.evalStatus === 4 && modelInfo.bsShoulderScanResult === 1) {
                    this.$router.push({
                        path: '/main'
                    })
                } else {
                    this.$router.push({
                        path: '/report'
                    })
                }
            }
        },
        // 设置分享
        shareClick() {
            if (isWeiXin()) {
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
                            const modelInfoObj = JSON.parse(window.localStorage.getItem('modelInfo'))
                            const domain = getDomainFromString(url)
                            console.log(`==========domain:  ${domain}`)
                            const shareUrl = `${domain}/shareAuth/shareCallBack?token=${signatureInfo.token}&scan_id=${modelInfoObj.scanId}`
                            console.log(`==========>url: ${url} ==========>modelInfo: ${this.modelInfo} ==========>shareUrl: ${shareUrl}`)
                            wx.config({
                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: signatureInfo.appid, // 必填，公众号的唯一标识
                                timestamp: signatureInfo.timestamp, // 必填，生成签名的时间戳
                                nonceStr: signatureInfo.noncestr, // 必填，生成签名的随机串
                                signature: signatureInfo.signature, // 必填，签名
                                jsApiList: ['checkJsApi', 'updateTimelineShareData', 'updateAppMessageShareData', 'showMenuItems', 'hideMenuItems']  // 必填，需要使用的JS接口列表，目前只用到分享
                            })
                            wx.ready(function () {
                                wx.checkJsApi({
                                    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'],
                                    success(res) {
                                        if (res.checkResult.getLocation === false) {
                                            console.log('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本')
                                            this.$toast({
                                                message: '你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本',
                                                duration: 3000,
                                            })
                                        } else {
                                            wx.updateAppMessageShareData(
                                                {
                                                    title: signatureInfo.title, // 分享标题
                                                    desc: signatureInfo.desc, // 分享描述
                                                    link: shareUrl, // 分享链接，与JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () {
                                                    }
                                                }
                                            )

                                            wx.updateTimelineShareData(
                                                {
                                                    title: signatureInfo.title, // 分享标题
                                                    link: shareUrl, // 分享链接，与JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () {
                                                    }
                                                }
                                            )
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
        },
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
