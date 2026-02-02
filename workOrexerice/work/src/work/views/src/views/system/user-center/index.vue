<!-- 个人中心页面 -->
<template>
    <div class="w-full h-full p-0 bg-transparent border-none shadow-none">
        <div class="art-card-sm p-6">
            <!-- 顶部：头像和个人信息 -->
            <div class="flex items-start pb-6 border-b border-g-300">
                <!-- 左侧：头像 -->
                <div class="shrink-0 mr-20">
                    <div class="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
                        <img
                            v-if="userInfo.avatar"
                            class="w-full h-full object-cover"
                            :src="userInfo.avatar"
                            alt="头像"
                        />
                        <img v-else class="w-full h-full object-cover" src="@imgs/user/avatar.webp" alt="头像" />
                    </div>
                </div>

                <!-- 右侧：个人信息 -->
                <div class="flex-1">
                    <div class="flex flex-col gap-y-2.5">
                        <!-- 第一行 -->
                        <div class="flex items-center gap-x-50">
                            <div class="flex items-center w-60">
                                <span class="text-sm text-g-600 mr-4 whitespace-nowrap">用户姓名：</span>
                                <span class="text-sm">{{ userInfo.nickname || '未设置' }}</span>
                            </div>
                            <div class="flex items-center w-60">
                                <span class="text-sm text-g-600 mr-4 whitespace-nowrap">职务：</span>
                                <span class="text-sm">{{ position || '未设置' }}</span>
                            </div>
                        </div>
                        <!-- 第二行 -->
                        <div class="flex items-center gap-x-50">
                            <div class="flex items-center w-60">
                                <span class="text-sm text-g-600 mr-4 whitespace-nowrap">手机号码：</span>
                                <span class="text-sm">{{ userInfo.mobile || '未设置' }}</span>
                            </div>
                            <div class="flex items-center w-60">
                                <span class="text-sm text-g-600 mr-4 whitespace-nowrap">钉钉账号：</span>
                                <span class="text-sm" :class="dingtalkStatus === '已绑定' ? 'text-green-600' : ''">
                                    {{ dingtalkStatus }}
                                </span>
                            </div>
                        </div>
                        <!-- 第三行 -->
                        <div class="flex items-center gap-x-50">
                            <div class="flex items-center w-60">
                                <span class="text-sm text-g-600 mr-4 whitespace-nowrap">登录邮箱：</span>
                                <span class="text-sm">{{ userInfo.email || '未设置' }}</span>
                            </div>
                            <div class="flex items-center w-60">
                                <span class="text-sm text-g-600 mr-4 whitespace-nowrap">注册时间：</span>
                                <span class="text-sm">{{ registeredTime }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 安全设置标签 -->
            <div class="mt-6 mb-6">
                <span class="inline-block px-4 py-1 text-sm text-white bg-blue-500 rounded-full">安全设置</span>
            </div>

            <!-- 安全设置内容 -->
            <div class="space-y-6">
                <!-- 登录密码 -->
                <div class="flex items-center justify-between pb-6 border-b border-g-200">
                    <div class="flex-1 flex items-center gap-4">
                        <div class="flex items-center">
                            <span class="text-sm text-g-600 mr-4">登录密码：</span>
                            <span class="text-sm" :class="passwordStatus === '已设置' ? 'text-green-600' : ''">
                                {{ passwordStatus }}
                            </span>
                        </div>
                        <div class="text-xs text-g-500">
                            密码至少6位字符,支持数字、字母和除空格外的特殊字符,且必须同时包含数字和大小写字母。
                        </div>
                    </div>
                    <ElButton
                        v-if="hasAuth('resetPassword')"
                        type="primary"
                        link
                        class="ml-4 shrink-0"
                        @click="showPasswordDialog = true"
                    >
                        修改
                    </ElButton>
                </div>

                <!-- 安全手机 -->
                <div class="flex items-center justify-between pb-6 border-b border-g-200">
                    <div class="flex-1">
                        <span class="text-sm text-g-600 mr-4">安全手机：</span>
                        <span class="text-sm mr-4" :class="mobileStatus === '已绑定' ? 'text-green-600' : ''">
                            {{ mobileStatus }}
                        </span>
                        <span v-if="userInfo.mobile" class="text-sm">{{ userInfo.mobile }}</span>
                        <span v-else class="text-sm text-g-400">未设置</span>
                    </div>
                </div>

                <!-- 安全邮箱 -->
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <span class="text-sm text-g-600 mr-4">安全邮箱：</span>
                        <span class="text-sm mr-4" :class="emailStatus === '已绑定' ? 'text-green-600' : ''">
                            {{ emailStatus }}
                        </span>
                        <span v-if="userInfo.email" class="text-sm">{{ userInfo.email }}</span>
                        <span v-else class="text-sm text-g-400">未设置</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 修改密码弹窗 -->
    <ResetPassword
        ref="resetPasswordRef"
        v-model:visible="showPasswordDialog"
        @close="showPasswordDialog = false"
        @success="handlePasswordSuccess"
    />
</template>

<script setup lang="ts">
    import { useUserStore } from '@/store/modules/user'
    import { ref, computed, onMounted } from 'vue'
    import { fetchGetUserInfo } from '@/api/auth'
    import { useAuth } from '@/hooks/core/useAuth'
    import ResetPassword from '@/components/core/views/reset-password/index.vue'

    defineOptions({ name: 'UserCenter' })

    const userStore = useUserStore()
    const userInfo = computed(() => userStore.getUserInfo)

    // 权限
    const { hasAuth } = useAuth()

    // 修改密码弹窗显示状态
    const showPasswordDialog = ref(false)

    /**
     * 职务（暂时使用角色列表的第一项，如果没有则显示默认值）
     */
    const position = computed(() => {
        if (userInfo.value?.userRoles && userInfo.value.userRoles.length > 0) {
            return userInfo.value.userRoles.map(role => role.name).join('/')
        }
        return '产品经理' // 默认值，实际应该从后端获取
    })

    /**
     * 注册时间（格式化显示）
     */
    const registeredTime = computed(() => {
        if (userInfo.value?.createdAt) {
            const date = new Date(userInfo.value.createdAt)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const seconds = date.getSeconds().toString().padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }
        return '未设置'
    })

    /**
     * 钉钉账号绑定状态（暂时假设未绑定，实际应该从后端获取）
     * 注意：实际项目中需要从后端获取用户的 OAuth 绑定状态
     */
    const dingtalkStatus = computed(() => {
        return userInfo.value?.dingtalkBound ? '已绑定' : '未绑定'
    })

    /**
     * 登录密码状态（假设有用户名就表示已设置密码）
     */
    const passwordStatus = computed(() => {
        return userInfo.value?.username ? '已设置' : '未设置'
    })

    /**
     * 安全手机绑定状态
     */
    const mobileStatus = computed(() => {
        return userInfo.value?.mobile ? '已绑定' : '未绑定'
    })

    /**
     * 安全邮箱绑定状态
     */
    const emailStatus = computed(() => {
        return userInfo.value?.email ? '已绑定' : '未绑定'
    })

    /**
     * 处理密码修改成功
     */
    const handlePasswordSuccess = () => {
        showPasswordDialog.value = false
        ElMessage.success('密码修改成功')
    }

    /**
     * 初始化数据
     */
    onMounted(async () => {
        // 如果用户信息不完整，重新获取
        if (!userInfo.value?.id) {
            try {
                const newUserInfo = await fetchGetUserInfo()
                userStore.setUserInfo(newUserInfo)
            } catch (error) {
                console.error('获取用户信息失败:', error)
            }
        }
    })
</script>
