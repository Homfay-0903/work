<!--
 * @Description: 测量项目选择-按钮模式启动
 * @Author: wangmingdong
 * @Date: 2020-03-16 14:00:41
 * @LastEditTime: 2023-07-26 16:50:45
 * @LastEditors: DonWang wangwenqiu@suanier.com
 -->
<template>
    <div class="scan-item-select">
        <div class="scan-project animated fast fadeIn">
            <scan-project-card
                :activePro="activePro"
                @eventType="isTouchScreen"
                :styleType="2"
                :projectList="normalProjects"
            ></scan-project-card>
        </div>
        <!-- 有项目异常且启动方式非项目引导页按钮进入动态实验室 -->
        <div v-if="errProjects.length > 0 && parm.startupType !== 2 && !isSelected" class="tips-wrap">
            <img src="@img/abnormal.svg" class="icon" alt="项目异常" />
            <div class="tips-main">
                <!-- 标题 -->
                <h3 class="title">
                    {{ $t('item-select.items_err', [errProjects.join('、')]) }}
                </h3>
                <!-- 消息内容 -->
                <p class="msg">{{ deviceUsable.errorTip }}</p>
            </div>
        </div>
        <cut-down-load @cut-down-over="cutDownOver" :duration="60" :suffixType="1"></cut-down-load>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import ScanProjectCard from '@/components/ScanProjectCard.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'

export default {
    name: 'ButtonSelect',
    components: {
        ScanProjectCard,
        CutDownLoad
    },
    data() {
        return {
            // 高亮激活项目的序号
            activePro: 0,
            // 已经按下后不允许再次点击
            btnDisabled: false,
            projectList: [
                {
                    // 标题
                    title: this.$t('item-select.ti-tai-ping-gu'),
                    // 内容
                    content: this.$t('item-select.ti-tai-ping-gu_desc[1]'),
                    // 按钮样式图标
                    listIcon: 'item_shape',
                    active: 2
                },
                {
                    // 标题
                    title: this.$t('item-select.ti-wei-ce-liang'),
                    // 内容
                    content: this.$t('item-select.ti-wei-ce-liang_desc'),
                    // 按钮样式图标
                    listIcon: 'item_girth',
                    active: 3
                },
                {
                    // 标题
                    title: this.$t('item-select.dong-tai-shi-yan-shi'),
                    // 内容
                    content: this.$t('item-select.dong-tai-shi-yan-shi_desc1'),
                    // 按钮样式图标
                    listIcon: 'item_beta',
                    // 测量项 0 存在二级菜单
                    active: 0,
                    subProject: [
                        {
                            // 标题
                            title: this.$t('item-select.jian-bu-gong-neng'),
                            // 内容
                            content: this.$t('item-select.jian-bu-gong-neng_desc'),
                            // 按钮样式图标
                            listIcon: 'item_shoulder',
                            // 测量项
                            active: 4
                        }
                    ]
                }
            ],
            // 引导语音重复播放计时器
            repeatTimer: null,
            // 引导语音是否已重复播放
            isRepeatPlay: false,
            // 异常项目名称数组
            errProjects: [],
            // 正常项目信息数组
            normalProjects: [],
            // 已经选择项目 已选择不再播放引导语音
            isSelected: false,
            parm: { startupType: 1 },
            // 自定表头
            title: {
                prev: '首页',
                title: '',
                icon: false,
                leave: true
            }
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'deviceUsable', 'meteTitle', 'deviceInfo']),
        // 选择项目语音音频id
        selectAudioId() {
            // 项目选择页确认键进入动态实验室或当前页选择进入动态实验室
            if (this.parm.startupType === 2 || this.projectList[0].active === 4) {
                return 'shoulderSelectShd'
                // 仅体成分
            } else if (this.deviceUsable.girth && this.errProjects.length === 2) {
                return 'bmSelectBtn'
                // 仅肩部
            } else if (this.onlyShdNormal) {
                return 'shoulderSelectShd'
                // 提前情况 上下键选择（不会出现仅体态项目正常的情况）
            } else {
                // 动态实验室关闭仅身体成功正常
                if (!this.settingInfo.dynamicLaboratory && this.deviceUsable.girth && this.errProjects.length === 1) {
                    return 'bmSelectBtn'
                } else if (
                    !this.settingInfo.dynamicLaboratory &&
                    this.deviceUsable.shape &&
                    this.errProjects.length === 1
                ) {
                    return 'bsSelectBtn'
                }
                return 'selectBtn'
            }
        },
        // 只有肩部项目正常
        onlyShdNormal() {
            return this.deviceUsable.shoulder && this.errProjects.length === 2 && this.settingInfo.dynamicLaboratory
        }
    },
    watch: {
        meteTitle: {
            handler(v, older) {
                if (v.leave === older.leave) {
                    if (this.$route.query.standUp === undefined && !v.leave) {
                        this.getNormalProjects()
                        // 可离开当前页面
                        this.title.leave = !v.leave
                        this.settingMeteTitle()
                    }
                }
            }
        }
    },
    created() {
        if (this.deviceInfo.operationMode != 1) this.activePro = 1
        this.settingMeteTitle()
        if (this.$route.query.startupType) {
            this.parm.startupType = this.$route.query.startupType
        }
        this.$store.commit('CHANGE_SCAN_STATE', true)
        // 获取可测量项目
        this.getNormalProjects()

        this.isNotLeftKey()
        // 播放选择测量语音
        this.$emit('on-audio-event', 'playAudio', this.selectAudioId)
    },
    beforeDestroy() {
        clearTimeout(this.repeatTimer)
    },
    methods: {
        ...mapMutations(['METE_TITLE']),
        // 获取可测量项目
        getNormalProjects() {
            // 项目状态
            const status = [this.deviceUsable.shape, this.deviceUsable.shape, this.deviceUsable.shoulder]
            const normalProjects = []
            status.forEach((item, idx) => {
                // 动态实验室处理
                if (!this.settingInfo.dynamicLaboratory && this.projectList[idx].active === 0) {
                    window.logger.info('动态实验室关闭状态')
                } else {
                    if (item) {
                        normalProjects.push(this.projectList[idx])
                    } else {
                        this.errProjects.push(this.projectList[idx].title)
                    }
                }
            })
            // 动态实验室
            if (this.parm.startupType === 2 || this.onlyShdNormal) {
                this.normalProjects = this.projectList[2].subProject
            } else {
                this.normalProjects = normalProjects
            }
        },
        // 触屏选择
        isTouchScreen(active, index) {
            window.logger.info('监听到点击事件:', active, index)
            this.activePro = index + 1
            const setTimer = setInterval(() => {
                if (active === 0) {
                    // 设备list不可离开当前页面状态
                    this.title.leave = false
                    // true 为改变项目表头
                    this.settingMeteTitle(true)
                    this.jumpPage(active, this.projectList[2])
                } else {
                    this.title.leave = true
                    this.jumpPage(active)
                }
                window.clearInterval(setTimer)
            }, 300)
        },
        // 设置表头
        settingMeteTitle(project) {
            if (this.$route.query.standUp || project) {
                this.title.prev = 'navigation-bar.xiang-mu-xuan-ze'
                this.$route.meta.isBack = false
            } else {
                this.title.prev = 'navigation-bar.shou-ye'
                this.title.icon = true
                this.title.leave = true
            }
            this.METE_TITLE(this.title)
        },
        // 按键处理
        isNotLeftKey() {
            let btnList = [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ]
            // 显示确认键
            if (this.normalProjects.length > 1) {
                btnList.push(
                    {
                        btn: 'add',
                        msg: '加'
                    },
                    {
                        btn: 'sub',
                        msg: '减'
                    }
                )
            }
            if (this.activePro !== 0) {
                btnList.push({
                    btn: 'switch',
                    msg: '电源'
                })
            }

            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList
            })
        },
        // 倒计时结束事件
        cutDownOver() {
            this.$changeViewPage('Home')
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (['selectBtn', 'bmSelectBtn', 'shoulderSelectShd'].indexOf(audioId) > -1) {
                if (!this.isRepeatPlay && !this.isSelected) {
                    this.isRepeatPlay = true
                    // 5s后再次播放引导语音
                    this.repeatTimer = setTimeout(() => {
                        this.$emit('on-audio-event', 'playAudio', this.selectAudioId)
                    }, 5 * 1000)
                }
            }
        },
        // 按键事件
        btnClick(btnType) {
            // 重复按下无效
            if (this.btnDisabled) {
                return
            }
            // 上
            if (btnType === 1) {
                if (this.activePro === 1) {
                    this.activePro = this.normalProjects.length
                } else if (this.activePro === 0) {
                    this.activePro = 1
                } else {
                    this.activePro--
                }
                // 下
            } else if (btnType === 2) {
                if (this.activePro === this.normalProjects.length) {
                    this.activePro = 1
                } else {
                    this.activePro++
                }
                // 确定
            } else if (btnType === 3) {
                if (this.activePro !== 0) {
                    this.handleContinue()
                }
            }
            // TODO: 等待处理长按返回键
            // else if (btnType === 9) {
            //     // 长按返回键
            //     this.$algClient.stopGestureDetect()
            //     this.$changeViewPage('Home')
            // }
            this.isNotLeftKey()
        },
        // 按钮按下后回调
        btnFeedback(active) {
            const PAGE_PATTEN = {
                3: 'WeightGuide',
                2: 'ShapeGuide',
                4: 'ShoulderPrepare'
            }
            this.btnDisabled = true
            let page = PAGE_PATTEN[active]
            if (active === 3 && !this.deviceUsable.weight) {
                page = 'GirthGuide'
            }
            window.logger.info('进入测量项目:', page)
            let query = {}
            if (this.$route.query.standUp) {
                query = { standUp: true, typeSort: this.$route.query.typeSort }
            }
            this.$changeViewPage(page, query)
        },
        // 确认或识别成功后处理
        handleContinue() {
            clearTimeout(this.repeatTimer)
            this.isSelected = true
            // 选中测量的项目
            const type = this.normalProjects[this.activePro - 1]
            const active = type.active
            if (active === 0) {
                this.title.leave = false
                this.settingMeteTitle(true)
            }
            window.logger.info('选择测量项目:', type.title)
            this.jumpPage(active, type)
        },
        // 页面跳转处理
        jumpPage(active, type) {
            // 二级菜单-动态实验室
            if (active === 0) {
                this.normalProjects = type.subProject
                this.activePro = 0
                this.isNotLeftKey()
                if (this.deviceInfo.operationMode != 1) this.activePro = 1
                // 播放选择肩部测量语音
                this.$emit('on-audio-event', 'playAudio', 'shoulderSelectShd')
            } else {
                this.btnFeedback(active)
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.scan-item-select {
    .scan-project {
        margin-top: 408px;
    }

    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 101;
        margin-bottom: 106px;
    }

    .tips {
        &-wrap {
            width: 960px;
            padding: 24px 0;
            margin: 96px 60px 0;
            border-top: 1px solid #565656;
            border-bottom: 1px solid #565656;
            display: flex;

            img {
                width: 96px;
                height: 96px;
                margin-right: 23px;
                vertical-align: middle;
            }
        }

        &-main {
            position: relative;
            margin: 0 55px 0 0;

            h3 {
                margin: 0;
                height: 72px;
                line-height: 72px;
                text-align: left;
                font-weight: normal;
                font-family: OPPOSansM;
                font-size: 48px;
                color: #c9c9c9;
            }

            p {
                margin: 16px 0 0;
                font-size: 36px;
                color: #9e9e9e;
            }
        }
    }
}
</style>
