<template>
    <ArtSearchBar
        ref="searchBarRef"
        v-model="formData"
        :items="formItems"
        :rules="rules"
        :disabled-search="isSearchDisabled"
        :default-expanded="true"
        @reset="handleReset"
        @search="handleSearch"
    >
    </ArtSearchBar>
</template>

<script setup lang="ts">
    import { fetchGetCoachList } from '@/api/coach'
    import { fetchGetEquipmentList } from '@/api/equipment'
    import { fetchGetTrainingAreaList } from '@/api/muscle'
    import { ref, computed, onMounted, onActivated } from 'vue'

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
        { label: '全部', value: 'ALL' },
        { label: '视频动作', value: '1' },
        { label: '非视频动作', value: '2' },
        { label: '片头', value: '3' },
        { label: '片尾', value: '4' },
    ]

    // 适用场景选项
    const sceneOptions = [
        { label: '全部', value: 'ALL' },
        { label: '力量训练', value: '1' },
        { label: '普拉提', value: '2' },
        { label: '有氧减脂', value: '3' },
        { label: '拉伸康复', value: '4' },
    ]

    // 难度选项
    const difficultyOptions = [
        { label: '全部', value: 'ALL' },
        { label: '初级', value: '1' },
        { label: '中级', value: '2' },
        { label: '高级', value: '3' },
    ]

    // 状态选项
    const statusOptions = [
        { label: '全部', value: 'ALL' },
        { label: '草稿', value: '1' },
        { label: '上架', value: '2' },
        { label: '下架', value: '3' },
    ]

    // AI支持选项
    const aiSupportOptions = [
        { label: '全部', value: 'ALL' },
        { label: '支持', value: '1' },
        { label: '不支持', value: '2' },
    ]

    // 器械选项
    const instrumentOptions = ref<{ label: string; value: number; disabled?: boolean }[]>([{ label: '全部', value: 0 }])

    // 训练部位选项
    const partOptions = ref<{ label: string; value: number; disabled?: boolean }[]>([{ label: '全部', value: 0 }])

    // 记录多选的上一次选中值，用于处理“全部”与其他选项的互斥逻辑
    const prevInstrumentIds = ref<any[]>([])
    const prevMuscleRegionIds = ref<any[]>([])

    // 教练选项
    const coachOptions = ref<{ label: string; value: number | string; disabled?: boolean }[]>([
        { label: '全部', value: 'ALL' },
    ])

    /**
     * 判断筛选按钮是否应该禁用
     * 无筛选项且动作名称无内容时【筛选】按钮置灰
     */
    const isSearchDisabled = computed(() => {
        const hasFilterValue =
            formData.value.scene !== undefined ||
            formData.value.difficulty !== undefined ||
            (formData.value.instrumentIds !== undefined &&
                Array.isArray(formData.value.instrumentIds) &&
                formData.value.instrumentIds.length > 0) ||
            (formData.value.muscleRegionIds !== undefined &&
                Array.isArray(formData.value.muscleRegionIds) &&
                formData.value.muscleRegionIds.length > 0) ||
            formData.value.type !== undefined ||
            formData.value.status !== undefined ||
            formData.value.isAIAction !== undefined ||
            formData.value.coachId !== undefined

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
                onChange: handleInstrumentChange,
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
                onChange: handleMuscleRegionChange,
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
            key: 'isAIAction',
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

    // 过滤“全部”选项，对应字段不参与搜索
    function buildSearchPayload(raw: Record<string, any>) {
        const payload: Record<string, any> = {}
        const isAllTag = (v: any) => v === undefined || v === null || v === '' || v === 'ALL'

        Object.entries(raw).forEach(([key, value]) => {
            // 文本框：空字符串等价于不筛选
            if (key === 'name') {
                const v = String(value ?? '').trim()
                if (!v) return
                payload[key] = v
                return
            }

            // 多选：包含“全部”(0) 或空数组时不作为筛选条件
            if (Array.isArray(value)) {
                const filtered = value.filter(v => v !== 0 && v !== 'ALL' && v !== '' && v !== null && v !== undefined)
                if (filtered.length === 0) return
                payload[key] = filtered
                return
            }

            // 单选下拉：值为 ALL/空 等价于不筛选
            if (['scene', 'difficulty', 'type', 'status', 'isAIAction', 'coachId'].includes(key)) {
                if (isAllTag(value)) return
                payload[key] = value
                return
            }

            // 其他字段，保留原值
            if (!isAllTag(value)) {
                payload[key] = value
            }
        })

        return payload
    }

    // 器械多选：处理“全部”和其他选项的互斥逻辑
    const handleInstrumentChange = (val: any[]) => {
        if (!Array.isArray(val)) {
            formData.value.instrumentIds = val
            return
        }

        const hadAll = prevInstrumentIds.value.includes(0)
        const hasAll = val.includes(0)
        let next = [...val]

        if (!hadAll && hasAll && val.length > 1) {
            // 原来没有“全部”，这次选中了“全部”且还有其他选项 => 只保留“全部”
            next = [0]
        } else if (hadAll && hasAll && val.length > 1) {
            // 原来是“全部”，这次又选了其他选项 => 去掉“全部”，只保留其他选项
            next = val.filter(v => v !== 0)
        }

        prevInstrumentIds.value = next
        formData.value.instrumentIds = next
    }

    // 训练部位多选：处理“全部”和其他选项的互斥逻辑
    const handleMuscleRegionChange = (val: any[]) => {
        if (!Array.isArray(val)) {
            formData.value.muscleRegionIds = val
            return
        }

        const hadAll = prevMuscleRegionIds.value.includes(0)
        const hasAll = val.includes(0)
        let next = [...val]

        if (!hadAll && hasAll && val.length > 1) {
            // 原来没有“全部”，这次选中了“全部”且还有其他选项 => 只保留“全部”
            next = [0]
        } else if (hadAll && hasAll && val.length > 1) {
            // 原来是“全部”，这次又选了其他选项 => 去掉“全部”，只保留其他选项
            next = val.filter(v => v !== 0)
        }

        prevMuscleRegionIds.value = next
        formData.value.muscleRegionIds = next
    }

    async function handleSearch() {
        await searchBarRef.value.validate()
        const raw = { ...(formData.value || {}) }
        const payload = buildSearchPayload(raw)
        emit('search', payload)
        console.log('表单数据', payload)
    }

    // 获取器械列表
    const fetchInstrumentOptions = async () => {
        try {
            const res = await fetchGetEquipmentList({ page: 1, size: 20, status: '1' }) // 获取全部器械
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
    }

    //获取教练列表
    const fetchCoachOptions = async () => {
        try {
            const res = await fetchGetCoachList({ page: 1, size: 20, status: 1 }) // 获取启用教练
            console.log('获取教练列表成功:', res.list)
            if (res?.list) {
                // 将教练数据转换为选项格式，并在前面添加'全部'选项
                coachOptions.value = [
                    { label: '全部', value: 'ALL' },
                    ...res.list.map((coach: any) => ({
                        label: coach.name || '未知教练',
                        value: coach.id,
                    })),
                ]
            }
        } catch (error) {
            console.error('获取教练列表失败:', error)
        }
    }

    onMounted(async () => {
        await fetchInstrumentOptions()
        await fetchCoachOptions()
    })

    onActivated(async () => {
        await fetchInstrumentOptions()
        //await fetchCoachOptions()
    })

    defineExpose({
        fetchInstrumentOptions,
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
