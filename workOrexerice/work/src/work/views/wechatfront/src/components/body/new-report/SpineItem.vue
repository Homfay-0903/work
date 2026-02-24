<template>
    <!--脊柱上半部分-->
    <div class="body-segment" :class="{'no-container-background': !isSupportWebgl.webgl}">
        <!-- v-if="isSupportWebgl.webgl" -->
        <div class="person-img">
            <spine-model :massInfo="massInfo"
            @changeSpine="changeSpine"
            >
            </spine-model>
        </div>

        <!-- 判断浏览器支持 -->
        <!-- <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" class="person-img"></version-tip> -->

        <!-- <div class="right-info">
            <ul class="standrad-select clearfix">
                <li v-for="(item, index) in markData" :key="index">
                    <span>{{item.label}}</span>
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
import isSupportWebgl from '@/assets/js/webgl.js'

import SpineModel from '@/components/model/new-report/spine'
// import VersionTip from '@/components/model/VersionTip.vue'

export default {
    components: {
        SpineModel,
        // VersionTip
    },
    props: {
        massInfo: Object
    },
    data() {
        return {
            // modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            isSupportWebgl,
            // 是否是正面和背面
            isPositive: 1,
            // 标注信息
            markDatas: [
                {
                    label: '颈椎7',
                    value: 0
                }, {
                    label: '骶骨中点',
                    value: 1
                }, {
                    label: '骶骨后上角',
                    value: 2
                }, {
                    label: '人体重心',
                    value: 0
                },
            ],
        }
    },
    computed: {
        // markData() {
        //     let newData = this.markDatas.filter(item => item.value === 0 || item.value === this.isPositive)
        //     return newData
        // }
    },
    methods: {
        changeSpine(type) {
            // 1 正 2 右侧 3 背 4 左侧
            this.$emit('changeStatus', type)
        }
    }
}
</script>

<style lang="less" scoped>
.body-segment {
    display: flex;
    padding-top: 35px;
    // background-image: url(../../../assets/images/report_ground_bg.png);
    background-size: 100% 62px;
    background-repeat: no-repeat;
    background-position: left bottom;
    height: 320px;
    position: relative;
    .person-img {
        width: 100%;
        margin-bottom: 2px;
        // margin-top: 10px;
        // background-image: url(../../../assets/images/report_moxing_bg.png);
        background-size: 135px 65px;
        background-repeat: no-repeat;
        // background-position: 35px bottom;
        background-position: center bottom
    }
    .right-info {
        width: 44%;
        margin-top: 42px;
        position: relative;
        .standrad-select {
            width: 80%;
            position: absolute;
            bottom: 17px;
            height: 96px;
            background: #1C1F38;
            border-radius: 4px;
            padding: 8px 17px;
            text-align: left;
            line-height: 20px;
            li {
                position: relative;
                color: #fff;
                font-size: 10px;
                list-style: none;
                &:first-child {
                    margin-right: 0;
                    span {
                        &:after {
                            background-color: #FF2438;
                        }
                    }
                }
                &:nth-child(2) {
                    span {
                        &:after {
                            background-color: #006EFF;
                        }
                    }
                }
                &:nth-child(3) {
                    span {
                        &:after {
                            background-color: #6DD400;
                        }
                    }
                }
                &:last-child {
                    margin-right: 0;
                    span {
                        &:after {
                            background-color: #000000;
                        }
                    }
                }
                span {
                    margin-right: 8px;
                    padding-left: 18px;
                    position: relative;
                    letter-spacing: 3px;
                    &:after {
                        position: absolute;
                        left: 0;
                        top: 1.5px;
                        content: '';
                        display: block;
                        min-width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background-color: #26a2ff;
                        border: 2px solid #b0aeb4;
                    }
                }
            }
        }
    }
}
</style>
