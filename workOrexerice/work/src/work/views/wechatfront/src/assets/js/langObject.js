/*
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2021-10-29 14:00:35
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-07-06 17:54:10
 */

import cn from '@/assets/js/lang/zh-CN'

// 语言文件
export const langPattern = {
    'zh-CN': cn,
}

// 当前语言包
export function getCurrentLang() {
    let lang = window.localStorage.getItem('lang')
    console.log(`浏览器语言${navigator.language || navigator.userLanguage}`)
    // 当前语言文件
    let langObj = langPattern[lang] || cn
    langObj.lang = 'zh-CN'
    return langObj
}

export const languageConfig = [
    {
        label: 'English',
        value: 'en-US',
        no: '+1',
    },
    {
        label: '日本語',
        value: 'ja-JP',
        no: '+81',
    },
    {
        label: '中文',
        value: 'zh-CN',
        no: '+86',
    },
    {
        label: 'Español',
        value: 'es-ES',
        no: '+34',
    },
    {
        label: 'Italiano',
        value: 'it-IT',
        no: '+39',
    },
]
