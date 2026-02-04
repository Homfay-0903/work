<template>
    <div class="bind-setting">
        <div
            v-for="(item, index) in items"
            :key="index"
            @touchend="confirmSelection(index)"
            :class="active === index ? 'active items' : 'items'"
        >
            <div>
                <span class="title">{{ item.title }} </span>
                <span
                    v-if="index === 1 && !deviceInfo.beautyEnable && deviceInfo.deviceType === 3"
                    class="msg"
                    style="display: contents"
                    >{{ $t('beauty.device-mode-beauty-desc1') }}</span
                >
                <span v-else class="msg">{{ item.msg }} </span>
            </div>
            <img
                :src="
                    require(`@/assets/img/setting/${
                        checked === index
                            ? 'selected'
                            : !deviceInfo.beautyEnable && index === 1 && deviceInfo.deviceType === 3
                            ? 'jinyong'
                            : 'not_selected'
                    }.svg`)
                "
                alt
            />
        </div>
        <h1 class="title2">{{ $t('Athlete.title') }}</h1>
        <div @touchend="confirmSelection(2)" :class="active === 2 ? 'active items' : 'items'">
            <div>
                <span class="title">{{ $t('Athlete.title2') }} </span>
                <span class="msg" style="display: contents">{{ $t('Athlete.desc1') }}</span>
            </div>
            <div :class="[{ close: settingInfo.Athlete === 0 }, 'check-trail']">
                <div class="check-handler"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            active: -1,
            checked: false,
            items: [
                {
                    title: this.$t('beauty.device-mode-standard'),
                    msg: this.$t('beauty.device-mode-standard_des')
                },
                {
                    title: this.$t('beauty.device-mode-beauty'),
                    msg: this.$t('beauty.device-mode-beauty-desc')
                }
            ]
        }
    },
    computed: mapGetters({
        settingInfo: 'settingInfo',
        deviceInfo: 'deviceInfo'
    }),
    created() {
        window.logger.info('进入测量模式设置页面')
        this.$store.commit('CHANGE_PAGE_INFO', {
            topInfo: true,
            navigation: this.$t('navigation-bar.she-zhi'),
            title: this.$t('beauty.device-mode'),
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
        this.active = this.checked = this.settingInfo.beauty - 1 ? 0 : 1
        if (this.deviceInfo.operationMode != 1) this.active = this.settingInfo.beauty - 1 ? 0 : 1
    },
    methods: {
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                if (!this.deviceInfo.beautyEnable && this.deviceInfo.deviceType === 3) {
                    if (this.active === 0) {
                        this.active = 2
                    } else {
                        this.active = 0
                    }
                    return
                }
                if (this.active === 0) {
                    this.active = 2
                } else {
                    if (this.active < -1) {
                        this.active = 0
                    } else {
                        this.active--
                    }
                }
                // 下
            } else if (btnType === 2) {
                if (!this.deviceInfo.beautyEnable && this.deviceInfo.deviceType === 3) {
                    if (this.active === 2) {
                        this.active = 0
                    } else {
                        this.active = 2
                    }
                    return
                }
                if (this.active === 2) {
                    this.active = 0
                } else {
                    this.active++
                }
                // 确定
            } else if (btnType === 3) {
                if (this.active > -1) {
                    if (this.active < 2) {
                        this.checked = this.active
                        this.$store.commit('CHANGE_SETTING_INFO', {
                            beauty: this.active === 1 ? 1 : 0
                        })
                    } else {
                        this.Athlete = this.settingInfo.Athlete === 1 ? 0 : 1
                        this.$store.commit('CHANGE_SETTING_INFO', {
                            Athlete: this.Athlete
                        })
                    }
                }
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        // 触屏选择
        confirmSelection(index) {
            if (!this.deviceInfo.beautyEnable && this.deviceInfo.deviceType === 3) {
                if (index === 2) {
                    this.Athlete = this.settingInfo.Athlete === 1 ? 0 : 1
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        Athlete: this.Athlete
                    })
                }
                if (index !== 1) {
                    this.active = index
                }
                return
            }
            if (index < 2) {
                this.checked = index
                this.$store.commit('CHANGE_SETTING_INFO', {
                    beauty: index === 1 ? 1 : 0
                })
            } else {
                this.Athlete = this.settingInfo.Athlete === 1 ? 0 : 1
                this.$store.commit('CHANGE_SETTING_INFO', {
                    Athlete: this.Athlete
                })
            }
            this.active = index

            // this.checked = index
            // this.$store.commit('CHANGE_SETTING_INFO', {
            //     beauty: index === 1 ? 1 : 0
            // })
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$changeViewPage('Home')
        }
    }
}
</script>

<style lang="less" scoped>
.bind-setting {
    margin: 432px 0 0 0;

    .title2 {
        margin: 60px 60px 24px 60px;
        font-size: 32px;
        color: #999999;
        line-height: 48px;
        text-align: left;
        font-style: normal;
    }

    .items {
        // height: 192px;
        margin: 0 60px 24px 60px;
        padding: 48px !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 32px;
        position: relative;
        .able-click();
        div {
            // display: flex;
            // flex-direction: column;
            font-family: OPPOSansR;
            color: #e7e9f0;
            font-weight: normal;

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
            .msg {
                font-size: 32px;
                width: 768px;
                display: inline-block;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #cccccc;
                line-height: 48px;
            }
        }
        img {
            width: 64px;
            height: 64px;
            align-self: flex-start;
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
                background: rgba(255, 255, 255, 0.2);
                border-radius: 40px;
                border: 4px solid @color-light-blue;
                position: absolute;
                right: 48px;
                top: 48px;
                .check-handler {
                    margin-left: 12px;
                    background: rgba(255, 255, 255, 0.64);
                }
            }
        }
        .icon-arrow-right {
            position: absolute;
            top: 60px;
            right: 50px;
            font-size: 34px;
            color: @text-gray-3;
            margin: auto;
        }
    }

    .active {
        background: @color-click;
        color: #cccccc;
    }
}
</style>
