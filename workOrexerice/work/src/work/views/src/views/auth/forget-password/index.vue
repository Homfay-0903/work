<template>
    <div class="flex w-full h-screen">
        <LoginLeftView />

        <div class="relative flex-1">
            <AuthTopBar />

            <div class="auth-right-wrap">
                <div class="form">
                    <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
                    <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>
                    <div class="mt-5">
                        <span class="input-label" v-if="showInputLabel">邮箱</span>
                        <ElForm ref="formRef" :model="formData" :rules="rules" :key="formKey">
                            <ElFormItem prop="email">
                                <ElInput
                                    class="custom-height"
                                    :placeholder="$t('forgetPassword.placeholder')"
                                    v-model.trim="formData.email"
                                    @keyup.enter="handleSubmit"
                                />
                            </ElFormItem>
                        </ElForm>
                    </div>

                    <div style="margin-top: 15px">
                        <ElButton
                            class="w-full custom-height"
                            type="primary"
                            @click="handleSubmit"
                            :loading="loading"
                            v-ripple
                        >
                            {{ $t('forgetPassword.submitBtnText') }}
                        </ElButton>
                    </div>

                    <div style="margin-top: 15px">
                        <ElButton class="w-full custom-height" plain @click="toLogin">
                            {{ $t('forgetPassword.backBtnText') }}
                        </ElButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, watch, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { ElForm, ElFormItem, ElInput, ElMessage, type FormInstance, type FormRules } from 'element-plus'
    import { fetchCheckEmail, fetchSendVerificationCode } from '@/api/auth'
    import { HttpError } from '@/utils/http/error'

    defineOptions({ name: 'ForgetPassword' })

    const router = useRouter()
    const showInputLabel = ref(false)
    const { t, locale } = useI18n()

    const loading = ref(false)
    const formKey = ref(0)

    // 监听语言切换，重置表单
    watch(locale, () => {
        formKey.value++
    })

    const formData = reactive({
        email: '',
    })

    const rules = computed<FormRules>(() => ({
        email: [
            { required: true, message: t('forgetPassword.placeholder') || '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        ],
    }))

    const formRef = ref<FormInstance>()

    /**
     * 处理提交
     * 1. 验证表单
     * 2. 检查邮箱是否存在
     * 3. 如果用户被删除，提示错误
     * 4. 如果邮箱不存在，提示错误
     * 5. 如果邮箱存在且用户未删除，发送验证码并跳转到重置密码页面
     */
    const handleSubmit = async () => {
        if (!formRef.value) return

        try {
            // 验证表单
            await formRef.value.validate()
            loading.value = true

            // 检查邮箱是否存在
            const checkResult = await fetchCheckEmail({ email: formData.email })

            // 如果用户被删除
            if (checkResult.deleted) {
                ElMessage.error('该用户已被注销')
                loading.value = false
                return
            }

            // 如果邮箱不存在
            if (!checkResult.exists) {
                ElMessage.error('该邮箱未绑定账号')
                loading.value = false
                return
            }

            // 发送验证码
            await fetchSendVerificationCode({ email: formData.email })
            ElMessage.success('验证码已发送到您的邮箱，请查收')

            // 跳转到重置密码页面，传递邮箱参数
            router.push({
                name: 'ResetPassword',
                query: { email: formData.email },
            })
        } catch (error) {
            if (error instanceof HttpError) {
                ElMessage.error(error.message)
            } else {
                console.error('忘记密码失败:', error)
                ElMessage.error('操作失败，请稍后重试')
            }
        } finally {
            loading.value = false
        }
    }

    const toLogin = () => {
        router.push({ name: 'Login' })
    }
</script>

<style scoped>
    @import '../login/style.css';
</style>
