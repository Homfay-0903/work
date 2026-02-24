<template>
    <div class="pc-report">
        <div class="content">
            <div class="modal">
                <div class="modal-container" v-if="isSupportWebgl.webgl">
                    <!-- 使用 PC 端专用的 Shape 组件来加载模型 -->
                    <pc-shape-model ref="shapeModel" :error-options="errorOptions"
                        @modelRotate="modelRotate"
                        @modelLoaded="onModelLoaded"
                        @modelUnloaded="onModelUnloaded"></pc-shape-model>
                </div>
                <!-- 浏览器不支持 WebGL -->
                <div class="webgl-not-support" v-else>
                    <img src="@/assets/images/mobel@2x.png" alt="不支持" />
                    <span>{{ isSupportWebgl.tipMsg }}</span>
                </div>
                <!-- 脚底背景图 -->
                <div class="model-ground" v-if="isSupportWebgl.webgl"></div>
                <!-- 左旋转按钮 -->
                <div class="rotate-btn rotate-left"
                     @click="rotateModel('left')"
                     :class="{ 'disabled': !isModelLoaded || !isModelFullyReady }"
                     v-if="isSupportWebgl.webgl">
                    <img src="@/assets/images/pc-report/icon-arrow.png" alt="左旋" class="arrow-left" />
                </div>
                <!-- 右旋转按钮 -->
                <div class="rotate-btn rotate-right"
                     @click="rotateModel('right')"
                     :class="{ 'disabled': !isModelLoaded || !isModelFullyReady }"
                     v-if="isSupportWebgl.webgl">
                    <img src="@/assets/images/pc-report/icon-arrow.png" alt="右旋" />
                </div>
            </div>
            <div class="right">
                <div class="course">
                    <div class="course-left">
                        <div class="score-chart">
                            <ScoreChart :value="bodyScore.evalScore" />
                        </div>
                        <div class="course-left-content">
                            <div class="course-left-content-title">本次测量得分</div>
                            <div class="course-left-content-compare" v-if="bodyScore.evalConScore">
                                <span>与上次得分对比</span>
                                <img v-if="bodyScore.evalScore - bodyScore.evalConScore >= 0"
                                    src="@/assets/images/pc-report/icona6.png" style="filter: brightness(0) saturate(100%) invert(47%) sepia(67%) saturate(1857%) hue-rotate(334deg) brightness(95%) contrast(88%);" />
                                <img v-else src="@/assets/images/pc-report/icona4.png" style="filter: brightness(0) saturate(100%) invert(47%) sepia(67%) saturate(1857%) hue-rotate(334deg) brightness(95%) contrast(88%);" />
                                <span class="compare-value">{{ Math.abs(bodyScore.evalScore - bodyScore.evalConScore)
                                }}</span>
                            </div>
                            <div class="course-left-content-time">
                                <img src="@/assets/images/pc-report/time.png" />
                                <span>{{ measureTime || '--' }}</span>
                            </div>
                            <!-- <div class="course-left-content-desc">*体态评估分数规则已于{{ scoreUpdateDate || '--' }}更新</div> -->
                        </div>
                    </div>
                </div>
                <div class="desc">
                    <!-- 体态评估结果列表 -->
                    <div class="assess-content" v-if="assess.length > 0">
                        <!-- 当前视角标题 -->
                        <div class="assess-title">{{ currentAssess.title }}</div>
                        <!-- 评估项目列表 -->
                        <div class="assess-list">
                            <div class="assess-item" v-for="(item, i) in currentAssess.list" :key="i">
                                <span class="item-name">{{ item.name }}</span>
                                <span class="item-status" :class="{
                                    'status-normal': item.status === '正常',
                                    'status-warning': item.status === '可能异常',
                                    'status-error': item.status !== '正常' && item.status !== '可能异常'
                                }">{{ item.status }}</span>
                            </div>
                        </div>
                        <!-- 状态图例 -->
                        <div class="assess-legend">
                            <div class="legend-item">
                                <span class="legend-dot normal"></span>
                                <span class="legend-text">正常</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot warning"></span>
                                <span class="legend-text">可能异常</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot error"></span>
                                <span class="legend-text">异常</span>
                            </div>
                        </div>
                        <!-- 分页指示器 -->
                        <div class="assess-indicators">
                            <span v-for="(item, index) in assess" :key="index" class="indicator-dot"
                                :class="{ 'active': index === pageIndex }"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 帮助按钮 (这一行只有右侧的帮助问号) -->
        <div class="header-help" v-if="postureCards.length > 0">
            <div class="help-icon" @click="openHelpDialog">
                <img src="@/assets/images/pc-report/icon6.png" />
            </div>
        </div>

        <!-- 体态详情卡片区域 -->
        <div class="posture-details" v-if="postureCards.length > 0">
            <div class="detail-col" v-for="(colList, colIndex) in cardColumns" :key="colIndex">
                <div class="posture-card" v-for="(item, index) in colList" :key="index"
                    :class="{ 'card-highlighted': isCardHighlighted(item.title) }">
                    <!-- 上半部分：信息 + 图片 -->
                    <div class="card-top">
                        <div class="card-info">
                            <div class="card-title">{{ item.title }}</div>

                            <!-- 数值行 -->
                            <div class="data-row">
                                <template v-if="item.isLeg">
                                    <!-- 腿型特殊展示: L / R -->
                                    <div class="leg-val">
                                        <span class="label">L</span>
                                        <span class="val">{{ Number(item.val).toFixed(1) }}°</span>
                                        <div class="diff-box" v-if="item.diff">
                                            <img v-if="item.diff.sign === 'up'"
                                                src="@/assets/images/pc-report/icona6.png" class="diff-icon" />
                                            <img v-else-if="item.diff.sign === 'down'"
                                                src="@/assets/images/pc-report/icona4.png" class="diff-icon" />
                                            <span class="diff-val">{{ item.diff.val }}</span>
                                        </div>
                                    </div>
                                    <div class="leg-val" style="margin-top: 4px;">
                                        <span class="label">R</span>
                                        <span class="val">{{ Number(item.val2).toFixed(1) }}°</span>
                                        <div class="diff-box" v-if="item.diff2">
                                            <img v-if="item.diff2.sign === 'up'"
                                                src="@/assets/images/pc-report/icona6.png" class="diff-icon" />
                                            <img v-else-if="item.diff2.sign === 'down'"
                                                src="@/assets/images/pc-report/icona4.png" class="diff-icon" />
                                            <span class="diff-val">{{ item.diff2.val }}</span>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <!-- 度单位直接拼接到数值后面，cm单位单独灰色显示 -->
                                    <span class="val">{{ Number(item.val).toFixed(1) }}{{ item.unit === '°' ? '°' : ''
                                    }}</span>
                                    <span class="unit" v-if="item.unit !== '°'">{{ item.unit }}</span>
                                    <div class="diff-box" v-if="item.diff">
                                        <img v-if="item.diff.sign === 'up'" src="@/assets/images/pc-report/icona6.png"
                                            class="diff-icon" />
                                        <img v-else-if="item.diff.sign === 'down'"
                                            src="@/assets/images/pc-report/icona4.png" class="diff-icon" />
                                        <span class="diff-val">{{ item.diff.val }}</span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div class="card-img">
                            <img :src="getPostureImageSrc(item.imageName)" :alt="item.title">
                        </div>
                    </div>

                    <!-- 状态标签 -->
                    <div class="status-tag" :class="item.statusClass">{{ item.statusLabel }}</div>

                    <!-- 下半部分：描述 -->
                    <div class="card-desc-row">{{ item.desc }}</div>
                </div>
            </div>
        </div>

        <!-- 脚注 -->
        <div class="tip" v-if="postureCards.length > 0">
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
                            <div class="help-dialog-item" v-for="(item, index) in postureHelpList" :key="index">
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
    </div>
</template>

<script>
import ScoreChart from './ScoreChart.vue'
import PcShapeModel from '@/components/model/pc-report/Shape.vue'
import { findBodyScore, findBsEvalContrastInfo, findBsDataStateInfo, findScanTypeInfo } from '@/assets/js/apolloGql.js'
import isSupportWebgl from '@/assets/js/webgl.js'
import { isVAPro6, isVAPro7 } from '@/types/device.js'
import { toDecimal2 } from '@/assets/js/util.js'

export default {
    name: 'PostureTab',
    components: {
        ScoreChart,
        PcShapeModel
    },
    data() {
        return {
            // 模型信息（从 localStorage 获取）
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')) || {},
            // 评分数据
            bodyScore: {
                massScore: 0,
                massConScore: null,
                evalScore: 0,
                evalConScore: null
            },
            // scoreType: 1=身体成分, 2=体态评估, 3=两者都有
            scoreType: 0,
            measureTime: '',
            scoreUpdateDate: '',
            // loading 状态
            scoreLoading: false,
            // 模型相关
            isSupportWebgl: isSupportWebgl,
            // 体态评估异常信息（传递给 PcShapeModel 组件）
            errorOptions: {
                errorPoints: [],
                errorLines: []
            },
            // 体态评估结果数据（用于在模型上显示异常点位）
            assess: [],
            // 当前视角索引 (0=正面, 1=左侧, 2=背面, 3=右侧)
            pageIndex: 0,
            // 详细评估数据
            evalInfo: {},
            evalDiffInfo: {},
            bsDataState: {},
            isVAPro6: isVAPro6(),
            isVAPro7: isVAPro7(),
            isNewMathTt: 0,
            // 帮助弹窗
            showHelpDialog: false,
            // 模型是否已加载完毕
            isModelLoaded: false,
            // 当前模型实例ID
            currentModelInstanceId: null,
            // requestAnimationFrame ID，用于节流模型旋转回调
            rotateRafId: null,
            // 最后一次点击旋转按钮的时间戳（用于冷却时间控制）
            lastRotateClickTime: 0,
            // 旋转按钮冷却时间（毫秒）- 防止连续点击
            rotateCooldown: 300,
            postureHelpList: [
                { title: '头前引', msg: '耳垂在肩峰前方，易导致颈肩部酸痛不适，久之造成颈椎退化，生理曲度改变等问题' },
                { title: '头侧歪', msg: '头侧歪可能引发单侧颈部不适，单侧头痛，以及神经压迫的手臂发麻无力等症状' },
                { title: '高低肩', msg: '高低肩不仅影响美观，还可能与脊柱侧弯、骨盆倾斜等体态问题相关' },
                { title: '圆肩', msg: '圆肩使胸廓容积变小，膈肌活动受限，影响呼吸、心血管及消化吸收功能，出现胸闷、头晕、气短等症状' },
                { title: '骨盆前移', msg: '骨盆前移容易引起腰肌劳损、脏器下垂、盆底肌无力等' },
                { title: '骨盆前/后倾', msg: '长期骨盆前/后倾会改变腰椎生理曲度，增加腰椎间盘压力，导致腰痛等问题' },
                { title: '膝过伸', msg: '膝超伸或膝前屈会引发膝关节力学结构改变，增加半月板、韧带、关节囊的损伤几率' },
                { title: '腿型', msg: '异常腿型可导致下肢力学功能紊乱，增加膝关节损伤几率，引发骨盆、脊柱等体态问题和症状' }
            ]
        }
    },
    computed: {
        // 当前视角的评估数据
        currentAssess() {
            if (this.assess && this.assess[this.pageIndex]) {
                return this.assess[this.pageIndex]
            }
            return { title: '', list: [] }
        },
        // 模型是否完全准备好（包括点位数据）
        isModelFullyReady() {
            // 检查模型引用和内部状态
            if (!this.$refs.shapeModel) return false
            return this.$refs.shapeModel.isModelReady === true
        },
        /**
         * 体态评估详情卡片数据
         *
         * 重要说明：
         * 1. 数值来源：evalInfo（原始数据，字段值是数字，如 info.headForward = 1.2）
         * 2. 状态判断：bsDataState（状态数据，用于判断异常/正常/可能异常）
         * 3. 不要把 evalInfo 的数据结构改成 { val, diff } 对象形式
         */
        postureCards() {
            if (!this.evalInfo || Object.keys(this.evalInfo).length === 0) return []

            const cards = []
            // state 用于判断异常状态，info 用于获取数值
            const state = this.bsDataState || {}
            const info = this.evalInfo

            // 风险描述映射
            const riskMap = {
                'headForward': '头前引易导致颈肩部酸痛不适，久之造成颈椎退化，生理曲度改变等问题',
                'headSlant': '头侧歪可能引发单侧颈部不适，单侧头痛，以及神经压迫的手臂发麻无力等症状',
                'roundShoulder': '圆肩使胸廓容积变小，膈肌活动受限，影响呼吸、心血管及消化吸收功能，出现胸闷、头晕、气短等症状',
                'highLowShoulder': '高低肩不仅影响美观，还可能与脊柱侧弯、骨盆倾斜等体态问题相关',
                'pelvisForward': '骨盆前移容易引起腰肌劳损、脏器下垂、盆底肌无力等',
                'pelvisTilt': '长期骨盆前/后倾会改变腰椎生理曲度，增加腰椎间盘压力，导致腰痛等问题',
                'knee': '膝超伸或膝前屈会引发膝关节力学结构改变，增加半月板、韧带、关节囊的损伤几率',
                'leg': '异常腿型可导致下肢力学功能紊乱，增加膝关节损伤几率，引发骨盆、脊柱等体态问题和症状'
            }

            // 格式化 diff 显示 helper -> 返回对象 { val: '1.2', sign: 'up'/'down'/'equal', unit: 'cm' }
            // 没有数据时返回 null，不显示任何内容
            const getDiffObj = (key) => {
                const diffVal = this.evalDiffInfo[key]
                if (diffVal == null) return null
                // 确保转化成数字
                const num = Number(diffVal)
                if (isNaN(num)) return null

                let sign = 'equal'
                if (num > 0) sign = 'up'
                if (num < 0) sign = 'down'

                return {
                    val: Math.abs(num).toFixed(1),
                    sign,
                    raw: num
                }
            }

            // 1. 头前引 - 使用 bsDataState.headForwardState（对齐移动端文案）
            // state: 1=异常, 2=可能异常, 0=正常
            let hfLabel = '正常'
            let hfClass = 'normal'
            let hfImg = '正常'
            if (state.headForwardState === 1) {
                hfLabel = '存在明显头前引倾向'
                hfClass = 'error'
                hfImg = '异常'
            } else if (state.headForwardState === 2) {
                hfLabel = '存在头前引倾向'
                hfClass = 'warning'
                hfImg = '异常'
            }
            cards.push({
                title: '头前引',
                val: info.headForward || 0,
                unit: 'cm',
                diff: getDiffObj('headForward'),
                statusLabel: hfLabel,
                statusClass: hfClass,
                desc: riskMap.headForward,
                imageName: `头前引-${hfImg}@2x.png`
            })

            // 2. 头侧歪 - 使用 bsDataState.headSlantState（对齐移动端文案）
            // state: 1=偏右异常, 2=偏左异常, 3=偏右可能, 4=偏左可能, 0=正常
            let hsLabel = '正常'
            let hsClass = 'normal'
            let hsImg = '正常'
            if (state.headSlantState === 1) {
                hsLabel = '存在明显头侧歪倾向（偏右）'
                hsClass = 'error'
                hsImg = '偏右'
            } else if (state.headSlantState === 2) {
                hsLabel = '存在明显头侧歪倾向（偏左）'
                hsClass = 'error'
                hsImg = '偏左'
            } else if (state.headSlantState === 3) {
                hsLabel = '存在头侧歪倾向（偏右）'
                hsClass = 'warning'
                hsImg = '偏右'
            } else if (state.headSlantState === 4) {
                hsLabel = '存在头侧歪倾向（偏左）'
                hsClass = 'warning'
                hsImg = '偏左'
            }
            cards.push({
                title: '头侧歪',
                val: info.headSlant || 0,
                unit: '°',
                diff: getDiffObj('headSlant'),
                statusLabel: hsLabel,
                statusClass: hsClass,
                desc: riskMap.headSlant,
                imageName: `头侧歪-${hsImg}@2x.png`
            })

            // 3. 左圆肩 - 使用 bsDataState.leftRoundShoulderState（对齐移动端文案）
            // state: 1=异常, 2=可能异常, 0=正常
            let rslLabel = '正常'
            let rslClass = 'normal'
            let rslImg = '正常'
            if (state.leftRoundShoulderState === 1) {
                rslLabel = '存在明显左圆肩倾向'
                rslClass = 'error'
                rslImg = '异常'
            } else if (state.leftRoundShoulderState === 2) {
                rslLabel = '存在左圆肩倾向'
                rslClass = 'warning'
                rslImg = '异常'
            }
            cards.push({
                title: '左圆肩',
                val: info.roundShoulderLeft || 0,
                unit: 'cm',
                diff: getDiffObj('roundShoulderLeft'),
                statusLabel: rslLabel,
                statusClass: rslClass,
                desc: riskMap.roundShoulder,
                imageName: `左圆肩-${rslImg}@2x.png`
            })

            // 4. 右圆肩 - 使用 bsDataState.rightRoundShoulderState（对齐移动端文案）
            // state: 1=异常, 2=可能异常, 0=正常
            let rsrLabel = '正常'
            let rsrClass = 'normal'
            let rsrImg = '正常'
            if (state.rightRoundShoulderState === 1) {
                rsrLabel = '存在明显右圆肩倾向'
                rsrClass = 'error'
                rsrImg = '异常'
            } else if (state.rightRoundShoulderState === 2) {
                rsrLabel = '存在右圆肩倾向'
                rsrClass = 'warning'
                rsrImg = '异常'
            }
            cards.push({
                title: '右圆肩',
                val: info.roundShoulderRight || 0,
                unit: 'cm',
                diff: getDiffObj('roundShoulderRight'),
                statusLabel: rsrLabel,
                statusClass: rsrClass,
                desc: riskMap.roundShoulder,
                imageName: `右圆肩-${rsrImg}@2x.png`
            })

            // 5. 高低肩 - 使用 bsDataState.highLowShoudlerState（对齐移动端文案）
            // state: 1=左高异常, 2=右高异常, 3=左高可能, 4=右高可能, 0=正常
            let hlsLabel = '正常'
            let hlsClass = 'normal'
            let hlsImg = '正常'
            if (state.highLowShoudlerState === 1) {
                hlsLabel = '存在明显高低肩倾向（左高右低）'
                hlsClass = 'error'
                hlsImg = '左高'
            } else if (state.highLowShoudlerState === 2) {
                hlsLabel = '存在明显高低肩倾向（右高左低）'
                hlsClass = 'error'
                hlsImg = '右高'
            } else if (state.highLowShoudlerState === 3) {
                hlsLabel = '存在高低肩倾向（左高右低）'
                hlsClass = 'warning'
                hlsImg = '左高'
            } else if (state.highLowShoudlerState === 4) {
                hlsLabel = '存在高低肩倾向（右高左低）'
                hlsClass = 'warning'
                hlsImg = '右高'
            }
            cards.push({
                title: '高低肩',
                val: info.highLowShoudler || 0,
                unit: '°',
                diff: getDiffObj('highLowShoudler'),
                statusLabel: hlsLabel,
                statusClass: hlsClass,
                desc: riskMap.highLowShoulder,
                imageName: `高低肩-${hlsImg}@2x.png`
            })

            // 6. 骨盆前移 - 使用 bsDataState.pelvisForwardState（对齐移动端文案）
            // state: 1=异常, 2=可能异常, 0=正常
            let pfLabel = '正常'
            let pfClass = 'normal'
            let pfImg = '正常'
            if (state.pelvisForwardState === 1) {
                pfLabel = '存在明显骨盆前移倾向'
                pfClass = 'error'
                pfImg = '异常'
            } else if (state.pelvisForwardState === 2) {
                pfLabel = '存在骨盆前移倾向'
                pfClass = 'warning'
                pfImg = '异常'
            }
            cards.push({
                title: '骨盆前移',
                val: info.pelvisForward || 0,
                unit: 'cm',
                diff: getDiffObj('pelvisForward'),
                statusLabel: pfLabel,
                statusClass: pfClass,
                desc: riskMap.pelvisForward,
                imageName: `骨盆前移-${pfImg}@2x.png`
            })

            // 7. 左膝评估 - 使用 bsDataState.leftKneeCheckState（对齐移动端文案）
            // state: 1=前屈异常, 2=超伸异常, 3=前屈可能, 4=超伸可能, 0=正常
            let lkLabel = '正常'
            let lkClass = 'normal'
            let lkImg = '正常'
            if (state.leftKneeCheckState === 1) {
                lkLabel = '存在明显左膝前屈倾向'
                lkClass = 'error'
                lkImg = '前屈'
            } else if (state.leftKneeCheckState === 2) {
                lkLabel = '存在明显左膝超伸倾向'
                lkClass = 'error'
                lkImg = '超伸'
            } else if (state.leftKneeCheckState === 3) {
                lkLabel = '存在左膝前屈倾向'
                lkClass = 'warning'
                lkImg = '前屈'
            } else if (state.leftKneeCheckState === 4) {
                lkLabel = '存在左膝超伸倾向'
                lkClass = 'warning'
                lkImg = '超伸'
            }
            cards.push({
                title: '左膝评估',
                val: info.leftKneeCheck || 0,
                unit: '°',
                diff: getDiffObj('leftKneeCheck'),
                statusLabel: lkLabel,
                statusClass: lkClass,
                desc: riskMap.knee,
                imageName: `左膝评估-${lkImg}@2x.png`
            })

            // 8. 右膝评估 - 使用 bsDataState.rightKneeCheckState（对齐移动端文案）
            // state: 1=前屈异常, 2=超伸异常, 3=前屈可能, 4=超伸可能, 0=正常
            let rkLabel = '正常'
            let rkClass = 'normal'
            let rkImg = '正常'
            if (state.rightKneeCheckState === 1) {
                rkLabel = '存在明显右膝前屈倾向'
                rkClass = 'error'
                rkImg = '前屈'
            } else if (state.rightKneeCheckState === 2) {
                rkLabel = '存在明显右膝超伸倾向'
                rkClass = 'error'
                rkImg = '超伸'
            } else if (state.rightKneeCheckState === 3) {
                rkLabel = '存在右膝前屈倾向'
                rkClass = 'warning'
                rkImg = '前屈'
            } else if (state.rightKneeCheckState === 4) {
                rkLabel = '存在右膝超伸倾向'
                rkClass = 'warning'
                rkImg = '超伸'
            }
            cards.push({
                title: '右膝评估',
                val: info.rightKneeCheck || 0,
                unit: '°',
                diff: getDiffObj('rightKneeCheck'),
                statusLabel: rkLabel,
                statusClass: rkClass,
                desc: riskMap.knee,
                imageName: `右膝评估-${rkImg}@2x.png`
            })

            // 9. 腿型 - 使用 bsDataState.legType 和 legState（对齐移动端文案）
            // legType: 0=正常, 2=K型腿, 3=D型腿, 4=X型腿, 5=O型腿, 1/6/7=异常
            // legState: 1=异常, 2=可能异常, 0=正常（用于判断严重程度）
            let legLabel = '正常'
            let legClass = 'normal'
            let legImg = '正常'
            // 判断是可能异常还是异常
            const isLegWarning = state.legState === 2
            switch (state.legType) {
                case 0:
                    legLabel = '正常'
                    legClass = 'normal'
                    legImg = '正常'
                    break
                case 1:
                    legLabel = isLegWarning ? '存在腿型异常倾向' : '存在明显腿型异常'
                    legClass = isLegWarning ? 'warning' : 'error'
                    legImg = '正常'
                    break
                case 2:
                    legLabel = isLegWarning ? '存在K型腿倾向' : '存在明显K型腿倾向'
                    legClass = isLegWarning ? 'warning' : 'error'
                    legImg = 'K型腿'
                    break
                case 3:
                    legLabel = isLegWarning ? '存在D型腿倾向' : '存在明显D型腿倾向'
                    legClass = isLegWarning ? 'warning' : 'error'
                    legImg = 'D型腿'
                    break
                case 4:
                    legLabel = isLegWarning ? '存在X型腿倾向' : '存在明显X型腿倾向'
                    legClass = isLegWarning ? 'warning' : 'error'
                    legImg = 'X型腿'
                    break
                case 5:
                    legLabel = isLegWarning ? '存在O型腿倾向' : '存在明显O型腿倾向'
                    legClass = isLegWarning ? 'warning' : 'error'
                    legImg = 'O型腿'
                    break
                case 6:
                case 7:
                    legLabel = isLegWarning ? '存在腿型异常倾向' : '存在明显腿型异常'
                    legClass = isLegWarning ? 'warning' : 'error'
                    legImg = '正常'
                    break
                default:
                    legLabel = '正常'
                    legClass = 'normal'
                    legImg = '正常'
            }
            cards.push({
                title: '腿型',
                isLeg: true,
                val: info.leftLegXo || 0,
                diff: getDiffObj('leftLegXo'),
                val2: info.rightLegXo || 0,
                diff2: getDiffObj('rightLegXo'),
                statusLabel: legLabel,
                statusClass: legClass,
                desc: riskMap.leg,
                imageName: `腿型-${legImg}@2x.png`
            })

            return cards
        },
        // 将卡片数据分配到3列中，实现瀑布流布局
        cardColumns() {
            const cols = [[], [], []]
            this.postureCards.forEach((card, index) => {
                cols[index % 3].push(card)
            })
            return cols
        },
        // 当前视角需要高亮的卡片标题集合
        highlightedCardTitles() {
            const titles = new Set()
            if (this.currentAssess && this.currentAssess.list) {
                this.currentAssess.list.forEach(item => {
                    titles.add(item.name)
                    // 处理"骨盆前/后移"与"骨盆前移"的匹配
                    if (item.name === '骨盆前/后移') {
                        titles.add('骨盆前移')
                    }
                })
            }
            return titles
        }
    },
    mounted() {
        console.log('[PostureTab] 组件已挂载')
        // 确保每次挂载时都重置模型加载状态
        this.isModelLoaded = false
        this.currentModelInstanceId = null
        // 延迟初始化，给模型组件挂载留出时间
        this.$nextTick(() => {
            // 获取模型实例ID
            if (this.$refs.shapeModel && this.$refs.shapeModel.instanceId) {
                this.currentModelInstanceId = this.$refs.shapeModel.instanceId
                console.log('[PostureTab] 已记录模型实例ID:', this.currentModelInstanceId)
            }
            this.init()
        })
    },
    beforeDestroy() {
        console.log('[PostureTab] 组件开始销毁，当前模型实例ID:', this.currentModelInstanceId)
        // 清理 requestAnimationFrame
        if (this.rotateRafId) {
            cancelAnimationFrame(this.rotateRafId)
            this.rotateRafId = null
        }
        // 组件销毁时重置模型加载状态
        this.isModelLoaded = false
        this.currentModelInstanceId = null
        // 恢复 body 滚动（防止弹窗打开时组件销毁）
        document.body.style.overflow = ''
    },
    methods: {
        // 初始化数据
        init() {
            if (!this.modelInfo.scanId) {
                console.error('scanId 不存在')
                return
            }
            // 计算 scoreType
            if (this.modelInfo.biaStatus === 1 && this.modelInfo.evalStatus === 1) {
                this.scoreType = 3
            } else if (this.modelInfo.biaStatus === 1) {
                this.scoreType = 1
            } else if (this.modelInfo.evalStatus === 1) {
                this.scoreType = 2
            }
            // 并行获取评分数据和体态评估数据
            this.getBodyScore()
            this.getEvalContrastInfo()
            this.getBsDataStateInfo()
            this.getScanTypeInfo()
        },
        // 模型旋转回调（模型每次旋转都会触发）
        // 实际测试得出的 idx 对应关系：
        // idx=1 → 左侧面, idx=2 → 背面, idx=3 → 右侧面, idx=4 → 正面
        modelRotate(index, instanceId) {
            // 验证实例ID，确保事件来自当前模型实例
            if (instanceId && instanceId !== this.currentModelInstanceId) {
                console.warn(`[PostureTab] 忽略来自旧实例的旋转事件，旧实例ID: ${instanceId}，当前实例ID: ${this.currentModelInstanceId}`)
                return
            }

            // 节流：使用 requestAnimationFrame 优化性能
            if (this.rotateRafId) {
                cancelAnimationFrame(this.rotateRafId)
            }

            this.rotateRafId = requestAnimationFrame(() => {
                // 将模型的 index 映射到 pageIndex
                // pageIndex: 0=正面, 1=左侧面, 2=背面, 3=右侧面
                const indexMap = { 1: 1, 2: 2, 3: 3, 4: 0 }
                const newPageIndex = index in indexMap ? indexMap[index] : 0

                // 无论是箭头点击还是手动拖拽，都直接更新 pageIndex
                // 让右侧文字描述始终跟随模型朝向
                if (this.pageIndex !== newPageIndex) {
                    console.log(`[PostureTab] 模型旋转：${this.pageIndex} → ${newPageIndex}`)
                    this.pageIndex = newPageIndex
                }

                this.rotateRafId = null
            })
        },
        // 模型加载完成回调
        onModelLoaded(instanceId) {
            // 验证实例ID
            if (instanceId && instanceId !== this.currentModelInstanceId) {
                console.warn(`[PostureTab] 忽略来自旧实例的加载完成事件，旧实例ID: ${instanceId}，当前实例ID: ${this.currentModelInstanceId}`)
                return
            }
            this.isModelLoaded = true
            console.log(`✓ [PostureTab] 模型加载完成，实例ID: ${instanceId}，旋转按钮已启用`)
        },
        // 模型卸载回调
        onModelUnloaded(instanceId) {
            console.log(`⊗ [PostureTab] 模型已卸载，实例ID: ${instanceId}`)
            // 只有当前实例卸载时才重置状态
            if (instanceId === this.currentModelInstanceId) {
                this.isModelLoaded = false
                this.currentModelInstanceId = null
                console.log(`[PostureTab] 旋转按钮已禁用`)
            }
        },
        // 旋转模型（点击箭头触发）
        // pageIndex: 0=正面, 1=左侧面, 2=背面, 3=右侧面
        // 模型旋转方向：turnModel(0)=向左转, turnModel(1)=向右转
        rotateModel(direction) {
            // 第1层检查：模型是否加载完成
            if (!this.isModelLoaded) {
                console.log('⏳ [PostureTab] 模型还未加载完成，忽略旋转点击')
                return
            }

            // 第2层检查：模型引用是否存在
            if (!this.$refs.shapeModel) {
                console.error('❌ [PostureTab] 模型引用不存在')
                return
            }

            // 第3层检查：验证模型实例ID是否匹配
            if (this.$refs.shapeModel.instanceId !== this.currentModelInstanceId) {
                console.error('❌ [PostureTab] 模型实例ID不匹配，当前:', this.currentModelInstanceId, '实际:', this.$refs.shapeModel.instanceId)
                return
            }

            // 第4层检查：模型内部是否真正准备好（包括点位渲染）⭐ 关键检查
            if (!this.$refs.shapeModel.isModelReady) {
                console.log('⏳ [PostureTab] 点位数据还在渲染中，请稍候...')
                console.log('   - 模型加载状态:', !this.$refs.shapeModel.isLoad ? '已加载' : '加载中')
                console.log('   - 点位准备状态:', this.$refs.shapeModel.isModelReady ? '已准备' : '未准备')
                console.log('   - 点位数量:', (this.errorOptions.errorPoints && this.errorOptions.errorPoints.length) || 0)
                return
            }

            // 第5层检查：防止短时间内连续点击（300ms 冷却）
            const now = Date.now()
            const timeSinceLastClick = now - this.lastRotateClickTime
            if (timeSinceLastClick < this.rotateCooldown) {
                console.log(`⏰ [PostureTab] 点击过快，请等待 ${Math.ceil((this.rotateCooldown - timeSinceLastClick) / 100) / 10}秒`)
                return
            }

            // 记录本次点击时间
            this.lastRotateClickTime = now

            // 所有检查通过，执行旋转
            try {
                if (direction === 'left') {
                    // 点击左箭头：模型向左转
                    this.$refs.shapeModel.turnModel(0)
                    console.log('🎯 [PostureTab] 模型向左旋转')
                } else {
                    // 点击右箭头：模型向右转
                    this.$refs.shapeModel.turnModel(1)
                    console.log('🎯 [PostureTab] 模型向右旋转')
                }
            } catch (error) {
                console.error('❌ [PostureTab] 模型旋转调用失败:', error)
            }

            // pageIndex 会由 modelRotate 回调自动更新，始终与模型朝向保持一致
        },

        /**
         * 获取体态结论状态数据
         *
         * 重要：API 返回结构是 { code, message, data: { headForwardState, headSlantState, ... } }
         * bsDataState 只保存 data（状态对象），用于 postureCards 判断异常
         *
         * 状态值含义（用于 postureCards 判断异常）：
         * - headForwardState: 1=异常, 2=可能异常, 0=正常
         * - headSlantState: 1/3=偏右, 2/4=偏左, 0=正常（1/2是异常，3/4是可能异常）
         * - leftRoundShoulderState/rightRoundShoulderState: 1=异常, 2=可能异常, 0=正常
         * - highLowShoudlerState: 1/3=左高, 2/4=右高, 0=正常（1/2是异常，3/4是可能异常）
         * - pelvisForwardState: 1=异常, 2=可能异常, 0=正常
         * - leftKneeCheckState/rightKneeCheckState: 1/3=膝前曲, 2/4=膝超伸, 0=正常
         * - legType: 0=正常, 1=异常, 2=K型腿, 3=D型腿, 4=X型腿, 5=O型腿
         */
        getBsDataStateInfo() {
            if (this.modelInfo.evalStatus !== 1) return
            this.$apollo
                .query({
                    query: findBsDataStateInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const result = res.data.findBsDataStateInfo
                    if (result && result.data) {
                        this.bsDataState = result.data
                    } else if (result && (result.headForwardState != null || result.legType != null)) {
                        this.bsDataState = result
                    } else {
                        this.bsDataState = {}
                    }
                    if (Object.keys(this.evalInfo).length > 0) {
                        this.processEvalData(this.evalInfo)
                    }
                })
                .catch((err) => {
                    console.error('获取体态结论数据失败:', err)
                })
        },
        getPostureImageSrc(imageName) {
            try {
                return require(`@/assets/images/pc-report/posture/${imageName}`)
            } catch (e) {
                return require('@/assets/images/pc-report/posture/头前引-正常@2x.png')
            }
        },
        // 获取扫描类型信息
        getScanTypeInfo() {
            this.$apollo.query({
                query: findScanTypeInfo,
                variables: {
                    scanId: this.modelInfo.scanId
                },
                fetchPolicy: 'network-only'
            }).then(res => {
                const data = res.data.findScanTypeInfo
                if (data && data.code === 200 && data.data) {
                    this.isNewMathTt = data.data.isNewMathTt || 0
                    if (Object.keys(this.evalInfo).length > 0) {
                        this.processEvalData(this.evalInfo)
                    }
                }
            }).catch(err => {
                console.error('获取扫描类型信息失败:', err)
            })
        },

        /**
         * 获取体态评估对比数据
         *
         * 重要：evalInfo 保存的是原始数据，字段值是数字（如 headForward: 1.2）
         * 不要转换成 { val, diff } 对象结构
         * postureCards 中直接使用 evalInfo.headForward 等获取数值
         */
        getEvalContrastInfo() {
            if (this.modelInfo.evalStatus !== 1) return
            this.$apollo
                .query({
                    query: findBsEvalContrastInfo,
                    variables: {
                        scanId: this.modelInfo.scanId,
                        scanTime: this.modelInfo.createTime
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBsEvalContrastInfo
                    if (data && data.code === 200 && data.data && data.data.length) {
                        const bsEvalInfo = data.data[0]
                        // 保存原始数据，字段值是数字（如 headForward: 1.2）
                        this.evalInfo = bsEvalInfo
                        this.processEvalData(bsEvalInfo)

                        // 计算对比 diff
                        this.evalDiffInfo = {}
                        if (data.data.length > 1) {
                            const prev = data.data[1]
                            for (const key in bsEvalInfo) {
                                if (Object.prototype.hasOwnProperty.call(bsEvalInfo, key)) {
                                    if (typeof bsEvalInfo[key] === 'number' && typeof prev[key] === 'number') {
                                        this.evalDiffInfo[key] = toDecimal2(bsEvalInfo[key] - prev[key], 1)
                                    }
                                }
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.error('获取体态评估数据失败:', err)
                })
        },
        // 处理体态评估数据，计算异常点位
        processEvalData(evalInfo) {
            const state = this.bsDataState || {}
            // 是否使用旧算法判断 (非 VAPro7 且 非新算法)
            const useOldAlgo = !this.isVAPro7 && !this.isNewMathTt
            const info = evalInfo

            // 辅助函数：根据状态值获取状态文本（返回 正常/可能异常/异常）
            const getHeadSlantStatus = () => {
                if (useOldAlgo) {
                    if (info.headSlant !== 0) return '异常'
                    return '正常'
                }
                // 新算法：1/2=异常, 3/4=可能异常
                if (state.headSlantState === 1 || state.headSlantState === 2) return '异常'
                if (state.headSlantState === 3 || state.headSlantState === 4) return '可能异常'
                return '正常'
            }
            const getHeadForwardStatus = () => {
                if (useOldAlgo) {
                    if (info.headForward > 0) return '异常'
                    return '正常'
                }
                if (state.headForwardState === 1) return '异常'
                if (state.headForwardState === 2) return '可能异常'
                return '正常'
            }
            const getLeftRoundShoulderStatus = () => {
                if (useOldAlgo) {
                    if (info.roundShoulderLeft > 15) return '异常'
                    return '正常'
                }
                if (state.leftRoundShoulderState === 1) return '异常'
                if (state.leftRoundShoulderState === 2) return '可能异常'
                return '正常'
            }
            const getRightRoundShoulderStatus = () => {
                if (useOldAlgo) {
                    if (info.roundShoulderRight > 15) return '异常'
                    return '正常'
                }
                if (state.rightRoundShoulderState === 1) return '异常'
                if (state.rightRoundShoulderState === 2) return '可能异常'
                return '正常'
            }
            const getHighLowShoulderStatus = () => {
                if (useOldAlgo) {
                    if (info.highLowShoudler !== 0) return '异常'
                    return '正常'
                }
                // 新算法：1/2=异常, 3/4=可能异常
                if (state.highLowShoudlerState === 1 || state.highLowShoudlerState === 2) return '异常'
                if (state.highLowShoudlerState === 3 || state.highLowShoudlerState === 4) return '可能异常'
                return '正常'
            }
            const getPelvisForwardStatus = () => {
                if (useOldAlgo) {
                    if (info.pelvisForward > 185 || info.pelvisForward < 175) return '异常'
                    return '正常'
                }
                if (state.pelvisForwardState === 1) return '异常'
                if (state.pelvisForwardState === 2) return '可能异常'
                return '正常'
            }
            const getLeftKneeStatus = () => {
                if (useOldAlgo) {
                    if (info.leftKneeCheck > 190 || info.leftKneeCheck < 160) return '异常'
                    return '正常'
                }
                // 新算法：1/2=异常, 3/4=可能异常
                if (state.leftKneeCheckState === 1 || state.leftKneeCheckState === 2) return '异常'
                if (state.leftKneeCheckState === 3 || state.leftKneeCheckState === 4) return '可能异常'
                return '正常'
            }
            const getRightKneeStatus = () => {
                if (useOldAlgo) {
                    if (info.rightKneeCheck > 190 || info.rightKneeCheck < 160) return '异常'
                    return '正常'
                }
                // 新算法：1/2=异常, 3/4=可能异常
                if (state.rightKneeCheckState === 1 || state.rightKneeCheckState === 2) return '异常'
                if (state.rightKneeCheckState === 3 || state.rightKneeCheckState === 4) return '可能异常'
                return '正常'
            }
            const getLegTypeStatus = () => {
                if (useOldAlgo) {
                    const oldStatus = this.getLegStatus(info.leftLegXo, info.rightLegXo)
                    return oldStatus === '正常' ? '正常' : '异常'
                }
                // 判断是可能异常还是异常
                if (state.legType === 0) return '正常'
                if (state.legState === 2) return '可能异常'
                return '异常'
            }

            // 头前引数据项
            const headForwardItem = {
                name: '头前引',
                status: getHeadForwardStatus(),
                errorLines: ['headForward'],
                errorPoints: ['left_ear_point', 'right_ear_point']
            }

            // 骨盆前移数据项
            const pelvisForwardItem = {
                name: '骨盆前移',
                status: getPelvisForwardStatus(),
                errorLines: ['pelvisForwardUp', 'pelvisForwardDown', 'pelvisForward'],
                errorPoints: ['left_hip_joint_point', 'right_hip_joint_point', 'left_body_gravity_line_point', 'right_body_gravity_line_point']
            }

            // 构建左侧面列表
            const leftSideList = []
            // hsVisualization: 1=头前引显示在左侧面, 0=头前引显示在右侧面
            if (state.hsVisualization === 1) {
                leftSideList.push(headForwardItem)
            }
            leftSideList.push({
                name: '左圆肩',
                status: getLeftRoundShoulderStatus(),
                errorLines: ['roundShoulderLeft'],
                errorPoints: ['left_acromion_point', 'left_body_gravity_line_point', 'left_acromion_point1', 'left_body_gravity_line_point1']
            })
            // pfsVisualization: 1=骨盆前移显示在左侧面, 0=骨盆前移显示在右侧面
            if (state.pfsVisualization === 1) {
                leftSideList.push(pelvisForwardItem)
            }
            leftSideList.push({
                name: '左膝评估',
                status: getLeftKneeStatus(),
                errorLines: ['leftKneeCheckUp', 'leftKneeCheckDown'],
                errorPoints: ['left_hip_joint_point', 'left_knee_joint_below_point', 'left_ankle_point']
            })

            // 构建右侧面列表
            const rightSideList = []
            // hsVisualization: 0=头前引显示在右侧面
            if (state.hsVisualization === 0 || state.hsVisualization == null) {
                rightSideList.push(headForwardItem)
            }
            rightSideList.push({
                name: '右圆肩',
                status: getRightRoundShoulderStatus(),
                errorLines: ['roundShoulderRight'],
                errorPoints: ['right_acromion_point', 'right_body_gravity_line_point', 'right_acromion_point1', 'right_body_gravity_line_point1']
            })
            // pfsVisualization: 0=骨盆前移显示在右侧面
            if (state.pfsVisualization === 0 || state.pfsVisualization == null) {
                rightSideList.push(pelvisForwardItem)
            }
            rightSideList.push({
                name: '右膝评估',
                status: getRightKneeStatus(),
                errorLines: ['rightKneeCheckUp', 'rightKneeCheckDown'],
                errorPoints: ['right_hip_joint_point', 'right_knee_joint_below_point', 'right_ankle_point']
            })

            // 构建 assess 数据结构，使用 bsDataState 状态值
            const assess = [
                {
                    title: '正面',
                    list: [
                        {
                            name: '头侧歪',
                            status: getHeadSlantStatus(),
                            errorLines: ['headSlant'],
                            errorPoints: ['left_ear_point', 'right_ear_point', 'right_body_gravity_line_point', 'left_body_gravity_line_point']
                        },
                        {
                            name: '腿型',
                            status: getLegTypeStatus(),
                            errorLines: ['rightLegXOUp', 'rightLegXODown', 'leftLegXOUp', 'leftLegXODown', 'leftLegXO', 'rightLegXO'],
                            errorPoints: ['left_knee_joint_point', 'left_hip_joint_point', 'left_ankle_point', 'right_knee_joint_point', 'right_hip_joint_point', 'right_ankle_point']
                        }
                    ]
                },
                {
                    title: '左侧面',
                    list: leftSideList
                },
                {
                    title: '背面',
                    list: [
                        {
                            name: '高低肩',
                            status: getHighLowShoulderStatus(),
                            errorLines: ['highLowShoulder', 'highLowShoulderLeft', 'highLowShoulderRight'],
                            errorPoints: ['left_shoulder_neck_root_point', 'left_acromion_point', 'right_shoulder_neck_root_point', 'right_acromion_point']
                        }
                    ]
                },
                {
                    title: '右侧面',
                    list: rightSideList
                }
            ]
            this.assess = assess
            // 根据 assess 计算异常点位
            this.drawErrorLines()
        },
        // 获取腿型状态
        getLegStatus(leftVal, rightVal) {
            if (leftVal <= 190 && leftVal >= 170) {
                if (rightVal <= 190 && rightVal >= 170) {
                    return '正常'
                } else if (rightVal >= 0 && rightVal < 170) {
                    return 'K型腿'
                } else if (rightVal > 190 && rightVal <= 360) {
                    return 'D型腿'
                }
            } else if (leftVal >= 0 && leftVal < 170) {
                if (rightVal <= 190 && rightVal >= 170) {
                    return 'K型腿'
                } else if (rightVal >= 0 && rightVal < 170) {
                    return 'X型腿'
                } else if (rightVal > 190 && rightVal <= 360) {
                    return '异常'
                }
            } else if (leftVal > 190 && leftVal <= 360) {
                if (rightVal <= 190 && rightVal >= 170) {
                    return 'D型腿'
                } else if (rightVal >= 0 && rightVal < 170) {
                    return '异常'
                } else if (rightVal > 190 && rightVal <= 360) {
                    return 'O型腿'
                }
            }
            return '正常'
        },
        // 计算异常点位和连线
        drawErrorLines() {
            const errorPoints = []
            const errorLines = []
            this.assess.forEach((item) => {
                item.list.forEach((obj) => {
                    if (obj.status !== '正常') {
                        errorPoints.push(...obj.errorPoints)
                        errorLines.push(...obj.errorLines)
                    }
                })
            })
            // 更新 errorOptions（传递给 PcShapeModel 组件）
            // 使用 $set 确保 Vue 响应式系统正确触发
            this.$set(this.errorOptions, 'errorPoints', [...new Set(errorPoints)])
            this.$set(this.errorOptions, 'errorLines', [...new Set(errorLines)])

            console.log('[PostureTab] 点位数据已更新:', {
                errorPoints: this.errorOptions.errorPoints.length,
                errorLines: this.errorOptions.errorLines.length
            })
        },
        // 判断卡片是否需要高亮
        isCardHighlighted(cardTitle) {
            return this.highlightedCardTitles.has(cardTitle)
        },
        openHelpDialog() {
            this.showHelpDialog = true
            // 禁止 body 滚动
            document.body.style.overflow = 'hidden'
        },
        closeHelpDialog() {
            this.showHelpDialog = false
            // 恢复 body 滚动
            document.body.style.overflow = ''
        },
        // 获取评分数据
        getBodyScore() {
            this.scoreLoading = true
            this.$apollo
                .query({
                    query: findBodyScore,
                    variables: {
                        scanId: this.modelInfo.scanId,
                        scanTime: this.modelInfo.createTime,
                        scanType: this.scoreType
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBodyScore
                    if (data && data.code === 200 && data.data) {
                        const scoreInfo = JSON.parse(JSON.stringify(data.data))
                        if (this.scoreType === 1 || this.scoreType === 3) {
                            scoreInfo.massScore = scoreInfo.massScore ? parseInt(scoreInfo.massScore, 10) : null
                            scoreInfo.massConScore = scoreInfo.massConScore
                                ? parseInt(scoreInfo.massConScore, 10)
                                : null
                        }
                        if (this.scoreType === 2 || this.scoreType === 3) {
                            scoreInfo.evalScore = scoreInfo.evalScore ? parseInt(scoreInfo.evalScore, 10) : null
                            scoreInfo.evalConScore = scoreInfo.evalConScore
                                ? parseInt(scoreInfo.evalConScore, 10)
                                : null
                        }
                        this.bodyScore = scoreInfo
                        // 格式化测量时间
                        if (scoreInfo.createTime) {
                            const date = new Date(scoreInfo.createTime * 1000)
                            this.measureTime = this.formatDateTime(date)
                            // 格式化评分规则更新日期
                            this.scoreUpdateDate = `${date.getFullYear()}年${date.getMonth() + 1}月`
                        }
                    }
                })
                .catch((err) => {
                    console.error('获取评分数据失败:', err)
                })
                .finally(() => {
                    this.scoreLoading = false
                })
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
        padding: 1px; // 边框宽度
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 744px;

        .modal {
            background: #262627;
            width: 560px;
            height: 100%;
            border-radius: 8px;
            .gradient-border();
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            // 模型容器 - 使用 PcShapeModel 组件
            .modal-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 2;


                // 覆盖组件样式 - 使用更直接的 :deep 选择器
                :deep(.measure-model) {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                :deep(.iframe-template) {
                    height: 680px !important;
                    width: 500px !important;
                    min-width: 500px !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                :deep(.iframe-template iframe) {
                    width: 500px !important;
                    height: 680px !important;
                    min-width: 500px !important;
                    margin-top: 0 !important;
                }
            }

            // WebGL 不支持
            .webgl-not-support {
                display: flex;
                flex-direction: column;
                align-items: center;
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

            // 脚底背景图
            .model-ground {
                position: absolute;
                bottom: 50px;
                left: 52%;
                transform: translateX(-50%);
                width: 250px;
                height: 95px;
                background: url(../../assets/images/pc-report/report_moxing_bg.png) center center no-repeat;
                background-size: contain;
                z-index: 0;
                pointer-events: none;
            }

            // 旋转按钮
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
                transition: opacity 0.2s;
                // 禁止文本选择，防止连续点击时出现选择效果
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;

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

                &:hover:not(.disabled) img {
                    opacity: 1;
                }

                // 禁用状态：防止连续点击导致模型与文字不一致
                &.disabled {
                    cursor: not-allowed;
                    pointer-events: none;

                    img {
                        opacity: 0.3;
                    }
                }

                &.rotate-left {
                    left: 32px;
                }

                &.rotate-right {
                    right: 32px;
                }
            }
        }

        .right {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            justify-content: space-between;
            width: calc(100% - 16px - 560px);

            .course {
                width: 100%;
                height: 184px;
                background: rgba(235, 235, 245, 0.16);
                border-radius: 8px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                box-sizing: border-box;
                padding: 0 20px;

                &-left {
                    display: flex;
                    align-items: center;

                    .score-chart {
                        width: 100px;
                        height: 100px;
                    }

                    &-content {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        margin-left: 32px;

                        &-title {
                            font-size: 20px;
                            color: #FFFFFF;
                        }

                        &-compare {
                            display: flex;
                            align-items: center;
                            margin-top: 12px;
                            font-size: 17px;
                            color: #787B8F;

                            &>img {
                                width: 16px;
                                object-fit: cover;
                                margin-left: 8px;
                            }

                            .compare-value {
                                font-size: 32px;
                                color: #E45750;
                                margin-left: 6px;
                                font-family: 'DIN Alternate', sans-serif;
                                line-height: 1;
                            }
                        }

                        &-time {
                            display: flex;
                            align-items: center;
                            margin-top: 12px;

                            &>img {
                                width: 16px;
                                height: 16px;
                            }

                            &>span {
                                font-size: 16px;
                                color: #787B8F;
                                margin-left: 6px;
                            }
                        }

                        &-desc {
                            font-size: 13px;
                            color: #585A6B;
                            margin-top: 8px;
                            text-align: left;
                        }
                    }
                }
            }

            .desc {
                width: 100%;
                height: calc(100% - 184px - 16px);
                background: #262627;
                border-radius: 8px;
                .gradient-border();
                box-sizing: border-box;
                padding: 40px;
                padding-bottom: 24px;

                .assess-content {
                    height: 100%;
                    display: flex;
                    flex-direction: column;

                    .assess-title {
                        font-size: 24px;
                        color: #FFFFFF;
                        text-align: center;
                        padding-bottom: 24px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        margin-bottom: 24px;
                    }

                    .assess-list {
                        flex: 1;
                        overflow-y: auto;

                        .assess-item {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 12px 0;


                            .item-name {
                                font-size: 18px;
                                color: #C7C7CC;
                                font-weight: 500;
                            }

                            .item-status {
                                font-size: 18px;
                                color: #10B981;

                                &.status-normal {
                                    color: #10B981;
                                }

                                &.status-warning {
                                    color: #F59E0B;
                                }

                                &.status-error {
                                    color: #F43F5E;
                                }
                            }
                        }
                    }

                    .assess-legend {
                        display: flex;
                        justify-content: center;
                        gap: 72px;
                        padding: 20px 0;

                        .legend-item {
                            display: flex;
                            align-items: center;
                            gap: 5px;

                            .legend-dot {
                                width: 12px;
                                height: 12px;
                                border-radius: 2px;

                                &.normal {
                                    background-color: #10B981;
                                }

                                &.warning {
                                    background-color: #F59E0B;
                                }

                                &.error {
                                    background-color: #F43F5E;
                                }
                            }

                            .legend-text {
                                font-size: 14px;
                            }

                            // 正常、可能异常、异常 文字颜色与标签一致
                            &:nth-child(1) .legend-text {
                                color: #10B981;
                            }

                            &:nth-child(2) .legend-text {
                                color: #F59E0B;
                            }

                            &:nth-child(3) .legend-text {
                                color: #F43F5E;
                            }
                        }
                    }

                    .assess-indicators {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 18px;
                        padding-top: 12px;
                        width: 98px;
                        height: 11px;
                        margin: 0 auto;

                        .indicator-dot {
                            width: 11px;
                            height: 11px;
                            border-radius: 50%;
                            background-color: rgba(255, 255, 255, 0.3);
                            transition: background-color 0.3s ease;

                            &.active {
                                background-color: #FFFFFF;
                            }
                        }
                    }
                }
            }
        }
    }

    /* 标题栏样式 (复用自 compositionTab) */
    .title {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        margin-bottom: 24px; // 稍微增加间距

        &-left {
            display: flex;
            align-items: center;

            &>img {
                width: 18px;
                object-fit: cover;
                margin-right: 7px;
            }

            &>span {
                font-size: 20px;
                color: #E5E6EB;
            }
        }

        &-right {
            // 增大点击区域
            width: 40px;
            height: 40px;
            margin-right: -10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            &>img {
                width: 20px;
                object-fit: cover;
            }
        }
    }

    /* 头部帮助按钮栏 */
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
            // 禁止文本选择，防止点击时选中元素
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            img {
                width: 20px;
                height: 20px;
                object-fit: contain;
            }
        }
    }

    /* 页脚声明 */
    .tip {
        font-size: 16px;
        color: #787B8F;
        padding: 16px 0;
        text-align: left;
    }

    /* 体态详情卡片样式 */
    .posture-details {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 17px;

        .detail-col {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 17px;
            /* 确保列宽均等，防止内容撑开 */
            width: 0;
        }

        .posture-card {
            .gradient-border();
            background: #2C2C2E;
            /* Dark card bg */
            border-radius: 8px;
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            /* 垂直布局，上中下 */
            justify-content: flex-start;
            min-height: 206px;
            position: relative;
            width: 100%;
            box-sizing: border-box;
            transition: background-color 0.3s ease;
            // 禁止文本选择，提升交互体验
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            // 高亮状态
            &.card-highlighted {
                background: #353647;
            }

            .card-top {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;

                .card-info {
                    flex: 1;
                    padding-right: 12px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;

                    .card-title {
                        font-size: 16px;
                        color: #E5E5EA;
                        text-align: left;
                        font-weight: 500;
                        margin-bottom: 16px;
                    }

                    .data-row {
                        margin-bottom: 16px;
                        display: flex;
                        align-items: baseline;
                        flex-wrap: wrap;

                        .val {
                            font-size: 24px;
                            color: #FFFFFF;
                            font-weight: bold;
                            margin-right: 8px;
                        }

                        .unit {
                            font-size: 14px;
                            color: #999;
                            margin-right: 12px;
                        }

                        .diff-box {
                            display: flex;
                            align-items: center;
                            gap: 4px;

                            .diff-icon {
                                width: 8.2px;
                                height: 10px; // aspect ratio approximation or fit content
                                object-fit: cover;
                            }

                            .diff-val {
                                font-size: 14px;
                                color: #787B8F;
                            }
                        }

                        .diff {
                            font-size: 14px;
                            color: #787B8F;
                        }

                        /* 腿型特殊展示 */
                        .leg-val {
                            width: 100%;
                            display: flex;
                            align-items: baseline;

                            .label {
                                font-size: 18px;
                                color: #ccc;
                                margin-right: 8px;
                            }

                            .val {
                                font-size: 24px;
                            }
                        }
                    }
                }

                .card-img {
                    width: 80px;
                    height: 80px;
                    margin-top: -2px;
                    /* Adjust height based on content */
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }
            }

            .status-tag {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 4px;
                width: fit-content;
                font-size: 14px;
                font-weight: 500;
                border: 1px solid transparent;
                margin-bottom: 12px;

                &.normal {
                    color: #2BAC4F;
                    background: rgba(43, 172, 79, 0.15);
                    border-color: rgba(43, 172, 79, 0.3);
                }

                &.warning {
                    color: #E6A23C;
                    background: rgba(230, 162, 60, 0.15);
                    border-color: rgba(230, 162, 60, 0.3);
                }

                &.error {
                    color: #E45750;
                    background: rgba(228, 87, 80, 0.15);
                    border-color: rgba(228, 87, 80, 0.3);
                }
            }

            .card-desc-row {
                font-size: 14px;
                color: #C7C7CC;
                line-height: 1.6;
                text-align: justify;
            }
        }
    }

    /* 弹窗文字左对齐 */
    .help-dialog-item-desc {
        text-align: left !important;
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
        // 禁止文本选择，防止连续点击时选中文本
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

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
            }
        }
    }
}
</style>

<!-- 非 scoped 样式 - 用于覆盖 IframeTemplate 组件的固定尺寸 -->
<style lang="less">
.pc-report .modal .modal-container {
    .pc-shape-model {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .iframe-template {
            // 覆盖 IframeTemplate 的固定高度 (原本是 270px)
            height: 680px !important;
            width: 500px !important;
            min-width: 500px !important;
            display: flex;
            align-items: center;
            justify-content: center;

            iframe {
                // 覆盖 IframeTemplate 中的 min-width: 85.8% 和 height: 100%
                width: 500px !important;
                height: 680px !important;
                min-width: 500px !important;
                margin-top: 0 !important;
            }
        }
    }
}
</style>
