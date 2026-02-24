<!-- eslint-disable eqeqeq -->
<!-- eslint-disable eqeqeq -->
<template>
  <div class="box-quest">
    <h6>无电流营养分析问卷</h6>
    <div class="box-title">
        您好，恭喜您升级为宝妈/准宝妈，请完成此问卷，协助我们更好的为您提供现阶段身体情况分析和建议。您的个人信息我们会为您妥善保密，请放心填写。
    </div>
    <div class="box-box">
        <!-- {{infoList}} -->
        <div v-for="(item, index) in infoList" :key="index">
            <!-- <div class="box-pre-title"> {{index+1}}</div> -->
            <div v-if="item.index===0" class="box-pre">
                <div class="">1.{{item.title}}</div>
                <van-radio-group v-model="item.radio" direction="horizontal">
                    <van-radio icon-size="12px" @click="defaultDate(item.radio)" :name="ide" v-for=" (itemm, ide) in item.select" :key="ide">{{itemm.name}}</van-radio>
                </van-radio-group>
            </div>
            <!-- 根据条件 -->
            <div v-else-if="dynamicSelect(item)" class="box-pre">
                <div class="">{{item.tableIndex}}.{{item.title}}</div>
                <input :placeholder="item.desc" @input="validator(item)" type="number" v-model="item.week " v-on:input="onInputHandler(item)" />
                <span v-if="item.week && item.index ===1 && infoList[0].radio === 1" class="box-pre-span">周</span>
                <span v-else-if="item.week" class="box-pre-span">kg</span>
            </div>
            <!-- 单选 同列 -->
            <div v-else-if="item.index===3 && infoList[0].radio===2" class="box-pre">
                <div class="box-pre-title">{{item.tableIndex}}.{{item.title}}</div>
                <van-radio-group v-model="item.radio" direction="horizontal">
                    <van-radio icon-size="12px" :name="ide" v-for=" (itemm, ide) in item.select" :key="ide">{{itemm.name}}</van-radio>
                </van-radio-group>
            </div>
            <!-- 单选 -->
            <div v-else-if="radio(item)" class="box-pre">
                <div class="box-pre-title">{{item.tableIndex}}.{{item.title}}</div>
                <van-radio-group v-model="item.radio" direction="free">
                    <van-radio icon-size="12px" :name="ide" v-for=" (itemm, ide) in item.select" :key="ide">{{itemm.name}}</van-radio>
                </van-radio-group>
            </div>
            <!-- 多选 -->
            <div v-else-if="item.index===9 || item.index===10 || item.index===11" class="box-pre">
                <div class="box-pre-title">{{item.tableIndex}}.{{item.title}}</div>
                <van-checkbox-group v-model="item.result">
                    <van-checkbox @click="validatorResult(item.index)" icon-size="12px" :name="ide" v-for=" (itemm, ide) in item.select" :key="ide">{{itemm.name}}</van-checkbox>
                </van-checkbox-group>
            </div>

        </div>
        <button :class="rules?'btn-box':'btn-bo1'" @click="rules ? submit(): ''">信息提交</button>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import { RadioGroup, Radio, Checkbox, CheckboxGroup, Toast } from 'vant'

Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)

import { submitInfo } from '@/assets/js/apolloGql.js'
export default {
    data() {
        return {
            changeDate: -1,
            infoListArray: []
        }
    },
    computed: {
        infoList() {
            return this.infoListArray
        },
        // 组合必填项
        rules() {

            switch (this.infoListArray[0].radio) {
                case 0:
                    return this.commonCompute()
                case 1:
                    return this.commonCompute([], [this.infoListArray[1], this.infoListArray[4]])
                case 2:
                    return this.commonCompute([this.infoListArray[2], this.infoListArray[3]], [this.infoListArray[4], this.infoListArray[5]])
                default:
                    return false
            }
        }
    },
    watch: {
        infoListArray: {
            handler(newVal) {
                if (newVal[0].radio !== this.changeDate) {
                    this.changeDate = newVal[0].radio
                    console.log(newVal[0].radio, '数据更新', this.changeDate)
                    // 数据切换后进行table 清空
                    this.infoListArray = [
                        {
                            index: 0,
                            title: '您当前所处阶段：',
                            select: [{ name: '备孕' }, { name: '孕期' }, { name: '产后' }],
                            radio: this.changeDate,
                            tableIndex: 1
                        },
                        {
                            index: 1,
                            title: '孕周数：',
                            desc: '请输入你的孕期周数',
                            week: '',
                            tableIndex: this.changeDate === 1 ? 2 : ''
                        },
                        {
                            index: 2,
                            title: '产后天数：',
                            select: [{ name: 'A 1.5个月内' }, { name: 'B 1.5~6个月' }, { name: 'C 6~12个月' }, { name: 'D 超过12个月' }],
                            radio: -1,
                            tableIndex: this.changeDate === 2 ? 2 : ''
                        },
                        {
                            index: 3,
                            title: '您目前是否在进行哺乳：',
                            select: [{ name: '是' }, { name: '否' }],
                            radio: -1,
                            tableIndex: this.changeDate === 2 ? 3 : ''
                        },
                        {
                            index: 4,
                            title: '您孕前的体重是:',
                            desc: '请输入您孕前的体重',
                            week: '',
                            tableIndex: this.changeDate === 1 ? 3 : this.changeDate === 2 ? 4 : ''
                        },
                        {
                            index: 5,
                            title: '您产前的体重是:',
                            desc: '请输入您产前的体重',
                            week: '',
                            tableIndex: this.changeDate === 2 ? 5 : ''
                        },
                        {
                            index: 6,
                            title: '您目前每天工作/学习中大部分的时间：',
                            select: [{ name: 'A 卧床或目前不工作' }, { name: 'B 轻微行走或站立（如教师、办公室白领）' }, { name: 'C 中等强度活动（如学生、驾驶、销售、警察等）' }, { name: 'D 高强度活动（如职业运动员）' }],
                            radio: -1,
                            tableIndex: this.changeDate === 1 ? 4 : this.changeDate === 2 ? 6 : 2
                        },
                        {
                            index: 7,
                            title: '您平均每天除工作所需以外，步行、逛街及做家务的时间有多长：',
                            select: [{ name: 'A 不到20分钟' }, { name: 'B 20~60分钟 ' }, { name: 'C 60~90分钟' }, { name: 'D 90分钟以上' }],
                            radio: -1,
                            tableIndex: this.changeDate === 1 ? 5 : this.changeDate === 2 ? 7 : 3
                        },
                        {
                            index: 8,
                            title: '您每周进行有效体育锻炼(工作以外)的总时间是：',
                            select: [{ name: 'A 1小时以下' }, { name: 'B 1~2小时 ' }, { name: 'C 3~4小时' }, { name: 'D 5小时以上' }],
                            radio: -1,
                            tableIndex: this.changeDate === 1 ? 6 : this.changeDate === 2 ? 8 : 4
                        },
                        {
                            index: 9,
                            title: '您上述锻炼或活动的主要形式是（可多选）：',
                            select: [{ name: 'A 步行、瑜伽等低强度活动' }, { name: 'B 普拉提、慢跑、休闲游泳、健身等中等强度运动' }, { name: 'C 配速超过6的中快跑、游泳训练、搏击、跳操等高强度活动' }],
                            result: [],
                            tableIndex: this.changeDate === 1 ? 7 : this.changeDate === 2 ? 9 : 5
                        },
                        {
                            index: 10,
                            title: '您通勤的方式是（可多选）:',
                            select: [{ name: 'A 乘坐公共交通' }, { name: 'B 自行驾车或步行' }, { name: 'C 骑自行车' }, { name: 'D 我无需通勤' }],
                            result: [],
                            tableIndex: this.changeDate === 1 ? 8 : this.changeDate === 2 ? 10 : 6
                        },
                        {
                            index: 11,
                            title: '您是否具有以下问题（可多选）:',
                            select: [{ name: 'A 便秘' }, { name: 'B 高血压' }, { name: 'C 血糖异常' }, { name: 'D 贫血' }, { name: 'E 无' }],
                            result: [],
                            tableIndex: this.changeDate === 1 ? 9 : this.changeDate === 2 ? 11 : 7
                        },
                    ]
                }
            },
            deep: true
        }
    },
    created() {
        this.infoListArray = [
            {
                index: 0,
                title: '您当前所处阶段：',
                select: [{ name: '备孕' }, { name: '孕期' }, { name: '产后' }],
                radio: -1,
                tableIndex: 1
            },
            {
                index: 1,
                title: '孕周数：',
                desc: '请输入你的孕期周数',
                week: null,
                tableIndex: `${this.changeDate === 1 ? 2 : ''}`
            },
            {
                index: 2,
                title: '产后天数：',
                select: [{ name: 'A 1.5个月内' }, { name: 'B 1.5~6个月' }, { name: 'C 6~12个月' }, { name: 'D 超过12个月' }],
                radio: -1,
                tableIndex: this.changeDate === 2 ? 2 : ''
            },
            {
                index: 3,
                title: '您目前是否在进行哺乳：',
                select: [{ name: '是' }, { name: '否' }],
                radio: -1,
                tableIndex: this.changeDate === 2 ? 3 : ''
            },
            {
                index: 4,
                title: '您孕前的体重是:',
                desc: '请输入您孕前的体重',
                week: null,
                tableIndex: this.changeDate === 1 ? 3 : this.changeDate === 2 ? 4 : ''
            },
            {
                index: 5,
                title: '您产前的体重是:',
                desc: '请输入您产前的体重',
                week: null,
                tableIndex: this.changeDate === 2 ? 5 : ''
            },
            {
                index: 6,
                title: '您目前每天工作/学习中大部分的时间：',
                select: [{ name: 'A 卧床或目前不工作' }, { name: 'B 轻微行走或站立（如教师、办公室白领）' }, { name: 'C 中等强度活动（如学生、驾驶、销售、警察等）' }, { name: 'D 高强度活动（如职业运动员）' }],
                radio: -1,
                tableIndex: this.changeDate === 1 ? 4 : this.changeDate === 2 ? 6 : 2
            },
            {
                index: 7,
                title: '您平均每天除工作所需以外，步行、逛街及做家务的时间有多长：',
                select: [{ name: 'A 不到20分钟' }, { name: 'B 20~60分钟 ' }, { name: 'C 60~90分钟' }, { name: 'D 90分钟以上' }],
                radio: -1,
                tableIndex: this.changeDate === 1 ? 5 : this.changeDate === 2 ? 7 : 3
            },
            {
                index: 8,
                title: '您每周进行有效体育锻炼(工作以外)的总时间是：',
                select: [{ name: 'A 1小时以下' }, { name: 'B 1~2小时 ' }, { name: 'C 3~4小时' }, { name: 'D 5小时以上' }],
                radio: -1,
                tableIndex: this.changeDate === 1 ? 6 : this.changeDate === 2 ? 8 : 4
            },
            {
                index: 9,
                title: '您上述锻炼或活动的主要形式是（可多选）：',
                select: [{ name: 'A 步行、瑜伽等低强度活动' }, { name: 'B 普拉提、慢跑、休闲游泳、健身等中等强度运动' }, { name: 'C 配速超过6的中快跑、游泳训练、搏击、跳操等高强度活动' }],
                result: [],
                tableIndex: this.changeDate === 1 ? 7 : this.changeDate === 2 ? 9 : 5
            },
            {
                index: 10,
                title: '您通勤的方式是（可多选）:',
                select: [{ name: 'A 乘坐公共交通' }, { name: 'B 自行驾车或步行' }, { name: 'C 骑自行车' }, { name: 'D 我无需通勤' }],
                result: [],
                tableIndex: this.changeDate === 1 ? 8 : this.changeDate === 2 ? 10 : 6
            },
            {
                index: 11,
                title: '您是否具有以下问题（可多选）:',
                select: [{ name: 'A 便秘' }, { name: 'B 高血压' }, { name: 'C 血糖异常' }, { name: 'D 贫血' }, { name: 'E 无' }],
                result: [],
                tableIndex: this.changeDate === 1 ? 9 : this.changeDate === 2 ? 11 : 7
            },
        ]
    },
    methods: {
        // 多选规则校验
        validatorResult(index) {
            if (index === 10) {
                if (this.infoListArray[index].result.indexOf(3) > -1) this.infoListArray[index].result = [3]
            } else if (index === 11) {
                if (this.infoListArray[index].result.indexOf(4) > -1) this.infoListArray[index].result = [4]
            }
        },
        // 长度验证
        validator(index) {
            if (index.index === 1) {
                if (this.infoListArray[1].week > 99) {
                    this.infoListArray[1].week = this.infoListArray[1].week.slice(0, 2)
                // eslint-disable-next-line eqeqeq
                } else if (index.week < 0 || index.week == 0) {
                    Toast('请输入大于0的整数')
                    this.infoListArray[1].week = ''
                }
            } else {
                // eslint-disable-next-line eqeqeq
                if (index.week < 0 || index.week == 0) {
                    Toast('请输入大于0的整数')
                    console.log(index.index)
                    this.infoListArray[index.index].week = ''
                }
                this.infoListArray[index.index].week = this.infoListArray[index.index].week.slice(0, 3)
            }

        },
        onInputHandler(event) {
            console.log(`输入值${event.index}`)
            if (event.index === 1) {
                event.week = event.week.replace(/[^0-9]/g, '')
                console.log(`输出值${event.week}`)
            }
        },
        // 必填项规则处理 radioArr 为选项 weekArr 为填空
        commonCompute(radioArr = [], weekArr = []) {
            return [this.infoListArray[6], this.infoListArray[7], this.infoListArray[8]].concat(radioArr).every(item => item.radio > -1) &&
                   [this.infoListArray[9], this.infoListArray[10], this.infoListArray[11]].every(item => item.result.length) &&
                   weekArr.every(item => item.week)
        },
        defaultDate(index) {
            if (this.changeDate !== index) {
                this.infoList[1].week = ''
                this.infoList[2].radio = -1
                this.infoList[3].radio = -1
                this.infoList[4].week = ''
                this.infoList[5].week = ''
            }
        },
        // 根据条件动态筛选过需求文档 https://www.tapd.cn/62427310/prong/stories/view/1162427310001006699
        // 题1选择“孕期”则显示 显示 -孕周数 -孕前体重
        // 题1选择“产后”则显示 -产后天数 -哺乳 -产前体重 -孕期体重
        dynamicSelect(item) {
            return (item.index === 1 && this.infoList[0].radio === 1) || (item.index === 4 && (this.infoList[0].radio === 1 || this.infoList[0].radio === 2)) || (item.index === 5 && this.infoList[0].radio === 2)
        },
        //  单选条件应用
        radio(item) {
            return (item.index === 2 && this.infoList[0].radio === 2) || item.index === 6 || item.index === 7 || item.index === 8
        },

        // 信息提交
        submit() {
            // todo

            this.$apollo
                .query({
                    query: submitInfo,
                    variables: {
                        scanId: JSON.parse(window.localStorage.getItem('modelInfo')).scanId,
                        preStage: this.infoList[0].radio > -1 ? this.infoList[0].radio + 1 : -1,
                        gestationalAge: parseFloat(this.infoList[1].week),
                        postpartumDay: this.infoList[2].radio > -1 ? this.infoList[2].radio + 1 : -1,
                        isSuckle: this.infoList[3].radio > -1 ? this.infoList[3].radio + 1 : -1,
                        preWeight: parseFloat(this.infoList[4].week),
                        prenatalWeight: parseFloat(this.infoList[5].week),
                        studyTime: this.infoList[6].radio > -1 ? this.infoList[6].radio + 1 : -1,
                        otherTime: this.infoList[7].radio > -1 ? this.infoList[7].radio + 1 : -1,
                        exerciseTime: this.infoList[8].radio > -1 ? this.infoList[8].radio + 1 : -1,
                        exercisePatterns: this.infoList[9].result.length > 0 ? JSON.stringify(this.infoList[9].result.map((item) => { return item + 1 })) : '[]',
                        gomutiMode: this.infoList[10].result.length > 0 ? JSON.stringify(this.infoList[10].result.map((item) => { return item + 1 })) : '[]',
                        otherQuestion: this.infoList[11].result.length > 0 ? JSON.stringify(this.infoList[11].result.map((item) => { return item + 1 })) : '[]'
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.submitInfo
                    console.log(data, 999999)
                    if (data.code === 200) {
                        console.log('页面跳转过度页')
                        setTimeout(() => {
                            this.$router.push(
                                { path: '/modeling', query: { quest: true }}
                            )
                        }, 1 * 1000)
                    } else {
                        this.$toast(data.message)
                    }
                })
        }
    }
}
</script>

<style scoped lang="less">
.box-quest{
    background-image: -webkit-gradient(linear,left top,left bottom,from(#262849),to(#07090f));
    height: 100%;
    overflow-y: auto;
    font-family: PingFangSC, PingFang SC;
    h6{
        height: 15px;
        text-align: center;
        font-weight: 500;
        font-size: 17px;
        color: #FFFFFF;
        line-height: 15px;
        margin: 24px auto 38px;
    }
    .box-title{
        text-indent: 22px;
        margin: auto 23px;
        font-weight: 400;
        font-size: 13px;
        color: #8AA3BE;
        line-height: 18px;
        font-style: normal;
        text-align: left;
    }
    .box-box{
        text-align: left;
        .box-pre{
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 14px;
            margin: 23px 24px;
            position: relative;
            .box-pre-span{
                position: absolute;
                top: 32px;
                right: 17px;
                color: #FFFFFF;
                font-size: 12px;

            }
            .box-pre-title{
                margin-bottom: 18px;
                line-height: 20px;
            }
            .van-radio-group--horizontal{
                padding-left: 8px;
                padding-right: 30px;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                // /deep/.van-radio__label{
                //     color: #8AA3BE;
                //     font-size: 12px!important;
                // }
                /deep/.van-radio__icon--checked {
                    .van-icon-success::before{
                        content: "";
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: #FFFFFF;
                        position: relative;
                        top: -1px;
                    }
                }
                /deep/.van-icon-success::before{
                    content: " ";
                }

            }
            input{
                margin-top: 10px;
                border: none;
                background: #303C5C;
                border-radius: 4px;
                font-size: 12px;
                line-height: 12px;
                width: 100%;
                height: 28px;
                text-indent: 8px;
            }

            /deep/.van-radio__label, /deep/.van-checkbox__label{
                    color: #FFFFFF;
                    font-size: 12px!important;
            }
            .van-radio-group--free, .van-checkbox{
                margin-top: 10px;
                .van-radio{
                    margin-bottom: 10px;
                    &:last-child{
                        margin-bottom: 0px;
                    }
                }
                /deep/.van-radio__icon--checked, /deep/.van-checkbox__icon--checked{
                    .van-icon-success::before{
                        content: "";
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: #FFFFFF;
                        position: relative;
                        top: -1px;
                    }
                }
                position: relative;
                /deep/.van-checkbox__icon--checked,  /deep/.van-checkbox__icon--round{
                    position: absolute;
                    top: 2px;
                }
                /deep/.van-checkbox__label{
                    display: inline-block;
                    padding-left: 12px;
                }
                /deep/.van-icon-success::before{
                    content: " ";
                }
            }
        }

    }
    .btn-box, .btn-bo1{
        display: block;
        margin: 40px auto;
        padding: 10px 40px;
        text-align: center;
        border-radius: 10px;
        background: #4c7af8;
        color: #FFFFFF;
    }
    .btn-bo1{
        background: #d3d6e0;
        color: #3b3939;
    }
}


</style>
