<template>
    <div class="device-setting">
        <div class="items">
            <div :class="[{ active: active === index }, 'item']" v-for="(item, index) in items" :key="index">
                <div class="box" @touchend="confirmSelection(index)">
                    <img :src="require(`@/assets/img/setting/${item.icon}.svg`)" class="icon-left" alt />
                    <h3>{{ item.title }}</h3>
                    <span class="spanright">{{ item.vice }}</span>
                    <i class="iconfont icon-arrow-right" v-if="index !== 1"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'DeviceSetting',
    data() {
        return {
            active: -1,
            items: [
                {
                    icon: 'set-sound',
                    title: this.$t('wifi.items-title-1'), //'无线网络'
                    vice: this.$t('wifi.tems-vice-1'), //'已连接无网络'
                    page: 'wifiList'
                },
                {
                    icon: 'wired-network',
                    title: this.$t('wifi.items-title-2'), //'有线网络',
                    vice: this.$t('wifi.items-vice-2'), //  '已连接',
                    page: 'NetworkDiagnose'
                },
                {
                    icon: 'select_set_item_icon_device',
                    title: this.$t('setting.index.she-bei-jian-ce'),
                    vice: '',
                    page: 'deviceDiagnose'
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['deviceInfo', 'settingInfo'])
    },
    watch: {
        deviceInfo: {
            handler(val, oldVal) {
                if (
                    val.WifiStatus != oldVal.WifiStatus ||
                    val.isNetConnect != oldVal.isNetConnect ||
                    val.WiredNetworkStatus != oldVal.WiredNetworkStatus
                ) {
                    this.updateNetworkStatusDisplay()
                }
            },
            deep: true // 对象内部的属性监听，也叫深度监听
        },
        settingInfo: {
            handler(val, oldVal) {
                if (val.wifibtn != oldVal.wifibtn) {
                    this.updateNetworkStatusDisplay()
                }
            },
            deep: true // 对象内部的属性监听，也叫深度监听
        }
    },
    created() {
        if (this.deviceInfo.operationMode != 1) this.active = 0
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ],
            openNotOperated: true
        })

        if (this.deviceInfo.deviceType > 0) {
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
        }
        this.updateNetworkStatusDisplay()
    },
    methods: {
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                if (this.active !== 0) {
                    this.active--
                    return
                }
                this.active = this.items.length - 1
                // 下
            }
            if (btnType === 2) {
                if (this.active !== this.items.length - 1) {
                    this.active++
                    return
                }
                this.active = 0
                // 确定
            }
            if (btnType === 3) {
                this.confirmSelection(this.active)
                // 返回
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        confirmSelection(active) {
            if (active === 1) {
                return
            }
            this.active = active
            setTimeout(() => {
                this.$changeViewPage(this.items[active].page)
            }, 200)
        },
        updateNetworkStatusDisplay() {
            this.items[0].vice =
                this.settingInfo.wifibtn && this.deviceInfo.WifiStatus
                    ? this.deviceInfo.isNetConnect
                        ? this.$t('wifi.items-vice-2')
                        : this.$t('wifi.items-vice-1')
                    : this.$t('wifi.items-vice-3')
            this.items[1].vice = this.deviceInfo.WiredNetworkStatus
                ? this.deviceInfo.isNetConnect
                    ? this.$t('wifi.items-vice-2')
                    : this.$t('wifi.items-vice-1')
                : this.$t('wifi.items-vice-3')
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
.device-setting {
    .items {
        position: absolute;
        width: 100%;
        top: 432px;

        .item {
            position: relative;
            width: 960px;
            height: 168px;
            margin: 0 auto 24px;
            .able-click();

            .box {
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
                height: 100%;
                text-align: left;
                margin: 0 auto;
                .icon-left {
                    position: absolute;
                    left: 72px;
                    width: 60px;
                    height: 60px;
                    transition: all 0.3s;
                }

                h3 {
                    display: inline-block;
                    font-size: 48px;
                    font-weight: normal;
                    line-height: 72px;
                    margin: 0 0 0 192px;
                    color: #fff;
                }

                .spanright {
                    position: absolute;
                    right: 120px;
                    font-size: 40px;
                    color: #cccccc;
                    margin: auto;
                }
                .icon-arrow-right {
                    position: absolute;
                    right: 50px;
                    font-size: 34px;
                    color: @text-gray-3;
                    margin: auto;
                }
            }

            &.active {
                .active-border();
                .spanright {
                    color: #e7e9f0;
                }
                .icon-arrow-right {
                    color: #e7e9f0;
                }
            }
            &:active {
                .active-border();
                .spanright {
                    color: #e7e9f0;
                }
                .icon-arrow-right {
                    color: #e7e9f0;
                }
            }
            &:nth-child(2) {
                pointer-events: none;
            }
        }
    }
}
</style>
