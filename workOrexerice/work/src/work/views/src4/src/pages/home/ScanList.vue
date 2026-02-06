<template>
    <div class="task-list">
        <el-container class="task-content">
            <el-header class="list-header">
                <!-- 日期选择器 -->
                <el-date-picker :class="limitTime === null ? '' : limitTime.length !== 0 ? 'is-active' : ''"
                    :clearable="false" :editable="false" :picker-options="pickerOptions" @change="handleTimeChange"
                    align="right" end-placeholder="结束日期" format="yyyy/MM/dd" prefix-icon="el-icon-date"
                    start-placeholder="开始日期" type="datetimerange" unlink-panels v-model="limitTime"
                    value-format="yyyy-MM-dd"></el-date-picker>
                <!-- 搜索框 -->
                <el-input :class="searchText !== '' ? 'input-active' : ''" @input="handleSearchChange"
                    @keyup.enter="handleSearchChange" clearable :placeholder="searchPlaceholder"
                    suffix-icon="el-icon-search" v-model="searchText"></el-input>
                <!-- 新报告提醒 -->
                <transition name="bounce">
                    <el-button @click="loadNewList" type="primary" v-if="newScanNum !== 0">+ 发现&nbsp;{{ newScanNum
                    }}&nbsp;份报告</el-button>
                </transition>
                <!-- 预览开关按钮 -->
                <el-button :class="[
                        previewInfo.open ? 'open-perview' : 'close-perview',
                        scanList.length === 0 ? 'disabled-perview' : ''
                    ]" :disabled="scanList.length === 0" @click="tagglePreview" class="perview-btn" type="primary">{{
        previewInfo.open ? "关闭预览" : "数据预览" }}</el-button>
            </el-header>
            <el-main class="list-main scrollbar">
                <div class="task-list-empty" v-if="scanList.length === 0 && !loading">还没有测量用户</div>
                <div class="list-content" v-else>
                    <div :class="['task-table', previewInfo.open ? 'close-list' : '']">
                        <el-table :data="scanList" :header-cell-style="{ background: '#F5F6FA' }" @row-click="taskRowClick"
                            @row-dblclick="taskRowDblClick" highlight-current-row ref="taskTable" :stripe="true"
                            v-loading="loading">
                            <el-table-column class-name="scan-time" label="扫描时间" prop="scanTime"
                                width="240"></el-table-column>
                            <template v-if="isEduDock">
                                <el-table-column label="姓名" min-width="120" prop="memberName"></el-table-column>
                                <el-table-column label="学号" min-width="120" prop="memberCode"></el-table-column>
                            </template>
                            <el-table-column v-else label="ID" prop="memberMobile" min-width="120">

                                <template slot-scope="scope" >
                                    <el-tooltip v-if="showId(scope.row).length > 11 && userInfo.reportListIdEncryption === 0" class="item" effect="dark" :content="showId(scope.row)" placement="top-start">
                                        <div class="show-id-box">
                                        {{ showId(scope.row).length < 11 ? showId(scope.row) : showId(scope.row).substr(0,11)+'…'}}
                                        </div>
                                    </el-tooltip>
                                    <div v-else class="show-id-box">
                                        {{ showId(scope.row) }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="性别" v-if="!previewInfo.open">
                                <template slot-scope="scope">
                                    {{ scope.row.memberSex === 1 ? "男" : "女" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="生日" min-width="100" prop="memberBirthday"
                                v-if="!previewInfo.open"></el-table-column>
                            <el-table-column v-if="!isEduDock" label="昵称" min-width="120">
                                <template slot-scope="scope">
                                    <el-button @click="editRemark(scope.row)" type="text">
                                        <div class="box-div">
                                            {{ showUserName(scope.row) }}
                                        </div>
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" class-name="scan-type" label="无电流营养分析" v-if="isVAPro3 || isVAPro5">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="showNutritionReport(scope.row)"></i>
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan"
                                        v-else-if="[-1, -10].indexOf(scope.row.bdaStatus) > -1 || scope.row.weight === null"></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.bdaStatus === 1 && scope.row.weight > 0"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="isVAPro5 || isVAPro7" align="center" class-name="scan-type" label="身体成分" prop="biaStatus">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.biaStatus === 4"></i>
                                    <!-- 上传中 -->
                                    <img style="width:24px;height:24px" src="@/assets/images/scanlist/upload-line@2x.png"
                                        v-else-if="[-10].indexOf(scope.row.biaStatus) > -1 || [-10].indexOf(scope.row.biaStatus) > -1">
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan"
                                        v-else-if="[-1].indexOf(scope.row.biaStatus) > -1 || [-1].indexOf(scope.row.biaStatus) > -1"></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.biaStatus === 1"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" class-name="scan-type" label="身体成分" v-if="!isVAPro5 && !isVAPro3 && !isVAPro7">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.biaStatus === 4"></i>
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan"
                                        v-else-if="[-1, -10].indexOf(scope.row.biaStatus) > -1"></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.biaStatus === 1"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" class-name="scan-type" label="体围测量" v-else>
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.bdaStatus === 4"></i>
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan"
                                        v-else-if="[-1, -10].indexOf(scope.row.bdaStatus) > -1"></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.bdaStatus === 1"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="!isVE260" align="center" class-name="scan-type" label="体态评估" prop="evalStatus">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.evalStatus === 4"></i>
                                    <!-- 上传中 -->
                                    <img style="width:24px;height:24px" src="@/assets/images/scanlist/upload-line@2x.png"
                                        v-else-if="[-10].indexOf(scope.row.bdaStatus) > -1 || [-10].indexOf(scope.row.evalStatus) > -1">
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan"
                                        v-else-if="[-1].indexOf(scope.row.evalStatus) > -1 || [-1].indexOf(scope.row.bdaStatus) > -1"></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.evalStatus === 1"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <!-- 双虎/脊动力 增加内容 脊柱评估-->
                            <el-table-column v-if="userInfo && userInfo.spineReportEnabled === 1" align="center" class-name="scan-type" label="脊柱评估" prop="evalStatus">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.bsSpineStatus === 4"></i>
                                    <!-- 上传中 -->
                                    <img style="width:24px;height:24px" src="@/assets/images/scanlist/upload-line@2x.png"
                                        v-else-if="[-10].indexOf(scope.row.bdaStatus) > -1 || [-10].indexOf(scope.row.bsSpineStatus) > -1">
                                    <!-- 合成中 -->
                                    <i class="type-icon wait-scan"
                                        v-else-if="[-1].indexOf(scope.row.bsSpineStatus) > -1 || [-1].indexOf(scope.row.bdaStatus) > -1"></i>
                                    <!-- 合成成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.bsSpineStatus === 1"></i>
                                    <!-- 合成失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" class-name="scan-type" label="肩部功能" prop="bsShoulderStatus" v-if="((reportMode.indexOf('009') > 0 || !isVAPro5) && !isVAPro7) && !isVE260">
                                <template slot-scope="scope">
                                    <!-- 未测量 -->
                                    <i class="type-icon not-scan" v-if="scope.row.bsShoulderStatus === 4"></i>
                                    <!-- 测量成功 -->
                                    <i class="type-icon scan-success" v-else-if="scope.row.bsShoulderStatus === 1"></i>
                                    <!-- 测量失败 -->
                                    <i class="type-icon scan-failure" v-else></i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" min-width="120">
                                <template slot-scope="scope">
                                    <el-button v-if="isQuestionReport(scope.row)" class="upload-box question-color" @click="fillQuestion(scope.row.scanId, scope.row.memberId)">
                                            填写问卷
                                            <img class="scan-refresh2"
                                                src="@/assets/images/scanlist/question_edit.png" alt="">
                                        </el-button>
                                    <el-tooltip content="请稍等" effect="light" placement="top" popper-class="wait-popper"
                                        v-else-if="isUploadReport(scope.row)">
                                        <el-button class="upload-box upload-color">
                                            <img class="scan-refresh1"
                                                src="@/assets/images/scanlist/upload-cloud-2-line@2x.png" alt="">
                                            上传中
                                        </el-button>
                                    </el-tooltip>
                                    <el-tooltip content="请稍等" effect="light" placement="top" popper-class="wait-popper"
                                        v-if="isScaningReport(scope.row)">
                                        <el-button type="warning">
                                            <svg class="scan-refresh" viewBox="25 25 50 50">
                                                <circle class="path" cx="50" cy="50" fill="none" r="20" />
                                            </svg>
                                            合成中
                                        </el-button>
                                    </el-tooltip>
                                    <el-button disabled type="info" v-else-if="isfailureReport(scope.row)">报告失败</el-button>
                                    <el-button @click="seeReport(scope.row.scanId)" type="primary" v-else>
                                        查看报告
                                        <i class="el-icon-arrow-right"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 模型数据预览 -->
                    <div class="scan-preview" v-if="previewInfo.open">
                        <el-tabs :stretch="true" @tab-click="handlePerTabClick" type="card" v-model="previewInfo.tab">
                            <el-tab-pane label="身体成分" name="body"
                                v-if="previewScan.biaStatus !== undefined && previewScan.biaStatus !== 4">
                                <!-- BIA合成中 -->
                                <div class="tips-msg" v-if="[-1, -10].indexOf(previewScan.biaStatus) > -1">
                                    <img alt="合成中" src="@/assets/images/scanlist/tip-scaning.gif" />
                                    <p>数据合成中，请稍等…</p>
                                </div>
                                <!-- BIA合成成功 -->
                                <el-table :data="bmMassInfo" v-else-if="previewScan.biaStatus === 1">
                                    <el-table-column align="center" label="身体成分 kg" prop="title"></el-table-column>
                                    <el-table-column align="center" label="本次测量" prop="value"></el-table-column>
                                    <el-table-column align="center" label="与上次对比">
                                        <template slot-scope="scope">
                                            <svg height="24px" v-if="scope.row.diffVal > 0 || scope.row.diffVal < 0"
                                                version="1.1" viewBox="0 0 24 24" width="24px"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink">
                                                <polygon fill="#1890FF" fill-rule="nonzero" id="up-arrow"
                                                    points="13 12 13 16 11 16 11 12 8 12 12 8 16 12"
                                                    v-if="scope.row.diffVal > 0" />
                                                <polygon fill="#F5A623" fill-rule="nonzero" id="down-arrow"
                                                    points="13 12 16 12 12 16 8 12 11 12 11 8 13 8" v-else />
                                            </svg>
                                            <span>
                                                {{ scope.row.diffVal !== "--" ? toDecimal2(Math.abs(scope.row.diffVal), 1) :
                                                    scope.row.diffVal }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="标准范围">
                                        <template slot-scope="scope">
                                            <span
                                                :style="{ color: scope.row.status === 1 ? '#F19937' : scope.row.status === 2 ? '' : '#EE586B' }">
                                                {{ scope.row.status === 1 ? "低于标准" : scope.row.status === 2 ? "正常" : "超过标准"
                                                }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- BIA合成失败 -->
                                <div class="tips-msg" v-else>
                                    <img alt="体测合成失败" src="@/assets/images/scanlist/tips-scan-failure.svg" />
                                    <p>模型合成失败</p>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="体围测量" name="measure"
                                v-if="isShowGigth">
                                <!-- 体态合成中 或 BDA 合成中 -->
                                <div class="tips-msg"
                                    v-if="[-1, -10].indexOf(previewScan.evalStatus) > -1 || [-1, -10].indexOf(previewScan.bdaStatus) > -1">
                                    <img alt="合成中" src="@/assets/images/scanlist/tip-scaning.gif" />
                                    <p>数据合成中，请稍等…</p>
                                </div>
                                <!-- BDA合成成功 -->
                                <el-table :data="bmGirthInfo" v-else-if="showGirthReport(previewScan)">
                                    <el-table-column align="center" label="围度 cm" prop="title"></el-table-column>
                                    <el-table-column align="center" label="本次测量" prop="value"></el-table-column>
                                    <!-- v2.2.0需求屏蔽 -->
                                    <!-- <el-table-column align="center" label="与上次对比">
                                        <template slot-scope="scope">
                                            <svg height="24px" v-if="scope.row.diffVal > 0 || scope.row.diffVal < 0"
                                                version="1.1"
                                                viewBox="0 0 24 24"
                                                width="24px"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                            >
                                                <polygon fill="#1890FF" fill-rule="nonzero" id="up-arrow" points="13 12 13 16 11 16 11 12 8 12 12 8 16 12" v-if="scope.row.diffVal > 0"/>
                                                <polygon fill="#F5A623" fill-rule="nonzero" id="down-arrow" points="13 12 16 12 12 16 8 12 11 12 11 8 13 8" v-else/>
                                            </svg>
                                            <span>
                                                {{ scope.row.diffVal !== "--" ? toDecimal2(Math.abs(scope.row.diffVal), 1) : scope.row.diffVal }}
                                            </span>
                                        </template>
                                    </el-table-column> -->
                                </el-table>
                                <!-- BDA合成失败 -->
                                <div class="tips-msg" v-else>
                                    <el-table :data="bmGirthTpl">
                                        <el-table-column align="center" label="围度 cm" prop="title"></el-table-column>
                                        <el-table-column align="center" label="本次测量">
                                            <template slot-scope="scope">
                                                {{ scope.row.title !== null ? '--' : '' }}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="体态测量" name="shape"
                                v-if="previewScan.evalStatus !== undefined && previewScan.evalStatus !== 4">
                                <!-- 体态合成中 或 BDA 合成中 -->
                                <div class="tips-msg"
                                    v-if="[-1, -10].indexOf(previewScan.evalStatus) > -1 || [-1, -10].indexOf(previewScan.bdaStatus) > -1">
                                    <img alt="合成中" src="@/assets/images/scanlist/tip-scaning.gif" />
                                    <p>数据合成中，请稍等…</p>
                                </div>
                                <!-- 体态合成成功 体态模型可加载 -->
                                <template v-else-if="previewScan.evalStatus === 1">
                                    <!-- 浏览器是否支持webgl -->
                                    <div class="tips-msg" v-if="!isWebGL">
                                        <img alt="体态合成失败" src="@/assets/images/scanlist/tips-not-support.svg" />
                                        <p>当前浏览器不兼容，请使用谷歌浏览器或火狐浏览器访问</p>
                                    </div>
                                    <!-- 加载模型 -->
                                    <shape-model :model-info="modelInfo" @modelLoadError="modelInfo.loadErr = true"
                                        v-else-if="!modelInfo.loadErr"></shape-model>
                                    <div class="tips-msg" v-else>
                                        <img alt="体态合成失败" src="@/assets/images/scanlist/tips-load-failure.svg" />
                                        <p>模型加载失败，请刷新页面…</p>
                                    </div>
                                </template>
                                <!-- 体态合成失败 -->
                                <div class="tips-error-msg" v-else>
                                    <img alt="体态合成失败" src="@/assets/images/scanlist/tips-scan-failure.svg" />
                                    <p>模型合成失败</p>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="肩部功能" name="shoulder"
                                v-if="previewScan.bsShoulderStatus !== undefined && previewScan.bsShoulderStatus !== 4">
                                <!-- 项目成功 -->
                                <el-table :data="bsShoulderInfo" v-if="previewScan.bsShoulderStatus === 1">
                                    <el-table-column align="center" label="测量项目(单位°)" prop="name"></el-table-column>
                                    <el-table-column align="center" label="本次测量">
                                        <template slot-scope="scope">{{ scope.row.val !== null ? toDecimal2(scope.row.val,
                                            1) + '°' : '--' }}</template>
                                    </el-table-column>
                                    <el-table-column align="center" label="与上次对比">
                                        <template slot-scope="scope">
                                            <svg height="24px" v-if="scope.row.contrast > 0 || scope.row.contrast < 0"
                                                version="1.1" viewBox="0 0 24 24" width="24px"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink">
                                                <polygon fill="#1890FF" fill-rule="nonzero" id="up-arrow"
                                                    points="13 12 13 16 11 16 11 12 8 12 12 8 16 12"
                                                    v-if="scope.row.contrast > 0" />
                                                <polygon fill="#F5A623" fill-rule="nonzero" id="down-arrow"
                                                    points="13 12 16 12 12 16 8 12 11 12 11 8 13 8" v-else />
                                            </svg>
                                            <span>{{ scope.row.contrast !== null ? toDecimal2(Math.abs(scope.row.contrast),
                                                1) + '°' : '--' }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 项目失败 -->
                                <div class="tips-msg" v-else>
                                    <img alt="肩部测量失败" src="@/assets/images/scanlist/tips-scan-failure.svg" />
                                    <p>测量失败</p>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <!-- 分页 当前扫描列表不为空或只有1页时显示分页 -->
                <el-pagination :current-page="page" :page-size="take" :total="pagination.totalItems"
                    @current-change="handlePageChange" background layout="prev, pager, next, total"
                    v-if="scanList.length !== 0 && pagination.totalPages !== 1"></el-pagination>
            </el-main>
        </el-container>
    </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash'
// 体态模型组件
import ShapeModel from '@/components/model/shape-model'
import {
    findTaskList,
    bmMassContrastInfo,
    bmGirthContrastInfo,
    findNewTaskCount,
    updateMemberInfo,
    updateBindMemberInfo,
    findTaskStatus,
    bsShoulderConclusion
} from '@/assets/js/apolloGql.js'
import { strFilter, getStar } from '@/assets/js/util.js'
import { WEBGL } from '@/assets/js/WebGL.js'
import { mapState } from 'vuex'
import { isPrivate } from '@/assets/js/config'
import { isVAPro3, isVAPro5, isVAPro6, isVAPro7, isVE260, isVALit6 } from '@/types/device.js'
export default {
    name: 'ScanList',
    components: {
        ShapeModel
    },
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
            updateTotal: 0, // 当前表格数据处理总数
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
            modelInfo: {
                bsScanResult: 0, // 体态状态
                scanId: '', // 扫描ID
                loadErr: false, // 加载是否失败
                isNewMathTt: 0
            },
            isWebGL: false,
            bmMassInfo: [],
            bmMassTpl: [
                {
                    title: '体重',
                    key: 'WT'
                },
                {
                    title: '体脂肪',
                    key: 'BFM'
                },
                {
                    title: '去脂体重',
                    key: 'FFM'
                },
                {
                    title: '骨骼肌',
                    key: 'SM'
                },
                {
                    title: '肌肉量',
                    key: 'LM'
                },
                {
                    title: '总水分',
                    key: 'TBW'
                },
                {
                    title: '无机盐',
                    key: 'TM'
                },
                {
                    title: '蛋白质',
                    key: 'PROTEIN'
                },
                {
                    title: '细胞内液',
                    key: 'ICW'
                },
                {
                    title: '细胞外液',
                    key: 'ECW'
                },
                {
                    title: 'BMI',
                    key: 'BMI'
                },
                {
                    title: '体脂率',
                    key: 'PBF'
                },
                {
                    title: '基础代谢',
                    key: 'BMR'
                },
                {
                    title: '代谢年龄',
                    key: 'METABOLICAGE'
                }
            ],
            bmMassPro5: [
                {
                    title: '体重',
                    key: 'WT'
                },
                {
                    title: '蛋白质',
                    key: 'PROTEIN'
                },
                {
                    title: '总水分',
                    key: 'TBW'
                },
                {
                    title: '体脂肪',
                    key: 'BFM'
                },
                {
                    title: '骨骼肌',
                    key: 'SM'
                },
                {
                    title: 'BMI',
                    key: 'BMI'
                }, {
                    title: '体脂率',
                    key: 'PBF'
                }, {
                    title: '基础代谢',
                    key: 'BMR'
                },
            ],
            // 体成分测量结果
            bmGirthInfo: [],
            bmGirthTpl: [
                {
                    title: '颈围',
                    key: 'neckGirth'
                },
                {
                    title: '左上臂围',
                    key: 'leftUpperArmGirth'
                },
                {
                    title: '右上臂围',
                    key: 'rightUpperArmGirth'
                },
                {
                    title: '胸围',
                    key: 'bustGirth'
                },
                {
                    title: '高腰围',
                    key: 'waistGirth'
                },
                {
                    title: '中腰围',
                    key: 'midWaistGirth'
                },
                {
                    title: '低腰围',
                    key: 'lowWaistGirth'
                },
                {
                    title: '臀围',
                    key: 'hipGirth'
                },
                {
                    title: '左大腿围',
                    key: 'leftThighGirth'
                },
                {
                    title: '左大腿最小围',
                    key: 'leftMinThighGirth'
                },
                {
                    title: '右大腿围',
                    key: 'rightThighGirth'
                },
                {
                    title: '右大腿最小围',
                    key: 'rightMinThighGirth'
                },
                {
                    title: '左小腿围',
                    key: 'leftCalfGirth'
                },
                {
                    title: '右小腿围',
                    key: 'rightCalfGirth'
                }
            ], // 体成分围度测量结果
            prePreview: {},
            previewScan: {}, // 预览的扫描数据
            previewInfo: {
                open: false,
                tab: 'body'
            }, // 数据预览信息
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
            // 肩部评估测量数据
            bsShoulderInfo: [],
            isPrivate: isPrivate,
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro6: isVAPro6(),
            isVAPro7: isVAPro7(),
            isVE260: isVE260(),
            isVALit6: isVALit6(),
            loading: false,
            reportMode: window.localStorage.getItem('reportMode')
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isEduDock() {
            return [6, 7, 8].includes(this.userInfo.methodId)
        },
        isShowGigth() {
            return (this.isVAPro3 || this.isVAPro7
                ? typeof this.previewScan.bdaStatus !== 'undefined' && this.previewScan.bdaStatus !== 4
                : this.isVAPro5
                    ? this.previewScan.bdaStatus !== 4
                    : typeof this.previewScan.bdaStatus !== 'undefined' && this.previewScan.bdaStatus !== 4) && !this.isVE260
        }
    },
    mounted() {
        if (this.isVAPro5) {
            this.bmMassTpl = this.bmMassPro5
        } else if (this.isVALit6) {
            // 创建一个不包含细胞内液和细胞外液的模板
            this.bmMassTpl = this.bmMassTpl.filter(item => item.key !== 'ICW' && item.key !== 'ECW')
        }
        this.getScanList()
        this.isWebGL = WEBGL.isWebGLAvailable()
        if (this.isPrivate) {
            this.searchPlaceholder = '请输入ID'
        } else {
            this.searchPlaceholder = this.userInfo.mode === 2 ? '请输入学号' : '请输入手机号码'
        }
        this.$eventBus.$on('changeRouter', routeName => {
            if (routeName === 'home') {
                this.getScanList()
            }
        })
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
                            query: findTaskStatus,
                            variables: params,
                            fetchPolicy: 'no-cache'
                        })
                        .then(res => {
                            const data = res.data.findTaskStatus
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

            _.forEach(this.scanList, function (item, key) {
                _.forEach(statusList, function (scan, index) {
                    if (item.scanId === scan.scanId && that.isScaningReport(item)) {
                        // 更新合成中的测量项的状态
                        that.$set(that.scanList[key], 'biaStatus', scan.biaStatus)
                        that.$set(that.scanList[key], 'bdaStatus', scan.bdaStatus)
                        that.$set(that.scanList[key], 'evalStatus', scan.evalStatus)
                        that.$set(that.scanList[key], 'questionReport', scan.questionReport)
                        that.$set(that.scanList[key], 'scanMode', scan.scanMode)
                        that.$set(that.scanList[key], 'weight', scan.weight)
                        that.$set(that.scanList[key], 'bsSpineStatus', scan.bsSpineStatus)
                        // that.$set(that.scanList[key], 'bsSpineStatus', scan.bsSpineStatus)
                        // 更新当前预览窗口数据
                        if (that.previewInfo.open && that.previewScan.scanId === scan.scanId) {
                            that.updSingleScanInfo(item)
                        }
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
            this.loading = true
            this.$apollo
                .query({
                    query: findTaskList,
                    variables: params,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    this.loading = false
                    const data = res.data.findTaskList
                    if (data && data.code === 200) {
                        if (data.data) {
                            this.scanList = JSON.parse(JSON.stringify(data.data))
                            this.pagination = data.pagination
                            if (this.scanList.length !== 0) {
                                // 最新一组扫描时间对比 大于当前查询时间
                                let date = new Date(this.scanList[0].scanTime).getTime()
                                if (date > this.lastScanTime) {
                                    this.getLinsterScan(date)
                                }
                                this.$nextTick(() => {
                                    // 高亮第一行
                                    this.getSingleScanInfo(this.scanList[0])
                                    this.getLinsterStatus()
                                })
                                // 列表为空时
                            } else {
                                // 如果当前查询时间为0 即首次进入
                                if (this.lastScanTime === 0) {
                                    this.getLinsterScan(new Date().getTime())
                                }
                            }
                        }
                    }
                })
        },
        // ID显示
        showId (data) {
            if (data.memberType === 2) {
                const length = data.deviceId.length + 1
                if (data.memberMobile.length > length) {
                    const newMemberMobile = data.memberMobile.substr(0, data.memberMobile.length - length)
                    return this.formatMobile(newMemberMobile)
                }

            }
            return this.formatMobile(data.memberMobile)
        },
        // 格式化手机号显示
        formatMobile(mobile) {
            const userId = mobile.toString()
            const len = userId.length
            let result = userId
            if (this.userInfo.reportListIdEncryption === 0) {
                return result
            }
            if (len >= 5 && len <= 10) {
                result = userId.substr(0, 2) + getStar(len - 4) + userId.substr(len - 2)
            }

            if (len === 11) {
                result = userId.substr(0, 3) + '****' + userId.substr(len - 4)
            }

            if (len > 11) {
                result = userId.substr(0, 4) + '****' + userId.substr(len - 4)
            }

            return result
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
        updateBindMemberInfo(id, name) {
            this.$apollo
                .mutate({
                    mutation: updateBindMemberInfo,
                    variables: {
                        id: id,
                        name: name
                    }
                })
                .then(res => {
                    const data = res.data.updateBindMemberInfo
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
        // 获取本次和上次的身体成分(结果&&分析)数据
        getBmMassContrastInfo(memberId, scanId, scanTime, mode) {
            const { reportMode } = mode
            const params = {
                memberId: memberId,
                scanId: scanId,
                scanTime: scanTime
            }
            this.$apollo
                .query({
                    query: bmMassContrastInfo,
                    variables: params,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    this.bmMassInfo = []
                    const data = res.data.bmMassContrastInfo
                    if (data && data.code === 200) {
                        const massInfo = data.data
                        for (let i = 0; i < this.bmMassTpl.length; i++) {
                            const key = this.bmMassTpl[i].key
                            if (!massInfo[0][key]) {
                                continue
                            }
                            const diffVal =
                                massInfo.length === 1
                                    ? '--'
                                    : this.toDecimal2(massInfo[0][key].v - massInfo[1][key].v, 1)
                            let info = {
                                title: this.bmMassTpl[i].title,
                                value: this.toDecimal2(massInfo[0][key].v, 1),
                                status: massInfo[0][key].status,
                                diffVal: diffVal
                            }
                            if (key === 'ICW' || key === 'ECW') {
                                if (reportMode.indexOf('001') === -1 && reportMode.indexOf('002') === -1) {
                                    continue
                                }
                            }
                            if (key === 'PROTEIN') {
                                if (this.isVAPro5 && info.value <= 0) {
                                    continue
                                }
                            }
                            if (key === 'METABOLICAGE') {
                                if (!this.isVAPro6) {
                                    continue
                                }
                            }
                            this.bmMassInfo.push(info)
                        }
                        console.log(`当前体成分呢数据长度${this.bmMassInfo.length} ${this.bmMassTpl.length}`)
                    }
                })
        },
        // 获取本次和上次的体围信息
        getBmGirthContrastInfo(memberId, scanId, scanTime) {
            const params = {
                memberId: memberId,
                scanId: scanId,
                scanTime: scanTime
            }
            this.$apollo
                .query({
                    query: bmGirthContrastInfo,
                    variables: params,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    this.bmGirthInfo = []
                    const data = res.data.bmGirthContrastInfo
                    if (window.localStorage.getItem('healthPackageEnable') === '2') {
                        const keysToRemove = [
                            'neckGirth',
                            'waistGirth',
                            'midWaistGirth',
                            'lowWaistGirth',
                        ]
                        this.bmGirthTpl = this.bmGirthTpl.filter(item => !keysToRemove.includes(item.key))
                    }
                    if (data && data.code === 200) {
                        const girthInfo = data.data
                        for (let i = 0; i < this.bmGirthTpl.length; i++) {
                            const key = this.bmGirthTpl[i].key
                            if (girthInfo[0][key] <= 0) {
                                continue
                            }
                            if (this.showGirthItem(key)) {
                                const diffVal =
                                    (girthInfo.length === 1 || girthInfo[0][key] <= 0 || girthInfo[1][key] <= 0)
                                        ? '--'
                                        : this.toDecimal2(girthInfo[0][key] - girthInfo[1][key], 1)
                                let info = {
                                    title: this.bmGirthTpl[i].title,
                                    value: this.toDecimal2(girthInfo[0][key], 1),
                                    diffVal: diffVal
                                }
                                this.bmGirthInfo.push(info)
                            }

                        }
                    }
                    console.log(this.bmGirthInfo, '>>>>>>>>>aa')
                })
        },
        showGirthItem(key) {
            if (isVAPro3() || isVAPro5() || isVAPro7()) {
                return true
            }
            console.log(`传入key${key}`)
            return key !== 'neckGirth' && key !== 'leftMidThighGirth' && key !== 'rightMidThighGirth' && key !== 'leftMinThighGirth' && key !== 'rightMinThighGirth' && key !== 'midWaistGirth' && key !== 'lowWaistGirth'
        },
        // 获取本次和上次的肩部信息
        getBsShoulderContrastInfo(memberId, scanId, scanTime) {
            const params = {
                memberId: memberId,
                scanId: scanId,
                scanTime: scanTime
            }
            this.$apollo
                .query({
                    query: bsShoulderConclusion,
                    variables: params,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    this.bsShoulderInfo = []
                    const data = res.data.bsShoulderConclusion
                    if (data && data.code === 200) {
                        const shoulderInfo = data.data.shoulderInfo
                        for (const key in shoulderInfo) {
                            if (shoulderInfo.hasOwnProperty(key) && typeof shoulderInfo[key] === 'object') {
                                this.bsShoulderInfo.push(shoulderInfo[key])
                            }
                        }
                    }
                })
        },
        // 用户昵称编辑
        editRemark(member) {
            this.$prompt('', '昵称编辑', {
                customClass: 'remark-prompt',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.showUserName(member, false), // 输入框的初始文本
                inputPlaceholder: '请输入昵称',
                inputValidator: val => {
                    // 校验表达式 16个字符
                    if (val === null) {
                        return true // 初始化的值为null，不做处理
                    } else {
                        const len = val.length
                        if (len === 0 || len > 100) {
                            return '请输入100个字符以内的昵称'
                        }
                    }
                }
            })
                .then(({ value }) => {
                    if (member.reptId > 0) {
                        this.updateBindMemberInfo(member.memberId, value)
                    } else {
                        this.updateMemberInfo(member.wmId, value)
                    }

                })
                .catch(() => { })
        },
        // 显示用户名称
        showUserName(member, isShort = true) {
            const name = member.memberRemark !== ''
                ? (member.reptId > 0 && member.memberName ? member.memberName : member.memberRemark)
                : member.memberNickName !== ''
                    ? (member.reptId > 0 && member.memberName ? member.memberName : member.memberNickName) : member.memberName !== '' ? member.memberName
                        : member.memberMobile.indexOf('+') ? member.memberMobile.split('+')[0] : member.memberMobile
            if (isShort) {
                return strFilter(name)
            } else {
                return name
            }

        },

        // 行双击 打开报告
        taskRowDblClick(row, event, column) {
            // 非合成中 非失败报告允许打开
            if (!this.isScaningReport(row) && !this.isfailureReport(row)) {
                this.seeReport(row.scanId)
            }
        },
        // 行单击 数据预览
        taskRowClick(row, event, column) {
            if (row.scanId !== this.previewScan.scanId) {
                this.previewScan = {}
                this.getSingleScanInfo(row)
            }
        },
        updSingleScanInfo(scanInfo) {
            // BIA成功 且 BIA 合成中
            if (scanInfo.biaStatus === 1 && [-1, -10].indexOf(this.prePreview.biaStatus) > -1) {
                this.getBmMassContrastInfo(scanInfo.memberId, scanInfo.scanId, scanInfo.scanTime)
            }
            // BDA成功 且 BDA 合成中
            if (scanInfo.bdaStatus === 1 && [-1, -10].indexOf(this.prePreview.bdaStatus) > -1) {
                this.getBmGirthContrastInfo(scanInfo.memberId, scanInfo.scanId, scanInfo.scanTime)
            }
            // 体态成功 且 体态合成中
            if (scanInfo.evalStatus === 1 && [-1, -10].indexOf(this.prePreview.evalStatus) > -1) {
                // 要加载的模型信息
                this.modelInfo = {
                    bsScanResult: scanInfo.evalStatus,
                    scanId: scanInfo.scanId,
                    loadErr: false,
                    isNewMathTt: scanInfo.isNewMathTt
                }
            }

            this.$refs.taskTable.setCurrentRow(scanInfo)
        },
        // 点击表格单条数据查询
        getSingleScanInfo(scanInfo) {
            this.previewScan = {}
            // DOM 渲染后重新赋值 解决tab切换导致的顺序混乱问题
            this.$nextTick(() => {
                this.previewScan = scanInfo
            })
            this.prePreview = JSON.parse(JSON.stringify(this.previewScan))
            this.$refs.taskTable.setCurrentRow(scanInfo)
            // 默认显示的预览tab
            if (scanInfo.biaStatus !== 4) {
                this.previewInfo.tab = 'body'
            } else if (scanInfo.evalStatus !== 4 && !(this.isVAPro3 || this.isVAPro5)) {
                this.previewInfo.tab = 'shape'
            } else if (scanInfo.bdaStatus !== 4 && (this.isVAPro3 || this.isVAPro5)) {
                this.previewInfo.tab = 'measure'
            } else if (scanInfo.evalStatus !== 4 && (this.isVAPro3 || this.isVAPro5)) {
                this.previewInfo.tab = 'shape'
            } else {
                this.previewInfo.tab = 'shoulder'
            }
            // BIA成功 获取身体成分对比数据
            if (scanInfo.biaStatus === 1) {
                this.getBmMassContrastInfo(scanInfo.memberId, scanInfo.scanId, scanInfo.scanTime, {
                    deviceId: scanInfo.deviceId,
                    reportMode: scanInfo.reportMode
                })
            }
            // BDA成功 获取围度数据
            if (scanInfo.bdaStatus === 1) {
                this.getBmGirthContrastInfo(scanInfo.memberId, scanInfo.scanId, scanInfo.scanTime)
            }
            // 肩部成功 获取肩部数据
            if (scanInfo.bsShoulderStatus === 1) {
                this.getBsShoulderContrastInfo(scanInfo.memberId, scanInfo.scanId, scanInfo.scanTime)
            }
            // 要加载的模型信息
            this.modelInfo = {
                bsScanResult: scanInfo.evalStatus,
                scanId: scanInfo.scanId,
                loadErr: false,
                isNewMathTt: scanInfo.isNewMathTt
            }
        },
        // 查看报告
        seeReport(scanId) {
            console.log('查看报告', scanId)
            this.$hmt.trackEvent('reportDown', 'click')
            this.$router.push({
                name: 'Report',
                query: {
                    scanId: scanId,
                    token: this.userTokens.token
                }
            })
        },
        // 填写问卷
        fillQuestion(scanId, wmId) {
            console.log('跳转填写问卷')
            this.$router.push({
                name: 'question',
                query: {
                    scanId,
                    wmId
                }
            })
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
        // 开关预览
        tagglePreview() {
            this.previewInfo.open = !this.previewInfo.open
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
            const scanStatus = [info.biaStatus, info.bdaStatus, info.evalStatus]
            let result = scanStatus.indexOf(-1) > -1 || scanStatus.indexOf(-10) > -1
            if (info.spineReport === 1 && (info.bsSpineStatus === -1 || info.bsSpineStatus === -10)) {
                return true
            }
            // 产康模式未填写调查问卷也认为合成中
            return result || this.isQuestionReport(info)
        },
        // 报告是否合成中 不可查看
        isUploadReport(info) {
            const scanStatus = [info.evalStatus]
            return scanStatus.indexOf(-10) > -1
        },
        // 是否需要填写无电流营养分析报告
        isQuestionReport(info) {
            const bdaStatus = info.bdaStatus
            // true表示产康模式
            const scanMode = info.scanMode === 1
            if (info.nutrition === 0) {
                return bdaStatus !== 4 && scanMode && info.questionReport === 0 && bdaStatus !== 0
            }
            return info.nutrition === 1 && info.questionReport === 0 && bdaStatus !== 0
        },
        /**
         * 报告是否失败 不可查看
         *
         * bia和体态都失败时 不可查看info.bsSpineStatus
         */
        isfailureReport(info) {
            const scanStatus = [info.biaStatus, info.evalStatus, info.bsShoulderStatus]
            if (isVAPro3() || isVAPro5()) {
                scanStatus.push(info.bdaStatus)
            }
            let scanNum = 0
            let errScanNum = 0
            scanStatus.forEach(item => {
                if (item !== 4) {
                    scanNum++
                }
                if ([0, 2].indexOf(item) > -1) {
                    errScanNum++
                }
            })
            // 添加监测日志
            if (scanNum === errScanNum) console.log('合成失败状态@@@@@@@@@@', scanStatus)
            return scanNum === errScanNum
        },
        showGirthReport(scanData) {
            if (this.isVAPro3 || this.isVAPro5 || this.isVAPro7) {
                console.log(`当前数据${JSON.stringify(scanData)} ${scanData.bdaStatus === 1}`)
                return scanData.bdaStatus === 1
            }
            return scanData.evalStatus === 1 && scanData.bdaStatus === 1
        },
        // true表示为测量无电流营养分析
        showNutritionReport(scanData) {
            if (scanData.nutrition === 0) {
                return scanData.weight === null || scanData.bdaStatus === 4 || scanData.scanMode === 0
            } else {
                return scanData.nutrition === 2
            }
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

            .perview-btn {
                width: 120px;
                height: 40px;
                position: absolute;
                right: 28px;
                top: 28px;
            }

            .perview-btn.open-perview {
                color: #666666;
                background: #ffffff;
                border: 1px solid #4eabe8;
            }

            .perview-btn.close-perview {
                color: #ffffff;
                background: #009fe8;
            }

            .perview-btn.disabled-perview {
                color: #c0c0c0 !important;
                background: #ffffff !important;
                border: 1px solid #c0c0c0 !important;
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

            .task-table.close-list {
                width: 62%;
            }

            .task-table {
                width: 96%;
                position: relative;
                display: inline-block;
                vertical-align: top;
                // .show-id-box{
                //     width: 100px; /* 限制容器宽度 */
                //     overflow: hidden; /* 超出部分隐藏 */
                //     text-overflow: ellipsis;
                //     white-space: nowrap;
                // }
                .box-div{
                    width: 100px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }

                // margin: 0 28px;
                /deep/ .el-table__body {
                    border-collapse: separate;
                    border-spacing: 0 5px;
                    background: #f5f6fa;

                    tr.current-row {
                        .cell {
                            background: rgba(0, 159, 232, 0.05);
                            border-radius: 0px;
                            border-top: 1px solid #009fe8 !important;
                            border-bottom: 1px solid #009fe8 !important;
                        }

                        td:first-child {
                            .cell {
                                border-top-left-radius: 4px;
                                border-bottom-left-radius: 4px;
                                border-left: 1px solid #009fe8 !important;
                            }
                        }

                        td:last-child {
                            .cell {
                                width: 99%;
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                                border-right: 1px solid #009fe8 !important;
                                box-sizing: border-box;
                            }
                        }
                    }

                    tr {
                        cursor: pointer;

                        // background: transparent;
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

            .scan-preview {
                width: 30%;
                display: inline-block;
                margin-top: 48px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);

                /deep/ .el-tabs {
                    height: calc(100% - 15px);

                    .el-tabs__header {
                        text-align: center;
                        border: 1px solid #009fe8;
                        margin: 15px;
                        border-radius: 4px;

                        .el-tabs__nav {
                            width: 100%;
                            text-align: center;
                            border: none;

                            .el-tabs__item {
                                padding: 0;
                                height: 28px;
                                line-height: 28px;
                                color: #8c8c8c;
                                cursor: pointer;
                                transition: all 0.2s;
                            }

                            .is-active {
                                background: #009fe8;
                                color: #ffffff;
                                border: none;
                            }
                        }
                    }

                    .el-tabs__content {
                        position: relative;
                        height: calc(100% - 44px);
                        border-top: 1px solid rgba(239, 239, 243, 1);

                        .el-tab-pane {
                            height: 100%;
                        }
                    }

                    svg {
                        vertical-align: middle;
                    }

                    .shape-model {
                        -webkit-box-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        text-align: center;

                        .iframe-template {
                            height: 80%;
                        }
                    }

                    .tips-msg {
                        text-align: center;
                        // margin-top: 20%;

                        p {
                            color: #4a4a4a;
                            margin-top: 40px;
                        }
                    }

                    .tips-error-msg {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        p {
                            color: #4a4a4a;
                            margin-top: 40px;
                        }
                    }
                }

                /deep/ .one-card #tab-body,
                /deep/ .one-card #tab-measure,
                /deep/ .two-card #tab-shape {
                    display: none;
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
            .upload-color {
                background: #EAA944;
            }
            .question-color {
                background-color: #52C41A;
            }
            .upload-box {
                padding-top: 8px;
                width: 100px;
                padding-left: 10px;
                font-size: 15px;
                height: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;

                img {
                    position: relative;
                    top: -2px;
                    width: 16px;
                    height: 16px;
                }

                .scan-refresh1 {
                    width: 1px;
                    height: auto;
                    vertical-align: middle;
                    margin-right: 2px;
                }
                .scan-refresh2 {
                    width: 14px;
                    height: auto;
                    vertical-align: middle;
                    margin-left: 2px;
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
                .task-table.close-list {
                    width: 64%;
                }

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
</style>
