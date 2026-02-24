<template>
    <!-- 08侧边栏 -->
    <div class="side-list" @touchmove.prevent>
        <!-- 用户头像，姓名，身份 -->
        <user-avatar
            :color="this.sideMsg.color"
            :idenColor="this.sideMsg.idenColor"
            :iden="this.sideMsg.iden"
            :style="{marginBottom: '20px'}"
        ></user-avatar>
        <!-- 功能选项 -->
        <!--<side-list v-for="(n, x) in sideCont"
                   :key="n.feat"
                   :feat="n.feat"
                   :icon="n.icon"
                   :link="n.link"
        >
        </side-list>-->
        <p class="side-empty"></p>
        <sidebar-item v-for="m in sideHelp" :key="m.feat" :feat="m.feat" :icon="m.icon" :link="m.link" @router-link-click="sidebarItemClick"></sidebar-item>
        <sidebar-item v-for="m in aboutOurs" :key="m.feat" :feat="m.feat" :icon="m.icon" :link="m.link">
            <span slot="haveUnread" class="unread-notice" v-if="unreadNitice"></span>
        </sidebar-item>
    </div>
</template>

<script type="text/ecmascript-6">
import UserAvatar from '@/components/user/Avatar'
import SidebarItem from '@/components/sidebar/Item'
import { findAppNoticeList, findUserInfoByScanId } from '@/assets/js/apolloGql.js'
import { clone } from '@/assets/js/util.js'
import { isVRPro5, isVAPro5, isVAPro6, isVAPro7 } from '@/types/device'
export default {
    components: {
        UserAvatar,
        SidebarItem
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            sideMsg: {
                color: 'color: #222',
                idenColor: 'color: #222',
                iden: 'VIP学员'
            },
            sideCont: [
                {
                    icon: 'side-send-report',
                    feat: '发送报告',
                    link: '/sendrt'
                },
                {
                    icon: 'side-collect-report',
                    feat: '查收报告',
                    link: '/viewrt'
                },
                {
                    icon: 'side-model-management',
                    feat: '模型管理',
                    link: '/model'
                }
            ],
            sideHelp: [
                {
                    icon: 'side-help-content',
                    feat: '个人中心',
                    link: '/personal'
                },
                {
                    icon: 'side-problem-feedback',
                    feat: '问题反馈',
                    link: '/feedback'
                }
            ],
            aboutOurs: [
                {
                    icon: 'side-about-our',
                    feat: '关于我们',
                    link: '/about'
                }
            ],
            // 消息列表
            formDate: {
                pageNumber: 1,
                pageSize: 10
            },
            unreadNitice: false
        }
    },
    created() {
        // vrpro5侧边栏展示历史报告入口
        if (isVRPro5() || isVAPro5() || isVAPro7() || isVAPro6()) {
            this.sideHelp = [
                {
                    icon: 'side-help-content',
                    feat: '个人中心',
                    link: '/personal'
                },
                {
                    icon: 'side-problem-feedback',
                    feat: '历史报告',
                    link: '/report/historyPage'
                },
                {
                    icon: 'side-problem-feedback',
                    feat: '问题反馈',
                    link: '/feedback'
                }
            ]
        }
    },
    mounted() {
        this.getUserInfo()
        this.findAppNoticeList()
    },
    methods: {
        getUserInfo() {
            // 只有肩部时，隐藏报告解读入口
            if (modelInfo.biaStatus !== 1 && modelInfo.evalStatus !== 1) return
            this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    this.loading = false
                    const data = res.data.findUserInfoByScanId
                    if (data && data.code === 200) {
                        const info = data.data
                        if (info.enableAiReport === 1) {
                            this.sideHelp = [
                                {
                                    icon: 'side-help-content',
                                    feat: '个人中心',
                                    link: '/personal'
                                },
                                {
                                    icon: 'side-help-brain',
                                    feat: '报告解读',
                                    link: '#'
                                },
                                {
                                    icon: 'side-problem-feedback',
                                    feat: '问题反馈',
                                    link: '/feedback'
                                }
                            ]
                        }
                    } else {
                        console.log('err')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        sidebarItemClick(name) {
            if (name === this.sideHelp[1].feat) this.$emit('close-side-bar')
        },
        findAppNoticeList() {
            // 进行取值，所以此时不进行再次获取
            this.dropDown = !this.dropDown
            this.$apollo
                .query({
                    query: findAppNoticeList,
                    variables: this.formDate
                })
                .then(res => {
                    if (res.data.code === 200) {
                        const data = clone(res.data.findAppNoticeList)
                        this.unreadNitice = data.data.find(ele => {
                            return ele.readState === 0
                        })
                    }
                })
        }
    }
}
</script>

<style scoped lang="less">
.side-list {
    width: 100%;
    height: 100%;
    background: #eaebff;
    padding-top: 25px;
    font-size: 14px;
    background: url(../../assets/images/sidebar/lALPBbCc1dfvirHNBLjNAhA_528_1208.png) no-repeat;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
}
.side-empty {
    padding: 10px 0;
}
.side-close {
    display: inline-block;
    width: 16px;
    height: 16px;
    mix-blend-mode: undefined;
    border-radius: 1px;
    background-image: linear-gradient(165deg, #00e3c9, #00a4e6);
}
.unread-notice {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: red;
    border-radius: 50%;
    position: relative;
    top: -4px;
    right: -6px;
}
</style>
