import store from '@/store'
import { camelCaseToLine } from '@/util'
import { EventBus } from '@/util/event-bus'

enum EventType {
    //websocket消息类型
    SCAN_INFO = 'scan_info', // 合成通知
    USER_INFO = 'user_info', // 身份检录信息
    HEART_BEAT = 'heartbeat', // 心跳
    RECEIVE = 'receive' // 回复
}

export default class SocketService {
    /**
     * 单例
     */
    static instance: SocketService
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }

    // 和服务端连接的socket对象
    ws: WebSocket | undefined

    url: string = ''

    // 存储回调函数
    callBackMapping: ((...args: any) => void) | undefined

    // 标识是否连接成功
    connected = false

    // 记录重试的次数
    sendRetryCount = 0

    // 重新连接尝试的次数
    connectRetryCount = 0

    reconnectTimer: NodeJS.Timeout | undefined = undefined //断线重连时间器
    waitingTimer: NodeJS.Timeout | undefined = undefined // 超时等待时间器
    heartTimer: NodeJS.Timeout | undefined = undefined // 心跳时间器
    webSocketState = false //socket状态 true为已连接

    // 心跳配置
    heartBeatConfig = {
        //time：心跳时间间隔 timeout：心跳超时间隔 reconnect：断线重连时间，一般的，断线重连时间等于心跳时间间隔加断线重连时间（忽略超时等待）
        time: 5 * 1000,
        timeout: 3 * 1000,
        reconnect: 5 * 1000
    }

    //  定义连接服务器的方法
    connect(url: string) {
        // 连接服务器
        if (!window.WebSocket) {
            return window.logger.info('您的浏览器不支持WebSocket')
        }
        this.ws = new WebSocket(url)
        this.url = url
        // 连接成功的事件
        this.ws.onopen = () => {
            window.logger.info('连接服务端成功')
            EventBus.$emit('EventAction', 'netWorktStatus', { online: true })

            this.connected = true
            // 重置重新连接的次数
            this.connectRetryCount = 0
            store.dispatch('changeStatusClient', true)
            store.commit('CHANGE_DEVICE_INFO', {
                isNetConnect: true
            })
            this.webSocketState = true
            // 开启心跳机制
            this.startHeartBeat(this.heartBeatConfig.time)
        }
        //   // 1.连接服务端失败
        //   // 2.当连接成功之后, 服务器关闭的情况(连接失败重连)
        this.ws.onerror = () => {
            window.logger.info('连接服务端失败')
            this.connected = false
            this.connectRetryCount++
            this.reconnectWebSocket()
            if (this.connectRetryCount > 1) {
                store.dispatch('changeStatusClient', false)
                store.commit('CHANGE_DEVICE_INFO', {
                    isNetConnect: false
                })
            }
        }
        // 得到服务端发送过来的数据
        this.ws.onmessage = (msg) => {
            const res = camelCaseToLine(JSON.parse(msg.data))
            if (res.event !== EventType.HEART_BEAT) window.logger.info('从服务端获取到了数据' + msg.data)
            switch (res.event) {
                case EventType.SCAN_INFO:
                    window.logger.info('触发合成数据上报事件' + JSON.stringify(res.data))
                    // 触发合成数据上报事件
                    EventBus.$emit('EventAction', 'NotifyTaskStatus', res.data)
                    store.dispatch('changeTaskStatus', res.data)
                    if (res.key) {
                        this.sendStatusService(res.key)
                    }
                    break

                case EventType.USER_INFO:
                    window.logger.info('触发身份检录上报事件' + res.data)
                    // 触发身份检录上报事件
                    EventBus.$emit('EventAction', 'IdentityCheck', res.data)
                    break

                case EventType.HEART_BEAT:
                    this.webSocketState = true
                    break

                default:
                    break
            }
            // if (this.callBackMapping) {
            //     this.callBackMapping.call(this, msg.data)
            // }
        }
    }
    // 回调数据给服务
    sendStatusService(key: any) {
        if (key) {
            const obj = { event: EventType.RECEIVE, data: key }
            this.ws?.send(JSON.stringify(obj))
        }
    }
    // 回调函数的注册
    registerCallBack(callBack: (...args: any) => void) {
        window.logger.info('回调函数的注册', callBack)
        this.callBackMapping = callBack
    }

    // 取消某一个回调函数
    unRegisterCallBack(callBack: () => void) {
        window.logger.info('取消某一个回调函数', callBack)
        this.callBackMapping = undefined
    }

    // 发送数据的方法
    send(data: any) {
        // 判断此时此刻有没有连接成功
        if (this.connected) {
            this.sendRetryCount = 0
            // this.ws?.send(data)
            this.ws?.send(JSON.stringify(data))
            if (data.event !== EventType.HEART_BEAT) window.logger.info('发送数据' + JSON.stringify(data))
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.send(data)
            }, this.sendRetryCount * 500)
        }
    }

    /*
     * 心跳初始函数
     * @param time：心跳时间间隔
     */
    startHeartBeat(time: number) {
        this.heartTimer = setTimeout(() => {
            this.send({
                event: EventType.HEART_BEAT,
                data: 'ping'
            })
            this.waitingTimer = this.waitingServer()
        }, time)
    }

    //延时等待服务端响应，通过webSocketState判断是否连线成功
    waitingServer() {
        this.webSocketState = false
        return setTimeout(() => {
            if (this.webSocketState) return this.startHeartBeat(this.heartBeatConfig.time)
            window.logger.info('心跳无响应，已断线，等待重连')
            this.reconnectTimer = this.reconnectWebSocket()
        }, this.heartBeatConfig.timeout)
    }

    //重连操作
    reconnectWebSocket() {
        // 关闭前一个连接
        this.clear()
        return setTimeout(() => {
            this.connect(this.url)
        }, this.heartBeatConfig.reconnect)
    }
    // 清除所有定时器
    clearTimer() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
        if (this.heartTimer) clearTimeout(this.heartTimer)
        if (this.waitingTimer) clearTimeout(this.waitingTimer)
    }
    // 关闭连接
    clear(isReconnect = false) {
        this.connected = isReconnect
        this.clearTimer()
        this.ws?.close()
        this.ws = undefined
    }
}
