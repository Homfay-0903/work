<!-- 用户管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
    <div class="user-page art-full-height">
        <!-- 搜索栏 -->
        <UserSearch
            v-if="hasAuth('query')"
            v-model="searchForm"
            @search="handleSearch"
            @reset="resetSearchParams"
        ></UserSearch>

        <ElCard class="art-table-card" shadow="never">
            <!-- 表格头部 -->
            <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
                <template #left>
                    <ElSpace wrap>
                        <ElButton v-if="hasAuth('add')" @click="showDialog('add')" v-ripple>新增用户</ElButton>
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
                @selection-change="handleSelectionChange"
                @pagination:size-change="handleSizeChange"
                @pagination:current-change="handleCurrentChange"
            >
                <template #role="{ row }">
                    <div style="min-height: 32px; line-height: 20px; padding: 4px 0" v-html="getRoleText(row)"></div>
                </template>
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
    //import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
    import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
    import { useTable } from '@/hooks/core/useTable'
    import { fetchGetUserList, fetchCreateUser, fetchToggleUserStatus } from '@/api/system-manage'
    import { fetchUpdateUserInfo, fetchGetUserInfo } from '@/api/auth'
    import UserSearch from './modules/user-search.vue'
    import UserDialog from './modules/user-dialog.vue'
    import { ElTag, ElMessageBox, ElMessage, ElButton } from 'element-plus'
    import { DialogType } from '@/types'
    import { useAuth } from '@/hooks/core/useAuth'
    import { useUserStore } from '@/store/modules/user'

    defineOptions({ name: 'User' })

    type UserListItem = Api.SystemManage.UserListItem

    // 弹窗相关
    const dialogType = ref<DialogType>('add')
    const dialogVisible = ref(false)
    const currentUserData = ref<Partial<UserListItem>>({})

    // 选中行
    const selectedRows = ref<UserListItem[]>([])

    // 权限控制
    const { hasAuth } = useAuth()

    // 用户状态管理
    const userStore = useUserStore()
    const currentUserId = computed(() => userStore.getUserInfo?.userId || userStore.getUserInfo?.id)

    // 计算是否有任何操作权限
    const hasAnyOperationPermission = computed(() => {
        return hasAuth('edit') || hasAuth('delete')
    })

    // 搜索表单
    const searchForm = ref({
        username: undefined,
        gender: undefined,
        mobile: undefined,
        email: undefined,
        status: undefined,
    })

    // 用户状态配置
    const USER_STATUS_CONFIG = {
        '0': { type: 'success' as const, text: '启用中' },
        '1': { type: 'danger' as const, text: '禁用中' },
    } as const

    /**
     * 获取用户状态配置
     */
    const getUserStatusConfig = (status: string | number) => {
        const statusStr = String(status)
        return (
            USER_STATUS_CONFIG[statusStr as keyof typeof USER_STATUS_CONFIG] || {
                type: 'info' as const,
                text: '未知',
            }
        )
    }

    /**
     * 获取角色文本
     */
    const getRoleText = (row: UserListItem) => {
        const roles = row.userRoles?.map(item => item.name) || []

        if (roles.length === 0) {
            return '无'
        }
        return roles.join('<br>')
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
        //refreshRemove,
        toggleColumn,
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
                //{ type: 'selection' }, // 勾选列
                {
                    type: 'index',
                    width: 100,
                    headerAlign: 'center',
                    align: 'center',
                    label: '序号',
                },
                {
                    'prop': 'userInfo',
                    'label': '账号名称',
                    'header-align': 'center',
                    'align': 'center',
                    'width': 280,
                    // visible: false, // 默认是否显示列
                    'formatter': row => {
                        //return h('div', { class: 'user flex-c' }, [
                        //    h(ElImage, {
                        //        class: 'size-9.5 rounded-md',
                        //        src: row.avatar,
                        //        previewSrcList: [row.avatar],
                        //        // 图片预览是否插入至 body 元素上，用于解决表格内部图片预览样式异常
                        //        previewTeleported: true,
                        //    }),
                        //    h('div', { class: 'ml-2' }, [
                        //        h('p', { class: 'user-name' }, row.username),
                        //        h('p', { class: 'email' }, row.email),
                        //    ]),
                        //])
                        return row.username
                    },
                },
                //{
                //    prop: 'userGender',
                //    label: '性别',
                //    width: 80,
                //    sortable: true,
                //    formatter: row => {
                //        const g = Number(row.gender)
                //        if (g === 1) return '男'
                //        if (g === 2) return '女'
                //        return '未知'
                //    },
                //},
                {
                    'prop': 'role',
                    'label': '角色',
                    'width': 250,
                    'header-align': 'center',
                    'align': 'center',
                    //'sortable': true,
                    'useSlot': true,
                },
                {
                    prop: 'lastLoginAt',
                    label: '最近登录时间',
                    headerAlign: 'center',
                    align: 'center',
                    //sortable: true,
                    formatter: row => {
                        const date = new Date(row.lastLoginAt || '')
                        if (isNaN(date.getTime())) {
                            return '未登录'
                        }
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
                    width: 250,
                    headerAlign: 'center',
                    align: 'center',
                    //sortable: true,
                    formatter: row => {
                        //row.status = '1'
                        const statusConfig = getUserStatusConfig(row.status)
                        return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
                    },
                },
                {
                    'prop': 'operation',
                    'label': '操作',
                    'width': 250,
                    'fixed': 'right', // 固定列
                    'header-align': 'center',
                    'align': 'center',
                    'formatter': row => {
                        const buttons = []
                        // 只有拥有编辑权限时才显示编辑按钮
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
                        // 只有拥有编辑权限时才显示启用/禁用按钮
                        if (hasAuth('enable')) {
                            console.log('row.status', row.status)
                            buttons.push(
                                h(
                                    ElButton,
                                    {
                                        link: true,
                                        type: String(row.status) === '0' ? 'danger' : 'success',
                                        disabled: false,
                                        onClick: () => toggleUserStatus(row),
                                    },
                                    () => (String(row.status) === '0' ? '禁用' : '启用'),
                                ),
                            )
                        }
                        // 只有拥有删除权限时才显示删除按钮
                        //if (hasAuth('delete')) {
                        //    buttons.push(
                        //        h(
                        //            ElButton,
                        //            {
                        //                link: true,
                        //                type: 'danger',
                        //                disabled: false,
                        //                onClick: () => deleteUser(row),
                        //            },
                        //            () => '删除',
                        //        ),
                        //    )
                        //}
                        // 如果没有任何操作按钮，返回空内容
                        return buttons.length > 0
                            ? h(
                                  'div',
                                  { style: 'display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;' },
                                  buttons,
                              )
                            : null
                    },
                },
            ],
        },
        // 数据处理
        transform: {
            dataTransformer: records => {
                if (!Array.isArray(records)) {
                    console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
                    return []
                }

                return records.map((item, index: number) => {
                    return {
                        ...item,
                        avatar: item.avatar || ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar,
                    }
                })
            },
        },
    })

    // 监听权限变化，动态控制操作列的显示/隐藏
    watch(
        hasAnyOperationPermission,
        hasPermission => {
            toggleColumn?.('operation', hasPermission)
        },
        { immediate: true },
    )

    /**
     * 搜索处理
     * @param params 参数
     */
    const handleSearch = async (params: Record<string, any>) => {
        //console.log(params)

        const { ...filteredParams } = params
        const searchFields = ['username', 'mobile', 'email', 'status', 'gender']
        searchFields.forEach(field => {
            delete (searchParams as Record<string, any>)[field]
        })
        // 搜索参数赋值
        Object.assign(searchParams, { ...filteredParams })
        // 等待数据加载完成后打印，确保表格数据已更新
        getData()
        //console.log('表格数据：', data.value)
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
    //const deleteUser = (row: UserListItem): void => {
    //    console.log('删除用户:', row)
    //    ;(async () => {
    //        try {
    //            // 检查是否为钉钉用户
    //            if (row.dingtalkBound) {
    //                await ElMessageBox.alert('钉钉用户无法删除', '提示', {
    //                    confirmButtonText: '确认',
    //                    type: 'warning',
    //                })
    //                return
    //            }
    //
    //            // 检查是否为当前用户
    //            if (row.id === currentUserId.value) {
    //                await ElMessageBox.alert('删除失败，无法删除自己', '提示', {
    //                    confirmButtonText: '确认',
    //                    type: 'warning',
    //                })
    //                return
    //            }
    //
    //            await ElMessageBox.confirm(`确定要注销该用户吗？`, '注销用户', {
    //                confirmButtonText: '确定',
    //                cancelButtonText: '取消',
    //                type: 'error',
    //            })
    //
    //            await fetchDeleteUser(row.id)
    //            ElMessage.success('注销成功')
    //            await refreshRemove()
    //        } catch (error) {
    //            console.log(error)
    //            // 取消或失败
    //        }
    //    })()
    //}

    /**
     * 启用/禁用用户
     */
    const toggleUserStatus = (row: UserListItem): void => {
        console.log('切换用户状态:', row)
        ;(async () => {
            try {
                // 检查是否为当前用户
                if (row.id === currentUserId.value) {
                    await ElMessageBox.alert('操作失败，无法操作自己的账号状态', '提示', {
                        confirmButtonText: '确认',
                        type: 'warning',
                    })
                    return
                }

                const newStatus = String(row.status) === '0' ? '1' : '0'
                const statusText = newStatus === '0' ? '启用' : '禁用'

                await ElMessageBox.confirm(`确定要${statusText}该用户吗？`, `${statusText}用户`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: newStatus === '0' ? 'success' : 'warning',
                })

                await fetchToggleUserStatus(row.id, { status: Number(newStatus) })
                ElMessage.success(`${statusText}成功`)
                await refreshData()
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
            //if (!dataToSubmit.username) {
            //    ElMessage.error('请输入用户名')
            //    return
            //}
            //if (!dataToSubmit.mobile) {
            //    ElMessage.error('请输入手机号')
            //    return
            //}
            //if (dataToSubmit.gender === undefined || dataToSubmit.gender === null) {
            //    ElMessage.error('请选择性别')
            //    return
            //}

            if (dialogType.value === 'add') {
                await fetchCreateUser({
                    username: dataToSubmit.username,
                    password: dataToSubmit.password,
                    roleIds: dataToSubmit.roleIds,
                    //mobile: dataToSubmit.mobile,
                    //gender: Number(dataToSubmit.gender),
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

                await fetchUpdateUserInfo(dataToSubmit)
                ElMessage.success('更新成功')
                await refreshUpdate()

                // 如果更新的是当前登录用户，重新获取用户信息并更新到 store
                if (dataToSubmit.id === currentUserId.value) {
                    try {
                        const newUserInfo = await fetchGetUserInfo()
                        userStore.setUserInfo(newUserInfo)
                    } catch (error) {
                        console.error('获取用户信息失败:', error)
                    }
                }
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
