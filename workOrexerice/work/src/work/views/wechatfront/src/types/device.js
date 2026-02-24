/*
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-06-26 15:23:21
 * @LastEditors: ouyaping
 * @LastEditTime: 2025-02-18 21:41:20
 * @FilePath: \vr-pro3-wechat-frontend\src\types\device.js
 * @Description:
 */
export function isVAPro3() {
    let productType = window.localStorage.getItem('productType') || null
    if (productType === null) {
        return false
    }
    return productType === 'apro3'
}
export function isVAPro5() {
    let productType = window.localStorage.getItem('productType') || null
    if (productType === null) {
        return false
    }
    return productType === 'apro5'
}
export function isVAPro6() {
    let productType = window.localStorage.getItem('productType') || null
    if (productType === null) {
        return false
    }
    return productType === 'apro6'
}
export function isVAlite6() {
    let productType = window.localStorage.getItem('productType') || null
    console.log('productType------------', productType)
    if (productType === null) {
        return false
    }
    return productType === 'valite6'
}
export function isVAPro7() {
    let productType = window.localStorage.getItem('productType') || null
    if (productType === null) {
        return false
    }
    return productType === 'apro7'
}
export function isVRPro5() {
    let productType = window.localStorage.getItem('productType') || null
    if (productType === null) {
        return false
    }
    return productType === 'rpro5'
}
export function showLogo() {
    let logoCloudEnable = window.localStorage.getItem('logoCloudEnable') || '1'
    return logoCloudEnable === '1'
}
