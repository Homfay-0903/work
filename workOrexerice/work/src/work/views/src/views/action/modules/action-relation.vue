<template>
    <ElDialog
        v-model="innerVisible"
        :title="dialogTitle"
        width="60%"
        align-center
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="relation-dialog">
            <!-- 搜索区域（预留，当前只展示输入框和按钮，不做真实查询） -->
            <div class="relation-search">
                <ElForm :inline="true" :model="searchForm" label-width="80px">
                    <ElFormItem :label="searchLabelId">
                        <ElInput v-model="searchForm.id" :placeholder="`请输入${searchLabelId}`" />
                    </ElFormItem>
                    <ElFormItem :label="searchLabelName">
                        <ElInput v-model="searchForm.name" :placeholder="`请输入${searchLabelName}`" />
                    </ElFormItem>
                    <ElFormItem>
                        <ElButton type="primary" @click="handleSearch">搜索</ElButton>
                        <ElButton @click="handleResetSearch">清空</ElButton>
                    </ElFormItem>
                </ElForm>
            </div>

            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData" />

            <!-- 列表 -->
            <ArtTable
                :loading="loading"
                :data="data"
                :columns="columns"
                :pagination="pagination"
                rowKey="id"
                @selection-change="handleSelectionChange"
                @pagination:size-change="handleSizeChange"
                @pagination:current-change="handleCurrentChange"
            >
            </ArtTable>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <ElButton @click="handleCancel">取消</ElButton>
                <ElButton type="primary" @click="handleConfirm" :disabled="!selectedRows.length">确认</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { useTable } from '@/hooks/core/useTable'

    interface EquipmentItem {
        id: number
        name: string
    }

    interface AiActionItem {
        id: number
        name: string
    }

    type RelationType = 'equipment' | 'ai'

    interface Props {
        visible: boolean
        type: RelationType
        /** 选中的器械ID列表 */
        selectedEquipmentIds?: number[]
        /** 选中的AI动作ID（单选） */
        selectedAiId?: number | null
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void
        (e: 'confirm', payload: { type: RelationType; selections: Array<EquipmentItem | AiActionItem> }): void
        (e: 'cancel'): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const innerVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const dialogTitle = computed(() => {
        return props.type === 'equipment' ? '器械列表' : 'AI动作列表'
    })

    const searchLabelId = computed(() => (props.type === 'equipment' ? '器械ID' : 'ID'))
    const searchLabelName = computed(() => (props.type === 'equipment' ? '器械名称' : '动作名称'))

    const searchForm = ref<{ id?: string; name?: string }>({
        id: '',
        name: '',
    })

    // 假数据 - 实际使用时可替换为接口
    const equipmentMockData: EquipmentItem[] = [
        { id: 1, name: '拉力计' },
        { id: 2, name: '脉冲震荡测试仪' },
    ]

    const aiMockData: AiActionItem[] = [
        { id: 1, name: '俯卧撑' },
        { id: 2, name: '平板支撑' },
    ]

    const getCurrentList = () => {
        return props.type === 'equipment' ? equipmentMockData : aiMockData
    }

    const {
        columns,
        columnChecks,
        data,
        loading,
        pagination,
        getData,
        searchParams,
        resetSearchParams,
        handleSizeChange,
        handleCurrentChange,
        refreshData,
    } = useTable({
        core: {
            apiFn: async (): Promise<{
                list: Array<EquipmentItem | AiActionItem>
                total: number
                page: number
                size: number
            }> => {
                // 这里简单用本地数据模拟
                const currentList = getCurrentList()
                const list = currentList.filter(item => {
                    const matchId = (searchParams as any).id
                        ? String(item.id).includes(String((searchParams as any).id))
                        : true
                    const matchName = (searchParams as any).name
                        ? item.name.includes(String((searchParams as any).name))
                        : true
                    return matchId && matchName
                })
                return {
                    list,
                    total: list.length,
                    page: 1,
                    size: 10,
                }
            },
            apiParams: {
                page: 1,
                size: 10,
                ...searchForm.value,
            },
            columnsFactory: () => {
                const baseColumns: any[] = [
                    { type: 'selection', width: 60 },
                    {
                        'prop': 'id',
                        'label': props.type === 'equipment' ? '器械ID' : 'ID',
                        'width': 120,
                        'header-align': 'center',
                        'align': 'center',
                    },
                    {
                        'prop': 'name',
                        'label': props.type === 'equipment' ? '器械名称' : '动作名称',
                        'header-align': 'center',
                        'align': 'center',
                    },
                ]
                return baseColumns
            },
        },
        transform: {
            dataTransformer: records => {
                if (!Array.isArray(records)) return []
                return records
            },
        },
    })

    const selectedRows = ref<Array<EquipmentItem | AiActionItem>>([])

    const handleSelectionChange = (selection: Array<EquipmentItem | AiActionItem>) => {
        // AI动作单选：只保留最后一个
        if (props.type === 'ai' && selection.length > 1) {
            selectedRows.value = [selection[selection.length - 1]]
        } else {
            selectedRows.value = selection
        }
    }

    const handleSearch = async () => {
        Object.assign(searchParams, searchForm.value)
        await getData()
    }

    const handleResetSearch = async () => {
        searchForm.value = { id: '', name: '' }
        resetSearchParams()
        await getData()
    }

    const handleCancel = () => {
        emit('cancel')
        innerVisible.value = false
    }

    const handleConfirm = () => {
        emit('confirm', {
            type: props.type,
            selections: selectedRows.value,
        })
        innerVisible.value = false
    }

    const handleClose = () => {
        // 关闭时清空选择
        selectedRows.value = []
    }
</script>

<style scoped lang="scss">
    .relation-dialog {
        .relation-search {
            margin-bottom: 12px;
        }
    }
</style>
