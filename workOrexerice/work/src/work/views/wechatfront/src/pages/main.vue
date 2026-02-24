<template>
    <div class="body-composition-report-page">
        <div class="body-composition-page" :class="{ 'body-composition-hidden': slideDown }">
            <!--上滑-->
            <div v-if="modelInfo.biaStatus === 1 || modelInfo.evalStatus === 1" class="page-to-top"
                :class="{ 'page-top-hidden': hiddenStatus, 'top-composition-hidden': slideDown }">
                <div class="top-container">
                    <p>综合报告</p>
                    <img src="@/assets/images/report_icon.png" alt />
                </div>
                <div class="touch-model" @click="goSummary"></div>
            </div>
            <!--header-->
            <!--顶部趋势对比按钮-->
            <div class="header-menu" :class="{ 'page-top-hidden': hiddenStatus }">
                <span>
                    <img v-if="isShowMenu" src="@/assets/images/report_leftber_Info.png" alt
                        @click.prevent="openSide" />
                </span>
                <span class="last-trend" @click="goTrend"
                    v-if="(selected === 'composition' && modelInfo.biaStatus === 1) || (selected === 'girth' && modelInfo.bdaStatus === 1)">
                    <img src="@/assets/images/comp_trend_icon@2x.png" alt />
                    趋势对比
                </span>
                <!-- 分享 -->
                <!-- <span class="last-trend" v-if="selected === 'compare' && !noThermalData" @click="goToShare()">
                    <img src="@/assets/images/share/icon_share.svg" alt />
                </span>-->
            </div>
            <!-- 全部都测 -->
            <div v-if="navs.length > 3">
                <!--身体成分对比-->
                <body-item v-if="selected === 'composition'"></body-item>
                <!--体态评估-模型结论-->
                <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                    :notComposition="notComposition" :compositionFailed="compositionFailed"
                    v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                <!--围度信息-->
                <girth-item v-if="selected === 'girth'"></girth-item>
                <!-- 肩部功能 -->
                <shoulder-item v-if="selected === 'shoulder'"></shoulder-item>
                <!--列表导航-->
                <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                    <!-- 带icon大tab按钮 -->
                    <div>
                        <mt-navbar v-model="selected">
                            <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                <div class="tabFour">
                                    <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                    <img v-else :src="item.img" alt />
                                </div>
                            </mt-tab-item>
                        </mt-navbar>
                    </div>
                    <!-- 吸附顶部tab按钮 -->
                    <div class="composition-position" v-if="scrollTop && selected === 'composition'">
                        <mt-navbar v-model="selected">
                            <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                v-for="(item, index) in navs">
                                <img :src="item.img" alt />
                                <span>{{ item.name }}</span>
                            </mt-tab-item>
                        </mt-navbar>
                    </div>
                    <mt-tab-container v-model="selected">
                        <mt-tab-container-item id="composition" v-if="selected === 'composition'">
                            <body-data></body-data>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                            <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                :notComposition="notComposition" @isBsStatus="isBsStatus"
                                :compositionFailed="compositionFailed"></shape-data>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="girth" v-if="selected === 'girth'">
                            <girth-data></girth-data>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="shoulder" v-if="selected === 'shoulder'">
                            <shoulder-data v-if="modelInfo.bsShoulderScanResult == 1"></shoulder-data>
                        </mt-tab-container-item>
                    </mt-tab-container>
                </div>
            </div>

            <div v-else-if="navs.length === 3">
                <!-- 身体成分和体态 -->
                <div
                    v-if="modelInfo.biaStatus === 1 && modelInfo.evalStatus === 1 && modelInfo.bsShoulderScanResult !== 1 && !isVAPro3">
                    <!--身体成分对比-->
                    <body-item v-if="selected === 'composition'"></body-item>
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                    <!--围度信息-->
                    <girth-item v-if="selected === 'girth'"></girth-item>
                    <!--列表导航-->
                    <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabThree">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <!-- 吸附顶部tab按钮 -->
                        <div class="composition-position" v-if="scrollTop && selected === 'composition'">
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                    v-for="(item, index) in navs">
                                    <img :src="item.img" alt />
                                    <span>{{ item.name }}</span>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="composition" v-if="selected === 'composition'">
                                <body-data></body-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                                <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                    :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                    :notComposition="notComposition" @isBsStatus="isBsStatus"
                                    :compositionFailed="compositionFailed"></shape-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="girth" v-if="selected === 'girth'">
                                <girth-data></girth-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <!-- 体态和肩部 -->
                <div
                    v-if="modelInfo.biaStatus !== 1 && modelInfo.evalStatus === 1 && modelInfo.bsShoulderScanResult === 1 && !isVAPro3">
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                    <!--围度信息-->
                    <girth-item v-if="selected === 'girth'"></girth-item>
                    <!-- 肩部功能 -->
                    <shoulder-item v-if="selected === 'shoulder'"></shoulder-item>
                    <!--列表导航-->
                    <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabThree">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <!-- 吸附顶部tab按钮 -->
                        <div class="composition-position" v-if="scrollTop && selected === 'composition'">
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                    v-for="(item, index) in navs">
                                    <img :src="item.img" alt />
                                    <span>{{ item.name }}</span>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                                <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                    :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                    :notComposition="notComposition" @isBsStatus="isBsStatus"
                                    :compositionFailed="compositionFailed"></shape-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="girth" v-if="selected === 'girth'">
                                <girth-data></girth-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="shoulder" v-if="selected === 'shoulder'">
                                <shoulder-data v-if="modelInfo.bsShoulderScanResult == 1"></shoulder-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <!-- 体态 体围 肩部 -->
                <div
                    v-if="modelInfo.bdaStatus === 1 && modelInfo.evalStatus === 1 && modelInfo.bsShoulderScanResult === 1 && isVAPro3">
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                    <!--围度信息-->
                    <girth-item v-if="selected === 'girth'"></girth-item>
                    <!-- 肩部功能 -->
                    <shoulder-item v-if="selected === 'shoulder'"></shoulder-item>
                    <!--列表导航-->
                    <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabThree">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <!-- 吸附顶部tab按钮 -->
                        <div class="composition-position" v-if="scrollTop && selected === 'composition'">
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                    v-for="(item, index) in navs">
                                    <img :src="item.img" alt />
                                    <span>{{ item.name }}</span>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                                <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                    :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                    :notComposition="notComposition" @isBsStatus="isBsStatus"
                                    :compositionFailed="compositionFailed"></shape-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="girth" v-if="selected === 'girth'">
                                <girth-data></girth-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="shoulder" v-if="selected === 'shoulder'">
                                <shoulder-data v-if="modelInfo.bsShoulderScanResult == 1"></shoulder-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
            </div>

            <div v-else-if="navs.length === 2">
                <div
                    v-if="modelInfo.biaStatus !== 1 && modelInfo.evalStatus === 1 && modelInfo.bsShoulderScanResult !== 1 && !isVAPro3">
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                    <!--围度模型-->
                    <girth-item v-if="selected === 'girth'"></girth-item>
                    <!--列表导航-->
                    <div class="body-composition-nav">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabTwo">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                                <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                    :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                    :notComposition="notComposition" @isBsStatus="isBsStatus"
                                    :compositionFailed="compositionFailed"></shape-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="girth" v-if="selected === 'girth'">
                                <girth-data></girth-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <div
                    v-if="modelInfo.biaStatus === 1 && modelInfo.evalStatus !== 1 && modelInfo.bsShoulderScanResult === 1 && !isVAPro3">
                    <!--身体成分对比-->
                    <body-item v-if="selected === 'composition'"></body-item>
                    <!-- 肩部功能 -->
                    <shoulder-item v-if="selected === 'shoulder'"></shoulder-item>
                    <!--列表导航-->
                    <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabTwo">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <!-- 吸附顶部tab按钮 -->
                        <div class="composition-position" v-if="scrollTop && selected === 'composition'">
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                    v-for="(item, index) in navs">
                                    <img :src="item.img" alt />
                                    <span>{{ item.name }}</span>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="composition" v-if="selected === 'composition'">
                                <body-data></body-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="shoulder" v-if="selected === 'shoulder'">
                                <shoulder-data v-if="modelInfo.bsShoulderScanResult == 1"></shoulder-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <div
                    v-if="modelInfo.bdaStatus === 1 && modelInfo.evalStatus === 1 && modelInfo.bsShoulderScanResult !== 1 && isVAPro3">
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                    <!--围度模型-->
                    <girth-item v-if="selected === 'girth'"></girth-item>
                    <!--列表导航-->
                    <div class="body-composition-nav">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabTwo">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                                <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                    :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                    :notComposition="notComposition" @isBsStatus="isBsStatus"
                                    :compositionFailed="compositionFailed"></shape-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="girth" v-if="selected === 'girth'">
                                <girth-data></girth-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <div
                    v-if="modelInfo.bdaStatus !== 1 && modelInfo.evalStatus === 1 && modelInfo.bsShoulderScanResult === 1 && isVAPro3">
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                    <!-- 肩部功能 -->
                    <shoulder-item v-if="selected === 'shoulder'"></shoulder-item>
                    <!--列表导航-->
                    <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabTwo">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <!-- 吸附顶部tab按钮 -->
                        <div class="composition-position" v-if="scrollTop && selected === 'assessment'">
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                    v-for="(item, index) in navs">
                                    <img :src="item.img" alt />
                                    <span>{{ item.name }}</span>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                                <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                    :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                    :notComposition="notComposition" @isBsStatus="isBsStatus"
                                    :compositionFailed="compositionFailed"></shape-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="shoulder" v-if="selected === 'shoulder'">
                                <shoulder-data v-if="modelInfo.bsShoulderScanResult == 1"></shoulder-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <div
                    v-if="modelInfo.bdaStatus === 1 && modelInfo.evalStatus !== 1 && modelInfo.bsShoulderScanResult === 1 && isVAPro3">
                    <!--围度模型-->
                    <girth-item v-if="selected === 'girth'"></girth-item>
                    <!-- 肩部功能 -->
                    <shoulder-item v-if="selected === 'shoulder'"></shoulder-item>
                    <!--列表导航-->
                    <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabTwo">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <!-- 吸附顶部tab按钮 -->
                        <div class="composition-position" v-if="scrollTop && selected === 'girth'">
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                    v-for="(item, index) in navs">
                                    <img :src="item.img" alt />
                                    <span>{{ item.name }}</span>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="girth" v-if="selected === 'girth'">
                                <girth-data></girth-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="shoulder" v-if="selected === 'shoulder'">
                                <shoulder-data v-if="modelInfo.bsShoulderScanResult == 1"></shoulder-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <div
                    v-if="modelInfo.biaStatus === 1 && modelInfo.evalStatus !== 1 && modelInfo.bsShoulderScanResult !== 1 && showBodyShape">
                    <!--身体成分对比-->
                    <body-item v-if="selected === 'composition'"></body-item>
                    <!--体型评估-->
                    <body-shape-item v-if="selected === 'bodyShape'" :body-shape="bodyShapeData"></body-shape-item>
                    <!--列表导航-->
                    <div class="body-composition-nav">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabTwo">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="composition" v-if="selected === 'composition'">
                                <body-data></body-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="bodyShape" v-if="selected === 'bodyShape'">
                                <body-shape-data :body-shape="bodyShapeData"></body-shape-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
                <div
                    v-if="modelInfo.biaStatus === 1 && modelInfo.evalStatus === 1">
                    <!--身体成分对比-->
                    <body-item v-if="selected === 'composition'"></body-item>
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="modelInfo.staticEval == 1 && selected === 'assessment' && isAssess"></shape-item>
                    <!--列表导航-->
                    <div class="body-composition-nav" :class="{ 'tab-item-position': hiddenStatus }">
                        <!-- 带icon大tab按钮 -->
                        <div>
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index" v-for="(item, index) in navs">
                                    <div class="tabTwo">
                                        <img v-if="tabRouter[index + 1] === selected" :src="item.img1" alt />
                                        <img v-else :src="item.img" alt />
                                    </div>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <!-- 吸附顶部tab按钮 -->
                        <div class="composition-position" v-if="scrollTop && selected === 'composition'">
                            <mt-navbar v-model="selected">
                                <mt-tab-item :id="`${tabRouter[index + 1]}`" :key="index * 10"
                                    v-for="(item, index) in navs">
                                    <img :src="item.img" alt />
                                    <span>{{ item.name }}</span>
                                </mt-tab-item>
                            </mt-navbar>
                        </div>
                        <mt-tab-container v-model="selected">
                            <mt-tab-container-item id="composition" v-if="selected === 'composition'">
                                <body-data></body-data>
                            </mt-tab-container-item>
                            <mt-tab-container-item id="assessment" v-if="selected === 'assessment'">
                                <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                                    :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                                    :notComposition="notComposition" @isBsStatus="isBsStatus"
                                    :compositionFailed="compositionFailed"></shape-data>
                            </mt-tab-container-item>
                        </mt-tab-container>
                    </div>
                </div>
            </div>

            <div v-else>
                <!-- 只做身体成分 -->
                <div
                    v-if="modelInfo.biaStatus === 1 && modelInfo.evalStatus !== 1 && modelInfo.bsShoulderScanResult !== 1">
                    <!--身体成分模型-->
                    <body-item></body-item>
                    <!-- 身体成分数据 -->
                    <body-data></body-data>
                </div>
                <!-- 只做体态 -->
                <div
                    v-if="modelInfo.bdaStatus !== 1 && modelInfo.evalStatus === 1 && modelInfo.bsShoulderScanResult !== 1 && isVAPro3">
                    <!--体态评估-模型结论-->
                    <shape-item :assess="assess" :notMeasured="notMeasured" :measuredFailed="measuredFailed"
                        :notComposition="notComposition" :compositionFailed="compositionFailed"
                        v-if="isAssess"></shape-item>
                    <!--列表导航-->
                    <shape-data v-if="modelInfo.staticEval == 1" @assessProblem="assessProblem"
                        :notMeasured="notMeasured" :measuredFailed="measuredFailed" :notComposition="notComposition"
                        @isBsStatus="isBsStatus" :compositionFailed="compositionFailed"></shape-data>
                </div>
                <!-- 只做体围 -->
                <div
                    v-if="modelInfo.bdaStatus === 1 && modelInfo.evalStatus !== 1 && modelInfo.bsShoulderScanResult !== 1 && isVAPro3">
                    <!--围度模型-->
                    <girth-item></girth-item>
                    <girth-data></girth-data>
                </div>
                <!-- 只做肩部 -->
                <div
                    v-if="modelInfo.biaStatus !== 1 && modelInfo.evalStatus !== 1 && modelInfo.bsShoulderScanResult === 1">
                    <!-- 肩部功能 -->
                    <shoulder-item></shoulder-item>
                    <shoulder-data></shoulder-data>
                </div>
            </div>
        </div>
        <!--侧边栏-->
        <mt-popup v-model="popupVisible" position="left">
            <!-- <side-bar @close-side-bar="reportInterpret"></side-bar> -->
            <side-bar></side-bar>
        </mt-popup>
        <mt-popup v-model="interpretVisible" class="body-composition-popup" popup-transition="popup-fade">
            <div class="popup-container" @touchmove.prevent>
                <h5>
                    <i class="icon-success"></i>发送成功
                </h5>
                <div class="first-intro content">
                    <p>请联系您的教练进行报告解读和计划定制</p>
                </div>
            </div>
        </mt-popup>
        <!-- 处理vrpro5 -->
        <img v-if="aiStatue.abnormalKeywordInterpret !== null" class="ai-entrance" src="@/assets/images/ai3.png" alt=""
            @click="goAi()">
        <!-- <ai-loading v-if="aiLoading" :aiData="aiData" @goBack="aiLoading = false" @goAi="goAiUrl"></ai-loading> -->
    </div>
</template>

<script>
// 身体成分
import BodyItem from '@/components/body/BodyItem'
import BodyData from '@/components/body/BodyData'
// 围度信息
import GirthItem from '@/components/body/GirthItem'
import GirthData from '@/components/body/GirthData'
// 体态评估
import ShapeItem from '@/components/body/ShapeItem'
import ShapeData from '@/components/body/ShapeData'
// 肩部功能
import ShoulderItem from '@/components/body/ShoulderItem'
import ShoulderData from '@/components/body/ShoulderData'
// 体型评估
import BodyShapeData from '../components/body/BodyShapeData.vue'
import BodyShapeItem from '../components/body/BodyShapeItem.vue'
// aiLoading
// import AiLoading from '../components/ai/aiLoading.vue'
// 两个
import ongTiImg from '@/assets/images/Shoulder/Body composition 2N@3x.png'
import ongTaiImg from '@/assets/images/Shoulder/Body posture 2N@3x.png'
import ongWeiImg from '@/assets/images/Shoulder/Neck function 2N@3x.png'
import ongJianImg from '@/assets/images/Shoulder/Shoulder 2N@3x.png'
import bodyShapeImg from '@/assets/images/Shoulder/body_shape_2N@3x.png' // 体型评估

import ongTiSelectImg from '@/assets/images/Shoulder/Body composition 2S@3x.png'
import ongTaiSelectImg from '@/assets/images/Shoulder/Body posture 2S@3x.png'
import ongWeiSelectImg from '@/assets/images/Shoulder/Neck function 2S@3x.png'
import ongJianSelectImg from '@/assets/images/Shoulder/Shoulder 2S@3x.png'
import bodyShapeSelectImg from '@/assets/images/Shoulder/body_shape_2S@3x.png' // 体型评估

// 三个
import twoTiImg from '@/assets/images/Shoulder/Body composition 3N@3x.png'
import twoTaiImg from '@/assets/images/Shoulder/Body posture 3N@3x.png'
import twoWeiImg from '@/assets/images/Shoulder/Neck function 3N@3x.png'
import twoJianImg from '@/assets/images/Shoulder/Shoulder 3N@3x.png'

import twoTiSelectImg from '@/assets/images/Shoulder/Body composition 3S@3x.png'
import twoTaiSelectImg from '@/assets/images/Shoulder/Body posture 3S@3x.png'
import twoWeiSelectImg from '@/assets/images/Shoulder/Neck function 3S@3x.png'
import twoJianSelectImg from '@/assets/images/Shoulder/Shoulder 3S@3x.png'

// 四个
import fourTiImg from '@/assets/images/Shoulder/Body composition 4N@3x.png'
import fourTaiImg from '@/assets/images/Shoulder/Body posture 4N@3x.png'
import fourWeiImg from '@/assets/images/Shoulder/Neck function 4N@3x.png'
import fourJianImg from '@/assets/images/Shoulder/Shoulder 4N@3x.png'

import fourTiSelectImg from '@/assets/images/Shoulder/Body composition 4S@3x.png'
import fourTaiSelectImg from '@/assets/images/Shoulder/Body posture 4S@3x.png'
import fourWeiSelectImg from '@/assets/images/Shoulder/Neck function 4S@3x.png'
import fourJianSelectImg from '@/assets/images/Shoulder/Shoulder 4S@3x.png'

import {
    findBmBIAScanTrueHistory,
    generateAiReport,
    findBmShapeInfo,
    getWechatSignature,
    getAIState,
} from '@/assets/js/apolloGql.js'
import SideBar from '@/components/sidebar/Detail'
import { isVAPro3, isVAPro6, isVAlite6 } from '@/types/device.js'
import { isWeiXin, getDomainFromString, isIos } from '@/assets/js/util.js'
import wx from 'weixin-js-sdk'
// import vConsole from '@/assets/js/vconsole'

export default {
    components: {
        // 身体成分
        BodyItem,
        BodyData,
        // 围度信息
        GirthItem,
        GirthData,
        // 体态评估
        ShapeItem,
        ShapeData,
        SideBar,
        ShoulderItem,
        ShoulderData,
        // 体型评估
        BodyShapeData,
        BodyShapeItem,
        // AiLoading
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            // 身体成分
            composition: [
                {
                    id: 1,
                    name: '体重 | kg',
                    weight: 60.8,
                    lastWeight: 62.8,
                    lower: 2,
                    start: 62.1,
                    end: 75.9,
                },
                {
                    id: 2,
                    name: '骨骼肌 | kg',
                    weight: 41.8,
                    lastWeight: 39.8,
                    lower: 2,
                    start: 38.5,
                    end: 45.1,
                },
                {
                    id: 3,
                    name: '体脂率 | %',
                    weight: 21.8,
                    lastWeight: 22.8,
                    lower: 2,
                    start: 10,
                    end: 20,
                },
                {
                    id: 4,
                    name: 'BMI',
                    weight: 19.8,
                    lastWeight: 22.8,
                    lower: 2,
                    start: 18.5,
                    end: 24.9,
                },
                {
                    id: 5,
                    name: '腰臀比',
                    weight: 0.91,
                    lastWeight: 1.91,
                    lower: 2,
                    start: 0.9,
                    end: 0.9,
                },
                {
                    id: 6,
                    name: '水分含量 | %',
                    weight: 64.8,
                    lastWeight: 66.8,
                    lower: 2,
                    start: 60.4,
                    end: 64.3,
                },
            ],
            // 热力对比
            thermal: {},
            // 围度信息
            // 体态评估
            assess: [
                {
                    title: '正面',
                    list: [
                        {
                            name: '头侧歪',
                            status: '正常',
                            errorLines: ['headSlant'],
                            errorPoints: ['keyPoint0', 'keyPoint4'],
                        },
                        {
                            name: '腿型',
                            status: '正常',
                            errorLines: ['rightLegXOUp', 'rightLegXODown', 'leftLegXOUp', 'leftLegXODown'],
                            errorPoints: [
                                'keyPoint8',
                                'keyPoint9',
                                'keyPoint10',
                                'keyPoint11',
                                'keyPoint12',
                                'keyPoint13',
                            ],
                        },
                    ],
                },
                {
                    title: '左侧面',
                    list: [
                        {
                            name: '头前引',
                            status: '正常',
                            errorLines: ['headForward'],
                            errorPoints: ['keyPoint0', 'keyPoint4'],
                        },
                        {
                            name: '左圆肩',
                            status: '正常',
                            errorLines: ['roundShoulderLeft'],
                            errorPoints: ['keyPoint16', 'keyPoint1'],
                        },
                        {
                            name: '骨盆前/后移',
                            status: '正常',
                            errorLines: ['pelvisForwardUp', 'pelvisForwardDown'],
                            errorPoints: ['keyPoint4', 'keyPoint15', 'keyPoint6'],
                        },
                        {
                            name: '左膝评估',
                            status: '正常',
                            errorLines: ['leftKneeCheckUp', 'leftKneeCheckDown'],
                            errorPoints: ['keyPoint11', 'keyPoint12', 'keyPoint13'],
                        },
                    ],
                },
                {
                    title: '背面',
                    list: [
                        {
                            name: '高低肩',
                            status: '正常',
                            errorLines: ['highLowShoulder'],
                            errorPoints: ['keyPoint2', 'keyPoint5'],
                        },
                    ],
                },
                {
                    title: '右侧面',
                    list: [
                        {
                            name: '右圆肩',
                            status: '正常',
                            errorLines: ['roundShoulderRight'],
                            errorPoints: ['keyPoint18', 'keyPoint3'],
                        },
                        {
                            name: '右膝评估',
                            status: '正常',
                            errorLines: ['rightKneeCheckUp', 'rightKneeCheckDown'],
                            errorPoints: ['keyPoint8', 'keyPoint9', 'keyPoint10'],
                        },
                    ],
                },
            ],
            // 新体态评估异常点位
            assessNew: [
                {
                    title: this.$t('shape.models.front'),
                    list: [
                        {
                            name: this.$t('shape.explain[1].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['headSlant'],
                            errorPoints: [
                                'left_ear_point',
                                'right_ear_point',
                                'right_body_gravity_line_point',
                                'left_body_gravity_line_point',
                            ],
                        },
                        {
                            name: this.$t('shape.explain[8].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: [
                                'rightLegXOUp',
                                'rightLegXODown',
                                'leftLegXOUp',
                                'leftLegXODown',
                                'leftLegXO',
                                'rightLegXO',
                            ],
                            errorPoints: [
                                'left_knee_joint_point',
                                'left_hip_joint_point',
                                'left_ankle_point',
                                'right_knee_joint_point',
                                'right_hip_joint_point',
                                'right_ankle_point',
                            ],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.left'),
                    list: [
                        {
                            name: this.$t('shape.explain[2].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['roundShoulderLeft'],
                            errorPoints: [
                                'left_acromion_point',
                                'left_body_gravity_line_point',
                                'left_acromion_point1',
                                'left_body_gravity_line_point1',
                            ],
                        },
                        {
                            name: this.$t('shape.explain[6].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['leftKneeCheckUp', 'leftKneeCheckDown'],
                            errorPoints: ['left_hip_joint_point', 'left_knee_joint_below_point', 'left_ankle_point'],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.top'),
                    list: [
                        {
                            name: this.$t('shape.explain[4].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['highLowShoulder', 'highLowShoulderLeft', 'highLowShoulderRight'],
                            errorPoints: [
                                'left_shoulder_neck_root_point',
                                'left_acromion_point',
                                'right_shoulder_neck_root_point',
                                'right_acromion_point',
                            ],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.right'),
                    list: [
                        {
                            name: this.$t('shape.explain[3].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['roundShoulderRight'],
                            errorPoints: [
                                'right_acromion_point',
                                'right_body_gravity_line_point',
                                'right_acromion_point1',
                                'right_body_gravity_line_point1',
                            ],
                        },
                        {
                            name: this.$t('shape.explain[7].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['rightKneeCheckUp', 'rightKneeCheckDown'],
                            errorPoints: ['right_hip_joint_point', 'right_knee_joint_below_point', 'right_ankle_point'],
                        },
                    ],
                },
            ],
            notMeasured: false,
            measuredFailed: false,
            notComposition: false,
            compositionFailed: false,
            navs: [
                {
                    name: '身体成分',
                    img: fourTiImg,
                    img1: fourTiSelectImg,
                    bg: 'linear-gradient(180deg, #7CF2E3 0%, #3F8FDE 100%)',
                },
                {
                    name: '体态评估',
                    img: fourTaiImg,
                    img1: fourTaiSelectImg,
                    bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                },
                {
                    name: '体围测量',
                    img: fourWeiImg,
                    img1: fourWeiSelectImg,
                    bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                },
                {
                    name: '肩部评估',
                    img: fourJianImg,
                    img1: fourJianSelectImg,
                    bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                },
            ],
            selected:
                this.$route.params.tabType ||
                (JSON.parse(window.localStorage.getItem('modelInfo')).biaStatus === 1 ? 'composition' : 'assessment'),
            selectedThermal: '0',
            scrollTop: false,
            hiddenStatus: false,
            scrollTopHeight: 0,
            // 热力对比模型需要的scanId
            thermalScanId: '',
            thermalTcScanId: '',
            // 下滑样式
            slideDown: false,
            popupVisible: false,

            noThermalData: false,
            // 热力对比模型加载参数
            thermalModelDate: '',
            thermalModelScanId: '',
            isShowMenu: false,
            // 是否分享进入
            isShare: 0,
            tabRouter: {
                1: 'composition',
                2: 'assessment',
                3: 'girth',
                4: 'shoulder',
            },
            isAssess: false,
            interpretVisible: false,
            showBodyShape: window.localStorage.getItem('physicalAssessment') === '1',
            bodyShapeData: {
                row: '',
                column: '',
                shape: '',
                description: '',
                risk: '',
            },
            // 是否显示ai解读按钮
            aiUrl: '',
            aiStatue: {
                abnormalKeywordInterpret: null,
                abnormalConclusionInterpret: null,
                abnormalOutlineInterpret: null
            },
            aiLoading: false,
            aiData: {},
            isNewStatus: false
        }
    },
    computed: {
        isVAPro3() {
            return isVAPro3()
        },
        isVAPro6() {
            return isVAPro6()
        },
        isVAlite6() {
            return isVAlite6()
        },
    },
    watch: {
        selected(val) {
            // 改变url，便于回退到指定tab
            this.$router.replace({
                path: `/main/${val}`,
            })
        },
    },
    created() {
        window.addEventListener('pageshow', function(event) {
            // 检测页面是否从缓存中加载
            if (event.persisted) {
                window.location.reload()
            }
        })
    },
    mounted() {
        this.isShowMenu = JSON.parse(sessionStorage.getItem('setIsShowMenu'))
        this.isShare = sessionStorage.getItem('isShare')
        if (this.$router.afterHooks.length > 0) {
            // 防止移除与分享无关的钩子方法
            let afterHooks = []
            for (let i = 0; i < this.$router.afterHooks.length; i++) {
                if (this.$router.afterHooks[i].name !== 'bound shareAfterHooks') {
                    afterHooks.push(this.$router.afterHooks[i])
                }
            }
            this.$router.afterHooks = afterHooks
        }
        this.$router.afterEach(this.shareAfterHooks)
        this.shareClick()
        // 监听页面滚动
        window.addEventListener('scroll', this.handleScroll)
        if (this.isVAPro3) {
            if (this.modelInfo.evalStatus === 1) {
                this.selected = 'assessment'
            } else if (this.modelInfo.bdaStatus === 1) {
                this.selected = 'girth'
            }
        }
        // 判断热力对比页面
        if (this.modelInfo.biaStatus === 1) {
            this.findBmBIAScanTrueHistory()
            if (this.showBodyShape) {
                this.getBodyShapeInfo()
            }
        }

        this.isShowMenu = window.sessionStorage.getItem('setIsShowMenu')
        this.getAIStateFun()
        this.showItem()
    },
    methods: {
        goAi() {
            window.location.href = this.aiUrl
            // this.aiData = {
            //     url: this.aiUrl,
            //     abnormalConclusionInterpret: this.aiStatue.abnormalConclusionInterpret,
            //     abnormalOutlineInterpret: this.aiStatue.abnormalOutlineInterpret,
            //     scanId: this.modelInfo.scanId,
            // }
            // this.aiLoading = true
        },
        // goAiUrl(url) {
        //     window.location.href = url
        // },
        getAIStateFun() {
            this.$apollo
                .query({
                    query: getAIState,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const date = res.data.getAIState
                    if (date.code === 200) {
                        this.aiUrl = date.data.aiUrl
                        this.aiStatue.abnormalKeywordInterpret = date.data.abnormalKeywordInterpret
                        this.aiStatue.abnormalConclusionInterpret = date.data.abnormalConclusionInterpret
                        this.aiStatue.abnormalOutlineInterpret = date.data.abnormalOutlineInterpret
                    }
                })
        },
        shareAfterHooks(to) {
            // 添加预设置分享内容防止刷新界面后不能分享
            if (
                ['/main/composition', '/main/assessment', '/main/girth', '/girth/trend', '/main', '/report'].includes(
                    to.path
                )
            ) {
                this.shareClick()
            }
        },
        showItem() {
            console.log('isVAlite6', isVAlite6())
            console.log('this.modelInfo', this.modelInfo)
            if (!isVAPro3()) {
                console.log('this.modelInfo----------------------2', this.modelInfo)
                if (
                    this.modelInfo.biaStatus === 1 &&
                    this.modelInfo.evalStatus !== 1 &&
                    this.modelInfo.bsShoulderScanResult !== 1
                ) {
                    console.log("---------------123")
                    this.navs = ''
                    if (this.showBodyShape) {
                        this.navs = [
                            {
                                name: '身体成分',
                                img: ongTiImg,
                                img1: ongTiSelectImg,
                                bg: 'linear-gradient(180deg, #7CF2E3 0%, #3F8FDE 100%)',
                            },
                            {
                                name: '体型评估',
                                img: bodyShapeImg,
                                img1: bodyShapeSelectImg,
                                bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                            },
                        ]
                        this.tabRouter = {
                            1: 'composition',
                            2: 'bodyShape',
                        }
                    }
                } else if (
                    this.modelInfo.biaStatus !== 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult !== 1
                ) {
                    console.log("---------------123456")
                    this.navs = [
                        {
                            name: '体态评估',
                            img: ongTaiImg,
                            img1: ongTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },
                        {
                            name: '体围测量',
                            img: ongWeiImg,
                            img1: ongWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'assessment',
                        2: 'girth',
                    }
                } else if (
                    this.modelInfo.biaStatus !== 1 &&
                    this.modelInfo.evalStatus !== 1 &&
                    this.modelInfo.bsShoulderScanResult === 1
                ) {
                    this.navs = ''
                } else if (
                    this.modelInfo.biaStatus === 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult !== 1
                ) {
                    console.log("---------------1234567")
                    this.navs = [
                        {
                            name: '身体成分',
                            img: twoTiImg,
                            img1: twoTiSelectImg,
                            bg: 'linear-gradient(180deg, #7CF2E3 0%, #3F8FDE 100%)',
                        },
                        {
                            name: '体态评估',
                            img: twoTaiImg,
                            img1: twoTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },
                        {
                            name: '体围测量',
                            img: twoWeiImg,
                            img1: twoWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'composition',
                        2: 'assessment',
                        3: 'girth',
                    }
                } else if (
                    this.modelInfo.biaStatus === 1 &&
                    this.modelInfo.evalStatus !== 1 &&
                    this.modelInfo.bsShoulderScanResult === 1
                ) {
                    this.navs = [
                        {
                            name: '身体成分',
                            img: ongTiImg,
                            img1: ongTiSelectImg,
                            bg: 'linear-gradient(180deg, #7CF2E3 0%, #3F8FDE 100%)',
                        },
                        {
                            name: '肩部评估',
                            img: ongJianImg,
                            img1: ongJianSelectImg,
                            bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'composition',
                        2: 'shoulder',
                    }
                } else if (
                    this.modelInfo.biaStatus !== 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult === 1
                ) {
                    this.navs = [
                        {
                            name: '体态评估',
                            img: twoTaiImg,
                            img1: twoTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },
                        {
                            name: '体围测量',
                            img: twoWeiImg,
                            img1: twoWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                        {
                            name: '肩部评估',
                            img: twoJianImg,
                            img1: twoJianSelectImg,
                            bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'assessment',
                        2: 'girth',
                        3: 'shoulder',
                    }
                } else if (
                    this.modelInfo.biaStatus === 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult === 1
                ) {
                    this.navs = [
                        {
                            name: '身体成分',
                            img: fourTiImg,
                            img1: fourTiSelectImg,
                            bg: 'linear-gradient(180deg, #7CF2E3 0%, #3F8FDE 100%)',
                        },
                        {
                            name: '体态评估',
                            img: fourTaiImg,
                            img1: fourTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },
                        {
                            name: '体围测量',
                            img: fourWeiImg,
                            img1: fourWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                        {
                            name: '肩部评估',
                            img: fourJianImg,
                            img1: fourJianSelectImg,
                            bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'composition',
                        2: 'assessment',
                        3: 'girth',
                        4: 'shoulder',
                    }
                }
            } else {
                console.log('this.modelInfo----------------------1', this.modelInfo)
                if (
                    this.modelInfo.bdaStatus === 1 &&
                    this.modelInfo.evalStatus !== 1 &&
                    this.modelInfo.bsShoulderScanResult !== 1
                ) {
                    this.navs = [
                        {
                            name: '体围测量',
                            img: ongWeiImg,
                            img1: ongWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'girth',
                    }
                } else if (
                    this.modelInfo.bdaStatus !== 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult !== 1
                ) {
                    this.navs = [
                        {
                            name: '体态评估',
                            img: ongTaiImg,
                            img1: ongTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'assessment',
                    }
                } else if (
                    this.modelInfo.bdaStatus !== 1 &&
                    this.modelInfo.evalStatus !== 1 &&
                    this.modelInfo.bsShoulderScanResult === 1
                ) {
                    this.navs = ''
                } else if (
                    this.modelInfo.bdaStatus === 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult !== 1
                ) {
                    this.navs = [
                        {
                            name: '体态评估',
                            img: ongTaiImg,
                            img1: ongTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },
                        {
                            name: '体围测量',
                            img: ongWeiImg,
                            img1: ongWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'assessment',
                        2: 'girth',
                    }
                } else if (
                    this.modelInfo.biaStatus !== 1 &&
                    this.modelInfo.evalStatus !== 1 &&
                    this.modelInfo.bsShoulderScanResult === 1 &&
                    this.modelInfo.bdaStatus === 1
                ) {
                    this.navs = [
                        {
                            name: '体围测量',
                            img: twoWeiImg,
                            img1: twoWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                        {
                            name: '肩部评估',
                            img: twoJianImg,
                            img1: twoJianSelectImg,
                            bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'girth',
                        2: 'shoulder',
                    }
                } else if (
                    this.modelInfo.biaStatus !== 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult === 1 &&
                    this.modelInfo.bdaStatus !== 1
                ) {
                    this.navs = [
                        {
                            name: '体态评估',
                            img: twoTaiImg,
                            img1: twoTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },

                        {
                            name: '肩部评估',
                            img: twoJianImg,
                            img1: twoJianSelectImg,
                            bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'assessment',
                        2: 'shoulder',
                    }
                } else if (
                    this.modelInfo.biaStatus !== 1 &&
                    this.modelInfo.evalStatus === 1 &&
                    this.modelInfo.bsShoulderScanResult === 1 &&
                    this.modelInfo.bdaStatus === 1
                ) {
                    this.navs = [
                        {
                            name: '体态评估',
                            img: twoTaiImg,
                            img1: twoTaiSelectImg,
                            bg: 'linear-gradient(180deg, #EF8F68 0%, #E7749E 100%)',
                        },
                        {
                            name: '体围测量',
                            img: twoWeiImg,
                            img1: twoWeiSelectImg,
                            bg: 'linear-gradient(180deg, #88CDEA 0%, #3A4EA7 100%)',
                        },
                        {
                            name: '肩部评估',
                            img: twoJianImg,
                            img1: twoJianSelectImg,
                            bg: 'linear-gradient(180deg, #80ECB3 0%, #69A4E6 100%)',
                        },
                    ]
                    this.tabRouter = {
                        1: 'assessment',
                        2: 'girth',
                        3: 'shoulder',
                    }
                }
                console.log(`当前导航${JSON.stringify(this.navs)}`)
            }
            if (isVAlite6() && Array.isArray(this.navs)) {
                this.navs = this.navs.filter(item => item.name === '身体成分' || item.name === '体态评估')
                if (this.navs.length === 2) {
                    this.tabRouter = {
                        1: 'composition',
                        2: 'assessment'
                    }
                }
            }
            console.log('this.navs', this.navs)
            console.log(`判断显示tab${JSON.stringify(this.navs)} ${showBodyShape}`)
        },
        // 申请报告解读
        async reportInterpret() {
            this.popupVisible = false
            this.$apollo
                .mutate({
                    mutation: generateAiReport,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.generateAiReport
                    if (data.code === 200) {
                        this.interpretVisible = true
                    }
                    // else {
                    //     this.$toast({
                    //         message: data.message,
                    //         duration: 3000,
                    //     })
                    // }
                })
        },
        // 跳转分享页
        goToShare() {
            this.$hmt.trackEvent('share', 'enter', `${this.selected === 'compare' ? 'bodyCompare' : 'prediction'}`)
            this.$router.push({
                path: `/share/${this.selected === 'compare' ? 'compare' : 'prediction'}`,
            })
        },
        // 跳转总览页
        goSummary() {
            this.$router.push('/report')
        },
        isBsStatus(pro) {
            this.notComposition = pro
        },
        onSwipeDown() {
            this.slideDown = true
            window.setTimeout(() => {
                this.$router.push('/report')
            }, 250)
        },
        // 热力对比选择类型
        changeSelect(select) {
            this.selectedThermal = select
        },
        // 热力对比模型需要的scanId
        changeScanId(scanId, tcScanId) {
            this.thermalScanId = scanId
            this.thermalTcScanId = tcScanId
            // this.segTchartInfo();
        },
        // 调用子组件方法(热力对比)
        segTchartInfo() {
            // this.$refs.thermal.segTchartInfo(this.thermalScanId, this.thermalTcScanId);
        },
        // 热力对比调用子组件方法
        changeCompateDate(pro) {
            // this.thermalModelDate = pro;
            let time = String(new Date(pro).getTime() / 1000)
            this.thermalModelDate = time
        },
        changeCompateScanId(pro) {
            this.thermalModelScanId = pro
        },
        // 趋势图按钮
        goTrend() {
            if (this.selected === 'girth') {
                this.$router.push('/girth/trend')
            } else {
                this.$router.push('/body/trend')
            }
        },
        // 滚动吸顶
        handleScroll() {
            const scrollTopHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            if (scrollTopHeight >= 450) {
                this.scrollTop = true
                this.hiddenStatus = true
            } else {
                this.scrollTop = false
                this.hiddenStatus = false
            }
        },
        // 判断热力对比页面
        findBmBIAScanTrueHistory() {
            this.$apollo
                .query({
                    query: findBmBIAScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: this.modelInfo.createTime,
                    },
                })
                .then((res) => {
                    const data = res.data.findBmBIAScanTrueHistory
                    if (data.code === 200) {
                        if (data.data.length <= 1 && data.data[0].data.length <= 1) {
                            this.selectedThermal = '0'
                            this.noThermalData = true
                        } else {
                            this.selectedThermal = '1'
                            this.noThermalData = false
                        }
                        if (data.data.length) {
                            let dateList = []
                            data.data.forEach((yearDate, index) => {
                                dateList = dateList.concat(yearDate.data)
                            })
                            // 确保数据安全 根据createtime排序
                            dateList.sort((a, b) => {
                                return new Date(`${b.createTime}`).getTime() - new Date(`${a.createTime}`).getTime()
                            })
                            if (!window.sessionStorage.getItem('compareData') && dateList.length > 1) {
                                window.sessionStorage.setItem(
                                    'compareData',
                                    JSON.stringify({
                                        date: dateList[1].createDate,
                                        scanId: dateList[1].scanId,
                                    })
                                )
                            }
                        }
                    }
                })
        },
        // 体态评估上半模块数据
        assessProblem(data, bsDataState) {
            if (!this.isVAPro6) {
                if (data.headForward > 0) {
                    this.assess[1].list[0].status = '异常'
                }
                if (data.headSlant > 0) {
                    this.assess[0].list[0].status = '偏左'
                } else if (data.headSlant < 0) {
                    this.assess[0].list[0].status = '偏右'
                }
                if (data.roundShoulderLeft > 15) {
                    this.assess[1].list[1].status = '异常'
                }
                if (data.roundShoulderRight > 15) {
                    this.assess[3].list[0].status = '异常'
                }
                if (data.highLowShoudler > 0) {
                    this.assess[2].list[0].status = '左高'
                } else if (data.highLowShoudler < 0) {
                    this.assess[2].list[0].status = '右高'
                }
                if (data.pelvisForward > 185) {
                    this.assess[1].list[2].status = '骨盆后移'
                } else if (data.pelvisForward < 175) {
                    this.assess[1].list[2].status = '骨盆前移'
                }

                if (data.pelvicForwardTiltStatus > 0) {
                    this.assess[3].list.push({
                        name: '骨盆前/后倾',
                        status: '正常',
                        errorLines: ['pelvicForwardTilt'],
                        errorPoints: ['keyPoint8', 'keyPoint9', 'keyPoint10'],
                    })
                    if (data.pelvicForwardTilt > 15) {
                        this.assess[3].list[2].status = '骨盆前倾'
                    } else if (data.pelvicForwardTilt < 0) {
                        this.assess[3].list[2].status = '骨盆后倾'
                    }
                }
                if (data.leftKneeCheck > 190) {
                    this.assess[1].list[3].status = '左膝超伸'
                } else if (data.leftKneeCheck < 160) {
                    this.assess[1].list[3].status = '左膝前曲'
                }
                if (data.rightKneeCheck > 190) {
                    this.assess[3].list[1].status = '右膝超伸'
                } else if (data.rightKneeCheck < 160) {
                    this.assess[3].list[1].status = '右膝前曲'
                }
                if (data.leftLegXo <= 190 && data.leftLegXo >= 170) {
                    if (data.rightLegXo >= 0 && data.rightLegXo < 170) {
                        this.assess[0].list[1].status = 'K型腿'
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = 'D型腿'
                    }
                } else if (data.leftLegXo >= 0 && data.leftLegXo < 170) {
                    if (data.rightLegXo <= 190 && data.rightLegXo >= 170) {
                        this.assess[0].list[1].status = 'K型腿'
                    } else if (data.rightLegXo >= 0 && data.rightLegXo < 170) {
                        this.assess[0].list[1].status = 'X型腿'
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = '异常'
                    }
                } else if (data.leftLegXo > 190 && data.leftLegXo <= 360) {
                    if (data.rightLegXo <= 190 && data.rightLegXo >= 170) {
                        this.assess[0].list[1].status = 'D型腿'
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = 'O型腿'
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = '异常'
                    }
                }
                if (data.isLegLengthDiff > 0) {
                    this.assess[2].list.push({
                        name: '长短腿',
                        status: '正常',
                        errorLines: ['legLengthDiff'],
                        errorPoints: ['keyPoint2', 'keyPoint5'],
                    })
                    if (data.legLengthDiff > 10) {
                        this.assess[2].list[1].status = '左长'
                    } else if (data.legLengthDiff < -10) {
                        this.assess[2].list[1].status = '右长'
                    }
                }
            } else if (JSON.stringify(bsDataState) !== '{}') {
                this.$store.commit('setNewMathTtData', bsDataState)
                // 进行新算法数据整理
                // if (!this.isNewStatus) {
                //     // 只修改一次数据
                //     this.isNewStatus = !this.isNewStatus
                //     return
                // }
                if (bsDataState.headSlantState === 2 || bsDataState.headSlantState === 4) {
                    this.assessNew[0].list[0].status = this.$t('shape.exception[0].title')
                } else if (bsDataState.headSlantState === 1 || bsDataState.headSlantState === 3) {
                    this.assessNew[0].list[0].status = this.$t('shape.exception[1].title')
                }
                // 腿型
                switch (bsDataState.legType) {
                    case 0:
                        break
                    case 1:
                        this.assessNew[0].list[1].status = this.$t('shape.item.abnormal')
                        break
                    case 2:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[10].title')
                        break
                    case 3:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[11].title')
                        break
                    case 4:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[12].title')
                        break
                    case 5:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[13].title')
                        break

                    default:
                        this.assessNew[0].list[1].status = this.$t('shape.item.keAbnormal')
                        break
                }

                let leftHead = 0,
                    rightHead = 0
                // 左侧面
                console.log(bsDataState.hsVisualization, 88888899999)
                if (bsDataState.hsVisualization) {
                    if (this.assessNew[1].list[0].name !== this.$t('shape.explain[0].title')) {
                        this.assessNew[1].list.unshift({
                            name: this.$t('shape.explain[0].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['headForward'],
                            errorPoints: ['left_ear_point', 'right_ear_point'],
                        })
                    }

                    if (bsDataState.headForwardState) {
                        this.assessNew[1].list[0].status = this.$t('shape.item.abnormal')
                    }
                    leftHead++

                    // 右侧面
                } else {
                    if (this.assessNew[3].list[0].name !== this.$t('shape.explain[0].title')) {
                        this.assessNew[3].list.unshift({
                            name: this.$t('shape.explain[0].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['headForward'],
                            errorPoints: ['left_ear_point', 'right_ear_point'],
                        })
                    }
                    if (bsDataState.headForwardState) {
                        this.assessNew[3].list[0].status = this.$t('shape.item.abnormal')
                    }
                    rightHead++
                }
                if (bsDataState.leftRoundShoulderState) {
                    this.assessNew[1].list[leftHead].status = this.$t('shape.item.abnormal')
                }
                if (bsDataState.rightRoundShoulderState) {
                    this.assessNew[3].list[rightHead].status = this.$t('shape.item.abnormal')
                }
                // status 状态位置
                let indexRight = 1,
                    indexLeft = 1
                if (rightHead) {
                    indexRight = 2
                }
                if (leftHead) {
                    indexLeft = 2
                }
                // 左边盆骨
                if (bsDataState.pfsVisualization) {
                    if (this.assessNew[1].list[indexLeft].name !== '骨盆前移') {
                        this.assessNew[1].list.splice(indexLeft, 0, {
                            name: '骨盆前移',
                            status: this.$t('shape.item.normal'),
                            errorLines: ['pelvisForwardUp', 'pelvisForwardDown', 'pelvisForward'],
                            errorPoints: [
                                'left_hip_joint_point',
                                'right_hip_joint_point',
                                'left_body_gravity_line_point',
                                'right_body_gravity_line_point',
                            ], // 待定
                        })
                    }
                    if (bsDataState.pelvisForwardState) {
                        this.assessNew[1].list[indexLeft].status = '异常'
                    }

                    // 右边盆骨
                } else {
                    if (this.assessNew[3].list[indexRight].name !== '骨盆前移') {
                        this.assessNew[3].list.splice(indexRight, 0, {
                            name: '骨盆前移',
                            status: this.$t('shape.item.normal'),
                            errorLines: ['pelvisForwardUp', 'pelvisForwardDown', 'pelvisForward'],
                            errorPoints: [
                                'left_hip_joint_point',
                                'right_hip_joint_point',
                                'left_body_gravity_line_point',
                                'right_body_gravity_line_point',
                            ], // 待定
                        })
                    }

                    if (bsDataState.pelvisForwardState) {
                        this.assessNew[3].list[indexRight].status = '异常'
                    }
                }
                // 左膝评估
                if (bsDataState.leftKneeCheckState) {
                    const length = this.assessNew[1].list.length - 1
                    if (bsDataState.leftKneeCheckState === 1 || bsDataState.leftKneeCheckState === 3) {
                        this.assessNew[1].list[length].status = this.$t('shape.exception[7].title')
                    } else {
                        this.assessNew[1].list[length].status = this.$t('shape.exception[6].title')
                    }
                }
                // 右膝
                if (bsDataState.rightKneeCheckState) {
                    const length = this.assessNew[3].list.length - 1
                    if (bsDataState.rightKneeCheckState === 1 || bsDataState.rightKneeCheckState === 3) {
                        this.assessNew[3].list[length].status = this.$t('shape.exception[9].title')
                    } else {
                        this.assessNew[3].list[length].status = this.$t('shape.exception[8].title')
                    }
                }
                // 肩部
                if (bsDataState.highLowShoudlerState) {
                    if (bsDataState.highLowShoudlerState === 1 || bsDataState.highLowShoudlerState === 3) {
                        this.assessNew[2].list[0].status = this.$t('shape.exception[2].title')
                    } else {
                        this.assessNew[2].list[0].status = this.$t('shape.exception[3].title')
                    }
                }
                this.assess = this.assessNew
            }
            this.isAssess = true
        },
        // 展开侧边栏
        openSide() {
            this.popupVisible = true
        },
        // 体型评估数据
        getBodyShapeInfo() {
            this.$apollo
                .query({
                    query: findBmShapeInfo,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.findBmShapeInfo
                    if (data && data.code === 200) {
                        this.bodyShapeData = data.data
                    }
                })
        },
        // 设置分享
        shareClick() {
            if (isWeiXin()) {
                let url = window.location.href.split('#')[0]
                const isShare = this.isShare
                console.log(`main---------->isWeiXin: ${isWeiXin()} isShare: ${isShare}  isIos: ${isIos()}`)
                this.$apollo
                    .query({
                        query: getWechatSignature,
                        variables: {
                            url: encodeURIComponent(url),
                        },
                    })
                    .then((res) => {
                        const data = res.data.getWechatSignature
                        if (data && data.code === 200) {
                            const signatureInfo = data.data
                            const modelInfoObj = this.modelInfo
                            const domain = getDomainFromString(url)
                            console.log(`==========domain:  ${domain}`)
                            let shareUrl = ''
                            // 解决苹果手机有的系统无法隐藏分享菜单 使分享出去的链接失效
                            if (isShare !== '1') {
                                shareUrl = `${domain}/shareAuth/shareCallBack?token=${signatureInfo.token}&scan_id=${modelInfoObj.scanId}`
                            } else {
                                shareUrl = url
                            }
                            console.log(
                                `========>url: ${url}  =======>scanId: ${modelInfoObj.scanId}   =======>shareUrl: ${shareUrl}`
                            )
                            wx.config({
                                debug: false,
                                appId: signatureInfo.appid, // 必填，公众号的唯一标识
                                timestamp: signatureInfo.timestamp, // 必填，生成签名的时间戳
                                nonceStr: signatureInfo.noncestr, // 必填，生成签名的随机串
                                signature: signatureInfo.signature, // 必填，签名
                                jsApiList: [
                                    'checkJsApi',
                                    'updateTimelineShareData',
                                    'updateAppMessageShareData',
                                    'showMenuItems',
                                    'hideMenuItems',
                                ],
                            })
                            wx.ready(function () {
                                wx.checkJsApi({
                                    jsApiList: [
                                        'updateTimelineShareData',
                                        'updateAppMessageShareData',
                                        'showMenuItems',
                                        'hideMenuItems',
                                    ],
                                    success(res) {
                                        if (res.checkResult.getLocation === false) {
                                            console.log('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本')
                                            this.$toast({
                                                message: '你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本',
                                                duration: 3000,
                                            })
                                        } else {
                                            if (isShare !== '1') {
                                                console.log('显示分享菜单=========main')
                                                wx.showMenuItems({
                                                    menuList: [
                                                        'menuItem:share:appMessage',
                                                        'menuItem:share:timeline',
                                                        'menuItem:share:qq',
                                                        'menuItem:share:QZone',
                                                        'menuItem:share:weiboApp',
                                                    ],
                                                })
                                                wx.updateAppMessageShareData({
                                                    title: signatureInfo.title, // 分享标题
                                                    desc: signatureInfo.desc, // 分享描述
                                                    link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () { },
                                                })

                                                wx.updateTimelineShareData({
                                                    title: signatureInfo.title, // 分享标题
                                                    link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () { },
                                                })
                                            } else {
                                                console.log('隐藏分享菜单=========main')
                                                wx.hideMenuItems({
                                                    menuList: [
                                                        'menuItem:share:appMessage',
                                                        'menuItem:share:timeline',
                                                        'menuItem:share:qq',
                                                        'menuItem:share:QZone',
                                                        'menuItem:share:weiboApp',
                                                    ],
                                                })
                                            }
                                        }
                                    },
                                    fail(res) {
                                        const message = 'checkJsApi fail=' + JSON.stringify(res)
                                        this.$toast({
                                            message: message,
                                            duration: 3000,
                                        })
                                        console.log(message)
                                    },
                                })
                            })
                            wx.error(function (res) {
                                console.log(`错误：${JSON.stringify(res)}`)
                            })
                        }
                    })
            }
        },
    },
}
</script>

<style lang="less" scoped>
.ai-entrance {
    position: fixed;
    height: 56px;
    width: auto;
    bottom: 48px;
    right: 10px;
    z-index: 99;
}

.body-composition-report-page {
    position: absolute;
    // position: fixed;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);
    // height: 100vh;
    // overflow: auto;
    // -webkit-overflow-scrolling: touch;
}

.body-composition-hidden {
    top: 100% !important;
    transition: all linear 0.25s;
}

.body-composition-page {
    position: absolute;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);

    .header-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 15px;
        position: absolute;
        width: 100%;
        top: 0;
        z-index: 1;

        span:first-child img {
            width: 17px;
            height: 13px;
        }

        >span {
            img {
                display: block;
            }

            &.last-trend {
                display: flex;
                align-items: center;
                color: #fff;
                font-size: 12px;

                img {
                    width: 15px;
                    margin-right: 5px;
                    // 禁止部分安卓机下图片自动放大
                    pointer-events: none;
                }
            }
        }
    }

    .top-composition-hidden {
        background-image: none;
    }

    .page-top-hidden {
        background-image: none !important;
    }

    .page-to-top {
        position: relative;
        width: 100%;
        top: 0;
        background-image: url('../assets/images/report_more_bg.png');
        background-repeat: no-repeat;
        background-position: center bottom;
        transform: rotate(180deg);
        z-index: 2;

        .top-container {
            // animation: slideShine 1.5s linear infinite;
            padding-bottom: 0;
            width: 50%;
            margin: 0 auto;
            position: relative;

            p {
                transform: rotate(180deg);
                font-size: 12px;
                background: linear-gradient(to right, #00e3c9, #00a4e6), linear-gradient(#2d2f56, #2d2f56);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                margin-bottom: -27px;
            }

            img {
                margin-bottom: 20px;
                width: 15px;
                height: 5px;
                // 禁止部分安卓机下图片自动放大
                pointer-events: none;
            }
        }

        .touch-model {
            position: absolute;
            top: -15px;
            height: 35px;
            width: 50%;
            left: 0;
            right: 0;
            margin: auto;
        }
    }
}

@-webkit-keyframes slideShine {
    0% {
        padding-bottom: 0;
        opacity: 1;
    }

    100% {
        padding-bottom: 14px;
        opacity: 0.2;
    }
}

@keyframes slideShine {
    0% {
        padding-bottom: 0;
        opacity: 1;
    }

    100% {
        padding-bottom: 14px;
        opacity: 0.2;
    }
}
</style>
