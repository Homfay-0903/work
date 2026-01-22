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
                    :http-request="customUploadAvatar"
                    :before-upload="beforeUploadAvatar"
                    :on-success="handleAvatarSuccess"
                    :on-remove="handleAvatarRemove"
                    :show-file-list="false"
                    :disabled="dialogType === 'view' || avatarUploading"
                >
                    <div v-if="avatarUploading" class="upload-loading">
                        <el-icon class="is-loading"><Loading /></el-icon>
                        <span>上传中...</span>
                    </div>
                    <img v-else-if="imageUrl" :src="imageUrl" class="coverImage" />
                    <el-icon v-else class="uploader-icon"><Plus /></el-icon>
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
    import type { FormInstance, FormRules, UploadFile, UploadProps } from 'element-plus'
    import { Plus, Loading } from '@element-plus/icons-vue'
    import { fetchUploadImage } from '@/api/upload'

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

    const imageUrl = ref('')
    const avatarUploading = ref(false)

    // 表单数据
    const formData = reactive({
        id: 0,
        name: '',
        avatar: '',
        introduction: '',
    })

    // 表单验证规则
    const rules: FormRules = {
        name: [{ required: true, message: '请输入教练名称', trigger: 'blur' }],
        avatar: [{ required: true, message: '请上传教练头像', trigger: 'change' }],
        introduction: [{ required: true, message: '请输入教练介绍', trigger: 'blur' }],
    }

    /**
     * 初始化表单数据
     */
    const initFormData = () => {
        const row = props.coachData || {}

        Object.assign(formData, {
            id: row.id || 0,
            name: row.name || '',
            avatar: (row as any)._avatar || row.avatar || '',
            introduction: row.introduction || '',
        })

        imageUrl.value = row.avatar || ''
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
    const handleAvatarSuccess = (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        const displayUrl = response?.url || response?.tmpUrl || ''
        const storageUrl = response?._url || file.url || ''

        formData.avatar = storageUrl

        if (displayUrl) {
            imageUrl.value = displayUrl
        }
    }

    /**
     * 删除头像
     */
    const handleAvatarRemove = () => {
        formData.avatar = ''
        imageUrl.value = ''
    }

    /**
     * 自定义上传方法，使用我们实现的上传接口
     */
    const customUploadAvatar: UploadProps['httpRequest'] = ({ file, onSuccess, onError, onProgress }) => {
        avatarUploading.value = true
        return fetchUploadImage({
            file,
            onUploadProgress: onProgress,
        })
            .then(response => {
                onSuccess(response)
                return response
            })
            .catch(error => {
                onError(error)
                throw error
            })
            .finally(() => {
                avatarUploading.value = false
            })
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

    .upload-demo .coverImage {
        width: 150px;
        height: 150px;
        display: block;
        object-fit: cover;
    }

    .upload-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 150px;
        color: var(--el-color-primary);
        font-size: 14px;
    }
</style>

<style>
    .upload-demo .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .upload-demo .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        text-align: center;
    }
</style>
