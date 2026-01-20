<template>
    <div class="account-page art-full-height">
        <!-- 搜索栏 -->
        <LogSearch
            v-if="hasAuth('query')"
            v-model="searchForm"
            @search="handleSearch"
            @reset="handleResetSearch"
        ></LogSearch>
        <ElCard class="art-table-card" shadow="never">
            <!-- 表格 -->
            <ArtTable
                tableLayout="fixed"
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
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import { ref, h } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import LogSearch from './modules/log-search.vue'
    import { ElTag } from 'element-plus'
    import { useAuth } from '@/hooks/core/useAuth'
    import { fetchGetLogList } from '@/api/log'

    defineOptions({ name: 'Log' })

    type LogListItem = Api.Log.LogListItem

    //权限
    const { hasAuth } = useAuth()

    // 选中行
    const selectedRows = ref<LogListItem[]>([])

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm: Partial<Api.Log.LogSearchParams> = {
        accountName: undefined,
        roleName: undefined,
        operationType: undefined,
    }

    const searchForm = ref<Partial<Api.Log.LogSearchParams>>({
        ...defaultSearchForm,
    })

    // 操作类型配置（按 HTTP Method 映射）
    const OPERATION_TYPE_CONFIG: Record<
        string,
        {
            type: 'success' | 'warning' | 'danger' | 'info'
            text: string
        }
    > = {
        POST: { type: 'success', text: 'POST' },
        PUT: { type: 'warning', text: 'PUT' },
        DELETE: { type: 'danger', text: 'DELETE' },
    }

    /**
     * 获取序号文本
     */
    const getIndexText = (index: number) => {
        return `${index}`
    }

    /**
     * 获取账号名称
     */
    const getNameText = (name?: string) => {
        return name || '未知'
    }

    /**
     * 获取角色名称
     */
    const getRoleNameText = (roleName?: string) => {
        return roleName || '-'
    }

    /**
     * 获取操作类型配置
     */
    const getStatusConfig = (status: string) => {
        return (
            OPERATION_TYPE_CONFIG[status as keyof typeof OPERATION_TYPE_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 格式化时间
     */
    const formatTime = (time?: string) => {
        if (time) {
            return new Date(time).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            })
        }
        return '-'
    }

    const {
        columns,
        data,
        loading,
        pagination,
        getData,
        searchParams,
        resetSearchParams,
        handleSizeChange,
        handleCurrentChange,
    } = useTable({
        // 核心配置
        core: {
            // 使用真实的操作日志列表接口
            apiFn: async (params: Api.Log.LogSearchParams) => {
                return fetchGetLogList(params)
            },
            apiParams: {
                page: 1,
                size: 20,
                ...searchForm.value,
            },
            columnsFactory: () => [
                {
                    'prop': 'index',
                    'label': '序号',
                    'width': 100,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: LogListItem): string => {
                        const index = (data.value as LogListItem[]).findIndex((item: LogListItem) => item.id === row.id)
                        return getIndexText(index + 1 + (pagination.page - 1) * pagination.size)
                    },
                },
                {
                    'prop': 'accountName',
                    'label': '账号名称',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: LogListItem) => getNameText(row.accountName),
                },
                {
                    'prop': 'roleName',
                    'label': '角色',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: LogListItem) => getRoleNameText(row.roleName),
                },
                {
                    'prop': 'lastLoginAt',
                    'label': '最近登录时间',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: LogListItem) => formatTime(row.lastLoginAt),
                },
                {
                    'prop': 'createdAt',
                    'label': '操作时间',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: LogListItem) => formatTime(row.createdAt),
                },
                {
                    'prop': 'operationType',
                    'label': '操作类型',
                    'width': 150,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: LogListItem) => {
                        const statusConfig = getStatusConfig(row.operationType)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 300,
                    'fixed': 'right', // 固定列
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: LogListItem) => row.operationDescription || '-',
                },
            ],
        },
        // 性能优化配置
        performance: {
            enableCache: true,
            cacheTime: 5 * 60 * 1000,
            maxCacheSize: 50,
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
    const handleSearch = async (params: Partial<Api.Log.LogSearchParams>) => {
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
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: LogListItem[]): void => {
        selectedRows.value = selection
        console.log('选中行数据:', selectedRows.value)
    }
</script>

<style lang="scss" scoped>
    .account-page {
        .art-table-card {
            padding: 16px;
        }

        .art-table-header {
            margin-bottom: 20px;

            :deep(.el-space) {
                gap: 12px;
            }
        }
    }
</style>
