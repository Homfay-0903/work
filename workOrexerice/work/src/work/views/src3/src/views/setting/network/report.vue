<template>
    <div class="network-report">
        <div class="container">
            <div class="report-card">
                <span :class="[IsStatus ? 'err' : '', 'network-status']">
                    <!-- 异常图标 -->
                    <!-- <svg v-if="IsStatus" aria-hidden="true">
                        <use xlink:href="#icon-warn" /></svg
                    > -->
                    {{ status }}
                </span>
                <span class="network-msg">{{ message }}</span>
            </div>
            <div class="items">
                <div :class="[{ border: index !== 0 }, 'item']" v-for="(item, index) in items" :key="index">
                    <img :src="require(`@img/setting/${item.icon}.svg`)" class="icon-left" alt />
                    <span class="title">{{ item.title }}</span>
                    <span :class="[{ err: item.value === '- MBPS' && index !== 2 }, { gray: index === 2 }, 'value']">{{
                        item.value
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'NetworkReport',
    computed: {
        ...mapGetters(['netSpeedInfo', 'deviceInfo']),
        upLoadInfo() {
            return this.netSpeedInfo.upLoadNetSpeed
        },
        downLoadInfo() {
            return this.netSpeedInfo.downLoadNetSpeed
        }
    },
    data() {
        return {
            status: '',
            message: '',
            IsStatus: true,
            items: [
                {
                    icon: 'set_net_icon_download',
                    title: this.$t('setting.check.network.xia-zai-su-du'),
                    value: '- MBPS'
                },
                {
                    icon: 'set_net_icon_upload',
                    title: this.$t('setting.check.network.shang-chuan-su-du'),
                    value: '- MBPS'
                },
                {
                    icon: 'set_net_icon_time',
                    title: this.$t('setting.check.network.jian-ce-shi-jian'),
                    value: new Date().Format('yyyy-MM-dd hh:mm:ss')
                }
            ]
        }
    },
    created() {
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ],
            openNotOperated: true
        })
        this.init()
    },
    methods: {
        // 按键事件
        btnClick(btnType) {
            // 返回
            if (btnType === 7) {
                this.$changeViewPage('DeviceSetting')
            }
        },
        // 初始化报告数据
        init() {
            if (!this.deviceInfo.isNetConnect) {
                if (this.netSpeedInfo.networkState) {
                    this.status = this.$t('setting.check.network.wu-fa-lian-jie-fu-wu-qi')
                    this.message = this.$t('setting.check.network.wu-fa-lian-jie-fu-wu-qi_desc')
                    this.items[0].value = '- MBPS'
                    this.items[1].value = '- MBPS'
                } else {
                    // 跳转到网络中断 networkDiagnose 已处理
                }
            } else if (this.upLoadInfo.status === 3) {
                this.status = this.$t('setting.check.network.wang-luo-jiao-cha')
                this.items[0].value = this.formatNetSpeed(this.downLoadInfo.netSpeed)
                this.items[1].value = this.formatNetSpeed(this.upLoadInfo.netSpeed)
                this.message = this.$t('setting.check.network.wang-luo-jiao-cha_desc', [
                    this.downLoadInfo.subTime > this.upLoadInfo.subTime || this.downLoadInfo.subTime >= 6
                        ? this.$t('setting.check.network.wang-luo-jiao-cha_desc_extend')
                        : '。'
                ])
            } else if (this.upLoadInfo.status === 2) {
                this.status = this.$t('setting.check.network.wang-luo-liang-hao')
                this.IsStatus = false
                this.items[0].value = this.formatNetSpeed(this.downLoadInfo.netSpeed)
                this.items[1].value = this.formatNetSpeed(this.upLoadInfo.netSpeed)
                this.message = this.$t('setting.check.network.wang-luo-liang-hao_desc', [
                    this.downLoadInfo.subTime > this.upLoadInfo.subTime || this.downLoadInfo.subTime >= 6
                        ? this.$t('setting.check.network.wang-luo-liang-hao_desc_extend')
                        : '。'
                ])
            } else if (this.upLoadInfo.status === 1) {
                this.status = this.$t('setting.check.network.wang-luo-you-xiu')
                this.IsStatus = false
                this.items[0].value = this.formatNetSpeed(this.downLoadInfo.netSpeed)
                this.items[1].value = this.formatNetSpeed(this.upLoadInfo.netSpeed)
                this.message = this.$t('setting.check.network.wang-luo-you-xiu_desc', [
                    this.downLoadInfo.subTime > this.upLoadInfo.subTime || this.downLoadInfo.subTime >= 6
                        ? this.$t('setting.check.network.wang-luo-you-xiu_desc_extend')
                        : '。'
                ])
            }
        },
        // 格式化网速显示
        formatNetSpeed(netSpeed) {
            if (netSpeed >= 1024) {
                return Math.floor((netSpeed / 1024) * 10) / 10 + ' M/s'
            } else {
                return Math.floor(netSpeed * 10) / 10 + ' KB/s'
            }
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0,
                childActive: 0
            })
            this.$changeViewPage('Home')
        }
    }
}
</script>
<style lang="less" scoped>
.network-report {
    .container {
        position: absolute;
        top: 432px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .report-card {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 960px;
        background: @color-light-gray;
        border-radius: 32px;
        text-align: center;
        .network-status {
            margin-top: 96px;
            font-size: 64px;
            font-family: OPPOSansM;
            font-weight: normal;
            color: @color-light-blue;
            line-height: 84px;
            width: 880px;
            &.warn {
                color: @color-orange;
            }
            &.err {
                color: @color-red;
            }
            svg {
                width: 64px;
                height: 64px;
                vertical-align: middle;
                margin: 0 12px 6px 0;
            }
        }
        .network-msg {
            font-size: 32px;
            margin: 40px 48px 48px 48px;
            font-family: OPPOSansR;
            font-weight: normal;
            color: #cccccc;
            line-height: 48px;
        }
    }
    .items {
        width: 100%;
        padding: 0 60px;
        margin: 40px 0 0 0;
        .item {
            position: relative;
            width: 960px;
            height: 168px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .icon-left {
                position: absolute;
                left: 0;
                width: 48px;
                height: 48px;
                transition: all 0.3s;
            }
            .title {
                position: absolute;
                left: 72px;
                font-size: 40px;
                font-family: OPPOSansR;
                font-weight: normal;
                line-height: 48px;
                color: #e7e9f0;
            }
            .value {
                font-size: 40px;
                font-family: OPPOSansM;
                font-weight: normal;
                color: @color-light-blue;
                line-height: 48px;
                &.err {
                    color: @color-red;
                }
                &.gray {
                    color: #999999;
                    font-size: 32px;
                    font-family: OPPOSansM;
                    font-weight: normal;
                    line-height: 48px;
                }
            }
            &.border {
                border-top-style: solid;
                border-top-width: 1px;
                border-top-color: #333333;
            }
        }
    }
}
</style>
