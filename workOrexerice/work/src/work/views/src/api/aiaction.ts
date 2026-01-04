import request from '@/utils/http'

export function fetchGetAiActionList(params: Api.Ai.AiSearchParams) {
    const { size, ...restParams } = params
    const apiParams = size !== undefined ? { ...restParams, pageSize: size } : restParams

    return request.get<Api.Ai.AiListItem>({
        url: '/api/v1/so-libs/actions',
        params: apiParams,
    })
}
