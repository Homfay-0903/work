<template>
    <div class="coach-page art-full-height">
        <div class="art-table-card-header">
            <div class="art-table-card-header-title"> 教练管理 </div>
        </div>

        <!-- 搜索栏 -->
        <CoachSearch
            v-if="hasAuth('query')"
            v-model="searchForm"
            @search="handleSearch"
            @reset="handleResetSearch"
        ></CoachSearch>

        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton v-if="hasAuth('add')" @click="showDialog('add')" v-ripple>添加教练</ElButton>
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
        fetchGetCoachList,
        fetchCreateCoach,
        fetchUpdateCoach,
        fetchDeleteCoach,
        fetchTranslateCoach,
        fetchEnableCoach,
    } from '@/api/coach'
    import { fetchGetActionList } from '@/api/action'
    import CoachSearch from './modules/coach-search.vue'
    import CoachDialog from './modules/coach-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElButton, ElImage, ElLoading } from 'element-plus'
    import { useAuth } from '@/hooks/core/useAuth'

    defineOptions({ name: 'Coach' })

    type CoachListItem = Api.Coach.CoachListItem

    // 翻译状态
    const translatingIds = ref<Set<number>>(new Set())

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
        0: { type: 'danger' as const, text: '禁用' },
    } as const

    // 语言配置
    const LANGUAGE_CONFIG = {
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'zh-HK': '香港中文',
        'sv-SE': '瑞典文',
        'hu-HU': '匈牙利文',
        'fi-FI': '芬兰文',
        'el-GR': '希腊文',
        'cs-CZ': '捷克文',
        'ar-AR': '阿拉伯文',
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

    // 权限控制
    const { hasAuth } = useAuth()

    /**
     * 获取序号文本
     * 根节点：显示基于分页的序号（如：1, 2, 3...）
     * 子节点：显示父序号-子序号（如：1-1, 1-2, 1-3...）
     * 注意：子节点不占用分页序号，只显示为父序号-子序号
     */
    const getIndexText = (row: CoachListItem): string => {
        // 如果是子节点（有父节点），显示自定义序号
        if ((row as any)._isChild) {
            const parentRowIndex = (row as any)._parentRowIndex
            const childIndex = (row as any)._childIndex
            if (parentRowIndex !== undefined && childIndex !== undefined) {
                // 计算父节点的显示序号
                const pageOffset = (pagination.page - 1) * pagination.size
                const parentDisplayIndex = pageOffset + parentRowIndex + 1
                return `${parentDisplayIndex}-${childIndex}`
            }
            // 兜底
            return `${(row as any)._childIndex || ''}`
        }

        // 根节点：显示基于分页的序号
        // 使用 _rowIndex 属性（在数据转换时设置）
        if ((row as any)._rowIndex !== undefined) {
            const pageOffset = (pagination.page - 1) * pagination.size
            const displayIndex = pageOffset + (row as any)._rowIndex + 1
            // 如果有子节点，显示子节点数量
            if (row.hasChildren && row.children && row.children.length > 0) {
                return `${displayIndex} (${row.children.length})`
            }
            return `${displayIndex}`
        }

        // 兜底：如果没有_rowIndex，使用id
        if (row.hasChildren && row.children && row.children.length > 0) {
            return `${row.id} (${row.children.length})`
        }
        return `${row.id}`
    }

    /**
     * 获取头像显示
     */
    const getAvatarDisplay = (row: CoachListItem) => {
        const avatarUrl = (row as any)._avatar || row.avatar
        if (avatarUrl) {
            return h(ElImage, {
                src: avatarUrl,
                style: { width: '80px', height: '80px' },
                fit: 'cover',
                previewSrcList: [avatarUrl],
                previewTeleported: true,
            })
        }
        return h('span', { style: { color: '#999' } }, '无头像')
    }

    /**
     * 获取教练名称
     */
    const getNameText = (row: CoachListItem) => {
        return row.name || '未知'
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
    const getLanguageText = (language: string) => {
        return LANGUAGE_CONFIG[language as keyof typeof LANGUAGE_CONFIG] || language || '未知'
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
            apiFn: fetchGetCoachList,
            apiParams: {
                page: 1,
                size: 30,
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
                    'formatter': (row: CoachListItem) => getIndexText(row),
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
                    'formatter': (row: CoachListItem) => getNameText(row),
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
                    'formatter': (row: CoachListItem) => getLanguageText(row.langCode || ''),
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

                        // 查看（仅在有权限时显示）
                        if (hasAuth('view')) {
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
                        }

                        // 编辑（翻译后的子数据且已启用时不允许编辑）
                        const canEdit = !(row as any)._isChild || ((row as any)._isChild && row.status === 0)
                        if (canEdit && hasAuth('edit')) {
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

                        // 删除（仅在有权限时显示）
                        if (hasAuth('delete')) {
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
                        }

                        // 全部翻译（只有主数据才显示）
                        if (
                            hasAuth('translate') &&
                            !row.hasChildren &&
                            (row.langName === '简体中文' || row.langCode === 'zh-CN')
                        ) {
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

                        // 启用/禁用（仅翻译后的子数据显示，且有权限时显示）
                        if (row.status === 0 && hasAuth('enable')) {
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
                        } else if (row.status === 1 && hasAuth('disable')) {
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
                        //}

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

                type CoachItemWithTree = CoachListItem & {
                    rootId?: number | string | null
                    children?: CoachListItem[]
                    hasChildren?: boolean
                    _isChild?: boolean
                    _parentIndex?: number
                    _childIndex?: number
                    _rowIndex?: number
                }

                // 存储最终的根节点
                const rootRecords: CoachItemWithTree[] = []

                // 处理每条记录（新的数据结构：translations 作为子数组返回）
                records.forEach(item => {
                    const itemWithTree: CoachItemWithTree = {
                        ...item,
                        hasChildren: false,
                    }

                    // 检查是否有 translations 字段（翻译后的子教练）
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

                // 检查教练是否绑定了上架中的动作
                try {
                    const actionListResult = await fetchGetActionList({
                        coachId: row.id,
                        status: 2,
                        page: 1,
                        size: 1,
                    })
                    if (actionListResult.list && actionListResult.list.length > 0) {
                        await ElMessageBox.alert('当前教练正在被使用，不允许删除', '提示', {
                            confirmButtonText: '确认',
                            type: 'warning',
                        })
                        return
                    }
                } catch (error) {
                    console.error('检查教练使用状态失败:', error)
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
                await fetchUpdateCoach(dataToSubmit.id, dataToSubmit as Api.Coach.CoachUpdateBody)
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
                await fetchEnableCoach({
                    id: row.id,
                    status: 1,
                })
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
                await fetchEnableCoach({
                    id: row.id,
                    status: 0,
                })
                const index = (data.value as CoachListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as CoachListItem).status = 0
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
     * 翻译教练
     */
    const handleTranslate = (row: CoachListItem): void => {
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
                await fetchTranslateCoach({ id: row.id })
                ElMessage.success('翻译成功')
                await refreshData()
            } catch (error) {
                console.error('翻译失败:', error)
                ElMessage.error('翻译失败')
            } finally {
                // 移除翻译中标记
                translatingIds.value.delete(row.id)
                // 关闭加载提示
                loadingInstance.close()
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
