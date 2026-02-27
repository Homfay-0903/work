import fetch from 'unfetch'
import { ApolloLink, from } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { Loading, Message } from 'element-ui'
import { apiUrl, reportUrl } from '@/assets/js/config.js'
let loadingTimer
let dataLink = {
    request: [],
    response: [],
    errRes: []
}
const httpLink = new HttpLink({
    uri: apiUrl,
    fetch: fetch
})

let loadingInstance = null
const authMiddleware = new ApolloLink((operation, forward) => {
    if (operation.operationName !== 'bmBdaPointInfos') {
        dataLink.request.push(operation.operationName)
    }
    if (!loadingInstance) {
        // 加载动画
        loadingInstance = Loading.service({
            background: 'rgba(0, 0, 0, 0)'
        })
    }
    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }
    const url = window.location.search.split('?')[1]
    let pointInfo = {}
    if (url) {
        let urlSearch = url.split('&')
        urlSearch.forEach(el => {
            let key = el.split('=')[0]
            let val = el.substring(el.indexOf('=') + 1)
            pointInfo[key] = val
        })
        if (pointInfo.token) {
            if (operation.operationName !== 'userLogin') {
                operation.setContext({
                    headers: {
                        authorization: `Bearer ${pointInfo.token || null}`
                    }
                })
            }
        } else {
            if (operation.operationName !== 'userLogin') {
                operation.setContext({
                    headers: {
                        authorization: `Bearer ${JSON.parse(window.localStorage.getItem('userToken')).token || null}`
                    }
                })
            }
        }
    }
    return forward(operation)
})

const checkCodeLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
        const operationName = operation.operationName
        const code = response.data[operationName].code
        if (code === 200) {
            if (operationName !== 'bmBdaPointInfos') {
                dataLink.response.push(operationName)
            }
        } else {
            if (operationName !== 'bmBdaPointInfos') {
                dataLink.errRes.push(operation.operationName)
                console.log(`ERROR1: ${operationName}`, code)
                if (code === 401 || code === 403) {
                    // TODO
                    // 根据状态码处理
                    Message('授权失败,请重新登录')
                    setTimeout(() => {
                        window.location.href = reportUrl
                    }, 1000)
                }
            }
        }
        if (loadingTimer) {
            clearTimeout(loadingTimer)
        }
        loadingTimer = setTimeout(() => {
            loadingInstance.close()
            // 忽略打印路由跳转
            if (dataLink.request.indexOf('userLogin') === -1) {
                // 每个接口都有响应且无报错接口
                if (
                    dataLink.request.length === dataLink.response.length &&
                    dataLink.errRes.length === 0 &&
                    dataLink.response.length !== 0
                ) {
                    console.log('DATA_OVER')
                } else {
                    console.log('FAILURE_DATA')
                }
            }
        }, 1000)
        return response
    })
})

const errorLink = onError(({ networkError, graphQLErrors }) => {
    console.log(graphQLErrors)
    loadingInstance.close()
    if (networkError && networkError.code === 302) {
        // TODO
        // 这里跳转到登录重新授权
    }
})

export const link = from([authMiddleware, checkCodeLink, errorLink, httpLink])
