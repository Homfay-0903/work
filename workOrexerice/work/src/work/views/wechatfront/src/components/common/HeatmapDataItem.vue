<template>
    <!-- 节段对比数据组件 -->
    <div class="thermal-item">
        <img :src="thermalImg" alt />
        <span class="name">{{ name }}</span>
        <span class="thermal">
            {{ toDecimal2(latest, 1) }}
            <i>{{ unit }}</i>
        </span>
        <span v-if="contrast && latest > contrast" class="upper-span thermal-defer">
            <img src="../../assets/images/comp_addTo_icon.png" alt />
            {{ toDecimal2(Math.abs(latest - contrast), 1) }}
        </span>
        <span v-if="contrast && latest < contrast" class="lower-span thermal-defer">
            <img src="../../assets/images/comp_cutBack_icon.png" alt />
            {{ toDecimal2(Math.abs(latest - contrast), 1) }}
        </span>
        <span
            v-if="contrast && latest === contrast"
            class="no-differ upper-span thermal-defer"
        >{{ toDecimal2(Math.abs(latest - contrast), 1) }}</span>
        <span v-if="contrast === null || contrast === undefined || contrast === 0" class="no-differ thermal-defer">0.0</span>
    </div>
</template>

<script>
export default {
    props: {
        latest: Number,
        contrast: Number,
        thermalImg: String,
        name: String,
        unit: String
    },
    methods: {
        toDecimal2(val, num) {
            let value = Math.round(val * 100) / 100
            let values = value.toString()
            let newVal = values.indexOf('.')
            if (newVal < 0) {
                newVal = values.length
                values += '.'
            }
            while (values.length <= newVal + num) {
                values += '0'
            }
            values = values === 'NaN.0' ? '--' : values
            return values
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