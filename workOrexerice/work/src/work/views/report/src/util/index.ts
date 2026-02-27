/*
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-14 15:52:45
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-24 17:18:38
 */
import path from 'path'
import fs from 'fs'
import router from '@/router'
import logger from '@/config/log'
import * as Sentry from '@sentry/vue'
const { execFile, exec } = require('child_process')
const internetAvailable = require('internet-available')
interface Date {
    Format: (this: Date, fmt: string) => string
}

;(Date.prototype as any).Format = function (fmt: string) {
    //author: meizz
    const o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (const k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return fmt
}
/**
 * 页面跳转
 *
 * @export
 * @param {string} name 页面名
 * @param {{ [x: string]: any }} [query={}] 参数
 */
// export function _changeViewPage(name: string, query: { [x: string]: any } = {}) {
//     router.push({
//         name: name,
//         query
//     })
// }
export function _changeViewPage(
    name: string, 
    queryOrOptions?: { [x: string]: any } | { query?: { [x: string]: any }, params?: { [x: string]: any } }
): void {
    let query: { [x: string]: any } = {};
    let params: { [x: string]: any } = {};
    
    if (queryOrOptions) {
        // 检查是否是新格式的参数
        if ('query' in queryOrOptions || 'params' in queryOrOptions) {
            // 新格式: { query: {}, params: {} }
            query = queryOrOptions.query || {};
            params = queryOrOptions.params || {};
        } else {
            // 旧格式: 直接传递 query 对象
            query = queryOrOptions;
        }
    }
    
    router.push({
        name: name,
        query,
        params
    });
}

/**
 * 补零
 *
 * @export
 * @param {(string | number)} num
 * @return {*}
 */
export function _addZero(num: string | number) {
    const int = typeof num === 'string' ? parseInt(num) : num
    if (int < 10) {
        num = '0' + num
    }
    return num
}

// 判断是否为数组
const isArr = (origin: any): boolean => {
    const str = '[object Array]'
    return Object.prototype.toString.call(origin) == str ? true : false
}

// 深拷贝对象
export function _deepClone<T>(origin: T, target?: Record<string, any> | T): T {
    const tar = target || {}

    for (const key in origin) {
        if (Object.prototype.hasOwnProperty.call(origin, key)) {
            if (typeof origin[key] === 'object' && typeof origin[key] !== null) {
                tar[key] = isArr(origin[key]) ? [] : {}
                _deepClone(origin[key], tar[key])
            } else {
                tar[key] = origin[key]
            }
        }
    }

    return tar as T
}

/**
 * 深度合并对象
 *
 * @export
 * @param {{ [x: string]: any }} FirstOBJ
 * @param {{ [x: string]: any }} SecondOBJ
 * @return {*}
 */
export function _deepObjectMerge(FirstOBJ: { [x: string]: any }, SecondOBJ: { [x: string]: any }) {
    for (const key in SecondOBJ) {
        FirstOBJ[key] =
            FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
                ? _deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
                : (FirstOBJ[key] = SecondOBJ[key])
    }
    return FirstOBJ
}

/**
 *
 * @param {*} domain 要检测的域名
 */
export function _getNetworkState(domain: string, callback: Function) {
    return new Promise((ok, no) => {
        internetAvailable({
            domainName: domain,
            host: '114.114.114.114'
        })
            .then(() => {
                window.logger.info('Internet available')
                callback && callback(true)
            })
            .catch(() => {
                window.logger.info('No internet')
                callback && callback(false)
            })
    })
}

export function _checkPing(domain: any) {
    return new Promise((ok, no) => {
        exec('ping -c 3 -i 1 -W 3 ' + domain, (error: any, stdout: any, stderr: any) => {
            if (error) {
                no(error)
            }
            if (stdout) {
                ok(stdout)
            }
        })
    })
}

export function _checkDomainAddr(domain: any) {
    return new Promise((ok, no) => {
        exec('dig ' + domain, (error: any, stdout: any) => {
            if (error) {
                no(error)
            }
            if (stdout) {
                ok(stdout)
            }
        })
    })
}

export function _clientCpu() {
    exec('bash ' + path.resolve('.') + '/client_cpu.sh', (error: any, stdout: any, stderr: any) => {
        if (error) {
            window.logger.error('_client_cpu', error)
        }
        if (stdout) {
            window.logger.info('_client_cpu', stdout)
        }
    })
}

export function _checkNetwork(domain: any) {
    execFile(path.resolve('.') + '/bash/check_network.sh', [domain], (error: any, stdout: any, stderr: any) => {
        if (error) {
            window.logger.error('_checkNetwork', error)
        }
        if (stdout) {
            window.logger.info('_checkNetwork', stdout)
        }
    })
}

export function _checkPort(domain: any, port: any) {
    return new Promise((ok, no) => {
        execFile(path.resolve('.') + '/bash/check_port.sh', [domain, port], (error: any, stdout: any, stderr: any) => {
            if (error) {
                no(error)
            }
            if (stdout) {
                ok(stdout)
            }
        })
    })
}
export function _openAaTool() {
    exec('cd /home/visbodyfit/production && ./production.sh', (error: any, stdout: any, stderr: any) => {
        if (error) {
            window.logger.error('_openAaTool', error)
        }
        if (stdout) {
            window.logger.info('_openAaTool', stdout)
        }
    })
}

/**
 * 业务打点
 *
 * @export
 * @param {object} message 打点信息
 */
export function _dotMsg(message: object) {
    logger.dot.info(message)
    Sentry.captureMessage(JSON.stringify(message))
}

/**
 * 异常上报
 *
 * @export
 * @param {Error} err 异常信息
 * @param {object} [tags={}] 自定义标签，方便后期搜索
 */
export function _captureException(err: Error, tags: object = {}) {
    Sentry.captureException(err, tags)
}

/**
 * @description 校验时区
 * 脚本功能 1. 校验timeZone是否有效
 *         2. 校验timeZone是否与本地一致
 * @param {*} timeZone
 */
export function _checkTimeZone(timeZone: any) {
    return new Promise((ok, no) => {
        exec('ls -l /etc/localtime  | grep ' + timeZone + ' | wc -l', (error: any, stdout: any) => {
            if (error) {
                window.logger.info('_checkTimeZone error:', error)
                ok(false)
            } else {
                const localRest = parseInt(stdout)
                window.logger.info(
                    '_checkTimeZone:',
                    localRest,
                    localRest ? '设置时区与本地一致,不做处理' : '设置时区与本地不一致，检测时区有效性'
                )
                if (localRest === 0) {
                    exec('ls -l /usr/share/zoneinfo/' + timeZone + ' | wc -l', (error: any, stdout: any) => {
                        if (error) {
                            window.logger.info('_checkTimeZone error:', error)
                            ok(false)
                        } else {
                            const checkRest = parseInt(stdout)
                            window.logger.info(
                                '_checkTimeZone:',
                                checkRest,
                                checkRest ? '时区有效,主动更改时区' : '时区无效,不做处理'
                            )
                            ok(checkRest)
                        }
                    })
                } else {
                    ok(false)
                }
            }
        })
    })
}

/**
 * 转换时区
 *
 * @param {string}
 * @returns
 */
export function _changeTimeZone() {
    const newDate = new Date(), // 创建一个时间对象
        offset = 0 - newDate.getTimezoneOffset() / 60
    let offsetZone = 0,
        UTC = 'UTC',
        minute = '00'
    console.log(offset)
    if (offset.toString().split('.')[0]) {
        offsetZone = Number(offset.toString().split('.')[0])
        if (offsetZone > 0 && offsetZone < 10) {
            offsetZone = Number('0' + offsetZone)
        }
        if (offsetZone > -10 && offsetZone < 0) {
            offsetZone = Number('-0' + Math.abs(offsetZone))
        }
    }
    if (offset.toString().split('.')[1]) {
        minute = String(Number('0.' + offset.toString().split('.')[1]) * 60)
    }
    if (Number(offset) > 0) {
        UTC = UTC + '+'
    }
    return UTC + offsetZone + ':' + minute
}

/**
 * @description 获取本地时区
 */
export function _getTimeZone() {
    return new Promise((ok, no) => {
        exec('ls -l /etc/localtime', (error: any, stdout: any) => {
            if (error) {
                window.logger.info('_getTimeZone error:', error)
                ok('')
            } else {
                window.logger.info('_getTimeZone stdout:', stdout)
                const timeZoneStr = stdout.trim()
                if (timeZoneStr) {
                    const timeZone = timeZoneStr.substring(timeZoneStr.indexOf('/usr/share/zoneinfo/') + 20)
                    ok(timeZone)
                } else {
                    ok('')
                }
            }
        })
    })
}
export function camelCaseToLine(arg: any): any {
    if (typeof arg !== 'object') return arg
    const newObj = {}
    for (const key in arg) {
        // eslint-disable-next-line no-useless-escape
        const lineKey = key.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
        // eslint-disable-next-line no-prototype-builtins
        if (arg.hasOwnProperty(key)) {
            const element = arg[key]
            newObj[lineKey] = camelCaseToLine(element)
        } else {
            newObj[lineKey] = undefined
        }
    }
    return newObj
}

export function readRamFile(): any {
    return new Promise((resolve, reject) => {
        fs.readFile('/' + 'tmpRAM/raw.txt', 'utf-8', (err) => {
            if (err) {
                window.logger.info('读取文件失败')
                resolve(false)
            } else {
                window.logger.info('读取文件成功')
                resolve(true)
            }
        })
    })
}

/**
 * @description 创建ram 和 rom 目录
 *
 */

export function createFile(): any {
    return new Promise((resolve, reject) => {
        fs.access(path.resolve('.') + '/' + 'Row.txt', (err: any) => {
            if (err) {
                fs.appendFileSync(path.resolve('.') + '/' + 'Row.txt', '{"type":1}', 'utf-8')
                resolve(false)
            } else {
                resolve(true)
            }
        })
        try {
            fs.exists('tmpRAM', (exi) => {
                if (!exi) fs.mkdir(path.join('/', 'tmpRAM'), () => {})

                readRamFile().then((res: any) => {
                    if (!res) {
                        exec('bash ' + path.resolve('.') + '/create_file.sh', (err: any) => {
                            if (err) {
                                window.logger.info('mount 命令挂载失败')
                                // fs.writeFile('/tmpRAM/' + 'raw.txt', '1', function name(params: any) {
                                //     console.log(params)
                                // })
                            } else {
                                window.logger.info('mount 系统文件挂载成功')

                            }
                        })
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
    })
}

export function readFile(): any {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve('.') + '/' + 'Row.txt', 'utf-8', (err) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}
/**
 *
 * 删除文件目录
 *
 */

export function deleteFile(): any {
    fs.unlink(path.resolve('.') + '/' + 'Row.txt', (err) => {
        if (err) {
            return window.logger.info('删除.txt失败')
        } else {
            return window.logger.info('删除.txt成功')
        }
    })
    fs.rmdir('/' + 'tmpRAM/raw.txt', (err) => {
        if (err) {
            return window.logger.info('删除文件失败')
        } else {
            return window.logger.info('删除文件成功')
        }
    })
}
