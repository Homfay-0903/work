import request from '@/utils/http'

// 获取标签列表
export function fetchGetTagList(params: Api.Tag.TagSearchParams) {
    // 将 size 映射为 pageSize（后端接口使用 pageSize）
    const { name, ...restParams } = params
    const trimmedName = name?.trim()
    const apiParams = trimmedName ? { ...restParams, keyword: trimmedName } : restParams

    return request.get<Api.Tag.TagList>({
        url: '/api/v1/tags',
        params: apiParams,
    })
}
