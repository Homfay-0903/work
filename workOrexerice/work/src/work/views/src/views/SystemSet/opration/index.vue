<template>
    <div class="account-page art-full-height">
        <!-- 搜索栏 -->
        <OprationSearch v-model="searchForm" @search="handleSearch" @reset="handleResetSearch"></OprationSearch>
        <ElCard class="art-table-card" shadow="never">
            <!-- 表格 -->
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
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import { ref, h } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import OprationSearch from './modules/opration-search.vue'
    //import AccountDialog from './modules/account-dialog.vue'
    import { ElTag } from 'element-plus'

    defineOptions({ name: 'Opration' })

    type OprationListItem = Api.Opration.OprationListItem

    // 假数据
    const mockData: OprationListItem[] = [
        {
            id: 1,
            name: 'ApiTest438427',
            character: '接口测试',
            status: 1,
            lastLoginAt: '2025-07-18 23:18:19',
        },
        {
            id: 2,
            name: 'ApiTest351066',
            character: '接口测试',
            status: 1,
            lastLoginAt: '2025-07-18 23:18:19',
        },
        {
            id: 3,
            name: '测试角色A4',
            character: '接口测试',
            status: 1,
            lastLoginAt: '2025-05-21 10:30:00',
        },
        {
            id: 4,
            name: 'ApiTest_0523',
            character: '接口测试',
            status: 1,
            lastLoginAt: '2025-05-23 14:20:00',
        },
    ]

    // 选中行
    const selectedRows = ref<OprationListItem[]>([])

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm = {
        name: undefined,
    }

    const searchForm = ref<Partial<Api.Character.CharacterSearchParams>>({
        ...defaultSearchForm,
    })

    // 角色状态配置
    const CHARACTER_STATUS_CONFIG = {
        1: { type: 'success' as const, text: '启用中' },
        2: { type: 'danger' as const, text: '禁用' },
    } as const

    /**
     * 获取序号文本
     */
    const getIndexText = (index: number) => {
        return `${index}`
    }

    /**
     * 获取角色名称
     */
    const getNameText = (name: string) => {
        return name || '未知'
    }

    /**
     * 获取角色描述
     */
    const getDescriptionText = (description?: string) => {
        return description || '-'
    }

    /**
     * 获取角色状态配置
     */
    const getStatusConfig = (status: number) => {
        return (
            CHARACTER_STATUS_CONFIG[status as keyof typeof CHARACTER_STATUS_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 格式化时间
     */
    const formatTime = (time?: string) => {
        return time || '-'
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
            // 暂时使用假数据
            apiFn: async (params: Api.Character.CharacterSearchParams) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        // 模拟搜索过滤
                        let filteredData = [...mockData]
                        if (params.name) {
                            filteredData = filteredData.filter(item => item.name.includes(params.name as string))
                        }

                        const page = params.page || 1
                        const size = params.size || 10
                        const start = (page - 1) * size
                        const end = start + size
                        const paginatedData = filteredData.slice(start, end)

                        resolve({
                            list: paginatedData,
                            total: filteredData.length,
                            page: page,
                            size: size,
                        })
                    }, 300)
                })
            },
            apiParams: {
                page: 1,
                size: 10,
                ...searchForm.value,
            },
            // 使用真实的API
            // apiFn: fetchGetCharacterList,
            columnsFactory: () => [
                {
                    'prop': 'index',
                    'label': '序号',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: OprationListItem): string => {
                        const index = (data.value as OprationListItem[]).findIndex(
                            (item: OprationListItem) => item.id === row.id,
                        )
                        return getIndexText(index + 1 + (pagination.page - 1) * pagination.size)
                    },
                },
                {
                    'prop': 'name',
                    'label': '账号名称',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: OprationListItem) => getNameText(row.name),
                },
                {
                    'prop': 'character',
                    'label': '角色',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: OprationListItem) => getDescriptionText(row.character),
                },
                {
                    'prop': 'lastLoginAt',
                    'label': '最近登录时间',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: OprationListItem) => formatTime(row.lastLoginAt),
                },
                {
                    'prop': 'status',
                    'label': '状态',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: OprationListItem) => {
                        const statusConfig = getStatusConfig(row.status)
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
    const handleSearch = async (params: Partial<Api.Character.CharacterSearchParams>) => {
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
    const handleSelectionChange = (selection: OprationListItem[]): void => {
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
