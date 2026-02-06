<template>
    <div class="page-access scrollbar">
        <div class="header">
            <p>
                API 对接设置
                <el-button round class="el-icon-back" @click="goBack">返回</el-button>
            </p>
        </div>
        <!-- 第一页 -->
        <div class="content-wrapper">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="180px"
                label-position="right"
                class="api-form"
            >
                <el-form-item label="获取接口凭证地址" prop="tokenUrl">
                    <el-input placeholder="https://[域名]?key=KEY&secret=SECRET" v-model="form.tokenUrl"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 6">如何获取接口凭证地址？</el-button>
                </el-form-item>

                <el-form-item label="获取报告形式" prop="reportFetchMode">
                    <el-radio v-model="form.reportFetchMode" :label="1">自行查询获取</el-radio>
                    <el-radio v-model="form.reportFetchMode" :label="2">系统直接推送</el-radio>
                </el-form-item>

                <el-form-item label="合成通知地址" prop="notifyAddress" v-if="form.reportFetchMode === 1">
                    <el-input placeholder="https://[域名]" v-model="form.notifyAddress"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 8">如何获取合成通知地址？</el-button>
                    <p class="append-tip">自行查询获取，由维塑推送合成通知，需配置合成通知地址，接收通知后，发起获取报告数据的请求。</p>
                </el-form-item>

                <el-form-item label="系统推送地址" prop="reportPushUrl" v-if="form.reportFetchMode === 2">
                    <el-input placeholder="https://[域名]" v-model="form.reportPushUrl"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 14">如何获取系统推送地址？</el-button>
                    <p class="append-tip">系统直接推送，需配置对应的系统推送地址，由维塑将报告数据推送至对应地址，直接获取推送地址中的报告数据。</p>
                </el-form-item>
                <!-- 单机版本 -->
                <el-form-item label="请选择对接方式" v-if="isPrivate">
                    <el-radio v-model="form.mode" :label="0">刷卡</el-radio>
                    <el-radio v-model="form.mode" :label="1">字符编码</el-radio>
                </el-form-item>

                <el-form-item label="刷卡登录地址" prop="loginAddress" v-show="isShowLoginAddress">
                    <el-input placeholder="https://[域名]" v-model="form.loginAddress"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 7">如何获取刷卡登录地址？</el-button>
                    <p class="append-tip" v-if="!form.loginAddress">如果您需要对接RFID或手环，请填写此接口信息。</p>
                </el-form-item>

                <el-form-item label="字符编码请求地址" prop="character" v-if="isShowCharacter">
                    <el-input placeholder="https://[域名]" v-model="form.character"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 12">如何获取字符编码登录地址？</el-button>
                    <p class="append-tip" v-if="!form.character">如果您需要对接字符编码，请填写此接口信息。 </p>
                </el-form-item>


                <!-- 云端版本 -->
                <el-form-item label="二维码请求地址" prop="qrcodeUrl" v-if="!isPrivate">
                    <el-input placeholder="https://[域名]" v-model="form.qrcodeUrl"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 11">如何获取二维码请求地址？</el-button>
                    <p class="append-tip" v-if="!form.qrcodeUrl">如果您需要对接APP，请填写此接口信息。</p>
                </el-form-item>

                <!-- vr-pro5 -->
                <el-form-item v-if="deviceId.startsWith('36')" label="人脸数据对接" prop="faceUrl" >
                    <el-input placeholder="https://[域名]" v-model="form.faceUrl"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 13">如何获取人脸识别登录地址？</el-button>
                    <p class="append-tip" v-if="!form.qrcodeUrl">如果您需要对接人脸识别，请填写此接口信息。</p>
                </el-form-item>



                <el-form-item label="VFID">
                    <el-input :readonly="true" placeholder="••••••" v-model="form.vfId"></el-input>
                    <el-button type="text" icon="el-icon-question" @click="tipsType = 9">如何使用？</el-button>
                </el-form-item>

                <el-form-item label="VFSECRET">
                    <el-input :readonly="true" placeholder="••••••" v-model="form.vfSecret"></el-input>
                </el-form-item>

                <el-form-item label class="form-btns">
                    <el-button type="default" round @click="goBack">取消</el-button>
                    <el-button type="primary" round @click="handleSubmit">确认</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 侧边栏注意事项提醒 -->
        <div class="side-tips">
            <side-tips :type="tipsType" @closeTips="tipsType = 0"></side-tips>
        </div>
    </div>
</template>

<script>
import SideTips from '@/components/access/SideTips'
import { mapState } from 'vuex'
import { isPrivate } from '@/assets/js/config'
import { findDeviceTypeInfo, apiSetting } from '@/assets/js/apolloGql.js'

export default {
    components: {
        SideTips
    },
    data() {
        return {
            dialog: false,
            form: {
                tokenUrl: '',
                loginAddress: '',
                notifyAddress: '',
                vfId: '',
                vfSecret: '',
                mode: 0, // 0-刷卡， 1-字符编码，
                character: '', // 字符编码
                reportFetchMode: 1, // 报告获取方式: 1=第三方拉取 2=主动推送
                reportPushUrl: '', // 报告推送地址
            },
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
                loginAddress: [
                    {
                        message: '请填写刷卡登录地址',
                        trigger: 'blur'
                    },
                    {
                        message: '刷卡登录地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+/
                    }
                ],
                notifyAddress: [
                    {
                        required: true,
                        message: '请填写合成通知地址',
                        trigger: 'blur'
                    },
                    {
                        message: '合成通知地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+/
                    }
                ],
                reportPushUrl: [
                    {
                        required: true,
                        message: '请填写系统推送地址',
                        trigger: 'blur'
                    },
                    {
                        message: '系统推送地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+/
                    }
                ],
                qrcodeUrl: [
                    {
                        message: '请填写二维码请求地址',
                        trigger: 'blur'
                    },
                    {
                        message: '二维码请求地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+/
                    }
                ],
                faceUrl: [
                    {
                        message: '请填写人脸识别登录地址',
                        trigger: 'blur'
                    },
                    {
                        message: '人脸识别登录地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+/
                    }
                ],
                character: [
                    {
                        required: true,
                        message: '请填写字符编码请求地址',
                        trigger: 'blur'
                    },
                    {
                        message: '字符编码请求地址格式不正确',
                        trigger: 'blur',
                        pattern: /^(http|https)?:\/\/(([^\s]+\.[a-zA-Z]{2,6})|((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])))[^\s]+/
                    }
                ]
            },
            tipsType: 0,
            deviceTypeInfo: {},
            isPrivate: isPrivate,
            deviceId: ''
        }
    },
    computed: {
        ...mapState(['userInfo']),
        // 是否显示刷卡登录
        isShowLoginAddress() {
            return !(this.isPrivate && this.form.mode !== 0)
        },
        // 是否显示字符编码
        isShowCharacter() {
            return this.isPrivate && this.form.mode !== 0
        }
    },
    created() {
        this.findDeviceTypeInfo()
    },
    mounted() {
        const storeDeviceId = this.userInfo.deviceId
        console.log('DeviceId from store :', storeDeviceId)
        if (!storeDeviceId) {
            this.findUserInfo()
        } else {
            this.deviceId = storeDeviceId
        }
    },
    methods: {
        // 获取用户信息 通过关联设备id判断是否vrPro5[36*] 显示人脸数据对接表单
        async findUserInfo() {
            this.$apollo
                .query({
                    query: findUserInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.findUserInfo
                    if (result.code === 200) {
                        this.deviceId = result.data.deviceId
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 返回
        goBack() {
            this.$router.go(-1)
        },
        // 确认
        handleSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 修改了获取接口凭证
                    if (this.form.tokenUrl !== this.deviceTypeInfo.tokenUrl && this.deviceTypeInfo.dockingApp === 1) {
                        this.$confirm('已对接APP，确认同步修改获取接口凭证地址？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                            .then(() => {
                                // next();
                                this.apiSetting()
                            })
                            .catch(() => {})
                    } else {
                        this.apiSetting()
                    }
                }
            })
        },
        apiSetting() {
            this.$apollo
                .mutate({
                    mutation: apiSetting,
                    variables: {
                        tokenUrl: this.form.tokenUrl,
                        loginUrl: this.isShowLoginAddress ? this.form.loginAddress : '',
                        synbodyinfoUrl: this.form.notifyAddress,
                        qrcodeUrl: this.form.qrcodeUrl,
                        userinfoUrl: this.isShowCharacter ? this.form.character : '',
                        faceUrl: this.form.faceUrl,
                        reportFetchMode: this.form.reportFetchMode,
                        reportPushUrl: this.form.reportPushUrl
                    }
                })
                .then(res => {
                    const data = res.data.apiSetting
                    if (data.code === 200) {
                        this.$message(data.message)
                        this.getVFInfo()
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
                    if (result.code === 200) {
                        const data = result.data
                        if (data.tokenUrl === '') {
                            this.form.tokenUrl = ''
                        } else {
                            this.form.tokenUrl =
                                data.tokenUrl + '?key=' + data.accessKey + '&secret=' + data.accessSecret
                        }
                        this.form.loginAddress = data.loginUrl
                        this.form.notifyAddress = data.synBodyInfoUrl
                        this.form.qrcodeUrl = data.qrcodeUrl
                        this.form.character = data.userinfoUrl
                        this.form.faceUrl = data.faceUrl
                        this.form.reportFetchMode = data.reportFetchMode || 1
                        this.form.reportPushUrl = data.reportPushUrl
                        this.getVFInfo()
                        this.deviceTypeInfo = JSON.parse(JSON.stringify(result.data))
                        this.deviceTypeInfo.tokenUrl = this.form.tokenUrl
                        this.form.mode = data.dockingEncoding > 0 ? 1 : 0
                    } else if (result.code === 404) {
                        // 未配置
                        this.form.tokenUrl = ''
                        this.form.loginAddress = ''
                        this.form.notifyAddress = ''
                    } else {
                        this.$message(result.message)
                    }
                })
        },
        getVFInfo() {
            this.form.vfId = this.form.tokenUrl ? this.$store.state.userInfo.vfId : ''
            this.form.vfSecret = this.form.tokenUrl ? this.$store.state.userInfo.vfSecret : ''
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
        padding-top: 100px;

        /deep/ .api-form {
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

            .form-message {
                h5 {
                    font-size: 16px;
                    font-weight: normal;
                    margin-bottom: 15px;
                }
            }
        }

        .form-btns {
            margin-top: 120px;
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

