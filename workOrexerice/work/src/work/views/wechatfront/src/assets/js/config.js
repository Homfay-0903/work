/**
 * @author gaoyuanyuan
 * @since  2019-08-20 11:11:20
 * @description  后端地址配置文件
 * @lastEditor  gaoyuanyuan
 * @lastEditTime  2019-09-18 18:00:23
 */
// 读取环境变量
export const ENV = process.env.RUNTIME_ENV
// 后端服务地址
export const postUrl = process.env.API_HOST

export const apiUrl = postUrl + '/graphql'

// 百度统计配置
export const baiduOptions = {
    siteId: process.env.HMT_ID
}

// 上传静态文件路径
export const upyunUrl = process.env.UPLOAD_URL

// 维塑公众号id
export const appId = 'wxad26ae1d5bd54e89'

export const qrcodeImg =
    ['development', 'dev', 'test'].indexOf(ENV) > -1
        ? require('@/assets/images/qrcode_for_gh_322a8987a12c_344.jpg')
        : require('@/assets/images/qrcode.jpg')

// 身体成分规则说明
export const promptMessage = process.env.PROMPTMESSAGE
// 体态分数说明
export const postureMsg = process.env.POSTURE_MSG

// 上报地址，SENTRY_DSN 如果不存在则不上报
export const dsn = process.env.SENTRY_DSN
// 版本号 SENTRY_RELEASE
export const release = process.env.SENTRY_RELEASE
// 版本号 version
export const version = process.env.VERSION

export const homepageUrl =
    ['development', 'dev', 'test'].indexOf(ENV) > -1
        ? 'http://public.visbody.com/wechat-homepage-test'
        : 'http://public.visbody.com/wechat-homepage1'
