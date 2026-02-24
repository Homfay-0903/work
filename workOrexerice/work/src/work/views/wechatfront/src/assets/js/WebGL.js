/**
 *
 * 判断是否支持webgl,
 * 如果不支持，判断微信版本，
 * 微信版本低于6.5.2，提醒微信版本低，
 * 否则提醒系统版本低
 */

let isSupportWebgl = {}
isSupportWebgl.tipMsg = '抱歉，您的手机系统不支持查看模型功能！'
isSupportWebgl.title = '系统版本低'

function isWebgl() {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl && gl instanceof WebGLRenderingContext) {
        isSupportWebgl.webgl = true
    } else {
        isSupportWebgl.webgl = false
        const wechatInfo = navigator.userAgent.match(/MicroMessenger\\([\\d\\.]+)/i)
        if (wechatInfo[1] < '6.5.2') {
            isSupportWebgl.tipMsg = '抱歉，您的微信版本低，不支持查看模型功能，请升级您的微信版本！'
            isSupportWebgl.title = '微信版本低'
        } else {
            isSupportWebgl.tipMsg = '抱歉，您的手机系统不支持查看模型功能！'
            isSupportWebgl.title = '系统版本低'
        }
    }
}
isWebgl()

export default isSupportWebgl
