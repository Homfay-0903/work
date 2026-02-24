<template>
    <!-- 分享 - 头部 用户信息 -->
    <div class="header">
        <!-- 用户头像 -->
        <img
            @load="imageLoadedSuc"
            @error="imageLoadedErr"
            v-if="userInfo.avatar"
            crossorigin="Anonymous"
            :src="userInfo.avatar"
            alt="用户头像"
        />
        <div class="info">
            <p v-if="userInfo.nickName" class="name">{{ userInfo.nickName }}</p>
            <p class="time">{{ scanDate }}</p>
        </div>
    </div>
</template>
<script>
import { getMemberInfo } from '@/assets/js/apolloGql.js'
import { formatTime, clone } from '@/assets/js/util.js'
import defaultAvatar from '@/assets/images/sidebar/default_avatar.jpg'
export default {
    data() {
        return {
            // 本次扫描信息
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            userInfo: {},
            // 默认头像
            defaultAvatar: defaultAvatar
        }
    },
    computed: {
        scanDate: function() {
            return formatTime(new Date(this.modelInfo.createTime * 1000))
        }
    },
    created() {
        this.getMemberInfo()
    },
    methods: {
        setDefaultAvatar() {
            if (!this.userInfo.avatar) {
                this.userInfo.avatar = this.defaultAvatar
            }
        },
        getMemberInfo() {
            this.$apollo
                .query({
                    query: getMemberInfo
                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    if (data && data.code === 200) {
                        this.userInfo = clone(data.data)
                    } else {
                        this.dataLoadErr('getMemberInfo')
                    }
                    this.setDefaultAvatar()
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('getMemberInfo')
                })
        },
        // 图片加载完回调
        imageLoadedSuc() {
            this.$nextTick(() => {
                this.$emit('loadOver', 'headerInfo')
            })
        },
        // 图片加载失败
        imageLoadedErr(e) {
            console.error('HeaderInfo中图片加载失败！失败src:', e.target.src)
            this.$nextTick(() => {
                this.$emit('loadError', 'headerInfo')
            })
        },
        // 接口加载失败
        dataLoadErr(name) {
            console.error('HeaderInfo中接口加载失败！失败接口:', name)
            this.$nextTick(() => {
                this.$emit('loadError', 'headerInfo')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.header {
    width: 90%;
    margin: 0 auto;
    text-align: left;
    padding-top: 20px;
    max-height: 20vw;
    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: middle;
        display: inline-block;
    }
    .info {
        color: #ffffff;
        vertical-align: middle;
        display: inline-block;
        .name {
            font-size: 16px;
            margin-bottom: 4px;
        }
        .time {
            font-size: 12px;
        }
    }
}
</style>