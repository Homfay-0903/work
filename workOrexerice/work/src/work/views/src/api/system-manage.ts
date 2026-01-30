import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

// 获取用户列表
export function fetchGetUserList(params: Api.SystemManage.UserSearchParams) {
    return request.get<Api.SystemManage.UserList>({
        url: '/api/v1/user',
        params,
    })
}

// 创建用户
export function fetchCreateUser(body: Api.SystemManage.UserCreateBody) {
    return request.post<void>({
        url: '/api/v1/user',
        data: body,
        operationDesc: '创建用户',
    })
}

// 编辑用户
//export function fetchUpdateUser(body: Api.SystemManage.UserUpdateBody) {
//    return request.put<void>({
//        url: '/api/v1/user',
//        data: body,
//    })
//}

// 删除用户
export function fetchDeleteUser(id: number) {
    return request.del<void>({
        url: `/api/v1/user/${id}`,
        operationDesc: '删除用户',
    })
}

// 启用/禁用用户
export function fetchToggleUserStatus(id: number, body: { status: number }) {
    return request.put<void>({
        url: `/api/v1/user/${id}/toggle-status`,
        data: body,
        operationDesc: body.status === 0 ? '启用用户' : '禁用用户',
    })
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
    return request.get<Api.SystemManage.RoleList>({
        url: '/api/v1/role',
        params,
    })
}

export function fetchCreateRole(body: Api.SystemManage.RoleCreateBody) {
    return request.post<void>({
        url: '/api/v1/role',
        data: body,
        operationDesc: '创建角色',
    })
}

export function fetchUpdateRole(body: Api.SystemManage.RoleUpdateBody) {
    return request.put<void>({
        url: '/api/v1/role',
        data: body,
        operationDesc: '编辑角色',
    })
}

export function fetchUpdateRolePermission(body: Api.SystemManage.RolePermissionUpdateBody) {
    return request.put<void>({
        url: '/api/v1/role/permission',
        data: body,
        operationDesc: '更新角色权限',
    })
}

export function fetchDeleteRole(id: number) {
    return request.del<void>({
        url: `/api/v1/role/${id}`,
        operationDesc: '删除角色',
    })
}

// 获取菜单列表（管理页面使用，返回所有菜单）
export function fetchGetAllMenuList() {
    return request.get<AppRouteRecord[]>({
        url: '/api/v1/menus/tree',
    })
}

// 获取当前用户菜单列表（侧边栏使用，根据用户权限返回）
export function fetchGetMenuList() {
    return request.get<AppRouteRecord[]>({
        url: '/api/v1/menus/tree/current-user',
    })
}

// 创建菜单
export function fetchCreateMenu(body: Api.SystemManage.MenuCreateBody) {
    return request.post<void>({
        url: '/api/v1/menus',
        data: body,
        operationDesc: '创建菜单',
    })
}

// 编辑菜单
export function fetchUpdateMenu(body: Api.SystemManage.MenuUpdateBody) {
    return request.put<void>({
        url: '/api/v1/menus',
        data: body,
        operationDesc: '编辑菜单',
    })
}

// 删除菜单
export function fetchDeleteMenu(id: number) {
    return request.del<void>({
        url: `/api/v1/menus/${id}`,
        operationDesc: '删除菜单',
    })
}

// 创建菜单权限按钮
export function fetchCreateMenuAction(body: Api.SystemManage.MenuActionCreateBody) {
    return request.post<void>({
        url: '/api/v1/menus/action',
        data: body,
        operationDesc: '创建菜单权限按钮',
    })
}

// 编辑菜单权限按钮
export function fetchUpdateMenuAction(body: Api.SystemManage.MenuActionUpdateBody) {
    return request.put<void>({
        url: '/api/v1/menus/action',
        data: body,
        operationDesc: '编辑菜单权限按钮',
    })
}

// 删除菜单权限按钮
export function fetchDeleteMenuAction(id: number) {
    return request.del<void>({
        url: `/api/v1/menus/action/${id}`,
        operationDesc: '删除菜单权限按钮',
    })
}

// 获取所有权限码
export function fetchGetPermissionCodes() {
    return request.get<string[]>({
        url: '/api/v1/menus/permission-codes',
    })
}
