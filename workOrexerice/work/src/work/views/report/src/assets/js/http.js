import axios from 'axios'
import { assistantApiHost } from '@/assets/js/config.js'

const config = {
    // 默认地址
    baseURL: assistantApiHost,
    // 设置超时时间
    timeout: 20000,
}

// 创建axios对象
const request = axios.create(config)

const handleCode = (code) => {
    switch (code) {
        case 401:
            console.log('token失效，请重新登录')
            break
        default:
            console.log('请求失败')
            break
    }
}


// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || ''
        config.headers.Authorization = `Bearer ${token}`
        return config

    },
    (error) => {
        return Promise.reject(error)
    })

// 添加响应拦截器
request.interceptors.response.use(
    (response) => {
        const { data } = response
        console.log('http接口响应：', data)

        return data

    }, (error) => {
        const { response } = error
        if (response) {
            handleCode(response.status)
        }
        if (!window.navigator.onLine) {
            console.error('网络连接失败')
            // TODO:异常重试
        }
        return Promise.reject(error)
    })

export default request
