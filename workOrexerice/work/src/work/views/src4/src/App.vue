<template>
    <div id="app" v-cloak>
        <router-view></router-view>
    </div>
</template>

<script>
import { version } from '../package.json'
export default {
    name: 'App',
    created () {
        console.log(`version = ${version}`)
    }
}
</script>

<style>
#app {
    font-family: 'PingFang SC', 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans CJK SC';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100vw;
    min-width: 1300px;
    overflow: hidden;
    overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
}

/*scrollbar*/
.scrollbar::-webkit-scrollbar {
    width: 13px;
}

.scrollbar::-webkit-scrollbar-thumb {
    border: 3px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 7px;
    min-height: 84px;
    background-color: rgba(0, 0, 0, 0.4);
}

.scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.scrollbar::-webkit-scrollbar-track {
    background-color: rgba(248, 250, 252, 0);
}

.scrollbar::-webkit-scrollbar-track:hover {
    background-color: rgba(248, 250, 252, 1);
}

.info-msg.el-message {
    min-width: 240px;
    background: rgba(67, 68, 80, 1);
    border-radius: 0;
}
.el-message__content {
    color: #fff!important;
}
.info-msg.el-message{
   color: #fff!important;
}

.el-message {
    min-width: 300px!important;
    margin-top: -23px!important;
    background:rgba(0, 0, 0, .5) !important;
    border-color: transparent!important;
}
.el-message {
    top: 50% !important;
}

.info-msg .el-message__icon {
    display: none;
}

.user-setting-menu {
    min-width: 100px;
}

[v-cloak] {
    display: none;
}
.el-icon-arrow-left:before {
    content: "\E600"!important;
}

.el-icon-back:before {
    content: "\E606"!important;
}

.el-icon-more:before{
    content: "\E646"!important;
}

.el-icon-arrow-right:before {
    content: "\E604"!important;
}

.el-icon-caret-bottom:before {
    content: "\E60B"!important;
}

.el-icon-check:before {
    content: "\E611"!important;
}
.el-icon-success:before {
    content: "\E62D"!important;
}
.el-icon-close:before {
    content: "\E60F"!important;
}
.el-icon-warning:before {
    content: "\E62E"!important;
}
.el-icon-info:before {
    content: "\E61A"!important;
}
</style>
<style lang="less" >
/* 昵称编辑弹窗 */
    .msg-prompt {
        padding: 0 10px 40px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        .el-message-box__header {
            .el-message-box__close {
                color: #000000;
                font-weight: bold;
            }
        }
        .el-message-box__btns,
        .el-message-box__title {
            text-align: center;
        }
        .el-message-box__title {
            padding-top: 30px;
        }

        .el-button {
            width: 80px;
        }

        .el-message-box__btns button:nth-child(2) {
            margin-left: 30px;
        }

        .el-message-box__btns {
            padding-bottom: 24px;
            .el-button--default {
                border:1px solid rgba(64,158,255,1);
            }
        }
        .el-alert {
            height: 54px;
            border-radius: 4px;
            margin: 24px 0 16px;
            border: 1px solid #409eff;
            background: #e6f2ff;
            .el-alert__title {
                color: #000000;
            }
        }
    }
</style>
