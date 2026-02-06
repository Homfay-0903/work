<template>
    <div class="page-access scrollbar">
        <div class="header">
            <p>
                APP 对接设置
                <el-button round class="el-icon-back" @click="goBack">返回</el-button>
            </p>
        </div>
        <!-- 第一页 -->
        <div class="content-wrapper" v-if="page === 1">
            <div class="access-title">
                <p>此方式可将维塑产品页面嵌入到您的 APP 内。</p>
                <!-- <p class="gray-color">侧边栏的功能有「个人中心」、「问题反馈」、「关于我们」。</p> -->
            </div>
            <div class="item-picture">
                <div>
                    <img src="@/assets/images/public/APP1@2x.png" alt="APP对接" class="title-app" />
                </div>
                <!-- <div>
                    <img src="@/assets/images/public/APP2@2x.png" alt="APP对接" class="title-app" />
                </div> -->
            </div>
            <div label class="form-btns center">
                <!-- <el-button type="default" round @click="needSet">需要</el-button> -->
                <el-button type="primary" round @click="skipSet">开启</el-button>
            </div>
        </div>
        <!-- 第二页 -->
        <div class="content-wrapper" v-if="page === 2">
            <div class="access-title">提供给维塑：</div>
            <div style="padding-top: 40px;">
                <div>
                    <el-form
                        :model="form"
                        :rules="rules"
                        ref="form"
                        label-width="200px"
                        label-position="right"
                        class="app-form"
                    >
                        <el-form-item label="获取接口凭证地址" prop="tokenUrl">
                            <el-input placeholder="https://[域名]?key=KEY&secret=SECRET" v-model="form.tokenUrl"></el-input>
                            <el-button type="text" icon="el-icon-question" @click="tipsType = 6">获取接口凭证地址有什么用？</el-button>
                        </el-form-item>

                        <el-form-item label="获取用户信息地址" prop="userinfoUrl">
                            <el-input placeholder="https://[域名]" v-model="form.userinfoUrl"></el-input>
                            <el-button type="text" icon="el-icon-question" @click="tipsType = 10">获取用户信息地址有什么用？</el-button>
                        </el-form-item>
                        <el-form-item label class="form-btn-action" style="margin-top: 220px">
                            <el-button type="primary" round @click="handleSubmit">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 第三页 -->
        <div v-if="page === 3" class="content-wrapper">
            <div class="access-title">维塑提供给您：</div>
            <div style="padding-top: 40px;">
                <el-form :model="form" label-width="160px" label-position="right" class="app-form">
                    <div>
                        <el-form-item label="VFID">
                            <el-input placeholder="••••••" :readonly="true" v-model="form.vfId"></el-input>
                            <el-button type="text" icon="el-icon-question" @click="tipsType = 9">如何使用？</el-button>
                        </el-form-item>
                        <el-form-item label="VFSECRET">
                            <el-input placeholder="••••••" :readonly="true" v-model="form.vfSecret"></el-input>
                        </el-form-item>
                        <div class="setting-module">
                            <div class="form-message">
                                <h5 class="intro">
                                    您已完成设置，将访问URL嵌入到您的APP中，即可访问报告页面。URL示例如下：(可参考
                                    <router-link to="/doc/3-1" tag="a" target="_blank">APP对接说明</router-link>)
                                </h5>
                                <p>http://app-{{ yvming(sn) }}.visbody.com/appAuth/menuCallBack?token=TOKEN&mobile=MOBILE&third_uid=THIRDUID</p>
                                <h5>参数讲解：</h5>
                                <p class="intro">
                                    1、token：维塑接口凭证，使用vfId及vfSecret获取，请参考
                                    <router-link to="/doc/3-2" tag="a" target="_blank">获取维塑接口凭证</router-link>。
                                </p>
                                <p>2、mobile：扫描用户的手机号。</p>
                                <!-- <p v-if="skipSetShow">3、show_menu：是否显示侧边栏，若您需要显示侧边栏，请点击「修改信息」按钮配置相关接口。</p> -->
                                <p>3、third_uid：用户唯一标识。</p>
                            </div>
                        </div>
                        <el-form-item label class="form-btns">
                            <el-button type="primary" round @click="removeDeviceTypeInfo">解除绑定</el-button>
                            <!-- <el-button type="primary" round @click="handleModify">修改信息</el-button> -->
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>

        <!-- 侧边栏注意事项提醒 -->
        <div class="side-tips">
            <side-tips :type="tipsType" @closeTips="tipsType = 0"></side-tips>
        </div>
    </div>
</template>

<script>
import SideTips from '@/components/access/SideTips'

import { findDeviceTypeInfo, removeDeviceTypeInfo, appSetting } from '@/assets/js/apolloGql.js'

export default {
    components: {
        SideTips
    },
    data() {
        return {
            skipSetShow: JSON.parse(sessionStorage.getItem('show_menu_text')),
            tipsType: 0,
            page: 0,
            form: {
                tokenUrl: '',
                userinfoUrl: '',
                vfId: '',
                vfSecret: ''
            },
            sn: window.localStorage.getItem('deviceId').slice(0, 2),
            rules: {
                tokenUrl: [
                    {
                        required: true,
                        message: '请填写接口凭证地址',
                        trigger: 'blur'
                    },
                    {
                        message: '获取接口凭证地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+\?key\=[0-9a-zA-Z]{1,32}\&secret\=[0-9a-zA-Z]{1,32}/
                    }
                ],
                userinfoUrl: [
                    {
                        required: true,
                        message: '请填写用户信息地址',
                        trigger: 'blur'
                    },
                    {
                        message: '用户信息地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+/
                    }
                ]
            },
            deviceTypeInfo: {}
        }
    },
    created() {
        this.findDeviceTypeInfo()
    },
    methods: {
        // 需要展示侧边栏
        needSet() {
            this.page = 2
            sessionStorage.setItem('show_menu_text', false)
            this.skipSetShow = false
        },
        yvming(sn) {
            switch (sn) {
                case 'M7':
                case 'N7':
                    return 'apro7'
                case 'M6':
                case 'M2':
                case 'N2':
                    return 'apro5'
                case 'M5':
                    return 'apro3'
                case '32':
                case '34':
                    return 'rpro3'
                case '36':
                case '50':
                case '52':
                case '54':
                    return 'rpro5'
                case '38':
                case '39':
                    return 'e335'
                default:
                    return 'rpro3'
            }
        },
        // 跳过设置侧边栏
        skipSet() {
            this.page = 3
            sessionStorage.setItem('show_menu_text', true)
            this.skipSetShow = true
            this.appSetting()
        },
        // 返回
        goBack() {
            this.$router.go(-1)
        },
        // 确认
        handleSubmit() {
            this.closeDialog()
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 修改了获取接口凭证
                    if (this.form.tokenUrl !== this.deviceTypeInfo.tokenUrl && this.deviceTypeInfo.dockingApi === 1) {
                        this.$confirm('已对接API，确认同步修改获取接口凭证地址？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                            .then(() => {
                                this.appSetting()
                            })
                            .catch(() => {})
                    } else {
                        this.appSetting()
                    }
                }
            })
        },
        appSetting() {
            this.$apollo
                .mutate({
                    mutation: appSetting,
                    variables: {
                        tokenUrl: this.form.tokenUrl,
                        userinfoUrl: this.form.userinfoUrl
                    }
                })
                .then(res => {
                    const data = res.data.appSetting
                    if (data.code === 200) {
                        this.$message(data.message)
                        this.getVFInfo()
                        this.page = 3
                    } else {
                        this.$message(data.message)
                    }
                })
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
                    // 点击修改按钮后 noModifyStatus = true 跳转到第一页
                    if (result.code === 200) {
                        const data = result.data
                        if (data.dockingUrl === 1) {
                            this.page = 3
                            this.getVFInfo()
                        } else {
                            this.page = 1
                        }
                        if (data.tokenUrl === '') {
                            this.form.tokenUrl = ''
                        } else {
                            this.form.tokenUrl =
                                data.tokenUrl + '?key=' + data.accessKey + '&secret=' + data.accessSecret
                        }
                        this.form.userinfoUrl = data.userinfoUrl
                        this.form.appSecret = data.appSecret
                        this.deviceTypeInfo = JSON.parse(JSON.stringify(result.data))
                        this.deviceTypeInfo.tokenUrl = this.form.tokenUrl
                    } else {
                        // 未配置
                        this.page = 1
                        this.form.appSecret = ''
                    }
                })
        },
        // 解除绑定
        removeDeviceTypeInfo() {
            this.closeDialog()
            this.$apollo
                .mutate({
                    mutation: removeDeviceTypeInfo,
                    variables: {
                        dockingType: 3
                    }
                })
                .then(res => {
                    const data = res.data.removeDeviceTypeInfo
                    if (data.code === 200) {
                        this.$message(data.message)
                        this.page = 1
                    } else {
                        this.$message('解除失败')
                    }
                })
        },
        // 修改信息
        handleModify() {
            this.closeDialog()
            this.page = 1
            this.findDeviceTypeInfo()
        },
        getVFInfo() {
            this.form.vfId = this.$store.state.userInfo.vfId
            this.form.vfSecret = this.$store.state.userInfo.vfSecret
        },
        closeDialog() {
            this.tipsType = 0
        }
    }
}
</script>

<style lang="less" scoped>
.page-access {
    width: 100%;
    overflow: scroll;
    text-align: left;
    .header {
        padding: 45px 30px;
        > p {
            font-size: 24px;
            height: 40px;
            line-height: 40px;
            .el-button {
                width: 112px;
                height: 40px;
                padding: 0;
                margin-left: 30px;
                span {
                    padding-left: 6px;
                }
            }
        }
    }

    // 每页内容
    .content-wrapper {
        width: 800px;
        margin: 0 auto;
        padding-top: 20px;
        .access-title {
            font-size: 24px;
            font-weight: 500;
            p {
                text-align: center;
            }
            .gray-color {
                color: #9b9b9b;
                font-size: 16px;
                line-height: 22px;
                margin-top: 10px;
            }
        }
        .item-picture {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 50px 0;
            text-align: center;
            div {
                width: 50%;
                img {
                    width: 50%;
                    height: auto;
                }
            }
        }
        /deep/ .app-form {
            .el-form-item {
                margin-bottom: 36px;
                .el-input {
                    width: 400px;
                    .el-input__inner {
                        height: 32px;
                    }
                }
                .el-form-item__label {
                    padding-right: 40px;
                    font-size: 16px;
                    color: #000;
                }
                .el-button.is-round {
                    width: 120px;
                }
            }

            .append-tip {
                font-size: 12px;
                color: #9b9b9b;
                letter-spacing: -0.6px;
                line-height: 1.8;
            }
            .color-red {
                color: #fe5461 !important;
            }
            // 文字按钮
            .el-button--text {
                font-size: 12px;
                color: #009fe8;
                letter-spacing: -0.6px;
            }

            .setting-module {
                margin-left: 160px;
            }

            .form-message {
                h5 {
                    font-size: 16px;
                    font-weight: normal;
                    margin-bottom: 15px;
                }
            }
        }

        .form-btns {
            margin-top: 80px;
            width: 100%;
            .el-button {
                width: 120px;
            }
        }
        .center {
            text-align: center;
        }
    }
    // 侧边栏提醒弹窗
    .side-tips {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transition: 0.3s ease-out;
        z-index: 1000;
    }
}
@media screen and (min-width: 1024px) and (max-width: 1366px) {
    .page-access {
        .content-wrapper {
            padding-top: 20px;
            /deep/ .api-form {
                .el-form-item {
                    margin-bottom: 20px;
                }
            }

            .form-btns {
                margin-top: 60px;
            }
        }
    }
}
</style>
