<template>
    <div class="exception-page exception-failure-page">
        <exception-page :exception="exception" @reLoad="reLoad"></exception-page>
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
                title: '模型加载失败!',
                desc: '请',
                loader: true,
                picture: image
            }
        }
    },
    methods: {
        reLoad() {
            window.console.log('重新加载')
        }
    }
}
</script>
