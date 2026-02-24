<template>
    <!-- 分享 - 底部 门店信息 -->
    <div class="footer">
        <div class="info" :class="{'long-text': isLongText}">
            <!-- 门店名称 -->
            <p v-if="gymInfo.gymName">
                <img @load="imageLoadedSuc" @error="imageLoadedErr" src="@/assets/images/share/home.png" alt="门店名称" />
                <span>{{ gymInfo.gymName }}</span>
            </p>
            <!-- 咨询电话 -->
            <p v-if="gymInfo.gymPhone">
                <img @load="imageLoadedSuc" @error="imageLoadedErr" src="@/assets/images/share/phone.png" alt="咨询电话" />
                <span>{{ gymInfo.gymPhone }}</span>
            </p>
            <!-- 门店地址 -->
            <p v-if="gymInfo.gymAddr">
                <img @load="imageLoadedSuc" @error="imageLoadedErr" src="@/assets/images/share/map.png" alt="门店地址" />
                <span>{{ gymInfo.gymAddr }}</span>
            </p>
        </div>
        <!-- 公众号二维码 非APP登录且存在二维码-->
        <!-- <div class="qrcode" v-if="isAppLogin !== '1'"> -->
        <!-- <span>长按识别二维码</span> -->
        <!-- 只用一个img是为了避免load重复加载 -->
        <!-- <img @load="imageLoadedSuc" @error="imageLoadedErr" :src="gymInfo.qrcode" alt="公众号二维码">
        </div>-->
    </div>
</template>
<script>
import { findUserInfoByScanId } from '@/assets/js/apolloGql.js'
import { clone } from '@/assets/js/util.js'
// import defaultQrcode from '@/assets/images/share/default_qrcode.jpg'
export default {
    data() {
        return {
            // 本次扫描信息
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            isAppLogin: window.sessionStorage.getItem('isAppLogin'),
            gymInfo: {},
            // 文本过长
            isLongText: false,
            // 维塑二维码
            // defaultQrcode: defaultQrcode,
            // 底部图标加载
            imgLoad: {
                total: 0,
                load: 0
            }
        }
    },
    created() {
        this.getGymInfo()
    },
    methods: {
        // 对于没有二维码的，赋值默认维塑二维码
        // setDefaultQrcode() {
        //     if (!this.gymInfo.qrcode) {
        //         this.gymInfo.qrcode = this.defaultQrcode
        //     }
        // },
        getGymInfo() {
            this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    const data = res.data.findUserInfoByScanId
                    if (data && data.code === 200) {
                        this.gymInfo = clone(data.data)
                        // 如果长文本，字体变小
                        if (this.gymInfo && this.gymInfo.gymName && this.gymInfo.gymAddr) {
                            this.isLongText = this.gymInfo.gymName.length > 25 && this.gymInfo.gymAddr.length > 25
                        } else {
                            this.isLongText = false
                        }

                        if (this.gymInfo.gymName) {
                            this.imgLoad.total++
                        }
                        if (this.gymInfo.gymPhone) {
                            this.imgLoad.total++
                        }
                        if (this.gymInfo.gymAddr) {
                            this.imgLoad.total++
                        }
                    } else {
                        this.dataLoadErr('findUserInfoByScanId')
                    }
                    // this.setDefaultQrcode()
                    // 如果是app对接，发起事件
                    // if (this.isAppLogin !== '1') {
                    //     this.imgLoad.total++
                    // }
                    this.chargeFooterLoaded()
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('findUserInfoByScanId')
                })
        },
        // 判断加载完毕
        chargeFooterLoaded() {
            if (this.imgLoad.load === this.imgLoad.total) {
                this.$nextTick(() => {
                    this.$emit('loadOver', 'footerInfo')
                })
            }
        },
        // 图片加载完回调
        imageLoadedSuc(e) {
            this.imgLoad.load++
            this.chargeFooterLoaded()
        },
        // 图片加载失败
        imageLoadedErr(e) {
            console.error('footerInfo中图片加载失败！失败src:', e.target.src)
            this.$nextTick(() => {
                this.$emit('loadError', 'footerInfo')
            })
        },
        // 接口加载失败
        dataLoadErr(name) {
            console.error('footerInfo中接口加载失败！失败接口:', name)
            this.$nextTick(() => {
                this.$emit('loadError', 'footerInfo')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.footer {
    width: 90%;
    margin: 0 auto;
    // padding-bottom: 20px;
    padding: 10px;
    // padding: 10px 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    max-height: 30vw;

    .info {
        text-align: left;
        // width: calc(100% - 60px);
        width: 100%;
        font-size: 13px;
        color: #ffffff;
        vertical-align: middle;
        display: inline-block;
        margin: 5px 0;

        &.long-text {
            font-size: 10px;
        }
        p {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            img {
                display: inline-block;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                // width: calc(100% - 60px);
                width: 100%;
                vertical-align: middle;
                font-size: 0.9em;
            }
            &:last-of-type {
                margin-bottom: 0px;
            }
        }
        img {
            width: 20px;
            height: 20px;
            margin-right: 4px;
        }
    }
    .qrcode {
        position: relative;
        top: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        span {
            letter-spacing: 0.2vw;
            // position: absolute;
            color: #ffffff;
            font-size: 10px;
            // left: -20px;
            top: 1vw;
            writing-mode: vertical-rl;
            display: inline-block;
            margin-right: 5px;
        }
        img {
            max-width: 80px;
            height: 80px;
            display: inline-block;
        }
    }
}
</style>