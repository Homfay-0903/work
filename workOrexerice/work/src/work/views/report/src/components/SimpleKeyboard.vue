<template>
    <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import layout from 'simple-keyboard-layouts/build/layouts/chinese' // 中文输入法

export default {
    name: 'SimpleKeyboard',
    props: {
        keyboardClass: {
            default: 'simple-keyboard',
            type: String
        },
        input: {
            default: ''
        },
        maxLength: { default: '' }
    },
    data: () => ({
        keyboard: null,
        displayDefault: {
            '{bksp}': 'backspace',
            '{lock}': 'caps',
            '{enter}': '> enter',
            '{tab}': 'tab',
            '{shift}': 'shift',
            '{change}': '英文',
            '{space}': ' ',
            '{clear}': '清空',
            '{close}': '关闭'
        }
    }),
    mounted() {
        this.keyboard = new Keyboard(this.keyboardClass, {
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            layoutCandidates: layout.layoutCandidates,
            layoutCandidatesPageSize: 5, // 输入建议词每页显示数，默认值5
            layout: {
                // 默认布局
                default: [
                    '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
                    '{tab} q w e r t y u i o p [ ] \\',
                    "{lock} a s d f g h j k l ; ' {enter}",
                    '{shift} z x c v b n m , . / {clear}',
                    '{change} {space} {close}'
                ],
                // shift布局
                shift: [
                    '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
                    '{tab} Q W E R T Y U I O P { } |',
                    '{lock} A S D F G H J K L : " {enter}',
                    '{shift} Z X C V B N M < > ? {clear}',
                    '{change} {space} {close}'
                ]
            },
            // 按钮展示文字
            display: this.displayDefault,
            // 按钮样式
            buttonTheme: [
                {
                    class: 'hg-red close',
                    buttons: '{close}'
                },
                {
                    class: 'change',
                    buttons: '{change}'
                }
            ],
            // 输入限制长度
            maxLength: this.maxLength
        })
    },
    methods: {
        onChange(input) {
            this.$emit('onChange', input) // 输入值向外传递
        },
        // 重写清空按钮
        onChangeKey() {
            this.keyboard.setInput('')
            this.$emit('empty')
        },
        // @focus 触发时赋值 封装组件调用
        onChangeFocus(value) {
            this.keyboard.setInput(value)
        },
        // 点击键盘
        onKeyPress(button, $event) {
            // 点击关闭
            if (button === '{close}') {
                // 子组件调用父组件的关闭按钮方法
                this.$parent.closekeyboard()
                return false
            } else if (button === '{change}') {
                // 切换中英文输入法
                if (this.keyboard.options.layoutCandidates !== null) {
                    this.displayDefault['{change}'] = '中文'
                    // 切换至英文
                    this.keyboard.setOptions({
                        layoutCandidates: null,
                        display: this.displayDefault
                    })
                } else {
                    // 切换至中文
                    this.displayDefault['{change}'] = '英文'
                    this.keyboard.setOptions({
                        layoutCandidates: layout.layoutCandidates,
                        display: this.displayDefault
                    })
                }
            } else if (button === '{clear}') {
                this.onChangeKey()
            } else {
                let value = $event.target.offsetParent.parentElement.children[0].children[0].value
                // 输入框有默认值时，覆写
                if (value) {
                    this.keyboard.setInput(value)
                }
                this.$emit('onKeyPress', button)
            }
            if (button === '{shift}' || button === '{lock}') this.handleShift()
        },
        // 切换shift/默认布局
        handleShift() {
            let currentLayout = this.keyboard.options.layoutName
            let shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

            this.keyboard.setOptions({
                layoutName: shiftToggle
            })
        }
    }
    //   watch: {
    //     input(input) {
    //       this.keyboard.setInput(input);
    //     },
    //   },
}
</script>

<style lang="less">
@deep: ~'>>>';
.hg-candidate-box {
    position: fixed;
    //   width: 50%;
    background: rgba(256, 256, 256);
    z-index: 9999;
    .hg-candidate-box-list {
        margin: auto;
        .hg-candidate-box-list-item {
            padding: 0 20px;
            font-size: 42px;
            font-family: HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande,
                sans-serif;
        }
    }
    .hg-candidate-box-prev,
    .hg-candidate-box-next,
    .hg-candidate-box-btn-active {
        font-size: 42px;
        font-family: HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande,
            sans-serif;
    }
}
.hg-rows {
    width: 100% !important;
    .hg-row {
        height: 60px;
        .hg-button {
            height: 60px;
            font-size: 30px !important;
            span {
                font-size: 30px !important;
                font-family: HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande,
                    sans-serif;
            }
        }
    }
}

.hg-theme-default {
    width: 100%;
    color: #000;
    .hg-button {
        &.hg-red {
            background: #db3e5d;
            color: white;
            &.close {
                max-width: 200px;
            }
        }
        &.change {
            max-width: 200px;
        }
    }
}
</style>
