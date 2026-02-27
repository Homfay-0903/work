/*
 * @Description: 工具类，用户把client接口转换成promise
 * @Author: yangsheng
 * @Date: 2022-02-17 13:49:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-11 15:28:52
 */

import { Client, ServiceError, Metadata, CallOptions, ClientUnaryCall } from '@grpc/grpc-js'
import { Message } from 'google-protobuf'

// 原始异步回调接口类型
type OriginalCall<T, U> = (
    request: T,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (err: ServiceError | null, value?: U) => void
) => ClientUnaryCall

// promise接口类型
type PromisifiedCall<T, U> = (request: T, metadata?: Metadata, options?: Partial<CallOptions>) => Promise<U>

export type Promisified<C> = { $: C } & {
    [prop in Exclude<keyof C, keyof Client>]: C[prop] extends OriginalCall<infer T, infer U>
        ? PromisifiedCall<T, U>
        : never
}

export function promisify<C extends Client>(client: C): Promisified<C> {
    return new Proxy(client, {
        get: (target, descriptor) => {
            const originalFunction = target[descriptor]
            if (descriptor === '$') {
                return target
            } else if (originalFunction.responseStream) {
                return target
            }

            return (...args: any[]) =>
                new Promise((resolve, reject) =>
                    target[descriptor](
                        ...[...args, (err: ServiceError, res: Message) => (err ? reject(err) : resolve(res))]
                    )
                )
        }
    }) as unknown as Promisified<C>
}
