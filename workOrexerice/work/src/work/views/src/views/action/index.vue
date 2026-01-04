<template>
    <div class="action-page art-full-height">
        <!-- 型号tab栏 -->
        <ElCard class="model-tabs-card" shadow="never">
            <div class="model-tabs-wrapper">
                <div class="model-tabs-label">型号选择</div>
                <ElTabs v-model="activeModelValue" @tab-click="handleModelChange">
                    <ElTabPane v-for="model in modelList" :key="model.value" :label="model.label" :name="model.value" />
                </ElTabs>
            </div>
        </ElCard>

        <!-- 搜索栏 -->
        <ActionSearch v-model="searchForm" @search="handleSearch" @reset="handleResetSearch"></ActionSearch>

        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton @click="showDialog('add')" v-ripple>添加动作</ElButton>
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
    import { ElTag, ElMessageBox, ElMessage, ElTabs, ElTabPane, ElButton } from 'element-plus'
    import type { TabsPaneContext } from 'element-plus'

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
    const activeModel = ref<string>('全部型号') // 空字符串表示"全部型号"
    const activeModelValue = ref<number>(0)
    const modelList = ref<Array<{ label: string; value: number }>>([{ label: '全部型号', value: 0 }])

    /**
     * 获取型号列表（从标签API获取）
     */
    const fetchModelList = async () => {
        try {
            const response = await fetchGetTagList({
                page: 1,
                size: 1000, // 获取所有标签
            })
            // 将标签列表转换为型号列表格式，添加到"全部型号"之后
            const tagModels = response.list.map(tag => ({
                label: tag.name,
                value: tag.id,
            }))
            modelList.value = [{ label: '全部型号', value: 0 }, ...tagModels]
        } catch (error) {
            console.error('获取型号列表失败:', error)
            // 如果获取失败，使用默认值
            modelList.value = [
                { label: '全部型号', value: 0 },
                { label: 'T5X', value: 1 },
                { label: 'Motionstation', value: 2 },
            ]
        }
    }

    // 组件挂载时获取型号列表
    onMounted(() => {
        fetchModelList()
    })

    /**
     * 处理型号切换
     */
    const handleModelChange = async (tab: TabsPaneContext) => {
        console.log('切换型号:', tab.props)
        // 切换型号后更新activeModel
        activeModel.value = tab.props.label

        // 前端过滤逻辑，不再调用后端API
        const selectedModelId = Number(tab.props.name)

        if (selectedModelId === 0) {
            // 如果选择"全部型号"，显示所有数据
            // 重新获取完整数据
            await getData()
        } else {
            // 前端过滤：筛选包含选中型号标签的数据
            // 先获取完整数据，然后在前端过滤
            await getData()

            // 过滤数据，只显示包含对应型号标签的动作
            const filteredData = (data.value || []).filter((row: ActionListItem) => {
                // 检查动作是否包含对应的型号标签
                if (!row.tags || row.tags.length === 0) {
                    return false
                }
                return row.tags.some(tag => Number(tag.id) === selectedModelId)
            })

            console.log('前端过滤后的数据:', filteredData)
            // 直接修改表格数据
            data.value = filteredData
        }
    }

    // 搜索表单（默认值，重置时会恢复到这里）
    const defaultSearchForm = {
        scene: undefined,
        difficulty: undefined,
        equipment: undefined,
        part: undefined,
        type: undefined,
        status: undefined,
        aiSupport: undefined,
        coachId: undefined,
        name: undefined,
    }

    const searchForm = ref<Partial<Api.Action.ActionSearchParams>>({
        ...defaultSearchForm,
    })

    // 动作类型配置
    const TYPE_CONFIG = {
        1: '视频动作',
        2: '非视频动作',
        3: '片头',
        4: '片尾',
    } as const

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
    const getTypeText = (type: number | string) => {
        const typeKey = typeof type === 'number' ? type : parseInt(type, 10)
        return TYPE_CONFIG[typeKey as keyof typeof TYPE_CONFIG] || '其他'
    }

    // 适用场景配置
    const SCENE_CONFIG = {
        1: '力量训练',
        2: '普拉提',
        3: '有氧减脂',
        4: '拉伸康复',
    } as const

    /**
     * 获取适用场景文本
     */
    const getSceneText = (scene: number | string) => {
        const sceneKey = typeof scene === 'number' ? scene : parseInt(scene, 10)
        return SCENE_CONFIG[sceneKey as keyof typeof SCENE_CONFIG] || '其他'
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
        return row.muscleRegions.map(part => part.name || '未知').join('<br>')
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
    const getLanguageText = (row: ActionListItem) => {
        return row.langName || '无'
    }

    // 状态配置
    const STATUS_CONFIG = {
        1: { type: 'info' as const, text: '草稿' },
        2: { type: 'success' as const, text: '上架中' },
        3: { type: 'warning' as const, text: '已下架' },
    } as const

    /**
     * 获取状态配置
     */
    const getStatusConfig = (status?: string | number) => {
        if (status === undefined) {
            return {
                type: 'info' as const,
                text: '未知',
            }
        }
        const statusKey = typeof status === 'number' ? status : Number(status)
        return (
            STATUS_CONFIG[statusKey as keyof typeof STATUS_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    // 难度配置
    const DIFFICULTY_CONFIG = {
        '1': { type: 'success' as const, text: '初级' },
        '2': { type: 'warning' as const, text: '中级' },
        '3': { type: 'danger' as const, text: '高级' },
    } as const

    /**
     * 获取难度配置
     */
    const getDifficultyConfig = (difficulty?: string | number) => {
        if (difficulty === undefined) {
            return {
                type: 'info' as const,
                text: '未知',
            }
        }
        const difficultyKey = typeof difficulty === 'number' ? String(difficulty) : difficulty
        return (
            DIFFICULTY_CONFIG[difficultyKey as keyof typeof DIFFICULTY_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 获取AI支持状态
     */
    const getAiSupportStatus = (aiSupport?: boolean) => {
        return aiSupport ? { type: 'success' as const, text: '支持' } : { type: 'info' as const, text: '不支持' }
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
                size: 30,
                model: activeModel.value === '' ? undefined : activeModel.value,
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
                    'formatter': (row: ActionListItem) => getTypeText(row.type),
                },
                {
                    'prop': 'scene',
                    'label': '适用场景',
                    'width': 120,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => getSceneText(row.scene),
                },
                {
                    'prop': 'difficulty',
                    'label': '难度',
                    'width': 100,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const difficultyConfig = getDifficultyConfig(row.difficulty)
                        return h(ElTag, { type: difficultyConfig.type }, () => difficultyConfig.text)
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
                    'formatter': (row: ActionListItem) => getLanguageText(row),
                },
                {
                    'prop': 'status',
                    'label': '状态',
                    'width': 100,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const statusConfig = getStatusConfig(row.status)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                {
                    'prop': 'aiSupport',
                    'label': 'AI支持',
                    'width': 100,
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const aiStatus = getAiSupportStatus(row.aiSupport)
                        return h(ElTag, { type: aiStatus.type }, () => aiStatus.text)
                    },
                },
                { 'prop': 'operator', 'label': '操作人', 'width': 200, 'header-align': 'center', 'align': 'center' },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 280,
                    'fixed': 'right', // 固定列
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': (row: ActionListItem) => {
                        const buttons: any[] = []

                        // 上架：草稿或已下架状态时显示
                        if (row.status === 1 || row.status === 3) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'primary',
                                        onClick: () => handleShelve(row),
                                    },
                                    () => '上架',
                                ),
                            )
                        }

                        // 下架：已上架状态时显示
                        if (row.status === 2) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: 'primary',
                                        onClick: () => handleUnshelve(row),
                                    },
                                    () => '下架',
                                ),
                            )
                        }

                        // 查看
                        buttons.push(
                            h(
                                ElButton,
                                {
                                    link: true,
                                    onClick: () => showDialog('view', row),
                                },
                                () => '查看',
                            ),
                        )

                        // 编辑
                        buttons.push(
                            h(
                                ElButton,
                                {
                                    link: true,
                                    onClick: () => showDialog('edit', row),
                                },
                                () => '编辑',
                            ),
                        )

                        // 翻译：中文动作内容创建后出现
                        if (row.langCode === 'zh-CN' || row.langName === '中文') {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
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
                                    onClick: () => deleteAction(row),
                                },
                                () => '删除',
                            ),
                        )

                        return h(
                            'div',
                            { style: 'display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;' },
                            buttons,
                        )
                    },
                },
            ],
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

                // 按rootId分组（使用数字作为key便于比较）
                const groupMap = new Map<number, ActionItemWithTree[]>()

                records.forEach(item => {
                    // 确保rootId为数字类型（用于分组key）
                    const numericRootId = item.rootId ? Number(item.rootId) : Number(item.id)

                    if (!groupMap.has(numericRootId)) {
                        groupMap.set(numericRootId, [])
                    }

                    // 存储记录，保持rootId的原始类型（string）
                    const itemWithTree: ActionItemWithTree = {
                        ...item,
                        // rootId保持原样（可能是string），用于后续比较
                    }
                    groupMap.get(numericRootId)!.push(itemWithTree)
                })

                // 存储最终的根节点
                const rootRecords: ActionItemWithTree[] = []

                // 处理每个分组
                groupMap.forEach(group => {
                    if (!group || group.length === 0) return

                    // 1. 优先选择「id === rootId」的那条作为根节点（符合你说的：中文动作 rootId 与 id 相同）
                    let rootNode =
                        group.find(
                            item =>
                                item.rootId !== undefined &&
                                item.rootId !== null &&
                                Number(item.id) === Number(item.rootId),
                        ) ||
                        // 2. 其次尝试按语言判断中文动作
                        group.find(item => item.langCode === 'zh-CN' || item.langName === '中文') ||
                        // 3. 兜底：选择 id 最小的记录作为根节点
                        group.reduce((min, current) => {
                            return Number(current.id) < Number(min.id) ? current : min
                        })

                    // 过滤出子节点（除了根节点以外的所有记录）
                    const children = group.filter(item => Number(item.id) !== Number(rootNode.id))

                    // 设置子节点和hasChildren属性，并为子节点添加序号标记
                    if (children.length > 0) {
                        // 为子节点添加标记和序号信息
                        rootNode.children = children.map((child, index) => ({
                            ...child,
                            _isChild: true,
                            _childIndex: index + 1, // 子节点序号从1开始
                        }))
                        rootNode.hasChildren = true
                    }

                    // 将根节点添加到结果数组
                    rootRecords.push(rootNode)
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
    const handleSearch = async (params: Partial<Api.Action.ActionSearchParams>) => {
        console.log('筛选参数:', params)
        // 搜索参数赋值
        Object.assign(searchParams, params)
        delete (searchParams as any).model
        // 保存器械ID参数用于前端过滤
        const instrumentIds = (params as any).instrumentIds || []
        // 保存训练部位ID参数用于前端过滤
        const muscleRegionIds = (params as any).muscleRegionIds || []
        // 等待数据加载完成后打印，确保表格数据已更新
        await getData()
        console.log('表格数据：', data.value)

        // 添加前端器械过滤逻辑
        if (instrumentIds && instrumentIds.length > 0) {
            const filteredData = (data.value || []).filter((row: ActionListItem) => {
                // 如果行没有instruments属性，或者instruments数组为空，则不匹配
                if (!row.instruments || !Array.isArray(row.instruments) || row.instruments.length === 0) {
                    return false
                }
                // 检查行的instruments中是否包含任意一个搜索的instrumentIds
                return instrumentIds.some(
                    (id: number) => row.instruments && row.instruments.some(instrument => instrument.id === Number(id)),
                )
            })
            console.log('前端器械过滤后的数据:', filteredData)
            // 更新表格数据为过滤后的数据
            data.value = filteredData
        }

        //添加前端训练部位过滤逻辑
        if (muscleRegionIds && muscleRegionIds.length > 0) {
            const filteredData = (data.value || []).filter((row: ActionListItem) => {
                // 如果行没有muscleRegions属性，或者muscleRegions数组为空，则不匹配
                if (!row.muscleRegions || !Array.isArray(row.muscleRegions) || row.muscleRegions.length === 0) {
                    return false
                }
                // 检查行的muscleRegions中是否包含任意一个搜索的muscleRegionIds
                return muscleRegionIds.some(
                    (id: number) =>
                        row.muscleRegions && row.muscleRegions.some(region => Number(region.id) === Number(id)),
                )
            })
            console.log('前端训练部位过滤后的数据:', filteredData)
            // 更新表格数据为过滤后的数据
            data.value = filteredData
        }
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
        // 保持当前选中的型号，只重置其他筛选条件
        //if (activeModel.value !== '') {
        //    ;(searchParams as any).model = activeModel.value
        //} else {
        //    ;(searchParams as any).model = undefined
        //}
        // 重新获取数据
        delete (searchParams as any).model
        getData()
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
            try {
                console.log('翻译动作:', row)
                // 保存当前动作的rootId（用于翻译后定位并展开）
                // 根据约定：中文动作的rootId等于id，翻译后的动作rootId与中文动作一致
                const rootId =
                    (row as any).rootId !== undefined && (row as any).rootId !== null
                        ? Number((row as any).rootId)
                        : Number(row.id)

                // 调用翻译API
                await fetchTranslateAction({
                    rootId,
                })
                ElMessage.success('翻译成功')

                // 刷新数据以显示翻译后的子动作
                await refreshData()

                // 等待DOM更新后，找到对应的根节点并展开
                await nextTick()

                // 在刷新后的数据中找到对应的根节点（id最小的那个）
                if (tableRef.value?.elTableRef && data.value) {
                    const findRootNode = (nodes: ActionListItem[]): ActionListItem | null => {
                        for (const node of nodes) {
                            // 检查当前节点的rootId是否匹配
                            const nodeRootId =
                                (node as any).rootId !== undefined && (node as any).rootId !== null
                                    ? Number((node as any).rootId)
                                    : Number(node.id)

                            if (nodeRootId === rootId) {
                                return node
                            }

                            // 递归查找子节点
                            if (node.children && node.children.length > 0) {
                                const found = findRootNode(node.children)
                                if (found) return found
                            }
                        }
                        return null
                    }

                    const rootNode = findRootNode(data.value as ActionListItem[])
                    if (rootNode) {
                        // 展开该行
                        tableRef.value.elTableRef.toggleRowExpansion(rootNode, true)
                    }
                }
            } catch (error) {
                console.log(error)
                ElMessage.error('翻译失败')
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
