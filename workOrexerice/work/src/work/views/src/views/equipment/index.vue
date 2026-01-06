<template>
    <div class="equipment-page art-full-height">
        <ElCard>
            <div class="art-table-card-header">
                <div class="art-table-card-header-title">器械管理</div>
            </div>
        </ElCard>

        <EquipmentSearch v-model="searchForm" @search="handleSearch" @reset="handleResetSearch"></EquipmentSearch>

        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton @click="showDialog('add')" v-ripple>添加器械</ElButton>
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
        fetchGetEquipmentList,
        fetchCreateEquipment,
        fetchUpdateEquipment,
        fetchDeleteEquipment,
        fetchTranslateEquipment,
        fetchEnableEquipment,
    } from '@/api/equipment'
    import { fetchGetActionList } from '@/api/action'
    import EquipmentSearch from './modules/equipment-search.vue'
    import EquipmentDialog from './modules/equipment-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElButton, ElImage, ElLoading } from 'element-plus'

    defineOptions({ name: 'Equipment' })

    type EquipmentListItem = Api.Equipment.EquipmentListItem

    // 翻译状态
    const translatingIds = ref<Set<number>>(new Set())

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
        0: { type: 'danger' as const, text: '禁用' },
    } as const

    // 语言配置
    const LANGUAGE_CONFIG = {
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'en': '英文',
        'en-US': '英文',
        'en-GB': '英文',
        'ja': '日文',
        'ja-JP': '日文',
        'ko': '韩文',
        'ko-KR': '韩文',
        'es': '西班牙文',
        'es-ES': '西班牙文',
        'fr': '法文',
        'fr-FR': '法文',
        'de': '德文',
        'de-DE': '德文',
        'ru': '俄文',
        'ru-RU': '俄文',
        'pt': '葡萄牙文',
        'pt-BR': '葡萄牙文',
        'pt-PT': '葡萄牙文',
        'ar': '阿拉伯文',
        'ar-SA': '阿拉伯文',
        'it': '意大利文',
        'it-IT': '意大利文',
        'nl': '荷兰文',
        'nl-NL': '荷兰文',
        'pl': '波兰文',
        'pl-PL': '波兰文',
        'tr': '土耳其文',
        'tr-TR': '土耳其文',
        'vi': '越南文',
        'vi-VN': '越南文',
        'th': '泰文',
        'th-TH': '泰文',
        'id': '印尼文',
        'id-ID': '印尼文',
        'ms': '马来文',
        'ms-MY': '马来文',
        'hi': '印地文',
        'hi-IN': '印地文',
        'bn': '孟加拉文',
        'bn-IN': '孟加拉文',
        'uk': '乌克兰文',
        'uk-UA': '乌克兰文',
    } as const

    /**
     * 获取ID显示文本（显示为 "ID (子数据数量)" 格式）
     */
    const getIndexText = (row: EquipmentListItem): string => {
        if ((row as any)._isChild) {
            const parentRowIndex = (row as any)._parentRowIndex
            const childIndex = (row as any)._childIndex
            if (parentRowIndex !== undefined && childIndex !== undefined) {
                const pageOffset = (pagination.page - 1) * pagination.size
                const parentDisplayIndex = pageOffset + parentRowIndex + 1
                return `${parentDisplayIndex}-${childIndex}`
            }
            return `${(row as any)._childIndex || ''}`
        }

        if ((row as any)._rowIndex !== undefined) {
            const pageOffset = (pagination.page - 1) * pagination.size
            const displayIndex = pageOffset + (row as any)._rowIndex + 1
            if (row.hasChildren && row.children && row.children.length > 0) {
                return `${displayIndex} (${row.children.length})`
            }
            return `${displayIndex}`
        }

        if (row.hasChildren && row.children && row.children.length > 0) {
            return `${row.id} (${row.children.length})`
        }
        return `${row.id}`
    }

    /**
     * 获取图标显示
     */
    const getIconDisplay = (row: EquipmentListItem) => {
        const iconUrl = (row as any)._picture || row.picture || ''
        if (iconUrl) {
            return h(ElImage, {
                src: iconUrl,
                style: { width: '80px', height: '80px' },
                fit: 'cover',
                previewSrcList: [iconUrl],
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

    const getLanguageText = (langCode?: string) => {
        if (!langCode) {
            return '未知'
        }
        return LANGUAGE_CONFIG[langCode as keyof typeof LANGUAGE_CONFIG] || langCode
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
    //const getLanguageConfig = (language?: string) => {
    //    if (!language) {
    //        return { type: 'info' as const, text: '' }
    //    }
    //    return (
    //        LANGUAGE_CONFIG[language as keyof typeof LANGUAGE_CONFIG] || {
    //            type: 'info' as const,
    //            text: language || '未知',
    //        }
    //    )
    //}

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
            apiFn: fetchGetEquipmentList,
            apiParams: {
                page: 1,
                size: 30,
                ...searchForm.value,
            },
            columnsFactory: () => [
                {
                    'prop': 'id',
                    'label': '序号',
                    'width': 120,
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
                    'width': 200,
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
                    'formatter': (row: EquipmentListItem) => getLanguageText(row.langCode),
                },
                {
                    'prop': 'status',
                    'label': '状态',
                    'width': 200,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: EquipmentListItem) => {
                        const statusConfig = getStatusConfig(row.status)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                { 'prop': 'operator', 'label': '操作人', 'width': 350, 'header-align': 'center', 'align': 'center' },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 300,
                    'fixed': 'right',
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: EquipmentListItem) => {
                        const buttons: any[] = []
                        const isTranslating = translatingIds.value.has(row.id)

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

                        const canEdit = !(row as any)._isChild || ((row as any)._isChild && row.status === 0)
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

                        if (row.langName === '简体中文' || row.langCode === 'zh-CN') {
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

                        if ((row as any)._isChild) {
                            if (row.status === 0) {
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

                type EquipmentItemWithTree = EquipmentListItem & {
                    rootId?: number | string | null
                    children?: EquipmentListItem[]
                    hasChildren?: boolean
                    _isChild?: boolean
                    _parentIndex?: number
                    _childIndex?: number
                    _rowIndex?: number
                }

                // 存储最终的根节点
                const rootRecords: EquipmentItemWithTree[] = []

                // 处理每条记录（新的数据结构：translations 作为子数组返回）
                records.forEach(item => {
                    const itemWithTree: EquipmentItemWithTree = {
                        ...item,
                        hasChildren: false,
                    }

                    // 检查是否有 translations 字段（翻译后的子器械）
                    if (item.translations && Array.isArray(item.translations) && item.translations.length > 0) {
                        // 为子节点添加标记和序号信息
                        itemWithTree.children = item.translations.map((child, index) => ({
                            ...child,
                            _isChild: true,
                            _childIndex: index + 1, // 子节点序号从1开始
                        }))
                        itemWithTree.hasChildren = true
                    }

                    // 将根节点添加到结果数组
                    rootRecords.push(itemWithTree)
                })

                // 按ID升序排序根节点，并为每个根节点设置_rowIndex（用于序号显示）
                const sortedRootRecords = rootRecords.sort((a, b) => Number(a.id) - Number(b.id))
                sortedRootRecords.forEach((rootNode, index) => {
                    rootNode._rowIndex = index
                    // 为子节点设置父序号（在getIndexText中会基于pagination动态计算）
                    if (rootNode.children && rootNode.children.length > 0) {
                        rootNode.children.forEach((child, childIndex) => {
                            ;(child as any)._parentRowIndex = index // 保存父节点的行索引，用于后续计算
                            ;(child as any)._childIndex = childIndex + 1
                        })
                    }
                })

                return sortedRootRecords
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

                try {
                    const actionListResult = await fetchGetActionList({
                        instrumentIds: [row.id],
                        status: 2,
                        page: 1,
                        size: 1,
                    })
                    if (actionListResult.list && actionListResult.list.length > 0) {
                        await ElMessageBox.alert('当前器械正在被使用，不允许删除', '提示', {
                            confirmButtonText: '确认',
                            type: 'warning',
                        })
                        return
                    }
                } catch (error) {
                    console.error('检查器械使用状态失败:', error)
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
                await fetchUpdateEquipment(dataToSubmit.id, dataToSubmit as Api.Equipment.EquipmentUpdateBody)
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
                await fetchEnableEquipment({
                    id: row.id,
                    status: 1,
                })
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
                await fetchEnableEquipment({
                    id: row.id,
                    status: 0,
                })
                const index = (data.value as EquipmentListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as EquipmentListItem).status = 0
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
            const loadingInstance = ElLoading.service({
                lock: true,
                text: '正在翻译...',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            try {
                // 标记为翻译中
                translatingIds.value.add(row.id)

                // 调用翻译API
                await fetchTranslateEquipment({ id: row.id })
                ElMessage.success('翻译成功')
                await refreshData()
            } catch (error) {
                console.error('翻译失败:', error)
                ElMessage.error('翻译失败')
            } finally {
                // 移除翻译中标记
                translatingIds.value.delete(row.id)
                loadingInstance.close()
            }
        })()
    }

    /**
     * 排序器械
     */
    //const handleSort = (row: EquipmentListItem): void => {
    //    ;(async () => {
    //        try {
    //            // TODO: 实现排序功能（可能需要弹窗输入排序值）
    //            ElMessage.info('排序功能开发中...')
    //            // await fetchUpdateEquipmentSort(row.id, newSort)
    //            // ElMessage.success('排序更新成功')
    //            // await refreshData()
    //        } catch (error) {
    //            console.error('排序失败:', error)
    //            ElMessage.error('排序失败')
    //        }
    //    })()
    //}

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
