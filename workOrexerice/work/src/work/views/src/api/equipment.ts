import request from '@/utils/http'

// 获取器械列表
export function fetchGetEquipmentList(params: Api.Equipment.EquipmentSearchParams) {
    const { name, ...restParams } = params
    const trimmedName = name?.trim()
    const apiParams = trimmedName ? { ...restParams, keyword: trimmedName } : restParams

    return request.get<Api.Equipment.EquipmentList>({
        url: '/api/v1/instruments',
        params: apiParams,
    })
}

// 创建器械
export function fetchCreateEquipment(body: Api.Equipment.EquipmentCreateBody) {
    return request.post<void>({
        url: '/api/v1/equipment',
        data: body,
    })
}

// 编辑器械
export function fetchUpdateEquipment(body: Api.Equipment.EquipmentUpdateBody) {
    return request.put<void>({
        url: '/api/v1/equipment',
        data: body,
    })
}

// 删除器械
export function fetchDeleteEquipment(id: number) {
    return request.del<void>({
        url: `/api/v1/equipment/${id}`,
    })
}

// 检查器械是否被使用（绑定了上架中的动作）
export function fetchCheckEquipmentInUse(id: number) {
    return request.get<{ inUse: boolean }>({
        url: `/api/v1/equipment/${id}/check-in-use`,
    })
}

// 翻译器械
export function fetchTranslateEquipment(id: number) {
    return request.post<void>({
        url: `/api/v1/equipment/${id}/translate`,
    })
}

// 更新器械排序
export function fetchUpdateEquipmentSort(id: number, sort: number) {
    return request.put<void>({
        url: `/api/v1/equipment/${id}/sort`,
        data: { sort },
    })
}
