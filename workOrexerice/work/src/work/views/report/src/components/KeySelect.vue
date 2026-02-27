<!--
 * @Author: yangsheng 1648569746@qq.com
 * @Date: 2022-05-20 17:13:01
 * @LastEditors: yangsheng 1648569746@qq.com
 * @LastEditTime: 2022-05-25 20:01:18
 * @FilePath: /vr-3.0-device-client/src/components/KeySelect.vue
 * @Description: 按钮选择组件
-->
<template>
    <div class="key-select">
        <div
            v-for="(item, idx) in items"
            :key="idx"
            :class="{ 'option-list': true, active: select === idx }"
            @touchend="confirmSelection(idx)"
        >
            <div class="list-icon">
                <img
                    :src="require(`@/assets/img/key_select/${item.icon}${select === idx ? '' : '_gray'}.svg`)"
                    alt=""
                />
            </div>
            <div class="list-content">
                <p class="content">{{ item.content }}</p>
                <p class="remarks">{{ item.remarks }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'KeySelect',
    props: {
        items: {
            type: Array,
            default() {
                return [
                    {
                        icon: 'restart',
                        content: '重新测量',
                        remarks: '再次进行体态评估测量'
                    },
                    {
                        icon: 'end',
                        content: '结束测量',
                        remarks: '结束测量将返回首页'
                    }
                ]
            }
        },
        select: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {}
    },
    methods: {
        confirmSelection(active) {
            this.$emit('on-key-feedback', active)
        }
    }
}
</script>

<style lang="less" scoped>
.key-select {
    display: flex;
    flex-direction: column;
    margin: 0 auto 144px;

    .option-list {
        position: relative;
        border-radius: 32px;
        margin: 12px 65px;
        .able-click();
        padding: 40px 0;
        display: flex;

        .list-icon {
            display: flex;
            align-items: center;
            margin: 0px 72px;
            img {
                width: 96px;
            }
        }

        .content {
            color: #e7e9f0;
            font-size: 48px;
            font-family: 'OPPOSansR';
            margin: 0;
        }

        .remarks {
            color: #cccccc;
            font-size: 40px;
            font-family: 'OPPOSansR';
            margin: 0;
            margin-top: 10px;
        }

        &.active {
            .active-border();
            padding: 40px 0;

            .content {
                color: #ffffff;
            }

            .remarks {
                color: #e7e9f0;
            }
        }
    }
}
</style>
