<template>
    <div class="exception-page">
        <exception-page :exception="exception"></exception-page>
    </div>
</template>

<script>
import ExceptionPage from '@/components/exception/Exception'
import image from '@/assets/images/excep_binding_def.png'

export default {
    components: {
        ExceptionPage
    },
    data() {
        return {
            exception: {
                title: '',
                desc: '好像有人捷足先登扫码了呢，请重新测量吧！',
                loader: false,
                picture: image
            }
        }
    }
}
</script>
