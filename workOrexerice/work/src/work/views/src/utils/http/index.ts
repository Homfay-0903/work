/**
 * HTTP 请求封装模块
 * 基于 Axios 封装的 HTTP 请求工具，提供统一的请求/响应处理
 *
 * ## 主要功能
 *
 * - 请求/响应拦截器（自动添加 Token、统一错误处理）
 * - 401 未授权自动刷新令牌（带并发请求队列处理）
 * - 请求失败自动重试（可配置）
 * - 统一的成功/错误消息提示
 * - 支持 GET/POST/PUT/DELETE 等常用方法
 *
 * @module utils/http
 * @author Art Design Pro Team
 */

import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiStatus } from './status'
import { HttpError, handleError, showError, showSuccess } from './error'
import { $t } from '@/locales'
import { BaseResponse } from '@/types'
import { fetchRefreshToken } from '@/api/auth'

/** 请求配置常量 */
const REQUEST_TIMEOUT = 15000
const LOGOUT_DELAY = 500
const MAX_RETRIES = 0
const RETRY_DELAY = 1000
const UNAUTHORIZED_DEBOUNCE_TIME = 3000

/** 401防抖状态 */
let isUnauthorizedErrorShown = false
let unauthorizedTimer: NodeJS.Timeout | null = null

/** 刷新令牌状态 */
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

/** 扩展 AxiosRequestConfig */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    showErrorMessage?: boolean
    showSuccessMessage?: boolean
}

const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

/** Axios实例 */
const axiosInstance = axios.create({
    timeout: REQUEST_TIMEOUT,
    baseURL: VITE_API_URL,
    withCredentials: VITE_WITH_CREDENTIALS === 'true',
    validateStatus: status => status >= 200 && status < 300,
    transformResponse: [
        (data, headers) => {
            const contentType = headers['content-type']
            if (contentType?.includes('application/json')) {
                try {
                    return JSON.parse(data)
                } catch {
                    return data
                }
            }
            return data
        },
    ],
})

/** 请求拦截器 */
axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
        const { accessToken } = useUserStore()
        if (accessToken) request.headers.set('Authorization', `Bearer ${accessToken}`)

        if (request.data && !(request.data instanceof FormData) && !request.headers['Content-Type']) {
            request.headers.set('Content-Type', 'application/json')
            request.data = JSON.stringify(request.data)
        }

        return request
    },
    error => {
        showError(createHttpError($t('httpMsg.requestConfigError'), ApiStatus.error))
        return Promise.reject(error)
    },
)

/** 响应拦截器 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<BaseResponse>) => {
        const httpStatus = response.status
        const { code: businessCode, message } = response.data

        // 检查 HTTP 状态码
        if (httpStatus !== ApiStatus.success && httpStatus !== ApiStatus.created) {
            if (httpStatus === ApiStatus.unauthorized) handleUnauthorizedError(message)
            throw createHttpError(message || $t('httpMsg.requestFailed'), httpStatus)
        }

        // 检查业务错误码（成功为 0）
        if (businessCode !== 0) {
            // 使用业务错误码和消息创建错误
            throw createHttpError(message || $t('httpMsg.requestFailed'), businessCode)
        }

        return response
    },
    async error => {
        // 先检查是否有业务错误码，如果有则优先使用业务错误码和消息
        // 这样可以避免将业务错误（如密码错误 1005）误判为 401 未授权
        const responseData = error.response?.data
        const businessCode = (responseData as any)?.code
        if (businessCode !== undefined && businessCode !== 0) {
            // 有业务错误码，直接交给 handleError 处理，不使用 401 的特殊处理
            return Promise.reject(handleError(error))
        }
        // 没有业务错误码，按 HTTP 状态码处理
        if (error.response?.status === ApiStatus.unauthorized) {
            return handleTokenRefresh(error)
        }
        return Promise.reject(handleError(error))
    },
)

/** 统一创建HttpError */
function createHttpError(message: string, code: number) {
    return new HttpError(message, code)
}

/** 处理令牌刷新 */
async function handleTokenRefresh(error: any) {
    const userStore = useUserStore()
    const { refreshToken } = userStore

    // 如果没有刷新令牌，直接登出
    if (!refreshToken) {
        return handleUnauthorizedError()
    }

    // 如果正在刷新，将请求加入队列
    if (isRefreshing) {
        return new Promise(resolve => {
            subscribeTokenRefresh((token: string) => {
                error.config.headers.Authorization = `Bearer ${token}`
                resolve(axiosInstance.request(error.config))
            })
        })
    }

    // 开始刷新令牌
    isRefreshing = true

    try {
        const response = await fetchRefreshToken({ refreshToken })
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response

        // 更新 store 中的令牌
        userStore.setToken(newAccessToken, newRefreshToken)

        // 通知所有等待的请求
        onTokenRefreshed(newAccessToken)

        // 重试原请求
        error.config.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance.request(error.config)
    } catch (refreshError) {
        // 刷新失败，登出
        handleUnauthorizedError()
        return Promise.reject(refreshError)
    } finally {
        isRefreshing = false
        refreshSubscribers = []
    }
}

/** 订阅令牌刷新事件 */
function subscribeTokenRefresh(callback: (token: string) => void) {
    refreshSubscribers.push(callback)
}

/** 通知所有订阅者令牌已刷新 */
function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach(callback => callback(token))
}

/** 处理401错误（带防抖） */
function handleUnauthorizedError(message?: string): never {
    const error = createHttpError(message || $t('httpMsg.unauthorized'), ApiStatus.unauthorized)

    if (!isUnauthorizedErrorShown) {
        isUnauthorizedErrorShown = true
        logOut()

        unauthorizedTimer = setTimeout(resetUnauthorizedError, UNAUTHORIZED_DEBOUNCE_TIME)

        showError(error, true)
        throw error
    }

    throw error
}

/** 重置401防抖状态 */
function resetUnauthorizedError() {
    isUnauthorizedErrorShown = false
    if (unauthorizedTimer) clearTimeout(unauthorizedTimer)
    unauthorizedTimer = null
}

/** 退出登录函数 */
function logOut() {
    setTimeout(() => {
        useUserStore().logOut()
    }, LOGOUT_DELAY)
}

/** 是否需要重试 */
function shouldRetry(statusCode: number) {
    return [
        ApiStatus.requestTimeout,
        ApiStatus.internalServerError,
        ApiStatus.badGateway,
        ApiStatus.serviceUnavailable,
        ApiStatus.gatewayTimeout,
    ].includes(statusCode)
}

/** 请求重试逻辑 */
async function retryRequest<T>(config: ExtendedAxiosRequestConfig, retries: number = MAX_RETRIES): Promise<T> {
    try {
        return await request<T>(config)
    } catch (error) {
        if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
            await delay(RETRY_DELAY)
            return retryRequest<T>(config, retries - 1)
        }
        throw error
    }
}

/** 延迟函数 */
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/** 请求函数 */
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
    // POST | PUT 参数自动填充
    if (['POST', 'PUT'].includes(config.method?.toUpperCase() || '') && config.params && !config.data) {
        config.data = config.params
        config.params = undefined
    }

    try {
        const res = await axiosInstance.request<BaseResponse<T>>(config)

        // 显示成功消息
        if (config.showSuccessMessage && res.data.message) {
            showSuccess(res.data.message)
        }

        return res.data.data as T
    } catch (error) {
        if (error instanceof HttpError && error.code !== ApiStatus.unauthorized) {
            const showMsg = config.showErrorMessage !== false
            showError(error, showMsg)
        }
        return Promise.reject(error)
    }
}

/** API方法集合 */
const api = {
    get<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'GET' })
    },
    post<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'POST' })
    },
    put<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'PUT' })
    },
    del<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'DELETE' })
    },
    request<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>(config)
    },
}

export default api
