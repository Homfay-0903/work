<template>
    <div class="action-page art-full-height">
        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace>
                        <ElButton @click="showDialog('add')" v-ripple>添加动作</ElButton>
                        <!-- 搜索栏 -->
                        <AiSearch v-model="searchForm" @search="handleSearch" @reset="handleResetSearch"></AiSearch>
                    </ElSpace>
                </template>
            </ArtTableHeader>

            <!-- 表格 -->
            <ArtTable
                :loading="loading"
                :data="data"
                :columns="columns"
                :pagination="pagination"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                :default-expand-all="false"
                rowKey="id"
                @selection-change="handleSelectionChange"
                @pagination:size-change="handleSizeChange"
                @pagination:current-change="handleCurrentChange"
            >
            </ArtTable>

            <!-- 动作弹窗 -->
            <AiDialog
                v-model:visible="dialogVisible"
                :type="dialogType"
                :action-data="currentActionData"
                @submit="handleDialogSubmit"
            />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import { ref, nextTick } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchCreateAction, fetchUpdateAction, fetchDeleteAction } from '@/api/action'
    //import ActionSearch from './modules/action-search.vue'
    //import ActionDialog from './modules/action-dialog.vue'
    import AiDialog from './modules/ai-dialog.vue'
    import AiSearch from './modules/ai-search.vue'
    import { ElTag, ElMessageBox, ElMessage, ElTabs, ElTabPane, ElButton } from 'element-plus'

    defineOptions({ name: 'Action' })

    type AiListItem = Api.Ai.AiListItem

    // 假数据
    const mockData: AiListItem[] = [
        {
            id: 1,
            name: '站立飞鸟',
            version: '1.0.0',
        },
    ]

    // 弹窗相关
    const dialogType = ref<'add' | 'edit' | 'view'>('add')
    const dialogVisible = ref(false)
    const currentActionData = ref<Partial<AiListItem>>({})

    // 选中行
    const selectedRows = ref<AiListItem[]>([])

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm = {
        scene: undefined,
        difficulty: undefined,
        equipment: undefined,
        part: undefined,
        type: undefined,
        status: undefined,
        aiSupport: undefined,
        trainer: undefined,
        name: undefined,
    }

    const searchForm = ref<Partial<Api.Action.ActionSearchParams>>({
        ...defaultSearchForm,
    })

    /**
     * 获取序号文本
     */
    const getIndexText = (row: AiListItem) => {
        //if (row.hasChildren && row.children && row.children.length > 0) {
        //    return `${row.id} (${row.children.length})`
        //}
        return `${row.id}`
    }

    /**
     * 获取动作名称文本
     */
    const getNameText = (name: string) => {
        return name || '未知'
    }

    /**
     * 获取动作介绍文本
     */
    const getIntroductionText = (introduction: string) => {
        return introduction || '暂无备注'
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
        refreshCreate,
        refreshUpdate,
        refreshRemove,
    } = useTable({
        // 核心配置
        core: {
            // 暂时使用假数据
            apiFn: async () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({
                            list: mockData,
                            total: 96,
                            page: 1,
                            size: 10,
                        })
                    }, 300)
                })
            },
            apiParams: {
                page: 1,
                size: 10,
                ...searchForm.value,
            },
            columnsFactory: () => [
                //{ type: 'selection' }, // 勾选列
                {
                    'prop': 'id',
                    'label': ' ID',
                    'width': 500,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: AiListItem) => getIndexText(row),
                },
                {
                    'prop': 'name',
                    'label': '动作名称',
                    'width': 500,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: AiListItem) => getNameText(row.name),
                },
                {
                    'prop': 'introduction',
                    'label': '备注',
                    'width': 500,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: AiListItem) => getIntroductionText(row.introduction || ''),
                },
            ],
        },
        // 数据处理
        transform: {
            // 数据转换器
            dataTransformer: records => {
                // 类型守卫检查
                if (!Array.isArray(records)) {
                    console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
                    return []
                }
                return records
            },
        },
    })

    /**
     * 搜索处理
     * @param params 参数
     */
    const handleSearch = async (params: Partial<Api.Action.ActionSearchParams>) => {
        console.log('筛选参数:', params)
        // 搜索参数赋值
        Object.assign(searchParams, params)
        // 等待数据加载完成后打印，确保表格数据已更新
        await getData()
        console.log('表格数据：', data.value)
    }

    /**
     * 重置搜索处理
     */
    const handleResetSearch = () => {
        console.log('重置搜索表单')
        // 重置表单数据
        searchForm.value = { ...defaultSearchForm }
        // 重置搜索参数
        resetSearchParams()
        // 重新获取数据
        getData()
    }

    /**
     * 显示动作弹窗
     */
    const showDialog = (type: 'add' | 'edit' | 'view', row?: AiListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentActionData.value = row || {}
        nextTick(() => {
            dialogVisible.value = true
        })
    }

    /**
     * 处理弹窗提交事件
     */
    const handleDialogSubmit = async (payload?: Partial<AiListItem>) => {
        try {
            const dataToSubmit = payload || { ...currentActionData.value }

            if (dialogType.value === 'add') {
                await fetchCreateAction(dataToSubmit as Api.Action.ActionCreateBody)
                ElMessage.success('创建成功')
                await refreshCreate()
            } else if (dialogType.value === 'edit') {
                if (!dataToSubmit.id) {
                    ElMessage.error('缺少动作ID')
                    return
                }
                await fetchUpdateAction(dataToSubmit as Api.Action.ActionUpdateBody)
                ElMessage.success('更新成功')
                await refreshUpdate()
            }

            dialogVisible.value = false
            currentActionData.value = {}
        } catch (error) {
            console.error('提交失败:', error)
            ElMessage.error('提交失败')
        }
    }

    /**
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: AiListItem[]): void => {
        selectedRows.value = selection
        console.log('选中行数据:', selectedRows.value)
    }
</script>

<style lang="scss" scoped>
    .action-page {
        .model-tabs-card {
            margin-bottom: 16px;

            .model-tabs-wrapper {
                display: flex;
                align-items: center;
                gap: 16px;

                .model-tabs-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--el-text-color-primary);
                    white-space: nowrap;
                }

                :deep(.el-tabs) {
                    flex: 1;

                    .el-tabs__header {
                        margin: 0;
                    }

                    .el-tabs__nav-wrap::after {
                        display: none;
                    }
                }
            }
        }
    }
</style>
