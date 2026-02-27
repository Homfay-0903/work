<!--
 * @Description: 按钮操作说明组件
 * @Author: yangsheng
 * @Date: 2022-02-15 15:20:19
 * @LastEditors: ouyaping
 * @LastEditTime: 2024-01-17 13:50:29
 -->
<template>
    <div class="btn-description">
        <!-- 按钮说明区域 -->
        <div class="btn-content">
            <!-- <div v-for="(item, index) in btnListTpl" :key="index" class="btn-item"> -->
            <!-- <div :class="textType ? 'btn-text' : 'btn-text1'" v-if="showText && item.active">
                    <div v-html="!textType && item.btn == 'switch' ? `${$t(item.text1)}` : `${$t(item.text)}`"></div>
                </div> -->
            <!-- <img
                    :src="require(`@img/error/${item.btn}.svg`)"
                    :style="{ opacity: item.active ? '1' : '0' }"
                    :alt="item.msg"
                />
                <span>{{ item.msg }}</span>
            </div> -->
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'BtnDescription',
    props: {
        // 按钮显示描述
        btnList: Array,
        // 是否开启未操作超时1分钟监听
        openNotOperated: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['pageInfo']),
        showText() {
            return this.$route.meta && this.$route.meta.nav ? this.$route.meta.nav.showBtnText : false
        },
        textType() {
            return this.$route.meta.nav ? this.$route.meta.nav.showSure : true
        }
    },
    data() {
        return {
            btnListTpl: [
                {
                    btn: 'switch',
                    msg: '电源',
                    active: false,
                    text: 'common.btn.switch',
                    text1: 'common.btn.switch1'
                },
                {
                    btn: 'add',
                    msg: '加',
                    active: false,
                    text: 'common.btn.add'
                },
                {
                    btn: 'sub',
                    msg: '减',
                    active: false,
                    text: 'common.btn.sub'
                }
            ],
            // 键盘code
            keyCodes: {
                add: 38,
                sub: 40,
                switch: 13,
                select: [38, 40],
                return: 8,
                print: 80
            },
            codeArr: [],
            // 未操作定时器
            notOperatedTimer: null
        }
    },
    watch: {
        btnList: {
            handler() {
                this.getBtnKey()
            },
            deep: true
        },
        openNotOperated: {
            handler(val, oldVal) {
                if (val === true && oldVal === false) {
                    this.handleListenKey()
                } else if (val === false && oldVal === true) {
                    this.clearTimer()
                }
            },
            deep: true
        }
    },
    mounted() {
        // 获取当前要显示的按钮
        this.getBtnKey()
        if (this.openNotOperated) {
            this.handleListenKey()
        }
    },
    // 离开页面
    beforeDestroy() {
        this.clearTimer()
    },
    methods: {
        // 启动未操作定时器
        startNotOperatedTimer() {
            // 1分钟未操作回到首页
            if (this.notOperatedTimer) {
                this.clearNotOperatedTimer()
            }
            this.notOperatedTimer = setTimeout(() => {
                window.logger.info('超时未操作')
                this.$emit('on-not-operated')
            }, 60 * 1000)
        },
        // 销毁未操作定时器
        clearNotOperatedTimer() {
            window.clearTimeout(this.notOperatedTimer)
            // clearTimeout(this.notOperatedTimer)
        },
        getBtnKey() {
            this.codeArr = []
            this.btnListTpl.forEach((v) => {
                v.active = false
            })
            this.btnList.forEach((item) => {
                this.codeArr.push(this.keyCodes[item.btn])
                let idx = this.btnListTpl.findIndex((v) => {
                    return v.btn === item.btn
                })
                this.btnListTpl[idx].active = item.active !== undefined ? item.active : true
            })
        },
        // 开始监听按钮事件
        handleListenKey() {
            this.startNotOperatedTimer()
            document.addEventListener('keydown', this.checkKeyCode, false)
            document.addEventListener('touchend', this.restartTimer, false)
        },
        // 检查按钮code是否为高亮按钮
        checkKeyCode(event) {
            // eslint-disable-next-line no-caller
            let e = event || window.event || arguments.callee.caller.arguments[0]
            if (!e) {
                return
            }
            // 按下的按键在高亮状态
            if (this.codeArr.indexOf(e.keyCode) !== -1) {
                this.restartTimer()
            }
        },
        // 按键事件
        btnClick() {
            window.logger.info('重新开始超时倒计时')
            this.restartTimer()
        },
        // 重新定时
        restartTimer() {
            // 销毁原来的定时
            this.clearNotOperatedTimer()
            // 重新定时
            this.startNotOperatedTimer()
        },
        // 清除定时
        clearTimer() {
            document.removeEventListener('keydown', this.checkKeyCode, false)
            document.removeEventListener('touchend', this.restartTimer, false)
            // 销毁未操作定时器
            this.clearNotOperatedTimer()
        }
    }
}
</script>
<style lang="less" scoped>
.btn-description {
    position: absolute;
    top: 114px;
    right: 17px;
    margin: 0;
    text-align: right;
    z-index: 999;

    .btn-content {
        display: flex;
        flex-direction: column;
    }

    .btn-item {
        height: 38px;
        margin-bottom: 50px;
        display: flex;
        justify-content: flex-end;

        .btn-text,
        .btn-text1 {
            margin-right: 29px;
            display: inline-block;

            div {
                position: relative;
                top: -16px;
                display: inline-block;
                padding: 16px 40px;
                font-size: 32px;
                font-weight: normal;
                background: rgba(34, 34, 34, 1, 0.6);
                border-radius: 30px;
            }
        }

        img {
            display: flex;
            justify-content: center;
            font-size: 32px;
            vertical-align: middle;
            color: #ffffff;
        }

        span {
            display: none;
            font-size: 24px;
            font-family: OPPOSansM;
            font-weight: normal;
            line-height: 48px;
            vertical-align: middle;
            margin-right: 23px;
        }

        // &:nth-of-type(1),
        // &:nth-of-type(2),
        // &:nth-of-type(3) {
        //     &::after {
        //         content: '';
        //         position: absolute;
        //         display: block;
        //         width: 40px;
        //         height: 1px;
        //         left: 4px;
        //         height: 1px;
        //         background: linear-gradient(
        //             270deg,
        //             rgba(255, 255, 255, 0) 0%,
        //             rgba(255, 255, 255, 0.32) 50%,
        //             rgba(255, 255, 255, 0) 100%
        //         );
        //     }
        // }

        &:nth-of-type(1) {
            border-radius: 8px 8px 0 0;
        }

        &:nth-last-child(2) {
            border-radius: 0 0 8px 8px;

            .btn-text {
                padding-top: 40px;
            }
        }

        &:last-of-type {
            border-radius: 8px;

            .btn-text {
                padding-top: 40px;
            }
        }
    }
}
</style>
