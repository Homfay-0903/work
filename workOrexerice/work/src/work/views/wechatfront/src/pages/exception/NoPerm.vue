<template>
    <div class="exception-page exception-failure-page">
        <exception-page :exception="exception"></exception-page>
    </div>
</template>

<script>
import ExceptionPage from '@/components/exception/Exception'
import image from '@/assets/images/excep_noperm_def.png'

export default {
    components: {
        ExceptionPage
    },
    data() {
        return {
            exception: {
                title: '权限不足!',
                desc: '请检查管理平台相关配置',
                loader: false,
                picture: image
            }
        }
    }
}
</script>
