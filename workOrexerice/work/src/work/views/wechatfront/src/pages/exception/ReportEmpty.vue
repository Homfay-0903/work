<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2021-05-27 09:22:41
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-09-18 10:57:41
-->
<template>
    <div class="exception-page">
        <exception-page :exception="exception"></exception-page>
    </div>
</template>

<script>
import ExceptionPage from '@/components/exception/Exception'
import image from '@/assets/images/excep_blankpage_def.png'
import { isVAPro3, showLogo } from '@/types/device.js'

export default {
    components: {
        ExceptionPage
    },
    data() {
        const deviceName = showLogo() ? ' Visbody' : ''
        return {
            exception: {
                title: '您还没有相关检测报告',
                desc: isVAPro3() ? `找到${deviceName} 3D 智能体测镜，进行一次测量吧!` : `找到${deviceName} 3D 智能体测精灵，进行一次测量吧!`,
                loader: false,
                picture: image
            }
        }
    },
}
</script>
