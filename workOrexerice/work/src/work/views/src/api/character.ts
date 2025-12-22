import request from '@/utils/http'

// 获取角色列表
export function fetchGetCharacterList(params: Api.Character.CharacterSearchParams) {
    return request.get<Api.Character.CharacterList>({
        url: '/api/v1/admin/roles',
        params,
    })
}

// 创建角色
export function fetchCreateCharacter(body: Api.Character.CharacterCreateBody) {
    return request.post<void>({
        url: '/api/v1/admin/roles',
        data: body,
    })
}

// 编辑角色
export function fetchUpdateCharacter(body: Api.Character.CharacterUpdateBody) {
    return request.put<void>({
        url: '/api/v1/admin/roles',
        data: body,
    })
}

// 删除角色
export function fetchDeleteCharacter(id: number) {
    return request.del<void>({
        url: `/api/v1/admin/roles/${id}`,
    })
}

// 更新角色权限
export function fetchUpdateCharacterPermission(body: {
    id: number
    roleMenus: Array<{ menuId: number; actionId: number }>
}) {
    return request.put<void>({
        url: '/api/v1/admin/roles/permission',
        data: body,
    })
}

// 启用/禁用角色
export function fetchToggleCharacterStatus(id: number, status: number) {
    return request.put<void>({
        url: `/api/v1/admin/roles/${id}/status`,
        data: { status },
    })
}
