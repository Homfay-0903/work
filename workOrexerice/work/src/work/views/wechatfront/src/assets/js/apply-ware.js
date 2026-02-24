/*
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-07-17 13:57:05
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2024-09-13 17:08:27
 * @FilePath: \vr-pro3-wechat-frontend\src\assets\js\apply-ware.js
 * @Description:
 */
import fetch from 'unfetch'
import { ApolloLink, from } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { apiUrl } from '@/assets/js/config.js'

const httpLink = new HttpLink({
    uri: apiUrl,
    fetch: fetch
})

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    if (
        operation.operationName !== 'memberLogin' &&
        operation.operationName !== 'appLogin' &&
        operation.operationName !== 'memberTestLogin'
    ) {
        operation.setContext({
            headers: {
                authorization: `bearer ${JSON.parse(window.localStorage.getItem('loginInfo')).token || null}`,
                productType: window.localStorage.getItem('productType')
            }
        })
    }
    return forward(operation)
})

const checkCodeLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
        if (response.data.code === 401) {
            // TODO
            // 根据状态码处理
            window.location.href = '/exception/login'
            window.localStorage.removeItem('modelInfo')
            window.localStorage.removeItem('loginInfo')
        }
        return response
    })
})

const errorLink = onError(({ networkError, graphQLErrors }) => {
    console.log(graphQLErrors)
    if (graphQLErrors && graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
        // TODO
        // 这里跳转到登录重新授权
        window.location.href = '/exception/login'
        window.localStorage.removeItem('modelInfo')
        window.localStorage.removeItem('loginInfo')
    }
})

export const link = from([authMiddleware, checkCodeLink, errorLink, httpLink])
