<template>
    <div :class="isAudio === 0 ? 'height-container1' : 'height-container'">
        <!-- <button @click="onClickbtn" style="width: 10px; height: 10px"></button> -->
        <!-- <transition name="fade"> -->
        <div class="content">
            <p class="height-title left">
                {{ isAudio === 2 ? '身高调整' : '身高测量' }}
            </p>
            <div v-if="isAudio === 0">
                <p class="rectangle"></p>
                <img v-if="deviceInfo.teenagerIsOpen" class="fade-png" src="@/assets/img/height/mode_t.png" alt="" />
                <img v-else class="fade-png" src="@/assets/img/height/mode.png" alt="" />
            </div>
            <div v-else-if="isAudio === 1">
                <img
                    v-if="deviceInfo.teenagerIsOpen"
                    class="fade-png1"
                    src="@/assets/img/shape/guideTurntab_t.png"
                    alt=""
                />
                <img v-else class="fade-png1" src="@/assets/img/height/height-dt.png" alt="" />
            </div>
            <div v-else-if="isAudio === 2">
                <div v-if="deviceInfo.deviceType === 5 && deviceInfo.operationMode === 1" class="pro5-adjust-box">
                    <div class="age-box">
                        <img src="@/assets/img/height/heightdui.png" class="dui" />
                        <p class="age-title">{{ $t('egym.heightsuccess') }}</p>
                        <div class="age-box-item2">
                            <div class="box-item-title">
                                <img
                                    :src="
                                        require(`@/assets/img/height/${
                                            isHeightLessThan70 ? 'subtract-fill-disabled' : 'sub2'
                                        }.png`)
                                    "
                                    class="sub"
                                    @touchend="changeHeight('sub')"
                                />
                                <input type="number" v-model="height" class="age-input" @focus="isfoce = true" />
                                <span class="age-age">cm</span>
                                <img
                                    :src="
                                        require(`@/assets/img/height/${
                                            isHeightMoreThan200 ? 'add-fill-disabled' : 'add2'
                                        }.png`)
                                    "
                                    class="add"
                                    @touchend="changeHeight('add')"
                                />
                            </div>
                            <div class="error" v-if="errtips">
                                <img src="@/assets/img/height/heighterr.png" class="cuo" /> {{ errtips }}
                            </div>
                        </div>
                        <i18n path="egym.logintips6" tag="span" class="age-tips">
                            <img src="@/assets/img/height/sub2.png" place="up" alt="" class="sub2" />
                            <img src="@/assets/img/height/add2.png" place="down" alt="" class="add2" />
                        </i18n>
                    </div>
                </div>
                <div v-else class="height-adjust-box">
                    <img
                        class="fade-png"
                        :src="require(`@/assets/img/height/mode${deviceInfo.teenagerIsOpen ? '_t' : ''}.png`)"
                        alt=""
                    />
                    <div class="height-adjust-right">
                        <div class="height-adjust-top">
                            <div></div>
                            <img src="@/assets/img/height/top.png" alt="" />
                        </div>
                        <p>
                            {{ height }} <span> cm </span>
                            <span v-if="isTips" class="tips-error">身高支持范围 110~205cm</span>
                        </p>
                        <div class="height-adjust-bottom">
                            <img src="@/assets/img/height/down.png" alt="" />
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isAudio == 2 && !isfoce" style="height: 900px"></div>
            <div v-if="isAudio == 2 && isfoce" style="height: 900px">
                <div class="qu-pi-style-btn">
                    <ul>
                        <li
                            :class="peelingActive === index ? 'active' : item === 'x' ? 'classx' : ''"
                            v-for="(item, index) in btnArray"
                            @touchend="confirmSelection(index)"
                            :key="index"
                        >
                            {{ item === 'x' ? '' : item }}
                            <img v-if="item === 'x'" src="@/assets/img/height/x.png" />
                        </li>
                    </ul>
                </div>
            </div>
            <div class="bottom-msg" v-if="isAudio !== 3">
                <div v-if="isAudio == 2 && isDeviceValidPro5" @touchend="hubConfirm()">
                    <tip-card
                        title-icon="heightcheck"
                        :title="$t('setting.peeling.sure-set')"
                        :subtitle="$t('height.tips9')"
                    ></tip-card>
                </div>
                <transition v-else name="fade-move" mode="out-in" appear>
                    <msg-card class="tip">
                        <ul slot="info-content" v-if="isAudio == 0">
                            <li>测量中，请保持身体静止</li>
                        </ul>
                        <ul slot="info-content" v-else-if="isAudio == 1">
                            <li>站在转台上，双手垂放，双脚并拢</li>
                            <li>保持静止</li>
                        </ul>
                        <ul slot="info-content" v-else-if="!isDeviceValidPro5">
                            <li>
                                如需调整, 请用 <img src="@/assets/img/error/add.svg" />&nbsp;<img
                                    src="@/assets/img/error/sub.svg"
                                />
                                微调身高数值
                            </li>
                            <li>按电源键 <img src="@/assets/img/error/switch.svg" /> 确认</li>
                        </ul>
                    </msg-card>
                </transition>
            </div>
            <div v-else class="height-fail">
                <img src="@/assets/img/shape/fail.png" class="fail" alt="失败图标" />
                <div>
                    <p class="height-fail-title">测量失败</p>
                    <p>检测到设备前方有遮挡，请移除障碍物</p>
                    <span>若尝试无效，请联系售后维修</span>
                </div>
                <!-- <cut-down-load
                        duration="15"
                        :suffix="suffix"
                        :suffixType="suffixType"
                        @cut-down-over="countDownCallback"
                        class="progress"
                    ></cut-down-load> -->
            </div>
        </div>
        <!-- </transition> -->
        <cut-down-load
            v-if="isAudio !== 1"
            @cut-down-over="onScanCutDownOver"
            :duration="time"
            :suffixType="2"
        ></cut-down-load>
    </div>
</template>
<script>
import MsgCard from '@/components/MsgCard.vue'
import { EventBus } from '@/util/event-bus'
import CutDownLoad from './compoments/CutDownLoad.vue'
import router from '@/router'
import { mapGetters } from 'vuex'
import TipCard from '../home/components/TipCard.vue'

export default {
    name: 'HeightPrepare',
    components: {
        MsgCard,
        CutDownLoad,
        TipCard
    },
    data() {
        return {
            isAudio: 1,
            height: 180,
            isTips: false,
            time: 60,
            heighten: {
                ft: 3,
                in: 11
            },
            btnArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'x'],
            peelingActive: -1,
            isft: false,
            errtips: '',
            isfoce: false,
            isHeightLessThan70: false,
            isHeightMoreThan200: false
        }
    },
    computed: {
        ...mapGetters(['deviceInfo']),
        isDeviceValidPro5() {
            return this.deviceInfo.deviceType === 5 && this.deviceInfo.operationMode === 1
        }
    },
    created() {},
    mounted() {
        this.$emit('on-audio-event', 'playAudio', 'heightZunbei')
        EventBus.$on('EventAction', (type, data) => {
            window.logger.info('身高测量数据', type, data)
            console.log('身高测量数据', type, data)
            if (type === 'heightMeasurementResult') {
                if (data.isOcclusion) {
                    this.isAudio = 3
                    this.time = 15
                    return
                }
                this.height = data.height
                let btnList = []
                btnList.push(
                    {
                        btn: 'add',
                        msg: '加'
                    },
                    {
                        btn: 'sub',
                        msg: '减'
                    },
                    {
                        btn: 'switch',
                        msg: '电源'
                    }
                )
                this.$store.commit('CHANGE_PAGE_INFO', {
                    btnList
                })
                this.isAudio = 2
                this.time = 59
                // 播放上下调整身高语音
                this.$emit('on-audio-event', 'playAudio', '08')
            }
        })
    },
    beforeRouteEnter(to, from, next) {
        // 进入当前组件  当前组件不存在  this不存在
        // console.log('进入身高测量页面', to, from)
        if (from.name === 'Welcome') {
            next()
        } else {
            router.go(-1)
        }
    },
    methods: {
        onClickbtn() {
            this.isAudio = 2
            this.time = 590
        },
        audioEndCallback(audioId) {
            console.log(audioId, 88888)
            if (audioId === 'heightZunbei') {
                setTimeout(() => {
                    this.isAudio = 0
                    this.time = 60
                    // 发起算法检测
                    this.$emit('on-audio-event', 'playAudio', '09')
                    this.$algClient.startHeightMeasurement()
                }, 3 * 1000)
            }
            if (audioId === 'shutDownInUse') {
                if (this.isAudio === 1) {
                    this.$emit('on-audio-event', 'playAudio', 'heightZunbei')
                }
                if (this.isAudio === 0) {
                    this.$emit('on-audio-event', 'playAudio', '09')
                }
            }
        },
        onScanCutDownOver() {
            this.$changeViewPage('Home')
        },
        // 按键事件
        btnClick(btnType) {
            // 重复按下无效
            if (this.btnDisabled || this.isAudio !== 2) {
                return
            }
            this.isTips = false
            // 上
            if (btnType === 1) {
                if (this.isAudio === 2 && this.isDeviceValidPro5) {
                    this.changeHeight('add')
                    return
                }
                if (this.height > 204) {
                    this.isTips = true
                    window.logger.info('身高超出204', this.height)
                    return
                }
                this.height++
                // 下
            } else if (btnType === 2) {
                if (this.isAudio === 2 && this.isDeviceValidPro5) {
                    this.changeHeight('sub')
                    return
                }
                if (this.height < 111) {
                    window.logger.info('身高减少超出111', this.height)
                    this.isTips = true
                    return
                }
                this.height--
                // 确定
            } else if (btnType === 3) {
                if (this.isAudio === 2 && this.isDeviceValidPro5) {
                    this.hubConfirm()
                    return
                }
                console.log('确认')
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    height: this.height
                })
                // 确认后跳转页面
                setTimeout(() => {
                    this.$changeViewPage('StandUpSelectPro5', {
                        params: {
                            wecomePage: true
                        }
                    })
                }, 1000)
            }
            // TODO: 等待处理长按返回键
            // else if (btnType === 9) {
            //     // 长按返回键
            //     this.$algClient.stopGestureDetect()
            //     this.$changeViewPage('Home')
            // }
        },
        // 调整身高并检查范围
        adjustHeightWithRangeCheck(newHeight) {
            const MIN_HEIGHT = 110
            const MAX_HEIGHT = 205
            const ERROR_MSG = '身高支持范围 110~205cm'

            if (newHeight < MIN_HEIGHT) {
                this.isHeightLessThan70 = true
                this.isHeightMoreThan200 = false
                this.errtips = ERROR_MSG
                return MIN_HEIGHT
            } else if (newHeight > MAX_HEIGHT) {
                this.isHeightLessThan70 = false
                this.isHeightMoreThan200 = true
                this.errtips = ERROR_MSG
                return MAX_HEIGHT
            } else {
                this.isHeightLessThan70 = false
                this.isHeightMoreThan200 = false
                this.errtips = ''
                return newHeight
            }
        },
        changeHeight(key) {
            this.errtips = ''
            let newHeight = this.height
            if (key === 'add') {
                newHeight = Number(this.height) + 1
            } else if (key === 'sub') {
                newHeight = Number(this.height) - 1
            }

            this.height = this.adjustHeightWithRangeCheck(newHeight)
        },
        confirmSelection(index) {
            this.errtips = ''
            console.log(index, '>index')
            if (index == 10) {
                this.height = String(this.height).slice(0, -1)
            } else {
                if (index == 9) {
                    index = -1
                }
                if (!this.height) {
                    this.height = ''
                }
                let num = String(this.height) + String(index + 1)
                if (+num < 201) {
                    this.height = +num
                } else if (+num > 205) {
                    this.height = 205
                    this.errtips = '身高支持范围 110~205cm'
                }
            }
        },
        hubConfirm() {
            if (this.height >= 110 && this.height <= 205) {
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    height: this.deviceInfo.deviceType === 5 ? this.height : (this.height / 2.54).toFixed(1)
                })
                this.$changeViewPage('StandUpSelectPro5', {
                    params: {
                        wecomePage: true
                    }
                })
            } else {
                this.errtips = '身高支持范围 110~205cm'
            }
        }
    },
    beforeDestroy() {
        // 离开关闭身高检测
        this.$algClient.endHeightMeasurement()
        EventBus.$off('EventAction')
    }
}
</script>
<style lang="less" scoped>
.height-container,
.height-container1 {
    width: 100%;
    height: 100%;
    padding-top: 400px;
    .content {
        .height-title {
            position: relative;
            top: -140px;
            font-size: 64px;
            margin: 0;
            z-index: 100;
            &.left {
                text-align: left;
                padding-left: 60px;
            }
        }
        .fade-png {
            width: 231px;
            height: 868px;
            position: relative;
            left: 0;
            right: 0;
            top: 0px;
            z-index: 1;
        }
        position: absolute;
        width: 100%;
        height: 100%;
        text-align: center;
        .rectangle {
            position: relative;
            width: 960px;
            height: 8px;
            margin: 0 auto;
            background: radial-gradient(ellipse at center top, #28feff 0%, rgba(0, 159, 232, 0) 100%);
            background-size: 100% 200%;
            // background-repeat: no-repeat;
            animation: updown 3s linear infinite;
            border-radius: 2px;
            z-index: 2;
            will-change: transform; /* 提示浏览器提前优化 */
        }
        @keyframes updown {
            0% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(900px);
            }
        }
        .bottom-msg {
            position: absolute;
            left: 0;
            bottom: 564px;
            width: 100%;
            .tip {
                li {
                    max-width: 730px;
                    margin-right: 50px;
                }
            }
            .info {
                .msg {
                    text-align: center;
                    font-size: 48px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #ffffff;
                    line-height: 54px;
                    margin: 36px auto 24px;
                }
            }
        }
        .height-adjust-box {
            display: flex; /* 横向排列 */
            align-items: center; /* 垂直居中（可选） */
            justify-content: center;
            gap: 10px; /* 元素之间的间距（可调整） */
            .height-adjust-right {
                .height-adjust-top {
                    div {
                        width: 112px;
                        height: 209px;
                        border: 4px solid;
                        border-image: linear-gradient(90deg, rgba(62, 159, 244, 0), rgba(29, 102, 230, 1)) 4 4;
                        border-bottom: none;
                    }
                    img {
                        display: inline-block;
                        margin-top: 24px;
                        width: 64px;
                        height: 84px;
                        margin-left: 38px;
                    }
                }
                p {
                    display: inline-block;
                    position: relative;
                    font-size: 56px;
                    color: #e7e9f0;
                    position: relative;
                    left: 40px;
                    font-style: normal;
                    width: 200px;
                    span {
                        font-weight: normal;
                        font-size: 32px;
                        color: #e7e9f0;
                        line-height: 42px;
                        text-align: center;
                        font-style: normal;
                    }
                    .tips-error {
                        display: block;
                        position: absolute;
                        font-weight: normal;
                        font-size: 20px;
                        color: #f30c0c;
                        width: 300px;
                        left: -90px;
                        top: 80px;
                    }
                }
                .height-adjust-bottom {
                    div {
                        width: 112px;
                        height: 209px;
                        border: 4px solid;
                        border-top: none;
                        border-image: linear-gradient(90deg, rgba(62, 159, 244, 0), rgba(29, 102, 230, 1)) 4 4;
                    }
                    img {
                        margin-left: 38px;
                        width: 64px;
                        height: 84px;
                        margin-bottom: 24px;
                    }
                }
            }
        }
        .height-fail {
            text-align: center;
            img {
                margin-top: 100px;
                width: 480px;
                height: 480px;
            }
            p {
                font-weight: normal;
                font-size: 48px;
                color: #ffffff;
                line-height: 48px;
            }
            .height-fail-title {
                font-weight: normal;
                font-size: 64px;
                color: #ffffff;
                line-height: 64px;
            }
            span {
                font-size: 40px;
                color: #cccccc;
                line-height: 54px;
            }
        }
        .age-box {
            width: 960px;
            margin: 0px auto;
            text-align: left;
            .age-title {
                padding-left: 30px;
                font-family: AppleSystemUIFont;
                font-size: 48px;
                color: #2eb12f;
                line-height: 64px;
                text-align: left;
                font-style: normal;
                font-style: normal;
                word-break: break-all;
                padding-left: 60px;
            }
            .dui {
                width: 56px;
                height: 56px;
                float: left;
                margin-right: 12px;
                margin-top: 5px;
            }
            .age-box-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                .age-item {
                    width: 300px;
                    height: 88px;
                    background: #2e3338;
                    border-radius: 16px;
                    border: 1px solid #75a6fc;
                    text-align: center;
                    line-height: 88px;
                    .male {
                        width: 30px;
                        position: relative;
                        top: 3px;
                    }
                    .female {
                        width: 25px;
                        height: 38px;
                        position: relative;
                        top: 3px;
                    }
                }
                .active {
                    background: #1d66e6;
                    border-radius: 16px;
                }
            }
            .age-box-item2 {
                background: #565656;
                border-radius: 32px;
                height: 282px;
                position: relative;
                .box-item-title {
                    height: 195px;
                    position: relative;
                }
                .age-input {
                    position: absolute;
                    width: 140px;
                    height: 90px;
                    top: 100px;
                    left: 380px;
                    background: transparent;
                    color: #ffffff;
                    line-height: 90px;
                    border: none;
                    outline: none;
                    background: none;
                    font-size: 70px;
                }
                .age-age {
                    position: absolute;
                    top: 130px;
                    left: 550px;
                    font-size: 40px;
                }
                .add {
                    position: absolute;
                    top: 90px;
                    left: 680px;
                    width: 104px;
                }
                .sub {
                    position: absolute;
                    top: 90px;
                    left: 200px;
                    width: 104px;
                }
                .age-tips {
                    font-family: HarmonyOS_Sans_SC;
                    font-size: 32px;
                    color: #cccccc;
                    line-height: 38px;
                    text-align: left;
                    font-style: normal;
                    position: absolute;
                    top: 130px;
                    left: 120px;
                }
                .error {
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 400;
                    font-size: 28px;
                    color: #ffc94d;
                    text-align: center;
                    height: 89px;
                    line-height: 89px;

                    .cuo {
                        width: 32px;
                        height: 32px;
                        margin-right: 10px;
                        position: relative;
                        top: 5px;
                    }
                }
            }
            .age-tips {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 34px;
                color: #cccccc;
                line-height: 48px;
                text-align: left;
                font-style: normal;
                margin-left: 35px;
            }
            .error {
                color: red;
                font-family: AppleSystemUIFont;
                .cuo {
                    width: 42px;
                    height: 42px;
                    margin-right: 20px;
                    position: relative;
                    top: 10px;
                }
            }
        }
        .pro5-adjust-box {
            margin-top: -74px;
        }
    }
}
.height-container1 {
    background-image: url('../../assets/img/height/mode-back.png');
    background-size: 100% auto;
}
.add2,
.sub2 {
    width: 40px;
    position: relative;
    top: 10px;
}
.qu-pi-style-btn {
    margin-top: 80px;
    overflow: hidden;
    ul,
    li {
        all: unset;
        list-style: none; //去掉标签默认的左边符号
    }
    ul {
        width: 956px;
        margin: 0 62px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        color: #ffffff;
        line-height: 53px;
        li {
            display: inline-block;
            width: 152px;
            height: 128px;
            background: #043b73;
            border-radius: 32px;
            // border: 1px solid #cccccc;
            text-align: center;
            line-height: 128px;
            font-size: 40px;
            margin-bottom: 8px;
            img {
                width: 36px;
                height: 30px;
                margin-top: 40px;
            }
        }
        .active {
            background: #1d66e6;
            color: #ffffff;
        }
        .classx {
            width: 318px;
        }
    }
    .key-select {
        margin-top: 142px;
    }

    .qu-pi-sure,
    .qu-pi-back {
        font-size: 40px;
        line-height: 80px;
        height: 80px;
        border: 1px solid #cccccc;
        margin: 80px auto;
        width: 400px;
        text-align: center;
        border-radius: 50px;
    }
}
</style>
<style lang="less">
.tips-main.blue h3 {
    text-align: left !important;
}
</style>
