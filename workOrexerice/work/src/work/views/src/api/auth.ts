import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
    return request.post<Api.Auth.LoginResponse>({
        url: '/api/v1/auth/login',
        params,
        showErrorMessage: false, // 禁用自动错误提示，由登录页面手动处理
        skipAuth: true, // 登录接口不需要携带认证头
    })
}

/**
 * 注册
 * @param params 注册参数
 * @returns 登录响应（注册后直接登录）
 */
export function fetchRegister(params: Api.Auth.RegisterParams) {
    return request.post<Api.Auth.LoginResponse>({
        url: '/api/v1/auth/register',
        data: params,
        skipAuth: true, // 注册接口不需要携带认证头
    })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
    return request.get<Api.Auth.UserInfo>({
        url: '/api/v1/user/info',
    })
}

/**
 * 更新用户信息
 * @param body 更新参数
 * @returns 无
 */
export function fetchUpdateUserInfo(body: Api.Auth.UpdateUserInfoParams) {
    return request.put<void>({
        url: '/api/v1/user',
        data: body,
    })
}

/**
 * 修改密码
 * @param params 密码参数
 * @returns 无
 */
export function fetchChangePassword(params: Api.Auth.ChangePasswordParams) {
    return request.put<void>({
        url: '/api/v1/user/reset-password',
        data: params,
        showErrorMessage: false, // 禁用自动错误提示，由调用页面手动处理
        skipAuth: true, // 修改密码接口不需要携带认证头
    })
}

/**
 * 刷新访问令牌
 * @param params 刷新参数
 * @returns 刷新响应
 */
export function fetchRefreshToken(params: Api.Auth.RefreshTokenParams) {
    return request.post<Api.Auth.RefreshTokenResponse>({
        url: '/api/v1/auth/refresh-token',
        data: params ?? {},
        showErrorMessage: false, // 禁用自动错误提示，由调用页面手动处理
        skipAuth: true, // 跳过自动添加认证头
    })
}

/**
 * 获取第三方授权登录地址
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchSocialOAuth(params: Api.Auth.SocialOAuthParams) {
    return request.get<Api.Auth.SocialOAuthResponse>({
        url: `/api/v1/oauth/${params.provider}`,
        data: params,
        showErrorMessage: false, // 禁用自动错误提示，由调用页面手动处理
        skipAuth: true, // OAuth接口不需要携带认证头
    })
}

/**
 * 处理第三方授权登录回调
 * @param params 回调参数
 * @returns 登录响应
 */
export function fetchSocialOAuthCallback(params: Api.Auth.SocialOAuthCallbackParams) {
    return request.get<Api.Auth.LoginResponse>({
        url: `/api/v1/oauth/${params.provider}/callback`,
        data: params,
        showErrorMessage: false, // 禁用自动错误提示，由调用页面手动处理
        skipAuth: true, // OAuth回调接口不需要携带认证头
    })
}
