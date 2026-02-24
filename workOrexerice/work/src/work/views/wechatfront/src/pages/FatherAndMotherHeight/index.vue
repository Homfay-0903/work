<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-07-05 17:13:11
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-07 20:51:21
 * @FilePath: \vr-pro3-wechat-frontend\src\pages\register\Index.vue
 * @Description:
-->
<template>
    <div class="register-page">
        <div class="header" v-if="canLoading">
            <h2>父母身高</h2>
            <p class="tips" style="color: #ADB4C7"> 请准确填写父母身高</p>
        </div>
        <!-- 手机号绑定页面 -->
        <div class="content" v-if="canLoading" v-show="!isRegInfo">
            <!-- form -->
            <div :class="['form', isDeviceReport ? 'isDeviceReport' : '']">
                <div class="item">
                    <div class="info ttittle">
                        <span class="util-f">父亲身高</span>
                        <input :class="heiMsg ? 'error heightInput' : 'heightInput'" @blur="handleBlurReset($event)"
                            @focus="handleFouceReset($event)" name="mobile" placeholder="请输入父亲身高" type="number"
                            @keyup="changeHei(form.fatherHeight)" v-model.number="form.fatherHeight" />
                        <span class="util">cm</span>
                        <i @click="handleClearMobile" class="icon-del" v-if="form.phone"></i>
                    </div>
                </div>
                <div class="item">
                    <div class="info ttittle">
                        <span class="util-m">母亲身高</span>
                        <input :class="heiMsg ? 'error heightInput' : 'heightInput'" @blur="handleBlurReset($event)"
                            @focus="handleFouceReset($event)" name="mobile" placeholder="请输入母亲身高" type="number"
                            @keyup="changeHei(form.motherHeight)" v-model.number="form.motherHeight" />
                        <span class="util">cm</span>
                        <i @click="handleClearMobile" class="icon-del" v-if="form.phone"></i>
                    </div>
                </div>
                <span class="height-select-msg" v-show="heiMsg">{{ heiErrorMg }}</span>
                <div class="submit-btn">
                    <button :class="{ 'is-disabled': true, 'submiit': true }" @click.prevent="handleMobileSumbit"
                        @keyup.enter="handleMobileSumbit" type="submit">提交</button>
                </div>
            </div>
        </div>
        <!-- <p class="tips" v-if="!isRegInfo">真实的信息非常重要，请仔细填写</p> -->
        <!-- 弹框提醒 -->
        <div class="spring-frame" v-if="isdialog && canLoading">
            <div class="dialog">
                <img :src="dialogBox.url" alt />
                <h6 :class="dialogBox.default ? 'isH6' : 'h6'">{{ dialogBox.message }}</h6>
            </div>
        </div>
    </div>
</template>
<script>
import { updateMemberInfo, getMemberInfo, findScanTypeInfo, findLatestScanTypeInfo } from '@/assets/js/apolloGql.js'
import { isVAPro5 } from '@/types/device.js'

export default {
    data() {
        return {
            canLoading: false,
            to: '/report',
            form: {
                code: '',
                phone: '',
                sex: 1,
                birthday: '',
                height: '',
                motherHeight: '',
                fatherHeight: ''
            },
            height: {
                isValid: false,
                value: '',
            },
            birthday: {
                isValid: false,
                year: '',
                month: '',
                day: '',
            },
            // 验证码定时器
            timer: '',
            // 获取验证码时间间隔 60s
            countDown: 60,
            codeText: '获取验证码',
            // 是否勾选同意协议
            isSelectRule: false,
            // 验证码默认不能输入 验证码发送成功后才能输入
            isCodeInputDisabled: false,
            // 验证码是否正在发送状态
            isCodeSending: false,
            // 注册用户信息页面
            isRegInfo: false,
            // 身高是否处于输入
            inputHeight: false,
            // 生日是否处于输入
            inputBirthday: false,
            outTimeStamp: 0,
            // 错误信息
            errorMg: '-',
            // 提交按钮状态
            submitDisabled: false,
            // 按钮开关
            isBtnHand: true,
            scanType: null,
            loginInfo: JSON.parse(window.localStorage.getItem('loginInfo')),
            // 语音验证码状态
            veriStatus: false,
            // 点击次数
            VoiceSum: 0,
            // 弹框次数状态
            frameStatus: false,
            // 图片url
            dialogBox: {
                url: require('../../assets/images/svg/Voice.svg'),
                message: '没有收到短信? 试试语音验证码',
                default: false,
            },
            // 弹框状态
            isdialog: false,
            // 是否分享进入
            isShare: 0,
            isShowHeight: true,
            heiErrorMg: '',
            heiMsg: false,
            pollingTimer: null,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },

    computed: {
    },

    watch: {
        // 监听身高
        'height.value': {
            deep: true,
            handler: function (val, oldVal) {
                this.valideHeight()
            },
        },
        // 监听生日
        birthday: {
            deep: true,
            handler: function (val, oldVal) {
                const yearReg = /^[1-2](9|0)\d{2}$/
                const monReg = /^(0?[1-9]|1[0-2])$/
                const dayReg = /^((0?[1-9])|((1|2)[0-9])|30|31)$/
                // 校验年份有效性
                if (val.year.length === 4) {
                    this.errorMg = yearReg.test(val.year) ? '-' : '请填写正确的生日'
                }
                // 校验月份有效性
                if (val.month) {
                    this.errorMg = monReg.test(val.month) ? '-' : '请填写正确的生日'
                }
                // 校验天份有效性
                if (val.day) {
                    this.errorMg = dayReg.test(val.day) ? '-' : '请填写正确的生日'
                }
                // 等待生日填写完整后 开始校验年龄范围
                if (val.year && val.month && val.day) {
                    this.valideBirthday()
                }
            },
        },
    },

    beforeDestroy() {
        clearInterval(this.timer)
    },
    async created() {
        this.to = this.$route.query.to
        // 如果不是VAPRO5版本，则跳转到指定页面
        if (!isVAPro5()) {
            this.$router.push({ path: this.$route.query.to })
        }
        // 确定下一个页面去哪里
        if (this.$route.query.to) {
            this.to = this.$route.query.to
        } else {
            // 这是个意外
            console.log('这是个意外，不应该直接跳转到这里，不携带目标地址')
            this.to = '/main'
        }
        if (!this.$route.query.info || !JSON.parse(this.$route.query.info)) {
            // 判断是否测量青少年专项
            const modelInfo =  await this.findScanTypeInfo()
            if (modelInfo.teenagerReport !== 1) {
                // 如果不是青少年专项，则直接跳转到目标页面
                return this.$router.push({ path: this.to })
            }
        } else {
            this.canLoading = true
        }
        this.getPollingInfo()
    },

    methods: {
        // 循环查询 10s
        async getPollingInfo() {
            const info = await this.getMemberInfo()
            console.log('================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', info, !info.fatherHeight || !info.motherHeight)
            if ((!info.fatherHeight || !info.motherHeight) && info.age <= 18) {
                this.canLoading = true
                // 每10s 得查询一次
                if (this.pollingTimer) {
                    window.clearTimeout(this.pollingTimer) // 清理之前的定时器
                }

                this.pollingTimer = setTimeout(() => {
                    this.getPollingInfo() // 递归调用
                }, 5000) // 5秒间隔
            } else {
                this.$router.push({ path: this.to })
            }
        },
        // 失去焦点后重置背景
        handleBlurReset(e) {
            this.outTimeStamp = e.timeStamp
            setTimeout(() => {
                if (this.outTimeStamp === e.timeStamp) {
                    this.resetBackground()
                }
            }, 100)
        },

        handleFouceReset(e) {
            this.outTimeStamp = e.timeStamp
        },

        changeHei(data) {
            const heiReg = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (/^\d+$/.test(data)) {
                if (!heiReg.test(data)) {
                    this.heiErrorMg = '请填写范围内身高（110cm～205cm）'
                    this.heiMsg = true
                } else {
                    this.heiMsg = false
                }
            } else {
                this.heiErrorMg = '请输入整数'
                this.heiMsg = true
            }
        },

        async getMemberInfo() {
            const resd = await this.$apollo
                .query({
                    query: getMemberInfo,
                    fetchPolicy: 'network-only'
                })
            const data = resd.data.getMemberInfo.data
            window.localStorage.setItem('memberInfo', JSON.stringify(data))
            return data
        },

        async findScanTypeInfo() {
            const queryType = this.loginInfo.type === 'menuLogin' ? findLatestScanTypeInfo : findScanTypeInfo
            const resd = await this.$apollo
                .query({
                    query: queryType,
                    fetchPolicy: 'network-only',
                })
                const data = this.loginInfo.type === 'menuLogin'
                            ? resd.data.findLatestScanTypeInfo.data
                            : resd.data.findScanTypeInfo.data
            return data
        },

        // 重置iso下键盘收回后底部空白问题
        resetBackground() {
            window.scrollTo(0, 0)
        },
        // 关闭弹框
        onclose() {
            this.isdialog = false
            this.dialogBox = {
                url: require('../../assets/images/svg/Voice.svg'),
                message: '没有收到短信? 试试语音验证码',
                default: false,
            }
        },

        // 清空手机号
        handleClearMobile() {
            if (this.form.phone) {
                this.form.motherHeight = ''
                this.form.fatherHeight = ''
            }
        },

        // 父母身高绑定
        handleMobileSumbit() {
            let err = ''
            if (this.form.fatherHeight.toString().trim() === '') {
                err = '请填写父亲身高'
            } else if (this.form.motherHeight.toString().trim() === '') {
                err = '请填写母亲身高'
            } else if (this.form.fatherHeight.toString().trim().length > 6 || this.form.motherHeight.toString().trim().length > 6) {
                err = '请填写规范填写父母身高'
            } else if (!Number(this.form.fatherHeight.toString().trim()) || !Number(this.form.motherHeight.toString().trim())) {
                err = '请填写规范填写父母身高'
            } else if (this.form.fatherHeight < 110 || this.form.fatherHeight > 205 || this.form.motherHeight < 110 || this.form.motherHeight > 205) {
                err = '请填写范围内身高（110cm～205cm）'
            } else if (this.heiMsg) {
                return
            }

            else {
                // 正常
                this.$apollo
                    .mutate({
                        mutation: updateMemberInfo,
                        variables: {
                            fatherHeight: this.form.fatherHeight,
                            motherHeight: this.form.motherHeight,
                        }
                    })
                    .then(async res => {
                        this.$indicator.close()
                        const data = res.data.updateMemberInfo
                        if (data.code === 200) {
                            if (data && data.code === 200) {
                                this.$toast({
                                    message: '更新用户信息成功',
                                    duration: 2000
                                })
                                await this.getMemberInfo()
                                this.$router.push({ path: this.to })
                            } else {
                                this.$toast({
                                    message: '更新用户信息失败',
                                    duration: 2000
                                })
                            }
                        }
                    })
                return
            }
            this.$toast({
                message: err,
                duration: 2000,
            })

        },

        // 跳转报告页
        jumpToReport(viewStatus) {
            this.$router.push({
                path: viewStatus === 1 ? window.localStorage.getItem('healthPackageEnable') === '2' ? '/main' : '/report' : '/modeling'
            })
        },
    },
}
</script>

<style scoped lang="less">
.register-page {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #262849, #07090f);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    justify-content: space-between;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 60.5px;
        padding-bottom: 38.5px;

        h2 {
            //   width: 105px;
            height: 24px;
            mix-blend-mode: initial;
            background-image: linear-gradient(to right, #00e3c9, #00a4e6), linear-gradient(#ffffff, #ffffff);
            font-family: PingFangSC;
            font-size: 21px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.14;
            letter-spacing: normal;
            text-align: center;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            mix-blend-mode: initial;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 2;
            letter-spacing: normal;
            text-align: center;
            color: #ffffff;
            margin-top: 8px;
            margin-bottom: 0px;
        }
    }

    .content {
        flex: 1;

        // 表单
        .form {
            width: 100%;
            height: auto;

            .item {
                width: 345px;
                height: 56px;
                margin: 0 auto;
                border-radius: 4px;
                background-color: #232440;
                padding: 0 16px;
                color: rgba(255, 255, 255, 1);
                margin-bottom: 8px;
                box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.24);
                display: flex;
                align-items: center;

                .info {
                    position: relative;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &.center {
                        justify-content: center;
                    }

                    .over {
                        position: absolute;
                        z-index: 10;
                        width: 100%;
                        height: 56px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.5);
                        line-height: 56px;
                        // pointer-events: none;
                        background-color: #232440;
                    }
                }

                label {
                    font-size: 14px;
                    text-align: left;
                }

                input {
                    width: 70%;
                    height: 2em;
                    background: transparent;
                    padding-left: 25.5px;
                    font-size: 14px;
                    color: #fff;

                    &[name='birthday'] {
                        flex: none;
                        width: 50px;
                    }
                }

                input[name='height']~span {
                    font-size: 12px;
                    line-height: 12px;
                    color: rgba(255, 255, 255, 0.5);
                }

                .sex {
                    display: inline-block;
                    opacity: 0.5;
                    width: 40px;
                    height: 24px;
                    font-size: 14px;
                    line-height: 24px;
                    text-align: center;
                    margin: 0 20px;
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 1);

                    &.is-active {
                        opacity: 1;
                    }
                }

                .get-code-btn {
                    font-size: 12px;

                    &.is-disabled {
                        opacity: 0.5;
                    }
                }
            }

            .rule {
                color: #fff;
                margin: 10px auto;
                padding: 0 10px;
                height: auto;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;

                .checkbox {
                    position: relative;
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    margin-right: 5px;
                    border: 1px solid #fff;

                    input {
                        height: 12px;
                        width: 12px;
                        border-radius: 50%;
                        opacity: 0;
                    }

                    &.is-check {
                        &:before {
                            position: relative;
                            content: '';
                            height: 8px;
                            width: 8px;
                            margin: 2px;
                            border-radius: 50%;
                            background: #00a4e6;
                            display: block;
                        }
                    }
                }

                span {
                    color: #4a90e2;
                }
            }

            .rulety {
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
                font-family: PingFangSC-Regular, PingFang SC;
                line-height: 17px;
                height: 46px;
                text-align: right;

                span {
                    color: #4a90e2;
                }
            }

            .opacity {
                opacity: 0;
            }

            // 提交按钮
            .submit-btn {
                margin-top: 26px;

                button {
                    width: 200px;
                    height: 40px;
                    outline: none;
                    border-radius: 6px;
                    background-image: -webkit-gradient(linear, left top, right top, from(#00e2c9), to(#00a9e4));
                    background-image: -webkit-linear-gradient(left, #00e2c9, #00a9e4);
                    background-image: -o-linear-gradient(left, #00e2c9, #00a9e4);
                    background-image: linear-gradient(to right, #00e2c9, #00a9e4);
                    font-size: 16px;
                    color: #fff;

                    &.is-disabled {
                        border: 1px solid transparent;
                        background-image: linear-gradient(#191b31, #191b31),
                            /* 底色，即原有的背景 */
                            linear-gradient(to right, #06b0a2, #067eb9);
                        /* 模拟渐变边框 */
                        background-clip: padding-box, border-box;
                        background-origin: border-box;
                    }

                    .spinnerBtn {
                        display: flex;
                        justify-content: center;
                    }

                    /deep/ .mint-spinner-snake {
                        border: 2px solid transparent;
                    }
                }
            }
        }
        .isDeviceReport{
            .util{
                font-size: 14px;
            }
            .util-f, .util-m{
                font-size: 14px;
            }
        }

        &.user-info {
            .item {
                input {
                    flex: 1;
                    text-align: center;
                    padding-left: 0px;
                }
            }
        }
    }

    .icon-del {
        float: right;
        width: 9.5px;
        height: 9.5px;
        border-radius: 0.8px;
        background: url('../../assets/images/register/register_phone_delete.png') no-repeat;
    }

    .tips {
        position: relative;
        display: inline-block;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        min-width: 10px;
        color: #ffffff;
        margin-bottom: 30px;

        &::before {
            content: '*';
            position: absolute;
            width: 5px;
            left: -8px;
            top: 2px;
        }
    }

    .spring-frame {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);

        .dialog {
            margin: 68% auto;
            width: 272px;
            height: 168px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            backdrop-filter: blur(10px);
            font-weight: 400;
            text-align: center;
            font-family: PingFangSC-Regular, PingFang SC;
            overflow: hidden;

            img {
                margin: 24px 0 19px 0;
            }

            .h6 {
                font-size: 13px;
                color: #111111;
                line-height: 20px;
                margin-bottom: 24px;
            }

            .isH6 {
                font-size: 12px;
                color: #000000;
                line-height: 20px;
                margin-bottom: 20px;
                padding: 0 40px;
            }

            .dialog-box {
                font-size: 14px;
                display: flex;
                flex: 2;
                justify-content: space-between;
                padding: 0 20px;
            }

            .dialog-left {
                width: 100px;
                height: 28px;
                border-radius: 4px;
                border: 1px solid;
                border-image: linear-gradient(90deg, rgba(0, 227, 201, 1), rgba(0, 159, 232, 1)) 1 1;
                color: #000000;
                line-height: 28px;
            }

            .dialog-right {
                width: 114px;
                height: 28px;
                background: linear-gradient(90deg, #03d2ba 0%, #009fe8 100%);
                border-radius: 4px;
                color: #ffffff;
                line-height: 28px;
            }

            .dialog-sure {
                width: 100%;
                height: 39px;
                background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                line-height: 39px;
                font-size: 16px;
                color: #ffffff;
                position: relative;
                bottom: 0px;
            }
        }
    }
}
</style>
<style lang="less">
.BackGround {
    background: #fff !important;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 32px;
    width: 220px !important;
}

.van-dialog {
    width: 80% !important;
}

.van-dialog__message--has-title {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #111111;
    line-height: 20px;
}

.ttittle>span {
    position: absolute;
    color: #fefefe;
}

.ttittle>input {
    margin-left: 50px;
}

.ttittle>.util {
    position: absolute;
    right: 0;
    color: #8f909e;
}

// 身高错误信息
.height-select-msg {
    font-size: 13px;
    color: rgba(208, 2, 27, 1);
    position: absolute;
    width: 100%;
    left: 0;
}

input.error:focus {
    color: rgba(208, 2, 27, 1) !important;
}

.submiit {
    margin-top: 30px;
}
</style>
