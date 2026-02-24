<template>
    <div class="pc-report">
        <div class="content">
            <!-- <div class="header">
                <div class="back" @click="back">
                    <img src="@/assets/images/pc-report/close.png" />
                    <span>取消查看</span>
                </div>
            </div> -->

            <div class="tabbar">
                <!-- 滑块背景 -->
                <div class="tabbar-slider" :style="sliderStyle"></div>
                <div v-for="(tab, index) in tabs" :key="index" class="tabbar-item"
                    :class="{ 'tabbar-item-active': activeTabIndex === index }"
                    :style="{ width: tabItemWidth }"
                    @click="switchTab(index)">
                    {{ tab.name }}
                </div>
            </div>

            <div class="user-info">
                <div class="user-info-left">
                    <span>ID:</span>
                    <span>{{ memberId }}</span>
                </div>
                <div class="user-info-right">
                    <img :src="sexIcon" />
                    <span>{{ memberSex }}</span>
                    <img src="@/assets/images/pc-report/icon1.png" />
                    <span>{{ memberHeight }}</span>
                    <img src="@/assets/images/pc-report/icon2.png" />
                    <span>{{ memberAge }}</span>
                </div>
            </div>
            <div class="line"> </div>

            <!-- Tab 内容区域 -->
            <div class="tab-content">
                <component :is="currentTabComponent" />
            </div>
        </div>
    </div>
</template>

<script>
import CompositionTab from './compositionTab.vue'
import PostureTab from './postureTab.vue'
import StiffnessTab from './stiffnessTab.vue'
import ShoulderTab from './shoulderTab.vue'
import { getMemberInfoByScanId } from '@/assets/js/apolloGql.js'

export default {
    name: 'PcReport',
    components: {
        CompositionTab,
        PostureTab,
        StiffnessTab,
        ShoulderTab
    },
    data() {
        return {
            activeTabIndex: 0,
            // 模型信息（从 localStorage 获取）
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')) || {},
            // 用户信息
            member: {}
        }
    },
    computed: {
        // 根据测量数据动态生成 tabs
        tabs() {
            const availableTabs = []
            const info = this.modelInfo

            // 身体成分：biaMeasure === 1 && biaStatus === 1
            if (info.biaMeasure === 1 && info.biaStatus === 1) {
                availableTabs.push({ name: '身体成分', component: 'CompositionTab' })
            }

            // 体态评估：staticEval === 1 && evalStatus === 1
            if (info.staticEval === 1 && info.evalStatus === 1) {
                availableTabs.push({ name: '体态评估', component: 'PostureTab' })
            }

            // 身体围度：girthMeasure === 1 && bdaStatus === 1
            if (info.girthMeasure === 1 && info.bdaStatus === 1) {
                availableTabs.push({ name: '身体围度', component: 'StiffnessTab' })
            }

            // 肩部功能：(shoulder === 1 || shoulderEval === 1) && (bsShoulderScanResult === 1 || bsShoulderStatus === 1)
            if ((info.shoulder === 1 || info.shoulderEval === 1) &&
                (info.bsShoulderScanResult === 1 || info.bsShoulderStatus === 1)) {
                availableTabs.push({ name: '肩部功能', component: 'ShoulderTab' })
            }

            return availableTabs
        },
        currentTabComponent() {
            if (this.tabs.length === 0) return null
            return this.tabs[this.activeTabIndex].component
        },
        // 计算滑块位置
        sliderStyle() {
            if (this.tabs.length === 0) return { width: '0%', transform: 'translateX(0)' }
            const width = 100 / this.tabs.length // 根据 tab 数量动态计算宽度百分比
            const left = this.activeTabIndex * width
            return {
                width: `${width}%`,
                transform: `translateX(${left * (this.tabs.length)}%)`
            }
        },
        // 计算每个 tab 的宽度
        tabItemWidth() {
            if (this.tabs.length === 0) return '0%'
            return `${100 / this.tabs.length}%`
        },
        // 用户 ID 显示（优先显示 memberCode，否则显示手机号）
        memberId() {
            return this.member.memberCode || this.member.memberMobile || '--'
        },
        // 性别显示（1=男，2=女）
        memberSex() {
            if (this.member.memberSex === 1) {
                return '男'
            }
            if (this.member.memberSex === 2) {
                return '女'
            }
            return '--'
        },
        // 性别图标（根据性别返回不同图标）
        sexIcon() {
            if (this.member.memberSex === 1) {
                return require('@/assets/images/pc-report/icona2.png')
            }
            return require('@/assets/images/pc-report/icona1.png')
        },
        // 身高显示
        memberHeight() {
            return this.member.memberHeight ? `${this.member.memberHeight} cm` : '--'
        },
        // 年龄显示
        memberAge() {
            return this.member.memberAge ? `${this.member.memberAge}岁` : '--'
        }
    },
    watch: {
        // 监听 tabs 变化，确保 activeTabIndex 不会超出范围
        tabs(newTabs) {
            if (newTabs.length > 0 && this.activeTabIndex >= newTabs.length) {
                this.activeTabIndex = 0
            }
        }
    },
    mounted() {
        this.getMemberInfo()
        // 等待 tabs 计算完成后再初始化 URL 参数
        this.$nextTick(() => {
            this.initTabFromUrl()
        })
    },
    methods: {
        back() {
            this.$router.back()
        },
        switchTab(index) {
            this.activeTabIndex = index
            // 更新 URL 参数
            this.updateUrlParam(index)
        },
        // 从 URL 参数初始化 tab
        initTabFromUrl() {
            const tab = this.$route.query.tab
            if (tab) {
                // 支持通过 tab 名称或索引访问
                const tabIndex = this.tabs.findIndex(t => t.name === tab)
                if (tabIndex !== -1) {
                    this.activeTabIndex = tabIndex
                } else {
                    // 尝试将 tab 参数作为索引
                    const index = parseInt(tab, 10)
                    if (!isNaN(index) && index >= 0 && index < this.tabs.length) {
                        this.activeTabIndex = index
                    }
                }
            }
        },
        // 更新 URL 参数
        updateUrlParam(index) {
            this.$router.replace({
                query: {
                    ...this.$route.query,
                    tab: index
                }
            })
        },
        // 获取用户信息
        getMemberInfo() {
            if (!this.modelInfo.scanId) {
                console.error('scanId 不存在')
                return
            }
            this.$apollo
                .query({
                    query: getMemberInfoByScanId,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.getMemberInfoByScanId
                    if (data && data.code === 200) {
                        this.member = data.data
                    }
                })
                .catch((err) => {
                    console.error('获取用户信息失败:', err)
                })
        }
    }
}
</script>

<style lang="less" scoped>
.pc-report {
    // 覆盖全局字体，不使用 PingFang SC
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    background: #000000;
    .content {
        width: 100%;
        box-sizing: border-box;
        padding: 0 40px;
        min-height: 100vh;
    }

    .header {
        height: 96px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .back {
        padding-left: 14px;
        display: flex;
        align-items: center;
        height: 96px;
        width: fit-content;

        & > img {
            width: 48px;
            height: 48px;
        }

        & > span {
            margin-left: 7px;
            font-size: 32px;
            color: #75a6fc;
        }
    }


    .tabbar {
        width: 100%;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #14142f;
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 16px;
        position: relative;

        // 滑块
        .tabbar-slider {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: #35377a;
            border-radius: 16px;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1;
        }

        .tabbar-item {
            font-family: "Noto Sans CJK SC", "Source Han Sans CN", "PingFang SC", "Microsoft YaHei", sans-serif !important;
            height: 100%;
            font-size: 28px;
            color: #75a6fc;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: color 0.3s ease;
            position: relative;
            z-index: 2;

            &-active {
                color: #f8fafd;
            }
        }
    }

    .user-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 24px 0;

        &-left {
            font-size: 20px;
            color: #757575;

            & > span:last-child {
                margin-left: 8px;
            }
        }

        &-right {
            display: flex;
            align-items: center;
            font-size: 20px;
            color: #757575;

            & > img {
                width: 11px;
                margin-right: 8px;
                object-fit: cover;
            }

            & > img:nth-child(2) {
                width: 20px;
            }

            & > img:nth-child(3) {
                width: 18px;
            }

            & > span:not(:last-child) {
                margin-right: 24px;
            }
        }
    }

    .line {
        width: 100%;
        height: 1px;
        background: #43444d;
    }

    .tab-content {
        margin-top: 28px;
        width: 100%;
    }
}
</style>
