import request from '@/utils/http'

/**
 * 获取动作列表
 */
export function fetchGetAiActionList(params: Api.Ai.AiSearchParams) {
    const { size, ...restParams } = params
    const apiParams = size !== undefined ? { ...restParams, pageSize: size } : restParams

    return request.get<Api.Ai.AiListItem>({
        url: '/api/v1/so-libs/actions',
        params: apiParams,
    })
}

/**
 * 新增so库版本
 */
export function fetchAddSoLibVersion(body: Api.Ai.AiCreateBody) {
    if (body.file instanceof File) {
        const formData = new FormData()
        formData.append('version', body.version || '')
        formData.append('soPath', body.soPath)
        if (body.remark) {
            formData.append('remark', body.remark)
        }
        formData.append('file', body.file)

        return request.post<Api.Ai.AiCreateBody>({
            url: '/api/v1/so-libs',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    return request.post<Api.Ai.AiCreateBody>({
        url: '/api/v1/so-libs',
        data: body,
    })
}

/**
 * 获取版本列表
 */
export function fetchGetSoLibVersionList(params: Api.Ai.AiVersionSearchParams) {
    const { size, ...restParams } = params
    const apiParams = size !== undefined ? { ...restParams, pageSize: size } : restParams

    return request.get<Api.Ai.AiVersionListItem>({
        url: '/api/v1/so-libs',
        params: apiParams,
    })
}
