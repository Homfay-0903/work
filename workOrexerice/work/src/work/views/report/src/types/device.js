/*
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-06-26 11:12:11
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2024-12-17 16:30:13
 * @FilePath: \vr-pro3-report-frontend\src\types\device.js
 * @Description:
 */

export function isVAPro3(scanId) {
    return scanId.slice(0, 2) === 'M5'
}

export function isVAPro5(scanId) {
    return scanId.slice(0, 2) === 'M6' || scanId.slice(0, 2) === 'M2' || scanId.slice(0, 2) === 'N2'
}

export function isVAPro6(scanId) {
    return scanId.slice(0, 2) === 'M3' || scanId.slice(0, 2) === 'N3'
}
export function isVALite6(scanId) {
    return scanId.slice(0, 2) === 'M9' || scanId.slice(0, 2) === 'N9'
}
export function isVAPro7(scanId) {
    return scanId.slice(0, 2) === 'M7' || scanId.slice(0, 2) === 'N7'
}
export function isVRPro3(scanId) {
    return scanId.slice(0, 2) === '32' || scanId.slice(0, 2) === '34'
}

export function isVRPro5(scanId) {
    return scanId.slice(0, 2) === '36'
}

export function isVRPro5ARM(scanId) {
    return scanId.slice(0, 2) === '50' || scanId.slice(0, 2) === '52' || scanId.slice(0, 2) === '54'
}
export function isVE335(scanId) {
    return scanId.slice(0, 2) === '38' || scanId.slice(0, 2) === '39'
}
