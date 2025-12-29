import request from '@/utils/http'

/**
 * 上传文件模块
 *
 * 提供文件上传相关的接口函数
 *
 * @module api/upload
 * @author Art Design Pro Team
 */

/**
 * 上传文件到服务器
 * 接收 multipart/form-data，返回存储路径
 *
 * @param {Api.Common.UploadFileParams} params - 上传文件参数
 * @returns {Promise<Api.Common.UploadFileResponse>} 上传文件响应
 */
export function fetchUploadFile(params: Api.Common.UploadFileParams) {
    const formData = new FormData()
    formData.append('file', params.file)

    const config = {
        url: '/api/v1/common/upload',
        method: 'POST' as const,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: params.onUploadProgress,
    }

    if (params.onUploadProgress) {
        return request.request<Api.Common.UploadFileResponse>(config)
    }

    return request.post<Api.Common.UploadFileResponse>({
        url: config.url,
        data: formData,
        headers: config.headers,
    })
}

/**
 * 上传文件到 AWS S3
 * 接收 multipart/form-data，上传到 AWS S3，返回对象 Key/URL
 *
 * @param {Api.Common.UploadFileParams} params - 上传文件参数
 * @returns {Promise<Api.Common.UploadFileResponse>} 上传文件响应
 */
export function fetchUploadFileToAws(params: Api.Common.UploadFileParams) {
    const formData = new FormData()
    formData.append('file', params.file)

    const config = {
        url: '/api/v1/common/upload/aws',
        method: 'POST' as const,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: params.onUploadProgress,
    }

    if (params.onUploadProgress) {
        return request.request<Api.Common.UploadFileResponse>(config)
    }

    return request.post<Api.Common.UploadFileResponse>({
        url: config.url,
        data: formData,
        headers: config.headers,
    })
}

/**
 * 上传图片文件
 * 使用 AWS S3 上传接口
 *
 * @param {Api.Common.UploadFileParams} params - 上传文件参数
 * @returns {Promise<Api.Common.UploadFileResponse>} 上传文件响应
 */
export function fetchUploadImage(params: Api.Common.UploadFileParams) {
    return fetchUploadFile(params)
}

/**
 * 上传视频文件
 * 使用 AWS S3 上传接口
 *
 * @param {Api.Common.UploadFileParams} params - 上传文件参数
 * @returns {Promise<Api.Common.UploadFileResponse>} 上传文件响应
 */
export function fetchUploadVideo(params: Api.Common.UploadFileParams) {
    return fetchUploadFile(params)
}

/**
 * 获取S3上传临时凭证
 *
 * @returns {Promise<Api.Common.UploadFileToS3Response>} S3上传凭证响应
 */
export function fetchGetS3UploadCredentials() {
    return request.get<Api.Common.UploadFileToS3Response>({
        url: '/api/upload/s3/credentials',
    })
}

/**
 * 上传文件到S3存储
 *
 * @param {Object} params - 上传参数
 * @param {File} params.file - 文件对象
 * @param {Api.Common.UploadFileToS3Response} params.credentials - S3上传凭证
 * @param {string} params.bucket - S3存储桶名称
 * @param {string} params.key - 文件在S3中的键名
 * @returns {Promise<void>} 上传结果
 */
export function fetchUploadToS3(params: {
    file: File
    credentials: Api.Common.UploadFileToS3Response
    bucket: string
    key: string
    onUploadProgress?: (progressEvent: any) => void
}) {
    const formData = new FormData()
    formData.append('key', params.key)
    formData.append('acl', 'public-read')
    formData.append('Content-Type', params.file.type)
    formData.append('AWSAccessKeyId', params.credentials.accessKey)
    formData.append('policy', params.credentials.sessionToken) // 假设sessionToken包含策略信息
    formData.append('x-amz-security-token', params.credentials.sessionToken)
    formData.append('file', params.file)

    return request.request<void>({
        url: `https://${params.bucket}.s3.amazonaws.com/`,
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: params.onUploadProgress,
        showErrorMessage: false, // S3上传错误单独处理
    })
}
