// 日期时间格式转换
export function formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return year + '-' + month + '-' + day
}

export function formatIosDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return year + '/' + month + '/' + day
}

export function formatTime(date) {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')
    return hour + ':' + minute + ':' + second
}
// 计算姓名字符长度
export function GetLength(str) {
    let len = 0
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
            len += 2
        } else {
            len++
        }
    }
    return len
}
/**
 * 日期时间格式转换
 *
 * @export
 * @param { String } str 字符串日期 格式 YYYY-MM-DD
 * @returns
 */
export function changeFormat(str) {
    const days = str.split('-')
    return `${days[0]}年${days[1]}月${days[2]}日`
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
// 重复的日期格式转化
export function repeatDate(srt) {
    const resArr = /年/
    return resArr.test(srt)
}
// 补充方法

export function getLocalTime(date, targetTimeZone) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: targetTimeZone
    }
    return new Intl.DateTimeFormat('zh-CN', options)
        .format(new Date(date))
        .replace(/\//g, '-')
}

export function getStar (length) {
    console.log(length)
    switch (length) {
        case 1:
            return '*'
        case 2:
            return '**'
        case 3:
            return '***'
        case 4:
            return '****'
        default:
            return '****'
    }
}

