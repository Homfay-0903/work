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
    skipAuth?: boolean
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
        if (accessToken && !(request as ExtendedAxiosRequestConfig).skipAuth) {
            request.headers.set('Authorization', `Bearer ${accessToken}`)
        }

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
        const { code: businessCode, message } = response.data

        // 检查业务错误码（成功为 0）
        if (businessCode !== 0) {
            // 使用业务错误码和消息创建错误
            throw createHttpError(message || $t('httpMsg.requestFailed'), businessCode)
        }

        return response
    },
    async error => {
        const responseStatus = error.response?.status
        const responseData = error.response?.data
        const businessCode = (responseData as any)?.code
        const requestUrl = error.config?.url || ''
        const requestConfig = error.config as ExtendedAxiosRequestConfig

        // 处理 401 未授权错误
        if (responseStatus === ApiStatus.unauthorized) {
            // 1. 优先检查是否是刷新令牌请求本身失败（避免无限循环）
            // 刷新令牌请求失败应该直接登出，而不是作为业务错误或再次尝试刷新
            if (requestUrl.includes('/auth/refresh-token')) {
                handleUnauthorizedError(responseData?.message)
                return Promise.reject(handleError(error))
            }

            // 2. 检查是否是认证相关的接口（登录、注册、OAuth、修改密码等，但不包括刷新令牌）
            // 这些接口的 401 错误应该作为业务错误处理，不尝试刷新令牌
            // 例如：登录时密码错误，应该显示"密码错误"而不是尝试刷新令牌
            const isAuthRelatedRequest = isAuthenticationRelatedRequest(requestUrl)

            // 3. 检查是否跳过了认证（skipAuth），如果是，说明这是不需要认证的接口，401 应该作为业务错误
            const isSkipAuth = requestConfig?.skipAuth === true

            if (isAuthRelatedRequest || isSkipAuth) {
                // 认证相关接口或跳过认证的接口返回 401，作为业务错误处理
                // 优先使用业务错误码和消息（如密码错误：code 1005, message "密码错误"）
                return Promise.reject(handleError(error))
            }

            // 4. 对于其他需要认证的接口，尝试刷新令牌
            // 注意：只有当 refreshToken 存在时才会尝试刷新，否则会直接登出
            return handleTokenRefresh(error)
        }

        // 非 401 错误：如果有业务错误码，使用业务错误码和消息
        if (businessCode !== undefined && businessCode !== 0) {
            return Promise.reject(handleError(error))
        }

        // 其他 HTTP 错误，按 HTTP 状态码处理
        return Promise.reject(handleError(error))
    },
)

/** 统一创建HttpError */
function createHttpError(message: string, code: number) {
    return new HttpError(message, code)
}

/** 判断是否是认证相关的请求（登录、注册、OAuth、修改密码等） */
function isAuthenticationRelatedRequest(url: string): boolean {
    if (!url) return false

    // 认证相关的路径模式（不包括刷新令牌，因为它已经单独处理）
    const authPatterns = ['/auth/login', '/auth/register', '/oauth/', '/user/reset-password']

    return authPatterns.some(pattern => url.includes(pattern))
}

/** 处理令牌刷新 */
async function handleTokenRefresh(error: any) {
    const userStore = useUserStore()
    const { refreshToken } = userStore

    // 如果没有刷新令牌（cookie 登录场景），尝试走 httpOnly cookie 刷新
    if (!refreshToken) {
        try {
            const response = await fetchRefreshToken(undefined as any)
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response
            if (!newAccessToken) throw new Error('cookie 刷新返回的 accessToken 为空')
            userStore.setToken(newAccessToken, newRefreshToken)
            userStore.setLoginStatus(true)
            error.config.headers.Authorization = `Bearer ${newAccessToken}`
            return axiosInstance.request(error.config)
        } catch (refreshError: any) {
            handleUnauthorizedError(refreshError?.response?.data?.message || refreshError?.message)
            return Promise.reject(refreshError)
        }
    }

    // 如果正在刷新，将请求加入队列
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token: string) => {
                if (token) {
                    // 刷新成功，使用新令牌重试请求
                    error.config.headers.Authorization = `Bearer ${token}`
                    resolve(axiosInstance.request(error.config))
                } else {
                    // 刷新失败，拒绝请求
                    reject(createHttpError($t('httpMsg.unauthorized'), ApiStatus.unauthorized))
                }
            })
        })
    }

    // 开始刷新令牌
    isRefreshing = true

    try {
        const response = await fetchRefreshToken({ refreshToken })
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response

        // 验证返回的令牌是否有效
        if (!newAccessToken) {
            throw new Error('刷新令牌返回的 accessToken 为空')
        }

        // 更新 store 中的令牌
        userStore.setToken(newAccessToken, newRefreshToken)

        // 通知所有等待的请求
        onTokenRefreshed(newAccessToken)

        // 重试原请求
        error.config.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance.request(error.config)
    } catch (refreshError: any) {
        // 刷新失败，清空所有令牌并登出
        userStore.setToken('', '')
        handleUnauthorizedError(refreshError?.response?.data?.message || refreshError?.message)
        // 通知所有等待的请求刷新失败
        onTokenRefreshed('')
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
    refreshSubscribers.forEach(callback => {
        try {
            callback(token)
        } catch (error) {
            console.error('[TokenRefresh] 通知订阅者失败:', error)
        }
    })
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
