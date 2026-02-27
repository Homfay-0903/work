<!--
 * @Description: 首页 底部按钮提示
 * @Author: ouyaping
 * @Date: 2023-03-31 14:16:38
 * @LastEditTime: 2024-05-22 09:44:46
 * @LastEditors: liyunfei12354 3090384495@qq.com
 -->
<template>
    <div :class="['home-tip-btn', $i18n.locale]">
        <i18n path="home.btn-tip.add">
            <img src="@/assets/img/home/add-circle-fill.svg" place="addImg" alt="" />
            <i18n path="home.btn-tip.sub" place="sub">
                <img src="@/assets/img/home/indeterminate-circle-fill.svg" place="subImg" alt="" />
            </i18n>
        </i18n>
    </div>
</template>

<script>
export default {}
</script>
<style lang="less" scoped>
// &.it {
//     span {
//         font-size: 32px !important;
//         font-family: OPPOSans-R, OPPOSans;
//         font-weight: normal;
//         color: #e7e9f0;
//         display: flex;
//         flex-direction: row;
//         flex-wrap: wrap;
//     }
// }
.home-tip-btn {
    position: absolute;
    z-index: 10;
    bottom: 7px;
    left: 60px;

    span {
        font-size: 36px;
        font-family: OPPOSans-R, OPPOSans;
        font-weight: normal;
        color: #e7e9f0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    img {
        width: 48px;
    }
}
</style>
