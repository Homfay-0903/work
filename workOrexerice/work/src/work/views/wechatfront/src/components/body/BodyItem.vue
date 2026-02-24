<template>
    <!--身体成分上半部分-->
    <div class="body-segment" :class="{'no-container-background': !isSupportWebgl.webgl}">
        <div class="person-img" v-if="isSupportWebgl.webgl">
            <segment-model :type="selected"></segment-model>
        </div>

        <!-- 判断浏览器支持 -->
        <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" class="person-img"></version-tip>

        <div class="right-info">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">节段脂肪</mt-tab-item>
                <mt-tab-item id="2">节段肌肉</mt-tab-item>
            </mt-navbar>
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <p>
                        <span>右上肢</span>
                        <span
                            :class="{'segment-lower': segment.fat.BFMRA.status === 1,
                         'segment-upper': segment.fat.BFMRA.status === 3}"
                        >{{ toDecimal2(segment.fat.BFMRA.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>左上肢</span>
                        <span
                            :class="{'segment-lower': segment.fat.BFMLA.status === 1,
                         'segment-upper': segment.fat.BFMLA.status === 3}"
                        >{{ toDecimal2(segment.fat.BFMLA.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>躯干</span>
                        <span
                            :class="{'segment-lower': segment.fat.BFMTR.status === 1,
                         'segment-upper': segment.fat.BFMTR.status === 3}"
                        >{{ toDecimal2(segment.fat.BFMTR.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>右下肢</span>
                        <span
                            :class="{'segment-lower': segment.fat.BFMRL.status === 1,
                         'segment-upper': segment.fat.BFMRL.status === 3}"
                        >{{ toDecimal2(segment.fat.BFMRL.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>左下肢</span>
                        <span
                            :class="{'segment-lower': segment.fat.BFMLL.status === 1,
                         'segment-upper': segment.fat.BFMLL.status === 3}"
                        >{{ toDecimal2(segment.fat.BFMLL.v, 1) }}&nbsp;kg</span>
                    </p>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <p>
                        <span>右上肢</span>
                        <span
                            :class="{'segment-lower': segment.muscle.LMRA.status === 1,
                         'segment-upper': segment.muscle.LMRA.status === 3}"
                        >{{ toDecimal2(segment.muscle.LMRA.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>左上肢</span>
                        <span
                            :class="{'segment-lower': segment.muscle.LMLA.status === 1,
                         'segment-upper': segment.muscle.LMLA.status === 3}"
                        >{{ toDecimal2(segment.muscle.LMLA.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>躯干</span>
                        <span
                            :class="{'segment-lower': segment.muscle.LMTR.status === 1,
                         'segment-upper': segment.muscle.LMTR.status === 3}"
                        >{{ toDecimal2(segment.muscle.LMTR.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>右下肢</span>
                        <span
                            :class="{'segment-lower': segment.muscle.LMRL.status === 1,
                         'segment-upper': segment.muscle.LMRL.status === 3}"
                        >{{ toDecimal2(segment.muscle.LMRL.v, 1) }}&nbsp;kg</span>
                    </p>
                    <p>
                        <span>左下肢</span>
                        <span
                            :class="{'segment-lower': segment.muscle.LMLL.status === 1,
                         'segment-upper': segment.muscle.LMLL.status === 3}"
                        >{{ toDecimal2(segment.muscle.LMLL.v, 1) }}&nbsp;kg</span>
                    </p>
                </mt-tab-container-item>
            </mt-tab-container>
            <ul class="standrad-select clearfix">
                <li>
                    <span>低标准</span>
                </li>
                <li>
                    <span>标准</span>
                </li>
                <li>
                    <span>超标准</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { bmSegInfo } from '@/assets/js/apolloGql.js'
import isSupportWebgl from '@/assets/js/webgl.js'

import SegmentModel from '@/components/model/Segment'
import VersionTip from '@/components/model/VersionTip.vue'

export default {
    components: {
        SegmentModel,
        VersionTip
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            isSupportWebgl,
            selected: '1',
            segment: {
                fat: {
                    BFMRA: {},
                    BFMLA: {},
                    BFMTR: {},
                    BFMRL: {},
                    BFMLL: {}
                },
                muscle: {
                    LMRA: {},
                    LMLA: {},
                    LMTR: {},
                    LMRL: {},
                    LMLL: {}
                }
            }
        }
    },
    mounted() {
        this.bmSegInfo()
    },
    methods: {
        // 身体成分节段信息
        bmSegInfo() {
            this.$apollo
                .query({
                    query: bmSegInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    const data = res.data.bmSegInfo
                    if (data && data.code === 200) {
                        // 节段脂肪
                        this.segment.fat = data.data.bmSegBFM
                        // 节段肌肉
                        this.segment.muscle = data.data.bmSegLM
                        // 状态: 1 低，２正常，３高
                    }
                })
        },
        toDecimal2(val, num) {
            let value = Math.round(val * 100) / 100
            let values = value.toString()
            let newVal = values.indexOf('.')
            if (newVal < 0) {
                newVal = values.length
                values += '.'
            }
            while (values.length <= newVal + num) {
                values += '0'
            }
            values = values === 'NaN.0' ? '--' : values
            return values
        }
    }
}
</script>

<style lang="less" scoped>
.body-segment {
    display: flex;
    padding-top: 35px;
    background-image: url(../../assets/images/report_ground_bg.png);
    background-size: 100% 62px;
    background-repeat: no-repeat;
    background-position: left bottom;
    height: 320px;
    .person-img {
        width: 56%;
        margin-bottom: 2px;
        margin-top: 10px;
        background-image: url(../../assets/images/report_moxing_bg.png);
        background-size: 135px 65px;
        background-repeat: no-repeat;
        background-position: 35px bottom;
    }
    .right-info {
        width: 44%;
        margin-top: 42px;
        .standrad-select {
            margin-top: 32px;
            li {
                position: relative;
                color: #fff;
                font-size: 10px;
                float: left;
                list-style: none;
                &:nth-child(2) {
                    span {
                        &:after {
                            background-color: #fff;
                        }
                    }
                }
                &:last-child {
                    margin-right: 0;
                    span {
                        &:after {
                            background-color: #ff0a00;
                        }
                    }
                }
                span {
                    margin-right: 8px;
                    padding-left: 12px;
                    position: relative;
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
