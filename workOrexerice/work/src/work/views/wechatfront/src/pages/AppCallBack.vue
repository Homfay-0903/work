<template>
    <div class="page">
        <mt-spinner :size="50" color="rgb(100, 100, 100)" type="fading-circle" v-if="loading"></mt-spinner>
    </div>
</template>

<script>
import { appLogin, findLatestScanTypeInfo, findScanTrueHistory, findScanTypeInfo } from '@/assets/js/apolloGql.js'
import { getProductTypeByOrigin } from '@/assets/js/util.js'
import { isVAPro3, isVAPro5, isVAPro7 } from '@/types/device.js'
export default {
    data() {
        return {
            loading: true,
            scanType: null,
        }
    },
    created() {
        // 清除sessionStorage缓存数据，处理在electron中打开h5页面时，sessionStorage数据未清除问题
        window.sessionStorage.clear()
        window.sessionStorage.removeItem('compareData')
        window.localStorage.removeItem('logoCloudEnable')
        window.localStorage.removeItem('healthPackageEnable')
        window.localStorage.removeItem('isDeviceReport')
        const origin = location.origin
        console.log('当前请求域名', origin)
        const productType = getProductTypeByOrigin(origin)
        window.localStorage.setItem('productType', productType)
        window.localStorage.removeItem('modelInfo')
        // app登录
        window.sessionStorage.setItem('isAppLogin', 1)
        // 判断是否是PC版本的入口
        const isPcEntry = this.$route.path === '/appAuth/menuCallBackPc'
        window.sessionStorage.setItem('isPcReport', isPcEntry ? '1' : '0')
        // 非分享登录
        window.sessionStorage.setItem('isShare', 0)
        // 登录token
        const token = this.$route.query.token
        // 登录用户手机号
        const mobile = this.$route.query.mobile
        // 第三方唯一标识
        const thirdUid = this.$route.query.third_uid
        // 链接里携带的scanid 可为空
        const scanId = this.$route.query.scan_id || null
        console.log(scanId, 'app回调scanId')
        // 是否显示体型评估
        const physicalAssessment = this.$route.query.physical_assessment
        window.localStorage.setItem('physicalAssessment', physicalAssessment)

        console.log()
        // 是否显示侧边栏 不传则默认显示
        // const isShowMenu = this.$route.query.show_menu === 'false' ? false : true
        if (token && mobile && thirdUid) {
            // 是否显示侧边栏
            window.sessionStorage.setItem('setIsShowMenu', false)
            this.appLogin(token, mobile, thirdUid, scanId)
        } else {
            // 登录失败
            this.$router.push({
                path: '/exception/login',
            })
        }
    },
    methods: {
        appLogin(token, mobile, thirdUid, scanId) {
            this.$apollo
                .query({
                    query: appLogin,
                    fetchPolicy: 'network-only',
                    variables: {
                        token: token,
                        mobile: mobile,
                        thirdUid: thirdUid,
                    },
                })
                .then((res) => {
                    const data = res.data.appLogin
                    if (data.code === 200) {
                        // this.$toast({
                        //     message: data.message,
                        //     duration: 3000,
                        // })
                        if (data.data.healthPackageEnable === 2) {
                            document.title = '麦澜德佳澜 | Visbody'
                        }
                        window.localStorage.setItem('healthPackageEnable', data.data.healthPackageEnable)
                        // 保存登录信息
                        this.saveLoginInfo(data)
                        console.log(scanId, 'scanId')
                        if (scanId) {
                            // app对接新增 scanid 查询当前scanid的报告
                            this.findScanTypeInfo(scanId, data.data.mId)
                        } else {
                            // 获取最新一次扫描记录
                            this.findLatestScanTypeInfo()
                        }
                        // 数据统计
                        this.$hmt.trackEvent('login', 'appLogin')
                    } else if (data.code === 401) {
                        // 登录失败
                        this.$router.push({
                            path: '/exception/login',
                        })
                    } else if (data.code === 404) {
                        // 手机号无效
                        this.$router.push({
                            path: '/exception/report',
                        })
                    } else if (data.code === 403) {
                        // 权限不足
                        this.$router.push({
                            path: '/exception/perm',
                        })
                    } else if (data.code === 500) {
                        this.$router.push({
                            path: '/exception/login',
                        })
                    } else {
                        this.$toast({
                            message: data.message,
                            duration: 3000,
                        })
                    }
                    window.setTimeout(() => {
                        this.loading = false
                    }, 1500)
                })
        },
        // 两者都失败判断历史记录
        findScanTrueHistory() {
            this.$apollo
                .query({
                    query: findScanTrueHistory,
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    let history = res.data.findScanTrueHistory.data
                    if (!history) {
                        // 此处做一个跳转，为true跳转无数据页面
                        this.$router.push({
                            path: `/exception/result-no/${this.scanType}`,
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
                            questionReport: history.questionReport,
                            nutrition: history.nutrition,
                            teenagerReport: history.teenagerReport ? history.teenagerReport : 0,
                            mpRecommend: history.mpRecommend ? history.mpRecommend : 0,
                            spineReport: history.spineReport ? history.spineReport : 0,
                            bsSpineStatus: history.bsSpineStatus ? history.bsSpineStatus : 0
                        }
                        window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        // 如果只测量了颈部则直接跳转到首页
                        if (
                            modelInfo.biaStatus === 4 &&
                            modelInfo.evalStatus === 4 &&
                            modelInfo.bsShoulderScanResult === 1
                        ) {
                            this.$router.push({
                                path: '/main',
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
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        findScanTypeInfo(scanId, mId) {
            this.$apollo
                .query({
                    query: findScanTypeInfo,
                    fetchPolicy: 'network-only',
                    variables: {
                        scanId: scanId,
                    },
                })
                .then((res) => {
                    const info = res.data.findScanTypeInfo
                    if (info.code === 200) {
                        const data = info.data
                        if (mId === data.memberId) {
                            this.setModelData(data)
                        } else {
                            this.$toast({
                                message: "报告 id 错误，即将展示最新报告",
                                duration: 3000,
                            })
                            this.findLatestScanTypeInfo()
                        }
                    } else if (info.code === 404) {
                        this.findLatestScanTypeInfo()
                    }
            })
        },
        setModelData(data) {
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
                questionReport: data.questionReport ? data.questionReport : 0,
                nutrition: data.nutrition ? data.nutrition : 0,
                teenagerReport: data.teenagerReport ? data.teenagerReport : 0,
                mpRecommend: data.mpRecommend ? data.mpRecommend : 0,
                spineReport: data.spineReport ? data.spineReport : 0,
                bsSpineStatus: data.bsSpineScanInfo ? data.bsSpineScanInfo.result : 0
            }
            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
            const scanStatus = [
                modelInfo.biaStatus,
                modelInfo.bdaStatus,
                modelInfo.evalStatus,
                modelInfo.bsShoulderScanResult,
            ]
            this.scanType =
                data.biaMeasure === 1 && data.staticEval === 1 ? 3 : data.biaMeasure === 1 ? 1 : 2
            // 有合成中的项目
            if (
                scanStatus.indexOf(-1) > -1 ||
                scanStatus.indexOf(-10) > -1 ||
                (modelInfo.questionReport === 0 && modelInfo.nutrition === 1)
            ) {
                // 跳转到合成中
                this.$router.push({
                    path: '/modeling',
                    query: { scanId: data.scanId }
                })
            } else {
                // 所有测量项目都失败 无法生成报告 bda是否成功 不影响报告生成
                const reportStatus = [
                    modelInfo.biaStatus,
                    modelInfo.evalStatus,
                    modelInfo.bsShoulderScanResult,
                ]
                if (isVAPro3() || isVAPro5() || isVAPro7()) {
                    reportStatus.push(modelInfo.bdaStatus)
                }
                let scanNum = 0
                let errScanNum = 0
                reportStatus.forEach((item) => {
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
                    // 有至少有一项成功
                    // 如果只测量了颈部则直接跳转到首页
                    if (
                        modelInfo.biaStatus === 4 &&
                        modelInfo.evalStatus === 4 &&
                        modelInfo.bsShoulderScanResult === 1
                    ) {
                        this.$router.push({
                            path: '/main',
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
            }
        },
        // 判断模型是否生成
        findLatestScanTypeInfo() {
            this.$apollo
                .query({
                    query: findLatestScanTypeInfo,
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const info = res.data.findLatestScanTypeInfo
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
                        this.setModelData(data)
                    } else if (info.code === 404) {
                        // 当前账号下没有报告
                        this.$router.push({
                            path: '/exception/report',
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        saveLoginInfo(data) {
            let loginInfo = {
                token: data.data.token,
                expiresIn: data.data.expiresIn,
                type: 'appLogin',
            }
            window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
            let logoCloudEnable = data.data.logoCloudEnable
            console.log(`获取当前数据${logoCloudEnable}`)
            window.localStorage.setItem('logoCloudEnable', logoCloudEnable)
            if (logoCloudEnable === 1) {
                document.title = 'Visbody'
            }
        },
    },
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
