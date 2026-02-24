<template>
    <!--肩部评估 - PC端专用-->
    <div class="neck-assess-data body-thermal-wrapper">
        <!--颈部评估合成失败-->
        <div class="no-thermal-data result-failed-tip" v-if="isShow">
            <div>
                <p>肩部评估结果合成失败~</p>
                <p>小编猜测可能是网络原因导致的</p>
            </div>
        </div>
        <!--颈部评估未测量-->
        <div class="no-thermal-data" v-if="bsShoulderNoMeasure">
            <div>
                <p>肩部评估未测量，所以暂无测量结果~</p>
                <p>让努力的汗水看得见！</p>
                <p>下次记得体成分测量和体态测量一起做哟！</p>
            </div>
        </div>
        <!--颈部评估详细数据-->
        <div v-if="!isShow && !bsShoulderNoMeasure" class="detail-content">
            <!-- 加载动画 -->
            <div class="loading" v-if="loading">
                <mt-spinner type="fading-circle" class="loading-dot"></mt-spinner>
            </div>
            <div class="neck-assessment-list" v-else>
                <div class="data-list">
                    <div class="thermal-item">
                        <span class="name">{{ titleItem.name }}</span>
                        <span class="val">{{titleItem.val}}</span>
                        <span class="status">{{ titleItem.status }}</span>
                        <span class="diff">{{titleItem.diff}}</span>
                    </div>
                    <!-- 外展上举-左手 -->
                    <neck-data-item v-if="shoulderInfo.leftAbuction" :item="shoulderInfo.leftAbuction"></neck-data-item>
                    <!-- 外展上举-右手 -->
                    <neck-data-item v-if="shoulderInfo.rightAbuction" :item="shoulderInfo.rightAbuction"></neck-data-item>
                    <!-- 前屈上举-左手 -->
                    <neck-data-item v-if="shoulderInfo.leftAntexion" :item="shoulderInfo.leftAntexion"></neck-data-item>
                    <!-- 前屈上举-右手 -->
                    <neck-data-item v-if="shoulderInfo.rightAntexion" :item="shoulderInfo.rightAntexion"></neck-data-item>
                </div>
                <div class="data-problem" v-if="notTang()">
                    <p class="name">结论</p>
                    <template v-for="(item, idx) in conclusion">
                        <p class="title" :key="`${idx}-title`">{{ item.title }}</p>
                        <div class="msg" v-if="item.msg" :key="`${idx}-msg`">
                            <div>
                                <p class="head">分析：</p>
                            </div>
                            <p class="content">{{ item.msg }}</p>
                        </div>
                        <p class="advice" v-if="item.msg" :key="`${idx}-advice`">建议：具体原因请找专业人士做进一步筛查。</p>
                    </template>
                </div>
            </div>
        </div>
        <!--体态评估-弹出说明-->
        <mt-popup v-model="popupAssess" class="body-composition-popup" popup-transition="popup-fade">
            <!-- 防止在pupop里滚动，body也跟着滚 -->
            <div class="popup-container" @touchmove.prevent>
                <h5>{{ form.name }}说明</h5>
                <div class="first-intro content">
                    <p>{{ form.desc }}</p>
                </div>
                <!-- <div class="second-intro content">
                    <h5>对比：{{ form.result }}cm</h5>
                    <p>{{ form.advice }}</p>
                </div>-->
                <div class="pop-btn-action" @click="popupAssess = false">我知道了</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import { findBsShoulderConclusion } from '@/assets/js/apolloGql.js'
import { toDecimal2 } from '@/assets/js/util.js'
import NeckDataItem from '@/components/common/NeckDataItem'

export default {
    components: {
        NeckDataItem
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            reportMode: window.localStorage.getItem('reportMode'),
            popupAssess: false,
            body: {},
            form: {
                name: '',
                desc: '',
                advice: '',
                result: 0
            },
            shoulderInfo: {},
            conclusion: [],
            isShow: false,
            bsShoulderNoMeasure: false,
            loading: false,
            titleItem: {
                name: '项目',
                val: '测量值 [标准范围]',
                status: '结论',
                diff: '与上次对比'
            },
            testItem: {
                name: '颈椎前屈',
                val: '30.0 [45.0~50.0]',
                status: '正常',
                diff: '+0'
            }
        }
    },
    computed: {},
    mounted() {
        if (this.modelInfo.shoulderEval === 0) {
            this.bsShoulderNoMeasure = true
        } else if (this.modelInfo.bsShoulderScanResult === 1) {
            this.findBsShoulderConclusion()
        } else if (!this.modelInfo.bsShoulderScanResult || this.modelInfo.bsShoulderScanResult === 0) {
            this.isShow = true
        }
        this.$hmt.trackPageview('/tab/shoulder')
    },
    methods: {
        notTang() {
            if (this.reportMode ? this.reportMode.indexOf('013') > -1 : false) {
                return false
            }
            return true
        },
        toDecimal(num, digit) {
            return toDecimal2(num, digit)
        },
        // 获取肩部评估结论
        findBsShoulderConclusion() {
            this.$apollo
                .query({
                    query: findBsShoulderConclusion,
                    variables: {
                        scanId: this.modelInfo.scanId,
                        scanTime: this.modelInfo.createTime
                    }
                })
                .then(res => {
                    const data = res.data.findBsShoulderConclusion
                    this.loading = false
                    if (data && data.code === 200) {
                        this.shoulderInfo = data.data.shoulderInfo
                        this.conclusion = data.data.conclusion
                    } else {
                        this.isShow = true
                    }
                })
        }
    }
}
</script>
<style lang="less" scoped>
/* PC端专用：移除 padding */
.neck-assess-data {
    padding: 0 !important;
}

.body-thermal-wrapper {
    padding: 0 !important;
}

.detail-content {
    display: flex;
    justify-content: center;

    .neck-assessment-list {
        width: 100%;
        .data-problem{
            p{
              font-family: Source Sans Pro,Noto Sans CJK SC!important;
            }
        }
}
}
</style>
