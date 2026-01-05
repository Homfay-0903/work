<template>
    <ElDialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新建教练' : dialogType === 'view' ? '查看教练' : '编辑教练'"
        width="500px"
        align-center
        :close-on-click-modal="false"
    >
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
            <ElFormItem label="AI动作so库" prop="avatar">
                <ElUpload
                    class="upload-demo"
                    :action="uploadAction"
                    :before-upload="beforeUploadAvatar"
                    :on-success="handleAvatarSuccess"
                    :on-remove="handleAvatarRemove"
                    :file-list="avatarFileList"
                    list-type="text"
                    :disabled="dialogType === 'view'"
                >
                    <ElButton type="primary" :disabled="dialogType === 'view'">选择文件</ElButton>
                    <template #tip>
                        <div class="el-upload__tip">*请上传so格式的文件</div>
                    </template>
                </ElUpload>
            </ElFormItem>

            <ElFormItem label="版本号" prop="version">
                <ElInput
                    v-model="formData.version"
                    placeholder="请输入版本号"
                    :maxlength="100"
                    :show-word-limit="true"
                    :disabled="dialogType === 'view'"
                />
            </ElFormItem>
            <ElFormItem label="备注" prop="introduction">
                <ElInput
                    v-model="formData.introduction"
                    type="textarea"
                    :rows="4"
                    :maxlength="500"
                    :show-word-limit="true"
                    placeholder="请输入备注"
                    :disabled="dialogType === 'view'"
                />
            </ElFormItem>
        </ElForm>

        <template #footer>
            <div class="dialog-footer" v-if="dialogType !== 'view'">
                <ElButton @click="handleCancel">取消</ElButton>
                <ElButton type="primary" @click="handleSubmit">保存</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, watch, nextTick } from 'vue'
    import { ElMessage } from 'element-plus'
    import type { FormInstance, FormRules, UploadFile, UploadFiles } from 'element-plus'

    interface Props {
        visible: boolean
        type: string
        coachData?: Partial<Api.Coach.CoachListItem>
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void
        (e: 'submit', payload?: any): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const dialogVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const dialogType = computed(() => props.type)

    const formRef = ref<FormInstance>()
    const uploadAction = ref('') // TODO: 配置实际上传地址

    // SO文件列表
    const avatarFileList = ref<UploadFiles>([])

    // 表单数据
    const formData = reactive({
        version: '',
        avatar: '',
        introduction: '',
    })

    // 表单验证规则
    const rules: FormRules = {
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        avatar: [{ required: true, message: '请上传.so格式文件', trigger: 'change' }],
        introduction: [{ required: false, message: '请输入备注', trigger: 'blur' }],
    }

    /**
     * 初始化表单数据
     */
    const initFormData = () => {
        const isEdit = props.type === 'edit' && props.coachData
        const row = props.coachData || {}

        Object.assign(formData, {
            name: row.name || '',
            avatar: row.avatar || '',
            introduction: row.introduction || '',
        })

        // 初始化文件列表
        if (row.avatar) {
            avatarFileList.value = [{ name: 'avatar', url: row.avatar }]
        } else {
            avatarFileList.value = []
        }
    }

    /**
     * 上传SO文件前的验证
     */
    const beforeUploadAvatar = (file: File) => {
        // 验证文件后缀是否为.so
        const isValidSuffix = file.name.endsWith('.so')
        const isLt10M = file.size / 1024 / 1024 < 10

        if (!isValidSuffix) {
            ElMessage.error('请上传10MB以内.so格式文件')
            return false
        }
        if (!isLt10M) {
            ElMessage.error('文件大小不能超过10MB')
            return false
        }
        return true
    }

    /**
     * SO文件上传成功
     */
    const handleAvatarSuccess = (response: any, file: UploadFile) => {
        formData.avatar = response.url || file.url || ''
    }

    /**
     * 删除SO文件
     */
    const handleAvatarRemove = () => {
        formData.avatar = ''
    }

    /**
     * 取消
     */
    const handleCancel = () => {
        dialogVisible.value = false
    }

    /**
     * 提交
     */
    const handleSubmit = async () => {
        if (!formRef.value) return

        await formRef.value.validate(valid => {
            if (valid) {
                const payload = { ...formData }
                emit('submit', payload)
            }
        })
    }

    // 监听对话框状态
    watch(
        () => [props.visible, props.type, props.coachData],
        ([visible]) => {
            if (visible) {
                initFormData()
                nextTick(() => {
                    formRef.value?.clearValidate()
                })
            }
        },
        { immediate: true },
    )
</script>

<style lang="scss" scoped>
    :deep(.el-upload__tip) {
        color: var(--el-text-color-regular);
        font-size: 12px;
        margin-top: 4px;
    }
</style>
