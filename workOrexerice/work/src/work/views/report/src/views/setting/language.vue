<template>
    <div class="language-setting">
        <div
            v-for="(item, index) in itemsPage"
            :key="index"
            @touchend="confirmSelection(index)"
            :class="active === index ? 'active items' : 'items'"
        >
            <div v-if="item.title" class="lang-setting">
                <span :class="active === index ? 'title' : 'titles'">{{ item.title }}</span>
                <img
                    :src="require(`@/assets/img/setting/${checked === index ? 'selected' : 'not_selected'}.svg`)"
                    alt
                />
            </div>
            <!-- 页码 -->
            <div v-else class="next-page">
                <div v-if="item.next">
                    <span :class="active === 5 && selectPage === 0 ? 'title' : 'titles'">{{ item.next }}</span>
                    <img
                        :src="
                            require(`@/assets/img/setting/${
                                active === 5 && selectPage === 0 ? 'selected_down' : 'not_selected_down'
                            }.png`)
                        "
                        class="down-btn"
                    />
                </div>
                <div v-else>
                    <span :class="active === 0 && selectPage === 1 ? 'title' : 'titles'">{{ item.prev }}</span>
                    <img
                        :src="
                            require(`@/assets/img/setting/${
                                active === 0 && selectPage === 1 ? 'selected_up' : 'not_selected_up'
                            }.png`)
                        "
                        class="down-btn"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { LANGUAGELIST } from '../../i18n/langs/languageList'
import localConfig from '@/config/local'
import { changeThis } from '@/config/error-reason'
export default {
    name: 'LanguageSetting',
    data() {
        return {
            active: -1,
            checked: -1,
            items: [
                {
                    title: this.$t('setting.index.languageTitleOne')
                },
                // {
                //     title: this.$t('setting.index.languageTitleThree')
                // },
                // {
                //     title: this.$t('setting.index.languageTitleFive')
                // },
                {
                    title: this.$t('setting.index.languageTitleFour')
                },
                {
                    title: this.$t('setting.index.languageTitleEight')
                },
                {
                    title: this.$t('setting.index.languageTitleSeven')
                },
                {
                    title: this.$t('setting.index.languageTitleSex')
                },
                {
                    id: 1, // 下
                    next: this.$t('print-list.xia-yi-ye')
                },
                {
                    id: 0, // 上
                    prev: this.$t('print-list.shang-yi-ye')
                },
                {
                    title: this.$t('setting.index.languageTitleNine')
                },
                {
                    title: this.$t('setting.index.languageTitleFive')
                },
                {
                    title: this.$t('setting.index.languageTitleTwo')
                },
                {
                    title: this.$t('setting.index.languageTitleTen')
                },
                {
                    title: this.$t('setting.index.languageTitleEleven')
                },
                {
                    id: 1, // 下
                    next: this.$t('print-list.xia-yi-ye')
                },
                {
                    id: 0, // 上
                    prev: this.$t('print-list.shang-yi-ye')
                },
                {
                    title: this.$t('setting.index.languageTitleTwelve')
                },
                {
                    title: this.$t('setting.index.languageTitleThirteen')
                },
                {
                    title: this.$t('setting.index.languageTitleFourteen')
                }
            ],
            itemsPage: [],
            // 页数
            selectPage: 0,
            // 语言下标
            selectIndex: 0,
            // 每页条数
            size: 6
        }
    },
    computed: {
        ...mapGetters({
            settingInfo: 'settingInfo'
        }),
        maxPages() {
            return Math.floor(this.items.length / this.size)
        },
        lastPageSize() {
            return this.items.length % this.size
        }
    },
    created() {
        window.logger.info('进入语言设置页面')
        this.$store.commit('CHANGE_PAGE_INFO', {
            topInfo: true,
            navigation: this.$t('navigation-bar.she-zhi'),
            title: this.$t('setting.check.yu-yan'),
            bottomInfo: true,
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
        if (localConfig.getItem('_vf_i18n')) {
            console.log(`当前选中语言${this.$i18n.locale}`)
            this.selectAuto(this.$i18n.locale, true)
        } else {
            this.selectAuto(this.selectIndex.i18n, true)
        }
        if (this.deviceInfo.operationMode != 1) this.active = 0
    },
    methods: {
        // 触屏选择
        confirmSelection(index) {
            // if ((index == 0 && this.itemsPage.length < 5) || index == 5) {
            //     this.active = index
            //     setTimeout(() => {
            //         this.active = -1
            //     }, 300)
            // } else {
            //     this.active = -1
            // }
            let checkupIndex = (this.active = index)
            if (this.active === 5 && this.selectPage === 0) {
                // 下一页
                this.selectPage++
                if (this.selectPage === 1) {
                    this.itemsPage = this.items.slice(6, 13)
                } else if (this.selectPage === 2) {
                    this.itemsPage = this.items.slice(13, this.items.length)
                }
                this.active = 0
                if (this.selectIndex < 5) {
                    this.checked = null
                } else {
                    this.checked = this.selectIndex - 4
                }
                this.updateItemsPage()
                return
            } else if (this.active === 6 && this.selectPage === 1) {
                // 下一页
                this.selectPage++
                if (this.selectPage === 2) {
                    this.itemsPage = this.items.slice(13, this.items.length)
                }
                this.active = 0
                if (this.selectIndex < 10) {
                    this.checked = null
                } else {
                    this.checked = this.selectIndex - 9
                }
                this.updateItemsPage()
                return
            } else if (this.active === 0 && [1, 2].includes(this.selectPage)) {
                // 上一页
                this.selectPage--
                if (this.selectPage === 1) {
                    this.itemsPage = this.items.slice(6, 13)
                    if (this.selectIndex > 5 && this.selectIndex < 10) {
                        this.checked = this.selectIndex - 6
                    } else {
                        this.checked = null
                    }
                } else if (this.selectPage === 0) {
                    this.itemsPage = this.items.slice(0, 6)
                    if (this.selectIndex < 6) {
                        this.checked = this.selectIndex
                    } else {
                        this.checked = null
                    }
                }
                this.active = this.itemsPage.length - 1
                this.updateItemsPage()
                return
            }
            // 触屏选择
            if (this.selectPage === 1) {
                checkupIndex = checkupIndex + 6
            } else if (this.selectPage === 2) {
                checkupIndex = checkupIndex + 13
            }
            console.log(`当前判断逻辑${checkupIndex} ${index}`)
            this.selectSwitch(checkupIndex, true)
        },
        // 默认选中样式的标识
        selectAuto(getStorage, controller) {
            let value = LANGUAGELIST.findIndex((item) => item.language === getStorage)
            console.log('这个value的值是：', value)
            this.checked = value
            this.selectIndex = value
            if (value > 4 && value < 10) {
                this.selectPage = 1
                value = value - 4
                this.active = this.checked = value
                this.itemsPage = this.items.slice(6, 13)
            } else if (value > 9 && value < 16) {
                this.selectPage = 2
                value = value - 9
                this.active = this.checked = value
                this.itemsPage = this.items.slice(13, this.items.length)
            } else {
                this.selectPage = 0
                this.active = this.checked = value
                this.itemsPage = this.items.slice(0, 6)
            }
            if (!controller) {
                this.active = -1
            }
            // console.log(`当前选中项目${this.active}`)
            // TODO
            // this.active = 0
        },
        // 按键事件
        btnClick(btnType) {
            if (btnType === 1) {
                // 上
                this.active--
                if (this.active < 0) {
                    this.active = this.itemsPage.length - 1
                }
            } else if (btnType === 2) {
                // 下
                this.active++
                if (this.active >= this.itemsPage.length) {
                    this.active = 0
                }
            } else if (btnType === 3) {
                // 确定
                if (this.active < 0) return
                // 按钮模式
                if (this.active === 5 && this.selectPage === 0) {
                    // 下一页
                    this.selectPage++
                    if (this.selectPage === 1) {
                        this.itemsPage = this.items.slice(6, 13)
                    } else if (this.selectPage === 2) {
                        this.itemsPage = this.items.slice(13, this.items.length)
                    }
                    this.active = 0
                    if (this.selectIndex < 5) {
                        this.checked = null
                    } else {
                        this.checked = this.selectIndex - 4
                    }
                    this.updateItemsPage()
                    return
                } else if (this.active === 6 && this.selectPage === 1) {
                    // 下一页
                    this.selectPage++
                    if (this.selectPage === 2) {
                        this.itemsPage = this.items.slice(13, this.items.length)
                    }
                    this.active = 0
                    if (this.selectIndex < 10) {
                        this.checked = null
                    } else {
                        this.checked = this.selectIndex - 9
                    }
                    this.updateItemsPage()
                    return
                } else if (this.active === 0 && [1, 2].includes(this.selectPage)) {
                    // 上一页
                    this.selectPage--
                    if (this.selectPage === 1) {
                        this.itemsPage = this.items.slice(6, 13)
                        if (this.selectIndex > 5 && this.selectIndex < 10) {
                            this.checked = this.selectIndex - 6
                        } else {
                            this.checked = null
                        }
                    } else if (this.selectPage === 0) {
                        this.itemsPage = this.items.slice(0, 6)
                        if (this.selectIndex < 6) {
                            this.checked = this.selectIndex
                        } else {
                            this.checked = null
                        }
                    }
                    this.active = this.itemsPage.length - 1
                    this.updateItemsPage()
                    return
                }

                let checkupIndex = this.active
                // 触屏选择
                if (this.selectPage === 1) {
                    checkupIndex = checkupIndex + 6
                } else if (this.selectPage === 2) {
                    checkupIndex = checkupIndex + 13
                }
                console.log(`当前判断逻辑${checkupIndex} ${this.active}`)
                this.selectSwitch(checkupIndex, true)
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        // 语言选择
        selectSwitch(checkupIndex, controller) {
            const i18nMap = [
                'en',
                'es',
                'pt',
                'tr',
                'fr',
                null,
                null,
                'it',
                'de',
                'zh',
                'el',
                'ru',
                null,
                null,
                'hu',
                'zhcht',
                'zhtw'
            ]
            const i18n = i18nMap[checkupIndex]
            this.selectAuto(i18n, controller)
            this.$root.$i18n.locale = i18n
            this.$store.commit('CHANGE_SETTING_INFO', { i18n: i18n })
            changeThis(this)
            this.updateItemsPage()
        },
        // 语言更新
        updateItemsPage() {
            this.itemsPage.forEach((item) => {
                if (item.id === 0) {
                    item.prev = this.$t('print-list.shang-yi-ye')
                } else if (item.id === 1) {
                    item.next = this.$t('print-list.xia-yi-ye')
                }
            })
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$changeViewPage('Home')
        }
    }
}
</script>
<style lang="less" scoped>
.language-setting {
    margin: 432px 0 0 0;

    .items {
        height: 192px;
        margin: 0 60px 24px 60px;
        padding: 0 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 32px;
        .able-click();

        .next-page {
            width: 100%;
            text-align: center;

            span {
                vertical-align: middle;
            }

            .down-btn {
                width: 68px;
                height: 68px;
                vertical-align: middle;
            }
        }

        .lang-setting {
            width: 100%;
            padding: 0 48px;
            display: flex;
            justify-content: space-between;

            img {
                width: 64px;
                height: 64px;
            }
        }

        .title {
            color: #ffffff;
        }

        .titles {
            color: #e7e9f0;
        }
    }

    .active {
        background: @color-click;
    }
}
</style>
