/*
 * @Description:
 * @Author: fanyunbo
 * @Date: 2022-01-19 15:34:44
 * @LastEditTime: 2025-06-19 11:45:20
 * @LastEditors: liutq
 * @Reference:
 */
// 后端服务地址
export const postUrl = process.env.API_HOST
// AI助手后端地址
export const assistantApiHost = process.env.ASSISTANT_API_HOST

export const apiUrl = postUrl + '/graphql'

// 报告页面地址
export const reportUrl = process.env.REPORT_URL

// 百度统计配置
export const baiduOptions = {
    siteId: process.env.HMT_ID
}

// 身体成分提示文案
export const promptMessage = process.env.PROMPTMESSAGE
// 体围提示文案
export const promptgirthage = process.env.PROMPTGIRTHAGE
// 体态提示文案
export const promptshapeageva = process.env.PROMPTSHAPEAGEVA
export const promptshapeagevr = process.env.PROMPTSHAPEAGEVR

export const algUpData = process.env.ALGUPDATA