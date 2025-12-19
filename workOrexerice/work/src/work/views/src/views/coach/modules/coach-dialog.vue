<template>
    <ElDialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新建教练' : dialogType === 'view' ? '查看教练' : '编辑教练'"
        width="500px"
        align-center
        :close-on-click-modal="false"
    >
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
            <ElFormItem label="教练名称" prop="name">
                <ElInput
                    v-model="formData.name"
                    placeholder="请输入教练名称"
                    :maxlength="100"
                    :show-word-limit="true"
                    :disabled="dialogType === 'view'"
                />
            </ElFormItem>

            <ElFormItem label="教练头像" prop="avatar">
                <ElUpload
                    class="upload-demo"
                    :action="uploadAction"
                    :before-upload="beforeUploadAvatar"
                    :on-success="handleAvatarSuccess"
                    :on-remove="handleAvatarRemove"
                    :file-list="avatarFileList"
                    list-type="picture"
                    :disabled="dialogType === 'view'"
                >
                    <ElButton type="primary" :disabled="dialogType === 'view'">选择图片</ElButton>
                    <template #tip>
                        <div class="el-upload__tip">*建议上传10MB以内的JPG、PNG、JPEG格式</div>
                    </template>
                </ElUpload>
            </ElFormItem>

            <ElFormItem label="教练介绍" prop="introduction">
                <ElInput
                    v-model="formData.introduction"
                    type="textarea"
                    :rows="4"
                    :maxlength="500"
                    :show-word-limit="true"
                    placeholder="请输入教练介绍"
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

    // 文件列表
    const avatarFileList = ref<UploadFiles>([])

    // 表单数据
    const formData = reactive({
        name: '',
        avatar: '',
        introduction: '',
    })

    // 表单验证规则
    const rules: FormRules = {
        name: [{ required: true, message: '请输入教练名称', trigger: 'blur' }],
        avatar: [{ required: false, message: '请上传教练头像', trigger: 'change' }],
        introduction: [{ required: false, message: '请输入教练介绍', trigger: 'blur' }],
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
     * 上传头像前的验证
     */
    const beforeUploadAvatar = (file: File) => {
        const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
        const isLt10M = file.size / 1024 / 1024 < 10

        if (!isValidType) {
            ElMessage.error('请上传10MB以内JPG、PNG、JPEG格式图片')
            return false
        }
        if (!isLt10M) {
            ElMessage.error('图片大小不能超过10MB')
            return false
        }
        return true
    }

    /**
     * 头像上传成功
     */
    const handleAvatarSuccess = (response: any, file: UploadFile) => {
        formData.avatar = response.url || file.url || ''
    }

    /**
     * 删除头像
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
