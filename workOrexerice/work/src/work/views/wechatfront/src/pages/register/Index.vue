<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-07-05 17:13:11
 * @LastEditors: liutq
 * @LastEditTime: 2025-11-26 15:04:36
 * @FilePath: \vr-pro3-wechat-frontend\src\pages\register\Index.vue
 * @Description:
-->
<template>
    <div class="register-page">
        <div class="header">
            <h2>新用户注册</h2>
            <p v-if="!isRegInfo">注册您的ID，云储存数据报告，便捷查看</p>
            <p class="tips" v-else>真实的信息非常重要，请仔细填写</p>
        </div>
        <!-- 手机号绑定页面 -->
        <div class="content" v-show="!isRegInfo">
            <div class="form">
                <div class="item">
                    <label for="mobile">手机号</label>
                    <div class="info">
                        <input
                            @blur="handleBlurReset($event)"
                            @focus="handleFouceReset($event)"
                            name="mobile"
                            placeholder="请输入手机号"
                            type="number"
                            v-model="form.phone"
                        />
                        <i @click="handleClearMobile" class="icon-del" v-if="form.phone"></i>
                    </div>
                </div>
                <div class="item">
                    <label for="verifyCode">验证码</label>
                    <div class="info">
                        <input
                            :disabled="isCodeInputDisabled"
                            @blur="handleBlurReset($event)"
                            @focus="handleFouceReset($event)"
                            @input="validatorCode"
                            name="verifyCode"
                            placeholder="请输入验证码"
                            type="number"
                            v-model="form.code"
                        />
                        <span
                            :class="{ 'is-disabled': isCodeBtnDisabled }"
                            @click="handleSendCode(1)"
                            class="get-code-btn"
                        >{{ codeText }}</span>
                    </div>
                </div>
                <div class="rulety" v-if="veriStatus">
                    收不到短信? 试试
                    <span @click="handleSendVoice(2)">语音验证码</span>
                </div>
                <div class="rule">
                    <span :class="[{ 'is-check': isSelectRule }, 'checkbox']">
                        <input type="checkbox" v-model="isSelectRule" />
                    </span>
                    我已阅读并同意
                    <span @click="goToUser('UserRule')">《用户使用协议》</span>和
                    <span @click="goToUser('UserSecret')">《用户隐私协议》</span>
                </div>
                <div class="submit-btn">
                    <button
                        :class="{ 'is-disabled': isMobileSubmitDisabled }"
                        @click.prevent="handleMobileSumbit"
                        @keyup.enter="handleMobileSumbit"
                        type="submit"
                    >注册</button>
                </div>
            </div>
        </div>
        <!-- 用户信息注册页面 -->
        <div class="content user-info" v-show="isRegInfo">
            <div class="form">
                <div class="item">
                    <label for="mobile">性别</label>
                    <div class="info center">
                        <span :class="[{ 'is-active': form.sex === 1 }, 'sex']" @click="form.sex = 1">男</span>
                        <span :class="[{ 'is-active': form.sex === 2 }, 'sex']" @click="form.sex = 2">女</span>
                    </div>
                </div>
                <div class="item" v-if="isShowHeight">
                    <label for="mobile">身高</label>
                    <div @click="handleHeightMouseEnter" class="info">
                        <div class="over" v-if="!inputHeight && !height.value">请输入您的身高</div>
                        <input
                            @blur="handleBlurHeight($event)"
                            name="height"
                            oninput="if(value.length > 3)value = value.slice(0, 3)"
                            ref="height"
                            type="tel"
                            v-model="height.value"
                        />
                        <span v-if="height.value">cm</span>
                    </div>
                </div>
                <div class="item">
                    <label for="birthday">生日</label>
                    <div class="info center" ref="birdayInput">
                        <div
                            @click="handleClickBirthday($event)"
                            class="over"
                            v-if="!inputBirthday && !birthday.year && !birthday.month && !birthday.day"
                        >请输入您的生日</div>
                        <input
                            @blur="handleEventBirthday($event, 0, false)"
                            @focus="handleEventBirthday($event, 0, true)"
                            @keyup="autoFocusNext($event, 0)"
                            name="birthday"
                            oninput="if(value.length > 4)value = value.slice(0, 4)"
                            ref="year"
                            type="tel"
                            v-model="birthday.year"
                        />
                        年
                        <input
                            @blur="handleEventBirthday($event, 1, false)"
                            @focus="handleEventBirthday($event, 1, true)"
                            @keyup="autoFocusNext($event, 1)"
                            name="birthday"
                            oninput="if(value.length > 2)value = value.slice(0, 2)"
                            ref="month"
                            type="tel"
                            v-model="birthday.month"
                        />
                        月
                        <input
                            @blur="handleEventBirthday($event, 2, false)"
                            @focus="handleEventBirthday($event, 2, true)"
                            @keyup="autoFocusNext($event, 2)"
                            name="birthday"
                            oninput="if(value.length > 2)value = value.slice(0, 2)"
                            ref="day"
                            type="tel"
                            v-model="birthday.day"
                        />
                        日
                    </div>
                </div>
                <p :class="[{ opacity: errorMg === '-' }, 'tips']">{{ errorMg }}</p>
                <div class="submit-btn">
                    <button
                        v-if="!submitDisabled"
                        :class="{ 'is-disabled': isSubmitDisabled }"
                        :disabled="submitDisabled"
                        @click.prevent="handleInfoSumbit"
                        @keyup.enter="handleInfoSumbit"
                        type="submit"
                    >
                        <span>完成</span>
                    </button>
                    <button v-else :class="{ 'is-disabled': isSubmitDisabled }" type="submit">
                        <span class="spinnerBtn">
                            <mt-spinner type="snake" :size="24" color="#ffffff"></mt-spinner>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <p class="tips" v-if="!isRegInfo">真实的信息非常重要，请仔细填写</p>
        <!-- 弹框提醒 -->
        <div class="spring-frame" v-if="isdialog">
            <div class="dialog">
                <img :src="dialogBox.url" alt />
                <h6 :class="dialogBox.default ? 'isH6' : 'h6'">{{ dialogBox.message }}</h6>
                <div class="dialog-box" v-if="!dialogBox.default">
                    <div class="dialog-left" @click="handleSendCode(1)">继续获取短信</div>
                    <div class="dialog-right" @click="handleSendVoice(2)">获取语音验证码</div>
                </div>
                <div v-else @click="onclose" class="dialog-sure">好的</div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getSmsCode,
    bindMemberMobile,
    registerMember,
    findScanTypeInfo,
    findLatestScanTypeInfo,
    getWechatSignature,
    ifLogoCloudEnable
} from '@/assets/js/apolloGql.js'
import { isWeiXin, getDomainFromString } from '@/assets/js/util.js'
import wx from 'weixin-js-sdk'
import { isVAPro3, isVAPro5 } from '@/types/device.js'

export default {
    data() {
        return {
            form: {
                code: '',
                phone: '',
                sex: 1,
                birthday: '',
                height: '',
            },
            height: {
                isValid: false,
                value: '',
            },
            birthday: {
                isValid: false,
                year: '',
                month: '',
                day: '',
            },
            // 验证码定时器
            timer: '',
            // 获取验证码时间间隔 60s
            countDown: 60,
            codeText: '获取验证码',
            // 是否勾选同意协议
            isSelectRule: false,
            // 验证码默认不能输入 验证码发送成功后才能输入
            isCodeInputDisabled: false,
            // 验证码是否正在发送状态
            isCodeSending: false,
            // 注册用户信息页面
            isRegInfo: false,
            // 身高是否处于输入
            inputHeight: false,
            // 生日是否处于输入
            inputBirthday: false,
            outTimeStamp: 0,
            // 错误信息
            errorMg: '-',
            // 提交按钮状态
            submitDisabled: false,
            // 按钮开关
            isBtnHand: true,
            scanType: null,
            loginInfo: JSON.parse(window.localStorage.getItem('loginInfo')),
            // 语音验证码状态
            veriStatus: false,
            // 点击次数
            VoiceSum: 0,
            // 弹框次数状态
            frameStatus: false,
            // 图片url
            dialogBox: {
                url: require('../../assets/images/svg/Voice.svg'),
                message: '没有收到短信? 试试语音验证码',
                default: false,
            },
            // 弹框状态
            isdialog: false,
            // 是否分享进入
            isShare: 0,
            isShowHeight: true
        }
    },

    computed: {
        // 是否禁用获取验证码按钮 手机号长度不对|正在倒计时|验证码已发送等待返回
        isCodeBtnDisabled() {
            return this.form.phone.length !== 11 || this.countDown !== 60 || this.isCodeSending
        },
        // 是否禁用手机号注册按钮
        isMobileSubmitDisabled() {
            return this.form.phone.length !== 11 || this.form.code.length !== 4 || !this.isSelectRule
        },
        // 是否禁用用户信息注册按钮
        isSubmitDisabled() {
            return this.birthday.isValid === false || this.height.isValid === false
        },
        userAgent() {
            const ua = navigator.userAgent
            return {
                ua: ua,
                isAndroid: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1,
                isiOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            }
        },
    },

    watch: {
        // 监听身高
        'height.value': {
            deep: true,
            handler: function (val, oldVal) {
                this.valideHeight()
            },
        },
        // 监听生日
        birthday: {
            deep: true,
            handler: function (val, oldVal) {
                const yearReg = /^[1-2](9|0)\d{2}$/
                const monReg = /^(0?[1-9]|1[0-2])$/
                const dayReg = /^((0?[1-9])|((1|2)[0-9])|30|31)$/
                // 校验年份有效性
                if (val.year.length === 4) {
                    this.errorMg = yearReg.test(val.year) ? '-' : '请填写正确的生日'
                }
                // 校验月份有效性
                if (val.month) {
                    this.errorMg = monReg.test(val.month) ? '-' : '请填写正确的生日'
                }
                // 校验天份有效性
                if (val.day) {
                    this.errorMg = dayReg.test(val.day) ? '-' : '请填写正确的生日'
                }
                // 等待生日填写完整后 开始校验年龄范围
                if (val.year && val.month && val.day) {
                    this.valideBirthday()
                }
            },
        },
    },

    beforeDestroy() {
        clearInterval(this.timer)
    },

    mounted() {
        window.localStorage.removeItem('memberInfo')
        this.isShare = sessionStorage.getItem('isShare')
        // 保留信息不被清空
        const lookUserInfo = JSON.parse(window.sessionStorage.getItem('lookUserInfo'))
        if (lookUserInfo) {
            this.form.phone = lookUserInfo.phone
            this.form.code = lookUserInfo.code
            this.isCodeInputDisabled = false
        }
    },

    methods: {
        // 失去焦点后重置背景
        handleBlurReset(e) {
            this.outTimeStamp = e.timeStamp
            setTimeout(() => {
                if (this.outTimeStamp === e.timeStamp) {
                    this.resetBackground()
                }
            }, 100)
        },

        handleFouceReset(e) {
            this.outTimeStamp = e.timeStamp
        },

        // 鼠标进入身高输入框区域
        handleHeightMouseEnter() {
            this.inputHeight = true
            // 身高为空 自动焦点到身高
            if (!this.height.value) {
                this.$refs.height.focus()
            }
        },

        // 身高输入框失去焦点
        handleBlurHeight(e) {
            this.inputHeight = false
            this.outTimeStamp = e.timeStamp
            setTimeout(() => {
                if (this.outTimeStamp === e.timeStamp) {
                    this.resetBackground()
                }
            }, 100)
        },

        // 校验身高
        valideHeight() {
            // 身高校验规则
            const regex = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (/^\d+$/.test(this.height.value)) {
                if (regex.test(this.height.value)) {
                    this.height.isValid = true
                    this.errorMg = '-'
                    this.form.height = this.height.value
                } else {
                    this.height.isValid = false
                    this.errorMg = '允许测量的身高范围是110-205cm，请重新输入'
                }
            } else {
                this.height.isValid = false
                this.errorMg = '允许输入的身高格式不支持小数，请重新输入'
            }
        },

        // 鼠标进入生日输入区域
        handleClickBirthday(e) {
            this.outTimeStamp = e.timeStamp
            this.inputBirthday = true
            // 年份为空 自动焦点到年份
            if (!this.birthday.year) {
                this.$refs.year.focus()
            }
        },

        /**
         * 生日输入框事件处理
         *
         * @param {*} e
         * @param {number} type
         * @param {boolean} state true 获取焦点 false 移除焦点
         * @returns
         */
        handleEventBirthday(e, type, state) {
            this.outTimeStamp = e.timeStamp
            if (state === false) {
                if (type === 1) {
                    // 月份不为空则自动补0
                    this.birthday.month = this.birthday.month ? this.complete(this.birthday.month) : ''
                } else if (type === 2) {
                    // 天不为空则自动补0
                    this.birthday.day = this.birthday.day ? this.complete(this.birthday.day) : ''
                }

                setTimeout(() => {
                    if (this.outTimeStamp === e.timeStamp) {
                        this.inputBirthday = false
                        this.resetBackground()
                    }
                }, 100)
            }
        },

        // 生日依次输入跳转
        autoFocusNext(e, type) {
            // ios及安卓下的退格处理
            if (e.keyCode === 8) {
                // 年份为空仍删除则不处理
                if (type === 0 && this.birthday.year === '') {
                    e.preventDefault()
                    e.stopPropagation()
                }
                if (type === 1 && !this.birthday.month) {
                    this.$refs.year.focus()
                }
                if (type === 2 && !this.birthday.day) {
                    this.$refs.month.focus()
                }
                this.valideBirthday()
            } else {
                // 年份
                if (type === 0) {
                    // 自动跳转到月
                    if (this.birthday.year.length === 4) {
                        this.$refs.month.focus()
                        this.birthday.month = ''
                    }
                    // 月份
                } else if (type === 1) {
                    // 大于 1 时 自动跳转 否则等输入完两位
                    if (this.birthday.month > 1 || this.birthday.year.length === 2) {
                        this.$refs.day.focus()
                        this.birthday.day = ''
                    }
                }
            }
        },

        // 校验生日有效性
        valideBirthday() {
            const birthStr = `${this.birthday.year}-${this.complete(this.birthday.month)}-${this.complete(
                this.birthday.day
            )}`

            const date = this.$moment(birthStr, this.$moment.ISO_8601)
            if (date.isValid()) {
                const age = this.getAge(birthStr)
                if (age < 3 || age > 99) {
                    this.birthday.isValid = false
                    this.errorMg = '允许测量的年龄范围为3-99岁，请重新输入'
                } else {
                    this.birthday.isValid = true
                    this.errorMg = '-'
                    this.form.birthday = birthStr
                }
            } else {
                this.birthday.isValid = false
                this.errorMg = '请填写正确的生日'
            }
        },

        // 根据输入的生日获取年龄
        getAge(birthday) {
            let age
            const birthdayArr = birthday.split('-')
            const birthdayYear = parseInt(birthdayArr[0], 10)
            const birthdayMonth = parseInt(birthdayArr[1], 10)
            const birthdayDay = parseInt(birthdayArr[2], 10)
            const today = new Date()
            const nowYear = today.getFullYear()
            const nowMonth = today.getMonth() + 1
            const nowDay = today.getDate()
            if (nowYear === birthdayYear) {
                age = 0 // 同年 则为0岁
            } else {
                const ageDiff = nowYear - birthdayYear // 年之差
                if (ageDiff > 0) {
                    if (nowMonth === birthdayMonth) {
                        const dayDiff = nowDay - birthdayDay // 日之差
                        if (dayDiff < 0) {
                            age = ageDiff - 1
                        } else {
                            age = ageDiff
                        }
                    } else {
                        const monthDiff = nowMonth - birthdayMonth // 月之差
                        if (monthDiff < 0) {
                            age = ageDiff - 1
                        } else {
                            age = ageDiff
                        }
                    }
                } else {
                    age = -1 // 返回-1 表示出生日期输入错误 晚于今天
                }
            }
            return age // 返回周岁年龄
        },

        // 月、日自动补0
        complete(num) {
            let result
            result = num ? (num.length === 1 ? '0' + num : num) : '00'
            return result
        },

        // 重置iso下键盘收回后底部空白问题
        resetBackground() {
            window.scrollTo(0, 0)
        },

        // 发送验证码
        handleSendCode(verificationType) {
            let that = this
            // 判断按钮状态 禁用时不可点击
            if (this.isCodeBtnDisabled) {
                return
            }
            if (this.VoiceSum > 0 && this.frameStatus) {
                this.handlerAgain()
                return
            }
            if (verificationType !== 2) {
                this.isdialog = false
            }
            that.form.code = ''
            const reg = /^1\d{10}$/
            if (this.form.phone.length === 11 && this.countDown === 60) {
                if (!reg.test(this.form.phone)) {
                    this.$toast({
                        message: '手机号格式不正确',
                        duration: 3000,
                    })
                } else {
                    this.isCodeSending = true
                    this.$apollo
                        .query({
                            query: getSmsCode,
                            fetchPolicy: 'network-only',
                            variables: {
                                mobile: this.form.phone,
                                type: verificationType,
                            },
                        })
                        .then((res) => {
                            const data = res.data.sendValidationCode
                            if (data.code === 200) {
                                ++this.VoiceSum
                                this.frameStatus = true
                                // 验证码发送成功后可输入验证码
                                this.isCodeInputDisabled = false
                                let timer = setInterval(function () {
                                    that.countDown--
                                    that.codeText = `获取验证码(${that.countDown})`
                                    if (that.countDown === 0) {
                                        that.isCodeSending = false
                                        that.codeText = '获取验证码'
                                        clearInterval(timer)
                                        that.countDown = 60
                                    }
                                    if (that.countDown < 30) {
                                        that.veriStatus = true
                                    }
                                }, 1000)
                                this.timer = timer
                                this.$toast({
                                    message: data.message,
                                    duration: 3000,
                                })
                            } else {
                                this.isCodeSending = false
                                this.$toast({
                                    message: data.message,
                                    duration: 3000,
                                })
                            }
                        })
                        .catch((err) => {
                            console.error(err)
                            this.isCodeSending = false
                        })
                }
            }
        },
        // 二次点击信息提示
        handlerAgain() {
            this.frameStatus = false
            this.isdialog = true
        },
        // 语音验证码
        handleSendVoice(type) {
            if (this.isCodeBtnDisabled && type === 2) {
                this.$toast({
                    message: '60秒内只能获取一次验证码',
                    className: 'BackGround',
                    duration: 0,
                })
                return
            }
            if (this.VoiceSum > 0 && this.frameStatus) {
                this.frameStatus = false
            }
            this.dialogBox = {
                url: require('../../assets/images/svg/Voice1.svg'),
                message: '我们将以电话的方式告知您验证码，请注意接听来电。',
                default: true,
            }
            this.isdialog = true
            this.handleSendCode(2)
        },
        // 关闭弹框
        onclose() {
            this.isdialog = false
            this.dialogBox = {
                url: require('../../assets/images/svg/Voice.svg'),
                message: '没有收到短信? 试试语音验证码',
                default: false,
            }
        },

        // 清空手机号
        handleClearMobile() {
            if (this.form.phone) {
                this.form.phone = ''
                this.form.code = ''
                window.sessionStorage.removeItem('lookUserInfo')
            }
        },

        // 手机号绑定
        handleMobileSumbit() {
            if (!this.isMobileSubmitDisabled) {
                this.$apollo
                    .mutate({
                        mutation: bindMemberMobile,
                        variables: {
                            mobile: this.form.phone,
                            code: String(this.form.code) || 0,
                        },
                    })
                    .then((res) => {
                        const data = res.data.bindMemberMobile
                        // 老用户 已有用户信息
                        if (data.code === 200) {
                            this.$toast({
                                message: data.message,
                                duration: 3000,
                            })
                            // 查询最新的一次扫描记录
                            this.findScanTypeInfo()
                        } else if (data.code === 404) {
                            this.isRegInfo = true
                            // 注册页面是否显示身高
                            if (data.data.height !== 0) {
                                this.isShowHeight = false
                                this.height.value = data.data.height
                            }
                        } else if (data.code === 413) {
                            this.$toast({
                                message: '验证码错误，请重新填写',
                                duration: 3000,
                            })
                        } else {
                            // 其他 登录失败
                            this.$toast({
                                message: data.message,
                                duration: 3000,
                            })
                        }
                    })
            } else {
                let err

                if (!this.isSelectRule) {
                    err = '请勾选用户使用协议'
                }

                if (!this.form.code) {
                    err = '请填写验证码'
                }

                // 判断验证码少于4位
                if (this.form.code && this.form.code.length < 4) {
                    err = '验证码错误'
                }

                if (!this.form.phone) {
                    err = '请填写手机号'
                } else {
                    const reg = /^1\d{10}$/
                    if (!reg.test(this.form.phone)) {
                        err = '手机号格式不正确'
                    }
                }

                if (err) {
                    this.$toast({
                        message: err,
                        duration: 2000,
                    })
                }
            }
        },

        // 判断验证码长度
        validatorCode() {
            const code = this.form.code
            if (code.length > 4) {
                this.form.code = code.substring(0, 4)
                this.$toast({
                    message: '请输入4位数的验证码',
                    duration: 3000,
                })
            }
        },

        // 跳转到用户使用/隐私协议
        goToUser(pathName) {
            this.$router.push({
                name: pathName,
            })
            if (this.form.phone || this.form.code) {
                window.sessionStorage.setItem('lookUserInfo', JSON.stringify(this.form))
            }
        },

        // 用户信息提交
        handleInfoSumbit() {
            if (!this.isSubmitDisabled && this.isBtnHand) {
                this.submitDisabled = true
                this.$apollo
                    .mutate({
                        mutation: registerMember,
                        variables: {
                            mobile: this.form.phone,
                            sex: Number(this.form.sex) || 0,
                            height: Number(this.form.height),
                            birthday: this.form.birthday,
                        },
                    })
                    .then((res) => {
                        this.submitDisabled = false
                        this.isBtnHand = false
                        const data = res.data.registerMember
                        if (data.code === 200) {
                            this.$toast({
                                message: '注册成功',
                                duration: 3000,
                            })
                            // 查询最新的一次扫描记录
                            this.findScanTypeInfo()
                        } else if (data.code === 404) {
                            // 当前微信号下没有报告
                            this.$router.push({
                                path: '/exception/report',
                            })
                        } else {
                            this.$toast({
                                message: data.message,
                                duration: 3000,
                            })
                        }
                    })
            } else {
                if (!this.birthday.isValid) {
                    this.valideBirthday()
                }

                if (!this.height.isValid) {
                    this.valideHeight()
                }
            }
        },

        // 判断模型是否生成
        findLatestScanTypeInfo() {
            this.$apollo
                .query({
                    query: findLatestScanTypeInfo,
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const info = res.data.findLatestScanTypeInfo
                    if (info.code === 200) {
                        const data = info.data
                        clearTimeout(this.timer)
                        /**
                         * 判断扫描类型
                         * data.scanType === 1 体测合成状态(体成分)
                         * data.scanType === 2 体态合成状态（体态）
                         * data.scanType === 3 体测合成状态 + 体态合成状态 (两者兼具)
                         */
                        /**
                         * 判断合成结果
                         * -10： 默认状态
                         * -1：  合成未返回
                         * 0：   失败
                         * 1：   成功
                         * 2：   超时
                         * bsScanInfo    体态
                         * bmScanInfo    体成分
                         */
                        // 如果未查看，跳转modeling
                        if (!data.viewStatus) {
                            this.jumpToReport()
                            return
                        }
                        this.scanType = data.scanType
                        if (data.scanType === 1) {
                            // 体测
                            if ([0, 2].indexOf(data.bmBiaScanInfo.result) > -1) {
                                this.findScanTrueHistory()
                            } else if (
                                [-1, -10].indexOf(data.bmBiaScanInfo.result) > -1 ||
                                [-1, -10].indexOf(data.bmBdaScanInfo.result) > -1
                            ) {
                                // 在合成中
                                this.$router.push({
                                    path: '/modeling',
                                })
                            } else {
                                // 在这里也要负载一次信息
                                let modelInfo = {
                                    scanId: data.scanId,
                                    memberId: data.memberId,
                                    scanType: data.scanType,
                                    createTime: data.createTime,
                                    bmBiaScanResult: data.bmBiaScanInfo.result,
                                    bmBdaScanResult: data.bmBdaScanInfo.result,
                                    girthMeasure: data.girthMeasure,
                                    questionReport: data.questionReport,
                                    nutrition: data.nutrition,
                                    teenagerReport: data.teenagerReport ? data.teenagerReport : 0,
                                    mpRecommend: data.mpRecommend ? data.mpRecommend : 0,
                                    spineReport: data.spineReport ? data.spineReport : 0,
                                    bsSpineStatus: data.bsSpineScanInfo ? data.bsSpineScanInfo.result : 0
                                }
                                window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                                this.jumpToReport(data.viewStatus)
                            }
                        }
                        if (data.scanType === 2) {
                            // 体态
                            if ([-1, -10].indexOf(data.bsScanInfo.result) > -1) {
                                // 在合成中
                                this.$router.push({
                                    path: '/modeling',
                                })
                            } else if (data.bsScanInfo.result === 1) {
                                // 在这里也要负载一次信息
                                let modelInfo = {
                                    scanId: data.scanId,
                                    memberId: data.memberId,
                                    scanType: data.scanType,
                                    createTime: data.createTime,
                                    bsScanResult: data.bsScanInfo.result,
                                }
                                window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                                this.jumpToReport(data.viewStatus)
                            } else {
                                this.findScanTrueHistory()
                            }
                        }
                        if (data.scanType === 3) {
                            // 体测 + 体态
                            // 两者都失败
                            if (
                                [0, 2].indexOf(data.bmBiaScanInfo.result) > -1 &&
                                [0, 2].indexOf(data.bsScanInfo.result) > -1
                            ) {
                                // 在这里调用历史数据接口函数
                                this.findScanTrueHistory()
                            } else if (
                                [-1, -10].indexOf(data.bmBiaScanInfo.result) > -1 ||
                                [-1, -10].indexOf(data.bmBdaScanInfo.result) > -1 ||
                                [-1, -10].indexOf(data.bsScanInfo.result) > -1
                            ) {
                                // 任意一个在合成中
                                this.$router.push({
                                    path: '/modeling',
                                })
                            } else {
                                // 访问首页
                                // 存储数据
                                let modelInfo = {
                                    scanId: data.scanId,
                                    memberId: data.memberId,
                                    scanType: data.scanType,
                                    createTime: data.createTime,
                                    bmBiaScanResult: data.bmBiaScanInfo.result,
                                    bmBdaScanResult: data.bmBdaScanInfo.result,
                                    bsScanResult: data.bsScanInfo.result,
                                    girthMeasure: data.girthMeasure,
                                    questionReport: data.questionReport,
                                    nutrition: data.nutrition,
                                    teenagerReport: data.teenagerReport ? data.teenagerReport : 0,
                                    mpRecommend: data.mpRecommend ? data.mpRecommend : 0,
                                    spineReport: data.spineReport ? data.spineReport : 0,
                                    bsSpineStatus: data.bsSpineStatus ? data.bsSpineStatus : 0
                                }
                                window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                                this.jumpToReport(data.viewStatus)
                            }
                        }
                    } else if (info.code === 404) {
                        // 当前微信号下没有报告
                        this.$router.push({
                            path: '/exception/report',
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 跳转报告页
        jumpToReport(viewStatus) {
            this.$router.push({
                path: viewStatus === 1 ? window.localStorage.getItem('healthPackageEnable') === '2' ? '/main' : '/report' : '/modeling'
            })
        },

        // 查询合成状态
        findScanTypeInfo() {
            const queryType = this.loginInfo.type === 'menuLogin' ? findLatestScanTypeInfo : findScanTypeInfo
            this.$apollo
                .query({
                    query: queryType,
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    let data =
                        this.loginInfo.type === 'menuLogin'
                            ? res.data.findLatestScanTypeInfo
                            : res.data.findScanTypeInfo
                    if (data.code === 200) {
                        data = data.data
                        // 预设置分享内容
                        this.shareClick(data.scanId)
                        // 只做了肩部评估
                        if (isVAPro3) {
                            let modelInfo = {
                                scanMode: data.scanMode,
                                questionReport: data.questionReport,
                                scanId: data.scanId,
                                girthMeasure: data.girthMeasure,
                            }
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        }
                        if (isVAPro5) {
                            const modelInfo = {
                                scanId: data.scanId,
                                memberId: data.memberId,
                                biaMeasure: data.biaMeasure,
                                staticEval: data.staticEval,
                                shoulderEval: data.shoulderJointEval,
                                createTime: data.createTime,
                                biaStatus: data.bmBiaScanInfo ? data.bmBiaScanInfo.result : 4,
                                bdaStatus: data.bmBdaScanInfo ? data.bmBdaScanInfo.result : 4,
                                evalStatus: data.bsScanInfo ? data.bsScanInfo.result : 4,
                                bsShoulderScanResult: data.bsShoulderScanInfo ? data.bsShoulderScanInfo.result : 4,
                                girthMeasure: data.girthMeasure,
                                scanMode: data.scanMode ? data.scanMode : 0,
                                questionReport: data.questionReport ? data.questionReport : 0,
                                // 2表示未测量
                                nutrition: data.nutrition,
                                teenagerReport: data.teenagerReport ? data.teenagerReport : 0,
                                mpRecommend: data.mpRecommend ? data.mpRecommend : 0,
                                spineReport: data.spineReport ? data.spineReport : 0,
                                bsSpineStatus: data.bsSpineScanInfo ? data.bsSpineScanInfo.result : 0,
                            }
                            this.ifLogoCloudEnable(data.scanId.split('-')[0])
                            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
                        }
                        // 如果未查看，跳转modeling
                        const onlyShoulder =
                            data.biaMeasure === 0 && data.staticEval === 0 && data.shoulderJointEval === 1
                        const shoulderScanSucceed = data.bsShoulderScanInfo !== null
                        if (onlyShoulder) {
                            // 判断肩部评估是否成功
                            if (shoulderScanSucceed) {
                                // 在这里也要负载一次信息
                                // 跳转到颈部详情页
                                this.$router.push({
                                    path: '/main',
                                })
                            } else {
                                // 无报告提醒页面
                                this.$router.push({
                                    path: '/exception/report',
                                })
                            }
                        } else {
                            // 有报告跳转到模型过渡页面进行合成状态判断
                            this.$router.push({
                                path: '/modeling',
                            })
                        }
                    } else if (data.code === 404) {
                        // 无报告提醒页面
                        this.$router.push({
                            path: '/exception/report',
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        ifLogoCloudEnable(deviceId) {
            this.$apollo.query({
                query: ifLogoCloudEnable,
                variables: { deviceId }
            }).then(res => {
                if (res.data.findDeviceInfo.data && res.data.findDeviceInfo.data.logoCloudEnable === 1) {
                    document.title = 'Visbody'
                    window.localStorage.setItem('logoCloudEnable', '1')
                }
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                if (res.data.findDeviceInfo.data && res.data.findDeviceInfo.data.healthPackageEnable === 2) {
                    document.title = '麦澜德佳澜 | Visbody'
                    window.localStorage.setItem('healthPackageEnable', 2)
                }
                if (res.data.findDeviceInfo.data && res.data.findDeviceInfo.data.spineReportEnabled === 1 && res.data.findDeviceInfo.data.isPillowRecommendReport === 1) {
                    document.title = '华住会'
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 设置分享
        shareClick(scanId) {
            if (isWeiXin()) {
                console.log(`report---------->isWeiXin: ${isWeiXin()} isShare: ${this.isShare}`)
                const url = window.location.href.split('#')[0]
                const isShare = this.isShare
                this.$apollo
                    .query({
                        query: getWechatSignature,
                        variables: {
                            url: url,
                        },
                    })
                    .then((res) => {
                        const data = res.data.getWechatSignature
                        if (data && data.code === 200) {
                            const signatureInfo = data.data
                            const domain = getDomainFromString(url)
                            console.log(`==========domain:  ${domain}`)
                            let shareUrl = ''
                            if (isShare !== '1') {
                                shareUrl = `${domain}/shareAuth/shareCallBack?token=${signatureInfo.token}&scan_id=${scanId}`
                            } else {
                                shareUrl = url
                            }
                            console.log(
                                `========>url: ${url}  =======>scanId: ${scanId}   =======>shareUrl: ${shareUrl}`
                            )
                            wx.config({
                                debug: false,
                                appId: signatureInfo.appid, // 必填，公众号的唯一标识
                                timestamp: signatureInfo.timestamp, // 必填，生成签名的时间戳
                                nonceStr: signatureInfo.noncestr, // 必填，生成签名的随机串
                                signature: signatureInfo.signature, // 必填，签名
                                jsApiList: [
                                    'checkJsApi',
                                    'updateTimelineShareData',
                                    'updateAppMessageShareData',
                                    'showMenuItems',
                                    'hideMenuItems',
                                ],
                            })
                            wx.ready(function () {
                                wx.checkJsApi({
                                    jsApiList: [
                                        'updateTimelineShareData',
                                        'updateAppMessageShareData',
                                        'showMenuItems',
                                        'hideMenuItems',
                                    ],
                                    success(res) {
                                        if (res.checkResult.getLocation === false) {
                                            console.log('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本')
                                            this.$toast({
                                                message: '你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本',
                                                duration: 3000,
                                            })
                                        } else {
                                            if (isShare !== '1') {
                                                console.log('显示分享菜单=========report')
                                                wx.showMenuItems({
                                                    menuList: [
                                                        'menuItem:share:appMessage',
                                                        'menuItem:share:timeline',
                                                        'menuItem:share:qq',
                                                        'menuItem:share:QZone',
                                                        'menuItem:share:weiboApp',
                                                    ],
                                                })
                                                wx.updateAppMessageShareData({
                                                    title: signatureInfo.title, // 分享标题
                                                    desc: signatureInfo.desc, // 分享描述
                                                    link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () {},
                                                })

                                                wx.updateTimelineShareData({
                                                    title: signatureInfo.title, // 分享标题
                                                    link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () {},
                                                })
                                            } else {
                                                console.log('隐藏分享菜单=========report')
                                                wx.hideMenuItems({
                                                    menuList: [
                                                        'menuItem:share:appMessage',
                                                        'menuItem:share:timeline',
                                                        'menuItem:share:qq',
                                                        'menuItem:share:QZone',
                                                        'menuItem:share:weiboApp',
                                                    ],
                                                })
                                            }
                                        }
                                    },
                                    fail(res) {
                                        const message = 'checkJsApi fail=' + JSON.stringify(res)
                                        this.$toast({
                                            message: message,
                                            duration: 3000,
                                        })
                                        console.log(message)
                                    },
                                })
                            })
                            wx.error(function (res) {
                                console.log('错误：' + res)
                            })
                        }
                    })
            }
        },
    },
}
</script>

<style scoped lang="less">
.register-page {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #262849, #07090f);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    justify-content: space-between;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 60.5px;
        padding-bottom: 38.5px;

        h2 {
            //   width: 105px;
            height: 24px;
            mix-blend-mode: initial;
            background-image: linear-gradient(to right, #00e3c9, #00a4e6), linear-gradient(#ffffff, #ffffff);
            font-family: PingFangSC;
            font-size: 21px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.14;
            letter-spacing: normal;
            text-align: center;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            mix-blend-mode: initial;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 2;
            letter-spacing: normal;
            text-align: center;
            color: #ffffff;
            margin-top: 8px;
            margin-bottom: 0px;
        }
    }

    .content {
        flex: 1;

        // 表单
        .form {
            width: 100%;
            height: auto;

            .item {
                width: 345px;
                height: 56px;
                margin: 0 auto;
                border-radius: 4px;
                background-color: #232440;
                padding: 0 16px;
                color: rgba(255, 255, 255, 1);
                margin-bottom: 8px;
                box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.24);
                display: flex;
                align-items: center;

                .info {
                    position: relative;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &.center {
                        justify-content: center;
                    }

                    .over {
                        position: absolute;
                        z-index: 10;
                        width: 100%;
                        height: 56px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.5);
                        line-height: 56px;
                        // pointer-events: none;
                        background-color: #232440;
                    }
                }

                label {
                    font-size: 14px;
                    text-align: left;
                }

                input {
                    width: 42%;
                    height: 100%;
                    background: transparent;
                    padding-left: 25.5px;
                    font-size: 14px;
                    color: #fff;

                    &[name='birthday'] {
                        flex: none;
                        width: 50px;
                    }
                }

                input[name='height'] ~ span {
                    font-size: 12px;
                    line-height: 12px;
                    color: rgba(255, 255, 255, 0.5);
                }

                .sex {
                    display: inline-block;
                    opacity: 0.5;
                    width: 40px;
                    height: 24px;
                    font-size: 14px;
                    line-height: 24px;
                    text-align: center;
                    margin: 0 20px;
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 1);

                    &.is-active {
                        opacity: 1;
                    }
                }

                .get-code-btn {
                    font-size: 12px;

                    &.is-disabled {
                        opacity: 0.5;
                    }
                }
            }

            .rule {
                color: #fff;
                margin: 10px auto;
                padding: 0 10px;
                height: auto;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;

                .checkbox {
                    position: relative;
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    margin-right: 5px;
                    border: 1px solid #fff;

                    input {
                        height: 12px;
                        width: 12px;
                        border-radius: 50%;
                        opacity: 0;
                    }

                    &.is-check {
                        &:before {
                            position: relative;
                            content: '';
                            height: 8px;
                            width: 8px;
                            margin: 2px;
                            border-radius: 50%;
                            background: #00a4e6;
                            display: block;
                        }
                    }
                }

                span {
                    color: #4a90e2;
                }
            }

            .rulety {
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
                font-family: PingFangSC-Regular, PingFang SC;
                line-height: 17px;
                height: 46px;
                text-align: right;

                span {
                    color: #4a90e2;
                }
            }

            .opacity {
                opacity: 0;
            }

            // 提交按钮
            .submit-btn {
                margin-top: 26px;

                button {
                    width: 200px;
                    height: 40px;
                    outline: none;
                    border-radius: 6px;
                    background-image: -webkit-gradient(linear, left top, right top, from(#00e2c9), to(#00a9e4));
                    background-image: -webkit-linear-gradient(left, #00e2c9, #00a9e4);
                    background-image: -o-linear-gradient(left, #00e2c9, #00a9e4);
                    background-image: linear-gradient(to right, #00e2c9, #00a9e4);
                    font-size: 16px;
                    color: #fff;

                    &.is-disabled {
                        border: 1px solid transparent;
                        background-image: linear-gradient(#191b31, #191b31),
                            /* 底色，即原有的背景 */ linear-gradient(to right, #06b0a2, #067eb9);
                        /* 模拟渐变边框 */
                        background-clip: padding-box, border-box;
                        background-origin: border-box;
                    }

                    .spinnerBtn {
                        display: flex;
                        justify-content: center;
                    }

                    /deep/ .mint-spinner-snake {
                        border: 2px solid transparent;
                    }
                }
            }
        }

        &.user-info {
            .item {
                input {
                    flex: 1;
                    text-align: center;
                    padding-left: 0px;
                }
            }
        }
    }

    .icon-del {
        float: right;
        width: 9.5px;
        height: 9.5px;
        border-radius: 0.8px;
        background: url('../../assets/images/register/register_phone_delete.png') no-repeat;
    }

    .tips {
        position: relative;
        display: inline-block;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        min-width: 10px;
        color: #ffffff;
        margin-bottom: 30px;

        &::before {
            content: '*';
            position: absolute;
            width: 5px;
            left: -8px;
            top: 2px;
        }
    }

    .spring-frame {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);

        .dialog {
            margin: 68% auto;
            width: 272px;
            height: 168px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            backdrop-filter: blur(10px);
            font-weight: 400;
            text-align: center;
            font-family: PingFangSC-Regular, PingFang SC;
            overflow: hidden;

            img {
                margin: 24px 0 19px 0;
            }

            .h6 {
                font-size: 13px;
                color: #111111;
                line-height: 20px;
                margin-bottom: 24px;
            }

            .isH6 {
                font-size: 12px;
                color: #000000;
                line-height: 20px;
                margin-bottom: 20px;
                padding: 0 40px;
            }

            .dialog-box {
                font-size: 14px;
                display: flex;
                flex: 2;
                justify-content: space-between;
                padding: 0 20px;
            }

            .dialog-left {
                width: 100px;
                height: 28px;
                border-radius: 4px;
                border: 1px solid;
                border-image: linear-gradient(90deg, rgba(0, 227, 201, 1), rgba(0, 159, 232, 1)) 1 1;
                color: #000000;
                line-height: 28px;
            }

            .dialog-right {
                width: 114px;
                height: 28px;
                background: linear-gradient(90deg, #03d2ba 0%, #009fe8 100%);
                border-radius: 4px;
                color: #ffffff;
                line-height: 28px;
            }

            .dialog-sure {
                width: 100%;
                height: 39px;
                background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                line-height: 39px;
                font-size: 16px;
                color: #ffffff;
                position: relative;
                bottom: 0px;
                padding: 0 0.01px;  /* 防止文本裁剪异常 */
            }
        }
    }
}
</style>
<style lang="less">
.BackGround {
    background: #fff !important;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 32px;
    width: 220px !important;
}

.van-dialog {
    width: 80% !important;
}

.van-dialog__message--has-title {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #111111;
    line-height: 20px;
}
</style>
