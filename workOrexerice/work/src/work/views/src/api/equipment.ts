import request from '@/utils/http'

// 获取器械列表
export function fetchGetEquipmentList(params: Api.Equipment.EquipmentSearchParams) {
    const { name, size, ...restParams } = params
    const trimmedName = name?.trim()
    const apiParams = trimmedName
        ? { ...restParams, keyword: trimmedName, pageSize: size }
        : { ...restParams, pageSize: size }

    return request.get<Api.Equipment.EquipmentList>({
        url: '/api/v1/instruments',
        params: apiParams,
    })
}

// 创建器械
export function fetchCreateEquipment(body: Api.Equipment.EquipmentCreateBody) {
    return request.post<void>({
        url: '/api/v1/instruments',
        data: body,
        operationDesc: '创建器械',
    })
}

// 编辑器械
export function fetchUpdateEquipment(id: number, body: Api.Equipment.EquipmentUpdateBody) {
    return request.post<void>({
        url: `/api/v1/instruments/${id}`,
        data: body,
        operationDesc: '编辑器械',
    })
}

// 启用/禁用器械
export function fetchEnableEquipment(params: Api.Equipment.EquipmentEnableBody) {
    const { id, status } = params
    return request.post<void>({
        url: `/api/v1/instruments/${id}/status/${status}`,
        operationDesc: '启用/禁用器械',
    })
}

// 删除器械
export function fetchDeleteEquipment(id: number) {
    return request.del<void>({
        url: `/api/v1/instruments/${id}`,
        operationDesc: '删除器械',
    })
}

// 检查器械是否被使用（绑定了上架中的动作）
export function fetchCheckEquipmentInUse(id: number) {
    return request.get<{ inUse: boolean }>({
        url: `/api/v1/equipment/${id}/check-in-use`,
    })
}

// 翻译器械
export function fetchTranslateEquipment(body: Api.Equipment.EquipmentTranslateBody) {
    return request.post<void>({
        url: `/api/v1/instruments/translate`,
        data: body,
        operationDesc: '翻译器械',
    })
}

// 更新器械排序
export function fetchUpdateEquipmentSort(id: number, sort: number) {
    return request.put<void>({
        url: `/api/v1/equipment/${id}/sort`,
        data: { sort },
        operationDesc: '更新器械排序',
    })
}
