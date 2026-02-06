<template>
    <div class="task-list">
        <!-- <el-button @click="testToast">测试弹窗</el-button> -->
        <el-container class="task-content">
            <el-main class="list-main scrollbar">
                <div class="task-list-empty" v-if="scanList.length === 0">还没有新任务</div>
                <div class="list-content" v-else>
                    <div class="task-table">
                        <el-table :data="scanList" :header-cell-style="{ background: '#F5F6FA' }" highlight-current-row
                            ref="taskTable" :stripe="true">
                            <el-table-column class-name="scan-time" label="扫描时间" prop="scanTime"
                                width="240"></el-table-column>
                            <el-table-column label="测量序号" prop="reptId" class-name="scan-id">
                                <template slot-scope="scope">{{ completeReptId(scope.row.reptId) }}</template>
                            </el-table-column>
                            <el-table-column label="扫描项目1" v-if="isVAPro3 || isVAPro5">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.girthMeasure === 1 && scope.row.scanMode && (scope.row.nutrition
                                        === 0 || scope.row.nutrition === 1) ?
                                        "无电流营养分析" : "--" }}</span>
                                </template>
                            </el-table-column>
                            <!-- 身体成分 -->
                            <el-table-column v-if="isVAPro5 || isVAPro7" :label="isVAPro5 ? '扫描项目2' : '扫描项目1'">
                                <template slot-scope="scope">{{ scope.row.biaMeasure === 1 ?
                                    "身体成分" : "--" }}</template>
                            </el-table-column>
                            <el-table-column
                                :label="isVAPro3 ? '扫描项目2' : isVAPro5 ? '扫描项目3' : isVAPro7 ? '扫描项目2' : '扫描项目1'">
                                <template slot-scope="scope">
                                    <span v-if="!isVAPro3 && !isVAPro5 && !isVAPro7">{{ scope.row.biaMeasure === 1 ?
                                        "身体成分" : "--" }}</span>
                                    <span v-else>
                                        {{ scope.row.girthMeasure === 1 ?
                                            "体围测量" : "--" }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="!isVE260"
                                :label="isVAPro3 ? '扫描项目3' : isVAPro5 ? '扫描项目4' : isVAPro7 ? '扫描项目3' : '扫描项目2'">
                                <template slot-scope="scope">{{ scope.row.staticEval === 1 ?
                                    "体态评估" : "--" }}</template>
                            </el-table-column>
                            <!-- 肩部功能 -->
                            <el-table-column
                                v-if="(reportMode.indexOf('009') > 0 || !isVAPro5) && !isVAPro7 && !isVE260"
                                :label="isVAPro3 ? '扫描项目4' : isVAPro5 ? '扫描项目5' : '扫描项目3'">
                                <template slot-scope="scope">{{ scope.row.bsShoulderStatus === 1 ?
                                    "肩部功能" : "--" }}</template>
                            </el-table-column>
                            <!-- 脊柱报告 -->
                            <el-table-column
                                v-if="userInfo && userInfo.spineReportEnabled === 1 && !((reportMode.indexOf('009') > 0 || !isVAPro5) && !isVAPro7 && !isVE260) && !isVE260"
                                :label="isVAPro3 ? '扫描项目4' : isVAPro5 ? '扫描项目5' : isVAPro7 ? '扫描项目4' : '扫描项目3'">
                                <template slot-scope="scope">{{ scope.row.staticEval === 1 && scope.row.spineReport === 1 ?
                                    "脊柱报告" : "--" }}</template>
                            </el-table-column>
                            <el-table-column
                                v-if="userInfo && userInfo.spineReportEnabled === 1 && (reportMode.indexOf('009') > 0 || !isVAPro5) && !isVAPro7 && !isVE260"
                                :label="isVAPro3 ? '扫描项目5' : isVAPro5 ? '扫描项目6' : '扫描项目4'">
                                <template slot-scope="scope">{{ scope.row.spineReport === 1 ?
                                    "脊柱报告" : "--" }}</template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" min-width="120">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="bindUsrModel(scope.row)">
                                        <img src="@/assets/images/icon/link_white.svg" alt />
                                        用户信息绑定
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
                <!-- 分页 当前扫描列表不为空或只有1页时显示分页 -->
                <el-pagination :current-page="page" :page-size="take" :total="pagination.totalItems"
                    @current-change="handlePageChange" background layout="prev, pager, next, total"
                    v-if="scanList.length !== 0 && pagination.totalPages !== 1"></el-pagination>
                <!-- 用户信息绑定弹窗 -->
                <CreateUser :usr-form="usrForm" :bind-usr-visible="bindUsrVisible" @refresh-list="getBindList"
                    @close-dialog="closeDialog" />
            </el-main>
        </el-container>
    </div>
</template>
<script type="text/ecmascript-6">
import { findBindTaskList } from '@/assets/js/apolloGql.js'
import CreateUser from './components/create-user.vue'
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'
// import Toasted from 'vue-toasted'
import { isVAPro3, isVAPro5, isVAPro7, isVE260 } from '@/types/device.js'
export default {
    name: 'BindList',
    components: { CreateUser },
    filters: {},
    data() {
        return {
            page: 1, // 当前页数
            take: 10, // 每页显示数据个数
            // 分页信息
            pagination: {},
            userTokens: JSON.parse(localStorage.getItem('userTokens')),
            lastScanTime: 0, // 最后测试时间
            newScanInter: '',
            scanList: [],
            // 绑定用户弹窗
            bindUsrVisible: false,
            // 绑定用户信息
            usrForm: {
                mobile: '', // 绑定方式必须有一个
                name: '',
                sex: 1,
                height: '',
                birthday: '',
                fatherHeight: '',
                motherHeight: '',
                // 是否同意协议
                agreement: false,
                scanTime: '',
            },
            newScanCount: null,
            toast: null,
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro7: isVAPro7(),
            isVE260: isVE260(),
            reportMode: window.localStorage.getItem('reportMode')
        }
    },
    computed: {
        ...mapState(['newCount', 'userInfo']),
    },
    watch: {
        newCount(val) {
            if (val.bindList !== this.newScanCount && val.bindList > 0) {
                this.newMessageNotification(val.bindList)
            }
            this.newScanCount = val.bindList
        }
    },
    mounted() {
        this.$eventBus.$emit('getBindTaskCount', {
            count: 0,
        })
        this.getBindList()
        this.$eventBus.$on('changeRouter', routeName => {
            if (routeName === 'Custom') {
                this.getBindList()
            }
        })
    },
    beforeDestroy() {
        // 移除定时
        if (this.newScanInter) {
            clearInterval(this.newScanInter)
        }
    },
    methods: {
        ...mapMutations(['REPORT_COUNT']),
        newMessageNotification(data) {
            if (this.toast !== null) {
                this.toast.goAway(0)
                this.toast = null
            }
            this.toast = this.$toasted.show('+', {
                theme: 'toasted-primary',
                position: 'top-center',
                duration: 60000,
                action: {
                    text: ` 发现${data}份报告`,
                    onClick: (e, toastObject) => {
                        console.log('点击按钮')
                        toastObject.goAway(0)
                        this.loadNewList()

                        // do something
                    }
                }
            })
        },
        // 查询任务列表
        getBindList() {
            if (this.toast !== null) {
                this.toast.goAway(0)
                this.toast = null
            }
            const startDate = moment().subtract(1, 'year').format('yyyy-MM-DD HH:mm:ss')
            const endDate = moment().format('yyyy-MM-DD HH:mm:ss')
            console.log(`获取到时间数据${startDate} ${endDate}`)
            let params = {
                page: this.page,
                take: this.take,
                startDate: startDate,
                endDate: endDate
            }
            this.$apollo
                .query({
                    query: findBindTaskList,
                    variables: params,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBindTaskList
                    if (data && data.code === 200) {
                        if (data.data) {
                            this.scanList = JSON.parse(JSON.stringify(data.data))
                            this.$store.dispatch('resetNewCount')
                            this.pagination = data.pagination
                            this.unit = window.localStorage.getItem('unit')
                            if (this.scanList.length !== 0) {
                                // 最新一组扫描时间对比 大于当前查询时间
                                let date = new Date(this.scanList[0].scanTime).getTime()
                                if (date > this.lastScanTime) {
                                    this.getLinsterScan(date)
                                } else {
                                    console.log(`判断不需要更新时间戳，沿用之前时间 ${date}  ${this.lastScanTime}`)
                                }
                                // 列表为空时
                            } else {
                                // 如果当前查询时间为0 即首次进入
                                this.getLinsterScan(new Date().getTime())
                            }
                        }
                    }
                })
        },
        getLinsterScan(time) {
            console.log(`启动循环获取最新报告数量${time}`)
            this.$eventBus.$emit('getLastDataTime', {
                time: time,
            })
            this.lastScanTime = time
        },
        completeReptId(str) {
            if (str.length === 1) {
                return `00${str}`
            } else if (str.length === 2) {
                return `0${str}`
            } else {
                return str
            }
        },
        // 分页改变
        handlePageChange(val) {
            this.page = val
            this.getBindList()
        },
        // 打开用户绑定弹窗
        bindUsrModel(data) {
            // this.newMessageNotification(10)
            this.usrForm.mobile = ''
            this.usrForm.id = null
            this.usrForm.name = ''
            this.usrForm.height = ''
            this.usrForm.fatherHeight = ''
            this.usrForm.motherHeight = ''
            this.usrForm.birthday = ''
            this.usrForm.agreement = false
            this.usrForm.type = 2

            this.usrForm.scanTime = data.scanTime
            this.usrForm.biaMeasure = data.biaMeasure
            this.usrForm.staticEval = data.staticEval
            this.usrForm.bsShoulderStatus = data.bsShoulderStatus
            this.usrForm.spineReport = data.spineReport
            this.usrForm.scanId = data.scanId
            this.usrForm.girthMeasure = data.girthMeasure
            this.usrForm.scanMode = data.scanMode
            this.usrForm.nutrition = data.nutrition
            this.bindUsrVisible = true
            if (data.height !== 0) {
                this.usrForm.height = data.height
            }
        },
        // 关闭弹窗
        closeDialog() {
            this.bindUsrVisible = false
        },
        // 时间区间改变
        handleTimeChange() {
            this.page = 1
            this.getBindList()
        },
        // 加载新报告
        loadNewList() {
            console.log('刷新数据')
            // this.newScanNum = 0
            this.$store.dispatch('resetNewCount')
            this.page = 1
            if (this.newScanInter) {
                clearInterval(this.newScanInter)
            }
            this.getBindList()
        },
        testToast() {
            this.newMessageNotification(10)
        }
    }
}
</script>
<style scoped lang="less">
.task-list {
    width: 100%;
    height: 100%;
    -webkit-tap-highlight-color: transparent;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    .task-content {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        text-align: left;

        .list-header {
            position: relative;
            display: block;
            width: 100%;
            height: auto !important;
            padding: 28px;
            border-bottom: 1px solid #cdced2;

            /deep/ .el-date-editor {
                width: 220px;
                height: 40px;
                margin-right: 40px;
                background: rgba(245, 246, 250, 1);

                .el-range-input,
                .el-range-separator {
                    color: #9b9b9b;
                    font-size: 12px;
                    background: rgba(245, 246, 250, 1);
                    line-height: 32px;
                }

                .el-range-separator {
                    width: 20px;
                    line-height: 33px;
                }
            }

            /deep/ .el-input {
                height: 40px;
                width: 220px;
                color: #9b9b9b;
                font-size: 12px;
                margin-right: 20px;

                .el-input__inner {
                    background: rgba(245, 246, 250, 1);
                }
            }

            /deep/.input-active {
                .el-input__inner {
                    border-color: #409eff;
                }
            }
        }

        .list-main {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            flex: 1;
            display: block;
            padding: 20px 0 0 0;

            // background: #333;
            // 列表为空
            .task-list-empty {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50%;
                height: 50px;
                line-height: 50px;
                border-width: 2px;
                transform: translate(-50%, -50%);
                text-align: center;
                background: #fff;
                border: 2px dashed #979797;
                color: rgba(0, 159, 232, 1);
            }

            .list-content {
                -webkit-box-flex: 1;
                -ms-flex: 1;
                flex: 1;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                align-items: stretch;
                justify-content: space-around;
                // min-height: calc(100vh - 300px);
            }

            .task-table {
                width: 96%;
                position: relative;
                display: inline-block;
                vertical-align: top;

                // margin: 0 28px;
                /deep/ .el-table__body {
                    background: #f5f6fa;
                    border-collapse: separate;
                    border-spacing: 0 5px;
                    display: table-cell !important;

                    tr.current-row {
                        .cell {
                            background: rgba(0, 159, 232, 0.05);
                            border-radius: 0px;
                        }

                        td {
                            border-top: 1px solid #009FE8 !important;
                            border-bottom: 1px solid #009FE8 !important;

                            &:first-of-type {
                                border-top-left-radius: 4px;
                                border-bottom-left-radius: 4px;
                                border-left: 1px solid #009FE8 !important;
                            }

                            &:last-of-type {
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                                border-right: 1px solid #009FE8 !important;
                            }
                        }
                    }

                    tr {
                        cursor: pointer;

                        td {
                            height: 28px !important;
                            line-height: 28px !important;
                            font-size: 16px;
                            padding: 0 0;

                            &:first-of-type {
                                border-top-left-radius: 4px;
                                border-bottom-left-radius: 4px;
                            }

                            &:last-of-type {
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                            }

                            .cell {
                                border-radius: 0px;
                                line-height: 56px;
                                height: 56px;

                                img {
                                    vertical-align: middle;
                                    margin-top: -2px;
                                }

                                i.type-icon {
                                    position: relative;
                                    display: inline-block;
                                    width: 24px;
                                    height: 24px;
                                    vertical-align: middle;
                                }

                                .not-scan {
                                    background: url('../../assets/images/scanlist/not-scan.svg');
                                }

                                .wait-scan {
                                    background: url('../../assets/images/scanlist/wait-scan.svg');
                                }

                                .scan-success {
                                    background: url('../../assets/images/scanlist/scan-success.svg');
                                }

                                .scan-failure {
                                    background: url('../../assets/images/scanlist/scan-failure.svg');
                                }
                            }
                        }
                    }
                }

                /deep/ .scan-time .cell {
                    padding-left: 30px;
                }

                /deep/ .scan-id .cell {
                    padding-left: 60px;
                }

                .el-button--primary,
                .el-button--warning,
                .el-button--info {
                    padding: 8px 20px 8px 14px;
                }

                /deep/ .el-button--info {
                    background: #e9e9e9;
                    border: 1px solid #e9e9e9;
                    padding: 8px 17px;

                    span {
                        color: #707070;
                    }
                }

                .el-button--text {
                    text-align: left;
                }
            }

            // 合成中动画
            .scan-refresh {
                width: 14px;
                height: auto;
                vertical-align: middle;
                animation: loading-rotate 2s linear infinite;
                margin-right: 2px;

                .path {
                    animation: loading-dash 1.5s ease-in-out infinite;
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: 0;
                    stroke-width: 2;
                    stroke: #ffffff;
                    stroke-linecap: round;
                }
            }

            @keyframes loading-rotate {
                100% {
                    transform: rotate(360deg);
                }
            }

            @keyframes loading-dash {
                0% {
                    stroke-dasharray: 1, 200;
                    stroke-dashoffset: 0;
                }

                50% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -40px;
                }

                100% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -120px;
                }
            }

            // 分页
            .el-pagination {
                text-align: center;
                padding: 20px 0;

                .el-pager {
                    font-weight: normal;

                    .li:not(.disabled).active {
                        background: #f5f6fa;
                    }

                    .number {
                        border: 1px solid red;
                    }
                }
            }
        }
    }
}
</style>
<style lang="less">
.el-select-dropdown {
    .el-scrollbar {

        .el-select-dropdown__wrap,
        .el-select-dropdown__item.selected {
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #5E687B !important;
        }
    }

}

// 日期弹窗
.el-picker-panel {
    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.2);
    // left: 100px !important;
    border-radius: 4px;

    .el-picker-panel__sidebar {
        position: relative;
        width: 100%;
        padding: 10px 0 10px 40px;
        border-radius: 4px 4px 0 0;
        box-shadow: 0 1px 0 0 rgba(215, 215, 218, 1);

        .el-picker-panel__shortcut {
            display: inline-block;
            width: 120px;
        }
    }

    .el-date-range-picker__time-header {
        display: none;
    }

    .el-picker-panel__body {
        margin-left: 0;
    }
}

.toasted-container .toasted {
    padding: 0 12px !important;

    .action {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #FFFFFF !important;
        font-size: 16px;
        line-height: 22px;
    }
}

.toasted.toasted-primary {
    background-color: #009FE8 !important;
}
</style>
