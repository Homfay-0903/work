<template>
    <div class="character-page art-full-height">
        <!-- 搜索栏 -->
        <CharacterSearch v-model="searchForm" @search="handleSearch" @reset="handleResetSearch"></CharacterSearch>
        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton @click="showDialog('add')" v-ripple>+新建</ElButton>
                    </ElSpace>
                </template>
            </ArtTableHeader>

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

            <!-- 角色弹窗 -->
            <CharacterDialog
                v-model:visible="dialogVisible"
                :type="dialogType"
                :character-data="currentCharacterData"
                @submit="handleDialogSubmit"
            />

            <!-- 权限设置弹窗 -->
            <CharacterPermissionDialog
                v-model="permissionDialogVisible"
                :character-data="currentCharacterData"
                @success="handlePermissionSuccess"
            />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import { ref, nextTick, h } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchCreateCharacter, fetchUpdateCharacter, fetchToggleCharacterStatus } from '@/api/character'
    import CharacterSearch from './modules/character-search.vue'
    import CharacterDialog from './modules/character-dialog.vue'
    import CharacterPermissionDialog from './modules/character-permisson-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElButton } from 'element-plus'

    defineOptions({ name: 'Character' })

    type CharacterListItem = Api.Character.CharacterListItem

    // 假数据
    const mockData: CharacterListItem[] = [
        {
            id: 1,
            name: 'ApiTest438427',
            description: '接口测试',
            creator: 'superadmin',
            status: 1,
            createdAt: '2025-07-18 23:18:19',
        },
        {
            id: 2,
            name: 'ApiTest351066',
            description: '接口测试',
            creator: 'superadmin',
            status: 1,
            createdAt: '2025-07-18 23:18:19',
        },
        {
            id: 3,
            name: '测试角色A4',
            description: '123',
            creator: 'superadmin',
            status: 1,
            createdAt: '2025-05-21 10:30:00',
        },
        {
            id: 4,
            name: 'ApiTest_0523',
            description: '测试权限',
            creator: 'superadmin',
            status: 1,
            createdAt: '2025-05-23 14:20:00',
        },
    ]

    // 弹窗相关
    const dialogType = ref<'add' | 'edit' | 'view'>('add')
    const dialogVisible = ref(false)
    const currentCharacterData = ref<CharacterListItem | undefined>(undefined)

    // 权限设置弹窗
    const permissionDialogVisible = ref(false)

    // 选中行
    const selectedRows = ref<CharacterListItem[]>([])

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
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CharacterListItem): string => {
                        const index = (data.value as CharacterListItem[]).findIndex(
                            (item: CharacterListItem) => item.id === row.id,
                        )
                        return getIndexText(index + 1 + (pagination.page - 1) * pagination.size)
                    },
                },
                {
                    'prop': 'name',
                    'label': '角色名称',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CharacterListItem) => getNameText(row.name),
                },
                {
                    'prop': 'description',
                    'label': '角色描述',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CharacterListItem) => getDescriptionText(row.description),
                },
                {
                    'prop': 'creator',
                    'label': '创建人',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                },
                {
                    'prop': 'createdAt',
                    'label': '创建时间',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CharacterListItem) => formatTime(row.createdAt),
                },
                {
                    'prop': 'status',
                    'label': '状态',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CharacterListItem) => {
                        const statusConfig = getStatusConfig(row.status)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 280,
                    'fixed': 'right', // 固定列
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CharacterListItem) => {
                        const buttons: any[] = []

                        // 修改
                        buttons.push(
                            h(
                                ElButton,
                                {
                                    link: true,
                                    onClick: () => showDialog('edit', row),
                                },
                                () => '修改',
                            ),
                        )

                        // 设置权限
                        buttons.push(
                            h(
                                ElButton,
                                {
                                    link: true,
                                    type: 'success',
                                    onClick: () => showPermissionDialog(row),
                                },
                                () => '设置权限',
                            ),
                        )

                        // 禁用/启用
                        if (row.status === 1) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'warning',
                                        onClick: () => handleDisable(row),
                                    },
                                    () => '禁用',
                                ),
                            )
                        } else {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'success',
                                        onClick: () => handleEnable(row),
                                    },
                                    () => '启用',
                                ),
                            )
                        }

                        return h(
                            'div',
                            { style: 'display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;' },
                            buttons,
                        )
                    },
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
     * 显示角色弹窗
     */
    const showDialog = (type: 'add' | 'edit' | 'view', row?: CharacterListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentCharacterData.value = row
        nextTick(() => {
            dialogVisible.value = true
        })
    }

    /**
     * 显示权限设置弹窗
     */
    const showPermissionDialog = (row: CharacterListItem): void => {
        console.log('打开权限设置弹窗:', row)
        currentCharacterData.value = { ...row } as CharacterListItem
        nextTick(() => {
            permissionDialogVisible.value = true
        })
    }

    /**
     * 权限设置成功回调
     */
    const handlePermissionSuccess = () => {
        refreshData()
    }

    /**
     * 处理弹窗提交事件
     */
    const handleDialogSubmit = async (payload?: Partial<CharacterListItem>) => {
        try {
            const dataToSubmit = payload || { ...currentCharacterData.value }

            if (dialogType.value === 'add') {
                await fetchCreateCharacter(dataToSubmit as Api.Character.CharacterCreateBody)
                ElMessage.success('创建成功')
                await refreshCreate()
            } else if (dialogType.value === 'edit') {
                if (!dataToSubmit.id) {
                    ElMessage.error('缺少角色ID')
                    return
                }
                await fetchUpdateCharacter(dataToSubmit as Api.Character.CharacterUpdateBody)
                ElMessage.success('更新成功')
                await refreshUpdate()
            }

            dialogVisible.value = false
            currentCharacterData.value = undefined
        } catch (error) {
            console.error('提交失败:', error)
            ElMessage.error('提交失败')
        }
    }

    /**
     * 启用角色
     */
    const handleEnable = (row: CharacterListItem): void => {
        ;(async () => {
            try {
                await fetchToggleCharacterStatus(row.id, 1)
                ElMessage.success('启用成功')
                await refreshData()
            } catch (error) {
                console.error('启用失败:', error)
                ElMessage.error('启用失败')
            }
        })()
    }

    /**
     * 禁用角色
     */
    const handleDisable = (row: CharacterListItem): void => {
        ;(async () => {
            try {
                await ElMessageBox.confirm(`确定要禁用角色【${row.name}】吗？`, '禁用角色', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })

                await fetchToggleCharacterStatus(row.id, 2)
                ElMessage.success('禁用成功')
                await refreshData()
            } catch (error: any) {
                if (error !== 'cancel') {
                    console.error('禁用失败:', error)
                    ElMessage.error('禁用失败')
                }
            }
        })()
    }

    /**
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: CharacterListItem[]): void => {
        selectedRows.value = selection
        console.log('选中行数据:', selectedRows.value)
    }
</script>

<style lang="scss" scoped>
    .character-page {
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
