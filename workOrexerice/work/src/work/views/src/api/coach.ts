import request from '@/utils/http'

// 获取教练列表
export function fetchGetCoachList(params: Api.Coach.CoachSearchParams) {
    return request.get<Api.Coach.CoachList>({
        url: '/api/v1/coach',
        params,
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
