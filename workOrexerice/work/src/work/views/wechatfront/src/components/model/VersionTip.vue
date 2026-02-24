<template>
    <div class="version-tip" :class="msgStyle">
        <div>
            <!-- 全屏显示title,半屏不显示 -->
            <h5>{{title}}</h5>
            {{tipMsg}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        tipMsg: String,
        msgStyle: String
    }
}
</script>

<style lang="less" scoped>
.version-tip {
    background-image: none !important;
    display: flex;
    justify-content: center;
    align-items: center;
    h5 {
        text-align: center;
        padding-bottom: 8px;
        font-size: 14px;
    }
    div {
        color: #fff;
        font-size: 12px;
        width: 64%;
        text-align: left;
    }
}
#app .msg-style {
    color: #9b9b9b;
    div {
        color: #9b9b9b;
        width: 244px !important;
        min-height: 90px;
        margin: 0 auto;
        background: rgba(45, 47, 86, 0.4);
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.34);
        border-radius: 4px;
        padding: 10px 16px;
    }
}
</style>
