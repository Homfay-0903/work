<template>
    <ElDialog
        v-model="innerVisible"
        title="器械列表"
        width="60%"
        align-center
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="relation-dialog">
            <!-- 搜索区域 -->
            <div class="relation-search">
                <ElForm :inline="true" :model="searchForm" label-width="80px">
                    <ElFormItem label="器械ID">
                        <ElInput v-model="searchForm.id" placeholder="请输入器械ID" />
                    </ElFormItem>
                    <ElFormItem label="器械名称">
                        <ElInput v-model="searchForm.name" placeholder="请输入器械名称" />
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
                tableLayout="fixed"
                ref="artTableRef"
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
    import { ref, watch, computed } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchGetEquipmentList } from '@/api/equipment'
    import ArtTable from '@/components/core/tables/art-table/index.vue'

    interface EquipmentItem {
        id: number
        name: string
    }

    interface Props {
        visible: boolean
        /** 选中的器械ID列表 */
        selectedEquipmentIds?: number[]
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void
        (e: 'confirm', selections: Array<EquipmentItem>): void
        (e: 'cancel'): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const artTableRef = ref<InstanceType<typeof ArtTable> | null>(null)

    const innerVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const searchForm = ref<{ id?: number; name?: string }>({
        id: undefined,
        name: '',
    })

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
            apiFn: fetchGetEquipmentList,
            apiParams: {
                page: 1,
                size: 20,
                ...searchForm.value,
            },
            columnsFactory: () => [
                { type: 'selection', width: 60 },
                {
                    'prop': 'id',
                    'label': '器械ID',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                },
                {
                    'prop': 'name',
                    'label': '器械名称',
                    'header-align': 'center',
                    'align': 'center',
                },
            ],
        },
        transform: {
            dataTransformer: records => {
                if (!Array.isArray(records)) return []
                return records
            },
        },
    })

    const selectedRows = ref<EquipmentItem[]>([])

    const handleSelectionChange = (selection: EquipmentItem[]) => {
        selectedRows.value = selection
        console.log('handleSelectionChange', selectedRows.value)
    }

    const handleSearch = async () => {
        Object.assign(searchParams, searchForm.value)
        await getData()
    }

    const handleResetSearch = async () => {
        searchForm.value = { id: undefined, name: '' }
        resetSearchParams()
        await getData()
    }

    const handleCancel = () => {
        emit('cancel')
        selectedRows.value = []
        artTableRef.value?.elTableRef?.clearSelection()
        console.log('handleCancel', selectedRows.value)
        innerVisible.value = false
    }

    const handleConfirm = () => {
        emit('confirm', selectedRows.value)
        innerVisible.value = false
    }

    const handleClose = () => {
        selectedRows.value = []
        artTableRef.value?.elTableRef?.clearSelection()
        console.log('handleClose', selectedRows.value)
    }

    watch(
        () => props.visible,
        newVal => {
            if (newVal) {
                selectedRows.value = []
                setTimeout(() => {
                    artTableRef.value?.elTableRef?.clearSelection()
                }, 0)
            }
        },
    )
</script>

<style scoped lang="scss">
    .relation-dialog {
        .relation-search {
            margin-bottom: 12px;
        }
    }
</style>
