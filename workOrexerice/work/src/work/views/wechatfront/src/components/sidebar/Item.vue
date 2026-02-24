<template>
    <!-- 08侧边栏的单条数据模板 -->
    <router-link class="side-list-model" :to="link" @click.native="click(feat)">
        <span :class="`side-list-li ` + icon">
            <slot name="haveUnread"></slot>
        </span>
        {{feat}}
    </router-link>
</template>

<script type="text/ecmascript-6">
export default {
    props: [
        'icon',
        'feat',
        'link' // 跳转链接
    ],
    data() {
        return {}
    },
    methods: {
        click(name) {
            this.$emit('router-link-click', name)
        }
    }
}
</script>

<style scoped lang="less">
.side-list-model {
    display: block;
    text-decoration: none;
    color: #222;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.side-list-li {
    display: inline-block;
    width: 16px;
    height: 23px;
    margin-right: 12px;
    vertical-align: middle;
    margin-top: -2px;
}
.side-send-report {
    background: url(../../assets/images/sidebar/leftbar_SendReport_icon.png) no-repeat center center;
    background-size: 16px 16px;
}
.side-collect-report {
    background: url(../../assets/images/sidebar/leftbar_CheckReport_icon.png) no-repeat center center;
    background-size: 16px 16px;
}
.side-model-management {
    background: url(../../assets/images/sidebar/leftbar_Model_icon.png) no-repeat center center;
    background-size: 16px 16px;
}
.side-problem-feedback {
    background: url(../../assets/images/sidebar/leftbar_customerFeedback_icon.png) no-repeat center center;
    background-size: 16px 16px;
}
.side-help-content {
    background: url(../../assets/images/sidebar/leftbar_PersonalCenter_icon.png) no-repeat center center;
    background-size: 16px 16px;
}
.side-about-our {
    background: url(../../assets/images/sidebar/leftbar_abut_icon.png) no-repeat center center;
    background-size: 16px 16px;
}

.side-help-brain {
    background: url(../../assets/images/sidebar/sidebar_brain_icon.svg) no-repeat center center;
    background-size: 16px 16px;
}
</style>
