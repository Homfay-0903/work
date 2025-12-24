<template>
    <div class="action-page art-full-height">
        <!-- 型号tab栏 -->
        <ElCard class="model-tabs-card" shadow="never">
            <div class="model-tabs-wrapper">
                <div class="model-tabs-label">型号选择</div>
                <ElTabs v-model="activeModel" @tab-change="handleModelChange">
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
    import { ref, nextTick, h } from 'vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchCreateAction, fetchUpdateAction, fetchDeleteAction } from '@/api/action'
    import ActionSearch from './modules/action-search.vue'
    import ActionDialog from './modules/action-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElTabs, ElTabPane, ElButton } from 'element-plus'

    defineOptions({ name: 'Action' })

    type ActionListItem = Api.Action.ActionListItem

    // 假数据
    const mockData: ActionListItem[] = [
        {
            id: 1,
            model: 'MotionS',
            name: '站立飞鸟',
            type: 'video',
            scene: 'strength',
            difficulty: '1',
            equipment: '双头绳',
            trainer: 'Andy',
            part: '胸部',
            language: '',
            status: 'draft',
            aiSupport: false,
            operator: 'hanliang@suanier.com',
            hasChildren: true,
            children: [
                {
                    id: 11,
                    model: 'MotionS',
                    name: '站立飞鸟-准备动作',
                    type: 'video',
                    scene: 'strength',
                    difficulty: '1',
                    equipment: '双头绳',
                    trainer: 'Andy',
                    part: '胸部',
                    language: '',
                    status: 'draft',
                    aiSupport: false,
                    operator: 'hanliang@suanier.com',
                },
                {
                    id: 12,
                    model: 'MotionS',
                    name: '站立飞鸟-正式动作',
                    type: 'video',
                    scene: 'strength',
                    difficulty: '1',
                    equipment: '双头绳',
                    trainer: 'Andy',
                    part: '胸部',
                    language: '',
                    status: 'draft',
                    aiSupport: false,
                    operator: 'hanliang@suanier.com',
                },
            ],
        },
        {
            id: 2,
            model: 'MotionS',
            name: '站立飞鸟',
            type: 'video',
            scene: 'strength',
            difficulty: '1',
            equipment: '双头绳',
            trainer: 'Andy',
            part: '胸部',
            language: '中文',
            status: 'draft',
            aiSupport: false,
            operator: 'hanliang@suanier.com',
        },
        {
            id: 3,
            model: 'MotionS',
            name: '站立飞鸟',
            type: 'video',
            scene: 'strength',
            difficulty: '1',
            equipment: '双头绳',
            trainer: 'Andy',
            part: '胸部',
            language: '',
            status: 'draft',
            aiSupport: false,
            operator: 'hanliang@suanier.com',
        },
        {
            id: 4,
            model: 'MotionS',
            name: '大象式',
            type: 'video',
            scene: 'pilates',
            difficulty: '1',
            equipment: '-',
            trainer: 'Joy',
            part: '全身',
            language: '',
            status: 'on_shelf',
            aiSupport: false,
            operator: 'hanliang@suanier.com',
        },
    ]

    // 弹窗相关
    const dialogType = ref<'add' | 'edit' | 'view'>('add')
    const dialogVisible = ref(false)
    const currentActionData = ref<Partial<ActionListItem>>({})

    // 选中行
    const selectedRows = ref<ActionListItem[]>([])

    // 型号tab相关
    const activeModel = ref<string>('') // 空字符串表示"全部型号"
    const modelList = ref<Array<{ label: string; value: string }>>([
        { label: '全部型号', value: '' },
        { label: 'T5X', value: 'T5X' },
        { label: 'Motionstation', value: 'Motionstation' },
        // TODO: 从API获取型号列表
    ])

    /**
     * 处理型号切换
     */
    const handleModelChange = (modelValue: string | number) => {
        console.log('切换型号:', modelValue)
        const model = String(modelValue)
        // 切换型号后重置搜索并刷新数据
        activeModel.value = model
        // 更新搜索参数中的型号
        ;(searchParams as any).model = model === '' ? undefined : model
        getData()
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
        video: '视频动作',
        non_video: '非视频动作',
        intro: '片头',
        outro: '片尾',
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
     * 获取动作类型文本
     */
    const getTypeText = (type: string) => {
        return TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || '其他'
    }

    // 适用场景配置
    const SCENE_CONFIG = {
        strength: '力量训练',
        pilates: '普拉提',
        aerobic: '有氧减脂',
        stretch: '拉伸康复',
        assessment: '评估筛查',
    } as const

    /**
     * 获取适用场景文本
     */
    const getSceneText = (scene: string) => {
        return SCENE_CONFIG[scene as keyof typeof SCENE_CONFIG] || '其他'
    }

    // 状态配置
    const STATUS_CONFIG = {
        draft: { type: 'info' as const, text: '草稿' },
        on_shelf: { type: 'success' as const, text: '上架中' },
        off_shelf: { type: 'warning' as const, text: '已下架' },
    } as const

    /**
     * 获取状态配置
     */
    const getStatusConfig = (status: string) => {
        return (
            STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
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
    const getDifficultyConfig = (difficulty: string) => {
        return (
            DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 获取AI支持状态
     */
    const getAiSupportStatus = (aiSupport: boolean) => {
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
                { 'prop': 'model', 'label': '适用型号', 'width': 120, 'header-align': 'center', 'align': 'center' },
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
                        if (row.status === 'draft' || row.status === 'off_shelf') {
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
                        if (row.status === 'on_shelf') {
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
                        if (row.language === '' || row.language === '中文') {
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
    const handleSearch = async (params: Partial<Api.Action.ActionSearchParams>) => {
        console.log('筛选参数:', params)
        // 搜索参数赋值
        Object.assign(searchParams, params)
        // 添加当前选中的型号到搜索参数
        ;(searchParams as any).model = activeModel.value === '' ? undefined : activeModel.value
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
    const handleDialogSubmit = async (payload?: Partial<ActionListItem>) => {
        try {
            const dataToSubmit = payload || { ...currentActionData.value }

            if (dialogType.value === 'add') {
                await fetchCreateAction(dataToSubmit as Api.Action.ActionCreateBody)
                ElMessage.success('创建成功')
                await refreshCreate()
            } else if (dialogType.value === 'edit') {
                if (!dataToSubmit.id) {
                    ElMessage.error('缺少动作ID')
                    return
                }
                await fetchUpdateAction(dataToSubmit as Api.Action.ActionUpdateBody)
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
                // TODO: 调用上架API
                const index = (data.value as ActionListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as ActionListItem).status = 'on_shelf'
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
                // TODO: 调用下架API
                const index = (data.value as ActionListItem[]).findIndex(item => item.id === row.id)
                if (index !== -1) {
                    ;(data.value[index] as ActionListItem).status = 'off_shelf'
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
