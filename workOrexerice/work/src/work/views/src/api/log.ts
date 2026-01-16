import request from '@/utils/http'

/**
 * 获取操作日志列表
 * @param params 查询参数
 */
export function fetchGetLogList(params: Api.Log.LogSearchParams) {
    return request.get<Api.Log.LogList>({
        url: '/api/v1/operation-logs',
        params,
    })
}
