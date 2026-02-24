<template>
    <div class="header">
        <!-- logo -->
        <div class="scan-time">
            <img src="@/assets/images/english_logo.svg" class="vf-logo" />
            <div class="time">
                <span class="key">
                    <img src="@/assets/images/time-fill.svg" alt="">
                    解读时间:
                </span>
                <span class="key">{{ reportInfo.createTime }}</span>
            </div>
        </div>
        <!-- 扫描者信息 -->
        <div class="scan-info">
            <span class="key">ID:</span>
            <span class="val">{{ mobile }}</span>
            <span class="key">性别:</span>
            <span class="val">{{ memberInfo.memberSex === 1 ? '男' : '女' }}</span>
            <span class="key">身高:</span>
            <span class="val">{{ memberInfo.memberHeight }}cm</span>
            <span class="key">年龄:</span>
            <span class="val">{{ memberInfo.memberAge }}岁</span>
            <span class="key">报告时间:</span>
            <span class="key">{{ memberInfo.scanTime }}</span>
        </div>
        <div class="title">
            <h1 :class="'color-' + type">{{ reportTitle }}</h1>
        </div>
    </div>
</template>
<script>
import { getUserId } from '@/assets/js/util.js'
export default {
    name: 'Header',
    props: {
        reportInfo: Object,
        memberInfo: Object,
        // 报告分数类型 1 解读报告 2 运动建议 3 营养建议
        type: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {}
    },
    computed: {
        // 手机号脱敏
        mobile() {
            const phone = this.memberInfo.memberMobile
            return phone ? getUserId(phone) : ''
        },
        reportTitle() {
            let title = ''
            switch (this.type) {
                case 1:
                    title = '报告解读'
                    break

                case 2:
                    title = '运动计划'
                    break

                case 3:
                    title = '营养计划'
                    break

                default:
                    break
            }
            return title
        }
    }
}
</script>
<style lang="less" scoped>
.header {
    position: relative;
    .scan-time {
        display: flex;
        justify-content: space-between;
        padding-bottom: 6px;
        border-bottom: 3px solid #D8D8D8;
        .vf-logo {
            width: 283px;
            height: auto;
        }
        .time {
            font-size: 17px;
            font-family: OPPOSans-L;
            font-weight: normal;
            color: #666666;
            line-height: 30px;
            span {
                vertical-align: sub;
            }
            img {
                width: 20px;
                vertical-align: sub;
            }
        }
    }
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 28px;

        h1 {
            margin: 0;
            font-size: 48px;
            font-family: OPPOSans-M;
            font-weight: normal;
            color: #333333;
            line-height: 64px;
            &.color-1 {
                border-bottom: 4px solid #079379;
            }
            &.color-2 {
                border-bottom: 4px solid #79bd09;
            }
            &.color-3 {
                border-bottom: 4px solid #d9b90f;
            }
        }
    }
    .scan-info {
        margin-top: 11px;
        span {
            font-size: 17px;
            font-family: OPPOSans-L;
            line-height: 30px;
            color: #666666;
        }
        .key {
            margin-right: 7px;
        }
        .val {
            margin-right: 18px;
        }
    }
}
</style>
