<!-- 重置密码页面 -->
<template>
    <div class="flex w-full h-screen">
        <LoginLeftView />

        <div class="relative flex-1">
            <AuthTopBar />

            <div class="auth-right-wrap">
                <div class="form">
                    <h3 class="title">重置密码</h3>
                    <p class="sub-title">请输入新密码和验证码</p>
                    <ElForm
                        class="mt-7.5"
                        ref="formRef"
                        :model="formData"
                        :rules="rules"
                        label-position="top"
                        :key="formKey"
                    >
                        <ElFormItem prop="password">
                            <ElInput
                                class="custom-height"
                                v-model.trim="formData.password"
                                placeholder="请输入新密码"
                                type="password"
                                autocomplete="off"
                                show-password
                            />
                        </ElFormItem>

                        <ElFormItem prop="confirmPassword">
                            <ElInput
                                class="custom-height"
                                v-model.trim="formData.confirmPassword"
                                placeholder="请确认新密码"
                                type="password"
                                autocomplete="off"
                                @keyup.enter="handleReset"
                                show-password
                            />
                        </ElFormItem>

                        <ElFormItem prop="code">
                            <ElInput
                                class="custom-height"
                                v-model.trim="formData.code"
                                placeholder="请输入验证码"
                                @keyup.enter="handleReset"
                            />
                        </ElFormItem>

                        <div style="margin-top: 15px">
                            <ElButton
                                class="w-full custom-height"
                                type="primary"
                                @click="handleReset"
                                :loading="loading"
                                v-ripple
                            >
                                重置密码
                            </ElButton>
                        </div>

                        <div class="mt-5 text-sm text-g-600">
                            <span>返回</span>
                            <RouterLink class="text-theme" :to="{ name: 'Login' }">登录</RouterLink>
                        </div>
                    </ElForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
    import { fetchResetPassword } from '@/api/auth'
    import { useRouter, useRoute } from 'vue-router'
    import { computed, reactive, ref, watch, onMounted } from 'vue'
    import { HttpError } from '@/utils/http/error'

    defineOptions({ name: 'ResetPassword' })

    const { locale } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const formRef = ref<FormInstance>()

    const loading = ref(false)
    const formKey = ref(0)
    const email = ref<string>('')

    // 监听语言切换，重置表单
    watch(locale, () => {
        formKey.value++
    })

    // 从路由参数获取邮箱
    onMounted(() => {
        const emailParam = route.query.email as string
        if (!emailParam) {
            ElMessage.warning('缺少邮箱参数，请重新操作')
            router.push({ name: 'ForgetPassword' })
            return
        }
        email.value = emailParam
    })

    const formData = reactive({
        password: '',
        confirmPassword: '',
        code: '',
    })

    /**
     * 验证确认密码
     * 检查确认密码是否与密码一致
     */
    const validateConfirmPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
        if (!value) {
            callback(new Error('请确认新密码'))
            return
        }

        if (value !== formData.password) {
            callback(new Error('两次输入的密码不一致'))
            return
        }

        callback()
    }

    const rules = computed<FormRules>(() => ({
        password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码长度至少6位', trigger: 'blur' },
        ],
        confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    }))

    /**
     * 重置密码
     * 验证表单后提交重置密码请求
     */
    const handleReset = async () => {
        if (!formRef.value) return

        try {
            await formRef.value.validate()
            loading.value = true

            // 调用重置密码接口
            await fetchResetPassword({
                email: email.value,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                code: formData.code,
            })

            ElMessage.success('密码重置成功，请使用新密码登录')

            // 跳转到登录页
            setTimeout(() => {
                router.push({ name: 'Login' })
            }, 1000)
        } catch (error) {
            if (error instanceof HttpError) {
                ElMessage.error(error.message)
            } else {
                console.error('重置密码失败:', error)
                ElMessage.error('重置密码失败，请稍后重试')
            }
        } finally {
            loading.value = false
        }
    }
</script>

<style scoped>
    @import '../login/style.css';
</style>
