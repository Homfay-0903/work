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
    import { fetchGetActionList, fetchDeleteAction, fetchUpdateActionStatus } from '@/api/action'
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
        trainer: undefined,
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
     */
    const getIndexText = (row: ActionListItem) => {
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
                size: 20,
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
                { 'prop': 'equipment', 'label': '器械', 'width': 120, 'header-align': 'center', 'align': 'center' },
                { 'prop': 'trainer', 'label': '教练', 'width': 120, 'header-align': 'center', 'align': 'center' },
                { 'prop': 'part', 'label': '训练部位', 'width': 120, 'header-align': 'center', 'align': 'center' },
                { 'prop': 'language', 'label': '语言', 'width': 120, 'header-align': 'center', 'align': 'center' },
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
            // 数据转换器
            dataTransformer: records => {
                // 类型守卫检查
                if (!Array.isArray(records)) {
                    console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
                    return []
                }
                // 对数据进行排序，按ID升序排列
                return records.sort((a, b) => (a as ActionListItem).id - (b as ActionListItem).id)
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
        // 保持当前选中的型号，只重置其他筛选条件
        if (activeModel.value !== '') {
            ;(searchParams as any).model = activeModel.value
        } else {
            ;(searchParams as any).model = undefined
        }
        // 重新获取数据
        getData()
    }

    /**
     * 显示动作弹窗
     */
    const showDialog = (type: 'add' | 'edit' | 'view', row?: ActionListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentActionData.value = row || {}
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
                ElMessage.info('翻译功能开发中...')
                // TODO: 调用翻译API
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
