<!-- 个人中心页面 -->
<template>
    <div class="w-full h-full p-0 bg-transparent border-none shadow-none">
        <div class="relative flex-b mt-2.5 max-md:block max-md:mt-1">
            <div class="w-112 mr-5 max-md:w-full max-md:mr-0">
                <div class="art-card-sm relative p-9 pb-6 overflow-hidden text-center">
                    <img class="absolute top-0 left-0 w-full h-50 object-cover" src="@imgs/user/bg.webp" />
                    <img
                        class="relative z-10 w-20 h-20 mt-30 mx-auto object-cover border-2 border-white rounded-full"
                        src="@imgs/user/avatar.webp"
                    />
                    <h2 class="mt-5 text-xl font-normal">{{ userInfo.username || '未设置' }}</h2>
                    <p class="mt-5 text-sm">{{ userInfo.bio || '专注于用户体验跟视觉设计' }}</p>

                    <div class="w-75 mx-auto mt-7.5 text-left">
                        <div class="mt-2.5">
                            <ArtSvgIcon icon="ri:mail-line" class="text-g-700" />
                            <span class="ml-2 text-sm">{{ userInfo.email || '未设置' }}</span>
                        </div>
                        <div class="mt-2.5" v-if="userInfo.nickname">
                            <ArtSvgIcon icon="ri:user-3-line" class="text-g-700" />
                            <span class="ml-2 text-sm">{{ userInfo.nickname }}</span>
                        </div>
                        <div class="mt-2.5" v-if="userInfo.address">
                            <ArtSvgIcon icon="ri:map-pin-line" class="text-g-700" />
                            <span class="ml-2 text-sm">{{ userInfo.address }}</span>
                        </div>
                        <div class="mt-2.5" v-if="userInfo.mobile">
                            <ArtSvgIcon icon="ri:phone-line" class="text-g-700" />
                            <span class="ml-2 text-sm">{{ userInfo.mobile }}</span>
                        </div>
                    </div>

                    <div class="mt-10">
                        <h3 class="text-sm font-medium">标签</h3>
                        <div class="flex flex-wrap justify-center mt-3.5">
                            <div
                                v-for="item in labelList"
                                :key="item"
                                class="py-1 px-1.5 mr-2.5 mb-2.5 text-xs border border-g-300 rounded"
                            >
                                {{ item }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-hidden max-md:w-full max-md:mt-3.5">
                <div class="art-card-sm">
                    <h1 class="p-4 text-xl font-normal border-b border-g-300">基本设置</h1>

                    <ElForm
                        :model="form"
                        class="box-border p-5 [&>.el-row_.el-form-item]:w-[calc(50%-10px)] [&>.el-row_.el-input]:w-full [&>.el-row_.el-select]:w-full"
                        ref="ruleFormRef"
                        :rules="rules"
                        label-width="86px"
                        label-position="top"
                    >
                        <ElRow>
                            <ElFormItem label="姓名" prop="realName">
                                <ElInput v-model="form.realName" :disabled="!isEdit" />
                            </ElFormItem>
                            <ElFormItem label="性别" prop="sex" class="ml-5">
                                <ElSelect v-model="form.sex" placeholder="Select" :disabled="!isEdit">
                                    <ElOption
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </ElSelect>
                            </ElFormItem>
                        </ElRow>

                        <ElRow>
                            <ElFormItem label="昵称" prop="nikeName">
                                <ElInput v-model="form.nikeName" :disabled="!isEdit" />
                            </ElFormItem>
                            <ElFormItem label="邮箱" prop="email" class="ml-5">
                                <ElInput v-model="form.email" :disabled="!isEdit" />
                            </ElFormItem>
                        </ElRow>

                        <ElRow>
                            <ElFormItem label="手机" prop="mobile">
                                <ElInput v-model="form.mobile" :disabled="!isEdit" />
                            </ElFormItem>
                            <ElFormItem label="地址" prop="address" class="ml-5">
                                <ElInput v-model="form.address" :disabled="!isEdit" />
                            </ElFormItem>
                        </ElRow>

                        <ElFormItem label="个人介绍" prop="des" class="h-32">
                            <ElInput type="textarea" :rows="4" v-model="form.des" :disabled="!isEdit" />
                        </ElFormItem>

                        <div class="flex-c justify-end [&_.el-button]:!w-27.5">
                            <ElButton type="primary" class="w-22.5" v-ripple @click="edit">
                                {{ isEdit ? '保存' : '编辑' }}
                            </ElButton>
                        </div>
                    </ElForm>
                </div>

                <div class="art-card-sm my-5">
                    <h1 class="p-4 text-xl font-normal border-b border-g-300">更改密码</h1>

                    <ElForm :model="pwdForm" class="box-border p-5" label-width="86px" label-position="top">
                        <ElFormItem label="当前密码" prop="password">
                            <ElInput v-model="pwdForm.password" type="password" :disabled="!isEditPwd" show-password />
                        </ElFormItem>

                        <ElFormItem label="新密码" prop="newPassword">
                            <ElInput
                                v-model="pwdForm.newPassword"
                                type="password"
                                :disabled="!isEditPwd"
                                show-password
                            />
                        </ElFormItem>

                        <ElFormItem label="确认新密码" prop="confirmPassword">
                            <ElInput
                                v-model="pwdForm.confirmPassword"
                                type="password"
                                :disabled="!isEditPwd"
                                show-password
                            />
                        </ElFormItem>

                        <div class="flex-c justify-end [&_.el-button]:!w-27.5">
                            <ElButton type="primary" class="w-22.5" v-ripple @click="editPwd">
                                {{ isEditPwd ? '保存' : '编辑' }}
                            </ElButton>
                        </div>
                    </ElForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useUserStore } from '@/store/modules/user'
    import type { FormInstance, FormRules } from 'element-plus'
    import { ref, computed, watch, onMounted, reactive } from 'vue'
    import { fetchUpdateUserInfo, fetchChangePassword, fetchGetUserInfo } from '@/api/auth'

    defineOptions({ name: 'UserCenter' })

    const userStore = useUserStore()
    const userInfo = computed(() => userStore.getUserInfo)

    const isEdit = ref(false)
    const isEditPwd = ref(false)
    const date = ref('')
    const ruleFormRef = ref<FormInstance>()

    /**
     * 用户信息表单
     */
    const form = reactive({
        realName: userInfo.value.realName || '',
        nikeName: userInfo.value.nickname || '',
        email: userInfo.value.email || '',
        mobile: userInfo.value.mobile || '',
        address: userInfo.value.address || '',
        sex: String(userInfo.value.gender || 2),
        des: userInfo.value.bio || '',
    })

    // 监听 userInfo 变化，同步更新表单
    watch(userInfo, newInfo => {
        if (newInfo) {
            form.realName = newInfo.realName || ''
            form.nikeName = newInfo.nickname || ''
            form.email = newInfo.email || ''
            form.mobile = newInfo.mobile || ''
            form.address = newInfo.address || ''
            form.sex = String(newInfo.gender || 2)
            form.des = newInfo.bio || ''
        }
    })

    /**
     * 密码修改表单
     */
    const pwdForm = reactive({
        password: '',
        newPassword: '',
        confirmPassword: '',
    })

    /**
     * 表单验证规则
     */
    const rules = reactive<FormRules>({
        realName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
        ],
        nikeName: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    })

    /**
     * 性别选项
     */
    const options = [
        { value: '1', label: '男' },
        { value: '2', label: '女' },
    ]

    /**
     * 用户标签列表
     */
    const labelList = ref<string[]>(['专注设计', '很有想法', '辣~', '大长腿', '川妹子', '海纳百川'])

    onMounted(() => {
        getDate()
    })

    /**
     * 根据当前时间获取问候语
     */
    const getDate = () => {
        const h = new Date().getHours()

        if (h >= 6 && h < 9) date.value = '早上好'
        else if (h >= 9 && h < 11) date.value = '上午好'
        else if (h >= 11 && h < 13) date.value = '中午好'
        else if (h >= 13 && h < 18) date.value = '下午好'
        else if (h >= 18 && h < 24) date.value = '晚上好'
        else date.value = '很晚了，早点睡'
    }

    /**
     * 切换用户信息编辑状态
     */
    const edit = async () => {
        if (isEdit.value) {
            // 保存操作
            try {
                await fetchUpdateUserInfo({
                    realName: form.realName,
                    nickname: form.nikeName,
                    email: form.email,
                    mobile: form.mobile,
                    address: form.address,
                    gender: Number(form.sex),
                    bio: form.des,
                })
                ElMessage.success('更新成功')
                // 重新获取用户信息
                const newUserInfo = await fetchGetUserInfo()
                userStore.setUserInfo(newUserInfo)
            } catch (error) {
                console.error('更新失败:', error)
                ElMessage.error('更新失败')
            }
        }
        isEdit.value = !isEdit.value
    }

    /**
     * 切换密码编辑状态
     */
    const editPwd = async () => {
        if (isEditPwd.value) {
            // 保存操作
            if (!pwdForm.password || !pwdForm.newPassword) {
                ElMessage.warning('请填写完整信息')
                return
            }
            if (pwdForm.newPassword !== pwdForm.confirmPassword) {
                ElMessage.warning('两次密码输入不一致')
                return
            }
            try {
                await fetchChangePassword({
                    oldPassword: pwdForm.password,
                    newPassword: pwdForm.newPassword,
                    confirmPassword: pwdForm.confirmPassword,
                })
                ElMessage.success('密码修改成功')
                // 清空表单
                pwdForm.password = ''
                pwdForm.newPassword = ''
                pwdForm.confirmPassword = ''
            } catch (error) {
                console.error('修改密码失败:', error)
                ElMessage.error('修改密码失败')
            }
        }
        isEditPwd.value = !isEditPwd.value
    }
</script>
