<template>
    <div class="page">
        <mt-spinner :size="50" color="rgb(100, 100, 100)" type="fading-circle" v-if="loading"></mt-spinner>
    </div>
</template>

<script>
import { memberLogin, findScanTypeInfo, findScanTrueHistory, getWechatSignature, getMemberInfo, ifLogoCloudEnable, getPillowReportQaByScanId } from '@/assets/js/apolloGql.js'
import { appId as defaultAppId, homepageUrl } from '@/assets/js/config.js'
import { getProductTypeByOrigin, isWeiXin, getDomainFromString } from '@/assets/js/util.js'
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
        const origin = location.origin
        console.log('当前请求域名', origin)
        const productType = getProductTypeByOrigin(origin)
        window.localStorage.setItem('productType', productType)
        window.sessionStorage.removeItem('isNewUser')
        window.localStorage.removeItem('modelInfo')
        // 自定义菜单登录 显示侧边栏
        window.sessionStorage.setItem('setIsShowMenu', false)
        // 非app登录
        window.sessionStorage.setItem('isAppLogin', 0)
        // 非分享登录
        window.sessionStorage.setItem('isShare', 0)
        console.log('>>>> this.$route.query', JSON.stringify(this.$route.query))
        // 用来区分是否是设备端进入
        window.sessionStorage.setItem('isDeviceReport', true)
        if (this.$route.query.newUser) {
            window.sessionStorage.setItem('isNewUser', true)
        }
        // 登录类型 1 普通登录 2 授权登录
        // const type = this.$route.query.appid ? 2 : 1
        // 公众号id
        // const appId = this.$route.query.state
        // 微信回调code
        // const code = this.$route.query.code
        // 扫码id
        // const scanId = this.$route.query.scan_id
        // 设备id
        // const deviceId = this.$route.query.device_id
        // 设备类型 1 vrpro3 2 vr3.0
        // const deviceType = this.$route.query.device_type === '2' ? 2 : 1
        // 第二次进入页面判断新用户或跳过登录步骤
        // if (this.$route.query.new_user) {
        //     this.newUserGuide(appId, scanId)
        // }
        // else if (type && appId && code && scanId && deviceId) {
        //     this.memberLogin(type, appId, code, deviceType, scanId, deviceId)
        // }
    },
    mounted() {
         if (this.$route.query.token) {
                    // 保存token信息
            this.saveLoginInfo()
        } else {
            // 登录失败
            this.$router.push({
                path: '/exception/login'
            })
        }
    },
    methods: {
        async memberLogin(type, appId, code, deviceType, scanId, deviceId) {
            const res = await this.$apollo.query({
                query: memberLogin,
                variables: {
                    type,
                    appId,
                    code,
                    deviceType,
                    scanId,
                    deviceId
                }
            })
            const data = res.data.memberLogin
            console.log('>>>> [memberLogin] res.data.memberLogin:')
            console.log(data)
            // FIXME: 扫码超时 408 未处理
            if (data.code === 200) {
                this.$toast({
                    message: data.message,
                    duration: 3000
                })
                // 保存登录信息
                this.saveLoginInfo(data)
                // 向中转页面发送消息(老用户)
                await this.handleEnterMsg(false)
                // 获取云端是否显示logo
                // debugLog('QrcodeCallBack.vue','query.scan_id',scanId)
                // 数据统计
                this.$hmt.trackEvent('login', 'qrcodeLogin')
            } else if (data.code === 403) {
                // 登录微信号没有绑定手机号
                this.saveLoginInfo(data)
                // 向中转页面发送消息(新用户)
                await this.handleEnterMsg(true)
            } else if (data.code === 404) {
                // 扫描id不存在或其他原因
                this.$router.push({
                    path: '/exception/login'
                })
                // 微信虚拟用户，提醒用户主动授权
                // https://developers.weixin.qq.com/community/minihome/doc/000c2c34068880629ced91a2f56001?page=1#comment-list
            } else if (data.code === 405) {
                this.$router.push({
                    path: '/exception/fake-user'
                })
            } else if (data.code === 409) {
                // 模型已被绑定
                this.$router.push({
                    path: '/exception/binding'
                })
            } else if (data.code === 500) {
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
        },
        ifLogoCloudEnable(deviceId) {
            console.log('>>>> [ifLogoCloudEnable] 0')
            this.$apollo.query({
                query: ifLogoCloudEnable,
                variables: { deviceId }
            }).then(res => {
                console.log('>>>> [ifLogoCloudEnable] res:')
                console.log(res)
                if (res.data.findDeviceInfo.data && res.data.findDeviceInfo.data.logoCloudEnable === 1) {
                    console.log('>>>> [ifLogoCloudEnable] set title')
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
                            bsSpineStatus: history.bsSpineStatus ? history.bsSpineStatus : 0,
                            teenagerReport: data.teenagerReport,
                            spineReport: data.spineReport,
                            mpRecommend: data.mpRecommend,
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
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
                })
                .catch(err => {
                    console.log(err)
                })
        },
        scanTypeHandler(data) {
            // 预设置分享内容
            // this.shareClick(data.scanId)
            /**
             * 判断扫描类型
             * data.biaMeasure === 1 测了身体成分
             * data.staticEval === 1 测了体态评估
             */
            /**
             * 判断合成结果
             * -10： 默认状态
             * -1：  合成未返回
             * 0：   失败
             * 1：   成功
             * 2：   超时
             * bsScanInfo    体态
             * bmScanInfo    体成分
            */
            // 如果未查看，跳转modeling
            let onlyShoulder = data.biaMeasure === 0 && data.staticEval === 0 && data.shoulderJointEval === 1
            const isVAPro3 = data.scanId.slice(0, 2) === 'M5'
            const isVAPro5 = data.scanId.slice(0, 2) === 'M6'
            const isVAPro5g2l = data.scanId.slice(0, 2) === 'M2'
            const isVAPro5S = data.scanId.slice(0, 2) === 'N2'
            let modelInfo = {}
            if (isVAPro3 || isVAPro5 || isVAPro5g2l || isVAPro5S) {
                modelInfo = {
                    scanMode: data.scanMode,
                    questionReport: data.questionReport,
                    nutrition: data.nutrition,
                    scanId: data.scanId,
                    girthMeasure: data.girthMeasure,
                    staticEval: data.staticEval,
                    teenagerReport: data.teenagerReport,
                    spineReport: data.spineReport,
                    mpRecommend: data.mpRecommend,
                    isPillowRecommendReport: data.isPillowRecommendReport ? data.isPillowRecommendReport : 0,
                    bsSpineStatus: data.bsSpineScanInfo ? data.bsSpineScanInfo.result : 0
                }
                window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                onlyShoulder = (data.girthMeasure === 0 && onlyShoulder) ? true : false
            }
            const shoulderScanSucceed = data.bsShoulderScanInfo !== null
            console.log(`当前数据${data.viewStatus} ${onlyShoulder}`)
            if (!data.viewStatus) {
                if (onlyShoulder) {
                    // 只做了肩部评估
                    // 判断肩部评估是否成功
                    if (shoulderScanSucceed) {
                        // 在这里也要负载一次信息
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure,
                            scanMode: data.scanMode,
                            questionReport: data.questionReport,
                            nutrition: data.nutrition
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        // 跳转到颈部详情页
                        this.jumpToMain(modelInfo)
                        // this.$router.push({
                        //     path: '/main'
                        // })
                    }
                } else {
                    this.checkPillowQuestion(modelInfo, () => {
                        this.jumpToReport()
                    })
                    return
                }
            }
            this.scanType = 3
            if (isVAPro3) {
                console.log('apro3报告')
                if (data.girthMeasure === 0 && data.staticEval === 1) {
                    // 体态
                    if ([-1, -10].indexOf(data.bsScanInfo.result) > -1) {
                        // 在合成中
                        this.$router.push({
                            path: '/modeling'
                        })
                    } else if (data.bsScanInfo.result === 1) {
                        // 在这里也要负载一次信息
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            evalStatus: data.bsScanInfo.result,
                            bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure,
                            scanMode: data.scanMode,
                            questionReport: data.questionReport,
                            nutrition: data.nutrition
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        this.jumpToReport(data.viewStatus)
                    } else {
                        // 判断是否测量了颈部评估并且成功
                        if (data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1) {
                            // 在这里也要负载一次信息
                            let modelInfo = {
                                scanId: data.scanId,
                                memberId: data.memberId,
                                biaMeasure: data.biaMeasure,
                                staticEval: data.staticEval,
                                createTime: data.createTime,
                                evalStatus: data.bsScanInfo.result,
                                bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                                shoulderEval: data.shoulderJointEval,
                                bsShoulderScanResult: data.bsShoulderScanInfo
                                    ? data.bsShoulderScanInfo.result
                                    : null,
                                girthMeasure: data.girthMeasure,
                                scanMode: data.scanMode,
                                questionReport: data.questionReport,
                                nutrition: data.nutrition
                            }
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                            // 跳转到颈部详情页
                            this.jumpToMain(modelInfo)
                            // this.$router.push({
                            //     path: '/main'
                            // })
                        } else {
                            this.findScanTrueHistory()
                        }
                    }
                } else if (data.girthMeasure === 1 && data.staticEval === 0) {
                    // 体态
                    if ([-1, -10].indexOf(data.bmBdaScanInfo.result) > -1) {
                        // 在合成中
                        this.$router.push({
                            path: '/modeling'
                        })
                    } else if (data.bmBdaScanInfo.result === 1) {
                        // 在这里也要负载一次信息
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            evalStatus: data.bsScanInfo ? data.bsScanInfo.result : null,
                            bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure,
                            scanMode: data.scanMode,
                            questionReport: data.questionReport,
                            nutrition: data.nutrition
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        // this.jumpToReport(data.viewStatus)
                        // 只做体围并且成功 应该直接进入报告页
                        this.$router.push({
                            path: '/modeling'
                        })
                    } else {
                        // 判断是否测量了颈部评估并且成功
                        if (data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1) {
                            // 在这里也要负载一次信息
                            let modelInfo = {
                                scanId: data.scanId,
                                memberId: data.memberId,
                                biaMeasure: data.biaMeasure,
                                staticEval: data.staticEval,
                                createTime: data.createTime,
                                evalStatus: data.bsScanInfo ? data.bsScanInfo.result : null,
                                bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                                shoulderEval: data.shoulderJointEval,
                                bsShoulderScanResult: data.bsShoulderScanInfo
                                    ? data.bsShoulderScanInfo.result
                                    : null,
                                girthMeasure: data.girthMeasure,
                                scanMode: data.scanMode,
                                questionReport: data.questionReport,
                                nutrition: data.nutrition
                            }
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                            // 跳转到颈部详情页
                            this.jumpToMain(modelInfo)
                            // this.$router.push({
                            //     path: '/main'
                            // })
                        } else {
                            this.findScanTrueHistory()
                        }
                    }
                } else if (data.girthMeasure === 1 && data.staticEval === 1) {
                    // 体测 + 体态
                    // 两者都失败
                    if (
                        [0, 2].indexOf(data.bmBdaScanInfo.result) > -1 &&
                        [0, 2].indexOf(data.bsScanInfo.result) > -1
                    ) {
                        // 判断是否测量了肩部功能并且成功
                        if (data.shoulderJointEval === 1 && shoulderScanSucceed) {
                            // 在这里也要负载一次信息
                            let modelInfo = {
                                scanId: data.scanId,
                                memberId: data.memberId,
                                biaMeasure: data.biaMeasure,
                                staticEval: data.staticEval,
                                createTime: data.createTime,
                                evalStatus: data.bsScanInfo.result,
                                bdaStatus: data.bmBdaScanInfo.result,
                                shoulderEval: data.shoulderJointEval,
                                bsShoulderScanResult: data.bsShoulderScanInfo
                                    ? data.bsShoulderScanInfo.result
                                    : null,
                                scanMode: data.scanMode,
                                questionReport: data.questionReport,
                                nutrition: data.nutrition
                            }
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                            // 跳转到肩部详情页
                            this.jumpToMain(modelInfo)
                            // this.$router.push({
                            //     path: '/main'
                            // })
                        } else {
                            // 在这里调用历史数据接口函数
                            this.findScanTrueHistory()
                        }
                    } else if (
                        [-1, -10].indexOf(data.bmBdaScanInfo.result) > -1 ||
                        [-1, -10].indexOf(data.bsScanInfo.result) > -1
                    ) {
                        // 任意一个在合成中
                        this.$router.push({
                            path: '/modeling'
                        })
                    } else {
                        // 访问首页
                        // 存储数据
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            biaStatus: data.bmBiaScanInfo.result,
                            bdaStatus: data.bmBdaScanInfo.result,
                            evalStatus: data.bsScanInfo.result,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure,
                            scanMode: data.scanMode,
                            questionReport: data.questionReport,
                            nutrition: data.nutrition
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        this.jumpToReport(data.viewStatus)
                    }
                } else if (onlyShoulder) {
                    // 只做了肩部功能
                    // 判断肩部功能是否成功
                    if (shoulderScanSucceed) {
                        // 在这里也要负载一次信息
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            biaStatus: data.bmBiaScanInfo.result,
                            bdaStatus: data.bmBdaScanInfo.result,
                            evalStatus: data.bsScanInfo.result,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure,
                            scanMode: data.scanMode,
                            questionReport: data.questionReport, nutrition: data.nutrition
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        // 跳转到颈部详情页
                        this.jumpToMain(modelInfo)
                        // this.$router.push({
                        //     path: '/main'
                        // })
                    }
                }
            } else if (isVAPro5 || isVAPro5g2l || isVAPro5S) {
                // 处理vapro5跳转
                this.jumpPageForVapro5(data, onlyShoulder)
            } else {
                if (data.biaMeasure === 1 && data.staticEval === 0) {
                    // 体测
                    if ([0, 2].indexOf(data.bmBiaScanInfo.result) > -1) {
                        // 判断是否测量了肩部评估并且成功
                        if (data.shoulderJointEval === 1 && shoulderScanSucceed) {
                            // 在这里也要负载一次信息
                            let modelInfo = {
                                scanId: data.scanId,
                                memberId: data.memberId,
                                biaMeasure: data.biaMeasure,
                                staticEval: data.staticEval,
                                createTime: data.createTime,
                                shoulderEval: data.shoulderJointEval,
                                bsShoulderScanResult: data.bsShoulderScanInfo
                                    ? data.bsShoulderScanInfo.result
                                    : null,
                                girthMeasure: data.girthMeasure
                            }
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                            // 跳转到颈部详情页
                            this.jumpToMain(modelInfo)
                        } else {
                            this.findScanTrueHistory()
                        }
                    } else if (
                        [-1, -10].indexOf(data.bmBiaScanInfo.result) > -1
                    ) {
                        // 在合成中
                        this.$router.push({
                            path: '/modeling'
                        })
                    } else {
                        // 在这里也要负载一次信息
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            biaStatus: data.bmBiaScanInfo.result,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        this.jumpToReport(data.viewStatus)
                    }
                } else if (data.biaMeasure === 0 && data.staticEval === 1) {
                    // 体态
                    if ([-1, -10].indexOf(data.bsScanInfo.result) > -1) {
                        // 在合成中
                        this.$router.push({
                            path: '/modeling'
                        })
                    } else if (data.bsScanInfo.result === 1) {
                        // 在这里也要负载一次信息
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            evalStatus: data.bsScanInfo.result,
                            bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        this.jumpToReport(data.viewStatus)
                    } else {
                        // 判断是否测量了颈部评估并且成功
                        if (data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1) {
                            // 在这里也要负载一次信息
                            let modelInfo = {
                                scanId: data.scanId,
                                memberId: data.memberId,
                                biaMeasure: data.biaMeasure,
                                staticEval: data.staticEval,
                                createTime: data.createTime,
                                evalStatus: data.bsScanInfo.result,
                                bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                                shoulderEval: data.shoulderJointEval,
                                bsShoulderScanResult: data.bsShoulderScanInfo
                                    ? data.bsShoulderScanInfo.result
                                    : null,
                                girthMeasure: data.girthMeasure
                            }
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                            // 跳转到颈部详情页
                            this.jumpToMain(modelInfo)
                            // this.$router.push({
                            //     path: '/main'
                            // })
                        } else {
                            this.findScanTrueHistory()
                        }
                    }
                } else if (data.biaMeasure === 1 && data.staticEval === 1) {
                    // 体测 + 体态
                    // 两者都失败
                    if (
                        [0, 2].indexOf(data.bmBiaScanInfo.result) > -1 &&
                        [0, 2].indexOf(data.bsScanInfo.result) > -1
                    ) {
                        // 判断是否测量了肩部功能并且成功
                        if (data.shoulderJointEval === 1 && shoulderScanSucceed) {
                            // 在这里也要负载一次信息
                            let modelInfo = {
                                scanId: data.scanId,
                                memberId: data.memberId,
                                biaMeasure: data.biaMeasure,
                                staticEval: data.staticEval,
                                createTime: data.createTime,
                                evalStatus: data.bsScanInfo.result,
                                bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                                shoulderEval: data.shoulderJointEval,
                                bsShoulderScanResult: data.bsShoulderScanInfo
                                    ? data.bsShoulderScanInfo.result
                                    : null,
                                girthMeasure: data.girthMeasure
                            }
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                            // 跳转到肩部详情页
                            this.jumpToMain(modelInfo)
                            // this.$router.push({
                            //     path: '/main'
                            // })
                        } else {
                            // 在这里调用历史数据接口函数
                            this.findScanTrueHistory()
                        }
                    } else if (
                        [-1, -10].indexOf(data.bmBiaScanInfo.result) > -1 ||
                        [-1, -10].indexOf(data.bmBdaScanInfo.result) > -1 ||
                        [-1, -10].indexOf(data.bsScanInfo.result) > -1
                    ) {
                        // 任意一个在合成中
                        this.$router.push({
                            path: '/modeling'
                        })
                    } else {
                        // 访问首页
                        // 存储数据
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            biaStatus: data.bmBiaScanInfo.result,
                            bdaStatus: data.bmBdaScanInfo.result,
                            evalStatus: data.bsScanInfo.result,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        this.jumpToReport(data.viewStatus)
                    }
                } else if (onlyShoulder) {
                    // 只做了肩部功能
                    // 判断肩部功能是否成功
                    if (shoulderScanSucceed) {
                        // 在这里也要负载一次信息
                        let modelInfo = {
                            scanId: data.scanId,
                            memberId: data.memberId,
                            biaMeasure: data.biaMeasure,
                            staticEval: data.staticEval,
                            createTime: data.createTime,
                            biaStatus: data.bmBiaScanInfo.result,
                            bdaStatus: data.bmBdaScanInfo.result,
                            evalStatus: data.bsScanInfo.result,
                            shoulderEval: data.shoulderJointEval,
                            bsShoulderScanResult: data.bsShoulderScanInfo
                                ? data.bsShoulderScanInfo.result
                                : null,
                            girthMeasure: data.girthMeasure
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        // 跳转到颈部详情页
                        this.jumpToMain(modelInfo)
                        // this.$router.push({
                        //     path: '/main'
                        // })
                    }
                }
            }
        },

        // 查询测量数据
        async findScanTypeInfo() {
            const res = await this.$apollo.query({
                query: findScanTypeInfo,
                fetchPolicy: 'network-only'
            })
            console.log('>>>> [findScanTypeInfo] res.data.findScanTypeInfo.data:')
            console.log(res.data.findScanTypeInfo.data)
            const data = res.data.findScanTypeInfo.data
            window.localStorage.setItem('scanMode', JSON.stringify(data.scanMode))
            // 判断模型是否生成
            this.scanTypeHandler(data)
        },
        getMemberInfo() {
            this.$apollo
                .query({
                    query: getMemberInfo
                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    if (data && data.code === 200) {
                        window.localStorage.setItem('memberInfo', JSON.stringify(data.data))
                    }
                })
        },
        saveLoginInfo() {
            let loginInfo = {
                token: this.$route.query.token,
                expiresIn: this.$route.query.expiresIn,
                type: 'deviceLogin'
            }
            window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
            this.ifLogoCloudEnable(this.$route.query.device_id)
            this.getMemberInfo()
            this.findScanTypeInfo()
            // this.shareClick(this.$route.query.scan_id)
        },
        // vapro5跳转逻辑
        jumpPageForVapro5(data, onlyShoulder) {
            const measureProject = [data.biaMeasure, data.staticEval, data.girthMeasure]
            const measureProjectStatus = [
                data.bmBiaScanInfo ? data.bmBiaScanInfo.result : null,
                data.bsScanInfo ? data.bsScanInfo.result : null,
                data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null]
            const shoulderState = data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1
            // 是否有正在合成项目
            let synthesis = false
            // 计算总共测量项目
            let measureItem = 0
            // 统计失败项目
            let failureItem = 0
            for (let index = 0; index < measureProject.length; index++) {
                const item = measureProject[index]
                const status = measureProjectStatus[index]
                if (item === 1) {
                    // 只有测量项目参与
                    measureItem = measureItem + 1
                    if ([-1, -10].indexOf(status) > -1) {
                        // 此项正在合成中
                        synthesis = true
                    } else if ([0, 2].indexOf(status) > -1) {
                        // 测量失败
                        failureItem = failureItem + 1
                    }
                }
            }
            let modelInfo = {
                scanId: data.scanId,
                memberId: data.memberId,
                biaMeasure: data.biaMeasure, // 体成分是否测量
                staticEval: data.staticEval, // 体态是否测量
                girthMeasure: data.girthMeasure, // 体围是否测量
                shoulderEval: data.shoulderJointEval, // 肩部是否测量
                createTime: data.createTime,
                biaStatus: measureProjectStatus[0], // 体成分进度
                evalStatus: measureProjectStatus[1], // 体态进度
                bdaStatus: measureProjectStatus[2],    // 体围进度
                bsShoulderScanResult: data.bsShoulderScanInfo
                    ? data.bsShoulderScanInfo.result
                    : null,
                questionReport: data.questionReport,
                nutrition: data.nutrition,
                teenagerReport: data.teenagerReport,
                spineReport: data.spineReport,
                mpRecommend: data.mpRecommend,
                bsSpineStatus: data.bsSpineScanInfo ? data.bsSpineScanInfo.result : 0,
                isPillowRecommendReport: data.isPillowRecommendReport ? data.isPillowRecommendReport : 0
            }
            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))

            if (synthesis) {
                // 开启华住会模式，扫描进来先填写问卷页面
                this.checkPillowQuestion(modelInfo, () => {
                    // 在合成中
                    this.$router.push({
                        path: '/modeling'
                    })
                })
            } else if (failureItem === measureItem && !shoulderState) {
                // 全部失败
                this.findScanTrueHistory()
            } else {
                // 无合成项并且有成功项目
                if (modelInfo.evalStatus === 1 && modelInfo.staticEval === 1) {
                    this.jumpToReport(data.viewStatus)
                } else if (modelInfo.girthMeasure === 1 && modelInfo.bdaStatus === 1) {
                    // 体围成功直接进入modeling
                     // 开启华住会模式，扫描进来先填写问卷页面
                    this.checkPillowQuestion(modelInfo, () => {
                        // 在合成中
                        this.$router.push({
                            path: '/modeling'
                        })
                    })
                } else {
                    // 肩部和体成分不考虑 直接进入报告主页面
                    this.jumpToMain(modelInfo)
                }
            }


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

                    if (!info.data && !sessionStorage.getItem('isNewUser')) {
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
        // 跳转报告页
        jumpToReport(viewStatus) {
            // this.shareClick()
            this.$router.push({
                path: viewStatus === 1 ? window.localStorage.getItem('healthPackageEnable') === '2' ? '/main' : '/report' : '/modeling'
            })
        },
        // 跳转报告页
        jumpToMain(modelInfo) {
            this.shareClick(modelInfo.scanId)
            this.$router.push({
                path: '/main'
            })
        },

        // 中转页面发送消息
        async handleEnterMsg(newUser) {
            const res = await this.$apollo.query({
                query: findScanTypeInfo,
                fetchPolicy: 'network-only'
            })
            const data = res.data.findScanTypeInfo.data
            const scanTime = data.createTime
            console.log(`redirect_uri=${window.location.href + (newUser ? '&new_user=1' : '')}`)
            if (['36', '50', '51', '52'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-R%20Pro5&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else if (['M5'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-A%20Pro3&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else if (['M6'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-A%20Pro5&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else if (['M2'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-A%20Pro5&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else if (['N2'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-A%20Pro5&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else if (['M3'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-A%20Pro6&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else if (['M7'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-A%20Pro7&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else if (['N7'].includes(this.$route.query.device_id.slice(0, 2))) {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-A%20Pro7&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            } else {
                window.location.href = `${homepageUrl}/#/transfer?type=Visbody-R%20Pro3&scanTime=${scanTime}&redirect_uri=${encodeURIComponent(window.location.href + (newUser ? '&new_user=1' : ''))}`
            }
        },
        // 新用户引导
        newUserGuide(appId, scanId) {
            if (defaultAppId === appId) {
                window.localStorage.setItem('modelInfo', JSON.stringify({ scanId: scanId }))
                // 解决ios中部分版本微信不能长按识别二维码
                window.location.href = window.location.protocol + '//' + window.location.host + '/defaultGuide'
                // this.$router.push({
                //     path: '/defaultGuide'
                // })
            } else {
                // 缓存appId，在公众号引导页面使用
                window.sessionStorage.setItem('appId', appId)
                window.localStorage.setItem('modelInfo', JSON.stringify({ scanId: scanId }))
                // 扫码未绑定手机号转到公众号引导页面
                window.location.href = window.location.protocol + '//' + window.location.host + '/guide'
                // this.$router.push({
                //     path: '/guide'
                // })
            }
        },
        // 设置分享
        shareClick(scanId) {
            if (isWeiXin()) {
                const url = window.location.href.split('#')[0]
                const modelInfoObj = JSON.parse(window.localStorage.getItem('modelInfo'))
                const shareScanId = scanId ? scanId : (modelInfoObj ? modelInfoObj.scanId : '')
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
                            const domain = getDomainFromString(url)
                            console.log(`==========domain:  ${domain}`)
                            const shareUrl = `${domain}/shareAuth/shareCallBack?token=${signatureInfo.token}&scan_id=${shareScanId}`
                            console.log(`==========>url: ${url} ==========>scanId: ${scanId}  ==========>shareScanId: ${shareScanId} ======>shareUrl: ${shareUrl}`)
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
