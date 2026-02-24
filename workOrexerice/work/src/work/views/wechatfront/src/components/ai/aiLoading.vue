<template>
    <div class="ai-loading">
        <div class="header-menu">
            <span>
                <i class="el-icon-arrow-left" @click.prevent="goBack()"></i>
            </span>
        </div>
        <div class="loading" v-if="loading === 0">
            <img src="../../assets/images/loading-kuafu.png" alt />
            <p>加载中，请稍等…</p>
        </div>
        <div class="loading-error" v-else>
            <img src="../../assets/images/ai-error.png" alt />
            <div>报告加载失败</div>
            <p>很抱歉给您带来不便，请稍后重试</p>
        </div>

        <img src="../../assets/images/ai-kuafu.png" class="ai-kuafu" alt />
    </div>
</template>

<script>
import { solutions, findScanTypeInfo } from '@/assets/js/apolloGql.js'

export default {
    props: {
        aiData: Object,
    },
    data() {
        return {
            getTimer: null,
            loading: 0, // 加载状态，0-加载中 1-加载失败
        }
    },
    created() {
        if (
            this.aiData &&
            this.aiData.abnormalConclusionInterpret === '1' &&
            this.aiData.abnormalOutlineInterpret === '1'
        ) {
            // 解读成功
            this.goAi(this.aiData.url)
        } else if (
            this.aiData &&
            (this.aiData.abnormalConclusionInterpret === '4' ||
                this.aiData.abnormalOutlineInterpret === '4')
        ) {
            // 解读失败
            this.loading = 1
        } else if (
            this.aiData &&
            (this.aiData.abnormalConclusionInterpret === '-1' ||
                this.aiData.abnormalOutlineInterpret === '-1')
        ) {
            // 解读中，每2s，再次获取解读状态
            this.getTimer = setTimeout(() => {
                this.getAiStatus()
            }, 2000)
        } else {
            // 请求接口，发起ai解读
            this.goSolutions()
        }
    },
    beforeDestroy() {
        clearInterval(this.getTimer)
    },
    methods: {
        goBack() {
            this.$emit('goBack')
        },
        // ai 异常解读
        async goSolutions() {
            this.$apollo
                .mutate({
                    mutation: solutions,
                    variables: {
                        scanId: this.aiData.scanId,
                    unit: 'metric',
                    lang: window.localStorage.getItem('lang'),
                    },
                })
                .then((res) => {
                    const data = res.data.solutions
                    if (data.code === 200) {
                        // 解读完成
                        this.goAi(this.aiData.url)
                    } else {
                        // 解读失败
                        this.loading = 1
                    }
                })
        },
        async getAiStatus() {
            const scanResult = await this.$apollo.query({
                query: findScanTypeInfo,
                fetchPolicy: 'network-only',
                variables: {
                    scanId: this.aiData.scanId,
                    unit: window.localStorage.getItem('unit'),
                    lang: window.localStorage.getItem('lang'),
                },
            })

            const scanResultData = scanResult.data.findScanTypeInfo
            if (scanResultData.data.abnormalKeywordInterpret === '1') {
                // 解读成功
                this.goAi(scanResultData.data.aiUrl)
                clearInterval(this.getTimer)
            } else if (scanResultData.data.abnormalKeywordInterpret === '4') {
                // 解读失败
                this.loading = 1
                clearInterval(this.getTimer)
            }
        },
        goAi(url) {
            let goUrl = url
            if (this.aiData.statue) {
                goUrl = `${url}&toPage=train#/pages/aiReport/train`
            }
            setTimeout(() => {
                this.$emit('goAi', goUrl)
            }, 1500)
        }
    },
}
</script>

<style lang="less" scoped>
.ai-loading {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #FFFFFF url(../../assets/images/ai-bg.png);
    background-size: 100% 100%;

    .header-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 15px;
        width: 100%;
        top: 0;
        z-index: 100;

        > span {
            .el-icon-arrow-left {
                display: block;
            }
        }
    }

    .loading {
        margin-top: 219px;

        img {
            width: 128px;
        }

        p {
            margin: 18px 0 0 0;
            text-align: center;
            font-weight: bold;
            font-size: 13px;
            color: #333333;
            line-height: 18px;
        }
    }

    .loading-error {
        margin-top: 182px;

        img {
            width: 177px;
        }

        div {
            margin: 24px 0 0 0;
            text-align: center;
            font-weight: bold;
            font-size: 13px;
            color: #333333;
            line-height: 18px;
        }

        p {
            margin: 12px 0 0 0;
            text-align: center;
            font-size: 13px;
            color: #7a8aa6;
            line-height: 18px;
        }
    }

    .ai-kuafu {
        position: fixed;
        width: 115px;
        bottom: 48px;
        left: 50px;
        margin-left: 57.5px;
    }
}
</style>
