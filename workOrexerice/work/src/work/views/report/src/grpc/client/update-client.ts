/*
 * @Author: yangsheng
 * @Date: 2022-02-18 11:57:55
 * @LastEditTime: 2022-07-29 18:45:23
 * @LastEditors: liutq
 * @Description: 更新服务GRPC客户端
 * @FilePath: /vr-3.0-device-client/src/grpc/client/update.client.ts
 */

import * as grpc from '@grpc/grpc-js'
import { _captureException } from '@/util'
import { UpdaterClient } from '../module/update_grpc_pb'
import { CommonReq } from '../module/update_pb'
import { Promisified, promisify } from './promisified-grpc-client'

export class UpdateClient {
    private client: Promisified<UpdaterClient>
    constructor(address: string) {
        // 实例化客户端并转换为promise接口
        this.client = promisify(
            new UpdaterClient(address, grpc.credentials.createInsecure(), {
                interceptors: [this.interceptor]
            })
        )
    }

    // 获取客户端
    public getClient() {
        return this.client
    }

    /**
     * 获取设备更新状态
     *
     * @return {*}
     * @memberof UpdateClient
     */
    public async deviceStatus() {
        const req = new CommonReq()
        const data = await this.client.deviceStatus(req)
        window.logger.info('[update-client]: 获取设备更新状态', req.toObject(), data.toObject())
        return data.toObject()
    }

    /**
     * 开始更新
     *
     * @return {*}
     * @memberof UpdateClient
     */
    public async startUpdateTask() {
        const req = new CommonReq()
        window.logger.info('[update-client]: 开始更新', req.toObject())
        return await this.client.startUpdateTask(req)
    }

    /**
     * 拦截器
     *
     * 请求失败时会尝试3次∂
     * @private
     * @param {*} options
     * @param {*} nextCall
     * @return {*}
     * @memberof HwClient
     *
     */
    private interceptor(options: any, nextCall: any) {
        let savedMetadata: any
        let savedSendMessage: any
        let savedReceiveMessage: any
        let savedMessageNext: any
        // 异常重试次数
        const maxRetries = 3
        const path: string[] = options.method_definition.path.split('/')
        // 获取方法名
        const funName: string = path.length > 0 ? path[path.length - 1] : ''
        const requester = {
            start: (metadata: any, listener: any, next: any) => {
                savedMetadata = metadata
                next(metadata, {
                    onReceiveMessage: (message: any, msgNext: any) => {
                        savedReceiveMessage = message
                        savedMessageNext = msgNext
                        window.logger.debug(`[update-client] ${funName} RES:`, JSON.stringify(message?.toObject()))
                        // msgNext(message)
                    },
                    onReceiveStatus: (status: any, statusNext: any) => {
                        let retries = 0
                        const retry = (message: any, retryMetadata: any) => {
                            retries++
                            // window.logger.debug(`[update-client] ${funName} RES RETRY ${retries}`)
                            const newCall = nextCall(options)
                            newCall.start(retryMetadata, {
                                onReceiveMessage: (retryMsg: any) => {
                                    savedReceiveMessage = retryMsg
                                },
                                onReceiveStatus: (retryStatus: any) => {
                                    if (retryStatus.code !== grpc.status.OK) {
                                        if (retries < maxRetries) {
                                            retry(message, retryMetadata)
                                        } else {
                                            // savedMessageNext(savedReceiveMessage)
                                            // statusNext(retryStatus)
                                            window.logger.error(`[update-client] ${funName} ERROR:`, status)
                                            _captureException(
                                                new Error(`[grpc-error]: ${status.code}: ${status.details}`),
                                                {
                                                    tags: {
                                                        grpcService: 'update',
                                                        grpcFunName: funName
                                                    }
                                                }
                                            )
                                        }
                                    } else {
                                        savedMessageNext(savedReceiveMessage)
                                        statusNext({ code: grpc.status.OK })
                                    }
                                }
                            })
                        }
                        if (status.code !== grpc.status.OK) {
                            retry(savedSendMessage, savedMetadata)
                        } else {
                            savedMessageNext(savedReceiveMessage)
                            statusNext(status)
                        }
                    }
                })
            },
            sendMessage: (message: any, next: any) => {
                savedSendMessage = message
                window.logger.debug(`[update-client] ${funName} REQ:`, JSON.stringify(message?.toObject()))
                next(message)
            },
            cancel: (next: any) => {
                window.logger.debug(`[update-client] ${funName} CANCEL`)
                next()
            }
        }

        return new grpc.InterceptingCall(nextCall(options), requester)
    }
}
