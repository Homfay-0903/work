<template>
    <div class="go-Login-box">
        <div class="go-login">
            <div class="mashed-garlic-introduce">
                <h1 class="mashed-garlic-title">蒜泥电子科技</h1>
                <p class="mashed-garlic-txt">
                    蒜泥科技有限公司（以下简称“蒜泥科技”或“公司”），成立于2014年1月，公司总部位于西安，并在深圳设有研发中心，具有一支业界领先的研发团队。历经3年的发展，现已成为以科技，教育以及文化三大板块为支撑，下属多家子公司的国家级高新技术企业，业务范围涵盖：人工智能，科技孵化器，创客咖啡STEAM创客教育，三维重构技术，VR与3D打印服务，短视频内容，网红影视，文化娱乐等领域，并承担了陕西省重大科技项目等业务，并承担陕西省重大科技项目的研发。
                </p>
            </div>
            <div class="contact-ours">
                <h1 class="mashed-garlic-title">联系我们</h1>
                <ul class="contact-our-list">
                    <li class="contact-our-li">
                        <span class="contact-phone"></span>
                        <span>+86-029-86550582</span>
                    </li>
                    <li class="contact-our-li">
                        <span class="contact-phone contact-msg"></span>
                        <span>info@visbodyfit.com</span>
                    </li>
                    <li class="contact-our-li">
                        <span class="contact-phone contact-address"></span>
                        <span>西安市经济技术开发区尚华路555号 710018</span>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            <router-link to="/">
                <el-button type="primary" round>去登录</el-button>
            </router-link>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    components: {},
    data() {
        return {}
    }
}
</script>

<style scoped lang="less">
.go-Login-box {
    background-color: #f5f6fa;
}

.go-login {
    min-height: 592px;
    padding: 160px 186px 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
}

.mashed-garlic-introduce {
    width: 604px;
    text-align: left;
    font-size: 16px;
    color: #8c8c8c;
}

.mashed-garlic-title {
    font-size: 29px;
    font-weight: 500;
    color: #172b4d;
}

.mashed-garlic-txt {
    padding-top: 56px;
    line-height: 2.5;
    text-align: justify;
}

.contact-ours {
    padding-left: 120px;
}

.contact-our-list {
    margin-top: 56px;
    padding-top: 2px;
}

.contact-our-li {
    padding-top: 38px;
    font-size: 16px;
    color: #8c8c8c;
    text-align: justify;
}

.contact-phone {
    display: inline-block;
    width: 22px;
    height: 25px;
    background: url(../../assets/images/login/phone-material.png) no-repeat center center;
    background-size: 18px 18px;
    vertical-align: middle;
    margin-top: -2px;
    margin-right: 16px;
}

.contact-msg {
    background: url(../../assets/images/login/local-post-office-material.png) no-repeat center center;
    background-size: 22px 17px;
}

.contact-address {
    background: url(../../assets/images/login/ion-ios-location-ionicons.png) no-repeat center center;
    background-size: 16px 25px;
}
</style>
