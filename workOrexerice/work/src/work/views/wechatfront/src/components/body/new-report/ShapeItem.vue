<template>
    <!--体态评估-模型结论 上半部分-->
    <div :class="['body-assess', $i18n.locale]">
        <div class="body-assess-model" :class="{ 'no-container-background': !isSupportWebgl.webgl }">
            <div class="model-data-norm">
                <i></i>
                <span>{{ $t('shape.item.abnormal') }}</span>
                <i></i>
                <span>{{ $t('shape.item.normal') }}</span>
            </div>
            <!--体态评估-模型结论-->
            <div class="assessing-model-result" v-if="isSupportWebgl.webgl">
                <div class="model-view" v-if="assess" :style="{ width: isDeviceReport ? '450px' : 'auto' }" :class="{ 'no-bs-data': notComposition || centerModel }">
                    <shape-model ref="shapeModel" :error-options="errorOptions" @modelRotate="modelRotate"></shape-model>
                </div>
                <div
                    class="assessting-slide"
                    v-if="!notComposition"
                    :class="{ 'hiddenSlide': notComposition || centerModel }"
                >
                    <div class="swipe-wrapper">
                        <template v-for="(slide, index) in assess">
                            <div class="button-wrappers" :key="index" v-if="index === pageIndex">
                                <div class="title-nav button-wrappers">
                                    <img
                                        src="@/assets/images/new-report/Fill 2@2x.png"
                                        class="flex-item"
                                        @click="handlePrev"
                                        alt
                                    />
                                    <span class="title">{{ slide.title }}</span>
                                    <img
                                        src="@/assets/images/new-report/Fill 1@2x.png"
                                        class="flex-items"
                                        @click="handleNext"
                                        alt
                                    />
                                </div>
                                <div
                                    :class="['wrapper-list', { 'error-bjcolor': item.status !== $t('shape.item.normal') }]"
                                    v-for="(item, i) in slide.list"
                                    :key="i"
                                >
                                    <span class="headline">{{ item.name }}</span>
                                    <span
                                        :class="item.status !== $t('shape.item.normal') ? 'error-color' : 'conclusion'"
                                    >
                                        {{
                                        item.status }}
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- 判断浏览器支持 -->
            <version-tip
                v-else
                :tipMsg="isSupportWebgl.tipMsg"
                :title="isSupportWebgl.title"
                msgStyle="msg-style"
                :class="{ 'no-bs-data': notComposition || centerModel }"
            ></version-tip>
        </div>
    </div>
</template>

<script>
import isSupportWebgl from '@/assets/js/webgl.js'
import { isVAPro7 } from '@/types/device.js'
import ShapeModel from '@/components/model/new-report/Shape'
import VersionTip from '@/components/model/VersionTip.vue'
import { mapState } from "vuex"

export default {
    components: {
        ShapeModel,
        VersionTip,
    },
    props: {
        assess: Array,
        notMeasured: Boolean,
        measuredFailed: Boolean,
        notComposition: Boolean,
        compositionFailed: Boolean,
    },
    data() {
        return {
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport'),
            isSupportWebgl,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            pageIndex: 0,
            btnSleep: false,
            centerModel: false,
            // 体态异常信息
            errorOptions: {
                errorPoints: [],
                errorLines: [],
            },
            isVAPro7: isVAPro7(),
        }
    },
    computed: {
        ...mapState(["isNewMathTt"]),
    },
    watch: {
        assess: {
            deep: true,
            // eslint-disable-next-line no-unused-vars
            handler: function (val, oldVal) {
                this.drawErrLine()
            },
        },
    },
    created() {
        if (this.modelInfo.evalStatus === 0) {
            this.centerModel = true
        } else {
            this.centerModel = false
        }
        this.drawErrLine()
    },
    methods: {
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
        },
        handlePrev() {
            let that = this
            if (this.btnSleep) {
                return
            }
            this.pageIndex--
            if (this.pageIndex < 0) {
                this.pageIndex = 3
            }
            this.$refs.shapeModel.turnModel(1)
            this.btnSleep = true
            setTimeout(function () {
                that.btnSleep = false
            }, this.isDeviceReport ? 2500 : 1000)
        },
        handleNext() {
            let that = this
            if (this.btnSleep) {
                return
            }
            this.pageIndex++
            if (this.pageIndex > 3) {
                this.pageIndex = 0
            }
            this.$refs.shapeModel.turnModel(2)
            this.btnSleep = true
            setTimeout(function () {
                that.btnSleep = false
            }, this.isDeviceReport ? 2500 : 1000)
        },
        modelRotate(index) {
            this.pageIndex = index
        },
        drawErrLine() {
            console.log(!this.isVAPro7 && !this.isNewMathTt, '是否为旧体态')
            if (!this.isVAPro7 && !this.isNewMathTt) {
                this.$lodash.each(this.assess, (item) => {
                    this.$lodash.each(item.list, (obj) => {
                        // console.log(`当前体态状态${obj.status} ${this.$t('shape.models.normal')} ${obj.name}`)
                        if (obj.status !== this.$t('shape.models.normal')) {
                            // this.errorOptions.errorPoints = [...this.errorOptions.errorPoints, ...obj.errorPoints]
                            // this.errorOptions.errorLines = [...this.errorOptions.errorLines, ...obj.errorLines]
                            const errorPoints = [...this.errorOptions.errorPoints, ...obj.errorPoints]
                            const errorLines = [...this.errorOptions.errorLines, ...obj.errorLines]
                            this.errorOptions.errorPoints = errorPoints
                            this.errorOptions.errorLines = errorLines
                        }
                    })
                })
            } else {
                this.$lodash.each(this.assess, (item) => {
                    this.$lodash.each(item.list, (obj) => {
                        if (obj.status !== this.$t('shape.models.normal')) {
                            this.errorOptions.errorPoints = [...this.errorOptions.errorPoints, ...obj.errorPoints]
                            this.errorOptions.errorLines = [...this.errorOptions.errorLines, ...obj.errorLines]
                        }
                    })
                })
                // console.log("异常点位更新完成", this.errorOptions.errorLines)
            }
        },
    },
}
</script>

<style lang="less" scoped>
.body-assess {
    margin: 0 11px;
    margin-top: 14px;
    background: url(../../../assets/images/new-report/shape_bj.png) center no-repeat;
    background-size: 100% 100%;
    min-height: 350px;

    .body-assess-model {
        // padding: 0 10px !important;
        display: flex;
        flex-direction: column;
        height: auto;
        padding-top: 0px;

        .model-data-norm {
            margin-top: 16px;
            // background-color: brown;
            margin-left: 15px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 30px;
        }

        .assessing-model-result {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
        }
    }
}

.model-data-norm i {
    display: inline-block;
    margin-right: 8px;
    width: 30px;
    height: 14px;
}

.model-data-norm span {
    line-height: 12px;
    font-size: 12px;
}

.model-data-norm i:nth-of-type(1) {
    background: url(../../../assets/images/new-report/abnormal@2x.png) center center / 100% no-repeat;
}

.model-data-norm span:nth-of-type(1) {
    margin-right: 1.4rem;
    color: #60607f;
}

.model-data-norm i:nth-of-type(2) {
    margin-left: 20px;
    background: url(../../../assets/images/new-report/normal@2x.png) center center / 100% no-repeat;
}

.model-data-norm span:nth-of-type(2) {
    color: #60607f;
}

.model-view {
    display: flex;
    height: 100%;
    min-height: 360px;
    justify-content: center;
    padding-bottom: 15px;
}

.assessting-slide {
    display: flex;
    margin-right: 16px;

    .swipe-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
}

.button-wrappers {
    display: flex;
    flex-direction: column;
    height: 100%;

    .title-nav {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-around;
        margin-bottom: 22px;

        .flex-item {
            width: 20px;
            height: 20px;
        }

        .title {
            color: #8aa3be;
            font-size: 16px;
        }

        .flex-items {
            width: 20px;
            height: 20px;
        }
    }

    .wrapper-list {
        width: 148px;
        height: 100%;
        background: url(../../../assets/images/new-report/shape_bj2.png) center no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 8px;

        .headline {
            font-size: 13px;
            color: #8aa3be;
            margin-top: 11px;
            margin-left: 10px;
            text-align: left;
        }

        .conclusion {
            align-self: flex-end;
            font-size: 14px;
            margin-top: 11px;
            margin-right: 10px;
            margin-bottom: 11px;
            background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            max-width: 100px;
            padding: 0 0.01px;  /* 防止文本裁剪异常 */
        }

        .error-color {
            align-self: flex-end;
            font-size: 14px;
            margin-top: 11px;
            margin-right: 10px;
            margin-bottom: 11px;
            color: #e64444;
            max-width: 100px;
        }
    }

    .error-bjcolor {
        background: url(../../../assets/images/new-report/shape_bj1.png) center no-repeat;
        background-size: 100% 100%;
    }
}
</style>
