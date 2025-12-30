import request from '@/utils/http'

export function fetchGetCoachList(params: Api.Coach.CoachSearchParams) {
    // 将 size 映射为 pageSize（后端接口使用 pageSize）
    const { size, name, ...restParams } = params
    const trimmedName = name?.trim()
    const apiParams = trimmedName
        ? { ...restParams, keyword: trimmedName, pageSize: size }
        : { ...restParams, pageSize: size }
    return request.get<Api.Coach.CoachList>({
        url: '/api/v1/coaches',
        params: apiParams,
    })
}

// 创建教练
export function fetchCreateCoach(body: Api.Coach.CoachCreateBody) {
    return request.post<void>({
        url: '/api/v1/coach',
        data: body,
    })
}

// 编辑教练
export function fetchUpdateCoach(body: Api.Coach.CoachUpdateBody) {
    return request.put<void>({
        url: '/api/v1/coach',
        data: body,
    })
}

// 删除教练
export function fetchDeleteCoach(id: number) {
    return request.del<void>({
        url: `/api/v1/coach/${id}`,
    })
}

// 检查教练是否被使用（绑定了上架中的动作）
export function fetchCheckCoachInUse(id: number) {
    return request.get<{ inUse: boolean }>({
        url: `/api/v1/coach/${id}/check-in-use`,
    })
}

// 翻译教练
export function fetchTranslateCoach(id: number) {
    return request.post<void>({
        url: `/api/v1/coach/${id}/translate`,
    })
}
