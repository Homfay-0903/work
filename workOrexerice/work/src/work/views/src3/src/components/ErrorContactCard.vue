<!--
 * @Description: 待机页消息提醒卡片
 * @Author: WendyGao
 * @Date: 2022-02-17 16:36:19
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-05 15:48:35
-->
<template>
    <div :class="[prefixCls + '-wrap', type, $i18n.locale]" @touchend="sendMessage()">
        <!-- <div :class="[type + 'p']"></div> -->
        <div :class="[type + 'right']">
            <!-- <img :src="require(`@img/error/contact-QRCode.png`)" alt="二维码" /> -->
            <div id="qrcode"></div>
        </div>
        <div :class="[prefixCls + '-main', type]">
            <!-- 标题 -->
            <h3>{{ title }}</h3>
            <!-- 副标题 -->
            <p>错误代码：{{ errorCode }}</p>
            <!-- 内容提醒 -->
            <slot name="msg" class="tip-msg"></slot>
            <!-- <p class="tip-msg">{{ tip }}</p> -->
        </div>
    </div>
</template>
<script>
import QRCodeStyling from 'qr-code-styling'
import { mapGetters } from 'vuex'
export default {
    name: 'ErrorContactCard',
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
        errorCode: {
            type: String,
            default: '无'
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
    computed: {
        ...mapGetters(['deviceInfo'])
    },
    mounted() {
        const qrCode = new QRCodeStyling({
            width: 180,
            height: 180,
            data: this.deviceInfo.codeUrl,
            dotsOptions: {
                color: '#000',
                type: 'rounded'
            },
            backgroundOptions: {
                color: '#ffffff'
            }
        })

        // 渲染到 DOM
        qrCode.append(document.getElementById('qrcode'))
    },
    methods: {
        sendMessage() {
            // if (this.submitType) {
            //     this.$emit('eventType', this.submitType)
            // }
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
        padding: 48px 56px 48px 56px;
        border-radius: 32px;
        background-color: @color-light-gray;
        margin-bottom: 121px;
        &.gray {
            background: #333333;
        }
        // &.blue {
        //     background: @color-click;
        // }
        // &.gray-p {
        //     background: @color-bg-grey;
        //     height: 248px;
        // }
        img {
            width: 180px;
            height: 180px;
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
        // .gray-pright {
        //     position: absolute;
        //     top: -48px;
        //     width: 120px;
        //     height: 96px;
        //     background-image: url('../../../assets/img/Prompt.svg');
        //     background-repeat: no-repeat;
        //     background-size: 100% 100%;
        //     border-radius: 12px;
        // }
    }
    &-main {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: auto;
        height: auto;
        margin-left: 56px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 40px;
        color: #e7e9f0;
        line-height: 56px;
        text-align: left;
        margin-top: -25px;
        h3 {
            margin: 0;
            font-weight: 400;
        }
        p {
            margin: 0;
            margin-top: 24px;
        }
    }
}
</style>
