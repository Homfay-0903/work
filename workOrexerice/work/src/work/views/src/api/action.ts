import request from '@/utils/http'

// 获取动作列表
export function fetchGetActionList(params: Api.Action.ActionSearchParams) {
    // 将 size 映射为 pageSize（后端接口使用 pageSize）
    const { size, ...restParams } = params
    const apiParams = size !== undefined ? { ...restParams, pageSize: size } : restParams

    return request.get<Api.Action.ActionList>({
        url: '/api/v1/actions',
        params: apiParams,
        paramsSerializer: {
            serialize: (params: any) => {
                const parts: string[] = []
                Object.keys(params).forEach(key => {
                    const value = params[key]
                    if (value === undefined || value === null || value === '') {
                        return
                    }
                    if (Array.isArray(value)) {
                        // 数组参数：将数组元素展开为多个同名的查询参数
                        // 例如：instrumentIds=1&instrumentIds=2
                        value.forEach(item => {
                            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
                        })
                    } else {
                        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    }
                })
                return parts.join('&')
            },
        },
        timeout: 5 * 60 * 1000,
    })
}

// 创建动作
export function fetchCreateAction(body: Api.Action.ActionCreateBody) {
    return request.post<void>({
        url: '/api/v1/actions',
        data: body,
        operationDesc: '创建动作',
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
        operationDesc: '编辑动作',
    })
}

//翻译动作
export function fetchTranslateAction(body: Api.Action.ActionTranslateBody) {
    return request.post<void>({
        url: `/api/v1/actions/translate`,
        data: body,
        operationDesc: '翻译动作',
    })
}

// 删除动作
export function fetchDeleteAction(id: number) {
    return request.del<void>({
        url: `/api/v1/actions/${id}`,
        operationDesc: '删除动作',
    })
}

//更新上下架状态
export function fetchUpdateActionStatus(params: Api.Action.ActionStatus) {
    return request.post<void>({
        url: `/api/v1/actions/${params.id}/status/${params.status}`,
        data: params,
        operationDesc: '更新动作上下架状态',
    })
}
