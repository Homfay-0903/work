/*
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-06-25 11:55:25
 * @LastEditors: ouyaping
 * @LastEditTime: 2025-09-25 18:17:34
 * @FilePath: \vr-pro3-cms-frontend\src\types\device.js
 * @Description:
 */
import store from '@/store'
export function isVAPro3() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === 'M5'
}
export function isVAPro5() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === 'M6' || userInfo.deviceId.slice(0, 2) === 'M2' || userInfo.deviceId.slice(0, 2) === 'N2'
}
export function isVAPro6() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === 'M3' || userInfo.deviceId.slice(0, 2) === 'N3'
}
export function isVALit6() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === 'M9' || userInfo.deviceId.slice(0, 2) === 'N9'
}
export function isVAPro7() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === 'M7' || userInfo.deviceId.slice(0, 2) === 'N7'
}
// 是否具有游客模式 目前vrpRO5 vrPRO3 ve335 arm ve260
export function isTouristModule() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    const allowedPrefixes = ['36', '34', '38', 'M5', 'M6', 'M2', 'M3', 'M7', '51', '50', '52', '54', 'N2', 'N3', 'N7', 'M9', 'N9']
    const prefix = (userInfo.deviceId || '').slice(0, 2)
    return allowedPrefixes.includes(prefix)
}

export function isVRPro3() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === '32' || userInfo.deviceId.slice(0, 2) === '34'
}

export function isVRPro5() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === '36'
}

export function isVRPro5ARM() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === '50' || userInfo.deviceId.slice(0, 2) === '52' || userInfo.deviceId.slice(0, 2) === '54' || userInfo.deviceId.slice(0, 2) === 'M3'
}
export function isVE335() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === '38' || userInfo.deviceId.slice(0, 2) === '39'
}

export function isVE260() {
    let userInfo = store.state.userInfo
    if (userInfo === null) {
        return false
    }
    return userInfo.deviceId.slice(0, 2) === '51'
}
