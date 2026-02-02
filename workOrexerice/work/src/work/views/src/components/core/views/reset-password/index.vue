<template>
    <!-- 修改密码弹窗 -->
    <ElDialog v-model="dialogVisible" :title="adminMode ? '重置密码' : '修改密码'" width="500px">
        <ElForm :model="pwdForm" ref="pwdFormRef" :rules="pwdRules" label-width="100px">
            <!-- 当前密码（仅在非管理员模式下显示） -->
            <ElFormItem v-if="!adminMode" label="当前密码" prop="password">
                <ElInput v-model="pwdForm.password" type="password" show-password placeholder="请输入当前密码" />
            </ElFormItem>

            <ElFormItem label="新密码" prop="newPassword">
                <ElInput v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码" />
            </ElFormItem>

            <ElFormItem label="确认新密码" prop="confirmPassword">
                <ElInput
                    v-model="pwdForm.confirmPassword"
                    type="password"
                    show-password
                    placeholder="请再次输入新密码"
                />
            </ElFormItem>
        </ElForm>

        <template #footer>
            <div class="dialog-footer">
                <ElButton @click="handleClose">取消</ElButton>
                <ElButton type="primary" @click="handleChangePassword">{{ adminMode ? '重置' : '确定' }}</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { ref, reactive, watch, computed } from 'vue'
    import { ElForm, ElFormItem, ElInput, ElButton, ElDialog, ElMessage, FormInstance } from 'element-plus'
    import type { FormRules } from 'element-plus'
    import { fetchChangePassword } from '@/api/auth'
    import { HttpError } from '@/utils/http/error'

    const props = defineProps<{
        visible: boolean
        adminMode?: boolean
        userId?: number | string
    }>()

    const emit = defineEmits(['update:visible', 'close', 'success'])

    const dialogVisible = ref(props.visible)
    const pwdFormRef = ref<FormInstance>()

    // 计算属性：是否为管理员模式
    const adminMode = computed(() => props.adminMode || false)

    // 监听 visible prop 的变化
    watch(
        () => props.visible,
        newVal => {
            dialogVisible.value = newVal
        },
    )

    // 监听 dialogVisible 的变化，通知父组件
    watch(dialogVisible, newVal => {
        emit('update:visible', newVal)
    })

    /**
     * 密码验证规则
     */
    const validateConfirmPassword = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('请再次输入新密码'))
        } else if (value !== pwdForm.newPassword) {
            callback(new Error('两次密码输入不一致'))
        } else {
            callback()
        }
    }

    const validateNewPassword = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('请输入新密码'))
        } else if (value.length < 6) {
            callback(new Error('密码至少6位字符'))
        }
        //else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
        //    callback(new Error('密码必须同时包含数字和大小写字母'))
        //}
        else {
            callback()
        }
    }

    // 动态生成验证规则
    const pwdRules = computed<FormRules>(() => {
        const rules: FormRules = {
            newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
            confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
        }

        // 非管理员模式下需要验证当前密码
        if (!adminMode.value) {
            rules.password = [{ required: true, message: '请输入当前密码', trigger: 'blur' }]
        }

        return rules
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
     * 处理关闭弹窗
     */
    const handleClose = () => {
        dialogVisible.value = false
        emit('close')
    }

    /**
     * 修改密码
     */
    const handleChangePassword = async () => {
        if (!pwdFormRef.value) return

        try {
            await pwdFormRef.value.validate()

            // 根据是否为管理员模式构建请求参数
            const params: any = {
                newPassword: pwdForm.newPassword,
                confirmPassword: pwdForm.confirmPassword,
            }

            // 非管理员模式下需要传递旧密码
            if (!adminMode.value) {
                params.oldPassword = pwdForm.password
            }

            // 管理员模式下需要传递用户ID
            if (adminMode.value && props.userId) {
                params.userId = props.userId
            }

            await fetchChangePassword(params)
            ElMessage.success(adminMode.value ? '密码重置成功' : '密码修改成功')
            dialogVisible.value = false
            // 清空表单
            pwdForm.password = ''
            pwdForm.newPassword = ''
            pwdForm.confirmPassword = ''
            // 重置表单验证状态
            pwdFormRef.value.resetFields()
            emit('success')
            emit('close')
        } catch (error: any) {
            if (error?.fields) {
                // 表单验证失败
                return
            }
            // 处理 HttpError
            if (error instanceof HttpError) {
                // 显示错误消息给用户
                ElMessage.error(error.message)
            } else {
                // 处理非 HttpError
                console.error('修改密码失败:', error)
                ElMessage.error('修改密码失败')
            }
        }
    }
</script>
