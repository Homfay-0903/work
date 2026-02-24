<template>
    <!--体态评估-模型结论 上半部分-->
    <div class="body-assess-model" :class="{'no-container-background': !isSupportWebgl.webgl}">
        <!--体态评估-模型结论-->
        <div class="assessing-model-result" v-if="isSupportWebgl.webgl">
            <div class="person-img model-view" v-if="assess" :class="{'no-bs-data': notComposition || centerModel}">
                <shape-model ref="shapeModel" :error-options="errorOptions" @modelRotate="modelRotate"></shape-model>
            </div>
            <div
                class="assessting-slide"
                v-if="!notComposition"
                :class="{'hiddenSlide': notComposition || centerModel}"
            >
                <div class="swipe-wrapper">
                    <template v-for="(slide, index) in assess">
                        <div class="swipe-items" :key="index" v-if="index === pageIndex">
                            <div class="title-nav">
                                <span>{{ slide.title }}</span>
                            </div>
                            <div class="slide-list">
                                <p :key="i" v-for="(item, i) in slide.list">
                                    <span>{{ item.name }}</span>
                                    <span :class="{'error-color': item.status !== '正常'}">{{ item.status }}</span>
                                </p>
                            </div>
                        </div>
                    </template>
                    <div class="mint-swipe-indicators">
                        <div
                            class="mint-swipe-indicator"
                            :key="index"
                            v-for="(slide, index) in assess"
                            :class="['mint-swipe-indicator', {'is-active': index === pageIndex}]"
                        ></div>
                    </div>
                </div>
                <div class="button-wrapper">
                    <p class="prev-button flex-item" @click="handlePrev"></p>
                    <p class="next-button flex-item" @click="handleNext"></p>
                </div>
                <div class="model-data-norm">
                    <i></i>
                    <span>异常</span>
                    <i></i>
                    <span>正常</span>
                </div>
            </div>
        </div>

        <!-- 判断浏览器支持 -->
        <version-tip
            v-else
            :tipMsg="isSupportWebgl.tipMsg"
            :title="isSupportWebgl.title"
            msgStyle="msg-style"
            :class="{'no-bs-data': notComposition || centerModel}"
        ></version-tip>
    </div>
</template>

<script>
import isSupportWebgl from '@/assets/js/webgl.js'

import ShapeModel from '@/components/model/Shape'
import VersionTip from '@/components/model/VersionTip.vue'

export default {
    components: {
        ShapeModel,
        VersionTip
    },
    props: {
        assess: Array,
        notMeasured: Boolean,
        measuredFailed: Boolean,
        notComposition: Boolean,
        compositionFailed: Boolean
    },
    data() {
        return {
            isSupportWebgl,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            pageIndex: 0,
            btnSleep: false,
            centerModel: false,
            // 体态异常信息
            errorOptions: {
                errorPoints: [],
                errorLines: []
            }
        }
    },
    watch: {
        assess: {
            deep: true,
            handler: function(val, oldVal) {
                this.drawErrLine()
            }
        }
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
            setTimeout(function() {
                that.btnSleep = false
            }, 1000)
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
            setTimeout(function() {
                that.btnSleep = false
            }, 1000)
        },
        modelRotate(index) {
            this.pageIndex = index
        },
        drawErrLine() {
            this.$lodash.each(this.assess, item => {
                this.$lodash.each(item.list, obj => {
                    if (obj.status !== '正常') {
                        this.errorOptions.errorPoints = [...this.errorOptions.errorPoints, ...obj.errorPoints]
                        this.errorOptions.errorLines = [...this.errorOptions.errorLines, ...obj.errorLines]
                    }
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.body-assess-model .assessing-model-result .person-img {
    padding: 0 10px !important;
}
.body-assess-model {
    .button-wrapper {
        .flex-item {
            width: 9px;
            height: 9px;
            border-top: 2px solid #ffffff;
            border-right: 2px solid #ffffff;
        }
        .prev-button {
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
        }

        .next-button {
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
        }
    }
}
.model-view {
    display: flex;
    justify-content: center;
    padding-left: 38px !important;
    padding-bottom: 15px;
}
.hiddenSlide {
    display: none;
}
.boxrea {
    position: relative;
}
.model-data-norm {
    position: absolute;
    bottom: 30px;
    right: 0rem;
    left: 0;
    text-indent: 0.6rem;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
.model-data-norm i {
    display: inline-block;
    margin-right: 1vw;
    width: 5.55vw;
    height: 1.7vw;
}
.model-data-norm span {
    font-size: 3vw;
}
.model-data-norm i:nth-of-type(1) {
    background: url(../../assets/images/abnormal@2x.png) center center / 100% no-repeat;
}
.model-data-norm span:nth-of-type(1) {
    margin-right: 0.9rem;
    color: #ff2121;
}
.model-data-norm i:nth-of-type(2) {
    background: url(../../assets/images/normal@2x.png) center center / 100% no-repeat;
}
.model-data-norm span:nth-of-type(2) {
    color: #36a5df;
}
</style>
