import axios from '.'
import store from '@/store'

enum DeviceExpireStatus {
    NULL = 0, // 占位符，没有特殊含义
    NORMAL = 1, // 未到期正常使用
    WARNING_BEFORE = 2, // 临近到期且在7天内
    WARNING_AFTER = 3, // 已到期且未超过7天
    UNAVAILABLE = 4 // 到期且在7天以上
}

namespace NotifyStatus {
    // 注册请求
    export interface RegisterReq {
        deviceId: string
        deviceMac: string
    }
    // 注册响应
    export interface RegisterRes {
        status: boolean
        timeZone: string
    }
    // 获取二维码请求
    export interface GetQRCodeReq {
        device_id: string
        scan_id: string
    }
    // 获取二维码响应
    export interface GetQRCodeRes {
        device_id: string
        scan_id: string
        data: string
        is_third_code: boolean
    }
    // 获取扫描信息请求
    export interface GetScanInfoReq {
        device_id: string
        scan_id: string
    }
    // 获取扫描信息响应
    export interface GetScanInfoRes {}
    // 保存测量类型请求
    export interface CreateScanTypeReq {
        device_id: string
        scan_id: string
        bia_measure: number
        eval_measure: number
        girth_measure: number
        shoulder_joint_eval: number
        utc: string
        time_zone: string
        scan_mode: string
        nutrition: string
        height: string
        beauty: string
        weight_measure: string
        athlete: string
    }
    // 保存测量类型响应
    export interface CreateScanTypeRes {
        create_time: number
        scan_id: string
        code_num: string
        scan_time: string
    }
    // 获取设备有效期请求
    export interface GetDeviceExpireReq {
        device_id: string
    }
    // 获取设备有效期响应
    export interface GetDeviceExpireRes {
        device_id: string
        status: DeviceExpireStatus
        expiration_time: number
    }
    // 上报二维码识别信息请求
    export interface ReportQrCodeInfoReq {
        device_id: string
        qrcode_msg: string
    }
    // 上报二维码识别信息响应
    export interface ReportQrCodeInfoRes {
        result: boolean
    }
    // 获取设备测量项目开启状态
    export interface GetProjectEnableReq {
        deviceId: string
    }
    export interface GetProjectEnableRes {
        [key: string]: unknown;
    }
     // 获取测量报告URL
    export interface GetReportUrlReq {
        scan_id: string
        deviceId: string
    }
    export interface GetReportUrlRes {
        [key: string]: unknown
    }
    // 上报测量项

    export interface SendMeasureModeReq {
        scan_id: string
        is_girth_eval_combo: number
        scan_mode: number
        create_time: number
    }
    export interface SendMeasureModelRes {
        [key: string]: unknown
    }
}
// 注册
export const register = (params: NotifyStatus.RegisterReq) => {
    return axios.post<NotifyStatus.RegisterRes>('/register', params)
}
// 获取二维码
export const getQRCode = async (params: NotifyStatus.GetQRCodeReq) => {
    const data = await axios.get<NotifyStatus.GetQRCodeRes>('/qr-code', params)
    window.logger.info('[status-client]: 获取测量二维码', params, data)
    let QRdata = ''
    if (data.data) {
        QRdata = 'data:image/png;base64,' + data.data.data
    }
    store.commit('CHANGE_QRCODE', {
        path: QRdata,
        status: true
    })
    return data
}
// 获取扫描信息
export const getScanInfo = (params: NotifyStatus.GetScanInfoReq) => {
    return axios.get<NotifyStatus.GetScanInfoRes>('/get-scan-info', params)
}
// 保存测量类型
export const createScanType = (params: NotifyStatus.CreateScanTypeReq) => {
    window.logger.info('[status-client]: 保存测量类型', params)
    return axios.post<NotifyStatus.CreateScanTypeRes>('/scan-type', params)
}
// 获取设备有效期
export const getDeviceExpire = (params: NotifyStatus.GetDeviceExpireReq) => {
    return axios.get<NotifyStatus.GetDeviceExpireRes>('/get-device-expire', params)
}
// 上报二维码信息
export const reportQrCodeInfo = (params: NotifyStatus.ReportQrCodeInfoReq) => {
    return axios.post<NotifyStatus.ReportQrCodeInfoRes>('/qrcode-info', params)
}
// 获取设备开启的测量项目
export const getProjectEnable = (params: { device_id: string }) => {
    return axios.get<NotifyStatus.GetProjectEnableRes>('/project-enable', params)
}

// 获取测量报告URL
export const getReportUrl = (params: NotifyStatus.GetReportUrlReq) => {
    return axios.get<NotifyStatus.GetReportUrlRes>('/third/report-url', params)
}

// 上报测量项
export const sendMeasureMode  = (params: NotifyStatus.SendMeasureModeReq) => {
    window.logger.info('[status-client]: 上报测量项', params)
    return axios.post<NotifyStatus.SendMeasureModelRes>('/scan-mode', params)
}

