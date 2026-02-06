import fetch from 'unfetch'
import { ApolloLink, from } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { Message } from 'element-ui'
import { noLoading } from '@/assets/js/config'
import { apiUrl } from '@/assets/js/config.js'

const httpLink = new HttpLink({
    uri: apiUrl,
    fetch: fetch
})

let loadingInstance = null
let slowLoadingTimeOut = null

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    let token
    if (window.localStorage.getItem('userTokens')) {
        token = JSON.parse(window.localStorage.getItem('userTokens')).token
    }
    let operationIndex = noLoading.findIndex(item => {
        return item === operation.operationName
    })
    if (operationIndex === -1) {
        if (slowLoadingTimeOut) {
            clearTimeout(slowLoadingTimeOut)
        }
        // 3秒请求未响应 显示提醒框 显示提醒5s
        slowLoadingTimeOut = setTimeout(() => {
            if (loadingInstance === null) {
                loadingInstance = Message({
                    message: '数据整理中，请稍等…',
                    customClass: 'info-msg',
                    duration: 5000
                })
            }
        }, 3000)
    }
    if (operation.operationName !== 'userLogin' && operation.operationName !== 'resetPassword') {
        operation.setContext({
            headers: {
                authorization: `Bearer ${token || null}`
            }
        })
    }
    return forward(operation)
})

const checkCodeLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
        if (response.data.code === 401 || response.data.code === 403) {
            // TODO
            // 根据状态码处理
            Message('授权失败,请重新登录')
            window.localStorage.removeItem('userTokens')
            setTimeout(() => {
                window.location.href = window.location.origin
            }, 3000)
        }
        setTimeout(() => {
            clearTimeout(slowLoadingTimeOut)
            if (loadingInstance) {
                loadingInstance.close()
                loadingInstance = null
            }
        }, 500)

        return response
    })
})

const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (slowLoadingTimeOut) {
        clearTimeout(slowLoadingTimeOut)
    }
    if (loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
    }
    if (graphQLErrors && graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
        // TODO
        // 这里跳转到登录重新授权
        window.localStorage.removeItem('userTokens')
        Message({
            message: 'token过期,请重新登录',
            customClass: 'info-msg',
            duration: 1500
        })
        setTimeout(() => {
            window.location.href = window.location.origin
        }, 3000)
    }
})

export const link = from([authMiddleware, checkCodeLink, errorLink, httpLink])
