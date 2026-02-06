<template>
    <div class="page-account">
        <!-- 用户头像 -->
        <p class="account-avatar">
            <span class="avatar">
                <img src="@/assets/images/home/default-avatar.svg" />
            </span>
        </p>
        <!-- 用户信息 -->
        <el-form class="account-form" :model="userAccount" :rules="rules" ref="accountForm" label-width="200px">
            <!-- 门店名称 -->
            <el-form-item label="门店名称" prop="gymName">
                <el-input placeholder="请输入门店名称" v-model="userAccount.gymName"
                    @keyup.enter.native="updAccount"></el-input>
                <i class="el-icon-question" v-popover:question></i>
            </el-form-item>

            <!-- 联系人姓名 -->
            <el-form-item label="联系人姓名" prop="managerName">
                <el-input placeholder="请输入联系人姓名" v-model="userAccount.managerName"
                    @keyup.enter.native="updAccount"></el-input>
            </el-form-item>

            <!-- 联系方式 -->
            <el-form-item label="联系方式" prop="managerPhone">
                <el-input placeholder="请输入联系方式" v-model="userAccount.managerPhone"
                    @keyup.enter.native="updAccount"></el-input>
            </el-form-item>

            <!-- 登录邮箱 -->
            <el-form-item label="登录邮箱" prop="email">
                <el-input v-model="userAccount.email" :disabled="true"></el-input>
            </el-form-item>

            <!-- 咨询电话 -->
            <el-form-item label="咨询电话" prop="gymPhone">
                <el-input placeholder="请输入咨询电话" v-model="userAccount.gymPhone"
                    @keyup.enter.native="updAccount"></el-input>
            </el-form-item>
            <!-- 门店地址 -->
            <el-badge class="dropdown-dot" :is-dot="isSelectCity">
                <div class="address">
                    <el-form-item label="门店地址" prop="speAddress" style="margin: 0px auto 4px;">
                        <div class="divwraps">
                            <v-distpicker class="divwrap" :placeholders="placeholders" @province="onChangeProvince"
                                @city="onChangeCity" @area="onChangeArea" :province="select.province"
                                :city="select.city" :area="select.area" @keyup.enter.native="updAccount"></v-distpicker>
                        </div>
                    </el-form-item>
                    <!-- 详细门店地址 -->
                    <el-form-item label="详细地址" prop="gymAddr">
                        <el-input placeholder="请输入详细地址信息" v-model="userAccount.gymAddr"
                            @keyup.enter.native="updAccount"></el-input>
                    </el-form-item>
                </div>
            </el-badge>
            <!-- LOGO配置 -->
            <el-form-item label="纸质报告 logo 配置" prop="gymLogo">
                <div class="upload-container">
                    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false" :on-change="beforeAvatarUpload" :http-request="handleQrcodeFileUpload"
                        :disabled="logoLoading" :auto-upload="false">
                        <img v-if="userAccount.logoUrl" :src="userAccount.logoUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <p class="describe">{{ logoLoading ? '上传中...' : '上传LOGO' }}</p>
                    </el-upload>
                    <i class="el-icon-close remove-logo" v-if="userAccount.logoUrl" @click="removeLogo"></i>
                    <div class="upload-info">
                        <p class="info">(上传成功后LOGO将展示在体测报告上；删除LOGO将取消展示）</p>
                        <p class="info">请上传 320*160 像素尺寸，文件大小不超过200kb的“.png”格式图片素材</p>
                    </div>
                </div>
                <p class="error-msg" v-show="logoMsg">{{ logoMsg }}</p>
            </el-form-item>
            <!-- 是否显示用户信息 -->
            <el-form-item label="报告列表用户ID" prop="reportListIdEncryption">
                <el-radio-group v-model="userAccount.reportListIdEncryption">
                    <el-radio :label="0">不加密</el-radio>
                    <el-radio :label="1">加密</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="纸质报告用户ID" prop="pdfIdEncryption">
                <el-radio-group v-model="userAccount.pdfIdEncryption">
                    <el-radio :label="0">不加密</el-radio>
                    <el-radio :label="1">加密</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="围度展示数量" prop="girthShowNumber" v-if="isVAPro7">
                <i class="wenhao" v-popover:question3></i>
                <el-radio-group v-model="userAccount.girthShowNumber">
                    <el-radio :label="0">9项</el-radio>
                    <el-radio :label="1">14项</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="是否展示体态评估" prop="pdfIdEncryption" v-if="userAccount.healthPackageEnable === 2">
                <div slot="label"
                    style="display: flex;flex-direction: row;justify-content: center; align-items: center;">
                    <div>是否展示体态评估</div>
                    <el-tooltip class="item" effect="dark" content="可配置设备展示/隐藏体态评估项目，隐藏后将无法测量体态评估，重启设备生效 "
                        placement="right">
                        <img style="width:15px;height:15px;margin-left: 7px;"
                            src="@/assets/images/login/help-circle.png" />
                    </el-tooltip>
                </div>
                <el-radio-group v-model="userAccount.postureProjectEnable">
                    <el-radio :label="1">展示</el-radio>
                    <el-radio :label="0">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 用户修改按钮 -->
            <el-form-item label-width="90px">
                <el-button type="primary" round :loading="loading" @click.prevent="updAccount">提交修改</el-button>
            </el-form-item>
        </el-form>
        <!-- begin 提醒 -->
        <el-popover ref="question" placement="right" title width="200" trigger="hover"
            content="门店名称、咨询电话、门店地址显示于打印报告底部"></el-popover>
        <el-popover ref="question3" placement="right" title width="240" trigger="hover"
            content="9项：左臂围、右臂围、胸围、高腰围 、臀围、左大腿围、右大腿围、左小腿围、右小腿围。14项：在9项基础上，增加颈围、中腰围、低腰围、左大腿最小围、右大腿最小围"></el-popover>
        <!-- end 提醒 -->
    </div>
</template>
<script type="text/ecmascript-6">
import { findUserInfo, updateUserInfo } from '@/assets/js/apolloGql.js'
import { Loading } from 'element-ui'
import { clone } from '@/assets/js/util.js'
import { fileUpLoad } from '@/assets/js/uploadFile.js'
import VDistpicker from 'v-distpicker'
import { isVAPro3, isVAPro7 } from '@/types/device.js'
export default {
    components: {
        VDistpicker
    },
    data() {
        // 校验门店名称
        const checkGymName = (rule, value, callback) => {
            // 中文、英文、数字
            const regName = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
            // 必填
            if (!value) {
                callback(new Error('请输入门店名称'))
            } else if (value.length <= 28) {
                if (regName.test(value)) {
                    callback()
                } else {
                    callback(new Error('请填写正确的门店名称'))
                }
            } else {
                callback(new Error('门店名称不能超过28个字符'))
            }
        }
        // 校验联系人姓名
        const checkManagerName = (rule, value, callback) => {
            // 中文、英文
            const regName = /^[A-Za-z\u4e00-\u9fa5]+$/
            // 非必填
            if (!value) {
                callback()
            } else if (value.length <= 12) {
                if (regName.test(value)) {
                    callback()
                } else {
                    callback(new Error('请填写正确的联系人姓名'))
                }
            } else {
                callback(new Error('联系人姓名不能超过12个字符'))
            }
        }
        // 校验地址
        const checkGymAddr = (rule, value, callback) => {
            // 非必填
            if (!value) {
                callback()
            } else {
                if (value.length <= 140) {
                    callback()
                } else {
                    callback(new Error('详细地址不能超过140个字符'))
                }
            }
        }
        // 校验联系方式
        const checkManagerPhone = (rule, value, callback) => {
            // 非必填
            if (!value) {
                callback()
            } else {
                // 先校验长度后校验格式
                if (value.length <= 16) {
                    // 允许包括 + - 数字 除纯字符
                    const isAllow = /^[\+\-\d]{1,16}$/.test(value)
                    const hasDigit = /.*[0-9]+.*/.test(value)
                    if (hasDigit && isAllow) {
                        callback()
                    } else {
                        callback(new Error('请填写正确的联系方式'))
                    }
                } else {
                    callback(new Error('联系方式不能超过16个字符'))
                }
            }
        }
        // 校验咨询电话
        const checkGymPhone = (rule, value, callback) => {
            // 非必填
            if (!value) {
                callback()
            } else {
                if (value.length <= 16) {
                    // 允许包括 + - 数字 除纯字符
                    const isAllow = /^[\+\-\d]{1,16}$/.test(value)
                    const hasDigit = /.*[0-9]+.*/.test(value)
                    if (hasDigit && isAllow) {
                        callback()
                    } else {
                        callback(new Error('请填写正确的咨询电话'))
                    }
                } else {
                    callback(new Error('咨询电话不能超过16个字符'))
                }
            }
        }
        return {
            loading: false,
            tempUserAccount: {},
            userAccount: {
                gymName: '',
                managerName: '',
                managerPhone: '',
                email: '',
                gymPhone: '',
                gymAddr: '',
                logoUrl: '',
                speAddress: '',
                reportListIdEncryption: 0,
                pdfIdEncryption: 1,
                girthShowNumber: 0,
                healthPackageEnable: 1,
                postureProjectEnable: 1,
            },
            rules: {
                gymName: [{ validator: checkGymName, trigger: 'blur' }],
                managerName: [{ validator: checkManagerName, trigger: 'blur' }],
                managerPhone: [{ validator: checkManagerPhone, trigger: 'blur' }],
                gymPhone: [{ validator: checkGymPhone, trigger: 'blur' }],
                gymAddr: [{ validator: checkGymAddr, trigger: 'blur' }],
            },
            logoLoading: false,
            logoMsg: '',
            placeholders: {
                province: '省份',
                city: '城市',
                area: '区/县名',
            },
            select: { province: '', city: '', area: '' },
            isVAPro3: isVAPro3(),
            isVAPro7: isVAPro7()
        }
    },
    computed: {
        isSelectCity() {
            return this.select.province === '' || this.select.province === '省份' || this.select.city === '' || this.select.city === '城市' || this.select.area === '' || this.select.area === '区/县名'
        },
    },
    created() {
        this.findUserInfo()
    },
    methods: {
        isNotSelect(select) {
            console.log(select)
            return select.province === '' || select.province === '省份' || select.city === '' || select.city === '城市' || select.area === '' || select.area === '区/县名'
        },
        onChangeProvince(a) {
            this.select.province = a.value
            this.select.city = ''
            this.select.area = ''
        },
        onChangeCity(a) {
            this.select.city = a.value
            this.select.area = ''
        },
        onChangeArea(a) {
            this.select.area = a.value
        },
        hanldeAddress(data) {
            if (!data) return this.select
            const address = data.split('-')
            return { province: address[0], city: address[1], area: address[2] }
        },
        updAccount() {
            this.$refs['accountForm'].validate(valid => {
                if (this.isNotSelect(this.select)) {
                    this.$message.error('请填写完整的城市信息')
                    return
                }
                console.log(`当前选中结果${this.userAccountz}`)
                if (valid) {
                    this.loading = true
                    const userForm = {
                        managerName: this.userAccount.managerName,
                        managerPhone: this.userAccount.managerPhone,
                        gymPhone: this.userAccount.gymPhone,
                        gymAddr: this.userAccount.gymAddr,
                        gymName: this.userAccount.gymName,
                        logoUrl: this.userAccount.logoUrl,
                        speAddress: `${this.select.province}-${this.select.city}-${this.select.area}`,
                        reportListIdEncryption: this.userAccount.reportListIdEncryption,
                        pdfIdEncryption: this.userAccount.pdfIdEncryption,
                        girthShowNumber: this.userAccount.girthShowNumber,
                        postureProjectEnable: this.userAccount.postureProjectEnable
                    }
                    this.$apollo
                        .mutate({
                            mutation: updateUserInfo,
                            variables: userForm
                        })
                        .then(res => {
                            this.loading = false
                            if (res.data.updateUserInfo.code === 200) {

                                this.findUserInfo(true)
                                // window.setTimeout(() => {
                                //     window.history.go(0)
                                // }, 1000)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
        },
        // 获取用户信息接口
        async findUserInfo(isUpdate) {
            let loadingInstance = null
            loadingInstance = Loading.service({
                background: 'rgba(0, 0, 0, 0)'
            })
            await this.$apollo
                .query({
                    query: findUserInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findUserInfo.data
                    // 更新store
                    this.$store.dispatch('setUserInfo', data)
                    this.userAccount.gymName = data.gymName
                    this.userAccount.managerName = data.managerName
                    this.userAccount.managerPhone = data.managerPhone
                    this.userAccount.email = data.email
                    this.userAccount.gymPhone = data.gymPhone
                    this.userAccount.gymAddr = data.gymAddr
                    this.userAccount.logoUrl = data.logoUrl || ''
                    this.userAccount.reportListIdEncryption = data.reportListIdEncryption
                    this.userAccount.pdfIdEncryption = data.pdfIdEncryption
                    this.userAccount.girthShowNumber = data.girthShowNumber
                    this.userAccount.healthPackageEnable = data.healthPackageEnable
                    this.userAccount.postureProjectEnable = data.postureProjectEnable
                    this.select = this.hanldeAddress(data.speAddress)
                    this.tempUserAccount = clone(this.userAccount)
                    loadingInstance.close()
                    this.$emit('on-account-upd')
                    if (isUpdate) {
                        this.$message('修改成功')
                    }
                })
        },
        resetForm() {
            this.$refs['accountForm'].resetFields()
        },
        // 检查是否有修改项
        checkUpdState() {
            let updFlag = false

            for (let key in this.userAccount) {
                if (this.userAccount[key] !== this.tempUserAccount[key]) {
                    console.log(key)
                    updFlag = true
                }
            }
            return new Promise(resolve => {
                if (updFlag) {
                    this.$confirm('账号信息设置未保存，确认离开？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            resolve(true)
                        })
                        .catch(() => {
                            resolve(false)
                        })
                } else {
                    resolve(true)
                }
            })
        },

        // 上传图片检查
        beforeAvatarUpload(fileInfo) {
            const file = fileInfo.raw
            const isPNG = file.type === 'image/png'
            const isLt200k = file.size / 1024 < 200
            let isSize = false
            let resultNum = 0
            this.logoMsg = ''

            if (!file) {
                return false
            }

            let img = new Image()

            img.src = URL.createObjectURL(file)
            img.onload = () => {
                isSize = img.width === 320 && img.height === 160
                if (!isSize) {
                    // this.$message.error('图片尺寸不对，请重新上传')
                    this.logoMsg = '图片尺寸不对，请重新上传'
                } else if (!isPNG) {
                    // this.$message.error('图片非png格式，请重新上传')
                    this.logoMsg = '图片非png格式，请重新上传'
                } else if (!isLt200k) {
                    // this.$message.error('图片大小超过200kb，请重新上传')
                    this.logoMsg = '图片大小超过200kb，请重新上传'
                }
                if (!isPNG) {
                    resultNum++
                }
                if (!isLt200k) {
                    resultNum++
                }
                if (!isSize) {
                    resultNum++
                }
                if (resultNum > 1) {
                    this.logoMsg = '图片不合标准，请重新上传'
                }
                if (isPNG && isLt200k && isSize) {
                    this.handleQrcodeFileUpload(file)
                }
                return isPNG && isLt200k && isSize
            }
        },

        // 上传log回调
        handleQrcodeFileUpload(file) {
            this.logoLoading = true
            fileUpLoad(
                file,
                3,
                url => {
                    this.userAccount.logoUrl = url
                    this.$message('上传成功')
                    this.logoLoading = false
                },
                err => {
                    console.log(err)
                    this.$message.error('上传失败，请重试')
                    this.logoLoading = false
                }
            )
        },

        // 移除logo
        removeLogo(e) {
            this.userAccount.logoUrl = ''
            this.logoMsg = ''
        }
    },
    async beforeRouteLeave(to, from, next) {
        const token = window.localStorage.getItem('userTokens')
        if (token) {
            const state = await this.checkUpdState()
            if (state) {
                this.resetForm()
                this.findUserInfo()
                next()
            }
        } else {
            next()
        }
    }
}
</script>

<style scoped lang="less">
.page-account {
    position: relative;
    margin: auto;
    margin-top: 50px;

    // top: 50%;
    // left: 50%;
    // height: fit-content;
    // transform: translate(-50%, -50%);
    // 用户头像
    .account-avatar {
        margin-bottom: 40px;

        img {
            width: 80px;
        }
    }

    // 用户信息表单
    /deep/.account-form {
        position: relative;

        .el-form-item {
            position: relative;
            width: 640px;
            margin: 0 auto 26px;
            padding-right: 60px;

            .el-form-item__label {
                padding-right: 40px;
                font-size: 16px;
                color: #000;
            }

            .divwrap {
                display: flex;
            }

            .distpicker-address-wrapper {
                display: flex;

                select {
                    width: 100%;
                    font-size: 12px !important;
                    color: #7A7A7A;
                    appearance: none;
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    background: url('~@/assets/images/public/arrow.svg') no-repeat 103px;
                    background-size: 14px 14px;
                    background-color: #fff;
                    cursor: pointer;
                    padding-right: 25px;

                    &:focus {
                        border-color: #409eff;
                        outline: 0;
                    }
                }

                label {
                    width: calc(33.33% - 5px);
                    margin-right: 5px;

                    &:last-child {
                        width: 33.33%;
                        margin: 0;
                    }
                }

                option {
                    overflow: hidden;
                }
            }

            .el-button {
                margin-top: 20px;
                width: 160px;
            }

            .el-icon-question {
                position: absolute;
                top: 12px;
                right: -24px;
                font-size: 16px;
                cursor: pointer;
            }

            .upload-container {
                display: flex;
                text-align: left;
                justify-content: space-between;

                .remove-logo {
                    color: #898f99;
                    font-size: 25px;
                    font-weight: bold;
                    position: absolute;
                    top: 5px;
                    left: 130px;
                    z-index: 10;
                    cursor: pointer;
                    visibility: hidden;

                    &:hover {
                        visibility: visible;
                    }
                }

                .avatar-uploader {
                    display: flex;
                    height: 80px;

                    &:hover {
                        +.remove-logo {
                            visibility: visible;
                        }
                    }

                    .el-upload {
                        border: 1px dashed #d9d9d9;
                        border-radius: 6px;
                        cursor: pointer;
                        position: relative;
                        overflow: hidden;
                        background-color: rgba(251, 251, 251, 1);

                        .el-icon-plus {
                            &::before {
                                content: "\E62B" !important;
                            }
                        }
                    }

                    .el-upload:hover {
                        border-color: #409eff;
                    }
                }

                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #cdced2;
                    width: 160px;
                    height: 50px;
                    text-align: center;
                    padding-top: 15px;
                }

                .describe {
                    margin-top: -15px;
                    color: #4a4a4a;
                    font-size: 12px;
                }

                .avatar {
                    width: 160px;
                    height: 80px;
                    display: block;
                }

                .upload-info {
                    margin-left: 19px;

                    .info {
                        color: #7a7a7a;
                        font-size: 12px;
                        margin: 0;
                        line-height: 1.5;
                        margin-bottom: 12px;
                    }
                }
            }

            .error-msg {
                margin: 0;
                text-align: left;
                line-height: 1;
                color: #de350b;
                font-size: 12px;
            }

            .el-radio-group {

                width: 420px;
                display: inline-flex;
            }

            .el-radio {
                flex: 1;

                display: inline-flex;

                .el-radio__label {
                    color: #000 !important;
                }

                .el-radio__input {
                    position: relative;

                    &.is-checked {
                        .el-radio__inner {
                            background-color: #ffffff;
                            border: 1px solid #CDCED1;
                        }
                    }

                    .el-radio__inner {
                        &:hover {
                            border-color: #009FE8;
                        }

                        &::after {
                            width: 10px;
                            height: 10px;
                            background-color: #009FE8;
                        }
                    }
                }
            }
        }

        .dropdown-dot {
            .el-badge__content {
                transition: all 0s;
                left: 60px !important;
                top: 20px;
            }
        }
    }
}

.wenhao {
    background: url('../../assets/images/wenhao.svg') no-repeat center center;
    display: inline-block;
    background-size: contain;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    line-height: 1;
    position: absolute;
    top: 12px;
    left: -30px;
}

@media screen and (max-width: 1024px) {
    .page-account {
        /deep/.account-form {
            .el-form-item {
                margin: 0 auto 16px;

                .el-form-item__label {
                    padding-right: 20px;
                    font-size: 14px;
                    color: #000;
                }
            }
        }
    }
}
</style>
