<!--
 * @Description: 打印设置页面
 * @Author: gaoyuanyuan
 * @Date: 2019-10-17 15:40:52
 * @LastEditors: liutq
 * @LastEditTime: 2025-10-15 16:45:53
 -->
<template>
    <div class="print-setting">
        <div class="items">
            <div :class="[{ active: active === 0 }, 'item']">
                <div class="box" @touchend="confirmSelection(0)">
                    <span class="title">{{ items[0].title }}</span>
                    <span class="desc">{{ items[0].msg }}</span>
                    <div :class="[{ close: settingInfo.printMode === 0 }, 'check-trail']">
                        <div class="check-handler"></div>
                    </div>
                </div>
            </div>
            <template v-if="settingInfo.printMode !== 0">
                <p>{{ $t('setting.print.da-yin-ren-wu-she-zhi') }}</p>
                <div :class="[{ active: active === 1 }, 'item']">
                    <div class="box" @touchend="confirmSelection(1)">
                        <span class="title">{{ items[1].title }}</span>
                        <span class="desc">{{ items[1].msg }}</span>
                        <img
                            :src="
                                require(`@img/setting/${settingInfo.printMode === 2 ? 'selected' : 'not_selected'}.svg`)
                            "
                            class="icon-right"
                            alt
                        />
                    </div>
                </div>
                <div :class="[{ active: active === 2 }, 'item']">
                    <div class="box" @touchend="confirmSelection(2)">
                        <span class="title">{{ items[2].title }}</span>
                        <span class="desc">{{ items[2].msg }}</span>
                        <img
                            :src="
                                require(`@img/setting/${settingInfo.printMode === 1 ? 'selected' : 'not_selected'}.svg`)
                            "
                            class="icon-right"
                            alt
                        />
                    </div>
                </div>
                <div v-if="items[3]" :class="[{ active: active === 3 }, 'item']">
                    <div class="box1" @touchend="confirmSelection(3)">
                        <span class="title">{{ items[3].title }}</span>
                        <span class="desc">{{ items[3].msg }}</span>
                        <i :class="['iconfont', 'icon-arrow-right']"></i>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'PrintSetting',
    data() {
        return {
            // 当前显示的下标
            active: 0,
            itemSum: 0,
            // 当前打印设置模式的下标
            mode: 0,
            items: [
                {
                    title: this.$t('setting.print.da-yin-gong-neng'),
                    msg: this.$t('setting.print.da-yin-gong-neng_desc[0]')
                },
                {
                    title: this.$t('setting.shou-dong-da-yin'),
                    msg: this.$t('setting.print.shou-dong-da-yin_desc')
                },
                {
                    title: this.$t('setting.zi-dong-da-yin'),
                    msg: this.$t('setting.print.zi-dong-da-yin_desc')
                }
            ]
        }
    },

    computed: mapGetters({
        settingInfo: 'settingInfo',
        deviceInfo: 'deviceInfo'
    }),

    beforeDestroy() {},

    created() {
        if (this.deviceInfo.operationMode != 1) this.active = 0
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
        if (this.deviceInfo.deviceType === 3) {
            const data = ['Letter', 'Legal', 'Executive', 'A4']
            // 获取纸张大小
            this.items.push({
                title: this.$t('navigation-bar.zhi-zhang-gui-ge'),
                msg: data[this.settingInfo.pageSize - 1]
            })
        }
        if (this.settingInfo.printMode === 0) {
            this.itemSum = 1
            this.items[0].msg = this.$t('setting.print.da-yin-gong-neng_desc[1]')
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList: [
                    {
                        btn: 'switch',
                        msg: '电源'
                    }
                ]
            })
        } else {
            if (this.deviceInfo.deviceType === 3) {
                this.itemSum = 4
            } else {
                this.itemSum = 3
            }
        }
    },

    methods: {
        // 按键事件
        btnClick(btnType) {
            if ([1, 2].includes(btnType) && this.active === -1) {
                this.active = 0
                return
            }
            // 上
            if (btnType === 1) {
                if (this.active === 0) {
                    this.active = this.itemSum - 1
                } else {
                    this.active--
                }
                // 下
            } else if (btnType === 2) {
                if (this.active === this.itemSum - 1) {
                    this.active = 0
                } else {
                    this.active++
                }
                // 确定
            } else if (btnType === 3) {
                this.confirmSelection(this.active)
                // 返回
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
            if (this.active !== 0) {
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
                    ]
                })
            } else {
                if (this.settingInfo.printMode === 0) {
                    this.$store.commit('CHANGE_PAGE_INFO', {
                        btnList: [
                            {
                                btn: 'switch',
                                msg: '电源'
                            }
                        ]
                    })
                } else {
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
                        ]
                    })
                }
            }
        },
        // 确认选中
        confirmSelection(active) {
            this.active = active

            if (active === 3) {
                this.$changeViewPage('PageSize')
            }
            if (active === 0) {
                if (this.settingInfo.printMode === 0) {
                    // 设置打印模式
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        printMode: 2
                    })
                    this.items[0].msg = this.$t('setting.print.da-yin-gong-neng_desc[0]')
                    if (this.deviceInfo.deviceType === 3) {
                        this.itemSum = 4
                    } else {
                        this.itemSum = 3
                    }
                    // 默认高亮
                    // this.active = 1
                    this.$store.commit('CHANGE_PAGE_INFO', {
                        btnList: [
                            {
                                btn: 'select',
                                msg: '选择'
                            },
                            {
                                btn: 'check',
                                msg: '关闭'
                            },
                            {
                                btn: 'return',
                                msg: '返回'
                            }
                        ]
                    })
                } else {
                    // 设置打印模式
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        printMode: 0
                    })
                    this.items[0].msg = this.$t('setting.print.da-yin-gong-neng_desc[1]')
                    this.itemSum = 1
                    this.$store.commit('CHANGE_PAGE_INFO', {
                        btnList: [
                            {
                                btn: 'check',
                                msg: '开启'
                            },
                            {
                                btn: 'return',
                                msg: '返回'
                            }
                        ]
                    })
                }
            }
            // 设置打印模式
            else {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    printMode: active === 1 ? 2 : 1
                })
            }
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0
            })
            this.$changeViewPage('Home')
        }
    }
}
</script>
<style lang="less" scoped>
.print-setting {
    .items {
        position: absolute;
        width: 100%;
        top: 432px;

        .item {
            position: relative;
            width: 956px;
            // height: 240px;
            margin: 0 auto 24px;
            border-radius: 32px;
            .able-click();

            .box1 {
                height: 192px;
                margin-top: 48px;
                display: flex;
                justify-content: space-between;
                padding: 0 48px;
                border-radius: 32px;
                span {
                    color: #e7e9f0;
                    font-size: 48px;
                    line-height: 72px;
                    display: inline-block;
                    padding: 60px 0;
                }
                .desc {
                    font-size: 40px;
                    color: #999999;
                    line-height: 60px;
                    text-align: center;
                    font-style: normal;
                    text-align: right;
                    margin-right: 70px;
                }

                .icon-arrow-right {
                    position: absolute;
                    right: 48px;
                    top: 78px;
                    font-size: 34px;
                    color: @text-gray-3;
                    margin: auto;
                    width: 48px;
                    height: 48px;

                    &.it {
                        right: 30px;
                    }
                }
            }

            .box {
                padding: 48px 0 48px 48px;
                position: relative;

                .title {
                    font-size: 48px;
                    font-family: OPPOSansR;
                    display: inline-block;
                    width: 100%;
                    margin-bottom: 24px;
                    font-weight: normal;
                    color: #e7e9f0;
                    line-height: 72px;
                }

                .desc {
                    font-size: 32px;
                    display: inline-block;
                    width: calc(100% - 136px - 48px - 32px - 8px);
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #cccccc;
                    line-height: 48px;
                }

                .check-trail {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    right: 48px;
                    top: 48px;
                    width: 136px;
                    height: 80px;
                    background: @color-green;
                    border-radius: 40px;

                    .check-handler {
                        margin-left: 58px;
                        width: 58px;
                        height: 58px;
                        background: #ffffff !important;
                        border-radius: 50%;
                        box-sizing: border-box;
                        transition: all 0.5s ease;
                    }

                    &.close {
                        width: 128px;
                        height: 72px;
                        display: flex;
                        align-items: center;
                        // background: rgba(255, 255, 255, 0.2);
                        background: transparent;
                        border-radius: 40px;
                        border: 4px solid @color-light-blue;
                        position: absolute;
                        right: 48px;
                        top: 48px;

                        .check-handler {
                            margin-left: 12px;
                            // background: rgba(255, 255, 255, 0.64);
                            background: #ffffff;
                        }
                    }
                }

                .icon-right {
                    position: absolute;
                    top: 52px;
                    right: 48px;
                    width: 64px;
                    height: 64px;
                    transition: all 0.3s;
                }
            }

            &.active {
                .active-border();

                .box {
                    .title {
                        color: #ffffff;
                    }

                    .desc {
                        color: #e7e9f0;
                    }
                }
                .box1 {
                    .title {
                        color: #ffffff;
                    }

                    .desc {
                        color: #e7e9f0;
                    }
                }
            }
        }

        p {
            margin-top: 72px;
            margin-left: 60px;
            // width: 192px;
            height: 48px;
            font-size: 32px;
            font-weight: normal;
            color: @text-gray-3;
            line-height: 48px;
        }
    }
}
</style>
