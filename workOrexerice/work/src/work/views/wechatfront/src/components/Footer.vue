<!--
 * @Description: 账号信息
 * @Author: gaoyuanyuan
 * @Date: 2020-01-06 14:38:20
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-01-16 11:43:02
 -->
<template>
    <div class="footer" :class="isvapro7 ? 'vapro7': ''">
        <div v-if="isShowQrcode" class="qrcode">
            <!-- 没有对接公众号则使用默认二维码 -->
            <img :src="defaultQrcode" v-if="!userInfo.qrcode" />
            <img v-else :src="userInfo.qrcode" />
            <p>{{ tips}}</p>
        </div>
        <div class="info">
            <p>{{ userInfo.gymName }}</p>
            <p>{{ userInfo.gymPhone }}</p>
            <p v-if="isNotCity">{{ userInfo.gymAddr | nameFilter }}</p>
            <p v-else>{{ selectCity | nameFilter}}</p>
            <!-- <p v-else>{{ userInfo.speAddress && userInfo.speAddress.replace(/-/g, '') }}{{ userInfo.gymAddr }}</p> -->
        </div>
    </div>
</template>
<script>
import { findUserInfoByScanId } from '@/assets/js/apolloGql.js'
import { strFilter } from '@/assets/js/util.js'
export default {
    name: 'Footer',
    filters: {
        nameFilter(value) {
            // 截取47个字符
            return strFilter(value, 47)
        }
    },
    props: {
        // 扫描id
        scanId: {
            type: String,
            default: ''
        },
        hideQrCode: {
            type: Boolean,
            default: false
        },
        tips: {
            type: String,
            default: '扫码查看手机版'
        },
        isvapro7: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            userInfo: { },
            selectCity: '',
            isNotCity: true,
            // 默认值
            value: '',
            // 是否是单机版
            isPrivate: false
        }
    },
    computed: {
        defaultQrcode() {
            if (['38', '39'].includes(this.scanId.substring(0, 2))) {
                return require('@/assets/images/qrcode1.jpg')
            } else {
                return require('@/assets/images/qrcode.jpg')
            }
        },
        // 是否显示二维码
        isShowQrcode() {
            if (this.isPrivate || this.hideQrCode) {
                return false
            }
            return true
        }
    },
    created() {
        this.findUserInfoByScanId()
        this.paraMeter()
    },
    methods: {
        paraMeter() {
            const url = window.location.search.split('?')[1].split('&')
            let pointInfo = {}
            url.forEach(el => {
                let key = el.split('=')[0]
                let val = el.substring(el.indexOf('=') + 1)
                pointInfo[key] = val
            })
            this.isPrivate = pointInfo.isPrivate === '1' ? true : false
        },
        isNotSelect(select) {
            return (
                select.province === '' ||
                select.province === '省份' ||
                select.city === '' ||
                select.city === '城市' ||
                select.area === '' ||
                select.area === '区/县名'
            )
        },
        // 获取页脚信息
        async findUserInfoByScanId() {
            await this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.scanId
                    }
                })
                .then(res => {
                    const info = res.data.findUserInfoByScanId
                    const userInfo = info.data
                    if (userInfo && info.code === 200) {
                        this.userInfo = userInfo
                        this.selectCity = userInfo.speAddress.replace(/-/g, '') + userInfo.gymAddr
                        if (userInfo.speAddress) {
                            const data = userInfo.speAddress.split('-')
                            this.selectCity = (data[0] === data[1] || data[1] === '县' || data[1] === '省直辖县') ? `${data[0]}${data[2]}${userInfo.gymAddr}` : `${data[0]}${data[1]}${data[2]}${userInfo.gymAddr}`
                            const select = {
                                province: data[0],
                                city: data[1],
                                area: data[2]
                            }
                            this.isNotCity = this.isNotSelect(select)
                        }
                    }
                })
        }
    }
}
</script>
<style lang="less" scoped>
.footer {
    display: flex;
    justify-content: space-between;
    .qrcode {
        text-align: center;
        img {
            display: block;
            width: 98px;
            height: 98px;
        }
        p {
            margin: 10px 0 0 0;
            font-size: 11px;
            font-family: OPPOSans-R, OPPOSans;
            font-weight: normal;
            color: #333333;
            line-height: 14px;
            width: 78px;
            margin-left: 14px;
        }
    }
    .info {
        width: 150px;
        p {
            margin: 0 0 8px 0;
            font-size: 12px;
            font-family: OPPOSans-R;
            font-weight: normal;
            color: #333333;
            line-height: 14px;
            word-break: break-all;
            &:first-of-type {
                font-family: OPPOSans M;
            }
        }
    }
}
.vapro7 {
    position: relative;
    top: 380px;
}
</style>
