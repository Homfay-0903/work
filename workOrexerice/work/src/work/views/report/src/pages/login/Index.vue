<template>
    <div class="page-login">
        <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm">
            <!-- 用户邮箱 -->
            <el-form-item prop="email">
                <el-input placeholder="邮箱" v-model="loginForm.email" @keyup.enter.native="userLogin"></el-input>
                <span slot="error">测试信息</span>
            </el-form-item>

            <!-- 用户密码 -->
            <el-form-item prop="pwd" :class="errorMsg != '' ? 'error-msg' : ''" :show-message="false">
                <el-input :type="errorMsg != '' ? 'txt' : 'password'" :placeholder="errorMsg != '' ? errorMsg : '密码'"
                    v-model="loginForm.pwd" @focus="inputPassword" @keyup.enter.native="userLogin">
                    <i slot="suffix" class="attention-icon"></i>
                </el-input>
            </el-form-item>

            <!-- 自动登录 忘记密码 -->
            <el-form-item class="auto-login">
                <el-checkbox v-model="autoLogin" size="mini">下次自动登录</el-checkbox>
                <router-link to="/forget">忘记密码</router-link>
            </el-form-item>

            <!-- 用户登录按钮 -->
            <el-form-item>
                <el-button type="primary" round :loading="loading" @click.prevent="userLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
import { userLogin } from '@/assets/js/apolloGql.js'

export default {
    components: {},
    data() {
        return {
            autoLogin: false, // 判断是否选中下次自动登录
            errorMsg: '', // 登录失败错误信息
            loading: false,
            loginForm: {
                email: '',
                pwd: ''
            },
            rules: {
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    {
                        message: '请输入正确的邮箱地址',
                        trigger: 'blur',
                        pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/
                    }
                ],
                pwd: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
            }
        }
    },
    methods: {
        // 密码框进入事件
        inputPassword() {
            this.errorMsg = ''
        },
        // 用户登录
        userLogin() {
            this.$refs['loginForm'].validate(valid => {
                if (valid) {
                    const user = {
                        email: this.loginForm.email.trim(),
                        password: this.loginForm.pwd.trim(),
                        rememberMe: this.autoLogin ? true : false
                    }
                    this.loading = true
                    this.$apollo
                        .query({
                            query: userLogin,
                            variables: user,
                            fetchPolicy: 'network-only'
                        })
                        .then(res => {
                            this.loading = false
                            const data = res.data.userLogin
                            if (data.code === 200) {
                                window.localStorage.setItem('aiTip', true)
                                window.localStorage.setItem('userTokens', JSON.stringify(data.bearerToken))
                                // 登录次数统计
                                this.$hmt.trackEvent('login', 'cmsLogin')
                                this.$message({
                                    message: '登录成功！',
                                    customClass: 'info-msg'
                                })
                                this.$router.push({
                                    name: 'home',
                                    params: {
                                        checkRenewal: true
                                    }
                                })
                                // 邮箱错误
                            } else if (data.code === 404) {
                                this.errorMsg = data.message
                                this.loginForm.pwd = ''
                                // 密码错误
                            } else if (data.code === 406) {
                                this.errorMsg = data.message
                                this.loginForm.pwd = ''
                            } else {
                                this.$message({
                                    message: '登录失败，请稍后再试',
                                    customClass: 'info-msg'
                                })
                            }
                        })
                        .catch(res => {
                            this.loading = false
                            this.$message({
                                message: '登录失败，请稍后再试',
                                customClass: 'info-msg'
                            })
                            console.log('[Login Error]')
                        })
                } else {
                    if (this.loginForm.pwd.trim() === '') {
                        this.errorMsg = '请输入密码'
                    }
                    return false
                }
            })
        }
    }
}
</script>
<style lang="less">
.el-form-item__error {
    color: #de350b !important;
    margin-left: 13px;
}

.login-form {
    input::-webkit-input-placeholder {
        letter-spacing: normal;
        color: #111111 !important;
    }

    input:-moz-placeholder {
        letter-spacing: normal;
        color: #111111 !important;
    }

    input::-moz-placeholder {
        letter-spacing: normal;
        color: #111111 !important;
    }

    input:-ms-input-placeholder {
        letter-spacing: normal;
        color: #111111 !important;
    }
}
</style>

<style scoped lang="less">
.login-form {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(-50%);

    /deep/.el-input {
        width: 252px;
        border-bottom: 1px solid #d5d5d5;

        input {
            outline: none;
            padding: 8px 0 8px 17px;
            font-size: 16px;
            font-weight: 500;
            color: #111111;
            border: none;
            background: transparent;
        }
    }

    .auto-login {
        /deep/.el-form-item__content {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: justify;
            justify-content: space-between;

            &:before,
            &:after {
                display: none;
            }

            .el-checkbox__label {
                font-size: 12px;
                color: #6b778c;
            }

            a {
                font-size: 12px;
                color: #6b778c;

                &:hover {
                    color: #111;
                }
            }
        }
    }

    /deep/.error-msg {
        input::-webkit-input-placeholder {
            font-size: 12px;
            letter-spacing: 4px;
            color: #de350b !important;
        }

        input::-webkit-input-placeholder {
            /* WebKit browsers */
            font-size: 12px;
            letter-spacing: 4px;
            color: #de350b !important;
        }

        input:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */
            font-size: 12px;
            letter-spacing: 4px;
            color: #de350b !important;
            opacity: 1;
        }

        input::-moz-placeholder {
            /* Mozilla Firefox 19+ */
            font-size: 12px;
            letter-spacing: 4px;
            color: #de350b !important;
            opacity: 1;
        }

        input:-ms-input-placeholder {
            /* Internet Explorer 10+ */
            font-size: 12px;
            letter-spacing: 4px;
            color: #de350b !important;
        }

        .attention-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: url('../../assets/images/login/default.png') no-repeat;
            background-size: contain;
            vertical-align: middle;
        }
    }

    .el-button {
        margin-top: 60px;
        width: 140px;
    }
}
</style>
