<template>
    <div class="openarml-setting">
        <div class="items">
            <div :class="[{ active: active === 0 }, 'item']">
                <div class="box" @touchend="confirmSelection">
                    <span class="title">{{ items[0].title }}</span>
                    <span class="desc" v-if="settingInfo.heightOpen === 0">{{ items[0].msg }}</span>
                    <span class="desc" v-else>{{ items[1].msg }}</span>
                    <div :class="[{ close: settingInfo.heightOpen === 0 }, 'check-trail']">
                        <div class="check-handler"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'OpenArmlSetting',
    data() {
        return {
            active: 0,
            items: [
                {
                    title: '身高测量',
                    msg: '开启后设备可进行身高测量，并支持手动调整'
                },
                {
                    msg: '关闭后将在登录/注册时输入身高'
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
        window.logger.info('身高设置页面')
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ],
            openNotOperated: true
        })
    },

    methods: {
        // 按键事件
        btnClick(btnType) {
            if ([1, 2].includes(btnType) && this.active === -1) {
                this.active = 0
                return
            }
            // 确定
            if (btnType === 3) {
                this.confirmSelection()
                // 返回
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        confirmSelection() {
            if (this.settingInfo.heightOpen === 1) {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    heightOpen: 0
                })
            } else {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    heightOpen: 1
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
// @import '@/assets/css/common.less';
.openarml-setting {
    .items {
        position: absolute;
        width: 100%;
        top: 432px;
        .item {
            position: relative;
            width: 960px;
            height: 240px;
            margin: 0 auto 24px;
            border-radius: 32px;
            .able-click();
            &.height-add {
                height: 360px;
            }
            .box {
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
                height: 100%;
                text-align: left;
                margin: 0 auto;
                .title {
                    position: absolute;
                    display: inline-block;
                    left: 48px;
                    top: 48px;
                    font-size: 48px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #e7e9f0;
                    line-height: 72px;
                    margin-bottom: 24px;
                }
                .desc {
                    position: absolute;
                    display: inline-block;
                    margin-bottom: 48px;
                    left: 48px;
                    top: 144px;
                    width: 680px;
                    color: #666666;
                    font-size: 32px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #cccccc;
                    line-height: 48px;
                }
                .descInfo {
                    width: 864px;
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
                        margin-left: 68px;
                        width: 56px;
                        height: 56px;
                        background: #ffffff;
                        border-radius: 50%;
                        box-sizing: border-box;
                        transition: all 0.5s ease;
                    }
                    &.close {
                        width: 128px;
                        height: 72px;
                        display: flex;
                        align-items: center;
                        background: transparent;
                        border-radius: 40px;
                        border: 4px solid @color-light-blue;
                        position: absolute;
                        right: 48px;
                        top: 48px;
                        .check-handler {
                            margin-left: 12px;
                            background: #ffffff;
                        }
                    }
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
            }

            &.error {
                height: 336px;
                background: #333333;
                border-radius: 32px;
                .title {
                    display: flex;
                    align-items: center;
                    font-size: 48px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #e7e9f0;
                    line-height: 72px;
                    img {
                        display: inline-block;
                        width: 66px;
                        height: 66px;
                        margin-right: 16px;
                        border-radius: 25px;
                    }
                }
                .desc {
                    padding-right: 20px;
                    font-size: 32px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #cccccc;
                    line-height: 48px;
                }
            }
        }
    }
}
</style>
