/*
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-14 15:29:42
 * @LastEditors: liutq
 * @LastEditTime: 2024-09-04 09:59:48
 */

export type ReturnGetters<T extends { [key: string]: (...args: any) => any }> = {
    [P in keyof T]: ReturnType<T[P]>
}

// 设备异常
export interface IDeviceError {
    id: number
    // 异常描述
    name: string
    // 异常码 产品输出
    title: string
    childModule: number
    // 能否重启解决
    canRestart: boolean
    // 是否影响体成分测量
    affectBm: boolean
    // 是否影响体态测量
    affectBs: boolean
    // 是否影响肩部测量
    affectShd: boolean
    // 是否影响手势功能
    affectGt: boolean
    // 是否影响体重测量
    affectWe: boolean
}
// 打印列表
export interface IPrintItem extends IMeasureInfo {
    phoneNum: string
    statusCode: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    requestPrint: boolean
    isPrinting: boolean
    reprintTime?: number
    printWait: number
    showInIndex: boolean
    // 格式化后的日期
    fmtScanDate: string
    // 格式化后的测量时间
    fmtScanTime: string
    status: string
}

// 测量信息
export interface IMeasureInfo {
    // 扫描id
    scanId: string
    // 扫描时间：第一次选择测量项目时间
    scanTime: number
    // 启动方式 1 按键启动 2 站台启动 3 地垫站人启动
    startMode: number
    // 加入打印队列时是否自动打印 0 手动 1 自动
    printType: number
    // 未测量项目 2，3, 4，1  体态，体围，肩部， 体重
    unScanItems: number[]
    // 调查状态
    nutritionStatus: number
    handleStatus: number
    userInfo: {
        isNewUser: boolean
        phoneNum: string
    }
    weight: {
        // 是否进入了测量页面
        isMeasurement: boolean
        // 测量状态 true 成功
        status: boolean
        // 体重数据
        weight: number
        // 是否已经测量
        isMeasured: boolean
        // 合成状态 -1合成中 0 失败 1成功
        composeStatus: number
    }
    mass: {
        // 是否进入了测量页面
        isMeasurement: boolean
        // 测量状态 true 成功
        status: boolean
        // 是否已经测量
        isMeasured: boolean
        // 合成状态 -1合成中 0 失败 1成功
        composeStatus: number
    }
    shape: {
        // 是否进入了测量页面
        isMeasurement: boolean
        // 测量状态 true 成功
        status: boolean
        // 是否已经测量
        isMeasured: boolean
        // 合成状态 -1合成中 0 失败 1成功
        composeStatus: number
    }
    girth: {
        // 是否进入了测量页面
        isMeasurement: boolean
        // 测量状态 true 成功
        status: boolean
        // 是否已经测量
        isMeasured: boolean
        // 合成状态 -1合成中 0 失败 1成功
        composeStatus: number
    }
    // 脊柱测量信息
    spine: {
        // 是否进入了测量页面
        isMeasurement: boolean
        // 测量状态 true 成功
        status: boolean
        // 是否已经测量
        isMeasured: boolean
        // 合成状态 -1合成中 0 失败 1成功
        composeStatus: number
    }
    shoulder: {
        // 是否进入了测量页面
        isMeasurement: boolean
        // 测量状态 true 成功
        status: boolean
        // 已测量项目数量
        active: number
        // 是否已经测量
        isMeasured: boolean
        // 合成状态 -1 合成中 0 失败 1成功 - 肩部无合成状态测量成功即成功
        composeStatus: number
    }
    // 增加时区
    utc: ''
    // 服务器返回的测量时间
    createTime: ''
    // 设备模式
    deviceMode: 2,
    // vApro5下测了无电流
    isMeasureWu: false,
    // vApro5下测了身体围度测量
    isMeasureWd: false,
    nutrition: number,
    recordReport: any,
    height: number
}

export interface IDeviceInfo {
    // 设备ID
    deviceId: string
    // 设备音量
    volume: number
    // mac地址，后台推送
    mac: string
    // 是否向状态服务注册成功
    registered: boolean
    // 网络是否连接正常 - 与状态通知服务通信情况
    isNetConnect: boolean
    // 第三方对接类型 0: 无对接, 1: APP对接, 2: 手环对接, 3: 手环+APP对接
    thirdBindType: number
    // 设备状态 0 正常 1 不可用（上次回滚失败）2 上次更新成功 3 上次更新失败
    status: number
    // 是否允许系统关机 用于区分更新息屏和关机息屏
    canShutDown: boolean
    // 是否需要重新自检 用于区分普通网络异常和自检网络异常 网络恢复后是否需要重新自检
    reSelfCheck: boolean
    // 设备续费状态 1 未到期正常使用 2 临近到期且在7天内 3 已到期且未超过7天 4 到期且在7天以上
    renewalStatus: number
    // 设备云服务费过期时间
    expirationTime: string
}

export interface INetSpeedInfo {
    // 上传测速信息
    upLoadNetSpeed: {
        status: number
        netSpeed: number
        subTime: number
        state: boolean
    }
    // 下载测速信息
    downLoadNetSpeed: {
        status: number
        netSpeed: number
        subTime: number
    }
    // 外网连接状态 - 设置中手动检测
    networkState: boolean
    // 网速情况 1： 快，2：慢，3：特别慢
    speedStatus: number
}

export interface ISettingInfo {
    // 设置列表页下标 高亮的设置项 用于从子设置页面返回到设置首页
    menuType: number
    // 打印模式 0 关闭打印 1 自动打印 2 手动打印
    printMode: number
    // 设置项 子菜单高亮下标
    childActive: number
    // 手势识别状态 0 关闭 1 开启
    gestureState: number
    // 报告绑定方式 1 序列号 2 二维码
    reportbindType: number
}

export interface IUpdateInfo {
    // 是否有版本更新
    hasNewVer: boolean
    // 更新状态 0 更新中 1 更新完成 2 更新成功
    updStatus: number
    // 服务更新完成个数
    updNumber: number
    // 回滚状态 0 回滚中/更新失败 1 回滚完成/成功 2 回滚失败
    rollBackStatus: number
    // 是否为强制更新
    force: boolean
    // 更新版本号
    version: string
    // 更新内容
    content: string
    // 更新的服务个数
    services: number
}

export type IExternal = {
    // 打印机状态 1 未就绪 2 已就绪 3 打印中
    printer: number
    // usb插入
    usb: boolean
    // 触屏状态
    touch: boolean
}
