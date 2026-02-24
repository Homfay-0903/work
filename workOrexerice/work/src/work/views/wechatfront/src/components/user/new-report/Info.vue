<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-06-30 18:04:56
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-12 20:36:03
-->
<template>
    <!-- 头部信息 -->
    <div class="header-info">
        <div class="nickname">
            <div class="nick-name">
                <!-- 昵称 -->
                <span>{{ memberInfo.nickName ? memberInfo.nickName : memberInfo.mobile.includes('+') ? memberInfo.mobile.split('+')[0] : memberInfo.mobile }}</span>
                <img v-if="memberInfo.sex === 1" src="@/assets/images/new-report/report/nan.png" alt="">
                <img v-else-if="memberInfo.sex === 2" src="@/assets/images/new-report/report/nv.png" alt="">
            </div>
            <div :class="['detail-info', isDeviceReport ? 'isDeviceReport' : '']" class="detail-info">
                <div class="detail-info-item">
                    <!-- 身高 -->
                    <span>身高:</span>
                    <span class="age">{{ memberInfo.height }}cm</span>
                </div>
                <div>
                    <!-- 体重 -->
                    <span>体重:</span>
                    <span class="age">{{ weight > 0 ? `${weight}kg` : '--' }}</span>
                </div>
                <div>
                    <!-- 年龄 -->
                    <span>年龄:</span>
                    <span class="age">{{ memberInfo.age }} 岁</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getMemberInfo, getMemberInfoByScanId } from '@/assets/js/apolloGql.js'
export default {
    props: {
        scanId: String
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            memberInfo: {
                nickName: '',
                height: '',
                age: '',
                sex: null,
                mobile: '',
            },
            weight: 0,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },

    created() {
        // 获取用户信息
        this.getMemberInfo()
        this.getMemberInfoByScanId()
    },
    methods: {
        // 格式化手机号显示
        fomatterIphone(str) {
            let result = str || ''
            const phoneLen = result.length
            if (phoneLen > 14) {
                result = result.substr(0, 7) + '****' + result.substr(phoneLen - 4)
            } else if (phoneLen === 14) {
                result = result.substr(0, 6) + '****' + result.substr(phoneLen - 4)
            } else if (phoneLen > 7) {
                result = result.substr(0, 5) + '*'.repeat(phoneLen - 7) + result.substr(phoneLen - 2)
            }
            return result
        },
        // 侧边栏 获取用户信息
        getMemberInfo() {
            this.$apollo
                .query({
                    query: getMemberInfo
                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    if (data && data.code === 200) {
                        this.memberInfo = {
                            ...data.data
                        }
                        window.localStorage.setItem('memberInfo', JSON.stringify(data.data))
                    }
                })
        },
        getMemberInfoByScanId() {
            this.$apollo
                .query({
                    query: getMemberInfoByScanId,
                    variables: {
                        scanId: this.scanId
                    }
                })
                .then(res => {
                    const data = res.data.getMemberInfoByScanId
                    if (data && data.code === 200) {
                        this.weight = data.data.weight
                        this.memberInfo.age = this.memberInfo.age ? this.memberInfo.age : data.data.memberAge
                        this.memberInfo.height = this.memberInfo.height ? this.memberInfo.height : data.data.memberHeight
                    }
                })
        }
    }

}
</script>

<style lang="less" scoped>
.header-info {
    display: flex;
    align-items: center;
    width: 353px;
    // background-color: #303358;
    background: url(../../../assets/images/new-report/report/bj.png) center no-repeat;
    background-size: 100% 100%;
    margin: 0px 15px 0 11px;
    padding-bottom: 15px;
    font-size: 12px;
    color: #fff;

    .nickname {
        width: 353px;
        text-align: left;
    }

    .nick-name {
        // font-size: 14px;
        // font-weight: bold;
        // white-space: nowrap;
        flex-direction: row;
        display: flex;
        margin-top: 18px;
        margin-bottom: 16px;
        margin-left: 12px;
        align-content: last baseline;

        img {
            margin-left: 5px;
            width: 14px;
            height: 14px;
        }

        span {
            font-size: 14px;
            font-weight: 400;
            max-width: 308px;
            // height: auto;
            word-wrap: break-word;
            /*强制换行*/
            overflow: hidden;
            /*超出隐藏*/
            text-overflow: ellipsis;
            /*隐藏后添加省略号*/
            // line-height: 16px;
        }
    }

    .nickname>span {
        margin-left: 16px;
        display: initial;
        text-align: left;
        font-size: 14px;
        color: #8AA3BE;
    }

    .detail-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-left: 12px;
        margin-right: 12px;
        // background-color: #fff;

        span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #8AA3BE;
            line-height: 14px;
        }

        .age {
            margin-left: 5px;
        }

    }
    .isDeviceReport{
         span {
            font-family: inherit !important;
         }
    }

}
</style>

