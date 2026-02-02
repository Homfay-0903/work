<!-- 角色管理页面 -->
<template>
    <div class="art-full-height">
        <RoleSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"> </RoleSearch>

        <ElCard class="art-table-card" shadow="never">
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton v-if="hasAuth('add')" @click="showDialog('add')" v-ripple>新增角色</ElButton>
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
                @pagination:size-change="handleSizeChange"
                @pagination:current-change="handleCurrentChange"
            >
            </ArtTable>
        </ElCard>

        <!-- 角色编辑弹窗 -->
        <RoleEditDialog
            v-model="dialogVisible"
            :dialog-type="dialogType"
            :role-data="currentRoleData"
            @success="refreshData"
        />

        <!-- 菜单权限弹窗 -->
        <RolePermissionDialog v-model="permissionDialog" :role-data="currentRoleData" @success="refreshData" />
    </div>
</template>

<script setup lang="ts">
    //import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchGetRoleList, fetchToggleRoleStatus } from '@/api/system-manage'
    //import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
    import RoleSearch from './modules/role-search.vue'
    import RoleEditDialog from './modules/role-edit-dialog.vue'
    import RolePermissionDialog from './modules/role-permission-dialog.vue'
    import { ElMessage, ElButton, ElTag } from 'element-plus'
    import { useAuth } from '@/hooks/core/useAuth'
    import { h, ref } from 'vue'

    defineOptions({ name: 'Role' })

    type RoleListItem = Api.SystemManage.RoleListItem

    // 搜索表单
    const searchForm = ref({
        name: undefined,
        description: undefined,
        daterange: undefined,
    })

    const dialogVisible = ref(false)
    const permissionDialog = ref(false)
    const currentRoleData = ref<RoleListItem | undefined>(undefined)

    // 权限控制
    const { hasAuth } = useAuth()

    // 角色状态配置
    const ROLE_STATUS_CONFIG = {
        '0': { type: 'success' as const, text: '启用中' },
        '1': { type: 'danger' as const, text: '禁用中' },
    } as const

    /**
     * 获取角色状态配置
     */
    const getRoleStatusConfig = (status: string | number) => {
        const statusStr = String(status)
        return (
            ROLE_STATUS_CONFIG[statusStr as keyof typeof ROLE_STATUS_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 获取序号文本
     * 基于分页的序号（如：1, 2, 3...）
     */
    const getIndexText = (row: RoleListItem): string => {
        // 根节点：显示基于分页的序号
        // 使用 _rowIndex 属性（在数据转换时设置）
        if ((row as any)._rowIndex !== undefined) {
            const pageOffset = (pagination.page - 1) * pagination.size
            const displayIndex = pageOffset + (row as any)._rowIndex + 1
            return `${displayIndex}`
        }

        // 兜底：如果没有_rowIndex，使用id
        return `${row.id}`
    }

    /**
     * 处理启用/禁用角色事件
     */
    const toggleRoleStatus = async (row: RoleListItem) => {
        try {
            const newStatus = row.status === 0 ? 1 : 0
            const response = (await fetchToggleRoleStatus(row.id, { status: newStatus })) as any
            if (response) {
                ElMessage.success(`角色 ${row.name} 已${newStatus === 0 ? '启用' : '禁用'}`)
                refreshData()
            }
        } catch {
            ElMessage.error('操作失败')
        }
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
    } = useTable({
        // 核心配置
        core: {
            apiFn: fetchGetRoleList,
            apiParams: {
                page: 1,
                size: 20,
            },
            // 排除 apiParams 中的属性
            excludeParams: ['daterange'],
            columnsFactory: () => [
                {
                    prop: 'index',
                    label: '序号',
                    headerAlign: 'center',
                    align: 'center',
                    width: 100,
                    formatter: (row: RoleListItem) => getIndexText(row),
                },
                {
                    prop: 'name',
                    label: '角色名称',
                    headerAlign: 'center',
                    align: 'center',
                    width: 200,
                },
                //{
                //    prop: 'memberCount',
                //    label: '成员数',
                //    headerAlign: 'center',
                //    align: 'center',
                //    width: 200,
                //},
                {
                    prop: 'description',
                    label: '角色描述',
                    headerAlign: 'center',
                    align: 'center',
                    width: 450,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'createdBy',
                    label: '创建人',
                    headerAlign: 'center',
                    align: 'center',
                    width: 200,
                },
                {
                    prop: 'createdAt',
                    label: '创建日期',
                    headerAlign: 'center',
                    align: 'center',
                    width: 300,
                    //sortable: true,
                    formatter: row => {
                        const date = new Date(row.createdAt || '')
                        const year = date.getFullYear()
                        const month = date.getMonth() + 1
                        const day = date.getDate()
                        const hours = date.getHours().toString().padStart(2, '0')
                        const minutes = date.getMinutes().toString().padStart(2, '0')
                        const seconds = date.getSeconds().toString().padStart(2, '0')
                        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                    },
                },
                {
                    prop: 'status',
                    label: '状态',
                    headerAlign: 'center',
                    align: 'center',
                    width: 100,
                    //sortable: true,
                    formatter: row => {
                        //row.status = '1'
                        const statusConfig = getRoleStatusConfig(row.status)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                {
                    prop: 'operation',
                    label: '操作',
                    headerAlign: 'center',
                    align: 'center',
                    fixed: 'right',
                    formatter: row => {
                        const buttons = []
                        if (hasAuth('edit')) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        disabled: false,
                                        onClick: () => showDialog('edit', row),
                                    },
                                    { default: () => '修改' },
                                ),
                            )
                        }
                        if (hasAuth('permission')) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        disabled: false,
                                        type: 'warning',
                                        onClick: () => showPermissionDialog(row),
                                    },
                                    { default: () => '设置权限' },
                                ),
                            )
                        }
                        if (hasAuth('enable')) {
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: row.status === 0 ? 'danger' : 'success',
                                        disabled: false,
                                        onClick: () => toggleRoleStatus(row),
                                    },
                                    { default: () => (row.status === 0 ? '禁用' : '启用') },
                                ),
                            )
                        }

                        return buttons.length > 0
                            ? h(
                                  'div',
                                  { style: 'display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;' },
                                  buttons,
                              )
                            : null
                    },
                    //h('div', [
                    //    h(ArtButtonMore, {
                    //        list: [
                    //            {
                    //                key: 'permission',
                    //                label: '菜单权限',
                    //                icon: 'ri:user-3-line',
                    //                disabled: !hasAuth('permission'), // 根据 updateFlag 决定是否禁用
                    //            },
                    //            {
                    //                key: 'edit',
                    //                label: '编辑角色',
                    //                icon: 'ri:edit-2-line',
                    //                disabled: !hasAuth('edit'), // 根据 updateFlag 决定是否禁用
                    //            },
                    //            {
                    //                key: 'delete',
                    //                label: '删除角色',
                    //                icon: 'ri:delete-bin-4-line',
                    //                color: '#f56c6c',
                    //                disabled: !hasAuth('delete'), // 根据 defaultFlag 决定是否禁用
                    //            },
                    //        ],
                    //        onClick: (item: ButtonMoreItem) => buttonMoreClick(item, row),
                    //    }),
                    //]),
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

                type RoleItemWithIndex = RoleListItem & {
                    _rowIndex?: number
                }

                // 处理每条记录，添加_rowIndex属性
                const processedRecords: RoleItemWithIndex[] = records.map((item, index) => ({
                    ...item,
                    _rowIndex: index,
                }))

                return processedRecords
            },
        },
    })

    const dialogType = ref<'add' | 'edit'>('add')

    const showDialog = (type: 'add' | 'edit', row?: RoleListItem) => {
        dialogVisible.value = true
        dialogType.value = type
        currentRoleData.value = row
    }

    /**
     * 搜索处理
     * @param params 搜索参数
     */
    const handleSearch = (params: Record<string, any>) => {
        // 处理日期区间参数，把 daterange 转换为 startTime 和 endTime
        const { daterange, ...filtersParams } = params
        const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

        // 先删除可能的搜索字段，避免保留空值
        const searchFields = ['name', 'description', 'startTime', 'endTime']
        searchFields.forEach(field => {
            delete (searchParams as Record<string, any>)[field]
        })

        // 搜索参数赋值
        Object.assign(searchParams, { ...filtersParams, startTime, endTime })
        getData()
    }

    //const buttonMoreClick = (item: ButtonMoreItem, row: RoleListItem) => {
    //    switch (item.key) {
    //        case 'permission':
    //            showPermissionDialog(row)
    //            break
    //        case 'edit':
    //            showDialog('edit', row)
    //            break
    //        case 'delete':
    //            deleteRole(row)
    //            break
    //    }
    //}

    const showPermissionDialog = (row?: RoleListItem) => {
        permissionDialog.value = true
        currentRoleData.value = row
    }

    //const deleteRole = (row: RoleListItem) => {
    //    ElMessageBox.confirm(`确定删除角色"${row.name}"吗？此操作不可恢复！`, '删除确认', {
    //        confirmButtonText: '确定',
    //        cancelButtonText: '取消',
    //        type: 'warning',
    //    }).then(() => {
    //        fetchDeleteRole(row.id)
    //            .then(() => {
    //                ElMessage.success('删除成功')
    //                refreshData()
    //            })
    //            .catch(() => {
    //                ElMessage.error('删除失败')
    //            })
    //    })
    //}
</script>
