/*
 * @Description: 应用配置文件
 * @Author: WendyGao
 * @Date: 2022-02-08 16:19:59
 * @LastEditors: Wendy Gao
 * @LastEditTime: 2022-07-25 17:46:55
 */
const proObj = JSON.parse(JSON.stringify(process))
const config = JSON.parse(proObj.env.APP_CONFIG)

export default {
    // 从config.json 里读取的配置项
    ...config
}
