<template>
    <div class="print-setting">
        <!-- 正在搜索WiFi... -->
        <Loading v-if="isLoading" :text="$t('wifi.search')" />
        <div class="items" v-else>
            <div :class="[{ active: active === 0 && pageindex === 1 }, 'item']">
                <div class="box" @touchend="confirmSelection(0)">
                    <span class="title">
                        <!-- WIFI开关 -->
                        {{ $t('wifi.wifi-off') }}
                    </span>
                    <div :class="[{ close: settingInfo.wifibtn === 0 }, 'check-trail']">
                        <div class="check-handler"></div>
                    </div>
                    <p class="wifitips" v-if="deviceInfo.WifiStatus && settingInfo.wifibtn && !deviceInfo.isNetConnect">
                        <img src="@/assets/img/setting/wifitan.png" class="wifitipss" />
                        <!-- 网络无法连接或无网络，请更换网络重试 -->
                        {{ $t('wifi.error-connect') }}
                    </p>
                </div>
            </div>
            <template v-if="settingInfo.wifibtn !== 0">
                <div
                    :class="[{ active: active === index + 1 }, 'item']"
                    v-for="(item, index) in renderData"
                    :key="index"
                >
                    <div class="wifi" @touchend="confirmSelection(index + 1)">
                        {{ item.ssid.length > 15 ? item.ssid.slice(0, 15) + '...' : item.ssid }}
                        <span class="desc">
                            {{
                                item.isconnected == 2 && item.ssid == connectingSSID
                                    ? $t('wifi.items-vice-4')
                                    : item.isconnected == true
                                    ? $t('wifi.items-vice-2')
                                    : ''
                            }}
                        </span>
                        <img
                            :src="require(`@img/setting/wifi_icon_${islevel2(item)}.png`)"
                            alt="wifi"
                            class="icon"
                            v-if="item.isencrypt"
                        />
                        <img
                            src="@img/setting/wifi_icon_no.png"
                            alt="wifi"
                            class="icon"
                            v-else-if="item.isconnected == true && deviceInfo.isNetConnect"
                        />
                        <img
                            :src="require(`@img/setting/wifi_icon_${islevel1(item)}.png`)"
                            alt="wifi"
                            class="icon"
                            v-else
                        />
                    </div>
                </div>
            </template>
            <div class="pagination-container" v-if="settingInfo.wifibtn !== 0">
                <div
                    :class="{
                        'page-btn': true,
                        active: active === 0 && pageindex !== 1,
                        disabled: pageindex == 1
                        // touchStatus: touchStatus && currentIndex === -2
                    }"
                    @touchend="confirmSelection(0, pageindex <= 1)"
                >
                    {{ $t('print-list.shang-yi-ye') }}
                </div>
                <div class="page-container">
                    <p class="current">{{ pageindex }}</p>
                    / {{ maxpage }}
                </div>
                <div
                    :class="{
                        'page-btn': true,
                        active: active === 7 && pageindex !== maxpage,
                        disabled: pageindex === maxpage
                        // touchStatus: touchStatus && currentIndex === -1
                    }"
                    @touchend="confirmSelection(7, pageindex >= maxpage)"
                >
                    {{ $t('print-list.xia-yi-ye') }}
                </div>
            </div>
        </div>
        <msg-box
            v-model="wifibox"
            :callback="disconnectWifi"
            :title="accitvessid"
            @on-close="wifibox = false"
            :activeBgc="activeBgc"
            v-if="wifibox"
        >
        </msg-box>
        <base-msg-box v-model="openPwdBox" :title="$t('wifi.tip-check')" :duration="10" :is-auto-close="false">
            <div slot="content" class="wifi-content">
                <div class="form">
                    <div class="title">WIFI {{ connectingSSID }}</div>
                    <div class="user-id">
                        <input
                            id="password"
                            :placeholder="$t('wifi.tip-check')"
                            maxlength="10"
                            :type="inputType"
                            v-model="password"
                            @focus="inputFocus(1)"
                        />
                        <img
                            class="input-icon"
                            :src="require(`@/assets/img/setting/password${inputType === 'text' ? '' : '_hidden'}.png`)"
                            @click="togglePasswordVisibility"
                        />
                    </div>
                </div>
                <div class="operation">
                    <div :class="{ 'box-btn': true, active: false }" @touchstart="onClosePwdBox">
                        {{ $t('wifi.tip-btn-cancel') }}
                    </div>
                    <div
                        :class="{ 'box-btn': true, active: true, clickable: password.length > 0 }"
                        @touchstart="wifiSet"
                    >
                        {{ $t('wifi.tip-btn-confirm') }}
                    </div>
                </div>
            </div>
        </base-msg-box>
        <base-msg-box v-model="openConnectionBox" title="" :is-auto-close="false">
            <div slot="content" class="connection-content">
                <img src="@img/setting/wifi_connection_err.svg" alt />
                <p class="box-tip">{{ reason }}</p>
                <div class="operation">
                    <div :class="{ 'box-btn': true, active: true }" @touchstart="onCloseConnectionBox">
                        {{ $t('wifi.tip-btn-ok') }}
                    </div>
                </div>
            </div>
        </base-msg-box>
        <base-msg-box v-model="connecting" title="" :is-auto-close="false">
            <div slot="content" class="connection-content-connecting">
                <img src="@img/setting/loading.png" />
                <div class="box-tip">
                    {{ $t('wifi.tip-waiting') }}
                    <div class="wifi-key">{{ connectingSSID }}</div>
                </div>
            </div>
        </base-msg-box>
        <!-- 软键盘 -->
        <keyboard
            ref="keyboardSetting"
            :elmId="elmId"
            :max="100"
            @getKeyValue="getKeyValue"
            @removeValue="removeValue"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loading from '@/components/Loading.vue'
import MsgBox from './components/MsgBox.vue'
import { EventBus } from '@/util/event-bus'
import BaseMsgBox from '@/components/MsgBox.vue'
import Keyboard from './components/keyboard/index.vue'
export default {
    name: 'wifiList',
    components: {
        Loading,
        MsgBox,
        BaseMsgBox,
        Keyboard
    },
    data() {
        return {
            isLoading: false,
            connectingSSID: '123', // 正在连接的WiFi SSID
            // 当前显示的下标
            active: -1,
            itemSum: 0,
            pagesize: 6, // 页面显示数
            maxpage: 1, // 最大页
            pageindex: 1, // 当前页
            items: [],
            renderData: [],
            wifibox: false,
            accitvessid: '',
            issendtype2: true,
            timer: null,
            openPwdBox: false,
            password: '',
            // 是否显示键盘
            isShowKeyboard: false,
            // 当前光标的位置，1 密码
            cursorLocation: 0,
            openConnectionBox: false,
            reason: '',
            inputType: 'text',
            activeBgc: false,
            connecting: false, // 是否正在连接
            touchStatus: false
        }
    },

    computed: {
        ...mapGetters({
            settingInfo: 'settingInfo',
            deviceInfo: 'deviceInfo'
        }),
        // 键盘id
        elmId() {
            let ids = ''
            switch (this.cursorLocation) {
                case 1:
                    ids = 'password'
                    break
                default:
                    break
            }
            return ids
        }
    },

    beforeDestroy() {
        EventBus.$off('EventAction')
        clearTimeout(this.timer)
        this.$hardwareClient.wifiSet({ type: 2 })
    },
    created() {
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
            openNotOperated: false
        })
        if (this.settingInfo.wifibtn === 0) {
            this.itemSum = 1
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList: [
                    {
                        btn: 'switch',
                        msg: '电源'
                    }
                ]
            })
        } else {
            this.itemSum = this.maxpage > 1 ? 7 : this.items.length + 1
        }
    },
    mounted() {
        // 调试数据
        // setInterval(() => {
        //     EventBus.$emit('EventAction', 'WifiList', {
        //         listList: [
        //             { ssid: 'aaa', level: 100, isconnected: true, isautoconnect: false, isencrypt: true },
        //             { ssid: 'bbb', level: 100, isconnected: false, isautoconnect: false, isencrypt: true },
        //             { ssid: 'ccc', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'ddd', level: 80, isconnected: false, isautoconnect: true, isencrypt: false },
        //             { ssid: 'eee', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'fff', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'ggg', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'hhh', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'iii', level: 80, isconnected: false, isautoconnect: true, isencrypt: false },
        //             { ssid: 'jjj', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'kkk', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'lll', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'mmm', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'nnn', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'ooo', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'lll', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'mmm', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'nnn', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'ooo', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'lll', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'mmm', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'nnn', level: 80, isconnected: false, isautoconnect: false, isencrypt: false },
        //             { ssid: 'ooo', level: 80, isconnected: false, isautoconnect: false, isencrypt: false }
        //         ]
        //     })
        // }, 1000)
        EventBus.$on('EventAction', (type, data) => {
            // window.logger.info('监听数据', type, data)
            if (type === 'WifiList') {
                if (data.listList.length > 0) {
                    this.isLoading = false
                }
                this.items = []
                this.renderData = []
                this.items = data.listList.slice(0, 30)
                const connectedItem = this.items.find((item) => item.isconnected == true)
                if (connectedItem) {
                    this.items = [connectedItem, ...this.items.filter((item) => !item.isconnected)]
                    if (connectedItem.ssid == this.connectingSSID) {
                        this.connectingSSID = ''
                        if (this.pageindex === 1) {
                            this.active = 1
                        } else {
                            this.active = -1
                        }
                    }
                }
                this.maxpage = Math.ceil(this.items.length / this.pagesize)
                this.renderData = this.items.slice((this.pageindex - 1) * this.pagesize, this.pageindex * this.pagesize)
                this.itemSum = this.maxpage > 1 ? 7 : this.items.length + 1
                if (this.connectingSSID) {
                    const Index = this.renderData.findIndex((item) => item.ssid == this.connectingSSID)
                    if (Index !== -1) {
                        this.renderData[Index].isconnected = 2
                        this.active = Index + 1
                    }
                    // window.logger.info('正在连接的WiFi', connectingSSID, Index, this.renderData[Index].isconnected)
                }
            } else if (type === 'WifiSetStatus') {
                if (data.type === 0) {
                    if (data.value === 1) {
                        this.items = []
                        this.renderData = []
                        if (this.settingInfo.wifibtn === 1 && this.issendtype2) {
                            this.$hardwareClient.wifiSet({ type: 1 })
                            this.isLoading = true
                            this.issendtype2 = false
                            setTimeout(() => {
                                this.issendtype2 = true
                            }, 2000)
                            this.timer = setTimeout(() => {
                                this.isLoading = false
                            }, 10000)
                        }
                    }
                } else if (data.type === 2) {
                    if (data.value === 0) {
                        window.logger.info('wifi连接失败', data.reason)
                        this.openConnectionBox = true
                        this.connecting = false
                        if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(data.errorcode)) {
                            const errorStr = `wifi.connect-error-${data.errorcode}`
                            this.reason = this.$t(errorStr)
                        } else {
                            this.reason = data.reason
                        }
                        this.connectingSSID = ''
                        // this.$changeViewPage('wifiQrcode', { data: data.reason, ssid: this.connectingSSID })
                    }
                    if (data.value === 1) {
                        this.connecting = false
                    }
                } else if (data.type === 3) {
                    if (data.value === 0) {
                        window.logger.info('wifi断开失败', data.reason)
                        // this.$changeViewPage('wifiQrcode', { data: data.reason, ssid: this.connectingSSID })
                    }
                }
            }
        })
        if (this.settingInfo.wifibtn === 1) {
            this.$hardwareClient.wifiSet({ type: 0, value: 1 })
            this.issendtype2 = true
            this.Loadingc = true
        } else {
            this.$hardwareClient.wifiSet({ type: 0, value: 0 })
        }
    },
    methods: {
        wifiSet() {
            if (this.password.length < 1) {
                return
            }

            this.$hardwareClient.wifiSet({ type: 3, ssid: this.connectingSSID, pass: this.password })
            // EventBus.$emit('EventAction', 'WifiSetStatus', {
            //     type: 2,
            //     value: 0,
            //     reason: ''
            // })
            this.items[(this.pageindex - 1) * this.pagesize + this.active - 1].isconnected = 2
            // this.connecting = true
            this.password = ''
            this.openPwdBox = false
            this.hideKeyboard()
        },
        // 获取焦点
        inputFocus(state) {
            this.cursorLocation = state
            this.isShowKeyboard = true
            const $keyboard = this.$refs.keyboardSetting
            $keyboard.visible = true
        },
        // 隐藏键盘
        hideKeyboard() {
            const $keyboard = this.$refs.keyboardSetting
            if ($keyboard) {
                $keyboard.visible = false
            }
        },
        // 输入框赋值
        inputUpdateValue(val) {
            switch (this.cursorLocation) {
                case 1:
                    this.password = val
                    break
                default:
                    break
            }
        },
        // 键盘
        getKeyValue(val) {
            console.log('getKeyValue', val)
            this.inputUpdateValue(val)
        },
        // 键盘
        removeValue(val) {
            this.inputUpdateValue(val)
        },
        // 关闭密码框
        onClosePwdBox() {
            this.connectingSSID = ''
            this.password = ''
            this.openPwdBox = false
            this.hideKeyboard()
        },
        onCloseConnectionBox() {
            this.connectingSSID = ''
            this.openConnectionBox = false
        },
        // 按键事件
        btnClick(btnType) {
            if (this.wifibox) {
                if (![7, 3].includes(btnType)) {
                    this.activeBgc = !this.activeBgc
                    return
                }
                console.log('wifibox2', this.activeBgc)
                if (this.activeBgc == false) {
                    window.logger.info('wifibox', this.wifibox)
                    this.wifibox = false
                    window.logger.info('关闭wifibox', this.wifibox)
                    this.$hardwareClient.wifiSet({
                        type: 4,
                        ssid: this.renderData[(this.pageindex - 1) * this.pagesize + this.active - 1].ssid
                    })
                    // return
                } else {
                    this.wifibox = false
                    // return
                }
                this.activeBgc = false
                return
            }
            if ([1, 2].includes(btnType) && this.active === -1) {
                this.active = 0
                return
            }
            // 上
            if (btnType === 1) {
                if (this.active === 0) {
                    if (this.pageindex === this.maxpage) {
                        this.active = this.renderData.length
                    } else {
                        this.active = this.itemSum
                    }
                } else {
                    this.active--
                    window.logger.info(this.active, 'this.active')
                }
                // 下
            } else if (btnType === 2) {
                if (this.pageindex === this.maxpage) {
                    if (this.active === this.renderData.length) {
                        this.active = 0
                    } else {
                        this.active++
                    }
                } else {
                    if (this.active === this.itemSum) {
                        this.active = 0
                    } else {
                        this.active++
                    }
                }
                // 确定
            } else if (btnType === 3) {
                this.confirmSelection(this.active)
                // 返回
            } else if (btnType === 7) {
                this.$router.go(-1)
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
                if (this.settingInfo.wifibtn === 0) {
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
            window.logger.info(this.active, this.pageindex, this.itemSum, 'this.active')
        },
        // 确认选中
        confirmSelection(active, disabled) {
            if (disabled) {
                return
            }
            if (this.touchStatus) {
                return
            }
            this.touchStatus = true
            setTimeout(() => {
                this.touchStatus = false
            }, 400)
            if (this.pageindex === 1) {
                if (active === 0) {
                    if (this.settingInfo.wifibtn === 0) {
                        // 设置打印模式
                        this.$store.commit('CHANGE_SETTING_INFO', {
                            wifibtn: 1
                        })
                        // 在这里调用wifi列表
                        this.$hardwareClient.wifiSet({ type: 0, value: 1 })
                        this.issendtype2 = true
                        // 默认高亮
                        // this.active = 1
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
                            openNotOperated: false
                        })
                    } else {
                        // 关闭wifi
                        this.$hardwareClient.wifiSet({ type: 0, value: 0 })
                        this.connectingSSID = ''
                        clearTimeout(this.timer)
                        // 设置打印模式
                        this.$store.commit('CHANGE_SETTING_INFO', {
                            wifibtn: 0
                        })
                        this.$store.commit('CHANGE_PAGE_INFO', {
                            btnList: [
                                {
                                    btn: 'switch',
                                    msg: '电源'
                                }
                            ]
                        })
                        this.itemSum = 1
                        this.items = []
                        this.renderData = []
                        this.$store.commit('CHANGE_PAGE_INFO', {
                            btnList: [
                                {
                                    btn: 'check',
                                    msg: this.$t('aPro7.open')
                                },
                                {
                                    btn: 'return',
                                    msg: this.$t('aPro7.return')
                                }
                            ]
                        })
                    }
                } else if (active === this.pagesize + 1) {
                    setTimeout(() => {
                        this.pageindex += 1
                        this.renderData = this.items.slice(
                            (this.pageindex - 1) * this.pagesize,
                            this.pageindex * this.pagesize
                        )
                        this.active = -1
                    }, 300)
                    // this.active = 0
                } else {
                    // 进入扫描或者连接wifi页面
                    // if (this.items[(this.pageindex - 1) * this.pagesize + active - 1].isAutoConnect) {
                    //     this.$hardwareClient.wifiSet({
                    //         type: 4,
                    //         ssid: this.items[(this.pageindex - 1) * this.pagesize + active - 1].ssid
                    //     })
                    // } else
                    this.active = active
                    const currentItem = this.items[(this.pageindex - 1) * this.pagesize + active - 1]
                    const { isconnected, ssid, isautoconnect, isencrypt } = currentItem
                    if (isconnected == true) {
                        // 断开wifi连接
                        this.accitvessid = ssid
                        this.wifibox = true
                    } else if (isautoconnect) {
                        // 调用WiFi连接
                        this.$hardwareClient.wifiSet({ ssid, type: 3, autoconnect: true })
                        this.connectingSSID = ssid
                        this.items[(this.pageindex - 1) * this.pagesize + active - 1].isconnected = 2
                    } else if (!isencrypt) {
                        // 调用WiFi连接
                        this.connectingSSID = ssid
                        this.items[(this.pageindex - 1) * this.pagesize + active - 1].isconnected = 2
                        this.$hardwareClient.wifiSet({ ssid, type: 3 })
                    } else {
                        this.connectingSSID = ssid
                        this.openPwdBox = true
                    }
                }
            } else {
                this.itemsum = this.items.length - this.pageindex * this.pagesize
                if (active === 0) {
                    setTimeout(() => {
                        this.pageindex -= 1
                        this.renderData = this.items.slice(
                            (this.pageindex - 1) * this.pagesize,
                            this.pageindex * this.pagesize
                        )
                        this.active = -1
                    }, 300)
                    // this.active = this.pagesize + 1
                } else if (active === this.pagesize + 1) {
                    setTimeout(() => {
                        this.pageindex += 1
                        this.renderData = this.items.slice(
                            (this.pageindex - 1) * this.pagesize,
                            this.pageindex * this.pagesize
                        )
                        this.active = -1
                        // if (this.pageindex === this.maxpage) {
                        //     this.active = 0
                        // }
                    }, 300)
                    // this.active = 0
                } else {
                    // 进入扫描或者连接wifi页面
                    // if (this.items[(this.pageindex - 1) * this.pagesize + active - 1].isAutoConnect) {
                    //     this.$hardwareClient.wifiSet({
                    //         type: 4,
                    //         ssid: this.items[(this.pageindex - 1) * this.pagesize + active - 1].ssid
                    //     })
                    // } else
                    this.active = active
                    const currentItem = this.items[(this.pageindex - 1) * this.pagesize + active - 1]
                    const { isconnected, ssid, isautoconnect, isencrypt } = currentItem
                    if (isconnected == true) {
                        // 断开wifi连接
                        this.accitvessid = ssid
                        this.wifibox = true
                    } else if (isautoconnect) {
                        // 调用WiFi连接
                        this.$hardwareClient.wifiSet({ ssid, type: 3, autoconnect: true })
                        this.connectingSSID = ssid
                        this.items[(this.pageindex - 1) * this.pagesize + active - 1].isconnected = 2
                    } else if (!isencrypt) {
                        // 调用WiFi连接
                        this.connectingSSID = ssid
                        this.items[(this.pageindex - 1) * this.pagesize + active - 1].isconnected = 2
                        this.$hardwareClient.wifiSet({ ssid, type: 3 })
                    } else {
                        this.connectingSSID = ssid
                        this.openPwdBox = true
                    }
                }
            }
        },
        islevel1(item) {
            return item.level > 80
                ? 'five'
                : item.level > 60
                ? 'four'
                : item.level > 40
                ? 'three'
                : item.level > 20
                ? 'two'
                : 'two'
        },
        islevel2(item) {
            return item.level > 80
                ? 'six'
                : item.level > 60
                ? 'senve'
                : item.level > 40
                ? 'nine'
                : item.level > 20
                ? 'ten'
                : 'ten'
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0
            })
            this.$changeViewPage('Home')
        },

        // 切换密码输入框类型
        togglePasswordVisibility() {
            this.inputType = this.inputType === 'text' ? 'password' : 'text'
        },

        // 断开wifi连接
        disconnectWifi(isDisconnect) {
            if (!isDisconnect) return
            console.log(1111, '点击断开wifi')
            this.$hardwareClient.wifiSet({
                type: 4,
                ssid: this.renderData[(this.pageindex - 1) * this.pagesize + this.active - 1].ssid
            })
        }
    }
}
</script>

<style lang="less" scoped>
.print-setting {
    .items {
        position: absolute;
        width: 100%;
        height: 1350px;
        top: 432px;

        .item {
            position: relative;
            width: 956px;
            margin: 0 auto 20px;
            border-radius: 32px;
            .able-click();

            .box {
                padding: 48px 0 48px 48px;
                position: relative;

                .title {
                    font-size: 48px;
                    font-family: OPPOSansR;
                    display: inline-block;
                    width: 100%;
                    margin: 12px 0;
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

                .icon-right {
                    position: absolute;
                    top: 64px;
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
            }
        }
    }

    .wifi-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #e7e9f0;
        margin-bottom: 40px;

        .box-tip {
            display: inline-block;
            margin: 40px 0 80px;
            padding: 0 24px 0 16px;
            background: #666666;
            border-radius: 12px;
            font-size: 32px;
            font-family: OPPOSansR;
            line-height: 48px;
            color: #e7e9f0;

            img {
                width: 40px;
                // margin-right: 8px;
                vertical-align: text-bottom;
            }
        }

        .form {
            width: 832px;
            padding: 96px 0 0 0;
            margin-bottom: 80px;

            .title {
                margin: 0;
                font-size: 48px;
                font-family: OPPOSansR, OPPOSans;
                font-size: 40px;
                color: #ffffff;
                text-align: left;
            }

            .user-id {
                padding-top: 40px;
                position: relative;

                input {
                    width: 100%;
                    padding: 0 32px;
                    height: 132px;
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 12px;
                    border: 2px solid rgba(153, 153, 153, 0.56);
                    font-size: 40px;
                    font-family: OPPOSansM, OPPOSans;
                    font-weight: normal;
                    color: #ffffff;
                    text-align: left;
                    box-sizing: border-box;

                    &:focus {
                        border: 2px solid #75a6fc;
                        outline: none;
                    }
                }

                input::-webkit-input-placeholder {
                    /* placeholder颜色 */
                    color: #cccccc;
                    /* placeholder字体大小 */
                    font-size: 32px;
                }

                &.fail input {
                    border: 2px solid #bb0d0d;

                    &:focus {
                        border: 2px solid #bb0d0d;
                    }
                }

                .input-icon {
                    width: 56px;
                    height: 56px;
                    position: absolute;
                    right: 32px;
                    top: 82px;
                }
            }

            .tip {
                font-size: 32px;
                font-family: OPPOSansR, OPPOSans;
                font-weight: normal;
                color: #bb0d0d;
                margin: 16px 0 0 0;
                text-align: center;
                height: 48px;
            }

            .prompt {
                font-size: 32px;
                font-family: OPPOSansR, OPPOSans;
                font-weight: normal;
                color: #999999;
                text-align: center;
                margin: 16px 0 0 0;
            }
        }

        .operation {
            display: flex;
            justify-content: space-evenly;
            width: 100%;
            padding: 0 64px;

            .box-btn {
                width: 384px;
                height: 132px;
                background: #888888;
                border-radius: 12px;
                border: none;
                box-sizing: border-box;
                font-size: 40px;
                font-family: OPPOSansR;
                line-height: 132px;
                color: #e7e9f0;
            }

            .confirm {
                width: 832px;
            }

            // 按键模式下确认按钮样式
            .btn-confirm {
                width: 832px;
                margin-bottom: 54px;
            }

            .active {
                background: @color-blue;
                color: #649cff;
                border: none;

                &.clickable {
                    color: #e7e9f0;
                }
            }
        }

        .item {
            margin: 0;
            font-family: OPPOSansR;
            font-size: 32px;
            display: flex;
            justify-content: center;
            align-items: center;

            i {
                font-size: 40px;
                margin: 0 10px;
            }
        }
    }

    .connection-content {
        .box-tip {
            font-size: 48px;
            color: #ffffff;
            margin: 40px auto 120px !important;
            font-family: OPPOSansR, OPPOSans;
        }

        .operation {
            display: flex;
            justify-content: space-evenly;
            width: 100%;

            .box-btn {
                width: 832px;
                height: 132px;
                background: #888888;
                border-radius: 12px;
                border: none;
                box-sizing: border-box;
                font-size: 40px;
                font-family: OPPOSansR;
                line-height: 132px;
                color: #e7e9f0;
            }

            .active {
                background: @color-blue;
                color: #e7e9f0;
                border: none;
            }
        }
    }
    .connection-content-connecting {
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
            width: 88px;
            height: 88px;
            margin-bottom: 40px;
            transform-origin: center center;
            animation: rotateLoop 3s 1s steps(8) infinite;
        }

        @keyframes rotateLoop {
            from {
                transform: rotate(360deg);
            }
            to {
                transform: rotate(0deg);
            }
        }

        .box-tip {
            color: #cccccc;
        }

        .wifi-key {
            color: #ffffff;
            display: inline;
        }
    }
}

.zhu {
    display: block;
    font-size: 25px;
}

.errtip {
    width: 60px;
    position: relative;
    top: 10px;
}

.wifi {
    padding: 40px 0 40px 48px;
    position: relative;

    .desc {
        position: absolute;
        top: 40px;
        right: 130px;
        font-family: OPPOSans;
        font-size: 40px;
        color: #e7e9f0;
        line-height: 60px;

        .connecting-dot {
            display: inline-block;
            animation: connecting 1.5s infinite;
            color: @color-blue;
        }
    }

    .icon {
        position: absolute;
        top: 40px;
        width: 60px;
        height: 60px;
        right: 30px;
    }
}

.box2 {
    position: relative;
    width: 956px;
    margin: 0 auto 24px;
    border-radius: 32px;
    padding: 48px 0 !important;
    text-align: center;

    &.active {
        padding: 48px 0 !important;
        .active-border();

        .title {
            color: #ffffff;
        }

        .titles {
            color: #e7e9f0;
        }
    }
}

span {
    vertical-align: middle;
}

.down-btn {
    width: 68px;
    height: 68px;
    vertical-align: middle;
}

.wifitips {
    font-family: OPPOSans;
    font-size: 32px;
    color: #cccccc;
    line-height: 41px;
    text-align: left;
    font-style: normal;
    margin: 0;

    .wifitipss {
        width: 31px;
        height: 28px;
        margin-right: 20px;
    }
}

@keyframes connecting {
    0% {
        opacity: 0.3;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.3;
    }
}

// 页码控制
.pagination-container {
    width: 956px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: -68px;
    left: calc(50% - 478px);

    .page-btn {
        position: relative;
        width: 374px;
        height: 136px;
        color: #ffffff;
        text-align: center;
        line-height: 136px;
        font-size: 40px;
        font-family: OPPOSansR;
        .able-click();

        &.active {
            .active-border();
        }
        &:active {
            background: @color-blue;
        }

        &.touchStatus {
            .able-click();
        }

        &.disabled {
            color: #ffffff66;
            background: transparent;
            background: #555555;
        }
    }

    .page-container {
        display: flex;
        align-items: center;
        font-size: 40px;
        color: @text-gray-2;
        font-family: 'OPPOSansR';

        .current {
            color: @color-orange;
            font-size: 40px;
            margin: 0;
            margin-right: 10px;
            font-family: 'OPPOSansR';
        }
    }
}
</style>
