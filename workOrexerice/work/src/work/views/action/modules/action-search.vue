<template>
    <ArtSearchBar
        ref="searchBarRef"
        v-model="formData"
        :items="formItems"
        :rules="rules"
        :disabled-search="isSearchDisabled"
        @reset="handleReset"
        @search="handleSearch"
    >
    </ArtSearchBar>
</template>

<script setup lang="ts">
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
    const rules = {}

    // 动作类型选项
    const typeOptions = [
        { label: '全部', value: '' },
        { label: '类型1', value: '1' },
        { label: '类型2', value: '2' },
        { label: '类型3', value: '3' },
    ]

    // 适用场景选项
    const sceneOptions = [
        { label: '全部', value: '' },
        { label: '场景1', value: '1' },
        { label: '场景2', value: '2' },
        { label: '场景3', value: '3' },
    ]

    // 难度选项
    const difficultyOptions = [
        { label: '全部', value: '' },
        { label: '简单', value: '1' },
        { label: '中等', value: '2' },
        { label: '困难', value: '3' },
    ]

    // 状态选项
    const statusOptions = [
        { label: '全部', value: '' },
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' },
    ]

    // AI支持选项
    const aiSupportOptions = [
        { label: '全部', value: '' },
        { label: '支持', value: 'true' },
        { label: '不支持', value: 'false' },
    ]

    // 器械选项（示例，后续可以从API获取）
    const equipmentOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([
        { label: '全部', value: '' },
        // TODO: 从API获取器械列表
    ])

    // 训练部位选项（示例，后续可以从API获取）
    const partOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([
        { label: '全部', value: '' },
        // TODO: 从API获取训练部位列表
    ])

    // 教练选项（示例，后续可以从API获取）
    const trainerOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([
        { label: '全部', value: '' },
        // TODO: 从API获取教练列表
    ])

    /**
     * 判断筛选按钮是否应该禁用
     * 无筛选项且动作名称无内容时【筛选】按钮置灰
     */
    const isSearchDisabled = computed(() => {
        const hasFilterValue =
            (formData.value.scene !== undefined && formData.value.scene !== '') ||
            (formData.value.difficulty !== undefined && formData.value.difficulty !== '') ||
            (formData.value.equipment !== undefined && formData.value.equipment !== '') ||
            (formData.value.part !== undefined && formData.value.part !== '') ||
            (formData.value.type !== undefined && formData.value.type !== '') ||
            (formData.value.status !== undefined && formData.value.status !== '') ||
            (formData.value.aiSupport !== undefined && formData.value.aiSupport !== '') ||
            (formData.value.trainer !== undefined && formData.value.trainer !== '')

        const hasNameValue = formData.value.name && String(formData.value.name).trim() !== ''

        // 无筛选项且动作名称无内容时禁用
        return !hasFilterValue && !hasNameValue
    })

    // 表单配置
    const formItems = computed(() => [
        {
            label: '适用场景',
            key: 'scene',
            type: 'select',
            props: {
                placeholder: '请选择适用场景',
                clearable: true,
                options: sceneOptions,
            },
        },
        {
            label: '难度',
            key: 'difficulty',
            type: 'select',
            props: {
                placeholder: '请选择难度',
                clearable: true,
                options: difficultyOptions,
            },
        },
        {
            label: '器械',
            key: 'equipment',
            type: 'select',
            props: {
                placeholder: '请选择器械',
                clearable: true,
                options: equipmentOptions.value,
            },
        },
        {
            label: '训练部位',
            key: 'part',
            type: 'select',
            props: {
                placeholder: '请选择训练部位',
                clearable: true,
                options: partOptions.value,
            },
        },
        {
            label: '动作类型',
            key: 'type',
            type: 'select',
            props: {
                placeholder: '请选择动作类型',
                clearable: true,
                options: typeOptions,
            },
        },
        {
            label: '状态',
            key: 'status',
            type: 'select',
            props: {
                placeholder: '请选择状态',
                clearable: true,
                options: statusOptions,
            },
        },
        {
            label: 'AI支持',
            key: 'aiSupport',
            type: 'select',
            props: {
                placeholder: '请选择AI支持',
                clearable: true,
                options: aiSupportOptions,
            },
        },
        {
            label: '教练',
            key: 'trainer',
            type: 'select',
            props: {
                placeholder: '请选择教练',
                clearable: true,
                options: trainerOptions.value,
            },
        },
        {
            label: '动作名称',
            key: 'name',
            type: 'input',
            props: {
                placeholder: '请输入动作名称',
                clearable: true,
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
        const payload = { ...(formData.value || {}) }
        emit('search', payload)
        console.log('表单数据', payload)
    }
</script>
