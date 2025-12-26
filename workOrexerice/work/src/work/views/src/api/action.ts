import request from '@/utils/http'

// 获取动作列表
export function fetchGetActionList(params: Api.Action.ActionSearchParams) {
    // 将 size 映射为 pageSize（后端接口使用 pageSize）
    const { size, ...restParams } = params
    const apiParams = size !== undefined ? { ...restParams, pageSize: size } : restParams

    return request.get<Api.Action.ActionList>({
        url: '/api/v1/actions',
        params: apiParams,
    })
}

// 创建动作
export function fetchCreateAction(body: Api.Action.ActionCreateBody) {
    return request.post<void>({
        url: '/api/v1/actions',
        data: body,
    })
}

// 编辑（更新）动作
export function fetchUpdateAction(body: Api.Action.ActionUpdateBody) {
    const { id, ...restBody } = body
    const updateBody = {
        id,
        ...restBody,
    }

    return request.post<void>({
        url: `/api/v1/actions/${id}`,
        data: updateBody,
    })
}

// 删除动作
export function fetchDeleteAction(id: number) {
    return request.del<void>({
        url: `/api/v1/action/${id}`,
    })
}

//更新上下架状态
export function fetchUpdateActionStatus(params: Api.Action.ActionStatus) {
    return request.post<void>({
        url: `/api/v1/actions/${params.id}/status/${params.status}`,
        data: params,
    })
}
