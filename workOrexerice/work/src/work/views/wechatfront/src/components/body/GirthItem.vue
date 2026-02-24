<template>
    <!--围度信息图例-->
    <div class="body-roundness" :class="{ 'no-container-background': !isSupportWebgl.webgl }">
        <div class="person-img" :class="{ 'person-img-width': modelInfo.bdaStatus !== 1 }" v-if="isSupportWebgl.webgl">
            <measure-model ref="model" :show-girth="true"></measure-model>
        </div>
        <!-- 判断浏览器支持 -->
        <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" :title="isSupportWebgl.title"
            msgStyle="msg-style"></version-tip>
        <template v-if="isSupportWebgl.webgl">
            <div :key="index" :class="{ 'hidden-roundness': modelInfo.bdaStatus !== 1 }" v-for="(item, index) in roundness">
                <div class="right-roundness-slide" v-if="index === slideIndex">
                    <p @click="slideTop" class="arrow">
                        <i class="top-arrow"></i>
                    </p>
                    <div class="roundness-data">
                        <p>
                            {{ toDecimal2(item.width, 1) }}
                            <span>cm</span>
                        </p>
                        <p>{{ item.title }}</p>
                    </div>
                    <p @click="slideBottom" class="arrow">
                        <i class="lower-arrow"></i>
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { bmGirthInfo } from '@/assets/js/apolloGql.js'
import isSupportWebgl from '@/assets/js/webgl.js'

import MeasureModel from '@/components/model/Measure'
import VersionTip from '@/components/model/VersionTip.vue'
import { isVAPro3 } from '@/types/device.js'
export default {
    components: {
        MeasureModel,
        VersionTip
    },
    data() {
        return {
            isSupportWebgl,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            girthTpl: [
                {
                    title: '颈围',
                    key: 'neckGirth',
                    girth: {
                        delta: 0,
                        curveName: 'neck_girth'
                    }
                },
                {
                    title: '左上臂围',
                    key: 'leftUpperArmGirth',
                    girth: {
                        delta: 1,
                        curveName: 'left_upper_arm_girth'
                    }
                },
                {
                    title: '右上臂围',
                    key: 'rightUpperArmGirth',
                    girth: {
                        delta: 2,
                        curveName: 'right_upper_arm_girth'
                    }
                },
                {
                    title: '胸围',
                    key: 'bustGirth',
                    girth: {
                        delta: 3,
                        curveName: 'bust_girth'
                    }
                },
                {
                    title: '高腰围',
                    key: 'waistGirth',
                    girth: {
                        delta: 4,
                        curveName: 'waist_girth'
                    }
                },
                {
                    title: '中腰围',
                    key: 'midWaistGirth',
                    girth: {
                        delta: 5,
                        curveName: 'mid_waist_girth'
                    }
                },
                {
                    title: '低腰围',
                    key: 'lowWaistGirth',
                    girth: {
                        delta: 13,
                        curveName: 'low_waist_girth'
                    }
                },
                {
                    title: '臀围',
                    key: 'hipGirth',
                    girth: {
                        delta: 6,
                        curveName: 'hip_girth'
                    }
                },
                {
                    title: '左大腿围',
                    key: 'leftThighGirth',
                    girth: {
                        delta: 7,
                        curveName: 'left_thigh_girth'
                    }
                },
                {
                    title: '左大腿最小围',
                    key: 'leftMinThighGirth',
                    girth: {
                        delta: 8,
                        curveName: 'left_min_thigh_girth'
                    }
                },
                {
                    title: '右大腿围',
                    key: 'rightThighGirth',
                    girth: {
                        delta: 9,
                        curveName: 'right_thigh_girth'
                    }
                },
                {
                    title: '右大腿最小围',
                    key: 'rightMinThighGirth',
                    girth: {
                        delta: 10,
                        curveName: 'right_min_thigh_girth'
                    }
                },
                {
                    title: '左小腿围',
                    key: 'leftCalfGirth',
                    girth: {
                        delta: 11,
                        curveName: 'left_calf_girth'
                    }
                },
                {
                    title: '右小腿围',
                    key: 'rightCalfGirth',
                    girth: {
                        delta: 12,
                        curveName: 'right_calf_girth'
                    }
                }
            ],
            roundness: [],
            slideIndex: 0,
            isNewMath: false,
        }
    },
    mounted() {
        this.bmGirthInfo()
    },
    methods: {
        // 根据当前scanId获取围度数据
        bmGirthInfo() {
            this.$apollo
                .query({
                    query: bmGirthInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    const data = res.data.bmGirthInfo
                    if (data && data.code === 200) {
                        // this.$lodash.each(this.roundness, (roud, index) => {
                        //     this.roundness[0].width = data.data.bustGirth
                        //     this.roundness[1].width = data.data.waistGirth
                        //     this.roundness[2].width = data.data.hipGirth
                        //     this.roundness[3].width = data.data.leftUpperArmGirth
                        //     this.roundness[4].width = data.data.rightUpperArmGirth
                        //     this.roundness[5].width = data.data.leftThighGirth
                        //     this.roundness[6].width = data.data.rightThighGirth
                        //     this.roundness[7].width = data.data.leftCalfGirth
                        //     this.roundness[8].width = data.data.rightCalfGirth
                        // })
                        this.isNewMath = data.data.isNewMath === 1 ? true : false
                        this.roundness = []
                        this.girthTpl.forEach((girth) => {
                            if (this.showGirthItem(girth.key)) {
                                const value = data.data[girth.key]
                                const item = { ...girth, width: value }
                                this.roundness.push(item)
                            }
                        })
                    }
                })
        },
        showGirthItem(key) {
            if (isVAPro3()) {
                return true
            }
            console.log(`传入key${key}`)
            if (this.isNewMath) {
                return key !== 'leftMidThighGirth' && key !== 'rightMidThighGirth'
            } else {
                return key !== 'neckGirth' && key !== 'leftMidThighGirth' && key !== 'rightMidThighGirth' && key !== 'leftMinThighGirth' && key !== 'rightMinThighGirth' && key !== 'midWaistGirth' && key !== 'lowWaistGirth'
            }
        },
        slideTop() {
            if (this.slideIndex === 0) {
                this.slideIndex = this.roundness.length - 1
            } else {
                this.slideIndex -= 1
            }
            this.$refs.model.selectCurve(this.roundness[this.slideIndex].girth)
        },
        slideBottom() {
            this.slideIndex += 1
            if (this.slideIndex === this.roundness.length) {
                this.slideIndex = 0
            }
            this.$refs.model.selectCurve(this.roundness[this.slideIndex].girth)
        },
        setSlideIdx(idx) {
            this.roundness.forEach((item, index) => {
                if (item.girth.delta === idx) {
                    this.slideIndex = index
                    console.log(`切换围度${idx}`)
                }
            })

        },
        toDecimal2(x, y) {
            let f = Math.round(x * 100) / 100
            let s = f.toString()
            let rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            return s
        }
    }
}
</script>

<style lang="less" scoped>
.hidden-roundness {
    display: none;
}

.body-roundness {
    background-image: url(../../assets/images/report_ground_bg.png);
    background-size: 100% 62px;
    background-repeat: no-repeat;
    background-position: left bottom;
    padding-top: 36px;
    display: flex;
    justify-content: center;
    position: relative;
    height: 330px;

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    >div {
        // padding-top: 30px;

        .right-roundness-slide {
            margin-left: 0;
            margin-top: 30px;

            .arrow {
                text-align: center;

                i {
                    width: 8px;
                    height: 8px;
                    display: inline-block;
                    transform-origin: center center;
                    border-top: 2px solid #ffffff;
                    border-right: 2px solid #ffffff;
                }

                .top-arrow {
                    transform: rotate(-45deg);
                    -webkit-transform: rotate(-45deg);
                }

                .lower-arrow {
                    margin-bottom: 3px;
                    transform: rotate(135deg);
                    -webkit-transform: rotate(135deg);
                }
            }
        }
    }

    >.person-img-width {
        width: 100% !important;
        background-position: center bottom !important;
    }

    >.person-img {
        display: flex;
        justify-content: center;
        width: 68%;
        min-width: 215px;
        margin-bottom: 2px;
        background-image: url(../../assets/images/report_moxing_bg.png);
        background-size: 135px 57px;
        background-repeat: no-repeat;
        background-position: 58px bottom;
        padding-top: 10px;
    }
}
</style>
