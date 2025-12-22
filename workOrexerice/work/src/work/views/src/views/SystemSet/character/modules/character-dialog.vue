<template>
    <ElDialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增角色' : dialogType === 'view' ? '查看角色' : '编辑角色'"
        width="500px"
        align-center
        :close-on-click-modal="false"
    >
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
            <ElFormItem label="角色名称" prop="name">
                <ElInput
                    v-model="formData.name"
                    placeholder="请输入"
                    :maxlength="100"
                    :show-word-limit="true"
                    :disabled="dialogType === 'view'"
                />
            </ElFormItem>

            <ElFormItem label="角色描述" prop="description">
                <ElInput
                    v-model="formData.description"
                    type="textarea"
                    :rows="4"
                    :maxlength="500"
                    :show-word-limit="true"
                    placeholder="请输入"
                    :disabled="dialogType === 'view'"
                />
            </ElFormItem>
        </ElForm>

        <template #footer>
            <div class="dialog-footer" v-if="dialogType !== 'view'">
                <ElButton @click="handleCancel">取消</ElButton>
                <ElButton type="primary" @click="handleSubmit">提交</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, watch, nextTick } from 'vue'
    import type { FormInstance, FormRules } from 'element-plus'

    interface Props {
        visible: boolean
        type: 'add' | 'edit' | 'view'
        characterData?: Partial<Api.Character.CharacterListItem>
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void
        (e: 'submit', payload?: Partial<Api.Character.CharacterListItem>): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const dialogVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const dialogType = computed(() => props.type)

    const formRef = ref<FormInstance>()

    // 表单数据
    const formData = reactive({
        name: '',
        description: '',
    })

    // 表单验证规则
    const rules: FormRules = {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
    }

    /**
     * 初始化表单数据
     */
    const initFormData = () => {
        const row = props.characterData || {}

        Object.assign(formData, {
            name: row.name || '',
            description: row.description || '',
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
                const payload: Partial<Api.Character.CharacterListItem> = {
                    ...formData,
                }
                if (props.type === 'edit' && props.characterData?.id) {
                    payload.id = props.characterData.id
                }
                emit('submit', payload)
            }
        })
    }

    // 监听对话框状态
    watch(
        () => [props.visible, props.type, props.characterData],
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
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
</style>
