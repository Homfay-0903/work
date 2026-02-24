<!-- eslint-disable handle-callback-err -->
<template>
    <div>
        <form action="#" class="reg-form">
            <div class="reg-user">
                <slot name="reg-user-icon"></slot>
                <label for="iphone-num" class="iphone-num">
                    <slot></slot>
                </label>
                <input type="number" v-model="form.phone" class="reg-user-name reg-user-iphone" placeholder="请输入手机号" />
                <span class="reg-user-delete" v-if="form.phone" @click="clearVal"></span>
            </div>
            <div class="reg-user reg-pass">
                <span class="reg-user-icon reg-password-icon"></span>
                <label for="iphone-num" class="iphone-num">验证码</label>
                <input
                    type="number"
                    v-model="form.code"
                    class="reg-user-name"
                    :disabled="isSendCode"
                    @input="validatorCode"
                    placeholder="请输入验证码"
                />
                <span
                    class="reg-var-code"
                    :class="{'reg-code-opacity': form.phone.length === 11 && countDown === 60}"
                    @click="sendCode"
                >{{codeText}}</span>
            </div>
            <div class="rule">
                <input
                    type="checkbox"
                    v-model="ruleValue"
                    class="input-check-faild"
                    :class="{'input-check-success': ruleValue}"
                />
                我已阅读并同意
                <span to="userrule" class="font-rule" @click="goUserRule">《用户使用协议》</span>和
                <span to="usersecret" class="font-rule" @click="goUserSecret">《用户隐私协议》</span>
            </div>
            <div class="reg-subm">
                <button
                    type="submit"
                    class="reg-click-reg"
                    @click.prevent="submit"
                    @keyup.enter="submit"
                    :class="{'reg-code-opacity': form.phone && form.code && ruleValue}"
                >
                    <slot name="buttom"></slot>
                </button>
            </div>
        </form>
    </div>
</template>
<script type="text/ecmascript-6">
import { getSmsCode, memberLogin } from '@/assets/js/apolloGql.js'
export default {
    data() {
        return {
            form: {
                code: '',
                phone: ''
            },
            openId: '',
            token: '',
            timer: '',
            ruleValue: false,
            countDown: 60,
            codeText: '获取验证码',
            isSendCode: true, // 验证码默认不能输入
            // 控制验证码获取是否可用
            sendDisabled: false
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    mounted() {
        // 保留信息不被清空
        const lookUserInfo = JSON.parse(window.sessionStorage.getItem('lookUserInfo'))
        if (lookUserInfo) {
            this.form.phone = lookUserInfo.phone
            this.form.code = lookUserInfo.code
            this.isSendCode = false
        }
    },
    methods: {
        // ---------------------短信验证啊----------------------
        sendCode() {
            let that = this
            // 禁止短时间重复点击
            if (this.sendDisabled) {
                return
            }
            that.form.code = ''
            const reg = /^1\d{10}$/
            if (this.form.phone.length === 11 && this.countDown === 60) {
                if (!reg.test(this.form.phone)) {
                    this.$toast({
                        message: '手机号码格式错误',
                        duration: 3000
                    })
                } else {
                    this.sendDisabled = true
                    this.$apollo
                        .query({
                            query: getSmsCode,
                            fetchPolicy: 'network-only',
                            variables: {
                                mobile: this.form.phone,
                                state: this.$route.query.state
                            }
                        })
                        .then(res => {
                            const data = res.data.sendValidationCode
                            if (data.code === 200) {
                                // 验证码发送成功后可输入验证码
                                this.isSendCode = false
                                let timer = setInterval(function() {
                                    that.countDown--
                                    that.codeText = `${that.countDown}s后重新获取`
                                    if (that.countDown === 0) {
                                        that.sendDisabled = false
                                        that.codeText = '获取验证码'
                                        clearInterval(timer)
                                        that.countDown = 60
                                    }
                                }, 1000)
                                this.timer = timer
                                this.$toast({
                                    message: data.message,
                                    duration: 3000
                                })
                            } else {
                                this.sendDisabled = false
                                this.$toast({
                                    message: data.message,
                                    duration: 3000
                                })
                            }
                        })
                        .catch(err => {
                            console.error(err)
                            this.sendDisabled = false
                        })
                }
            }
        },
        clearVal() {
            if (this.form.phone) {
                this.form.phone = ''
                this.form.code = ''
                window.sessionStorage.removeItem('lookUserInfo')
            }
        },
        submit() {
            const that = this
            if (that.form.phone && that.form.code && this.ruleValue) {
                that.memberLogin()
            }
        },
        memberLogin(type = 1) {
            const that = this
            const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
            that.$apollo
                .query({
                    query: memberLogin,
                    variables: {
                        state: that.$route.query.state, // 'wx033c4a7af52bd1ab'
                        authCode: that.$route.query.code,
                        mobile: that.form.phone,
                        validationCode: Number(that.form.code) || 0,
                        type: type,
                        openId: userInfo.openId,
                        token: userInfo.accessToken
                    }
                })
                .then(res => {
                    const data = res.data.memberLogin
                    if (data.code === 200) {
                        that.$toast({
                            message: data.message,
                            duration: 3000
                        })
                        that.$router.push({
                            path: '/modeling'
                        })
                    } else {
                        that.$toast({
                            message: data.message,
                            duration: 3000
                        })
                    }
                })
        },
        // 判断验证码长度
        validatorCode() {
            const code = this.form.code
            if (code.length > 4) {
                this.form.code = code.substring(0, 4)
                this.$toast({
                    message: '请输入四位验证码',
                    duration: 3000
                })
            }
        },
        // 查看用户协议
        goUserRule() {
            this.$router.push('/about/rule')
            if (this.form.phone || this.form.code) {
                window.sessionStorage.setItem('lookUserInfo', JSON.stringify(this.form))
            }
        },
        goUserSecret() {
            this.$router.push('/about/secret')
            if (this.form.phone || this.form.code) {
                window.sessionStorage.setItem('lookUserInfo', JSON.stringify(this.form))
            }
        }
    }
}
</script>

<style scoped lang="less">
.font-rule {
    color: #4a90e2;
    border: none;
    text-decoration: none;
}
.input-check-faild {
    // background: url(../../assets/images/comp_rb.png) no-repeat -3px center;
    background: #fff;
    background-size: 21px 21px;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    margin-right: 5px;
}
.input-check-success {
    background: url('../../assets/images/comp_rb.png') no-repeat -3px center;
}
.input-check {
    // display: inline-block;
    // vertical-align: middle;
    // font-size: 12px;
    width: 12px;
    height: 12px;
    background: #fff;
    // border-radius: 50%;
    // border: 1px solid #ffffff;
    // margin: 0 3px;
    z-index: 1000;
}
.rule {
    color: #fff;
    text-align: left;
    width: 98%;
    margin: 10px auto;
    padding: 0 10px;
    height: auto;
    font-size: 12px;
    display: flex;
    align-items: center;
}
.reg-form {
    width: 100%;
    height: auto;
}
.reg-user {
    width: 345px;
    height: 50px;
    margin: 0 auto;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 0 16px;
    color: rgba(255, 255, 255, 1);
    text-align: left;
}
.reg-user-name {
    width: 42%;
    height: 100%;
    background: transparent;
    padding-left: 25.5px;
    font-size: 14px;
    color: #fff;
}
.reg-pass {
    margin-top: 2px;
}
.reg-user-icon {
    display: inline-block;
    width: 16px;
    height: 23px;
    background: url('../../assets/images/register/register_phone_icon.png') no-repeat;
    background-size: 16px 23px;
    vertical-align: middle;
    margin-top: -1px;
    margin-right: 5px;
}
.reg-password-icon {
    width: 19px;
    height: 17px;
    margin-left: -2px;
    background: url('../../assets/images/register/register_VerificationCode_icon.png') no-repeat;
    background-size: 18px 17px;
}
.reg-user-delete {
    display: block;
    float: right;
    margin-top: 20px;
    right: 16px;
    width: 9.5px;
    height: 9.5px;
    border-radius: 0.8px;
    background: url('../../assets/images/register/register_phone_delete.png') no-repeat;
}
.reg-var-code {
    float: right;
    height: 100%;
    line-height: 50px;
    opacity: 0.5;
}
.reg-code-opacity {
    opacity: 1 !important;
}
.iphone-num,
.reg-var-code {
    font-size: 12px;
}
.reg-subm {
    margin-top: 29.5px;
}
.reg-click-reg {
    width: 200px;
    height: 40px;
    border-radius: 6px;
    background-image: -webkit-gradient(linear, left top, right top, from(#00e2c9), to(#00a9e4));
    background-image: -webkit-linear-gradient(left, #00e2c9, #00a9e4);
    background-image: -o-linear-gradient(left, #00e2c9, #00a9e4);
    background-image: linear-gradient(to right, #00e2c9, #00a9e4);
    font-size: 16px;
    color: #fff;
    opacity: 0.5;
}
</style>
