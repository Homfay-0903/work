// 日期时间格式转换
export function formatDate(date, space = '') {
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

    if (space === '') {
        return month + '月' + day + '日'
    } else {
        return month + space + day
    }
}

export function formatMinutes(date, space = '/') {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    return year + space + month + space + day + '   ' + hour + ':' + minutes
}

export function formatTime(date, space = '.') {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return year + space + month + space + day
}

export function formatDay(date) {
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return day
}

export function formatMonth(date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return month + '/' + day
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
    throw new Error("Unable to copy obj! Its type isn't supported.")
}

// 获取文件url
export function getObjectURL(file) {
    let url = null
    // eslint-disable-next-line no-undefined
    if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file)
        // eslint-disable-next-line no-undefined
    } else if (window.URL !== undefined) {
        // mozila(firefox)
        url = window.URL.createObjectURL(file)
        // eslint-disable-next-line no-undefined
    } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
    }
    return url
}

// 手机号中间四位隐藏
export function hiddenPhone(val) {
    let str = null
    str = `${val.substr(0, 3)}****${val.substr(7)}`
    return str
}

/* x: 有效数字
 *  y: 保留位数
 */
export function toDecimal2(x, y) {
    let f = Math.round(x * 100) / 100
    let s = f.toString()
    let rs = s.indexOf('.')
    if (rs < 0) {
        rs = s.length
        s += '.'
    }
    while (s.length <= rs + y) {
        s += '0'
    }
    return s
}

// 实现将项目的图片转化成base64
export function convertImgToBase64(url, callback, outputFormat) {
    let canvas = document.createElement('CANVAS')
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function() {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        let dataURL = canvas.toDataURL(outputFormat || 'image/png')
        callback.call(this, dataURL)
        canvas = null
    }
    img.src = url
}

/**
 * 通过访问域名获取产品类型
 * @param {*} origin 访问域名
 * @returns 产品类型
 */
export function getProductTypeByOrigin(origin) {
    let type = 'apro5'
    if (origin.includes('rpro3')) {
        type = 'rpro3'
    } else if (origin.includes('rpro5')) {
        type = 'rpro5'
    } else if (origin.includes('e335')) {
        type = 'e335'
    } else if (origin.includes('apro3')) {
        type = 'apro3'
    } else if (origin.includes('apro5')) {
        type = 'apro5'
    } else if (origin.includes('apro6')) {
        type = 'apro6'
    } else if (origin.includes('apro7')) {
        type = 'apro7'
    } else if (origin.includes('192.168.0.232')) {
        type = 'valite6'
    } else if (origin.includes('valite6')) {
        type = 'valite6'
    }
    return type
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
    let f = Math.round(num * Math.pow(10, digit)) / Math.pow(10, digit)
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

export function isWeiXin() {
    let ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') !== -1) {
        return true
    }
    console.log('不在微信浏览器中')
    return false
}

export function isIos() {
    console.log(`判断是否是iOS：  ${/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)} -----${navigator.userAgent}`)
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
}

//  提取字符串中的域名
export function getDomainFromString(url) {
    // 使用正则表达式匹配域名
    const domainPattern = /((?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-z]{2,})|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(:\d+)?/g
    const domains = url.match(domainPattern)
    if (domains && domains.length > 0) {
        if (isIPv4Address(domains[0])) {
            return `http://${domains[0]}`
        }
        return domains[0]
    }
    return ''
}

export function isIPv4Address(str) {
    // IPv4地址的正则表达式
    const ipv4Pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)):(\d+)$/

    return ipv4Pattern.test(str)
}

/**
 * 打印日志函数
 * @param {String} File 日志所在文件名
 * @param {String} Name 日志名称或标记
 * @param {String} Msg 日志信息
 */
export function debugLog(File, Name, Msg) {
    let logContent = JSON.stringify({ File, Name, Msg, time: Date().toString() })
    let oldLogStr = window.sessionStorage.getItem('debugLog') || ''
    let newLogStr = `${oldLogStr}\n【${logContent}】`
    window.sessionStorage.setItem('debugLog', newLogStr)
}
