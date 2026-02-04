<!--
 * @Description: 待机页消息提醒卡片
 * @Author: WendyGao
 * @Date: 2022-02-17 16:36:19
 * @LastEditors: liutq
 * @LastEditTime: 2024-06-13 15:41:44
-->
<template>
    <div :class="[prefixCls + '-wrap', type, $i18n.locale]" @touchend="sendMessage()">
        <img
            v-if="titleIcon != 1"
            style="position: relative; top: -10px"
            :src="require(`@img/home/${titleIcon}.png`)"
            alt="提醒图标"
        />
        <div :class="[type + 'p']"></div>
        <div :class="[type + 'right']"></div>
        <div :class="[prefixCls + '-main', type]">
            <!-- 标题 -->
            <h3>{{ title }}</h3>
            <!-- 副标题 -->
            <p v-html="subtitle"></p>
            <!-- 内容提醒 -->
            <slot name="msg" class="tip-msg"></slot>
            <!-- <p class="tip-msg">{{ tip }}</p> -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'TipCard',
    props: {
        // 背景颜色 blue gray
        type: {
            type: String,
            default: 'blue'
        },
        // 标题
        title: {
            type: String,
            default: ''
        },
        // 标题图标
        titleIcon: {
            type: String,
            default: 'abnormal'
        },
        // 副标题
        subtitle: {
            type: String,
            default: ''
        },
        // 提醒
        tip: {
            type: String,
            default: ''
        },
        // 触屏点击类型
        submitType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            prefixCls: 'tips'
        }
    },
    methods: {
        sendMessage() {
            if (this.submitType) {
                this.$emit('eventType', this.submitType)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.tips {
    &-wrap {
        position: relative;
        display: flex;
        width: 857px;
        margin: 24px 60px;
        z-index: 100;
        padding: 48px 55px 40px 48px;
        border-radius: 32px;
        &.gray {
            background: @color-light-gray;
        }
        &.blue {
            background: @color-click;
        }
        &.grey {
            background: @color-bg-grey;
        }
        &.gray-p {
            background: @color-bg-grey;
            height: 248px;
        }
        img {
            width: 96px;
            height: 96px;
        }
        .gray-pp {
            position: relative;
            top: 100px;
            margin-left: 46px;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            background: linear-gradient(180deg, #ef670c 0%, #f49e13 100%);
        }
        .gray-pright {
            position: absolute;
            top: -48px;
            width: 120px;
            height: 96px;
            background-image: url('../../../assets/img/Prompt.svg');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            border-radius: 12px;
        }
    }
    &-main {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: auto;
        height: auto;
        margin-left: 23px;
        h3 {
            margin: 0;
            font-weight: normal;
            font-family: OPPOSansM;
        }
        p {
            margin: 0;
            margin-top: 24px;
            font-size: 36px;
            font-family: OPPOSansR;
            font-weight: normal;
            max-width: 738px;
            word-break: break-word;
            &.tip-msg {
                margin-top: 8px;
                font-size: 32px;
                i {
                    font-size: 30px;
                    vertical-align: initial;
                    background: #ffffff;
                    color: @color-blue;
                    border-radius: 6px;
                }
            }
        }
        &.gray {
            h3 {
                color: #ffffff;
            }
            p {
                color: #e7e9f0;
            }
        }
        &.gray-p {
            h3 {
                color: #ffffff;
                font-size: 48px;
            }
            p {
                color: @color-text-dark;
                font-size: 48px;
            }
        }
        &.blue {
            h3 {
                color: #ffffff;
            }
            p {
                color: #ffffff;
            }
        }
    }
}
&.tr {
    .gray-pp {
        position: relative;
        top: 100px;
        margin-left: 46px;
        border-radius: 50%;
        width: 36px;
        height: 24px;
        background: linear-gradient(180deg, #ef670c 0%, #f49e13 100%);
    }
}
&.fr {
    .gray-pp {
        position: relative;
        top: 100px;
        margin-left: 46px;
        border-radius: 50%;
        width: 48px;
        height: 24px;
        background: linear-gradient(180deg, #ef670c 0%, #f49e13 100%);
    }
}
</style>
