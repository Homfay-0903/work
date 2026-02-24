<template>
    <!-- 围度信息数据组件 -->
    <div class="thermal-item">
        <img :src="thermalImg" alt />
        <span class="name">{{ name }}</span>
        <span class="thermal">
            {{ toDecimal2(latest, 1) }}
            <i>{{ unit }}</i>
        </span>
        <!-- v2.2.0 需求屏蔽 -->
        <!-- <span v-if="contrast && latest > contrast && modelInfo.bdaStatus === 1" class="upper-span thermal-defer">
            <img src="../../assets/images/comp_addTo_icon.png" alt />
            {{ toDecimal2(Math.abs(latest - contrast), 1) }}
        </span>
        <span v-if="contrast && latest < contrast && modelInfo.bdaStatus === 1" class="lower-span thermal-defer">
            <img src="../../assets/images/comp_cutBack_icon.png" alt />
            {{ toDecimal2(Math.abs(latest - contrast), 1) }}
        </span>
        <span
            v-if="contrast && latest === contrast && modelInfo.bdaStatus === 1"
            class="no-differ upper-span thermal-defer"
        >{{ toDecimal2(Math.abs(latest - contrast), 1) }}</span>
        <span
            v-if="contrast === null || contrast === undefined || modelInfo.bdaStatus !== 1"
            class="no-compared-span thermal-defer"
        >--</span> -->
    </div>
</template>

<script>
export default {
    props: {
        latest: Number,
        contrast: Number,
        thermalImg: String | null,
        name: String,
        unit: String
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo'))
        }
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
        }
    }
}
</script>
<style lang="less" scoped>
.thermal-item {

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }
}
</style>
