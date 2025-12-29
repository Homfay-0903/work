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
    import { fetchGetCoachList } from '@/api/coach'
    import { fetchGetEquipmentList } from '@/api/equipment'
    import { fetchGetTrainingAreaList } from '@/api/muscle'

    import { ref, computed, onMounted } from 'vue'

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
        { label: '视频动作', value: '1' },
        { label: '非视频动作', value: '2' },
        { label: '片头', value: '3' },
        { label: '片尾', value: '4' },
    ]

    // 适用场景选项
    const sceneOptions = [
        { label: '全部', value: '' },
        { label: '力量训练', value: '1' },
        { label: '普拉提', value: '2' },
        { label: '有氧减脂', value: '3' },
        { label: '拉伸康复', value: '4' },
    ]

    // 难度选项
    const difficultyOptions = [
        { label: '全部', value: '' },
        { label: '初级', value: '1' },
        { label: '中级', value: '2' },
        { label: '高级', value: '3' },
    ]

    // 状态选项
    const statusOptions = [
        { label: '全部', value: '' },
        { label: '草稿', value: '1' },
        { label: '上架', value: '2' },
        { label: '下架', value: '3' },
    ]

    // AI支持选项
    const aiSupportOptions = [
        { label: '全部', value: '' },
        { label: '支持', value: 'true' },
        { label: '不支持', value: 'false' },
    ]

    // 器械选项（示例，后续可以从API获取）
    const instrumentOptions = ref<{ label: string; value: number[]; disabled?: boolean }[]>([
        { label: '全部', value: [] },
        // TODO: 从API获取器械列表
    ])

    // 训练部位选项（示例，后续可以从API获取）
    const partOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([
        { label: '全部', value: '' },
        // TODO: 从API获取训练部位列表
    ])

    // 教练选项（示例，后续可以从API获取）
    const coachOptions = ref<{ label: string; value: number; disabled?: boolean }[]>([
        { label: '全部', value: 0 },
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
            (formData.value.instrumentIds !== undefined && formData.value.instrumentIds.length > 0) ||
            (formData.value.muscleRegionIds !== undefined && formData.value.muscleRegionIds.length > 0) ||
            (formData.value.type !== undefined && formData.value.type !== '') ||
            (formData.value.status !== undefined && formData.value.status !== '') ||
            (formData.value.aiSupport !== undefined && formData.value.aiSupport !== '') ||
            (formData.value.coachId !== undefined && formData.value.coachId !== 0)

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
            key: 'instrumentIds',
            type: 'select',
            props: {
                placeholder: '请选择器械',
                clearable: true,
                multiple: true,
                options: instrumentOptions.value,
            },
        },
        {
            label: '训练部位',
            key: 'muscleRegionIds',
            type: 'select',
            props: {
                placeholder: '请选择训练部位',
                clearable: true,
                multiple: true,
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
            key: 'coachId',
            type: 'select',
            props: {
                placeholder: '请选择教练',
                clearable: true,
                options: coachOptions.value,
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

    // 获取教练列表
    onMounted(async () => {
        try {
            const res = await fetchGetCoachList({ page: 1, size: 20 }) // 获取全部教练
            console.log('获取教练列表成功:', res.list)
            if (res?.list) {
                // 将教练数据转换为选项格式，并在前面添加'全部'选项
                coachOptions.value = [
                    { label: '全部', value: 0 },
                    ...res.list.map((coach: any) => ({
                        label: coach.name || '未知教练',
                        value: coach.id,
                    })),
                ]
            }
        } catch (error) {
            console.error('获取教练列表失败:', error)
        }
    })

    // 获取器械列表
    onMounted(async () => {
        try {
            const res = await fetchGetEquipmentList({ page: 1, size: 20 }) // 获取全部器械
            console.log('获取器械列表成功:', res.list)
            if (res?.list) {
                // 将器械数据转换为选项格式，并在前面添加'全部'选项
                instrumentOptions.value = [
                    { label: '全部', value: 0 },
                    ...res.list.map((instrument: any) => ({
                        label: instrument.name || '未知器械',
                        value: instrument.id,
                    })),
                ]
            }
        } catch (error) {
            console.error('获取器械列表失败:', error)
        }
    })

    // 获取训练部位列表
    onMounted(async () => {
        try {
            const res = await fetchGetTrainingAreaList() // 获取全部训练部位
            console.log('获取训练部位列表成功:', res)
            if (res) {
                // 将训练部位数据转换为选项格式，并在前面添加'全部'选项
                partOptions.value = [
                    { label: '全部', value: 0 },
                    ...(Array.isArray(res) ? res : []).map((region: any) => ({
                        label: region.name || '未知训练部位',
                        value: region.id,
                    })),
                ]
            }
        } catch (error) {
            console.error('获取训练部位列表失败:', error)
        }
    })
</script>
