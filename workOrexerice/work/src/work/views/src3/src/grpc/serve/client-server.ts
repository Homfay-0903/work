/*
 * @Description: Client gRPC服务端 - 用于响应Client gRPC客户端的请求或上报
 * @Author: WendyGao
 * @Date: 2022-02-08 11:45:29
 * @LastEditors: WendyGao
 * @LastEditTime: 2022-02-24 16:47:49
 */
import * as grpc from '@grpc/grpc-js'
import { UpdateService, HardwareService, ControlService, AlgorithmService, NetworkService } from '../module/client_grpc_pb'
import { ControlService as ClientControlService } from './services/control-service'
import { UpdateService as ClientUpdateService } from './services/update-service'
import { HardwareService as ClientHardwareService } from './services/hardware-service'
import { AlgorithmService as ClientAlgorithmService } from './services/algorithm-service'
import { NetworkService as ClientNetworkService } from './services/network-service'

export class ClientServer {
    private server: grpc.Server

    constructor(address: string) {
        this.server = new grpc.Server()
        // 添加更新服务
        this.server.addService(ControlService, ClientControlService)
        this.server.addService(UpdateService, ClientUpdateService)
        this.server.addService(AlgorithmService, ClientAlgorithmService)
        this.server.addService(HardwareService, ClientHardwareService)
        this.server.addService(NetworkService, ClientNetworkService)
        // 监听特定端口
        this.server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
            try {
                this.server.start()
                window.logger.info('[client] grpc server started:', address)
            } catch (error) {
                window.logger.error('[client] grpc server error:', error)
            }
        })
    }
}
