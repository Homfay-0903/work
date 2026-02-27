/*
 * @Description:
 * @Author: fanyunbo
 * @Date: 2022-09-22 13:40:06
 * @LastEditTime: 2024-01-11 16:22:13
 * @LastEditors: ouyaping
 * @Reference:
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import CONFIG from '@/config/index'
import localConfig from '@/config/local'

// 引入各个语言配置文件
import messages from './langs'

Vue.use(VueI18n)
// 创建vue-i18n实例i18n
const i18n = new VueI18n({
    // 设置默认语言
    // 上一次选择的多语言-->config配置文件中的配置-->默认中文
    locale: localConfig.getItem('_vf_i18n').replace(/"/g, '') || CONFIG.REGIONAL || 'zh', // 语言标识
    // 添加多语言（每一个语言标示对应一个语言文件）
    messages
})
export { i18n }
