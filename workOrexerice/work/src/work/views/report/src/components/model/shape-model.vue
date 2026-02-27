<template>
    <!-- 体态模型 -->
    <div class="shape-model">
        <model-loading v-show="isLoad"></model-loading>
        <iframe-template-new
            v-if="isVAPro7 || modelInfo.isNewMathTt"
            ref="model"
            :options="iframeOptions"
            @isIframeLoad="loadShapeModel"
            @isModelLoad="loadModelOver"
            @changeShapeIndex="changeShapeIndex"
            @isModelLoadError="loadFailed"
        ></iframe-template-new>
        <iframe-template
        v-else
            ref="model"
            :options="iframeOptions"
            @isIframeLoad="loadShapeModel"
            @isModelLoad="loadModelOver"
            @changeShapeIndex="changeShapeIndex"
            @isModelLoadError="loadFailed"
        ></iframe-template>
    </div>
</template>
<script>
import IframeTemplate from '../iframe-template/iframe-template'
import IframeTemplateNew from '../iframe-template/iframe-template-new'
import ModelLoading from './model-loading'
import { bsScanFileInfos, bsEvalConclusion } from '@/assets/js/apolloGql.js'
import { isVAPro7 } from '@/types/device.js'

export default {
    components: {
        IframeTemplate,
        IframeTemplateNew,
        ModelLoading
    },
    props: {
        // 模型信息
        modelInfo: Object,
        errorOptions: Object
    },
    data() {
        return {
            iframeOptions: {
                url: 'shape/index.html',
                modelPath: '',
                pointPath: '',
                width: '360px',
                height: '500px',
                showShapeMode: true,
                failed: false,
                errorInfo: {
                    errorPoints: [],
                    errorLines: []
                }
            },
            isVAPro7: isVAPro7(),
            isLoad: true,
            rotateIndex: 1,
            // 体态评估关键点
            modelPoints: {
                headForward: {
                    name: '头前引',
                    errorLines: ['headForward'],
                    errorPoints: ['keyPoint0', 'keyPoint4']
                },
                headSlant: {
                    name: '头侧歪',
                    errorLines: ['headSlant'],
                    errorPoints: ['keyPoint0', 'keyPoint4']
                },
                roundShoulderLeft: {
                    name: '左圆肩',
                    errorLines: ['roundShoulderLeft'],
                    errorPoints: ['keyPoint16', 'keyPoint1']
                },
                roundShoulderRight: {
                    name: '右圆肩',
                    errorLines: ['roundShoulderRight'],
                    errorPoints: ['keyPoint18', 'keyPoint3']
                },
                highLowShoudler: {
                    name: '高低肩',
                    errorLines: ['highLowShoulder'],
                    errorPoints: ['keyPoint2', 'keyPoint5']
                },
                pelvisForward: {
                    name: '骨盆前/后移',
                    errorLines: ['pelvisForwardUp', 'pelvisForwardDown'],
                    errorPoints: ['keyPoint4', 'keyPoint15', 'keyPoint6']
                },
                leftKneeCheck: {
                    name: '左膝评估',
                    errorLines: ['leftKneeCheckUp', 'leftKneeCheckDown'],
                    errorPoints: ['keyPoint11', 'keyPoint12', 'keyPoint13']
                },
                rightKneeCheck: {
                    name: '右膝评估',
                    key: 'rightKneeCheck',
                    errorLines: ['rightKneeCheckUp', 'rightKneeCheckDown'],
                    errorPoints: ['keyPoint8', 'keyPoint9', 'keyPoint10']
                },
                legXo: {
                    name: '腿型',
                    errorLines: ['rightLegXOUp', 'rightLegXODown', 'leftLegXOUp', 'leftLegXODown'],
                    errorPoints: [
                        'keyPoint8',
                        'keyPoint9',
                        'keyPoint10',
                        'keyPoint11',
                        'keyPoint12',
                        'keyPoint13'
                    ]
                }
            },
            // 体态评估关键点
            modelPointsNew: {
                headForward: {
                    name: '头前引',
                    errorLines: ['headForward'],
                    errorPoints: ['left_ear_point', 'right_ear_point']
                },
                headSlant: {
                    name: '头侧歪',
                    errorLines: ['headSlant'],
                    errorPoints: ['left_ear_point', 'right_ear_point']
                },
                roundShoulderLeft: {
                    name: '左圆肩',
                    errorLines: ['roundShoulderLeft'],
                    errorPoints: ['left_acromion_point', 'left_body_gravity_line_point', 'left_acromion_point1', 'left_body_gravity_line_point1']
                },
                roundShoulderRight: {
                    name: '右圆肩',
                    errorLines: ['roundShoulderRight'],
                    errorPoints: ['right_acromion_point', 'right_body_gravity_line_point', 'right_acromion_point1', 'right_body_gravity_line_point1']
                },
                highLowShoudler: {
                    name: '高低肩',
                    errorLines: ['highLowShoulder', 'highLowShoulderLeft', 'highLowShoulderRight'],
                    errorPoints: ['left_shoulder_neck_root_point', 'left_acromion_point', 'right_shoulder_neck_root_point', 'right_acromion_point']
                },
                pelvisForward: {
                    name: '骨盆前移',
                    errorLines: ['pelvisForwardUp', 'pelvisForwardDown', 'pelvisForward'],
                    errorPoints: ['left_hip_joint_point', 'right_hip_joint_point', 'left_body_gravity_line_point', 'right_body_gravity_line_point', 'left_body_gravity_line_point1', 'right_body_gravity_line_point1']
                },
                leftKneeCheck: {
                    name: '左膝评估',
                    errorLines: ['leftKneeCheckUp', 'leftKneeCheckDown'],
                    errorPoints: ['left_hip_joint_point', 'left_knee_joint_below_point', 'left_ankle_point']
                },
                rightKneeCheck: {
                    name: '右膝评估',
                    key: 'rightKneeCheck',
                    errorLines: ['rightKneeCheckUp', 'rightKneeCheckDown'],
                    errorPoints: ['right_hip_joint_point', 'right_knee_joint_below_point', 'right_ankle_point']
                },
                legXo: {
                    name: '腿型',
                    errorLines: ['rightLegXOUp', 'rightLegXODown', 'leftLegXOUp', 'leftLegXODown', 'leftLegXO', 'rightLegXO'],
                    errorPoints: ['left_knee_joint_point', 'left_hip_joint_point', 'left_ankle_point', 'right_knee_joint_point', 'right_hip_joint_point', 'right_ankle_point']
                }
            }
        }
    },
    watch: {
        // 监听模型切换
        modelInfo(val, oldVal) {
            if (val) {
                // 显示加载动画
                this.isLoad = true
                // 清除上一个加载模型
                this.$refs.model.clearModel()
                // 判断体态状态
                if (this.modelInfo.bsScanResult === 1) {
                    // 获取本次模型文件地址
                    this.findBsEvalConclusion()
                    // setTimeout(() => {
                    //     this.findBsScanFileInfos()
                    // }, 500)
                } else {
                    this.loadFailed()
                }
            }
        }
    },
    methods: {
        // iframe 加载成功后 加载模型
        loadShapeModel() {
            // 体态
            if (this.modelInfo.bsScanResult === 1) {
                console.log('777777')
                if (this.iframeOptions.modelPath && this.iframeOptions.pointPath) {
                    console.log('6666')
                    this.$refs.model.loadShapeModel(this.iframeOptions.showShapeMode)
                } else {
                    console.log('88888888')
                    this.findBsEvalConclusion()
                    // this.findBsScanFileInfos()
                }
            } else {
                this.loadFailed()
            }
        },
        // 获取体态模型文件
        findBsScanFileInfos() {
            this.iframeOptions.modelPath = ''
            this.iframeOptions.pointPath = ''
            this.$apollo
                .query({
                    query: bsScanFileInfos,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.bsScanFileInfos
                    if (data && data.code === 200) {
                        this.iframeOptions.failed = false
                        const files = data.data
                        files.forEach((model, index) => {
                            if (model.fileType.id === 3) {
                                this.iframeOptions.modelPath = model.filePath
                            }
                            if (model.fileType.id === 4) {
                                this.iframeOptions.pointPath = model.filePath
                            }
                        })
                    } else {
                        this.loadFailed()
                    }
                })
        },
        // 获取体态评估结论
        findBsEvalConclusion() {
            this.iframeOptions.errorInfo.errorPoints = []
            this.iframeOptions.errorInfo.errorLines = []
            this.$apollo
                .query({
                    query: bsEvalConclusion,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.bsEvalConclusion
                    if (data && data.code === 200) {
                        const evals = data.data
                        const errorPoints =  (this.isVAPro7 || this.modelInfo.isNewMathTt) ? this.modelPointsNew : this.modelPoints
                        const errorLines = (this.isVAPro7 || this.modelInfo.isNewMathTt) ? this.modelPointsNew : this.modelPoints
                        _.forEach(evals, (val, key) => {
                            console.log(val.conclusion, key, val.conclusion !== '正常' && typeof val === 'object')
                            if (val.conclusion !== '正常' && typeof val === 'object') {
                                this.iframeOptions.errorInfo.errorPoints = [
                                    ...this.iframeOptions.errorInfo.errorPoints,
                                    // ...this.modelPoints[key].errorPoints
                                    ...errorPoints[key].errorPoints
                                ]
                                this.iframeOptions.errorInfo.errorLines = [
                                    ...this.iframeOptions.errorInfo.errorLines,
                                    // ...this.modelPoints[key].errorLines
                                    ...errorLines[key].errorLines
                                ]
                            }
                        })
                        setTimeout(() => {
                            console.log('模型后加载======')
                            this.findBsScanFileInfos()
                        }, 500)

                    } else {
                        this.loadFailed()
                    }
                })
        },
        loadFailed() {
            this.isLoad = false
            this.iframeOptions.failed = true
            this.$emit('modelLoadError')
        },
        loadModelOver() {
            this.isLoad = false
        },
        changeShapeIndex(index) {
            this.$emit('modelRotate', index)
        },
        turnModel(direction) {
            this.$refs.model.turnModel(direction)
        }
    }
}
</script>
