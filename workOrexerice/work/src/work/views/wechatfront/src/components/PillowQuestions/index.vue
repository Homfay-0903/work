<!-- eslint-disable eqeqeq -->
<!-- eslint-disable eqeqeq -->
<template>
    <div class="box-quest">
        <h6>睡眠健康问卷</h6>
        <div class="box-title">
            请花30秒告诉我们您的习惯，我们将为您生成一份专属的个性化睡眠分析报告。
        </div>
        <div :class="['box-box', isDeviceReport ? 'box-box-device' : '']">
            <div v-for="(item, index) in questionList" :key="index">
                <div class="box-pre">
                    <div class="box-pre-title">{{ index + 1 }}.{{ item.question }}</div>
                    <van-radio-group v-model="item.answer" direction="free">
                        <van-radio :icon-size="isDeviceReport ? '22px' : '12px' " :name="itemm.key" v-for="itemm in item.options" :key="itemm.key" @click="handleRadioClick(index, itemm)" >{{
                            itemm.text
                        }}</van-radio>
                        <p v-if="index==2" class="box-pre-bottom">
                           * 此信息仅用于枕头推荐的“康护加强型”筛选，不替代医疗建议。
                        </p>
                    </van-radio-group>
                </div>
            </div>
            <button
                :class="[isDeviceReport ? 'btn-box-device': '',answerCount === questionList.length ? 'btn-box' : 'btn-bo1']"
                @click="answerCount === questionList.length ? submit() : ''"
            >
                获取我的智眠报告 {{ answerCount }}/{{ questionList.length }}
            </button>
            <!-- <div class="skip-box" @click="skip()">跳过</div> -->
        </div>
        <div :class="[mask-overlay, isDeviceReport ? 'box-box-device' : '']" v-if="overStatus" @click="onclose(false)">
            <div class="box-box1" @click.stop>
                <h5>补充问卷</h5>
                <div class="box-title1">
                    没关系，我们换两个简单问题了解一下您的情况
                </div>
                <div class="box-box-content">
                    <div v-for="(item, index) in questionList1" :key="index">
                        <div class="box-pre">
                        <div class="box-pre-title"><span class="box-pre-index" >{{ index + 1 }}.</span><span class="box-pre-title-span">{{ item.question }}</span> </div>
                            <van-radio-group v-model="item.answer" direction="free">
                                <van-radio :icon-size="isDeviceReport ? '22px' : '12px' " :name="itemm.key" v-for="itemm in item.options" :key="itemm.key">{{
                                    itemm.text
                                }}</van-radio>
                            </van-radio-group>
                        </div>
                    </div>
                </div>
                <button
                    :class="answerCount1 === questionList1.length ? 'btn-box-1' : 'btn-bo1-1'"
                    @click="answerCount1 === questionList1.length ? onclose(true) : ''"
                >
                    确定 {{ answerCount1 }}/{{ questionList1.length }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { RadioGroup, Radio } from 'vant'
import { getPillowQuestions, submitPillowQuestions, getPillowReportQaByScanId } from '@/assets/js/apolloGql.js'
Vue.use(Radio)
Vue.use(RadioGroup)

const OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F']
export default {
    props: {
        from: String
    },
    data() {
        return {
            questionList: [],
            questionList1: [],
            overStatus: false,
            listArray: [],
            pollingInterval: null,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    computed: {
        answerCount() {
            return this.questionList.filter(item => item.answer).length
        },
        answerCount1() {
             return this.questionList1.filter(item => item.answer).length
        }
    },
    created() {
        this.getPillowQuestions()
    },
    beforeDestroy() {
        clearTimeout(this.pollingInterval)
    },
    methods: {
        getPillowReportQaByScanId() {
            const modelInfo = JSON.parse(window.localStorage.getItem('modelInfo'))
             this.$apollo
                .query({
                    query: getPillowReportQaByScanId,
                    variables: {
                        scanId: modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.getPillowReportQaByScanId
                        if (info.data) {
                            if (this.from === 'modeling') {
                                this.$router.push({
                                    path: '/modeling'
                                })
                            } else {
                                this.$emit('callback')
                            }
                        } else {
                            this.pollingInterval = setTimeout(() => {
                                clearTimeout(this.pollingInterval)
                                this.getPillowReportQaByScanId()
                            }, 6000) // 5秒后执行下次轮询
                        }
                })
        },

        // 获取报告时的年龄
        getPillowQuestions() {
            this.$apollo
                .query({
                    query: getPillowQuestions,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const response = res.data.getPillowQuestions
                    const list = []
                    response.data.forEach(o => {
                        const qa = {
                            ...o,
                            options: []
                        }
                        OPTIONS.forEach(item => {
                            if (qa[`option${item}`]) {
                                qa.options.push({
                                    key: item,
                                    text: qa[`option${item}`]
                                })
                            }
                        })
                        list.push(qa)
                    })
                    // 深拷贝 list 并赋值给 listArray
                    this.listArray = JSON.parse(JSON.stringify(list))
                    this.questionList = list.filter(item => ![4, 5].includes(item.id))
                    this.questionList1 = list.filter(item => [4, 5].includes(item.id))
                    this.getPillowReportQaByScanId()
                })
                .catch(e => {
                    console.error('getPillowQuestions:', e)
                })
        },

        // 信息提交
        submitData(answers) {
            this.$apollo
                .query({
                    query: submitPillowQuestions,
                    variables: {
                        scanId: JSON.parse(window.localStorage.getItem('modelInfo')).scanId,
                        answers
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.submitPillowQuestions
                    if (data.code === 200) {
                        if (this.from === 'modeling') {
                            this.$router.push({
                                path: '/modeling'
                            })
                        } else {
                            this.$emit('callback')
                        }
                    } else {
                        this.$toast(data.message)
                    }
                })
        },
        submit() {
            const answers = {}
            this.questionList.forEach(item => {
                answers[item.questionValue] = item[`option${item.answer}Value`]
            })
             this.questionList1.forEach(item => {
                answers[item.questionValue] = item[`option${item.answer}Value`]
            })
            const filteredAnswers = {}
            for (const key in answers) {
                if (answers[key] != null) {
                    filteredAnswers[key] = answers[key]
                }
            }
            this.submitData(JSON.stringify(filteredAnswers))
        },
        onclose(type) {
            this.overStatus = false
            if (!type) {
                this.questionList
                    .filter(item => [3].includes(item.id))
                    .forEach(item => {
                        item.answer = null // 直接修改原对象的属性
                })
                  // 重置补充问卷
                this.questionList1 = this.listArray
                    .filter(item => [4, 5].includes(item.id))
                    .map(item => ({ ...item, answer: null })) // 重置answer
            }

        },
        // 跳过
        skip() {
            this.submitData('')
        },

        handleRadioClick(index, itemm) {
            if (index === 2 && itemm.key === "D") {
                this.overStatus = true
            } else if (index === 2 && ['A', 'B', 'C'].includes(itemm.key)) {
                 // 重置补充问卷
                this.questionList1 = this.listArray
                    .filter(item => [4, 5].includes(item.id))
                    .map(item => ({ ...item, answer: null })) // 重置answer
            }
        }
    }
}
</script>

<style scoped lang="less">
.box-quest {
    background-image: -webkit-gradient(linear, left top, left bottom, from(#262849), to(#07090f));
    height: 100%;
    overflow-y: auto;
    font-family: PingFangSC, PingFang SC;
    h6 {
        height: 15px;
        text-align: center;
        font-weight: 500;
        font-size: 22px;
        color: #ffffff;
        line-height: 15px;
        margin: 30px auto 20px;
    }
    .box-title {
        text-indent: 22px;
        margin: auto 23px;
        font-weight: 400;
        font-size: 12px;
        color: #D1D1D6;
        line-height: 18px;
        font-style: normal;
        text-align: center;
    }
    .box-box {
        text-align: left;
        .box-pre {
            font-weight: 400;
            color: #ffffff;
            line-height: 14px;
            margin: 23px 24px;
            position: relative;

            .box-pre-title {
                margin-bottom: 12px;
                line-height: 20px;
                font-size: 13px;
            }
            .box-pre-bottom{
                width: 300px;
                font-weight: 400;
                font-size: 12px;
                color: #666666;
                line-height: 17px;
            }

            /deep/.van-radio__label,
            /deep/.van-checkbox__label {
                color: #666;
                font-size: 12px !important;
            }
            .van-radio-group--free {
                padding-left: 15px;
                margin-top: 4px;
                .van-radio {
                    margin-bottom: 4px;
                    &:last-child {
                        margin-bottom: 0px;
                    }
                }
                /deep/.van-radio__icon--checked {
                    .van-icon-success::before {
                        content: '';
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        border: 2px solid#fff;
                        position: relative;
                        top: 0px;
                    }
                }
                position: relative;

                /deep/.van-icon-success::before {
                    content: ' ';
                }
            }
        }
    }
    .btn-box,
    .btn-bo1 {
        display: block;
        margin: 40px auto 0;
        padding: 10px 40px;
        text-align: center;
        border-radius: 4px;
        background: #0271e3;
        color: #ffffff;
    }
    .btn-bo1 {
        background: #d3d6e0;
        color: #3b3939;
    }
    .skip-box {
        font-size: 14px;
        color: #0271e3;
        line-height: 20px;
        text-align: center;
        margin: 20px 0 50px;
    }
    /* 全屏遮罩层 */
    .mask-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /* 半透明黑色遮罩 */
        background-color: rgba(0, 0, 0, 0.7);
        /* 确保遮罩在最底层 */
        z-index: 1000;
        /* 允许点击穿透到下方元素（可选） */
        // pointer-events: none;
    }

    .box-box1{
        position: fixed;
        z-index: 1001;
        top: 62px;
        left: 31px;
        right: 31px;
        width: 313px;
        height: 473px;
        background: rgba(255,255,255,0.9);
        border-radius: 13px;
        backdrop-filter: blur(10px);
        h5{
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            font-size: 15px;
            color: #1C1C1E;
            line-height: 20px;
            text-align: center;
            font-style: normal;
            margin-top: 20px;
            margin-bottom: 8px;
        }
        .box-title1{
            font-size: 12px;
            color: #757575;
            line-height: 17px;
            text-align: left;
            margin-bottom: 16px;
            text-align: center;
        }
        .box-box-content{
            width: 283px;
            height: 328px;
            background: linear-gradient(
            90deg,
            rgba(3, 210, 186, 0.07) 0%,
            rgba(0, 159, 232, 0.07) 100%
            );
            border-radius: 4px;
            margin: 0 auto;
            overflow-y: auto;
            padding: 16px 15px;
            .box-pre {
                font-weight: 400;
                color: #1C1C1E;
                line-height: 14px;
                position: relative;
                margin-bottom: 16px;
                .box-pre-title {
                    .box-pre-index{
                        position: absolute;
                        top: 0;
                    }
                    .box-pre-title-span{
                        display: inline-block;
                        margin-left: 12px;
                    }
                    margin-bottom: 8px;
                    line-height: 20px;
                    font-size: 13px;
                }
                text-align: left;

                /deep/.van-radio__label,
                /deep/.van-checkbox__label {
                    color: #666;
                    font-size: 12px !important;
                    margin-left: 16px;
                }
                /deep/.van-radio--free{
                    position: relative;
                }
                /deep/.van-radio__icon--round{
                    position: absolute;
                    top: 5px;
                }
                .van-radio-group--free {
                    padding-left: 12px;
                    // margin-top: 4px;
                    .van-radio {
                        margin-bottom: 4px;
                        &:last-child {
                            margin-bottom: 0px;
                        }
                    }
                    /deep/.van-radio__icon--checked {
                        .van-icon-success::before {
                            content: '';
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            border: 2px solid#fff;
                            position: relative;
                            top: 0px;
                        }
                    }
                    position: relative;

                    /deep/.van-icon-success::before {
                        content: ' ';
                    }
                }
            }
        }
        .btn-bo1-1, .btn-box-1{
            display: block;
            margin: 20px auto 0;
            text-align: center;
            width: 90px;
            height: 28px;
            padding: 0;
            border-radius: 4px;
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 32px;
            text-align: center;
            background: linear-gradient( 90deg, #03D2BA 0%, #009FE8 100%);
        }
    }
}
.btn-box-device{
    font-size: 14px !important;
}
.box-box-device {
    /deep/.van-radio__icon--checked {
            .van-icon-success::before {
                content: '';
                width: 6px !important;
                height: 6px !important;
                border-radius: 50%;
                border: 4px solid#fff !important;
                position: relative;
                // top: 1px !important;
                // left: 1px !important;
            }
        }
}
</style>
