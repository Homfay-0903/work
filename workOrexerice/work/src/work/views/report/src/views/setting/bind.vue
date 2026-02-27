<template>
    <div class="bind-setting">
        <div
            v-for="(item, index) in items"
            :key="index"
            @touchend="confirmSelection(index)"
            :class="active === index ? 'active items' : 'items'"
        >
            <div>
                <span class="title">{{ item.title }}</span>
                <span class="msg">{{ item.msg }}</span>
            </div>
            <img :src="require(`@/assets/img/setting/${checked === index ? 'selected' : 'not_selected'}.svg`)" alt />
        </div>
        <template>
            <div v-if="deviceInfo.deviceType === 5">
                <p>设备端查看报告设置</p>
                <div class="items">
                    <div class="box" @touchend="setupDeviceViewReport()">
                        <span class="title">设备端查看报告</span>
                        <span class="desc">开启后，使用手机扫描二维码，在手机端完成用户绑定后，设备端同步展示报告</span>
                        <div :class="[{ close: !settingInfo.deviceViewReport }, 'check-trail']">
                            <div class="check-handler"></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            active: 0,
            checked: false,
            items: [
                {
                    title: this.$t('setting.bind.guan-li-ping-tai'),
                    msg: this.$t('setting.bind.guan-li-ping-tai_desc')
                },
                {
                    title: this.$t('setting.bind.er-wei-ma'),
                    msg: this.$t('setting.bind.er-wei-ma_desc')
                }
            ]
        }
    },
    computed: mapGetters({
        settingInfo: 'settingInfo'
    }),
    created() {
        window.logger.info('进入报告获取方式设置页面')
        this.$store.commit('CHANGE_PAGE_INFO', {
            topInfo: true,
            navigation: this.$t('navigation-bar.she-zhi'),
            title: this.$t('setting.check.bao-gao-huo-qu-fang-shi'),
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
        this.active = this.checked = this.settingInfo.reportbindType - 1
        if (this.deviceInfo.operationMode != 1) this.active = this.settingInfo.reportbindType - 1
    },
    methods: {
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                if (this.active === 0) {
                    this.active = this.items.length - 1
                } else {
                    if (this.active < -1) {
                        this.active = 0
                    } else {
                        this.active--
                    }
                }
                // 下
            } else if (btnType === 2) {
                if (this.active === this.items.length - 1) {
                    this.active = 0
                } else {
                    this.active++
                }
                // 确定
            } else if (btnType === 3) {
                if (this.active > -1) {
                    this.checked = this.active
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        reportbindType: this.active === 1 ? 2 : 1
                    })
                }
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        // 触屏选择
        confirmSelection(index) {
            this.active = index
            this.checked = index
            this.$store.commit('CHANGE_SETTING_INFO', {
                reportbindType: index === 1 ? 2 : 1
            })
        },
        setupDeviceViewReport() {
            this.$store.commit('CHANGE_SETTING_INFO', {
                deviceViewReport: !this.settingInfo.deviceViewReport
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
.bind-setting {
    margin: 432px 0 0 0;

    .items {
        // height: 192px;
        margin: 0 60px 24px 60px;
        padding: 48px !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 32px;
        .able-click();
        div {
            display: flex;
            flex-direction: column;
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
        .box {
            // padding: 48px 0 48px 48px;
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
                flex-direction: row;
                align-items: center;
                position: absolute;
                right: 0px;
                top: 24px;
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
                    .check-handler {
                        margin-left: 12px;
                        background: rgba(255, 255, 255, 0.64);
                    }
                }
            }
        }
    }

    .active {
        background: @color-click;
        color: #cccccc;
    }
    p {
        margin-top: 72px;
        margin-left: 60px;
        height: 48px;
        font-size: 32px;
        font-weight: normal;
        color: #999999;
        line-height: 48px;
    }
}
</style>
