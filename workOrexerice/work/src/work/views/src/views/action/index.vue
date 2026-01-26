<template>
    <div class="action-page art-full-height">
        <!-- 型号tab栏 -->
        <ElCard class="model-tabs-card" shadow="never">
            <div class="model-tabs-wrapper">
                <div class="model-tabs-label"></div>
                <ElTabs v-model="activeModelValue" @tab-click="handleModelChange">
                    <ElTabPane v-for="model in modelList" :key="model.value" :label="model.label" :name="model.value" />
                </ElTabs>
            </div>
        </ElCard>

        <!-- 搜索栏 -->
        <ActionSearch
            v-if="hasAuth('query')"
            v-model="searchForm"
            @search="handleSearch"
            @reset="handleResetSearch"
        ></ActionSearch>

        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton v-if="hasAuth('add')" @click="showDialog('add')" v-ripple>添加动作</ElButton>
                    </ElSpace>
                </template>
            </ArtTableHeader>

            <!-- 表格 -->
            <ArtTable
                tableLayout="fixed"
                ref="tableRef"
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
                <!-- 自定义适用型号列 -->
                <template #tag="{ row }">
                    <div style="min-height: 32px; line-height: 20px; padding: 4px 0" v-html="getTagText(row)"></div>
                </template>
                <template #instruments="{ row }">
                    <div
                        style="min-height: 32px; line-height: 20px; padding: 4px 0"
                        v-html="getEquipmentText(row)"
                    ></div>
                </template>
                <template #part="{ row }">
                    <div style="min-height: 32px; line-height: 20px; padding: 4px 0" v-html="getPartText(row)"></div>
                </template>
            </ArtTable>

            <!-- 动作弹窗 -->
            <ActionDialog
                v-model:visible="dialogVisible"
                :type="dialogType"
                :action-data="currentActionData"
                @submit="handleDialogSubmit"
            />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import { ref, nextTick, h, onMounted } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchGetActionList, fetchDeleteAction, fetchUpdateActionStatus, fetchTranslateAction } from '@/api/action'
    import { fetchGetTagList } from '@/api/tag'
    import ActionSearch from './modules/action-search.vue'
    import ActionDialog from './modules/action-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElTabs, ElTabPane, ElButton, ElLoading } from 'element-plus'
    import { useAuth } from '@/hooks/core/useAuth'
    import type { TabsPaneContext } from 'element-plus'
    import { dataCache } from '@/utils/cache/dataCache'
    import {
        MUSCLE_REGIONS_TRANSLATIONS,
        ACTION_TYPES_TRANSLATIONS,
        STATUS_TRANSLATIONS,
        DIFFICULTY_TRANSLATIONS,
        SCENE_TRANSLATIONS,
    } from '@/utils/translations'

    defineOptions({ name: 'Action' })

    type ActionListItem = Api.Action.ActionListItem

    // 弹窗相关
    const dialogType = ref<'add' | 'edit' | 'view'>('add')
    const dialogVisible = ref(false)
    const currentActionData = ref<Partial<ActionListItem>>({})

    // 选中行
    const selectedRows = ref<ActionListItem[]>([])

    // 表格引用（用于控制展开/收起）
    const tableRef = ref<any>(null)

    // 型号tab相关
    const activeModel = ref<string>('全部型号')
    const activeModelValue = ref<number>(0)
    const modelList = ref<Array<{ label: string; value: number }>>([{ label: '全部型号', value: 0 }])

    // 权限相关
    const { hasAuth } = useAuth()

    /**
     * 获取型号列表（使用缓存优化）
     */
    const fetchModelList = async () => {
        try {
            const cached = dataCache.get<Array<{ label: string; value: number }>>('action-model-list')
            if (cached) {
                modelList.value = cached
                return
            }

            const response = await fetchGetTagList({
                page: 1,
                size: 1000,
            })
            const tagModels = response.list.map(tag => ({
                label: tag.name,
                value: tag.id,
            }))
            const fullModelList = [{ label: '全部型号', value: 0 }, ...tagModels]

            modelList.value = fullModelList
            dataCache.set('action-model-list', fullModelList, 30 * 60 * 1000) // 30分钟缓存
        } catch (error) {
            console.error('获取型号列表失败:', error)
            modelList.value = [
                { label: '全部型号', value: 0 },
                { label: 'T5X', value: 1 },
                { label: 'Motionstation', value: 2 },
            ]
        }
    }

    // 组件挂载时获取型号列表
    onMounted(async () => {
        await fetchModelList()
    })

    /**
     * 处理型号切换
     */
    const handleModelChange = async (tab: TabsPaneContext) => {
        //console.log('切换型号:', tab.props)
        // 切换型号后更新activeModel
        activeModel.value = tab.props.label

        // 获取选中的型号ID
        const selectedModelId = Number(tab.props.name)

        if (selectedModelId === 0) {
            // 如果选择"全部型号"，清空tagIds参数
            delete (searchParams as any).tagIds
        } else {
            // 设置tagIds参数，传递给后端API
            ;(searchParams as any).tagIds = [selectedModelId]
        }

        // 调用API重新获取数据
        await getData()
    }

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

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm = {
        scene: undefined,
        difficulty: undefined,
        instrumentIds: [],
        muscleRegionIds: [],
        type: undefined,
        status: undefined,
        isAIAction: undefined,
        coachId: undefined,
        name: undefined,
        tagIds: [],
    }

    const searchForm = ref<Partial<Api.Action.ActionSearchParams>>({
        ...defaultSearchForm,
    })

    /**
     * 获取序号文本
     * 根节点：显示基于分页的序号（如：1, 2, 3...）
     * 子节点：显示父序号-子序号（如：1-1, 1-2, 1-3...）
     * 注意：子节点不占用分页序号，只显示为父序号-子序号
     */
    const getIndexText = (row: ActionListItem): string => {
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
     * 获取标签文本
     */
    const getTagText = (row: ActionListItem) => {
        if (!row.tags || row.tags.length === 0) {
            return '无'
        }
        return row.tags.map(tag => tag.name || '未知').join('<br>')
    }

    /**
     * 获取动作类型文本
     */
    const getTypeText = (type: number | string, langCode: string = 'zh-CN') => {
        const typeKey = typeof type === 'number' ? type : parseInt(type, 10)
        const typeMap: Record<number, string> = {
            1: '视频动作',
            2: '非视频动作',
            3: '片头',
            4: '片尾',
        }
        const typeText = typeMap[typeKey] || '其他'
        return (ACTION_TYPES_TRANSLATIONS as Record<string, Record<string, string>>)[langCode]?.[typeText] || typeText
    }

    /**
     * 获取适用场景文本
     */
    const getSceneText = (scene: number | string, langCode: string = 'zh-CN') => {
        const sceneKey = typeof scene === 'number' ? scene : parseInt(scene, 10)
        const sceneMap: Record<number, string> = {
            1: '力量训练',
            2: '普拉提',
            3: '有氧减脂',
            4: '拉伸康复',
            5: '评估筛查',
        }
        const sceneText = sceneMap[sceneKey] || '其他'
        return (SCENE_TRANSLATIONS as Record<string, Record<string, string>>)[langCode]?.[sceneText] || sceneText
    }

    /**
     * 获取器械文本
     */
    const getEquipmentText = (row: ActionListItem) => {
        if (!row.instruments || row.instruments.length === 0) {
            return '无'
        }
        return row.instruments.map(instrument => instrument.name || '未知').join('<br>')
    }

    /**
     * 获取训练部位文本
     */
    const getPartText = (row: ActionListItem) => {
        if (!row.muscleRegions || row.muscleRegions.length === 0) {
            return '无'
        }
        const langCode = row.langCode || 'zh-CN'
        return row.muscleRegions
            .map(part => {
                const partName = part.name || '未知'
                return (
                    (MUSCLE_REGIONS_TRANSLATIONS as Record<string, Record<string, string>>)[langCode]?.[partName] ||
                    partName
                )
            })
            .join('<br>')
    }

    /**
     * 获取教练文本
     */
    const getCoachText = (row: ActionListItem) => {
        return row.coach?.name || '无'
    }

    /**
     * 获取语言文本
     */
    const getLanguageText = (langCode: string) => {
        return LANGUAGE_CONFIG[langCode as keyof typeof LANGUAGE_CONFIG] || '未知'
    }

    /**
     * 获取状态配置
     */
    const getStatusConfig = (status?: string | number, langCode: string = 'zh-CN') => {
        if (status === undefined) {
            return {
                type: 'info' as const,
                text: '未知',
            }
        }
        const statusKey = typeof status === 'number' ? status : Number(status)
        const statusMap: Record<number, { type: string; text: string }> = {
            1: { type: 'info', text: '草稿' },
            2: { type: 'success', text: '上架' },
            3: { type: 'warning', text: '下架' },
        }
        const statusConfig = statusMap[statusKey] || { type: 'info', text: '未知' }
        const translatedText =
            (STATUS_TRANSLATIONS as Record<string, Record<string, string>>)[langCode]?.[statusConfig.text] ||
            statusConfig.text
        return {
            type: statusConfig.type as any,
            text: translatedText,
        }
    }

    /**
     * 获取难度配置
     */
    const getDifficultyConfig = (difficulty?: string | number, langCode: string = 'zh-CN') => {
        if (difficulty === undefined) {
            return {
                type: 'info' as const,
                text: '未知',
            }
        }
        const difficultyKey = typeof difficulty === 'number' ? difficulty : Number(difficulty)
        const difficultyMap: Record<number, { type: string; text: string }> = {
            1: { type: 'success', text: '初级' },
            2: { type: 'warning', text: '中级' },
            3: { type: 'danger', text: '高级' },
        }
        const difficultyConfig = difficultyMap[difficultyKey] || { type: 'info', text: '未知' }
        const translatedText =
            (DIFFICULTY_TRANSLATIONS as Record<string, Record<string, string>>)[langCode]?.[difficultyConfig.text] ||
            difficultyConfig.text
        return {
            type: difficultyConfig.type as any,
            text: translatedText,
        }
    }

    /**
     * 获取AI支持状态
     */
    const getAiSupportStatus = (relatedActionId?: number | null) => {
        return relatedActionId != null
            ? { type: 'success' as const, text: '支持' }
            : { type: 'info' as const, text: '不支持' }
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
            // 使用真实 API
            apiFn: fetchGetActionList,
            apiParams: {
                page: 1,
                size: 20,
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
                    'formatter': (row: ActionListItem) => getIndexText(row),
                },
                {
                    'prop': 'tag',
                    'label': '适用型号',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                    'useSlot': true,
                },
                { 'prop': 'name', 'label': '动作名称', 'width': 150, 'header-align': 'center', 'align': 'center' },
                {
                    'prop': 'type',
                    'label': '动作类型',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => getTypeText(row.type, row.langCode || 'zh-CN'),
                },
                {
                    'prop': 'scene',
                    'label': '适用场景',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => getSceneText(row.scene, row.langCode || 'zh-CN'),
                },
                {
                    'prop': 'difficulty',
                    'label': '难度',
                    'width': 130,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const difficultyConfig = getDifficultyConfig(row.difficulty, row.langCode || 'zh-CN')
                        return h(ElTag, { type: difficultyConfig.type as any }, () => difficultyConfig.text)
                    },
                },
                {
                    'prop': 'instruments',
                    'label': '器械',
                    'width': 150,
                    'header-align': 'center',
                    'align': 'center',
                    'useSlot': true,
                },
                {
                    'prop': 'coach',
                    'label': '教练',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => getCoachText(row),
                },
                {
                    'prop': 'part',
                    'label': '训练部位',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                    'useSlot': true,
                },
                {
                    'prop': 'language',
                    'label': '语言',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => getLanguageText(row.langCode || ''),
                },
                {
                    'prop': 'status',
                    'label': '状态',
                    'width': 100,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const statusConfig = getStatusConfig(row.status, row.langCode || 'zh-CN')
                        return h(ElTag, { type: statusConfig.type as any }, () => statusConfig.text)
                    },
                },
                {
                    'prop': 'aiSupport',
                    'label': 'AI支持',
                    'width': 100,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const aiStatus = getAiSupportStatus(row.relatedActionId)
                        return h(ElTag, { type: aiStatus.type }, () => aiStatus.text)
                    },
                },
                { 'prop': 'operator', 'label': '操作人', 'width': 180, 'header-align': 'center', 'align': 'center' },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 280,
                    'fixed': 'right', // 固定列
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const buttons: any[] = []

                        // 上架：草稿或已下架状态且有权限时显示
                        if (hasAuth('enable') && (row.status === 1 || row.status === 3)) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'success',
                                        disabled: false,
                                        onClick: () => handleShelve(row),
                                    },
                                    () => '上架',
                                ),
                            )
                        }

                        // 下架：已上架状态且有权限时显示
                        if (hasAuth('disable') && row.status === 2) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'warning',
                                        disabled: false,
                                        onClick: () => handleUnshelve(row),
                                    },
                                    () => '下架',
                                ),
                            )
                        }

                        // 查看（仅有权限时显示）
                        if (hasAuth('view')) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        disabled: false,
                                        onClick: () => showDialog('view', row),
                                    },
                                    () => '查看',
                                ),
                            )
                        }

                        if (row.status !== 2) {
                            // 编辑（仅有权限时显示）
                            if (hasAuth('edit')) {
                                buttons.push(
                                    h(
                                        ElButton,
                                        {
                                            link: true,
                                            disabled: false,
                                            onClick: () => showDialog('edit', row),
                                        },
                                        () => '编辑',
                                    ),
                                )
                            }

                            // 翻译：中文动作内容创建后且有权限时出现
                            if (hasAuth('translate') && (row.langCode === 'zh-CN' || row.langName === '中文')) {
                                buttons.push(
                                    h(
                                        ElButton,
                                        {
                                            link: true,
                                            disabled: false,
                                            onClick: () => handleTranslate(row),
                                        },
                                        () => '翻译',
                                    ),
                                )
                            }

                            // 删除（仅有权限时显示）
                            if (hasAuth('delete')) {
                                buttons.push(
                                    h(
                                        ElButton,
                                        {
                                            link: true,
                                            type: 'danger',
                                            disabled: false,
                                            onClick: () => deleteAction(row),
                                        },
                                        () => '删除',
                                    ),
                                )
                            }
                        }

                        return h(
                            'div',
                            { style: 'display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;' },
                            buttons,
                        )
                    },
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
            dataTransformer: records => {
                // 类型守卫检查
                if (!Array.isArray(records)) {
                    console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
                    return []
                }

                type ActionItemWithTree = ActionListItem & {
                    rootId?: number | string | null
                    children?: ActionListItem[]
                    hasChildren?: boolean
                    _isChild?: boolean
                    _parentIndex?: number
                    _childIndex?: number
                    _rowIndex?: number
                }

                // 存储最终的根节点
                const rootRecords: ActionItemWithTree[] = []

                // 处理每条记录（新的数据结构：translations 作为子数组返回）
                records.forEach(item => {
                    const itemWithTree: ActionItemWithTree = {
                        ...item,
                    }

                    // 检查是否有 translations 字段（翻译后的子动作）
                    if (item.translations && Array.isArray(item.translations) && item.translations.length > 0) {
                        // 为子节点添加标记和序号信息，并继承根节点的 coach 信息
                        itemWithTree.children = item.translations.map((child, index) => ({
                            ...child,
                            _isChild: true,
                            _childIndex: index + 1, // 子节点序号从1开始
                            // 如果子节点没有 coach 对象，继承根节点的 coach
                            //coach: item.coach,
                        }))
                        itemWithTree.hasChildren = true
                    }

                    // 将根节点添加到结果数组
                    rootRecords.push(itemWithTree)
                })

                // 按ID降序排序根节点，并为每个根节点设置_rowIndex（用于序号显示）
                const sortedRootRecords = rootRecords.sort((a, b) => Number(b.id) - Number(a.id))
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
    const handleSearch = async (params: Partial<Api.Action.ActionSearchParams>) => {
        console.log('筛选参数:', params)

        const filterKeys = [
            'scene',
            'difficulty',
            'instrumentIds',
            'muscleRegionIds',
            'type',
            'status',
            'isAIAction',
            'coachId',
            'name',
            'tagIds',
        ]

        filterKeys.forEach(key => {
            delete (searchParams as any)[key]
        })

        Object.assign(searchParams, params)
        delete (searchParams as any).model

        await getData()
        console.log('表格数据：', data.value)
    }

    /**
     * 重置搜索处理
     */
    const handleResetSearch = () => {
        console.log('重置搜索表单')
        searchForm.value = { ...defaultSearchForm }
        resetSearchParams()
        delete (searchParams as any).model
    }

    /**
     * 显示动作弹窗
     */
    const showDialog = (type: 'add' | 'edit' | 'view', row?: ActionListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentActionData.value = row || {}
        console.log('currentActionData.value:', currentActionData.value)
        nextTick(() => {
            dialogVisible.value = true
        })
    }

    /**
     * 删除动作
     */
    const deleteAction = (row: ActionListItem): void => {
        console.log('删除动作:', row)
        ;(async () => {
            try {
                await ElMessageBox.confirm(`确定要删除该动作吗？`, '删除动作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                })

                await fetchDeleteAction(row.id)
                ElMessage.success('删除成功')
                await refreshRemove()
            } catch (error) {
                console.log(error)
                // 取消或失败
            }
        })()
    }

    /**
     * 处理弹窗提交事件
     */
    const handleDialogSubmit = async () => {
        try {
            if (dialogType.value === 'add') {
                ElMessage.success('创建成功')
                await refreshCreate()

                await nextTick()
                if (tableRef.value?.elTableRef) {
                    const tableBody = tableRef.value.elTableRef.$el.querySelector('.el-table__body-wrapper')
                    if (tableBody) {
                        tableBody.scrollTop = 0
                    }
                }
            } else if (dialogType.value === 'edit') {
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
     * 上架动作
     */
    const handleShelve = (row: ActionListItem): void => {
        ;(async () => {
            try {
                await fetchUpdateActionStatus({
                    id: row.id,
                    status: 2,
                })
                const index = (data.value as ActionListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as ActionListItem).status = 1
                }
                ElMessage.success('上架成功')
                await refreshData()
            } catch (error) {
                console.log(error)
                ElMessage.error('上架失败')
            }
        })()
    }

    /**
     * 下架动作
     */
    const handleUnshelve = (row: ActionListItem): void => {
        ;(async () => {
            try {
                await fetchUpdateActionStatus({
                    id: row.id,
                    status: 3,
                })
                const index = (data.value as ActionListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as ActionListItem).status = 2
                }
                ElMessage.success('下架成功')
                await refreshData()
            } catch (error) {
                console.log(error)
                ElMessage.error('下架失败')
            }
        })()
    }

    /**
     * 翻译动作
     */
    const handleTranslate = (row: ActionListItem): void => {
        ;(async () => {
            const loadingInstance = ElLoading.service({
                lock: true,
                text: '正在翻译...',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            try {
                console.log('翻译动作:', row)
                // 保存当前动作的id（用于翻译后定位并展开）
                const actionId = Number(row.id)

                // 调用翻译API
                await fetchTranslateAction({
                    rootId: actionId,
                })
                ElMessage.success('翻译成功')
                loadingInstance.close()

                // 刷新数据以显示翻译后的子动作
                await refreshData()

                // 等待DOM更新后，找到对应的根节点并展开
                await nextTick()

                // 在刷新后的数据中找到对应的根节点（通过id）
                if (tableRef.value?.elTableRef && data.value) {
                    const rootNode = (data.value as ActionListItem[]).find(node => Number(node.id) === actionId)
                    if (rootNode) {
                        // 展开该行
                        tableRef.value.elTableRef.toggleRowExpansion(rootNode, true)
                    }
                }
            } catch (error) {
                console.log(error)
                ElMessage.error('翻译失败')
            } finally {
                loadingInstance.close()
            }
        })()
    }

    /**
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: ActionListItem[]): void => {
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
