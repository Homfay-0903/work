<template>
    <div class="tips-wrapper">
        <template v-for="(tip, index) in tips">
            <div class="side-content" v-bind:key="index" v-if="index + 1 === type">
                <div class="side-header">
                    <h3>{{ tip.title }}</h3>
                    <span class="btn-close" @click="closeTips">
                        <i class="el-icon-close"></i>
                    </span>
                </div>
                <div class="side-container">
                    <template v-for="(intro, inIdx) in tip.intro">
                        <p class="intro" v-bind:key="inIdx" v-html="intro"></p>
                    </template>
                    <template v-for="(img, imIdx) in tip.imgs">
                        <div class="thumbnail" v-bind:key="imIdx">
                            <img :src="img" />
                            <el-button type="default" @click="openImg(img)">点击图片放大</el-button>
                        </div>
                    </template>
                    <p class="btn-action">
                        <el-button type="default" @click="closeTips">我知道了</el-button>
                    </p>
                </div>
            </div>
        </template>
        <!-- 点击预览图片 -->
        <el-dialog
            title
            :visible.sync="preview.open"
            :modal-append-to-body="false"
            class="table-dialog-box dialog-wrapper-372 thumb-picture-dialog"
            top="12%"
            center
            width="760px"
        >
            <div class="dialog-content text-center pl-0">
                <img :src="preview.url" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { isPrivate, postUrl } from '@/assets/js/config.js'
import axios from 'axios'
import { isVAPro5, isVAPro7, isVE260 } from '@/types/device.js'
export default {
    name: 'SideTips',
    props: {
        type: Number,
    },
    data() {
        return {
            preview: {
                open: false,
                url: '',
            }
        }
    },

    computed: {
        tips: function() {
            if (isVAPro5()) {
                return [
                    {
                        title: '获取公众号名称和二维码',
                        intro: [
                            '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;，获取微信公众号的微信号，并下载微信公众号的二维码。',
                        ],
                        imgs: ['/static/tips/invalid-name.jpg'],
                    },
                    {
                        title: '如何获取 AppID 和 Secret',
                        intro: [
                            '登入公众号平台，点击 &lt;开发&gt; 栏下方的 &lt;基本配置&gt;，获取微信公众号的 AppID、App Secret。',
                        ],
                        imgs: ['/static/tips/appid-secret.jpg'],
                    },
                    {
                        title: '如何找到授权域名文件',
                        intro: [
                            '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;选择&lt;功能设置&gt;，设置网页授权域名，下载网页授权域名的下载文件。',
                            '在网页授权页面同意授权给公众号后，微信会将授权数据传给维塑的回调页面，该页面在此域名下，确保安全可靠。请将域名设置为visfit.suanier.com。',
                        ],
                        imgs: ['/static/tips/wechat-setting.jpg', '/static/tips/domain-name.jpg'],
                    },
                    {
                        title: '如何添加新菜单',
                        intro: [
                            '复制跳转地址，返回公众号设置，添加新菜单及菜单跳转网址。',
                            '1、点击 &lt;自定义菜单&gt;，在子菜单名称中输入菜单名，如"VisbodyFit 报告"；',
                            '2、在子菜单内容中选择跳转网页；',
                            '3、在页面地址上输入刚复制的网页地址；',
                            '4、保存并发布该菜单栏设置。',
                        ],
                        imgs: ['/static/tips/add-menu.jpg'],
                    },
                    {
                        title: '如何添加 IP 白名单',
                        intro: [
                            '在公众号 &lt;基本配置&gt; 下 &lt;IP白名单&gt; 中将 116.196.117.62 添加到 IP 白名单中，完成如下操作。',
                        ],
                        imgs: ['/static/tips/ip-1.jpg', '/static/tips/ip-2.jpg'],
                    },
                    {
                        title: '接口凭证地址',
                        intro: [
                            '维塑向第三方服务获取接口凭证 token 的地址、key 和 Secret，设置时请将 key 和 Secret 包含在地址中，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_311-%e7%ac%ac%e4%b8%89%e6%96%b9%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81%e8%8e%b7%e5%8f%96">获取接口凭证</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '刷卡登录地址',
                        intro: [
                            '用户在设备端刷 RFID 或刷手划，维塑后台可以调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_313-%e7%ac%ac%e4%b8%89%e6%96%b9%e5%88%b7%e5%8d%a1%ef%bc%88%e6%89%8b%e7%8e%af%ef%bc%89%e7%99%bb%e5%bd%95%e9%aa%8c%e8%af%81">刷卡登录验证 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '模型合成通知',
                        intro: [
                            '维塑云端体测/体态数据计算出来之后，调用此接口通知第三方。收到合成通知后，第三方云可调用相应数据，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_314-%e7%bb%b4%e5%a1%91%e6%8e%a8%e9%80%81%e5%90%88%e6%88%90%e9%80%9a%e7%9f%a5%e6%b6%88%e6%81%af">合成通知 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '获取维塑接口凭证',
                        intro: [
                            '获取维塑接口凭证时，请带上此VFID和VFSECRET，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_321-%e8%8e%b7%e5%8f%96%e7%bb%b4%e5%a1%91%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81">获取维塑接口凭证 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '用户信息地址',
                        intro: [
                            '该地址提供给维塑，通过用户手机号，获取用户信息，展示在报告的个人中心，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_322-%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af%e7%bb%91%e5%ae%9a">获取用户信息 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '二维码请求地址',
                        intro: [
                            '维塑请求该接口返回的二维码，显示在设备上，提供给测量者扫描，跳转到对接的APP，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_312-%e7%ac%ac%e4%b8%89%e6%96%b9%e8%8e%b7%e5%8f%96%e4%ba%8c%e7%bb%b4%e7%a0%81%e6%8e%a5%e5%8f%a3">第三方二维码接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '字符编码登录地址',
                        intro: [
                            '用户在设备端输入字符编码，维塑后台可调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_31-%e7%ac%ac%e4%b8%89%e6%96%b9%e5%ae%a2%e6%88%b7%e5%af%b9%e6%8e%a5%e8%af%b4%e6%98%8e">字符编码登录验证api接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '人脸识别登录地址',
                        intro: [
                            '维塑调用此接口将测量完成后的扫描ID 和设备 ID 传送给第三方，由第三方将设备、扫描信息和人脸信息进行绑定。请查阅<a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro5?id=_6%e4%ba%ba%e8%84%b8%e5%af%b9%e6%8e%a5">人脸识别登录地址接口</a>。 ',
                        ],
                        imgs: [],
                    },
                ]
            } else if (isVAPro7()) {
                return [
                    {
                        title: '获取公众号名称和二维码',
                        intro: [
                            '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;，获取微信公众号的微信号，并下载微信公众号的二维码。',
                        ],
                        imgs: ['/static/tips/invalid-name.jpg'],
                    },
                    {
                        title: '如何获取 AppID 和 Secret',
                        intro: [
                            '登入公众号平台，点击 &lt;开发&gt; 栏下方的 &lt;基本配置&gt;，获取微信公众号的 AppID、App Secret。',
                        ],
                        imgs: ['/static/tips/appid-secret.jpg'],
                    },
                    {
                        title: '如何找到授权域名文件',
                        intro: [
                            '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;选择&lt;功能设置&gt;，设置网页授权域名，下载网页授权域名的下载文件。',
                            '在网页授权页面同意授权给公众号后，微信会将授权数据传给维塑的回调页面，该页面在此域名下，确保安全可靠。请将域名设置为visfit.suanier.com。',
                        ],
                        imgs: ['/static/tips/wechat-setting.jpg', '/static/tips/domain-name.jpg'],
                    },
                    {
                        title: '如何添加新菜单',
                        intro: [
                            '复制跳转地址，返回公众号设置，添加新菜单及菜单跳转网址。',
                            '1、点击 &lt;自定义菜单&gt;，在子菜单名称中输入菜单名，如"VisbodyFit 报告"；',
                            '2、在子菜单内容中选择跳转网页；',
                            '3、在页面地址上输入刚复制的网页地址；',
                            '4、保存并发布该菜单栏设置。',
                        ],
                        imgs: ['/static/tips/add-menu.jpg'],
                    },
                    {
                        title: '如何添加 IP 白名单',
                        intro: [
                            '在公众号 &lt;基本配置&gt; 下 &lt;IP白名单&gt; 中将 116.196.117.62 添加到 IP 白名单中，完成如下操作。',
                        ],
                        imgs: ['/static/tips/ip-1.jpg', '/static/tips/ip-2.jpg'],
                    },
                    {
                        title: '接口凭证地址',
                        intro: [
                            '维塑向第三方服务获取接口凭证 token 的地址、key 和 Secret，设置时请将 key 和 Secret 包含在地址中，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_311-%e7%ac%ac%e4%b8%89%e6%96%b9%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81%e8%8e%b7%e5%8f%96">获取接口凭证</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '刷卡登录地址',
                        intro: [
                            '用户在设备端刷 RFID 或刷手划，维塑后台可以调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_313-%e7%ac%ac%e4%b8%89%e6%96%b9%e5%88%b7%e5%8d%a1%ef%bc%88%e6%89%8b%e7%8e%af%ef%bc%89%e7%99%bb%e5%bd%95%e9%aa%8c%e8%af%81">刷卡登录验证 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '模型合成通知',
                        intro: [
                            '维塑云端体测/体态数据计算出来之后，调用此接口通知第三方。收到合成通知后，第三方云可调用相应数据，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_314-%e7%bb%b4%e5%a1%91%e6%8e%a8%e9%80%81%e5%90%88%e6%88%90%e9%80%9a%e7%9f%a5%e6%b6%88%e6%81%af">合成通知 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '获取维塑接口凭证',
                        intro: [
                            '获取维塑接口凭证时，请带上此VFID和VFSECRET，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_321-%e8%8e%b7%e5%8f%96%e7%bb%b4%e5%a1%91%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81">获取维塑接口凭证 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '用户信息地址',
                        intro: [
                            '该地址提供给维塑，通过用户手机号，获取用户信息，展示在报告的个人中心，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_322-%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af%e7%bb%91%e5%ae%9a">获取用户信息 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '二维码请求地址',
                        intro: [
                            '维塑请求该接口返回的二维码，显示在设备上，提供给测量者扫描，跳转到对接的APP，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_312-%e7%ac%ac%e4%b8%89%e6%96%b9%e8%8e%b7%e5%8f%96%e4%ba%8c%e7%bb%b4%e7%a0%81%e6%8e%a5%e5%8f%a3">第三方二维码接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '字符编码登录地址',
                        intro: [
                            '用户在设备端输入字符编码，维塑后台可调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_31-%e7%ac%ac%e4%b8%89%e6%96%b9%e5%ae%a2%e6%88%b7%e5%af%b9%e6%8e%a5%e8%af%b4%e6%98%8e">字符编码登录验证api接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '人脸识别登录地址',
                        intro: [
                            '维塑调用此接口将测量完成后的扫描ID 和设备 ID 传送给第三方，由第三方将设备、扫描信息和人脸信息进行绑定。请查阅<a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/va-pro7?id=_6%e4%ba%ba%e8%84%b8%e5%af%b9%e6%8e%a5">人脸识别登录地址接口</a>。 ',
                        ],
                        imgs: [],
                    },
                ]
            } else if (isVE260()) {
                return [
                    {
                        title: '获取公众号名称和二维码',
                        intro: [
                            '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;，获取微信公众号的微信号，并下载微信公众号的二维码。',
                        ],
                        imgs: ['/static/tips/invalid-name.jpg'],
                    },
                    {
                        title: '如何获取 AppID 和 Secret',
                        intro: [
                            '登入公众号平台，点击 &lt;开发&gt; 栏下方的 &lt;基本配置&gt;，获取微信公众号的 AppID、App Secret。',
                        ],
                        imgs: ['/static/tips/appid-secret.jpg'],
                    },
                    {
                        title: '如何找到授权域名文件',
                        intro: [
                            '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;选择&lt;功能设置&gt;，设置网页授权域名，下载网页授权域名的下载文件。',
                            '在网页授权页面同意授权给公众号后，微信会将授权数据传给维塑的回调页面，该页面在此域名下，确保安全可靠。请将域名设置为visfit.suanier.com。',
                        ],
                        imgs: ['/static/tips/wechat-setting.jpg', '/static/tips/domain-name.jpg'],
                    },
                    {
                        title: '如何添加新菜单',
                        intro: [
                            '复制跳转地址，返回公众号设置，添加新菜单及菜单跳转网址。',
                            '1、点击 &lt;自定义菜单&gt;，在子菜单名称中输入菜单名，如"VisbodyFit 报告"；',
                            '2、在子菜单内容中选择跳转网页；',
                            '3、在页面地址上输入刚复制的网页地址；',
                            '4、保存并发布该菜单栏设置。',
                        ],
                        imgs: ['/static/tips/add-menu.jpg'],
                    },
                    {
                        title: '如何添加 IP 白名单',
                        intro: [
                            '在公众号 &lt;基本配置&gt; 下 &lt;IP白名单&gt; 中将 116.196.117.62 添加到 IP 白名单中，完成如下操作。',
                        ],
                        imgs: ['/static/tips/ip-1.jpg', '/static/tips/ip-2.jpg'],
                    },
                    {
                        title: '接口凭证地址',
                        intro: [
                            '维塑向第三方服务获取接口凭证 token 的地址、key 和 Secret，设置时请将 key 和 Secret 包含在地址中，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_311-%e7%ac%ac%e4%b8%89%e6%96%b9%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81%e8%8e%b7%e5%8f%96">获取接口凭证</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '刷卡登录地址',
                        intro: [
                            '用户在设备端刷 RFID 或刷手划，维塑后台可以调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_311-%e7%ac%ac%e4%b8%89%e6%96%b9%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81%e8%8e%b7%e5%8f%96">刷卡登录验证 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '模型合成通知',
                        intro: [
                            '维塑云端体测/体态数据计算出来之后，调用此接口通知第三方。收到合成通知后，第三方云可调用相应数据，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_314-%e7%bb%b4%e5%a1%91%e6%8e%a8%e9%80%81%e5%90%88%e6%88%90%e9%80%9a%e7%9f%a5%e6%b6%88%e6%81%af">合成通知 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '获取维塑接口凭证',
                        intro: [
                            '获取维塑接口凭证时，请带上此VFID和VFSECRET，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_32-%e8%8e%b7%e5%8f%96%e7%bb%b4%e5%a1%91%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81">获取维塑接口凭证 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '用户信息地址',
                        intro: [
                            '该地址提供给维塑，通过用户手机号，获取用户信息，展示在报告的个人中心，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_322-%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af%e7%bb%91%e5%ae%9a">获取用户信息 api 接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '二维码请求地址',
                        intro: [
                            '维塑请求该接口返回的二维码，显示在设备上，提供给测量者扫描，跳转到对接的APP，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_3-%e4%ba%8c%e7%bb%b4%e7%a0%81%e5%af%b9%e6%8e%a5">第三方二维码接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '字符编码登录地址',
                        intro: [
                            '用户在设备端输入字符编码，维塑后台可调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_31-%e7%ac%ac%e4%b8%89%e6%96%b9%e5%ae%a2%e6%88%b7%e5%af%b9%e6%8e%a5%e8%af%b4%e6%98%8e">字符编码登录验证api接口</a>',
                        ],
                        imgs: [],
                    },
                    {
                        title: '人脸识别登录地址',
                        intro: [
                            '维塑调用此接口将测量完成后的扫描ID 和设备 ID 传送给第三方，由第三方将设备、扫描信息和人脸信息进行绑定。请查阅<a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/ve-260?id=_6%e4%ba%ba%e8%84%b8%e5%af%b9%e6%8e%a5">人脸识别登录地址接口</a>。 ',
                        ],
                        imgs: [],
                    },
                ]
            }
            return [
                {
                    title: '获取公众号名称和二维码',
                    intro: [
                        '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;，获取微信公众号的微信号，并下载微信公众号的二维码。',
                    ],
                    imgs: ['/static/tips/invalid-name.jpg'],
                },
                {
                    title: '如何获取 AppID 和 Secret',
                    intro: [
                        '登入公众号平台，点击 &lt;开发&gt; 栏下方的 &lt;基本配置&gt;，获取微信公众号的 AppID、App Secret。',
                    ],
                    imgs: ['/static/tips/appid-secret.jpg'],
                },
                {
                    title: '如何找到授权域名文件',
                    intro: [
                        '登入公众号平台，点击 &lt;设置&gt; 栏下方的 &lt;公众号设置&gt;选择&lt;功能设置&gt;，设置网页授权域名，下载网页授权域名的下载文件。',
                        '在网页授权页面同意授权给公众号后，微信会将授权数据传给维塑的回调页面，该页面在此域名下，确保安全可靠。请将域名设置为visfit.suanier.com。',
                    ],
                    imgs: ['/static/tips/wechat-setting.jpg', '/static/tips/domain-name.jpg'],
                },
                {
                    title: '如何添加新菜单',
                    intro: [
                        '复制跳转地址，返回公众号设置，添加新菜单及菜单跳转网址。',
                        '1、点击 &lt;自定义菜单&gt;，在子菜单名称中输入菜单名，如"VisbodyFit 报告"；',
                        '2、在子菜单内容中选择跳转网页；',
                        '3、在页面地址上输入刚复制的网页地址；',
                        '4、保存并发布该菜单栏设置。',
                    ],
                    imgs: ['/static/tips/add-menu.jpg'],
                },
                {
                    title: '如何添加 IP 白名单',
                    intro: [
                        '在公众号 &lt;基本配置&gt; 下 &lt;IP白名单&gt; 中将 116.196.117.62 添加到 IP 白名单中，完成如下操作。',
                    ],
                    imgs: ['/static/tips/ip-1.jpg', '/static/tips/ip-2.jpg'],
                },
                {
                    title: '接口凭证地址',
                    intro: [
                        '维塑向第三方服务获取接口凭证 token 的地址、key 和 Secret，设置时请将 key 和 Secret 包含在地址中，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/?id=_311-%e7%ac%ac%e4%b8%89%e6%96%b9%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81%e8%8e%b7%e5%8f%96">获取接口凭证</a>',
                    ],
                    imgs: [],
                },
                {
                    title: '刷卡登录地址',
                    intro: [
                        '用户在设备端刷 RFID 或刷手划，维塑后台可以调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅  <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/vr-pro3?id=_311-%e7%ac%ac%e4%b8%89%e6%96%b9%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81%e8%8e%b7%e5%8f%96">刷卡登录验证 api 接口</a>',
                    ],
                    imgs: [],
                },
                {
                    title: '模型合成通知',
                    intro: [
                        '维塑云端体测/体态数据计算出来之后，调用此接口通知第三方。收到合成通知后，第三方云可调用相应数据，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/vr-pro3?id=_314-%e7%bb%b4%e5%a1%91%e6%8e%a8%e9%80%81%e5%90%88%e6%88%90%e9%80%9a%e7%9f%a5%e6%b6%88%e6%81%af">合成通知 api 接口</a>',
                    ],
                    imgs: [],
                },
                {
                    title: '获取维塑接口凭证',
                    intro: [
                        '获取维塑接口凭证时，请带上此VFID和VFSECRET，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/vr-pro3?id=_321-%e8%8e%b7%e5%8f%96%e7%bb%b4%e5%a1%91%e6%8e%a5%e5%8f%a3%e5%87%ad%e8%af%81">获取维塑接口凭证 api 接口</a>',
                    ],
                    imgs: [],
                },
                {
                    title: '用户信息地址',
                    intro: [
                        '该地址提供给维塑，通过用户手机号，获取用户信息，展示在报告的个人中心，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/vr-pro3?id=_322-%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af%e7%bb%91%e5%ae%9a">获取用户信息 api 接口</a>',
                    ],
                    imgs: [],
                },
                {
                    title: '二维码请求地址',
                    intro: [
                        '维塑请求该接口返回的二维码，显示在设备上，提供给测量者扫描，跳转到对接的APP，详情请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/vr-pro3?id=_3-%e4%ba%8c%e7%bb%b4%e7%a0%81%e5%af%b9%e6%8e%a5">第三方二维码接口</a>',
                    ],
                    imgs: [],
                },
                {
                    title: '字符编码登录地址',
                    intro: [
                        '用户在设备端输入字符编码，维塑后台可调用此接口，将用户 ID 和设备 ID 传送给第三方，由第三方后台进行用户身份验证，请查阅 <a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/vr-pro3?id=_31-%e7%ac%ac%e4%b8%89%e6%96%b9%e5%ae%a2%e6%88%b7%e5%af%b9%e6%8e%a5%e8%af%b4%e6%98%8e">字符编码登录验证api接口</a>',
                    ],
                    imgs: [],
                },
                {
                    title: '人脸识别登录地址',
                    intro: [
                        '维塑调用此接口将测量完成后的扫描ID 和设备 ID 传送给第三方，由第三方将设备、扫描信息和人脸信息进行绑定。请查阅<a class="a" target="_blank" href="https://suanier.github.io/vr-pro3-docs/#/vr-pro3?id=_6%e4%ba%ba%e8%84%b8%e5%af%b9%e6%8e%a5">人脸识别登录地址接口</a>。 ',
                    ],
                    imgs: [],
                },
                {
                    title: '系统推送地址',
                    intro: [
                        '维塑云端体测/体态数据计算出来之后，调用此接口推送测量数据，由第三方提供。',
                    ],
                    imgs: [],
                },
            ]
        }
    },
    mounted() {
        document.addEventListener('click', (e) => this.goApiArd(e))
    },
    methods: {
        closeTips() {
            this.preview.open = false
            this.$emit('closeTips')
        },
        openImg(url) {
            this.preview.open = true
            this.preview.url = url
        },
        goApiArd(e) {
            if (e.path && e.path[0] && e.path[0]['outerHTML'] && e.path[0]['className'] === 'a') {
                const urls = e.path[0]['outerHTML'].match(/url="(\S*)"/)
                if (urls && urls.length > 0) {
                    if (isPrivate) {
                        // 单机版
                        axios({
                            url: `${postUrl}/download/ve335-api.pdf`,
                            method: 'get',
                            responseType: 'blob',
                        }).then((response) => {
                            const a = document.createElement('a')
                            const blob = new Blob([response.data], { type: 'application/pdf' })
                            const objectUrl = URL.createObjectURL(blob)
                            a.setAttribute('href', objectUrl)
                            a.setAttribute('download', 'VE335第三⽅API对接⽂档-单机版.pdf')
                            a.click()
                        })
                    } else {
                        // 云端版本
                        window.open(urls[1])
                    }
                }
            }
        },
    },
}
</script>
<style lang="less" scoped>
.tips-wrapper {
    color: #4a4a4a;

    .side-content {
        position: absolute;
        right: 0;
        height: 100%;
        width: 321px;
        pointer-events: auto;
        background-color: #fff;
        box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);

        .side-header {
            border-bottom: 1px solid #efeff4;
            padding-top: 16px;
            padding-bottom: 8px;
            position: relative;

            h3 {
                color: #4a4a4a;
                font-size: 20px;
                font-weight: normal;
                width: 80%;
                padding-left: 24px;
                line-height: 1.37;
            }

            .btn-close {
                position: absolute;
                top: 16px;
                right: 24px;
                width: 28px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                border-radius: 50%;
                background-color: #efeff4;
                cursor: pointer;

                &:hover {
                    background-color: rgba(0, 0, 0, 0.15);
                }

                i {
                    color: #000;
                }
            }
        }

        .side-container {
            padding: 40px 32px;

            /deep/ p.intro {
                font-size: 16px;
                line-height: 1.4;

                .a {
                    position: relative;
                    color: #009fe8;
                    vertical-align: middle;
                    cursor: pointer;

                    &:after {
                        position: relative;
                        display: inline-block;
                        content: '';
                        background: url(../../assets/images/public/Shape.png) no-repeat;
                        width: 12px;
                        height: 12px;
                        vertical-align: middle;
                        margin-left: 5px;
                    }
                }
            }

            .thumbnail {
                padding: 40px 0;
                position: relative;

                img {
                    width: 100%;
                    cursor: pointer;
                }

                button {
                    position: absolute;
                    width: 98px;
                    height: 32px;
                    border-radius: 16px;
                    border: 0 none;
                    background-color: rgba(216, 216, 216, 0.69);
                    font-size: 12px;
                    color: #4a4a4a;
                    top: 50%;
                    margin-top: -16px;
                    left: 50%;
                    margin-left: -49px;
                    text-align: center;
                    padding: 0;

                    &:hover {
                        background-color: rgba(216, 216, 216, 0.5);
                    }
                }
            }

            .btn-action {
                text-align: center;
                padding-top: 50px;

                button {
                    width: 98px;
                    border-radius: 20px;
                    border: solid 1px #4eabe8;
                    padding: 0;
                    font-size: 16px;
                    color: #666;
                    line-height: 32px;
                }
            }
        }
    }

    // 图片放大预览
    /deep/ .thumb-picture-dialog {
        pointer-events: auto;

        .el-dialog__header {
            padding-top: 40px;

            .el-dialog__headerbtn {
                width: 28px;
                height: 28px;
                line-height: 27px;
                text-align: center;
                background-color: #efeff4;
                border-radius: 50%;
                top: 8px;
                right: 16px;

                &:hover {
                    background-color: rgba(0, 0, 0, 0.15);
                }
            }

            .el-dialog__headerbtn .el-dialog__close {
                color: #000;
                font-size: 16px;
            }
        }

        .el-dialog__body {
            padding: 0 8px 16px;

            .dialog-content {
                img {
                    width: 100%;
                }
            }
        }
    }

    .thumb-picture-width {
        .el-dialog {
            width: 564px !important;
        }
    }

    .table-dialog-box {
        .el-form-item__content {
            padding-left: 0 !important;
        }

        .no-input-form {
            .el-form-item__content {
                padding-left: 16px !important;
            }
        }

        .el-form-item.is-required .el-form-item__label:before {
            color: rgba(0, 0, 0, 0.65);
            margin-left: -9px;
            position: absolute;
            top: 4px;
            font-size: 16px;
        }
    }

    .dialog-wrapper-372 {
        .el-dialog {
            top: 50%;
        }
    }
}
</style>
