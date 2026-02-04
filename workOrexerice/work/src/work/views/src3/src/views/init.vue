<!--
 * @Description: 应用启动初始化页 - 初始化成功后跳转到设备开机
 * @Author: WendyGao
 * @Date: 2022-02-14 14:54:55
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-29 17:06:54
-->
<template>
    <div class="init"></div>
</template>

<script>
import localConfig from '@/config/local'
import { EventBus } from '@/util/event-bus'
import { mapGetters, mapActions } from 'vuex'
import { _clientCpu, readFile, readRamFile } from '@/util'
import SocketService from '@/socket/socket-service'
import CONFIG from '@/config/index'
export default {
    name: 'Init',
    data() {
        return {
            timer: null // 处理硬件服务grpc链路异常，无法上报硬件服务
        }
    },
    computed: {
        ...mapGetters(['deviceInfo', 'extServices']),
        hwServices() {
            return this.extServices.find((item) => item.name === 'hardware')
        }
    },
    watch: {
        hwServices: {
            handler(val, oldVal) {
                if (oldVal && oldVal.ready === 0 && val.ready === 1) {
                    // 请求开屏
                    this.cleatTimer()
                    this.$hardwareClient.screenCtrl(1)
                }
            },
            deep: true
        }
    },
    created() {
        window.logger.info('进入开机初始化页面')
        setTimeout(() => {
            window.logger.info('延迟3秒初始化所有服务状态')
            // 初始化所有外部服务状态
            this.initExtServices()
            // 初始化本地设置
            this.initSetup()
            // 初始化设备信息
            this.initDevice()
        }, 8000)
        _clientCpu()
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            // 屏幕状态改变
            if (type === 'ScreenStatus') {
                if (data === 1) {
                    // 保证开机动画完整性 延迟3s
                    setTimeout(() => {
                        // 当前设备状态
                        const status = this.deviceInfo.status
                        // 如果设备正常或回滚失败 则播放开机动画（回滚失败开机动画后提醒）
                        if ([1, 2].indexOf(status) !== -1) {
                            // 跳转到开机动画页面
                            readFile().then((res) => {
                                if (res === true) {
                                    readRamFile().then((ress) => {
                                        // 客户端卡死
                                        if (ress) {
                                            // 对状态通知服务进行websocket的连接
                                            SocketService.Instance.connect(
                                                `ws://${CONFIG.SERVICE.STATUS_HTTP_ADDR}/ws?device_id=${this.deviceInfo.deviceId}`
                                            )
                                            window.logger.info(
                                                'websocket连接_vf_healthPackageEnable',
                                                localConfig.getItem('_vf_healthPackageEnable'),
                                                this.deviceInfo.deviceType
                                            )
                                            if (
                                                localConfig.getItem('_vf_logo_url') &&
                                                this.deviceInfo.deviceType === 5
                                            ) {
                                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                                    logoUrl: localConfig.getItem('_vf_logo_url')
                                                })
                                            }

                                            if (
                                                localConfig.getItem('_vf_beauty_enable') &&
                                                this.deviceInfo.deviceType === 3
                                            ) {
                                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                                    beautyEnable: localConfig.getItem('_vf_beauty_enable')
                                                })
                                            }

                                            if (
                                                localConfig.getItem('_vf_teenager_open') &&
                                                this.deviceInfo.deviceType === 5
                                            ) {
                                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                                    teenagerIsOpen: localConfig.getItem('_vf_teenager_open')
                                                })
                                            }
                                            if (
                                                localConfig.getItem('_vf_spine_report_open') &&
                                                this.deviceInfo.deviceType === 5
                                            ) {
                                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                                    spineReportEnabled: localConfig.getItem('_vf_spine_report_open')
                                                })
                                            }
                                            if (
                                                localConfig.getItem('_vf_healthPackageEnable') === 2 &&
                                                this.deviceInfo.deviceType === 5
                                            ) {
                                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                                    healthPackageEnable: 2
                                                })
                                                window.logger.info(
                                                    'healthPackageEnable',
                                                    this.deviceInfo.healthPackageEnable
                                                )
                                                this.$store.commit('CHANGE_SETTING_INFO', {
                                                    deviceMode: 1
                                                })
                                            }

                                            // 是否开启了体围 + 体态 + 体重 三项合一测量
                                            if (localConfig.getItem('_vf_spine_report_open')) {
                                                this.$store.commit('CHANGE_SETTING_INFO', {
                                                    combineMeasureEnable: localConfig.getItem('_vf_spine_report_open')
                                                })
                                            }
                                            // 是否满足三项合一测量的值
                                            if (localConfig.getItem('_vf_tri_mode')) {
                                                this.$store.commit('CHANGE_SETTING_INFO', {
                                                    triMode: localConfig.getItem('_vf_tri_mode')
                                                })
                                            }
                                            this.$changeViewPage('Home', { error: 1 })
                                        } else {
                                            this.$changeViewPage('DeviceSwitch', { type: 'on' })
                                        }
                                    })
                                } else {
                                    this.$changeViewPage('DeviceSwitch', { type: 'on' })
                                }
                            })
                        } else {
                            // 其他状态 直接反馈（更新成功、更新失败状态）
                            if (status === 3) {
                                this.$store.commit('CHANGE_UPDATE_INFO', {
                                    updStatus: 2
                                })
                                this.$changeViewPage('UpdateClient')
                            } else {
                                this.$store.commit('CHANGE_UPDATE_INFO', {
                                    rollBackStatus: 0
                                })
                                this.$changeViewPage('RollBackClient')
                            }
                        }
                    }, 3000)
                }
            }
        })
    },
    methods: {
        ...mapActions(['initExtServices']),
        async initDevice() {
            // 一
            // 1. 从更新服务中获取是否有上次更新状态
            // 2. 从控制服务中获取设备信息 - id、mac地址
            // 3. 设置开屏
            // 4. 开屏响应后延迟3s
            // 5.1 如果设备更新状态正常或回滚失败 - 播放开机动画
            // 5.2 如果设备更新成功或更新失败 - 跳转到更新页对应状态 - 等待更新重启
            // 二
            // 1. 初始化本地用户配置 - 存储至store
            const deviceInfo = await this.$controlClient.deviceInfo()
            // 获取设备更新状态
            const updateStatus = await this.$updateClient.deviceStatus()
            const devicePre = deviceInfo.deviceId.substring(0, 2)
            const deviceTypes = {
                35: 1,
                37: 2,
                M0: 3,
                M1: 3,
                N1: 3,
                M5: 4,
                M6: 5,
                M2: 5,
                N2: 5
            }
            const deviceType = deviceTypes[devicePre]
            window.logger.info('判断设备类型' + deviceType)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                deviceId: deviceInfo.deviceId,
                volume: deviceInfo.volume,
                mac: deviceInfo.macId,
                status: updateStatus.status,
                // 判断是不是vr3.0设备
                operationMode: ['36', '37', '39', '50', 'N2', 'N1'].includes(devicePre) ? 1 : 2,
                // 判断设备类型
                deviceType
            })

            // 报告绑定方式
            const reportBindTypeKey = '_vf_report_bind_type'
            const reportBindType = localConfig.getItem(reportBindTypeKey)
            if (reportBindType === null || reportBindType === '') {
                // 出厂设置 默认序列号绑定
                if (deviceType === 5) {
                    localConfig.setItem(reportBindTypeKey, 2)
                } else {
                    localConfig.setItem(reportBindTypeKey, 1)
                }
            } else {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    reportbindType: parseInt(reportBindType, 10)
                })
            }

            this.$store.commit('CHANGE_SETTING_INFO', {
                reportbindType:
                    deviceType === 0
                        ? 2
                        : localConfig.getItem('_vf_report_bind_type')
                        ? localConfig.getItem('_vf_report_bind_type')
                        : 1
            })
            if (deviceType === 5) {
                const heightOpenKey = '_vf_height_open'
                const heightOpen = localConfig.getItem(heightOpenKey)
                if (heightOpen === null || heightOpen === '') {
                    // 出厂设置 关闭身高
                    localConfig.setItem(heightOpenKey, 0)
                } else {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        heightOpen: parseInt(heightOpen, 10)
                    })
                }
            }

            if (deviceType === 5) {
                const isUnStdModeKey = '_vf_is_un_std_mode'
                const isUnStdMode = localConfig.getItem(isUnStdModeKey)
                if (isUnStdMode === null || isUnStdMode === '') {
                    // 出厂设置 非标准模式定制
                    localConfig.setItem(isUnStdModeKey, 0)
                } else {
                    this.$store.commit('CHANGE_DEVICE_INFO', {
                        isUnStdMode: parseInt(isUnStdMode, 10)
                    })
                }
                // 运动员
                const Athlete = '_vf_Athlete'
                const isAthlete = localConfig.getItem(Athlete)
                if (isAthlete === null || isAthlete === '') {
                    // 出厂设置 关闭运动员
                    localConfig.setItem(Athlete, 0)
                } else {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        Athlete: parseInt(isAthlete, 10)
                    })
                }
                // 无体成分报告
                const noBodyCompositionReport = '_vf_enable_no_body_composition_report'
                const isnoBodyCompositionReport = localConfig.getItem(noBodyCompositionReport)
                if (isnoBodyCompositionReport === null || isnoBodyCompositionReport === '') {
                    // 出厂设置 关闭无体成分报告
                    localConfig.setItem(noBodyCompositionReport, 0)
                } else {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        noBodyCompositionReport: parseInt(isnoBodyCompositionReport, 10)
                    })
                }
            }

            if (deviceType === 3) {
                const beauty = '_vf_beauty'
                const isbeauty = localConfig.getItem(beauty)
                const beautyEnable = '_vf_beauty_enable'
                const isBeautyEnable = localConfig.getItem(beautyEnable)
                if (isbeauty === null || isbeauty === '') {
                    // 出厂设置 关闭身高
                    localConfig.setItem(beauty, 0)
                } else {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        beauty: parseInt(isbeauty, 10)
                    })
                }
                if (isBeautyEnable === null || isBeautyEnable === '') {
                    // 出厂设置 关闭身高
                    localConfig.setItem(beautyEnable, 0)
                } else {
                    this.$store.commit('CHANGE_DEVICE_INFO', {
                        beautyEnable: parseInt(isBeautyEnable, 10)
                    })
                }
                // 运动员
                const Athlete = '_vf_Athlete'
                const isAthlete = localConfig.getItem(Athlete)
                if (isAthlete === null || isAthlete === '') {
                    // 出厂设置 关闭运动员
                    localConfig.setItem(Athlete, 0)
                } else {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        Athlete: parseInt(isAthlete, 10)
                    })
                }
            }

            if (deviceType === 3) {
                const pageSizeKey = '_vf_page_size'
                const pageSizeType = localConfig.getItem(pageSizeKey)
                if (pageSizeType === null || pageSizeType === '') {
                    // 出厂设置 默认序列号绑定
                    localConfig.setItem(pageSizeKey, 4)
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        Athlete: 0
                    })
                } else {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        pageSize: parseInt(pageSizeType, 10)
                    })
                }
            }

            // 报告绑定方式
            const deviceModeKey = '_vf_device_mode'
            let deviceMode = localConfig.getItem(deviceModeKey)
            if (deviceType === 4 || deviceType === 5) {
                // vapro3 判断设备模式
                if (deviceMode === null || deviceMode === '') {
                    // 出厂设置 默认序列号绑定
                    localConfig.setItem(deviceModeKey, 1)
                    deviceMode = '1'
                }
                this.$store.commit('CHANGE_SETTING_INFO', {
                    deviceMode: parseInt(deviceMode, 10)
                })

                //异常重启
                // 云非发现bug 自检网络异常导致设备模式异常
                // if (parseInt(deviceMode, 10) === 1) {
                //     this.$store.commit('CHANGE_DEVICE_INFO', {
                //         healthPackageEnable: parseInt(deviceMode, 10)
                //     })
                // }
            } else {
                // 其余类型设备使用标准模式
                this.$store.commit('CHANGE_SETTING_INFO', {
                    deviceMode: 2
                })
            }
            window.logger.info('settingInfo', `保存到本地的设备模式${deviceMode}`)
            // 配置错误码地址
            const codeUrlKey = '_vf_code_url'

            let codeUrl = localConfig.getItem(codeUrlKey)
            if (codeUrl) {
                this.$store.commit('CHANGE_DEVICE_INFO', {
                    codeUrl: codeUrl
                })
                window.logger.info('settingInfo', `配置二维码error地址${codeUrl}`)
            }

            // 获取第上方绑定信息
            this.$controlClient.thirdBind().then((res) => {
                if (res.status) {
                    this.$store.commit('CHANGE_DEVICE_INFO', {
                        thirdBindType: res.status > 0 ? res.status - 1 : res.status
                    })
                }
            })
            // 存储更新状态
            this.$store.commit('CHANGE_UPDATE_INFO', {
                hasNewVer: updateStatus.isHasUpdate,
                version: updateStatus.version
            })
            // 获取硬件服务状态 - 状态响应后请求开屏
            this.$hardwareClient.serviceStatus()
            this.getHardState()
        },
        // 硬件服务上报服务状态超时，重新获取
        getHardState() {
            this.timer = setInterval(() => {
                if (this.hwServices.ready === 0) {
                    // 获取硬件服务状态 - 状态响应后请求开屏
                    window.logger.info('硬件服务上报服务状态超时，重新获取')
                    this.$hardwareClient.serviceStatus()
                } else {
                    this.cleatTimer()
                }
            }, 5000)
        },
        // cleatTimer
        cleatTimer() {
            clearInterval(this.timer)
        },
        // 初始化设置
        initSetup() {
            // 打印模式设置
            const printModeKey = '_vf_print_mode'
            const printMode = localConfig.getItem(printModeKey)
            if (printMode === null || printMode === '') {
                // 出厂设置 手动打印
                localConfig.setItem(printModeKey, 2)
            } else {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    printMode: parseInt(printMode, 10)
                })
            }
            // 是否开启了体围 + 体态 + 体重 三项合一测量
            const combineMeasureKey = '_vf_combine_measure_enable'
            const combineMeasureType = localConfig.getItem(combineMeasureKey)
            if (combineMeasureType) {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    combineMeasureEnable: combineMeasureType
                })
            }
            // 是否满足三项合一测量的值
            const triModeKey = '_vf_tri_mode'
            const triModeType = localConfig.getItem(triModeKey)
            if (triModeType) {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    triMode: triModeType
                })
            }
            // 手势识别设置
            const gestureStateKey = '_vf_gesture_state'
            const gestureState = localConfig.getItem(gestureStateKey)
            if (gestureState === null || gestureState === '') {
                // 出厂设置 打开手势识别
                localConfig.setItem(gestureStateKey, 1)
            } else {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    gestureState: parseInt(gestureState, 10)
                })
            }
            // 动态实验室设置
            const dynamicLaboratoryKey = '_vf_lab_switch'
            const dynamicLaboratory = localConfig.getItem(dynamicLaboratoryKey)
            if (dynamicLaboratory === null || dynamicLaboratory === '') {
                // 出厂设置  默认开启
                localConfig.setItem(dynamicLaboratoryKey, 1)
            } else {
                if (!dynamicLaboratory) {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        dynamicLaboratory: parseInt(dynamicLaboratory, 10)
                    })
                }
            }
            // // 报告绑定方式
            // const reportBindTypeKey = '_vf_report_bind_type'
            // const reportBindType = localConfig.getItem(reportBindTypeKey)
            // if (reportBindType === null || reportBindType === '') {
            //     // 出厂设置 默认序列号绑定
            //     localConfig.setItem(reportBindTypeKey, 1)
            // } else {
            //     this.$store.commit('CHANGE_SETTING_INFO', {
            //         reportbindType: parseInt(reportBindType, 10)
            //     })
            // }
            // 获取本地重启前的配置
            const unScanItemsKey = '_vf_unScanItems'
            const unScanItemsType = localConfig.getItem(unScanItemsKey)
            if (unScanItemsType) {
                this.$store.commit('CHANGE_INIT_MESINFO', unScanItemsType)
            }

            const deviceViewReportKey = '_vf_device_view_report'
            const deviceViewReport = localConfig.getItem(deviceViewReportKey)
            if (deviceViewReport === null || deviceViewReport === '') {
                // 出厂设置 默认序列号绑定
                localConfig.setItem(deviceViewReportKey, 'false')
            } else {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    deviceViewReport: Boolean(deviceViewReport)
                })
            }
        }
    },
    beforeDestroy() {
        this.cleatTimer()
    }
}
</script>

<style></style>
