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
                <p class="title">{{ time.year }}年</p>
                <div class="mint-checklist">
                    <RadioGroup v-model="time.radio">
                        <Radio
                            :label="item.label"
                            :key="item.scanId"
                            @change="handelChange(item)"
                            v-for="item in time.options"
                            :disabled="item.disabled"
                            :class="{'active': item.isChecked}"
                        >{{ item.label }}</Radio>
                    </RadioGroup>
                </div>
            </div>
            <p class="msg-tip">
                <img src="../../assets/images/comp_msg_icon.png" alt />
                <span v-if="!select">请选择一个历史时间点进行对比！</span>
                <span v-else>已选择 {{ selectTime }} ~ {{ lastSelectTime }} 时间段！</span>
            </p>
            <p class="btn-action" :class="{'btn-action-select': select}">
                <span @click="handleSureTime">确定</span>
            </p>
        </div>
    </mt-popup>
</template>

<script>
import { Radio, RadioGroup } from 'element-ui'
export default {
    components: {
        Radio,
        RadioGroup
    },
    props: {
        popupVisible: Boolean,
        timeList: Array,
        select: Boolean,
        selectTime: String,
        lastSelectTime: String
    },
    methods: {
        handelChange(item) {
            this.$emit('handelChange', item)
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
