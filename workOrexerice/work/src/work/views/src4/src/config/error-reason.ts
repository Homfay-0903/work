/*
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-17 14:07:32
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-17 23:04:11
 */
import { i18n } from '../i18n'

// 算法异常
const algError = [
    {
        id: 1,
        name: '环境光照',
        title: '设备周边光线弱',
        errorTxt: '',
        childModule: 3,
        canRestart: true,
        affectBm: false,
        affectBs: false,
        affectGt: false,
        affectShd: false,
        affectWe: false
    },
    {
        id: 2,
        name: '彩色相机异常',
        title: '0008',
        errorTxt: '',
        childModule: 3,
        canRestart: true,
        affectBm: false,
        affectBs: false,
        affectGt: true,
        affectShd: false,
        affectWe: false
    },
    {
        id: 3,
        name: '深度相机硬件异常',
        errorTxt: '相机异常',
        title: '0005',
        childModule: 3,
        canRestart: true,
        affectBm: false,
        affectBs: true,
        // 单相机 影响手势
        affectGt: true,
        affectShd: true,
        affectWe: false
    },
    {
        id: 4,
        name: '深度相机同步线异常',
        errorTxt: '相机异常，请重启设备，错误代码',
        title: '0004',
        childModule: 3,
        canRestart: false,
        affectBm: false,
        affectBs: true,
        affectGt: true,
        affectShd: true,
        affectWe: false
    }
]

// 硬件异常
const hwError = [
    {
        id: 5,
        name: '体重模块通讯异常',
        errorTxt: '体成分项目异常，请重启设备，错误代码',
        title: '0002',
        childModule: 3,
        canRestart: true,
        affectBm: true,
        affectBs: false,
        affectGt: false,
        affectShd: false,
        affectWe: true
    },
    {
        id: 6,
        name: '体脂模块通讯异常',
        errorTxt: '体成分项目异常，',
        title: '0003',
        childModule: 3,
        canRestart: true,
        affectBm: true,
        affectBs: false,
        affectGt: false,
        affectShd: false,
        affectWe: false
    },
    {
        id: 7,
        name: '核心控制模块异常',
        errorTxt: '体成分项目异常',
        title: '0001',
        childModule: 3,
        canRestart: true,
        affectBm: true,
        affectBs: false,
        affectGt: false,
        affectShd: false,
        affectWe: false
    },
    {
        id: 8,
        name: '转台未连接',
        errorTxt: '未检测到转台，请重新插拔连接线',
        title: '0006-3',
        childModule: 3,
        canRestart: false,
        affectBm: true,
        affectBs: true,
        affectGt: false,
        affectShd: false,
        affectWe: true
    },
    {
        id: 9,
        name: '触摸模块异常',
        errorTxt: '',
        title: '触摸模块异常',
        childModule: 3,
        canRestart: false,
        affectBm: false,
        affectBs: false,
        affectGt: false,
        affectShd: false,
        affectWe: false
    },
    {
        id: 10,
        name: '转台模块异常',
        errorTxt: '',
        title: '0012',
        childModule: 3,
        canRestart: false,
        affectBm: true,
        affectBs: true,
        affectGt: false,
        affectShd: false,
        affectWe: true
    }
]

// 云端异常
const cloudError = [
    {
        id: 11,
        name: '数据库异常',
        errorTxt: '',
        title: '0009',
        childModule: 2,
        canRestart: true,
        affectBm: true,
        affectBs: true,
        affectGt: true,
        affectShd: true,
        affectWe: true
    },
    {
        id: 12,
        name: '设备ID冲突',
        errorTxt: '',
        title: '0010',
        childModule: 2,
        canRestart: true,
        affectBm: true,
        affectBs: true,
        affectGt: true,
        affectShd: true,
        affectWe: true
    },
    {
        id: 13,
        name: '网络异常',
        errorTxt: '',
        title: '网络异常',
        childModule: 1,
        canRestart: true,
        affectBm: true,
        affectBs: true,
        affectGt: true,
        affectShd: true,
        affectWe: true
    }
]

// 体成分测量失败
let massFault = [
    {
        id: 1,
        name: '体成分项目异常',
        errorTxt: '核心控制模块异常',
        title: '0001',
        canRestart: false,
        canRescan: false
    },
    {
        id: 2,
        name: '体重模块通讯异常',
        errorTxt: '体成分项目异常',
        title: '0002',
        canRestart: false,
        canRescan: false
    },
    {
        id: 3,
        name: '体重模块测量异常',
        errorTxt: '体成分项目异常',
        title: i18n.t('common.error.scan-err-desc[3]'),
        canRestart: false,
        canRescan: true
    },
    {
        id: 4,
        name: '体脂模块通讯异常',
        errorTxt: '体成分项目异常',
        title: '0003',
        canRestart: false,
        canRescan: false
    },
    {
        id: 5,
        name: '体脂模块测量异常',
        errorTxt: '体成分项目异常',
        title: i18n.t('common.error.scan-err-desc[3]'),
        canRestart: false,
        canRescan: true
    },
    {
        id: 6,
        name: '人离开',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[0]'),
        canRestart: false,
        canRescan: true
    },
    {
        id: 7,
        name: '超时',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[2]'),
        canRestart: false,
        canRescan: true
    }
]

// 体态失败
// 体围是体态的子项目所以共用失败码
let shapeFault = [
    {
        id: 1,
        name: '启动超时(引导页30秒内未检测成功)',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[4]'),
        childModule: 3,
        canRestart: false,
        canRescan: true
    },
    {
        id: 2,
        name: '人离开转台',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[0]'),
        childModule: 3,
        canRestart: false,
        canRescan: true
    },
    {
        id: 3,
        name: '测量超时(引导语音结束后15秒内未测量成功)',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[2]'),
        childModule: 3,
        canRestart: false,
        canRescan: true
    }
]

// 肩部测量失败
let shdFault = [
    {
        id: 1,
        name: '人离开地垫',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[0]'),
        childModule: 3,
        canRestart: false,
        canRescan: true
    },
    {
        id: 2,
        name: '启动超时',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[1]'),
        childModule: 3,
        canRestart: false,
        canRescan: true
    },
    {
        id: 3,
        name: '测量超时',
        errorTxt: '',
        title: i18n.t('common.error.scan-err-desc[2]'),
        childModule: 3,
        canRestart: false,
        canRescan: true
    }
]
function /* A function that takes a parameter `type` and then reassigns the values of `massFault`,
`shapeFault`, and `shdFault` to the same values as before. */
changeThis(type: any) {
    ;(massFault = [
        {
            id: 1,
            name: '核心控制模块异常',
            errorTxt: '体成分项目异常，请重启设备，错误代码{',
            title: '0001',
            canRestart: false,
            canRescan: false
        },
        {
            id: 2,
            name: '体重模块通讯异常',
            errorTxt: '体成分项目异常，请重启设备，错误代码',
            title: '0002-1',
            canRestart: false,
            canRescan: false
        },
        {
            id: 3,
            name: '体重模块测量异常',
            errorTxt: '体重模块测量异常，请重新测量，错误代码',
            title: type.$t('common.error.scan-err-desc[3]'),
            canRestart: false,
            canRescan: true
        },
        {
            id: 4,
            name: '体脂模块通讯异常',
            errorTxt: '体成分项目异常，请重启设备，错误代码',
            title: '0003',
            canRestart: false,
            canRescan: false
        },
        {
            id: 5,
            name: '体脂模块测量异常',
            errorTxt: '体脂测量异常，请重启设备，错误代码',
            title: type.$t('common.error.scan-err-desc[3]'),
            canRestart: false,
            canRescan: true
        },
        {
            id: 6,
            name: '人离开',
            errorTxt: '',
            title: type.$t('common.error.scan-err-desc[0]'),
            canRestart: false,
            canRescan: true
        },
        {
            id: 7,
            name: '超时',
            errorTxt: '',
            title: type.$t('common.error.scan-err-desc[2]'),
            canRestart: false,
            canRescan: true
        }
    ]),
        (shapeFault = [
            {
                id: 1,
                name: '启动超时(引导页30秒内未检测成功)',
                errorTxt: '',
                title: type.$t('common.error.scan-err-desc[4]'),
                childModule: 3,
                canRestart: false,
                canRescan: true
            },
            {
                id: 2,
                name: '人离开转台',
                errorTxt: '',
                title: type.$t('common.error.scan-err-desc[0]'),
                childModule: 3,
                canRestart: false,
                canRescan: true
            },
            {
                id: 3,
                name: '测量超时(引导语音结束后15秒内未测量成功)',
                errorTxt: '',
                title: type.$t('common.error.scan-err-desc[2]'),
                childModule: 3,
                canRestart: false,
                canRescan: true
            }
        ]),
        (shdFault = [
            {
                id: 1,
                name: '人离开地垫',
                errorTxt: '',
                title: type.$t('common.error.scan-err-desc[0]'),
                childModule: 3,
                canRestart: false,
                canRescan: true
            },
            {
                id: 2,
                name: '启动超时',
                errorTxt: '',
                title: type.$t('common.error.scan-err-desc[1]'),
                childModule: 3,
                canRestart: false,
                canRescan: true
            },
            {
                id: 3,
                name: '测量超时',
                errorTxt: '',
                title: type.$t('common.error.scan-err-desc[2]'),
                childModule: 3,
                canRestart: false,
                canRescan: true
            }
        ])
}

export { algError, hwError, cloudError, massFault, shapeFault, shdFault, changeThis }
