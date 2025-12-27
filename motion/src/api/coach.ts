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
