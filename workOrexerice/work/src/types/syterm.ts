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
    })
}

// 编辑用户
export function fetchUpdateUser(body: Api.SystemManage.UserUpdateBody) {
    return request.put<void>({
        url: '/api/v1/user',
        data: body,
    })
}

// 删除用户
export function fetchDeleteUser(id: number) {
    return request.del<void>({
        url: `/api/v1/user/${id}`,
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
    })
}

export function fetchUpdateRole(body: Api.SystemManage.RoleUpdateBody) {
    return request.put<void>({
        url: '/api/v1/role',
        data: body,
    })
}

export function fetchUpdateRolePermission(body: Api.SystemManage.RolePermissionUpdateBody) {
    return request.put<void>({
        url: '/api/v1/role/permission',
        data: body,
    })
}

export function fetchDeleteRole(id: number) {
    return request.del<void>({
        url: `/api/v1/role/${id}`,
    })
}

// 获取菜单列表
export function fetchGetMenuList() {
    return request.get<AppRouteRecord[]>({
        url: '/api/v1/menus/tree',
    })
}
