<!-- eslint-disable vue/no-parsing-error -->
<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-07-21 10:22:05
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-19 15:59:11
 * @FilePath: \vr-pro3-report-frontend\src\pages\main.vue
 * @Description:
-->
<template>
    <div class="main" v-if="!errorMsg && allowLoading" v-cloak>
        <!-- 体围评估报告 体围成功显示 -->
        <span :ch="getPageNum('start')"></span>
        <div v-if="showNutritionReport()" class="page" index="0">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo" :type="6"></report-header>
            <nutrition-report :reportInfo="reportInfo" :memberInfo="memberInfo"></nutrition-report>
            <pagination :num="pageNum('girthR')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- 身体成分报告 bia成功显示  -->
        <div v-if="reportInfo.biaStatus === 1 && !deviceVApro5 && !deviceVALit6 && (showReportMode('001') || showReportMode('002') || showReportMode('003') || showReportMode('011'))"
            class="page" index="1">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo"></report-header>
            <bm-report :showCell="showReportMode('002') || showReportMode('001')" :isTangCenBei="showReportMode('011')"
                :reportInfo="reportInfo" :memberInfo="memberInfo"></bm-report>
            <pagination :ch="() => getPageNum()"></pagination>
        </div>
        <!-- VALit6 身体成分报告 -->
        <div v-if="reportInfo.biaStatus === 1 && deviceVALit6 && (showReportMode('001') || showReportMode('002') || showReportMode('003') || showReportMode('011'))"
            class="page" index="1">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo"></report-header>
            <bm-report-valit6 :isTangCenBei="showReportMode('011')"
                :reportInfo="reportInfo" :memberInfo="memberInfo"></bm-report-valit6>
            <pagination :ch="() => getPageNum()"></pagination>
        </div>
        <!-- 体成分报告 && (showReportMode('001')||showReportMode('002')||showReportMode('003'))-->
        <div v-if="reportInfo.biaStatus === 1 && deviceVApro5" class="page" index="2">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo" :type="7"></report-header>
            <bm-report-m :reportInfo="reportInfo" :memberInfo="memberInfo" :athlete="athlete"> </bm-report-m>
            <pagination :num="pageNum('mass')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- vapro7 体成分+体围一页报告 -->
        <div v-if="reportInfo.biaStatus === 1 && deviceVApro7 && showReportMode('014')" class="page" index="3">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo" :type="1"></report-header>
            <bm-report-vapro7 :reportInfo="reportInfo" :memberInfo="memberInfo" :girthShowNumber="girthShowNumber">
            </bm-report-vapro7>
            <pagination :num="pageNum('mass')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- 体态评估报告 体态成功显示 -->
        <div v-if="reportInfo.evalStatus === 1 && (showReportMode('005') || showReportMode('004') || showReportMode('010') || showReportMode('012') || showReportMode('015')) && !deviceVApro7 && healthPackageEnable !== 2"
            class="page" index="4">
            <report-header :showWeight="showReportMode('007') && !notShowWeight" :reportInfo="reportInfo" :type="2"></report-header>
            <bs-report :reportInfo="reportInfo" :isTangCenBei="showReportMode('012')"
                :showGirth="(showReportMode('004') && !deviceVRpro5 && !deviceVRpro5ARM) || showReportMode('012')" :deviceVApro5="deviceVApro5"
                :deviceVApro3="deviceVApro3" :deviceVApro6="deviceVApro6" :deviceVALit6="deviceVALit6" :deviceVRpro3="deviceVRpro3" :deviceVRpro5="deviceVRpro5"
                :deviceVRpro5ARM="deviceVRpro5ARM" :memberInfo="memberInfo"
                :isShowFree="reportMode.indexOf('010') > -1 && !!reportInfo.scanMode"></bs-report>
            <pagination :num="pageNum('shape')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- vapro7 体态评估报告 体态成功显示 -->
        <div v-if="reportInfo.evalStatus === 1 && (showReportMode('005')) && deviceVApro7" class="page" index="5">
            <report-header :showWeight="showReportMode('007') && !notShowWeight" :reportInfo="reportInfo" :type="2"></report-header>
            <bs-report-vapro7 :reportInfo="reportInfo" :isTangCenBei="showReportMode('012')"
                :showGirth="(showReportMode('004') || showReportMode('012'))" :memberInfo="memberInfo"
                :isShowFree="reportMode.indexOf('010') > -1 && reportInfo.scanMode"></bs-report-vapro7>
            <pagination :num="pageNum('shape')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- 体围评估报告 体围成功显示 -->
        <div v-if="reportInfo.bdaStatus === 1 && (showReportMode('006') || (showReportMode('004') && (deviceVRpro5 || deviceVRpro5ARM)) || (showReportMode('014') && deviceVApro7 && girthShowNumber === 1 || (showReportMode('015') && ((deviceVApro7 && girthShowNumber === 1) || deviceVApro6 || deviceVALit6))))"
            class="page" index="6">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo" :type="5"></report-header>
            <girth-report :reportInfo="reportInfo" :memberInfo="memberInfo" :deviceVApro5="deviceVApro5" :deviceVApro6="deviceVApro6" :deviceVALit6="deviceVALit6"
                :deviceVApro3="deviceVApro3" :healthPackageEnable="healthPackageEnable"></girth-report>
            <pagination :num="pageNum('girth')" :ch="() => getPageNum()"></pagination>
        </div>
        <div v-if="reportInfo.bdaStatus === 1 && showReportMode('006') && healthPackageEnable === 2 && iswaistData"
            class="page" index="7">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo" :type="8"></report-header>
            <waist-report :reportInfo="reportInfo" :memberInfo="memberInfo"
                :healthPackageEnable="healthPackageEnable"></waist-report>
            <pagination :num="pageNum('waist')" :ch="() => getPageNum()"></pagination>
        </div>
        <div v-if="reportInfo.evalStatus === 1 && (showReportMode('005') || showReportMode('004') || showReportMode('010') || showReportMode('012')) && !deviceVApro7 && healthPackageEnable === 2"
            class="page" index="7">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo" :type="2"></report-header>
            <bs-report :reportInfo="reportInfo" :isTangCenBei="showReportMode('012')"
                :showGirth="(showReportMode('004') || showReportMode('012'))" :deviceVApro5="deviceVApro5"
                :deviceVApro3="deviceVApro3" :deviceVRpro3="deviceVRpro3" :deviceVRpro5="deviceVRpro5"
                :deviceVRpro5ARM="deviceVRpro5ARM" :memberInfo="memberInfo"
                :isShowFree="reportMode.indexOf('010') > -1 && reportInfo.scanMode"></bs-report>
            <pagination :num="pageNum('shape')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- 脊椎 -->
        <!-- <div v-if="reportInfo.bsSpineStatus === 1" class="page">
            <report-header :reportInfo="reportInfo" :type="4"></report-header>
            <bs-spine-report :hideQrCode="true" :reportInfo="reportInfo" :memberInfo="memberInfo"></bs-spine-report>
            <pagination :num="pageNum('shapeSpine')"></pagination>
        </div> -->
        <!-- 肩关节评估报告 肩关节成功显示 -->
        <div v-if="reportInfo.bsShoulderStatus === 1 && (showReportMode('009') || showReportMode('013'))" class="page"
            index="9">
            <report-header :showWeight="showReportMode('007')" :reportInfo="reportInfo" :type="3"></report-header>
            <shoulder-report :isTangCenBei="showReportMode('013')" :reportInfo="reportInfo"
                :memberInfo="memberInfo"></shoulder-report>
            <pagination :num="pageNum('shoulder')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- 脊柱 体态评估测量报告 体态评估测量成功显示 ===外包 -->
        <!-- 需要等待reportInfo响应才能渲染，否则会缺少头数据 -->
        <!-- 脊柱专项报告是CMDB可控的，reportInfo.spineReport === 1 && reportInfo.bsSpineStatus === 1 ==> 打开脊柱报告开关，并且合成完成 -->
        <div v-if="showReportMode('007') && reportInfo.spineReport === 1 && reportInfo.bsSpineStatus === 1" class="page"
            index="10">
            <report-header :showWeight="showReportMode('007') && !notShowWeight" :reportInfo="reportInfo" :type="9"></report-header>
            <female-report :reportInfo="reportInfo" :memberInfo="memberInfo"></female-report>
            <pagination :num="pageNum('spineReport')" :ch="() => getPageNum()"></pagination>
        </div>
        <!-- 脊柱 体态评估测量报告 体态评估测量成功显示 ===外包 -->
        <!-- 需要等待reportInfo响应才能渲染，否则会缺少头数据 -->
        <!-- 脊柱专项报告是CMDB可控的，reportInfo.spineReport === 1 && reportInfo.bsSpineStatus === 1 ==> 打开脊柱报告开关，并且合成完成 -->
        <div v-if="showReportMode('007') && reportInfo.spineReport === 1 && reportInfo.bsSpineStatus === 1 && reportInfo.teenagerReport === 1 && memberInfo.memberAge <= 18"
            class="page" index="11">
            <report-header :reportInfo="reportInfo" :type="10" :showWeight="false"></report-header>
            <youngSpecialReport :reportInfo="reportInfo" :memberInfo="memberInfo"></youngSpecialReport>
            <pagination :num="pageNum('spineReport')" :ch="() => getPageNum()"></pagination>
        </div>
    </div>
    <div class="error-msg" v-else>{{ errorMsg }}</div>
</template>

<script>
import { findScanAdditionalInfo, getMemberInfo, findUserInfoByScanId, bmwaistContrasInfo } from '@/assets/js/apolloGql.js'

import ReportHeader from '@/components/Header'
import Pagination from '@/components/Pagination'
import BsReport from '@/pages/report/bsReport'
import BsSpineReport from '@/pages/report/bsSpineReport'
import BmReportM from '@/pages/report/bmReportM'
import BmReportVapro7 from '@/pages/report/bmReport-vapro7'
import BsReportVapro7 from '@/pages/report/bsReport-vapro7'
import BmReport from '@/pages/report/bmReport'
import BmReportValit6 from '@/pages/report/bmReport-valit6'
import ShoulderReport from '@/pages/report/shoulderReport'
import waistReport from './report/waistReport.vue'
import girthReport from './report/girthReport.vue'
import femaleReport from '@/pages/report/femaleReport.vue'
import youngSpecialReport from './report/youngSpecialReport.vue'
import { isVAPro3, isVAPro5, isVRPro3, isVRPro5, isVRPro5ARM, isVAPro7, isVAPro6, isVALite6 } from '@/types/device.js'
import nutritionReport from './report/nutrition-report.vue'
export default {
    name: 'Main',
    components: {
        ReportHeader,
        Pagination,
        BsReport,
        BsSpineReport,
        BmReport,
        BmReportValit6,
        ShoulderReport,
        girthReport,
        nutritionReport,
        BmReportM,
        BmReportVapro7,
        BsReportVapro7,
        waistReport,
        femaleReport,
        youngSpecialReport,
    },
    data() {
        return {
            reportInfo: {
                // bdaStatus: 1,
                // biaStatus: 1,
                // evalStatus: 0,
                // memberId: 12080,
                // scanId: 'upload01011804080213-bfb18d52-bcd9-11e8-8e5e-2cfda1b910e1_6',
                // scanTime:"2018-10-10 03:37:11",
            },
            scanId: '',
            errorMsg: '',
            memberInfo: {},
            deviceVApro3: false,
            deviceVApro5: false,
            deviceVApro6: false,
            deviceVApro7: false,
            deviceVRpro3: false,
            deviceVRpro5: false,
            deviceVRpro5ARM: false,
            deviceVALit6: false,
            reportMode: [],
            girthShowNumber: 0,
            healthPackageEnable: 0,
            iswaistData: false,
            // 页码
            pageNumberNew: 0,
            // 允许加载 ,所有报告的显隐标准加载完成，再统一加载
            allowLoading: false,
            // 状态加载集
            statusHub: {
                // 查询扫描状态 reportInfo index: 1(无电流营养分析报告) 2(身体成分报告)
                findScanAdditionalInfo: 0,
                // 获取扫描用户信息
                getMemberInfo: 0,
                // 用户信息
                findUserInfoByScanId: 0,
                // 体围加载 index: 7(腰腹围度测量报告)
                bmwaistContrasInfo: 0,
            },
            athlete: 0
        }
    },
    computed: {
        showReportMode() {
            return code => this.reportMode.length === 0 || this.reportMode.indexOf(code) > -1
        },
        // vapro5 不测体围不显示title
        notShowWeight() {
            if (this.deviceVApro5) {
                if (this.reportInfo.bdaStatus === 1) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        }
    },
    created() {
        this.paraMeter()
        document.fonts.ready.then(() => {
            // 字体加载完成后的逻辑
            console.log('FONT_OVER')
        })
    },
    mounted() {
        this.deviceVApro3 = isVAPro3(this.scanId)
        this.deviceVApro5 = isVAPro5(this.scanId)
        this.deviceVApro6 = isVAPro6(this.scanId)
        this.deviceVApro7 = isVAPro7(this.scanId)
        this.deviceVRpro3 = isVRPro3(this.scanId)
        this.deviceVRpro5 = isVRPro5(this.scanId)
        this.deviceVALit6 = isVALite6(this.scanId)
        this.deviceVRpro5ARM = isVRPro5ARM(this.scanId)
        this.getMemberInfo()
        this.findUserInfoByScanId()
        // this.findUserInfo() 不存在的方法
    },
    methods: {
        // !!!!!!!!!!!!!!!!!!!!!   新增报告注意   新增报告注意 新增报告注意 新增报告注意 新增报告注意 新增报告注意 新增报告注意 新增报告注意 新增报告注意
        // !!!!!!!!!!!!!!!!!!!!!
        // !!!!!!!!!!!!!!!!!!!!!   由于页码展示的优化，必须等待报告全部加载出来之后，才能渲染，否则会导致页码错乱
        // !!!!!!!!!!!!!!!!!!!!!   ==》 如果新的报告需要请求亲的接口，因为异步不知道什么时候加载成功，请在statusHub中记录，当加载完成时修改它
        changeReportLoadingStatus(name, status) {
            this.statusHub[name] = status
            if (!Object.keys(this.statusHub).some(i => this.statusHub[i] === 0)) {
                this.allowLoading = true
            }
        },
        paraMeter() {
            const url = window.location.search.split('?')[1].split('&')
            let pointInfo = {}
            url.forEach(el => {
                let key = el.split('=')[0]
                let val = el.substring(el.indexOf('=') + 1)
                pointInfo[key] = val
            })
            if (pointInfo['scanId']) {
                this.scanId = pointInfo['scanId']
                this.findScanAdditionalInfo()
            } else {
                this.errorMsg = '参数无效'
            }
        },
        // 查询扫描状态
        async findScanAdditionalInfo() {
            await this.$apollo
                .query({
                    query: findScanAdditionalInfo,
                    variables: {
                        scanId: this.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.findScanAdditionalInfo
                    let reportData = info.data
                    if (info.code === 200) {
                        localStorage.setItem('report_mode', info.data.reportMode)
                        this.athlete = info.data.athlete
                        this.reportMode = info.data.reportMode ? info.data.reportMode.split(',') : []
                        if (this.isScaningReport(reportData)) {
                            this.errorMsg = '数据生成中'
                        } else if (this.isfailureReport(reportData)) {
                            this.errorMsg = '数据生成失败'
                        } else {
                            this.reportInfo = reportData
                            this.getWaistContrasInfo()
                            if (reportData.biaStatus !== 1) {
                                console.log('MASS_REPORT_OVER')
                            }
                            if (reportData.evalStatus !== 1) {
                                console.log('SHAPE_REPORT_OVER')
                            }
                            if (reportData.bsShoulderStatus !== 1) {
                                console.log('SHOULDER_REPORT_OVER')
                            }
                            if (reportData.bsSpineStatus !== 1) {
                                console.log('SPINE_REPORT_OVER')
                            }
                        }
                        this.changeReportLoadingStatus('findScanAdditionalInfo', 1)
                    } else if (info.code === 404) {
                        this.errorMsg = '扫描相关信息数据不存在'
                        this.changeReportLoadingStatus('findScanAdditionalInfo', 2)
                    }
                })
                .catch(err => {
                    this.changeReportLoadingStatus('findScanAdditionalInfo', -1)
                    console.log(err)
                })
        },
        async findUserInfoByScanId() {
            await this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findUserInfoByScanId.data
                    this.girthShowNumber = data.girthShowNumber
                    this.healthPackageEnable = data.healthPackageEnable
                    this.changeReportLoadingStatus('findUserInfoByScanId', 1)
                    console.log('GIRTH_SHOW_NUMBER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>++++++++++++++++++++++++++++++++++++++++++++++++++', this.girthShowNumber)
                })
                .catch(err => {
                    this.changeReportLoadingStatus('findUserInfoByScanId', -1)
                    console.log(err)
                })
        },
        // 获取扫描用户信息
        async getMemberInfo() {
            const userInfo = {
                scanId: this.scanId
            }
            await this.$apollo
                .query({
                    query: getMemberInfo,
                    variables: userInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    if (data.code === 200) {
                        this.memberInfo = data.data
                        console.log('memberinfo', this.memberInfo)
                    }
                    this.changeReportLoadingStatus('getMemberInfo', 1)
                })
                .catch(err => {
                    this.changeReportLoadingStatus('getMemberInfo', -1)
                    console.log(err)
                })
        },
        // 报告是否合成中 不可查看
        isScaningReport(info) {
            return (
                ['-1', '-10'].indexOf(info.biaStatus) > -1 ||
                ['-1', '-10'].indexOf(info.bdaStatus) > -1 ||
                ['-1', '-10'].indexOf(info.evalStatus) > -1
            )
        },
        /**
         * 报告是否失败 不可查看
         * 所有已测量项目都失败(0/2) bda是否成功不影响报告查看
         */
        isfailureReport(info) {
            const scanStatus = [info.biaStatus, info.evalStatus, info.bsShoulderStatus]
            if (this.deviceVApro3 || this.deviceVApro5) {
                scanStatus.push(info.bdaStatus)
            }
            let scanNum = 0
            let errScanNum = 0
            scanStatus.forEach(item => {
                if (item !== 4) {
                    scanNum++
                }
                if ([0, 2].indexOf(item) > -1) {
                    errScanNum++
                }
            })
            return scanNum === errScanNum
        },
        /**
         * 计算报告页码
         * @param {String} key 报告key mass shape neck shoulder
         */
        pageNum(key) {
            let params = {
                mass: 1,
                shape: 2,
                shapeSpine: 3,
                shoulder: 4,
                spineReport: 5,
                shapeSpineYoung: 6,
            }
            let scanStatus = [this.reportInfo.biaStatus, this.reportInfo.evalStatus, this.reportInfo.bsSpineStatus, this.reportInfo.bsShoulderStatus]
            if (this.deviceVApro3 || this.deviceVApro5 || this.deviceVApro7) {
                params = {
                    mass: 1,
                    shape: 2,
                    girth: 3,
                    shapeSpine: 4,
                    shoulder: 5,
                    spineReport: 6,
                    shapeSpineYoung: 7,
                }
                scanStatus = [this.reportInfo.biaStatus, this.reportInfo.evalStatus, this.reportInfo.bdaStatus, this.reportInfo.bsSpineStatus, this.reportInfo.bsShoulderStatus]
                if (this.reportInfo.scanMode === 1 && (this.reportInfo.nutrition === 0 || this.reportInfo.nutrition === 1)) {
                    params = {
                        mass: 1,
                        girthR: 2,
                        shape: 3,
                        girth: 4,
                        shapeSpine: 5,
                        shoulder: 6,
                        spineReport: 7,
                        shapeSpineYoung: 8,
                    }
                    // 产康模式 体围放第一位
                    scanStatus = [this.reportInfo.biaStatus, this.reportInfo.bdaStatus, this.reportInfo.evalStatus, this.reportInfo.bdaStatus, this.reportInfo.bsSpineStatus, this.reportInfo.bsShoulderStatus]
                    if (this.deviceVApro5) {
                        params = Object.assign({}, params, { girthR: 1, mass: 2 })
                        scanStatus = [this.reportInfo.bdaStatus, this.reportInfo.biaStatus, this.reportInfo.evalStatus, this.reportInfo.bdaStatus, this.reportInfo.bsSpineStatus, this.reportInfo.bsShoulderStatus]
                    }
                }
            }
            if (this.healthPackageEnable === 2) {
                params = {
                    girth: 1,
                    waist: 2,
                    shape: 3,
                }
                scanStatus = [this.reportInfo.bdaStatus, this.reportInfo.bdaStatus, this.reportInfo.evalStatus]
            }
            const beforeScan = scanStatus.slice(0, params[key] - 1)
            // console.log(beforeScan, 'beforeScan=>')
            let scanNum = 0
            beforeScan.forEach((item, idx) => {
                // console.log(`当前页码${item} ${key}`)
                if (item === 1) {
                    scanNum++
                }
            })
            return scanNum + 1
        },
        showNutritionReport() {
            if (this.reportInfo && this.reportInfo.nutrition === 0) {
                return this.reportInfo.bdaStatus === 1 && this.reportInfo.scanMode === 1
            }
            return this.reportInfo.nutrition === 1 && this.reportInfo.bdaStatus === 1 && this.reportInfo.scanMode === 1
        },
        async getWaistContrasInfo() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime,
            }
            // console.log(1112233344, JSON.stringify(this.reportInfo))
            await this.$apollo
                .query({
                    query: bmwaistContrasInfo,
                    variables: userInfo,
                })
                .then((res) => {
                    const info = res.data.bmwaistContrasInfo
                    if (info.code === 200 && info.data.latestBmWaist !== null) {
                        this.iswaistData = true
                        this.changeReportLoadingStatus('bmwaistContrasInfo', 1)
                    } else {
                        this.changeReportLoadingStatus('bmwaistContrasInfo', 2)
                    }
                })
        },
        getPageNum(type = 'default') {
            if (type === 'start') {
                return 0
            } else if (type === 'default') {
                ++this.pageNumberNew
                return this.pageNumberNew
            } else if (type === 'end') {
                ++this.pageNumberNew
                return this.pageNumberNew
            }
        }
    }
}
</script>
<style lang="less" scoped>
.main {
    width: 949px;
    margin: 0 auto;

    .page {
        position: relative;
        height: 1278px;
        padding: 39px 43px 25px 43px;
        overflow: hidden;
        // background: #e2e2e2;
    }
}
</style>
<style lang="less">
// 表格统一样式
table {
    width: 100%;
    border: none;
    border-spacing: 0;
    border-collapse: collapse;
    table-layout: fixed;

    thead {
        line-height: 22px;
        background: #f2f8ff;

        tr {
            border: 1px solid #009fe8;
            height: 30px;

            th {
                font-size: 12px;
                font-family: OPPOSans M;
                font-weight: normal;
                color: #666666;
                border: none;
            }
        }
    }

    tbody {
        tr {
            td {
                position: relative;
                height: 30px;
                border-color: transparent;

                .name {
                    margin: 0 0 0 6px;
                    font-size: 15px;
                    font-family: OPPOSans M;
                    font-weight: normal;
                    color: #333333;
                    line-height: 20px;
                    font-weight: 500;
                }

                em {
                    font-size: 12px;
                    font-family: OPPOSans R;
                    font-weight: normal;
                    font-style: normal;
                    color: #666666;
                    line-height: 16px;
                }

                .val {
                    font-size: 12px;
                    // TODO:字体
                    font-family: OPPOSans M;
                    font-weight: normal;
                    color: #5698f5;
                    line-height: 19px;
                }

                .limits {
                    font-size: 12px;
                    font-family: OPPOSans R;
                    font-weight: normal;
                    color: #999999;
                    line-height: 16px;
                }

                .status {
                    display: inline-block;
                    width: 52px;
                    height: 19px;
                    font-size: 11px;
                    font-family: OPPOSans R;
                    font-weight: normal;
                    color: #5698f5;
                    line-height: 19px;
                }

                .status-item {
                    .status {
                        position: absolute;
                        right: 0;
                    }
                }

                &:not(:first-of-type) {
                    text-align: center;
                }

                &:first-of-type {
                    width: 112px;
                    border-left-color: #009fe8;
                }

                &:last-of-type {
                    border-right-color: #009fe8;
                }
            }

            &:last-of-type {
                td {
                    border-bottom-color: #009fe8;
                }
            }

            &:first-of-type {
                td {
                    border-top-color: #009fe8;
                }
            }
        }
    }
}

// 边框table
.thead-line {
    table {
        thead {
            tr {
                th {
                    &:nth-of-type(2) {
                        border-left: 1px solid #009fe8;
                    }

                    &:nth-of-type(2),
                    &:nth-of-type(3) {
                        width: 81px;
                        border-right: 1px solid #009fe8;
                    }

                    &:nth-of-type(4) {
                        width: 81px;
                        border-right: 1px solid #009fe8;
                    }

                    &:nth-of-type(5) {
                        width: 42px;
                    }
                    &:nth-of-type(6) {
                        text-align: left;
                    }
                }
            }
        }
        tbody {
            tr {
                td {
                    &:nth-of-type(3) {
                        text-align: left;
                    }
                }
            }
        }
    }
}

.tbody-line {
    table {
        tbody {
            tr {
                td {
                    border-color: #dedede;

                    &:first-of-type {
                        border-left-color: #009fe8;
                    }

                    &:last-of-type {
                        border-right-color: #009fe8;
                    }
                }

                &:last-of-type {
                    td {
                        border-bottom-color: #009fe8;
                    }
                }

                &:first-of-type {
                    td {
                        border-top-color: #009fe8;
                    }
                }
            }
        }
    }
}
</style>
