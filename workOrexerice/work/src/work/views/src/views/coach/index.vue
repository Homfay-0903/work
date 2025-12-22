<template>
    <div class="coach-page art-full-height">
        <ElCard class="art-table-card" shadow="never">
            <div class="art-table-card-header">
                <div class="art-table-card-header-title"> 教练管理 </div>
            </div>
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton @click="showDialog('add')" v-ripple>添加教练</ElButton>
                    </ElSpace>
                </template>
            </ArtTableHeader>

            <!-- 搜索栏 -->
            <CoachSearch v-model="searchForm" @search="handleSearch" @reset="handleResetSearch"></CoachSearch>

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

            <!-- 教练弹窗 -->
            <CoachDialog
                v-model:visible="dialogVisible"
                :type="dialogType"
                :coach-data="currentCoachData"
                @submit="handleDialogSubmit"
            />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import { ref, nextTick, h } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import {
        fetchCreateCoach,
        fetchUpdateCoach,
        fetchDeleteCoach,
        fetchCheckCoachInUse,
        fetchTranslateCoach,
    } from '@/api/coach'
    import CoachSearch from './modules/coach-search.vue'
    import CoachDialog from './modules/coach-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElButton, ElImage } from 'element-plus'

    defineOptions({ name: 'Coach' })

    type CoachListItem = Api.Coach.CoachListItem

    // 翻译状态
    const translatingIds = ref<Set<number>>(new Set())

    // 假数据
    const mockData: CoachListItem[] = [
        {
            id: 1,
            avatar: 'https://picsum.photos/id/1054/800/600',
            name: '张三',
            phone: '13800000000',
            email: 'zhangsan@example.com',
            introduction: '专业教练，擅长T5X型号',
            language: '中文',
            status: 1,
            operator: 'admin@suanier.com',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
        },
    ]

    // 弹窗相关
    const dialogType = ref<'add' | 'edit' | 'view'>('add')
    const dialogVisible = ref(false)
    const currentCoachData = ref<Partial<CoachListItem>>({})

    // 选中行
    const selectedRows = ref<CoachListItem[]>([])

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm = {
        name: undefined,
    }

    const searchForm = ref<Partial<Api.Coach.CoachSearchParams>>({
        ...defaultSearchForm,
    })

    // 教练状态配置
    const COACH_STATUS_CONFIG = {
        1: { type: 'success' as const, text: '启用' },
        2: { type: 'danger' as const, text: '禁用' },
    } as const

    // 语言配置
    const LANGUAGE_CONFIG = {
        中文: { type: 'success' as const, text: '中文' },
        English: { type: 'info' as const, text: '英文' },
        Japanese: { type: 'warning' as const, text: '日文' },
        Korean: { type: 'primary' as const, text: '韩文' },
    } as const

    /**
     * 获取序号文本
     */
    const getIndexText = (id: number) => {
        return `${id}`
    }

    /**
     * 获取头像显示
     */
    const getAvatarDisplay = (row: CoachListItem) => {
        if (row.avatar) {
            return h(ElImage, {
                src: row.avatar,
                style: { width: '80px', height: '80px' },
                fit: 'cover',
                previewSrcList: [row.avatar],
                previewTeleported: true,
            })
        }
        return h('span', { style: { color: '#999' } }, '无头像')
    }

    /**
     * 获取教练名称
     */
    const getNameText = (name: string) => {
        return name || '未知'
    }

    /**
     * 获取教练介绍
     */
    const getIntroductionText = (introduction: string) => {
        return introduction || '暂无介绍'
    }

    /**
     * 获取教练状态
     */
    const getStatusConfig = (status: number) => {
        return (
            COACH_STATUS_CONFIG[status as keyof typeof COACH_STATUS_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 获取语言配置
     */
    const getLanguageConfig = (language: string) => {
        return (
            LANGUAGE_CONFIG[language as keyof typeof LANGUAGE_CONFIG] || {
                type: 'info' as const,
                text: language || '未知',
            }
        )
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
                    'prop': 'index',
                    'label': ' 序号',
                    'width': 120,
                    'header-align': 'left',
                    'align': 'left',
                    'formatter': (row: CoachListItem) => getIndexText(row.id),
                },
                {
                    'prop': 'avatar',
                    'label': '头像',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CoachListItem) => getAvatarDisplay(row),
                },
                {
                    'prop': 'name',
                    'label': '教练名称',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CoachListItem) => getNameText(row.name),
                },
                {
                    'prop': 'introduction',
                    'label': '教练介绍',
                    'width': 400,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CoachListItem) => getIntroductionText(row.introduction || ''),
                },
                {
                    'prop': 'language',
                    'label': '语言',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CoachListItem) => {
                        const languageConfig = getLanguageConfig(row.language || '')
                        return h(ElTag, { type: languageConfig.type }, () => languageConfig.text)
                    },
                },
                {
                    'prop': 'status',
                    'label': '状态',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CoachListItem) => {
                        const statusConfig = getStatusConfig(row.status)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                { 'prop': 'operator', 'label': '操作人', 'width': 200, 'header-align': 'center', 'align': 'center' },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 300,
                    'fixed': 'right', // 固定列
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: CoachListItem) => {
                        const buttons: any[] = []
                        const isTranslating = translatingIds.value.has(row.id)

                        // 查看
                        buttons.push(
                            h(
                                ElButton,
                                {
                                    link: true,
                                    disabled: isTranslating,
                                    onClick: () => showDialog('view', row),
                                },
                                () => '查看',
                            ),
                        )

                        // 编辑（翻译后的子数据且已启用时不允许编辑）
                        const canEdit = !row.hasChildren || (row.hasChildren && row.status === 2)
                        if (canEdit) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        disabled: isTranslating,
                                        onClick: () => showDialog('edit', row),
                                    },
                                    () => '编辑',
                                ),
                            )
                        }

                        // 删除
                        buttons.push(
                            h(
                                ElButton,
                                {
                                    link: true,
                                    type: 'danger',
                                    disabled: isTranslating,
                                    onClick: () => handleDeleteCoach(row),
                                },
                                () => '删除',
                            ),
                        )

                        // 全部翻译（只有主数据才显示）
                        if (!row.hasChildren && (row.language === '中文' || !row.language)) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'primary',
                                        disabled: isTranslating,
                                        onClick: () => handleTranslate(row),
                                    },
                                    () => '翻译',
                                ),
                            )
                        }

                        // 启用/禁用（仅翻译后的子数据显示）
                        if (row.hasChildren) {
                            if (row.status === 2) {
                                buttons.push(
                                    h(
                                        ElButton,
                                        {
                                            link: true,
                                            type: 'success',
                                            disabled: isTranslating,
                                            onClick: () => handleEnable(row),
                                        },
                                        () => '启用',
                                    ),
                                )
                            } else if (row.status === 1) {
                                buttons.push(
                                    h(
                                        ElButton,
                                        {
                                            link: true,
                                            type: 'warning',
                                            disabled: isTranslating,
                                            onClick: () => handleDisable(row),
                                        },
                                        () => '禁用',
                                    ),
                                )
                            }
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
    const handleSearch = async (params: Partial<Api.Coach.CoachSearchParams>) => {
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
     * 显示教练弹窗
     */
    const showDialog = (type: 'add' | 'edit' | 'view', row?: CoachListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentCoachData.value = row || {}
        nextTick(() => {
            dialogVisible.value = true
        })
    }

    /**
     * 删除教练
     */
    const handleDeleteCoach = (row: CoachListItem): void => {
        ;(async () => {
            try {
                await ElMessageBox.confirm(`确定要删除该教练吗？`, '删除教练', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                })

                // 检查教练是否被使用（绑定了上架中的动作）
                try {
                    const checkResult = await fetchCheckCoachInUse(row.id)
                    if (checkResult.inUse) {
                        await ElMessageBox.alert('当前教练正在被使用，不允许删除', '提示', {
                            confirmButtonText: '确认',
                            type: 'warning',
                        })
                        return
                    }
                } catch (error) {
                    console.error('检查教练使用状态失败:', error)
                    // 如果检查接口失败，继续执行删除（根据业务需求决定）
                }

                await fetchDeleteCoach(row.id)
                ElMessage.success('删除成功')
                await refreshRemove()
            } catch (error: any) {
                if (error !== 'cancel') {
                    console.error('删除失败:', error)
                    ElMessage.error('删除失败')
                }
            }
        })()
    }

    /**
     * 处理弹窗提交事件
     */
    const handleDialogSubmit = async (payload?: Partial<CoachListItem>) => {
        try {
            const dataToSubmit = payload || { ...currentCoachData.value }

            if (dialogType.value === 'add') {
                await fetchCreateCoach(dataToSubmit as Api.Coach.CoachCreateBody)
                ElMessage.success('创建成功')
                await refreshCreate()
            } else if (dialogType.value === 'edit') {
                if (!dataToSubmit.id) {
                    ElMessage.error('缺少教练ID')
                    return
                }
                await fetchUpdateCoach(dataToSubmit as Api.Coach.CoachUpdateBody)
                ElMessage.success('更新成功')
                await refreshUpdate()
            }

            dialogVisible.value = false
            currentCoachData.value = {}
        } catch (error) {
            console.error('提交失败:', error)
            ElMessage.error('提交失败')
        }
    }

    /**
     * 启用教练（用于翻译后的子数据）
     */
    const handleEnable = (row: CoachListItem): void => {
        ;(async () => {
            try {
                // TODO: 调用启用API
                const index = (data.value as CoachListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as CoachListItem).status = 1
                }
                ElMessage.success('启用成功')
                await refreshData()
            } catch (error) {
                console.error('启用失败:', error)
                ElMessage.error('启用失败')
            }
        })()
    }

    /**
     * 禁用教练（用于翻译后的子数据）
     */
    const handleDisable = (row: CoachListItem): void => {
        ;(async () => {
            try {
                // TODO: 调用禁用API
                const index = (data.value as CoachListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as CoachListItem).status = 2
                }
                ElMessage.success('禁用成功')
                await refreshData()
            } catch (error) {
                console.error('禁用失败:', error)
                ElMessage.error('禁用失败')
            }
        })()
    }

    /**
     * 翻译教练（23种语种）
     */
    const handleTranslate = (row: CoachListItem): void => {
        ;(async () => {
            try {
                // 标记为翻译中
                translatingIds.value.add(row.id)

                // 调用翻译API
                await fetchTranslateCoach(row.id)
                ElMessage.success('翻译成功')
                await refreshData()
            } catch (error) {
                console.error('翻译失败:', error)
                ElMessage.error('翻译失败')
            } finally {
                // 移除翻译中标记
                translatingIds.value.delete(row.id)
            }
        })()
    }

    /**
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: CoachListItem[]): void => {
        selectedRows.value = selection
        console.log('选中行数据:', selectedRows.value)
    }
</script>

<style lang="scss" scoped>
    .coach-page {
        .art-table-card {
            padding: 16px;
        }

        .art-table-card-header {
            margin-bottom: 16px;

            .art-table-card-header-title {
                font-size: 18px;
                font-weight: 600;
                color: var(--el-text-color-primary);
            }
        }

        .art-table-header {
            margin-bottom: 20px;

            :deep(.el-space) {
                gap: 12px;
            }
        }

        .coach-search {
            margin-bottom: 20px;
            padding: 16px;
            background-color: var(--el-bg-color-page);
            border-radius: 6px;
        }

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
