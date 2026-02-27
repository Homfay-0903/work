<template>
    <!-- 公众号接入 -->
    <div class="access-content">
        <!-- 接入方式选择 -->
        <div class="type-select">
            <div
                v-for="(type, index) in bindTypes"
                :key="index"
                class="radio-wrapper"
                @click="changeBindType(type.value)"
                v-on:mouseenter="changSupportItem(type.value)"
            >
                <el-radio v-model="publicType" :label="type.value" :class="{'el-radio-checked': type.bind}">
                    {{type.name}}
                    <i class="check" v-if="type.bind"></i>
                </el-radio>
            </div>
        </div>

        <div class="public-type-guide">
            <div v-if="publicType === 'app'" class="guide-item">
                <h3>APP 对接</h3>
                <p class="tip">
                    维塑报告接入客户APP显示（需进行二维码或手环对接）
                    <a :href=" isVE260 ? 'https://suanier.github.io/vr-pro3-docs/#/ve-260' : 'https://suanier.github.io/vr-pro3-docs/'" target="_blank">APP对接说明 <i></i></a>
                    <!-- <router-link to="https://suanier.github.io/vr-pro3-docs/" tag="a" target="_blank">
                        https://suanier.github.io/vr-pro3-docs/
                        <i></i>
                    </router-link> -->
                </p>
                <div class="guide-item-picture">
                    <div class="text-img">
                        <div class="img-box">
                            <img src="@/assets/images/public/APP1.png" alt />
                        </div>
                        <p>进入APP → 找到测量报告</p>
                    </div>
                    <div class="text-img">
                        <div class="img-box">
                            <img src="@/assets/images/public/APP2.png" alt />
                        </div>
                        <p>通过菜单直接进入到维塑报告页面</p>
                    </div>
                </div>
            </div>
            <div v-if="publicType === 'wechat'" class="guide-item">
                <h3>公众号接入</h3>
                <p>维塑报告接入客户公众号显示（无需开发）</p>
                <div class="guide-item-picture">
                    <div class="text-img">
                        <div class="img-box">
                            <img src="@/assets/images/public/public_image_f@2x.png" alt />
                        </div>
                        <p>进入公众号 → 找到测量报告菜单</p>
                    </div>
                    <div class="text-img">
                        <div class="img-box">
                            <img src="@/assets/images/public/public_image_s@2x.png" alt />
                        </div>
                        <p>通过菜单直接进入到维塑报告页面</p>
                    </div>
                </div>
            </div>
            <div v-if="publicType === 'api'" class="guide-item">
                <h3>API 对接</h3>
                <p>通过刷卡完成用户信息绑定，同时报告内容根据需求个性化显示（需开发）</p>
                <p class="tip">
                    此项需要您拥有自己的服务器资源，设置前请先查阅
                    <a :href="apiUrl" target="_blank">维塑产品 API 接口文档 <i></i></a>
                    <!-- <router-link> -->
                        <!-- https://suanier.github.io/vr-pro3-docs/ -->
                        <!-- <i></i>
                    </router-link> -->
                </p>
                <div class="guide-item-picture guide-second-item">
                    <div>
                        <div class="img-box">
                            <!-- <img class="device-img" src="@/assets/images/public/api_image01.png" alt /> -->
                            <img class="device-img" v-if="isVAPro3" src="@/assets/images/public/device_apro3.png" alt="设备图片" />
                            <img class="device-img" v-else-if="isVAPro5" src="@/assets/images/public/apro5.png" alt="设备图片" />
                            <img class="device-img" v-else-if="isVAPro6" src="@/assets/images/public/apro6.png" alt="设备图片" />
                            <img class="device-img" v-else-if="isVAPro7" src="@/assets/images/public/apro7.png" alt="设备图片" />
                            <img class="device-img" v-else src="@/assets/images/public/device@2x.png" alt="设备图片" />
                        </div>
                        <p>刷卡 → 启动测量→ 测量完成</p>
                    </div>
                    <div>
                        <div class="img-box">
                            <img src="@/assets/images/public/api_image02.png" alt />
                        </div>
                        <p>健身房系统 → 用户身份验证</p>
                    </div>
                    <div>
                        <div class="img-box">
                            <img src="@/assets/images/public/api_image03.png" alt />
                        </div>
                        <p>APP/小程序或其他平台展示测量结果</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { findDeviceTypeInfo, findUserInfo } from '@/assets/js/apolloGql.js'
import { isVAPro3, isVAPro5, isVAPro6, isVAPro7, isVE260 } from '@/types/device.js'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            publicType: 'wechat',
            isVE260: isVE260(),
            bindTypes: [
                {
                    name: '公众号接入',
                    value: 'wechat',
                    docking: 'dockingWechat',
                    bind: false
                }
            ],
            perm: {},
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro6: isVAPro6(),
            isVAPro7: isVAPro7(),
            isVe260: isVE260()
        }
    },
    computed: {
        ...mapState(['userInfo']),
        apiUrl: function() {
            if (isVAPro5()) {
                return 'https://suanier.github.io/vr-pro3-docs/#/va-pro5'
            } else if (isVE260()) {
                return 'https://suanier.github.io/vr-pro3-docs/#/ve-260'
            }
            return 'https://suanier.github.io/vr-pro3-docs/#/vr-pro3'
        }
    },
    created() {
        this.findPerm()
    },
    methods: {
        // 获取用户信息判断用户权限
        findPerm() {
            this.$apollo
                .query({
                    query: findUserInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.findUserInfo
                    if (result.code === 200) {
                        this.perm = result.data.perm
                        if (this.perm.app === 1) {
                            this.bindTypes.push({
                                name: 'APP 对接',
                                value: 'app',
                                docking: 'dockingUrl',
                                bind: false
                            })
                        }
                        if (this.perm.api === 1) {
                            this.bindTypes.push({
                                name: 'API 对接',
                                value: 'api',
                                docking: 'dockingApi',
                                bind: false
                            })
                        }
                        this.findDeviceTypeInfo()
                    }
                })
            // this.perm = this.userInfo.perm;
        },
        // hover
        changSupportItem(val) {
            this.publicType = val
        },
        // click
        changeBindType(val) {
            if (val === 'wechat') {
                this.$router.push({
                    path: '/access/wechat'
                })
            } else if (val === 'api') {
                this.$router.push({
                    path: '/access/api'
                })
            } else {
                this.$router.push({
                    path: '/access/app'
                })
            }
        },
        // 查询当前配置好的公众号
        findDeviceTypeInfo() {
            this.$apollo
                .query({
                    query: findDeviceTypeInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.findDeviceTypeInfo
                    if (result.code === 200) {
                        const data = result.data
                        this.bindTypes.forEach(item => {
                            item.bind = data[item.docking]
                        })
                    }
                })
        }
    }
}
</script>
<style scoped lang="less">
.access-content {
    width: 80%;
    margin: 0 auto;
    text-align: left;
    color: #000;

    /deep/.type-select {
        display: flex;
        justify-content: space-around;
        padding-bottom: 85px;
        padding: 80px 0px;
        > div {
            width: 492px;
        }
        .el-radio {
            background: #fff;
            height: 120px;
            line-height: 120px;
            width: 100%;
            border: 1px solid rgba(215, 215, 218, 0.6);
            padding-left: 53px;
            .el-radio__inner {
                border: 2px solid #09bb07;
                background: #fff;
            }
            &:hover {
                border: 0 none;
                box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);
            }
            .check {
                position: absolute;
                top: 0;
                right: 0;
                width: 56px;
                height: 56px;
                background: url(../../assets/images/public/check_icon.png) no-repeat;
            }
        }
        .el-radio.is-checked {
            border: 0 none;
            box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);
            .check {
                display: block;
            }
        }
        .radio-wrapper + .radio-wrapper,
        .el-radio + .el-radio {
            margin-left: 36px;
        }
        .el-radio__input {
            height: 22px;
        }
        .el-radio-checked .el-radio__input .el-radio__inner {
            background-color: #09bb07;
        }
        .el-radio__inner::after {
            width: initial;
        }
        .el-radio__label {
            font-size: 24px;
            color: #4a4a4a;
        }
    }

    .public-type-guide {
        .guide-item {
            h3 {
                font-size: 25px;
                color: #000;
                letter-spacing: 1.14px;
                font-weight: 500;
                line-height: 1;
                padding-bottom: 10px;
            }
            > p {
                font-size: 24px;
                color: #4a4a4a;
                line-height: 1.4;
                padding-bottom: 4px;
            }
            p.tip {
                font-size: 20px;
                a {
                    padding-left: 20px;
                    color: #009fe8;
                    letter-spacing: -0.2px;
                    position: relative;
                    i {
                        background: url(../../assets/images/public/Shape.png) no-repeat;
                        background-size: 12px 12px;
                        width: 12px;
                        height: 12px;
                        position: absolute;
                        top: 3px;
                        right: -16px;
                    }
                }
            }
            .guide-item-picture {
                display: flex;
                justify-content: space-around;
                padding-top: 65px;
                > div {
                    text-align: center;
                    .img-box {
                        height: 218px;
                        line-height: 218px;
                        margin-bottom: 26px;
                        img {
                            width: 107px;
                            height: 209px;
                            vertical-align: middle;
                        }
                    }
                }
            }
            .guide-second-item {
                justify-content: space-between;
                padding: 36px 20px 0;
                > div {
                    .img-box {
                        margin-bottom: 18px;
                        img {
                            width: initial;
                            height: initial;
                        }
                        .device-img {
                            height: 213px;
                        }
                    }
                }
            }
        }
    }
}

@media screen and (min-width: 1024px) and (max-width: 1366px) {
    .access-content {
        width: 90%;
        .type-select {
            padding: 28px 0px;
            .el-radio {
                padding: 0 10px;
                text-align: center;
            }
            /deep/ .el-radio__label {
                font-size: 18px;
            }
        }

        .public-type-guide .guide-item {
            h3 {
                font-size: 20px;
            }

            > p {
                font-size: 18px;
            }
            .guide-item-picture {
                padding-top: 40px;
            }
        }
    }
}
</style>
