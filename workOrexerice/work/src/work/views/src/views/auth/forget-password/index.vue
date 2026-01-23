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
                        <span class="input-label" v-if="showInputLabel">账号</span>
                        <ElForm ref="formRef" :model="formData" :rules="rules" :key="formKey">
                            <ElFormItem prop="username">
                                <ElInput
                                    class="custom-height"
                                    :placeholder="$t('forgetPassword.placeholder')"
                                    v-model.trim="formData.username"
                                />
                            </ElFormItem>
                        </ElForm>
                    </div>

                    <div style="margin-top: 15px">
                        <ElButton
                            class="w-full custom-height"
                            type="primary"
                            @click="register"
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
    import { ref, reactive, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { ElForm, ElFormItem, ElInput, type FormInstance } from 'element-plus'

    defineOptions({ name: 'ForgetPassword' })

    const router = useRouter()
    const showInputLabel = ref(false)

    const loading = ref(false)
    const formKey = ref(0)
    const { locale } = useI18n()

    // 监听语言切换，重置表单
    watch(locale, () => {
        formKey.value++
    })

    const formData = reactive({
        username: '',
    })

    const rules = reactive({
        username: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    })

    const formRef = ref<FormInstance>()

    const register = async () => {
        if (!formRef.value) return
        await formRef.value.validate()
    }

    const toLogin = () => {
        router.push({ name: 'Login' })
    }
</script>

<style scoped>
    @import '../login/style.css';
</style>
