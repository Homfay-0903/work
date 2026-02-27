<template>
    <div class="task-list">
        <el-container class="task-content">
            <el-header class="list-header">
                <!-- 日期选择器 -->
                <el-date-picker
                    :class="limitTime === null ? '' : limitTime.length !== 0 ? 'is-active' : ''"
                    :clearable="false"
                    :editable="false"
                    :picker-options="pickerOptions"
                    @change="handleTimeChange"
                    align="right"
                    end-placeholder="结束日期"
                    format="yyyy/MM/dd"
                    prefix-icon="el-icon-date"
                    start-placeholder="开始日期"
                    type="datetimerange"
                    unlink-panels
                    v-model="limitTime"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <!-- 搜索框 -->
                <el-input
                    :class="searchText !== '' ? 'input-active' : ''"
                    @input="handleSearchChange"
                    @keyup.enter="handleSearchChange"
                    clearable
                    :placeholder="searchPlaceholder"
                    suffix-icon="el-icon-search"
                    v-model="searchText"
                ></el-input>
                <!-- 新报告提醒 -->
                <transition name="bounce">
                    <el-button
                        @click="loadNewList"
                        type="primary"
                        v-if="newScanNum !== 0"
                    >+ 发现&nbsp;{{ newScanNum }}&nbsp;份报告</el-button>
                </transition>
               <!-- 提示文案 -->
                <p class="tips">
                    <span>* 只有申请解读的用户才会在本页显示，所有用户报告请跳转至</span>
                    <router-link to="/home" class="btn">报告列表</router-link>
                </p>
            </el-header>
            <el-main class="list-main scrollbar">
                <div class="task-list-empty" v-if="scanList.length === 0">还没有测量用户</div>
                <div class="list-content" v-else>
                    <div class="task-table">
                        <el-table
                            :data="scanList"
                            :header-cell-style="{ background: '#F5F6FA' }"
                            @row-click="taskRowClick"
                            @row-dblclick="taskRowDblClick"
                            highlight-current-row
                            ref="taskTable"
                        >
                            <el-table-column class-name="scan-time" label="扫描时间" prop="scanTime" width="240"></el-table-column>
                            <template v-if="isEduDock">
                                <el-table-column label="姓名" min-width="120" prop="memberName"></el-table-column>
                                <el-table-column label="学号" min-width="120" prop="memberCode"></el-table-column>
                            </template>
                            <el-table-column v-else label="ID" min-width="120" prop="memberMobile"></el-table-column>
                            <el-table-column label="性别">
                                <template slot-scope="scope">
                                    {{ scope.row.memberSex === 1 ? "男" : "女" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="生日" min-width="100" prop="memberBirthday"></el-table-column>
                            <el-table-column v-if="!isEduDock" label="昵称" min-width="120">
                                <template slot-scope="scope">
                                    <el-button @click="editRemark(scope.row)" type="text">
                                        {{ scope.row | nickName | nameFilter }}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" class-name="scan-type" label="身体成分">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.biaStatus === 4"></i>
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan" v-else-if="[-1, -10].indexOf(scope.row.biaStatus) > -1"
                                    ></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.biaStatus === 1"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" class-name="scan-type" label="体态评估" prop="evalStatus">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.evalStatus === 4"></i>
                                    <!-- 上传中 -->
                                    <img style="width:24px;height:24px" src="@/assets/images/scanlist/upload-line@2x.png" v-else-if=" [-10].indexOf(scope.row.bdaStatus)> -1 || [-10].indexOf(scope.row.evalStatus) > -1">
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan" v-else-if="[-1].indexOf(scope.row.evalStatus) > -1 || [-1].indexOf(scope.row.bdaStatus) > -1"></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.evalStatus === 1"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" class-name="scan-type" label="肩部功能" prop="bsShoulderStatus">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.bsShoulderStatus === 4"></i>
                                    <!-- 测量成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.bsShoulderStatus === 1"></i>
                                    <!-- 测量失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" min-width="180">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="downloadReport(scope.row.scanId)">
                                        下载报告
                                        <i class="el-icon-arrow-right"></i>
                                    </el-button>
                                    <el-button class="upload-box" :disabled="isScaningReport(scope.row)" @click="seeInterpret(scope.row.scanId)">
                                        <img src="@/assets/images/public/brain.svg" alt="">
                                        {{ isScaningReport(scope.row) ? '请稍后...' : '报告解读' }}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <!-- 分页 当前扫描列表不为空或只有1页时显示分页 -->
                <el-pagination
                    :current-page="page"
                    :page-size="take"
                    :total="pagination.totalItems"
                    @current-change="handlePageChange"
                    background
                    layout="prev, pager, next, total"
                    v-if="scanList.length !== 0 && pagination.totalPages !== 1"
                ></el-pagination>
            </el-main>
        </el-container>
    </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash'
import { findInterpretList, findNewTaskCount, updateMemberInfo, findInterpretStatus, getReportFileUrl } from '@/assets/js/apolloGql.js'
import { strFilter } from '@/assets/js/util.js'
import { mapState } from 'vuex'
import { reportUrl, isPrivate } from '@/assets/js/config'
export default {
    name: 'ScanList',
    filters: {
        // 昵称长度过滤
        nameFilter(value) {
            // 截取12个字节
            return strFilter(value, 12, 2)
        },
        // 昵称显示过滤
        nickName(member) {
            // 显示顺序 昵称 > 微信名称 > 手机号
            return member.memberRemark !== ''
                ? member.memberRemark
                : member.memberNickName !== ''
                    ? member.memberNickName
                    : member.memberMobile
        }
    },
    data() {
        return {
            searchText: '', // 搜索的内容
            searchPlaceholder: '', // 搜索提示
            page: 1, // 当前页数
            limitTime: [], // 筛选时间段
            take: 10, // 每页显示数据个数
            // 分页信息
            pagination: {},
            userTokens: JSON.parse(localStorage.getItem('userTokens')),
            lastScanTime: 0, // 最后测试时间
            newScanNum: 0, // 新扫描任务数量
            newScanInter: '',
            taskStatusInter: '',
            scanList: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: '全部',
                        onClick(picker) {
                            picker.$emit('pick', [])
                        }
                    },
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setMonth(start.getMonth() - 1)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一年',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setFullYear(start.getFullYear() - 1)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            isPrivate: isPrivate
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isEduDock() {
            return [6, 7, 8].includes(this.userInfo.methodId)
        }
    },
    mounted() {
        this.getScanList()
        if (this.isPrivate) {
            this.searchPlaceholder = '请输入ID'
        } else {
            this.searchPlaceholder = this.userInfo.mode === 2 ? '请输入学号' : '请输入手机号码'
        }
    },
    beforeDestroy() {
        // 移除定时
        if (this.taskStatusInter) {
            clearInterval(this.taskStatusInter)
        }
        if (this.newScanInter) {
            clearInterval(this.newScanInter)
        }
    },
    methods: {
        // 监听列表合成状态
        getLinsterStatus() {
            if (this.taskStatusInter) {
                clearInterval(this.taskStatusInter)
            }

            let noReadyList = []
            this.scanList.forEach(scan => {
                // BDA或体态在合成中
                if (this.isScaningReport(scan)) {
                    noReadyList.push(scan.scanId)
                }
            })
            if (noReadyList.length !== 0) {
                // 每10秒查询一次
                this.taskStatusInter = setInterval(() => {
                    const params = {
                        scanIds: noReadyList
                    }
                    this.$apollo
                        .query({
                            query: findInterpretStatus,
                            variables: params,
                            fetchPolicy: 'no-cache'
                        })
                        .then(res => {
                            const data = res.data.findInterpretStatus
                            if (data && data.code === 200) {
                                const list = data.data
                                if (list.length === 0) {
                                    clearInterval(this.taskStatusInter)
                                } else {
                                    this.updScanStatus(list)
                                }
                            }
                        })
                }, 1000 * 10)
            }
        },
        updScanStatus(statusList) {
            let clearFlg = true
            let that = this

            _.forEach(this.scanList, function(item, key) {
                _.forEach(statusList, function(scan, index) {
                    if (item.scanId === scan.scanId && that.isScaningReport(item)) {
                        // 更新合成中的测量项的状态
                        that.$set(that.scanList[key], 'bmInterpretStatus', scan.bmInterpretStatus)
                        that.$set(that.scanList[key], 'bsInterpretStatus', scan.bsInterpretStatus)
                        that.$set(that.scanList[key], 'exerciseAdviceStatus', scan.exerciseAdviceStatus)
                        that.$set(that.scanList[key], 'dietAdviceStatus', scan.dietAdviceStatus)
                        clearFlg = false
                    }
                })
            })

            if (clearFlg) {
                clearInterval(this.taskStatusInter)
            }
        },
        // FIXME:未注册或未扫码记录查询不到
        // 监听是否有新报告
        getLinsterScan(time) {
            if (this.newScanInter) {
                clearInterval(this.newScanInter)
            }
            this.lastScanTime = time
            // 每1分钟查询一次
            this.newScanInter = setInterval(() => {
                const token = window.localStorage.getItem('userTokens')
                if (token === null) {
                    clearInterval(this.newScanInter)
                    return false
                }
                // 转换成UNIX时间戳
                const params = {
                    lastTime: Math.floor(this.lastScanTime / 1000)
                }
                this.$apollo
                    .query({
                        query: findNewTaskCount,
                        variables: params,
                        fetchPolicy: 'no-cache'
                    })
                    .then(res => {
                        const data = res.data.findNewTaskCount
                        if (data && data.code === 200) {
                            this.newScanNum = data.data.count
                        }
                    })
            }, 1000 * 60)
        },
        // 查询任务列表
        getScanList() {
            let params = {
                page: this.page,
                take: this.take,
                queryParam: this.searchText,
                startDate: this.limitTime === null ? '' : this.limitTime.length !== 0 ? this.limitTime[0] : '',
                endDate: this.limitTime === null ? '' : this.limitTime.length !== 0 ? this.limitTime[1] : ''
            }
            this.$apollo
                .query({
                    query: findInterpretList,
                    variables: params,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findInterpretList
                    if (data && data.code === 200) {
                        if (data.data) {
                            this.scanList = JSON.parse(JSON.stringify(data.data))
                            this.pagination = data.pagination
                            if (this.scanList.length !== 0) {
                                // 最新一组扫描时间对比 大于当前查询时间
                                let date = new Date(this.scanList[0].scanTime).getTime()
                                if (date > this.lastScanTime) {
                                    // TODO 添加新报告查询逻辑
                                    // this.getLinsterScan(date)
                                }
                                this.$nextTick(() => {
                                    // 高亮第一行
                                    // this.getSingleScanInfo(this.scanList[0])
                                    this.getLinsterStatus()
                                })
                                // 列表为空时
                            } else {
                                // 如果当前查询时间为0 即首次进入
                                if (this.lastScanTime === 0) {
                                    // TODO 添加新报告查询逻辑
                                    // this.getLinsterScan(new Date().getTime())
                                }
                            }
                        }
                    }
                })
        },
        // 修改用户昵称
        updateMemberInfo(wmId, remark) {
            this.$apollo
                .mutate({
                    mutation: updateMemberInfo,
                    variables: {
                        wmId: wmId,
                        remark: remark
                    }
                })
                .then(res => {
                    const data = res.data.updateMemberInfo
                    if (data.code === 200) {
                        // 昵称修改成功 重新获取当前页面
                        this.getScanList()
                    } else {
                        this.$message(data.message)
                    }
                })
        },
        // 加载新报告
        loadNewList() {
            this.newScanNum = 0
            this.page = 1
            // 全部时间
            if (this.limitTime.length !== 0) {
                const startTime = new Date(this.limitTime[0]).getTime()
                const endTime = new Date(`${this.limitTime[1]} 23:59:59`).getTime()

                if (this.lastScanTime < startTime || this.lastScanTime > endTime) {
                    this.limitTime = ''
                }
            } else {
                this.limitTime = ''
            }
            if (this.newScanInter) {
                clearInterval(this.newScanInter)
            }
            this.getScanList()
        },
        // 用户昵称编辑
        editRemark(member) {
            this.$prompt('', '昵称编辑', {
                customClass: 'remark-prompt',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.$options.filters['nickName'](member), // 输入框的初始文本
                inputPlaceholder: '请输入昵称',
                inputValidator: val => {
                    // 校验表达式 16个字符
                    if (val === null) {
                        return true // 初始化的值为null，不做处理
                    } else {
                        const len = val.length
                        if (len === 0 || len > 16) {
                            return '请输入16个字符以内的昵称'
                        }
                    }
                }
            })
                .then(({ value }) => {
                    this.updateMemberInfo(member.wmId, value)
                })
                .catch(() => {})
        },

        // 行双击 打开报告
        taskRowDblClick(row, event, column) {
            // 非合成中 非失败报告允许打开
            if (!this.isScaningReport(row)) {
                // TODO 跳转报告解读页面
                // this.seeReport(row.scanId)
            }
        },
        // 行单击 数据预览
        taskRowClick(row, event, column) {
            console.log('行单机', row)
        },
        // 查看报告
        downloadReport(scanId) {
            // TODO 下载报告逻辑
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
                        const pdfUrl = result.data
                        window.open(pdfUrl, '_blank')
                    }
                })
        },
        seeInterpret(scanId) {
            // 如果没有指定地址 则获取当前访问地址
            const host = reportUrl ? reportUrl : window.location.origin
            const url = `${host}/visbody-report/index.html?scanId=${scanId}&token=${this.userTokens.token}#/ai-assistant`
            window.open(url, '_blank')
        },
        // 小数点转换
        toDecimal2(x, y) {
            if (x === 0) {
                return '0.0'
            }
            let f = Math.round(x * 100) / 100
            let s = f.toString()
            let rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            return s
        },
        handlePerTabClick(tab, event) {
            // console.log(tab, event);
        },
        // 输入框内容改变
        handleSearchChange() {
            this.page = 1
            this.getScanList()
        },
        // 分页改变
        handlePageChange(val) {
            this.page = val
            this.getScanList()
        },
        // 时间区间改变
        handleTimeChange() {
            this.page = 1
            this.getScanList()
        },
        // 报告是否合成中 不可查看
        isScaningReport(info) {
            const scanStatus = [info.bmInterpretStatus, info.bsInterpretStatus, info.exerciseAdviceStatus, info.dietAdviceStatus]
            return scanStatus.indexOf(-1) > -1 || scanStatus.indexOf(-10) > -1
        }
    }
}
</script>

<style scoped lang="less">
.task-list {
    width: 100%;

    // 报告列表内容
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

            .tips {
                position: absolute;
                right: 78px;
                top: 38px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                line-height: 20px;
                span {
                    color: #9b9b9b;
                }
                .btn {
                    color: #317bf6;
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
            padding: 0px;
            min-height: 600px;
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
                min-height: calc(100vh - 300px);
            }
            .task-table {
                width: 96%;
                position: relative;
                display: inline-block;
                vertical-align: top;
                // margin: 0 28px;
                /deep/ .el-table__body {
                    border-collapse: separate;
                    border-spacing: 0 5px;
                    background: #f5f6fa;
                    tr.current-row {
                        .cell {
                            background: rgba(7, 147, 121, 0.1);
                            border-radius: 0px;
                            border-top: 1px solid #079379 !important;
                            border-bottom: 1px solid #079379 !important;
                        }
                        td:first-child {
                            .cell {
                                border-top-left-radius: 4px;
                                border-bottom-left-radius: 4px;
                                border-left: 1px solid #079379 !important;
                            }
                        }
                        td:last-child {
                            .cell {
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                                border-right: 1px solid #079379 !important;
                                box-sizing: border-box;
                            }
                        }
                    }

                    tr {
                        cursor: pointer;
                        background: rgba(7, 147, 121, 0.05);
                        td {
                            height: 28px !important;
                            line-height: 28px !important;
                            font-size: 16px;
                            padding: 0 0;
                            // border: none;
                            // background: transparent;
                            &:first-of-type {
                                border-top-left-radius: 4px;
                                border-bottom-left-radius: 4px;
                            }
                            &:last-of-type {
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                            }
                            .cell {
                                // background: #ffffff;
                                border-radius: 0px;
                                line-height: 56px;
                                height: 56px;
                                img {
                                    vertical-align: middle;
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

                .el-button--primary,
                .el-button--warning,
                .el-button--info {
                    width: 100px;
                    height: 32px;
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
            .upload-box {
                padding-top: 8px;
                background: #3a9f90;
                // font-size: 15px;
                height: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                &.is-disabled {
                    opacity: 0.24;
                }
                img {
                    position: relative;
                    top: -2px;
                    width: 14px;
                    height: auto;
                    vertical-align: middle;
                    margin-right: 2px;
                    color: #ffffff;
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
// dot加载动画
.dot-loading {
    i {
        position: relative;
        display: inline-block;
        width: 10px;
        height: 10px;
        will-change: transform;
        margin-right: 6px;
        &:before {
            position: absolute;
            display: block;
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 100%;
            background-color: #0770cd;
        }
        &:first-child:before {
            animation: bubble 1.3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }
        &:nth-child(2):before {
            animation: bubble 1.3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
            animation-delay: 0.2s;
        }
        &:last-child:before {
            animation: bubble 1.3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
            animation-delay: 0.4s;
        }
    }
}

@keyframes bubble {
    0% {
        transform: scale(0.2);
        opacity: 0.2;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.2);
        opacity: 0.2;
    }
}

@media screen and (max-width: 1366px) and (min-width: 768px) {
    .task-list {
        .task-content {
            .list-main {
                .scan-preview {
                    width: 34%;
                }
            }
        }
    }
}
</style>

<style lang="less">
// 昵称编辑弹窗
.remark-prompt {
    padding: 0 10px 40px;
    .el-message-box__btns,
    .el-message-box__title {
        text-align: center;
    }
    .el-message-box__title {
        padding-top: 30px;
    }

    .el-button {
        width: 80px;
    }

    .el-message-box__btns button:nth-child(2) {
        margin-left: 30px;
    }
}

// 合成中按钮文字提醒
.wait-popper.el-tooltip__popper.is-light {
    width: 80px;
    border: 1px solid #d5d5d5;
    text-align: center;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);
}

.wait-popper.el-tooltip__popper[x-placement^='top'] {
    .popper__arrow {
        border-top-color: #d5d5d5;
    }
}

// 日期弹窗
.el-picker-panel {
    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.2);
    left: 100px !important;
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
</style>
