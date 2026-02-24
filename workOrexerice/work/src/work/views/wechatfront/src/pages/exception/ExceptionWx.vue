<template>
    <div class="exception-page exception-failure-page">
        <exception-page :exception="exception"></exception-page>
    </div>
</template>

<script>
import ExceptionPage from '@/components/exception/Exception'
import image from '@/assets/images/excep_failedtoload_def.png'

export default {
    components: {
        ExceptionPage
    },
    data() {
        return {
            exception: {
                title: '请在微信公众号打开!',
                desc: '',
                loader: false,
                picture: image
            }
        }
    }
}
</script>
