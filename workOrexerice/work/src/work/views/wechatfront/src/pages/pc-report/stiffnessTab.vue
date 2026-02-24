<template>
    <div class="pc-report">
        <div class="content">
            <!-- 合并后的单个模型容器 -->
            <div class="modal-combined">
                <!-- 左旋转按钮（控制两个模型同时旋转） -->
                <div class="rotate-btn rotate-left" @click="rotateBothModels('right')" v-if="isSupportWebgl.webgl">
                    <img src="@/assets/images/pc-report/icon-arrow.png" alt="左旋" class="arrow-left" />
                </div>
                <!-- 双模型头部 -->
                <div class="modal-headers">
                    <div class="modal-header">
                        <span class="time-text">{{ measureTime }}（本次）</span>
                    </div>
                    <div class="modal-header">
                        <!-- 无历史数据时，头部显示“无历史数据” -->
                        <span class="time-text" v-if="isSupportWebgl.webgl && !hasContrast">无历史数据</span>
                        <div class="history-selector" v-else @click="toggleHistorySelector">
                            <span class="time-text">{{ contrastTime || '--' }}（历史）</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#C7C7CC" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- 双模型内容区域 -->
                <div class="modal-body">
                    <!-- 左边模型：本次测量 -->
                    <div class="model-item">
                        <div class="modal-container" v-if="isSupportWebgl.webgl">
                            <pc-measure-model ref="measureModel" :show-girth="true" @cameraRotate="handleCameraRotate"
                                @curveSelect="handleCurveSelect"></pc-measure-model>
                        </div>
                        <!-- 浏览器不支持 WebGL -->
                        <div class="webgl-not-support" v-else>
                            <img src="@/assets/images/mobel@2x.png" alt="不支持" />
                            <span>{{ isSupportWebgl.tipMsg }}</span>
                        </div>
                        <!-- 脚底背景图 -->
                        <div class="model-ground" v-if="isSupportWebgl.webgl"></div>
                    </div>
                    <!-- 右边模型：历史对比 -->
                    <div class="model-item">
                        <div class="modal-container" v-if="isSupportWebgl.webgl && hasContrast">
                            <pc-measure-model ref="measureModelContrast" :show-girth="true" :scan-id="tcScanId"
                                @cameraRotate="handleCameraRotate" @curveSelect="handleCurveSelect"></pc-measure-model>
                        </div>
                        <!-- 无历史数据 -->
                        <div class="no-history" v-else-if="isSupportWebgl.webgl && !hasContrast">
                            <!-- 围度模型暂无历史数据：展示默认占位图 -->
                            <img class="girth-default-img" src="@/assets/images/pc-report/model-default.png"
                                alt="暂无历史数据" />
                        </div>
                        <!-- 浏览器不支持 WebGL -->
                        <div class="webgl-not-support" v-else>
                            <img src="@/assets/images/mobel@2x.png" alt="不支持" />
                            <span>{{ isSupportWebgl.tipMsg }}</span>
                        </div>
                        <!-- 脚底背景图 -->
                        <div class="model-ground" v-if="isSupportWebgl.webgl && hasContrast"></div>
                    </div>
                </div>
                <!-- 右旋转按钮（控制两个模型同时旋转） -->
                <div class="rotate-btn rotate-right" @click="rotateBothModels('left')" v-if="isSupportWebgl.webgl">
                    <img src="@/assets/images/pc-report/icon-arrow.png" alt="右旋" />
                </div>
            </div>
        </div>

        <!-- 帮助按钮 -->
        <div class="header-help">
            <div class="help-icon" @click="openHelpDialog">
                <img src="@/assets/images/pc-report/icon6.png" />
            </div>
        </div>

        <!-- 围度数据卡片区域 -->
        <div class="girth-cards" v-loading="girthLoading">
            <div class="girth-card" v-for="(item, index) in girthList" :key="index">
                <div class="card-top">
                    <div class="card-info">
                        <div class="card-title">
                            <span>{{ item.title }}</span>
                            <img :src="require(`@/assets/images/pc-report/stiffness/${item.icon}`)" :alt="item.title" />
                        </div>
                        <!-- 数值行 -->
                        <div class="data-row">
                            <div class="data-row-left">
                                <span class="val" v-if="formatValue(item.latestData) > 0">{{ formatValue(item.latestData) }}</span>
                                <span v-else>--</span>
                                <span class="unit">cm</span>
                                <span class="diff" v-if="item.diffValue">
                                    <img v-if="item.diffDirection === 'down'"
                                        src="@/assets/images/pc-report/icona4.png" />
                                    <img v-else src="@/assets/images/pc-report/icona6.png" />
                                    <span>{{ item.diffValue }}</span>
                                </span>
                            </div>
                            <img class="data-row-right" src="@/assets/images/pc-report/icon8.png" :alt="item.title"
                                @click="handleCardClick(item)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 脚注 -->
        <div class="tip">
            *报告内容仅供参考，不作为诊断或医疗依据
        </div>

        <!-- 帮助弹窗 -->
        <transition name="dialog-fade">
            <div class="trend-dialog-overlay" v-if="showHelpDialog" @click="closeHelpDialog" @wheel.prevent @touchmove.prevent @scroll.prevent>
                <transition name="dialog-zoom">
                    <div class="help-dialog" v-if="showHelpDialog" @click.stop @wheel.stop @touchmove.stop @scroll.stop>
                        <div class="help-dialog-header">
                            <div class="help-dialog-title">
                                <img src="@/assets/images/pc-report/icon6.png" />
                                <span>帮助</span>
                            </div>
                            <div class="help-dialog-close" @click="closeHelpDialog">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" stroke="#787B8F" stroke-width="1.5" />
                                    <path d="M8 8L16 16M16 8L8 16" stroke="#787B8F" stroke-width="1.5"
                                        stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="help-dialog-content">
                            <div class="help-dialog-item" v-for="(item, index) in girthHelpList" :key="index">
                                <div class="help-dialog-item-title">
                                    <span>{{ item.title }}</span>
                                </div>
                                <div class="help-dialog-item-desc">{{ item.msg }}</div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- 趋势弹窗 -->
        <transition name="dialog-fade">
            <div class="trend-dialog-overlay" v-if="showTrendDialog" @click="closeTrendDialog" @wheel.prevent @touchmove.prevent @scroll.prevent>
                <transition name="dialog-zoom">
                    <div class="trend-dialog" v-if="showTrendDialog" @click.stop @wheel.stop @touchmove.stop @scroll.stop>
                        <div class="trend-dialog-header">
                            <div class="trend-dialog-title">
                                <img src="@/assets/images/pc-report/dialog_icon.png" />
                                <span>{{ currentTrendItem ? currentTrendItem.title : '' }}趋势</span>
                                <span class="trend-dialog-unit">cm</span>
                            </div>
                            <div class="trend-dialog-close" @click="closeTrendDialog">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" stroke="#787B8F" stroke-width="1.5" />
                                    <path d="M8 8L16 16M16 8L8 16" stroke="#787B8F" stroke-width="1.5"
                                        stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="trend-dialog-chart" ref="trendChart" v-loading="trendLoading"></div>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- 历史选择弹窗 -->
        <transition name="dialog-fade">
            <div class="trend-dialog-overlay" v-if="showHistorySelector" @click="closeHistorySelector" @wheel.prevent @touchmove.prevent @scroll.prevent>
                <transition name="dialog-zoom">
                    <div class="history-dialog" v-if="showHistorySelector" @click.stop @wheel.stop @touchmove.stop @scroll.stop>
                        <div class="history-dialog-header">
                            <div class="history-dialog-title">
                                <span>选择历史记录</span>
                            </div>
                            <div class="history-dialog-close" @click="closeHistorySelector">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" stroke="#787B8F" stroke-width="1.5" />
                                    <path d="M8 8L16 16M16 8L8 16" stroke="#787B8F" stroke-width="1.5"
                                        stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="history-dialog-content">
                            <div class="history-item" v-for="(item, index) in filteredHistoryList" :key="index"
                                :class="{ 'active': item.scanId === tcScanId }" @click="selectHistory(item)">
                                <span>{{ formatHistoryTime(item.createTime) }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
// 使用双模型专用组件，支持多模型联动
import PcMeasureModel from '@/components/model/pc-report/MeasureDual.vue'
import { bmGirthContrasInfo, findBsScanTrueHistory, findBmGirthTrend } from '@/assets/js/apolloGql.js'
import isSupportWebgl from '@/assets/js/webgl.js'
import echarts from 'echarts'

// 围度图标引入
import thermalImg1 from '@/assets/images/round_bust.png'
import thermalImg2 from '@/assets/images/round_waistline.png'
import thermalImg3 from '@/assets/images/round_hipCircumference.png'
import thermalImg4 from '@/assets/images/ther_leftupperlimb.png'
import thermalImg5 from '@/assets/images/ther_rightupperlimb.png'
import thermalImg6 from '@/assets/images/round_leftthigh.png'
import thermalImg7 from '@/assets/images/round_rightthigh.png'
import thermalImg8 from '@/assets/images/round_leftleg.png'
import thermalImg9 from '@/assets/images/round_rightlowerleg.png'
import thermalImg10 from '@/assets/images/svg/neck_img.svg'
import thermalImg11 from '@/assets/images/svg/midWaistGirth_img.svg'
import thermalImg12 from '@/assets/images/svg/left_min_thigh_girth_img.svg'
import thermalImg13 from '@/assets/images/svg/right_min_thigh_girth_img.svg'

import { isVAPro3 } from '@/types/device.js'

export default {
    name: 'StiffnessTab',
    components: {
        PcMeasureModel
    },
    data() {
        return {
            // 模型信息（从 localStorage 获取）
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')) || {},
            // WebGL 支持检测
            isSupportWebgl: isSupportWebgl,
            // 围度数据模板（icon 使用 stiffness 文件夹中的实际文件名）
            girthTpl: [
                { title: '颈围', key: 'neckGirth', img: thermalImg10, icon: '颈围@2x.png' },
                { title: '左上臂围', key: 'leftUpperArmGirth', img: thermalImg4, icon: '左上臂匪@2x.png' },
                { title: '右上臂围', key: 'rightUpperArmGirth', img: thermalImg5, icon: '右上臂围@2x.png' },
                { title: '胸围', key: 'bustGirth', img: thermalImg1, icon: '胸围@2x.png' },
                { title: '高腰围', key: 'waistGirth', img: thermalImg2, icon: '高腰围@2x.png' },
                { title: '中腰围', key: 'midWaistGirth', img: thermalImg11, icon: '中腰围@2x.png' },
                { title: '低腰围', key: 'lowWaistGirth', img: thermalImg11, icon: '低腰围@2x.png' },
                { title: '臀围', key: 'hipGirth', img: thermalImg3, icon: '臀围@2x.png' },
                { title: '左大腿围', key: 'leftThighGirth', img: thermalImg6, icon: '左大腿围@2x.png' },
                { title: '左大腿最小围', key: 'leftMinThighGirth', img: thermalImg12, icon: '左大腿最小围@2x.png' },
                { title: '右大腿围', key: 'rightThighGirth', img: thermalImg7, icon: '右大腿围@2x.png' },
                { title: '右大腿最小围', key: 'rightMinThighGirth', img: thermalImg13, icon: '右大腿最小围@2x.png' },
                { title: '左小腿围', key: 'leftCalfGirth', img: thermalImg8, icon: '左小腿围@2x.png' },
                { title: '右小腿围', key: 'rightCalfGirth', img: thermalImg9, icon: '右小腿围@2x.png' }
            ],
            // 处理后的围度列表
            girthList: [],
            // 围度原始数据
            latestGirth: {},
            contrastGirth: {},
            // 是否新算法
            isNewMath: false,
            // 历史记录列表
            historyList: [],
            // 当前扫描ID
            scanId: '',
            // 对比扫描ID
            tcScanId: '',
            // 默认对比扫描ID
            defaultScanId: '',
            // 测量时间
            measureTime: '',
            // 对比时间
            contrastTime: '',
            // 加载状态
            girthLoading: false,
            // 帮助弹窗
            showHelpDialog: false,
            // 历史选择弹窗
            showHistorySelector: false,
            // 围度帮助列表
            girthHelpList: [
                { title: '颈围', msg: '颈围是指颈部最细处的周长，反映颈部肌肉和脂肪的分布情况，是评估上半身体型的重要指标。' },
                { title: '上臂围', msg: '上臂围是指上臂最粗处的周长，包括左上臂围和右上臂围，反映手臂肌肉发达程度。' },
                { title: '胸围', msg: '胸围是指胸部最丰满处的周长，是评估胸部发育和体型的重要指标。' },
                { title: '腰围', msg: '腰围是指腰部最细处的周长，包括高腰围、中腰围和低腰围，是评估腹部脂肪堆积的重要指标。' },
                { title: '臀围', msg: '臀围是指臀部最丰满处的周长，与腰围配合可计算腰臀比，是评估下半身体型的重要指标。' },
                { title: '大腿围', msg: '大腿围是指大腿最粗处的周长，包括左右大腿围和最小围，反映腿部肌肉发达程度。' },
                { title: '小腿围', msg: '小腿围是指小腿最粗处的周长，反映小腿肌肉的发达程度。' }
            ],
            // 趋势弹窗
            showTrendDialog: false,
            trendChartInstance: null,
            currentTrendItem: null,
            trendData: [],
            trendLoading: false,
            trendDialogOpenTime: 0,
            helpDialogOpenTime: 0,
            historySelectorOpenTime: 0,
            // 同步标志，防止循环同步
            isSyncing: false,
            // 旋转标志，防止连续点击
            isRotating: false
        }
    },
    computed: {
        // 是否为 VAPro3 设备
        isVAPro3() {
            return isVAPro3()
        },
        // 是否有对比数据
        hasContrast() {
            return this.tcScanId && Object.keys(this.contrastGirth).length > 0
        },
        // 过滤后的历史记录列表（排除当前扫描）
        filteredHistoryList() {
            return this.historyList.filter(h => h.scanId !== this.scanId)
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        if (this.trendChartInstance) {
            this.trendChartInstance.dispose()
            this.trendChartInstance = null
        }
        // 恢复body滚动，防止组件销毁时弹窗还在打开状态
        document.body.style.overflow = ''
    },
    methods: {
        // 初始化
        init() {
            if (!this.modelInfo.scanId) {
                console.error('scanId 不存在')
                return
            }
            // 设置当前扫描ID
            this.scanId = this.modelInfo.scanId
            // 设置测量时间
            if (this.modelInfo.createTime) {
                this.measureTime = this.formatDateTime(new Date(this.modelInfo.createTime * 1000))
            }
            // 获取历史记录
            this.findBsScanTrueHistory()
        },

        // 获取用户体态合成成功历史记录
        findBsScanTrueHistory() {
            this.girthLoading = true
            this.$apollo
                .query({
                    query: findBsScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: this.modelInfo.createTime
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBsScanTrueHistory
                    if (data && data.code === 200 && data.data && data.data.length) {
                        // 处理历史数据
                        let allHistory = []
                        data.data.forEach((yearData) => {
                            if (yearData.data) {
                                allHistory = allHistory.concat(yearData.data)
                            }
                        })
                        // 按时间升序排序
                        allHistory.sort((a, b) => {
                            return new Date(a.createTime * 1000).getTime() - new Date(b.createTime * 1000).getTime()
                        })
                        this.historyList = allHistory

                        // 如果有历史数据，选择上一次作为对比
                        if (allHistory.length >= 2) {
                            const lastIndex = allHistory.findIndex(h => h.scanId === this.scanId)
                            if (lastIndex > 0) {
                                this.tcScanId = allHistory[lastIndex - 1].scanId
                                this.defaultScanId = this.tcScanId
                                this.contrastTime = this.formatDateTime(new Date(allHistory[lastIndex - 1].createTime * 1000))
                            }
                        }
                        // 获取围度数据
                        this.bmGirthContrasInfo()
                    } else {
                        // 无历史数据，直接获取当前围度数据
                        this.bmGirthContrasInfo()
                    }
                })
                .catch(err => {
                    console.error('获取历史记录失败:', err)
                    // 即使失败也尝试获取围度数据
                    this.bmGirthContrasInfo()
                })
        },

        // 获取围度对比信息
        bmGirthContrasInfo() {
            this.$apollo
                .query({
                    query: bmGirthContrasInfo,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.scanId,
                        tcScanId: this.tcScanId || ''
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.bmGirthContrasInfo
                    if (data && data.code === 200 && data.data) {
                        this.latestGirth = data.data.latestBmGirth || {}
                        this.contrastGirth = data.data.contrastBmGirth || {}
                        this.isNewMath = this.latestGirth.isNewMath === 1

                        // 处理围度数据
                        this.processGirthData()
                    }
                })
                .catch(err => {
                    console.error('获取围度数据失败:', err)
                })
                .finally(() => {
                    this.girthLoading = false
                })
        },

        // 处理围度数据
        processGirthData() {
            this.girthList = []
            this.girthTpl.forEach((girth) => {
                if (this.showGirthItem(girth.key)) {
                    const latestData = this.latestGirth[girth.key]
                    const contrastData = this.contrastGirth[girth.key]

                    // 计算差值
                    let diffValue = null
                    let diffDirection = null
                    if (latestData != null && contrastData != null) {
                        const diff = latestData - contrastData
                        diffValue = Math.abs(diff).toFixed(1)
                        diffDirection = diff >= 0 ? 'up' : 'down'
                    }

                    this.girthList.push({
                        ...girth,
                        thermalImg: girth.img,
                        latestData,
                        contrastData,
                        diffValue,
                        diffDirection
                    })
                }
            })
        },

        // 判断是否显示围度项
        showGirthItem(key) {
            if (this.isVAPro3) {
                return true
            }
            if (this.isNewMath) {
                return key !== 'leftMidThighGirth' && key !== 'rightMidThighGirth'
            }
            return key !== 'neckGirth' && key !== 'leftMidThighGirth' &&
                key !== 'rightMidThighGirth' && key !== 'leftMinThighGirth' &&
                key !== 'rightMinThighGirth' && key !== 'midWaistGirth' &&
                key !== 'lowWaistGirth'
        },

        // 格式化数值
        formatValue(value) {
            if (value == null) return '--'
            return Number(value).toFixed(1)
        },

        // 格式化日期时间
        formatDateTime(date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },

        // 格式化历史时间
        formatHistoryTime(timestamp) {
            if (!timestamp) return '--'
            return this.formatDateTime(new Date(timestamp * 1000))
        },

        // 同时旋转两个模型
        // 左箭头点击=传left，右箭头点击=传right
        rotateBothModels(direction) {
            // 如果正在旋转中，忽略新的点击，防止连续点击导致不一致
            if (this.isRotating) {
                return
            }

            // 旋转主模型
            if (this.$refs.measureModel) {
                this.isRotating = true

                this.$refs.measureModel.turnModel(direction)
                // 获取主模型旋转后的角度，同步到对比模型
                this.$nextTick(() => {
                    const theta = this.$refs.measureModel.getCameraRotation()
                    if (this.$refs.measureModelContrast) {
                        this.$refs.measureModelContrast.setCameraRotation(theta)
                    }
                })

                // 800ms 后重置标志，允许下一次旋转
                setTimeout(() => {
                    this.isRotating = false
                }, 800)
            }
        },

        // 处理相机旋转事件，同步到另一个模型
        handleCameraRotate(data) {
            // 防止循环同步
            if (this.isSyncing) return
            this.isSyncing = true

            // 获取源模型的 iframeId
            const { theta, frameId } = data
            const measureModelId = this.$refs.measureModel && this.$refs.measureModel.$refs.model ? this.$refs.measureModel.$refs.model.frameId : null
            const contrastModelId = this.$refs.measureModelContrast && this.$refs.measureModelContrast.$refs.model ? this.$refs.measureModelContrast.$refs.model.frameId : null

            // 同步到另一个模型
            if (frameId === measureModelId) {
                // 源是主模型，同步到对比模型
                if (this.$refs.measureModelContrast) {
                    this.$refs.measureModelContrast.setCameraRotation(theta)
                }
            } else if (frameId === contrastModelId) {
                // 源是对比模型，同步到主模型
                if (this.$refs.measureModel) {
                    this.$refs.measureModel.setCameraRotation(theta)
                }
            }

            // 延迟重置同步标志，允许下一次同步
            this.$nextTick(() => {
                this.isSyncing = false
            })
        },

        // 处理围度选择事件，同步到另一个模型
        handleCurveSelect(data) {
            // 防止循环同步
            if (this.isSyncing) return
            this.isSyncing = true

            const { curveName, frameId } = data
            const measureModelId = this.$refs.measureModel && this.$refs.measureModel.$refs.model ? this.$refs.measureModel.$refs.model.frameId : null
            const contrastModelId = this.$refs.measureModelContrast && this.$refs.measureModelContrast.$refs.model ? this.$refs.measureModelContrast.$refs.model.frameId : null

            // 同步到另一个模型
            if (frameId === measureModelId) {
                // 源是主模型，同步到对比模型
                if (this.$refs.measureModelContrast) {
                    this.$refs.measureModelContrast.highlightCurve(curveName)
                }
            } else if (frameId === contrastModelId) {
                // 源是对比模型，同步到主模型
                if (this.$refs.measureModel) {
                    this.$refs.measureModel.highlightCurve(curveName)
                }
            }

            // 延迟重置同步标志
            this.$nextTick(() => {
                this.isSyncing = false
            })
        },

        // 打开帮助弹窗
        openHelpDialog() {
            this.showHelpDialog = true
            this.helpDialogOpenTime = Date.now()
            // 禁止body滚动
            document.body.style.overflow = 'hidden'
        },

        // 关闭帮助弹窗
        closeHelpDialog() {
            // 检查弹窗是否已打开超过0.5秒，防止误触
            const timeSinceOpen = Date.now() - this.helpDialogOpenTime
            if (timeSinceOpen < 500) {
                return
            }
            this.showHelpDialog = false
            // 恢复body滚动
            document.body.style.overflow = ''
        },

        // 切换历史选择器
        toggleHistorySelector() {
            if (this.historyList.length > 1) {
                this.showHistorySelector = true
                this.historySelectorOpenTime = Date.now()
                // 禁止body滚动
                document.body.style.overflow = 'hidden'
            }
        },

        // 关闭历史选择器
        closeHistorySelector() {
            // 检查弹窗是否已打开超过0.5秒，防止误触
            const timeSinceOpen = Date.now() - this.historySelectorOpenTime
            if (timeSinceOpen < 500) {
                return
            }
            this.showHistorySelector = false
            // 恢复body滚动
            document.body.style.overflow = ''
        },

        // 选择历史记录
        selectHistory(item) {
            if (item.scanId === this.scanId) {
                return // 不能选择当前的
            }
            this.tcScanId = item.scanId
            this.contrastTime = this.formatDateTime(new Date(item.createTime * 1000))
            this.closeHistorySelector()
            // 重新获取围度数据
            this.girthLoading = true
            this.bmGirthContrasInfo()
        },

        // 处理卡片点击
        handleCardClick(item) {
            console.log(item.latestData, 8888)
            // 防止弹窗已打开时重复触发
            if (this.showTrendDialog) {
                return
            }
            // if (item.latestData > 0) {
            //     item.latestData = null
            // }
            this.currentTrendItem = item
            this.showTrendDialog = true
            this.trendDialogOpenTime = Date.now()
            // 禁止body滚动
            document.body.style.overflow = 'hidden'
            this.$nextTick(() => {
                this.loadTrendData(item.key)
            })
        },

        // 加载趋势数据
        loadTrendData(dataColumn) {
            this.trendLoading = true
            // 获取历史 scanId 列表
            const scanIds = this.historyList.map((h) => h.scanId)
            if (scanIds.length === 0) {
                this.trendData = []
                this.initTrendChart()
                this.trendLoading = false
                return
            }
            this.$apollo
                .query({
                    query: findBmGirthTrend,
                    variables: {
                        scanIds
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.getBmGirthTrend
                    if (data && data.code === 200 && data.data) {
                        // 找到对应的围度数据
                        const trendItem = data.data[dataColumn]
                        if (trendItem && trendItem.length > 0) {
                            // 按时间正序排列
                            const sortedData = [...trendItem].sort((a, b) => {
                                return new Date(a.scanTime).getTime() - new Date(b.scanTime).getTime()
                            })
                            this.trendData = sortedData
                                .filter(t => t.value != null) // 过滤掉空值
                                .map((t) => {
                                    // scanTime 是毫秒级时间戳
                                    const date = new Date(t.scanTime)
                                    const year = date.getFullYear()
                                    const month = date.getMonth() + 1
                                    const day = date.getDate()
                                    return {
                                        date: `${month}/${day}`,
                                        year: year,
                                        fullDate: date,
                                        value: Number(t.value.toFixed(1)) < 0 ? null : Number(t.value.toFixed(1))
                                    }
                                })
                        } else {
                            this.trendData = []
                        }
                    } else {
                        this.trendData = []
                    }
                    this.initTrendChart()
                })
                .catch((err) => {
                    console.error('获取趋势数据失败:', err)
                    this.trendData = []
                    this.initTrendChart()
                })
                .finally(() => {
                    this.trendLoading = false
                })
        },

        // 关闭趋势弹窗
        closeTrendDialog() {
            // 检查弹窗是否已打开超过0.5秒，防止误触
            const timeSinceOpen = Date.now() - this.trendDialogOpenTime
            if (timeSinceOpen < 500) {
                return
            }
            this.showTrendDialog = false
            this.currentTrendItem = null
            // 恢复body滚动
            document.body.style.overflow = ''
            if (this.trendChartInstance) {
                this.trendChartInstance.dispose()
                this.trendChartInstance = null
            }
        },

        // 初始化趋势图表
        initTrendChart() {
            const chartDom = this.$refs.trendChart
            if (!chartDom) return

            this.trendChartInstance = echarts.init(chartDom)

            // 用于跟踪每年的第一次出现
            const yearFirstOccurrence = {}

            // 在准备数据时就构造好标签
            const xData = this.trendData.map(item => {
                const year = item.year

                // 检查是否是该年的第一次出现
                if (!yearFirstOccurrence[year]) {
                    yearFirstOccurrence[year] = true
                    // 第一次出现，显示月/日和年份（年份在下方）
                    return `{date|${item.date}}\n{year|${year}}`
                }

                // 不是第一次出现，只显示月/日
                return `{date|${item.date}}`
            })

            const yData = this.trendData.map(item => item.value)

            const option = {
                backgroundColor: 'transparent',
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '15%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#787B8F',
                        fontSize: 14,
                        interval: 0,
                        margin: 15,
                        rich: {
                            date: {
                                color: '#787B8F',
                                fontSize: 14,
                                lineHeight: 20
                            },
                            year: {
                                color: '#787B8F',
                                fontSize: 14,
                                lineHeight: 20
                            }
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    show: true,
                    scale: true,
                    boundaryGap: ['10%', '10%'],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            type: 'solid'
                        }
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: [
                    {
                        type: 'line',
                        data: yData,
                        smooth: false,
                        symbol: 'circle',
                        symbolSize: 8,
                        itemStyle: {
                            color: '#5B8FF9'
                        },
                        lineStyle: {
                            color: '#5B8FF9',
                            width: 2
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(91, 143, 249, 0.3)' },
                                { offset: 1, color: 'rgba(91, 143, 249, 0.05)' }
                            ])
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#FFFFFF',
                            fontSize: 14,
                            formatter: '{c}'
                        }
                    }
                ]
            }

            this.trendChartInstance.setOption(option)
        }
    }
}
</script>

<style scoped lang="less">
// 渐变边框 mixin
.gradient-border() {
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 8px;
        padding: 1px;
        background: linear-gradient(208deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        pointer-events: none;
    }
}

.pc-report {
    // 覆盖全局字体，不使用 PingFang SC
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

    .content {
        width: 100%;
        display: flex;

        // 合并后的单个模型容器
        .modal-combined {
            .gradient-border();
            width: 100%;
            height: 640px;
            background: #262627;
            border-radius: 8px;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            // 旋转按钮（相对于容器定位）
            .rotate-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;

                img {
                    width: 40px;
                    height: 40px;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                // 左侧箭头：翻转后再旋转30度
                img.arrow-left {
                    transform: scaleX(-1) rotate(30deg);
                }

                &:hover img {
                    opacity: 1;
                }

                &.rotate-left {
                    left: 16px;
                }

                &.rotate-right {
                    right: 16px;
                }
            }

            // 双模型头部区域
            .modal-headers {
                display: flex;
                width: 100%;

                .modal-header {
                    flex: 1;
                    padding: 16px 20px;
                    box-sizing: border-box;
                    text-align: center;

                    .time-text {
                        font-size: 16px;
                        color: #C7C7CC;
                    }

                    .history-selector {
                        display: inline-flex;
                        align-items: center;
                        cursor: pointer;

                        svg {
                            margin-left: 6px;
                        }
                    }
                }
            }

            // 双模型内容区域
            .modal-body {
                flex: 1;
                display: flex;
                width: 100%;
                position: relative;

                .model-item {
                    flex: 1;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    // loading 相对于整个模型区域居中
                    :deep(.simple-loading) {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 200px !important;
                        z-index: 100;
                    }

                    .modal-container {
                        flex: 1;
                        width: 100%;
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        // 确保模型容器的层级高于脚底背景图
                        z-index: 2;
                        overflow: hidden;

                        :deep(.measure-model) {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        :deep(.simple-loading) {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        :deep(.iframe-template) {
                            height: 260px !important;
                            width: 200px !important;
                            min-width: 200px !important;
                        }

                        :deep(.iframe-template iframe) {
                            width: 200px !important;
                            height: 260px !important;
                            min-width: 200px !important;
                        }
                    }

                    .webgl-not-support {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 16px;
                        padding: 20px;

                        img {
                            width: 120px;
                            height: auto;
                            opacity: 0.6;
                        }

                        span {
                            color: #787B8F;
                            font-size: 14px;
                            text-align: center;
                            line-height: 1.5;
                        }
                    }

                    .no-history {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        margin-top: -100px;
                        justify-content: center;

                        .girth-default-img {
                            width: 130px;
                            object-fit: cover;
                            pointer-events: none;
                            display: block;
                        }
                    }

                    .model-ground {
                        position: absolute;
                        bottom: 165px;
                        left: 51%;
                        transform: translateX(-50%);
                        width: 160px;
                        height: 68px;
                        background: url(../../assets/images/pc-report/report_moxing_bg.png) center center no-repeat;
                        background-size: contain;
                        z-index: 1;
                        pointer-events: none;
                    }
                }
            }
        }
    }

    /* 帮助按钮栏 */
    .header-help {
        display: flex;
        justify-content: flex-end;
        padding: 40px 0 20px 0;

        .help-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            img {
                width: 20px;
                height: 20px;
                object-fit: contain;
            }
        }
    }

    /* 围度数据卡片 */
    .girth-cards {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;

        .girth-card {
            .gradient-border();
            background: #262627;
            border-radius: 8px;
            padding-top: 34px;
            padding-left: 16px;
            padding-right: 16px;
            height: 148px;
            box-sizing: border-box;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .card-top {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;

                .card-info {
                    flex: 1;

                    .card-title {
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;

                        span {
                            font-size: 16px;
                            color: #E5E5EA;
                            font-weight: 500;
                        }

                        img {
                            width: 21px;
                            margin-left: 12px;
                            object-fit: contain;
                        }
                    }

                    .data-row {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 32px;

                        &-left {
                            display: flex;
                            align-items: flex-end;

                        }

                        &-right {
                            width: 20px;
                            object-fit: cover;
                            align-self: flex-end;
                        }

                        .val {
                            font-size: 24px;
                            color: #FFFFFF;
                            font-weight: bold;
                        }

                        .unit {
                            font-size: 14px;
                            color: #999999;
                            margin-left: 8px;
                        }

                        .diff {
                            display: flex;
                            align-items: center;
                            margin-left: 16px;
                            font-size: 14px;
                            color: #787B8F;

                            img {
                                width: 14px;
                                margin-right: 2px;
                            }
                        }
                    }
                }
            }
        }
    }

    /* 脚注 */
    .tip {
        font-size: 16px;
        color: #787B8F;
        padding: 16px 0;
        text-align: left;
    }

    // 弹窗相关样式
    .trend-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    // 趋势弹窗
    .trend-dialog {
        width: 900px;
        height: 500px;
        background: #262628;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 30px 40px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
            margin-bottom: 20px;
        }

        &-title {
            display: flex;
            align-items: center;

            img {
                width: 24px;
                object-fit: contain;
                margin-right: 8px;
            }

            span {
                font-size: 21px;
                color: #E5E6EB;
            }

            .trend-dialog-unit {
                font-size: 16px;
                color: #787B8F;
                margin-left: 8px;
            }
        }

        &-close {
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
            // 禁止文本选择，防止点击时选中元素
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            &:hover {
                opacity: 0.7;
            }
        }

        &-chart {
            flex: 1;
            width: 100%;
            min-height: 0;
        }
    }

    .help-dialog {
        width: 800px;
        max-height: 80vh;
        background: #262628;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 30px 40px;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
            margin-bottom: 20px;
        }

        &-title {
            display: flex;
            align-items: center;

            img {
                width: 24px;
                object-fit: contain;
                margin-right: 8px;
            }

            span {
                font-size: 21px;
                color: #E5E6EB;
            }
        }

        &-close {
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
            // 禁止文本选择，防止点击时选中元素
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            &:hover {
                opacity: 0.7;
            }
        }

        &-content {
            overflow-y: auto;
            flex: 1;

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 2px;
            }
        }

        &-item {
            margin-bottom: 20px;

            &-title {
                display: flex;
                align-items: center;
                margin-bottom: 8px;

                span {
                    font-size: 16px;
                    color: #fff;
                    font-weight: 500;
                }
            }

            &-desc {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
                line-height: 1.6;
                text-align: left;
            }
        }
    }

    // 历史选择弹窗
    .history-dialog {
        width: 500px;
        max-height: 60vh;
        background: #262628;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 24px 32px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        // 禁止文本选择，防止连续点击时选中文本
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        &-title {
            span {
                font-size: 18px;
                color: #E5E6EB;
            }
        }

        &-close {
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
            // 禁止文本选择，防止点击时选中元素
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            &:hover {
                opacity: 0.7;
            }
        }

        &-content {
            overflow-y: auto;
            flex: 1;

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 2px;
            }
        }

        .history-item {
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
            margin-bottom: 8px;
            // 禁止文本选择，防止连续点击时选中文本
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            span {
                font-size: 15px;
                color: #C7C7CC;
            }

            &:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            &.active {
                background: rgba(99, 102, 241, 0.2);

                span {
                    color: #818CF8;
                }
            }
        }
    }

    // 弹窗动画
    .dialog-fade-enter-active,
    .dialog-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .dialog-fade-enter,
    .dialog-fade-leave-to {
        opacity: 0;
    }

    .dialog-zoom-enter-active,
    .dialog-zoom-leave-active {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .dialog-zoom-enter,
    .dialog-zoom-leave-to {
        transform: scale(0.9);
        opacity: 0;
    }
}
</style>

<!-- 非 scoped 样式 - 用于覆盖模型组件的固定尺寸 -->
<style lang="less">
.pc-report .modal-combined .model-item {
    .pc-shape-model {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .iframe-template {
            height: 520px !important;
            width: 400px !important;
            min-width: 400px !important;
            display: flex;
            align-items: center;
            justify-content: center;

            iframe {
                width: 400px !important;
                height: 520px !important;
                min-width: 400px !important;
                margin-top: 0 !important;
            }
        }
    }

    // 围度模型尺寸控制
    .pc-measure-model {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .iframe-template {
            height: 640px !important;
            width: 500px !important;
            min-width: 500px !important;
            display: flex;
            align-items: center;
            justify-content: center;

            iframe {
                width: 500px !important;
                height: 640px !important;
                min-width: 500px !important;
                margin-top: 0 !important;
            }
        }
    }
}
</style>
