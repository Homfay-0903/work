<template>
    <!--热力对比上半部分-->
    <div class="body-thermal" :class="{'body-thermal-no': noThermal, 'no-container-background': !isSupportWebgl.webgl}">
        <template v-if="isSupportWebgl.webgl">
            <mt-navbar v-model="select" v-if="!noThermal">
                <mt-tab-item id="1">节段脂肪对比</mt-tab-item>
                <mt-tab-item id="2">节段肌肉对比</mt-tab-item>
            </mt-navbar>
            <mt-tab-container v-model="select" v-if="noThermal">
                <mt-tab-container-item id="0">
                    <div class="person-img" :class="{'no-person-img': noThermal}">
                        <img src="@/assets/images/failed_person.png" alt style="margin-top: -10px" />
                    </div>
                </mt-tab-container-item>
            </mt-tab-container>
            <mt-tab-container v-model="select" v-else class="mt-tab-container">
                <mt-tab-container-item :id="select">
                    <div class="person-img" :class="{'no-person-img': noThermal}">
                        <thermal-model :type="select" :thermalModelDate="thermalModelDate" :modelParamId="modelParamId"></thermal-model>
                    </div>
                    <div class="trend-img">
                        <img src="@/assets/images/ther_contrastStandard_msg.png" alt />
                    </div>
                </mt-tab-container-item>
            </mt-tab-container>
        </template>

        <!-- 判断浏览器支持 -->
        <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" :title="isSupportWebgl.title" msgStyle="msg-style"></version-tip>
    </div>
</template>

<script>
import isSupportWebgl from '@/assets/js/webgl.js'

import ThermalModel from '@/components/model/Thermal'
import VersionTip from '@/components/model/VersionTip.vue'

export default {
    components: {
        VersionTip,
        ThermalModel
    },
    props: {
        thermal: Object,
        noThermalData: Boolean, // 判断当没有热力对比数据时显示默认模型
        selectedThermal: String,
        thermalModelDate: String, // 模型加载需要参数
        modelParamId: String
    },
    data() {
        return {
            isSupportWebgl,
            noThermal: this.noThermalData,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            select: this.selectedThermal
        }
    },
    watch: {
        select() {
            this.$emit('changeSelect', this.select)
        },
        modelParamId(val) {
            // console.log(val)
        }
    }
}
</script>

<style lang="less" scoped>
.body-thermal {
    background-image: url(../../assets/images/report_ground_bg.png);
    background-size: 100% 62px;
    background-repeat: no-repeat;
    background-position: left bottom;
    padding-top: 36px;
    display: flex;
    justify-content: center;
    position: relative;
    height: 320px;
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }
    .person-img {
        padding-left: 0;
    }
    .no-person-img {
        margin-left: 0 !important;
    }
}
.mt-tab-container {
    position: initial;
}
</style>
