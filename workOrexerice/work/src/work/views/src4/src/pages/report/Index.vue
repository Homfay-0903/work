<template>
    <div class="report-preview">
        <div class="report-preview" onselectstart="return false;">
            <div slot="router-view" class="report-content">
                <div class="report-buttons">
                    <el-button round icon="el-icon-back" @click="goBack">返回列表</el-button>
                    <el-button
                        type="primary"
                        class="print-btn"
                        round
                        :class="{'btn-disabled': isDisabled}"
                        :disabled="isDisabled"
                        :loading="btnTxt === '生成中'"
                        @click="printReportPdf"
                    >{{btnTxt}}</el-button>
                </div>
                <div class="report-iframe">
                    <iframe
                        ref="reportView"
                        :src="iframeSrc"
                        frameborder="0"
                        class="iframe-content"
                        scrolling="auto"
                        name="myframe"
                    ></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import { reportUrl } from '@/assets/js/config.js'
import { getReportFileUrl } from '@/assets/js/apolloGql.js'
import { isPrivate } from '@/assets/js/config'

export default {
    data() {
        return {
            iframeSrc: '',
            loading: true,
            loadingStatus: true,
            btnTxt: '生成中',
            isDisabled: false,
            pdfUrl: '',
            isPrivate: isPrivate
        }
    },
    created() {
        setTimeout(() => {
            this.loadingStatus = false
        }, 3000)
        this.isPrintReport()
        const scanId = this.$route.query.scanId
        const token = this.$route.query.token
        // 获取 origin 兼容IE
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
        }
        const origin = window.location.origin
        // 如果没有指定地址 则获取当前访问地址
        const path = reportUrl ? reportUrl : origin
        // 添加是否是单机版 0-false,1-true
        const local = this.isPrivate ? 1 : 0
        this.iframeSrc = `${path}/visbody-report/index.html?scanId=${scanId}&token=${token}&isPrivate=${local}#/report`
    },
    methods: {
        goBack() {
            window.history.go(-1)
        },
        printReportPdf() {
            if (this.btnTxt === '打印报告') {
                this.$hmt.trackEvent('report', 'print')
                window.open(this.pdfUrl)
            }
        },
        // 判断报告是否打印
        isPrintReport() {
            let scanId = this.$route.query.scanId

            this.$apollo
                .query({
                    query: getReportFileUrl,
                    variables: {
                        scanId: scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const result = res.data.getReportFileUrl
                    if (result.code === 200) {
                        this.pdfUrl = result.data
                        axios
                            .get(this.pdfUrl)
                            .then(result => {
                                this.btnTxt = '打印报告'
                                this.isDisabled = false
                            })
                            .catch(error => {
                                this.btnTxt = '打印失败'
                                this.isDisabled = true
                            })
                    } else {
                        this.btnTxt = '打印失败'
                        this.isDisabled = true
                    }
                })
        }
    }
}
</script>

<style lang="less" scoped>
.report-preview {
    position: relative;
    width: 100%;
    height: 100%;

    .report-content {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        display: flex;
        flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        width: 100%;
        height: 100%;
        padding: 20px;
        width: 80%;
        min-width: 1060px;
        margin: 0 auto;

        .report-buttons {
            position: relative;
            height: 40px;
            margin-bottom: 20px;
            text-align: left;
            .print-btn {
                position: absolute;
                right: 0px;
            }
        }

        .btn-disabled {
            background: #dcdfe6;
            border-color: #dcdfe6;
            &:hover {
                background: #dcdfe6;
                border-color: #dcdfe6;
            }
        }

        .report-iframe {
            position: relative;
            padding: 20px;
            background: #ffffff;
            -webkit-flex: 1;
            -ms-flex: 1;
            -webkit-box-flex: 1;
            -moz-box-flex: 1;
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;

            .iframe-content {
                width: 100%;
                height: calc(100% - 4px);
                background-color: #f5f6fa;
                text-align: center;
                -webkit-overflow-scrolling: touch;
            }
        }
    }
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
}

/deep/ .el-icon-loading:before {
    content: "\E61E";
}
</style>
