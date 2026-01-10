<template>
    <ElDialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新建动作库' : dialogType === 'view' ? '查看动作库' : '更新动作库'"
        width="500px"
        align-center
        :close-on-click-modal="false"
    >
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
            <ElFormItem label="AI动作so库" prop="soPath">
                <ElUpload
                    class="upload-demo"
                    :http-request="customUploadSoFile"
                    :before-upload="beforeUploadSoFile"
                    :on-success="handleSoFileSuccess"
                    :on-remove="handleSoFileRemove"
                    :show-file-list="false"
                    :disabled="dialogType === 'view' || soFileUploading"
                >
                    <div v-if="soFileUploading" class="upload-loading">
                        <el-icon class="is-loading"><Loading /></el-icon>
                        <span>上传中...</span>
                    </div>
                    <div v-else-if="soFileUrl" class="file-info">
                        <el-icon class="file-icon"><Document /></el-icon>
                        <span class="file-name">{{ soFileName }}</span>
                    </div>
                    <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                    <template #tip>
                        <div class="el-upload__tip">请上传10MB以内.so格式文件</div>
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
            <ElFormItem label="备注" prop="remark">
                <ElInput
                    v-model="formData.remark"
                    type="textarea"
                    :rows="4"
                    :maxlength="500"
                    :show-word-limit="true"
                    placeholder="请输入备注"
                    :disabled="dialogType === 'view'"
                />
            </ElFormItem>
            <ElFormItem label="动作数据" prop="file">
                <ElUpload
                    class="upload-demo"
                    :http-request="customUploadActionData"
                    :before-upload="beforeUploadActionData"
                    :on-success="handleActionDataSuccess"
                    :on-remove="handleActionDataRemove"
                    :show-file-list="false"
                    :disabled="dialogType === 'view' || actionDataUploading"
                >
                    <div v-if="actionDataUploading" class="upload-loading">
                        <el-icon class="is-loading"><Loading /></el-icon>
                        <span>上传中...</span>
                    </div>
                    <div v-else-if="actionDataUrl" class="file-info">
                        <el-icon class="file-icon"><Document /></el-icon>
                        <span class="file-name">{{ actionDataName }}</span>
                    </div>
                    <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                    <template #tip>
                        <div class="el-upload__tip">请上传10MB以内.json格式文件</div>
                    </template>
                </ElUpload>
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
    import { Plus, Loading, Document } from '@element-plus/icons-vue'
    import { fetchUploadSoAndJson } from '@/api/upload'

    interface Props {
        visible: boolean
        type: string
        actionData?: Partial<Api.Ai.AiListItem>
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

    const soFileUrl = ref('')
    const soFileName = ref('')
    const soFileUploading = ref(false)

    const actionDataUrl = ref('')
    const actionDataName = ref('')
    const actionDataUploading = ref(false)
    const actionDataFile = ref<File | null>(null)

    const formData = reactive({
        version: '',
        soPath: '',
        remark: '',
        file: '',
    })

    const rules: FormRules = {
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        soPath: [{ required: true, message: '请上传.so格式文件', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        file: [{ required: true, message: '请上传.json格式文件', trigger: 'change' }],
    }

    const initFormData = () => {
        const row = props.actionData || {}

        Object.assign(formData, {
            version: row.version || '',
            soPath: row.soPath || '',
            file: row.file || '',
            remark: row.remark || '',
        })

        soFileUrl.value = (row as any)._soPath || row.soPath || ''
        soFileName.value = (row as any)._soPath || row.soPath?.split('/').pop() || ''

        actionDataUrl.value = (row as any)._file || row.file || ''
        actionDataName.value = (row as any)._file || row.file?.split('/').pop() || ''
    }

    const beforeUploadSoFile = (file: File) => {
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

    const handleSoFileSuccess = (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        const displayUrl = response?._url || response?.tmpUrl || ''
        const storageUrl = response?.url || file.url || ''

        formData.soPath = storageUrl

        if (displayUrl) {
            soFileUrl.value = displayUrl
        }
        soFileName.value = file.name
    }

    const handleSoFileRemove = () => {
        formData.soPath = ''
        soFileUrl.value = ''
        soFileName.value = ''
    }

    const customUploadSoFile: UploadProps['httpRequest'] = ({ file, onSuccess, onError, onProgress }) => {
        soFileUploading.value = true
        return fetchUploadSoAndJson({
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
                soFileUploading.value = false
            })
    }

    const beforeUploadActionData = (file: File) => {
        const isValidSuffix = file.name.endsWith('.json')
        const isLt10M = file.size / 1024 / 1024 < 10

        if (!isValidSuffix) {
            ElMessage.error('请上传10MB以内.json格式文件')
            return false
        }
        if (!isLt10M) {
            ElMessage.error('文件大小不能超过10MB')
            return false
        }
        return true
    }

    const handleActionDataSuccess = (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        actionDataFile.value = file.raw || null
        actionDataUrl.value = file.name
        actionDataName.value = file.name
    }

    const handleActionDataRemove = () => {
        formData.file = ''
        actionDataUrl.value = ''
        actionDataName.value = ''
        actionDataFile.value = null
    }

    const customUploadActionData: UploadProps['httpRequest'] = ({ file, onSuccess }) => {
        return new Promise<void>(resolve => {
            actionDataUploading.value = true
            setTimeout(() => {
                onSuccess({
                    url: '',
                    _url: '',
                    tmpUrl: '',
                    filename: (file as File).name,
                    path: '',
                } as Api.Common.UploadFileResponse)
                actionDataUploading.value = false
                resolve()
            }, 500)
        })
    }

    const handleCancel = () => {
        dialogVisible.value = false
    }

    const handleSubmit = async () => {
        if (!formRef.value) return

        await formRef.value.validate(valid => {
            if (valid) {
                const payload = {
                    ...formData,
                    file: actionDataFile.value,
                }
                emit('submit', payload)
            }
        })
    }

    watch(
        () => [props.visible, props.type, props.actionData],
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

    .upload-demo .file-info {
        width: 150px;
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px;

        .file-icon {
            font-size: 32px;
            color: var(--el-color-primary);
        }

        .file-name {
            font-size: 12px;
            color: var(--el-text-color-regular);
            text-align: center;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
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
