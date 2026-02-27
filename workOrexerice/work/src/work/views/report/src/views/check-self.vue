<!--
 * @Description: 设备自检
 * @Author: WendyGao
 * @Date: 2022-02-14 16:01:21
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-29 17:33:19
-->
<template>
    <div class="check-self">
        <!-- 自检中 -->
        <div class="animated fast fadeIn">
            <!-- <video
                src="media-file://video/checkSelfing.mp4"
                name="设备自检中"
                preload="auto"
                autoplay
                loop
                width="100%"
            >
                您的浏览器不支持 video 标签。
            </video> -->
            <img
                v-if="deviceInfo.deviceType === 3"
                class="checkSelf-png"
                src="@/assets/img/checkSelf/Self-check2.png"
                alt=""
            />
            <img v-else class="checkSelf-png" src="@/assets/img/checkSelf/checkSelfing.png" alt="" />
            <h3>{{ $t('check-self.she-bei-zi-jian-zhong') }}</h3>
        </div>
    </div>
</template>

<script>
import CONFIG from '@/config/index'
import { mapGetters, mapActions } from 'vuex'
import { _checkTimeZone, _getTimeZone } from '@/util'
import localConfig from '@/config/local'
import SocketService from '@/socket/socket-service'
import { getProjectEnable } from '@/http/status-server-api'
import { EventBus } from '@/util/event-bus'
import { _checkDeviceIp } from '@/util/ip-check'
const moment = require('moment')
export default {
    name: 'CheckSelf',
    data() {
        return {
            // 自检超时定时器
            timer: null,
            rpcClients: null,
            // 控制服务自检是否响应
            controlRes: false,
            // 状态服务注册
            statusRes: false,
            // 保存 getProjectEnable 接口结果，避免重复调用
            projectEnableData: null
        }
    },
    computed: {
        ...mapGetters(['deviceCheckSelfInfo', 'deviceInfo', 'standPeople', 'initMesInfo', 'settingInfo']),
        extServices() {
            return this.$store.state.service.extServices
        }
    },
    watch: {
        extServices: {
            handler(val, oldVal) {
                val.forEach((item, idx) => {
                    // 服务状态改变
                    if (item && oldVal[idx] && JSON.stringify(item) !== JSON.stringify(oldVal[idx])) {
                        this.onStatusChange(item, oldVal[idx])
                    }
                })
            },
            deep: true
        }
    },
    created() {
        // 1. 外部服务启动后会主动上报服务状态，服务异常按照自检失败处理，异常已在对应service中添加
        // 2. 外部服务状态正常则发起自检，自检异常已在对应service中添加
        // 3. 控制服务单独发起且无需等待服务状态上报
        // 4. 状态服务注册失败按照自检网络异常处理
        // 5. 自检超时后，如果有服务仍未上报服务状态或响应自检结果均按照自检失败处理，在自检页面手动添加异常
        // 6. 自检结束后跳转到首页
        this.initClient()
        // if (this.standPeople) {
        //     this.$changeViewPage('ResetPage', { type: false })
        // }
        this.timer = setTimeout(() => {
            clearTimeout(this.timer)
            // 筛选超时仍未响应或失败的服务
            const noReady = this.extServices.filter((item) => item.ready === 0 || item.checkSelf === 0)
            window.logger.info('自检超时，异常服务列表：', JSON.stringify(noReady))
            let noReadyList = []
            // 手动添加自检失败异常
            noReady.forEach((item) => {
                noReadyList.push(item.name)
                this.handleCheckSelfFail(item, true)
            })
            if (!this.controlRes) {
                noReadyList.push('control')
                // 控制服务一直未返回 则按网络异常处理
                this.networkError()
            }
            if (!this.statusRes) {
                noReadyList.push('status')
                // 则按网络异常处理
                this.networkError()
            }
            this.$dotMsg({
                action: 'checkSelf',
                msg: 'timeout',
                services: noReadyList.join('、')
            })
            window.logger.info('自检超时结束')
            if (!this.standPeople) {
                this.$changeViewPage('Home')
            } else {
                this.$changeViewPage('ResetPage', { type: true })
            }
        }, CONFIG.TIME_OUT.CHECK_SELF * 1000)
        this.handleReported()
    },
    mounted() {
        // 针对特殊场景下语音未加载
        setTimeout(() => {
            this.$emit('on-audio-event', 'playAudio', 'checkSelfInit1')
        }, 1.5 * 1000)
        EventBus.$on('EventAction', async (type, data) => {
            if (type === 'statusClientStatus') {
                if (data) {
                    window.logger.info('statusClientStatus连接正常')
                    if (!this.statusRes) this.statusClient()
                }
            }
        })
    },
    // 离开页面
    beforeDestroy() {
        // 清除定时器
        clearTimeout(this.timer)
        EventBus.$off('EventAction')
    },
    methods: {
        ...mapActions(['initExtServices']),
        initClient() {
            const rpcClients = new Map()
            rpcClients.set('alg', {
                errorIds: [3, 2],
                client: this.$algClient
            })
            rpcClients.set('hardware', {
                errorIds: [5, 6, 7, 8, 9],
                client: this.$hardwareClient
            })
            this.rpcClients = rpcClients
        },
        // 处理已上报ready的服务 发起自检
        handleReported() {
            this.extServices.forEach((item) => {
                // 服务上报了状态
                if (item.ready !== 0) {
                    // 服务正常发起自检
                    if (item.ready === 1) {
                        // 发起自检
                        window.logger.info('发起自检', item.name)
                        this.rpcClients.get(item.name).client.checkSelf()
                        // 服务不正常默认自检失败 - 异常已在service上报处处理
                    }
                    // 没有上报状态 请求服务
                } else {
                    window.logger.info('请求服务状态', item.name)
                    this.rpcClients.get(item.name).client.serviceStatus()
                }
            })
            // 控制服务自检
            this.$controlClient.checkSelf().then(async (res) => {
                this.controlRes = true
                if (res.status === 4) {
                    // 网络恢复后重新自检
                    this.$store.commit('CHANGE_DEVICE_INFO', { reSelfCheck: true })
                    this.$changeViewPage('NetworkAnomaly')
                    return
                } else if ([2, 3].indexOf(res.status) > -1) {
                    // +8 对应 error ID
                    this.$store.commit('ADD_DEVICE_ERROR', res.status + 9)
                } else {
                    // 设备正常时发起任务合成状态流
                    // this.$statusClient.notifyTaskStatus(this.deviceInfo.deviceId)
                    // 对状态通知服务进行websocket的连接
                    SocketService.Instance.connect(
                        `ws://${CONFIG.SERVICE.STATUS_HTTP_ADDR}/ws?device_id=${this.deviceInfo.deviceId}`
                    )
                    const res = await getProjectEnable({ device_id: this.deviceInfo.deviceId })

                    // 保存接口结果，供IP检测使用，避免重复调用
                    this.projectEnableData = res

                    window.logger.info('测量项目配置', res)
                    if (res.code === 0) {
                        const data = res.data
                        // 云端配置logo
                        if (data.logo_url && this.deviceInfo.deviceType === 5) {
                            this.$store.commit('CHANGE_DEVICE_INFO', {
                                logoUrl: data.logo_url
                            })
                        }
                        // 配置错误的二维码页面
                        if (data.after_sale_url) {
                            this.$store.commit('CHANGE_DEVICE_INFO', {
                                codeUrl: data.after_sale_url
                            })
                            localConfig.setItem('_vf_code_url', data.after_sale_url || '')
                        }
                        if (data.beauty_enable && this.deviceInfo.deviceType === 3) {
                            this.$store.commit('CHANGE_DEVICE_INFO', {
                                beautyEnable: data.beauty_enable
                            })
                            localConfig.setItem('_vf_beauty_enable', data.beauty_enable)
                        } else {
                            this.$store.commit('CHANGE_DEVICE_INFO', {
                                beautyEnable: 0
                            })
                            this.$store.commit('CHANGE_SETTING_INFO', {
                                beauty: 0
                            })
                            localConfig.setItem('_vf_beauty', 0)
                            localConfig.setItem('_vf_beauty_enable', 0)
                        }
                        localConfig.setItem('_vf_logo_url', data.logo_url)
                        // if (data.is_teenager_report) {
                        this.$store.commit('CHANGE_DEVICE_INFO', {
                            teenagerIsOpen: data.is_teenager_report || 0
                        })
                        localConfig.setItem('_vf_teenager_open', data.is_teenager_report || 0)

                        this.$store.commit('CHANGE_DEVICE_INFO', {
                            spineReportEnabled: data.spine_report_enabled || 0
                        })
                        localConfig.setItem('_vf_spine_report_open', data.spine_report_enabled || 0)
                        // }
                        // 获取到云端测量项目配置
                        if (data.health_package_enable) {
                            if (data.health_package_enable === 2 && this.deviceInfo.deviceType === 5) {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    healthPackageEnable: data.health_package_enable
                                })
                                this.$store.commit('CHANGE_SETTING_INFO', {
                                    deviceMode: 1
                                })
                            } else {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    healthPackageEnable: data.health_package_enable
                                })
                            }
                        } else if (this.deviceInfo.deviceType === 5 && data.health_package_enable === 0) {
                            this.$store.commit('CHANGE_DEVICE_INFO', {
                                healthPackageEnable: 0
                            })
                            this.$store.commit('CHANGE_SETTING_INFO', {
                                deviceMode: 2
                            })
                        } else if (this.deviceInfo.deviceType === 5) {
                            if (
                                localConfig.getItem('_vf_healthPackageEnable') === 2 &&
                                this.deviceInfo.deviceType === 5
                            ) {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    healthPackageEnable: 2
                                })
                                this.$store.commit('CHANGE_SETTING_INFO', {
                                    deviceMode: 1
                                })
                            } else {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    healthPackageEnable: localConfig.getItem('_vf_healthPackageEnable') || 0
                                })
                                this.$store.commit('CHANGE_SETTING_INFO', {
                                    deviceMode: 2
                                })
                            }
                        }
                        localConfig.setItem('_vf_healthPackageEnable', this.deviceInfo.healthPackageEnable)
                        // 初始化 体重 + 体态 + 体围测量模式
                        this.$store.commit('CHANGE_SETTING_INFO', {
                            triMode: 0
                        })
                        // if (data.combine_measure_enable === 1 && data.shoulder_project_enable === 0) {
                        //     window.logger.info('体重 + 体态 + 体围测量模式')
                        //     this.$store.commit(
                        //         'CHANGE_INIT_MESINFO',
                        //         this.deviceInfo.deviceType === 5 ? [1, 3] : [3, 1]
                        //     )
                        //     this.$store.commit('CHANGE_SETTING_INFO', {
                        //         combineMeasureEnable: 1
                        //     })
                        // }

                        if (
                            data.posture_project_enable === 1 &&
                            data.girth_project_enable === 1 &&
                            data.shoulder_project_enable === 0 &&
                            data.weight_project_enable === 0
                        ) {
                            window.logger.info('体态、体围测量模式')
                            this.$store.commit('CHANGE_INIT_MESINFO', [2, 3])
                        } else if (
                            data.posture_project_enable === 1 &&
                            data.girth_project_enable === 1 &&
                            data.shoulder_project_enable === 0 &&
                            data.weight_project_enable === 1
                        ) {
                            window.logger.info('体重、体态、体围测量模式')
                            // 是否支持设备端开启 三项合一体重 + 体态 + 体围测量模式 测量
                            this.$store.commit('CHANGE_SETTING_INFO', {
                                triMode: 1
                            })
                            if (this.settingInfo.combineMeasureEnable) {
                                this.$store.commit(
                                    'CHANGE_INIT_MESINFO',
                                    this.deviceInfo.deviceType === 5 ? [1, 3] : [3, 1]
                                )
                            } else {
                                this.$store.commit(
                                    'CHANGE_INIT_MESINFO',
                                    this.deviceInfo.deviceType === 5 ? [2, 1, 3] : [2, 3, 1]
                                )
                            }
                        } else if (
                            data.posture_project_enable === 1 &&
                            data.girth_project_enable === 1 &&
                            data.shoulder_project_enable === 1 &&
                            data.weight_project_enable === 1
                        ) {
                            window.logger.info('全流程测量模式')
                            const measureProject = this.deviceInfo.deviceType === 5 ? [2, 1, 3, 4] : [2, 3, 4, 1]
                            this.$store.commit('CHANGE_INIT_MESINFO', measureProject)
                        } else if (
                            data.posture_project_enable === 0 &&
                            data.girth_project_enable === 1 &&
                            data.shoulder_project_enable === 0 &&
                            data.weight_project_enable === 0
                        ) {
                            window.logger.info('体围测量模式')
                            this.$store.commit('CHANGE_INIT_MESINFO', [3])
                        } else if (
                            data.posture_project_enable === 0 &&
                            data.girth_project_enable === 1 &&
                            data.shoulder_project_enable === 0 &&
                            data.weight_project_enable === 1
                        ) {
                            window.logger.info('体重、体围测量模式')
                            this.$store.commit(
                                'CHANGE_INIT_MESINFO',
                                this.deviceInfo.deviceType === 5 ? [1, 3] : [3, 1]
                            )
                        } else if (
                            data.posture_project_enable === 0 &&
                            data.girth_project_enable === 1 &&
                            data.shoulder_project_enable === 1 &&
                            data.weight_project_enable === 1
                        ) {
                            window.logger.info('全流程测量模式')
                            const measureProject = this.deviceInfo.deviceType === 5 ? [1, 3, 4] : [3, 4, 1]
                            this.$store.commit('CHANGE_INIT_MESINFO', measureProject)
                        }

                        if (
                            (this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) &&
                            ![1, 3].every((num) => this.initMesInfo.unScanItems.includes(num))
                        ) {
                            this.$store.commit('CHANGE_SETTING_INFO', {
                                deviceMode: 2
                            })
                        }
                        // if (data.operation_mode && this.deviceInfo.deviceType === 5) {
                        //     this.$store.commit('CHANGE_DEVICE_INFO', {
                        //         operationMode: data.operation_mode
                        //     })
                        //     this.$store.commit('CHANGE_EXTERNAL', {
                        //         touch: data.operation_mode === 1 ? true : false
                        //     })
                        //     window.logger.info('触屏状态', data.operation_mode === 1 ? true : false)
                        // }
                        if (!this.statusRes) {
                            this.statusClient()
                        }
                        // 修改ai获取到期时间 在网络在自检时恢复没有重新获取问题
                        // const devicePre = this.deviceInfo.deviceId.substring(0, 2)
                        if (
                            // this.wellnesshubSnList.includes(devicePre) &&
                            (this.deviceInfo.deviceType === 3 || this.deviceInfo.deviceType === 5) &&
                            this.deviceInfo.aiExpirationTime !== 0 &&
                            !this.deviceInfo.aiExpirationTime
                        ) {
                            this.updatedAiExp(this.deviceInfo.deviceId)
                        }
                        if (this.deviceInfo.deviceType === 5) {
                            if (
                                data.is_teenager_report === 0 &&
                                data.health_package_enable !== 2 &&
                                data.spine_report_enabled === 0 &&
                                data.enable_no_body_composition_report === 0
                            ) {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    isUnStdMode: 1
                                })
                            } else {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    isUnStdMode: 0
                                })
                                this.$store.commit('CHANGE_SETTING_INFO', {
                                    Athlete: 0
                                })
                            }
                            if (data.enable_no_body_composition_report) {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    noBodyCompositionReport: 1
                                })
                            } else {
                                this.$store.commit('CHANGE_DEVICE_INFO', {
                                    noBodyCompositionReport: 0
                                })
                            }
                            localConfig.setItem(
                                '_vf_enable_no_body_composition_report',
                                this.deviceInfo.noBodyCompositionReport
                            )
                            window.logger.info(
                                '是否为未标注模式',
                                this.deviceInfo.isUnStdMode,
                                data.enable_no_body_composition_report
                            )
                            localConfig.setItem('_vf_is_un_std_mode', this.deviceInfo.isUnStdMode)
                        }
                    }
                }
                this.checkIsEnd()
            })
            // 是否放置异物
            this.$hardwareClient.personCheck()
            //    this.$controlClient.personCheck().then((res) => {
            //     window.logger.info('是否放置异物', JSON.stringify(res))
            //         if (res.status === 1) {
            //             console.log('设备检测到有人站立')
            //         } else {
            //             console.log('设备未检测到人站立')
            //         }
            //     }).catch((err) => {
            //         console.error('personCheck 调用失败', err)
            //     })
            // 状态服务注册
            this.statusClient()
        },
        async updatedAiExp(deviceId) {
            const expInfo = await this.$statusClient.getAIDeviceExpire(deviceId)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                aiRenewalStatus: expInfo.status,
                aiExpirationTime: moment(expInfo.expirationTime * 1000)
                    .add(expInfo.status === 3 ? 0 : 7, 'd')
                    .format(localConfig.getItem('_vf_i18n') === 'zh' ? 'YYYY-MM-DD' : 'MM-DD-YYYY')
                    // eslint-disable-next-line no-control-regex
                    .replace(/([^\u0000-\u00FF])/g, ' $1 ')
                    .trim()
            })
            EventBus.$emit('EventAction', 'AiExpStatus', {})
        },
        // 状态服务注册
        statusClient() {
            this.$statusClient
                .register(this.deviceInfo.deviceId, this.deviceInfo.mac, CONFIG.PRODUCT_VERSION)
                .then((res) => {
                    this.statusRes = true
                    // 注册失败
                    // if (!res.status) {
                    //     // 则按网络异常处理
                    //     this.$store.commit('ADD_DEVICE_ERROR', 12)
                    // }
                    // 获取第三方绑定信息
                    this.$controlClient.thirdBind().then((res) => {
                        if (res.status) {
                            this.$store.commit('CHANGE_DEVICE_INFO', {
                                thirdBindType: res.status > 0 ? res.status - 1 : res.status
                            })
                        }
                    })
                    window.logger.info('获取时区日志', res)
                    let UTC = ''
                    if (res.timeZone) {
                        UTC = res.timeZone
                        _checkTimeZone(UTC).then((result) => {
                            window.logger.info('_checkTimeZone: result', result)
                            if (result) {
                                this.$controlClient.changeTimeZone(UTC)
                            }
                        })
                    } else {
                        _getTimeZone().then((timeZone) => {
                            window.logger.info('timeZone', timeZone)
                            UTC = timeZone
                        })
                    }
                    this.$store.commit('CHANGE_DEVICE_INFO', {
                        timeZone: UTC
                    })
                    this.checkIsEnd()
                })
        },
        // 在当前页面服务状态、自检状态上报
        onStatusChange(val, oldVal) {
            window.logger.info(val.name, '服务状态改变', JSON.stringify(val), JSON.stringify(oldVal))
            // 服务状态响应
            if (val.ready !== 0 && oldVal.ready === 0) {
                // 服务正常
                if (val.ready === 1) {
                    window.logger.info('发起自检', val.name)
                    this.rpcClients.get(val.name).client.checkSelf()
                }
            }
            // 自检结果响应 - 异常已经存储，只判断是否自检结束
            if (val.checkSelf !== 0 && oldVal.checkSelf === 0) {
                this.checkIsEnd()
            }
        },
        // 手动将对应服务至为自检失败
        // 并保存设备异常
        handleCheckSelfFail(item, addError = false) {
            window.logger.error('手动处理为自检失败', item.name)
            if (addError) {
                const errorIds = this.rpcClients.get(item.name).errorIds
                errorIds.forEach((id) => {
                    this.$store.commit('ADD_DEVICE_ERROR', id)
                })
            }
        },
        // 判断自检是否结束
        checkIsEnd() {
            // 自检结束
            if (this.deviceCheckSelfInfo.isEnd && this.controlRes && this.statusRes) {
                clearTimeout(this.timer)
                window.logger.info('自检正常结束')
                this.$store.commit('CHANGE_DEVICE_INFO', {
                    reSelfCheck: false
                })

                // 只有M30设备才执行IP检测
                if (this.deviceInfo.deviceType === 3) {
                    this.checkDeviceIp()
                }

                if (!this.standPeople) {
                    setTimeout(() => {
                        this.$changeViewPage('Home')
                    }, 3 * 1000)
                } else {
                    this.$changeViewPage('ResetPage', { type: true })
                }
            }
        },
        // 自检引起得网络异常
        networkError() {
            this.$store.commit('ADD_DEVICE_ERROR', 13)
        },

        /**
         * IP检测功能
         * 在所有检测完毕后执行
         * 调用工具函数进行IP地理位置检测
         */
        async checkDeviceIp() {
            await _checkDeviceIp(this.deviceInfo.deviceId, this.projectEnableData)
        }
    }
}
</script>

<style lang="less" scoped>
.check-self {
    height: 100%;
    text-align: center;

    .checkSelf-png {
        margin-top: 366px;
        width: 542px;
        height: 618px;
    }

    h3 {
        position: absolute;
        top: 1050px;
        // width: 100%;
        width: 960px;
        padding: 0 60px;
        font-size: 64px;
        font-family: OPPOSansM;
        font-weight: normal;
        line-height: 96px;
        margin: 0;
        color: #e7e9f0;
    }
}
</style>
