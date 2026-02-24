<template>
    <!--新版腰腹围-->
    <div>
        <div class="body-roundness" :class="{ 'no-container-background': !isSupportWebgl.webgl }">
            <div
                class="person-img"
                :class="{ 'person-img-width': modelInfo.bdaStatus !== 1 }"
                v-if="isSupportWebgl.webgl"
            >
                <img class="measure-top" src="@/assets/images/new-report/girth/fill@2x.png" />
                <img class="measure-bottom" src="@/assets/images/new-report/girth/fill2@2x.png" alt />
                <div class="model-container">
                    <measure-model-mld
                        v-if="dispalyModel"
                        class="measure-model"
                        ref="waistmodel"
                        :tcScanId="tcScanIdCopt"
                        @statusDispaly="OnIsDispaly"
                        :show-girth="true"
                        @modelLoadOver="modelLoadOver"
                    ></measure-model-mld>
                    <!-- 日期选择 -->
                    <div class="data-time">
                        <date-select
                            :scanId="scanId"
                            :type="3"
                            :isCreateTime="isCreateTime"
                            @girthContras="onwaistContrasInfo"
                        ></date-select>
                    </div>
                </div>
            </div>
            <!-- 判断浏览器支持 -->
            <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" :title="isSupportWebgl.title" msgStyle="msg-style">
            </version-tip>

            <template v-if="isSupportWebgl.webgl && dispalyModel">
                <div
                    v-for="(item, index) in roundness"
                    :key="index + 'rr'"
                    :class="{ 'hidden-roundness': modelInfo.bdaStatus !== 1 }"
                >
                    <div class="right-roundness-slide" v-if="item.girth.delta === slideIndex2">
                        <div class="roundness-data" v-if="isDispaly">
                            <p class="girth-value-top">
                                {{ toDecimal(item.lastWidth, 1) > 0 ? toDecimal(item.lastWidth, 1) : '-' }}
                            </p>
                            <p style="font-size: 3.467vw">cm</p>
                        </div>
                        <div class="model-right" v-if="isDispaly">
                            <p class="girth-value">
                                {{ toDecimal(item.width, 1) > 0 ? toDecimal(item.width, 1) : '-' }}
                            </p>
                            <p>cm</p>
                        </div>
                        <div :class="['roundness-data', isDispaly ? '' : 'model-style']" v-else>
                            <p class="girth-value">
                                {{ toDecimal(item.width, 1) > 0 ? toDecimal(item.width, 1) : '-' }}
                            </p>
                            <p>cm</p>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="isSupportWebgl.webgl">
                <div
                    :key="index + 'dd'"
                    :class="{ 'hidden-roundness': modelInfo.bdaStatus !== 1 }"
                    v-for="(item, index) in waistarr1"
                >
                    <div
                        :class="['right-roundness-slide-2', isDeviceReport ? 'isDeviceReport' :'', tcScanIdtu === null ? 'tcScanIdCopt1' : '']"
                        v-if="index === slideIndex"
                    >
                        <p @click="slideTop" class="arrow">
                            <img src="@/assets/images/jiantou2.png" class="top-arrow" />
                        </p>
                        <div class="roundness-data">
                            <p>{{ item.title }}</p>
                        </div>
                        <p @click="slideBottom" class="arrow">
                            <img src="@/assets/images/jiantou.png" class="lower-arrow" />
                        </p>
                    </div>
                </div>
            </template>
        </div>
        <div class="waist-data-item">
            <waist-data-item :name="'腰部'" :title="'腰部分数'" :arr="waistroundness" :unit="'分'"></waist-data-item>
            <waist-data-item :title="'腰围'" :arr="waistarr1" :unit="'cm'"></waist-data-item>
            <waist-data-item :title="'腰围间体积'" :arr="waistarr2" :unit="'cm³'"></waist-data-item>
            <waist-data-item :title="'腰臀比'" :arr="waistarr3"></waist-data-item>
            <waist-data-item :title="'轮廓分析'" :canvas="true" :arr="waistcanvas"></waist-data-item>
            <waist-data-item :name="'背部'" :arr="waistarr4" :unit="'L'"></waist-data-item>
            <waist-data-item :name="'臀部'" :arr="waistarr5" :unit="'cm'"></waist-data-item>
            <waist-assessment :obj="waistarr6"></waist-assessment>
        </div>
    </div>
</template>

<script>
import { bmwaistContrasInfo, findBmWaistScanTrueHistory } from '@/assets/js/apolloGql.js'
import isSupportWebgl from '@/assets/js/webgl.js'
import { _toDecimal } from '@/assets/js/util.js'
import MeasureModelMld from '@/components/model/new-report/MeasureNewMLD'
import VersionTip from '@/components/model/VersionTip.vue'
import DateSelect from '@/components/common/DateSelect'
import { mapState } from 'vuex'
import WaistDataItem from '@/components/common/new-report/WaistDataItem.vue'
import WaistAssessment from '../../common/new-report/WaistAssessment.vue'
import WaistCanvas from '../../common/new-report/Waistcanvas.vue'

export default {
    components: {
        MeasureModelMld,
        VersionTip,
        DateSelect,
        WaistDataItem,
        WaistAssessment,
        WaistCanvas,
    },
    props: {
        isCreateTime: String,
        oldUser: Number
    },
    data() {
        return {
            isSupportWebgl,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            roundness: [
                {
                    title: '腰围1',
                    key: 'waistGirth1',
                    key1: 'pointList1',
                    girth: {
                        delta: 0,
                        curveName: 'waist_girth',
                    },
                },
                {
                    title: '腰围2',
                    key: 'waistGirth2',
                    key1: 'pointList2',
                    girth: {
                        delta: 1,
                        curveName: 'waist_girth_2',
                    },
                },
                {
                    title: '腰围3',
                    key: 'waistGirth3',
                    key1: 'pointList3',
                    girth: {
                        delta: 2,
                        curveName: 'waist_girth_3',
                    },
                },
                {
                    title: '腰围4',
                    key: 'waistGirth4',
                    key1: 'pointList4',
                    girth: {
                        delta: 3,
                        curveName: 'waist_girth_4',
                    },
                },
                {
                    title: '腰围5',
                    key: 'waistGirth5',
                    key1: 'pointList5',
                    girth: {
                        delta: 4,
                        curveName: 'waist_girth_5',
                    },
                },
                {
                    title: '腰围6',
                    key: 'waistGirth6',
                    key1: 'pointList6',
                    girth: {
                        delta: 5,
                        curveName: 'mid_waist_girth',
                    },
                },
                {
                    title: '腰围7',
                    key: 'waistGirth7',
                    key1: 'pointList7',
                    girth: {
                        delta: 6,
                        curveName: 'waist_girth_7',
                    },
                },
                {
                    title: '腰围8',
                    key: 'waistGirth8',
                    key1: 'pointList8',
                    girth: {
                        delta: 7,
                        curveName: 'waist_girth_8',
                    },
                },
                {
                    title: '腰围9',
                    key: 'waistGirth9',
                    key1: 'pointList9',
                    girth: {
                        delta: 8,
                        curveName: 'waist_girth_9',
                    },
                },
                {
                    title: '腰围10',
                    key: 'waistGirth10',
                    key1: 'pointList10',
                    girth: {
                        delta: 9,
                        curveName: 'waist_girth_10',
                    },
                },
                {
                    title: '腰围11',
                    key: 'waistGirth11',
                    key1: 'pointList11',
                    girth: {
                        delta: 10,
                        curveName: 'low_waist_girth',
                    },
                },
            ],
            waistroundness: [],
            waistarr1: [],
            waistarr2: [],
            waistarr3: [],
            waistarr4: [],
            waistarr5: [],
            waistarr6: {},
            waistcanvas: [],
            slideIndex: 0,
            slideIndex2: -1,
            createTime: '.',
            historyDate: [], // 历史数据
            scanId: '',
            isDispaly: true,
            dispalyModel: false,
            tcScanIdCopt: '',
            tcScanIdtu: '',
            isOldUser: false,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    computed: {
        ...mapState(['historyScanId', 'historyData']),
    },
    mounted() {
        if (this.historyScanId) {
            this.scanId = this.historyScanId
        } else {
            this.scanId = this.modelInfo.scanId
        }
        this.findBmWaistScanTrueHistory()
    },
    methods: {
        OnIsDispaly(data) {
            if (data === 2) {
                this.isDispaly = true
            } else {
                this.isDispaly = false
            }
        },
        // 获取测量对比的数据
        onwaistContrasInfo(tcScanId) {
            console.log(`获取对比数据id${tcScanId}`)
            this.dispalyModel = false
            if (tcScanId != null) {
                window.localStorage.setItem('tcScanId', tcScanId)
                this.tcScanIdCopt = this.historyData.scanId
            } else {
                this.tcScanIdCopt = this.scanId
                window.localStorage.removeItem('tcScanId', tcScanId)
            }
            this.tcScanIdtu = tcScanId
            this.$apollo
                .query({
                    query: bmwaistContrasInfo,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.modelInfo.scanId,
                        tcScanId: tcScanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    this.dispalyModel = true
                    const data2 = res.data.bmwaistContrasInfo.data
                    this.historyDate = []
                    this.dataProcessing(data2)
                })
        },
        findBmWaistScanTrueHistory() {
            this.$apollo
                .query({
                    query: findBmWaistScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: window.localStorage.getItem('createTime')
                            ? JSON.parse(window.localStorage.getItem('createTime'))
                            : this.modelInfo.createTime,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.findBmWaistScanTrueHistory
                    this.historyDate = []
                    if (data && data.code === 200 && this.oldUser === 1) {
                        for (let index = 0; index < data.data.length; index++) {
                            for (let aa = 0; aa < data.data[index].data.length; aa++) {
                                this.historyDate.push(data.data[index].data[aa])
                            }
                        }
                    }
                    this.$store.commit('setwaistDataArray', this.historyDate)
                })
        },
        slideTop() {
            if (this.slideIndex === 0) {
                this.slideIndex = this.waistarr1.length - 1
            } else {
                this.slideIndex -= 1
            }
            console.log(this.waistarr1[this.slideIndex].girth)
            this.$refs.waistmodel.selectCurve(this.waistarr1[this.slideIndex].girth)
        },
        slideBottom() {
            this.slideIndex += 1
            if (this.slideIndex === this.waistarr1.length) {
                this.slideIndex = 0
            }
            // console.log('slideIndex', this.waistarr1[this.slideIndex].girth)
            this.$refs.waistmodel.selectCurve(this.waistarr1[this.slideIndex].girth)
        },
        setSlideIdx(idx) {
            this.slideIndex2 = idx
            this.slideIndex = this.waistarr1.findIndex((item) => item.girth.delta === idx)
           // console.log(this.slideIndex, 'this.slideIndex3')
        },
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        modelLoadOver() {
            setTimeout(() => {
                //    this.slideTop()
                this.$refs.waistmodel.selectCurve(this.waistarr1[0].girth)
            }, 2000)
        },
        dataProcessing(data) {
            if (!data) return
            const latestBmWaist = data.latestBmWaist // 本次数据
            const contrastBmWaist = data.contrastBmWaist // 上一次数据
            if (contrastBmWaist) {
                this.roundness.forEach((element) => {
                    element.lastWidth = contrastBmWaist[element.key]
                    element.lastPoint = contrastBmWaist[element.key1]
                })
            } else {
                this.roundness.forEach((element) => {
                    element.lastWidth = 0
                    element.lastPoint = ''
                })
            }
            if (latestBmWaist) {
                this.roundness.forEach((element) => {
                    element.width = latestBmWaist[element.key]
                    element.point = latestBmWaist[element.key1]
                    element.difference = element.lastWidth - latestBmWaist[element.key]
                })
            }

            let volumeArr = null
            if (latestBmWaist) {
                if (latestBmWaist.dataStatus === 1) {
                    volumeArr = Array.from({ length: 10 }, (_, index) => ({
                        lastvalue: contrastBmWaist ? contrastBmWaist[`waistVolume${index + 1}`] : 0.0,
                        value: latestBmWaist[`waistVolume${index + 1}`],
                    }))
                }
            }
            if (latestBmWaist.dataStatus === 1 && (!contrastBmWaist || contrastBmWaist.dataStatus === 0)) {
                // ********新用户********
                this.isOldUser = false
                // 腰部
                this.waistroundness = [{ lastvalue: 0.0, value: latestBmWaist.waistScore }]

                // 围度取值 [1, 3, 5, 7, 9, 11]
                this.waistarr1 = []
                this.waistcanvas = [];
                [0, 2, 4, 6, 8, 10].forEach((item, index) => {
                    if (this.roundness && item < this.roundness.length) {
                        // 选取腰围
                        this.waistarr1.push({
                            title: `腰围${index + 1}`, // 注意：这里用 index 而不是 item
                            lastvalue: '',
                            value: this.roundness[item].width,
                            key: this.roundness[item].key,
                            girth: this.roundness[item].girth,
                        })
                        // 选取轮廓
                        this.waistcanvas.push({
                            title: `腰围${index + 1}`,
                            lastvalue: '',
                            value: this.roundness[item].width,
                            lastpoint: '',
                            point: this.roundness[item]['point'],
                        })
                    }
                })
                // 体积取值 [ 1+2 , 3+4, 5+6, 7+8, 9+10]
                this.waistarr2 = []
                let index = 0
                for (let i = 0; i < volumeArr.length; i += 2) {
                    index++
                    if (i + 1 < volumeArr.length) {
                        this.waistarr2.push({
                            title: `区间${index}`,
                            lastvalue: 0.0,
                            value: volumeArr[i]['value'] + volumeArr[i + 1]['value'],
                            key: `value${index}`,
                        })
                    }
                }

                // 腰臀比
                this.waistarr3 = [{ lastvalue: '', value: latestBmWaist.waistHipRatio }]
                // 背部体积
                this.waistarr4 = [
                    { title: '背部体积', lastvalue: '', value: (latestBmWaist.backVolume / 1000).toFixed(2) },
                ]
                // 臀部
                this.waistarr5 = [{ title: '臀部', lastvalue: '', value: latestBmWaist.hipGirth }]

                this.waistarr6 = { value: latestBmWaist.waistHipRatio, gender: JSON.parse(window.localStorage.getItem('memberInfo')).sex }

            } else {
                // ********老用户********
                this.isOldUser = true
                this.waistarr1 = []
                this.waistcanvas = []
                 // 腰部
                 this.waistroundness = [{ lastvalue: contrastBmWaist.waistScore, value: latestBmWaist.waistScore }]
                // 前六组 difference字段排序（从大到小）取前三
                const firstSix = this.roundness.slice(0, 5)
                    .map((item, index) => ({ index, difference: item.difference }))
                    .sort((a, b) => b.difference - a.difference)
                    .slice(0, 3)
                    .map(item => item.index)  // 返回对应元素下标
                    .sort((a, b) => a - b)   // 下标进行排序

                // 后六组  difference字段排序（从大到小）取前三
                const lastSix = this.roundness.slice(6)
                    .map((item, index) => ({ index: index + 6, difference: item.difference }))
                    .sort((a, b) => b.difference - a.difference)
                    .slice(0, 3)
                    .map(item => item.index)  // 返回对应元素下标
                    .sort((a, b) => a - b);   // 下标进行排序

                // 根据获取的索引构建 waistarr1 和 waistcanvas
                [...firstSix, ...lastSix].forEach((item, index) => {
                    if (this.roundness && item < this.roundness.length) {
                        // 选取腰围
                        this.waistarr1.push({
                            title: `腰围${index + 1}`, // 注意：这里用 index 而不是 item
                            lastvalue: this.roundness[item].lastWidth,
                            value: this.roundness[item].width,
                            key: this.roundness[item].key,
                            girth: this.roundness[item].girth,
                        })
                        // 选取轮廓
                        this.waistcanvas.push({
                            title: `腰围${index + 1}`,
                            lastvalue: this.roundness[item].lastWidth,
                            value: this.roundness[item].width,
                            lastpoint: this.roundness[item]['lastPoint'],
                            point: this.roundness[item]['point'],
                        })
                    }
                })

                // 计算腰腹体积
                this.waistarr2 = []
                const indicesArr = [...firstSix, ...lastSix]
                for (let i = 0; i < indicesArr.length - 1; i++) {
                    const start = indicesArr[i]
                    const end = indicesArr[i + 1]
                    const subArray = volumeArr.slice(start, end) // 提取子数组
                    const lastvalue = subArray.reduce((acc, curr) => {
                        return acc + curr.lastvalue
                    }, 0) // 计算和
                    const value = subArray.reduce((acc, curr) => {
                        return acc + curr.value
                    }, 0) // 计算和
                    this.waistarr2.push({
                        title: `区间${i + 1}`,
                        lastvalue: lastvalue,
                        value: value,
                        key: `value${i + 1}`
                    })
                }
                // 腰臀比
                this.waistarr3 = [{ lastvalue: contrastBmWaist.waistHipRatio, value: latestBmWaist.waistHipRatio }]
                // 背部体积
                this.waistarr4 = [
                    {
                        title: '背部体积',
                        lastvalue: (contrastBmWaist.backVolume / 1000).toFixed(2),
                        value: (latestBmWaist.backVolume / 1000).toFixed(2),
                    }
                ]
                // 臀部
                this.waistarr5 = [{ title: '臀部', lastvalue: contrastBmWaist.hipGirth, value: latestBmWaist.hipGirth }]

                this.waistarr6 = { value: latestBmWaist.waistHipRatio, gender: JSON.parse(window.localStorage.getItem('memberInfo')).sex }
            }
            console.log('=================')
            console.log(this.waistarr1)
            console.log('=================')
            window.localStorage.setItem('waistarr1', JSON.stringify(this.waistarr1))
        },
    },
}
</script>

<style lang="less" scoped>
.hidden-roundness {
    // display: none;
}

.body-roundness {
    background-image: url('../../../assets/images/new-report/girth/Background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: left bottom;
    padding-top: 36px;
    margin: 12px;
    // display: flex;
    // justify-content: center;
    position: relative;
    height: auto;
    font-family: PingFangSC, PingFang SC;

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .girth-box {
        // margin-top: 74px
    }

    .model-container {
        position: relative;
    }

    > div {
        // padding-top: 30px;

        .right-roundness-slide {
            background: none;
            position: absolute;
            top: 0px;
            right: 140px;
            // background-color: brown;

            .roundness-data {
                position: relative;
                top: -40px;
                right: 40px;
                background-image: url('../../../assets/images/new-report/waist1.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 69px;
                height: 69px;
                text-align: center;
                padding-top: 25px;
                margin-bottom: 6px;
                display: flex;
                flex-direction: column;

                p {
                    display: block;
                    font-size: 13px;
                    margin-left: 7px;
                    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                    -webkit-background-clip: text;
                    font-family: PingFangSC, PingFang SC;
                    -webkit-text-fill-color: transparent;
                    padding: 0 0.01px;  /* 防止文本裁剪异常 */
                }

                .girth-value-top {
                    display: block;
                    line-height: 15px;
                    font-size: 18px;
                    margin-left: 6px;
                }

                .girth-value {
                    display: block;
                    line-height: 15px;
                    font-size: 18px;
                    margin-right: 7px;
                }
            }

            .model-style {
                position: relative;
                top: 0px;
                right: -90px;
            }

            .model-right {
                position: relative;
                top: -115px;
                left: 42px;
                width: 69px;
                height: 69px;
                background-image: url(../../../assets/images/new-report/waist2.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                text-align: center;
                // font-size: 36px;
                padding-top: 25px;

                p {
                    display: block;
                    font-size: 13px;
                    margin-right: 7px;
                    font-family: PingFangSC, PingFang SC;
                    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    padding: 0 0.01px;  /* 防止文本裁剪异常 */
                }

                .girth-value {
                    display: block;
                    line-height: 15px;
                    font-size: 18px;
                    margin-right: 7px;
                }
            }
        }
    }

    > .person-img-width {
        width: 100% !important;
        background-position: center bottom !important;
    }

    > .person-img {
        // display: flex;
        // justify-content: center;
        // min-width: 215px;
        margin-bottom: 15px !important;
        background-repeat: no-repeat;
        background-position: 58px bottom;
        margin: 0 auto;
        min-height: 300px;

        .measure-top {
            position: absolute;
            left: 8px;
            right: 8px;
            top: 8px;
            width: 96%;
        }

        .measure-bottom {
            position: absolute;
            top: 225px;
            left: 8px;
            right: 8px;
            width: 96%;
        }

        .data-time {
            position: absolute;
            bottom: 0px;
            right: 0;
            left: 0px;
            margin: auto 20px;
            height: 52px;
        }
    }

    .measure-model {
        padding-bottom: 30px;
        height: 300px;
    }
}

.right-roundness-slide-2 {
    margin-left: 0;
    margin-top: 30px;
    background: none;
    position: absolute;
    z-index: 1;
    top: 50px;
    right: 138px;
    width: 70px;
    height: 200px;

    .roundness-data {
        color: white;
    }

    .arrow {
        text-align: center;
        padding: 30px 0;

        i {
            width: 8px;
            height: 8px;
            display: inline-block;
            transform-origin: center center;
            border-top: 2px solid #ffffff;
            border-right: 2px solid #ffffff;
        }

        .top-arrow {
        }

        .lower-arrow {
            margin-bottom: 3px;
        }
    }
}
.isDeviceReport{
     .arrow {
        img{
            width: 18px;
            height: 18px;
        }
     }
     .roundness-data{
        font-size: 12px;
     }

}

.waist-data-item {
    margin: 20px auto;
    height: auto;
}

.tcScanIdCopt1 {
    right: 250px;
}
</style>
