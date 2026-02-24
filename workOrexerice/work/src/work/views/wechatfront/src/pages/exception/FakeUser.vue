<!--
 * @Author: Wendy Gao
 * @Date: 2022-07-27 10:34:59
 * @LastEditors: Wendy Gao
 * @LastEditTime: 2022-07-27 17:32:30
 * @Description: 微信虚拟用户，提醒用户主动授权
-->
<template>
    <div class="exception-page">
        <div class="exception-wrapper">
            <div class="background-image">
                <img src="@/assets/images/excep_binding_def.png" alt />
            </div>
            <p class="title">用户授权提醒</p>
            <p class="desc">
                根据微信官方要求，如需体验完整功能 <strong>请点击右下方 “使用完整服务” </strong>按钮
            </p>
        </div>
    </div>
</template>
<style lang="less" scoped>
.exception-wrapper {
    position: absolute;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);
    .background-image {
        padding-top: 72px;
        padding-bottom: 30px;
        img {
            max-width: 180px;
            display: inline-block;
            // 禁止部分安卓机下图片自动放大
            pointer-events: none;
        }
    }
    > p {
        color: #6468ae;
        &.title {
            line-height: 1.5;
            font-size: 16px;
        }
        &.desc {
            line-height: 1.71;
            font-size: 14px;
            max-width: 75%;
            margin: 4px auto;
            span {
                color: #fff;
                text-decoration: underline;
            }
        }
    }
    .history-result {
        display: inline-block;
        span {
            display: block;
            font-size: 16px;
            width: 200px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            border-radius: 6px;
        }
        span:first-child {
            background-image: linear-gradient(to right, #00e3c9, #00a4e6);
            margin-bottom: 16px;
            margin-top: 118px;
        }
    }
}
@media (min-width: 992px) {
    .exception-wrapper {
        .background-image {
            padding-top: 40px !important;
            padding-bottom: 20px;
            img {
            }
        }
        > p.title {
            font-size: 10px;
        }
    }
}
</style>