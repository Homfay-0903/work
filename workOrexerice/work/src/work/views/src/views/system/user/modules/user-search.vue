<template>
    <ArtSearchBar
        ref="searchBarRef"
        v-model="formData"
        :items="formItems"
        :rules="rules"
        @reset="handleReset"
        @search="handleSearch"
    >
    </ArtSearchBar>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'

    interface Props {
        modelValue: Record<string, any>
    }
    interface Emits {
        (e: 'update:modelValue', value: Record<string, any>): void
        (e: 'search', params: Record<string, any>): void
        (e: 'reset'): void
    }
    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    // 表单数据双向绑定
    const searchBarRef = ref()
    const formData = computed({
        get: () => props.modelValue,
        set: val => emit('update:modelValue', val),
    })

    // 校验规则
    const rules = {
        // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
    }

    // 用户状态选项
    const statusOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([
        { label: '启用中', value: '0' },
        { label: '禁用中', value: '1' },
    ])

    // 性别 options
    const genderOptions = ref<{ label: string; value: number }[]>([
        { label: '男', value: 1 },
        { label: '女', value: 2 },
    ])

    // 表单配置
    const formItems = computed(() => [
        {
            label: '用户名',
            key: 'username',
            type: 'input',
            placeholder: '请输入用户名',
            clearable: true,
        },
        {
            label: '手机号',
            key: 'mobile',
            type: 'input',
            clearable: true,
            placeholder: '请输入手机号',
            //props: { placeholder: '请输入手机号', maxlength: '11' },
        },
        {
            label: '邮箱',
            key: 'email',
            type: 'input',
            clearable: true,
            placeholder: '请输入邮箱',
            //props: { placeholder: '请输入邮箱' },
        },
        {
            label: '状态',
            key: 'status',
            type: 'select',
            props: {
                placeholder: '请选择状态',
                clearable: true,
                options: statusOptions.value,
            },
        },
        {
            label: '性别',
            key: 'gender',
            type: 'select',
            props: {
                placeholder: '请选择性别',
                clearable: true,
                options: genderOptions.value,
            },
        },
    ])

    // 事件
    function handleReset() {
        console.log('重置表单')
        emit('reset')
    }

    async function handleSearch() {
        await searchBarRef.value.validate()
        // 传递 plain object 的浅拷贝，避免将 reactive Proxy 直接传入父组件引起引用问题
        //const payload = { ...(formData.value || {}) }

        const filteredData = Object.entries(formData.value).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                ;(acc as Record<string, any>)[key] = value
            }
            return acc
        }, {})

        emit('search', filteredData)
        //console.log('表单数据', payload)
    }
</script>
