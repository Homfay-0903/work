<template>
    <ElDialog
        v-model="visible"
        title="设置权限"
        width="600px"
        align-center
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="permission-dialog-content">
            <!-- 角色名称显示 -->
            <div class="role-name-display">
                <span class="label">角色名称:</span>
                <span class="value">{{ characterData?.name || '-' }}</span>
            </div>

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
        </div>

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
    import { ref, computed, watch, nextTick } from 'vue'
    import { ElMessage, ElScrollbar, ElTree } from 'element-plus'
    import { fetchUpdateCharacterPermission } from '@/api/character'
    import { useMenuStore } from '@/store/modules/menu'
    import { formatMenuTitle } from '@/utils/router'
    import { storeToRefs } from 'pinia'

    type CharacterListItem = Api.Character.CharacterListItem

    interface Props {
        modelValue: boolean
        characterData?: CharacterListItem
    }

    interface Emits {
        (e: 'update:modelValue', value: boolean): void
        (e: 'success'): void
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: false,
        characterData: undefined,
    })

    const emit = defineEmits<Emits>()

    const treeRef = ref()
    const isExpandAll = ref(true)
    const isSelectAll = ref(false)
    const { menuList } = storeToRefs(useMenuStore())

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
     */
    const processedMenuList = computed(() => {
        // 临时 mock 权限配置，后端未完成时使用
        const mockPermissionMap: Record<
            string,
            {
                listLabel?: string
                dataAuthList?: Array<{ title: string; authMark: string }>
                actionAuthList?: Array<{ title: string; authMark: string }>
            }
        > = {
            动作库管理: {
                listLabel: '动作列表',
                dataAuthList: [
                    { title: '仅查看', authMark: 'data_view' },
                    { title: '查看和修改', authMark: 'data_edit' },
                ],
                actionAuthList: [
                    { title: '下架', authMark: 'action_off' },
                    { title: '查看', authMark: 'action_view' },
                    { title: '添加动作', authMark: 'action_add' },
                    { title: '上架', authMark: 'action_on' },
                    { title: '编辑', authMark: 'action_edit' },
                    { title: '删除', authMark: 'action_delete' },
                    { title: '翻译', authMark: 'action_translate' },
                ],
            },
            教练管理: {
                listLabel: '教练列表',
                dataAuthList: [
                    { title: '仅查看', authMark: 'data_view' },
                    { title: '查看和修改', authMark: 'data_edit' },
                ],
                actionAuthList: [
                    { title: '添加教练', authMark: 'action_add' },
                    { title: '查看', authMark: 'action_view' },
                    { title: '编辑', authMark: 'action_edit' },
                    { title: '删除', authMark: 'action_delete' },
                    { title: '翻译', authMark: 'action_translate' },
                ],
            },
            器械管理: {
                listLabel: '器械列表',
                dataAuthList: [
                    { title: '仅查看', authMark: 'data_view' },
                    { title: '查看和修改', authMark: 'data_edit' },
                ],
                actionAuthList: [
                    { title: '添加器械', authMark: 'action_add' },
                    { title: '查看', authMark: 'action_view' },
                    { title: '编辑', authMark: 'action_edit' },
                    { title: '删除', authMark: 'action_delete' },
                    { title: '排序', authMark: 'action_sort' },
                    { title: '翻译', authMark: 'action_translate' },
                ],
            },
            AI动作列表: {
                listLabel: 'AI动作列表',
                dataAuthList: [
                    { title: '仅查看', authMark: 'data_view' },
                    { title: '查看和修改', authMark: 'data_edit' },
                ],
                actionAuthList: [{ title: '更新', authMark: 'action_update' }],
            },
            角色管理: {
                listLabel: '角色管理',
                dataAuthList: [{ title: '仅查看', authMark: 'data_view' }],
                actionAuthList: [
                    { title: '新增', authMark: 'action_add' },
                    { title: '编辑', authMark: 'action_edit' },
                    { title: '权限设置', authMark: 'action_permission' },
                    { title: '启/禁用', authMark: 'action_enable' },
                    { title: '删除', authMark: 'action_delete' },
                ],
            },
            账户管理: {
                listLabel: '账户管理',
                dataAuthList: [{ title: '仅查看', authMark: 'data_view' }],
                actionAuthList: [
                    { title: '新增', authMark: 'action_add' },
                    { title: '编辑', authMark: 'action_edit' },
                    { title: '启/禁用', authMark: 'action_enable' },
                    { title: '删除', authMark: 'action_delete' },
                ],
            },
            操作日志: {
                listLabel: '操作日志',
                dataAuthList: [{ title: '仅查看', authMark: 'data_view' }],
                actionAuthList: [],
            },
        }

        let mockActionId = 100000 // 临时自增 id，避免与真实后端冲突

        const buildAuthNodes = (
            authList: Array<{ title: string; authMark: string }> = [],
            node: MenuNode,
            category: string,
        ) =>
            authList.map((auth, index) => {
                const baseId = String(node.id ?? node.name ?? 'menu')
                const baseName = String(node.name ?? node.id ?? 'menu')
                return {
                    id: `${baseId}_${category}_${index}`,
                    name: `${baseName}_${category}_${auth.authMark}`,
                    label: auth.title,
                    isAuth: true,
                    authMark: auth.authMark,
                    checked: Boolean((auth as any).checked),
                    actionId: mockActionId++, // 假数据自增
                    menuId: node.id || 0,
                }
            })

        const processNode = (node: MenuNode): MenuNode => {
            const processed = { ...node }
            const nodeTitle = formatMenuTitle(node.meta?.title || '') || node.label || node.name || ''
            const mockCfg = mockPermissionMap[nodeTitle]

            // 原有 authList 先转成节点（如果有）
            //const baseAuthNodes =
            //    node.meta?.authList?.map((auth, index) => ({
            //        id: `${node.id}_${auth.authMark || auth.id || index}`,
            //        name: `${String(node.name ?? node.id ?? 'menu')}_${auth.authMark || auth.id || index}`,
            //        label: auth.title,
            //        authMark: auth.authMark,
            //        isAuth: true,
            //        checked: auth.checked || false,
            //        actionId: auth.id,
            //        menuId: auth.menuId ?? node.id ?? 0,
            //    })) || []

            // 将原 authList 放入“操作权限”分组后避免与 mock 重复
            //const actionAuthNodesFromOriginal = baseAuthNodes
            const dataAuthNodesFromMock = mockCfg ? buildAuthNodes(mockCfg.dataAuthList, node, 'data') : []
            const actionAuthNodesFromMock = mockCfg ? buildAuthNodes(mockCfg.actionAuthList, node, 'action') : []

            const groupNodes: MenuNode[] = []

            // 列表节点（单独可选）
            if (mockCfg?.listLabel) {
                groupNodes.push({
                    id: `${node.id || node.name}_list`,
                    name: `${node.name || node.id}_list`,
                    label: mockCfg.listLabel,
                    isAuth: true,
                    checked: false,
                    authMark: 'list',
                    actionId: mockActionId++,
                    menuId: node.id || 0,
                })
            }

            // 数据权限分组
            if (dataAuthNodesFromMock.length) {
                groupNodes.push({
                    id: `${node.id || node.name}_data_group`,
                    name: `${node.name || node.id}_data_group`,
                    label: '数据权限',
                    children: dataAuthNodesFromMock,
                })
            }

            // 操作权限分组（包含原有 authList + mock）
            if (actionAuthNodesFromMock.length) {
                groupNodes.push({
                    id: `${node.id || node.name}_action_group`,
                    name: `${node.name || node.id}_action_group`,
                    label: '操作权限',
                    children: [...actionAuthNodesFromMock],
                })
            }

            // 递归处理子菜单
            const originChildren = processed.children ? processed.children.map(processNode) : []
            processed.children = [...groupNodes, ...originChildren]

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
     * 监听弹窗打开，初始化权限数据
     */
    watch(
        () => props.modelValue,
        newVal => {
            if (newVal && props.characterData) {
                // 等待下一帧，确保树组件已渲染
                nextTick(() => {
                    setCheckedPermissions()
                })
            } else {
                isSelectAll.value = false
            }
        },
    )

    /**
     * 根据角色的权限设置树的选中状态
     */
    const setCheckedPermissions = () => {
        if (!treeRef.value || !props.characterData) {
            return
        }

        const roleMenus = (props.characterData as any)?.roleMenus as
            | Array<{ menuId: number; actionId: number }>
            | undefined
        if (!roleMenus?.length) return

        // 找到所有匹配的节点 name
        const checkedKeys: string[] = []
        const traverse = (nodes: MenuNode[]) => {
            nodes.forEach(node => {
                if (node.isAuth && node.actionId && roleMenus.some(rm => rm.actionId === node.actionId)) {
                    if (node.name) checkedKeys.push(node.name as string)
                }
                if (node.children?.length) traverse(node.children)
            })
        }
        traverse(processedMenuList.value as MenuNode[])
        treeRef.value.setCheckedKeys(checkedKeys)
    }

    /**
     * 处理全选变化
     */
    const toggleSelectAll = () => {
        const tree = treeRef.value
        if (!tree) return

        if (!isSelectAll.value) {
            const allKeys = getAllNodeKeys(processedMenuList.value as MenuNode[])
            tree.setCheckedKeys(allKeys)
        } else {
            tree.setCheckedKeys([])
        }

        isSelectAll.value = !isSelectAll.value
    }

    /**
     * 处理树节点选中状态变化
     */
    const handleTreeCheck = () => {
        const tree = treeRef.value
        if (!tree) return

        const checkedKeys = tree.getCheckedKeys()
        const allKeys = getAllNodeKeys(processedMenuList.value as MenuNode[])
        isSelectAll.value = checkedKeys.length === allKeys.length && allKeys.length > 0
    }

    /**
     * 递归获取所有节点 key
     */
    const getAllNodeKeys = (nodes: MenuNode[]): string[] => {
        const keys: string[] = []
        const traverse = (nodeList: MenuNode[]) => {
            nodeList.forEach(node => {
                if (node.name) keys.push(node.name as string)
                if (node.children?.length) traverse(node.children)
            })
        }
        traverse(nodes)
        return keys
    }

    /**
     * 切换展开/收起
     */
    const toggleExpandAll = () => {
        const tree = treeRef.value
        if (!tree) return

        const nodes = tree.store.nodesMap
        Object.values(nodes).forEach((node: any) => {
            node.expanded = !isExpandAll.value
        })

        isExpandAll.value = !isExpandAll.value
    }

    /**
     * 输出选中数据（调试用）
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

    /**
     * 关闭弹窗并清空选中状态
     */
    const handleClose = () => {
        visible.value = false
        isSelectAll.value = false
        if (treeRef.value) {
            treeRef.value.setCheckedKeys([])
        }
    }

    /**
     * 保存权限配置
     */
    const savePermission = async () => {
        if (!props.characterData?.id) {
            ElMessage.error('角色ID无效，无法保存权限')
            return
        }

        try {
            const tree = treeRef.value
            if (!tree) return

            const nodes = tree.getCheckedNodes()
            const roleMenus: Array<{ menuId: number; actionId: number }> = []
            nodes.forEach((node: any) => {
                if (node && node.menuId && node.actionId) {
                    roleMenus.push({
                        menuId: node.menuId,
                        actionId: node.actionId,
                    })
                }
            })

            await fetchUpdateCharacterPermission({
                id: props.characterData.id,
                roleMenus,
            })

            ElMessage.success('权限保存成功')
            emit('success')
            handleClose()
        } catch (error) {
            console.error('保存权限失败:', error)
            ElMessage.error('保存权限失败')
        }
    }
</script>

<style lang="scss" scoped>
    .permission-dialog-content {
        .role-name-display {
            margin-bottom: 16px;
            padding: 12px;
            background-color: var(--el-bg-color-page);
            border-radius: 4px;

            .label {
                font-weight: 500;
                color: var(--el-text-color-primary);
                margin-right: 8px;
            }

            .value {
                color: var(--el-text-color-regular);
            }
        }

        .select-all-wrapper {
            margin-bottom: 16px;
        }

        .operation-permission-cell {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
</style>
