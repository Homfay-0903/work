import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import CONFIG from '@/config/index'

// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
    code: number
    msg: string
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
    data?: T
}
const URL: string = `http://${CONFIG.SERVICE.STATUS_HTTP_ADDR}`
enum RequestEnums {
    TIMEOUT = 20000,
    OVERDUE = 401, // token失效
    FAIL = 500, // 请求失败
    SUCCESS = 200 // 请求成功
}
const config = {
    // 默认地址
    baseURL: URL as string,
    // 设置超时时间
    timeout: RequestEnums.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
}

class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance
    public constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config)
        /**
         * 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         */

        this.service.interceptors.request.use(
            (config: any) => {
                const token = localStorage.getItem('token') || 'f4a9b8c2d1e3f56789ab12cd34ef56ab7890cdef12345678abcdef9012345678'
                return {
                    ...config,
                    headers: {
                        authorization: token // 请求头中携带token信息
                    }
                }
            },
            (error: AxiosError) => {
                // 请求报错
                Promise.reject(error)
            }
        )
        /**
         * 响应拦截器
         * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */

        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data, status, config } = response
                window.logger.log('http接口响应：', data)
                return data
            },
            (error: AxiosError) => {
                const { response } = error
                if (response) {
                    this.handleCode(response.status)
                }
                if (!window.navigator.onLine) {
                    window.logger.error('网络连接失败')
                    // TODO:异常重试
                }
            }
        )
    }
    handleCode(code: number): void {
        switch (code) {
            case 401:
                window.logger.log('token失效，请重新登录')
                break
            default:
                window.logger.log('请求失败')
                break
        }
    }

    // 常用方法封装
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

// 导出一个实例对象
export default new RequestHttp(config)
