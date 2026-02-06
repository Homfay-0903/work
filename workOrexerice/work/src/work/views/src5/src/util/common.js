/*
 * @Author: DonWangWQ wangwenqiu@suanier.com
 * @Date: 2023-04-13 18:30:16
 * @LastEditors: liutq
 * @LastEditTime: 2024-06-03 11:11:34
 * @FilePath: \vr-exp-report-frontend\src\util\common.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import moment from 'moment'

const defaultFmt = 'YYYY-MM-DD HH:mm:ss'

/**
 * 格式时间
 *
 * @param {string} date
 * @param {*} [format=defaultFmt]
 */
export const fmtDate = (date, format = defaultFmt) => {
    console.log(moment(date).format(format), 89999)
    return moment(date).format(format)
}
