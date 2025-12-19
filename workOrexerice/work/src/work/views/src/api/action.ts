import request from '@/utils/http'

// 获取动作列表
export function fetchGetActionList(params: Api.Action.ActionSearchParams) {
    return request.get<Api.Action.ActionList>({
        url: '/api/v1/action',
        params,
    })
}

// 创建动作
export function fetchCreateAction(body: Api.Action.ActionCreateBody) {
    return request.post<void>({
        url: '/api/v1/action',
        data: body,
    })
}

// 编辑动作
export function fetchUpdateAction(body: Api.Action.ActionUpdateBody) {
    return request.put<void>({
        url: '/api/v1/action',
        data: body,
    })
}

// 删除动作
export function fetchDeleteAction(id: number) {
    return request.del<void>({
        url: `/api/v1/action/${id}`,
    })
}
