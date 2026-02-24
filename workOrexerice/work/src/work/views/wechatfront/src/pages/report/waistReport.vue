<template>
    <div class="waist-main">
        <div class="score-container">
            <div class="score-left">腰部 | {{ waistroundness[0].value }}分<span v-if="!isNewUser" class="duibi">与上次得分对比 <span
                        class="duinum">{{ scorecha }}</span></span></div>
            <div class="score-right">超越人群比例 | {{ waistPercentile }}%<span v-if="!isNewUser" class="duibi">与上次比例对比 <span
                        class="duinum">{{ percentileDiff }}</span></span></div>
        </div>
        <div v-if="dataStatus === 1" class="waist-item1">
            <div style="display: flex;flex-direction: row;">
                <div class="waist-left" style="width: 426px;height: 524px;">
                    <!-- 模型页面1 -->
                    <div class="model" style="width: 426px;height: 524px">
                        <div class="model-left-tittle" style="width: 426px;"></div>
                        <div class="title">
                            <span>本次测量</span>
                            <span v-if="!isNewUser">上次测量</span>
                        </div>
                        <!-- @error="girthImgLoadError('now')" -->
                        <div class="new-img">
                            <template>
                                <div :style="isNewUser ? 'margin:auto' : ''">
                                    <canvas ref="nowcanvas" width="154" height="220" v-if="girthImgs.now"></canvas>
                                </div>
                                <div v-if="!isNewUser">
                                    <canvas ref="lastcanvas" width="154" height="220" v-if="girthImgs.last"></canvas>
                                    <default-model v-else :txt="getTxt" />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div style="display: flex;flex-direction: column;margin-left: 12px; width: 426px;height: 524px;">
                    <!-- 体围报告对比信息 -->
                    <div class="girth-part">
                        <table border="1" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                            <thead border="1" cellspacing="0" cellpadding="0">
                                <tr>
                                    <!-- 测量项目 -->
                                    <th :style="isNewUser ? 'width: 200px' : 'width: 130px'">测量项目</th>
                                    <th>本次测量</th>
                                    <th v-if="!isNewUser">上次测量</th>
                                    <th v-if="!isNewUser" class="tpl">与上次对比</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(waist, key) in waistarr1" :key="key" style="height:36.5px;border: none;">
                                    <td style="font-size: 14px;">{{ waist.title }}<span class="unit"> {{ waist.unit
                                            }}</span></td>
                                    <td>
                                        <span v-if="waist.value > 0 && waist.value !== '' && unit === 'imperial' && waist.value !== '0.0'"
                                            class="val">{{
                                                toDecimal(waist.value, 1)
                                            }}</span>
                                        <span
                                            v-else-if="waist.value > 0 && waist.value !== '' && unit === 'metric' && waist.value !== '0.0'"
                                            class="val">{{
                                                toDecimal(waist.value, 1)
                                            }}</span>
                                        <span v-else class="val">--</span>
                                    </td>
                                    <td v-if="!isNewUser">
                                        <span v-if="waist.lastvalue > 0 && waist.lastvalue !== '' && unit === 'imperial'" class="val">{{
                                            toDecimal(waist.lastvalue, 1)
                                        }}</span>
                                        <span v-else-if="waist.lastvalue > 0 && waist.lastvalue !== '' && unit === 'metric'" class="val">{{
                                            toDecimal(waist.lastvalue, 1)
                                        }}</span>
                                        <span v-else class="val">--</span>
                                    </td>
                                    <td v-if="!isNewUser">
                                        <contrast v-if="waist.value > 0 && waist.lastvalue !== ''" :val="waist.value - waist.lastvalue"
                                            :type="1" style="margin: 0px;"></contrast>
                                        <span v-else class="val">--</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 体积 -->
                    <div class="girth-part" style="margin-top: 12px;width: 426px">
                        <table border="1" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                            <thead border="1" cellspacing="0" cellpadding="0">
                                <tr>
                                    <!-- 测量项目 -->
                                    <th :style="isNewUser ? 'width: 200px' : 'width: 130px'">测量项目</th>
                                    <th>本次测量</th>
                                    <th v-if="!isNewUser">上次测量</th>
                                    <th v-if="!isNewUser">与上次对比</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(waist, key) in waistarr2" :key="key" style="height:36.5px;border: none;">
                                    <td style="font-size: 14px;">{{ waist.title }}<span class="unit"> {{ waist.unit
                                            }}</span></td>
                                    <td>
                                        <span v-if="waist.value !== '' && unit === 'imperial' && waist.value !== '0.0'"
                                            class="val">{{
                                                toDecimal(waist.value, 1)
                                            }}</span>
                                        <span
                                            v-else-if="waist.value !== '' && unit === 'metric' && waist.value !== '0.0'"
                                            class="val">{{
                                                toDecimal(waist.value, 1)
                                            }}</span>
                                        <span v-else class="val">--</span>
                                    </td>
                                    <td v-if="!isNewUser">
                                        <span v-if="waist.lastvalue !== '' && unit === 'imperial'" class="val">{{
                                            toDecimal(waist.lastvalue, 1)
                                        }}</span>
                                        <span v-else-if="waist.lastvalue !== '' && unit === 'metric'" class="val">{{
                                            toDecimal(waist.lastvalue, 1)
                                        }}</span>
                                        <span v-else class="val">--</span>
                                    </td>
                                    <td v-if="!isNewUser">
                                        <contrast v-if="waist.lastvalue !== ''" :val="waist.value - waist.lastvalue"
                                            :type="1" style="margin: 0px;"></contrast>
                                        <span v-else class="val">--</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="waist-item1">
            <div class="waist-left">
                <!-- 模型页面1 -->
                <div class="model">
                    <div class="model-left-tittle">正面</div>
                    <div class="title">
                        <span>本次测量</span>
                        <span v-if="!isNewUser">上次测量</span>
                    </div>
                    <!-- @error="girthImgLoadError('now')" -->
                    <div class="img">
                        <template>
                            <div :style="isNewUser ? 'margin:auto' : ''">
                                <canvas ref="nowcanvas" width="154" height="220" v-if="girthImgs.now"></canvas>
                            </div>
                            <div v-if="!isNewUser">
                                <canvas ref="lastcanvas" width="154" height="220" v-if="girthImgs.last"></canvas>
                                <default-model v-else :txt="getTxt" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="waist-right">
                <!-- 体围报告对比信息 -->
                <div class="girth-part">
                    <table border="1" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                        <thead border="1" cellspacing="0" cellpadding="0">
                            <tr>
                                <!-- 测量项目 -->
                                <th :style="isNewUser ? 'width: 200px' : ''">测量项目</th>
                                <th>本次测量</th>
                                <th v-if="!isNewUser">上次测量</th>
                                <th v-if="!isNewUser" class="tpl">与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(waist, key) in waistarr1" :key="key"
                                :style="isNewUser ? 'height:69px' : 'height: 91px'">
                                <td>{{ waist.title }}<span class="unit"> {{ waist.unit }}</span></td>
                                <td>
                                    <span v-if="waist.value !== '' && unit === 'imperial' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 1)
                                        }}</span>
                                    <span v-else-if="waist.value !== '' && unit === 'metric' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 1)
                                        }}</span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <span v-if="waist.lastvalue !== '' && unit === 'imperial'" class="val">{{
                                        toDecimal(waist.lastvalue, 1)
                                    }}</span>
                                    <span v-else-if="waist.lastvalue !== '' && unit === 'metric'" class="val">{{
                                        toDecimal(waist.lastvalue, 1)
                                    }}</span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <contrast v-if="waist.lastvalue !== ''" :val="waist.value - waist.lastvalue"
                                        :type="1" style="margin: 0px;"></contrast>
                                    <span v-else class="val">--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="girth-bottom">
                <div class="girth-part">
                    <table border="1" cellspacing="0" cellpadding="0" :style="isNewUser ? 'width: 400px' : ''">
                        <thead border="1" cellspacing="0" cellpadding="0">
                            <tr>
                                <!-- 测量项目 -->
                                <th>测量项目</th>
                                <th>本次测量</th>
                                <th v-if="!isNewUser">上次测量</th>
                                <th v-if="!isNewUser">与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(waist, key) in waistarr2" :key="key">
                                <td>{{ waist.title }}<span class="unit"> {{ waist.unit }}</span></td>
                                <td>
                                    <span v-if="waist.value !== '' && unit === 'imperial' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 1)
                                        }}</span>
                                    <span v-else-if="waist.value !== '' && unit === 'metric' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 1)
                                        }}</span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <span v-if="waist.lastvalue !== '' && unit === 'imperial'" class="val">{{
                                        toDecimal(waist.lastvalue, 1)
                                    }}</span>
                                    <span v-else-if="waist.lastvalue !== '' && unit === 'metric'" class="val">{{
                                        toDecimal(waist.lastvalue, 1)
                                    }}</span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <contrast v-if="waist.lastvalue !== ''" :val="waist.value - waist.lastvalue"
                                        :type="1" style="margin: 0px;"></contrast>
                                    <span v-else class="val">--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="score-view">轮廓分析</div>
        <div class="waist-item2">
            <p class="canvas-font1" v-if="isNewUser">前</p>
            <p class="canvas-font2" v-if="isNewUser">后</p>
            <div class="zhanwei" v-if="isNewUser"></div>
            <div class="waist-box-item" v-for="(item, index) in waistcanvas" :key="index">
                <p class="canvas-title">{{ item.title }}</p>
                <p class="canvas-font1" v-if="!isNewUser">前</p>
                <p class="canvas-font2" v-if="!isNewUser">后</p>
                <waistcanvas :arr="item"></waistcanvas>
                <ul class="custom-bullet-list" :style="isNewUser ? 'padding-left: 30%' : ''">
                    <li v-if="!isNewUser">上次：{{ item.lastvalue > 0 ? item.lastvalue : '-' }}</li>
                    <li>本次：{{ item.value > 0 ? item.value : '-' }}</li>
                </ul>
            </div>
        </div>
        <div class="waist-item3">
            <div class="waist-box">
                <div class="score">背部</div>
                <div class="girth-part">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead border="1" cellspacing="0" cellpadding="0">
                            <tr>
                                <!-- 测量项目 -->
                                <th :style="isNewUser ? 'width: 200px' : ''">测量项目</th>
                                <th>本次测量</th>
                                <th v-if="!isNewUser">上次测量</th>
                                <th v-if="!isNewUser">与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(waist, key) in waistarr4" :key="key">
                                <td>{{ waist.title }}<span class="unit"> {{ waist.unit }}</span></td>
                                <td>
                                    <span v-if=" waist.value !== '' && unit === 'imperial' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 2)
                                        }} </span>
                                    <span v-else-if="waist.value !== '' && unit === 'metric' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 2)
                                        }} </span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <span v-if="waist.lastvalue !== '' && unit === 'imperial'" class="val">{{
                                        toDecimal(waist.lastvalue, 2)
                                    }} </span>
                                    <span v-else-if="waist.lastvalue !== '' && unit === 'metric'" class="val">{{
                                        toDecimal(waist.lastvalue, 2)
                                    }} </span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <contrast v-if="waist.lastvalue !== ''" :val="waist.value - waist.lastvalue"
                                        :type="1" style="margin: 0px;"></contrast>
                                    <span v-else class="val">--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="waist-box">
                <div class="score">臀部</div>
                <div class="girth-part">
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead border="1" cellspacing="0" cellpadding="0">
                            <tr>
                                <!-- 测量项目 -->
                                <th :style="isNewUser ? 'width: 200px' : ''">测量项目</th>
                                <th>本次测量</th>
                                <th v-if="!isNewUser">上次测量</th>
                                <th v-if="!isNewUser" class="tpl">与上次对比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(waist, key) in waistarr5" :key="key">
                                <td>{{ waist.title }}<span class="unit"> {{ waist.unit }}</span></td>
                                <td>
                                    <span v-if="waist.value !== '' && unit === 'imperial' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 1)
                                        }} </span>
                                    <span v-else-if="waist.value !== '' && unit === 'metric' && waist.value !== '0.0'"
                                        class="val">{{
                                            toDecimal(waist.value, 1)
                                        }} </span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <span v-if="waist.lastvalue !== '' && unit === 'imperial'" class="val">{{
                                        toDecimal(waist.lastvalue, 1)
                                    }} </span>
                                    <span v-else-if="waist.lastvalue !== '' && unit === 'metric'" class="val">{{
                                        toDecimal(waist.lastvalue, 1)
                                    }} </span>
                                    <span v-else class="val">--</span>
                                </td>
                                <td v-if="!isNewUser">
                                    <contrast v-if="waist.lastvalue !== ''" :val="waist.value - waist.lastvalue"
                                        :type="1" style="margin: 0px;"></contrast>
                                    <span v-else class="val">--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="waist-item4">
            <div class="biaoti">风险提示：</div>
            <div class="p">{{ tishi }}</div>
            <div class="biaoti">结果建议：</div>
            <div class="p">{{ jianyi }}</div>
        </div>
    </div>
</template>

<script>
import { bmwaistContrasInfo, bmBdaPointInfos, bmScanFileInfos } from '@/assets/js/apolloGql.js'
import { _toDecimal } from '@/assets/js/util.js'
import DefaultModel from '@/components/DefaultModelGirth'
import Contrast from '@/components/Contrast'
import waistcanvas from '../../components/waistcanvas.vue'
export default {
    components: {
        DefaultModel,
        Contrast,
        waistcanvas,
    },
    props: {
        reportInfo: Object,
        memberInfo: Object,
        healthPackageEnable: Number,
    },
    data() {
        return {
            isNewUser: false,
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
                        curveName: 'waistGirth7',
                    },
                },
                {
                    title: '腰围8',
                    key: 'waistGirth8',
                    key1: 'pointList8',
                    girth: {
                        delta: 7,
                        curveName: 'waistGirth8',
                    },
                },
                {
                    title: '腰围9',
                    key: 'waistGirth9',
                    key1: 'pointList9',
                    girth: {
                        delta: 8,
                        curveName: 'waistGirth9',
                    },
                },
                {
                    title: '腰围10',
                    key: 'waistGirth10',
                    key1: 'pointList10',
                    girth: {
                        delta: 9,
                        curveName: 'waistGirth10',
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
            girthImgs: {
                now: '',
                last: '',
            },
            unit: 'metric',
            getTxt: '',
            tishi: '',
            jianyi: '',
            bodypoints: {},
            bodypoints1: {},
            dataStatus: 0,   // 0 mld旧算法  1 mld4.5期新算法
            waistPercentile: 0, // 超越人群比例
            lastWaistPercentile: 0 // 上次超越人群比例
        }
    },
    computed: {
        scorecha() {
            const diff = this.waistroundness[0].value - this.waistroundness[0].lastvalue
            return diff > 0 ? '+' + diff : diff
        },
        percentileDiff() {
            const diff = this.waistPercentile - this.lastWaistPercentile
            return diff > 0 ? '+' + diff : diff
        }
    },
    created() {
        this.getWaistContrasInfo()
        if (this.reportInfo.bdaStatus === 1) {
            this.getTxt = '模型获取失败'
        } else {
            this.getTxt = '未测量'
        }

    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        async getWaistContrasInfo() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime,
            }
            await this.$apollo
                .query({
                    query: bmwaistContrasInfo,
                    variables: userInfo,
                })
                .then((res) => {
                    const info = res.data.bmwaistContrasInfo
                    const data2 = info.data
                    const data = info.data.contrastBmWaist
                    if (info.code === 200 && data2.latestBmWaist !== null) {
                        if (!data) {
                            this.isNewUser = true
                        }
                        if (data2 && data2.latestBmWaist && data2.latestBmWaist.dataStatus === 1) {
                            // mld 4.5期新算法处理数据
                            this.dataStatus = 1
                            this.dataProcessing(data2)
                        } else {
                            // mld 旧算法
                            this.dataStatus = 0
                            this.isFirst(data2)
                        }

                        if (data !== null && data.scanId) {
                            this.getGirthSideViewImg(data.scanId).then((data) => {
                                // 正视图
                                const file = data.find((model, index, arr) => {
                                    return model.fileType.id === 18
                                })
                                if (file) {
                                    this.girthImgs.last = file.filePath
                                    if (this.girthImgs.last) {
                                        console.log(data[0].scanId, '>>>>>>>>>>sc', this.girthImgs.last)
                                        this.bmBdaPointInfos(data[0].scanId, 2)
                                        if (this.girthImgs.last) {
                                            setTimeout(() => {
                                                this.drawImage(this.girthImgs.last, 'lastcanvas')
                                            }, 1000)
                                        }
                                    }
                                }
                            })
                        }
                        // 获取到数据类型后在绘制图片围度
                        if (this.reportInfo.bdaStatus === 1) {
                            this.getGirthSideViewImg(this.reportInfo.scanId).then((data) => {
                                // 正視圖
                                const file = data.find((model, index, arr) => {
                                    return model.fileType.id === 18
                                })
                                if (file) {
                                    this.girthImgs.now = file.filePath
                                    this.bmBdaPointInfos(this.reportInfo.scanId, 1)
                                    setTimeout(() => {
                                        this.drawImage(this.girthImgs.now, 'nowcanvas')
                                    }, 1000)
                                }
                            })
                        }

                    }
                })
                .catch((error) => {
                    console.log(error)
                })

        },
        isFirst(data) {
            if (!data.contrastBmWaist) {
                console.log('==================111')
                const arr1 = [{ 'lastvalue': '', 'value': data.latestBmWaist.waistScore, unit: '分' }]
                this.waistroundness = arr1
                // 超越人群比例 - 新用户
                this.waistPercentile = data.latestBmWaist.waistPercentile || 0
                this.lastWaistPercentile = 0
                this.waistarr1 = Array.from({ length: 7 }, (_, index) => ({
                    title: `腰围${index + 1}`,
                    lastvalue: '',
                    value: data.latestBmWaist[`waistGirth${index + 1}`],
                    key: `waistGirth${index + 1}`,
                    girth: {
                        delta: index,
                        curveName: index === 0 ? 'waist_girth' : index === 3 ? 'mid_waist_girth' : index === 6 ? 'low_waist_girth' : `waist_girth_${index + 1}`
                    },
                    unit: 'cm'
                }))
                this.waistarr2 = Array.from({ length: 3 }, (_, index) => ({
                    title: `腰围间体积${index + 1}`,
                    lastvalue: '',
                    value: data.latestBmWaist[`waistVolume${index + 1}`],
                    unit: 'cm³'
                }))
                this.waistarr3 = { title: '腰臀比', 'lastvalue': '', 'value': data.latestBmWaist.waistHipRatio }
                this.waistarr2.unshift(this.waistarr3)
                this.waistarr4 = [{ title: '背部体积 L', 'lastvalue': '', 'value': (data.latestBmWaist.backVolume / 1000).toFixed(2), unit: 'L' }]
                this.waistarr5 = [{ title: '臀围 cm', 'lastvalue': '', 'value': data.latestBmWaist.hipGirth, unit: 'cm' }]
                this.waistarr6 = { value: data.latestBmWaist.waistHipRatio, gender: this.memberInfo.memberSex }
                this.waistcanvas = Array.from({ length: 7 }, (_, index) => ({
                    title: `腰围${index + 1}`,
                    lastvalue: '',
                    value: this.toDecimal(data.latestBmWaist[`waistGirth${index + 1}`], 1),
                    lastpoint: '',
                    point: data.latestBmWaist[`pointList${index + 1}`]
                }))
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>》|<<<<<<。waistcanvas', this.waistarr1)
            } else {
                console.log('==================111===111')
                console.log('>>>abc', data)
                this.waistroundness = [{ 'lastvalue': data.contrastBmWaist.waistScore, 'value': data.latestBmWaist.waistScore, unit: '分' }]
                // 超越人群比例 - 老用户
                this.waistPercentile = data.latestBmWaist.waistPercentile || 0
                this.lastWaistPercentile = data.contrastBmWaist.waistPercentile || 0
                this.waistarr1 = Array.from({ length: 7 }, (_, index) => ({
                    title: `腰围${index + 1}`,
                    lastvalue: data.contrastBmWaist[`waistGirth${index + 1}`],
                    value: data.latestBmWaist[`waistGirth${index + 1}`],
                    key: `waistGirth${index + 1}`,
                    girth: {
                        delta: index,
                        curveName: index === 0 ? 'waist_girth' : index === 3 ? 'mid_waist_girth' : index === 6 ? 'low_waist_girth' : `waist_girth_${index + 1}`
                    },
                    unit: 'cm'
                }))
                this.waistarr1 = this.filter(this.waistarr1)
                this.waistarr2 = Array.from({ length: 3 }, (_, index) => ({
                    title: `腰围间体积${index + 1}`,
                    lastvalue: data.contrastBmWaist[`waistVolume${index + 1}`],
                    value: data.latestBmWaist[`waistVolume${index + 1}`],
                    unit: 'cm³'
                }))
                this.waistarr2 = this.filter(this.waistarr2)
                this.waistarr3 = { title: '腰臀比', lastvalue: data.contrastBmWaist.waistHipRatio, value: data.latestBmWaist.waistHipRatio }
                this.waistarr2.unshift(this.waistarr3)
                this.waistarr4 = [{ title: '背部体积 L', 'lastvalue': (data.contrastBmWaist.backVolume / 1000).toFixed(2), 'value': (data.latestBmWaist.backVolume / 1000).toFixed(2), unit: 'L' }]
                this.waistarr5 = [{ title: '臀围 cm', 'lastvalue': data.contrastBmWaist.hipGirth, 'value': data.latestBmWaist.hipGirth, unit: 'cm' }]
                this.waistarr6 = { value: data.latestBmWaist.waistHipRatio, gender: this.memberInfo.memberSex }
                this.waistcanvas = this.waistarr1.map(item => ({
                    title: item.title,
                    lastvalue: item.lastvalue,
                    value: this.toDecimal(item.value, 1),
                    lastpoint: data.contrastBmWaist[`pointList${item.title[item.title.length - 1]}`],
                    point: data.latestBmWaist[`pointList${item.title[item.title.length - 1]}`]
                }))
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>》。waistcanvas', this.waistcanvas)
            }
            this.waistassessment(this.waistarr6)
        },
        filter(data) {
            let arr = []
            data.forEach(item => {
                if (item.lastvalue > item.value) {
                    arr.push(item)
                }
            })
            arr.sort((a, b) => (b.lastvalue - b.value) - (a.lastvalue - a.value))
            if (arr.length > 3) {
                arr = arr.slice(0, 3)
            } else if (arr.length === 0) {
                const minDifference = Math.min(...data.map(item => Math.abs(item.lastvalue - item.value)))
                arr = data.filter(item => Math.abs(item.lastvalue - item.value) === minDifference)
                if (arr.length > 3) {
                    arr = arr.slice(0, 3)
                }
            }
            arr.sort((a, b) => a.title.slice(-1) - b.title.slice(-1))
            arr = arr.map((item, index) => {
                const prefix = item.title.slice(0, -1)
                item.title = prefix + (index + 1)
                return item
            })
            return arr
        },
        dataProcessing(data) {
            // mld 4.5期新算法数据处理
            if (!data) return
            const latestBmWaist = data.latestBmWaist // 本次数据
            const contrastBmWaist = data.contrastBmWaist // 上一次数据
            // console.log('===========000')
            // console.log(data)
            // console.log(contrastBmWaist)
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
                this.isNewUser = true
                // 腰部
                this.waistroundness = [{ 'lastvalue': '', 'value': latestBmWaist.waistScore, unit: '分' }]
                // 超越人群比例 - 新用户
                this.waistPercentile = latestBmWaist.waistPercentile || 0
                this.lastWaistPercentile = 0

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
                            unit: 'cm'
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
                            title: `腰围间体积${index}`,
                            lastvalue: 0.0,
                            value: volumeArr[i]['value'] + volumeArr[i + 1]['value'],
                            key: `value${index}`,
                            unit: 'cm³'
                        })
                    }
                }

                // 腰臀比
                this.waistarr3 = { title: '腰臀比', lastvalue: '', value: data.latestBmWaist.waistHipRatio, unit: '' }
                this.waistarr2.unshift(this.waistarr3)
                // 背部体积
                this.waistarr4 = [
                    { title: '背部体积 L', lastvalue: '', value: (data.latestBmWaist.backVolume / 1000).toFixed(2) },
                ]
                // 臀部
                this.waistarr5 = [{ title: '臀部 cm', lastvalue: '', value: data.latestBmWaist.hipGirth }]

                this.waistarr6 = { value: data.latestBmWaist.waistHipRatio, gender: this.memberInfo.memberSex }
            } else {
                // ********老用户********
                this.waistarr1 = []
                this.waistcanvas = []
                this.waistroundness = [{ 'lastvalue': data.contrastBmWaist.waistScore, 'value': data.latestBmWaist.waistScore, unit: '分' }]
                // 超越人群比例 - 老用户
                this.waistPercentile = data.latestBmWaist.waistPercentile || 0
                this.lastWaistPercentile = data.contrastBmWaist.waistPercentile || 0
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
                            unit: 'cm'
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
                        title: `腰围间体积${i + 1}`,
                        lastvalue: lastvalue,
                        value: value,
                        key: `value${i + 1}`,
                        unit: 'cm³'
                    })
                }
                // 腰臀比
                this.waistarr3 = { title: '腰臀比', lastvalue: data.contrastBmWaist.waistHipRatio, value: data.latestBmWaist.waistHipRatio, unit: '' }
                this.waistarr2.unshift(this.waistarr3)
                // 背部体积
                this.waistarr4 = [
                    {
                        title: '背部体积 L',
                        lastvalue: (data.contrastBmWaist.backVolume / 1000).toFixed(2),
                        value: (data.latestBmWaist.backVolume / 1000).toFixed(2),
                    }
                ]
                // 臀部
                this.waistarr5 = [{ title: '臀部 cm', lastvalue: data.contrastBmWaist.hipGirth, value: data.latestBmWaist.hipGirth }]

                this.waistarr6 = { value: data.latestBmWaist.waistHipRatio, gender: this.memberInfo.memberSex }

            }
            this.waistassessment(this.waistarr6)
        },
        async getGirthSideViewImg(scanId) {
            return new Promise((ok, no) => {
                const userinfo = {
                    scanId,
                }
                this.$apollo
                    .query({
                        query: bmScanFileInfos,
                        variables: userinfo,
                    })
                    .then((res) => {
                        const data = res.data.bmScanFileInfos
                        if (data && data.code === 200) {
                            // const file = data.data.find((model, index, arr) => {
                            //     return model.fileType.id === 18
                            // })
                            if (data.data) {
                                ok(data.data)
                                return
                            } else {
                                ok('')
                                return
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        no(err)
                        return
                    })
            })
        },
        // 围度数据
        async bmBdaPointInfos(scanId, num) {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bmBdaPointInfos,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bmBdaPointInfos
                    if (num === 1) {
                        this.bodypoints = JSON.parse(JSON.stringify(info.data))
                        // console.log(this.bodypoints , '>>>>???')
                        for (let key in this.bodypoints) {
                            if (this.bodypoints.hasOwnProperty(key)) {
                                if (typeof this.bodypoints[key] === 'string') {
                                    this.bodypoints[key] = JSON.parse(this.bodypoints[key])
                                }
                                delete this.bodypoints.__typename
                                delete this.bodypoints.bustGirthPoint
                                delete this.bodypoints.leftUpperArmGirthPoint
                                delete this.bodypoints.rightUpperArmGirthPoint
                                delete this.bodypoints.leftThighGirthPoint
                                delete this.bodypoints.rightThighGirthPoint
                                delete this.bodypoints.leftCalfGirthPoint
                                delete this.bodypoints.rightCalfGirthPoint
                                delete this.bodypoints.neckGirthPoint
                                delete this.bodypoints.leftMinThighGirthPoint
                                delete this.bodypoints.rightMinThighGirthPoint
                                delete this.bodypoints.hipGirthPoint
                            }
                        }
                    }
                    else {
                        this.bodypoints1 = JSON.parse(JSON.stringify(info.data))
                        // console.log(this.bodypoints , '>>>>???')
                        for (let key in this.bodypoints1) {
                            if (this.bodypoints1.hasOwnProperty(key)) {
                                if (typeof this.bodypoints1[key] === 'string') {
                                    this.bodypoints1[key] = JSON.parse(this.bodypoints1[key])
                                }
                                delete this.bodypoints1.__typename
                                delete this.bodypoints1.bustGirthPoint
                                delete this.bodypoints1.leftUpperArmGirthPoint
                                delete this.bodypoints1.rightUpperArmGirthPoint
                                delete this.bodypoints1.leftThighGirthPoint
                                delete this.bodypoints1.rightThighGirthPoint
                                delete this.bodypoints1.leftCalfGirthPoint
                                delete this.bodypoints1.rightCalfGirthPoint
                                delete this.bodypoints1.neckGirthPoint
                                delete this.bodypoints1.leftMinThighGirthPoint
                                delete this.bodypoints1.rightMinThighGirthPoint
                                delete this.bodypoints.hipGirthPoint
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        drawImage(url, name) {
            if (!this.$refs[name]) {
                console.error('Canvas元素未找到')
                return
            }
            const canvas = this.$refs[name]
            const ctx = canvas.getContext('2d')

            // 创建一个新的Image对象
            const img = new Image()
            img.src = url // 替换为你的图片路径
            // const scaleFactor = 0.38;
            img.onload = () => {
                // 将图片绘制到canvas上
                console.log('>>>>>图片《《《《《', img.width, canvas.width, canvas.width / img.width, img.width * (canvas.width / img.width))
                const scaleFactor = parseFloat((canvas.width / img.width).toFixed(2))
                ctx.drawImage(img, 0, 0, 154, img.height * scaleFactor)
                let bodypoints3 = name === 'nowcanvas' ? this.bodypoints : this.bodypoints1
                let bodypoints = {}
                // console.log(this.bodypoints.neckGirthPoint, '>>>>>>>>>>>>>>>>')
                // bodypoints = bodypoints.filter(item => item.key.includes('Girth'))
                // eslint-disable-next-line guard-for-in
                console.log('==============11111')
                console.log(this.dataStatus)
                console.log('==============11111')
                if (this.dataStatus === 1) {

                    for (let part in bodypoints3) {
                        if (bodypoints3.hasOwnProperty(part)) {
                            // 修复for-in循环，添加hasOwnProperty检查
                            for (let key in this.waistarr1) {
                                if (this.waistarr1.hasOwnProperty(key)) {
                                    console.log(part, '>>>>>>>>pat')
                                    // eslint-disable-next-line
                                    if (this.waistarr1[key].key + 'Point' == part || (this.waistarr1[key].key === 'waistGirth1' && part === 'waistGirthPoint') || (this.waistarr1[key].key === 'waistGirth6' && part === 'midWaistGirthPoint') || (this.waistarr1[key].key === 'waistGirth11' && part === 'lowWaistGirthPoint')) {
                                        console.log(part, '>>>>>>>>>>>>>>相等的')
                                        bodypoints[part] = bodypoints3[part]
                                    }
                                }
                            }
                        }
                    }

                } else {
                    for (let part in bodypoints3) {
                        if (bodypoints3.hasOwnProperty(part)) {
                            // 修复for-in循环，添加hasOwnProperty检查
                            for (let key in this.waistarr1) {
                                if (this.waistarr1.hasOwnProperty(key)) {
                                    console.log(part, '>>>>>>>>pat')
                                    // eslint-disable-next-line
                                    if (this.waistarr1[key].key + 'Point' == part || (this.waistarr1[key].key === 'waistGirth1' && part === 'waistGirthPoint') || (this.waistarr1[key].key === 'waistGirth4' && part === 'midWaistGirthPoint') || (this.waistarr1[key].key === 'waistGirth7' && part === 'lowWaistGirthPoint')) {
                                        console.log(part, '>>>>>>>>>>>>>>相等的')
                                        bodypoints[part] = bodypoints3[part]
                                    }
                                }
                            }
                        }
                    }
                }


                // 定义点的坐标和颜色
                delete bodypoints.neckGirthPoint
                for (let part in bodypoints) {
                    if (bodypoints.hasOwnProperty(part)) {
                        console.log(`部位ww: ${part}`)
                        const { start, end } = bodypoints[part]
                        // 定义点的坐标和颜色
                        const points = [{ x: start.x * scaleFactor, y: start.y * scaleFactor }, { x: end.x * scaleFactor, y: end.y * scaleFactor }]
                        // eslint-disable-next-line no-unused-vars
                        const pointColor = 'red'

                        // 在图片上打点
                        points.forEach(point => {
                            ctx.beginPath()
                            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
                            // ctx.fillStyle = pointColor;
                            // ctx.fill();
                            ctx.closePath()
                        })

                        // 定义线的起点和终点
                        const lineStart = points[0]
                        const lineEnd = points[1]
                        const lineColor = '#FFFFFF'

                        // 在图片上画线
                        ctx.beginPath()
                        ctx.moveTo(lineStart.x, lineStart.y)
                        ctx.lineTo(lineEnd.x, lineEnd.y)
                        ctx.strokeStyle = lineColor
                        ctx.lineWidth = 1
                        ctx.stroke()
                        ctx.closePath()
                    }
                }

            }
        },
        waistassessment(obj) {
            console.log('================3232')
            console.log(obj)
            console.log('================323232')
            if ((obj.value < 0.85 && obj.gender === 1) || (obj.value < 0.75 && obj.gender === 2)) {
                this.tishi = '腰臀比低于正常范围，可能存在营养不良或其他疾病风险。'
                this.jianyi = '建议进行物理塑形干预1~2个疗程以上，促进胶原蛋白再生，恢复肌肤弹性。同时增加优质蛋白质和健康脂肪的摄入，并结合力量训练和有氧运动。'
            } else if ((obj.value >= 0.85 && obj.gender === 1 && obj.value <= 0.9) || (obj.value >= 0.75 && obj.gender === 2 && obj.value <= 0.8)) {
                this.tishi = '腰臀比在正常范围，健康风险较低。'
                this.jianyi = '建议进行周期性物理塑性干预以更好地保持身材，同时维持健康饮食，定期锻炼。'
            } else {
                this.tishi = '腰臀比超过正常范围，健康风险较高。'
                this.jianyi = '建议进行较长周期疗程的物理塑形干预，塑形紧致身材，再生胶原蛋白。减少高热量食物，增加膳食纤维，并加强有氧运动和核心训练。'
            }
        }
    }
}
</script>

<style lang="less">
.waist-main {
    .score-view {
        font-family: OPPOSans M;
        font-weight: 500;
        font-size: 24px;
        color: #333333;
        line-height: 32px;
        text-align: left;
        font-style: normal;
        margin: 10px 0;
    }

    .score-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: OPPOSans M;
        font-weight: 500;
        font-size: 24px;
        color: #333333;
        line-height: 32px;
        font-style: normal;
        margin: 10px 0;
        border-bottom: 1px solid rgba(151, 151, 151, 0.3);
        padding-bottom: 10px;

        .score-left {
            flex: 1;
            text-align: left;
        }

        .score-right {
            flex: 1;
            text-align: right;
        }
    }

    .score {
        font-family: OPPOSans M;
        font-weight: 500;
        font-size: 24px;
        color: #333333;
        line-height: 32px;
        text-align: left;
        font-style: normal;
        margin: 10px 0;
    }
}

.waist-item1 {
    width: 863px;
    position: relative;
}

.waist-left {
    width: 400px;
    height: auto;
    margin-top: 0px;

    .tipss {
        font-size: 12px;
        font-family: OPPOSans R, OPPOSans;
        font-weight: normal;
        color: #9b9b9b;
        line-height: 18px;
    }

    .model {
        width: 400px;
        border: 1px solid #009fe8;
        font-family: OPPOSans M, OPPOSans;
        font-weight: normal;
        position: relative;

        .model-left-tittle {
            position: absolute;
            top: 42px;
            left: 6px;
            font-size: 15px;
            font-family: OPPOSans R, OPPOSans;
            font-weight: normal;
            color: #666666;
            line-height: 20px;
        }

        .title {
            font-size: 12px;
            color: #666666;
            line-height: 35px;
            height: 35px;
            display: flex;
            justify-content: space-around;
            text-align: center;
            margin: 0;
            border-bottom: 1px solid #009fe8;
            background: #f2f8ff;

            span {
                min-width: 160px;
                height: 24px;
                line-height: 35px;
                font-size: 12px;
                font-family: "OPPOSans M", "Noto Kufi Arabic SemiBold";
                font-weight: normal;
                color: #666666;
                border: none;

                &.new-user {
                    min-width: auto;
                }
            }
        }

        .new-img {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: url("../../assets/images/new_girth_111.svg") no-repeat;
            // background-size: 100% 100%;
            background-size: cover;
            width: 426px;
            height: 487px;

            div {
                width: 160px;
                ;
                display: flex;
                justify-content: center;
            }

            img {
                height: 220px;
            }

            .get-error-model {
                margin-top: 28px;
                margin-right: 37px;
            }

            .failed-model {
                width: 50px;
                margin-right: 37px;
                margin-top: 5px;
            }
        }

        .img {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: url("../../assets/images/girth.svg") no-repeat;
            // background-size: 100% 100%;
            background-size: cover;
            width: 400px;
            height: 275px;

            div {
                width: 160px;
                ;
                display: flex;
                justify-content: center;
            }

            img {
                height: 220px;
            }

            .get-error-model {
                margin-top: 28px;
                margin-right: 37px;
            }

            .failed-model {
                width: 50px;
                margin-right: 37px;
                margin-top: 5px;
            }
        }
    }

    .model:nth-child(2),
    .model:nth-child(3) {
        margin-top: 11px;
    }
}

.waist-right {
    width: 450px;
    position: absolute;
    top: 0;
    right: 0;

    .girth-title1 {
        position: relative;
        top: 0;
        height: 53px;

        h2,
        p {
            display: inline-block;
        }

        h2 {
            font-size: 25px;
            font-family: OPPOSans M, OPPOSans;
            font-weight: normal;
            color: #333333;

            .unit {
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #9b9b9b;
                line-height: 21px;
                font-style: normal;
            }
        }

        .tips {
            span {
                min-width: 50px;
                height: 18px;
                background: #009fe8;
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #ffffff;
                line-height: 16px;
                padding: 0 3px;
                margin-left: 24px;
            }
        }

        .tipss {
            margin-left: 108px;
            font-size: 12px;
            font-family: OPPOSans R, OPPOSans;
            font-weight: normal;
            color: #9b9b9b;
            line-height: 18px;

            span {
                min-width: 50px;
                height: 18px;
                background: #009fe8;
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #ffffff;
                line-height: 16px;
                padding: 0 3px;
                margin-left: 24px;
            }
        }
    }

    .girth-part {
        width: 100%;

        table {
            margin-top: 0px;
            height: 310px;

            thead {
                tr {
                    height: 36px;
                    font-size: 12px;
                    font-family: OPPOSans M, OPPOSans;
                    color: #666666;
                    line-height: 16px;

                    th {
                        text-align: left;

                        &:first-of-type {
                            width: 83px;
                        }

                        &:first-child {
                            width: 113px;
                            padding-left: 31px;
                        }
                    }
                }
            }

            tbody {
                tr {
                    height: 80px;
                    border-bottom: 1px solid #ced7e0;

                    td {
                        &:first-child {
                            padding-left: 31px;
                        }

                        text-align: left;
                        font-size: 15px;
                        font-family: OPPOSans M;
                        font-weight: 500;
                        line-height: 20px;
                        color: #333333;

                        &:nth-child(2n),
                        &:nth-child(3n) {
                            font-size: 12px;
                            font-family: OPPOSans-B, OPPOSans;
                            font-weight: normal;
                            color: #5698f5;
                            line-height: 19px;
                        }
                    }

                    &:last-child {
                        border-bottom: 1px solid #009fe8;
                    }
                }
            }
        }
    }
}

.girth-bottom {
    margin-top: 10px;

    .girth-title1 {
        position: relative;
        top: 0;
        height: 53px;

        h2,
        p {
            display: inline-block;
        }

        h2 {
            font-size: 25px;
            font-family: OPPOSans M, OPPOSans;
            font-weight: normal;
            color: #333333;

            .unit {
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #9b9b9b;
                line-height: 21px;
                font-style: normal;
            }
        }

        .tips {
            span {
                min-width: 50px;
                height: 18px;
                background: #009fe8;
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #ffffff;
                line-height: 16px;
                padding: 0 3px;
                margin-left: 24px;
            }
        }

        .tipss {
            margin-left: 108px;
            font-size: 12px;
            font-family: OPPOSans R, OPPOSans;
            font-weight: normal;
            color: #9b9b9b;
            line-height: 18px;

            span {
                min-width: 50px;
                height: 18px;
                background: #009fe8;
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #ffffff;
                line-height: 16px;
                padding: 0 3px;
                margin-left: 24px;
            }
        }
    }

    .girth-part {
        width: 100%;

        table {
            margin-top: 0px;
            height: 160px;

            thead {
                tr {
                    height: 36px;
                    font-size: 12px;
                    font-family: OPPOSans M, OPPOSans;
                    font-weight: normal;
                    color: #666666;
                    line-height: 16px;

                    th {
                        text-align: left;

                        &:first-of-type {
                            width: 83px;
                        }

                        &:first-child {
                            width: 203px;
                            padding-left: 31px;
                        }
                    }
                }
            }

            tbody {
                tr {
                    height: 40px;
                    border-bottom: 1px solid #ced7e0;

                    td {
                        &:first-child {
                            padding-left: 31px;
                        }

                        text-align: left;
                        font-size: 15px;
                        font-family: OPPOSans M;
                        font-weight: 500;
                        line-height: 20px;
                        color: #333333;

                        &:nth-child(2n),
                        &:nth-child(3n) {
                            font-size: 12px;
                            font-family: OPPOSans-B, OPPOSans;
                            font-weight: normal;
                            color: #5698f5;
                            line-height: 19px;
                        }
                    }

                    &:last-child {
                        border-bottom: 1px solid #009fe8;
                    }
                }
            }
        }
    }
}

.girth-part {
    width: 100%;

    table {
        margin-top: 0px;

        thead {
            tr {
                height: 36px;
                font-size: 12px;
                font-family: OPPOSans M, OPPOSans;
                font-weight: normal;
                color: #666666;
                line-height: 16px;

                th {
                    text-align: left;

                    &:first-of-type {
                        width: 83px;
                    }

                    &:first-child {
                        width: 83px;
                        padding-left: 31px;
                    }
                }
            }
        }

        tbody {
            tr {
                height: 40px;
                border-bottom: 1px solid #ced7e0;

                td {
                    &:first-child {
                        padding-left: 31px;
                    }

                    text-align: left;
                    font-size: 15px;
                    font-family: OPPOSans M;
                    font-weight: 500;
                    line-height: 20px;
                    color: #333333;

                    &:nth-child(2n),
                    &:nth-child(3n) {
                        font-size: 12px;
                        font-family: OPPOSans-B, OPPOSans;
                        font-weight: normal;
                        color: #5698f5;
                        line-height: 19px;
                    }
                }

                &:last-child {
                    border-bottom: 1px solid #009fe8;
                }
            }
        }
    }
}

.waist-item2 {
    display: flex;
    width: 100%;
    height: 190px;
    border: 1px solid #009FE8;
    margin-top: 10px;
    position: relative;

    .canvas-font1 {
        position: absolute;
        top: 45%;
        left: 15px;
        font-size: 12px;
    }

    .canvas-font2 {
        position: absolute;
        top: 16%;
        left: 15px;
        font-size: 12px;
    }

    .zhanwei {
        width: 60px;
        height: 200px;
    }

    .waist-box-item {
        width: 33%;
        height: 100%;
        position: relative;

        .canvas-title {
            font-family: OPPOSans M;
            font-weight: 500;
            font-size: 12px;
            color: #333333;
            line-height: 16px;
            text-align: center;
            font-style: normal;
            margin: 10px 0;
        }

        .canvas-font1 {
            position: absolute;
            top: 45%;
            left: 10%;
            font-size: 12px;
        }

        .canvas-font2 {
            position: absolute;
            top: 16%;
            left: 10%;
            font-size: 12px;
        }

        .custom-bullet-list {
            list-style-type: disc;
            /* 确保使用小圆点 */
            padding-left: 40%;
            /* 根据需要调整缩进 */
            margin: 0;
        }
    }
}

.custom-bullet-list li:first-child::marker {
    color: #FF0000;
    /* 设置小圆点的颜色 */
}

.custom-bullet-list li:last-child::marker {
    color: #5698F5;
    /* 设置小圆点的颜色 */
}

.custom-bullet-list li:first-child {
    font-family: OPPOSans M;
    font-weight: 500;
    font-size: 12px;
    color: #FF0000;
    line-height: 16px;
    text-align: left;
    font-style: normal;
}

.custom-bullet-list li:last-child {
    color: #5698F5;
    /* 设置小圆点的颜色 */
    font-family: OPPOSans M;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: left;
    font-style: normal;
    margin-top: 10px;
}

.waist-item3 {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .waist-box {
        width: 49%;
    }
}

.waist-item4 {
    height: 115px;
    border: 1px solid #009FE8;
    margin-top: 15px;
    padding: 18px;

    .biaoti {
        font-family: OPPOSans M;
        font-weight: 500;
        font-size: 15px;
        color: #333333;
        line-height: 20px;
        text-align: left;
        font-style: normal;
        margin: 0;
        margin-bottom: 10px;
    }

    .p {
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 12px;
        color: #666666;
        line-height: 16px;
        text-align: left;
        font-style: normal;
        margin: 0;
        margin-bottom: 20px;
    }
}

.unit {
    font-family: OPPOSans, OPPOSans;
    font-weight: normal;
    font-size: 14px;
    color: #999999;
    line-height: 18px;
    text-align: left;
    font-style: normal;
}

.center {
    text-align: center !important;
}

.duibi {
    height: 20px;
    font-family: OPPOSans, OPPOSans;
    font-weight: normal;
    font-size: 14px;
    color: #666666;
    line-height: 42px;
    text-align: right;
    font-style: normal;
    padding-left: 20px;

    .duinum {
        width: 50px;
        height: 20px;
        background-color: #B4D1F6;
        padding: 1px 8px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 12px;
        color: #131724;
        line-height: 16px;
        text-align: center;
        font-style: normal;
    }
}
@media screen and (max-width: 768px) {
    .waist-main {
        .score-container {
            flex-direction: column;
            align-items: flex-start;
            line-height: 30px;

            .score-right {
                text-align: left;
                margin-top: 5px;
            }
        }
    }
}

</style>
