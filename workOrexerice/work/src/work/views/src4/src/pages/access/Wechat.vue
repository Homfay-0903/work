<template>
    <div class="page-access scrollbar">
        <div class="header">
            <p>
                公众号接入设置
                <el-button round class="el-icon-back" @click="goBack">返回</el-button>
            </p>
        </div>
        <!-- 第一页 - 未对接的步骤页-->
        <div class="content-wrapper" v-if="page === 1">
            <el-steps :active="active" finish-status="success" class="step-wrapper">
                <el-step></el-step>
                <el-step></el-step>
                <el-step></el-step>
            </el-steps>
            <div style="padding-top: 40px;">
                <!-- step1 -->
                <div v-show="active === 0">
                    <el-form
                        :model="form"
                        :rules="rules"
                        ref="step0"
                        label-width="160px"
                        label-position="right"
                        class="wechat-form"
                        :hide-required-asterisk="true"
                    >
                        <el-form-item label="公众号名称" prop="publicName">
                            <el-input placeholder="设备对接的公众号名称" v-model="form.publicName"></el-input>
                            <el-button type="text" @click="tipsType = 1">如何获取公众号名称和二维码？</el-button>
                            <p class="append-tip">*必须为通过微信平台认证的服务号</p>
                        </el-form-item>

                        <el-form-item label="公众号二维码" prop="publicQrcode">
                            <el-upload
                                class="qrcode-uploader"
                                action
                                accept="jpg"
                                :show-file-list="false"
                                :http-request="handleQrcodeFileUpload"
                            >
                                <!-- 有文件显示文件 -->
                                <img v-if="form.publicQrcode" :src="form.publicQrcode" class="qrcode-file" />
                                <!-- 没有文件显示上传框 -->
                                <div v-else>
                                    <i class="el-icon-plus"></i>
                                    <span>上传二维码{{form.publicQrcode}}</span>
                                </div>
                                <i class="el-icon-question" @click.stop v-popover:question></i>
                            </el-upload>
                            <p :class="['append-tip', {'color-red': !upValid.qrcode}]">*公众号二维码图片大小不能超过2MB</p>
                        </el-form-item>

                        <el-form-item class="next-step">
                            <el-button type="primary" round @click="nextStep(1)">下一步</el-button>
                        </el-form-item>

                        <!-- begin 提醒 -->
                        <el-popover
                            ref="question"
                            placement="right"
                            title
                            width="200"
                            trigger="hover"
                            content="公众号对接成功后二维码显示于打印报告底部"
                        ></el-popover>
                        <!-- end 提醒 -->
                    </el-form>
                </div>
                <!-- step2 -->
                <div v-show="active === 1">
                    <el-form
                        :model="form"
                        :rules="rules"
                        ref="step1"
                        label-width="160px"
                        label-position="right"
                        class="wechat-form"
                        :hide-required-asterisk="true"
                    >
                        <el-form-item label="App ID" prop="appId">
                            <el-input placeholder="设备对接的公众号 APP ID" v-model="form.appId"></el-input>
                            <el-button type="text" @click="tipsType = 2">如何获取 AppID 和 App Secret ？</el-button>
                        </el-form-item>

                        <el-form-item label="App Secret" prop="appSecret">
                            <el-input placeholder="设备对接的公众号 APP Secret" v-model="form.appSecret"></el-input>
                        </el-form-item>

                        <el-form-item label="网页域名文件" prop="domainFile">
                            <el-upload
                                class="mp-uploader"
                                action
                                :show-file-list="false"
                                :http-request="handleMpFileUpload"
                            >
                                <!-- 有文件显示文件 -->
                                <span v-if="form.domainFile" class="mp-file">{{form.domainFile}}</span>
                                <!-- 没有文件显示上传框 -->
                                <div v-else>
                                    <i class="el-icon-plus"></i>
                                    <span>上传文件.txt</span>
                                </div>
                            </el-upload>
                            <el-button type="text" @click="tipsType = 3">如何找到授权域名文件？</el-button>
                            <p :class="['append-tip', {'color-red': !upValid.mp}]">*只能上传 txt 文件</p>
                        </el-form-item>

                        <el-form-item label class="form-btn-action" style="margin-top: 275px">
                            <el-button type="default" round @click="preStep()">上一步</el-button>
                            <el-button type="primary" round @click="nextStep(2)">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- step3 -->
                <div v-show="active === 2">
                    <el-form
                        :model="form"
                        :rules="rules"
                        ref="step2"
                        label-position="right"
                        class="wechat-form"
                        :hide-required-asterisk="true"
                    >
                        <el-form-item label="公众号菜单栏跳转网址" label-width="200px" prop="address" class="form-item-textarea">
                            <el-input
                                placeholder
                                v-model="form.address"
                                type="textarea"
                                :rows="7"
                                :autosize="true"
                                :readonly="true"
                            ></el-input>
                            <el-button type="text" @click="copyTxt('公众号菜单地址', form.address)">复制地址</el-button>
                        </el-form-item>

                        <div class="setting-module">
                            <div class="form-message">
                                <h5>您已完成设置，请复制上方对话框中的跳转地址，返回公众号设置，并完成以下操作。</h5>
                                <p>
                                    1、添加新菜单及菜单跳转网址。
                                    <el-button type="text" @click="tipsType = 4">如何添加新菜单？</el-button>
                                </p>
                                <p>
                                    2、将 116.196.117.62 添加到 IP 白名单。
                                    <el-button type="text" @click="tipsType = 5">如何添加 IP 白名单？</el-button>
                                </p>
                            </div>
                        </div>

                        <el-form-item label class="form-btn-action" style="margin-top: 120px">
                            <el-button type="primary" round @click="nextStep(3)">完成</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 第二页 - 对接完成后的信息展示页 -->
        <div v-if="page === 2" class="content-wrapper">
            <div style="padding-top: 40px;">
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="form"
                    label-width="160px"
                    label-position="right"
                    class="wechat-form"
                    :hide-required-asterisk="true"
                >
                    <!-- step1 -->
                    <div>
                        <el-form-item label="公众号名称" prop="publicName">
                            <span>{{form.publicName}}</span>
                        </el-form-item>

                        <el-form-item label="公众号二维码" prop="publicQrcode">
                            <div class="qrcode-uploader">
                                <div class="el-upload">
                                    <img :src="form.publicQrcode" class="qrcode" />
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item label="公众号菜单栏跳转网址" prop="address" class="form-item-textarea">
                            <el-input
                                placeholder
                                v-model="form.address"
                                type="textarea"
                                :rows="7"
                                :autosize="true"
                                :readonly="true"
                            ></el-input>
                            <el-button type="text" @click="copyTxt('公众号菜单地址', form.address)">复制地址</el-button>
                        </el-form-item>
                        <el-form-item>
                            <div class="setting-module">
                                <div class="form-message">
                                    <h5>您已完成设置，请复制上方对话框中的跳转地址，返回公众号设置，并完成以下操作。</h5>
                                    <p>
                                        1、添加新菜单及菜单跳转网址。
                                        <el-button type="text" @click="tipsType = 4">如何添加新菜单？</el-button>
                                    </p>
                                    <p>
                                        2、将 116.196.117.62 添加到 IP 白名单。
                                        <el-button type="text" @click="tipsType = 5">如何添加 IP 白名单？</el-button>
                                    </p>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label class="form-btn-action" style="margin-top: 45px">
                            <el-button type="primary" round @click="removeDeviceTypeInfo">解除绑定</el-button>
                            <el-button v-if="form.appType !== 2" type="primary" round @click="handleModify">修改信息</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>

        <!-- 侧边栏注意事项提醒 -->
        <div class="side-tips">
            <side-tips :type="tipsType" @closeTips="tipsType = 0"></side-tips>
        </div>

        <!-- 返回弹窗提示 -->
        <el-dialog
            title
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            class="return-back-dialog"
            top="15%"
            center
            width="570px"
        >
            取消本次公众号对接/修改设置?
            <span slot="footer" class="dialog-footer">
                <el-button round @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" round @click="ensureReturn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import SideTips from '@/components/access/SideTips'

import {
    findDeviceTypeInfo,
    removeDeviceTypeInfo,
    generateMemberAuthEntrance,
    editGenerateMemberAuthEntrance,
    getApiSnNum
} from '@/assets/js/apolloGql.js'

import { fileUpLoad } from '@/assets/js/uploadFile.js'
import { wechatProxy } from '@/assets/js/config.js'

export default {
    components: {
        SideTips
    },
    data() {
        return {
            active: 0,
            page: 1,
            step: 1,
            dialogVisible: false,
            form: {
                publicName: '',
                publicQrcode: '',
                domainFile: '',
                appId: '',
                appSecret: '',
                appType: 0,
                address: ''
            },
            rules: {
                publicName: [
                    {
                        required: true,
                        message: '请填写公众号名称',
                        trigger: 'blur'
                    }
                ],
                publicQrcode: [
                    {
                        required: true,
                        message: '请上传公众号二维码',
                        trigger: 'blur'
                    }
                ],
                appId: [
                    {
                        required: true,
                        message: '请填写公众号App ID',
                        trigger: 'blur'
                    }
                ],
                appSecret: [
                    {
                        required: true,
                        message: '请填写公众号App Secret',
                        trigger: 'blur'
                    }
                ],
                domainFile: [
                    {
                        required: true,
                        message: '请上传网页域名文件',
                        trigger: 'blur'
                    }
                ]
            },
            // 上传的文件校验
            upValid: {
                qrcode: true,
                mp: true
            },

            noModifyStatus: false,
            fileShowName: '',
            // 公众号接入类型
            typeId: 0,
            // 侧边栏弹窗提醒类型
            tipsType: 0,
            apiSnNum: 0
        }
    },
    created() {
        this.findDeviceTypeInfo()
    },
    methods: {
        // 返回
        goBack() {
            if ((this.active === 0 && !this.noModifyStatus) || this.page === 2) {
                this.$router.go(-1)
            } else {
                this.dialogVisible = true
            }
        },
        ensureReturn() {
            this.$router.go(-1)
        },
        // 上一步
        preStep() {
            this.$refs['step0'].clearValidate()
            this.active = 0
        },
        // 下一步
        nextStep(step) {
            this.closeDialog()
            if (step === 3) {
                this.noModifyStatus = false
                this.page = 2
                this.findDeviceTypeInfo()
            }
            let result = false
            this.$refs[`step${this.active}`].validate(valid => {
                if (valid) {
                    result = true
                }
            })
            if (result) {
                if (step === 1) {
                    this.active = 1
                }
                // this.active = this.active > 2 ? 0 : this.active += 1;
                if (step === 2) {
                    // 请求信息配置接入方法
                    if (this.noModifyStatus || this.typeId !== 0) {
                        this.editGenerateMemberAuthEntrance()
                    } else {
                        this.generateMemberAuthEntrance()
                    }
                }
            }
        },
        // 复制输入框
        copyTxt(title, txt) {
            const that = this
            this.$copyText(txt).then(
                function(e) {
                    that.$message({
                        message: title + '复制成功'
                    })
                },
                function(e) {
                    that.$message.error('浏览器不支持自动复制功能，请手动复制')
                }
            )
        },

        // 二维码图片上传
        handleQrcodeFileUpload(pro) {
            if (pro.file.name.substr(-4).toLocaleLowerCase() !== '.jpg') {
                this.upValid.qrcode = false
                this.$message('请上传jpg格式的二维码')
                return false
            }
            if (pro.file.size / 1024 / 1024 > 2) {
                this.qrcodeColor = true
                this.$message('公众号二维码图片不能超过2MB')
                return false
            } else {
                fileUpLoad(pro.file, 2, this.upLoadQrcodeCBack)
                this.upValid.qrcode = true
            }
        },
        // 二维码上传回调
        upLoadQrcodeCBack(pro) {
            this.form.publicQrcode = pro
        },

        // MP校验文件上传
        handleMpFileUpload(pro) {
            const file = pro.file
            // 判断上传文件是不是txt格式,判断后缀是不是.txt
            if (file.name.substr(-4).toLocaleLowerCase() !== '.txt') {
                this.upValid.mp = false
            } else {
                fileUpLoad(file, 1, this.upLoadMpCBack)
                this.upValid.mp = true
            }
        },
        // MP校验文件上传回调
        upLoadMpCBack(pro) {
            this.fileShowName = pro
            this.form.domainFile = pro.substring(pro.indexOf('www/') + 4)
        },

        // 查询当前配置好的公众号
        findDeviceTypeInfo() {
            this.$apollo
                .query({
                    query: findDeviceTypeInfo,
                    variables: {
                        redirectUri: `http://visfit.suanier.com/wechatAuth/menuCallBack?vfstate=${wechatProxy}`
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.findDeviceTypeInfo
                    if (result.code === 200) {
                        /**
                         *
                         * 已经配置直接跳转到第二页(配置成功)
                         * 点击修改按钮后 noModifyStatus = true 跳转到第一页
                         */
                        const data = result.data
                        this.typeId = data.id
                        this.getApiSnNum(this.typeId)
                        this.form.appId = data.appId
                        this.form.appSecret = data.appSecret
                        this.form.appType = data.appType
                        this.form.publicName = data.appName
                        this.fileShowName = data.mpUrl
                        if (data.mpUrl) {
                            this.form.domainFile = data.mpUrl.substring(data.mpUrl.indexOf('www/') + 4)
                        }
                        this.form.publicQrcode = data.qrcode
                        this.form.address = data.jumpLink
                        // 是否设置公众号
                        if (this.form.appId !== '') {
                            // 是否重新编辑
                            this.page = this.noModifyStatus ? 1 : 2
                        } else {
                            this.page = 1
                        }
                    } else {
                        // 未配置
                        this.page = 1
                        this.active = 0
                        this.form.appId = ''
                        this.form.appSecret = ''
                        this.form.appType = 0
                        this.form.publicName = ''
                        this.fileShowName = ''
                        this.form.domainFile = ''
                        this.form.publicQrcode = ''
                        this.form.address = ''
                    }
                })
        },
        getApiSnNum(typeId) {
            this.$apollo
                .query({
                    query: getApiSnNum,
                    variables: {
                        typeId: typeId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.getApiSnNum
                    if (result.code === 200) {
                        const data = result.data
                        this.apiSnNum = data.snNumber
                        console.log(this.apiSnNum, 'this.apiSnNum')
                    }
                })
        },
        // 解除绑定
        removeDeviceTypeInfo() {
            if (this.apiSnNum > 1) {
                this.$message('不支持在平台操作，联系售后')
                return
            }
            this.closeDialog()
            this.noModifyStatus = false
            this.$apollo
                .mutate({
                    mutation: removeDeviceTypeInfo,
                    variables: {
                        dockingType: 1
                    }
                })
                .then(res => {
                    const data = res.data.removeDeviceTypeInfo
                    if (data.code === 200) {
                        this.$message(data.message)
                        setTimeout(() => {
                            this.findDeviceTypeInfo()
                            this.active = 0
                        }, 3000)
                    } else {
                        this.$message('解除失败')
                    }
                })
        },
        // 信息配置接入
        generateMemberAuthEntrance() {
            const params = {
                appId: this.form.appId,
                appSecret: this.form.appSecret,
                appName: this.form.publicName,
                mpUrl: this.fileShowName, // 文件
                qrcode: this.form.publicQrcode // 二维码
            }
            this.$apollo
                .mutate({
                    mutation: generateMemberAuthEntrance,
                    variables: {
                        redirectUri: `http://visfit.suanier.com/wechatAuth/menuCallBack?vfstate=${wechatProxy}`,
                        type: 1,
                        deviceTypeInfo: params
                    }
                })
                .then(res => {
                    const data = res.data.generateMemberAuthEntrance
                    if (data.code === 200) {
                        this.form.address = data.data
                        // 接入成功跳转到第二步完成页面
                        this.active = 2
                        this.$message(data.message)
                    } else {
                        this.$message(data.message)
                    }
                })
        },
        editGenerateMemberAuthEntrance() {
            const params = {
                appId: this.form.appId,
                appSecret: this.form.appSecret,
                appName: this.form.publicName,
                mpUrl: this.fileShowName, // 文件
                qrcode: this.form.publicQrcode // 二维码
            }
            this.$apollo
                .mutate({
                    mutation: editGenerateMemberAuthEntrance,
                    variables: {
                        redirectUri: `http://visfit.suanier.com/wechatAuth/menuCallBack?vfstate=${wechatProxy}`,
                        type: 1,
                        deviceTypeInfo: params
                    }
                })
                .then(res => {
                    const data = res.data.editGenerateMemberAuthEntrance
                    if (data.code === 200) {
                        this.form.address = data.data
                        this.active = 2
                        // 接入成功跳转到第二步完成页面
                        this.$message(data.message)
                    } else {
                        this.$message(data.message)
                    }
                })
        },
        // 修改信息
        handleModify() {
            this.active = 0
            this.noModifyStatus = true
            this.closeDialog()
            this.findDeviceTypeInfo()
        },
        // 关闭侧边栏
        closeDialog() {
            this.tipsType = 0
        }
    }
}
</script>

<style lang="less" scoped>
.page-access {
    width: 100%;
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
        // step
        /deep/ .step-wrapper {
            width: 260px;
            margin: 30px auto;
            .el-step__icon {
                width: 16px;
                height: 16px;
                border: 1px solid #d5d5d5;
            }
            .el-step.is-horizontal .el-step__line {
                height: 1px;
                top: 9px;
            }
            .el-step__head.is-success {
                .el-step__line-inner {
                    display: none;
                }
                .el-step__line {
                    background: #009fe8;
                }
                .el-step__icon-inner {
                    display: block;
                    color: #fff;
                    font-size: 10px;
                }
                .el-step__icon {
                    background: #009fe8;
                    border: 1px solid #009fe8;
                }
            }
            .el-step__head.is-wait {
                .el-step__icon-inner {
                    display: none;
                }
            }
            .el-step__head.is-process {
                .el-step__icon-inner {
                    display: none;
                }
                .el-step__icon {
                    position: relative;
                    &:after {
                        position: absolute;
                        display: block;
                        content: '';
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: #009fe8;
                    }
                }
            }
        }

        /deep/ .wechat-form {
            .el-form-item {
                margin-bottom: 30px;
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
            // 二维码上传框
            .qrcode-uploader {
                height: 94px;
                .el-upload {
                    position: relative;
                    width: 94px;
                    height: 94px;
                    text-align: center;
                    border-radius: 4px;
                    border: dashed 1px #d9d9d9;
                    img {
                        width: 98%;
                        height: 98%;
                        margin-top: 1px;
                    }
                    > div {
                        padding-top: 24px;
                        color: #4a4a4a;
                        font-size: 12px;
                        i {
                            display: block;
                            font-size: 24px;
                            color: #cdced2;
                        }
                    }
                    .el-icon-question {
                        position: absolute;
                        right: -30px;
                        top: 40px;
                    }
                }
            }
            // MP文件上传框
            .mp-uploader {
                position: relative;
                width: 116px;
                display: inline-block;
                .el-upload {
                    width: 116px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    border: 1px dashed #d9d9d9;
                    font-size: 12px;
                    overflow: hidden;
                    vertical-align: middle;
                    color: #4a4a4a;
                    > div {
                        i {
                            color: #cdced2;
                        }
                    }
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
            .next-step {
                margin-top: 150px;
            }

            .form-message {
                h5 {
                    font-size: 16px;
                    font-weight: normal;
                    margin-bottom: 15px;
                }
            }
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
    // 返回提醒弹窗
    /deep/.return-back-dialog {
        .el-dialog__body {
            padding: 60px;
            font-size: 16px;
            color: #000;
            text-align: center;
        }
        .el-dialog__footer {
            padding: 30px 20px;
            .el-button {
                width: 146px;
                height: 40px;
                padding: 0;
                border-radius: 100px;
                font-size: 16px;
            }
            .el-button + .el-button {
                margin-left: 36px;
            }
            .el-button--primary {
                background-color: #009fe8;
                border-color: #009fe8;
            }
        }
    }
}
@media screen and (min-width: 1024px) and (max-width: 1366px) {
    .page-access {
        /deep/ .header {
            padding: 20px;
            > p {
                font-size: 18px;
                .el-button {
                    width: 100px;
                    height: 36px;
                    font-size: 14px;
                }
            }
        }
        .content-wrapper {
            .wechat-form {
                .el-form-item {
                    margin-bottom: 20px;
                }
                .next-step {
                    margin-top: 80px;
                }
            }
        }
    }
}
</style>