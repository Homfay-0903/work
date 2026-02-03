<template>
    <ElDialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加用户' : '编辑用户'" width="30%" align-center>
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
            <ElFormItem label="用户名" prop="username">
                <ElInput v-model="formData.username" placeholder="请输入用户名" />
            </ElFormItem>
            <ElFormItem label="账号密码" prop="password">
                <ElInput
                    v-if="dialogType === 'add'"
                    v-model="formData.password"
                    placeholder="请输入密码"
                    type="password"
                    show-password
                />
                <div v-else class="flex items-center">
                    <ElInput v-model="formData.password" placeholder="********" type="password" disabled />
                    <ElButton type="primary" link class="ml-4 shrink-0" @click="showPasswordDialog = true">
                        修改密码
                    </ElButton>
                </div>
            </ElFormItem>
            <ElFormItem v-if="dialogType === 'add'" label="确认密码" prop="confirmPassword">
                <ElInput
                    v-model="formData.confirmPassword"
                    placeholder="请输入确认密码"
                    type="password"
                    show-password
                />
            </ElFormItem>
            <!---
            <ElFormItem label="昵称" prop="nickname">
                <ElInput v-model="formData.nickname" placeholder="请输入昵称" />
            </ElFormItem>
            <ElFormItem label="手机号" prop="mobile">
                <ElInput v-model="formData.mobile" placeholder="请输入手机号" />
            </ElFormItem>
            <ElFormItem label="邮箱" prop="email">
                <ElInput v-model="formData.email" placeholder="请输入邮箱" />
            </ElFormItem>
            <ElFormItem label="性别" prop="gender">
                <ElSelect v-model="formData.gender">
                    <ElOption label="未知" :value="0" />
                    <ElOption label="男" :value="1" />
                    <ElOption label="女" :value="2" />
                </ElSelect>
            </ElFormItem>
            -->
            <ElFormItem label="角色" prop="role">
                <ElSelect v-model="formData.role" multiple>
                    <ElOption v-for="role in roleList" :key="role.id" :value="role.id" :label="role.name" />
                </ElSelect>
            </ElFormItem>
        </ElForm>
        <template #footer>
            <div class="dialog-footer">
                <ElButton @click="dialogVisible = false">取消</ElButton>
                <ElButton type="primary" @click="handleSubmit">提交</ElButton>
            </div>
        </template>
    </ElDialog>
    <!-- 修改密码弹窗 -->
    <ResetPassword
        ref="resetPasswordRef"
        v-model:visible="showPasswordDialog"
        :admin-mode="true"
        :user-id="props.userData?.id"
        @close="showPasswordDialog = false"
        @success="handlePasswordSuccess"
    />
</template>

<script setup lang="ts">
    import { fetchGetRoleList } from '@/api/system-manage'
    import { ElMessage } from 'element-plus'
    import type { FormInstance, FormRules } from 'element-plus'
    import { computed, nextTick, reactive, ref, watch } from 'vue'
    import ResetPassword from '@/components/core/views/reset-password/index.vue'

    interface Props {
        visible: boolean
        type: string
        userData?: Partial<Api.SystemManage.UserListItem>
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void
        (e: 'submit', payload?: any): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    // 角色列表数据
    const roleList = ref<Array<{ id: number; name: string }>>([])

    //密码修改弹窗显示控制
    const showPasswordDialog = ref(false)

    // 对话框显示控制
    const dialogVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const dialogType = computed(() => props.type)

    // 表单实例
    const formRef = ref<FormInstance>()

    // 表单数据
    const formData = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        mobile: '',
        email: '',
        gender: 0 as number,
        role: [] as number[],
    })

    /**
     * 密码验证规则
     * @param rule 验证规则
     * @param value 密码值
     * @param callback 验证回调
     */
    const validatePassword = (rule: any, value: string, callback: any) => {
        if (!value && dialogType.value === 'add') {
            callback(new Error('请输入密码'))
        } else {
            if (formData.confirmPassword) {
                formRef.value?.validateField('confirmPassword')
            }
        }
        callback()
    }

    /**
     * 确认密码验证规则
     * @param rule 验证规则
     * @param value 确认密码值
     * @param callback 验证回调
     */
    const validateConfirmPassword = (rule: any, value: string, callback: any) => {
        if (!value) {
            callback(new Error('请输入确认密码'))
        } else if (value !== formData.password) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    }

    // 表单验证规则
    const rules = computed<FormRules>(() => {
        const isEdit = dialogType.value === 'edit'
        return {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
            ],
            password: [
                { required: !isEdit, validator: validatePassword, trigger: 'blur' },
                { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
            ],
            confirmPassword: [
                { required: !isEdit, validator: validateConfirmPassword, trigger: 'blur' },
                { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
            ],
            //nickname: [
            //    { required: false, message: '请输入昵称', trigger: 'blur' },
            //    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
            //],
            //mobile: [
            //    { required: true, message: '请输入手机号', trigger: 'blur' },
            //    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
            //],
            //email: [
            //    { required: false, message: '请输入邮箱', trigger: 'blur' },
            //    {
            //        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            //        message: '请输入正确的邮箱格式',
            //        trigger: 'blur',
            //    },
            //],
            //gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
            role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        }
    })

    const handlePasswordSuccess = () => {
        showPasswordDialog.value = false
        ElMessage.success('密码修改成功')
    }

    /**
     * 初始化表单数据
     * 根据对话框类型（新增/编辑）填充表单
     */
    const initFormData = async () => {
        const isEdit = props.type === 'edit' && props.userData
        const row = props.userData

        Object.assign(formData, {
            username: isEdit && row ? row.username || '' : '',
            password: isEdit && row ? '' : '',
            confirmPassword: isEdit && row ? '' : '',
            //nickname: isEdit && row ? row.nickname || '' : '',
            //mobile: isEdit && row ? row.mobile || '' : '',
            //email: isEdit && row ? row.email || '' : '',
            //gender: isEdit && row ? (typeof row.gender === 'number' ? row.gender : 0) : 0,
            // 将后端传回的 role 对象或 userRoles 转换为 role id 数组
            role:
                isEdit && row && Array.isArray(row.userRoles)
                    ? row.userRoles.map((r: any) => r.id ?? r.roleId ?? Number(r))
                    : [],
        })
    }

    // 加载角色列表
    const loadRoles = async () => {
        try {
            const res = await fetchGetRoleList({ page: 1, size: 100, status: 0 })
            const list = (res && (res as any).list) || []
            roleList.value = list.map((r: any) => ({
                id: Number(r.id ?? r.roleId),
                name: r.name ?? r.roleName ?? r.roleCode,
            }))

            if (roleList.value.length === 0) {
                ElMessage.warning('未获取到角色数据，请在后台检查角色接口')
            }
            return
        } catch (err) {
            console.log(err)
            ElMessage.error('获取角色列表失败')
            roleList.value = []
        }
    }

    /**
     * 监听对话框状态变化
     * 当对话框打开时初始化表单数据并清除验证状态
     */
    watch(
        () => [props.visible, props.type, props.userData],
        async ([visible]) => {
            await initFormData()

            if (visible) {
                loadRoles()
                nextTick(() => {
                    formRef.value?.clearValidate()
                })
            }
        },
        { immediate: true },
    )

    /**
     * 提交表单
     * 验证通过后触发提交事件
     */
    const handleSubmit = async () => {
        if (!formRef.value) return

        await formRef.value.validate(valid => {
            if (valid) {
                const payload: any = {
                    username: formData.username,
                    roleIds: formData.role,
                    //nickname: formData.nickname,
                    //mobile: formData.mobile,
                    //email: formData.email,
                    //gender: Number(formData.gender),
                }

                // 只有当用户输入了密码时才包含密码字段
                if (formData.password) {
                    payload.password = formData.password
                }

                if (dialogType.value === 'edit' && props.userData && props.userData.id) {
                    payload.id = props.userData.id
                    payload.userRoles = formData.role.map(rid => ({ userId: props.userData?.id, roleId: Number(rid) }))
                }

                emit('submit', payload)
            }
        })
    }
</script>
