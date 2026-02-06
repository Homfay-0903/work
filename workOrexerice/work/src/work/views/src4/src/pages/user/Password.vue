<template>
    <div class="page-password">
        <!-- 修改密码 -->
        <el-form class="password-form" :model="userPwd" :rules="rules" ref="pwdForm" label-width="120px">
            <!-- 原始密码 -->
            <el-form-item label="原始密码" prop="oldPwd">
                <el-input placeholder="请输入原密码" type="password" v-model="userPwd.oldPwd" @keyup.enter.native="updPwd"></el-input>
            </el-form-item>

            <!-- 新密码 -->
            <el-form-item label="新密码" prop="newPwd">
                <el-input placeholder="请输入新密码" type="password" v-model="userPwd.newPwd" @keyup.enter.native="updPwd"></el-input>
            </el-form-item>

            <!-- 确认密码 -->
            <el-form-item label="确认密码" prop="surePwd">
                <el-input placeholder="请输入确认密码" type="password" v-model="userPwd.surePwd" @keyup.enter.native="updPwd"></el-input>
            </el-form-item>

            <!-- 修改按钮 -->
            <el-form-item label-width="90px">
                <el-button type="primary" round :loading="loading" @click.prevent="updPwd">提交修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
import { updatePassword } from '@/assets/js/apolloGql.js'
export default {
    components: {},
    data() {
        // 校验新密码
        const checkNewPwd = (rule, value, callback) => {
            // 6~20 任意
            const regName = /^.{6,20}$/
            if (!value) {
                callback(new Error('新密码不能为空'))
            } else if (regName.test(value)) {
                if (value === this.userPwd.oldPwd) {
                    callback(new Error('新密码不能与原密码相同'))
                } else {
                    callback()
                }
            } else {
                callback(new Error('新密码长度不得小于6位，不得大于20位'))
            }
        }
        // 校验确认密码
        const checkSurePwd = (rule, value, callback) => {
            // 6~20 任意
            const regName = /^.{6,20}$/
            if (!value) {
                callback(new Error('请再次输入新密码'))
            } else if (regName.test(value)) {
                if (value !== this.userPwd.newPwd) {
                    callback(new Error('两次密码不一致'))
                } else {
                    callback()
                }
            } else {
                callback(new Error('新密码长度不得小于6位，不得大于20位'))
            }
        }
        return {
            loading: false,
            userPwd: {
                oldPwd: '',
                newPwd: '',
                surePwd: ''
            },
            rules: {
                oldPwd: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
                newPwd: [{ validator: checkNewPwd, trigger: 'blur' }],
                surePwd: [{ validator: checkSurePwd, trigger: 'blur' }]
            }
        }
    },
    methods: {
        updPwd() {
            this.$refs['pwdForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    const password = {
                        oldPassword: this.userPwd.oldPwd,
                        newPassword: this.userPwd.newPwd
                    }
                    this.$apollo
                        .mutate({
                            mutation: updatePassword,
                            variables: password
                        })
                        .then(res => {
                            this.loading = false
                            const data = res.data.updatePassword
                            const mes = res.data.updatePassword.message
                            if (data.code === 200) {
                                this.$message('密码修改成功!')
                                window.localStorage.removeItem('userTokens')
                                this.$router.push('/')
                                setTimeout(() => {
                                    window.history.go(0)
                                }, 500 * 1)
                            } else {
                                this.$message(mes)
                            }
                        })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.password-form {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(-50%);

    /deep/.el-form-item {
        position: relative;
        width: 480px;
        margin: 0 auto 26px;
        padding-right: 60px;
        .el-form-item__label {
            padding-right: 40px;
            font-size: 16px;
            color: #000;
            &:before {
                content: '';
            }
        }
        .el-input {
            input {
                padding: 8px 0 8px 17px;
                font-weight: 500;
                color: #111111;
            }
        }
        .el-button {
            margin-top: 60px;
            width: 140px;
        }
    }
}
</style>
