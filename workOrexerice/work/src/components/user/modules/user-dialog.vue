<template>
    <ElDialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加用户' : '编辑用户'" width="30%" align-center>
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
            <ElFormItem label="用户名" prop="username">
                <ElInput v-model="formData.username" placeholder="请输入用户名" />
            </ElFormItem>
            <ElFormItem label="手机号" prop="mobile">
                <ElInput v-model="formData.mobile" placeholder="请输入手机号" />
            </ElFormItem>
            <ElFormItem label="性别" prop="gender">
                <ElSelect v-model="formData.gender">
                    <ElOption label="男" :value="1" />
                    <ElOption label="女" :value="2" />
                </ElSelect>
            </ElFormItem>
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
</template>

<script setup lang="ts">
    import { fetchGetRoleList } from '@/api/system-manage'
    import { ElMessage } from 'element-plus'
    import type { FormInstance, FormRules } from 'element-plus'

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

    // 角色列表数据（规范为 { id, name }）
    const roleList = ref<Array<{ id: number; name: string }>>([])

    // 对话框显示控制
    const dialogVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const dialogType = computed(() => props.type)

    // 表单实例
    const formRef = ref<FormInstance>()

    // 表单数据（与后端字段对应）
    const formData = reactive({
        username: '',
        mobile: '',
        gender: 1 as number,
        role: [] as number[],
    })

    // 表单验证规则
    const rules: FormRules = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
        ],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    }

    /**
     * 初始化表单数据
     * 根据对话框类型（新增/编辑）填充表单
     */
    const initFormData = () => {
        const isEdit = props.type === 'edit' && props.userData
        const row = props.userData

        Object.assign(formData, {
            username: isEdit && row ? row.username || '' : '',
            mobile: isEdit && row ? row.mobile || '' : '',
            gender: isEdit && row ? (typeof row.gender === 'number' ? row.gender : 1) : 1,
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
            const res = await fetchGetRoleList({ page: 1, size: 100 })
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
        ([visible]) => {
            if (visible) {
                initFormData()
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
                    mobile: formData.mobile,
                    gender: Number(formData.gender),
                }
                if (dialogType.value === 'edit' && props.userData && props.userData.id) {
                    payload.id = props.userData.id
                    payload.userRoles = formData.role.map(rid => ({ userId: props.userData?.id, roleId: Number(rid) }))
                }

                ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
                dialogVisible.value = false
                emit('submit', payload)
            }
        })
    }
</script>
