<template>
    <div class="cardBox" :class="young ? 'young' : ''">
        <div class="cardTitle"><span class="triangle"></span> 评估详情</div>
        <div class="cardContent">
            <div class="grid-item">
                <div class="imgbox">
                    <img
                        :src="require(`@/assets/images/female/assessment/spine/cervicalSpine_${cervicalSpine.level}.png`)">
                    <p :style="{ color: cervicalSpine.color }">{{ cervicalSpine.rank }}</p>
                </div>
                <div class=" itemInfo">
                    <div class="itemBox">
                        <p>颈椎</p>
                        <processBar :spine="cervicalSpine" :young="young" />
                        <div v-if="young" class="youngSource">
                            <img :src="require(`@/assets/images/female/young/level_${cervicalSpine.level}.png`)" alt="">
                            <div><span :style="{ color: cervicalSpine.color }"> {{ cervicalSpine.source }}</span>分</div>
                        </div>
                    </div>
                    <div class="tips">
                        <span>!</span>
                        {{ cervicalSpine.conetnt }}
                    </div>
                </div>
            </div>
            <div class="grid-item">
                <resultCard :resultType="1" :type1="type1">
                    <ul>
                        <!-- 头前引 -->
                        <li v-if="[1, 2].includes(spineDetail.headForwardState)">
                            肩胛提肌、胸锁乳突肌和斜方肌上束<i class="IRed">紧张</i>，颈深屈肌<i class="IBlue">无力</i>。建议加强颈部肌肉，并进行伸展运动。</li>
                        <!-- 头侧歪 -->
                        <!-- 头侧歪 - 左-->
                        <li v-if="[2, 4].includes(spineDetail.headSlantState)">左侧胸锁乳突肌和后角斜角肌<i
                                class="IRed">紧张</i>，右侧胸锁乳突肌<i class="IBlue">无力</i>。建议进行平衡训练。</li>
                        <!-- 头侧歪 - 右-->
                        <li v-if="[1, 3].includes(spineDetail.headSlantState)">右侧胸锁乳突肌<i class="
                            IRed">紧张</i>，左侧胸锁乳突肌和后角斜角肌<i class="IBlue">无力</i>。建议进行平衡训练。</li>
                        <li v-if="shouldRender">
                            肌肉评估正常，请继续保持良好的生活习惯</li>
                    </ul>
                </resultCard>
            </div>
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/assessment/spine/thoracicSpine_${thoracicSpine.level}.png`)"
                        alt="">
                    <p :style="{ color: thoracicSpine.color }">{{ thoracicSpine.rank }}</p>
                </div>
                <div class=" itemInfo">
                    <div class="itemBox">
                        <p>胸椎</p>
                        <processBar :spine="thoracicSpine" :young="young" />
                        <div v-if="young" class="youngSource">
                            <img :src="require(`@/assets/images/female/young/level_${thoracicSpine.level}.png`)" alt="">
                            <div><span :style="{ color: thoracicSpine.color }"> {{ thoracicSpine.source }}</span>分</div>
                        </div>
                    </div>
                    <div class="tips">
                        <span>!</span>
                        {{ thoracicSpine.conetnt }}
                    </div>
                </div>
            </div>
            <div class="grid-item">
                <resultCard :resultType="2" :type2="type2">
                    <ul>
                        <!-- 高低肩 -->
                        <!-- 高低肩 - 左 -->
                        <li v-if="[1, 3].includes(spineDetail.highLowShoudlerState)">
                            左侧斜方肌上束<i class="IRed">紧张</i>，中下束<i class="IBlue">无力</i>。建议进行斜方肌中下束强化和上束放松训练。</li>
                        <!-- 高低肩 - 右 -->
                        <li v-else-if="[2, 4].includes(spineDetail.highLowShoudlerState)">
                            右侧斜方肌上束<i class="IRed">紧张</i>，中下束<i class="IBlue">无力</i>。建议进行斜方肌中下束强化和上束放松训练。</li>
                        <!-- 正常 -->
                        <li v-else>肌肉评估正常，请继续保持良好的生活习惯。</li>
                    </ul>
                </resultCard>
            </div>
            <div class="grid-item">
                <div class="imgbox">
                    <img :src="require(`@/assets/images/female/assessment/spine/lumbarSpine${sex === 1 ? 'Man' : 'Woman'}_${lumbarSpine.level}.png`)"
                        alt="">
                    <p :style="{ color: lumbarSpine.color }">{{ lumbarSpine.rank }}</p>
                </div>
                <div class=" itemInfo">
                    <div class="itemBox">
                        <p>腰椎</p>
                        <processBar :spine="lumbarSpine" :young="young" />
                        <div v-if="young" class="youngSource">
                            <img :src="require(`@/assets/images/female/young/level_${lumbarSpine.level}.png`)" alt="">
                            <div><span :style="{ color: lumbarSpine.color }"> {{ lumbarSpine.source }}</span>分</div>
                        </div>
                    </div>
                    <div class="tips">
                        <span>!</span>
                        {{ lumbarSpine.conetnt }}
                    </div>
                </div>
            </div>
            <div class="grid-item">
                <resultCard :resultType="3" :type3="type3">
                    <ul>
                        <!-- 腿型 XODK-->
                        <li v-if="[4, 8].includes(spineDetail.legType)">髋内旋肌群和内收肌群<i class="IRed">紧张</i>，臀中肌<i class="IBlue">无力</i>。建议加强臀中肌，拉伸内收肌群。</li>
                        <li v-if="[5, 9].includes(spineDetail.legType)">臀中肌和梨状肌<i class="IRed">紧张</i>，髋内收肌群、内旋肌群和膝外侧副韧带<i class="IBlue">无力</i>。建议加强内收肌群，拉伸臀中肌和梨状肌。
                        </li>
                        <li v-if="[3, 7].includes(spineDetail.legType)">臀中肌和梨状肌<i class="IRed">紧张</i>，单侧髋内收肌群、内旋肌群和膝外侧副韧带<i class="IBlue">无力</i>。建议保持均衡训练，避免单侧过度使用。</li>
                        <li v-if="[2, 6].includes(spineDetail.legType)">建议保持均衡训练，避免单侧过度使用。</li>
                        <!-- 膝关节角度 -->
                        <li v-if="[1, 3].includes(spineDetail.leftKneeCheckState)">左侧腘绳肌和膕肌<i class="IRed">紧张</i>，股四头肌和比目鱼肌<i class="IBlue">无力</i>。</li>
                        <li v-if="[2, 4].includes(spineDetail.leftKneeCheckState)">左侧股四头肌<i class="IRed">紧张</i>，臀大肌和胭绳肌<i class="IBlue">无力</i>。</li>
                        <li v-if="[1, 3].includes(spineDetail.rightKneeCheckState)">右侧腘绳肌和膕肌<i class="IRed">紧张</i>，股四头肌和比目鱼肌<i class="IBlue">无力</i>。</li>
                        <li v-if="[2, 4].includes(spineDetail.rightKneeCheckState)">右侧股四头肌<i class="IRed">紧张</i>，臀大肌和胭绳肌<i class="IBlue">无力</i>。</li>
                        <!-- 没事 -->
                        <li v-if="[1, 2, 3, 4].indexOf(spineDetail.rightKneeCheckState) === -1 && [1, 2, 3, 4].indexOf(spineDetail.leftKneeCheckState) === -1 && [2, 3, 4, 5, 6, 7, 8, 9].indexOf(spineDetail.legType) === -1">肌肉评估正常，请继续保持良好的生活习惯。</li>
                    </ul>
                </resultCard>
            </div>
        </div>
    </div>
</template>

<script>
import processBar from './processBar.vue'
import resultCard from './resultCard.vue'
export default {
    components: {
        processBar,
        resultCard
    },
    props: {
        spineDetail: {
            type: Object,
            default: () => ({
                // 颈椎结构评分
                cervicalScore: 0,
                // 胸椎结构异常评分
                thoracicScore: 0,
                // 腰椎结构异常
                lumbarScore: 0,
                // --------------
                // 头侧歪状态 0 正常 1:异常（偏右）2:异常（偏左）3 可能异常（偏右） 4 可能异常（偏左）
                headSlantState: null,
                // 头前引状态 0 正常 1 异常 2 可能异常
                headForwardState: null,
                // 高低肩状态 0 正常 1:异常（左高右低）2:异常（右高左低）3 可能异常（左高右低）4 可能异常（右高左低）
                highLowShoudlerState: null,
                // 0:正常 1:异常 2:K型腿 3:D型腿 4:X型腿 5:O型腿 6:K型腿（可能异常）7:D型腿（可能异常）8:X型腿（可能异常）9:O型腿（可能异常） 10 可能异常
                legType: null,
                // 左膝评估状态 0:正常1:左膝前屈2:左膝超伸 3:左膝前屈（可能异常）4:左膝超伸（可能异常）
                leftKneeCheckState: null,
                // 右膝评估状态 0:正常1右膝前屈2右膝超伸 3:右膝前屈（可能异常）4:右膝超伸（可能异常）
                rightKneeCheckState: null,
            })
            // todo 男女判断
        },
        young: {
            type: Boolean,
            default: false
        },
        sex: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {}
    },
    computed: {
        // 颈椎评估
        cervicalSpine() {
            const contentList = [
                '头部姿态和颈椎排列基本正常',
                '存在明显的头部前倾或侧歪，颈椎排列轻度偏移',
                '头部明显前倾或侧歪，颈椎排列中度偏移',
                '头部严重前倾或侧歪，颈椎排列严重偏移'
            ]
            const data = this.format(this.spineDetail.cervicalScore)
            data.conetnt = contentList[data.level]
            return data
        },
        shouldRender() {
            const { headForwardState, headSlantState } = this.spineDetail
            const isForwardValid = ![1, 2].includes(headForwardState)
            const isSlantValid = ![1, 2, 3, 4].includes(headSlantState)
            return isForwardValid && isSlantValid
        },
        // 胸椎评估
        thoracicSpine() {
            const contentList = [
                '胸椎排列基本正常，无明显结构异常',
                '胸椎排列轻度偏移，可能对生活质量有轻微影响',
                '胸椎排列中度偏移，可能影响姿势和生活质量',
                '胸椎排列严重偏移，生物力线显著异常，可能造成疼痛及其他继发性问题'
            ]
            const data = this.format(this.spineDetail.thoracicScore)
            data.conetnt = contentList[data.level]
            return data
        },
        // 腰椎评估
        lumbarSpine() {
            const contentList = [
                '腰椎排列正常，姿势平衡，无明显结构异常',
                '腰椎排列轻度偏移，生物力线尚可，但长期可能引发姿势代偿',
                '腰椎排列中度偏移，生物力线偏倚，可能影响姿势和生活质量',
                '腰椎排列严重偏移，生物力线显著异常'
            ]
            const data = this.format(this.spineDetail.lumbarScore)
            data.conetnt = contentList[data.level]
            return data
        },
        // type1 第一个人体图
        type1() {
            return {
                // 头前引状态 0 正常 1 异常 2 可能异常
                headForwardState: this.spineDetail.headForwardState,
                // 头侧歪状态 0 正常 1:异常（偏右）2:异常（偏左）3 可能异常（偏右） 4 可能异常（偏左）
                headSlantState: this.spineDetail.headSlantState,
            }
        },
        // type2 第二个人体图
        type2() {
            return {
                // 高低肩
                highLowShoudlerState: this.spineDetail.highLowShoudlerState,
            }
        },
        // type3 第三个人体图
        type3() {
            return {
                // 腿型：0:正常1:异常2:K型腿3:D型腿4:X型腿5:O型腿 6:K型腿（可能异常）7:D型腿（可能异常）8:X型腿（可能异常）9:O型腿（可能异常） 10 可能异常
                legType: this.spineDetail.legType,
                // 左膝评估状态 0:正常1:左膝前屈2:左膝超伸 3:左膝前屈（可能异常）4:左膝超伸（可能异常）
                leftKneeCheckState: this.spineDetail.leftKneeCheckState,
                // 右膝评估状态 0:正常1右膝前屈2右膝超伸 3:右膝前屈（可能异常）4:右膝超伸（可能异常）
                rightKneeCheckState: this.spineDetail.rightKneeCheckState,
            }
        },
    },
    methods: {
        rank: function (value) {
            if (value < 6) {
                return '正常'
            } else if (value >= 6 && value < 16) {
                return '轻度异常'
            } else if (value >= 16 && value < 31) {
                return '中度异常'
            } else {
                return '重度异常'
            }
        },
        level: function (value) {
            if (value < 6) {
                return 0
            } else if (value >= 6 && value < 16) {
                return 1
            } else if (value >= 16 && value < 31) {
                return 2
            } else {
                return 3
            }
        },
        color: function (value) {
            if (value < 6) {
                return '#48d497'
            } else if (value >= 6 && value < 16) {
                return '#e6b12a'
            } else if (value >= 16 && value < 31) {
                return '#e45e15'
            } else {
                return '#ca4131'
            }
        },
        format(Osource) {
            const source = Math.round(Osource)
            return {
                color: this.color(source),
                rank: this.rank(source),
                source: Math.round(source),
                level: this.level(source),
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cardBox {
    width: 863px;
    height: 350px;

    .cardTitle {
        width: 100%;
        height: 23px;
        background-color: #F2F8FF;
        margin: 9px 0 8px;
        font-size: 12px;
        color: #333333;
        line-height: 23px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        box-sizing: border-box;

        .triangle {
            display: inline-block;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-top: 7px solid #009FE8;
            border-right: 5px solid transparent;
            margin-right: 9px;
        }
    }

    .cardContent {
        border: 1px solid #009FE8;
        width: 100%;
        height: 319px;
        display: grid;
        grid-template-columns: 486px 375px;
        grid-template-rows: 106px 106px 106px;

        .grid-item {
            border-bottom: 1px solid #CED7E0;
            border-right: 1px solid #CED7E0;
            display: flex;


            &:nth-child(5),
            &:nth-child(6) {
                border-bottom: none;
            }

            &:nth-child(2),
            &:nth-child(4),
            &:nth-child(6) {
                border-right: none;
            }

            .imgbox {
                width: 56px;
                height: 56px;
                margin: 23px 13px 0 11px;
                display: flex;
                flex-direction: column;

                img {
                    width: 46px;
                    height: 46px;
                    margin: 0 auto;
                }

                p {
                    text-align: center;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 1;
                    color: #E6B12A;
                    transform: scale(0.9);
                }
            }

            .itemInfo {
                .itemBox {
                    height: 52px;
                    margin-top: 4px;
                    display: flex;

                    p {
                        font-size: 15px;
                        color: #333333;
                        margin-right: 39px;
                        padding-top: 17px;
                    }

                    div.youngSource {
                        display: flex;
                        align-items: center;
                        margin-left: 10px;

                        &>img {
                            width: 31px;
                        }

                        &>div {
                            font-size: 12px;
                        }

                        &>div>span {
                            font-weight: bold;
                            font-size: 21px;
                            position: relative;
                            top: 1px;
                        }
                    }
                }

                .tips {
                    width: 394px;
                    border-top: 1px solid #CED7E0;
                    padding-top: 8px;
                    font-size: 12px;
                    color: #9B9B9B;
                    line-height: 18px;

                    span {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        background: #5698F5;
                        text-align: center;
                        line-height: 12px;
                        color: #fff;
                        font-size: 12px;
                        border-radius: 50%;
                    }
                }
            }



            li {
                &::before{
                    position: absolute;
                    content: '';
                    left: -10px;
                    background: none;
                    font-size: 20px;
                    height: 3px;
                    top: 0
                }
                list-style-type: none !important;
                padding-left: 0;
            }
        }

    }
}

.IRed {
    color: #C32613;
    font-style: normal;
    line-height: normal !important;
}

.IBlue {
    color: #5698F5;
    font-style: normal;
    line-height: normal !important;
}

.cardBox.young {
    .cardContent {
        .itemInfo {
            .itemBox {
                p {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>