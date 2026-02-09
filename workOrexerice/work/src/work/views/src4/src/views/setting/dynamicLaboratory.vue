<template>
    <div class="openarml-setting">
        <div class="items">
            <div :class="[{ active: active === 0 }, 'item']">
                <div class="box" @touchend="confirmSelection">
                    <span class="title">{{ items[0].title }}</span>
                    <span class="desc" v-if="settingInfo.dynamicLaboratory === 0">{{ items[0].msg }}</span>
                    <span class="desc" v-else>{{ items[1].msg }}</span>
                    <div :class="[{ close: settingInfo.dynamicLaboratory === 0 }, 'check-trail']">
                        <div class="check-handler"></div>
                    </div>
                </div>
            </div>
            <!-- 动态实验室介绍 -->
            <div class="item error">
                <div class="box">
                    <span class="title">
                        <img src="@img/setting/Tips.png" alt="" />
                        动态实验室介绍
                    </span>
                    <span class="desc descInfo"
                        >维塑动态实验室中提供一系列前瞻性的关节动态评估科研功能，您可以选择打开该功能以加入维塑动态实验室，并帮助我们完善这些功能。</span
                    >
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
            active: -1,
            items: [
                {
                    title: '动态实验室',
                    msg: '开启后将打开【动态实验室】入口，可进行相关功能测量。'
                },
                {
                    msg: '关闭后将关闭【动态实验室】入口，无法进行相关功能测量。'
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
        window.logger.info('动态实验室设置页面')
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
            if (this.settingInfo.dynamicLaboratory === 1) {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    dynamicLaboratory: 0
                })
            } else {
                this.$store.commit('CHANGE_SETTING_INFO', {
                    dynamicLaboratory: 1
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
            height: 288px;
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
                    position: absolute;
                    right: 48px;
                    top: 78px;
                    display: flex;
                    align-items: center;
                    width: 136px;
                    height: 80px;
                    background: @color-green;
                    border-radius: 40px;
                    .check-handler {
                        display: flex;
                        margin-left: 68px;
                        justify-content: center;
                        align-items: center;
                        width: 56px;
                        height: 56px;
                        background: #ffffff;
                        border-radius: 50%;
                        box-sizing: border-box;
                        transition: all 0.5s ease;
                    }
                    &.close {
                        width: 126px;
                        height: 70px;
                        background: @color-background;
                        border-radius: 40px;
                        border: 4px solid #649cff;
                        .check-handler {
                            margin-left: 12px;
                            background: rgba(255, 255, 255, 0.64);
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
