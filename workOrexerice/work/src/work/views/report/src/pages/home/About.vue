<template>
    <div class="page-about">
        <div class="ours-msg company-profile">
            <h1 class="msg-title">蒜泥电子科技</h1>
            <p class="msg-txt">
                蒜泥科技有限公司（以下简称“蒜泥科技”或“公司”），成立于2014年1月，公司总部位于西安，并在深圳设有研发中心，
                具有一支业界领先的研发团队。历经3年的发展，现已成为以科技，教育以及文化三大板块为支撑，下属多家子公司的国
                家级高新技术企业，业务范围涵盖：人工智能，科技孵化器，创客咖啡STEAM创客教育，三维重构技术，VR与3D打印服务，
                短视频内容，网红影视 ，文化娱乐等领域，并承担了陕西省重大科技项目等业务，并承担陕西省重大科技项目的研发。
            </p>
        </div>
        <div class="ours-msg contact-ours">
            <h1 class="msg-title">联系我们</h1>
            <p>
                <span class="msg-icon phone-icon"></span>+86-029-86550582
            </p>
            <p>
                <span class="msg-icon web-icon"></span>info@visbodyfit.com
            </p>
            <p>
                <span class="msg-icon address-icon"></span>西安市经济技术开发区尚华路555号&nbsp;710018
            </p>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'About',
    data() {
        return {}
    }
}
</script>

<style scoped lang="less">
.page-about {
    width: 100%;
    height: 100%;
    padding-top: 78px;
    padding-left: 11%;

    .ours-msg {
        width: 94%;
        height: 307px;
        background-color: #ffffff;
        margin-bottom: 40px;
        padding: 64px 180px 0;
        text-align: left;

        .msg-title {
            font-size: 29px;
            font-weight: 500;
            color: #172b4d;
            margin-bottom: 32px;
        }

        .msg-txt {
            font-size: 16px;
            line-height: 1.75;
            text-align: justify;
            color: #8c8c8c;
        }

        .msg-icon {
            display: inline-block;
            width: 22px;
            height: 25px;
            margin-right: 36px;
            vertical-align: middle;
            margin-top: -2px;
        }

        .phone-icon {
            background: url(../../assets/images/login/phone-material.png) no-repeat center center;
            background-size: 18px 18px;
        }

        .web-icon {
            background: url(../../assets/images/login/local-post-office-material.png) no-repeat center center;
            background-size: 22px 17px;
        }

        .address-icon {
            background: url(../../assets/images/login/ion-ios-location-ionicons.png) no-repeat center center;
            background-size: 16px 25px;
        }
    }

    .contact-ours {
        >p {
            padding: 11px 0;
            font-size: 16px;
            text-align: justify;
            color: #8c8c8c;
        }
    }
}

@media screen and (min-width: 1024px) and (max-width: 1366px) {
    .ours-msg {
        padding: 24px 18px 0 !important;
    }
}
</style>
