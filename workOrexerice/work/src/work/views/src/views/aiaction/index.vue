<template>
    <div class="action-page art-full-height">
        <!-- 搜索栏 -->
        <AiSearch
            v-if="hasAuth('query')"
            v-model="searchForm"
            @search="handleSearch"
            @reset="handleResetSearch"
        ></AiSearch>

        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace :size="40">
                        <ElButton v-if="hasAuth('update')" @click="showDialog('update')" v-ripple>更新</ElButton>
                        <p>当前so库版本：{{ soLibVersion }}</p>
                    </ElSpace>
                </template>
            </ArtTableHeader>

            <!-- 表格 -->
            <ArtTable
                tableLayout="fixed"
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
    import { ref, nextTick, onMounted } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchGetAiActionList, fetchAddSoLibVersion, fetchGetSoLibVersionList } from '@/api/aiaction'
    import AiDialog from './modules/ai-dialog.vue'
    import AiSearch from './modules/ai-search.vue'
    import { ElMessage, ElButton } from 'element-plus'
    import { useAuth } from '@/hooks/core/useAuth'
    import { dataCache } from '@/utils/cache/dataCache'

    defineOptions({ name: 'Action' })

    type AiListItem = Api.Ai.AiListItem

    const dialogType = ref<'add' | 'update' | 'view'>('add')
    const dialogVisible = ref(false)
    const currentActionData = ref<Partial<AiListItem>>({})
    const soLibVersion = ref<string>('')

    const selectedRows = ref<AiListItem[]>([])

    //权限
    const { hasAuth } = useAuth()

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm = {
        actionId: undefined,
        actionName: undefined,
    }

    const searchForm = ref<Partial<Api.Ai.AiSearchParams>>({
        //...(defaultSearchForm as Partial<Api.Ai.AiSearchParams>),
        ...defaultSearchForm,
    })

    const getIndexText = (row: AiListItem) => {
        return `${row.actionId}`
    }

    const getNameText = (name: string) => {
        return name || '未知'
    }

    const getIntroductionText = (introduction: string) => {
        return introduction || ''
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
        //refreshUpdate,
        //refreshRemove,
    } = useTable({
        core: {
            apiFn: fetchGetAiActionList,
            apiParams: {
                page: 1,
                size: 20,
                ...searchForm.value,
            },
            columnsFactory: () => [
                {
                    'prop': 'id',
                    'label': ' ID',
                    'width': 530,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: AiListItem) => getIndexText(row),
                },
                {
                    'prop': 'name',
                    'label': '动作名称',
                    'width': 530,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: AiListItem) => getNameText(row.actionName),
                },
                {
                    'prop': 'remark',
                    'label': '备注',
                    'width': 530,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: AiListItem) => getIntroductionText(row.remark || ''),
                },
            ],
        },
        performance: {
            enableCache: true,
            cacheTime: 5 * 60 * 1000,
            maxCacheSize: 50,
        },
        transform: {
            dataTransformer: records => {
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
    const showDialog = (type: 'add' | 'update' | 'view', row?: AiListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentActionData.value = row || {}
        nextTick(() => {
            dialogVisible.value = true
        })
    }

    /**
     * 获取so库版本号
     */
    const fetchSoLibVersion = async () => {
        const version = await dataCache.getOrSet<string>(
            'aiaction-so-lib-version',
            async () => {
                const response = await fetchGetSoLibVersionList({
                    page: 1,
                    size: 20,
                })
                return (response as any)?.list?.[0]?.version || ''
            },
            30 * 60 * 1000,
        )
        soLibVersion.value = version
    }

    /**
     * 处理弹窗提交事件
     */
    const handleDialogSubmit = async (payload?: Partial<AiListItem>) => {
        try {
            const dataToSubmit = payload || { ...currentActionData.value }

            //if (dialogType.value === 'add') {
            await fetchAddSoLibVersion(dataToSubmit as Api.Ai.AiCreateBody & { file?: File | undefined })
            ElMessage.success('创建成功')
            await refreshCreate()
            await fetchSoLibVersion()
            //} else if (dialogType.value === 'edit') {
            //    if (!dataToSubmit.id) {
            //        ElMessage.error('缺少动作ID')
            //        return
            //    }
            //    await fetchUpdateAction(dataToSubmit as Api.Action.ActionUpdateBody)
            //    ElMessage.success('更新成功')
            //    await refreshUpdate()
            //}

            dialogVisible.value = false
            currentActionData.value = {}
        } catch (error) {
            console.error('提交失败:', error)
            //ElMessage.error('提交失败')
        }
    }

    /**
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: AiListItem[]): void => {
        selectedRows.value = selection
        console.log('选中行数据:', selectedRows.value)
    }

    onMounted(async () => {
        await fetchSoLibVersion()
        refreshCreate()
    })
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
