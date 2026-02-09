<!--
 * @Description: 按键指引
 * @Author: ouyaping
 * @Date: 2023-05-22 14:48:13
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2024-05-20 11:14:18
-->
<template>
    <div class="guidance">
        <!-- 上-指引图 -->
        <div :class="['btn-guidance', $i18n.locale]">
            <!-- model1 -->
            <div class="model1" v-if="modelIndex === 0">
                <img src="@/assets/img/setting/btn_model_1.png" alt="" />
                <div class="btn-text">
                    <p class="text1">{{ $t('setting.btn-guidance.model1-text.switch') }}</p>
                    <p class="text2">{{ $t('setting.btn-guidance.model1-text.add') }}</p>
                    <p class="text3">{{ $t('setting.btn-guidance.model1-text.sub') }}</p>
                </div>
            </div>
            <!-- model2 -->
            <div class="model2" v-if="modelIndex === 1">
                <img class="bg-img" src="@/assets/img/setting/btn_model_2_new.png" alt="" />
                <div class="btn-text">
                    <p class="text1">
                        <i18n path="setting.btn-guidance.model2-text.btn-tip.add">
                            <img src="@/assets/img/home/add-circle-fill.svg" place="addImg" alt="" />
                            <i18n path="setting.btn-guidance.model2-text.btn-tip.sub" place="sub">
                                <img src="@/assets/img/home/indeterminate-circle-fill.svg" place="subImg" alt="" />
                            </i18n>
                        </i18n>
                    </p>
                    <p class="text2"><span class="line"></span> {{ $t('setting.btn-guidance.model2-text.add') }}</p>
                    <p class="text3"><span class="line"></span> {{ $t('setting.btn-guidance.model2-text.sub') }}</p>
                </div>
            </div>
            <!-- model3 -->
            <div class="model4" v-if="modelIndex === 2">
                <img src="@/assets/img/setting/btn_model_1.png" alt="" />
                <div class="btn-text">
                    <p class="text1">{{ $t('setting.btn-guidance.model3-text.switch') }}</p>
                    <p class="text22">
                        {{ $t('setting.btn-guidance.model3-text.add') }}
                    </p>
                    <p class="text33">
                        {{ $t('setting.btn-guidance.model3-text.sub') }}
                    </p>
                </div>
            </div>
        </div>
        <!-- 下-按钮 -->
        <div class="btn-list">
            <div
                v-for="(item, key) in btnList"
                :key="key"
                :class="[
                    { active: active === key },
                    deviceInfo.deviceType === 5 && active === key ? 'pro5-active' : '',
                    'btn-item'
                ]"
                @touchend="hubConfirm(item.id)"
            >
                {{ item.text }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            // 当前模块
            modelIndex: 0,
            // 按键index
            active: 0,
            // 按钮list
            btns: [
                {
                    id: 0,
                    text: this.$t('setting.btn-guidance.xia-yi-bu')
                },
                {
                    id: 1,
                    text: this.$t('setting.btn-guidance.shang-yi-bu')
                },
                {
                    id: 3,
                    text: this.$t('setting.btn-guidance.tui-chu')
                }
            ],
            // modelList
            model2Style: {
                zh: {
                    width1: 10,
                    width2: 50
                }
            }
        }
    },
    computed: {
        ...mapGetters(['deviceInfo']),
        btnList() {
            if (this.modelIndex === 0) {
                return this.btns.filter((item, key) => [0, 2].includes(key))
            }
            if (this.modelIndex === 1) {
                return this.btns.filter((item, key) => [0, 1, 2].includes(key))
            }
            if (this.modelIndex === 2) {
                return this.btns.filter((item, key) => [1, 2].includes(key))
            }
            return this.btns
        }
    },
    created() {
        // 初始化按钮
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                // {
                //     btn: 'switch',
                //     msg: '电源'
                // },
                // {
                //     btn: 'add',
                //     msg: '加'
                // },
                // {
                //     btn: 'sub',
                //     msg: '减'
                // }
            ],
            openNotOperated: true
        })
        // 初始化active
        this.active = 0
        // 初始化modelIndex
        this.modelIndex = 0
    },
    methods: {
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                if (this.active === 0) {
                    this.active = this.btnList.length - 1
                } else {
                    this.active--
                }
                // 下
            } else if (btnType === 2) {
                if (this.active === this.btnList.length - 1) {
                    this.active = 0
                } else {
                    this.active++
                }
                // 确定
            } else if (btnType === 3) {
                if (this.modelIndex === 0) {
                    if (this.active === 0) {
                        this.modelIndex = 1
                    } else {
                        this.$changeViewPage('SettingIndex')
                    }
                } else if (this.modelIndex === 1) {
                    if (this.active === 0) {
                        this.modelIndex = 2
                    } else if (this.active === 1) {
                        this.modelIndex = 0
                        this.active = 0
                    } else {
                        this.$changeViewPage('SettingIndex')
                    }
                } else if (this.modelIndex === 2) {
                    if (this.active === 0) {
                        this.modelIndex = 1
                    } else {
                        this.$changeViewPage('SettingIndex')
                    }
                }
                // 返回
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$changeViewPage('Home')
        },
        hubConfirm(id) {
            if (id === 0) {
                this.modelIndex++
            } else if (id === 1) {
                this.modelIndex--
            } else if (id === 3) {
                this.$changeViewPage('SettingIndex')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.guidance {
    position: relative;

    .btn-guidance {
        position: absolute;
        top: 408px;
        width: 100%;
        z-index: 1;

        .model1,
        .model3,
        .model4 {
            position: relative;

            img {
                width: 100%;
            }

            .btn-text {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;

                p {
                    padding: 0;
                    margin: 0;
                    font-size: 24px;
                    color: #ffffff;
                    position: absolute;
                    left: 604px;
                    width: 415px;
                }

                .text1 {
                    top: 178px;
                }

                .text2 {
                    top: 292px;
                }

                .text3 {
                    top: 406px;
                }

                .text22 {
                    top: 244px;
                }

                .text33 {
                    top: 348px;
                }
            }
        }

        .model1,
        .model3 {
            .btn-text {
                p {
                    &::before {
                        position: absolute;
                        content: '';
                        width: 90px;
                        height: 1px;
                        opacity: 0.5;
                        left: -110px;
                        top: 15px;
                        border: 1px solid #ffffff;
                    }
                }
            }
        }

        .model3 {
            .btn-text {
                p {
                    left: 633px;

                    &::before {
                        left: -141px;
                    }

                    &::after {
                        position: absolute;
                        content: '';
                        width: 10px;
                        height: 10px;
                        background: #ffffff;
                        border-radius: 50px;
                        left: -32px;
                        top: 12px;
                    }
                }
            }
        }

        .model4 {
            .btn-text {
                p {
                    left: 633px;

                    &::after {
                        position: absolute;
                        content: '';
                        width: 10px;
                        height: 10px;
                        background: #ffffff;
                        border-radius: 50px;
                        left: -32px;
                        top: 12px;
                    }
                }

                .text1 {
                    &::before {
                        position: absolute;
                        content: '';
                        width: 90px;
                        height: 1px;
                        opacity: 0.5;
                        left: -141px;
                        top: 15px;
                        border: 1px solid #ffffff;
                    }
                }
            }
        }

        .model2 {
            position: relative;

            .bg-img {
                width: 100%;
            }

            .btn-text {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;

                p {
                    position: absolute;
                }

                .text1 {
                    top: 370px;
                    left: 350px;
                    display: flex;
                    align-items: center;

                    span {
                        font-size: 12px;
                    }

                    img {
                        width: 12px;
                    }
                }

                .text2,
                .text3 {
                    font-size: 24px;
                    color: #ffffff;
                }

                .text2 {
                    top: 600px;
                    left: 380px;

                    .line {
                        position: absolute;
                        top: -180px;
                        left: 48px;
                        height: 160px;
                        width: 1px;
                        opacity: 0.5;
                        border: 1px solid #ffffff;
                    }
                }

                .text3 {
                    top: 500px;
                    left: 520px;

                    .line {
                        position: absolute;
                        top: -80px;
                        left: 40px;
                        height: 60px;
                        width: 1px;
                        opacity: 0.5;
                        border: 1px solid #ffffff;
                    }
                }
            }
        }

        &.en {
            .model4 .btn-text {
                .text22 {
                    top: 264px;
                }

                .text33 {
                    top: 348px;
                }
            }
        }

        &.pt,
        &.tr,
        &.fr,
        &.it,
        &.de {
            .model4 .btn-text {
                .text22 {
                    top: 264px;
                }
                .text33 {
                    top: 378px;
                }
            }
        }
        &.de {
            .model4 {
                .text1 {
                    line-height: 1;
                }
            }
        }
        &.es {
            .model2 .btn-text .text2 {
                right: 50px;
                .line {
                    left: 25px;
                }
            }
            .model2 .btn-text .text3 {
                right: 50px;
                .line {
                    left: 65px;
                }
            }
            .model4 .btn-text {
                .text1 {
                    top: 140px;
                    &::after {
                        top: 48px;
                    }
                    &::before {
                        top: 50px;
                    }
                }

                .text22 {
                    top: 255px;
                    &::after {
                        top: 46px;
                    }
                }

                .text33 {
                    top: 368px;
                    &::after {
                        top: 46px;
                    }
                }
            }
        }
    }

    .btn-list {
        position: absolute;
        top: 1176px;
        width: 960px;
        left: 60px;
        z-index: 10;

        .btn-item {
            width: 956px;
            height: 192px;
            background: #565656;
            border-radius: 32px;
            font-size: 48px;
            color: #e7e9f0;
            line-height: 192px;
            text-align: center;
            margin-bottom: 24px;
            border: 2px solid #565656;

            &.active {
                background: #104ebb;
                border: 2px solid #649cff;
            }
        }
        .pro5-active {
            background: #1d66e6 !important;
            border: none !important;
        }
    }

    .hu {
        .model2 .btn-text .text1 {
            left: 430px;
        }
    }
}
</style>
