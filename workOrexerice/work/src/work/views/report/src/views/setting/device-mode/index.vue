<template>
    <div class="bind-setting">
        <div
            v-for="(item, index) in items"
            :key="index"
            @touchend="confirmSelection(index)"
            :class="active === index ? 'active items' : 'items'"
        >
            <div>
                <span class="title"
                    >{{ item.title }}
                    <b
                        v-if="index === 1 && !deviceInfo.healthPackageEnable && deviceInfo.deviceType === 5"
                        style="font-weight: 400; font-size: 16px"
                        >*升级后可使用, 如需升级请联系对应销售</b
                    ></span
                >
                <span class="msg">{{ item.msg }}</span>
            </div>
            <img
                :src="
                    require(`@/assets/img/setting/${
                        checked === index
                            ? 'selected'
                            : !deviceInfo.healthPackageEnable && index === 1 && deviceInfo.deviceType === 5
                            ? 'jinyong'
                            : 'not_selected'
                    }.svg`)
                "
                alt
            />
        </div>
        <template>
            <div v-if="settingInfo.triMode">
                <p>快速测量设置</p>
                <div :class="active === 2 ? 'active items' : 'items'">
                    <div class="box" @touchend="setupDeviceViewReport()">
                        <span class="title">快速测量</span>
                        <span class="desc"
                            >旋转一圈即可完成体态和体围测量，但测量时的姿势差异可能导致体态评估结果略有不同。</span
                        >
                        <div :class="[{ close: !settingInfo.combineMeasureEnable }, 'check-trail']">
                            <div class="check-handler"></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <h1 class="title2" v-if="isShowAthlete">
            {{ $t('Athlete.title') }}
        </h1>
        <div @touchend="confirmSelection(3)" :class="active === 3 ? 'active items' : 'items'" v-if="isShowAthlete">
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
                    title: this.$t('setting.index.device-mode-standard'),
                    msg: this.$t('setting.measure-mode.device-mode-standard_des')
                },
                {
                    title: this.$t('setting.index.device-mode-chankang'),
                    msg: this.$t('setting.measure-mode.device-mode-chankang_des')
                }
            ]
        }
    },
    computed: {
        ...mapGetters({
            settingInfo: 'settingInfo',
            deviceInfo: 'deviceInfo'
        }),
        isShowAthlete() {
            return this.deviceInfo.isUnStdMode && this.deviceInfo.deviceType === 5 && this.settingInfo.deviceMode === 2
        }
    },
    created() {
        window.logger.info('进入测量模式设置页面')
        this.$store.commit('CHANGE_PAGE_INFO', {
            topInfo: true,
            navigation: this.$t('navigation-bar.she-zhi'),
            title: this.$t('setting.index.device-mode'),
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
        this.active = this.checked = this.settingInfo.deviceMode - 1 ? 0 : 1
        if (this.deviceInfo.operationMode != 1) this.active = this.settingInfo.deviceMode - 1 ? 0 : 1
    },
    methods: {
        getAvailableIndexes() {
            const list = [0]
            const disableChankang = !this.deviceInfo.healthPackageEnable && this.deviceInfo.deviceType === 5
            if (!disableChankang) list.push(1)
            if (this.settingInfo.triMode) list.push(2)
            if (this.isShowAthlete) list.push(3)
            return list
        },
        // 按键事件
        btnClick(btnType) {
            const options = this.getAvailableIndexes()
            if (!options.length) return
            // 上
            if (btnType === 1) {
                const curIdx = options.indexOf(this.active)
                if (curIdx === -1) {
                    this.active = options[0]
                } else {
                    this.active = options[(curIdx - 1 + options.length) % options.length]
                }
                // 下
            } else if (btnType === 2) {
                const curIdx = options.indexOf(this.active)
                if (curIdx === -1) {
                    this.active = options[0]
                } else {
                    this.active = options[(curIdx + 1) % options.length]
                }
                // 确定
            } else if (btnType === 3) {
                if (this.active > -1) {
                    if (this.active === 2) {
                        this.setupDeviceViewReport()
                        return
                    }
                    if (this.active === 3) {
                        const Athlete = this.settingInfo.Athlete === 1 ? 0 : 1
                        this.$store.commit('CHANGE_SETTING_INFO', { Athlete })
                        return
                    }
                    this.checked = this.active
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        deviceMode: this.active === 1 ? 1 : 2
                    })
                }
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        // 触屏选择
        confirmSelection(index) {
            if (index === 3) {
                this.active = index
                const Athlete = this.settingInfo.Athlete === 1 ? 0 : 1
                this.$store.commit('CHANGE_SETTING_INFO', { Athlete })
                return
            }
            if (
                (!this.deviceInfo.healthPackageEnable && this.deviceInfo.deviceType === 5) ||
                (!this.deviceInfo.beautyEnable && this.deviceInfo.deviceType === 3)
            ) {
                return
            }
            this.active = index
            this.checked = index
            this.$store.commit('CHANGE_SETTING_INFO', {
                deviceMode: index === 1 ? 1 : 2
            })
        },

        setupDeviceViewReport() {
            this.active = 2
            if (!this.settingInfo.combineMeasureEnable) {
                this.$store.commit('CHANGE_INIT_MESINFO', this.deviceInfo.deviceType === 5 ? [1, 3] : [3, 1])
            } else {
                // apro5 恢复之前的测量项
                this.$store.commit('CHANGE_INIT_MESINFO', this.deviceInfo.deviceType === 5 ? [2, 1, 3] : [2, 3, 1])
            }
            this.$store.commit('CHANGE_SETTING_INFO', {
                combineMeasureEnable: this.settingInfo.combineMeasureEnable ? 0 : 1
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
    .title2 {
        margin: 60px 60px 24px 60px;
        font-weight: normal;
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
