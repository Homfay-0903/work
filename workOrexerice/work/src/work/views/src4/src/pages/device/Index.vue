<template>
    <div class="device-page">
        <!-- 设备信息页面 -->
        <div class="title">
            <h1>设备信息</h1>
        </div>
        <div class="device-content">
            <div class="image">
                <img v-if="isVAPro3" src="@/assets/images/public/device_apro3.png" alt="设备图片" />
                <img v-else-if="isVAPro5" src="@/assets/images/public/apro5.png" alt="设备图片" />
                <img v-else-if="isVAPro6" src="@/assets/images/public/apro6.png" alt="设备图片" />
                <img v-else-if="isVAPro7" src="@/assets/images/public/apro7.png" alt="设备图片" />
                <img class="img-style" v-else-if="isVe260" src="@/assets/images/public/ve260.png" alt="设备图片" />
                <img v-else src="@/assets/images/public/device@2x.png" alt="设备图片" />
                <p>设备SN号：{{ userInfo.deviceId }}</p>
            </div>
            <div class="info-content">
                <h3>{{ userInfo.gymName }}</h3>
                <p>
                    设备 SN：{{ userInfo.deviceId }}
                    <br />
                    设备启用时间：{{ changeFormat(userInfo.createTime) }}
                    <!-- 设备启用时间：{{ changedate() }} -->
                    <br />
                    <span v-if="userInfo.dataStorageExpireDate">云服务有效期：{{ changeFormat(userInfo.dataStorageExpireDate)
                    }}</span>
                </p>
                <!-- <div v-if="renewal.status !== -1 && renewal.status !== 0" class="step-btns"> -->
                <div class="step-btns" v-if="!isVAPro5 && !isVe260 && !isVRPro5 && !isVRPro5ARM && !isVAPro6">
                    <el-button @click="handlePay()" type="primary">续费</el-button>
                </div>
                <div v-if="renewalLength !== 0 && !isVAPro5 && !isVe260 && !isVRPro5 && !isVRPro5ARM && !isVAPro6" class="text-btns">
                    <el-button type="text" @click="handleRecord()">续费记录 >> </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { changeFormat } from '@/assets/js/util.js'
import actions from '@/qiankun/globalState'
import { findUserInfo } from '@/assets/js/apolloGql.js'
import { isVAPro3, isVAPro5, isVAPro7, isVE260, isVRPro5, isVRPro5ARM, isVAPro6 } from '@/types/device.js'
export default {
    name: 'DeviceInfo',
    data() {
        return {
            renewalList: [{}],
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro6: isVAPro6(),
            isVAPro7: isVAPro7(),
            isVe260: isVE260(),
            isVRPro5: isVRPro5(),
            isVRPro5ARM: isVRPro5ARM()
        }
    },
    computed: {
        ...mapState(['userInfo', 'renewal', 'renewalLength', 'replaceStatus']),
    },
    created() {
        const type = window.localStorage.getItem('type')
        if (type === '1') {
            this.findUserInfo()
        }

    },
    methods: {
        ...mapMutations(['SET_USER_INFO']),
        findUserInfo() {
            this.$apollo
                .query({
                    query: findUserInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.findUserInfo
                    if (result.code === 200) {
                        // TUDO主应用调用
                        let date = {}
                        date.SET_USER_INFO = result.data
                        actions.setGlobalState({ SET_USER_INFO: date.SET_USER_INFO })
                        actions.setGlobalState({ SET_RENEWAL: this.renewal })
                        window.localStorage.removeItem('type')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        handlePay() {
            actions.setGlobalState({ REPLACE_STATUS: !this.replaceStatus })
            // 跳转到续费页面
            this.$router.push('/pay')
        },
        handleRecord() {
            // 跳转到续费记录页面
            this.$router.push('/pay/renewal')
        },
        changeFormat(data) {
            if (!data) {
                return
            }
            return changeFormat(data)
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.fullPath === '/pay') {
            window.localStorage.setItem('type', 1)
        }
        next()
    }
}
</script>
<style lang="less" scoped>
.device-page {
    width: 100%;
    display: flex;
    flex-direction: column;

    .title {
        line-height: 33px;
        padding: 40px;
        text-align: left;
        border-bottom: 1px solid rgba(0, 0, 0, 0.14);

        h1 {
            font-size: 24px;
            font-weight: normal;
        }
    }

    .device-content {
        margin-top: 62px;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-start;

        .image {
            margin-top: 100px;
            width: 57.55%;

            img {
                width: 900px;
                height: 508px;
            }

            p {
                margin-top: 12px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #000000;
                line-height: 22px;
            }
            .img-style{
                width: 180px
            }
        }

        .info-content {
            text-align: left;

            h3 {
                font-size: 24px;
                font-weight: 600;
                color: rgba(0, 0, 0, 1);
                line-height: 40px;
            }

            p {
                font-size: 16px;
                font-weight: 400;
                color: rgba(0, 0, 0, 1);
                line-height: 40px;
            }

            .step-btns {
                margin-top: 64px;
                margin-bottom: 26px;

                /deep/.el-button {
                    width: 251px;
                    height: 40px;
                    border-radius: 20px;
                }
            }

            .text-btns {
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
            }
        }
    }
}
</style>

