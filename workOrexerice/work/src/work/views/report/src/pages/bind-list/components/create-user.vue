<template>
    <!-- 用户信息绑定弹窗 -->
    <el-dialog title class="bind-model" :visible.sync="visible" @close="closeDialog()" @open="openDialog()"
        width="530px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
        <div slot="title" class="model-title">{{ showTitle() }}</div>
        <div class="model-container">
            <div class="info-container">
                <template v-if="[0, 1].indexOf(bindStep) > -1">
                    <div
                        :class="{ 'info-list': true, 'infoLists': usrForm.scanTime, 'info-type': usrForm.biaMeasure === 1 && usrForm.staticEval === 1, 'infoTypes': usrForm.biaMeasure === 1 && usrForm.bsShoulderStatus, 'infoList': usrForm.staticEval === 1 && usrForm.bsShoulderStatus === 1, 'infoType': usrForm.biaMeasure === 1 && usrForm.staticEval === 1 && usrForm.bsShoulderStatus === 1 }">
                        <span class="title">{{ '扫描时间' }}:&nbsp;</span>
                        <span class="info">{{ usrForm.scanTime }}</span>
                    </div>
                    <div
                        :class="{ 'info-list': true, 'info-type': usrForm.biaMeasure === 1 && usrForm.staticEval === 1, 'infoTypes': usrForm.biaMeasure === 1 && usrForm.bsShoulderStatus, 'infoList': usrForm.staticEval === 1 && usrForm.bsShoulderStatus === 1, 'infoType': usrForm.biaMeasure === 1 && usrForm.staticEval === 1 && usrForm.bsShoulderStatus === 1 }">
                        <span class="title">{{ '报告项目' }}:&nbsp;</span>
                        <span class="info">{{ showReportItem(usrForm) }}</span>
                    </div>
                </template>
                <!-- 绑定成功 -->
                <div class="info-content" v-if="bindStep === 2">
                    <img src="@/assets/images/bindList/report_suc.svg" alt />
                </div>

                <!-- 绑定失败 -->
                <div class="info-content" v-if="bindStep === 3">
                    <img src="@/assets/images/bindList/report_error.svg" alt />
                </div>
            </div>
            <div class="msg-container">
                <p class="msg" v-if="bindStep === 0">请输入测量用户的 ID（用户 ID 将关联该用户的所有测量数据，请准确填写）</p>
                <div>
                    <div v-if="bindStep === 1 && isNewUser">
                        <!-- 新用户提醒 -->
                        <p class="msg msg-dialog">该 ID 为新用户，请确保 ID 填写无误，若填写错误，可取消后重新输入。若 ID 填写正确，请完善用户信息。</p>
                        <p class="msg msg-dialog">真实的信息对报告的准确性非常重要，请认真填写。</p>
                    </div>
                    <div v-else>
                        <!-- 老用户提醒 -->
                        <p class="msg msg-dialog" v-if="bindStep === 1">真实的用户信息对报告的准确性非常重要，请确定用户信息是否正确，如有错误，可修改后再绑定。</p>
                    </div>
                    <!-- 绑定成功 -->
                    <p class="msg center" v-if="bindStep === 2">任务已加入合成队列，可到报告列表查看报告。</p>
                    <!-- 绑定失败 -->
                    <p class="msg center" v-if="bindStep === 3">该任务已绑定，请勿重复绑定</p>
                </div>
            </div>
            <div class="content">
                <el-form label-width="110px" :model="usrForm" ref="usrForm" :rules="rules" @submit.native.prevent>
                    <div class="form-content" v-if="bindStep === 0">
                        <el-form-item class="emailItem emailItem-sytle3" label="ID" prop="mobile">
                            <el-input v-model="usrForm.mobile" auto-complete="off" placeholder="请输入测量用户的ID，如身份证号等唯一识别号"
                                @keyup.enter.native="nextStep()" :maxlength="100" clearable>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-content" v-if="bindStep === 1">
                        <div class="email-info">
                            <p>ID</p>
                            <span>{{ usrForm.mobile }}</span>
                        </div>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="usrForm.name" auto-complete="off" maxlength="100"
                                @keyup.enter.native="handleEnterStep()" clearable placeholder="请输入测量用户的姓名">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="usrForm.sex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="生日" prop="birthday"
                            :rules="[{ required: true, message: '请选择生日', }, { validator: checkAge, trigger: 'change' }]">
                            <datepicker
                                :input-class="['date-picker', ageResult ? 'date-picker-normal' : 'date-picker-error']"
                                wrapper-class="date-picker-wrapper" v-model="usrForm.birthday" :format="customFormatter"
                                placeholder="选择日期" :language="zh" @input="inputDate" />
                            <i class="el-icon-caret-bottom icon-i"></i>
                        </el-form-item>
                        <!-- {{usrForm.height}} -->
                        <el-form-item v-if="isShowHeight" label="身高" prop="height"
                            :rules="[{ required: true, message: '请输入身高', }, { type: 'number', message: '身高必须为数字值' }, { validator: checkHeight, trigger: 'blur' }]">
                            <el-input v-model.number="usrForm.height" type="text"
                                @keyup.enter.native="handleEnterStep()" placeholder="请输入身高">
                                <span class="in-unit" slot="suffix" style="margin-right: 5px; color: #5E687B;">cm</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item v-if="this.isVAPro5 && calculateAge(usrForm.birthday) <= 18" label="父亲身高"
                            prop="fatherHeight"
                            :rules="[{ required: true, message: '请输入父亲身高', }, { type: 'number', message: '身高必须为数字值' }, { validator: checkHeight, trigger: 'blur' }]">
                            <el-input v-model.number="usrForm.fatherHeight" type="text"
                                @keyup.enter.native="handleEnterStep()" placeholder="请输入父亲身高">
                                <span class="in-unit" slot="suffix" style="margin-right: 5px; color: #5E687B;">cm</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item v-if="this.isVAPro5 && calculateAge(usrForm.birthday) <= 18" label="母亲身高"
                            prop="motherHeight"
                            :rules="[{ required: true, message: '请输入母亲身高', }, { type: 'number', message: '身高必须为数字值' }, { validator: checkHeight, trigger: 'blur' }]">
                            <el-input v-model.number="usrForm.motherHeight" type="text"
                                @keyup.enter.native="handleEnterStep()" placeholder="请输入母亲身高">
                                <span class="in-unit" slot="suffix" style="margin-right: 5px; color: #5E687B;">cm</span>
                            </el-input>
                        </el-form-item>
                    </div>
                    <!-- 新用户需要显示及勾选使用协议 -->
                    <div class="need-read" v-if="bindStep === 1 && isNewUser">
                        <el-checkbox v-model="usrForm.agreement" @change="checkForm()"></el-checkbox>
                        <p>同意维塑</p>
                        <span @click="jumpToPage('secret')">《用户隐私协议》</span>
                        <span @click="jumpToPage('rule')">《用户使用协议》</span>
                    </div>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="nextStep()" v-if="bindStep === 0" :loading="modelBtnLoad">下一步</el-button>
            <el-button type="primary" @click="nextStep()" v-else-if="bindStep === 1" :disabled="registerBtnDisabled"
                :loading="modelBtnLoad">{{ !isNewUser ?
                    '确认' :
                    '注册' }}</el-button>
            <el-button type="primary" @click="goReportList()" v-else>去报告列表</el-button>

            <el-button @click="closeDialog" v-if="[0, 1].indexOf(bindStep) > -1">取消</el-button>
            <el-button @click="closeDialog" v-else>{{ '我知道了' }}({{
                modelClock }}S)</el-button>
        </div>
    </el-dialog>

</template>
<script>
import { mapState } from 'vuex'
import { getMemberInfoByBindId, bindMemberInfo } from '@/assets/js/apolloGql.js'
import Datepicker from 'vuejs-datepicker'
import { zh } from 'vuejs-datepicker/dist/locale'
import moment from 'moment'
import { isVAPro3, isVAPro5, isVRPro3, isVRPro5, isVRPro5ARM, isVE335, isVAPro7 } from '@/types/device.js'
export default {
    components: {
        Datepicker
    },
    props: {
        // 模型信息
        usrForm: Object,
        bindUsrVisible: Boolean
    },
    data() {
        return {
            // 绑定的用户是否为新用户
            isNewUser: true,
            // 当前步骤 0 输入邮箱 1 用户信息 2 绑定成功 3 绑定失败
            bindStep: 0,
            rules: {
                mobile: [
                    { required: true, message: '请输入测量用户ID' },
                    { max: 100, message: '请输入正确的用户ID，如身份证号等唯一识别号', trigger: 'blur' },
                    { pattern: /^[0-9a-zA-Z]*$/, message: '请输入正确的用户ID，如身份证号等唯一识别号', trigger: 'blur' }
                ],
                name: [{ max: 100, message: '名称最长输入100字符' }],
                sex: [{ required: true, message: '请选择性别' }],
            },
            // 弹窗定时器
            modelClock: 5,
            modelClockTimer: null,
            modelBtnLoad: false,
            zh: zh,
            ageResult: true,
            visible: false,
            isVRPro3: isVRPro3(),
            isVRPro5: isVRPro5(),
            isVRPro5ARM: isVRPro5ARM(),
            isVE335: isVE335(),
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro7: isVAPro7(),
            propsHeight: 0 // 传入身高
        }
    },
    computed: {
        ...mapState(['userInfo']),
        // 新用户勾选隐私协议后 按钮可用，老用户无需校验
        registerBtnDisabled() {
            return this.isNewUser ? !this.usrForm.agreement : false
        },
        ischangeage() {
            return this.isVRPro3 || this.isVRPro5 || this.isVRPro5ARM || this.isVE335 || this.isVAPro3 || this.isVAPro5
        },
        isShowHeight() {
            if (!this.isVAPro5) {
                return true
            }
            return this.propsHeight === 0
        },
    },
    watch: {
        bindUsrVisible(val) {
            this.visible = val
        }
    },
    methods: {
        showTitle() {
            if ([0, 1].indexOf(this.bindStep) > -1) {
                return '用户信息绑定'
            } else if (this.bindStep === 2) {
                return '用户信息绑定成功'
            } else if (this.bindStep === 3) {
                return '用户信息绑定失败'
            } else {
                return '用户信息绑定'
            }
        },
        openDialog() {
            console.log('openDialog')
            this.bindStep = 0
            this.modelBtnLoad = false
            this.modelClock = 5
            this.ageResult = true
            this.clearTimer()
            this.propsHeight = this.usrForm.height ? this.usrForm.height : 0
        },
        showReportItem(usrForm) {
            // console.log(`当前选中细腻些${JSON.stringify(usrForm)}`)
            const items = []
            if (usrForm.girthMeasure === 1 && (isVAPro3() || isVAPro5()) && usrForm.scanMode && (usrForm.nutrition === 0 || usrForm.nutrition === 1)) {
                items.push('无电流营养分析')
            }
            if (usrForm.biaMeasure === 1) {
                items.push('身体成分')
            }
            if (usrForm.girthMeasure === 1 && (isVAPro3() || isVAPro5())) {
                items.push('体围测量')
            }
            if (usrForm.staticEval === 1) {
                items.push('体态评估')
            }
            if (usrForm.bsShoulderStatus === 1) {
                items.push('肩部功能')
            }
            if (usrForm.staticEval === 1 && usrForm.spineReport === 1) {
                items.push('脊柱报告')
            }
            return items.join('、')
        },
        checkID() {
            console.log('blur方法')
        },

        async nextStep() {
            if (this.bindStep === 0) {
                // 检验是否输入id
                this.$refs.usrForm.validateField('mobile', valid => {
                    console.log(`当前校验结果${valid}`)
                    if (!valid) {
                        this.findMemberInfoById()
                    }
                })

            } else {
                console.log('校验全部表单数据')
                const result = await this.$refs.usrForm.validate()
                console.log(`校验通过${result}`)
                if (result) {
                    this.bindMeasurementInformation()
                }
            }

        },
        // 查询是否为新用户
        async findMemberInfoById() {
            let params = {
                mobile: this.usrForm.mobile,
                deviceId: this.userInfo.deviceId,
            }
            this.modelBtnLoad = true
            this.$apollo
                .query({
                    query: getMemberInfoByBindId,
                    variables: params,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    console.log(`查询到用户信息${JSON.stringify(res.data)}`)
                    this.modelBtnLoad = false
                    const data = res.data.getMemberInfoByBindId
                    if (data.code === 404) {
                        // 用户未注册，新用户
                        this.isNewUser = true
                    } else {
                        const member = data.data
                        this.isNewUser = false
                        this.usrForm.id = member.id
                        this.usrForm.birthday = member.birthday
                        this.usrForm.height = this.usrForm.height ? this.usrForm.height : member.height
                        this.usrForm.fatherHeight = member.fatherHeight || null
                        this.usrForm.motherHeight = member.motherHeight || null
                        this.usrForm.sex = member.sex
                        this.usrForm.name = member.name
                        const length = this.userInfo.deviceId.length + 1
                        if (member.mobile.length > length) {
                            this.usrForm.mobile = member.mobile.substr(0, member.mobile.length - length)
                        }

                        console.log(`生日校验结果${JSON.stringify(this.usrForm)}`)
                    }
                    this.bindStep = 1
                })
                .catch(e => {
                    this.modelBtnLoad = false
                    console.log(`请求失败${e}`)
                })
        },
        // 绑定用户信息
        async bindMeasurementInformation() {
            console.log('bindMeasurementInformation')
            this.modelBtnLoad = true
            let params = {
                scanId: this.usrForm.scanId,
                member: {
                    id: this.usrForm.id,
                    name: this.usrForm.name,
                    sex: this.usrForm.sex,
                    birthday: this.usrForm.birthday,
                    height: this.usrForm.height,
                    deviceId: this.userInfo.deviceId,
                    type: this.usrForm.type,
                    mobile: this.usrForm.mobile
                },
            }
            if (this.isVAPro5 && this.usrForm.fatherHeight && this.usrForm.motherHeight) {
                params.member.fatherHeight = this.usrForm.fatherHeight || null
                params.member.motherHeight = this.usrForm.motherHeight || null
            }
            this.$apollo
                .mutate({
                    mutation: bindMemberInfo,
                    variables: params,
                })
                .then(res => {
                    this.modelBtnLoad = false
                    const data = res.data.bindMemberInfo
                    if (data.code === 200) {
                        this.bindStep = 2
                        this.runModelClock()
                        this.$emit('refresh-list')
                    } else {
                        // 已绑定
                        this.bindStep = 3
                        this.runModelClock()
                    }
                })
                .catch(e => {
                    this.modelBtnLoad = false
                    console.log(`请求失败${e}`)
                    // 已绑定
                    this.bindStep = 3
                    this.runModelClock()
                })
        },
        // 弹窗5s定时器
        runModelClock() {
            this.modelClock = 5
            this.modelClockTimer = setInterval(() => {
                if (this.modelClock > 1) {
                    this.modelClock--
                } else {
                    this.closeDialog()
                    this.clearTimer()
                }
            }, 1000)
        },
        // 清除定时器
        clearTimer() {
            if (this.modelClockTimer) {
                clearInterval(this.modelClockTimer)
            }
        },
        // 用户信息填写页 回车处理
        handleEnterStep() {
            if (!this.registerBtnDisabled) {
                this.nextStep()
            }
        },
        // 部分用户信息校验规则
        checkHeight(rule, value, callback) {
            // 身高校验规则
            const regex = /^(1[1-9]\d(\.\d+)?|20[0-4](\.\d+)?|205)$/
            if (/^\d+$/.test(value)) {
                if (!regex.test(value)) {
                    callback('允许测量的身高范围是110-205cm，请重新输入')
                } else {
                    callback()
                }
            } else {
                callback('身高只能为整数，请填写正确的身高')
            }
        },
        checkAge(rule, birthday, callback) {
            console.log(`选中生日${birthday} ${this.usrForm.birthday}`)
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
            console.log(`计算出生日${age}`)
            if (this.ischangeage) {
                if (age < 3 || age > 99) {
                    callback('允许测量的年龄范围为3-99岁，请重新输入')
                } else {
                    callback()
                }
            } else if (this.isVAPro7) {
                if (age < 3 || age > 99) {
                    callback('允许测量的年龄范围为10-70岁，请重新输入')
                } else {
                    callback()
                }
            } else {
                if (age < 10 || age > 70) {
                    callback('允许测量的年龄范围为10-70岁，请重新输入')
                } else {
                    callback()
                }
            }
        },
        // 检查第二布输入合法性
        checkForm() {
            // this.checkAge()
            // if (!this.errMsg) {
            //     this.checkHeight()
            // }
        },
        // 关闭弹窗
        closeDialog() {
            // console.log('关闭弹窗')
            // 打开弹窗 作初始化动作
            this.$emit('close-dialog')
        },
        // 跳转协议页
        jumpToPage(pageName) {
            this.closeDialog()
            this.$router.push({
                path: `/custom/${pageName}`
            })
        },
        // 去报告列表
        goReportList() {
            this.closeDialog()
            this.$router.push({
                path: '/home'
            })
        },
        customFormatter(date) {
            return moment(date).format('yyyy-MM-DD')
        },
        inputDate(date) {
            console.log(`选中日期${date}`)
            this.usrForm.birthday = moment(date).format('yyyy-MM-DD')
            console.log(`传入日期${this.usrForm.birthday}`)
            this.$refs.usrForm.validateField('birthday', valid => {
                console.log(`当前校验结果${valid}`)
                if (!valid) {
                    this.ageResult = true
                } else {
                    this.ageResult = false
                }
            })
        },
        // 转化年龄
        calculateAge(birthday) {
            try {
                const birthDate = new Date(birthday)
                const currentDate = new Date()

                let age = currentDate.getFullYear() - birthDate.getFullYear()
                const monthDiff = currentDate.getMonth() - birthDate.getMonth()

                if (
                    monthDiff < 0 ||
                    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
                ) {
                    age--
                }

                return age || 100
            } catch (error) {
                console.error('计算年龄时发生错误:', error)
                return 100 // 返回默认值
            }

        }
    }
}
</script>
<style scoped lang="less">
// 绑定用户信息弹窗
.bind-model {
    margin-top: -3vh;

    .model-title {
        text-align: center;
        margin-top: 30px;
        font-size: 18px;
    }

    .model-container {
        .info-container {
            background: rgba(240, 243, 245, 1);
            border-radius: 8px;
            padding: 5px 0px;
            margin: 0 0 20px;

            p {
                color: rgba(102, 102, 102, 1);
                margin: 3px;
            }

            .info-list {
                display: flex;
                margin: 10px;

                .title {
                    width: 40%;
                    text-align: right;
                }

                .info {
                    width: 60%;
                }
            }

            .info-content {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px;

                img {
                    height: 70px;
                }
            }
        }

        .msg-container {
            margin: 5px 20px 20px;
            padding: 0 5px;
            color: #000;

            .msg {
                margin: 10px;
                font-size: 12px;

                &.center {
                    text-align: center;
                }
            }
        }

        .content {

            // padding: 0 20px;
            .form-content {
                .email-info {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 12px;

                    p {
                        width: 110px;
                        text-align: right;
                        padding-right: 13px;
                    }

                    span {
                        color: rgba(64, 158, 255, 1);
                    }
                }

                .verification {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #409EFF;
                    line-height: 17px;
                    position: relative;
                    left: -64px;
                }

                .is-disabled {
                    opacity: 0.5;
                    color: #CDCED2;
                }

                .date-picker-wrapper {
                    // background-color: aqua;
                    width: 340px;

                }

                /deep/ .date-picker {
                    padding-left: 15px;
                    width: 100%;
                    height: 40px;
                    border: 1px solid #DCDFE6;
                    border-radius: 4px;
                }

                /deep/ .icon-i {
                    position: absolute;
                    top: 14px;
                    right: 56px;
                    z-index: 1;
                }

                /deep/ .vdp-datepicker {
                    .vdp-datepicker__calendar .cell.selected {
                        background: #4ba1f7;
                    }
                }

                /deep/ .date-picker::-webkit-input-placeholder {
                    color: #c8cbd2;
                }

                /deep/ .date-picker[type=text]:focus {
                    outline: none;
                    // border-color: #67c23a;
                }

                /deep/ .date-picker-normal {
                    outline: none;
                    border-color: #DCDFE6;
                    background: none;
                }

                /deep/ .date-picker-error {
                    outline: none;
                    border-color: #f56c6c;
                }
            }

            .error-msg {
                color: rgba(222, 53, 11, 1);
                position: absolute;
                font-size: 12px;
                margin-top: -8px;
                margin-left: 110px;
                margin-right: 65px;
            }

            // 隐私协议
            .need-read {
                display: flex;
                align-items: center;
                margin-top: 30px;
                margin-left: 110px;
                font-size: 12px;
                flex-wrap: wrap;

                /deep/ .el-checkbox {
                    margin-right: 10px;
                    top: 1px;
                }

                p {
                    color: rgba(151, 151, 151, 1);
                }

                span {
                    color: rgba(64, 158, 255, 1);
                    cursor: pointer;
                }
            }

            /deep/ .el-input__inner {
                width: 340px;
            }

            /deep/ .el-form-item {
                margin-bottom: 20px;
            }

            /deep/.is-success {
                .el-input__inner {
                    border-color: #DCDFE6 !important;
                }
            }

            /deep/ .el-input {
                width: auto;
            }
        }


    }

    .dialog-footer {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 20px;

        /deep/ .is-disabled {
            color: #606266;
            background-color: #e9e9e9;
            border: 1px solid #e9e9e9;
        }
    }

    /deep/ .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 10px;
        word-break: break-word;
    }


    @keyframes bubble {
        0% {
            transform: scale(0.2);
            opacity: 0.2;
        }

        50% {
            transform: scale(1);
            opacity: 1;
        }

        100% {
            transform: scale(0.2);
            opacity: 0.2;
        }
    }
}
</style>
<style lang="less">
// 日期弹窗
.el-picker-panel {
    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.2);
    // left: 0 !important;
    border-radius: 4px;

    .el-picker-panel__sidebar {
        position: relative;
        width: 100%;
        padding: 10px 0 10px 40px;
        border-radius: 4px 4px 0 0;
        box-shadow: 0 1px 0 0 rgba(215, 215, 218, 1);

        .el-picker-panel__shortcut {
            display: inline-block;
            width: 120px;
        }
    }

    .el-date-range-picker__time-header {
        display: none;
    }

    .el-picker-panel__body {
        margin-left: 0;
    }
}
</style>
