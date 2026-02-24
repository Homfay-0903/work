<template>
    <div class="transfer">
        <div class="header">
            <h1>维塑3D体型分析仪</h1>
        </div>
        <div class="guide">
            <div class="guide-icon">
                <img src="@/assets/images/svg/circle-fill.svg" alt />
                <img class="path" src="@/assets/images/svg/Path.svg" alt />
                <img src="@/assets/images/svg/circle-line.svg" alt />
            </div>
            <div class="guide-tip">
                <p>完成体测</p>
                <p class="guide-tip-next">关注公众号后注册获取报告</p>
            </div>
        </div>
        <div class="content">
            <p class="tip">
                <img class="icon-report" src="@/assets/images/svg/icon-report.svg" alt /> 关注公众号查看体测报告
            </p>
            <img class="qrcode" alt="公众号二维码" :src="defaultQrcode" />
            <p class="qrcode-tip">请长按识别二维码</p>
        </div>
    </div>
</template>
<script>
import { qrcodeImg } from '@/assets/js/config.js'

// 默认二维码
export default {
    data() {
        return {
            // defaultQrcode: qrcodeImg,
            // 本次扫描信息
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo'))
        }
    },
    computed: {
        defaultQrcode() {
            if (this.modelInfo.scanId.substring(0, 2) === '38') {
                return require('@/assets/images/qrcode1.jpg')
            } else {
                return qrcodeImg
            }
        }
    },
    created() {
        // this.getGymInfo()
    }
}
</script>
<style lang="less" scoped>
.transfer {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 48px 28px;
    background: rgba(255, 255, 255, 1);
    .header {
        text-align: left;
        h1 {
            font-size: 17px;
            font-weight: 500;
            line-height: 24px;
            margin-bottom: 16px;
            color: rgba(0, 0, 0, 1);
        }
    }
    .guide {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .guide-icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                width: 24px;
            }
            .path {
                width: 2px;
                margin: -2px 0;
            }
        }
        .guide-tip {
            text-align: left;
            margin-left: 8px;
            p {
                font-size: 13px;
                font-weight: 500;
                color: rgba(10, 132, 255, 1);
                line-height: 18px;
            }
            .guide-tip-next {
                margin-top: 18px;
            }
        }
    }
    .content {
        margin-top: 79px;
        .tip {
            font-size: 16px;
            font-weight: 600;
            color: rgba(0, 0, 0, 1);
            line-height: 22px;
            margin-bottom: 24px;
            .icon-report {
                width: 16px;
            }
        }
        .qrcode {
            width: 122px;
            margin-bottom: 8px;
            border: 1px solid #0A84FF;
        }
        .qrcode-tip {
            font-size: 12px;
            font-weight: 400;
            color: rgba(94, 104, 123, 1);
            line-height: 17px;
        }
    }
}
/deep/.mint-spinner-fading-circle {
    margin: 0 auto;
}
</style>
