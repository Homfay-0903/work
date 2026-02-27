/*
 * @Description: WellnessHub HTTP客户端封装
 * @Author: Auto Generated
 * @Date: 2025-11-27
 */
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import CONFIG from '@/config/index'
import { isOsDevice } from '@/types/device'
import { ipcRenderer } from 'electron'

interface Result {
    code: number
    msg: string
}

interface ResultData<T = any> extends Result {
    data?: T
}

enum RequestEnums {
    TIMEOUT = 10000, // 超时时间10秒
    OVERDUE = 401, // token失效
    FAIL = 500, // 请求失败
    SUCCESS = 200 // 请求成功
}

/**
 * 获取wellnessHub地址（根据设备类型区分国内和海外）
 */
function getWellnessHubBaseUrl(): string {
    const isOs = isOsDevice()
    if (isOs) {
        return CONFIG.WELLNESS_HUB_ADDR_OS || 'http://localhost:3001'
    } else {
        return CONFIG.WELLNESS_HUB_ADDR_CN || 'http://localhost:3001'
    }
}

/**
 * 通过 IPC 调用主进程生成 Token
 * 密钥和签名逻辑都在主进程，不会暴露给渲染进程
 */
async function generateToken(): Promise<string> {
    try {
        const result = await ipcRenderer.invoke('generate-wellness-token')
        if (result.success) {
            return result.token
        } else {
            window.logger.error('[WellnessHub]: 生成Token失败', result.error)
            throw new Error(result.error || '生成Token失败')
        }
    } catch (error: any) {
        window.logger.error('[WellnessHub]: IPC调用失败', error)
        throw new Error('IPC调用失败: ' + (error.message || '未知错误'))
    }
}

const createConfig = (): AxiosRequestConfig => {
    return {
        baseURL: '',
        timeout: RequestEnums.TIMEOUT as number,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

class WellnessHubHttp {
    service: AxiosInstance

    public constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config)

        this.service.interceptors.request.use(
            async (config: any) => {
                const baseURL = getWellnessHubBaseUrl()
                config.baseURL = baseURL

                // 通过 IPC 调用主进程生成Token（密钥在主进程，不暴露给渲染进程）
                try {
                    const token = await generateToken()
                    config.headers = config.headers || {}
                    config.headers['authorization'] = token

                    window.logger.info('WellnessHub请求:', {
                        url: config.url,
                        method: config.method,
                        baseURL: config.baseURL,
                        data: config.data,
                    })
                } catch (error: any) {
                    window.logger.error('[WellnessHub]: 获取Token失败', error)
                    return Promise.reject(error)
                }

                return config
            },
            (error: AxiosError) => {
                window.logger.error('WellnessHub请求拦截器错误:', error)
                return Promise.reject(error)
            }
        )

        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data, status, config } = response

                window.logger.info('WellnessHub接口响应:', {
                    url: config.url,
                    status: status,
                    data: data
                })

                return data
            },
            (error: AxiosError) => {
                const { response, config } = error

                window.logger.error('WellnessHub接口错误:', {
                    url: config?.url,
                    baseURL: config?.baseURL,
                    status: response?.status,
                    message: error.message,
                    data: response?.data
                })

                if (response) {
                    this.handleCode(response.status)
                }

                if (!window.navigator.onLine) {
                    window.logger.error('WellnessHub网络连接失败')
                }

                return Promise.reject(error)
            }
        )
    }

    /**
     * 处理HTTP状态码
     */
    handleCode(code: number): void {
        switch (code) {
            case 401:
                window.logger.warn('WellnessHub token失效，请重新登录')
                break
            case 403:
                window.logger.warn('WellnessHub 无权限访问')
                break
            case 404:
                window.logger.warn('WellnessHub 接口不存在')
                break
            case 500:
                window.logger.error('WellnessHub 服务器内部错误')
                break
            case 502:
                window.logger.error('WellnessHub 网关错误')
                break
            case 503:
                window.logger.error('WellnessHub 服务不可用')
                break
            default:
                window.logger.error(`WellnessHub 请求失败，状态码: ${code}`)
                break
        }
    }

    get<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.get(url, { params })
    }

    post<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, params)
    }

    put<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.put(url, params)
    }

    delete<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.delete(url, { params })
    }
}

export default new WellnessHubHttp(createConfig())

