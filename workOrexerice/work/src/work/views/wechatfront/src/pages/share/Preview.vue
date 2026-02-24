<template>
    <div class="share-page">
        <!-- 分享 预览 -->
        <div class="share-container">
            <!-- APP登录显示返回按钮 -->
            <div class="share-header-menu" v-if="isAppLogin === '1'">
                <!-- <div class="share-header-menu"> -->
                <div class="go-back">
                    <img @click="goBackStep()" src="@/assets/images/share/icon_arrow_left.svg" alt="返回" />
                </div>
            </div>
            <!-- 分享类型选择 -->
            <ul class="share-type">
                <li :class="{'active': shareType === 1}" @click="changeImgType(1)">简图</li>
                <li
                    :class="{'active': shareType === 2}"
                    @click="changeImgType(2)"
                    v-if="shareModelType !== 'trend'"
                >长图报告</li>
            </ul>
            <!-- 预览图片 -->
            <div :class="['share-image', shareType === 1 ? 'simple' : 'full']" ref="shareImage">
                <template
                    v-if="(shareType === 1 && shareStatus.simple === 1) || (shareType === 2 && shareStatus.full === 1)"
                >
                    <img
                        crossorigin="Anonymous"
                        ref="modelPreviewImage"
                        v-if="(shareType === 1 && shareImage.simple) || (shareType === 2 && shareImage.full)"
                        :src="shareType === 1 ? shareImage.simple : shareImage.full"
                        alt="模型图"
                    />
                    <div class="model-error" v-else>图片生成失败，请刷新页面尝试一下～</div>
                </template>

                <!-- 加载动画 -->
                <div
                    class="loading"
                    v-else-if="(shareType === 1 && shareStatus.simple === -1) || (shareType === 2 && shareStatus.full === -1)"
                >
                    <div class="icon">
                        <img src="@/assets/images/share/loading.svg" alt="加载动画" />
                    </div>图片生成中...
                </div>
                <!-- 图片生成失败 -->
                <p v-else class="model-error">图片生成失败，请刷新页面尝试一下~</p>
            </div>
            <!-- 长图未滚动到底部文案 -->
            <div class="shadow-bg" v-if="shareType !== 1 && !isBottom && shareStatus.full === 1">上滑查看长图</div>
            <p
                v-if="(shareType === 1 && shareStatus.simple === 1) || (shareType === 2 && shareStatus.full === 1)"
            >长按保存图片到本地</p>
        </div>

        <!-- 简图预览图 -->
        <div class="simple-dom" id="simpleDom" ref="simpleDom">
            <header-info @loadOver="loadOver('simple')" @loadError="loadError('simple')"></header-info>
            <!-- 模型对比图片 -->
            <template v-if="shareModelType === 'compare' || shareModelType === 'prediction'">
                <div class="model model-container">
                    <!-- <img class="model-bg-img" :src="modelBgImage" alt="模型背景图"> -->
                    <div class="model-bg-container">
                        <div class="describe-text" v-if="compareData && shareModelType === 'compare'">
                            <div class="left">{{compareData.date}}测量</div>
                            <div class="right">本次测量</div>
                        </div>
                        <div class="describe-text" v-else-if="shareModelType === 'prediction'">
                            <div class="left">预测前</div>
                            <div class="right">预测后</div>
                        </div>
                        <!-- 失败模型 -->
                        <model-error @loadOver="loadOver('simple')" @loadError="loadError('simple')"></model-error>
                    </div>
                    <div class="model-img-container">
                        <img
                            class="model-img"
                            v-if="modelImage"
                            :src="modelImage"
                            @load="loadModelImage('simple')"
                            @error="loadError('simple')"
                            alt="模型对比图片"
                        />
                    </div>
                </div>

                <!-- 身体数据 -->
                <div class="body-data-container">
                    <template v-if="shareModelType === 'compare'">
                        <div class="body-data-list" :key="item.order" v-for="(item, index) in bodyCompare">
                            <div class="data-name">{{ item.name }}</div>
                            <div class="data-value">{{ item.diff }}{{ item.unit }}</div>
                            <div class="split-symbel" v-if="index < bodyCompare.length - 1">|</div>
                        </div>
                    </template>
                    <template v-if="shareModelType === 'prediction'">
                        <div class="body-data-list" :key="item.order" v-for="(item, index) in bodyAdjust">
                            <div class="data-name">{{ item.name }}</div>
                            <div class="data-value">{{ item.data }}{{ item.unit }}</div>
                            <div class="split-symbel" v-if="index < bodyCompare.length - 1">|</div>
                        </div>
                    </template>
                </div>
            </template>

            <!-- 趋势变化 -->
            <div v-if="shareModelType === 'trend'" class="trend-defer-container" ref="trendDeferDom">
                <trend-item :styles="customStyle" :isCompress="isCompress" @loadError="loadError('simple')" ref="trend"></trend-item>
            </div>
            <footer-info @loadOver="loadOver('simple')" @loadError="loadError('simple')"></footer-info>
        </div>

        <!-- 长图预览图 -->
        <div class="full-dom" id="fullDom" v-if="shareModelType !== 'trend'" ref="fullDom">
            <header-info @loadOver="loadOver('full')" @loadError="loadError('full')"></header-info>
            <!-- 模型对比图片 -->
            <div class="model model-container">
                <div class="model-bg-container">
                    <div class="describe-text" v-if="compareData && shareModelType === 'compare'">
                        <div class="left">{{compareData.date}}测量</div>
                        <div class="right">本次测量</div>
                    </div>
                    <div class="describe-text" v-else-if="shareModelType === 'prediction'">
                        <div class="left">预测前</div>
                        <div class="right">预测后</div>
                    </div>
                    <!-- 失败模型 -->
                    <model-error @loadOver="loadOver('full')" @loadError="loadError('full')"></model-error>
                </div>
                <div class="model-img-container">
                    <img
                        class="model-img"
                        :src="modelImage"
                        v-if="modelImage"
                        @load="loadModelImage('full')"
                        @error="loadError('full')"
                        alt="模型对比图片"
                    />
                </div>
            </div>
            <!-- 历史数据对比 -->
            <div class="history-compare-container">
                <div class="history-compare-title">
                    <span v-if="compareData && shareModelType === 'compare'">与{{compareData.date}}对比变化</span>
                    <span v-else-if="shareModelType === 'prediction'">建议调节量</span>
                </div>
                <div class="history-compare-main">
                    <template v-if="shareModelType === 'compare'">
                        <div class="history-data-list" :key="item.order" v-for="item in bodyCompare">
                            <div class="item-info">
                                <div class="item-name">{{item.name}}</div>
                                <div class="item-data">{{ item.diff }}{{ item.unit }}</div>
                            </div>
                            <div class="split-symbel"></div>
                        </div>
                    </template>
                    <template v-if="shareModelType === 'prediction'">
                        <div class="history-data-list" :key="item.order" v-for="item in bodyAdjust">
                            <div class="item-info">
                                <div class="item-name">{{item.name}}</div>
                                <div class="item-data">{{ item.data }}{{ item.unit }}</div>
                            </div>
                            <div class="split-symbel"></div>
                        </div>
                    </template>
                </div>
            </div>
            <!-- 体成分结果 -->
            <bm-data
                v-if="modelInfo.bmBiaScanResult === 1"
                type="body"
                :tcScanDate="tcScanDate"
                :tcScanId="tcScanId"
                @loadError="loadError('full')"
                @loadOver="loadOver('full')"
            ></bm-data>
            <!-- 围度结果 -->
            <bm-data
                v-if="modelInfo.bmBdaScanResult === 1"
                type="girth"
                :tcScanDate="tcScanDate"
                :tcScanId="tcScanId"
                @loadError="loadError('full')"
                @loadOver="loadOver('full')"
            ></bm-data>
            <!-- 体态结果 -->
            <bs-data v-if="modelInfo.bsScanResult === 1" @loadError="loadError('full')" @loadOver="loadOver('full')"></bs-data>
            <footer-info @loadOver="loadOver('full')" @loadError="loadError('full')"></footer-info>
        </div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
// import vConsole from '@/assets/js/vconsole'

// 头部信息组件
import HeaderInfo from '@/components/share/HeaderInfo'
// 底部信息组件
import FooterInfo from '@/components/share/FooterInfo'
// 体测信息组件
import BmData from '@/components/share/BmData'
// 体态信息组件
import BsData from '@/components/share/BsData'
// 失败模型组件
import ModelError from '@/components/share/ModelError'
import TrendItem from '@/components/share/BmTrend'
import { clone, toDecimal2 } from '@/assets/js/util.js'
import { findBmMassQuotaInfos, bodyAdjustInfo } from '@/assets/js/apolloGql.js'

export default {
    components: {
        HeaderInfo,
        FooterInfo,
        BmData,
        BsData,
        TrendItem,
        ModelError
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            isAppLogin: window.sessionStorage.getItem('isAppLogin'),
            // 分享类型
            shareType: 1,
            // 对比信息
            tcScanDate: '',
            tcScanId: '',
            // 对比数据
            bodyCompare: [],
            // 调节数据
            bodyAdjust: [],
            // 上个页面模型图片
            modelImage: window.localStorage.getItem('modelImage'),
            // 上个页面模型失败或背景图
            // modelBgImage: window.localStorage.getItem('modelBgImage'),
            // 体态模型失败情况
            shapeModelInfo: JSON.parse(window.localStorage.getItem('shareModelInfo')),
            // 获取用户基本信息
            userInfo: JSON.parse(window.localStorage.getItem('memberInfo')),
            // 身体比较数据list
            bodyCompareList: JSON.parse(window.localStorage.getItem('bodyCompareList')),
            // 最终要分享的图片
            shareImage: {
                simple: '',
                // 简图模型加载完毕
                simpleModelImgLoad: false,
                full: '',
                // 长图模型加载完毕
                fullModelImgLoad: false
            },
            // 初始值
            initNum: { simple: 2, full: 2 },
            // 已加载完成的组件数
            loadNum: { simple: 0, full: 0 },
            // 图片生成状态
            shareStatus: { simple: -1, full: -1 },
            // 对比数据
            compareData: null,
            // 分享模型类型
            shareModelType: this.$route.params.type,
            trendImage: window.localStorage.getItem('trendImage'),
            scanIds: JSON.parse(window.sessionStorage.getItem('scanIds')),
            // 趋势自定义样式
            customStyle: {
                width: '120vw',
                height: '43vw'
            },
            // 分享截图的趋势图
            isCompress: true,
            // 长图报告是否滚动到底部
            isBottom: false,
            simpleTimeout: null,
            fullTimeout: null
        }
    },
    // 重新加载router
    inject: ['reload'],
    created() {
        this.initData()
        // 监听长图报告滚动到底部
        this.$nextTick(() => {
            const el = this.$refs.shareImage
            // const offsetHeight = el.offsetHeight
            el.onscroll = () => {
                const scrollTop = el.scrollTop
                const scrollHeight = el.scrollHeight
                const clientHeight = el.clientHeight
                this.isBottom = scrollHeight - scrollTop === clientHeight
            }
        })
    },
    mounted() {
        // console.log(vConsole)
        this.$nextTick(() => {
            // 监听挂起 和 呼醒 事件
            document.addEventListener('visibilitychange', this.pageReload, false)
        })
    },
    destroyed() {
        document.removeEventListener('visibilitychange', this.pageReload, false)
    },
    methods: {
        initData() {
            let compareDataStorage = window.sessionStorage.getItem('compareData')
            if (compareDataStorage) {
                this.compareData = JSON.parse(compareDataStorage)
                this.tcScanDate = this.compareData.date
                this.tcScanId = this.shareModelType === 'compare' ? this.compareData.scanId : ''
            }

            // 拿不到缓存模型图片，默认失败
            if (!this.modelImage) {
                this.shapeModelInfo.oldModel = false
                this.shapeModelInfo.newModel = false
                // this.shareStatus.simple = 0
                // this.shareStatus.full = 0
            }

            // 如果趋势
            if (this.shareModelType === 'trend') {
                this.$nextTick(() => {
                    if (this.$refs.trend) {
                        this.$refs.trend.init(this.scanIds)
                    }
                })
            }
            this.$hmt.trackPageview(`/share/${this.shareType === 1 ? 'simple' : 'full'}/${this.shareModelType}`)
            this.getBodyStateData()
            this.getBodyAdjustData()
        },
        // 页面组件重新刷新
        pageReload(e) {
            // eslint-disable-next-line no-undefined
            const docHidden = e.hidden === undefined ? document.hidden : e.hidden
            if (docHidden) {
                // 解决呼醒时白屏闪动
                clearTimeout(this.simpleTimeout)
                clearTimeout(this.fullTimeout)
            } else {
                // 加载失败或者未加载完毕 重新刷新
                if (this.shareModelType === 'trend') {
                    if (this.shareStatus.simple !== 1) {
                        // 刷新router
                        this.reload()
                    }
                } else {
                    if (this.shareStatus.simple !== 1 || this.shareStatus.full !== 1) {
                        // 刷新router
                        this.reload()
                    }
                }
            }
        },
        // 返回上一步
        goBackStep() {
            this.$router.push({
                path: `/share/${this.shareModelType}`
            })
        },
        // 切换图类型
        changeImgType(type) {
            if (this.shareType === type) {
                return
            }
            this.shareType = type
            this.$hmt.trackPageview(`/share/${this.shareType === 1 ? 'simple' : 'full'}/${this.shareModelType}`)
            this.listenImageHeight()
        },
        // 获取体态数据对比
        getBodyStateData() {
            this.$apollo
                .query({
                    query: findBmMassQuotaInfos,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.modelInfo.scanId,
                        tcScanId: this.tcScanId
                    }
                })
                .then(res => {
                    const data = res.data.findBmMassQuotaInfos
                    if (data.code === 200) {
                        const newArray = clone(data.data)
                        this.bodyCompare = []
                        newArray.forEach(value => {
                            // 体重 肌肉量 体脂率
                            if (['WT', 'PBF', 'LM'].indexOf(value.dataColumn) > -1) {
                                let item = {
                                    order: value.order,
                                    name: value.name,
                                    data: toDecimal2(value.latestData.v, 1),
                                    unit: value.unit
                                }
                                if (value.contrastData) {
                                    let diff = value.latestData.v - value.contrastData.v
                                    diff = toDecimal2(diff, 1)
                                    item.diff = diff > 0 ? `+${diff}` : diff
                                } else {
                                    // 无对比数据 及 BIA失败
                                    item.diff = '--'
                                }
                                // 对数据排序
                                this.bodyCompare.push(item)
                            }
                        })
                    }
                })
        },
        // 获取身体调节量
        getBodyAdjustData() {
            this.$apollo
                .query({
                    query: bodyAdjustInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    const data = res.data.bodyAdjustInfo
                    if (data && data.code === 200) {
                        const info = data.data
                        const weight = info.weight > 0 ? `+${toDecimal2(info.weight, 1)}` : toDecimal2(info.weight, 1)
                        const muscle = info.muscle > 0 ? `+${toDecimal2(info.muscle, 1)}` : toDecimal2(info.muscle, 1)
                        const bodyFat =
                            info.bodyFat > 0 ? `+${toDecimal2(info.bodyFat, 1)}` : toDecimal2(info.bodyFat, 1)
                        const adjust = [
                            {
                                order: 1,
                                name: '体重',
                                data: weight,
                                unit: 'kg'
                            },
                            {
                                order: 2,
                                name: '肌肉量',
                                data: muscle,
                                unit: 'kg'
                            },
                            {
                                order: 3,
                                name: '体脂肪',
                                data: bodyFat,
                                unit: 'kg'
                            }
                        ]
                        this.bodyAdjust = adjust
                    }
                })
        },
        // 监听图片生成大小，以便日志监控
        listenImageHeight() {
            setTimeout(() => {
                this.$nextTick(() => {
                    if (this.$refs.modelPreviewImage) {
                        if (this.$refs.shareImage.clientHeight > this.$refs.modelPreviewImage.clientHeight) {
                            console.error('生成图片高度：', this.$refs.modelPreviewImage.clientHeight)
                        }
                    }
                })
            })
        },
        // 模型加载完毕
        modelLoadOver(type) {
            if (type === 'simple') {
                this.shareStatus.simple = 1
            } else {
                this.shareStatus.full = 1
            }
            this.listenImageHeight()
        },
        // 生成图片
        createImage(dom, type) {
            const that = this
            // 防止进入页面后迅速返回报错
            if (!dom) {
                return
            }
            try {
                const toCanvasParam = {
                    backgroundColor: null,
                    useCORS: true,
                    allowTaint: true,
                    removeContainer: true,
                    width: dom.clientWidth - 2,
                    height: dom.clientHeight - 2,
                    y: 0,
                    // 加载图像的超时（以毫秒为单位）。设置 0 为禁用超时。
                    imageTimeout: 60000,
                    ignoreElements: element => {
                        return false
                    }
                }
                html2canvas(dom, toCanvasParam)
                    .then(canvas => {
                        if (type === 'simple') {
                            that.shareImage.simple = canvas.toDataURL('image/png')
                        } else {
                            that.shareImage.full = canvas.toDataURL('image/png')
                        }
                        // 等待重新加载完毕
                        that.modelLoadOver(type)
                    })
                    .catch(err => {
                        console.error('html2canvas:', err)
                        that.modelLoadOver(type)
                    })
            } catch (err) {
                console.error('createImage:', err)
                that.modelLoadOver(type)
            }
        },
        // 组件加载完毕
        loadOver(type) {
            const that = this
            // 如果某组件加载失败，则不绘制图片
            if (this.shareStatus[type] === 0) {
                return
            }

            this.initNum = { simple: 3, full: 3 }

            // 如果是趋势图
            if (this.shareModelType === 'trend') {
                this.initNum.simple--
            }
            if (type === 'simple') {
                this.loadNum.simple++
            } else {
                this.loadNum.full++
            }

            // 长图
            if (this.modelInfo.bmBiaScanResult === 1) {
                this.initNum.full++
            }
            if (this.modelInfo.bmBdaScanResult === 1) {
                this.initNum.full++
            }
            if (this.modelInfo.bsScanResult === 1) {
                this.initNum.full++
            }

            // 错误监控
            if (this.loadNum.simple > this.initNum.simple) {
                console.error('简图监听回调', this.loadNum.simple, this.initNum.simple)
            }
            if (this.loadNum.full > this.initNum.full) {
                console.error('长图监听回调', this.loadNum.full, this.initNum.full)
            }

            if (type === 'simple' && this.loadNum.simple === this.initNum.simple) {
                if (
                    this.shareImage.simpleModelImgLoad ||
                    (!this.shapeModelInfo.oldModel && !this.shapeModelInfo.newModel) ||
                    this.shareModelType === 'trend'
                ) {
                    this.simpleTimeout = setTimeout(() => {
                        this.$nextTick(() => {
                            that.createImage(that.$refs.simpleDom, 'simple')
                        })
                    }, 1000)
                }
            }

            if (type === 'full' && this.loadNum.full === this.initNum.full) {
                if (
                    this.shareImage.fullModelImgLoad ||
                    (!this.shapeModelInfo.oldModel && !this.shapeModelInfo.newModel)
                ) {
                    this.fullTimeout = setTimeout(() => {
                        this.$nextTick(() => {
                            that.createImage(that.$refs.fullDom, 'full')
                        })
                    }, 2000)
                }
            }
        },
        // 组件加载失败
        loadError(type) {
            console.error(type, '某组件加载失败')
            this.shareStatus[type] = 0
        },
        // 监听模型图片加载完毕
        loadModelImage(type) {
            if (type === 'simple') {
                this.shareImage.simpleModelImgLoad = true
                if (this.loadNum.simple === this.initNum.simple) {
                    this.$nextTick(() => {
                        this.createImage(this.$refs.simpleDom, 'simple')
                    })
                }
            } else {
                this.shareImage.fullModelImgLoad = true
                if (this.loadNum.full === this.initNum.full) {
                    this.$nextTick(() => {
                        this.createImage(this.$refs.fullDom, 'full')
                    })
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.share-page {
    position: relative;
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;

    .share-container {
        position: absolute;
        width: 100%;
        min-height: 100%;
        top: 0;
        left: 0;
        z-index: 100;
        background-image: linear-gradient(to bottom, #212340, #05070d);
        // 返回按钮
        .share-header-menu {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 15px;
            padding-bottom: 0;
            position: relative;
            width: 100%;
            top: 0;
            z-index: 1;

            .go-back {
                // position: absolute;
                // top: 20px;
                // left: 20px;
                img {
                    width: 18px;
                    height: 18px;
                }
            }
        }

        // 分享图片类型选择
        .share-type {
            position: relative;
            list-style: none;
            display: block;
            // padding-top: 10px;

            li {
                color: #fff;
                display: inline-block;
                margin: 10px;
                position: relative;
                padding: 8px 20px;

                &::after {
                    content: '';
                    width: 0;
                    height: 2px;
                    background-image: linear-gradient(to right, #00e3c9, #009fe8);
                    position: absolute;
                    left: 100%;
                    bottom: 0;
                    transition: all 0.2s;
                }

                &.active {
                    &::after {
                        width: 100%;
                        left: 0;
                        transition-delay: 0.1s;
                    }
                    & ~ li::after {
                        left: 0;
                    }
                }
            }
        }

        // 卡片
        .share-image {
            // display: none;
            position: relative;
            width: 90vw;
            height: 90vw;
            margin: 20px auto;
            border-radius: 8px;
            border: 1px solid rgba(39, 45, 106, 1);
            box-shadow: 0px 0px 16px 6px #141731;

            img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                // 用于去除多余底边
                margin-bottom: -10px;
            }
            // 加载动画
            .loading {
                position: absolute;
                color: #ffffff;
                font-size: 14px;
                top: 46%;
                left: 50%;
                transform: translate(-50%, -50%);
                .icon {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }
            &.simple {
                overflow: hidden;
            }

            &.full {
                overflow: auto;
                height: 65vh;
            }

            & ~ p {
                position: absolute;
                bottom: 50px;
                width: 100%;
                color: #9b9b9b;
            }
            // 失败文案
            .model-error {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 14px;
            }
        }

        // 上滑查看长图
        .shadow-bg {
            background-color: #05070d;
            color: #9b9b9b;
            position: absolute;
            bottom: 0;
            height: 20vh;
            left: 0;
            right: 0;
            box-shadow: 0px -30px 40px 10px #05070d;
        }
    }
    // 身体数据list
    .body-data-container {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        font-size: 4vw;
        margin: 3vw 0;
        max-height: 20vw;

        .body-data-list {
            display: flex;
            width: 33%;
            justify-content: center;
            position: relative;

            &:last-of-type {
                border-right: none;
            }

            .data-name {
                color: #9b9b9b;
            }

            .data-value {
                color: #ffffff;
                margin-left: 10px;
            }

            .split-symbel {
                position: absolute;
                right: 0;
                color: #4a4a4a;
            }
        }
    }

    // 简图
    .simple-dom {
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 480px;
        height: 480px;
        background: #222444;
        // z-index: 999;

        .model-container {
            background-image: url(../../assets/images/share/bg_model_ground.png);
            background-size: 100% 40px;
            background-position: 0 100%;
            max-height: 70vw;
        }

        .trend-defer-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
        }
    }

    // 长图
    .full-dom {
        // display: none;
        // z-index: 999;
        position: absolute;
        top: 0;
        width: 480px;
        height: auto;
        overflow: hidden;
        background: #222444;

        .model-container {
            background-image: url(../../assets/images/share/shape_floor.png);
            background-size: 100% 190px;
            background-position: 0 100%;
        }

        // 历史对比数据
        .history-compare-container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 20px 0;

            .history-compare-title {
                margin-bottom: 10px;
                font-size: 14px;
                color: #fff;
            }

            .history-compare-main {
                display: flex;
                width: 90%;
                padding: 2px;
                border-radius: 8px;
                border: 1px solid #1894ff;
                overflow: hidden;

                .history-data-list {
                    margin: 0 10px;
                    width: 33%;
                    display: flex;
                    flex-direction: row;
                    margin: 10px 0;

                    &:last-of-type {
                        border-right: none;
                    }

                    .item-info {
                        display: flex;
                        flex-direction: column;
                        width: 100%;

                        .item-name {
                            font-size: 4vw;
                            color: #6e7085;
                        }

                        .item-data {
                            margin-top: 10px;
                            font-size: 4.8vw;
                            color: #009fe8;
                        }
                    }

                    .split-symbel {
                        height: 100%;
                        width: 1px;
                        background-color: #6e7085;
                    }

                    &:last-of-type {
                        .split-symbel {
                            background: none;
                        }
                    }
                }
            }
        }
    }

    .model-container {
        display: flex;
        position: relative;
        justify-content: center;
        background-repeat: no-repeat;

        .model-bg-container {
            .describe-text {
                position: absolute;
                display: flex;
                left: 0;
                width: 100%;
                justify-content: center;
                font-size: 14px;
                color: #9b9b9b;
                text-align: center;

                .left {
                    width: 125px;
                    margin-right: 15px;
                }

                .right {
                    width: 125px;
                    padding-left: 15px;
                }
            }
        }

        .model-bg-img {
            position: absolute;
            left: 0;
            width: 100%;
            height: 70vh;
        }

        .model-img-container {
            height: 75vw;
            // max-height: 280px;
            z-index: 10;

            .model-img {
                height: 100%;
                // width: 80%;
                // height: 60vh;
                // margin-top: 15px;
            }
        }
    }
}
</style>
