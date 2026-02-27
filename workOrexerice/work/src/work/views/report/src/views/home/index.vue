<!--
 * @Description: 首页 待机页
 * @Author: yangsheng
 * @Date: 2019-09-06 17:37:36
 * @LastEditTime: 2026-01-28 17:45:46
 * @LastEditors: liyunfei 3090384495@qq.com
 -->
<template>
    <div id="wrapper">
        <!-- <div style="position: absolute; z-index: 1000; top: 50px; left: 50px">
            <button @click="testResetPage">设置到期时间</button>
        </div> -->
        <!-- <button @click="remove" style="position: absolute; z-index: 1000">移除异常</button><br />
        <button @click="add" style="position: absolute; z-index: 1000">增加异常</button> -->
        <!-- <video
            src="media-file://video/home/index.mp4"
            class="index-video"
            name="待机动画"
            preload="auto"
            autoplay
            loop
            width="100%"
            @touchend="startScan(1)"
        >
            您的浏览器不支持 video 标签。
        </video> -->
        <img
            @touchend="startScan(1)"
            class="index-logo"
            src="@/assets/img/home/indexhome2.svg"
            alt=""
            v-if="this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2"
        />
        <p class="index-logo1" v-else-if="deviceInfo.deviceType === 5 && deviceInfo.logoUrl">
            <img :src="deviceInfo.logoUrl" alt="" />
        </p>
        <img @touchend="startScan(1)" class="index-logo" src="@/assets/img/home/index_static.svg" alt="" v-else />
        <img
            @touchend="startScan(1)"
            class="index-video"
            src="@/assets/img/home/index_static.png"
            alt=""
            v-if="deviceInfo.deviceType === 3"
        />
        <img @touchend="startScan(1)" class="index-video" src="@/assets/img/home/index_static1.png" alt="" v-else />
        <!-- 时间 -->
        <div v-if="!showBoxIdx.length > 0" class="bottom-clock">
            <date-clock />
        </div>
        <!-- 底部提醒 -->
        <div class="info">
            <tip-card
                key="error"
                v-if="errProjects.length > 0 && errProjects.length < 4"
                title-icon="abnormal"
                :title="errorTitle"
                :subtitle="deviceUsable.errorTip"
                :type="tipCardType"
            ></tip-card>
            <!-- 更新提醒  -->
            <tip-card
                key="network"
                v-if="showBoxIdx.indexOf(1) > -1"
                title-icon="download_white"
                :title="$t('home.fa-xian-xin-ban-ben_subtitle', [updateInfo.version])"
                :submitType="'update'"
                @eventType="isTouchScreen"
                :type="updateClickType"
            >
                <p v-if="this.deviceInfo.operationMode === 1" slot="msg" class="update-msg">
                    <i18n path="home.fa-xian-xin-ban-ben_subtitle_tip_touch">
                        <img src="@/assets/img/home/indeterminate-circle-fill.svg" place="icon" alt="" />
                    </i18n>
                </p>
                <p v-else slot="msg" class="update-msg">
                    <i18n path="home.fa-xian-xin-ban-ben_subtitle_tip_key">
                        <img src="@/assets/img/home/indeterminate-circle-fill.svg" place="icon" alt="" />
                    </i18n>
                </p>
            </tip-card>
            <!-- 网络提醒 -->
            <tip-card
                key="network"
                v-if="showBoxIdx.indexOf(2) > -1"
                :type="tipCardType"
                title-icon="network_white"
                :title="$t('home.she-bei-wang-luo-man')"
                :subtitle="$t('home.she-bei-wang-luo-man_subtitle')"
            ></tip-card>
            <!-- 手势提醒 -->
            <tip-card
                key="gesture"
                v-if="showBoxIdx.indexOf(3) > -1"
                :type="tipCardType"
                title-icon="gesture_white"
                :title="$t('home.shou-shi-shi-bie-yi-chang')"
                :subtitle="$t('home.shou-shi-shi-bie-yi-chang_subtitle')"
            ></tip-card>
            <!-- 光照提醒 -->
            <tip-card
                key="light"
                v-if="showBoxIdx.indexOf(4) > -1 && !isError"
                :type="tipCardType"
                :title-icon="lightLevel === 1 ? 'light1_white' : 'light2_white'"
                :title="lightLevel === 1 ? $t('home.zhou-bian-guang-xian-ruo') : $t('home.zhou-bian-guang-xian-cha')"
                :subtitle="$t('home.zhou-bian-guang-xian-cha_subtitle')"
            ></tip-card>
            <tip-card
                key="renewal"
                v-if="showBoxIdx.indexOf(5) > -1"
                :type="tipCardType"
                class="renewal"
                title-icon="renewal"
                :title="$t('home.xu-fei-tong-zhi')"
                :subtitle="
                    $t('home.xu-fei-tong-zhi_subtitle', [
                        deviceInfo.renewalStatus === 2 ? $t('home.ji-jiang-dao-qi') : $t('home.yi-dao-qi'),
                        deviceInfo.expirationTime,
                        deviceInfo.operationMode === 1 ? 'http://rpro5.visbody.com' : 'http://rpro3.visbody.com'
                    ])
                "
            ></tip-card>
            <!-- ai 续费提醒-->
            <!-- 海外设备 -->
            <tip-card
                key="renewal"
                v-if="showBoxIdx.indexOf(9) > -1 && isOsDevice"
                :type="tipCardType"
                class="renewal"
                title-icon="renewal"
                :title="$t('home.xu-fei-tong-zhi')"
                :subtitle="
                    deviceInfo.aiRenewalStatus === 3
                        ? $t('home.ai-xu-fei-tong-zhi_subtitle1', [deviceInfo.aiExpirationTime, renewAddrOs])
                        : $t('home.ai-xu-fei-tong-zhi_subtitle2', [deviceInfo.aiExpirationTime, renewAddrOs])
                "
            ></tip-card>
            <!-- 国内设备 -->
            <tip-card
                key="renewal"
                v-if="showBoxIdx.indexOf(9) > -1 && !isOsDevice"
                :type="tipCardType"
                class="renewal"
                title-icon="renewal"
                :title="$t('home.xu-fei-tong-zhi')"
                :subtitle="
                    deviceInfo.aiRenewalStatus === 3
                        ? $t('home.ai-xu-fei-tong-zhi_subtitle3', [deviceInfo.aiExpirationTime, renewAddrOs])
                        : $t('home.ai-xu-fei-tong-zhi_subtitle4', [deviceInfo.aiExpirationTime, renewAddrOs])
                "
            ></tip-card>
            <!-- 待机超时提醒 -->
            <tip-card
                key="timeout"
                v-if="showBoxIdx.indexOf(6) > -1 || deviceInfo.reminderStatus"
                :type="tipCardType"
                title-icon="reboot_white"
                :title="$t('home.qing-chong-qi-she-bei')"
                :subtitle="$t('home.qing-chong-qi-she-bei_subtitle')"
            ></tip-card>
            <!-- 系统异常退出 -->
            <tip-card
                v-if="sysStatus"
                key="timeout"
                :type="tipCardType"
                title-icon="abnormal"
                :title="$t('home.sys-error.title')"
                :subtitle="$t('home.sys-error.tips')"
            ></tip-card>
            <!-- 售后联系二维码 v-if="errProjects.length > 0 && errProjects.length < 4 && deviceInfo.deviceType === 5"-->
            <error-contact-card
                v-if="deviceErrorCode"
                :errorCode="deviceErrorCode"
                key="timeout"
                title="扫码联系售后"
            ></error-contact-card>
            <div class="bottom-buttons">
                <div class="button-box" @touchend="btnClick(4)">
                    <img class="report-button" src="@/assets/img/home/report.svg" alt="" />
                </div>
                <div class="button-box" @touchend="btnClick(5)">
                    <img class="setup-button" src="@/assets/img/home/setup.svg" alt="" />
                </div>
            </div>
        </div>
        <!-- 底部按钮提示语 -->
        <!-- <tip-btn></tip-btn> -->
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'
import TipCard from './components/TipCard.vue'
// import TipBtn from './components/TipBtn.vue'
import DateClock from '../../components/DateClock.vue'
import ErrorContactCard from '../../components/ErrorContactCard.vue'
import { createFile } from '@/util'
import CONFIG from '@/config/index'
import { isAiDevice, isOsDevice } from '@/types/device'
import AdVideo from '@/util/customAd'
export default {
    name: 'Home',
    components: {
        TipCard,
        // TipBtn,
        DateClock,
        ErrorContactCard
    },
    data() {
        return {
            // 弹窗显示优先级 1 更新 2 网络慢 3 手势异常 4 环境光照
            // 更新弹窗
            openUpdateBox: false,
            // 光源检测计时器
            lightTimer: null,
            // 设备状态检测计时器
            deviceTimer: null,
            // 当前要显示的弹窗 1 更新 2 网络慢 3 手势异常 4 环境光照 5停机提醒 按从小到大的优先级显示弹窗
            boxList: [],
            printMode: false,
            // 算法站人状态
            isAlgState: false,
            sysStatus: false,
            isOsDevice: isOsDevice(),
            adVideoTimer: null
        }
    },
    computed: {
        ...mapGetters([
            'deviceInfo',
            'deviceUsable',
            'updateInfo',
            'settingInfo',
            'deviceErrors',
            'deviceErrorIds',
            'netSpeedInfo',
            'recoveryStatus',
            'lightLevel',
            'standPeople',
            'openShutDownView',
            'checkPeople',
            'initMesInfo'
        ]),
        isVaPro5() {
            return this.deviceInfo.deviceType === 5
        },
        // 异常项目数组
        errProjects() {
            // console.log('=====', this.deviceErrors)
            let errorArr = []
            const initUnscan = this.initMesInfo.unScanItems
            if (!this.deviceUsable.shape && initUnscan.indexOf(2) > -1) {
                errorArr.push(this.$t('item-select.ti-tai-ping-gu'))
            }
            if (!this.deviceUsable.shape && initUnscan.indexOf(3) > -1 && this.deviceInfo.deviceType !== 5) {
                errorArr.push(this.$t('item-select.ti-wei-ce-liang'))
            }
            if ((!this.deviceUsable.weight || !this.deviceUsable.mass) && initUnscan.indexOf(1) > -1) {
                errorArr.push(
                    this.deviceInfo.deviceType === 5
                        ? this.settingInfo.deviceMode === 2
                            ? '身体成分围度测量'
                            : this.deviceInfo.healthPackageEnable === 2
                            ? '身体成分围度测量'
                            : '无电流营养分析和身体成分围度测量'
                        : this.$t('common.ti-zhong-ce-liang')
                )
            }
            if (!this.deviceUsable.shoulder && this.settingInfo.dynamicLaboratory && initUnscan.indexOf(4) > -1) {
                errorArr.push(this.$t('common.dong-tai-shi-yan-shi'))
            }
            return errorArr
        },
        // 获取最高优先级弹窗
        showBoxIdx() {
            window.logger.info('showBoxIdx==>', this.boxList)
            const list = this.boxList
            list.sort((a, b) => {
                return a - b
            })
            window.logger.info('showBoxIdx<==', this.boxList)
            return list.slice(0, 2)
        },
        tipCardType() {
            return this.deviceInfo.operationMode === 1 || this.isVaPro5 ? 'gray' : 'blue'
        },
        // 是否包含相机异常
        isError() {
            return this.deviceErrors.findIndex((item) => item.id === 3) !== -1
        },
        deviceErrorCode() {
            return this.deviceErrors.map((err) => err.title).join(',')
        },
        errorTitle() {
            const end = this.isError ? '' : this.$t('common.error-end')
            return this.$t('home.items_err', [this.errProjects.join('、')]) + end
        },
        renewAddrOs() {
            return CONFIG.RENEW_ADDR || 'https://assistant.visbody.com'
        },
        updateClickType() {
            return this.isVaPro5 ? 'gray' : 'finish-click'
        }
    },
    watch: {
        // 监听设备状态
        deviceUsable: {
            handler(val, oldVal) {
                if (val !== oldVal) {
                    this.checkDeviceState(val)
                }
            },
            deep: true
        },
        // 监听设备信息
        deviceInfo: {
            handler(val) {
                if (isAiDevice()) {
                    // 停机/未激活
                    this.aiCheckDeviceRenewal(val)
                } else {
                    // 设备到期 7天以上 则跳转到停机页面
                    this.checkDeviceRenewal(val)
                }
                console.log('deviceInfo :', val, val.operationMode)
                // 判断休眠时显示页面
                this.handleSleepPage(val)
            },
            deep: true
        },
        // 光照等级
        lightLevel: {
            handler(val) {
                let index = this.boxList.indexOf(4)
                if (val === 1) {
                    if (index > -1) {
                        this.boxList.splice(index, 1)
                    }
                } else if (val === 2) {
                    if (index === -1) {
                        this.boxList.push(4)
                    }
                } else if (val === 3) {
                    if (index === -1) {
                        this.boxList.push(4)
                    }
                }
            },
            deep: true
        },
        updateInfo: {
            handler(val, oldVal) {
                console.log(val, oldVal)
                if (val.hasNewVer === true && oldVal.hasNewVer === false && val && oldVal) {
                    console.log('watch checkUpdateInfo')
                    this.checkUpdateInfo()
                }
            },
            deep: true,
            immediate: true
        },
        netSpeedInfo: {
            handler(val, oldVal) {
                // 网速状态变更
                if (val.speedStatus !== oldVal.speedStatus) {
                    this.checkNetStatus(val.speedStatus)
                }
            },
            deep: true
        },
        standPeople: {
            async handler(val, oldVal) {
                if (val === true && oldVal === false) {
                    // 体围项目正常 且 不在关机中
                    if (!this.$parent.openShutDownView && this.deviceUsable.shape) {
                        // 启动测量
                        await this.startScan(3)
                    }
                }
            },
            deep: true
        }
    },
    created() {
        if (this.standPeople && this.checkPeople) {
            this.$changeViewPage('ResetPage', { standPeople: true })
        }
        if (this.$route.query.error) {
            this.$router.replace({ query: {} })
            this.sysStatus = true
            setTimeout(() => {
                this.sysStatus = false
            }, 5 * 1000)
        }
        // 创建新的系统文件
        createFile().then((res) => {
            console.log(res)
        })
        this.$store.commit('CHANGE_DEVICE_INFO', {
            btnStatus: null
        })
        this.$emit('on-audio-event', 'stopAudio')
        window.logger.info('设备状态', this.deviceUsable)
        // 重置store
        this.$store.commit('RESTART_STORE')
        this.$store.commit('CHANGE_SCAN_STATE', false)
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [],
            display: false
        })
        // 重置测量项总数
        this.$store.commit('CHANGE_NUMBER', false)
        // 停止扫描
        this.stopScanHandle()

        if (isAiDevice()) {
            // 停机/未激活
            this.aiCheckDeviceRenewal(this.deviceInfo)
        } else {
            // 设备到期 7天以上 则跳转到停机页面
            this.checkDeviceRenewal(this.deviceInfo)
        }

        this.checkDeviceState(this.deviceUsable)
        console.log(this.deviceInfo)
        // 网络断开进入中断常驻
        if (!this.deviceInfo.isNetConnect) {
            this.$changeViewPage('NetworkAnomaly')
            return
        }
        if (this.deviceUsable.gesture) {
            // 发起地毯站人检测
            // this.$algClient.startPersonDetect()

            if (!this.isVaPro5) {
                window.logger.info('开始请求光照检测')
                this.$algClient.startAmbientLightDetect()
            }
        }
        this.checkNetStatus(this.netSpeedInfo.speedStatus)
        // window.logger.info('开始轮询请求算法硬件异常检测')
        // this.deviceTimer = setInterval(() => {
        this.requestDeviceStatus()
        // }, 10 * 1000)
        // 版本更新提醒处理
        this.checkUpdateInfo()
    },
    mounted() {
        // 监听检测结果
        EventBus.$on('EventAction', async (type, result) => {
            // 关机确认弹框显示时，不处理监听后事件
            if (this.openShutDownView) {
                return
            }
            if (type === 'PersonDetectResult') {
                if (result === 1) {
                    // 转台站人 启动测量
                    this.isAlgState = true
                    await this.startScan(3)
                } else {
                    this.isAlgState = false
                }
            } else if (type === 'StandState') {
                if (result) {
                    // 体重秤站人 启动测量
                    await this.startScan(3)
                }
            } else if (type === 'netWorktStatus') {
                if (!result.online) {
                    window.logger.info('网络异常时跳转到网络异常常驻页面')
                    this.$changeViewPage('NetworkAnomaly')
                }
            }
        })
    },
    // 离开页面
    beforeDestroy() {
        EventBus.$off('EventAction')
        if (this.deviceTimer) {
            window.logger.info('清除设备状态查询计时器')
            clearInterval(this.deviceTimer)
        }
        if (this.deviceUsable.gesture) {
            window.logger.info('清除环境光查询计时器')
            clearInterval(this.lightTimer)
            // 关闭检测光源
            if (!this.isVaPro5) {
                this.$algClient.stopAmbientLightDetect()
            }
        }
        // 暂停广告视频下载
        AdVideo.pause()
        // 停止广告视频定时任务
        this.clearAdVideoSleepTimer()
    },
    methods: {
        remove() {
            this.$store.commit('REMOVE_DEVICE_ERROR', 8)
        },
        add() {
            // this.$store.commit('ADD_DEVICE_ERROR', 5)
            // this.$store.commit('ADD_DEVICE_ERROR', 2)
            this.$store.commit('ADD_DEVICE_ERROR', 8)
        },
        // 触屏点击
        isTouchScreen(type) {
            if (type === 'update' && this.openUpdateBox) {
                this.jumpUpdate()
            }
        },
        // 请求设备状态
        requestDeviceStatus() {
            this.$algClient.depthCameraStatus()
            // this.$algClient.ColorCameraStatus()
            // this.$hardwareClient.hardwareStatus().then((data) => {
            //     console.log('请求设备状态响应', data)
            //     if (Object.values(data).some((item) => item === 0)) {
            //         window.logger.warn('硬件状态上报了无效数据')
            //     } else {
            //         // 体重模块通讯异常
            //         if (data.weightBoardConnect !== 1) {
            //             this.$store.commit('ADD_DEVICE_ERROR', 5)
            //         }
            //         // 体脂模块通讯异常
            //         if (data.fatBoardConnect !== 1) {
            //             this.$store.commit('ADD_DEVICE_ERROR', 6)
            //         }
            //         // 核心控制模块异常
            //         if (data.centerCtrlBoard !== 1) {
            //             this.$store.commit('ADD_DEVICE_ERROR', 7)
            //         }
            //         if (data.tableStatus !== 1) {
            //             // 转台未连接 or 转台模块异常
            //             this.$store.commit('ADD_DEVICE_ERROR', data.tableStatus === 3 ? 8 : 9)
            //         }
            //     }
            // })
        },
        stopScanHandle() {
            // 停止体态扫描
            this.$algClient.cancelScan()
            // 停止肩部检测
            this.$algClient.stopShoulderDetect()
        },
        // 检查设备状态
        async checkDeviceState(info) {
            // if (this.deviceInfo.deviceType === 5 && !this.deviceUsable.shape) {
            //     if (this.deviceErrors.length === 1 && this.deviceErrors[0].id === 8) {
            //         // 转台掉线可以恢复
            //         this.$changeViewPage('TurntableError')
            //     } else {
            //         this.$changeViewPage('DeviceError')
            //     }
            // }
            if (this.errProjects.length === this.initMesInfo.unScanItems.length) {
                // 所有项目都异常
                this.$changeViewPage('DeviceError')
            }
            // console.log(info, '=======', '555555', this.boxList, this.boxList.indexOf(3))
            // 判断手势识别状态
            if (!info.gesture) {
                let index = this.boxList.indexOf(3)
                // 如果当前不存在手势异常弹窗就添加
                if (index === -1) {
                    this.boxList.push(3)
                    if (!this.isVaPro5) {
                        this.$algClient.stopAmbientLightDetect()
                    }
                    // 取消地毯站人检测
                    // this.$algClient.stopPersonDetect()
                }
            } else if (info.gesture) {
                // 手势识别恢复
                let index = this.boxList.indexOf(3)
                // 如果当前不存在手势异常弹窗就添加
                if (index !== -1) {
                    this.boxList.splice(index, 1)
                    // 发起地毯站人检测
                    this.$algClient.startPersonDetect()
                    if (!this.isVaPro5) {
                        window.logger.info('开始请求光照检测')
                        this.$algClient.startAmbientLightDetect()
                    }

                    // console.log(info, '=======', '54455')
                }
            }
            // 如果体态异常&深度相机异常&没有恢复过深度相机 则进入恢复页
            if (!info.shape) {
                // 有深度相机硬件异常&无版本更新&未恢复过则进入恢复页
                const depthErrIdx = this.deviceErrors.findIndex((item) => item.id === 3)
                window.logger.info('深度相机异常是否恢复过:', this.recoveryStatus)
                if (depthErrIdx > -1 && !this.recoveryStatus && !this.updateInfo.hasNewVer) {
                    window.logger.info('恢复重启扫描服务尝试恢复深度相机硬件异常')
                    if (this.deviceTimer) {
                        clearInterval(this.deviceTimer)
                    }
                    this.$changeViewPage('Recovery')
                }
            } else if (this.errProjects.length === 3 && !this.settingInfo.dynamicLaboratory) {
                // 动态实验室关闭 其余两项项目都异常
                this.$changeViewPage('DeviceError')
            } else if (this.errProjects.length === 4) {
                // 所有项目都异常
                this.$changeViewPage('DeviceError')
            }
        },
        // 检查设备是否到期
        checkDeviceRenewal(info) {
            if (info.renewalStatus === 4) {
                this.$changeViewPage('Renewal')
            } else if (info.renewalStatus > 1) {
                let index = this.boxList.indexOf(5)
                // 如果当前不存在续费提醒弹窗就添加
                if (index === -1) {
                    this.boxList.push(5)
                }
            } else {
                // 续费后删除提醒弹窗
                let index = this.boxList.indexOf(5)
                if (index > -1) {
                    this.boxList.splice(index, 1)
                }
            }
        },
        aiCheckDeviceRenewal(info) {
            if (info.aiRenewalStatus === 5 || info.aiRenewalStatus === 1) {
                this.$changeViewPage('AiRenewal')
            } else if (info.aiRenewalStatus > 2) {
                let index = this.boxList.indexOf(9)
                // 如果当前不存在续费提醒弹窗就添加
                if (index === -1) {
                    this.boxList.push(9)
                }
            } else {
                // 续费后删除提醒弹窗
                let index = this.boxList.indexOf(9)
                if (index > -1) {
                    this.boxList.splice(index, 1)
                }
            }
        },
        // 按键事件
        async btnClick(btnType) {
            // 设置
            if (btnType === 5) {
                // 取消地毯站人检测
                // await this.$algClient.stopPersonDetect()
                // 进入设置页面
                setTimeout(() => {
                    // 进入设置页面
                    this.$changeViewPage('SettingIndex')
                }, 200)
                // 打印
            } else if (btnType === 4) {
                if (this.settingInfo.printMode !== 0) {
                    // 取消地毯站人检测
                    // await this.$algClient.stopPersonDetect()
                    // 进入报告列表页
                    setTimeout(() => {
                        this.$changeViewPage('PrintList')
                    }, 200)
                } else {
                    window.logger.info('未开启打印报告列表不跳转')
                }
            } else {
                // 更新
                if (btnType === 2 && this.openUpdateBox) {
                    this.jumpUpdate()
                    // 其他按钮
                } else if ([1, 2].indexOf(btnType) > -1) {
                    await this.startScan(1)
                }
            }
        },
        // 更新跳转
        jumpUpdate() {
            this.$store.commit('CHANGE_UPDATE_INFO', {
                updStatus: 0
            })
            // 进入更新页面
            this.$changeViewPage('UpdateClient')
        },
        // 启动测量 启动测量类型 1 按键进入 2 站上体重秤 3 地垫站人
        async startScan(type) {
            if (type === 1 || this.standPeople) {
                // 取消地毯站人检测
                // await this.$algClient.stopPersonDetect()
                // this.isAlgState = false
                setTimeout(() => {
                    this.$changeViewPage('Welcome', { startupType: type })
                }, 1000)
            }
        },
        // 检查网络状态
        checkNetStatus(status) {
            // 网络慢弹窗反馈
            let index = this.boxList.indexOf(2)
            // 特别慢加入提醒 否则移除提醒
            if (status === 3) {
                if (index === -1) {
                    this.boxList.push(2)
                }
            } else {
                if (index > -1) {
                    this.boxList.splice(index, 1)
                }
            }
        },
        // 检查更新状态
        checkUpdateInfo() {
            // 有新版本更新
            if (this.updateInfo.hasNewVer) {
                // 强制更新
                if (this.updateInfo.force) {
                    window.logger.info('首页进入强制更新')
                    // 直接进入更新中页面
                    this.$store.commit('CHANGE_UPDATE_INFO', {
                        updStatus: 0
                    })
                    this.$changeViewPage('UpdateClient')
                    // 普通更新
                } else {
                    // 打开 更新弹窗
                    window.logger.info('添加更新弹窗')
                    let index = this.boxList.indexOf(1)
                    if (index === -1) {
                        this.boxList.push(1)
                        this.openUpdateBox = true
                    }
                }
            }
        },
        testResetPage() {
            console.log('testResetPage', this.deviceInfo)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                deviceType: 3,
                aiRenewalStatus: 3,
                aiExpirationTime: '2025-5-31'
            })
            // this.$changeViewPage('ResetPage', { standPeople: true })
            // 触发全局事件
            // this.$store.commit('CHANGE_STAND_PEOPLE', true)
        },
        clearSleepTimer() {
            if (!this.sleepTimer) return
            clearTimeout(this.sleepTimer)
            this.sleepTimer = null
        },
        /**
         * 处理休眠后跳转页面
         * @param deviceInfo 设备信息
         */
        async handleSleepPage(deviceInfo) {
            // vapro5-s 进入睡眠
            if (['M2', 'N2'].includes(deviceInfo.deviceId.slice(0, 2))) {
                const isReady = await AdVideo.checkVideoIsReady(deviceInfo.deviceId)
                window.logger.info('开启请求: 链接url' + isReady)
                if (isReady) {
                    this.clearSleepTimer()
                    this.startAdVideoTimer()
                    return
                }
            }

            if (this.deviceInfo.sleepSwitch === true) {
                this.startSleepTimer()
            } else {
                this.clearSleepTimer()
            }
        },

        /**
         * 启动广告视频定时器
         */
        startAdVideoTimer() {
            window.logger.info('开启定时任务: adVideoTimer' + this.adVideoTimer)
            if (this.adVideoTimer !== null) {
                return
            }
            // 五分钟后跳客户广告视频
            this.adVideoTimer = setTimeout(() => {
                window.logger.info('广告视频定时任务触发')
                // 停止扫描
                this.stopScanHandle()
                // 取消地毯站人检测
                this.$algClient.stopPersonDetect()
                this.clearAdVideoSleepTimer()
                // 判断当前路由是否在首页 如果在首页的话才进行跳转
                if (this.$route.name === 'Home') {
                    this.$changeViewPage('CustomerAd')
                }
            }, 1000 * 60 * 5)
        },

        /**
         * 停止广告视频定时任务
         */
        clearAdVideoSleepTimer() {
            if (!this.adVideoTimer) return
            clearTimeout(this.adVideoTimer)
            this.adVideoTimer = null
        }
    }
}
</script>

<style lang="less" scoped>
#wrapper {
    // background-image: url('../../assets/img/home/bg@2x.png');
    background-size: 100% 100%;
    height: 100%;

    #slider {
        width: 100%;
        margin: auto;
    }

    .bottom-clock {
        position: absolute;
        width: 100%;
        bottom: 72px;
        z-index: 1;
    }

    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        z-index: 101;
        width: 100%;
        // margin-bottom: 72px;

        .update-msg {
            margin-top: 8px;

            span {
                font-size: 36px;
                font-weight: normal;
                font-family: OPPOSansR;
                display: flex;
                align-items: center;
            }

            i {
                font-size: 30px;
                vertical-align: initial;
                background: #ffffff;
                color: @color-blue;
                border-radius: 6px;
            }

            img {
                width: 48px !important;
            }
        }
    }

    .renewal {
        img {
            position: relative;
            top: -10px;
        }

        word-break: break-all;

        p {
            font-size: 36px;
            font-family: OPPOSansR;
            font-weight: normal;
            color: #e7e9f0;
            line-height: 56px;
        }
    }

    .index-video {
        width: 100%;
        position: absolute;
        // bottom: 40px;
        left: 0;
        right: 0;
        margin: auto;
    }
    .index-logo {
        width: 864px;
        position: absolute;
        top: 204px;
        left: 108px;
        margin: auto;
        z-index: 1;
    }
    .index-logo1 {
        width: 800px;
        height: 240px;
        position: absolute;
        top: 204px;
        left: 0;
        right: 0;
        z-index: 1;
        margin: 0 auto;
        overflow: hidden;
        img {
            display: block;
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            margin: 0 auto;
            object-fit: contain;
        }
    }
    .bottom-clock {
        position: absolute;
        width: 100%;
        bottom: 192px;
        // z-index: 1;
    }
    .bottom-buttons {
        margin: 14px auto 56px;
        display: flex;
        justify-content: space-between;
        width: 88%;
        .button-box {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            height: 120px;
            background: #333333;
            border-radius: 32px;
            &:active {
                background: #1d66e6;
            }
        }
    }
}
</style>
