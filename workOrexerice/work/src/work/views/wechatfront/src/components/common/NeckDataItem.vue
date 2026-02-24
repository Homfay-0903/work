<template>
    <div class="thermal-item">
        <span class="name">
            {{ item.name }}
            <img src="@/assets/images/comp_help_icon.png" v-if="item.__typename === 'Neck'" alt @click.prevent="handelHelp(item.name)" />
        </span>
        <span class="val">{{item.val === null || !item.val ? '--' : `${toDecimal2(item.val, 1)}° ${item.limit}`}}</span>
        <span
            :class="['status', {'status-color': item.conclusion && item.conclusion !== '正常'}]"
        >{{ item.conclusion !== null ? item.conclusion : '--' }}</span>
        <span
            class="diff-val"
        >{{item.contrast !== null ? (item.contrast >= 0 ? `+${toDecimal2(item.contrast, 1)}°` : `${toDecimal2(item.contrast, 1)}°`) : '--'}}</span>
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
