<template>
    <div>
        <el-form
            class="forget-form"
            :model="forgetForm"
            :rules="rules"
            ref="forgetForm"
            autocomplete="on"
            @submit.native.prevent="sendEmail"
        >
            <h1>找回密码</h1>
            <p>请输入您关联的电子邮箱地址</p>

            <!-- 用户邮箱 -->
            <el-form-item prop="email">
                <el-input placeholder="邮箱地址" v-model="forgetForm.email"></el-input>
            </el-form-item>

            <!-- 发送邮件按钮 -->
            <el-form-item>
                <el-button type="primary" round :loading="loading" @click.prevent="sendEmail">发送重置密码邮件</el-button>
            </el-form-item>

            <el-form-item>
                <router-link to="/contact" style="text-decoration: none;">关于蒜泥</router-link>
                <span class="segment-line"></span>
                <router-link to="/contact">联系我们</router-link>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
import { resetPassword } from '@/assets/js/apolloGql.js'
export default {
    components: {},
    data() {
        return {
            loading: false,
            forgetForm: {
                email: ''
            },
            rules: {
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    {
                        message: '请输入正确的邮箱地址',
                        trigger: 'blur',
                        pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/
                    }
                ]
            }
        }
    },
    methods: {
        sendEmail() {
            this.$refs['forgetForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$apollo
                        .mutate({
                            mutation: resetPassword,
                            variables: {
                                email: this.forgetForm.email
                            }
                        })
                        .then(res => {
                            this.loading = false
                            const data = res.data.resetPassword
                            if (data.code === 200) {
                                this.$message('发送成功,请注意查收')
                            } else {
                                this.$message(data.message)
                            }
                        })
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.forget-form {
    position: absolute;
    top: 32%;
    left: 50%;
    transform: translate(-50%);
    color: #172b4d;

    h1 {
        font-size: 29px;
        font-weight: 500;
        margin-bottom: 16px;
    }

    p {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 30px;
    }

    a {
        color: #3e3a39;
    }

    /deep/.el-input {
        width: 252px;
        border-bottom: 2px solid #d5d5d5;

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

    input::-webkit-input-placeholder {
        color: #111;
    }

    .el-button {
        width: 180px;
        margin-top: 60px;
    }

    .segment-line {
        display: inline-block;
        width: 0;
        height: 16px;
        border-right: 1px solid #cdced2;
        margin: 0 16px;
        vertical-align: middle;
        margin-top: -2px;
    }
}
</style>
