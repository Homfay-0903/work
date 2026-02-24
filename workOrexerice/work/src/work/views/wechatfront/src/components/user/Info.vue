<template>
    <!-- 个人信息START -->
    <!-- 07侧边栏内容 -->
    <div class="sidebar-msg">
        <div class="side-msg">
            <form action="#">
                <!-- 姓名 START -->
                <div style="padding: 0 15px 0;">
                    <mt-cell>
                        <span slot="icon" class="cancel-Authen coach-name"></span>
                        <span slot="title">
                            <span>姓名</span>
                            <span style="margin-left: 29px;">
                                <input class="name-str" :value="name" readonly />
                            </span>
                        </span>
                    </mt-cell>
                </div>
                <!-- END -->
                <!-- 性别 START -->
                <div style="padding: 0 15px 0;">
                    <mt-cell>
                        <span slot="icon" class="cancel-Authen coach-sex"></span>
                        <span slot="title">
                            <span>性别</span>
                            <span style="margin-left: 29px;">
                                <span>{{ sex }}</span>
                            </span>
                        </span>
                        <span slot>
                            <span class="cell-right-content" @click="changeSexModel">修改</span>
                        </span>
                    </mt-cell>
                </div>
                <!-- END -->
                <!-- 年龄 START -->
                <div style="padding: 0 15px 0;">
                    <mt-cell>
                        <span slot="icon" class="cancel-Authen coach-age"></span>
                        <span slot="title">
                            <span>年龄</span>
                            <span style="margin-left: 29px;">{{ age }}</span>
                        </span>
                        <span slot>
                            <span class="cell-right-content" @click="changeAgeModel">修改</span>
                        </span>
                    </mt-cell>
                </div>
                <!-- END -->
                <!-- 身高 START -->
                <div style="padding: 0 15px 0;">
                    <mt-cell>
                        <span slot="icon" class="cancel-Authen coach-height"></span>
                        <span slot="title">
                            <span>身高</span>
                            <span style="margin-left: 29px;" class="popup-heival">{{ hei }}</span>
                            <span>cm</span>
                        </span>
                        <span slot>
                            <span class="cell-right-content" @click="reviseHeight">修改</span>
                        </span>
                    </mt-cell>
                </div>
                <!-- END -->
                <!-- 手机项目 START -->
                <!--  to="/revise" -->
                <div style="padding: 0 15px 0;">
                    <mt-cell title="手机" value>
                        <span slot="icon" class="cancel-Authen phone-icon"></span>
                        <span slot="title">
                            <span>手机</span>
                            <span style="margin-left: 29px;" v-if="modifyP" class="sex-str">{{ userInfo.phone }}</span>
                            <span style="margin-left: 29px;" v-else class="sex-str">{{ pho }}</span>
                        </span>
                    </mt-cell>
                </div>


                <div style="padding: 0 15px 0;" v-if="age <= 18">
                    <mt-cell>
                        <span slot="icon" class="cancel-Authen coach-height"></span>
                        <span slot="title">
                            <span>父亲身高</span>
                            <span style="margin-left: 29px;" class="popup-heival">{{ fatherHeight }}</span>
                            <span>cm</span>
                        </span>
                        <span slot>
                            <span class="cell-right-content" @click="reviseHeightF">修改</span>
                        </span>
                    </mt-cell>
                </div>
                <div style="padding: 0 15px 0;" v-if="age <= 18">
                    <mt-cell>
                        <span slot="icon" class="cancel-Authen coach-height"></span>
                        <span slot="title">
                            <span>母亲身高</span>
                            <span style="margin-left: 29px;" class="popup-heival">{{ motherHeight }}</span>
                            <span>cm</span>
                        </span>
                        <span slot>
                            <span class="cell-right-content" @click="reviseHeightM">修改</span>
                        </span>
                    </mt-cell>
                </div>

                <!-- END -->
                <!-- 教练认证 START -->
                <!-- <div style="padding: 15px 15px 0;">
                    <mt-cell title="教练认证" value="取消认证">
                        <span slot="icon" class="cancel-Authen"></span>
                    </mt-cell>
                </div>-->

                <!-- END -->
                <!-- 完成按钮 START -->
                <!-- <div class="reg-subm side-subm">
                    <p class="reg-click-reg submit-btn" @click="submit">完成</p>
                </div>-->

                <!-- END -->
                <!-- 性别选项弹出框 -->
                <mt-popup v-model="popupSexVisible" position="bottom" :closeOnClickModal="false" style="width: 100%;">
                    <div class="popup-bottom">
                        <div class="popup-title purple">
                            <span class="popup-cancel" @click="confirmChangeSex(false)">取消</span>
                            <span class="popup-complete" @click="confirmChangeSex(true)">完成</span>
                        </div>
                        <div class="popup-body purple">
                            <div class="radio-btn-container">
                                <span class="radio-btn" @click="changeSex(1)"
                                    :class="{ 'radio-btn': true, 'active': sexval == 1 }">男</span>
                                <span class="radio-btn" @click="changeSex(2)"
                                    :class="{ 'radio-btn': true, 'active': sexval == 2 }">女</span>
                            </div>
                        </div>
                    </div>
                </mt-popup>
                <!--  -->

                <!-- 年龄修改弹窗 -->
                <mt-popup v-model="popupAgeVisible" class="popup-dialog-container" :closeOnClickModal="false"
                    popup-transition="popup-fade">
                    <div class="popup-dialog-header">请输入出生日期</div>
                    <div class="popup-dialog-content">
                        <div class="birth-select-container">
                            <input type="number" name="birthYear" @keyup="autoNextFocus($event, 'year', 0)"
                                @focus="changeBirthStatus('yearStatus', true)"
                                @blur="changeBirthStatus('yearStatus', false)" v-model="birth.year"
                                :class="{ 'popup-text auto-next long': true, 'error': birth.yearErr }" />
                            <span class="popup-text-addon">年</span>
                            <input type="number" name="birthMon" @keyup="autoNextFocus($event, 'month', 1)"
                                @focus="changeBirthStatus('monStatus', true)"
                                @blur="changeBirthStatus('monStatus', false)" v-model="birth.month"
                                :class="{ 'popup-text auto-next': true, 'error': birth.monErr }" />
                            <span class="popup-text-addon">月</span>
                            <input type="number" name="birthDay" @keyup="autoNextFocus($event, 'day', 2)"
                                @focus="changeBirthStatus('dayStatus', true)"
                                @blur="changeBirthStatus('dayStatus', false)" v-model="birth.day"
                                :class="{ 'popup-text auto-next': true, 'error': birth.dayErr }" />
                            <span class="popup-text-addon">日</span>
                        </div>
                        <div class="birth-select-error" :class="{ 'birth-select-error': true, 'active': birthMsg }">
                            {{ birthMsgType == 1 ? isVAPro7 ? '请填写范围内生日（10 - 70周岁）' : '请填写范围内生日（3-99周岁）' : '请填写正确的生日' }}
                        </div>
                    </div>
                    <div class="popup-dialog-footer">
                        <div class="mint-msgbox-btns">
                            <span class="mint-msgbox-btn mint-msgbox-cancel cancel-btn-height"
                                @click="confirmChangeAge(false)">取消</span>
                            <span class="mint-msgbox-btn mint-msgbox-confirm" @click="confirmChangeAge(true)">确定</span>
                        </div>
                    </div>
                </mt-popup>

                <!-- END -->
                <!-- 身高选项弹出框 -->
                <mt-popup v-model="popupHeiVisible" position="bottom" :closeOnClickModal="false" style="width: 100%;">
                    <div class="popup-bottom">
                        <div class="popup-title purple">
                            <span class="popup-cancel" @click="confirmChangeHeight(false)">取消</span>
                            <span class="popup-complete" @click="confirmChangeHeight(true)">完成</span>
                        </div>
                        <div class="popup-body purple">
                            <div class="height-select-container">
                                <span class="height-select-title">请重新填写身高</span>
                                <div class="height-select-content">
                                    <div class="height-btn-container" @click="heightInputNumber('-')">-</div>
                                    <div class="height-input-content">
                                        <input type="number" maxlength="3"
                                            :class="{ 'height-input': true, 'input-error': heiMsg }"
                                            @blur="resetBackground()" @keyup="changeHei" v-model.number="heival" />
                                        <span class="height-input-addon">cm</span>
                                    </div>
                                    <div class="height-btn-container" @click="heightInputNumber('+')">+</div>
                                </div>
                                <span class="height-select-msg" v-show="heiMsg">{{ heiErrorMg }}</span>
                            </div>
                        </div>
                        <!-- <div class="popup-hei">
                            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
                        </div>-->
                    </div>
                </mt-popup>
                <!--  -->
                <mt-popup v-model="fpopupHeiVisible" position="bottom" :closeOnClickModal="false" style="width: 100%;">
                    <div class="popup-bottom">
                        <div class="popup-title purple">
                            <span class="popup-cancel" @click="confirmChangeHeightF(false)">取消</span>
                            <span class="popup-complete" @click="confirmChangeHeightF(true)">完成</span>
                        </div>
                        <div class="popup-body purple">
                            <div class="height-select-container">
                                <span class="height-select-title">请重新填写父亲身高</span>
                                <div class="height-select-content">
                                    <div class="height-btn-container" @click="heightInputNumberF('-')">-</div>
                                    <div class="height-input-content">
                                        <input type="number" maxlength="3"
                                            :class="{ 'height-input': true, 'input-error': heiMsg }"
                                            @blur="resetBackground()" @keyup="changeHeiF" v-model.number="heivalF" />
                                        <span class="height-input-addon">cm</span>
                                    </div>
                                    <div class="height-btn-container" @click="heightInputNumberF('+')">+</div>
                                </div>
                                <span class="height-select-msg" v-show="heiMsg">{{ heiErrorMg }}</span>
                            </div>
                        </div>
                        <!-- <div class="popup-hei">
                            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
                        </div>-->
                    </div>
                </mt-popup>
                <mt-popup v-model="mpopupHeiVisible" position="bottom" :closeOnClickModal="false" style="width: 100%;">
                    <div class="popup-bottom">
                        <div class="popup-title purple">
                            <span class="popup-cancel" @click="confirmChangeHeightM(false)">取消</span>
                            <span class="popup-complete" @click="confirmChangeHeightM(true)">完成</span>
                        </div>
                        <div class="popup-body purple">
                            <div class="height-select-container">
                                <span class="height-select-title">请重新填写母亲身高</span>
                                <div class="height-select-content">
                                    <div class="height-btn-container" @click="heightInputNumberM('-')">-</div>
                                    <div class="height-input-content">
                                        <input type="number" maxlength="3"
                                            :class="{ 'height-input': true, 'input-error': heiMsg }"
                                            @blur="resetBackground()" @keyup="changeHeiM" v-model.number="heivalM" />
                                        <span class="height-input-addon">cm</span>
                                    </div>
                                    <div class="height-btn-container" @click="heightInputNumberM('+')">+</div>
                                </div>
                                <span class="height-select-msg" v-show="heiMsg">{{ heiErrorMg }}</span>
                            </div>
                        </div>
                        <!-- <div class="popup-hei">
                            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
                        </div>-->
                    </div>
                </mt-popup>
            </form>
        </div>
    </div>
    <!-- END -->
</template>

<script type="text/ecmascript-6">
import { updateMemberInfo } from '@/assets/js/apolloGql.js'
import { hiddenPhone } from '@/assets/js/util.js'
import { heightVal } from '@/assets/js/height.js'
import '@/assets/styles/meui/coachmsg.less'
import '@/assets/styles/meui/meui.less'
import { isVAPro7 } from '@/types/device.js'
import { setTimeout, clearTimeout } from 'timers'
export default {
    props: ['name', 'sex', 'age', 'hei', 'pho', 'tel', 'birthday', 'fatherHeight', 'motherHeight'],
    data() {
        return {
            modifyP: window.localStorage.getItem('userPhone'),
            bind: [
                {
                    icon: 'side-name-icon',
                    val: 'Andrew.陈',
                    types: 'username',
                    label: '姓名'
                }
            ],
            popupSexVisible: false, // 性别修改弹窗
            popupHeiVisible: false,
            fpopupHeiVisible: false,
            mpopupHeiVisible: false,
            popupAgeVisible: false, // 年龄修改弹窗
            slots: [
                {
                    flex: 1,
                    values: heightVal,
                    className: 'slot1',
                    textAlign: 'right',
                    defaultIndex: heightVal.indexOf(window.localStorage.getItem('userHeight'))
                },
                {
                    divider: true,
                    content: '-',
                    className: 'slot2'
                },
                {
                    flex: 1,
                    values: ['厘米'],
                    className: 'slot3',
                    textAlign: 'left'
                }
            ],
            heival: '',
            heivalF: '',
            heivalM: '',
            isVAPro7: isVAPro7(),
            heiMsg: false,
            heiErrorMg: '',
            sexval: 1,
            birth: {
                year: '1900',
                month: '01',
                day: '01',
                yearStatus: false,
                monStatus: false,
                dayStatus: false,
                yearErr: false,
                monErr: false,
                dayErr: false
            },
            birthMsg: false,
            userInfo: {
                phone: this.pho,
                telphone: this.tel,
                height: this.hei
            },
            // 生日选择提示类型
            birthMsgType: 1,
            scrollTopTimeout: null
        }
    },
    mounted() {
        if (window.localStorage.getItem('userPhone')) {
            this.userInfo.phone = hiddenPhone(window.localStorage.getItem('userPhone'))
            this.userInfo.telphone = window.localStorage.getItem('userPhone')
        }
        this.initBirth()
        this.sexval = this.sex === '女' ? 2 : 1
        this.heival = this.hei
        this.heivalF = this.fatherHeight
        this.heivalM = this.motherHeight
    },
    methods: {
        // 性别修改确认弹窗
        changeSexModel() {
            this.sexval = this.sex === '女' ? 2 : 1
            this.$messagebox
                .confirm(
                    '性别是体成分测量的重要依据之一，修改后测量的数据会与以往数据出现差异，请确认是否修改？',
                    '性别修改',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'cancel-btn-height'
                    }
                )
                .then(
                    action => {
                        if (action === 'confirm') {
                            this.popupSexVisible = true
                        }
                    },
                    cancel => { }
                )
        },
        // 选择修改后的性别
        changeSex(sexType) {
            this.sexval = sexType
        },
        // 确认/取消所选择性别
        confirmChangeSex(status) {
            this.popupSexVisible = false
            if (status) {
                this.submit(() => {
                    this.$emit('get-member-info')
                    this.$toast({
                        message: '性别修改成功'
                    })
                })
            } else {
                this.sexval = this.sex === '女' ? 2 : 1
            }
        },
        // 年龄修改确认弹窗
        changeAgeModel() {
            this.$messagebox
                .confirm(
                    '年龄是体成分测量的重要依据之一，修改后测量的数据会与以往数据出现差异，请确认是否修改？',
                    '年龄修改',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'cancel-btn-height'
                    }
                )
                .then(
                    action => {
                        if (action === 'confirm') {
                            // 生日初始化
                            this.birthMsg = false
                            this.initBirth()
                            this.popupAgeVisible = true
                        }
                    },
                    cancel => { }
                )
        },
        // 初始化生日
        initBirth() {
            if (this.birthday) {
                let birthArray = this.birthday.split('-')
                this.birth.year = birthArray[0] || '1900'
                this.birth.month = birthArray[1] || '01'
                this.birth.day = birthArray[2] || '01'
            }
            this.birth.yearErr = false
            this.birth.monErr = false
            this.birth.dayErr = false
        },
        // 选择年龄确认框
        confirmChangeAge(status) {
            if (this.birthMsg) {
                if (!status) {
                    this.initBirth()
                    this.popupAgeVisible = false
                }
                return
            }
            this.popupAgeVisible = false
            if (status) {
                this.submit(() => {
                    this.$emit('get-member-info')
                    this.$toast({
                        message: '年龄修改成功'
                    })
                })
            }
        },
        // 修改出生日期输入框状态
        // 此方法为了解决mintui在ios上，软键盘收回时背景scrollTop未还原的bug
        changeBirthStatus(name, status) {
            this.birth[name] = status
            if (this.scrollTopTimeout) {
                clearTimeout(this.scrollTopTimeout)
            }
            if (!this.birth.yearStatus && !this.birth.monStatus && !this.birth.dayStatus) {
                this.scrollTopTimeout = setTimeout(() => {
                    this.resetBackground()
                }, 100)
            }
        },
        // 输入出生年月校验并切换下一个输入框
        autoNextFocus(el, type, index) {
            let dom = document.getElementsByClassName('auto-next')
            // let currInput = dom[index];
            let nextInput = dom[index + 1]
            let lastInput = dom[index - 1]
            /* 这里的keyCode 根据不同的平台或许不同,安卓就是不是8 */
            if (el.keyCode !== 8) {
                if (index === 0) {
                    if (this.birth.year.length === 4) {
                        nextInput.focus()
                    } else if (this.birth.year.length > 4) {
                        let nextStr = this.birth.year.substr(4)
                        this.birth.year = this.birth.year.substr(0, 4)
                        this.birth.month = nextStr
                        nextInput.focus()
                    }
                } else if (index === 1) {
                    // 两种情况，0或1开头两位，否则必须2位
                    if (this.birth.month.length === 1) {
                        if (this.birth.month > 1) {
                            nextInput.focus()
                        }
                    } else if (this.birth.month.length === 2) {
                        nextInput.focus()
                        const originStr = this.birth.month.slice(0, -1)
                        if (originStr > 1) {
                            const nextStr = this.birth.month.slice(-1)
                            this.birth.month = originStr
                            this.birth.day = nextStr
                            nextInput.focus()
                        }
                    } else {
                        const originStr = this.birth.month.slice(0, -1)
                        const nextStr = this.birth.month.slice(-1)
                        this.birth.month = originStr
                        this.birth.day = nextStr
                        nextInput.focus()
                    }
                } else {
                    if (this.birth.day.length > 2) {
                        const nextStr = this.birth.day.slice(-1)
                        this.birth.day = nextStr
                    }
                }
            } else {
                if (index !== 0) {
                    if (this.birth[type].length === 0) {
                        lastInput.focus()
                    }
                }
            }
            this.valideBirth()
        },
        // 根据出生年月日判断年龄
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
                    age = '未知' // 返回-1 表示出生日期输入错误 晚于今天
                }
            }
            return age // 返回周岁年龄
        },
        // 对于月和日单数自动补0
        addZero(num) {
            let result = num
            if (num.length === 1) {
                result = '0' + num
            }
            return result
        },
        // 校验生日格式
        valideBirth() {
            const yearReg = /^[1-2](9|0)\d{2}$/
            const monReg = /^(0?[1-9]|1[0-2])$/
            const dayReg = /^((0?[1-9])|((1|2)[0-9])|30|31)$/
            // 判断年龄段为3-99
            const birthStr = `${this.birth.year}-${this.addZero(this.birth.month)}-${this.addZero(this.birth.day)}`
            const realAge = this.getAge(birthStr)
            let yearAvailable = realAge >= 3 && realAge <= 99
            const momentDate = this.$moment(birthStr, this.$moment.ISO_8601)
            let isValidDate = momentDate.isValid()
            let isValidDay = false
            let testYear = yearReg.test(this.birth.year)
            let testMonth = monReg.test(this.birth.month)
            let testDay = dayReg.test(this.birth.day)
            if (isValidDate) {
                isValidDay = new Date(momentDate.format()).getDate() === parseInt(this.birth.day, 10)
            }
            if (!yearAvailable) {
                this.birthMsgType = 1
            }
            if (!testYear || !testMonth || !testDay || !isValidDate || !isValidDay) {
                this.birthMsgType = 0
            }
            this.birth.yearErr = !testYear
            this.birth.monErr = !testMonth
            this.birth.dayErr = !testDay
            this.birthMsg = !(testYear && testMonth && testDay && yearAvailable && isValidDate && isValidDay)
        },
        // 点击身高 弹出弹出框 是否修改身高
        reviseHeight() {
            this.heival = 0
            // 增加timeout为了解决.在输入框停留，浏览器无感知
            setTimeout(() => {
                this.heival = this.hei
            })
            this.$messagebox
                .confirm(
                    '身高是体成分测量的重要依据之一，修改后测量的数据会与以往数据出现差异，请确认是否修改？',
                    '身高修改',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'cancel-btn-height'
                    }
                )
                .then(
                    action => {
                        if (action === 'confirm') {
                            this.popupHeiVisible = true
                            this.changeHei()
                        }
                    },
                    cancel => { }
                )
        },
        reviseHeightF() {
            this.heivalF = 0
            // 增加timeout为了解决.在输入框停留，浏览器无感知
            setTimeout(() => {
                this.heivalF = this.fatherHeight
            })
            this.$messagebox
                .confirm(
                    '身高是体成分测量的重要依据之一，修改后测量的数据会与以往数据出现差异，请确认是否修改？',
                    '身高修改',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'cancel-btn-height'
                    }
                )
                .then(
                    action => {
                        if (action === 'confirm') {
                            this.fpopupHeiVisible = true
                            this.changeHeiF()
                        }
                    },
                    cancel => { }
                )
        },
        reviseHeightM() {
            this.heivalM = 0
            // 增加timeout为了解决.在输入框停留，浏览器无感知
            setTimeout(() => {
                this.heivalM = this.motherHeight
            })
            this.$messagebox
                .confirm(
                    '身高是体成分测量的重要依据之一，修改后测量的数据会与以往数据出现差异，请确认是否修改？',
                    '身高修改',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'cancel-btn-height'
                    }
                )
                .then(
                    action => {
                        if (action === 'confirm') {
                            this.mpopupHeiVisible = true
                            this.changeHeiM()
                        }
                    },
                    cancel => { }
                )
        },
        // 选择身高弹出框 点击完成弹出框消失
        confirmChangeHeight(status) {
            if (this.heiMsg) {
                if (!status) {
                    this.heival = this.hei
                    this.popupHeiVisible = false
                }
                return
            }
            this.popupHeiVisible = false
            if (status) {
                this.submit(() => {
                    this.$emit('get-member-info')
                    this.$toast({
                        message: '身高修改成功'
                    })
                })
            } else {
                this.heival = this.hei
            }
        },
        confirmChangeHeightF(status) {
            if (this.heiMsg) {
                if (!status) {
                    this.heivalF = this.fatherHeight
                    this.fpopupHeiVisible = false
                }
                return
            }
            this.fpopupHeiVisible = false
            if (status) {
                this.submit(() => {
                    this.$emit('get-member-info')
                    this.$toast({
                        message: '身高修改成功'
                    })
                })
            } else {
                this.heival = this.hei
            }
        },
        confirmChangeHeightM(status) {
            if (this.heiMsg) {
                if (!status) {
                    this.heivalM = this.motherHeight
                    this.mpopupHeiVisible = false
                }
                return
            }
            this.mpopupHeiVisible = false
            if (status) {
                this.submit(() => {
                    this.$emit('get-member-info')
                    this.$toast({
                        message: '身高修改成功'
                    })
                })
            } else {
                this.heival = this.hei
            }
        },
        // 身高加减控制器
        heightInputNumber(type) {
            let heiTmp = Number(this.heival)
            const heiReg = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (type === '-') {
                heiTmp--
            } else {
                heiTmp++
            }
            if (heiReg.test(heiTmp)) {
                this.heival = heiTmp
            } else {
                this.$toast({
                    message: '请填写真实身高',
                    position: 'middle',
                    duration: 3000
                })
            }
            this.changeHei()
        },
        // 父亲身高加减控制器
        heightInputNumberF(type) {
            let heiTmp = Number(this.heivalF)
            const heiReg = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (type === '-') {
                heiTmp--
            } else {
                heiTmp++
            }
            if (heiReg.test(heiTmp)) {
                this.heivalF = heiTmp
            } else {
                this.$toast({
                    message: '请填写真实身高',
                    position: 'middle',
                    duration: 3000
                })
            }
            this.changeHeiF()
        },
        // 母亲身高加减控制器
        heightInputNumberM(type) {
            let heiTmp = Number(this.heivalM)
            const heiReg = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (type === '-') {
                heiTmp--
            } else {
                heiTmp++
            }
            if (heiReg.test(heiTmp)) {
                this.heivalM = heiTmp
            } else {
                this.$toast({
                    message: '请填写真实身高',
                    position: 'middle',
                    duration: 3000
                })
            }
            this.changeHeiM()
        },

        // 输入后重置背景定位(针对IOS上mintUI的bug)
        resetBackground() {
            window.scrollTo(0, 0)
        },

        //  输入框修改身高，校验
        changeHei() {
            const heiReg = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (/^\d+$/.test(this.heival)) {
                if (!heiReg.test(this.heival)) {
                    this.heiErrorMg = '请填写范围内身高（110cm～205cm）'
                    this.heiMsg = true
                } else {
                    this.heiMsg = false
                }
            } else {
                this.heiErrorMg = '请输入整数'
                this.heiMsg = true
            }
        },
        changeHeiF() {
            const heiReg = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (/^\d+$/.test(this.heivalF)) {
                if (!heiReg.test(this.heivalF)) {
                    this.heiErrorMg = '请填写范围内身高（110cm～205cm）'
                    this.heiMsg = true
                } else {
                    this.heiMsg = false
                }
            } else {
                this.heiErrorMg = '请输入整数'
                this.heiMsg = true
            }
        },
        changeHeiM() {
            const heiReg = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (/^\d+$/.test(this.heivalM)) {
                if (!heiReg.test(this.heivalM)) {
                    this.heiErrorMg = '请填写范围内身高（110cm～205cm）'
                    this.heiMsg = true
                } else {
                    this.heiMsg = false
                }
            } else {
                this.heiErrorMg = '请输入整数'
                this.heiMsg = true
            }
        },
        // 获取滚动栏的数值
        onValuesChange(picker, values) {
            // if (window.localStorage.getItem('userHeight')) {
            //     this.heival = window.localStorage.getItem('userHeight');
            // } else {
            //     this.heival = values[0];
            // }
            // picker.setSlotValue(heightVal.indexOf(height), height);
            this.heival = values[0]
        },
        // 更新用户信息
        submit(fn) {
            const tmpBirth = `${this.birth.year}-${this.birth.month}-${this.birth.day}`
            const tmpHeight = Number(this.heival)
            const tmpHeightF = Number(this.heivalF)
            const tmpHeightM = Number(this.heivalM)
            this.$indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            })
            this.$apollo
                .mutate({
                    mutation: updateMemberInfo,
                    variables: {
                        nickName: this.name,
                        sex: this.sexval,
                        height: tmpHeight,
                        age: this.age,
                        birthday: tmpBirth,
                        fatherHeight: tmpHeightF,
                        motherHeight: tmpHeightM,
                        mobile: this.tel === this.userInfo.telphone ? this.tel : this.userInfo.telphone,
                    }
                })
                .then(res => {
                    this.$indicator.close()
                    const data = res.data.updateMemberInfo
                    if (data.code === 200) {
                        if (data && data.code === 200) {
                            if (fn) {
                                fn()
                            } else {
                                this.$toast({
                                    message: '更新用户信息成功',
                                    duration: 3000
                                })
                            }
                        }
                        window.localStorage.removeItem('userPhone')
                    }
                })
        }
    }
}
</script>

<style scoped lang="less">
.side-phone-rivise {
    float: right;
    margin-top: 14px;
    margin-right: 15px;
}

.side-phone-cancel {
    float: right;
    margin-top: 14px;
    margin-right: 25px;
}

.side-subm {
    margin-top: 40px;
}

.reg-click-reg {
    width: 200px;
    height: 40px;
    mix-blend-mode: undefined;
    border-radius: 6px;
    background-image: -webkit-gradient(linear, left top, right top, from(#00e2c9), to(#00a9e4));
    background-image: -webkit-linear-gradient(left, #00e2c9, #00a9e4);
    background-image: -o-linear-gradient(left, #00e2c9, #00a9e4);
    background-image: linear-gradient(to right, #00e2c9, #00a9e4);
    font-size: 16px;
    color: #fff;
}

.submit-btn {
    display: inline-block;
    line-height: 40px;
}

.mint-cell {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    border-radius: 6px;
    text-align: left;
    margin-top: 1px;
}

.mint-cell:last-child {
    background-image: none;
}

.mint-cell-wrapper {
    background-image: none;
    padding: 0 15px;
}

.mint-cell-value {
    color: #fff;
    font-size: 12px;
    margin-right: 13px;
}

.mint-cell-title {
    font-size: 14px;
}

.mint-cell-value.is-link {
    margin-right: 17px;
}

.cancel-Authen {
    display: inline-block;
    width: 23px;
    height: 23px;
    background: url(../../assets/images/sidebar/sidebar_Coachcertification_icon.png) no-repeat top center;
    vertical-align: middle;
    margin-right: 10px;
}

.phone-num {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.phone-icon {
    background: url(../../assets/images/register/register_phone_icon.png) no-repeat top center;
    background-size: 16px 22px;
}

.coach-height {
    background: url(../../assets/images/sidebar/sidebar_height_icon.png) no-repeat top center;
    background-size: 10px 22px;
}

.coach-age {
    background: url(../../assets/images/sidebar/sidebar_birthday_icon.png) no-repeat top center;
    background-size: 20px 18px;
}

.coach-sex {
    background: url(../../assets/images/sidebar/sidebar_gender_icon.png) no-repeat top center;
    background-size: 23px 18px;
}

.coach-name {
    background: url(../../assets/images/sidebar/sidebar_user_icon.png) no-repeat top center;
    background-size: 17px 18px;
}

.sex {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 8px;
    vertical-align: text-top;

    img {
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }

    .female-img {
        width: 10px;
        height: 18px;
        margin-top: -2px;
        // opacity: 0.6;
    }

    .male-img {
        width: 14px;
        height: 15px;
        // opacity: 0.6;
    }
}

.popup-bottom {
    width: 100%;
    height: 250px;
    mix-blend-mode: undefined;
    background-color: #cbcdcf;
}

.popup-title {
    width: 100%;
    height: 42.5px;
    line-height: 42.5px;
    mix-blend-mode: undefined;
    background-color: #ffffff;
    background-color: rgba(255, 255, 255, 0.4);
    color: rgba(0, 0, 0, 0.4);

    &.purple {
        background-color: #303261;

        .popup-cancel {
            color: #ffffff;
        }

        .popup-complete {
            color: #ffffff;
        }
    }
}

.popup-body {
    &.purple {
        background-color: #27294c;
        color: #ffffff;
        height: calc(100% - 42.5px);
    }
}

.radio-btn-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;

    .radio-btn {
        color: #ffffff;
        border: 1px solid #00bed9;
        width: 88px;
        height: 32px;
        line-height: 32px;
        flex: none;
        border-radius: 6px;
        font-size: 16px;

        &.active {
            border: none;
            background-image: -webkit-gradient(linear, left top, right top, from(#19e1c8), to(#1179d2));
        }
    }
}

// 身高调整
.height-select-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;

    .height-select-title {
        font-size: 18px;
        color: rgba(136, 136, 136, 1);
        line-height: 25px;
        margin-bottom: 20px;
        margin-top: -40px;
    }

    .height-select-content {
        display: flex;
        justify-content: center;

        .height-btn-container {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            // background: -webkit-linear-gradient(90deg, rgba(0,227,201,1), rgba(0,159,232,1));
            border: 1px solid #00bed9;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .height-input-content {
            margin: 0 40px;

            .height-input {
                width: 60px;
                background-color: #27294c;
                border-bottom: 1px solid #fff;
                height: 30px;
                font-size: 24px;
                color: rgba(255, 255, 255, 1);
                text-align: center;
                transition: all 0.3s;

                &.input-error {
                    color: rgba(208, 2, 27, 1);
                }
            }

            .height-input-addon {
                margin-left: 5px;
            }
        }
    }

    // 身高错误信息
    .height-select-msg {
        font-size: 13px;
        color: rgba(208, 2, 27, 1);
        margin-top: 40px;
        margin-bottom: -20px;
        position: absolute;
    }
}

.popup-cancel {
    position: absolute;
    left: 15px;
    font-size: 17px;
    color: #000;
}

// popup dialog
.popup-dialog-container {
    width: 73.3%;
    border-radius: 8px;
    color: #222;

    .popup-dialog-header {
        text-align: center;
        font-size: 19px;
        padding: 15px 0;
        color: rgba(74, 74, 74, 1);
    }

    .popup-dialog-content {
        font-size: 14px;
        text-align: center;
        line-height: 14px;
        display: flex;
        flex-direction: column;

        .birth-select-container {
            font-size: 18px;
            display: inline-block;
            margin-bottom: 20px;

            .popup-text {
                width: 40px;
                border-bottom: 1px solid #1890ff;
                color: rgba(74, 74, 74, 1);
                padding: 5px;
                font-size: 18px;

                &.long {
                    width: 60px;
                }

                &.error {
                    color: rgba(208, 2, 27, 1);
                }
            }

            .popup-text-addon {
                padding: 5px;
            }
        }

        .birth-select-error {
            visibility: hidden;

            &.active {
                visibility: visible;
                color: #d0021b;
            }
        }
    }

    .popup-dialog-footer {
        padding: 15px 0 0 0;
    }
}

.popup-complete {
    position: absolute;
    right: 15px;
    font-size: 17px;
    color: #000;
}

.popup-hei {
    width: 100%;
    height: 34px;
}

.picker-center-highlight {
    border-top-color: #000;
}

.name-str {
    background: transparent;
    color: #fff;
    outline: none;
    font-size: 14px;
}

.sex-str {
    color: #9596a1;
}

.cell-right-content {
    font-size: 14px;
}
</style>
