<template>
    <div class="cardBox">
        <p id="page2" class="anchor"></p>
        <p class="cardTitle">床垫枕头推荐<br>
            <!-- <span>床垫枕头推荐</span> -->
        </p>
        <div class="customTabs">
                <p>床垫推荐</p>
                <p class="customTabsTitle">推荐硬度：</p>
                <div class="startContainer">
                    <div :class="['startBox', {select: showStart(index, 0)=== index}]" v-for="(item, index) in startArray" :key="index">
                        <span>{{ item }}</span>
                    </div>
                </div>
                <p class="customTabsTitle">异常程度：{{dealWith(mattressRec.level)}}</p>
                <p class="customTabsDes">(基于胸曲、腰曲、骨盆、背部评分计算)</p>
        </div>
        <div class="customTabs1">
                <p>枕头推荐</p>
                <div class="startContainer">
                    <div :class="['startBox1', {select: showStart(index, 1)=== index}]" v-for="(item, index) in remArray" :key="index">
                        <span>{{ item }}</span>
                    </div>
                </div>
                <p class="customTabsTitle">异常程度：{{dealWith(pillowRec.pillowLevel)}}</p>
                <p class="customTabsDes">(基于头部、肩部和颈曲结果计算)</p>
        </div>

        <div class="cardBoxBtn">
            <p class="assessmentTitle"><span>!</span></p>
            <div>
                * 该推荐星度床垫与枕头匹配使用，改善效果更佳。
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        mattressRec: {
            type: Object,
            default: () => ({
                level: 0,
                toJSON: function() { return this } // 添加默认toJSON方法
            })
        },
        pillowRec: {
            type: Object,
            default: () => ({
                toJSON: function() { return this } // 添加默认toJSON方法
            })
        }
    },
    data() {
        return {
            tabinx: 0,
            // 等级色值
            colorLevels: ["#51ED97", "#EAB04D", "#FD3741"],
            // 等级
            0: 0,
            preScore: 0, // 当前状态评分
            preStatus: 0, // 当前状态值
            startArray: ['一星度', '二星度', '三星度', '四星度', '五星度'],
            remArray: ['A款', 'B款', 'C款', 'D款'],
            // 获取用户基本信息
            userInfo: JSON.parse(window.localStorage.getItem('memberInfo'))
        }
    },
    created() {
        this.init()
    },
    methods: {
        showStart(index, value) {
            if (value) {
                // if (this.pillowRec.pillowLevel === 0 && [2, 3].includes(index)) {
                //     return index
                // } else if (this.pillowRec.pillowLevel === 1 && [1].includes(index)) {
                //     return index
                // } else if (this.pillowRec.pillowLevel === 2 && [0, 1, 2].includes(index)) {
                //     return index
                // } else if (this.pillowRec.pillowLevel === 3 && [0, 1].includes(index)) {
                //     return index
                // }
                return this.remArray.findIndex(item => item === this.pillowRec.recommendation)
            } else {
                if (this.mattressRec.level === 0) {
                return 4
                } else if (this.mattressRec.level === 1) {
                    return 3
                } else if (this.mattressRec.level === 2) {
                    return 2
                } else if (this.mattressRec.level === 3 && this.userInfo.sex === 2) {
                    return 0
                } else if (this.mattressRec.level === 3 && this.userInfo.sex === 1) {
                    return 1
                }
            }
        },
        dealWith(key) {
            switch (key) {
                case 0:
                    return '正常'
                case 1:
                    return '轻度异常'
                case 2:
                    return '中度异常'
                case 3:
                    return '重度异常'
            }

        },
        init() {
            // this.tabinx = 0
            // this.preScore = Math.round(this.painRisk.cervicalPainScore)
            // this.preStatus = this.painRisk.cervicalPainStatus
            // this.interval = [0, 11, 40, 60]
        },
    }
}
</script>

<style lang="less" scoped>
.cardBox {
    margin: 0 auto 24px;
    width: 351px;
    min-height: 219px;
    background: url(../../assets/image/spine/bg2.png) 0 0;
    background-size: 100% 100%;
    border-radius: 6px 6px 6px 6px;
    border: 2px solid #3F537C;
    // padding-bottom: 10px;
    position: relative;

    .anchor {
        position: absolute;
        top: -10px;
    }

    .cardTitle {
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: url(../../assets/image/spine/titlebg.png) 0 0;
        background-size: 100% 100%;
        width: 100%;
        height: 44px;
        line-height: 42px;
        span{
            display: inline-block;
            position: relative;
            top: -18px;
        }
    }

    .chartBox {
        width: 352px;
        min-height: 164px;

        .rateNum {
            width: 80px;
            height: 100%;
            display: inline-block;
            margin-left: 25px;
            vertical-align: top;
            text-align: center;

            p {
                font-weight: 500;
                font-size: 14px;
                color: #FFFFFF;
                margin: 9px 0 11px;
            }

            img {
                width: 80px;
                height: 100px;
            }
        }

        .chartCircle {
            width: calc(100% - 136px);
            height: 164px;
            display: inline-block;
            border: 1px solid red;
            margin-left: 20px;
        }

        .tips {
            height: 40px;
            padding-top: 16px;
            font-weight: 400;
            font-size: 12px;
            color: #8AA3BE;
            line-height: 24px;
            margin: 0 13px;
            border-top: 1px dashed #8A90A2;
        }
    }

    .customTabs, .customTabs1 {
        width: 330px;
        min-height: 144px;
        background: rgba(8, 20, 59, 0.75);
        border-radius: 6px 6px 6px 6px;
        margin: 17px auto 0;
        text-align: left;
        overflow: hidden;
        p:first-child{
            font-size: 14px;
            color: #FFFFFF;
            line-height: 17px;
            margin: 17px 0 0 17px;
        }
        .customTabsTitle{
            font-weight: 400;
            font-size: 12px;
            line-height: 14px;
            color: #89A2BB;
            margin: 8px 17px;
        }
        .customTabsDes{
            font-weight: 400;
            font-size: 12px;
            color: #656365;
            line-height: 17px;
            margin: 8px 17px;
        }
        .startContainer{
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin: 4px 17px 0;
            .startBox, .startBox1{
                width: 54px;
                height: 22px;
                background: #404d5a;
                border-radius: 1px;
                opacity: 0.9;
                text-align: center;
                span{
                    font-weight: 400;
                    font-size: 12px;
                    color: #89A2BB ;
                    line-height: 22px;
                    opacity: 0.8;
                }
            }
            .startBox1{
                width: 69px;
            }
            .select{
                background: #0091FF;
                opacity: 1;
                span{
                    color: #FFFFFF;
                }
            }
        }
    }
    .customTabs1{
        p:first-child{
            font-size: 14px;
            color: #FFFFFF;
            line-height: 17px;
            margin: 17px 0 10px 17px;
        }
        .customTabsTitle{
            margin-top: 14px;
        }
    }
    .cardBoxBtn{
        margin: 10px;
        background: #354869;
        width: 328px;
        height: 40px;
        border-radius: 5px ;
        text-align: left;
        .assessmentTitle {
            display: inline-block;
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            margin-left: 11px;
            padding-top: 11px;
            text-align: left;
            span {
                display: inline-block;
                width: 14px;
                height: 14px;
                // background: #EAB04D;
                border-radius: 50%;
                text-align: center;
                line-height: 14px;
                color: #89A2BB;
                font-size: 12px;
                margin-right: 4px;
                border: 1px solid #89A2BB;
            }
        }
        div{
            display: inline-block;
            font-weight: 400;
            font-size: 12px;
            color: #89A2BB;
            line-height: 17px;
            text-align: left;
            font-style: normal;
        }
    }
}
</style>