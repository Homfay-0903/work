<!--
 * @Descripttion: 体态评估报告
 * @Author: gaoyuanyuan
 * @Date: 2020-02-14 17:31:24
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-16 17:24:03
 -->
<template>
    <div>
        <div class="bs-report" v-cloak>
            <div :class="deviceVApro3 || deviceVApro5 || deviceVALit6 ? 'shape-model1' : 'shape-model'">
                <div class="item" v-for="(model, idx) in models" :key="idx">
   <span>{{ model.name }}</span>
                    <img v-if="model.img" :src="model.img" @load="imageLoaded" @error="imageLoadError(model)" />
                    <img class="default" v-else-if="isGetImg" @load="imageLoaded"
                        src="@/assets/images/default_model.svg" />
                </div>
            </div>
            <div :class="isTangCenBei ? 'postureBash' : deviceVApro3 || deviceVApro5 ? 'postureA' : 'posture'">
                <!-- <P class="tipss" v-if="xianshiisVA">{{ promptshapeageva }}</P> -->
                <P class="tipss" v-if="xianshiisVR">{{ promptgirthage }}</P>
                <h2 style="line-height: 27px">
                    体态评估概览
                    <em>*为保证数据准确性，需穿着紧身衣服、扎起头发</em>
                    <span class="new-tap" v-if="isNewMathTt">{{ algUpData }}</span>
                </h2>
                <div :class="isShowFree ? 'shape-table1' : 'shape-table'">
                    <table v-if="isNewMathTt" border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>测量值</th>
                                <!-- v2.2.0需求屏蔽 -->
                                <!-- <th>与上次对比</th> -->
                                <!-- <th>评估结论</th> -->
                                <th v-if="!isTangCenBei">风险提示</th>
                            </tr>
                        </thead>
                        <tbody
                            :class="((deviceVApro3 || deviceVApro5) && isShowFree || !deviceVApro3 && !deviceVApro5 && !deviceVApro6) ? 'small' : ''">
                            <!-- 头前引 -->
                            <tr>
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="headForward.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture0-1.png" />
                                            <img v-else src="@/assets/images/postureBone/posture0.png" />
                                        </span>
                                        <div>
                                            <span class="name">头前引</span>
                                            <span class="msg" v-if="headForward">{{ headForward.conclusion === '正常' ?
                                                '正常' :
                                                `${isNewMathTt ? '' : '可能存在'}${headForward.conclusion}` }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span v-if="headForward" class="val">{{ toDecimal(headForward.val, 1)
                                    }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="headForward" :val="headForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="headForward">{{ headForward.risk }}</span>
                                </td>
                            </tr>
                            <!-- 头侧歪 -->
                            <tr>
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="headSlant.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture1-1.png" />
                                            <img v-else-if="headSlant.conclusion.includes('左')"
                                                src="@/assets/images/postureBone/posture1.png" />
                                            <img v-else-if="headSlant.conclusion.includes('右')"
                                                src="@/assets/images/postureBone/posture1-2.png" />
                                        </span>
                                        <div>
                                            <span class="name">头侧歪</span>
                                            <span class="msg" v-if="headSlant">{{ headSlant.conclusion === '正常' ? '正常' :
                                                isNewMathTt ? `${headSlant.conclusion}` :
                                                    `可能存在头侧歪(${headSlant.conclusion})`
                                            }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span v-if="headSlant" class="val">{{ toDecimal(headSlant.val, 1) }}°</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="headSlant" :val="headSlant.contrast" unit="°"></contrast>
                            </td> -->
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="headSlant">{{ headSlant.risk }}</span>
                                </td>
                            </tr>
                            <!-- 左圆肩 -->
                            <tr>
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="roundShoulder.left.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture2-1.png" />
                                            <img v-else src="@/assets/images/postureBone/posture2.png" />
                                        </span>
                                        <div>
                                            <span class="name">左圆肩</span>
                                            <span class="msg" v-if="roundShoulder && roundShoulder.left">{{
                                                roundShoulder.left.conclusion === '正常' ? '正常' : isNewMathTt ?
                                                    roundShoulder.left.conclusion : '可能存在左圆肩' }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style="border-right: 1px solid rgb(206, 215, 224);">
                                    <span v-if="roundShoulder && roundShoulder.left" class="val">{{
                                        toDecimal(roundShoulder.left.val, 1) }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="roundShoulder && roundShoulder.left" :val="roundShoulder.left.contrast" unit="°"></contrast>
                            </td> -->
                                <!-- <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">

                                </td> -->
                                <td rowspan="2" v-if="!isTangCenBei">
                                    <span class="msg" v-if="roundShoulder">{{ roundShoulder.left.risk !== '--' ?
                                        roundShoulder.left.risk : roundShoulder.right.risk !== '--' ?
                                            roundShoulder.right.risk :
                                            '--' }}</span>
                                </td>
                            </tr>
                            <!-- 右圆肩 -->
                            <tr>
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="roundShoulder.right.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture3-1.png" />
                                            <img v-else src="@/assets/images/postureBone/posture3.png" />
                                        </span>
                                        <div>
                                            <span class="name">右圆肩</span>
                                            <span class="msg" v-if="roundShoulder && roundShoulder.right">{{
                                                roundShoulder.right.conclusion === '正常' ? '正常' : isNewMathTt ?
                                                    roundShoulder.right.conclusion : '可能存在右圆肩' }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style="border-right: 1px solid rgb(206, 215, 224);">
                                    <span v-if="roundShoulder && roundShoulder.right" class="val">{{
                                        toDecimal(roundShoulder.right.val, 1) }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="roundShoulder && roundShoulder.right" :val="roundShoulder.right.contrast"></contrast>
                            </td> -->
                                <!-- <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">
                                </td> -->
                            </tr>
                            <!-- 高低肩 -->
                            <tr>
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="highLowShoudler.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture4-1.png" />
                                            <img v-else-if="highLowShoudler.conclusion.includes('左高')"
                                                src="@/assets/images/postureBone/posture4.png" />
                                            <img v-else-if="highLowShoudler.conclusion.includes('右高')"
                                                src="@/assets/images/postureBone/posture4-2.png" />
                                        </span>
                                        <div>
                                            <span class="name">高低肩</span>
                                            <span class="msg" v-if="highLowShoudler">{{
                                                highLowShoudler.conclusion === '正常' ?
                                                    '正常' :
                                                    isNewMathTt ? `${highLowShoudler.conclusion}` :
                                                        `可能存在高低肩(${highLowShoudler.conclusion})` }}</span>
                                        </div>

                                    </div>
                                </td>
                                <td>
                                    <span v-if="highLowShoudler" class="val">{{ toDecimal(highLowShoudler.val, 1)
                                    }}{{ dealWithUnitDu() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="highLowShoudler" :val="highLowShoudler.contrast" unit="cm"></contrast>
                            </td> -->
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="highLowShoudler">{{ highLowShoudler.risk }}</span>
                                </td>
                            </tr>
                            <!-- 骨盆前/后移 -->
                            <tr v-if="!isShowFree">
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="pelvisForward.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture5-1.png" />
                                            <img v-else src="@/assets/images/postureBone/posture5.png" />
                                        </span>
                                        <div>
                                            <span v-if="isNewMathTt" class="name">骨盆前移</span>
                                            <span v-else class="name">骨盆前/后移</span>
                                            <span class="msg" v-if="pelvisForward">{{ pelvisForward.conclusion === '正常'
                                                ? '正常' :
                                                `${isNewMathTt ? '' : '可能存在'}${pelvisForward.conclusion}` }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span v-if="pelvisForward" class="val">{{ toDecimal(pelvisForward.val, 1)
                                    }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="pelvisForward" :val="pelvisForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="pelvisForward">{{ pelvisForward.risk }}</span>
                                </td>
                            </tr>
                            <!-- 骨盆前/后倾  已经迁移别处 v-if="pelvicForwardTilt.status"-->
                            <tr v-if="false">
                                <td>
                                    <div>
                                        <span class="postureBone"><img
                                                src="@/assets/images/postureBone/posture5.png" /></span>
                                        <div>
                                            <span class="name">骨盆前/后倾</span>
                                            <span class="msg" v-if="pelvicForwardTilt && pelvicForwardTilt.status">{{
                                                pelvicForwardTilt.conclusion === '正常' ? '正常' :
                                                    `可能存在${pelvicForwardTilt.conclusion}` }}</span>
                                            <span class="msg" v-else>--</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span v-if="pelvicForwardTilt && pelvicForwardTilt.status" class="val">{{
                                        toDecimal(pelvicForwardTilt.val, 1) }}°</span>
                                    <span class="val" v-else>--</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="pelvisForward" :val="pelvisForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="pelvicForwardTilt && pelvicForwardTilt.status">{{
                                        pelvicForwardTilt.risk }}</span>
                                    <span class="msg" v-else></span>
                                </td>
                            </tr>
                            <!-- 左膝评估 -->
                            <tr>
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="knee.left.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture6-1.png" />
                                            <img v-else-if="knee.left.conclusion.includes('超伸')"
                                                src="@/assets/images/postureBone/posture6.png" />
                                            <img v-else src="@/assets/images/postureBone/posture6-2.png" />
                                        </span>
                                        <div>
                                            <span class="name">左膝评估</span>
                                            <span class="msg" v-if="knee && knee.left">{{ knee.left.conclusion === '正常'
                                                ? '正常' :
                                                `${isNewMathTt ? '' : '可能存在'}${knee.left.conclusion}` }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style="border-right: 1px solid rgb(206, 215, 224);">
                                    <span v-if="knee && knee.left" class="val">{{ toDecimal(knee.left.val, 1) }}°</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="knee && knee.left" :val="knee.left.contrast" unit="°"></contrast>
                            </td> -->
                                <!-- <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">
                                </td> -->
                                <td rowspan="2" v-if="!isTangCenBei">
                                    <span class="msg" v-if="knee">{{ knee.left.risk !== '--' ? knee.left.risk :
                                        knee.right.risk
                                            !== '--' ? knee.right.risk : '--' }}</span>
                                </td>
                            </tr>
                            <!-- 右膝评估 -->
                            <tr>
                                <td>
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="knee.right.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture7-1.png" />
                                            <img v-else-if="knee.right.conclusion.includes('超伸')"
                                                src="@/assets/images/postureBone/posture7-2.png" />
                                            <img v-else src="@/assets/images/postureBone/posture7.png" />
                                        </span>
                                        <div>
                                            <span class="name">右膝评估</span>
                                            <span class="msg" v-if="knee && knee.right">{{ knee.right.conclusion ===
                                                '正常' ? '正常'
                                                :
                                                `${isNewMathTt ? '' : '可能存在'}${knee.right.conclusion}` }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style="border-right: 1px solid rgb(206, 215, 224);">
                                    <span v-if="knee && knee.right" class="val">{{ toDecimal(knee.right.val, 1)
                                    }}°</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="knee && knee.right" :val="knee.right.contrast"></contrast>
                            </td> -->
                                <!-- <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">
                                </td> -->
                            </tr>
                            <!-- 腿型 -->
                            <tr :class="['length-leg', isShowFree ? 'isShowFree-leg' : '']">
                                <td rowspan="2" :style="!isShowFree ? 'border-bottom-color: #009fe8;' : ''">
                                    <div>
                                        <span class="postureBone">
                                            <img v-if="leg.conclusion === '正常'"
                                                src="@/assets/images/postureBone/posture8.png" />
                                            <img v-else-if="leg.conclusion.includes('D')"
                                                src="@/assets/images/postureBone/posture8-d.png" />
                                            <img v-else-if="leg.conclusion.includes('K')"
                                                src="@/assets/images/postureBone/posture8-k.png" />
                                            <img v-else-if="leg.conclusion.includes('O')"
                                                src="@/assets/images/postureBone/posture8-o.png" />
                                            <img v-else-if="leg.conclusion.includes('X')"
                                                src="@/assets/images/postureBone/posture8-x.png" />
                                            <img v-else src="@/assets/images/postureBone/posture8-9.png" />
                                        </span>
                                        <div>
                                            <span class="name">腿型</span>
                                            <span class="msg" v-if="leg">
                                                {{ leg.conclusion === '正常' ? '正常' : `${isNewMathTt ? '' :
                                                    '可能存在'}${leg.conclusion}` }}
                                            </span>
                                        </div>

                                    </div>
                                </td>
                                <td style="">
                                    <span style="margin-top: 15px;" v-if="leg" class="val">左腿：{{ toDecimal(leg.leftVal,
                                        1)
                                    }}°</span>
                                    <div class="compensation val" style="margin-left: unset;" v-if="leg">右腿：{{
                                        toDecimal(leg.rightVal, 1)
                                    }}°</div>
                                </td>
                                <!-- <td style="border-bottom-color: transparent;">
                                <contrast style="margin-top: 15px;" v-if="leg" :val="leg.leftContrast" unit="°"></contrast>
                            </td> -->
                                <!-- <td rowspan="2" :style="!isShowFree ? 'border-bottom-color: #009fe8;' : ''">
                                </td> -->
                                <td v-if="!isTangCenBei" rowspan="2"
                                    :style="!isShowFree ? 'border-bottom-color: #009fe8;' : ''">
                                    <span class="msg" v-if="leg">{{ leg.risk }}</span>

                                </td>
                            </tr>
                            <!-- <tr class="length-leg" :style="{ border: isShowFree ? '1px solid #009FE8' : '' }">
                                <td style="border-left-color: transparent;border-right-color: transparent;">

                                </td>
                                <td style="border-right-color: transparent;">
                                    <contrast style="margin-bottom: 15px;" v-if="leg" :val="leg.rightContrast" unit="°">
                                    </contrast>
                                </td>
                            </tr> -->
                            <!-- 长短腿 已经迁移别处-->
                            <tr v-if="false">
                                <td>
                                    <span class="name">长短腿</span>
                                </td>
                                <td>
                                    <span v-if="legLengthDiff && legLengthDiff.status" class="val">{{
                                        toDecimal(legLengthDiff.val, 1) }}cm</span>
                                    <span class="val" v-else>--</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="pelvisForward" :val="pelvisForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td>
                                    <span class="msg" v-if="legLengthDiff && legLengthDiff.status">{{
                                        legLengthDiff.conclusion === '正常' ? '正常' :
                                            `${legLengthDiff.conclusion}` }}</span>
                                    <span v-else class="msg">--</span>
                                </td>
                                <td>
                                    <span class="msg" v-if="legLengthDiff && legLengthDiff.status">{{ legLengthDiff.risk
                                    }}</span>
                                    <span v-else class="msg">--</span>
                                </td>
                            </tr>
                        </tbody>
                        <tbody></tbody>
                    </table>
                    <table v-else border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>测量值</th>
                                <!-- v2.2.0需求屏蔽 -->
                                <!-- <th>与上次对比</th> -->
                                <th>评估结论</th>
                                <th v-if="!isTangCenBei">风险提示</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 头前引 -->
                            <tr>
                                <td>
                                    <span class="name">头前引</span>
                                </td>
                                <td>
                                    <span v-if="headForward" class="val">{{ toDecimal(headForward.val, 1)
                                    }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="headForward" :val="headForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td>
                                    <span class="msg" v-if="headForward">{{ headForward.conclusion === '正常' ? '正常' :
                                        `${isNewMathTt ? '' : '可能存在'}${headForward.conclusion}` }}</span>
                                </td>
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="headForward">{{ headForward.risk }}</span>
                                </td>
                            </tr>
                            <!-- 头侧歪 -->
                            <tr>
                                <td>
                                    <span class="name">头侧歪</span>
                                </td>
                                <td>
                                    <span v-if="headSlant" class="val">{{ toDecimal(headSlant.val, 1) }}°</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="headSlant" :val="headSlant.contrast" unit="°"></contrast>
                            </td> -->
                                <td>
                                    <span class="msg" v-if="headSlant">{{ headSlant.conclusion === '正常' ? '正常' :
                                        isNewMathTt ? `${headSlant.conclusion}` : `可能存在头侧歪(${headSlant.conclusion})`
                                    }}</span>
                                </td>
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="headSlant">{{ headSlant.risk }}</span>
                                </td>
                            </tr>
                            <!-- 左圆肩 -->
                            <tr>
                                <td>
                                    <span class="name">左圆肩</span>
                                </td>
                                <td>
                                    <span v-if="roundShoulder && roundShoulder.left" class="val">{{
                                        toDecimal(roundShoulder.left.val, 1) }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="roundShoulder && roundShoulder.left" :val="roundShoulder.left.contrast" unit="°"></contrast>
                            </td> -->
                                <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">
                                    <span class="msg" v-if="roundShoulder && roundShoulder.left">{{
                                        roundShoulder.left.conclusion === '正常' ? '正常' : isNewMathTt ?
                                            roundShoulder.left.conclusion : '可能存在左圆肩' }}</span>
                                </td>
                                <td rowspan="2" v-if="!isTangCenBei">
                                    <span class="msg" v-if="roundShoulder">{{ roundShoulder.left.risk !== '--' ?
                                        roundShoulder.left.risk : roundShoulder.right.risk !== '--' ?
                                            roundShoulder.right.risk :
                                            '--' }}</span>
                                </td>
                            </tr>
                            <!-- 右圆肩 -->
                            <tr>
                                <td>
                                    <span class="name">右圆肩</span>
                                </td>
                                <td>
                                    <span v-if="roundShoulder && roundShoulder.right" class="val">{{
                                        toDecimal(roundShoulder.right.val, 1) }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="roundShoulder && roundShoulder.right" :val="roundShoulder.right.contrast"></contrast>
                            </td> -->
                                <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">
                                    <span class="msg" v-if="roundShoulder && roundShoulder.right">{{
                                        roundShoulder.right.conclusion === '正常' ? '正常' : isNewMathTt ?
                                            roundShoulder.right.conclusion : '可能存在右圆肩' }}</span>
                                </td>
                            </tr>
                            <!-- 高低肩 -->
                            <tr>
                                <td>
                                    <span class="name">高低肩</span>
                                </td>
                                <td>
                                    <span v-if="highLowShoudler" class="val">{{ toDecimal(highLowShoudler.val, 1)
                                    }}{{ dealWithUnitDu() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="highLowShoudler" :val="highLowShoudler.contrast" unit="cm"></contrast>
                            </td> -->
                                <td>
                                    <span class="msg" v-if="highLowShoudler">{{ highLowShoudler.conclusion === '正常' ?
                                        '正常' :
                                        isNewMathTt ? `${highLowShoudler.conclusion}` :
                                            `可能存在高低肩(${highLowShoudler.conclusion})` }}</span>
                                </td>
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="highLowShoudler">{{ highLowShoudler.risk }}</span>
                                </td>
                            </tr>
                            <!-- 骨盆前/后移 -->
                            <tr v-if="!isShowFree">
                                <td>
                                    <span v-if="isNewMathTt" class="name">骨盆前移</span>
                                    <span v-else class="name">骨盆前/后移</span>
                                </td>
                                <td>
                                    <span v-if="pelvisForward" class="val">{{ toDecimal(pelvisForward.val, 1)
                                    }}{{ dealWithUnitCM() }}</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="pelvisForward" :val="pelvisForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td>
                                    <span class="msg" v-if="pelvisForward">{{ pelvisForward.conclusion === '正常' ? '正常' :
                                        `${isNewMathTt ? '' : '可能存在'}${pelvisForward.conclusion}` }}</span>
                                </td>
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="pelvisForward">{{ pelvisForward.risk }}</span>
                                </td>
                            </tr>
                            <!-- 骨盆前/后倾  已经迁移别处 v-if="pelvicForwardTilt.status"-->
                            <tr v-if="false">
                                <td>
                                    <span class="name">骨盆前/后倾</span>
                                </td>
                                <td>
                                    <span v-if="pelvicForwardTilt && pelvicForwardTilt.status" class="val">{{
                                        toDecimal(pelvicForwardTilt.val, 1) }}°</span>
                                    <span class="val" v-else>--</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="pelvisForward" :val="pelvisForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td>
                                    <span class="msg" v-if="pelvicForwardTilt && pelvicForwardTilt.status">{{
                                        pelvicForwardTilt.conclusion === '正常' ? '正常' :
                                            `可能存在${pelvicForwardTilt.conclusion}` }}</span>
                                    <span class="msg" v-else>--</span>
                                </td>
                                <td v-if="!isTangCenBei">
                                    <span class="msg" v-if="pelvicForwardTilt && pelvicForwardTilt.status">{{
                                        pelvicForwardTilt.risk }}</span>
                                    <span class="msg" v-else></span>
                                </td>
                            </tr>
                            <!-- 左膝评估 -->
                            <tr>
                                <td>
                                    <span class="name">左膝评估</span>
                                </td>
                                <td>
                                    <span v-if="knee && knee.left" class="val">{{ toDecimal(knee.left.val, 1) }}°</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="knee && knee.left" :val="knee.left.contrast" unit="°"></contrast>
                            </td> -->
                                <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">
                                    <span class="msg" v-if="knee && knee.left">{{ knee.left.conclusion === '正常' ? '正常' :
                                        `${isNewMathTt ? '' : '可能存在'}${knee.left.conclusion}` }}</span>
                                </td>
                                <td rowspan="2" v-if="!isTangCenBei">
                                    <span class="msg" v-if="knee">{{ knee.left.risk !== '--' ? knee.left.risk :
                                        knee.right.risk
                                            !== '--' ? knee.right.risk : '--' }}</span>
                                </td>
                            </tr>
                            <!-- 右膝评估 -->
                            <tr>
                                <td>
                                    <span class="name">右膝评估</span>
                                </td>
                                <td>
                                    <span v-if="knee && knee.right" class="val">{{ toDecimal(knee.right.val, 1)
                                    }}°</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="knee && knee.right" :val="knee.right.contrast"></contrast>
                            </td> -->
                                <td :style="isTangCenBei ? '' : 'border-right: 1px solid #ced7e0;'">
                                    <span class="msg" v-if="knee && knee.right">{{ knee.right.conclusion === '正常' ? '正常'
                                        :
                                        `${isNewMathTt ? '' : '可能存在'}${knee.right.conclusion}` }}</span>
                                </td>
                            </tr>
                            <!-- 腿型 -->
                            <tr :class="['length-leg', isShowFree ? 'isShowFree-leg' : '']">
                                <td rowspan="2" :style="!isShowFree ? 'border-bottom-color: #009fe8;' : ''">
                                    <span class="name">腿型</span>
                                </td>
                                <td style="border-bottom-color: transparent; border-bottom:'none'">
                                    <span style="margin-top: 15px;" v-if="leg" class="val">左腿：{{ toDecimal(leg.leftVal,
                                        1)
                                    }}°</span>
                                </td>
                                <!-- <td style="border-bottom-color: transparent;">
                                <contrast style="margin-top: 15px;" v-if="leg" :val="leg.leftContrast" unit="°"></contrast>
                            </td> -->
                                <td rowspan="2" :style="!isShowFree ? 'border-bottom-color: #009fe8;' : ''">
                                    <span class="msg" v-if="leg">
                                        {{ leg.conclusion === '正常' ? '正常' : `${isNewMathTt ? '' :
                                            '可能存在'}${leg.conclusion}` }}
                                    </span>
                                </td>
                                <td v-if="!isTangCenBei" rowspan="2"
                                    :style="!isShowFree ? 'border-bottom-color: #009fe8;' : ''">
                                    <span class="msg" v-if="leg">{{ leg.risk }}</span>
                                </td>
                            </tr>
                            <tr class="length-leg" :style="{ border: isShowFree ? '1px solid #009FE8' : '' }">
                                <td style="border-left-color: transparent;border-right-color: transparent;">
                                    <span :style="(!isShowFree ? 'margin-bottom: 15px;' : '' ) + 'margin-left: 10px;'" v-if="leg"
                                        class="val">右腿：{{
                                            toDecimal(leg.rightVal, 1)
                                        }}°</span>
                                </td>
                                <!-- <td style="border-right-color: transparent;">
                                <contrast style="margin-bottom: 15px;" v-if="leg" :val="leg.rightContrast" unit="°"></contrast>
                            </td> -->
                            </tr>
                            <!-- 长短腿 已经迁移别处-->
                            <tr v-if="false">
                                <td>
                                    <span class="name">长短腿</span>
                                </td>
                                <td>
                                    <span v-if="legLengthDiff && legLengthDiff.status" class="val">{{
                                        toDecimal(legLengthDiff.val, 1) }}cm</span>
                                    <span class="val" v-else>--</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="pelvisForward" :val="pelvisForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td>
                                    <span class="msg" v-if="legLengthDiff && legLengthDiff.status">{{
                                        legLengthDiff.conclusion === '正常' ? '正常' :
                                            `${legLengthDiff.conclusion}` }}</span>
                                    <span v-else class="msg">--</span>
                                </td>
                                <td>
                                    <span class="msg" v-if="legLengthDiff && legLengthDiff.status">{{ legLengthDiff.risk
                                    }}</span>
                                    <span v-else class="msg">--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h2 v-if="!deviceVApro3 && !deviceVApro5 && !deviceVApro6 && !deviceVALit6"
                    :style="showGirth ? 'visibility:visible' : 'visibility:hidden'">
                    体围测量
                    <em>cm</em>
                    <p class="tips">*为保证数据准确性，需穿着紧身衣服、扎起头发<span>高精度</span></p>
                </h2>
                <div v-if="!deviceVApro3 && !deviceVApro5 && !deviceVApro6 && !deviceVALit6"
                    :style="showGirth ? 'visibility:visible' : 'visibility:hidden'" class="footer-part">
                    <div :class="[isTangCenBei || isNewMath ? 'girth1' : 'girth', isNewMath ? 'isNewMath' : '']">
                        <table border="1" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th>项目</th>
                                    <th v-for="(girth, key) in girthData" :key="key">{{ girth.name }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- 本次测量 -->
                                <tr>
                                    <td>本次</td>
                                    <td v-for="(girth, key) in girthData" :key="key">
                                        <span v-if="girth.val !== ''" class="val">{{ girth.val }}</span>
                                        <span v-else class="val">--</span>
                                    </td>
                                </tr>
                                <!-- v2.2.0需求屏蔽 -->
                                <!-- 与上次对比 -->
                                <!-- <tr>
                                <td>与上次对比</td>
                                <td v-for="(girth, key) in girthData" :key="key">
                                    <span v-if="girth.diff !== ''" class="val">{{ girth.diff }}</span>
                                    <span v-else class="val">--</span>
                                </td>
                            </tr> -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- 骨盆页面抽离 -->
                <div v-if="(deviceVApro3 || deviceVApro5) && isShowFree" class="pelvis">
                    <h2>骨盆评估概览</h2>
                    <table border="1" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th style="width: 140px;"></th>
                                <!-- v2.2.0需求屏蔽 -->
                                <!-- <th>与上次对比</th> -->
                                <th width="360px">评估结论</th>
                                <th class="pelvis-th-last" style="text-align:left">风险提示</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isNewMathTt">
                                <td>
                                    <span class="name">骨盆前移</span>
                                </td>
                                <td>
                                    <div>
                                        <div class="pelvis-div-new">
                                            <img v-for="(item, index) in imgList[3]" :key="index" :src="item.path"
                                                alt="">
                                        </div>
                                        <div class="pelvis-box-tags"
                                            :style="{ 'left': pelvisForwardOptionIsNew(pelvisForward.val) * 116.6 + 'px' }">
                                            <img v-if="pelvisForwardOption(pelvisForward.val) !== 0"
                                                :src="pelvisForwardIcon" />
                                        </div>
                                        <div :class="commonIndexIsNew(pelvisForwardOption(pelvisForward.val)) === index ? 'pelvis-box-active-new' : 'pelvis-box-new'"
                                            v-for="(item, index) in pelvisList[3]" :key="index">
                                            <span>{{ item }}</span>
                                        </div>
                                    </div>

                                </td>
                                <td class="text-align">
                                    <span class="msg" v-if="pelvisForward">{{ pelvisForward.risk }}</span>
                                </td>
                            </tr>
                            <tr v-else>
                                <td>
                                    <span class="name">骨盆前/后移</span>
                                </td>
                                <td>
                                    <div>
                                        <div class="pelvis-div">
                                            <img v-for="(item, index) in imgList[0]" :key="index" :src="item.path"
                                                alt="">
                                        </div>
                                        <div class="pelvis-box-tags"
                                            :style="{ 'left': pelvisForwardOption(pelvisForward.val) * 70 + 'px' }">
                                            <img v-if="pelvisForwardOption(pelvisForward.val) !== 0"
                                                :src="pelvisForwardIcon" />
                                        </div>
                                        <div :class="commonIndex(pelvisForwardOption(pelvisForward.val)) === index ? 'pelvis-box-active' : 'pelvis-box'"
                                            v-for="(item, index) in pelvisList[0]" :key="index">
                                            <span>{{ item }}</span>
                                        </div>
                                    </div>

                                </td>
                                <td class="text-align">
                                    <span class="msg" v-if="pelvisForward">{{ pelvisForward.risk }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">骨盆前/后倾</span>
                                </td>
                                <td>
                                    <div>
                                        <div v-if="pelvicForwardTilt && pelvicForwardTilt.status" class="pelvis-div">
                                            <img v-for="(item, index) in imgList[1]" :key="index" :src="item.path"
                                                alt="">
                                        </div>
                                        <div v-else class="pelvis-div-span">
                                            <span><img src="@/assets/images/gup/error-warning-fill@2x.png"
                                                    alt="">测量未成功，请穿紧身衣服并保持静止进行测量</span>
                                        </div>
                                        <div class="pelvis-box-tags"
                                            :style="{ 'left': pelvicForwardTiltOption(pelvicForwardTilt.val) * 70 + 'px' }">
                                            <img v-if="pelvicForwardTiltOption(pelvicForwardTilt.val) !== 0 && pelvicForwardTilt.status"
                                                :src="pelvicForwardTiltIcon" />
                                        </div>

                                        <div :class="commonIndex(pelvicForwardTiltOption(pelvicForwardTilt.val)) === index && pelvicForwardTilt.status ? 'pelvis-box-active' : 'pelvis-box'"
                                            class="pelvis-box" v-for="(item, index) in pelvisList[1]" :key="index">
                                            <span>{{ item }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-align">
                                    <span class="msg" v-if="pelvicForwardTilt && pelvicForwardTilt.status">{{
                                        pelvicForwardTilt.risk }}</span>
                                    <span class="msg" v-else>--</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="name">长短腿</span>
                                </td>
                                <!-- <td>
                                <contrast v-if="headForward" :val="headForward.contrast" unit="°"></contrast>
                            </td> -->
                                <td>
                                    <div>
                                        <div v-if="legLengthDiff.status" class="pelvis-div">
                                            <img v-for="(item, index) in imgList[2]" :key="index" :src="item.path"
                                                alt="">
                                        </div>
                                        <div v-else class="pelvis-div-span">
                                            <span><img src="@/assets/images/gup/error-warning-fill@2x.png"
                                                    alt="">测量未成功，请穿紧身衣服并保持静止进行测量</span>
                                        </div>
                                        <div class="pelvis-box-tags"
                                            :style="{ 'left': legLengthDiffOption(legLengthDiff.val) * 70 + 'px' }">
                                            <img v-if="legLengthDiffOption(legLengthDiff.val) !== 0 && legLengthDiff.status"
                                                :src="legLengthDiffIcon" />
                                        </div>
                                        <div :class="commonIndex(legLengthDiffOption(legLengthDiff.val)) === index && legLengthDiff.status ? 'pelvis-box-active' : 'pelvis-box'"
                                            class="pelvis-box" v-for="(item, index) in pelvisList[2]" :key="index">
                                            <span>{{ item }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-align">
                                    <span class="msg" v-if="legLengthDiff && legLengthDiff.status">{{ legLengthDiff.risk
                                        === "--" ? "此项评估无异常。" : legLengthDiff.risk }}</span>
                                    <span v-else>--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <report-footer v-if="showGirth && !deviceVApro3 && !deviceVApro5 && !deviceVALit6 && !isTangCenBei && !isNewMath"
                    :scanId="reportInfo.scanId"></report-footer>
            </div>
        </div>
        <p v-if="isTangCenBei" class="tang">*以上数据来源于仪器分析，仅供参考，如需进一步了解，请咨询医生或药师。</p>
    </div>
</template>

<script type="text/ecmascript-6">
import Contrast from '@/components/Contrast'
import ReportFooter from '@/components/Footer'
import { getBsConclusion, bsScanFileInfos, bmGirthContrastInfo } from '@/assets/js/apolloGql.js'
import { _toDecimal, _contrastVal } from '@/assets/js/util.js'
import { promptshapeageva, promptshapeagevr, promptgirthage, algUpData } from '@/assets/js/config.js'

export default {
    name: 'BsReport',
    components: {
        Contrast,
        ReportFooter
    },
    props: {
        reportInfo: Object,
        memberInfo: Object,
        deviceVApro3: {
            type: Boolean,
            default: false
        },
        deviceVApro5: {
            type: Boolean,
            default: false
        },
        deviceVApro6: {
            type: Boolean,
            default: false
        },
        deviceVRpro5: {
            type: Boolean,
            default: false
        },
        deviceVRpro3: {
            type: Boolean,
            default: false
        },
        deviceVRpro5ARM: {
            type: Boolean,
            default: false
        },
        deviceVALit6: {
            type: Boolean,
            default: false
        },
        showGirth: {
            type: Boolean,
            default: false
        },
        isShowFree: {
            type: Boolean,
            default: false
        },
        isTangCenBei: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            // 体态评估数据
            promptshapeageva,
            promptshapeagevr,
            promptgirthage,
            algUpData,
            isNewMath: false,
            bsInfo: {},
            models: [
                {
                    name: '正视图',
                    img: ''
                },
                {
                    name: '左视图',
                    img: ''
                },
                {
                    name: '右视图',
                    img: ''
                },
                {
                    name: '顶视图',
                    img: ''
                }
            ],
            // 围度数据
            girthData: [
                {
                    name: '左上臂',
                    key: 'leftUpperArmGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '右上臂',
                    key: 'rightUpperArmGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '胸围',
                    key: 'bustGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '高腰围',
                    key: 'waistGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '臀围',
                    key: 'hipGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '左大腿',
                    key: 'leftThighGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '右大腿',
                    key: 'rightThighGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '左小腿',
                    key: 'leftCalfGirth',
                    val: '',
                    diff: ''
                },
                {
                    name: '右小腿',
                    key: 'rightCalfGirth',
                    val: '',
                    diff: ''
                }
            ],
            evalInfo: {},
            loadedImgNum: 0,
            isGetImg: false,
            pelvisList: [
                ['前移异常', '前移风险', '正常', '后移风险', '后移异常'],
                ['前倾异常', '前倾风险', '正常', '后倾风险', '后倾异常'],
                ['左长异常', '左长风险', '正常', '右长风险', '右长异常'],
                ['异常', '可能异常', '正常'],
            ],
            imgList: [
                [
                    {
                        path: require('@/assets/images/gup/qianyi.png')
                    },
                    {
                        path: require('@/assets/images/gup/nomol.png')
                    },
                    {
                        path: require('@/assets/images/gup/houyi2@2x.png')
                    },
                ],
                [
                    {
                        path: require('@/assets/images/gup/qianqingyichang2@2x.png')
                    },
                    {
                        path: require('@/assets/images/gup/nomol.png')
                    },
                    {
                        path: require('@/assets/images/gup/houqingyichang2@2x.png')
                    },
                ],
                [
                    {
                        path: require('@/assets/images/gup/zuochang2@2x.png')
                    },
                    {
                        path: require('@/assets/images/gup/zhenchang2@2x.png')
                    },
                    {
                        path: require('@/assets/images/gup/youzhang2@2x.png')
                    },
                ],
                [
                    {
                        path: require('@/assets/images/gup/qianyi.png')
                    },
                    {
                        path: require('@/assets/images/gup/nomol.png')
                    }
                ],
            ],
            select: [
                { path: require('@/assets/images/gup/alert-fill@2x.png') },
                { path: require('@/assets/images/gup/alert-fill2@2x.png') }
            ],
            // "是否用新算法"
            isNewMathTt: 0
        }
    },
    computed: {
        // 头前引
        headForward() {
            const info = this.evalInfo['headForward']
            if (!info) {
                return ''
            }
            return info
        },
        // 头侧歪
        headSlant() {
            const info = this.evalInfo['headSlant']
            if (!info) {
                return ''
            }
            return info
        },
        // 圆肩
        roundShoulder() {
            const leftInfo = this.evalInfo['roundShoulderLeft']
            const rightInfo = this.evalInfo['roundShoulderRight']
            if (!leftInfo || !rightInfo) {
                return ''
            }
            return {
                left: leftInfo,
                right: rightInfo
            }
        },
        // 高低肩
        highLowShoudler() {
            const info = this.evalInfo['highLowShoudler']
            if (!info) {
                return ''
            }
            return info
        },
        // 骨盆前/后移
        pelvisForward() {
            const info = this.evalInfo['pelvisForward']
            if (!info) {
                return ''
            }
            return info
        },
        // 骨盆前/后倾
        pelvicForwardTilt() {
            const info = this.evalInfo['pelvicForwardTilt']
            if (!info) {
                return ''
            }
            return info
        },
        // 膝盖评估
        knee() {
            const leftInfo = this.evalInfo['leftKneeCheck']
            const rightInfo = this.evalInfo['rightKneeCheck']
            if (!leftInfo || !rightInfo) {
                return ''
            }
            return {
                left: leftInfo,
                right: rightInfo
            }
        },
        // 腿型
        leg() {
            const info = this.evalInfo['legXo']
            if (!info) {
                return ''
            }
            return info
        },
        // 长短腿
        legLengthDiff() {
            const info = this.evalInfo['legLengthDiff']
            if (!info) {
                return ''
            }
            return info
        },
        // 匹配Icon
        pelvisForwardIcon() {
            return [1, -1].indexOf(this.pelvisForwardOption(this.pelvisForward.val)) > -1 ? this.select[1].path : this.select[0].path
        },
        // 骨盆
        pelvicForwardTiltIcon() {
            return [1, -1].indexOf(this.pelvicForwardTiltOption(this.pelvicForwardTilt.val)) > -1 ? this.select[1].path : this.select[0].path
        },
        legLengthDiffIcon() {
            return [1, -1].indexOf(this.legLengthDiffOption(this.legLengthDiff.val)) > -1 ? this.select[1].path : this.select[0].path
        },
        // 显示最新算法提示tip
        xianshiisVA() {
            return this.isNewMath && (this.deviceVApro3 || this.deviceVApro5)
        },
        xianshiisVR() {
            return this.isNewMath && (this.deviceVRpro3 || this.deviceVRpro5 || this.deviceVRpro5ARM)
        }
    },
    created() {
        if (this.deviceVApro3 || this.deviceVApro5) {
            this.models.splice(2, 0, {
                name: '后视图',
                img: ''
            })
        }
        this.getBsConclusion()
        this.getBsScanFileInfos()
        // BDA成功 获取围度信息
        if (this.reportInfo.bdaStatus === 1) {
            this.bmGirthContrastInfo()
        }
    },
    methods: {
        // 骨盆规则
        pelvisForwardOption(v) {
            if (170 <= v && v < 175) {
                this.handlerIcon(0, 0, 'error-qianyi')
                return -1
            } else if (170 > v) {
                this.handlerIcon(0, 0, 'error-qianyi')
                return -2
            } else if (185 < v && v <= 190) {
                this.handlerIcon(0, 2, 'error-houyi')
                return 1
            } else if (v > 190) {
                this.handlerIcon(0, 2, 'error-houyi')
                return 2
            } else if (175 <= v && v <= 185) {
                this.handlerIcon(0, 1, 'qianZc')
            }
            return 0
        },
        // 骨盆规则
        pelvisForwardOptionIsNew(v) {
            console.log(v, 8888)
            if (v > 5) {
                this.handlerIcon(3, 0, 'error-qianyi')
                return -1
            } else if (4 < v) {
                this.handlerIcon(3, 0, 'error-qianyi')
                return 0
            } else if (4 >= v && v <= 5) {
                this.handlerIcon(3, 1, 'qianZc')
            }

            return 1
        },
        // 骨盆前后倾
        pelvicForwardTiltOption(v) {
            if (15 < v && v <= 20) {
                this.handlerIcon(1, 0, 'tiaoZ')
                return -1
            } else if (20 < v) {
                this.handlerIcon(1, 0, 'tiaoZ')
                return -2
            } else if (v < 0 && v >= -5) {
                this.handlerIcon(1, 2, 'houqingyichang1@2x')
                return 1
            } else if (v < -5) {
                this.handlerIcon(1, 2, 'houqingyichang1@2x')
                return 2
            } else if (0 <= v && v <= 15) {
                this.handlerIcon(1, 1, 'qianZc')
            }
            return 0
        },
        legLengthDiffOption(v) {
            if (1 < v && v <= 2) {
                this.handlerIcon(2, 0, 'zuochang@2x')
                return -1
            } else if (2 < v) {
                this.handlerIcon(2, 0, 'zuochang@2x')
                return -2
            } else if (v < -1 && v >= -2) {
                this.handlerIcon(2, 2, 'youzhang@2x')
                return 1
            } else if (v < -2) {
                this.handlerIcon(2, 2, 'youzhang@2x')
                return 2
            } else if (-1 <= v && v <= 1) {
                this.handlerIcon(2, 1, 'zhenchang@2x')
            }
            return 0
        },
        commonIndex(key) {
            switch (key) {
                case -2:
                    return 0
                case -1:
                    return 1
                case 0:
                    return 2
                case 1:
                    return 3
                case 2:
                    return 4
                default:
                    break
            }
        },
        commonIndexIsNew(key) {
            switch (key) {
                case -2:
                    return 0
                case -1:
                    return 1
                case 0:
                    return 2
                default:
                    break
            }
        },
        // 处理iCON
        handlerIcon(index, second, img) {
            this.imgList[index][second].path = require(`@/assets/images/gup/${img}.png`)
        },

        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        dealWithUnitCM() {
            // ° 转 cm
            if (this.isNewMathTt) {
                return ' cm'
            } else {
                return '°'
            }
        },
        dealWithUnitDu() {
            // cm转 °
            if (this.isNewMathTt) {
                return '°'
            } else {
                return ' cm'
            }
        },
        // 围度数据
        async bmGirthContrastInfo() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bmGirthContrastInfo,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bmGirthContrastInfo
                    const girthData = info.data
                    if (info.code === 200 && girthData.length !== 0) {
                        this.isNewMath = girthData[0].isNewMath
                        if (this.isNewMath) {
                            this.girthData.push(
                                {
                                    name: '颈围',
                                    key: 'neckGirth',
                                    val: '',
                                    diff: ''
                                },
                                {
                                    name: '中腰围',
                                    key: 'midWaistGirth',
                                    val: '',
                                    diff: ''
                                },
                                {
                                    name: '低腰围',
                                    key: 'lowWaistGirth',
                                    val: '',
                                    diff: ''
                                },
                                {
                                    name: '左大腿最小围',
                                    key: 'leftMinThighGirth',
                                    val: '',
                                    diff: ''
                                },
                                {
                                    name: '右大腿最小围',
                                    key: 'rightMinThighGirth',
                                    val: '',
                                    diff: ''
                                },
                            )
                        }
                        this.girthData.forEach(girth => {
                            // 测量值
                            girth.val = this.toDecimal(girthData[0][girth.key], 1)
                            // 对比值
                            if (girthData[1] && girthData[1][girth.key]) {
                                const diff = _contrastVal(girthData[0][girth.key], girthData[1][girth.key])
                                girth.diff = diff
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取体态评估数据
        async getBsConclusion() {
            const userinfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: getBsConclusion,
                    variables: userinfo
                })
                .then(res => {
                    const info = res.data.bsEvalConclusion
                    const shapeData = info.data
                    console.log(shapeData, 88888)
                    if (info.code === 200) {
                        console.log(shapeData)
                        this.isNewMathTt = shapeData.isNewMathTt
                        this.evalInfo = shapeData
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取体态相关扫描模型文件
        async getBsScanFileInfos() {
            const userinfo = {
                scanId: this.reportInfo.scanId
            }
            console.log('开始获取体态扫描文件信息，scanId:', userinfo.scanId)
            await this.$apollo
                .query({
                    query: bsScanFileInfos,
                    variables: userinfo
                })
                .then(res => {
                    console.log('Apollo 查询结果:', res)
                    const data = res.data.bsScanFileInfos
                    console.log('bsScanFileInfos 数据:', data)
                    if (data && data.code === 200) {
                        this.isGetImg = true
                        let typeIndex = 0
                        if (!this.deviceVApro3 && !this.deviceVApro5) {
                            typeIndex = 1
                        }

                        if (data.data && data.data.length > 0) {
                            data.data.forEach((model, index) => {
                                // 正视图
                                if (model.fileType.id === 6) {
                                    this.models[0].img = model.filePath
                                    console.log('正视图:', model.filePath)
                                    console.log('正视图:', this.models[0].img)
                                    // 左视图
                                } else if (model.fileType.id === 7) {
                                    this.models[1].img = model.filePath
                                    // 后视图
                                } else if (model.fileType.id === 21 && (this.deviceVApro5 || this.deviceVApro3 || this.deviceVALit6)) {
                                    this.models[2].img = model.filePath
                                    // 右视图
                                } else if (model.fileType.id === 8) {
                                    this.models[3 - typeIndex].img = model.filePath
                                    // 顶视图
                                } else if (model.fileType.id === 19 && !this.deviceVALit6) {
                                    this.models[4 - typeIndex].img = model.filePath
                                }
                            })
                            console.log('更新后的 models:', this.models)
                            this.isImgErr = this.frontImg && this.sideImg && this.backImg ? false : true
                        } else {
                            console.log('data.data 为空或不存在')
                        }
                    } else {
                        console.log('bsScanFileInfos 返回错误代码:', data.code)
                    }
                })
                .catch(err => {
                    this.isImgErr = true
                    console.error('获取体态扫描文件信息失败:', err)
                })
        },
        imageLoaded() {
            this.loadedImgNum++
            // 体态图片加载完成
            if (this.loadedImgNum === 4) {
                console.log('SHAPE_IMG_OVER')
                console.log('SHAPE_REPORT_OVER')
            }
        },
        imageLoadError(item) {
            item.img = ''
            console.log('SHAPE_IMG_LOAD_ERROR')
        }
    }
}
</script>

<style scoped lang="less">
[v-cloak] {
    display: none;
}

.tipss {
    font-size: 12px;
    font-family: OPPOSans R, OPPOSans;
    font-weight: normal;
    color: #9b9b9b;
    margin-bottom: 10px;
}

.bs-report {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: 15px 0 19px 0;

    .postureA,
    .postureBash {
        position: relative;
        top: -15px;
    }

    h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-family: OPPOSans R;
        font-weight: normal;
        color: #333333;
        line-height: 32px;

        em {
            font-size: 12px;
            font-family: OPPOSans R;
            font-weight: normal;
            font-style: normal;
            color: #666666;
            line-height: 16px;
        }

        position: relative;

        .new-tap {
            position: absolute;
            right: 0;
            bottom: 2px;
            font-size: 12px;
            font-family: OPPOSans R;
            font-weight: normal;
            font-style: normal;
            color: #666666;
            line-height: 16px;
        }
    }

    .shape-model,
    .shape-model1 {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        .item {
            position: relative;
            width: 193px;
            height: 222px;
            text-align: center;
            background: url('../../assets/images/shape_bg.svg') no-repeat;
            background-size: cover;

            span {
                position: absolute;
                top: 6px;
                left: 6px;
                font-size: 15px;
                font-family: OPPOSans R;
                font-weight: normal;
                color: #666666;
                line-height: 20px;
            }

            img {
                margin-top: 2%;
                width: auto;
                height: 96%;

                &.default {
                    width: 108px;
                    height: auto;
                    margin-top: 42px;
                }
            }
        }
    }

    .shape-model1 {
        .item {
            width: 156px;
            height: 225px;
            text-align: center;
            background: url('../../assets/images/tipbj.svg') no-repeat;
            background-size: 100% 100%;
        }
    }

    .shape-table,
    .shape-table1,
    .shape-table2 {
        margin-bottom: 5px;

        table {
            text-align: left;
            table-layout: auto;

            thead {
                tr {
                    th {
                        padding-left: 9px;
                    }
                }
            }

            tbody {
                tr {
                    height: 70px;

                    td:first-child {
                        width: 300px;

                        &>div>div>span:last-child {
                            display: block;
                            margin-left: 6px;
                        }
                    }

                    td {
                        border-bottom: 1px solid #ced7e0;

                        span {
                            text-align: left;
                        }

                        .msg {
                            font-size: 12px;
                            font-family: OPPOSans R;
                            font-weight: normal;
                            color: #666666;
                            line-height: 20px;
                        }

                        .name {
                            font-weight: 500;
                        }

                        &:first-of-type {

                            &>div {
                                display: flex;
                                align-items: center;
                            }

                            // span {
                            //     display: block;
                            //     width: 130px;
                            //     margin-left: 9px;
                            // }
                        }

                        // &:nth-of-type(2) {
                        //     width: 117px;
                        //     span {
                        //         display: block;
                        //         width: 86px;
                        //         margin-left: 9px;
                        //     }
                        // }
                        &:nth-of-type(2) {
                            width: 80px;
                            padding-left: 9px;
                            text-align: left;
                        }

                        &:nth-of-type(3) {
                            width: 404px;

                            span {
                                display: block;
                                margin-right: 10px;
                                margin-left: 9px;
                            }
                        }

                        &:nth-of-type(4) {
                            width: 300px;
                            overflow: hidden;

                            span {
                                display: block;
                                width: 260px;
                                margin-left: 12px;
                                padding: 0 20px;
                            }
                        }
                    }

                    // 左右腿型
                    // &:last-of-type,
                    // &:nth-of-type(9) {
                    //     height: 35px;
                    // }

                    &:last-of-type {
                        td {
                            &:nth-of-type(2) {
                                width: 117px;
                                padding-left: 9px;
                                text-align: left;
                            }

                            border-bottom-color: #009fe8;
                        }
                    }
                }

                // 左右腿型
                .length-leg {
                    height: 28px;
                }
            }
        }

        .contrast-item {
            max-width: 96px;
        }
    }

    .shape-table1 {
        table {
            tbody {
                tr {
                    height: 56px;
                }

                .isShowFree-leg {
                    td {
                        border-bottom: 1px solid #009FE8;
                        ;
                    }
                }
            }
        }
    }

    .shape-table2 {
        table {
            tbody {
                tr {
                    height: 62px;
                }
            }
        }
    }

    .tips {
        display: inline-block;
        margin: 0;
        font-size: 12px;
        font-family: OPPOSans R;
        font-weight: normal;
        color: #9b9b9b;
        line-height: 18px;

        span {
            width: 44px;
            height: 16px;
            margin-left: 21px;
            float: right;
            text-align: center;
            font-size: 12px;
            font-family: OPPOSans R;
            font-weight: normal;
            color: #ffffff;
            line-height: 16px;
            background: #009FE8;
        }
    }

    .footer-part {
        display: flex;
        justify-content: space-between;

        .girth,
        .girth1 {
            display: flex;
            width: 565px;

            table {
                width: 565px;
                border: none;

                thead {
                    tr {
                        height: 24px;

                        th {
                            text-align: center;
                            // v2.2.0需求屏蔽
                            padding: 15px 0;

                            &:first-of-type {
                                width: 83px;
                            }

                            &:nth-last-of-type(1) {
                                width: 80px;
                            }

                            &:nth-last-of-type(2) {
                                width: 80px;
                            }
                        }
                    }
                }

                tbody {
                    tr {
                        td {
                            text-align: center;
                            height: 45px;
                            font-size: 12px;
                            font-family: OPPOSans M;
                            font-weight: normal;
                            color: #5698f5;
                            line-height: 19px;
                            // v2.2.0需求屏蔽
                            padding: 10px 0;

                            &:first-of-type {
                                font-family: OPPOSans M;
                                font-weight: normal;
                                color: #666666;
                                line-height: 20px;
                            }
                        }

                        // v2.2.0需求屏蔽
                        // &:first-of-type {
                        //     td {
                        //         border-bottom: 1px solid #ced7e0;
                        //     }
                        // }
                    }
                }
            }
        }

        .girth1 {
            width: 100%;

            table {
                width: 100%;
            }
        }

        .isNewMath {
            table {
                thead {
                    tr {
                        th {
                            &:nth-last-of-type(1) {
                                width: 80px;
                            }

                            &:nth-last-of-type(2) {
                                width: 80px;
                            }
                        }
                    }
                }
            }
        }
    }

    .pelvis {
        .pelvis-div {
            padding: 0 20px;
            display: flex;
            justify-content: space-around;

            img {
                width: 25px;
                height: 40px;
            }
        }
        .pelvis-div-new{
            padding: 0 20px 0  110px ;
            display: flex;
            justify-content: flex-start;
             img {
                width: 25px;
                height: 40px;
                 &:first-of-type {
                    margin-right: 145px;
                }
            }
        }

        .pelvis-div-span {
            font-size: 14px;
            color: #808080;
            line-height: 40px;
            font-style: normal;

            span {
                img {
                    display: inline;
                    position: relative;
                    top: 4px;
                    left: -2px;
                    width: 17px;
                    height: 17px;
                }
            }
        }

        tr {
            border: 1px solid #CED7E0;
            overflow: hidden;

            td {
                height: 90px;

                span {
                    font-family: OPPOSans M;
                    font-weight: normal;
                    font-size: 12px;
                    color: #666666;
                    line-height: 23px;
                }
            }

        }

        thead {
            tr {
                border: 1px solid #009FE8;

                .pelvis-th-last {
                    padding-left: 84px;
                }
            }
        }

        table {
            tr {
                border-right: 1px solid #009FE8;
                border-left: 1px solid #009FE8;

                &:last-child {
                    border-bottom: 1px solid #009FE8;
                }

                .text-align {
                    text-align: left;
                    padding: 0 20px 0 84px;
                }
            }
        }

        .pelvis-box,
        .pelvis-box-active,
        .pelvis-box-new,
        .pelvis-box-active-new {
            display: inline-block;
            width: 70px;
            height: 5px;
            background: #009FE8;
            position: relative;
            top: -7px;

            &:nth-of-type(6N+1),
            &:nth-of-type(3) {
                background: #E02020;
            }

            span {
                letter-spacing: 1px;
                font-size: 12px;
                color: #808080;
                line-height: 34px;
            }

            &:nth-of-type(6N+1) {
                border-bottom-right-radius: 3px;
                border-top-right-radius: 3px;
            }

            &:nth-of-type(3) {
                border-bottom-left-radius: 3px;
                border-top-left-radius: 3px;
            }

            &:nth-of-type(4N),
            &:nth-of-type(4N+2) {
                background: #F7B500;
            }
        }

        .pelvis-box-new,
        .pelvis-box-active-new {
            width: 116.6px;
             &:last-child {
                border-bottom-right-radius: 3px;
                border-top-right-radius: 3px;
            }
        }

        .pelvis-box-active,
        .pelvis-box-active-new {
            span {
                // font-weight: bold;
                color: #000;
            }
        }

        .pelvis-box-tags {
            position: relative;
            top: -9px;
            z-index: 10;
            height: 10px;

            img {
                width: 17px;
                height: 17px;
            }
        }

        .name {
            font-size: 15px;
            font-family: OPPOSans M;
            font-weight: 500;
            color: #333333;
        }
    }

    .postureBash {
        tbody {
            tr {
                height: 68px !important;
            }

            // 左右腿型
            .length-leg {
                height: 28px !important;
            }
        }
    }

    .footer {
        position: absolute;
        width: 267px;
        right: 0;
        bottom: 20px;
    }
}

.tang {
    position: relative;
    top: -40px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.44);
    line-height: 20px;
}

// 体态表格图片样式
.postureBone {
    display: inline-block;
    width: 86px;
    margin-left: 15px;

    &>img {
        margin-top: 2px;
        width: 76px;
    }
}

tbody.small .postureBone>img {
    margin-top: 2px;
    width: 53px;
}

.compensation {
    margin-left: 9px;
}
</style>
