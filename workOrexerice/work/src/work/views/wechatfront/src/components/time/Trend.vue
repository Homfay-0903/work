<template>
    <!--选择时间popup-->
    <mt-popup v-model="popupVisible" class="composition-trend-popup" :closeOnClickModal="false" position="bottom">
        <div class="top-header" @touchmove.prevent>
            历史记录
            <img src="../../assets/images/comp_close_icon.png" alt @click.prevent="handleClose" />
        </div>
        <div class="bottom-content" @touchmove.prevent>
            <div
                class="time-list"
                :class="{'last-time-list': index === timeList.length - 1}"
                :key="index"
                v-for="(time, index) in timeList"
            >
                <p class="title">{{ time.year }}</p>
                <div class="mint-checklist">
                    <CheckboxGroup v-model="time.radio">
                        <Checkbox
                            :label="item.label"
                            :key="item.scanId"
                            @change="handelChange(index, idx, item)"
                            v-for="(item, idx) in time.options"
                            :disabled="item.disabled"
                            :class="{'active': item.isChecked}"
                        >{{ item.label }}</Checkbox>
                    </CheckboxGroup>
                </div>
            </div>
            <p class="msg-tip">
                <img src="../../assets/images/comp_msg_icon.png" alt />
                <span v-if="!select">请选择趋势对比时间段！</span>
                <span v-else>已选择 {{ selectTime }} ~ {{ lastSelectTime }} 时间段！</span>
            </p>
            <p class="btn-action" :class="{'btn-action-select': select}">
                <span @click="handleSureTime">确定</span>
            </p>
        </div>
    </mt-popup>
</template>

<script>
import { Checkbox, CheckboxGroup } from 'element-ui'
export default {
    components: {
        Checkbox,
        CheckboxGroup
    },
    props: {
        popupVisible: Boolean,
        timeList: Array,
        select: Boolean,
        selectTime: String,
        lastSelectTime: String
    },
    data() {
        return {
            che: this.checkId
        }
    },
    methods: {
        handelChange(parentIndex, childIndex, item) {
            this.$emit('handelChange', { parentIndex, childIndex, item })
        },
        handleClose() {
            this.$emit('handleClose')
        },
        handleSureTime() {
            this.$emit('handleSureTime')
        }
    }
}
</script>
<style lang="less" scoped>
.msg-tip {
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }
}
</style>