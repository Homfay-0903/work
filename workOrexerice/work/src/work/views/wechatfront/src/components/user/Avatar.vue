<template>
    <!-- 07侧边栏头部 -->
    <div class="side-pic">
        <!-- 添加头像 -->
        <div class="side-user-head-portrait">
            <!-- js判断效果暂未处理 -->
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt />
            <img v-else src="@/assets/images/sidebar/default_avatar.jpg" />
            <!--<input type="text" id="side-up" multiple name="files" @click="show">
            <mt-actionsheet
                :actions="actions"
                v-model="sheetVisible"
                style="background: transparent; padding: 0 10px;"
                class="side-sheet"
            >
            </mt-actionsheet>-->
        </div>
        <!--上传用户头像-->
        <!--<slot name="side-photo"></slot>-->
        <!-- 用户ID -->
        <div class="side-username">
            <h3 class="side-user-id" :style="color">{{ userInfo.nickName }}</h3>
        </div>
        <!--<div class="side-username">
            <span class="side-crown">
                <img src="@/assets/images/sidebar/sidebar_VIP_icon.png" style="width: 16px; margin-top: 1px;">
            </span>
            <span class="side-user-identity" :style="idenColor">{{iden}}</span>
        </div>-->
    </div>
</template>

<script type="text/ecmascript-6">
import { getMemberInfo } from '@/assets/js/apolloGql.js'
import '@/assets/styles/meui/sidebar-msg.less'
export default {
    props: ['color', 'iden', 'idenColor'],
    data() {
        return {
            // action sheet 选项内容
            actions: [
                {
                    name: '图片选自'
                },
                {
                    name: '拍照',
                    method: function() {}
                },
                {
                    name: '相册',
                    method: function() {}
                }
            ],
            sheetVisible: false,
            userInfo: {
                nickName: '',
                avatar: ''
            }
        }
    },
    mounted() {
        this.getMemberInfo()
    },
    methods: {
        show() {
            this.sheetVisible = true
        },
        // 侧边栏 获取用户信息
        getMemberInfo() {
            this.$apollo
                .query({
                    query: getMemberInfo
                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    if (data && data.code === 200) {
                        this.userInfo.nickName = data.data.nickName ? data.data.nickName : data.data.mobile
                        this.userInfo.avatar = data.data.avatar ? data.data.avatar : ''
                        window.localStorage.setItem('memberInfo', JSON.stringify(data.data))
                    }
                })
        }
    }
}
</script>

<style scoped lang="less">
.side-pic {
    padding-top: 15px;
    padding-bottom: 20px;
    margin: 0 auto;
    img {
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}
.side-user-head-portrait {
    display: inline-block;
    width: 88px;
    height: 88px;
    background: url(../../assets/images/sidebar/sidebar_Upload_bat@2x.png) no-repeat;
    background-size: cover;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    box-shadow: 0 0 11px 0 rgba(54, 12, 73, 0.35);
    border: solid 3px rgba(255, 255, 255, 0.2);
    img {
        width: 100%;
        border-radius: 6px;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}
#side-up {
    width: 80px;
    height: 80px;
    background: transparent;
    text-indent: -9999px;
    color: transparent;
}
.side-user-id {
    font-size: 16px;
    font-weight: 100;
    margin-top: 11px;
}
.side-user-identity {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    font-size: 11px;
    font-weight: 100;
    text-index: 26px;
    margin-top: 3px;
}
.side-crown {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    margin-right: 5px;
    vertical-align: middle;
    margin-top: -1px;
}
</style>
