<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-06-30 16:05:06
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-07 16:32:54
-->
<template>
    <!-- 历史记录 -->
    <div class="history-list" ref="sectionBox" @touchstart="touchstart" @touchmove="touchmove">
        <div>
            <div class="header-menu">
                <span>
                    <img src="@/assets/images/new-report/sidebar/arrow-left.png" alt class="menu-info"
                        @click.prevent="goBack()" />
                </span>
                <div>
                    <img v-if="!status" src="@/assets/images/new-report/sidebar/edit-box-line@2x.png" alt
                        class="menu-info" @click.prevent="tipsSubmit(1)" />
                    <img v-else src="@/assets/images/new-report/report/checkbox-circle-line@2x.png" alt
                        class="menu-info" @click.prevent="tipsSubmit(2)" />
                </div>
            </div>
            <van-list v-model="loading" :finished="finished" finished-text @load="onLoad" :offset="10">
                <div v-if="isRead">
                    <van-cell v-for="(item, index) in list" :key="index">
                        <div class="scantime">{{ item.year }}</div>
                        <div v-for=" (secondItem, indef) in item.data" :key="indef">
                            <div class="centre-menu-item" v-if="isShow(secondItem)">
                                <div class="centre-menu">
                                    <div @click="goToReport(index, indef)">
                                        <img src="@/assets/images/new-report/Fill 14.png" alt class="fill-left" />
                                        <div class="content">
                                            <span class="time">{{ secondItem.createTime | getDealWith }}</span>
                                            <br />
                                            <span class="title">{{ showReportItem(secondItem) }}</span>
                                        </div>
                                    </div>
                                    <img v-if="!status" src="@/assets/images/new-report/sidebar/arrow-right.png" alt
                                        class="arrow-right" />
                                    <img v-else @click="deleteSubmit()"
                                        src="@/assets/images/new-report/report/delete-bin-2-line@2x.png" alt
                                        class="arrow-right1" />
                                </div>
                                <!-- ai 入口 -->
                                <div class="centre-ai"
                                    v-if="secondItem.abnormalConclusionInterpret !== null || secondItem.abnormalOutlineInterpret !== null">
                                    <div class="centre-ai-item" v-if="secondItem.abnormalConclusionInterpret !== null"
                                        @click="goAi(secondItem)">
                                        <img src="@/assets/images/ai1.png" alt />
                                        <span>AI报告解读</span>
                                    </div>
                                    <div v-if="secondItem.abnormalOutlineInterpret !== null" @click="goAi(secondItem, 1)">
                                        <img src="@/assets/images/ai2.png" alt />
                                        <span>训练大纲</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-cell>
                </div>
            </van-list>
        </div>
        <div class="spring-frame" v-if="springStatus" style="background: #000000; opacity: 0.54"></div>
        <div class="spring-frame" v-if="springStatus">
            <div class="spring-frame-box">
                <h6>{{ $t('reportTips.title') }}</h6>
                <button @click="springStatus = !springStatus">{{ $t('reportTips.btnMsg') }}</button>
            </div>
        </div>
        <!-- <ai-loading v-if="aiLoading" :aiData="aiData" @goBack="aiLoading = false" @goAi="goAiUrl"></ai-loading> -->
    </div>
</template>
<script>
import { findUserMeasureHistory } from '@/assets/js/apolloGql.js'
import moment from 'moment'
import { isVAPro3, isVAPro5, isVRPro5, isVAPro6 } from '@/types/device.js'
// // aiLoading
// import AiLoading from '../../components/ai/aiLoading.vue'
export default {
    filters: {
        getDealWith(value) {
            return moment(value * 1000).format('MM/DD HH:mm:ss')
        },
    },
    // components: {
    //     AiLoading
    // },
    data() {
        return {
            dataArray: [],
            loading: false,
            finished: false,
            list: [{ year: '', data: [] }],
            page: 2,
            status: false,
            springStatus: false,
            isRead: false,
            aiLoading: false,
            aiData: {}
        }
    },
    computed: {},
    created() {
        window.addEventListener('pageshow', function(event) {
            // 检测页面是否从缓存中加载
            if (event.persisted) {
                window.location.reload()
            }
        })
    },
    mounted() {
        this.findUserMeasureHistory()
    },
    methods: {
        goAi(secondItem, statue) {
            let goUrl = secondItem.aiUrl
            if (statue) {
                goUrl = `${goUrl}&toPage=train#/pages/aiReport/train`
            }
            window.location.href = goUrl
            // this.aiData = {
            //     url: secondItem.aiUrl,
            //     abnormalConclusionInterpret: secondItem.abnormalConclusionInterpret,
            //     abnormalOutlineInterpret: secondItem.abnormalOutlineInterpret,
            //     scanId: secondItem.scanId,
            //     statue
            // }
            // this.aiLoading = true
        },
        // goAiUrl(url) {
        //     window.location.href = url
        // },
        tipsSubmit(type) {
            if (type === 1) {
                this.status = true
            } else {
                this.status = false
            }
        },
        deleteSubmit() {
            this.springStatus = !this.springStatus
        },
        isShow(secondItem) {
            if (isVAPro3() || isVAPro5()) {
                return (
                    (secondItem.staticEval === 1 && secondItem.evalStatus === 1) ||
                    secondItem.bsShoulderStatus === 1 ||
                    (secondItem.girthMeasure === 1 && secondItem.bdaStatus === 1) ||
                    (secondItem.biaMeasure === 1 && secondItem.biaStatus === 1)
                )
            }
            return (
                (secondItem.biaMeasure === 1 && secondItem.biaStatus === 1) ||
                (secondItem.staticEval === 1 && (secondItem.bdaStatus === 1 || secondItem.evalStatus === 1)) ||
                secondItem.bsShoulderStatus === 1
            )
        },
       onLoad() {
            this.loading = true
            this.finished = false
            let setTimer = setTimeout(() => {
                let length = 0
                this.list = []
                this.isRead = false
                for (let i = 0; i < this.dataArray.length; i++) {
                    this.list.push({ year: '', data: [] })
                    try {
                        this.list[i].year = this.dataArray[i].year
                        for (let index = 0; index < this.dataArray[i].data.length; index++) {
                            if (length < 10 * this.page) {
                                ++this.page
                                this.list[i].data.push(this.dataArray[i].data[index])
                            } else {
                                break
                            }
                        }
                        this.isRead = true
                        if (length > 9 * this.page) {
                            break
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                this.loading = false
                this.finished = true
                window.clearTimeout(setTimer)
            }, 1000)
        },
        goToReport(index, indef) {
            let modelInfo = {
                    bdaStatus: this.dataArray[index].data[indef].bdaStatus,
                    biaMeasure: this.dataArray[index].data[indef].biaMeasure,
                    biaStatus: this.dataArray[index].data[indef].biaStatus,
                    bsShoulderScanResult: this.dataArray[index].data[indef].bsShoulderStatus,
                    createTime: this.dataArray[index].data[indef].createTime,
                    evalStatus: this.dataArray[index].data[indef].evalStatus,
                    girthMeasure: this.dataArray[index].data[indef].girthMeasure,
                    memberId: JSON.parse(window.localStorage.getItem('modelInfo')).memberId,
                    nutrition: this.dataArray[index].data[indef].nutrition,
                    questionReport: this.dataArray[index].data[indef].questionReport,
                    scanId: this.dataArray[index].data[indef].scanId,
                    scanMode: this.dataArray[index].data[indef].scanMode,
                    shoulderEval: this.dataArray[index].data[indef].shoulderJointEval,
                    staticEval: this.dataArray[index].data[indef].staticEval,
                    spineReport: this.dataArray[index].data[indef].spineReport,
                    teenagerReport: this.dataArray[index].data[indef].teenagerReport,
                    bsSpineStatus: this.dataArray[index].data[indef].bsSpineStatus,
                    mpRecommend: this.dataArray[index].data[indef].mpRecommend,
                    isNewMathTt: this.dataArray[index].data[indef].isNewMathTt,
                    isPillowRecommendReport: this.dataArray[index].data[indef].isPillowRecommendReport,
                }
                window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
            // 目前只有isVRPro5点击后，进入旧报告
            if (isVRPro5() || isVAPro6()) {
                console.log(this.dataArray[index].data[indef])
                // 历史报告列表进入，负载数据
                this.$router.push({
                    path: '/report'
                })
            } else {
                console.log(this.dataArray[index].data[indef], '>>>>>>>>>>>>>>>>历史数据点击')
                this.$store.commit('setHistoryData', this.dataArray[index].data[indef])
                this.$store.commit('setIsNewMathTt', this.dataArray[index].data[indef].isNewMathTt)
                // this.updateModelInfo(this.dataArray[index].data[indef],JSON.parse(window.localStorage.getItem('modelInfo')).memberId)
                setTimeout(() => {
                    this.$router.push({
                        path: '/new-report',
                        query: { type: 1 }
                    }, 500)
                })
            }
        },
        goBack() {
            this.$router.go(-1)
        },
        findUserMeasureHistory() {
            this.$apollo
                .query({
                    query: findUserMeasureHistory,
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.findUserMeasureHistory
                    if (data) {
                        this.dataArray = data.data
                        let length = 0
                        try {
                            for (let i = 0; i < this.dataArray.length; i++) {
                                this.list.push({ year: '', data: [] })
                                this.list[i].year = this.dataArray[i].year
                                for (let index = 0; index < this.dataArray[i].data.length; index++) {
                                    if (length < 10) {
                                        ++length
                                        this.list[i].data.push(this.dataArray[i].data[index])
                                    } else {
                                        break
                                    }
                                }
                                this.isRead = true
                                if (length > 9) {
                                    break
                                }
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                })
        },
        touchstart() {
            this.lastY = event.changedTouches[0].clientY // 点击屏幕时记录最后一次Y坐标
        },
        touchmove() {
            let y = event.changedTouches[0].clientY
            let st = this.$refs.sectionBox.scrollTop // 滚动条高度
            if (y >= this.lastY && st <= 0) {
                // 若滚动到顶部且为下拉情况
                this.lastY = y
                event.preventDefault()
            }
            try {
                let clientHeight = document.querySelector('.section').clientHeight
                let scrollHeight = document.querySelector('.section').scrollHeight
                if (st + clientHeight === scrollHeight && y < this.lastY) {
                    // 若滚动到底部且为上拉情况
                    this.lastY = y
                    event.preventDefault()
                }
                this.lastY = y
            } catch (e) {
                console.log(e)
            }
        },
        showReportItem(secondItem) {
            const items = []
            if (secondItem.spineReport === 1 &&
                secondItem.isPillowRecommendReport === 1 &&
                secondItem.staticEval === 1 &&
                secondItem.girthMeasure === 1) {
                items.push('智眠报告')
            }
            if (
                secondItem.questionReport === 1 &&
                secondItem.scanMode === 1 &&
                secondItem.bdaStatus &&
                (secondItem.nutrition === 0 || secondItem.nutrition === 1)
            ) {
                items.push('无电流营养分析')
            }
            if (secondItem.biaMeasure === 1 && secondItem.biaStatus === 1 && !isVAPro5()) {
                items.push(this.$t('report.tabPane.labelList[2]'))
            }
            if (secondItem.staticEval === 1 && secondItem.evalStatus === 1) {
                items.push(this.$t('report.tabPane.labelList[3]'))
            }

            if (secondItem.bdaStatus === 1 && secondItem.girthMeasure === 1) {
                items.push(this.$t('girth.title'))
            }
            if (secondItem.biaMeasure === 1 && secondItem.biaStatus === 1 && isVAPro5()) {
                items.push(this.$t('report.tabPane.labelList[2]'))
            }
            if (secondItem.shoulder === 1) {
                items.push(this.$t('report.tabPane.labelList[4]'))
            }
            if (secondItem.spineReport === 1 && secondItem.bsSpineStatus === 1) {
                items.push('脊柱评估')
            }

            return items.join('、')
        },
    },
}
</script>
<style lang="less" scoped>
.history-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background: url(../../assets/images/new-report/report/history_bj.png);
    background-size: 100% 100%;
    position: relative;
    top: 0;

    /deep/.van-cell {
        padding: 0 !important;
        background: none;

        &:after {
            border-bottom: none;
        }
    }

    .van-cell__value {
        white-space: normal;
    }

    .header-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 15px;
        width: 100%;
        top: 0;
        z-index: 100;

        >span {
            img {
                display: block;
            }
        }

        .menu-info {
            width: 24px;
            height: 24px;
        }

        >div {
            img {
                position: relative;
                top: 2px;
                display: inline-block;
            }

            //     font-family: PingFangSC-Regular, PingFang SC;
            //     font-weight: 400;
            //     font-size: 25px;
            //     color: #222222;
            //     background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
            //     -webkit-background-clip: text;
            //     -webkit-text-fill-color: transparent;
            //     span{
            //         line-height: 25px;
            //         font-size: 15px;
            // }
        }
    }

    .scantime {
        font-size: 15px;
        color: #8aa3be;
        text-align: left;
        margin-left: 20px;
    }

    .centre-menu-item {
        border-radius: 4px;
        background: #303c5c;
        width: 355px;
        min-height: 76px;
        margin: 0 11px;
    }

    .centre-menu {
        position: relative;
        margin: 10px 0 0;
        min-height: 73px;

        .content {
            position: absolute;
            top: 16px;
            left: 64px;
            width: 250px;
            text-align: left;
            color: #8aa3be;

            .time {
                font-size: 14px;
            }

            .title {
                position: absolute;
                top: 22px;
                font-size: 12px;
                line-height: 14px;
            }
        }
    }

    .centre-ai {
        margin: 0;
        display: flex;
        padding: 0 0 10px 17px;

        div {
            padding: 8px 12px;
            display: flex;
            align-items: center;
            align-content: center;
            font-weight: 400;
            font-size: 12px;
            color: #ffffff;
            background: #2e4ea1;
            border-radius: 2px;

            img {
                margin: 6px;
                height: 15px;
            }
        }

        .centre-ai-item {
            margin-right: 16px;
        }
    }

    .fill-left {
        position: absolute;
        width: 32px;
        height: 32px;
        top: 22px;
        left: 18px;
    }

    .arrow-right {
        position: absolute;
        top: 31px;
        right: 20px;
        width: 8px;
        height: 14px;
    }

    .arrow-right1 {
        position: absolute;
        top: 20px;
        right: 12px;
        width: 24px;
        height: 24px;
    }

    .spring-frame {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        text-align: center;

        .spring-frame-box {
            width: 302px;
            // min-height: 160px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 6px;
            backdrop-filter: blur(10px);
            margin: 222px auto;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            h6 {
                width: 238px;
                margin: 32px;
                // height: 20px;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #111111;
                line-height: 20px;
            }

            button {
                text-align: center;
                width: 238px;
                height: 36px;
                background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                border-radius: 4px;
                margin-bottom: 40px;
                padding: 0 0.01px;  /* 防止文本裁剪异常 */
            }
        }
    }
}
</style>
