<!--
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-17 18:29:19
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-06 14:22:46
-->
<template>
    <div id="navigation-bar">
        <!-- 导航栏 -->
        <div class="navigation">
            <nav @touchend="goBack" :class="{ clickable: back }">
                <i v-if="back" class="iconfont icon-long-back"></i>
                <p>{{ $t(info.prev) }}</p>
            </nav>
        </div>
        <!-- 页面标题 -->
        <p :class="['title', info.align ? info.align : 'left']">{{ $t(info.title) }}</p>
    </div>
</template>

<script>
import router from '@/router'
import { mapGetters, mapMutations } from 'vuex'
export default {
    props: {
        info: {
            type: Object,
            default() {
                return {
                    prev: '',
                    title: '',
                    align: '',
                    previousRoute: null, // 记录前一个路由
                    lastNavigationTime: 0, // 记录最后一次导航时间
                    isNavigating: false // 防止重复导航状态
                }
            }
        }
    },
    computed: {
        ...mapGetters(['meteTitle']),
        back() {
            return this.info.icon || this.info.icon !== undefined
        }
    },
    methods: {
        ...mapMutations(['METE_TITLE']),
        // 返回上一页
        goBack() {
            // 检查是否正在导航中，防止重复触发
            if (this.isNavigating) {
                window.logger.info('导航正在进行中，阻止重复触发')
                return
            }
            const currentTime = Date.now()
            if (currentTime - this.lastNavigationTime < 400) {
                window.logger.info('快速点击，阻止导航')
                return
            }
            // 设置导航状态
            this.isNavigating = true
            this.lastNavigationTime = currentTime

            try {
                // 检查当前路由是否为 home，直接阻止返回
                if (this.$route.name === 'Home') {
                    window.logger.info('当前路由是home 阻止返回')
                    return
                }

                // 特定路由跳转到 Home 的逻辑
                if (
                    this.$route.name === 'SettingIndex' ||
                    this.$route.name === 'TouchContinue' ||
                    this.$route.name === 'getReport' ||
                    (this.$route.meta.isBack && this.$route.meta.isBack !== undefined)
                ) {
                    this.$changeViewPage('Home')
                    return
                }

                // 原有的返回逻辑
                if (this.back && this.meteTitle.leave) {
                    if (
                        this.$route.query.standUp &&
                        (this.$route.name === 'ShoulderPrepare' || this.$route.name === 'NetworkReport')
                    ) {
                        router.go(-2)
                    } else {
                        router.go(-1)
                    }

                    if (this.$route.name === 'ScanResult' && this.meteTitle.prev === 'navigation-bar.shou-ye') {
                        this.$emit('goBack')
                    }
                } else {
                    this.METE_TITLE(this.meteTitle)
                }
            } finally {
                // 重置导航状态
                this.isNavigating = false
            }
        }
    }
}
</script>

<style lang="less" scoped>
#navigation-bar {
    // 导航
    .navigation {
        position: absolute;
        top: 96px;
        z-index: 100;
        nav {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 48px;
            margin-left: 16px;
            color: #e7e9f0;

            &.clickable {
                color: @color-nav-back;
            }
            i {
                font-size: 28px;
                margin-right: 24px;
            }

            p {
                margin: 0;
                font-size: 32px;
            }
        }
    }
    // 标题
    .title {
        position: absolute;
        top: 264px;
        font-size: 64px;
        margin: 0;
        z-index: 100;
        &.left {
            text-align: left;
            padding-left: 60px;
        }
        &.center {
            text-align: center;
            width: 100%;
        }
    }
}
</style>
