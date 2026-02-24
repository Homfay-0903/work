<template>
    <div class="exception-page">
        <exception-page :exception="exception"></exception-page>
    </div>
</template>

<script>
import ExceptionPage from '@/components/exception/Exception'
import image from '@/assets/images/excep_SOS_def.png'

export default {
    components: {
        ExceptionPage
    },
    data() {
        return {
            exception: {
                title: '登录失效',
                desc: '请退出后重新通过公众号入口进入',
                loader: false,
                picture: image
            }
        }
    }
}
</script>
