<template>
    <div class="detect-setting">
        <div class="items">
            <div :class="[{ active: active === 0 }, 'item']">
                <div class="box" @touchend="confirmSelection(0)">
                    <span class="title">{{ items[0].title }}</span>
                    <span class="desc">{{ items[0].desc }}</span>
                    <div
                        :class="[
                            { close: settingInfo.gestureState === 0 },
                            'check-trail',
                            deviceInfo.deviceType === 5 && settingInfo.gestureState === 0 ? 'pro5-background' : ''
                        ]"
                    >
                        <div class="check-handler"></div>
                    </div>
                </div>
            </div>
            <!-- 鱼眼相机异常 -->
            <div v-if="deviceErrorIds.includes(2)" class="item error">
                <div class="box">
                    <span class="title">
                        <img src="@img/setting/Tips.png" alt="" />
                        {{ $t('setting.detect.ying-jian-yi-chang') }}
                    </span>
                    <span class="desc">{{ $t('setting.detect.ying-jian-yi-chang_desc') }}</span>
                </div>
            </div>
            <!-- 光照异常 -->
            <div v-else-if="deviceErrorIds.includes(1)" class="item error height-add">
                <div v-if="lightLevel === 2" class="box">
                    <div class="box-title">
                        <span class="title">
                            <img src="@img/setting/Tips.png" alt="" />
                            {{ $t('setting.detect.guang-zhao-huan-jing-ruo') }}
                        </span>
                    </div>
                    <span class="desc">
                        {{ $t('setting.detect.guang-zhao-huan-jing-ruo_desc[0]') }}
                        <br />
                        <p>{{ $t('setting.detect.guang-zhao-huan-jing-ruo_desc[1]') }}</p>
                    </span>
                </div>
                <div v-else class="box">
                    <div class="box-title">
                        <span class="title">
                            <img src="@img/setting/Tips.png" alt="" />
                            {{ $t('setting.detect.guang-zhao-huan-jing-cha') }}
                        </span>
                    </div>
                    <span class="desc">
                        {{ $t('setting.detect.guang-zhao-huan-jing-cha_desc[0]') }}
                        <br />
                        <p>{{ $t('setting.detect.guang-zhao-huan-jing-cha_desc[1]') }}</p>
                    </span>
                </div>
            </div>
            <div v-else-if="settingInfo.gestureState === 1" :class="[{ active: active === 1 }, 'item']">
                <div class="box" @touchend="confirmSelection(1)">
                    <span class="title">{{ items[1].title }}</span>
                    <span class="desc">{{ items[1].desc }}</span>
                    <i class="iconfont icon-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'DetectSetting',
    data() {
        return {
            // 当前高亮项目
            active: -1,
            itemSum: 0,
            items: [
                {
                    title: this.$t('setting.detect.shou-shi-shi-bie'),
                    desc: this.$t('setting.detect.shou-shi-shi-bie_close_desc')
                },
                {
                    title: this.$t('setting.detect.shou-shi-cao-zuo-yin-dao'),
                    desc: this.$t('setting.detect.shou-shi-cao-zuo-yin-dao_desc')
                }
            ],
            // lightTimer: null,
            // 是否跳转至手势引导页 跳转前需等待关闭算法响应
            toDetectGesture: false
        }
    },
    computed: {
        ...mapGetters(['settingInfo', 'deviceErrorIds', 'lightLevel', 'deviceInfo']),
        // 是否有手势识别异常
        hasGestureErr() {
            return this.deviceErrorIds.includes(1) || this.deviceErrorIds.includes(2)
        },
        // 单个选项 关闭手势或手势异常时 只能选择单个
        singleItem() {
            return this.settingInfo.gestureState === 0 || this.hasGestureErr
        },
        isVaPro5() {
            return this.deviceInfo.deviceType === 5
        }
    },
    watch: {
        singleItem: {
            handler(val) {
                this.handleUpdBtnList(val)
            },
            deep: true
        },
        lightLevel: {
            handler(val) {
                // 光照异常 高亮项回到第一项
                if (val !== 1) {
                    this.active = 0
                }
            },
            deep: true
        }
    },
    created() {
        if (this.deviceInfo.operationMode != 1) this.active = 0
        // this.active = this.settingInfo.childActive
        this.$store.commit('CHANGE_PAGE_INFO', {
            openNotOperated: true
        })
        if (this.settingInfo.gestureState === 0) {
            this.itemSum = 1
            this.items[0].desc = this.$t('setting.detect.shou-shi-shi-bie_open_desc')
        } else {
            // 修改操作模式信息
            this.changeInformation()
            this.itemSum = 2
        }
        // 持续检测光源 3s检测1次
        // this.lightTimer = setInterval(() => {
        //     this.$algClient.startAmbientLightDetect()
        // }, 3 * 1000)
        // 设置按钮说明
        this.handleUpdBtnList(this.singleItem)
    },
    beforeDestroy() {
        // clearInterval(this.lightTimer)
        // if (!this.toDetectGesture) {
        //     // 关闭检测光源
        //     this.$algClient.stopAmbientLightDetect()
        // }
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
                if (this.hasGestureErr) {
                    return
                }
                if (this.active === 0) {
                    this.active = this.itemSum - 1
                } else {
                    this.active--
                }
                // 下
            } else if (btnType === 2) {
                if (this.hasGestureErr) {
                    return
                }
                if (this.active === this.itemSum - 1) {
                    this.active = 0
                } else {
                    this.active++
                }
                // 确定
            } else if (btnType === 3) {
                if (this.active < 0) {
                    return
                }
                this.confirmSelection(this.active)
                // 返回
            } else if (btnType === 7) {
                // this.$changeViewPage('SettingIndex')
                window.history.go(-1)
            }
        },
        async confirmSelection(active) {
            this.active = active

            if (active === 0) {
                if (this.settingInfo.gestureState === 0) {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        gestureState: 1
                    })
                    // 修改操作模式描述
                    this.changeInformation()

                    this.itemSum = 2
                    // 默认高亮
                    // this.active = 1
                } else {
                    this.$store.commit('CHANGE_SETTING_INFO', {
                        gestureState: 0
                    })
                    this.items[0].desc = this.$t('setting.detect.shou-shi-shi-bie_open_desc')
                    this.itemSum = 1
                }
            } else {
                this.toDetectGesture = true
                // 关闭检测光源
                if (!this.isVaPro5) {
                    await this.$algClient.stopAmbientLightDetect()
                }
                // 跳转到手势识别引导
                this.$changeViewPage('DetectGesture')
            }
        },
        // 修改操作模式描述
        changeInformation() {
            if (this.deviceInfo.operationMode === 1) {
                this.items[0].desc = this.$t('setting.detect.shou-shi-shi-bie_close_desc')
            } else {
                this.items[0].desc = this.$t('setting.detect.shou-shi-shi-bie_close_desc_key')
            }
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0,
                childActive: 0
            })
            this.$changeViewPage('Home')
        },
        handleUpdBtnList(isSingleItem) {
            if (isSingleItem) {
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
    }
}
</script>
<style lang="less" scoped>
.detect-setting {
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
            &.height-add {
                height: 360px;
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
                    &.pro5-background {
                        background: rgba(204, 204, 204, 0);
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
            &.active {
                .active-border();
                .box {
                    .title {
                        color: #ffffff;
                    }
                    .desc {
                        color: #e7e9f0;
                    }
                    .icon-arrow-right {
                        color: #ffffff;
                    }
                }
            }

            &.error {
                background: #333333;
                border-radius: 32px;
                height: auto;
                .title {
                    display: flex;
                    align-items: center;
                    font-size: 48px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #e7e9f0;
                    line-height: 72px;
                    img {
                        width: 66px;
                        height: 66px;
                        margin-right: 8px;
                    }
                }
                .desc {
                    padding-right: 20px;
                    font-size: 32px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #cccccc;
                    line-height: 48px;
                    width: calc(100% - 48px);
                    p {
                        margin-top: 24px;
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
}
</style>
