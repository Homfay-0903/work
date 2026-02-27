<!--
 * @Description: 
 * @Author: ouyaping
 * @Date: 2022-10-17 14:08:19
 * @LastEditors: ouyaping
 * @LastEditTime: 2023-11-16 16:41:44
-->
<template>
    <div class="network-report">
        <div class="container">
            <div class="content">
                <!-- 上传速度趋势图 -->
                <div
                    v-if="uploadNum"
                    :class="['dot', uploadNum === totalNum ? 'success' : 'loading']"
                    style="position: absolute; right: 49px; top: 10px"
                ></div>
                <div id="upload"></div>
                <div class="info">
                    <h3>Port</h3>
                    <div v-for="(item, idx) in portsLocal" :key="`port-${idx}`" class="item">
                        <span>{{ item }}</span>
                        <div :class="['dot', ports[idx].result]"></div>
                    </div>

                    <h3>Internet</h3>
                    <div v-for="(item, idx) in domains" :key="`domain-${idx}`" class="item">
                        <span>{{ item.title }}</span>
                        <div :class="['dot', item.result]"></div>
                    </div>

                    <template v-if="obs.info">
                        <h3>
                            EN
                            <div :class="['dot', obs.result]"></div>
                        </h3>
                        <div v-for="(item, idx) in obs.info" :key="`obs-${idx}`" class="item">
                            <span>{{ item.title }}</span>
                            <span>{{ item.value }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
import CONFIG from '@/config/index'
import { _checkPing, _checkPort, _checkDomainAddr, _checkNetwork } from '@/util'
export default {
    name: 'NetworkAnalysis',
    data() {
        return {
            totalNum: 20,
            uploadNum: -1,
            chartData: [],
            pending: false,
            nowSpeed: 0,
            myChart: null,
            timer: null,
            // 需要检测的端口列表
            ports: [],
            portsLocal: ['port1', 'port2', 'port3', 'port4'],
            // 需要检测的域名列表
            domains: [],
            obs: {}
        }
    },
    computed: {
        ...mapGetters(['netSpeedInfo'])
        // 针对网络异常国际话语言样式处理
    },
    watch: {
        'netSpeedInfo.upLoadNetSpeed': {
            handler(val) {
                if (!val.state) {
                    this.controlEventListener(val)
                    this.$store.commit('CHANGE_NET_SPEED_INFO', {
                        upLoadNetSpeed: {
                            ...val,
                            state: true
                        }
                    })
                }
            },
            deep: true
        }
    },
    created() {
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ],
            openNotOperated: false
        })
        if (CONFIG.NETWORK_ANALYSIS.COUNT) {
            this.totalNum = CONFIG.NETWORK_ANALYSIS.COUNT
        }
        this.checkDomainStatus()
        this.checkPort()
        this.checkObsAddr()
    },
    mounted() {
        this.initChart()
        this.addUploadChartData()
        this.reqUploadSpeed()
    },
    beforeDestroy() {
        window.logger.info('退出网络监控清除定时器')
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    methods: {
        // 开启上传定时
        startUploadInterval() {
            this.timer = setInterval(() => {
                if (!this.pending) {
                    this.reqUploadSpeed()
                }
                this.addUploadChartData()
            }, 3000)
        },
        addUploadChartData() {
            const now = new Date()
            const data = {
                name: now.toString(),
                value: [
                    `${now.getFullYear()}/${
                        now.getMonth() + 1
                    }/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
                    this.nowSpeed / 1024
                ]
            }
            console.log('addUploadChartData', data)
            this.chartData.push(data)
            this.myChart.setOption({
                series: [
                    {
                        data: this.chartData
                    }
                ]
            })
        },
        // 发送上传测速请求
        reqUploadSpeed() {
            this.pending = true
            // 上传速度请求
            this.$controlClient.upLoadNetSpeed()
        },
        // 初始化上传图表
        initChart() {
            // 基于准备好的dom，初始化 echarts 实例
            this.myChart = echarts.init(document.getElementById('upload'))
            this.myChart.showLoading({
                text: 'Loading...',
                textStyle: { fontSize: 30, color: '#fff' },
                maskColor: 'rgba(0, 0, 0, 0.8)'
            })
            // 绘制图表
            this.myChart.setOption({
                title: {
                    text: 'Upload Speed (M/s)',
                    textStyle: {
                        fontWeight: 400,
                        fontSize: 20,
                        color: '#ffffff'
                    }
                },
                xAxis: {
                    show: false,
                    type: 'time',
                    // data: new Array(this.num).fill('1'),
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            fontWeight: 400,
                            fontSize: 28,
                            color: '#ffffff'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    max: 7,
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            fontWeight: 700,
                            fontSize: 14
                        }
                    }
                },
                series: [
                    {
                        name: 'Data',
                        type: 'line',
                        showSymbol: false,
                        data: [],
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#104ebb',
                                lineStyle: {
                                    width: 6
                                }
                            }
                        },
                        // 折线线条颜色
                        lineStyle: {
                            normal: {
                                color: '#2ec7c9',
                                lineStyle: {
                                    color: '#2ec7c9'
                                }
                            }
                        },
                        // 区域渐变颜色
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#326280' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#202445' // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    }
                ]
            })
        },
        // 按键事件
        btnClick(btnType) {
            // 返回
            if (btnType === 7) {
                this.$changeViewPage('DeviceSetting')
            }
        },
        // 检测外网域名访问状态
        checkDomainStatus() {
            const domains = CONFIG.NETWORK_ANALYSIS.DOMAINS
            if (domains) {
                window.logger.info('需要检测的域名', domains)
                this.domains = domains.map((item) => {
                    const arr = item.split('.')
                    const name = arr[arr.length - 2]
                    return {
                        domain: item,
                        // 首字母大写
                        title: name.charAt(0).toUpperCase() + name.slice(1),
                        result: 'loading'
                    }
                })
                const obs = CONFIG.NETWORK_ANALYSIS.OBS
                if (obs) {
                    this.domains.push({
                        domain: obs,
                        title: 'OBS',
                        result: 'loading'
                    })
                }
                this.domains.forEach((item, idx) => {
                    _checkPing(item.domain)
                        .then((msg) => {
                            window.logger.info('域名检测结果', item.domain, 'success')
                            window.logger.info(msg)
                            this.domains[idx].result = 'success'
                        })
                        .catch(() => {
                            window.logger.info('域名检测结果', item.domain, 'fail')
                            this.domains[idx].result = 'fail'
                        })
                })
            }
        },
        // 检测服务端口状态
        checkPort() {
            const ports = CONFIG.NETWORK_ANALYSIS.PORTS
            if (ports) {
                window.logger.info('需要检测的服务端口', ports)
                this.ports = ports.map((item) => {
                    const arr = item.split(':')
                    return {
                        domain: arr[0],
                        port: arr[1],
                        result: 'loading'
                    }
                })
                this.ports.forEach((item, idx) => {
                    _checkPort(item.domain, item.port)
                        .then((msg) => {
                            const result = msg.indexOf('^]') > -1 ? 'success' : 'fail'
                            window.logger.info('服务端口检测结果', item.domain, item.port, msg, result)
                            this.ports[idx].result = result
                        })
                        .catch(() => {
                            window.logger.info('域名检测结果', item.domain, 'fail')
                            this.ports[idx].result = 'fail'
                        })
                })
            }
        },
        // 检测对象存储最终访问地址
        checkObsAddr() {
            const obs = CONFIG.NETWORK_ANALYSIS.OBS
            if (obs) {
                this.obs = {
                    result: 'loading',
                    info: []
                }
                _checkDomainAddr(obs)
                    .then((msg) => {
                        window.logger.info('OBS解析结果', msg)
                        this.obs.result = 'success'
                        const answerKey = 'ANSWER SECTION:'
                        const lines = msg.split(';;')
                        const answerStr = lines.find((item) => item.indexOf(answerKey) > -1)
                        if (answerStr) {
                            const dnsStr = answerStr.split(answerKey)[1]
                            const dnsList = dnsStr.trim().split('\n')
                            const lastDns = dnsList[dnsList.length - 1]
                            const info = lastDns.split(' ')
                            const domain = info[0].split('.')[0]
                            const ip = info[info.length - 1]
                            this.obs.info.push({
                                title: 'Node',
                                value: domain
                            })
                            this.obs.info.push({
                                title: 'IP',
                                value: ip
                            })
                        }

                        const timeKey = 'Query time:'
                        const timeStr = lines.find((item) => item.indexOf(timeKey) > -1)
                        if (timeStr) {
                            const time = timeStr.split(timeKey)[1]
                            this.obs.info.push({
                                title: 'Time',
                                value: time.trim()
                            })
                        }

                        const serverKey = 'SERVER:'
                        const serverStr = lines.find((item) => item.indexOf(serverKey) > -1)
                        if (serverStr) {
                            const server = serverStr.split(serverKey)[1]
                            this.obs.info.push({
                                title: 'DNS',
                                value: server.trim()
                            })
                        }
                    })
                    .catch((error) => {
                        window.logger.error('_checkDomainAddr', error)
                        this.obs.result = 'fail'
                    })
                _checkNetwork(obs)
            }
        },
        controlEventListener(data) {
            this.nowSpeed = data.netSpeed
            this.uploadNum++
            window.logger.info(`[network-check]: 第 ${this.uploadNum} 次检测 当前上传网速 ${data.netSpeed}`)
            this.pending = false
            // 第一次检测响应后，开启定时
            if (this.uploadNum === 0) {
                this.myChart.hideLoading()
                this.addUploadChartData()
                this.startUploadInterval()
            } else if (this.uploadNum === this.totalNum) {
                window.logger.info('清除定时')
                clearInterval(this.timer)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.network-report {
    .container {
        position: absolute;
        top: 432px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .content {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            width: 960px;
            font-size: 30px;
            #upload {
                height: 500px;
                width: 960px;
            }
            h3 {
                display: flex;
                justify-content: space-between;
            }
            .info {
                width: 100%;
                text-align: left;
                h3 {
                    font-size: 36px;
                    margin: 60px 0 20px;
                }
                .item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    span {
                        font-size: 30px;
                        color: #999;
                    }
                }
            }

            .dot {
                width: 20px;
                height: 20px;
                border-radius: 50em;
                display: inline-block;
                margin-right: 4px;
                vertical-align: middle;
                &.loading {
                    border: 3px solid #fff;
                    border-bottom-color: #367bf1;
                    -webkit-animation: rotation 1s linear infinite;
                    -moz-animation: rotation 1s linear infinite;
                    -o-animation: rotation 1s linear infinite;
                    animation: rotation 1s linear infinite;
                }

                &.success {
                    background: #2ea33d;
                }
                &.fail {
                    background: #ff3d1f;
                }
            }
        }
    }
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
