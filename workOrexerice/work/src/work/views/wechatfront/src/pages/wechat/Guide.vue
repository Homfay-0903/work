<template>
    <div class="transfer">
        <div class="header">
            <h1>维塑3D体型追踪仪</h1>
        </div>
        <div class="content">
            <mt-spinner :size="50" color="rgb(100, 100, 100)" type="fading-circle" v-if="loading"></mt-spinner>
            <template v-else>
                <img alt="公众号二维码" :src="qrcode" />
                <p>请长按识别上方二维码</p>
                <p class="tip">关注公众号后查看报告</p>
            </template>
        </div>
        <div class="footer">
            <p>关注后进入公众号，点击公众号底部菜单栏</p>
            <p>
                <span>「查看报告」</span> 进入报告
            </p>
            <svg height="84" viewBox="0 0 301 84" width="301" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fill-rule="evenodd" transform="translate(0 1)">
                    <rect fill="#FFF" height="46" rx="4" width="299" x="1" y="36" />
                    <path
                        d="M0.5,40.0017284 C0.5,37.5163492 2.51669218,35.5 5.00065742,35.5 L295.999343,35.5 C298.485832,35.5 300.5,37.5138386 300.5,40.0017284 L300.5,77.9982716 C300.5,80.4836508 298.483308,82.5 295.999343,82.5 L5.00065742,82.5 C2.51416827,82.5 0.5,80.4861614 0.5,77.9982716 L0.5,40.0017284 Z M1.5,40.0017284 L1.5,77.9982716 C1.5,79.93384 3.06641638,81.5 5.00065742,81.5 L295.999343,81.5 C297.931061,81.5 299.5,79.931328 299.5,77.9982716 L299.5,40.0017284 C299.5,38.06616 297.933584,36.5 295.999343,36.5 L5.00065742,36.5 C3.06893886,36.5 1.5,38.068672 1.5,40.0017284 Z"
                        fill="#D7D7DA"
                        fill-rule="nonzero"
                    />
                    <text
                        fill="#000"
                        font-family=".PingFangSC-Regular, .PingFang SC"
                        font-size="14.165"
                        letter-spacing=".708"
                    >
                        <tspan x="140" y="66">查看报告</tspan>
                    </text>
                    <polygon fill="#D8D8D8" points="291 67 291 75 283 75" />
                    <path
                        d="M26,46 C33.1797017,46 39,51.8202983 39,59 C39,66.1797017 33.1797017,72 26,72 C18.8202983,72 13,66.1797017 13,59 C13,51.8202983 18.8202983,46 26,46 Z M26,47.5294118 C19.664969,47.5294118 14.5294118,52.664969 14.5294118,59 C14.5294118,65.335031 19.664969,70.4705882 26,70.4705882 C32.335031,70.4705882 37.4705882,65.335031 37.4705882,59 C37.4705882,52.664969 32.335031,47.5294118 26,47.5294118 Z M30,62 L30,64.5 L22,64.5 L22,62 L30,62 Z M21.2478388,57.5 L21.2478388,60 L18.7478388,60 L18.7478388,57.5 L21.2478388,57.5 Z M25.2478388,57.5 L25.2478388,60 L22.7478388,60 L22.7478388,57.5 L25.2478388,57.5 Z M29.2478388,57.5 L29.2478388,60 L26.7478388,60 L26.7478388,57.5 L29.2478388,57.5 Z M33.2478388,57.5 L33.2478388,60 L30.7478388,60 L30.7478388,57.5 L33.2478388,57.5 Z M21.2478388,53.25 L21.2478388,55.75 L18.7478388,55.75 L18.7478388,53.25 L21.2478388,53.25 Z M25.2478388,53.25 L25.2478388,55.75 L22.7478388,55.75 L22.7478388,53.25 L25.2478388,53.25 Z M29.2478388,53.25 L29.2478388,55.75 L26.7478388,55.75 L26.7478388,53.25 L29.2478388,53.25 Z M33.2478388,53.25 L33.2478388,55.75 L30.7478388,55.75 L30.7478388,53.25 L33.2478388,53.25 Z"
                        fill="#000"
                    />
                    <path d="M48,44 L48,74" opacity=".3" stroke="#000" stroke-width=".5" />
                    <rect fill="#FFF" height="36" rx="4" width="96" x="126" />
                    <template v-if="!ifDefaultAppId">
                        <path
                            d="M130,-0.5 L218,-0.5 C220.485281,-0.5 222.5,1.51471863 222.5,4 L222.5,32 C222.5,34.4852814 220.485281,36.5 218,36.5 L130,36.5 C127.514719,36.5 125.5,34.4852814 125.5,32 L125.5,4 C125.5,1.51471863 127.514719,-0.5 130,-0.5 Z M130,0.5 C128.067003,0.5 126.5,2.06700338 126.5,4 L126.5,32 C126.5,33.9329966 128.067003,35.5 130,35.5 L218,35.5 C219.932997,35.5 221.5,33.9329966 221.5,32 L221.5,4 C221.5,2.06700338 219.932997,0.5 218,0.5 L130,0.5 Z"
                            fill="#D7D7DA"
                            fill-rule="nonzero"
                        />
                        <text fill="#4A4A4A" font-family="PingFangSC-Regular, PingFang SC" font-size="11.687">
                            <tspan x="135" y="22">Visbody-R 报告</tspan>
                        </text>
                    </template>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import { findUserInfoByScanId } from '@/assets/js/apolloGql.js'
import { qrcodeImg, appId as defaultAppId } from '@/assets/js/config.js'

// 默认二维码
export default {
    data() {
        return {
            // 本次扫描信息
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            // 配置的二维码地址
            cusQrcode: '',
            loading: true,
            defaultQrcode: qrcodeImg,
            appId: window.sessionStorage.getItem('appId')
        }
    },

    computed: {
        qrcode() {
            // 没有配置二维码则使用默认二维码
            return this.cusQrcode ? this.cusQrcode : this.defaultQrcode
        },
        ifDefaultAppId() {
            return this.appId === defaultAppId
        }
    },

    created() {
        this.getGymInfo()
    },

    methods: {
        getGymInfo() {
            this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    this.loading = false
                    const data = res.data.findUserInfoByScanId
                    if (data && data.code === 200) {
                        const info = data.data
                        this.cusQrcode = info.qrcode
                    } else {
                        console.log('err')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>
<style lang="less" scoped>
.transfer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    padding: 0 9vw;
    color: #000000;
    font-size: 3.6vw;
    font-weight: 400;
    background: #ffffff;
    .header {
        text-align: left;
        margin-top: 6.5vw;

        h1 {
            font-size: 4.8vw;
            font-weight: 500;
            line-height: 6.8vw;
            margin-bottom: 6.5vw;
        }
    }

    .content {
        margin-bottom: 15vw;
        p {
            font-size: 4.4vw;
        }
        .tip {
            font-size: 3.8vw;
            color: #9b9b9b;
        }
        h2 {
            font-size: 5vw;
            font-weight: 600;
            line-height: 6.8vw;
            color: #1890ff;
            margin: 5vw 0 1vw 0;
        }
        img {
            width: 36vw;
            margin-bottom: 1vw;
        }
    }

    .footer {
        margin-bottom: 5vw;

        svg {
            width: 100%;
        }
        p {
            color: #9b9b9b;
            &:nth-child(2) {
                margin-bottom: 2vw;
            }
            span {
                color: #1890ff;
            }
        }
    }
}
/deep/.mint-spinner-fading-circle {
    margin: 0 auto;
}
</style>
