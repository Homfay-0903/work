<!--
 * @Description: 虚拟键盘
 * @Author: gaoyuanyuan
 * @Date: 2021-10-08 16:42:29
 * @LastEditors: ouyaping
 * @LastEditTime: 2022-11-30 17:53:08
-->
<template>
    <div class="virtual-keyboard">
        <transition name="bottom-slide-fade">
            <div class="keyboard bottom-center" v-if="visible">
                <div class="keyboard-inner">
                    <!-- 工具区 - 中英、关闭 -->
                    <div class="tools">
                        <span @touchend="handleClickMethod(!isCn)">{{ isCn ? '中' : 'En' }}</span>
                        <span @touchend="handleClickClose()">
                            <img src="@/assets/img/keyboard/close.svg" alt="关闭" />
                        </span>
                    </div>
                    <!-- 键盘 -->
                    <div v-for="(item, idx) of showKey" :key="idx" class="keyboard-item">
                        <div
                            v-for="(key, idx) in item"
                            :key="idx"
                            :class="['keyboard-key', key, { active: key === 'Caps' && isCaps }]"
                            @touchend="handleClick(key)"
                        >
                            <span v-if="key === 'Delete'">
                                <img src="@/assets/img/keyboard/delete.svg" alt="删除" />
                            </span>
                            <span v-else-if="key === 'Caps'">
                                <img src="@/assets/img/keyboard/case.svg" alt="大写" />
                            </span>
                            <span v-else-if="key === 'Shift'">{{ isShift ? 'ABC' : '?123' }}</span>
                            <span v-else-if="key === 'Space'"></span>
                            <span v-else>{{ key }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <cn-input-method ref="inputMethod" @returnChinese="returnChinese"></cn-input-method>
    </div>
</template>

<script>
import CnInputMethod from './CNInputMethod.vue'

export default {
    components: {
        CnInputMethod
    },
    props: {
        // input id
        elmId: {
            type: String,
            required: true
        },
        max: {
            type: Number,
            required: 10
        }
    },
    data() {
        return {
            // 是否显示软键盘
            visible: false,
            // 当前展示的键值
            showKey: [],
            // 默认key
            normalKey: [],
            // 中文符号key
            cnShiftKey: [],
            // 英文符号key
            enShiftKey: [],
            // 大写key
            capsKey: [],
            // 是否是符号状态
            isShift: false,
            // 是否是大写状态
            isCaps: false,
            // 是否是中文状态
            isCn: false,
            // 中文输入法
            inputMethod: ''
        }
    },
    watch: {
        visible: {
            handler(val, oldVal) {
                // 键盘打开时初始化中文输入法
                if (val && !oldVal) {
                    // 初始化中文输入法
                    this.inputMethod = this.$refs.inputMethod
                    this.inputMethod.initInput(`#${this.elmId}`)
                } else if (!val && oldVal) {
                    // 键盘关闭时隐藏中文输入法
                    if (this.inputMethod.visible) {
                        this.inputMethod.hide()
                    }
                }
            },
            deep: true
        }
    },
    created() {
        this.initKey()
    },
    methods: {
        // 键盘按钮点击事件处理
        handleClick(key) {
            const inputEl = document.querySelector(`#${this.elmId}`)

            if (inputEl && inputEl.value.length >= this.max && !['Shift', 'Caps', 'Delete', 'Enter'].includes(key)) {
                return
            }
            // 符号键
            if (key === 'Shift') {
                this.isShift = !this.isShift
                // 判断大小写是否开启
                if (this.isCaps) {
                    this.showKey = this.isShift
                        ? this.isCn
                            ? this.copyKey(this.cnShiftKey)
                            : this.copyKey(this.enShiftKey)
                        : this.copyKey(this.capsKey)
                } else {
                    this.showKey = this.isShift
                        ? this.isCn
                            ? this.copyKey(this.cnShiftKey)
                            : this.copyKey(this.enShiftKey)
                        : this.copyKey(this.normalKey)
                }

                // 大写键
            } else if (key === 'Caps') {
                // 符号开启，不处理
                if (!this.isShift) {
                    this.isCaps = !this.isCaps
                    this.showKey = this.isCaps ? this.copyKey(this.capsKey) : this.copyKey(this.normalKey)
                }
                // 其他键
            } else {
                // 删除键
                if (key === 'Delete') {
                    // 如果是中文输入法且输入过程中则删除预输入
                    if (this.isCn && this.inputMethod.visible) {
                        this.inputMethod.delChar()
                    } else {
                        // 删除输入框内容
                        this.delChar()
                    }
                    // 空格键
                } else if (key === 'Space') {
                    // 中文
                    if (this.isCn && this.inputMethod.visible) {
                        this.inputMethod.selectHanZi(1)
                    } else {
                        // 英文
                        this.addChar(' ')
                    }
                    // 确定键
                } else if (key === 'Enter') {
                    // 中文
                    if (this.isCn && this.inputMethod.visible) {
                        this.inputMethod.selectHanZi(1)
                    } else {
                        // 英文
                        // this.addChar('\n')
                        this.handleClickClose()
                    }
                    // 其他键
                } else {
                    // 中文
                    if (this.isCn) {
                        // 中文编辑框已经打开
                        if (this.inputMethod.visible) {
                            if (/[a-z]/.test(key)) {
                                this.inputMethod.addChar(key)
                            } else if (/[1-5]/.test(key)) {
                                this.inputMethod.selectHanZi(key)
                            } else {
                                this.inputMethod.otherChar(key)
                            }
                            // 中文编辑框未打开
                            // 输入的是小写字母，则打开编辑框
                        } else if (/[a-z]/.test(key)) {
                            this.inputMethod.addChar(key)
                            // 按照英文输入法显示
                        } else {
                            this.addChar(key)
                        }
                    } else {
                        // 英文
                        this.addChar(key)
                    }
                }
            }
        },
        // 接收返回的汉字
        returnChinese(val) {
            this.$emit('getKeyValue', val)
        },
        // 输入法切换
        handleClickMethod(status) {
            this.isCn = status
            if (this.isShift) {
                this.showKey = this.isCn ? this.copyKey(this.cnShiftKey) : this.copyKey(this.enShiftKey)
            } else if (!status) {
                // 由中文改为英文则隐藏输入法
                this.inputMethod.hide()
            }
        },
        // 关闭软键盘
        handleClickClose() {
            this.visible = false
            this.isCaps = false
            this.isCn = false
            this.onClose()
        },
        addChar(key) {
            const inputEl = document.querySelector(`#${this.elmId}`)
            if (inputEl) {
                inputEl.value += key
                this.$emit('getKeyValue', inputEl.value)
            }
        },
        delChar() {
            const inputEl = document.querySelector(`#${this.elmId}`)
            let index = this.getCursorPos()

            if (inputEl) {
                inputEl.value =
                    inputEl.value.substr(0, index - 1) + inputEl.value.substr(index, inputEl.value.length - 1)
                this.setCursorPos(index - 1)
                this.$emit('removeValue', inputEl.value)
            } else {
                index = inputEl.value.length > 0 ? inputEl.value.length : 0
                this.setCursorPos(index)
                this.$emit('removeValue', '')
            }
        },
        copyKey(key) {
            return JSON.parse(JSON.stringify(key))
        },
        // 初始化键盘
        initKey() {
            const numberKeys = []
            for (let i = 1; i < 10; i++) {
                numberKeys.push(i.toString())
            }
            numberKeys.push('0')

            // 基础键值
            const keys = [
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', `'`],
                ['Caps', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Delete'],
                ['Shift', ',', 'Space', '.', 'Enter']
            ]

            // 英语下的符号键盘
            this.enShiftKey = [
                numberKeys,
                ['`', '!', '@', '#', '$', '%', '^', '&', '*', `'`],
                ['Caps', '(', ')', '[', ']', ';', ':', '/', 'Delete'],
                ['Shift', ',', 'Space', '.', 'Enter']
            ]

            // 中文下的符号键盘
            this.cnShiftKey = [
                numberKeys,
                ['·', '！', '@', '#', '￥', '%', '……', '&', '*', '’'],
                ['Caps', '（', '）', '【', '】', '；', '：', '、', 'Delete'],
                ['Shift', '，', 'Space', '。', 'Enter']
            ]

            // 大写键盘
            const capsKey = []
            for (let i = 0; i < keys.length; i++) {
                capsKey.push([])
                const thisKeys = keys[i]
                for (const item of thisKeys) {
                    if (item.length === 1) {
                        capsKey[i].push(item.toUpperCase())
                        continue
                    }
                    capsKey[i].push(item)
                }
            }

            this.showKey = keys
            this.normalKey = this.copyKey(keys)
            this.capsKey = capsKey
        },
        // 获取输入框中光标位置
        getCursorPos() {
            const inputEl = document.querySelector(`#${this.elmId}`)
            let pos = 0
            pos = inputEl.selectionStart
            return pos
        },
        // 设置光标
        setCursorPos(pos) {
            const inputEl = document.querySelector(`#${this.elmId}`)
            inputEl.focus()
            inputEl.setSelectionRange(pos, pos)
        },
        onClose() {
            const inputEl = document.querySelector(`#${this.elmId}`)
            if (inputEl) {
                return inputEl.value
            }
        }
    }
}
</script>

<style lang="less" type="text/css" scoped>
.keyboard {
    height: 600px;
    width: 750px;
    background: black;
    color: white;
    box-sizing: border-box;
    z-index: 3001;
    .keyboard-inner {
        height: 100%;
        .tools {
            margin-right: 38px;
            height: 16%;
            text-align: right;
            line-height: 2;
            span {
                font-size: 40px;
                padding: 0 6px;
                cursor: pointer;
            }
            img {
                width: 55px;
                vertical-align: text-top;
            }
        }
        .keyboard-item {
            height: 103px;
            text-align: center;
            .keyboard-key {
                height: 96px;
                width: 96px;
                border-radius: 4px;
                background: #797487;
                color: white;
                display: inline-block;
                line-height: 96px;
                text-align: center;
                box-sizing: border-box;
                margin: 3px;
                cursor: pointer;
                user-select: none;
                vertical-align: text-bottom;
                span {
                    font-size: 30px;
                }
                img {
                    width: 50px;
                    vertical-align: middle;
                }

                &.Delete,
                &.Caps {
                    width: 147px;
                }

                &.Enter,
                &.Shift {
                    width: 120px;
                }

                &.Space {
                    width: 558px;
                }

                &.active {
                    background: #4655ff;
                }
            }
        }
    }
    &.bottom-center {
        width: 100% !important;
        height: 500px;
        position: fixed;
        bottom: 100px;
        left: 0px;
        border-radius: 0 !important;
    }
}
.bottom-slide-fade-enter-active,
.bottom-slide-fade-leave-active {
    transition: all 0.3s ease;
}
.bottom-slide-fade-enter,
.bottom-slide-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;
}
</style>
