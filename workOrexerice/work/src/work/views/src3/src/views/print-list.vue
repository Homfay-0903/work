<!--
 * @Description: 打印详细队列
 * @Author: wangmingdong
 * @Date: 2019-10-21 10:30:16
 * @LastEditTime: 2026-01-05 11:33:46
 * @LastEditors: liutq
 -->
<template>
    <div :class="['content', $i18n.locale]">
        <!-- <div>
            <button @click="testPrintAction()">打印弹窗</button>
        </div> -->
        <div class="qr-bg" v-if="deviceInfo.deviceType === 3">
            <div id="canvas"></div>
            <span class="tips">{{ $t('print-list.scan-tips') }}</span>
        </div>
        <div class="page-content">
            <!-- <div @click="addPrint" style="position: absolute; top: 0; left: 0;z-index: 999">add</div> -->
            <div v-if="currentPrintList.length > 0" class="print-table">
                <!-- <div class="table-header animated fast fadeIn">
                    <div class="header-title center">ID</div>
                    <div class="header-title center">项目</div>
                    <div class="header-title center">打印状态</div>
                </div> -->
                <div
                    v-for="(item, index) in currentPrintList"
                    :key="index"
                    :class="{ 'out-box': true, active: index === currentIndex }"
                    @touchstart="btnEnterFeedback(index)"
                >
                    <div class="print-list">
                        <div class="top">
                            <p class="phone-num">
                                <template v-if="item.phoneNum">{{ item.phoneNum }}</template>
                                <span v-else class="rigester">{{ $t('print-list.xin-yong-hu-zhu-ce') }}</span>
                            </p>
                            <div class="print-status">
                                <div
                                    :class="{
                                        'btn-print': true,
                                        'btn-default': [2, 10].indexOf(item.statusCode) > -1, // 打印成功、未打印
                                        'solid-warning': [3, 6, 7, 8, 9].indexOf(item.statusCode) > -1, // 打印请求失败、注册超时、打印机异常、打印请求超时、生成失败
                                        'border-success': [0, 1, 4].indexOf(item.statusCode) > -1 || item.printWait > 0, // 生成中、打印中、用户注册中、打印排队中
                                        'device-type-pro5': isVaPro5 ? true : false
                                    }"
                                >
                                    <!--  :style="{ ...getDynamicStyle(item), ...getActiveStyle(item) }" -->
                                    {{ getPrintStatus(item) }}
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="scan-time">
                                <img slot="icon" :src="require('@img/print_list/time.png')" alt class="bottomImg" />
                                <p class="time">{{ item.fmtScanTime }}</p>
                                <p class="date">{{ item.fmtScanDate }}</p>
                            </div>
                            <div class="print-status">
                                <div class="imgs">
                                    <img
                                        v-if="item.isMeasureWu && isVaPro5"
                                        src="@/assets/img/select/postureWu.png"
                                        alt="无电流营养分析"
                                    />
                                    <img
                                        v-if="item.girth && item.girth.status && !isVaPro5"
                                        src="@/assets/img/select/item_girth.png"
                                        alt="体围"
                                        :style="$i18n.locale === 'de' ? 'margin-right: 20px' : ''"
                                    />
                                    <img
                                        v-if="item.shape && item.shape.status"
                                        src="@/assets/img/select/item_shape.png"
                                        alt="体态"
                                        :style="$i18n.locale === 'de' ? 'margin-right: 20px' : ''"
                                    />
                                    <img
                                        v-if="item.isMeasureWd && isVaPro5 && deviceInfo.healthPackageEnable !== 2"
                                        src="@/assets/img/select/body_composition.png"
                                        alt="身体成分围度"
                                        :style="$i18n.locale === 'de' ? 'margin-right: 20px' : ''"
                                    />
                                    <img
                                        v-if="item.isMeasureWd && isVaPro5 && deviceInfo.healthPackageEnable === 2"
                                        src="@/assets/img/select/girth2.png"
                                        alt="身体成分围度测量"
                                    />
                                    <img
                                        v-if="item.shoulder && item.shoulder.status"
                                        src="@/assets/img/select/item_shoulder.png"
                                        alt="肩部"
                                        :style="$i18n.locale === 'de' ? 'margin-right: 20px' : ''"
                                    />
                                    <img
                                        v-if="item.weight && item.weight.status && deviceInfo.deviceType === 3"
                                        src="@/assets/img/select/item_weight.svg"
                                        alt="体重"
                                        height="40"
                                        width="40"
                                        :style="$i18n.locale === 'de' ? 'margin-right: 20px' : 'margin-top: 2px'"
                                    />
                                </div>
                                <!-- 高亮时添加重新打印按钮 2、3、7、8、10 可以重新打印 -->
                                <div
                                    v-if="[2, 3, 7, 8, 10].indexOf(item.statusCode) > -1 && index === currentIndex"
                                    class="btn-print btn-reprint"
                                >
                                    <i></i>{{ $t('print-list.msg-box.zhong-xin-da-yin') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 项目提示 -->
                <div :class="['prompt-tip', $i18n.locale]">
                    <span class="prompt-tip-title" v-if="deviceInfo.deviceType === 4 || deviceInfo.deviceType === 5">{{
                        $t('print-list.xiang-mu-ti-shi')
                    }}</span>
                    <div class="prompt-project" v-if="showProject(3) && !isVaPro5">
                        <img src="@/assets/img/select/item_girth.png" alt="体围" />
                        <span>{{
                            isVapro3DeviceMode() ? $t('common.wu-dian-liu') : $t('common.ti-wei-ce-liang')
                        }}</span>
                    </div>
                    <div class="prompt-project" v-if="showProject(2)">
                        <img src="@/assets/img/select/item_shape.png" alt="体态" />
                        <span>{{ $t('print-list.ti-tai-ping-gu') }}</span>
                    </div>
                    <div
                        class="prompt-project"
                        v-if="showProject(3) && isVaPro5 && !isStandMode && deviceInfo.healthPackageEnable !== 2"
                    >
                        <img src="@/assets/img/select/postureWu.png" alt="营养分析" />
                        <span> 营养分析 </span>
                    </div>
                    <div
                        class="prompt-project"
                        v-if="showProject(1) && isVaPro5 && deviceInfo.healthPackageEnable !== 2"
                    >
                        <img class="weight-img" src="@/assets/img/select/body_composition.png" alt="体成分" />
                        <span>身体成分围度</span>
                    </div>
                    <div
                        class="prompt-project"
                        v-if="showProject(1) && isVaPro5 && deviceInfo.healthPackageEnable === 2"
                    >
                        <img class="weight-img" src="@/assets/img/select/girth2.png" alt="体成分" />
                        <span>身体成分围度测量</span>
                    </div>
                    <div class="prompt-project" v-if="showProject(4)">
                        <img src="@/assets/img/select/item_shoulder.png" alt="肩部" />
                        <span>{{ $t('print-list.jian-bu-gong-neng') }}</span>
                    </div>
                    <div class="prompt-project" v-if="showProject(1) && deviceInfo.deviceType === 3">
                        <img class="weight-img" src="@/assets/img/select/item_weight.svg" alt="体重" />
                        <span>{{ $t('print-list.ti-zhong-ce-liang') }}</span>
                    </div>
                </div>

                <!-- 页码 -->
                <div class="pagination-container">
                    <div
                        :class="{
                            'page-btn': true,
                            active: currentIndex === -2,
                            disabled: preBtnStatus,
                            touchStatus: touchStatus && currentIndex === -2
                        }"
                        @touchend="btnEnterFeedback(-2, 5)"
                    >
                        {{ $t('print-list.shang-yi-ye') }}
                    </div>
                    <div class="page-container">
                        <p class="current">{{ pageIndex + 1 }}</p>
                        / {{ pageNum }}
                    </div>
                    <div
                        :class="{
                            'page-btn': true,
                            active: currentIndex === -1,
                            disabled: nextBtnStatus,
                            touchStatus: touchStatus && currentIndex === -1
                        }"
                        @touchend="btnEnterFeedback(-1, 5)"
                    >
                        {{ $t('print-list.xia-yi-ye') }}
                    </div>
                </div>
            </div>
            <!--  -->
            <div v-else class="print-empty animated fast fadeIn">
                <div class="empty-block" v-if="!isTouch" :style="isVaPro5 ? { background: '#333333' } : {}">
                    <p :style="isVaPro5 ? { color: '#CCCCCC' } : {}">{{ $t('print-list.mei-you-da-yin-bao-gao') }}</p>
                </div>
                <div class="empty-block empty-button" v-else :style="isVaPro5 ? { background: '#333333' } : {}">
                    <p :style="isVaPro5 ? { color: '#CCCCCC' } : {}">{{ $t('print-list.mei-you-da-yin-bao-gao') }}</p>
                </div>
            </div>
        </div>
        <!-- 重新打印弹窗 -->
        <msg-box
            v-model="openReprintBox"
            :is-auto-close="!isTouch"
            :duration="msgBoxCountdown"
            :title="canRePrint ? $t('print-list.msg-box.title0') : $t('print-list.msg-box.title1')"
            @on-close="onCloseReprintBox"
        >
            <div slot="content" class="reprint-content">
                <p class="box-tip">
                    <img src="@img/print_list/tips.svg" alt />
                    {{ getPrintStatus(currentItem) }}
                </p>
                <div class="tips">
                    <div v-if="boxItem.girth && boxItem.girth.isMeasured && boxItem.girth.status && !isVaPro5">
                        <img
                            v-if="boxItem.girth.composeStatus === 1"
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                        />
                        <img
                            v-else-if="boxItem.girth.composeStatus === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt />
                        </div>
                        <span>{{
                            isVapro3DeviceMode() ? $t('common.wu-dian-liu') : $t('common.ti-wei-ce-liang')
                        }}</span>
                    </div>
                    <div
                        v-else-if="
                            boxItem.girth &&
                            boxItem.weight &&
                            boxItem.girth.isMeasured &&
                            boxItem.girth.status &&
                            boxItem.isMeasureWu &&
                            isVaPro5
                        "
                    >
                        <img
                            v-if="
                                boxItem.girth.composeStatus === 1 &&
                                boxItem.weight.composeStatus === 1 &&
                                boxItem.nutritionStatus === 4
                            "
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                        />
                        <img
                            v-else-if="boxItem.girth.composeStatus === 0 || boxItem.weight.composeStatus === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt />
                        </div>
                        <span> 营养分析 </span>
                    </div>
                    <div v-if="boxItem.shape && boxItem.shape.isMeasured && boxItem.shape.status">
                        <img
                            v-if="boxItem.shape.composeStatus === 1"
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                        />
                        <img
                            v-else-if="boxItem.shape.composeStatus === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt />
                        </div>
                        <span>{{ $t('common.ti-tai-ping-gu') }}</span>
                    </div>
                    <div v-if="boxItem.spine && boxItem.spine.isMeasured && boxItem.spine.status">
                        <img
                            v-if="boxItem.spine.composeStatus === 1"
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                        />
                        <img
                            v-else-if="boxItem.spine.composeStatus === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt />
                        </div>
                        <span>脊柱评估</span>
                    </div>
                    <div v-if="boxItem.mass && boxItem.mass.isMeasured && boxItem.mass.status && !isVaPro5">
                        <img
                            v-if="boxItem.mass.composeStatus === 1"
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                        />
                        <img
                            v-else-if="boxItem.mass.composeStatus === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt />
                        </div>
                        <span>{{ $t('print-list.ti-cheng-fen-ce-liang') }}</span>
                    </div>
                    <div v-else-if="boxItem.mass && boxItem.mass.isMeasured && boxItem.isMeasureWd">
                        <img
                            v-if="boxItem.mass.composeStatus === 1 && boxItem.girth.composeStatus === 1"
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                        />
                        <img
                            v-else-if="boxItem.mass.composeStatus === 0 || boxItem.girth.composeStatus === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt />
                        </div>
                        <span>身体成分围度</span>
                    </div>
                    <div v-if="boxItem.shoulder && boxItem.shoulder.isMeasured && boxItem.shoulder.active > 0">
                        <img
                            v-if="boxItem.shoulder.active > 0"
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                            class="shoulder"
                        />
                        <img
                            v-else-if="boxItem.shoulder.active === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                            class="shoulder"
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt class="shoulder" />
                        </div>
                        <span>{{ $t('common.jian-bu-gong-neng') }}</span>
                    </div>
                    <div v-if="boxItem.weight && boxItem.weight.isMeasured && deviceInfo.deviceType === 3">
                        <img
                            v-if="boxItem.weight.composeStatus > 0"
                            :src="require('@img/print_list/checkbox-circle-line.svg')"
                            alt
                        />
                        <img
                            v-else-if="boxItem.weight.composeStatus === 0"
                            :src="require('@img/print_list/close-circle-line.svg')"
                            alt
                        />
                        <div v-else class="load svg">
                            <img :src="require('@img/print_list/loader-4-line.svg')" alt />
                        </div>
                        <span>{{ $t('common.ti-zhong-ce-liang') }}</span>
                    </div>
                </div>
                <div class="operation">
                    <template v-if="isTouch">
                        <template v-if="canRePrint">
                            <div
                                :class="{ 'box-btn': true, active: boxActiveBtnIdx === 0 }"
                                @touchstart="reprintFeedback"
                            >
                                {{ $t('print-list.msg-box.zhong-xin-da-yin') }}
                            </div>
                            <div :class="{ 'box-btn': true, active: boxActiveBtnIdx === 1 }" @touchstart="initBox">
                                {{ $t('print-list.msg-box.qu-xiao') }}
                            </div>
                        </template>
                        <div v-else class="box-btn confirm active" @touchend="initBox">
                            {{ $t('print-list.msg-box.hao-de', [btnCountdown]) }}
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="canRePrint" class="box-btn btn-confirm active" @touchstart="reprintFeedback">
                            {{ $t('print-list.msg-box.zhong-xin-da-yin') }}
                        </div>
                    </template>
                </div>
            </div>
        </msg-box>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MsgBox from '@/components/MsgBox.vue'
import QRCodeStyling from 'qr-code-styling'
import CONFIG from '@/config/index'
export default {
    name: 'PrintList',
    components: {
        MsgBox
    },
    data() {
        return {
            pageIndex: 0, // 当前页
            pageSize: 5, // 每页显示条数
            pageNum: 0, // 总页码
            currentIndex: -10, // 高亮选项index
            currentPrintList: [],
            currentItem: null,
            // 按键控制index数组
            btnCtlNums: [],
            // 重新打印弹窗
            openReprintBox: false,
            canRePrint: false,
            boxActiveBtnIdx: 0,
            // btn定时器
            clockTimer: null,
            // btn倒计时
            btnCountdown: 3,
            // 重新打印弹窗关闭倒计时
            msgBoxCountdown: 10,
            boxItem: {},
            // 触摸屏的状态,
            touchStatus: false,
            qrCode: {}
        }
    },
    computed: {
        ...mapGetters(['printQueue', 'deviceInfo', 'initMesInfo', 'settingInfo']),
        // 上一页按钮可用状态
        preBtnStatus() {
            return this.pageIndex === 0
        },
        // 下一页按钮可用状态
        nextBtnStatus() {
            return this.pageIndex === this.pageNum - 1
        },
        // 判断是否触屏模式
        isTouch() {
            return this.deviceInfo.operationMode === 1
        },
        // printQueue() {
        //     return [{"scanId":"N212345678900109-6a003a79-60d5-4b77-9c06-133fc7df6eca",
        //     "scanTime":1758190999000,"reprintTime":0,"phoneNum":"131****8790","statusCode":3,"printWait":0,"bindStatus":true,"isPrinting":false,"printType":1,"mass":{"isMeasurement":true,"status":true,"isMeasured":true,"composeStatus":1},"girth":{"isMeasurement":true,"status":true,"isMeasured":true,"composeStatus":1},"shape":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"spine":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"shoulder":{"isMeasurement":false,"status":false,"active":0,"isMeasured":false,"composeStatus":-1},"weight":{"isMeasurement":true,"status":true,"isMeasured":true,"weight":91.0999984741211,"composeStatus":1},"deviceMode":2,"nutritionStatus":0,"handleStatus":0,"isMeasureWu":false,"isMeasureWd":true,"nutrition":2,"height":0,"fmtScanDate":"2025/09/18","fmtScanTime":"18:23"},{"scanId":"N212345678900109-311a7ebf-cd25-4926-be90-29b56a3bd344","scanTime":1758189166000,"reprintTime":0,"phoneNum":"131****8790","statusCode":10,"printWait":0,"bindStatus":true,"printType":0,"mass":{"isMeasurement":true,"status":true,"isMeasured":true,"composeStatus":1},"girth":{"isMeasurement":true,"status":true,"isMeasured":true,"composeStatus":1},"shape":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"spine":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"shoulder":{"isMeasurement":false,"status":false,"active":0,"isMeasured":false,"composeStatus":-1},"weight":{"isMeasurement":true,"status":true,"isMeasured":true,"weight":91.20000457763672,"composeStatus":1},"deviceMode":2,"nutritionStatus":0,"handleStatus":0,"isMeasureWu":false,"isMeasureWd":true,"nutrition":2,"height":0,"fmtScanDate":"2025/09/18","fmtScanTime":"17:52"},{"scanId":"N212345678900109-a7d43d49-3383-42d4-8adc-8925dd54920f","scanTime":1758186939000,"reprintTime":0,"phoneNum":"1****1","statusCode":10,"printWait":0,"bindStatus":true,"printType":0,"mass":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"girth":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"shape":{"isMeasurement":true,"status":true,"isMeasured":true,"composeStatus":1},"spine":{"isMeasurement":false,"status":1,"isMeasured":1,"composeStatus":1},"shoulder":{"isMeasurement":false,"status":false,"active":0,"isMeasured":false,"composeStatus":-1},"weight":{"isMeasurement":false,"status":true,"isMeasured":false,"weight":91.5999984741211,"composeStatus":-1},"deviceMode":2,"nutritionStatus":0,"handleStatus":0,"isMeasureWu":false,"isMeasureWd":false,"nutrition":2,"height":0,"fmtScanDate":"2025/09/18","fmtScanTime":"17:15"},{"scanId":"N212345678900109-1a8fe55d-83b0-4007-bfd8-bc42fb7d252f","scanTime":1758186779000,"reprintTime":0,"phoneNum":"1****1","statusCode":9,"printWait":0,"bindStatus":true,"isPrinting":false,"printType":0,"mass":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"girth":{"isMeasurement":false,"status":false,"isMeasured":false,"composeStatus":-1},"shape":{"isMeasurement":true,"status":true,"isMeasured":true,"composeStatus":0},"spine":{"isMeasurement":false,"status":1,"isMeasured":1,"composeStatus":0},"shoulder":{"isMeasurement":false,"status":false,"active":0,"isMeasured":false,"composeStatus":-1},"weight":{"isMeasurement":false,"status":true,"isMeasured":false,"weight":91.5999984741211,"composeStatus":-1},"deviceMode":2,"nutritionStatus":0,"handleStatus":0,"isMeasureWu":false,"isMeasureWd":false,"nutrition":2,"height":0,"fmtScanDate":"2025/09/18","fmtScanTime":"17:12"}]
        //     // return [{ "scanId": "M0C0123456789145-2f9415bc-6a86-494d-befd-8dd90ef57c20", "scanTime": 1692692746000, "reprintTime": 0, "phoneNum": "7818***3367@qq.com", "statusCode": 10, "printWait": 0, "bindStatus": true, "isPrinting": false, "printType": 0, "mass": { "isMeasurement": false, "status": false, "isMeasured": false, "composeStatus": -1 }, "girth": { "isMeasurement": false, "status": false, "isMeasured": false, "composeStatus": -1 }, "shape": { "isMeasurement": false, "status": false, "isMeasured": false, "composeStatus": -1 }, "spine": { "isMeasurement": false, "status": false, "isMeasured": false, "composeStatus": -1 }, "shoulder": { "isMeasurement": false, "status": false, "active": 0, "isMeasured": false, "composeStatus": -1 }, "weight": { "isMeasurement": true, "status": true, "isMeasured": true, "weight": 72.19999694824219, "composeStatus": 1 }, "fmtScanDate": "2023/08/22", "fmtScanTime": "16:25" }, { "scanId": "M0C0123456789145-ba23424f-9678-4331-bfef-359a1986e454", "scanTime": 1692691973000, "reprintTime": 0, "phoneNum": "7818***3367@qq.com", "statusCode": 10, "printWait": 0, "bindStatus": true, "printType": 0, "mass": { "isMeasurement": false, "status": false, "isMeasured": false, "composeStatus": -1 }, "girth": { "isMeasurement": true, "status": true, "isMeasured": true, "composeStatus": 1 }, "shape": { "isMeasurement": true, "status": true, "isMeasured": true, "composeStatus": 1 }, "spine": { "isMeasurement": false, "status": false, "isMeasured": false, "composeStatus": -1 }, "shoulder": { "isMeasurement": true, "status": true, "active": 2, "isMeasured": true, "composeStatus": 1 }, "weight": { "isMeasurement": true, "status": true, "isMeasured": true, "weight": 72.4000015258789, "composeStatus": 1 }, "fmtScanDate": "2023/08/22", "fmtScanTime": "16:12" }]
        // },
        // 是否vaPro5
        isVaPro5() {
            return this.deviceInfo.deviceType === 5
        },
        isStandMode() {
            return this.settingInfo.deviceMode === 2
        }
    },
    watch: {
        // 打印队列改变
        printQueue(printQueue) {
            if (printQueue && printQueue.length) {
                this.formatPrintList(this.pageIndex)
            }
        }
    },
    created() {
        this.$store.commit('CHANGE_PAGE_INFO', {
            openNotOperated: true
        })
        // console.log('isVapro3DeviceMode', this.isVapro3DeviceMode())
        this.formatPrintList()
    },
    beforeDestroy() {
        this.clearClockTimer()
    },
    mounted() {
        this.onUpdateQrcode()
    },
    methods: {
        //  是否Vapro3的无电流营养分析
        isVapro3DeviceMode() {
            return (
                (this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) &&
                this.settingInfo.deviceMode === 1
            )
        },
        onUpdateQrcode() {
            const deviceType = this.deviceInfo.deviceType
            if (this.qrCode.data === null || this.qrCode.data === undefined) {
                this.qrCode = new QRCodeStyling({
                    width: 121,
                    height: 121,
                    type: 'svg',
                    data: `${CONFIG.H5_ADDR}/report?deviceType=${deviceType}`,
                    dotsOptions: {
                        color: '#fff',
                        type: 'dots'
                    },
                    backgroundOptions: {
                        color: ''
                    },
                    imageOptions: {
                        crossOrigin: 'anonymous'
                    },
                    cornersDotOptions: {
                        type: 'dot'
                    },
                    cornersSquareOptions: {
                        type: 'dot'
                    }
                })
            }
            this.qrCode.append(document.getElementById('canvas'))
        },
        getPrintStatus(item) {
            const STATUS_CODE = {
                0: this.$t('print-list.status0'), // 生成中
                1: this.$t('print-list.status1'), // 打印中
                2: this.$t('print-list.status2'), // 打印成功
                3: this.$t('print-list.status3'), // 打印请求失败
                4: this.$t('print-list.status4'), // 用户注册中
                5: this.$t('print-list.status5'), // 排队中
                6: this.$t('print-list.status6'), // 注册超时
                7: this.$t('print-list.status7'), // 打印机异常
                8: this.$t('print-list.status8'), // 打印请求超时
                9: this.$t('print-list.status9'), // 生成失败
                10: this.$t('print-list.status10') // 未打印
            }
            if (!item) {
                return ''
            }
            if (item.printWait) {
                return this.$t('print-list.status11', [item.printWait])
            }
            if (this.isVapro3DeviceMode() && item.nutritionStatus !== 4 && item.girth.status && item.isMeasureWu) {
                return STATUS_CODE[0]
            }
            return STATUS_CODE[item.statusCode]
        },
        // 判断底部按钮
        initBottomBtn() {
            let _btnList = []
            if (!this.printQueue.length) {
                _btnList = [
                    {
                        btn: 'switch',
                        msg: '电源'
                    }
                ]
            } else if (this.printQueue.length === 1) {
                _btnList = [
                    {
                        btn: 'switch',
                        msg: '电源'
                    }
                ]
            } else {
                _btnList = [
                    {
                        btn: 'switch',
                        msg: '电源'
                    },
                    {
                        btn: 'add',
                        msg: '加'
                    },
                    {
                        btn: 'sub',
                        msg: '减'
                    }
                ]
                // 当前选中项状态处理
                const currentBlock = this.currentPrintList[this.currentIndex]
                // 上一页/下一页
                if (
                    (this.currentIndex === -2 && !this.preBtnStatus) ||
                    (this.currentIndex === -1 && !this.nextBtnStatus)
                ) {
                    _btnList.push({
                        btn: 'switch',
                        msg: '电源'
                    })
                }
                // 可重测数据
                if (currentBlock && [2, 3, 7, 8, 10].indexOf(currentBlock.statusCode) > -1) {
                    _btnList.push({
                        btn: 'switch',
                        msg: '电源'
                    })
                }
                if (this.openReprintBox) {
                    _btnList.push({
                        btn: 'switch',
                        msg: '电源'
                    })
                }
            }
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList: _btnList
            })
        },
        // 分页数据
        formatPrintList(index = 0) {
            window.logger.info('printQueue', JSON.stringify(this.printQueue))
            // 触屏式不默认选中第一个，按键模式下默认选中第一个
            this.currentIndex = this.isTouch ? -10 : 0
            this.btnCtlNums.length = 0
            this.pageIndex = index
            this.pageNum = Math.ceil(this.printQueue.length / this.pageSize)
            this.currentPrintList = this.printQueue.slice(
                this.pageIndex * this.pageSize,
                this.pageIndex * this.pageSize + this.pageSize
            )
            window.logger.info('printQueue', JSON.stringify(this.currentPrintList))
            this.currentPrintList.forEach((v, i) => {
                this.btnCtlNums.push(i)
            })
            // 上一页
            if (this.pageNum !== 0) {
                this.btnCtlNums.push(-2)
            }
            // 下一页
            if (this.pageNum !== this.pageNum - 1) {
                this.btnCtlNums.push(-1)
            }
            this.initBottomBtn()
            // window.logger.debug('printQueue', JSON.stringify(this.printQueue))
            // window.logger.debug('currentPrintList', JSON.stringify(this.currentPrintList))
        },
        // 高亮状态处理
        lightActive() {
            // 按钮自动选中
            if (this.pageNum > 1) {
                if (this.pageIndex === 0) {
                    this.currentIndex = -1
                }
                if (this.pageIndex === this.pageNum - 1) {
                    this.currentIndex = -2
                }
            } else {
                this.currentIndex = 0
            }
        },
        // 判断如果是不可选中按钮，跳过
        jumpNextIndex(type) {
            this.touchStatus = false
            // 上
            if (type === 1) {
                // 首页（上一页）
                if (this.currentIndex === -2 && this.pageIndex === 0) {
                    this.currentIndex = this.currentPrintList.length - 1
                }
                // 尾页（下一页）【排除首页数据不超过5的情况】
                if (this.currentIndex === -1 && this.pageIndex === this.pageNum - 1) {
                    if (this.pageNum > 1) {
                        this.currentIndex = -2
                    } else {
                        this.currentIndex = this.currentPrintList.length - 1
                    }
                }
            }
            // 下
            if (type === 2) {
                // 首页（上一页）
                if (this.currentIndex === -2 && this.pageIndex === 0) {
                    this.currentIndex = -1
                }
                // 尾页（下一页）
                if (this.currentIndex === -1 && this.pageIndex === this.pageNum - 1) {
                    this.currentIndex = 0
                }
            }
            this.initBottomBtn()
        },
        // 按下确定反馈
        btnEnterFeedback(currentIndex, type) {
            this.touchStatus = false
            if (type === 5) {
                const setTimer = setInterval(() => {
                    window.clearInterval(setTimer)
                    this.touchStatus = true
                }, 100)
            }
            this.currentIndex = currentIndex
            if (this.currentPrintList[currentIndex]) {
                this.boxItem = this.currentItem = this.currentPrintList[currentIndex]
                // console.log(`当前选中项目${JSON.stringify(this.boxItem)}`)
            }
            const setTimerIndex = setInterval(() => {
                window.clearInterval(setTimerIndex)
                // 翻页
                if ([-2, -1].indexOf(currentIndex) > -1) {
                    // 首页不允许上一页 末页不允许下一页
                    if (this.currentIndex === -2 && this.preBtnStatus) {
                        return
                    }
                    // 末页不允许下一页
                    if (this.currentIndex === -1 && this.nextBtnStatus) {
                        return
                    }
                    if (this.currentIndex === -1) {
                        this.pageIndex++
                    }
                    if (this.currentIndex === -2) {
                        this.pageIndex--
                    }
                    this.formatPrintList(this.pageIndex)
                    this.lightActive()
                } else {
                    // vaPro3 测了体围用户没有填写问卷调查不允许打印
                    if (
                        this.isVapro3DeviceMode() &&
                        this.boxItem.nutritionStatus !== 4 &&
                        this.boxItem.girth.status &&
                        (this.isVaPro5 ? this.boxItem.isMeasureWu : true)
                    ) {
                        this.canRePrint = false
                        // 重新打印(打印成功、打印机异常、打印请求超时、打印请求失败、未打印)
                    } else if ([2, 3, 7, 8, 10].indexOf(this.currentItem.statusCode) > -1) {
                        this.msgBoxCountdown = 10
                        this.canRePrint = true
                    } else {
                        // 开始倒计时
                        this.runClockTimer()
                    }
                    this.openReprintBox = true
                }
                this.initBottomBtn()
            }, 400)
        },
        // 重新打印逻辑
        reprintFeedback() {
            window.logger.info('点击了重新打印')
            if (this.openReprintBox) {
                // 避免频繁点击引起的倒计时还在问题
                if (this.clockTimer) {
                    this.clearClockTimer()
                }
                // vaPro3 测了体围用户没有填写问卷调查不允许打印
                if (
                    this.isVapro3DeviceMode() &&
                    this.boxItem.nutritionStatus !== 4 &&
                    this.boxItem.girth.status &&
                    this.boxItem.isMeasureWu
                ) {
                    return
                }
                let currentPrintItem = this.currentPrintList[this.currentIndex]
                window.logger.info('重新打印:', currentPrintItem.scanId)
                currentPrintItem.reprintTime = new Date().getTime()
                currentPrintItem.statusCode = 1
                this.$store.commit('CHANGE_REPORT_LIST', currentPrintItem)
                this.onCloseReprintBox()
            }
        },
        // 按键事件
        btnClick(btnType) {
            if (btnType === 1) {
                // 上
                // 弹窗开启
                if (this.openReprintBox) {
                    if (!this.boxActiveBtnIdx) {
                        this.boxActiveBtnIdx = 1
                    } else {
                        this.boxActiveBtnIdx = 0
                    }
                    return
                }
                if (this.currentIndex === -10) {
                    this.currentIndex = 0
                    return
                }
                if (this.currentIndex === -2) {
                    this.currentIndex = this.currentPrintList.length - 1
                } else {
                    this.currentIndex--
                }
                this.jumpNextIndex(btnType)
            } else if (btnType === 2) {
                // 下
                // 弹窗开启
                if (this.openReprintBox) {
                    if (this.boxActiveBtnIdx) {
                        this.boxActiveBtnIdx = 0
                    } else {
                        this.boxActiveBtnIdx = 1
                    }
                    return
                }
                if (this.currentIndex === -10) {
                    this.currentIndex = 0
                    return
                }
                if (this.currentIndex === this.currentPrintList.length - 1) {
                    this.currentIndex = -2
                } else {
                    this.currentIndex++
                }
                this.jumpNextIndex(btnType)
            } else if (btnType === 3) {
                this.clearClockTimer()
                if (this.openReprintBox) {
                    if (!this.canRePrint || this.boxActiveBtnIdx) {
                        this.initBox()
                        setTimeout(() => {
                            this.boxActiveBtnIdx = 0
                        }, 100)
                    } else {
                        this.reprintFeedback()
                    }
                    return
                }

                // 确定
                this.btnEnterFeedback(this.currentIndex)
            } else if (btnType === 7) {
                // 返回
                if (this.openReprintBox) {
                    this.initBox()
                } else {
                    this.$changeViewPage('Home')
                }
            }
        },
        // 初始化弹窗
        initBox() {
            this.currentIndex = this.isTouch ? -10 : 0
            this.openReprintBox = false
            setTimeout(() => {
                this.canRePrint = false
            }, 200)
            this.initBottomBtn()
        },
        // 超时未操作返回首页
        handleNotOperated() {
            this.$changeViewPage('Home')
        },
        // 启动定时器
        runClockTimer() {
            this.clearClockTimer()
            this.btnCountdown = 3
            // 按键模式下弹窗关闭倒计时
            this.msgBoxCountdown = 3

            this.clockTimer = setInterval(() => {
                this.btnCountdown--
                if (this.btnCountdown === 0) {
                    this.clearClockTimer()
                    this.initBox()
                }
            }, 1000)
        },
        // 销毁未操作定时器
        clearClockTimer() {
            if (this.clockTimer) {
                window.clearInterval(this.clockTimer)
            }
        },
        onCloseReprintBox() {
            this.openReprintBox = false
            setTimeout(() => {
                this.canRePrint = false
            }, 200)
        },
        testPrintAction() {
            this.runClockTimer()
            this.openReprintBox = true
        },
        showProject(projectNum) {
            return (
                this.initMesInfo.unScanItems.includes(projectNum) ||
                (this.settingInfo.combineMeasureEnable && this.settingInfo.triMode && projectNum === 2)
            )
        },

        getDynamicStyle(item) {
            if (this.deviceInfo.deviceType !== 5) return {}

            const commonStyles = {}

            if ([0, 1, 4].indexOf(item.statusCode) > -1 || item.printWait > 0) {
                return {
                    ...commonStyles,
                    background: 'rgba(46,177,47,0.1)',
                    borderColor: '#2EB12F',
                    color: '#2EB12F'
                }
            }

            if ([2, 10].indexOf(item.statusCode) > -1) {
                return {
                    ...commonStyles,
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: '#CCCCCC',
                    color: '#ccc'
                }
            }

            if ([3, 6, 7, 8, 9].indexOf(item.statusCode) > -1) {
                return {
                    ...commonStyles,
                    background: 'rgba(212,15,15,0.1)',
                    borderColor: '#F30C0C',
                    color: 'red'
                }
            }

            if ([2, 3, 7, 8, 10].indexOf(item.statusCode) > -1 && this.currentIndex === item.index) {
                return {
                    ...commonStyles,
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: '#CCCCCC',
                    color: '#FFFFFF'
                }
            }

            return {}
        },
        getActiveStyle(item) {
            if (this.deviceInfo.deviceType !== 5) return {}
            const baseStyle = this.getDynamicStyle(item) // 获取基础样式
            const activeStyle = {}

            // 判断是否为重新打印按钮
            const isReprint = [2, 3, 7, 8, 10].indexOf(item.statusCode) > -1

            // 重新打印按钮样式
            if (isReprint) {
                activeStyle.background = '#2EB12F'
                activeStyle.color = '#fff'
            } else {
                activeStyle.background = '#CFDBF1'
                activeStyle.color = '#104EBB'
            }

            activeStyle.border = 'none' // 确保没有边框

            return { ...baseStyle, ...activeStyle } // 合并基础样式和选中样式
        }
        // getPageBtnStyle(isActive) {
        //     debugger
        //     if (this.isVaPro5 && isActive) {
        //         return {
        //             background: '#2EB12F', // 当 isVaPro5 为 true 且按钮被选中时的背景色
        //             color: '#ffffff' // 文字颜色
        //         }
        //     }
        //     return {}
        // }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .qr-bg {
        position: absolute;
        top: 149px;
        right: 76px;
        width: 198px;
        height: 198px;
        display: flex;
        flex-direction: column;
        background-color: #333;
        align-items: center;
        justify-content: center;
        border-radius: 15px;

        .tips {
            font-size: 16px;
            font-family: HONORSansCN-Regular, HONORSansCN;
            font-weight: 400;
            color: #ffffff;
            line-height: 21px;
            // position: relative;
            // top: -10px;
            text-align: center;
        }
    }

    .page-content {
        border-top: 2px solid @color-light-gray;
        width: 90%;
        margin: 400px auto;
        height: 100%;
        padding-top: 50px;

        .print-table {
            display: flex;
            flex-direction: column;

            .table-header {
                display: flex;
                flex-direction: row;
                margin: 10px 20px;
                padding: 15px;

                .header-title {
                    flex: 1;
                    font-size: 40px;
                    padding: 0 20px;
                    font-family: 'OPPOSansR';

                    &.center {
                        text-align: center;
                    }
                }
            }

            .out-box {
                margin-bottom: 40px;
                .able-click();

                &.active {
                    .active-border();

                    .print-list {
                        .bottom,
                        .top {
                            .print-status {
                                display: flex;
                                align-items: center;

                                .imgs {
                                    display: flex;
                                    align-items: center;

                                    // background-color: #ff4646;
                                    img {
                                        height: 48px;
                                        margin-right: 40px;
                                    }
                                }

                                .btn-print {
                                    background-color: #ff4646;

                                    &.btn-default,
                                    &.solid-warning,
                                    &.border-success {
                                        color: #104ebb;
                                        background: rgba(255, 255, 255, 0.8);
                                    }

                                    // 重新打印样式
                                    &.btn-reprint {
                                        position: relative;
                                        height: 48px;
                                        line-height: 48px;
                                        padding-left: 32px;
                                        padding-right: 24px;
                                        margin-left: 20px;
                                        color: #ffffff;
                                        background: @color-green;
                                        font-size: 24px;
                                        border-radius: 12px;

                                        i {
                                            display: block;
                                            position: absolute;
                                            width: 12px;
                                            height: 12px;
                                            left: 12px;
                                            top: 18px;
                                            background: #ffffff;
                                            border-radius: 50em;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .print-list {
                    display: flex;
                    flex-direction: column;
                    border: 1px transparent solid;
                    padding: 32px 24px 32px 48px;
                    border-radius: 32px;
                    position: relative;

                    .top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .phone-num {
                            font-size: 48px;
                            margin: 0;
                            font-family: 'Akrobat-Bold';

                            .rigester {
                                font-size: 42px;
                            }
                        }

                        .print-status {
                            display: flex;
                            align-items: center;

                            .imgs {
                                display: flex;
                                align-items: center;

                                img {
                                    height: 48px;
                                    margin-right: 48px;
                                }
                            }

                            .btn-print {
                                height: 48px;
                                line-height: 48px;
                                padding: 0px 25px;
                                font-size: 24px;
                                border-radius: 12px;
                                color: #fff;
                                // transition: all 0.3s;

                                &.btn-outline {
                                    color: @text-gray-2;
                                    border: 2px solid @text-gray-2;
                                }

                                &.btn-default {
                                    color: #cccccc;
                                    background: rgba(255, 255, 255, 0.1);
                                }

                                &.solid-success {
                                    background: rgba(255, 255, 255, 0.1);
                                }

                                &.solid-warning {
                                    // color: #ff4646;
                                    color: #f30c0c;
                                    background: rgba(212, 15, 15, 0.1);
                                    // background: rgba(255, 255, 255, 0.1);
                                }

                                &.border-success {
                                    color: @color-green;
                                    // background: rgba(255, 255, 255, 0.1);
                                    background: rgba(46, 177, 47, 0.1);
                                }

                                // 重新打印样式
                                &.btn-reprint {
                                    position: relative;
                                    height: 48px;
                                    line-height: 48px;
                                    padding-left: 32px;
                                    color: #ffffff;
                                    background: @color-green;

                                    i {
                                        display: block;
                                        position: absolute;
                                        width: 12px;
                                        height: 12px;
                                        left: 12px;
                                        top: 18px;
                                        background: #ffffff;
                                        border-radius: 50em;
                                    }
                                }
                            }
                        }
                    }

                    .bottom {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 20px;

                        .project-info {
                            font-size: 32px;
                            display: flex;
                            margin-left: 96px;

                            img {
                                width: 48px;
                                height: 48px;
                            }

                            .shoulder {
                                width: 57px;
                                height: auto;
                            }

                            .project-list {
                                display: 1;
                                align-items: center;
                                flex-direction: row;
                                margin-right: 48px;
                                font-size: 32px;
                                font-family: 'OPPOSansR';
                                color: #cccccc;

                                img {
                                    width: 30px;
                                    height: 30px;
                                }

                                .load {
                                    position: relative;
                                    display: flex;
                                    justify-content: center;

                                    span {
                                        display: inline-block;
                                        width: 44px;
                                        height: 4px;
                                        background: #649cff;
                                        position: absolute;
                                        bottom: -8px;
                                        left: 2px;

                                        // i {
                                        //     position: absolute;
                                        //     width: 15px;
                                        //     height: 2px;
                                        //     background: #fff;
                                        //     border-radius: 10px;
                                        //     top: 1px;
                                        //     animation: myrotate 3s linear infinite alternate;
                                        // }

                                        @keyframes myrotate {
                                            0% {
                                                left: 0;
                                            }

                                            50% {
                                                left: 14.5px;
                                            }

                                            100% {
                                                left: 29px;
                                            }
                                        }
                                    }

                                    .shoulderSpan {
                                        left: auto;
                                        right: 1px;
                                    }
                                }

                                svg {
                                    width: 32px;
                                    height: 32px;
                                    margin-right: 10px;

                                    &.icon-load {
                                        -webkit-animation: spin 1s linear infinite;
                                        -moz-animation: spin 1s linear infinite;
                                        -o-animation: spin 1s linear infinite;
                                        animation: spin 1s linear infinite;
                                    }
                                }
                            }

                            // .project-list:last-child {
                            //     margin-right: 0;
                            // }
                        }

                        .print-status {
                            display: flex;
                            align-items: center;

                            .imgs {
                                display: flex;
                                align-items: center;
                                &.de {
                                    width: 48px;
                                    margin-right: 28px;
                                }
                                img {
                                    height: 48px;
                                    margin-right: 48px;
                                }
                            }
                        }

                        .scan-time {
                            display: flex;
                            align-items: center;

                            .date {
                                font-size: 32px;
                                margin: 0;
                                margin-right: 20px;
                                color: #cccccc;
                                font-family: 'OPPOSansR';
                            }

                            .time {
                                font-size: 32px;
                                margin: 0 20px 0 0;
                                color: #cccccc;
                                font-family: 'OPPOSansR';
                            }

                            .bottomImg {
                                width: 40px;
                                height: 40px;
                                margin-right: 16px;
                            }
                        }
                    }
                }
            }

            // 项目提示
            .prompt-tip {
                display: flex;
                position: absolute;
                bottom: 195px;
                width: 90%;
                margin: auto;
                // background-color: #ff4646;
                align-items: first baseline;

                .prompt-tip-title {
                    font-size: 36px;
                    font-family: OPPOSans-R;
                    font-weight: normal;
                    color: #999999;
                }

                .prompt-project {
                    display: flex;
                    justify-content: center;
                    align-items: first baseline;
                    flex: 1;

                    img {
                        position: relative;
                        top: 4px;
                        height: 48px;
                        margin: 0 8px 0 20px;
                    }

                    span {
                        font-size: 32px;
                        font-family: OPPOSans-R;
                        font-weight: normal;
                        color: #999999;
                    }

                    .weight-img {
                        height: 40px;
                    }
                }

                &.es {
                    .prompt-project {
                        span {
                            font-size: 28px;
                            font-family: OPPOSans-R;
                            font-weight: normal;
                            color: #999999;
                        }
                    }
                }

                &.pt {
                    .prompt-project {
                        span {
                            font-size: 28px;
                            font-family: OPPOSans-R;
                            font-weight: normal;
                            color: #999999;
                        }
                    }
                }

                &.ru {
                    .prompt-project {
                        align-items: center;
                        span {
                            line-height: 36px;
                        }
                    }
                }
            }

            // 页码控制
            .pagination-container {
                display: flex;
                justify-content: space-between;
                position: absolute;
                bottom: 72px;
                width: 90%;
                margin: auto;

                .page-btn {
                    position: relative;
                    width: 374px;
                    height: 96px;
                    color: #ffffff;
                    text-align: center;
                    line-height: 96px;
                    font-size: 40px;
                    font-family: OPPOSansR;
                    .able-click();

                    &.active {
                        .active-border();
                    }

                    &.touchStatus {
                        .able-click();
                    }

                    &.disabled {
                        color: @text-gray-2;
                        border: 2px solid @text-gray;
                        background: transparent;
                        background: #565656;
                    }
                }

                .page-container {
                    display: flex;
                    align-items: center;
                    font-size: 40px;
                    color: @text-gray-2;
                    font-family: 'OPPOSansR';

                    .current {
                        color: @color-orange;
                        font-size: 40px;
                        margin: 0;
                        margin-right: 10px;
                        font-family: 'OPPOSansR';
                    }
                }
            }
        }

        // 空
        .print-empty {
            margin-top: 100px;
            width: 100%;

            .empty-block {
                border-radius: 32px;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: @color-blue;

                p {
                    margin: 0;
                    color: #ffffff;
                    font-size: 48px;
                    font-family: 'OPPOSansR';
                }
            }

            .empty-button {
                background: @color-background;
            }
        }

        .tip {
            position: absolute;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            font-size: 36px;
            font-family: OPPOSansR;
            font-weight: normal;
            color: #999999;
            width: 880px;
            height: 96px;
            bottom: 184px;
            padding: 0 40px 0 40px;

            .free-style {
                margin-right: 10px;
            }

            span {
                font-size: 36px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #999999;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 48px;
                    height: 48px;
                    margin-right: 8px;
                }

                .shoulder {
                    width: 57px;
                    height: auto;
                }
            }
        }
    }

    // 重新打印弹窗
    .reprint-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #e7e9f0;

        .box-tip {
            display: inline-block;
            margin: 40px 0 80px;
            padding: 0 24px 0 16px;
            background: #666666;
            border-radius: 12px;
            font-size: 32px;
            font-family: OPPOSansR;
            line-height: 48px;
            color: #e7e9f0;

            img {
                width: 40px;
                // margin-right: 8px;
                vertical-align: text-bottom;
            }
        }

        .tips {
            margin: 24px 0 48px 0;

            div {
                font-size: 32px;
                color: #999999;
                display: flex;
                align-items: center;
                margin-bottom: 16px;

                img {
                    width: 30px;
                    height: 30px;
                    opacity: 0.8;
                }

                .load {
                    margin-bottom: 0;

                    &.svg {
                        -webkit-animation: spin 1s linear infinite;
                        -moz-animation: spin 1s linear infinite;
                        -o-animation: spin 1s linear infinite;
                        animation: spin 1s linear infinite;
                    }
                }

                span {
                    font-size: 30px;
                    margin-left: 13px;
                }
            }
        }

        .operation {
            display: flex;
            justify-content: space-evenly;
            width: 100%;
            padding: 0 64px;

            .box-btn {
                width: 384px;
                height: 132px;
                background: #333333;
                border-radius: 12px;
                border: 2px solid @color-light-blue;
                box-sizing: border-box;
                font-size: 40px;
                font-family: OPPOSansR;
                line-height: 132px;
                color: @color-light-blue;
            }

            .confirm {
                width: 832px;
            }

            // 按键模式下确认按钮样式
            .btn-confirm {
                width: 832px;
                margin-bottom: 54px;
            }

            .active {
                background: @color-blue;
                color: #ffffff;
                border: none;
            }
        }

        .item {
            margin: 0;
            font-family: OPPOSansR;
            font-size: 32px;
            display: flex;
            justify-content: center;
            align-items: center;

            i {
                font-size: 40px;
                margin: 0 10px;
            }
        }
    }

    &.ru,
    &.hu {
        .out-box,
        .active {
            .bottom .print-status {
                .imgs img {
                    margin-right: 10px !important;
                }
                .btn-reprint i {
                    left: 6px !important;
                }
            }
        }
    }

    &.de {
        .bottom .print-status .btn-reprint {
            margin-left: 0;
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
.device-type-pro5 {
    border-radius: '12px';
    border-width: 2px;
    border-style: solid;
}
.btn-print {
    &.active {
        border: none !important; // 确保没有边框

        &[data-device-type='5'] {
            background: #cfdbf1; // 默认背景色
            border-radius: 12px;
            color: #104ebb;

            // 重新打印按钮的特殊样式
            &.btn-reprint {
                background: #2eb12f;
                color: #fff;
            }
        }
    }
}
</style>
<style>
.msg-box-mask {
    background: rgba(0, 0, 0, 0.7) !important;
}

.msg-box-main {
    background: #333333 !important;
    padding: 80px 0 !important;
}

.msg-box-main p {
    margin: 0 45px 40px 35px !important;
}
</style>
