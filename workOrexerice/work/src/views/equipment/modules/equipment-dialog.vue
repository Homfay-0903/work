<template>
    <ElDialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '添加器械' : dialogType === 'view' ? '查看器械' : '编辑器械'"
        width="500px"
        align-center
        :close-on-click-modal="false"
    >
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
            <ElFormItem label="器械名称" prop="name">
                <ElInput
                    v-model="formData.name"
                    placeholder="请输入器械名称"
                    :maxlength="100"
                    :show-word-limit="true"
                    :disabled="dialogType === 'view'"
                />
            </ElFormItem>

            <ElFormItem label="器械图标" prop="icon">
                <ElUpload
                    class="upload-demo"
                    :action="uploadAction"
                    :before-upload="beforeUploadIcon"
                    :on-success="handleIconSuccess"
                    :on-remove="handleIconRemove"
                    :file-list="iconFileList"
                    list-type="picture"
                    :disabled="dialogType === 'view'"
                >
                    <ElButton type="primary" :disabled="dialogType === 'view'">选择图片</ElButton>
                    <template #tip>
                        <div class="el-upload__tip">建议尺寸:90x90像素</div>
                    </template>
                </ElUpload>
                <div v-if="formData.icon" class="icon-preview">
                    <ElImage :src="formData.icon" style="width: 90px; height: 90px" fit="cover" />
                </div>
            </ElFormItem>
        </ElForm>

        <template #footer>
            <div class="dialog-footer" v-if="dialogType !== 'view'">
                <ElButton @click="handleCancel">取消</ElButton>
                <ElButton type="primary" @click="handleSubmit">确定</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, watch, nextTick } from 'vue'
    import { ElMessage, ElImage } from 'element-plus'
    import type { FormInstance, FormRules, UploadFile, UploadFiles } from 'element-plus'

    interface Props {
        visible: boolean
        type: string
        equipmentData?: Partial<Api.Equipment.EquipmentListItem>
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
    const iconFileList = ref<UploadFiles>([])

    // 表单数据
    const formData = reactive({
        name: '',
        icon: '',
    })

    // 表单验证规则
    const rules: FormRules = {
        name: [{ required: true, message: '请输入器械名称', trigger: 'blur' }],
        icon: [{ required: false, message: '请上传器械图标', trigger: 'change' }],
    }

    /**
     * 初始化表单数据
     */
    const initFormData = () => {
        const isEdit = props.type === 'edit' && props.equipmentData
        const row = props.equipmentData || {}

        Object.assign(formData, {
            name: row.name || '',
            icon: row.icon || '',
        })

        // 初始化文件列表
        if (row.icon) {
            iconFileList.value = [{ name: 'icon', url: row.icon }]
        } else {
            iconFileList.value = []
        }
    }

    /**
     * 上传图标前的验证
     */
    const beforeUploadIcon = (file: File) => {
        const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
        const isLt10M = file.size / 1024 / 1024 < 10

        if (!isValidType) {
            ElMessage.error('请上传JPG、PNG、JPEG格式图片')
            return false
        }
        if (!isLt10M) {
            ElMessage.error('图片大小不能超过10MB')
            return false
        }
        return true
    }

    /**
     * 图标上传成功
     */
    const handleIconSuccess = (response: any, file: UploadFile) => {
        formData.icon = response.url || file.url || ''
    }

    /**
     * 删除图标
     */
    const handleIconRemove = () => {
        formData.icon = ''
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
        () => [props.visible, props.type, props.equipmentData],
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

    .icon-preview {
        margin-top: 8px;
    }
</style>
