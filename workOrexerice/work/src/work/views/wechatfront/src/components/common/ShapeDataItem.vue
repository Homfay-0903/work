<template>
    <div class="thermal-item">
        <span class="name">
            {{ item.name }}
            <img src="@/assets/images/comp_help_icon.png" alt @click.prevent="handelHelp(item.name)" />
        </span>
        <span class="val">{{item.val}}</span>
        <!-- v2.2.0需求屏蔽 -->
        <!-- <span class="diff">{{item.diff}}</span> -->
        <!-- <span class="upper-span thermal-defer">
            <span>{{ item.val }}</span>
            <span v-if="prev === next">
                {{ toDecimal2((prev - next), 1) }}
                <i>cm</i>
            </span>
            <span v-else>
                {{ toDecimal2((prev - next), 1) }}
                <i>cm</i>
            </span>
        </span>-->
        <span :class="['status', {'status-color': item.status !== '正常'}]">{{ item.status }}</span>
    </div>
</template>

<script>
export default {
    props: {
        item: Object
    },
    methods: {
        handelHelp(name) {
            this.$emit('handelHelp', name)
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
