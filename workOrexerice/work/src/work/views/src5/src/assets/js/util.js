// 日期时间格式转换
export function formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return year + '-' + month + '-' + day
}

export function formatTime(date) {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return hour + ':' + minute + ':' + second
}

export const formatDateTime = dataStr => {
    const date = dataStr ? new Date(dataStr) : new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    let i = date.getMinutes()
    let s = date.getSeconds()
    if (m < 10) {
        m = '0' + m
    }
    if (d < 10) {
        d = '0' + d
    }
    if (h < 10) {
        h = '0' + h
    }
    if (i < 10) {
        i = '0' + i
    }
    if (s < 10) {
        s = '0' + s
    }
    const t = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s
    return t
}

export const formatSecond = value => {
    let theTime = value // 秒
    let middle = 0 // 分
    let hour = 0 // 小时

    if (theTime >= 60) {
        middle = parseInt(theTime / 60, 10)
        theTime = parseInt(theTime % 60, 10)
        if (middle >= 60) {
            hour = parseInt(middle / 60, 10)
            middle = parseInt(middle % 60, 10)
        }
    }
    let result = parseInt(theTime, 0) + ' 秒'
    if (middle > 0) {
        result = parseInt(middle, 10) + ' 分 ' + result
    }
    if (hour > 0) {
        result = parseInt(hour, 10) + ' 小时 ' + result
    }
    return result
}

// 数组深拷贝
export function clone(obj) {
    let copy

    // Handle the 3 simple types, and null or undefined
    if (obj === null || 'object' !== typeof obj) return obj

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date()
        copy.setTime(obj.getTime())
        return copy
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = []
        for (let i = 0, len = obj.length; i < len; i += 1) {
            copy[i] = clone(obj[i])
        }
        return copy
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {}
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
        }
        return copy
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.')
}

/**
 * 数据精度处理
 *
 * @export
 * @param {Number} num 要处理的数据
 * @param {Number} digit 精度位数
 * @returns
 */
export function _toDecimal(num, digit) {
    let f = Math.round(num * 100) / 100
    let s = f.toString()
    if (digit !== 0) {
        let rs = s.indexOf('.')
        if (rs < 0) {
            rs = s.length
            s += '.'
        }
        while (s.length <= rs + digit) {
            s += '0'
        }
    } else {
        // 四舍五入
        s = Math.round(num)
    }
    return s
}

/**
 * 删除数组指定元素
 *
 * @export
 * @param {Array} array
 * @param {*} item
 */
export function _arrayRemove(array, item) {
    const index = array.indexOf(item)
    if (index > -1) {
        array.splice(index, 1)
    }
}

/**
 * 数据对比处理
 *
 * @export
 * @param {*} val 本次取值
 * @param {*} oldVal 上次取值
 * @returns
 */
export function _contrastVal(val, oldVal) {
    if (val - oldVal > 0) {
        return `+${(val - oldVal).toFixed(1)}`
    } else if (val - oldVal === 0) {
        return '0.0'
    } else {
        return `${(val - oldVal).toFixed(1)}`
    }
}

/**
 * 驼峰转下划线
 *
 * @export
 * @param {*} key
 * @returns
 */
export function _camelCaseToLine(key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 字符串截取 添加省略号
 *
 * @export
 * @param { String } str 字符串
 * @param { Number } length 截取长度
 * @param { Number } type 截取类型 1 字符 2 字节
 * @returns
 */
export function strFilter(str, length, type = 1) {
    // eslint-disable-next-line no-control-regex
    if (!str) {
        return
    }
    // eslint-disable-next-line no-control-regex
    const regArr = str.match(/[^\x00-\xff]/gi)
    const len = str.length + (regArr === null ? 0 : regArr.length)
    if (len <= length) {
        return str
    } else {
        let strlen = 0
        let s = ''
        for (let i = 0; i < str.length; i++) {
            s = s + str.charAt(i)
            if (str.charCodeAt(i) > 128 && type === 2) {
                strlen = strlen + 2
            } else {
                strlen = strlen + 1
            }

            if (strlen > length) {
                return s.substring(0, s.length - 1) + '...'
            }
        }
        return s
    }
}

/**
 * @description 用户id加密
 * @param {} num 用户id
 * @return {*}
 */
export const getUserId = num => {
    const userId = num.toString()
    const len = userId.length
    let result = userId

    if (len >= 5 && len <= 10) {
        result = userId.substr(0, 2) + getStar(len - 4) + userId.substr(len - 2)
    }

    if (len === 11) {
        result = userId.substr(0, 3) + getStar(len - 7) + userId.substr(len - 4)
    }

    if (len > 11) {
        result = userId.substr(0, 4) + '****' + userId.substr(len - 4)
    }

    return result
}

const getStar = num => {
    let result = ''
    for (let index = 0; index < num; index++) {
        result += '*'
    }
    return result
}
