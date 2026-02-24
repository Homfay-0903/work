<template>
    <!--体型预测-->
    <div class="body-roundness" :class="{ 'no-container-background': !isSupportWebgl.webgl }">
            <img class="measure-top" src="@/assets/images/new-report/girth/fill@2x.png" />
            <img class="measure-bottom" src="@/assets/images/new-report/girth/fill2@2x.png" alt />
        <div class="person-img" v-if="isSupportWebgl.webgl">
            <prediction-model
                @modelLoadOver="modelItemLoadOver"
                @modelLoadError="modelItemLoadError"
                :textPosition="textPosition"
                :iframeId="iframeId"
            ></prediction-model>
        </div>
        <div class="right-time-btn" v-if="isSupportWebgl.webgl">
            <span v-if="textPosition !== 'top'">根据您当前状态预测</span>
        </div>
        <!-- 判断浏览器支持 -->
        <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" :title="isSupportWebgl.title" msgStyle="msg-style"></version-tip>
        <!--体型预测设置-->
        <!-- <mt-popup v-model="popupVisible" class="body-prediction-popup" position="bottom">
            <div class="top-header">
                体型预测设置
                <img src="@/assets/images/comp_close_icon.png" alt @click="popupVisible = false" />
            </div>
            <div class="bottom-content">
                <ul>
                    <li :key="index" v-for="(item, index) in predictionTrend">
                        <div class="top-title">
                            <span>{{ item.name }}</span>
                            <span>理想值：{{ item.idealValue }}</span>
                        </div>
                        <div class="slide-range">
                            <mt-range v-model="item.rangeValue">
                                <div slot="start">0</div>
                                <div slot="end">120</div>
                            </mt-range>
                            <ul class="scale-range">
                                <li :key="index" v-for="index in 57"></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </mt-popup> -->
    </div>
</template>

<script>
import isSupportWebgl from '@/assets/js/webgl.js'

import PredictionModel from '@/components/model/new-report/Prediction'
import VersionTip from '@/components/model/VersionTip.vue'

export default {
    components: {
        PredictionModel,
        VersionTip
    },
    prop: {
        predict: this.predicts
    },
    props: ['iframeId', 'textPosition'],
    data() {
        return {
            isSupportWebgl,
            popupVisible: false,
            predicts: {
                weight: '80.6',
                fat: '80.6',
                muscle: '100.6'
            },
            predictionTrend: [
                {
                    name: '体重 | kg',
                    idealValue: '64.8',
                    rangeValue: 30
                },
                {
                    name: '体脂率 | %',
                    idealValue: '42.8',
                    rangeValue: 60
                },
                {
                    name: '肌肉含量 | %',
                    idealValue: '19.8',
                    rangeValue: 100
                }
            ]
        }
    },
    mounted() {
        // 不支持webgl清空缓存图片信息
        if (!this.isSupportWebgl.webgl) {
            this.$emit('modelItemLoadOver', 'prediction')
            window.localStorage.removeItem('modelImage')
        }
    },
    methods: {
        // 监听加载完成(success or failed)
        modelItemLoadOver(type) {
            this.$emit('modelItemLoadOver', type)
        },
        // 监听失败事件
        modelItemLoadError(res) {
            this.$emit('modelItemLoadError', res)
        }
    }
}
</script>
<style lang="less" scoped>
.body-roundness {
    background-image: url('../../../assets/images/new-report/girth/Background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: left bottom;
    padding-top: 36px;
    margin: 14px;
    // display: flex;
    // justify-content: center;
    position: relative;
    height: auto;

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }
    .measure-top {
            position: absolute;
            left: 8px;
            right: 8px;
            top: 8px;
            width: 96%;
            z-index:0;
        }

        .measure-bottom {
            position: absolute;
            top: 200px;
            left: 8px;
            right: 8px;
            width: 96%;
            z-index: 0;
        }
}
.right-time-btn{
        position: relative;
        left: 32vw;
        top: 7.5vw;
        span {
            font-family: PingFangSC, PingFang SC;
font-weight: 400;
font-size: 12px;
color: #8AA3BE;
line-height: 17px;
text-align: center;
font-style: normal;
        }
    }
.body-prediction {
    width: 353px;
    margin: 0 auto;
    &.share-shape {
        background-image: url(../../../assets/images/share/bg_model_ground.png);
        background-size: 100% 36px;
        background-position: 0 247px;
    }
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .person-img {
        padding-left: 0 !important;
    }
}
</style>
