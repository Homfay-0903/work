import * as dd from 'dingtalk-jsapi'

/**
 * 检测是否在钉钉环境中
 * @returns 是否在钉钉环境
 */
export function isInDingTalk(): boolean {
    return /dingtalk/i.test(navigator.userAgent)
}

/**
 * 从 URL 参数中获取钉钉 authCode
 * @returns authCode 或 null
 */
export function getDingTalkAuthCodeFromURL(): string | null {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('authCode') || urlParams.get('code') || null
}

/**
 * 通过钉钉 JSAPI 获取 authCode
 * @param corpId 企业 ID
 * @returns authCode
 */
export function getDingTalkAuthCodeFromJSAPI(corpId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        dd.ready(() => {
            dd.runtime.permission.requestAuthCode({
                corpId,
                onSuccess: (result: any) => {
                    resolve(result.code)
                },
                onFail: (err: any) => {
                    reject(err)
                },
            })
        })
        dd.error((err: any) => {
            reject(err)
        })
    })
}

/**
 * 获取钉钉 authCode
 * 优先从 URL 参数获取，如果不存在则通过 JSAPI 获取
 * @param corpId 企业 ID
 * @returns authCode 或 null
 */
export async function getDingTalkAuthCode(corpId?: string): Promise<string | null> {
    // 1. 优先从 URL 参数获取
    const authCodeFromURL = getDingTalkAuthCodeFromURL()
    if (authCodeFromURL) {
        return authCodeFromURL
    }

    // 2. 如果没有提供 corpId，无法通过 JSAPI 获取
    if (!corpId) {
        console.warn('[DingTalk] 未提供 corpId，无法通过 JSAPI 获取 authCode')
        return null
    }

    // 3. 通过 JSAPI 获取
    try {
        const authCode = await getDingTalkAuthCodeFromJSAPI(corpId)
        return authCode
    } catch (error) {
        console.error('[DingTalk] 通过 JSAPI 获取 authCode 失败:', error)
        return null
    }
}

/**
 * 清理 URL 中的钉钉 authCode 参数
 */
export function clearDingTalkAuthCodeFromURL(): void {
    const url = new URL(window.location.href)
    url.searchParams.delete('authCode')
    url.searchParams.delete('code')
    window.history.replaceState({}, '', url.toString())
}
