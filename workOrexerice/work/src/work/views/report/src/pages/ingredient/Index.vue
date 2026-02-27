<!--
 * @Description:
 * @Author: fanyunbo
 * @Date: 2023-12-26 17:14:14
 * @LastEditTime: 2024-12-19 11:22:33
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @Reference:
-->
<template>
    <div class="ingredient">
        <h6>体成分标准设置</h6>
        <p class="ingredient-p">
            * 标准修改后，将在新测量的报告中生效
        </p>
        <div class="ingredient-box">
            <el-radio-group v-model="sleeted">
                <el-radio label="0" v-if="!xianshi">2022版标准</el-radio>
                <el-radio label="0" v-else>维塑实验专研标准 <i class="wenhao" v-popover:question1></i></el-radio>
                <el-radio label="1" v-if="!xianshi">2023版标准</el-radio>
                <el-radio label="1" v-else>维塑实验专研标准升级版 <i class="wenhao" v-popover:question2></i></el-radio>
                <el-radio label="2" v-if="!xianshi">WHO标准</el-radio>
                <el-radio label="2" v-else>WHO(World Health Organization)标准 <i class="wenhao" v-popover:question3></i></el-radio>
            </el-radio-group>
        </div>
        <el-popover ref="question1" placement="right" title width="200" trigger="hover"
            content="参考卫生行业标准以及学术研究制定的专业标准"></el-popover>
            <el-popover ref="question2" placement="right" title width="200" trigger="hover"
            content="参考卫生行业标准以及学术研究制定的专业标准，并在此基础上使用了最新的脂肪量、蛋白质、水分等数据标准，推荐亚洲用户使用"></el-popover>
            <el-popover ref="question3" placement="right" title width="200" trigger="hover"
            content="根据WHO（World Health Organization）发布的标准及文献制定的专业标准，推荐欧美用户使用此标准"></el-popover>
        <p v-if="flexStatus" class="ingredient-flex" @click="record()"><i class="el-icon-caret-right"></i> 修改记录</p>
        <p v-else class="ingredient-flex" > </p>
        <div class="ingredient-btn">
            <el-button type="primary" round @click="updateInfo()">确定</el-button>
            <el-button round @click="cancellation()">取消</el-button>
        </div>
    </div>
</template>
<script>
import { findDeviceIdStatus, updateDeviceIdStatus, findDeviceIdRecords } from '@/assets/js/apolloGql.js'
import { isVRPro3, isVRPro5, isVRPro5ARM, isVE335 } from '@/types/device.js'

export default {
    data() {
        return {
            sleeted: '',
            current: '',
            // 修改记录是否显示
            flexStatus: false,
            isVRPro3: isVRPro3(),
            isVRPro5: isVRPro5(),
            isVRPro5ARM: isVRPro5ARM(),
            isVE335: isVE335()
        }
    },
    computed: {
        xianshi() {
            return this.isVRPro3 || this.isVRPro5 || this.isVRPro5ARM || this.isVE335
        }
    },
    created() {
        this.sureStatus()
    },
    mounted() {
        this.$apollo
            .query({
                query: findDeviceIdRecords,
                variables: {
                    deviceId: window.localStorage.getItem('deviceId')
                },
                fetchPolicy: 'no-cache'
            })
            .then(res => {
                const result = res.data.findDeviceIdRecords
                if (result.code === 200) {
                    if (result.data.length) {
                        this.flexStatus = true
                    }
                }
            })
    },
    methods: {
        record() {
            this.$router.push('record')
        },
        sureStatus() {
            this.$apollo
                .query({
                    query: findDeviceIdStatus,
                    variables: {
                        deviceId: window.localStorage.getItem('deviceId')
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(res => {
                    const result = res.data.findDeviceIdStatus
                    this.current = this.sleeted = JSON.stringify(result.biaStandard)
                })
        },
        updateInfo() {
            if (this.sleeted === this.current) {
                this.$message('该配置项重复设置!')
                return
            }
            this.$apollo
                .mutate({
                    mutation: updateDeviceIdStatus,
                    variables: {
                        deviceId: window.localStorage.getItem('deviceId'),
                        biaStandard: JSON.parse(this.sleeted),
                        preStandard: JSON.parse(this.current)
                    }
                })
                .then(res => {
                    this.loading = false
                    const data = res.data.updateDeviceIdStatus
                    if (data.code === 200) {
                        this.flexStatus = true
                        this.current = this.sleeted
                        this.$message('体成分标准设置成功!')
                    } else {
                        this.$message(data.error)
                    }
                })

        },
        cancellation() {
            this.sleeted = this.current
        }

    }
}
</script>
<style lang="less" scoped>
.ingredient{
    padding-top: 260px;
    h6{
        font-size: 24px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #000000;
        line-height: 33px;
    }
    .ingredient-p{
        font-size: 16px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        color: #666666;
        line-height: 21px;
        margin: 10px 0;
    }
    .ingredient-box{
        margin: 0 auto;
        width: 466px;
        height: 146px;
        background: rgba(0,159,232,0.05);
        .el-radio-group{
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 146px;
            .el-radio{
                margin: 10px 0;
                display: block;
                text-align: left;
                left: 133px;
                span{
                    font-size: 14px;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 400;
                    color: rgba(0,0,0,0.88)!important;
                    line-height: 22px;
                }
                /deep/ .el-radio__label{
                    color: rgba(0,0,0,0.88)!important;
                }
            }
        }

    }
    .ingredient-flex{
        margin: 4px auto;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #009FE8;
        line-height: 20px;
        width: 366px;
        text-align: right;
        min-height: 20px;
        i{
            font-size: 14px;
            color: #009FE8;
        }
        .el-icon-caret-right:before {
            content: "\E60E"!important;
        }
    }
    .ingredient-btn{
        margin-top: 60px;
        button{
            width: 128px;
            height: 40px;
            border: none;
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
        }
    }

}
.wenhao {
    background: url('../../assets/images/wenhao.svg') no-repeat center center;
    display: inline-block;
    background-size: contain;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    line-height: 1;
    position: absolute;
    left: 300px;
}
</style>
<style>
</style>