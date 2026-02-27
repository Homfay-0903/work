<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-07-17 14:22:46
 * @LastEditors: lijing
 * @LastEditTime: 2026-01-23 17:37:24
 * @FilePath: \vr-pro3-cms-frontend\src\components\layout\Home.vue
 * @Description:
-->
<template>
    <div class="home-page">
        <el-container id="container">
            <!-- 左边侧边栏 -->
            <el-aside width="160px" :class="{ 'el-aside-width': !isCollapse }">
                <el-container>
                    <el-header>
                        <div class="icon-menu" @click="handleCollapse">
                            <img src="@/assets/images/public/Combined_shape.svg" alt />
                            <span v-if="isCollapse">展开全部</span>
                        </div>
                    </el-header>
                    <el-main>
                        <router-link to="/custom" v-if="isTouristModule">
                            <div class="icon-pre" @click="refreshBindList">
                                <el-badge
                                    :value="newCount.bindList"
                                    :max="99"
                                    type="danger"
                                >
                                    <img src="@/assets/images/public/custom_bold.svg" alt />
                                </el-badge>
                                <span>绑定列表</span>
                            </div>
                        </router-link>
                        <router-link to="/home">
                            <img src="@/assets/images/public/nav_home_n.svg" alt />
                            <span>首页</span>
                        </router-link>

                        <router-link v-if="userInfo.enableAiReport === 1 && !isVAPro3" to="/interpret-list">
                            <img src="@/assets/images/public/ai.svg" alt />
                            <span>解读列表</span>
                        </router-link>
                        <!-- vapro7一期隐藏设备对接 -->
                        <template v-if="(userInfo.perm.app === 1 || userInfo.perm.api === 1)">
                            <router-link to="/access">
                                <img src="@/assets/images/public/WeChat_API_n.svg" alt />
                                <span>设备对接</span>
                            </router-link>
                            <!-- <router-link to="/doc">
                                <img src="@/assets/images/public/doc_n.svg" alt />
                                <span>技术支持</span>
                            </router-link> -->
                        </template>
                        <template v-else-if="!isVAPro7">
                            <router-link to="/access/single">
                                <img src="@/assets/images/public/WeChat_API_n.svg" alt />
                                <span>设备对接</span>
                            </router-link>
                        </template>
                    </el-main>
                </el-container>
            </el-aside>
            <!-- 右边内容 -->
            <el-container>
                <el-header>
                    <!-- 头部logo 左半部分 -->
                    <router-link class="header-logo" to="/home">
                        <img class="img-svg" v-if="healthPackageEnable === 2"
                            src="@/assets/images/home/mldlogo.png" />
                        <img class="img-svg" v-else-if="['38', '39'].includes(userInfo.deviceId.substring(0, 2))"
                            src="@/assets/images/home/common_title_ve335.svg" />
                        <img class="img-svg" v-else-if="['M5', 'M6', 'M2', 'N2'].includes(userInfo.deviceId.substring(0, 2))"
                            src="@/assets/images/home/common_title_vapro3.svg" />
                        <img v-else src="@/assets/images/home/common_title_n.png" />
                    </router-link>
                    <!-- 头部用户 右半部分 -->
                    <div class="header-info">
                        <!-- 消息提示 -->
                        <el-popover class="msg-btn" placement="bottom" trigger="hover" :content="`您有${unReadCount}条新消息`">
                            <el-badge :is-dot="unReadCount > 0 ? true : false" class="item" slot="reference">
                                <img src="@/assets/images/home/tab-notice-icon.png" alt="消息列表" @click="goMessage" />
                            </el-badge>
                        </el-popover>
                        <!-- 用户头像 -->
                        <el-badge :is-dot="[-1, 0].indexOf(renewal.status) === -1 || isSelectCity" class="avatar-dot">
                            <img alt="用户头像" class="user-avatar" src="@/assets/images/home/default-avatar.svg" />
                        </el-badge>
                        <!-- 帐号设置 -->
                        <span class="user-name" v-popover:name>{{ userInfo.gymName | nameFilter }}</span>
                        <el-dropdown class="user-setting" trigger="click" placement="bottom-start" @command="handleCommand">
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                            <el-dropdown-menu slot="dropdown" class="user-setting-menu">
                                <el-dropdown-item command="UserAccount">
                                    <el-badge :is-dot="isSelectCity" class="dropdown-dot">帐号设置</el-badge>
                                </el-dropdown-item>
                                <el-dropdown-item command="ingredient" v-if="!isVAPro3 && !isVAPro5 && !isVAPro7">体成分标准设置</el-dropdown-item>
                                <el-dropdown-item command="UserPassword">修改密码</el-dropdown-item>
                                <el-dropdown-item command="DeviceInfo">
                                    <el-badge :is-dot="[-1, 0].indexOf(renewal.status) === -1"
                                        class="dropdown-dot">设备信息</el-badge>
                                </el-dropdown-item>
                                <el-dropdown-item command="Quit">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- begin 提醒 -->
                        <el-popover v-if="userInfo.gymName.length > 12" ref="name" placement="bottom" width="200"
                            trigger="hover" :content="userInfo.gymName"></el-popover>
                        <!-- end 提醒 -->
                    </div>
                </el-header>
                <el-main>
                    <template v-if="[-1, 0].indexOf(renewal.status) === -1 && renewal.showRemind && renewalModel">
                        <div v-if="renewal.status === 3" class="renewal-tip error">
                            设备已无法使用，请尽快完成云服务的续费。
                            <router-link to="/pay" v-if="!isVAPro5 && !isVRPro5ARM && !isVRPro5 && !isVE260 && !isVAPro6">去续费</router-link>
                        </div>
                        <div v-else-if="renewal.status === 2" class="renewal-tip warning">
                            <!-- {{$t('home.renewal.msg[1].pre')}}{{ renewal.freezeDate }}{{$t('home.renewal.msg[1].post')}} -->
                            设备已过期，{{ renewal.freezeDate }}后将无法使用，请尽快完成云服务的续费。
                            <router-link to="/pay" v-if="!isVAPro5 && !isVRPro5ARM && !isVRPro5 && !isVE260 && !isVAPro6">去续费</router-link>
                        </div>
                        <div v-else class="renewal-tip">
                            <!-- {{$t('home.renewal.msg[2].pre')}}{{ renewal.expireDate }}{{$t('home.renewal.msg[2].post')}} -->
                            设备将于{{ renewal.expireDate }}过期，请尽快完成云服务的续费。
                            <router-link to="/pay" v-if="!isVAPro5 && !isVRPro5ARM && !isVRPro5 && !isVE260 && !isVAPro6">去续费</router-link>
                        </div>
                    </template>
                    <!-- 部分页面缓存 -->
                    <keep-alive :include="['ScanList']">
                        <router-view @updateUnReadCount="updateUnReadCount" @on-account-upd="validCity"></router-view>
                    </keep-alive>
                    <template>
                        <div id="subapp-container"></div>
                    </template>
                </el-main>
                <!-- <el-footer v-if="$route.path !== '/userset'">
                <router-link to="/userset">关于蒜泥</router-link>
                </el-footer>-->
            </el-container>
        </el-container>
        <el-dialog title :visible.sync="dialogTableVisible" center :modal-append-to-body="false" width="600px"
            :close-on-click-modal="false" @close="dialogClose">
            <div :class="['migration-dialog', { 'is-disuse': isDisuse }]">
                <img v-if="isDisuse" class="migration-dialog-title" src="@/assets/images/home/disuse-title.png" alt />
                <img v-else class="migration-dialog-title" src="@/assets/images/home/migration-title.png" alt />
                <div class="migration-dialog-content">
                    <h4>{{ isDisuse ? '管理平台停用通知！' : '新平台升级邀您体验' }}</h4>
                    <p v-if="isDisuse">
                        <br/>
                        {{ `该管理平台已于${migrationTime}停用，停用后仅可查看历史的测量报告。从${migrationTime1}起新的报告将不再支持在该平台显示，请您登录新平台查看测量报告：Visbody WellnessHub:` }}
                        <a :href="migrationUrl">{{ migrationUrl }}</a>
                    </p>
                    <p v-else>
                        <span>{{ '快来体验Visbody全新管理平台Wellness Hub吧！' }} </span>
                        <br/>
                        <br/>
                        <span style="display: block;text-align:left;">{{ '亲爱的用户，您好！' }}</span>

                         <span style="display: block;text-align:left;">
                            {{ '为了提供更好的服务体验，我们诚邀您迁移至全新的管理平台【Visbody WellnessHub:' }}
                            <a :href="migrationUrl">{{ migrationUrl }}</a>
                            {{ ' 】（点击访问）。' }}
                         </span>
                    </p>
                </div>
                <div class="migration-dialog-account" v-if="isTransferDate === 'true' && AiUserName">
                    <div class="migration-dialog-account-tip">
                        <img src="@/assets/images/home/information-fill@2x.png" alt />
                        <span>{{ '请使用您的账号和密码登录新平台，享受更加智能便捷的管理体验。' }}</span>
                    </div>
                    <div class="migration-dialog-account-info">
                        <p class="subheading">{{ '您的登录信息:' }}</p>
                        <div class="account">
                            <span>{{ '您的账号：' }}</span>
                            <p>{{ AiUserName }}</p>
                        </div>
                        <div class="password">
                            <span>{{ '您的密码：' }}</span>
                            <p>{{ AiUserName }}</p>
                        </div>
                    </div>
                </div>

                <p :class="['migration-dialog-tip', { tip3: isTransferDate === 'false' }]">
                    <img src="@/assets/images/home/alert-fill@2x.png" alt />
                    <span>{{ isTransferDate === 'true' ? '温馨提示：请妥善保存您的账号和密码。如有任何疑问或需要帮助，请随时联系您的客户经理。感谢您的支持与信任！' : '如有疑问请联系您的客户经理。' }}</span>
                </p>
                <p :class="['migration-dialog-tip', { tip3: isTransferDate === 'false' }]">
                    <img src="@/assets/images/home/alert-fill@2x.png" alt />
                    <span>{{ '新平台和该管理平台的设置内容不互通，请不要同时使用两个平台操作。' }}</span>
                </p>
                <div class="migration-dialog-btn">
                    <a :href="migrationUrl">
                        <el-button type="primary" style="background: #165DFF;border-color:#165DFF;border-radius: 12px;">
                            {{ '立即去新平台' }}
                            <img src="@/assets/images/home/arrow-right-line@2x.png" alt />
                        </el-button>
                    </a>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { findCmsMessageList, updateExpireDate, findUserInfo, findNewBindTaskCount } from '@/assets/js/apolloGql.js'
import { strFilter, getLocalTime } from '@/assets/js/util.js'
import { migrationTime, migrationUrl, isTransferDate, wellnessHubUrl, productSn } from '@/assets/js/config.js'
import { mapState, mapMutations } from 'vuex'
import { Dialog } from 'vant'
import axios from 'axios' // 引入axio
import { registerApps } from '../../qiankun'
import actions from '../../qiankun/globalState'
import { isVAPro3, isTouristModule, isVAPro5, isVAPro7, isVE260, isVRPro5, isVRPro5ARM, isVAPro6 } from '@/types/device.js'

export default {
    filters: {
        nameFilter(value) {
            // 截取12个字符
            return strFilter(value, 12)
        }
    },
    data() {
        return {
            // 未读消息数量
            unReadCount: 0,
            isCollapse: false,
            // 是否已弹出续费框
            renewalModel: false,
            // 是否选择了省、市、区/县
            isSelectCity: false,
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro7: isVAPro7(),
            isVE260: isVE260(),
            isVRPro5: isVRPro5(),
            isVRPro5ARM: isVRPro5ARM(),
            isVAPro6: isVAPro6(),
            isTouristModule: isTouristModule(),
            // 查询新增数量定时器
            newCountTimer: null,
            newCountNum: 0,
            // 绑定用户数据时间
            lastCustomTime: Math.floor(new Date().getTime() / 1000),
            // 报告列表数据时间
            lastReportTime: Math.floor(new Date().getTime() / 1000),
            newScanInter: null,
            // 迁移提示显示状态
            dialogTableVisible: false,
            migrationTime: '',
            migrationTime1: '',
            migrationUrl: '',
            isTransferDate: 'false',
            isDisuse: false,
            AiUserName: '',
            healthPackageEnable: 0
        }
    },
    computed: {
        ...mapState(['userInfo', 'renewal', 'deviceExpireDate', 'newCount']),
    },
    watch: {
        deviceExpireDate(newDate) {
            this.changeUserExp(newDate)
        }
    },
    created() {
        console.log(`======ww=22222${migrationUrl}   ${isTransferDate}`)
        console.log('>>>[Home.vue-created] this.userInfo:', this.userInfo)
        // 跟新全局renewal
        actions.setGlobalState({ SET_RENEWAL: this.renewal })
        // 检查是否需要续费
        this.checkUserRenewal()
        this.validCity()
        this.migrationUrl = migrationUrl
        this.isTransferDate = isTransferDate
        this.getMigrationTime()
        this.findUserInfo()
        const pSn = productSn ? productSn.split(',') : []
        console.log('>>>[Home.vue-created] pSn:', pSn)
        // if (window.localStorage.getItem('aiTip') === 'true' && pSn.includes(this.userInfo.deviceId.substring(0, 2))) {
        //     this.dialogTableVisible = true
        // }
        if (window.localStorage.getItem('aiTip') === 'true' && ['36', '50', '52', 'M2', 'M6', '51', 'M3', 'N2', 'M7', 'N7'].includes(this.userInfo.deviceId.substring(0, 2))) {
            this.dialogTableVisible = true
        }
    },
    mounted() {
        registerApps()
        this.findCmsMessageList()
        if (window.screen.width <= 1366) {
            this.isCollapse = false
        }
        this.renderResize()
        // 监听resize方法
        window.addEventListener('resize', this.renderResize, false)
        // 轮询查询
        this.getLinsterScan(new Date().getTime())

        this.$eventBus.$on('getLastDataTime', (data) => {
            if (data.time) {
                this.getLinsterScan(data.time)
            }
        })
        this.getTransferAccount(wellnessHubUrl, this.userInfo.companyId, this.userInfo.userId)
    },
    beforeDestroy() {
        // 移除监听
        window.removeEventListener('resize', this.renderResize, false)
        // this.clearNewCountTimer()
    },
    methods: {
        ...mapMutations(['SET_RENEWAL', 'SET_USER_INFO']),
        getLinsterScan(time) {
            if (!isTouristModule) return
            console.log(`启动循环获取最新报告数量${time}`)
            if (this.newScanInter) {
                clearInterval(this.newScanInter)
            }
            // 每1分钟查询一次
            this.newScanInter = setInterval(() => {
                const token = window.localStorage.getItem('userTokens')
                if (token === null) {
                    clearInterval(this.newScanInter)
                    return false
                }
                // 转换成UNIX时间戳
                const params = {
                    lastTime: Math.floor(time / 1000)
                }
                this.$apollo
                    .query({
                        query: findNewBindTaskCount,
                        variables: params,
                        fetchPolicy: 'no-cache'
                    })
                    .then(res => {
                        const data = res.data.findNewBindTaskCount
                        if (data && data.code === 200) {
                            console.log(`当前设置数据${data.data.count}`)
                            // this.REPORT_COUNT = {
                            //     bindList: data.data.count > 0 ? data.data.count : null
                            // }
                            this.$store.commit('REPORT_COUNT', {
                                bindList: data.data.count > 0 ? data.data.count : null
                            })
                        }
                    })
            }, 1000 * 60)
        },
        validCity() {
            const data = this.userInfo.speAddress
            if (!data) {
                this.isSelectCity = true
            } else {
                const address = data.split('-')
                const select = {
                    province: address[0],
                    city: address[1],
                    area: address[2]
                }
                this.isSelectCity = this.isNotSelect(select)
            }
        },
        isNotSelect(select) {
            return select.province === '' || select.province === '省份' || select.city === '' || select.city === '城市' || select.area === '' || select.area === '区/县名'
        },
        changeUserExp(dataStorageExpireDate) {
            this.$apollo
                .mutate({
                    mutation: updateExpireDate,
                    variables: {
                        dataStorageExpireDate: dataStorageExpireDate
                    }
                })
                .then(res => {
                    this.findUserInfo()
                })
                .catch(err => {
                    console.log(err)
                })
        },
        async findUserInfo() {
            this.$apollo
                .query({
                    query: findUserInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.findUserInfo
                    if (result.code === 200) {
                        // TUDO主应用调用
                        let date = {}
                        date.SET_USER_INFO = result.data
                        this.healthPackageEnable = result.data.healthPackageEnable
                        window.localStorage.setItem('healthPackageEnable', this.healthPackageEnable)
                        console.log(this.healthPackageEnable, ';healthPackageEnable')
                        this.SET_USER_INFO(date)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 路由信息切换
        handleCommand(command) {
            // 退出
            if (command === 'Quit') {
                // 消除 刷新token 定时器
                if (this.$store.state.timeInterVal) {
                    clearInterval(this.$store.state.timeInterVal)
                }

                window.localStorage.removeItem('userTokens')
                // 重置state
                this.$store.dispatch('resetStates')
                this.$router.push('/')
                window.history.go(0)
            } else {
                this.$router.push({
                    name: command
                })
            }
        },
        goMessage() {
            if (this.$route.path !== '/news') {
                this.$router.push('/news')
            }
        },
        // 获取消息列表
        async findCmsMessageList() {
            this.$apollo
                .query({
                    query: findCmsMessageList,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.findCmsMessageList
                    if (result.code === 200) {
                        this.unReadCount = result.data.unreadSum
                    } else {
                        this.unReadCount = 0
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        handleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        updateUnReadCount(count) {
            this.unReadCount = count
        },
        renderResize() {
            const height = (window.innerHeight * 1300) / window.innerWidth
            document.getElementById('container').style.minHeight = `${height}px`
        },
        checkUserRenewal() {
            // Tudo 数据调试
            // this.pupopPayRemind()
            if ([-1, 0].indexOf(this.renewal.status) === -1) {
                const checkRenewal = this.$route.params.checkRenewal
                // eslint-disable-next-line
                if (checkRenewal === undefined) {
                    this.$store.commit('SET_RENEWAL', {
                        key: 'showRemind',
                        val: true
                    })
                    this.renewalModel = true
                } else {
                    this.pupopPayRemind()
                }
            }
        },
        pupopPayRemind() {
            let msg = ''
            if (this.renewal.status === 1) {
                msg = `您的设备云端数据存储服务即将到期，请您于${this.renewal.freezeDate}前完成年费续缴，否则设备将无法使用`
            } else if (this.renewal.status === 2) {
                msg = `您的设备云端数据存储服务已到期，请您于${this.renewal.freezeDate}前完成年费续缴，否则设备将无法使用。`
            } else {
                msg = '您的设备云端数据存储服务已到期，无法继续使用设备，请尽快完成续费。'
            }
            Dialog.confirm({
                title: '云服务续费',
                message: msg,
                showCancelButton: true,
                showConfirmButton: this.isVAPro5 || this.isVRPro5ARM || this.isVRPro5 || this.isVE260 || this.isVAPro6 ? false : true,
                cancelButtonText: '稍后再说',
                confirmButtonText: '查看详情',
                closeOnClickOverlay: false, // 是否允许遮罩层关闭
            }).then(() => {
                // 确认按钮逻辑
                this.renewalModel = true
                this.$router.push('/pay')
                if (this.dialogTableVisible) this.dialogTableVisible = false
            }).catch(() => {
                // 取消按钮逻辑（不关闭弹窗
                this.renewalModel = true
                this.$store.commit('SET_RENEWAL', { key: 'showRemind', val: true })
            })
        },

        refreshBindList() {
            console.log('刷新绑定按钮')
            this.$eventBus.$emit('changeRouter', 'Custom', null)
        },
        // 时间格式转换
        getMigrationTime () {
            this.migrationTime = migrationTime
            if (migrationTime) {
                const separator = [
                    '年',
                    '月',
                    '日',
                ]

                let migrationTimDate = new Date(getLocalTime(this.migrationTime, this.userInfo.timeZone).replace(/-/g, '/'))
                const year = migrationTimDate.getFullYear()
                const month = String(migrationTimDate.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1，并且补零
                const day = String(migrationTimDate.getDate()).padStart(2, '0') // 补零

                this.migrationTime = `${year}${separator[0]}${month}${separator[1]}${day}${separator[2]}`

                const newDate = new Date()
                if (migrationTimDate < newDate) {
                    this.isDisuse = true
                }

                migrationTimDate.setDate(migrationTimDate.getDate() + 1)

                const year1 = migrationTimDate.getFullYear()
                const month1 = String(migrationTimDate.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1，并且补零
                const day1 = String(migrationTimDate.getDate()).padStart(2, '0') // 补零

                this.migrationTime1 = `${year1}${separator[0]}${month1}${separator[1]}${day1}${separator[2]}`
            }
        },
        dialogClose () {
            window.localStorage.setItem('aiTip', false)
        },
        // 获取迁移
        getTransferAccount(url, companyId, userId) {
            const urlstr =  url + '/visbody/user-account?product_model=VR-PRO3&company_id=' + companyId + '&user_id=' + userId
            axios.get(urlstr).then(result => {
                if (result && result.status === 200 && result.data) {
                    if (result.data.username && result.data.username.length > 0) {
                        this.AiUserName = result.data.username
                    }
                }
            }).catch(error => {
                console.log(error)
            })
        },
    }
}
</script>
<style scoped lang="less">
.home-page {
    width: 100%;
    height: 100%;
    background-color: #f5f6fa;

    .el-container {
        width: 100%;

        // 左侧侧边栏
        .el-aside {
            border-right: 1px solid #cdced2;
            transition: all 0.28s;

            .el-header {
                padding: 0;
                line-height: 70px;
                cursor: pointer;
                text-align: left;
                white-space: nowrap;
                align-items: center;
                justify-content: center;

                .icon-menu {
                    padding: 0 28px;
                }

                &:hover {

                    img,
                    span {
                        opacity: 1;
                    }
                }

                img {
                    opacity: 0.6;
                }

                span {
                    padding-left: 8px;
                    opacity: 0.8;
                }
            }

            .el-main {
                overflow: hidden;
                display: block;
                padding-top: 55px;

                .router-link-active {
                    position: relative;

                    &:after {
                        position: absolute;
                        display: block;
                        content: '';
                        right: 0;
                        top: 0;
                        width: 2px;
                        height: 100%;
                        background: #009fe8;
                    }

                    img {
                        opacity: 1;
                    }

                    span {
                        opacity: 1;
                        color: #000;
                    }
                }

                a:last-child {
                    img {
                        width: 14px;
                        height: 18px;
                    }
                }

                >a {
                    display: flex;
                    align-items: center;
                    padding: 15px 28px;
                    margin-bottom: 20px;
                    height: 50px;
                    white-space: nowrap;

                    img {
                        opacity: 0.4;
                        width: 16px;
                        height: 16px;
                    }

                    span {
                        padding-left: 8px;
                        opacity: 0.8;
                        transition: all 0.2s;
                    }
                }
            }
        }

        .el-aside-width {
            width: 70px !important;

            .el-header .icon-menu {
                padding: 0 26px;

                span {
                    display: none;
                }
            }

            .el-main {
                >a {
                    padding: 15px 26px;

                    span {
                        display: none;
                    }
                }
            }
        }
    }

    .el-header {
        width: 100%;
        height: 70px;
        background: rgba(255, 255, 255, 0.5);
        border-bottom: 1px solid #cdced2;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;

        .header-logo {
            text-align: left;

            img {
                height: 25px;
                margin: 17px 0;
            }

            .img-svg {
                height: auto
            }
        }

        .header-info {

            .msg-btn,
            .user-avatar,
            .user-setting {
                vertical-align: middle;
                outline: none;
            }
            .user-name {
                cursor: default;
            }

            .user-avatar {
                padding: 7px 0;
            }

            .msg-btn {
                cursor: pointer;

                .el-badge {
                    display: inline-block;
                    width: 16px;
                    height: 18px;
                    vertical-align: text-bottom;
                    margin-right: 22px;
                }
            }

            .user-setting {
                font-size: 14px;
                padding: 0 35px 0 0;
                cursor: pointer;
                outline: none;
            }

            /deep/.avatar-dot .el-badge__content {
                top: 10px;
            }
        }

        .el-icon-caret-bottom {
            font-size: 28px;
            vertical-align: middle;
            margin-top: -5px;
        }
    }

    .el-footer {
        width: 100%;
        line-height: 60px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.45);
        border-top: 1px solid #cdced2;

        a {
            text-decoration: none;
            color: inherit;

            &:hover {
                color: rgba(0, 0, 0, 0.6);
            }
        }
    }

    .el-main {
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0;
        height: calc(100vh - 60px);

        // display: flex;
        .renewal-tip {
            position: fixed;
            width: 100%;
            height: 40px;
            font-size: 14px;
            line-height: 40px;
            cursor: default;
            color: #4a4a4a;
            background: #E8F8FF;
            box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.14);
            z-index: 100;

            a {
                cursor: pointer;
                font-size: 12px;
                color: #ffffff;
                border-radius: 50rem;
                padding: 5px 10px;
                background: #1890ff;
            }

            &.error {
                color: #fc3c3c;
                background: #fef0f0;

                a {
                    background: #fc3c3c;
                }
            }

            &.warning {
                color: #e89020;
                background: #fdf6ec;

                a {
                    background: #e89020;
                }
            }

            &~div {
                margin-top: 40px;
            }
        }
    }

    .migration-dialog {
    width: 520px;
    text-align: center;
    margin: 0 auto;

    .migration-dialog-title {
        height: 160px;
    }

    .migration-dialog-content {
        background: #e8ffea;
        border-radius: 4px;
        border: 1px solid #9adaa0;
        padding: 16px;
        margin-top: -35px;

        h4 {
            font-weight: 600;
            font-size: 16px;
            color: #1d2129;
            margin-bottom: 0px;
        }

        p {
            font-weight: 400;
            font-size: 14px;
            color: #5e687b;
            line-height: 22px;

            a {
                color: #165dff;
            }
        }
    }

    .migration-dialog-account {
        border-radius: 4px;
        border: 1px solid #e5e6e8;
        margin-top: 8px;
        padding: 16px;
        text-align: left;

        &-tip {
            display: flex;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px dashed #e5e6e8;

            img {
                width: 13px;
                height: 13px;
                margin-right: 10px;
            }

            span {
                font-weight: 400;
                font-size: 14px;
                color: #5e687b;
            }
        }

        &-info {
            padding-top: 16px;

            .subheading {
                font-weight: 500;
                font-size: 14px;
                color: #5e687b;
                margin-bottom: 10px;
            }

            .account {
                margin-bottom: 8px;
            }

            .account,
            .password {
                display: flex;
                width: 100%;
                align-items: center;
            }
        }
    }

    .migration-dialog-tip,
    .migration-dialog-tip1 {
        display: flex;
        align-items: baseline;
        margin-top: 8px;

        &.tip3 {
            justify-content: center;
        }

        img {
            height: 12px;
            margin-right: 9px;
        }

        span {
            font-weight: 400;
            font-size: 14px;
            color: #5e687b;
            text-align: left;
        }
    }

    .migration-dialog-tip1 {
        margin-top: 0px;
    }

    .migration-dialog-btn {
        margin-top: 40px;

        img {
            height: 8px;
            margin-left: 12px;
        }
    }

    &.is-disuse {
        .migration-dialog-title {
            height: 77px;
            margin-bottom: 30px;
        }

        .migration-dialog-content {
            background: #ffece8;
            border-radius: 4px;
            border: 1px solid #f53f3f;
            margin-top: 0px;
        }
    }
}
}

@media screen and (min-width: 1024px) and (max-width: 1366px) {}
</style>
<style lang="less">
.user-setting-menu{
    text-align: left;
    font-size: 16px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 300;
    color: #3E3A39;
    .el-dropdown-menu__item{
        line-height: 22px;
        .dropdown-dot .el-badge__content {
            left: -20px;
            top: 12px!important;
            right: auto;
        }
    }
}
.el-message-box.adBox {
    position: relative;
    width: 477px;
    border-radius: 0px;
    border: 0px;
    padding-bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    webkit-box-shadow: none;
    box-shadow: none;

    .el-message-box__header {
        z-index: 2;
        position: absolute;
        left: 6px;
        top: -8px;
    }

    .el-message-box__content {
        padding: 0;
    }

    .el-message-box__message p {
        line-height: 0;
    }

    .el-message-box__message img {
        width: 477px;
        height: 243px;
    }

    .el-message-box__btns {
        padding: 0;
    }

    .el-message-box__headerbtn .el-message-box__close {
        position: absolute;
        left: -16px;
        top: -1px;
        color: rgba(255, 255, 255, 0.2);
    }
}

</style>
