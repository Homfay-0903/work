<!-- 登录页面 -->
<template>
    <div class="flex w-full h-screen">
        <LoginLeftView />

        <div class="relative flex-1">
            <AuthTopBar />

            <div class="auth-right-wrap">
                <div class="form">
                    <h3 class="title">{{ $t('login.title') }}</h3>
                    <p class="sub-title">{{ $t('login.subTitle') }}</p>
                    <ElForm
                        ref="formRef"
                        :model="formData"
                        :rules="rules"
                        :key="formKey"
                        @keyup.enter="handleSubmit"
                        style="margin-top: 25px"
                    >
                        <!-- 账号选择器（演示用，生产环境可删除） -->
                        <!-- <ElFormItem prop="account">
                            <ElSelect v-model="formData.account" @change="setupAccount">
                                <ElOption
                                    v-for="account in accounts"
                                    :key="account.key"
                                    :label="account.label"
                                    :value="account.key"
                                >
                                    <span>{{ account.label }}</span>
                                </ElOption>
                            </ElSelect>
                        </ElFormItem> -->
                        <ElFormItem prop="username">
                            <ElInput
                                class="custom-height"
                                :placeholder="$t('login.placeholder.username')"
                                v-model.trim="formData.username"
                            />
                        </ElFormItem>
                        <ElFormItem prop="password">
                            <ElInput
                                class="custom-height"
                                :placeholder="$t('login.placeholder.password')"
                                v-model.trim="formData.password"
                                type="password"
                                autocomplete="off"
                                show-password
                            />
                        </ElFormItem>

                        <!-- 推拽验证 -->
                        <div class="relative pb-5 mt-6">
                            <div
                                class="relative z-[2] overflow-hidden select-none rounded-lg border border-transparent tad-300"
                                :class="{ '!border-[#FF4E4F]': !isPassing && isClickPass }"
                            >
                                <ArtDragVerify
                                    ref="dragVerify"
                                    v-model:value="isPassing"
                                    :text="$t('login.sliderText')"
                                    textColor="var(--art-gray-700)"
                                    :successText="$t('login.sliderSuccessText')"
                                    :progressBarBg="getCssVar('--el-color-primary')"
                                    :background="isDark ? '#26272F' : '#F1F1F4'"
                                    handlerBg="var(--default-box-color)"
                                />
                            </div>
                            <p
                                class="absolute top-0 z-[1] px-px mt-2 text-xs text-[#f56c6c] tad-300"
                                :class="{ 'translate-y-10': !isPassing && isClickPass }"
                            >
                                {{ $t('login.placeholder.slider') }}
                            </p>
                        </div>

                        <div class="flex-cb mt-2 text-sm">
                            <ElCheckbox v-model="formData.rememberPassword">{{ $t('login.rememberPwd') }}</ElCheckbox>
                            <RouterLink class="text-theme" :to="{ name: 'ForgetPassword' }">{{
                                $t('login.forgetPwd')
                            }}</RouterLink>
                        </div>

                        <div style="margin-top: 30px">
                            <ElButton
                                class="w-full custom-height"
                                type="primary"
                                @click="handleSubmit"
                                :loading="loading"
                                v-ripple
                            >
                                {{ $t('login.btnText') }}
                            </ElButton>
                        </div>

                        <!-- 其他登录方式 -->
                        <!--<ElButton
                                    class="flex-1 custom-height"
                                    plain
                                    :loading="socialLoadingProvider === 'google'"
                                    :disabled="loading"
                                    @click="handleSocialLogin('google')"
                                    v-ripple
                                >
                                    {{ $t('login.googleLogin') }}
                                </ElButton>-->
                        <div class="mt-6">
                            <div class="flex items-center text-xs text-g-500">
                                <div class="flex-1 h-px bg-g-200" />
                                <span class="mx-3">{{ $t('login.otherLogin') }}</span>
                                <div class="flex-1 h-px bg-g-200" />
                            </div>
                            <div class="mt-4 flex gap-3">
                                <ElButton
                                    class="flex-1 custom-height"
                                    plain
                                    :loading="socialLoadingProvider === 'dingtalk'"
                                    :disabled="loading"
                                    @click="handleSocialLogin('dingtalk')"
                                    v-ripple
                                >
                                    {{ $t('login.dingtalkLogin') }}
                                </ElButton>
                            </div>
                        </div>

                        <div class="mt-5 text-sm text-gray-600">
                            <span>{{ $t('login.noAccount') }}</span>
                            <RouterLink class="text-theme" :to="{ name: 'Register' }">{{
                                $t('login.register')
                            }}</RouterLink>
                        </div>
                    </ElForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import AppConfig from '@/config'
    import { useUserStore } from '@/store/modules/user'
    import { getCssVar } from '@/utils/ui'
    import { useI18n } from 'vue-i18n'
    import { HttpError } from '@/utils/http/error'
    import { fetchLogin, fetchSocialOAuth, fetchSocialOAuthCallback, fetchGetUserInfo } from '@/api/auth'
    import { ElMessage, ElNotification, type FormInstance, type FormRules } from 'element-plus'
    import { useSettingStore } from '@/store/modules/setting'
    import { storeToRefs } from 'pinia'
    import { computed, onMounted, reactive, ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    defineOptions({ name: 'Login' })

    const settingStore = useSettingStore()
    const { isDark } = storeToRefs(settingStore)
    const { t, locale } = useI18n()
    const formKey = ref(0)

    // 监听语言切换，重置表单
    watch(locale, () => {
        formKey.value++
    })

    // 演示用的账号类型定义（已禁用）
    // type AccountKey = 'super' | 'admin' | 'user'

    // export interface Account {
    //     key: AccountKey
    //     label: string
    //     username: string
    //     password: string
    //     roles: string[]
    // }

    // 演示用的默认账号列表（已禁用）
    // const accounts = computed<Account[]>(() => [
    //     {
    //         key: 'super',
    //         label: t('login.roles.super'),
    //         username: 'Super',
    //         password: '123456',
    //         roles: ['R_SUPER'],
    //     },
    //     {
    //         key: 'admin',
    //         label: t('login.roles.admin'),
    //         username: 'Admin',
    //         password: '123456',
    //         roles: ['R_ADMIN'],
    //     },
    //     {
    //         key: 'user',
    //         label: t('login.roles.user'),
    //         username: 'User',
    //         password: '123456',
    //         roles: ['R_USER'],
    //     },
    // ])

    const dragVerify = ref()

    const userStore = useUserStore()
    const router = useRouter()
    const route = useRoute()
    const isPassing = ref(false)
    const isClickPass = ref(false)

    const systemName = AppConfig.systemInfo.name
    const formRef = ref<FormInstance>()

    const formData = reactive({
        account: '',
        username: '',
        password: '',
        rememberPassword: true,
    })

    const rules = computed<FormRules>(() => ({
        username: [{ required: true, message: t('login.placeholder.username'), trigger: 'blur' }],
        password: [{ required: true, message: t('login.placeholder.password'), trigger: 'blur' }],
    }))

    const loading = ref(false)
    const socialLoadingProvider = ref<string | null>(null)

    // 注释掉自动填充默认账号的逻辑，避免登录后显示错误的用户信息
    // onMounted(() => {
    //     setupAccount('super')
    // })

    // 设置账号（演示用，生产环境不需要）
    // const setupAccount = (key: AccountKey) => {
    //     const selectedAccount = accounts.value.find((account: Account) => account.key === key)
    //     formData.account = key
    //     formData.username = selectedAccount?.username ?? ''
    //     formData.password = selectedAccount?.password ?? ''
    // }

    // 登录
    const handleSubmit = async () => {
        if (!formRef.value) return

        try {
            // 表单验证
            const valid = await formRef.value.validate()
            if (!valid) return

            // 拖拽验证
            if (!isPassing.value) {
                isClickPass.value = true
                return
            }

            loading.value = true

            // 登录请求
            const { username, password } = formData

            const { accessToken: token, refreshToken } = await fetchLogin({
                username: username,
                password,
            })

            // 验证token
            if (!token) {
                throw new Error('Login failed - no token received')
            }

            // 存储 token 和登录状态
            userStore.setToken(token, refreshToken)
            userStore.setLoginStatus(true)

            // 登录成功处理
            showLoginSuccessNotice()

            // 获取 redirect 参数，如果存在则跳转到指定页面，否则跳转到首页
            const redirect = route.query.redirect as string
            router.push(redirect || '/')
        } catch (error) {
            // 登录失败，确保重置登录状态，避免路由守卫反复请求
            userStore.setLoginStatus(false)
            userStore.setToken('', '')

            // 处理 HttpError
            if (error instanceof HttpError) {
                // 显示错误消息给用户
                ElMessage.error(error.message)
            } else {
                // 处理非 HttpError
                //ElMessage.error('登录失败，请稍后重试')
                console.error('[Login] Unexpected error:', error)
            }
        } finally {
            loading.value = false
            resetDragVerify()
        }
    }

    // 第三方登录
    const handleSocialLogin = async (provider: 'google' | 'dingtalk') => {
        try {
            socialLoadingProvider.value = provider
            const { authorizationUrl } = await fetchSocialOAuth({ provider })

            if (!authorizationUrl) {
                throw new Error('Social login failed - no authorizationUrl received')
            }

            window.location.href = authorizationUrl
        } catch (error) {
            if (error instanceof HttpError) {
                ElMessage.error(error.message)
            } else {
                ElMessage.error(t('login.socialError'))
                console.error('[SocialLogin] Unexpected error:', error)
            }
        } finally {
            socialLoadingProvider.value = null
        }
    }

    // 处理第三方登录回调
    const handleSocialCallback = async () => {
        const provider = route.query.provider as string | undefined
        const code = route.query.code as string | undefined
        const error = route.query.error as string | undefined

        // 无第三方登录参数时不处理
        if (!provider) return

        // 用户取消或授权失败
        if (error) {
            ElMessage.error(error)
            clearSocialQuery()
            return
        }

        // 如果有provider但没有code，说明是后端已经处理完OAuth回调后的重定向
        // 通过调用用户信息API来验证登录状态（浏览器会自动携带cookie）
        if (!code) {
            try {
                loading.value = true
                const userInfo = await fetchGetUserInfo()

                if (userInfo) {
                    // 后端已经处理了OAuth，用户信息获取成功
                    userStore.setUserInfo(userInfo)
                    userStore.setLoginStatus(true)
                    showLoginSuccessNotice()

                    if (provider === 'dingtalk') {
                        router.replace('/system/user')
                    } else {
                        const redirect = route.query.redirect as string
                        router.replace(redirect || '/')
                    }
                } else {
                    throw new Error('Failed to get user info')
                }
            } catch (error) {
                console.error('[SocialLoginCallback] Error verifying login:', error)
                ElMessage.error(t('login.socialError'))
            } finally {
                loading.value = false
            }
            clearSocialQuery()
            return
        }

        // 前端处理OAuth回调（有code参数）
        try {
            loading.value = true

            const { accessToken: token, refreshToken } = await fetchSocialOAuthCallback({
                provider,
                code: code || '',
            })

            if (!token) {
                throw new Error('Social login failed - no token received')
            }

            userStore.setToken(token, refreshToken)
            userStore.setLoginStatus(true)

            showLoginSuccessNotice()

            const redirect = route.query.redirect as string

            if (provider === 'dingtalk') {
                router.replace('/system/user')
            } else {
                router.replace(redirect || '/')
            }
        } catch (error) {
            userStore.setLoginStatus(false)
            userStore.setToken('', '')

            if (error instanceof HttpError) {
                ElMessage.error(error.message)
            } else {
                ElMessage.error(t('login.socialError'))
                console.error('[SocialLoginCallback] Unexpected error:', error)
            }

            clearSocialQuery()
        } finally {
            loading.value = false
        }
    }

    const clearSocialQuery = () => {
        //const { provider, code, error, ...restQuery } = route.query
        const { ...restQuery } = route.query
        router.replace({ path: route.path, query: restQuery })
    }

    onMounted(() => {
        handleSocialCallback()
    })

    // 重置拖拽验证
    const resetDragVerify = () => {
        dragVerify.value.reset()
    }

    // 登录成功提示
    const showLoginSuccessNotice = () => {
        setTimeout(() => {
            ElNotification({
                title: t('login.success.title'),
                type: 'success',
                duration: 2500,
                zIndex: 10000,
                message: `${t('login.success.message')}, ${systemName}!`,
            })
        }, 1000)
    }
</script>

<style scoped>
    @import './style.css';
</style>

<style lang="scss" scoped>
    :deep(.el-select__wrapper) {
        height: 40px !important;
    }
</style>
