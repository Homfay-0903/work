import axios from 'axios'
import { getProjectEnable } from '@/http/status-server-api'
import { alertWarning, deviceOperationLog } from '@/http/wellness-hub-api'

/**
 * @description 获取设备的公网IP地址和国家信息（调用两个第三方API并打印日志）
 * @returns {Promise<{ip: string, countryCode1: string, countryCode2: string}>} 返回IP地址和两个API的国家代码
 */
export async function _getIpAndCountry(): Promise<{ ip: string; countryCode1: string; countryCode2: string }> {
    let ip = ''
    let countryCode1 = ''
    let countryCode2 = ''
    let api1Success = false // 标记第一个API是否成功获取到IP
    let api2Success = false // 标记第二个API是否成功获取到IP

    // API 1: ip-api.com (无需注册)
    try {
        window.logger.info('========== 开始调用 ip-api.com API ==========')
        const response1 = await axios.get('http://ip-api.com/json/', {
            params: {
                fields: 'status,message,country,countryCode,query,city,timezone'
            },
            timeout: 5000
        })
        window.logger.info('ip-api.com API调用成功')
        window.logger.info('ip-api.com 完整响应数据:', JSON.stringify(response1.data, null, 2))
        if (response1.data && response1.data.status === 'success') {
            ip = response1.data.query || ''
            countryCode1 = (response1.data.countryCode || '').toUpperCase()
            if (ip) {
                api1Success = true
            }
        }
    } catch (error: any) {
        window.logger.error('ip-api.com API调用失败:', error.message || error)
        // API请求失败时，将countryCode设置为'-'，表示API可能出问题
        countryCode1 = '-'
    }

    // API 2: ipinfo.io (免费，无需注册，公开端点)
    try {
        window.logger.info('========== 开始调用 ipinfo.io API ==========')
        const response2 = await axios.get('https://ipinfo.io/json', {
            timeout: 5000
        })
        window.logger.info('ipinfo.io API调用成功')
        window.logger.info('ipinfo.io 完整响应数据:', JSON.stringify(response2.data, null, 2))
        if (response2.data && response2.data.ip) {
            // 如果第一个API没有获取到IP，使用第二个API的IP
            if (!ip) {
                ip = response2.data.ip || ''
            }
            countryCode2 = (response2.data.country || '').toUpperCase()
            if (response2.data.ip) {
                api2Success = true
            }
        }
    } catch (error: any) {
        window.logger.error('ipinfo.io API调用失败:', error.message || error)
        // API请求失败时，将countryCode设置为'-'，表示API可能出问题
        countryCode2 = '-'
    }
    
    // 如果两个API都失败了，将IP设置为'-'
    if (!api1Success && !api2Success) {
        ip = '-'
        window.logger.warn('两个IP检测API都失败了，IP设置为"-"')
    }
    
    window.logger.info('========== IP地理位置检测API调用完成 ==========')
    window.logger.info(`获取到的IP: ${ip}, 国家代码: ip-api.com=${countryCode1}, ipinfo.io=${countryCode2}`)
    
    return {
        ip,
        countryCode1,
        countryCode2
    }
}

/**
 * @description IP检测功能：检测设备IP地理位置并与销售国家列表对比
 * @param {string} deviceId - 设备ID
 * @param {any} [projectEnableData] - 可选的已获取的projectEnable接口结果，避免重复调用
 * @returns {Promise<void>}
 */
export async function _checkDeviceIp(deviceId: string, projectEnableData?: any): Promise<void> {
    window.logger.info('========== 开始执行IP地理位置检测 ==========')
    try {
        // 1. 调用两个第三方API获取IP地址和国家代码
        const { ip, countryCode1, countryCode2 } = await _getIpAndCountry()

        // 1.5. 调用设备操作日志接口（在获取IP后立即调用）
        // 如果两个API返回的国家代码一样，就传一个；否则传两个
        // 如果某个API失败，countryCode会是'-'，依然会传递
        try {
            const ipCountryArray: string[] = []
            // 如果countryCode1存在（包括'-'的情况），添加到数组
            if (countryCode1) {
                ipCountryArray.push(countryCode1)
            }
            // 如果第二个国家代码存在且与第一个不同，才添加
            // 这样如果两个都是'-'，只会添加一个
            if (countryCode2 && countryCode2 !== countryCode1) {
                ipCountryArray.push(countryCode2)
            }
            
            // 即使IP是'-'也会调用日志接口（表示两个API都失败了）
            // 如果两个API都失败了，至少传一个'-'
            const finalIpCountry = ipCountryArray.length > 0 ? ipCountryArray : ['-']
            const finalIp = ip || '-'
            window.logger.info('开始调用设备操作日志接口...', { ip: finalIp, ip_country: finalIpCountry })
            await deviceOperationLog({
                device_sn: deviceId,
                operation_type: '设备开机',
                ip: finalIp,
                ip_country: finalIpCountry
            })
            window.logger.info('设备操作日志接口调用成功')
        } catch (logError: any) {
            window.logger.error('设备操作日志接口调用失败:', logError && logError.message ? logError.message : logError)
            // 日志接口调用失败不影响后续流程，继续执行
        }

        // 2. 获取shipment_countries（使用已保存的接口结果，避免重复调用）
        const projectEnableRes = projectEnableData || (await getProjectEnable({ device_id: deviceId }))
        window.logger.info('getProjectEnable接口响应:', projectEnableRes)

        if (projectEnableRes.code === 0 && projectEnableRes.data && projectEnableRes.data.shipment_countries) {
            // 3. 解析shipment_countries（JSON字符串转数组）
            let shipmentCountries: string[] = []
            try {
                const shipmentCountriesStr = projectEnableRes.data.shipment_countries
                if (typeof shipmentCountriesStr === 'string') {
                    shipmentCountries = JSON.parse(shipmentCountriesStr)
                } else if (Array.isArray(shipmentCountriesStr)) {
                    shipmentCountries = shipmentCountriesStr
                }
                // 转换为大写以便比较
                shipmentCountries = shipmentCountries.map((code: string) => code.toUpperCase())
                window.logger.info('解析后的shipment_countries:', shipmentCountries)
            } catch (parseError) {
                window.logger.error('解析shipment_countries失败:', parseError)
                return
            }

            // 如果shipment_countries为空，则不进行判断，也不调用警告接口
            if (!shipmentCountries || shipmentCountries.length === 0) {
                window.logger.info('shipment_countries为空，跳过IP国家检测判断')
                return
            }

            // 4. 判断两个国家代码是否在shipment_countries数组中
            const countryCode1InList = countryCode1 && shipmentCountries.includes(countryCode1)
            const countryCode2InList = countryCode2 && shipmentCountries.includes(countryCode2)

            window.logger.info(
                `国家代码判断: ${countryCode1} 在列表中=${countryCode1InList}, ${countryCode2} 在列表中=${countryCode2InList}`
            )

            // 5. 如果某个不在列表中，进行进一步判断并调用预警接口
            if (!countryCode1InList || !countryCode2InList) {
                // 收集IP检测到的国家代码（去重）
                const ipCountries: string[] = []
                if (countryCode1) ipCountries.push(countryCode1)
                if (countryCode2 && countryCode2 !== countryCode1) ipCountries.push(countryCode2)
                
                // 调用预警接口
                if (ip && ipCountries.length > 0 && shipmentCountries.length > 0) {
                    try {
                        window.logger.info('开始调用IP国家不匹配预警接口...')
                        const alertRes = await alertWarning({
                            device_sn: deviceId,
                            ip: ip,
                            ip_country: ipCountries,
                            sales_country: shipmentCountries
                        })
                        window.logger.info('IP国家不匹配预警接口调用成功:', alertRes)
                    } catch (alertError: any) {
                        window.logger.error('IP国家不匹配预警接口调用失败:', alertError && alertError.message ? alertError.message : alertError)
                    }
                } else {
                    window.logger.warn('无法调用预警接口：缺少IP地址、IP国家代码或销售国家代码。')
                }
            } else {
                window.logger.info('两个API返回的国家代码都在shipment_countries列表中')
            }
        } else {
            window.logger.warn('getProjectEnable接口返回数据异常，无法进行国家代码判断')
        }
    } catch (error: any) {
        window.logger.error('IP检测异常:', error && error.message ? error.message : error)
    }
    window.logger.info('========== IP地理位置检测结束 ==========')
}