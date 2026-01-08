<template>
    <ElDialog
        v-model="visible"
        title="菜单权限"
        width="520px"
        align-center
        class="el-dialog-border"
        @close="handleClose"
    >
        <ElScrollbar height="70vh">
            <ElTree
                ref="treeRef"
                :data="processedMenuList"
                show-checkbox
                node-key="name"
                :default-expand-all="isExpandAll"
                :props="defaultProps"
                @check="handleTreeCheck"
            >
                <template #default="{ data }">
                    <div style="display: flex; align-items: center">
                        <span v-if="data.isAuth">
                            {{ data.label }}
                        </span>
                        <span v-else>{{ defaultProps.label(data) }}</span>
                    </div>
                </template>
            </ElTree>
        </ElScrollbar>
        <template #footer>
            <ElButton @click="outputSelectedData" style="margin-left: 8px">获取选中数据</ElButton>

            <ElButton @click="toggleExpandAll">{{ isExpandAll ? '全部收起' : '全部展开' }}</ElButton>
            <ElButton @click="toggleSelectAll" style="margin-left: 8px">{{
                isSelectAll ? '取消全选' : '全部选择'
            }}</ElButton>
            <ElButton type="primary" @click="savePermission">保存</ElButton>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { fetchUpdateRolePermission } from '@/api/system-manage'
    import { useMenuStore } from '@/store/modules/menu'
    import { formatMenuTitle } from '@/utils/router'
    import { ElMessage } from 'element-plus'
    import { storeToRefs } from 'pinia'
    import { computed, nextTick, ref, watch } from 'vue'

    type RoleListItem = Api.SystemManage.RoleListItem

    interface Props {
        modelValue: boolean
        roleData?: RoleListItem
    }

    interface Emits {
        (e: 'update:modelValue', value: boolean): void
        (e: 'success'): void
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: false,
        roleData: undefined,
    })

    const emit = defineEmits<Emits>()

    const { menuList } = storeToRefs(useMenuStore())
    const treeRef = ref()
    const isExpandAll = ref(true)
    const isSelectAll = ref(false)

    /**
     * 弹窗显示状态双向绑定
     */
    const visible = computed({
        get: () => props.modelValue,
        set: value => emit('update:modelValue', value),
    })

    /**
     * 菜单节点类型
     */
    interface MenuNode {
        id?: string | number
        name?: string
        label?: string
        menuId?: number
        isMenu?: boolean
        isAuth?: boolean
        actionId?: number
        meta?: {
            title?: string
            authList?: Array<{
                id: number
                menuId: number
                authMark: string
                title: string
                checked?: boolean
            }>
        }
        children?: MenuNode[]
        [key: string]: any
    }

    /**
     * 处理菜单数据，将 authList 转换为树形子节点
     * 递归处理菜单树，将权限列表展开为可选择的子节点
     * 菜单节点本身也可以被选中，表示可以访问该菜单
     */
    const processedMenuList = computed(() => {
        const processNode = (node: MenuNode): MenuNode => {
            const processed = { ...node }
            // 标记为菜单节点
            processed.isMenu = true
            // 确保菜单节点有 menuId（使用 id，需要转换为 number）
            if (!processed.menuId && processed.id) {
                const idNum = typeof processed.id === 'number' ? processed.id : Number(processed.id)
                if (!isNaN(idNum)) {
                    processed.menuId = idNum
                }
            }

            // 如果有 authList，将其转换为子节点
            if (node.meta?.authList?.length) {
                const authNodes = node.meta.authList.map(auth => ({
                    id: `${node.id}_${auth.authMark}`,
                    name: `${node.name}_${auth.authMark}`,
                    label: auth.title,
                    authMark: auth.authMark,
                    isAuth: true,
                    checked: auth.checked || false,
                    actionId: auth.id,
                    menuId: auth.menuId,
                }))

                processed.children = processed.children ? [...processed.children, ...authNodes] : authNodes
            }

            // 递归处理子节点
            if (processed.children) {
                processed.children = processed.children.map(processNode)
            }

            return processed
        }

        return (menuList.value as any[]).map(processNode)
    })

    /**
     * 树形组件配置
     */
    const defaultProps = {
        children: 'children',
        label: (data: any) => formatMenuTitle(data.meta?.title) || data.label || '',
    }

    /**
     * 监听弹窗打开和角色数据变化，初始化权限数据
     */
    watch(
        () => [props.modelValue, props.roleData?.id],
        ([newVal, roleId]) => {
            if (newVal && roleId && props.roleData) {
                // 等待下一帧，确保树组件已渲染
                nextTick(() => {
                    // 先清空之前的选中状态
                    treeRef.value?.setCheckedKeys([])
                    // 然后设置新的选中状态
                    setCheckedPermissions()
                })
            } else if (!newVal) {
                // 弹窗关闭时清空选中状态
                treeRef.value?.setCheckedKeys([])
            }
        },
    )

    /**
     * 根据角色的 roleMenus 设置树节点的选中状态
     * 同时设置菜单节点和权限节点的选中状态
     * 精确匹配：确保只选中该角色实际拥有的权限
     */
    const setCheckedPermissions = () => {
        const tree = treeRef.value
        if (!tree || !props.roleData?.roleMenus) {
            return
        }

        // 创建精确的映射：menuId -> Set<actionId>
        // 这样可以确保权限节点必须同时匹配 menuId 和 actionId
        const menuActionMap = new Map<number, Set<number>>()

        props.roleData.roleMenus.forEach(rm => {
            // 记录该菜单的具体权限
            if (!menuActionMap.has(rm.menuId)) {
                menuActionMap.set(rm.menuId, new Set())
            }
            menuActionMap.get(rm.menuId)?.add(rm.actionId)
        })

        // 递归遍历处理后的菜单树，找到所有匹配的节点
        const checkedKeys: string[] = []
        const findMatchingNodes = (nodes: MenuNode[]) => {
            nodes.forEach(node => {
                if (node.isAuth && node.actionId && node.menuId) {
                    // 权限节点：必须同时匹配 menuId 和 actionId
                    const menuActions = menuActionMap.get(node.menuId)
                    if (menuActions && menuActions.has(node.actionId)) {
                        checkedKeys.push(node.name as string)
                    }
                }
                // 递归处理子节点
                if (node.children?.length) {
                    findMatchingNodes(node.children)
                }
            })
        }

        findMatchingNodes(processedMenuList.value)

        // 设置选中的节点
        tree.setCheckedKeys(checkedKeys)

        console.log('已设置权限，共选中:', checkedKeys.length, '个权限节点')
    }

    /**
     * 关闭弹窗并清空选中状态
     */
    const handleClose = () => {
        visible.value = false
        treeRef.value?.setCheckedKeys([])
    }

    /**
     * 保存权限配置
     * 只收集权限节点（isAuth 为 true），过滤掉菜单节点
     */
    const savePermission = async () => {
        const tree = treeRef.value
        if (!tree) {
            handleClose()
            return
        }
        try {
            const nodes = tree.getCheckedNodes()
            const roleMenus: Array<{ menuId: number; actionId: number }> = []

            // 只收集权限节点（isAuth 为 true），过滤掉菜单节点
            for (const node of nodes) {
                if (node?.isAuth && node?.menuId && node?.actionId) {
                    roleMenus.push({
                        menuId: node.menuId,
                        actionId: node.actionId,
                    })
                }
            }

            console.log('保存权限 - 选中的节点:', nodes)
            console.log('保存权限 - 提取的 roleMenus:', roleMenus)

            if (props.roleData?.id === undefined) {
                ElMessage.error('角色ID无效，无法保存权限')
                return
            }

            await fetchUpdateRolePermission({
                id: props.roleData.id,
                roleMenus,
            })
            ElMessage.success('权限保存成功')
            emit('success')
            handleClose()
        } catch (error) {
            console.log('保存权限失败:', error)
            handleClose()
        }
    }

    /**
     * 切换全部展开/收起状态
     */
    const toggleExpandAll = () => {
        const tree = treeRef.value
        if (!tree) return

        const nodes = tree.store.nodesMap
        // 这里保留 any，因为 Element Plus 的内部节点类型较复杂
        Object.values(nodes).forEach((node: any) => {
            node.expanded = !isExpandAll.value
        })

        isExpandAll.value = !isExpandAll.value
    }

    /**
     * 切换全选/取消全选状态
     */
    const toggleSelectAll = () => {
        const tree = treeRef.value
        if (!tree) return

        if (!isSelectAll.value) {
            const allKeys = getAllNodeKeys(processedMenuList.value)
            tree.setCheckedKeys(allKeys)
        } else {
            tree.setCheckedKeys([])
        }

        isSelectAll.value = !isSelectAll.value
    }

    /**
     * 递归获取所有节点的 key（包括菜单节点和权限节点）
     * @param nodes 节点列表
     * @returns 所有节点的 key 数组
     */
    const getAllNodeKeys = (nodes: MenuNode[]): string[] => {
        const keys: string[] = []
        const traverse = (nodeList: MenuNode[]): void => {
            nodeList.forEach(node => {
                // 收集菜单节点和权限节点的 key
                if (node.name && (node.isMenu || node.isAuth)) {
                    keys.push(node.name)
                }
                if (node.children?.length) {
                    traverse(node.children)
                }
            })
        }
        traverse(nodes)
        return keys
    }

    /**
     * 处理树节点选中状态变化
     * 同步更新全选按钮状态
     */
    const handleTreeCheck = () => {
        const tree = treeRef.value
        if (!tree) return

        const checkedKeys = tree.getCheckedKeys()
        const allKeys = getAllNodeKeys(processedMenuList.value)

        isSelectAll.value = checkedKeys.length === allKeys.length && allKeys.length > 0
    }

    /**
     * 输出选中的权限数据到控制台
     * 用于调试和查看当前选中的权限配置
     */
    const outputSelectedData = () => {
        const tree = treeRef.value
        if (!tree) return

        const selectedData = {
            checkedKeys: tree.getCheckedKeys(),
            halfCheckedKeys: tree.getHalfCheckedKeys(),
            checkedNodes: tree.getCheckedNodes(),
            halfCheckedNodes: tree.getHalfCheckedNodes(),
            totalChecked: tree.getCheckedKeys().length,
            totalHalfChecked: tree.getHalfCheckedKeys().length,
        }

        console.log('=== 选中的权限数据 ===', selectedData)
        ElMessage.success(`已输出选中数据到控制台，共选中 ${selectedData.totalChecked} 个节点`)
    }
</script>
