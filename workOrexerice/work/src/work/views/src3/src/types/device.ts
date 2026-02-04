/*
 * @Description: 
 * @Author: ouyaping
 * @Date: 2025-06-24 15:13:05
 * @LastEditors: liutq
 * @LastEditTime: 2025-09-25 10:56:05
 */
import store from '@/store'

/**
 * 产品名称对应的 SN
 */
export enum ProductNameSNEnum {
    /** VAPRO3  */
    VAPRO3 = 'M5',
    /** VAPRO5 */
    VAPRO5 = 'M6',
    /** M30 */
    M30 = 'M0',
    /** M30 G2L导入 */
    M30_G2L = 'M1',

    /** VAPRO5 */
    VAPRO5_G2L = 'M2',
    /** VAPRO5S N2导入 */
    VApro5_S = 'N2',
     /** M30_S导入 */
    M30_S = 'N1'
}

// 海外产品
export const ProductOS = [
    ProductNameSNEnum.M30,
    ProductNameSNEnum.M30_G2L,
    ProductNameSNEnum.M30_S

]

// 已经对接了ai
export const AiDevice = [
    ProductNameSNEnum.M30,
    ProductNameSNEnum.M30_G2L,
    ProductNameSNEnum.VAPRO5,
    ProductNameSNEnum.VAPRO5_G2L,
    ProductNameSNEnum.VApro5_S,
    ProductNameSNEnum.M30_S,
]

export const DeviceType: {
    [key in ProductNameSNEnum]: number
} = {
    [ProductNameSNEnum.M30]: 3,
    [ProductNameSNEnum.M30_G2L]: 3,
    [ProductNameSNEnum.M30_S]: 3,
    [ProductNameSNEnum.VAPRO5_G2L]: 5,
    [ProductNameSNEnum.VAPRO5]: 5,
    [ProductNameSNEnum.VAPRO3]: 4,
    [ProductNameSNEnum.VApro5_S]: 5,
}

export const isOsDevice = () => {
    window.logger.info('isOsDevice', store.getters.deviceInfo.deviceId)
    const deviceId = store.getters.deviceInfo.deviceId
    const suffix = deviceId.slice(0, 2)
    return ProductOS.includes(suffix as ProductNameSNEnum)
}

// 是否已经对接了ai
export const isAiDevice = () => {
    console.log('isAiDevice', store.getters.deviceInfo.deviceId)
    const deviceId = store.getters.deviceInfo.deviceId
    const suffix = deviceId.slice(0, 2)
    return AiDevice.includes(suffix as ProductNameSNEnum)
}
