/*
 * @Description: 用户本地设置 - 持久化存储
 * @Author: WendyGao
 * @Date: 2022-02-08 16:19:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-23 21:11:37
 */

import fs from 'fs'
import path from 'path'
import appConfig from './index'
interface IObjectKey {
    [key: string]: any
}
// 如果没有设置存储路径则放在应用根目录下
const configPath =
    appConfig.USER_CONFIG_PATH && appConfig.USER_CONFIG_PATH !== '' ? appConfig.USER_CONFIG_PATH : appConfig.LOCAL_PATH

interface ICommon {
    isInit: boolean
    config: IObjectKey
    configUrl: string
}

const common: ICommon = {
    isInit: false,
    config: {},
    configUrl: path.join(configPath, './user.config.json')
}

/**
 * @description 读取配置文件
 * @return {*}
 */
function readConfig() {
    try {
        const result = fs.readFileSync(common.configUrl)
        const data = Buffer.from(result).toString()
        return data
    } catch (error) {
        return false
    }
}

/**
 * @description 初始化config
 * @return {*}
 */
function initConfig() {
    try {
        common.isInit = true
        const config = readConfig()
        if (config) {
            common.config = JSON.parse(config)
            return true
        }
        const defaultConfig = {}
        const content = JSON.stringify(defaultConfig)
        fs.writeFileSync(common.configUrl, content)
        common.config = defaultConfig
        return true
    } catch (e) {
        return false
    }
}

/**
 * @description 判断配置文件是否存在
 * @return {*}
 */
function isExit() {
    let success = true
    if (!common.isInit) {
        success = initConfig()
    }
    return success
}

/**
 * @description 写入文件
 * @param {object} value
 * @return {*}
 */
function writeConfig(value: object) {
    try {
        const content = JSON.stringify(value)
        fs.writeFileSync(common.configUrl, content)
        return true
    } catch (e) {
        return false
    }
}

// 用户本地配置
const localConfig = {
    setStoragePath: (configUrl: string) => {
        common.configUrl = configUrl
    },
    getStoragePath: () => {
        return common.configUrl
    },
    getItem: (key: string) => {
        const success = isExit()
        if (success) {
            const result = common.config[key]
            return result || result === 0 ? result : ''
        }
        return null
    },
    setItem: (key: string, value: string | number | boolean | any) => {
        const success = isExit()
        if (success) {
            const config = Object.assign({}, common.config)
            config[key] = value
            const suc = writeConfig(config)
            if (suc) {
                common.config = config
                return true
            }
        }
        return false
    },
    getAll: () => {
        const success = isExit()
        if (success) {
            return common.config
        }
        return null
    },
    removeItem: (key: string) => {
        const value = localConfig.getItem(key)
        if (value) {
            const config = Object.assign({}, common.config)
            delete config[key]
            const suc = writeConfig(config)
            if (suc) {
                common.config = config
                return true
            }
        }
        return false
    },
    clear: () => {
        const success = isExit()
        if (success) {
            const suc = writeConfig({})
            if (suc) {
                common.config = {}
                return true
            }
        }
        return false
    }
}
export default localConfig
