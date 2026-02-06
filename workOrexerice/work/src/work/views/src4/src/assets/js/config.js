/**
 * @Author gaoyuanyuan
 * @Date 2019-08-23 10:03:51
 * @Description 环境配置文件
 * @LastEditors: gaoyuanyuan
 * @LastEditTime: 2021-04-30 10:07:05
 */
/**
 * 接口中不应该出现显示等待的
 */
export const noLoading = ['weixinPay', 'query', 'findNewTaskCount']

// 后端服务地址
export const postUrl = process.env.API_HOST

export const apiUrl = postUrl + '/graphql'

// 报告页面地址
export const reportUrl = process.env.REPORT_URL

// 百度统计配置
export const baiduOptions = {
    siteId: process.env.HMT_ID
}

// 微信公众号跳转代理参数vfstate
export const wechatProxy = process.env.WECHAT_PROXY

// 微服务支付页面地址
export const paymentUrl = process.env.PAYMENT_URL

// 是否是单机版
export const isPrivate = process.env.IS_PRIVATE === 'true'

// 平台迁移配置
export const migrationTime = process.env.MIGRATION_TIME
export const migrationUrl = process.env.MIGRATION_URL
export const isTransferDate = process.env.IS_TRANSFER_DATE
export const wellnessHubUrl = process.env.WELLNESSHUB_URL

// 已经对接ai的产品
export const productSn = process.env.PRODUCT_SN