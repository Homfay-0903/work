<!--
 * @Description: 中文输入法
 * @Author: gaoyuanyuan
 * @Date: 2021-10-12 14:12:37
 * @LastEditors: ouyaping
 * @LastEditTime: 2022-11-08 16:38:43
-->
<template>
    <transition name="fade">
        <div v-show="visible" class="input-method" id="input-method">
            <!-- 输入区 -->
            <div class="pinyin">{{ outputText + pinyin }}</div>
            <!-- 匹配区 -->
            <div class="result">
                <ol>
                    <li v-for="(val, idx) in pageResult" :key="idx" @touchend="selectHanZi(idx + 1)">
                        {{ idx + 1 }}.{{ val }}
                    </li>
                </ol>
                <!-- 翻页 -->
                <div class="page-btn">
                    <span :class="['page-up', { disable: pageCurrent <= 1 }]" @touchend="handlePageUp">
                        <img src="@/assets/img/keyboard/arrow-up.svg" alt="上" />
                    </span>
                    <span :class="['page-down', { disable: pageCurrent >= pageCount }]" @touchend="handlePageDown">
                        <img src="@/assets/img/keyboard/arrow-down.svg" alt="下" />
                    </span>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import pinyinLib from './pinyin'

export default {
    data() {
        return {
            visible: false,
            // 当前页匹配到的汉字数组
            pageResult: [],
            // 已输入的拼音（如拼音已选择对应汉字则移除）
            pinyin: '',
            // 选择输出的汉字内容
            outputText: '',
            // 所有匹配到的汉字数组（显示到页面上还需分页）
            result: [],
            // 当前页
            pageCurrent: 1,
            // 每页大小
            pageSize: 5,
            // 总页数
            pageCount: 0,
            chineseLib: {},
            // 绑定的输入框
            input: ''
        }
    },
    created() {
        this.initPinYin()
    },
    methods: {
        /**
         * @description 选择候选汉字
         * @param {number} index 汉字下标 1~5
         * @return {*}
         */
        selectHanZi(index) {
            const hz = this.result[(this.pageCurrent - 1) * this.pageSize + index - 1]
            if (hz) {
                this.outputText += hz
                this.$emit('returnChinese', hz)
                const idx = this.pinyin.indexOf(`'`)
                if (idx > 0) {
                    this.pinyin = this.pinyin.substr(idx + 1)
                    this.refreshInput()
                } else {
                    // 如果没有单引号，表示已经没有候选词了
                    this.input.value += this.outputText
                    this.hide()
                }
            }
        },

        // 上一页
        handlePageUp() {
            if (this.pageCurrent > 1) {
                this.pageCurrent--
                this.refreshPage()
            }
        },

        // 下一页
        handlePageDown() {
            if (this.pageCurrent < this.pageCount) {
                this.pageCurrent++
                this.refreshPage()
            }
        },

        // 输入法定位
        initInput(selector) {
            this.input = document.querySelector(selector)
            // 输入框定位
            const pos = this.input.getBoundingClientRect()
            const target = document.querySelector('#input-method')
            target.style.left = pos.left + 'px'
            target.style.top = pos.top + pos.height + document.body.scrollTop + 'px'
        },

        // 隐藏输入法
        hide() {
            this.reset()
            this.visible = false
        },

        // 添加
        addChar(ch) {
            if (this.pinyin.length === 0) {
                // 长度为1，显示输入法
                this.show()
            }
            this.pinyin += ch
            this.refreshInput()
        },

        // 删除
        // 拼音删除完继续将上一个匹配的汉字转为拼音继续删除
        delChar() {
            if (this.pinyin.length <= 1) {
                if (this.outputText.length < 1) {
                    this.hide()
                } else {
                    // 截取最后一位文字转为拼音
                    const str = this.outputText
                    const lastText = str.substr(str.length - 1, 1)
                    this.pinyin = this.getPinYin(lastText)
                    this.outputText = str.substr(0, str.length - 1)
                }
            } else {
                this.pinyin = this.pinyin.substr(0, this.pinyin.length - 1)
            }
            this.refreshInput()
        },

        // 除了字母以外的其他key处理
        // 将输入区追加key后返回
        otherChar(key) {
            this.input.value += this.outputText + this.pinyin + key
            this.hide()
        },
        // 显示
        show() {
            this.visible = true
        },

        // 刷新
        // 将拼音转换成汉字候选词,并显示在界面上
        refreshInput() {
            const temp = this.getHanZi(this.pinyin.replace(/'/g, ''))
            this.result = temp[0]
            this.pinyin = temp[1]
            const count = this.result.length
            this.pageCurrent = 1
            this.pageCount = Math.ceil(count / this.pageSize)
            this.refreshPage()
        },

        // 上下页切换
        refreshPage() {
            this.pageResult = this.result.slice(
                (this.pageCurrent - 1) * this.pageSize,
                this.pageCurrent * this.pageSize
            )
        },

        // 重置
        reset() {
            this.outputText = ''
            this.pinyin = ''
            this.result = []
            this.pageResult = []
            this.pageCurrent = 1
            this.pageCount = 0
            this.visible = false
        },

        // 初始化中文拼音依赖库
        initPinYin() {
            // 拼音转汉字
            this.chineseLib.i = 'i' // i比较特殊，没有符合的汉字，所以特殊处理
            for (let i = 97; i <= 123; i++) {
                const ch = String.fromCharCode(i)
                if (!pinyinLib[ch]) {
                    for (const j in pinyinLib) {
                        if (j.indexOf(ch) === 0) {
                            this.chineseLib[ch] = pinyinLib[j]
                            break
                        }
                    }
                }
            }
        },

        /**
         * @description 拼音转汉字
         * @param {string} pinyin 需要转换的拼音
         * @return {array} [["中","重","种","众","终","钟","忠"], "zhong'guo"]
         */
        getHanZi(pinyin) {
            let result = this.getSingleHanZi(pinyin)
            if (result) {
                return [result.split(''), pinyin]
            }
            let temp = ''
            for (let i = 0, len = pinyin.length; i < len; i++) {
                temp += pinyin[i]
                result = this.getSingleHanZi(temp)
                if (!result) {
                    continue
                }
                // flag表示如果当前能匹配到结果、并且往后5个字母不能匹配结果，因为最长可能是5个字母，如 zhuang
                let flag = false
                if (i + 1 < pinyin.length) {
                    for (let j = 1, l = pinyin.length; j <= 5 && i + j < l; j++) {
                        if (this.getSingleHanZi(pinyin.substr(0, i + j + 1))) {
                            flag = true
                            break
                        }
                    }
                }
                if (!flag) {
                    return [result.split(''), `${pinyin.substr(0, i + 1)}'${pinyin.substr(i + 1)}`]
                }
            }
            return [[], '']
        },

        /**
         * @description 单个拼音转单个汉字，输入 "a" 返回 "阿啊呵腌嗄吖锕"
         * @param {string} pinyin 需要转换的拼音
         * @return {*}
         */
        getSingleHanZi(pinyin) {
            // 如果以大写开头则直接返回不处理
            if (/^[A-Z]{0,1}$/.test(pinyin)) {
                return pinyin
            }
            return this.chineseLib[pinyin] || pinyinLib[pinyin] || ''
        },

        /**
         * @description 获取汉字的拼音
         * @param {string} chinese 汉字
         * @return {string}
         */
        getPinYin(chinese) {
            let str = ''
            for (const j in pinyinLib) {
                if (pinyinLib[j].indexOf(chinese) > -1) {
                    str = j
                }
            }
            return str
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.input-method {
    position: absolute;
    background: #393a55;
    border: solid 1px #1d2129;
    color: #fff;
    z-index: 3002;
    text-align: left;
    box-shadow: 0px 6px 16px 5px rgba(51, 57, 84, 0.4);
    .pinyin {
        font-size: 34px;
        height: 62px;
        line-height: 62px;
        text-align: left;
        border-bottom: solid 1px #1d2129;
        padding: 6px 20px;
    }
    .result {
        padding: 6px 0px;
        ol {
            width: 560px;
            margin: 0;
            padding: 0;
            display: inline-block;
            vertical-align: middle;
            &:after {
                content: '';
                display: block;
                clear: left;
            }
            li {
                font-size: 34px;
                float: left;
                margin-left: 26px;
                cursor: pointer;
                opacity: 0.6;
                &:first-child {
                    opacity: 1;
                }
            }
        }
    }

    .page-btn {
        display: inline-block;
        font-size: 34px;
        color: #4c9aef;
        vertical-align: middle;
        .page-up,
        .page-down {
            display: inline-block;
            width: 50px;
            text-align: center;
            &.disable {
                opacity: 0.3;
            }
            img {
                width: 40px;
                vertical-align: middle;
            }
        }
        .page-down {
            span {
                cursor: pointer;
                &.disable {
                    opacity: 0.3;
                }
            }
        }
    }
}
</style>
