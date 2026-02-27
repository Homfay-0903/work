/*
 * @Description: WellnessHub API接口定义
 * @Author: Auto Generated
 * @Date: 2025-11-27
 */
import wellnessHub from './wellness-hub'

// WellnessHub接口相关的类型定义
namespace WellnessHub {
    // IP国家不匹配预警请求
    export interface AlertWarningReq {
        device_sn: string
        ip: string
        ip_country: string[]
        sales_country: string[]
    }
    // IP国家不匹配预警响应
    export interface AlertWarningRes {
        [key: string]: unknown;
    }
    // 设备操作日志请求
    export interface DeviceOperationLogReq {
        device_sn: string
        operation_type: string
        ip: string
        ip_country: string[]
    }
    // 设备操作日志响应
    export interface DeviceOperationLogRes {
        [key: string]: unknown;
    }
}

// IP国家不匹配预警接口
export const alertWarning = (params: WellnessHub.AlertWarningReq) => {
    // 使用wellnessHub专用HTTP客户端
    return wellnessHub.post<WellnessHub.AlertWarningRes>('/visbody/alert-warning', params)
}

// 设备操作日志接口
export const deviceOperationLog = (params: WellnessHub.DeviceOperationLogReq) => {
    // 使用wellnessHub专用HTTP客户端
    return wellnessHub.post<WellnessHub.DeviceOperationLogRes>('/visbody/device-operation-log', params)
}

// 导出类型定义，供其他文件使用
export type { WellnessHub }

