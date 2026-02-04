<!--
 * @Description: 体态测量成功反馈
 * @Author: ouyaping
 * @Date: 2023-04-07 11:29:36
 * @LastEditors: ouyaping
 * @LastEditTime: 2023-04-07 11:39:09
-->
<template>
    <div class="footer-msg">
        <p><img src="@img/mass/success_icon.png" /></p>
        <p class="model-title">{{ $t('mass.success') }}</p>
        <p v-if="successful" class="model-content">{{ successful }}</p>
    </div>
</template>

<script>
export default {
    name: 'MassSuccess',
    props: {
        // 成功后的文字
        successful: {
            type: String,
            default: ''
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/css" scoped>
.footer-msg {
    width: 100%;
    margin: 495px auto;
    height: 100%;
    position: relative;
    text-align: center;
    img {
        width: 642px;
        height: 642px;
    }
    .model-title {
        margin-bottom: 48px;
        margin-top: 91px;
        font-size: 64px;
        font-family: OPPOSansM;
        font-weight: normal;
        color: #ffffff;
        line-height: 96px;
    }

    .model-content {
        margin: 0;
        font-size: 48px;
        font-family: OPPOSansR;
        font-weight: normal;
        color: #e7e9f0;
        line-height: 72px;
        width: 864px;
        margin: 0 108px;
    }
}
</style>
