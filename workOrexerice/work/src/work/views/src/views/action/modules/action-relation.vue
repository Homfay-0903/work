<template>
    <ElDialog
        v-model="innerVisible"
        title="AI动作列表"
        width="60%"
        align-center
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="relation-dialog">
            <!-- 搜索区域 -->
            <div class="relation-search">
                <ElForm :inline="true" :model="searchForm" label-width="80px">
                    <ElFormItem label="ID">
                        <ElInput v-model="searchForm.actionId" placeholder="请输入ID" />
                    </ElFormItem>
                    <ElFormItem label="动作名称">
                        <ElInput v-model="searchForm.actionName" placeholder="请输入动作名称" />
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
                rowKey="actionId"
                :header-cell-class-name="headerCellClassName"
                @selection-change="handleSelectionChange"
                @select="handleSelect"
                @pagination:size-change="handleSizeChange"
                @pagination:current-change="handleCurrentChange"
            >
            </ArtTable>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <ElButton @click="handleCancel">取消</ElButton>
                <ElButton type="primary" @click="handleConfirm">确认</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { ref, watch, computed } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchGetAiActionList } from '@/api/aiaction'
    import ArtTable from '@/components/core/tables/art-table/index.vue'

    type AiActionItem = Api.Ai.AiListItem

    interface Props {
        visible: boolean
        /** 选中的AI动作ID（单选） */
        selectedAiId?: number | null
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void
        (e: 'confirm', selection: AiActionItem | { actionId: null; actionName: string }): void
        (e: 'cancel'): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const artTableRef = ref<InstanceType<typeof ArtTable> | null>(null)

    const innerVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const searchForm = ref<{ actionId?: number; actionName?: string }>({
        actionId: undefined,
        actionName: '',
    })

    const getNameText = (name: string) => {
        return name || '-'
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
            apiFn: fetchGetAiActionList,
            apiParams: {
                page: 1,
                size: 10,
                ...searchForm.value,
            },
            columnsFactory: () => {
                const baseColumns: any[] = [
                    {
                        'type': 'globalIndex',
                        'label': '序号',
                        'width': 200,
                        'header-align': 'center',
                        'align': 'center',
                    },
                    {
                        'prop': 'id',
                        'label': 'ID',
                        'width': 200,
                        'header-align': 'center',
                        'align': 'center',
                        'formatter': (row: AiActionItem) => row.actionId?.toString() || '-',
                    },
                    {
                        'prop': 'name',
                        'label': '动作名称',
                        'header-align': 'center',
                        'align': 'center',
                        'formatter': (row: AiActionItem) => getNameText(row.actionName),
                    },
                    {
                        type: 'selection',
                        width: 60,
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

    const selectedRow = ref<AiActionItem | null>(null)

    const headerCellClassName = ({ column }: { column: any }) => {
        if (column.type === 'selection') {
            return 'disable-select-all'
        }
        return ''
    }

    const handleSelect = (selection: AiActionItem[], row: AiActionItem) => {
        // 检查是否点击的是当前已选中的行
        if (selectedRow.value?.actionId === row.actionId) {
            // 如果是，则取消选择
            artTableRef.value?.elTableRef?.clearSelection()
            selectedRow.value = null
        } else {
            // 如果不是，则清空其他选择，只保留当前选择的行
            artTableRef.value?.elTableRef?.clearSelection()
            // 选择当前行
            artTableRef.value?.elTableRef?.toggleRowSelection(row, true)
            // 更新选中行状态
            selectedRow.value = row
        }
    }

    const handleSelectionChange = (selection: AiActionItem[]) => {
        // 在 handleSelect 中已经处理了单选逻辑，这里只需要确保状态同步
        if (selection.length > 0) {
            // 选择当前行（应该是唯一的选中行）
            selectedRow.value = selection[selection.length - 1]
        } else {
            // 如果没有选择任何行（例如，取消选择当前行）
            selectedRow.value = null
        }
        //console.log('handleSelectionChange', selectedRow.value)
    }

    const handleSearch = async () => {
        Object.assign(searchParams, searchForm.value)
        await getData()
    }

    const handleResetSearch = async () => {
        searchForm.value = { actionId: undefined, actionName: '' }
        resetSearchParams()
        await getData()
    }

    const handleCancel = () => {
        emit('cancel')
        selectedRow.value = null
        artTableRef.value?.elTableRef?.clearSelection()
        //console.log('handleCancel', selectedRow.value)
        innerVisible.value = false
    }

    const handleConfirm = () => {
        if (selectedRow.value) {
            emit('confirm', selectedRow.value)
        } else {
            emit('confirm', { actionId: null, actionName: '' } as unknown as AiActionItem)
        }
        innerVisible.value = false
    }

    const handleClose = () => {
        selectedRow.value = null
        artTableRef.value?.elTableRef?.clearSelection()
        //console.log('handleClose', selectedRow.value)
    }

    // 监听对话框显示状态，在打开时清空选择
    watch(
        () => props.visible,
        newVal => {
            if (newVal) {
                if (props.selectedAiId) {
                    setTimeout(() => {
                        data.value.forEach(row => {
                            if ((row as AiActionItem).actionId === Number(props.selectedAiId)) {
                                artTableRef.value?.elTableRef?.toggleRowSelection(row, true)
                                selectedRow.value = row
                            }
                        })
                    }, 100)
                } else {
                    selectedRow.value = null
                    setTimeout(() => {
                        artTableRef.value?.elTableRef?.clearSelection()
                    }, 0)
                }
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

    :deep(.disable-select-all .el-checkbox) {
        display: none;
    }
</style>
