<template>
    <div class="equipment-page art-full-height">
        <ElCard class="art-table-card" shadow="never">
            <div class="art-table-card-header">
                <div class="art-table-card-header-title">器械管理</div>
            </div>
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton @click="showDialog('add')" v-ripple>添加器械</ElButton>
                    </ElSpace>
                </template>
            </ArtTableHeader>

            <!-- 搜索栏 -->
            <EquipmentSearch v-model="searchForm" @search="handleSearch" @reset="handleResetSearch"></EquipmentSearch>

            <!-- 表格 -->
            <ArtTable
                :loading="loading"
                :data="data"
                :columns="columns"
                :pagination="pagination"
                :pagination-options="{ pageSizes: [10, 20, 30, 50, 100] }"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                :default-expand-all="false"
                rowKey="id"
                @selection-change="handleSelectionChange"
                @pagination:size-change="handleSizeChange"
                @pagination:current-change="handleCurrentChange"
            >
            </ArtTable>

            <!-- 器械弹窗 -->
            <EquipmentDialog
                v-model:visible="dialogVisible"
                :type="dialogType"
                :equipment-data="currentEquipmentData"
                @submit="handleDialogSubmit"
            />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import { ref, nextTick, h } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import {
        fetchCreateEquipment,
        fetchUpdateEquipment,
        fetchDeleteEquipment,
        fetchCheckEquipmentInUse,
        fetchTranslateEquipment,
        fetchUpdateEquipmentSort,
    } from '@/api/equipment'
    import EquipmentSearch from './modules/equipment-search.vue'
    import EquipmentDialog from './modules/equipment-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElButton, ElImage } from 'element-plus'

    defineOptions({ name: 'Equipment' })

    type EquipmentListItem = Api.Equipment.EquipmentListItem

    // 翻译状态
    const translatingIds = ref<Set<number>>(new Set())

    // 假数据
    const mockData: EquipmentListItem[] = [
        {
            id: 1,
            icon: 'https://picsum.photos/id/1/90/90',
            name: '手柄',
            language: 'Japanese',
            status: 1,
            operator: 'hanliang@suanier.com',
            sort: 1,
            hasChildren: true,
            children: [
                {
                    id: 2,
                    name: '手柄',
                    language: '中文',
                    status: 2,
                    operator: 'hanliang@suanier.com',
                    sort: 1,
                },
                {
                    id: 3,
                    name: 'handle',
                    language: 'English',
                    status: 1,
                    operator: 'hanliang@suanier.com',
                    sort: 2,
                },
            ],
        },
        {
            id: 4,
            icon: 'https://picsum.photos/id/2/90/90',
            name: '双头绳',
            language: '中文',
            status: 1,
            operator: 'hanliang@suanier.com',
            sort: 2,
        },
        {
            id: 5,
            name: '徒手',
            language: 'English',
            status: 1,
            operator: 'hanliang@suanier.com',
            sort: 3,
        },
    ]

    // 弹窗相关
    const dialogType = ref<'add' | 'edit' | 'view'>('add')
    const dialogVisible = ref(false)
    const currentEquipmentData = ref<Partial<EquipmentListItem>>({})

    // 选中行
    const selectedRows = ref<EquipmentListItem[]>([])

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm = {
        name: undefined,
    }

    const searchForm = ref<Partial<Api.Equipment.EquipmentSearchParams>>({
        ...defaultSearchForm,
    })

    // 器械状态配置
    const EQUIPMENT_STATUS_CONFIG = {
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
     * 获取ID显示文本（显示为 "ID (子数据数量)" 格式）
     */
    const getIndexText = (row: EquipmentListItem) => {
        if (row.hasChildren && row.children && row.children.length > 0) {
            return `${row.id} (${row.children.length})`
        }
        return `${row.id}`
    }

    /**
     * 获取图标显示
     */
    const getIconDisplay = (row: EquipmentListItem) => {
        if (row.icon) {
            return h(ElImage, {
                src: row.icon,
                style: { width: '80px', height: '80px' },
                fit: 'cover',
                previewSrcList: [row.icon],
                previewTeleported: true,
            })
        }
        return h('span', { style: { color: '#999' } }, '-')
    }

    /**
     * 获取器械名称
     */
    const getNameText = (name: string) => {
        return name || '未知'
    }

    /**
     * 获取器械状态配置
     */
    const getStatusConfig = (status: number) => {
        return (
            EQUIPMENT_STATUS_CONFIG[status as keyof typeof EQUIPMENT_STATUS_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 获取语言配置
     */
    const getLanguageConfig = (language?: string) => {
        if (!language) {
            return { type: 'info' as const, text: '' }
        }
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
                {
                    'prop': 'id',
                    'label': 'ID',
                    'width': 150,
                    'header-align': 'left',
                    'align': 'left',
                    'formatter': (row: EquipmentListItem) => getIndexText(row),
                },
                {
                    'prop': 'icon',
                    'label': '图片',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: EquipmentListItem) => getIconDisplay(row),
                },
                {
                    'prop': 'name',
                    'label': '器械名称',
                    'width': 400,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: EquipmentListItem) => getNameText(row.name),
                },
                {
                    'prop': 'language',
                    'label': '语言',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: EquipmentListItem) => {
                        const languageConfig = getLanguageConfig(row.language)
                        if (!languageConfig.text) {
                            return h('span', '-')
                        }
                        return h(ElTag, { type: languageConfig.type }, () => languageConfig.text)
                    },
                },
                {
                    'prop': 'operator',
                    'label': '操作人',
                    'width': 600,
                    'header-align': 'center',
                    'align': 'center',
                },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 400,
                    'fixed': 'right', // 固定列
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: EquipmentListItem) => {
                        const buttons: any[] = []
                        const isTranslating = translatingIds.value.has(row.id)

                        // 主数据操作
                        if (!row.hasChildren) {
                            // 编辑
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

                            // 翻译（只有主数据且语言为空或中文时才显示）
                            if (!row.language || row.language === '中文') {
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

                            // 删除
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'danger',
                                        disabled: isTranslating,
                                        onClick: () => handleDeleteEquipment(row),
                                    },
                                    () => '删除',
                                ),
                            )

                            // 排序
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        disabled: isTranslating,
                                        onClick: () => handleSort(row),
                                    },
                                    () => '排序',
                                ),
                            )
                        } else {
                            // 子数据操作
                            // 启用/禁用
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
                                            //disabled: isTranslating,
                                            disabled: isTranslating || row.status === 1,
                                            onClick: () => handleDisable(row),
                                        },
                                        () => '禁用',
                                    ),
                                )
                            }

                            // 编辑（翻译后的子数据且已启用时不允许编辑）
                            const canEdit = row.status === 2
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
    const handleSearch = async (params: Partial<Api.Equipment.EquipmentSearchParams>) => {
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
     * 显示器械弹窗
     */
    const showDialog = (type: 'add' | 'edit' | 'view', row?: EquipmentListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentEquipmentData.value = row || {}
        nextTick(() => {
            dialogVisible.value = true
        })
    }

    /**
     * 删除器械
     */
    const handleDeleteEquipment = (row: EquipmentListItem): void => {
        ;(async () => {
            try {
                await ElMessageBox.confirm(`确定要删除该器械吗？`, '删除器械', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                })

                // 检查器械是否被使用（绑定了上架中的动作）
                try {
                    const checkResult = await fetchCheckEquipmentInUse(row.id)
                    if (checkResult.inUse) {
                        await ElMessageBox.alert('当前器械正在被使用，不允许删除', '提示', {
                            confirmButtonText: '确认',
                            type: 'warning',
                        })
                        return
                    }
                } catch (error) {
                    console.error('检查器械使用状态失败:', error)
                    // 如果检查接口失败，继续执行删除（根据业务需求决定）
                }

                await fetchDeleteEquipment(row.id)
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
    const handleDialogSubmit = async (payload?: Partial<EquipmentListItem>) => {
        try {
            const dataToSubmit = payload || { ...currentEquipmentData.value }

            if (dialogType.value === 'add') {
                await fetchCreateEquipment(dataToSubmit as Api.Equipment.EquipmentCreateBody)
                ElMessage.success('创建成功')
                await refreshCreate()
            } else if (dialogType.value === 'edit') {
                if (!dataToSubmit.id) {
                    ElMessage.error('缺少器械ID')
                    return
                }
                await fetchUpdateEquipment(dataToSubmit as Api.Equipment.EquipmentUpdateBody)
                ElMessage.success('更新成功')
                await refreshUpdate()
            }

            dialogVisible.value = false
            currentEquipmentData.value = {}
        } catch (error) {
            console.error('提交失败:', error)
            ElMessage.error('提交失败')
        }
    }

    /**
     * 启用器械（用于翻译后的子数据）
     */
    const handleEnable = (row: EquipmentListItem): void => {
        ;(async () => {
            try {
                // TODO: 调用启用API
                const index = (data.value as EquipmentListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as EquipmentListItem).status = 1
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
     * 禁用器械（用于翻译后的子数据）
     */
    const handleDisable = (row: EquipmentListItem): void => {
        ;(async () => {
            try {
                // TODO: 调用禁用API
                const index = (data.value as EquipmentListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as EquipmentListItem).status = 2
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
     * 翻译器械（23种语种）
     */
    const handleTranslate = (row: EquipmentListItem): void => {
        ;(async () => {
            try {
                // 标记为翻译中
                translatingIds.value.add(row.id)

                // 调用翻译API
                await fetchTranslateEquipment(row.id)
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
     * 排序器械
     */
    const handleSort = (row: EquipmentListItem): void => {
        ;(async () => {
            try {
                // TODO: 实现排序功能（可能需要弹窗输入排序值）
                ElMessage.info('排序功能开发中...')
                // await fetchUpdateEquipmentSort(row.id, newSort)
                // ElMessage.success('排序更新成功')
                // await refreshData()
            } catch (error) {
                console.error('排序失败:', error)
                ElMessage.error('排序失败')
            }
        })()
    }

    /**
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: EquipmentListItem[]): void => {
        selectedRows.value = selection
        console.log('选中行数据:', selectedRows.value)
    }
</script>

<style lang="scss" scoped>
    .equipment-page {
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
    }
</style>
