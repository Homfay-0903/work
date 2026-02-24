<template>
    <div class="processBar" :class="young ? 'young' : ''">
        <div class="scoreNum">
            <div v-if="young == false" :style="{ left: colorWidth(spine.source) + 'px' }">
                <div><span class="sourceS" :style="{ color: spine.color }"> {{ spine.source }}</span>分</div>
            </div>
        </div>
        <div class="processBox">
            <div v-for="(itm, inx) in rankList" :key="'white' + inx" class="maskBg"
                :style="{ left: (inx + 1) * (young ? 67 : 74) + (inx * 2) + 'px', backgroundColor: backColor }"><span>{{
                    itm }}</span></div>
            <div class="processLine" :style="{ background: spine.color, width: colorWidth(spine.source) + 'px' }"></div>
        </div>
        <div class="source">
            <div v-for="(itm, inx) in sourceList" :key="itm"><span>{{ itm }}</span></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 当前值
        spine: {
            type: Object,
            default: () => ({
                color: '#333',
                source: 0,
                rank: 0,
                level: 0,
            })
        },
        young: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            rankList: ['正常', '轻度', '中度', '重度'],
            sourceList: [0, 6, 16, 31, 50],
            isTop: false,
        }
    },
    computed: {
        backColor() {
            return this.isTop ? '#FFFFFF' : '#f5f6fa'
        }
    },
    mounted() {
        this.isTop = window.top === window.self
    },
    methods: {
        colorWidth(source) {
            // 使用left浮动分数
            // 注意分块间的间隔
            const intervalWidth = 4
            const baseWidth = this.young ? 66 : 73
            let sourceWidth = 0
            let interval = 0
            if (source < 6) {
                sourceWidth = baseWidth * source / 5
            } else if (source >= 6 && source < 16) {
                interval += 1
                sourceWidth = baseWidth + baseWidth * (source - 5) / 10
            } else if (source >= 16 && source <= 30) {
                interval += 2
                sourceWidth = baseWidth * 2 + baseWidth * (source - 15) / 15
            } else {
                interval += 3
                if (source >= 50) {
                    sourceWidth = baseWidth * 4
                } else {
                    sourceWidth = baseWidth * 3 + baseWidth * (source - 30) / 20
                }
            }
            const left = sourceWidth + interval * intervalWidth
            return Math.ceil(left)
        }
    }
}
</script>

<style lang="less" scoped>
.processBar {
    width: 306px;
    height: 52px;

    .scoreNum {
        position: relative;
        font-size: 12px;
        color: #333333;
        width: 100%;
        height: 28px;

        &>div {
            display: block;
            position: absolute;
            font-style: inherit;
            bottom: 4px;
            width: 0;
            white-space: nowrap;

            &>div {
                position: relative;
                display: inline-block;
                width: 40px;
                left: -20px;
                text-align: center;

                &>span {

                    font-weight: bold;
                    font-size: 21px;
                }
            }
        }

    }

    &>div.young {
        height: 100%;
        position: absolute;
        // right: -75px;
        width: 75px;
        display: flex;
        align-items: center;

        &>div {
            left: unset;
        }

        &>img {
            width: 31px
        }
    }

    .processBox {
        width: 100%;
        height: 2px;
        border-radius: 2px;
        background-color: #CED7E0;
        position: relative;

        .maskBg {
            width: 4px;
            height: 4px;
            position: absolute;
            top: -1px;
            left: 0;
            z-index: 5;

            &>span {
                position: absolute;
                left: -44px;
                top: 5px;
                font-size: 12px;
                color: #525252;
                white-space: nowrap;
            }
        }

        .processLine {
            height: 2px;
            top: 0px;
            position: absolute;
            top: 0;
            z-index: 1;
        }
    }

    div.source {
        position: relative;
        display: flex;

        &>div {
            flex: 1;
            font-size: 12px;
            color: #8AA3BE;
            margin-top: 2px;
            line-height: 17px;

            &:last-child {
                position: absolute;
                right: 0;
                display: none;
            }

            &:first-child {
                left: 0;
            }

            &:not(:first-child):not(:last-child) {
                &>span {
                    position: relative;
                    display: block;
                    width: 20px;
                    left: -5px;
                    text-align: center;
                }
            }
        }
    }
}

.processBar.young {
    position: relative;
    width: 275px;
    height: 52px;

    .scoreNum {
        width: 100%;
    }
}

.sourceS {
    position: relative;
    top: 1px;
}
</style>