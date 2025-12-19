<!-- 用户管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
    <div class="user-page art-full-height">
        <!-- 搜索栏 -->
        <UserSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></UserSearch>

        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton @click="showDialog('add')" v-ripple>新增用户</ElButton>
                    </ElSpace>
                </template>
            </ArtTableHeader>

            <!-- 表格 -->
            <ArtTable
                :loading="loading"
                :data="data"
                :columns="columns"
                :pagination="pagination"
                @selection-change="handleSelectionChange"
                @pagination:size-change="handleSizeChange"
                @pagination:current-change="handleCurrentChange"
            >
            </ArtTable>

            <!-- 用户弹窗 -->
            <UserDialog
                v-model:visible="dialogVisible"
                :type="dialogType"
                :user-data="currentUserData"
                @submit="handleDialogSubmit"
            />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
    import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
    import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchGetUserList, fetchCreateUser, fetchUpdateUser, fetchDeleteUser } from '@/api/system-manage'
    import UserSearch from './modules/user-search.vue'
    import UserDialog from './modules/user-dialog.vue'
    import { ElTag, ElMessageBox, ElImage, ElMessage } from 'element-plus'
    import { DialogType } from '@/types'

    defineOptions({ name: 'User' })

    type UserListItem = Api.SystemManage.UserListItem

    // 弹窗相关
    const dialogType = ref<DialogType>('add')
    const dialogVisible = ref(false)
    const currentUserData = ref<Partial<UserListItem>>({})

    // 选中行
    const selectedRows = ref<UserListItem[]>([])

    // 搜索表单
    const searchForm = ref({
        username: undefined,
        gender: undefined,
        mobile: undefined,
        email: undefined,
        status: '1',
    })

    // 用户状态配置
    const USER_STATUS_CONFIG = {
        '1': { type: 'success' as const, text: '在线' },
        '2': { type: 'info' as const, text: '离线' },
        '3': { type: 'warning' as const, text: '异常' },
        '4': { type: 'danger' as const, text: '注销' },
    } as const

    /**
     * 获取用户状态配置
     */
    const getUserStatusConfig = (status: string) => {
        return (
            USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
                type: 'info' as const,
                text: '未知',
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
            apiFn: fetchGetUserList,
            apiParams: {
                page: 1,
                size: 20,
                ...searchForm.value,
            },
            // 自定义分页字段映射，未设置时将使用全局配置 tableConfig.ts 中的 paginationKey
            // paginationKey: {
            //   current: 'pageNum',
            //   size: 'pageSize'
            // },
            columnsFactory: () => [
                { type: 'selection' }, // 勾选列
                { type: 'index', width: 60, label: '序号' }, // 序号
                {
                    prop: 'userInfo',
                    label: '用户名',
                    width: 280,
                    // visible: false, // 默认是否显示列
                    formatter: row => {
                        return h('div', { class: 'user flex-c' }, [
                            h(ElImage, {
                                class: 'size-9.5 rounded-md',
                                src: row.avatar,
                                previewSrcList: [row.avatar],
                                // 图片预览是否插入至 body 元素上，用于解决表格内部图片预览样式异常
                                previewTeleported: true,
                            }),
                            h('div', { class: 'ml-2' }, [
                                h('p', { class: 'user-name' }, row.username),
                                h('p', { class: 'email' }, row.email),
                            ]),
                        ])
                    },
                },
                {
                    prop: 'userGender',
                    label: '性别',
                    sortable: true,
                    formatter: row => {
                        const g = Number(row.gender)
                        if (g === 1) return '男'
                        if (g === 2) return '女'
                        return '未知'
                    },
                },
                {
                    prop: 'userPhone',
                    label: '手机号',
                    sortable: true,
                    formatter: row => {
                        return row.mobile
                    },
                },
                {
                    prop: 'status',
                    label: '状态',
                    formatter: row => {
                        //row.status = '1'
                        const statusConfig = getUserStatusConfig(row.status)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                {
                    prop: 'createTime',
                    label: '创建日期',
                    sortable: true,
                    formatter: row => {
                        const date = new Date(row.createdAt)
                        return date.toLocaleString()
                    },
                },
                {
                    prop: 'operation',
                    label: '操作',
                    width: 120,
                    fixed: 'right', // 固定列
                    formatter: row =>
                        h('div', [
                            h(ArtButtonTable, {
                                type: 'edit',
                                onClick: () => showDialog('edit', row),
                            }),
                            h(ArtButtonTable, {
                                type: 'delete',
                                onClick: () => deleteUser(row),
                            }),
                        ]),
                },
            ],
        },
        // 数据处理
        transform: {
            // 数据转换器 - 替换头像
            dataTransformer: records => {
                // 类型守卫检查
                if (!Array.isArray(records)) {
                    console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
                    return []
                }

                // 使用本地头像替换接口返回的头像
                return records.map((item, index: number) => {
                    return {
                        ...item,
                        avatar: ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar,
                    }
                })
            },
        },
    })

    /**
     * 搜索处理
     * @param params 参数
     */
    const handleSearch = async (params: Record<string, any>) => {
        console.log(params)
        // 搜索参数赋值
        Object.assign(searchParams, params)
        // 等待数据加载完成后打印，确保表格数据已更新
        await getData()
        console.log('表格数据：', data.value)
    }

    /**
     * 显示用户弹窗
     */
    const showDialog = (type: DialogType, row?: UserListItem): void => {
        console.log('打开弹窗:', { type, row })
        dialogType.value = type
        currentUserData.value = row || {}
        nextTick(() => {
            dialogVisible.value = true
        })
    }

    /**
     * 删除用户
     */
    const deleteUser = (row: UserListItem): void => {
        console.log('删除用户:', row)
        ;(async () => {
            try {
                await ElMessageBox.confirm(`确定要注销该用户吗？`, '注销用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                })

                await fetchDeleteUser(row.id)
                ElMessage.success('注销成功')
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
    const handleDialogSubmit = async (payload?: any) => {
        try {
            const dataToSubmit = payload || { ...currentUserData.value }

            // 基础必填校验
            if (!dataToSubmit.username) {
                ElMessage.error('请输入用户名')
                return
            }
            if (!dataToSubmit.mobile) {
                ElMessage.error('请输入手机号')
                return
            }
            if (dataToSubmit.gender === undefined || dataToSubmit.gender === null) {
                ElMessage.error('请选择性别')
                return
            }

            if (dialogType.value === 'add') {
                await fetchCreateUser({
                    username: dataToSubmit.username,
                    mobile: dataToSubmit.mobile,
                    gender: Number(dataToSubmit.gender),
                })
                ElMessage.success('创建成功')
                await refreshCreate()
            } else if (dialogType.value === 'edit') {
                if (
                    !dataToSubmit.userRoles ||
                    !Array.isArray(dataToSubmit.userRoles) ||
                    dataToSubmit.userRoles.length === 0
                ) {
                    ElMessage.error('请为用户分配至少一个角色')
                    return
                }

                await fetchUpdateUser(dataToSubmit)
                ElMessage.success('更新成功')
                await refreshUpdate()
            }

            dialogVisible.value = false
            currentUserData.value = {}
        } catch (error) {
            console.error('提交失败:', error)
            ElMessage.error('提交失败')
        }
    }

    /**
     * 处理表格行选择变化
     */
    const handleSelectionChange = (selection: UserListItem[]): void => {
        selectedRows.value = selection
        console.log('选中行数据:', selectedRows.value)
    }
</script>
