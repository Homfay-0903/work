<template>
    <!--体型预测-->
    <div
        class="body-prediction"
        :class="{'no-container-background': !isSupportWebgl.webgl, 'share-shape': textPosition === 'top'}"
    >
        <div class="left-prediction-edit"></div>
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
        <mt-popup v-model="popupVisible" class="body-prediction-popup" position="bottom">
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
        </mt-popup>
    </div>
</template>

<script>
import isSupportWebgl from '@/assets/js/webgl.js'

import PredictionModel from '@/components/model/Prediction'
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
.body-prediction {
    &.share-shape {
        background-image: url(../../assets/images/share/bg_model_ground.png);
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
