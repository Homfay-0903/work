<template>
    <div class="device-setting">
        <div class="items">
            <div :class="[{ active: active === index }, 'item']" v-for="(item, index) in items" :key="index">
                <div :class="['box', $i18n.locale]" @touchend="confirmSelection(index)">
                    <h3>{{ item.title }}</h3>
                    <i class="iconfont icon-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'deviceDiagnose',
    data() {
        return {
            active: -1,
            items: [
                {
                    title: this.$t('setting.check.wang-luo-zhen-duan'),
                    vice: '',
                    page: 'NetworkDiagnose'
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['deviceInfo', 'settingInfo'])
    },
    created() {
        if (this.deviceInfo.deviceType > 0 && this.deviceInfo.deviceType === 3) {
            this.items.push({
                icon: 'cloud',
                title: this.$t('setting.check.wang-luo-fen-xi'),
                vice: '',
                page: 'networkCheck'
            })
        }
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
            this.active = active
            setTimeout(() => {
                this.$changeViewPage(this.items[active].page)
            }, 300)
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

                h3 {
                    display: inline-block;
                    font-size: 48px;
                    font-weight: normal;
                    line-height: 72px;
                    margin: 0 0 0 48px;
                    color: #e7e9f0;
                }

                .spanright {
                    position: absolute;
                    right: 100px;
                    font-size: 34px;
                    color: #999999;
                    margin: auto;
                }
                &.el {
                    h3,
                    span {
                        font-family: OPPOSansR;
                    }
                }
                .icon-arrow-right {
                    position: absolute;
                    right: 50px;
                    font-size: 34px;
                    color: #999999;
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
        }
    }
}
</style>
