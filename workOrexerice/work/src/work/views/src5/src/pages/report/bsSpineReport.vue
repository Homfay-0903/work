<template>
    <div class="bs-spine-report" v-cloak>
        <div class="bs-spine-result">
            <div class="bs-spine-result-title">
                <p class="tips">*报告内容仅供参考，最终意见以临床检查为准</p>
            </div>
            <div class="spine-eval" id="spine-eval">
                <div class="spine-eval-top" id="spine-eval-top">
                    <div class="spine-eval-img">
                        <span class="spine-title"> 背面 </span>
                        <div class="image-box">
                            <img
                                v-if="spineBackImg"
                                :src="spineBackImg"
                                @load="imageLoaded"
                                @error="imageLoadError()"
                            />
                            <img
                                class="error-img"
                                v-else-if="isGetImg"
                                src="@/assets/images/default_model.svg"
                                @load="imageLoaded"
                            />
                            <!-- <img class="error-img" src="@/assets/images/default_model.svg" @load="imageLoaded" /> -->
                        </div>
                        <div class="spine-top-label">
                            <ul>
                                <li v-for="(label, idx) in imgLabelTop[0]" :key="idx">{{ label }}</li>
                            </ul>
                            <ul class="no-bullet">
                                <li v-for="(label, idx) in imgLabelTop[1]" :key="idx">{{ label }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="spine-eval-msg">
                        <span class="spine-title"> 风险评估 </span>
                        <div>
                            <p class="title">评估结论：{{ scoliosis.riskLevel }}</p>
                            <p class="msg">{{ scoliosis.riskTip }}</p>
                        </div>
                    </div>
                </div>
                <div class="spine-eval-bottom" id="spine-eval-bottom">
                    <div class="spine-eval-img">
                        <div class="front-img">
                            <img src="@/assets/images/spine/front.svg" />
                            <img src="@/assets/images/spine/qianjuji.svg" />
                            <img src="@/assets/images/spine/xiongsuorutuji.svg" />
                            <img v-if="showWeakMuscle('前锯肌')" src="@/assets/images/spine/qianjuji_weak.svg" />
                            <img
                                v-if="showTenseMuscle('胸锁乳突肌')"
                                src="@/assets/images/spine/xiongsuorutuji_tension.svg"
                            />
                        </div>
                        <div class="back-img">
                            <img src="@/assets/images/spine/back.svg" />
                            <img src="@/assets/images/spine/xiefangji.svg" />
                            <img src="@/assets/images/spine/shujiji.svg" />
                            <img src="@/assets/images/spine/jianjiatiji.svg" />
                            <img v-if="showTenseMuscle('竖脊肌')" src="@/assets/images/spine/shujiji_tension.svg" />
                            <img
                                v-if="showTenseMuscle('肩胛提肌')"
                                src="@/assets/images/spine/jianjiatiji_tension.svg"
                            />
                            <img v-if="showTenseMuscle('斜方肌')" src="@/assets/images/spine/xiefangji_tension.svg" />
                        </div>
                        <div class="spine-bottom-label">
                            <ul>
                                <li v-for="(label, idx) in imgLabelBottom" :key="idx">{{ label }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="spine-eval-msg">
                        <span class="spine-title"> 相关体态和肌肉均衡性分析 </span>
                        <div>
                            <p class="title">脊柱侧弯筛查：</p>
                            <p class="msg">{{ muscleAnalysis.abnormalPosture }}</p>
                            <p v-if="spineAnomaly" class="title">肌肉均衡分析：</p>
                            <p v-if="spineAnomaly" class="msg">
                                {{ `紧张肌群：${muscleAnalysis.muscle.tenseMuscle}` }}<br />
                                {{ muscleAnalysis.muscle.weakMuscle !== '您的脊柱侧弯筛查无异常，请继续保持。' ? `薄弱肌群：${muscleAnalysis.muscle.weakMuscle}` : '' }}
                            </p>
                            <p v-if="spineAnomaly" class="title">建议：</p>
                            <p v-if="spineAnomaly" class="msg">{{ muscleAnalysis.advise }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bs-spine-result-title">
                <p class="tips">*进行脊柱侧弯风险筛查，请务必穿着紧身衣物</p>
            </div>
        </div>
        <report-footer :scanId="reportInfo.scanId" :hideQrCode="false"></report-footer>
    </div>
</template>

<script>
import Contrast from '@/components/Contrast'
import ReportFooter from '@/components/Footer'
import { findBsSpineConclusion, bsScanFileInfos } from '@/assets/js/apolloGql.js'
export default {
    name: 'SpineReprot',
    components: {
        Contrast,
        ReportFooter
    },
    props: {
        // 是否隐藏qrCode
        hideQrCode: {
            type: Boolean,
            default: false
        },
        reportInfo: Object,
        memberInfo: Object
    },
    data() {
        return {
            imgLabelTop: [['H1', 'S', 'T', 'H2'], ['头部偏离', '高低肩', '躯干侧移', '髋关节等高']],
            imgLabelBottom: ['紧张肌肉', '薄弱肌肉'],
            spineBackImg: '',
            scoliosis: {
                riskLevel: '',
                riskTip: ''
            },
            muscleAnalysis: {
                abnormalPosture: '',
                muscle: {
                    tenseMuscle: '',
                    weakMuscle: ''
                },
                advise: ''
            },
            tenseMuscleArr: [],
            weakMuscleArr: [],
            // 图片是否请求成功
            isGetImg: false
        }
    },
    computed: {
        spineAnomaly() {
            return this.muscleAnalysis.abnormalPosture !== '您的脊柱侧弯筛查无异常，请继续保持。'
        }
    },
    created() {
        this.getBsSpineConclusion()
        this.getBsScanFileInfos()
        console.log(22222222222, this.reportInfo)
    },
    methods: {
        async getBsSpineConclusion() {
            const params = {
                scanId: this.reportInfo.scanId
            }
            console.log(1111111111, params)
            await this.$apollo
                .query({
                    query: findBsSpineConclusion,
                    variables: {
                        scanId: this.reportInfo.scanId
                    }
                })
                .then(res => {
                    const info = res.data.bsSpineConclusion
                    const spineData = info.data
                    if (info.code === 200) {
                        this.scoliosis = spineData.scoliosis
                        this.muscleAnalysis = spineData.muscleAnalysis
                        const data = spineData.scoliosis.data
                        this.imgLabelTop[1][0] = `头部偏离（${this.judgedState(data.headDeviation, '偏左', '偏右')}${
                            data.headDeviation
                        }cm）`
                        this.imgLabelTop[1][1] = `高低肩（${this.judgedState(data.shoulderHeightDiff, '左高', '右高')}${
                            data.shoulderHeightDiff
                        }cm）`
                        this.imgLabelTop[1][2] = `躯干侧移（${this.judgedState(data.torsoDeviation, '偏左', '偏右')}${
                            data.torsoDeviation
                        }°）`
                        this.imgLabelTop[1][3] = `髋关节等高（${this.judgedState(data.hipHeightDiff, '左高', '右高')}${
                            data.hipHeightDiff
                        }cm）`

                        // this.$nextTick(() => {
                        //     this.handleShowImg()
                        // })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 判断状态
        judgedState(val, lowText, hightText) {
            return val === 0 ? '' : val > 0 ? lowText : hightText
        },
        // 获取体态相关扫描模型文件
        async getBsScanFileInfos() {
            const userinfo = {
                scanId: this.reportInfo.scanId
            }
            await this.$apollo
                .query({
                    query: bsScanFileInfos,
                    variables: userinfo
                })
                .then(res => {
                    const data = res.data.bsScanFileInfos
                    if (data && data.code === 200) {
                        this.isGetImg = true
                        data.data.forEach((model, index) => {
                            if (model.fileType.id === 22) {
                                // 背面
                                this.spineBackImg = model.filePath
                            }
                        })
                    }
                })
                .catch(err => {
                    this.isImgErr = true
                    console.log(err)
                })
        },
        showTenseMuscle(name) {
            return this.muscleAnalysis.muscle.tenseMuscle.indexOf(name) !== -1
        },
        showWeakMuscle(name) {
            return this.muscleAnalysis.muscle.weakMuscle.indexOf(name) !== -1
        },
        imageLoaded() {
            console.log('SPINE_IMG_OVER')
            console.log('SPINE_REPORT_OVER')
        },
        imageLoadError() {
            this.spineBackImg = ''
            console.log('SPINE_IMG_LOAD_ERROR')
        }
    }
}
</script>

<style scoped lang="less">
[v-cloak] {
    display: none;
}
.bs-spine-report {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 160px);
    padding: 15px 0 19px 0;
    width: 100%;
    .bs-spine-result {
        flex: 1;
        display: flex;
        flex-direction: column;
        .bs-spine-result-title {
            p.tips {
                margin: 0;
                font-size: 12px;
                font-family: OPPOSans-R;
                font-weight: normal;
                color: #9b9b9b;
                line-height: 18px;
                text-align: right;
            }
        }
        .spine-eval {
            display: flex;
            flex-direction: column;
            height: 85.5%;
            margin-top: 15px;
            // justify-content: space-between;

            .spine-title {
                position: absolute;
                top: 12px;
                left: 12px;
                font-size: 24px;
                font-family: OPPOSans-R;
                font-weight: normal;
                color: #333333;
                line-height: 32px;
            }
            .spine-eval-top {
                display: flex;
                flex-direction: row;
                height: 517px;
                justify-content: space-between;
                border: 1px solid #009fe8;
                .spine-eval-img {
                    position: relative;
                    width: 565px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    border-right: 1px solid #009fe8;
                    .image-box {
                        position: relative;
                        width: 340px;
                        height: 500px;
                        overflow: hidden;
                        mask: linear-gradient(to top, transparent 0%, #fff 15%);
                    }
                    img {
                        width: 100%;
                        height: auto;
                        margin-top: -60px;
                        &.error-img {
                            height: 200px;
                            margin-top: 150px;
                        }
                    }
                    .spine-top-label {
                        display: flex;
                        flex-direction: row;
                        position: absolute;
                        right: -10px;
                        bottom: 0;
                        font-family: inherit;
                        color: #666666;
                        font-size: 12px;
                        font-family: OPPOSans-R;
                        transform: scale(0.833);
                        ul.no-bullet {
                            padding-inline-start: 10px;
                        }
                        .no-bullet {
                            li {
                                list-style-type: none;
                            }
                        }
                    }
                }
                .spine-eval-msg {
                    position: relative;
                    width: 298px;
                    div {
                        margin-top: 72px;
                    }
                    p {
                        font-size: 12px;
                        font-family: OPPOSans-R;
                        margin-left: 15px;
                    }
                    .title {
                        font-family: OPPOSans-B;
                        color: #5698f5;
                    }
                    .msg {
                        color: #9b9b9b;
                    }
                }
            }
            .spine-eval-bottom {
                display: flex;
                flex-direction: row;
                height: 401px;
                justify-content: space-between;
                border: 1px solid #009fe8;
                margin-top: 15px;

                .spine-eval-img {
                    position: relative;
                    width: 565px;
                    display: flex;
                    justify-content: space-between;
                    // flex-direction: column;
                    align-items: center;
                    border-right: 1px solid #009fe8;
                    img {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .front-img {
                        position: relative;
                        height: 364px;
                        width: 183px;
                        margin-left: 89px;
                    }
                    .back-img {
                        position: relative;
                        height: 364px;
                        width: 183px;
                        margin-right: 89px;
                    }
                    .spine-bottom-label {
                        display: flex;
                        flex-direction: row;
                        position: absolute;
                        right: 2em;
                        bottom: 1.2em;
                        font-family: inherit;
                        color: #666666;
                        font-size: 12px;
                        font-family: OPPOSans-R;
                        li:first-child {
                            color: #e04c45;
                        }
                        li:last-child {
                            color: #e0c85c;
                        }
                    }
                }
                .spine-eval-msg {
                    position: relative;
                    width: 298px;
                    div {
                        margin-top: 118px;
                    }
                    p {
                        font-size: 12px;
                        font-family: OPPOSans-R;
                        margin-left: 15px;
                    }
                    .title {
                        font-family: OPPOSans-B;
                        color: #5698f5;
                    }
                    .msg {
                        color: #9b9b9b;
                    }
                }
            }
        }
    }
    .footer {
        position: absolute;
        width: 267px;
        left: 0;
        bottom: 20px;
    }
}
</style>
