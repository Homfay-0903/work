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
 * @param params 更新参数
 * @returns 无
 */
export function fetchUpdateUserInfo(params: Api.Auth.UpdateUserInfoParams) {
    return request.put<void>({
        url: '/api/v1/user/info',
        data: params,
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
    })
}
