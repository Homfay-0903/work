/*
 * @Description: 应用日志配置文件
 * @Author: WendyGao
 * @Date: 2022-02-08 15:02:54
 * @LastEditors: WendyGao
 * @LastEditTime: 2022-04-14 10:02:55
 */
import log4js from 'log4js'
import CONFIG from '@/config/index'

// 本地调试环境，控制台打印日志
const appender = process.env.NODE_ENV === 'development' ? ['production', 'stdout'] : ['production']

log4js.configure({
    appenders: {
        production: {
            type: 'dateFile', // 日志输出类型,dateFile表示输出到文件
            filename: 'logs/client.log', // 输出到文件的文件路径，注意，是路径而不是文件名！
            alwaysIncludePattern: true, // 日志文件是否展示预设的模式
            keepFileExt: true, // 日志文件是否始终保持后缀
            daysToKeep: CONFIG.LOG.KEEP_DAYS || 30 // 日志保存时间，默认值为0，表示一直保存
        },
        stdout: {
            type: 'console' // 控制台输出
        }
    },
    categories: {
        default: {
            appenders: appender, // 日志输出类别
            level: CONFIG.LOG.LEVEL || 'debug'
        },
        dot: {
            appenders: appender, // 日志输出类别
            level: CONFIG.LOG.LEVEL || 'debug'
        }
    }
})

const common = log4js.getLogger()
const dot = log4js.getLogger('dot')

export default {
    common,
    dot
}
