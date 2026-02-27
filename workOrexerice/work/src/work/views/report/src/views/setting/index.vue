<!--
 * @Description: 系统设置首页
 * @Author: yangsheng
 * @Date: 2022-02-16 15:01:26
 * @LastEditors: liutq
 * @LastEditTime: 2025-10-13 17:46:04
 -->
<template>
    <div :class="['setting', $i18n.locale]">
        <i class="line"></i>
        <div class="items">
            <template v-for="(item, index) in showItem">
                <div
                    v-if="item.title"
                    :class="[{ active: active === index }, 'item']"
                    :key="index"
                    @touchend="confirmSelection(index)"
                >
                    <div class="box">
                        <img
                            :src="
                                deviceInfo.deviceType === 5
                                    ? require(`@/assets/img/setting/${item.selectIcon}-pro5.svg`)
                                    : require(`@/assets/img/setting/${item.selectIcon}.svg`)
                            "
                            class="icon-left"
                            alt
                        />
                        <h3>{{ item.title }}</h3>
                        <span :class="[deviceInfo.deviceType === 5 && active !== index ? 'pro5-color' : '']">
                            <img v-if="item.error" src="@img/setting/Tips.png" alt="" />{{ item.vice }}
                        </span>
                        <i
                            class="iconfont icon-arrow-right"
                            :class="[
                                deviceInfo.deviceType === 5 && active !== index ? 'pro5-color' : 'iconfont',
                                'icon-arrow-right'
                            ]"
                        ></i>
                    </div>
                </div>

                <!-- 页码 -->
                <div v-else-if="item.isPage && tourist" class="next-page" :key="index">
                    <div
                        :class="[{ active: active === index }, 'box']"
                        v-if="page === 0"
                        @touchend="confirmSelection(index)"
                    >
                        <span :class="active === 5 ? 'title' : 'titles'">{{ item.next }}</span>
                        <img
                            :src="
                                require(`@/assets/img/setting/${
                                    active === 5 ? 'selected_down' : 'not_selected_down'
                                }.png`)
                            "
                            class="down-btn"
                        />
                    </div>
                    <div
                        :class="[{ active: active === index }, 'box']"
                        v-else-if="page === 1"
                        @touchend="confirmSelection(index)"
                    >
                        <span :class="active === 0 ? 'title' : 'titles'">{{ item.prev }}</span>
                        <img
                            :src="
                                require(`@/assets/img/setting/${active === 0 ? 'selected_up' : 'not_selected_up'}.png`)
                            "
                            class="down-btn"
                        />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { LANGUAGELIST } from '../../i18n/langs/languageList'
export default {
    name: 'SettingIndex',
    data() {
        return {
            active: -1,
            items: [
                {
                    selectIcon: 'select_set_item_icon_sound',
                    icon: 'set_item_icon_sound',
                    title: this.$t('setting.index.sheng-yin-she-zhi'),
                    vice: '',
                    page: 'VolumeSetting',
                    // 区别设置项目  0 音量 1 亮度 2 手势 3 打印设置 4 按键指引 5 设备检测 6 动态实验室 7 语言 8 报告获取方式
                    key: 0
                },
                {
                    selectIcon: 'sun-line-s',
                    icon: 'sun-line',
                    title: this.$t('setting.index.ping-mu-liang-du'),
                    vice: '',
                    page: 'LuminanceSetting',
                    key: 1
                },
                {
                    selectIcon: 'select_set_item_icon_gesture',
                    icon: 'set_item_icon_gesture',
                    title: this.$t('setting.index.shou-shi-shi-bie'),
                    vice: '',
                    page: 'DetectSetting',
                    key: 2
                },
                {
                    selectIcon: 'select_set_item_icon_print',
                    icon: 'set_item_icon_print',
                    title: this.$t('setting.index.da-yin-she-zhi'),
                    vice: '',
                    page: 'PrintSetting',
                    key: 3
                },
                // {
                //     selectIcon: 'select-shut-down-line',
                //     icon: 'shut-down-line',
                //     title: this.$t('setting.index.an-jian-zhi-yin'),
                //     vice: '',
                //     page: 'settingBtnGuidance',
                //     key: 4
                // },
                // {
                //     selectIcon: 'select_set_item_icon_device',
                //     icon: 'set_item_icon_device',
                //     title: this.$t('setting.index.she-bei-jian-ce'),
                //     vice: '',
                //     page: 'DeviceSetting',
                //     key: 5
                // },
                {
                    selectIcon: 'global-fill',
                    icon: 'set_item_icon_device',
                    title: this.$t('setting.index.wang-luo-she-zhi'),
                    vice: '',
                    page: 'DeviceSetting',
                    key: 5
                }
            ],
            pages: [
                {
                    id: 0, // 上
                    prev: this.$t('print-list.shang-yi-ye'),
                    isPage: true
                },
                {
                    id: 1, // 下
                    next: this.$t('print-list.xia-yi-ye'),
                    isPage: true
                }
            ],
            // 当前页
            page: 0,
            // 每页条数
            size: 5
        }
    },

    computed: {
        ...mapGetters(['deviceInfo', 'settingInfo', 'deviceErrorIds', 'deviceUsable', 'initMesInfo']),
        // 显示列表
        showItem() {
            // 是否显示分页
            let isShowPage = false
            if (this.items.length > this.size * (this.page + 1) + 1) {
                isShowPage = true
            }
            // 得到列表下标
            let start = 0
            let end = 5
            if (isShowPage) {
                start = this.page * this.size
                end = (this.page + 1) * this.size - 1
            } else {
                start = this.page * this.size
                end = this.items.length - 1
            }
            // 获取设置list
            const list = this.items.slice(start, end + 1)
            // 添加上一页/下一页
            if (this.page === 1) {
                list.splice(0, 0, this.pages[0])
            }
            if (this.page === 0) {
                list.push(this.pages[1])
            }
            // console.log("list",list, "items", this.items, "start", start, "end", end, "page", this.page)
            return list
        },
        // M5游客模式
        tourist() {
            return (
                this.deviceInfo.deviceType !== 4 ||
                ((this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) &&
                    this.deviceInfo.thirdBindType === 0)
            )
        }
    },
    watch: {
        deviceInfo(val, oldVal) {
            if (val.luminance != oldVal.luminance) {
                // this.items[1].vice = `${val.luminance}%`
                this.changeItemValueForKey(1, 'vice', `${val.luminance}%`)
            }
        },
        deep: true //对象内部的属性监听，也叫深度监听
    },

    created() {
        // 初始化按钮
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                },
                {
                    btn: 'add',
                    msg: '加'
                },
                {
                    btn: 'sub',
                    msg: '减'
                }
            ],
            openNotOperated: true
        })
        this.page = this.settingInfo.menuPage
        this.init()
        window.logger.info(`第一个设置项目${JSON.stringify(this.items[0])}`)
    },
    mounted() {
        this.cancelVice()
    },
    methods: {
        // 初始化
        init() {
            window.logger.info(`当前设备类型${this.deviceInfo.deviceType}`)
            // vapro5 开启身高测量绑定
            if (this.deviceInfo.deviceType === 5) {
                this.items.splice(0, 0, {
                    selectIcon: 'heigth',
                    icon: 'heigth',
                    title: '身高测量',
                    vice: this.settingInfo.heightOpen ? '已开启' : '已关闭',
                    page: 'SettingHeigth',
                    key: 10
                })
            }
            // 未对接第三方二维码时显示用户信息绑定方式设置入口
            if (this.deviceInfo.deviceType < 1) {
                this.items.push({
                    selectIcon: 'select_set_item_icon_openArml',
                    icon: 'set_item_icon_openArml',
                    title: this.$t('setting.index.dong-tai-shi-yan-shi'),
                    vice: '已开启',
                    page: 'SettingOpenArml',
                    key: 6
                })
            }
            console.log(this.deviceInfo.deviceType)
            if (this.deviceInfo.deviceType > 0 && this.deviceInfo.deviceType === 3) {
                this.items.push({
                    selectIcon: 'select_set_item_icon_language',
                    icon: 'set_item_icon_language',
                    title: this.$t('setting.index.language'),
                    vice: '',
                    page: 'SettingLanguage',
                    key: 7
                })
            }
            // 获取亮度
            this.brightSetting()
            // 设置亮度初始值
            this.changeItemValueForKey(1, 'vice', `${this.deviceInfo.luminance}%`)
            // 1.未对接第三方二维码时显示用户信息绑定方式设置入口
            // 2.M5游客模式
            if (
                (this.deviceInfo.deviceType > 0 && this.deviceInfo.deviceType !== 4) ||
                ((this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) &&
                    this.deviceInfo.thirdBindType === 0)
            ) {
                this.items.push({
                    selectIcon: 'select_set_report',
                    icon: 'set_report',
                    title: this.$t('setting.check.bao-gao-huo-qu-fang-shi'),
                    vice: '',
                    page: 'settingReportBind',
                    key: 8
                })
            }
            if (
                (this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) &&
                [1, 3].every(
                    (num) => this.initMesInfo.unScanItems.includes(num) && this.deviceInfo.healthPackageEnable !== 2
                )
            ) {
                // 模式设置
                const item = {
                    selectIcon: 'device-mode',
                    icon: 'device-mode',
                    title: this.$t('setting.index.device-mode'),
                    vice:
                        this.settingInfo.deviceMode === 1
                            ? this.$t('setting.index.device-mode-chankang')
                            : this.$t('setting.index.device-mode-standard'),
                    page: 'deviceMode',
                    key: 9
                }
                this.items.splice(0, 0, item)
            }
            if (this.deviceInfo.deviceType === 3) {
                // 模式设置
                this.items.push({
                    selectIcon: 'device-mode',
                    icon: 'device-mode',
                    title: this.$t('beauty.device-mode'),
                    vice: '',
                    page: 'beautyMode',
                    key: 9
                })
            }
            // 停止播放音频
            this.$emit('on-audio-event', 'stopAudio')
            // 更改选中index
            if (this.deviceInfo.operationMode != 1) {
                if (this.deviceInfo.btnStatus) {
                    this.active = this.deviceInfo.btnStatus
                    this.page = this.deviceInfo.menuPage
                } else {
                    this.active = 0
                    this.page = 0
                }
            }
            // 设备当前音量
            this.changeItemValueForKey(0, 'vice', `${this.deviceInfo.volume}%`)
            if (this.deviceInfo.deviceType === 3 && this.$i18n.locale === 'it') {
                this.changeItemValueForKey(0, 'vice', ``)
            }
            // if (this.$i18n.locale === 'fr') {
            //     // this.items[2].vice = ''
            //     // this.items[2].error = this.deviceErrorIds.indexOf(1) > -1 || this.deviceErrorIds.indexOf(2) > -1
            //     this.changeItemValueForKey(2, 'vice', '')
            //     this.changeItemValueForKey(
            //         2,
            //         'error',
            //         this.deviceErrorIds.indexOf(1) > -1 || this.deviceErrorIds.indexOf(2) > -1
            //     )
            // } else {
            this.changeItemValueForKey(
                2,
                'vice',
                this.settingInfo.gestureState === 1
                    ? this.$t('setting.index.yi-kai-qi')
                    : this.$t('setting.index.yi-guan-bi')
            )
            this.changeItemValueForKey(
                2,
                'error',
                this.deviceErrorIds.indexOf(1) > -1 || this.deviceErrorIds.indexOf(2) > -1
            )
            // }
            // 打印模式
            this.changeItemValueForKey(
                3,
                'vice',
                this.settingInfo.printMode === 0
                    ? this.$t('setting.index.yi-guan-bi')
                    : this.$t('setting.index.yi-kai-qi')
            )
            // 动态实验室
            this.changeItemValueForKey(
                6,
                'vice',
                this.settingInfo.dynamicLaboratory === 1
                    ? this.$t('setting.index.yi-kai-qi')
                    : this.$t('setting.index.yi-guan-bi')
            )
            // 语言设置
            if (this.deviceInfo.deviceType > 0 && this.deviceInfo.deviceType !== 4) {
                const getStorage = this.$i18n.locale
                const content = LANGUAGELIST.find((item) => item.language === getStorage).content
                this.changeItemValueForKey(7, 'vice', this.$t(content))
            } else if (this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) {
                this.changeItemValueForKey(7, 'vice', '')
            }
            // this.active = this.settingInfo.menuType
        },
        // 获取屏幕亮度请求设置
        async brightSetting() {
            await this.$hardwareClient.backlightGet()
        },
        // 按键事件
        btnClick(btnType) {
            if ([1, 2].includes(btnType) && this.active === -1) {
                // this.active = this.showItem.length - 1
                this.active = 0
                return
            }
            let xc = 1
            // if (
            //     (this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) &&
            //     this.deviceInfo.thirdBindType > 0
            // ) {
            //     xc = 2
            // }
            // 上
            if (btnType === 1) {
                if (this.active === 0) {
                    this.active = this.showItem.length - xc
                } else {
                    this.active--
                }
                // 下
            } else if (btnType === 2) {
                if (this.active === this.showItem.length - xc) {
                    this.active = 0
                } else {
                    this.active++
                }
                window.logger.info(
                    '当前项目active',
                    this.active,
                    ',this.showItem.length',
                    this.showItem.length,
                    'xc',
                    xc,
                    'deviceInfo.thirdBindType',
                    this.deviceInfo.thirdBindType
                )
                // 确定
            } else if (btnType === 3) {
                this.confirmSelection(this.active)
                // 返回
            } else if (btnType === 7) {
                // 从设置首页返回则恢复默认
                this.$store.commit('CHANGE_SETTING_INFO', {
                    menuType: 0,
                    childActive: 0
                })
                this.$changeViewPage('Home')
            }
        },
        // 确认选中
        confirmSelection(active) {
            this.active = active
            setTimeout(() => {
                if (this.showItem[active].isPage) {
                    if (this.showItem[active].id === 0) {
                        this.page = 0
                        // this.active = 5
                    }
                    if (this.showItem[active].id === 1) {
                        this.page = 1
                        // this.active = 0
                    }
                } else {
                    // 进入子设置页面更新菜单下标
                    console.log(this.page, 8888)
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        menuType: active,
                        menuPage: this.page,
                        childActive: 0
                    })
                    this.$store.commit('CHANGE_DEVICE_INFO', {
                        btnStatus: active,
                        menuPage: this.page
                    })
                    this.$changeViewPage(this.showItem[active].page)
                }
                this.active = -1
            }, 200)
        },
        // 超时未操作处理
        handleNotOperated() {
            // 从设置首页返回则恢复默认
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0,
                menuPage: 0,
                childActive: 0
            })
            this.$changeViewPage('Home')
        },
        changeItemValueForKey(key, valueKey, value) {
            const item = this.items.filter((element) => element.key === key)[0]
            item[valueKey] = value
        },
        // 针对it取消vice
        cancelVice() {
            if (this.deviceInfo.deviceType === 3 && this.$i18n.locale === 'it') {
                this.changeItemValueForKey(1, 'vice', '')
                this.changeItemValueForKey(2, 'vice', '')
                this.changeItemValueForKey(3, 'vice', '')
                this.changeItemValueForKey(4, 'vice', '')
                this.changeItemValueForKey(5, 'vice', '')
                this.changeItemValueForKey(6, 'vice', '')
                this.changeItemValueForKey(7, 'vice', '')
                this.changeItemValueForKey(8, 'vice', '')
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.name === 'Home') {
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0,
                menuPage: 0,
                childActive: 0
            })
        }
        next()
    }
}
</script>
<style lang="less" scoped>
.setting {
    .line {
        position: absolute;
        top: 408px;
        left: 60px;
        display: block;
        width: 960px;
        height: 1px;
        background: #333333;
        box-shadow: 0px 1px 0px 0px rgba(51, 51, 51, 1);
    }

    .items {
        position: absolute;
        width: 100%;
        top: 432px;

        .item {
            position: relative;
            width: 960px;
            margin: 0 auto 24px;
            border: 2px solid #000000;
            box-sizing: border-box;
            .able-click();

            .box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 100%;
                text-align: left;
                margin: 0 auto;
                padding: 60px 0;
                border-radius: 32px;

                .icon-left {
                    position: absolute;
                    left: 48px;
                    width: 72px;
                    height: 72px;
                    transition: all 0.3s;
                }

                .icon-arrow-right {
                    position: absolute;
                    right: 50px;
                    font-size: 34px;
                    color: @text-gray-3;
                    margin: auto;
                }

                h3 {
                    display: inline-block;
                    font-size: 48px;
                    font-weight: 400;
                    font-family: OPPOSansM;
                    line-height: 72px;
                    margin: 0 0 0 192px;
                    color: #e7e9f0;
                }

                span {
                    position: absolute;
                    font-size: 40px;
                    font-family: OPPOSansM;
                    font-weight: normal;
                    line-height: 60px;
                    right: 132px;
                    color: @text-gray-3;
                    margin: auto;

                    img {
                        position: relative;
                        top: 8px;
                        width: 48px;
                        height: 48px;
                        margin-right: 16px;
                        border-radius: 25px;
                    }
                }
                .pro5-color {
                    color: #cccccc;
                }

                // 无线网络样式（已废弃）
                span.isWireless {
                    right: 132px;
                    width: 9em;
                    text-align: right;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                svg {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    left: 0;
                    right: 0px;
                    top: 7px;
                    bottom: 0;
                    margin-right: 16px;
                }
            }

            &.active {
                .active-border();

                .box {
                    h3 {
                        color: #ffffff;
                    }

                    span {
                        color: #ffffff;
                    }

                    .icon-arrow-right {
                        color: #ffffff;
                    }
                }
            }
        }

        .next-page {
            text-align: center;
            position: relative;
            width: 960px;
            // padding: 60px 0 !important;
            margin: 0 auto 24px;
            border: 2px solid #000000;
            box-sizing: border-box;
            .able-click();

            .box {
                padding: 60px 0 !important;

                &.active {
                    padding: 60px 0 !important;
                    .active-border();

                    .title {
                        color: #ffffff;
                    }

                    .titles {
                        color: #e7e9f0;
                    }
                }
            }

            span {
                vertical-align: middle;
            }

            .down-btn {
                width: 68px;
                height: 68px;
                vertical-align: middle;
                margin-left: 48px;
            }
        }
    }
}
&.de {
    .item .box span {
        right: 10vw !important;
    }
}
.ru,
.el {
    .items .item .box h3 {
        margin-left: 152px;
    }
}
</style>
