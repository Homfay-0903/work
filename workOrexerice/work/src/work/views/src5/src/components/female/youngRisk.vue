<template>
    <div class="content">
        <p class="title">青少年脊柱专项风险评估</p>
        <div class="contBox">
            <div class="boxItem">
                <youngProBar title="脊柱发育指数" :info="youthIndex">
                    <div class="texts">
                        <div class="source"><span v-for="(item, index) in t[0]" :key="index + item">{{ item }}</span>
                        </div>
                        <div class="process-text"><span v-for="(item2, index2) in s[0]" :key="index2 + item2">{{ item2
                        }}</span></div>
                    </div>
                </youngProBar>
            </div>
            <div class="boxItem">
                <youngProBar title="学习姿势负荷指数" :info="loadScore">
                    <div class="texts">
                        <div class="source"><span v-for="(item, index) in t[3]" :key="index + item">{{ item }}</span>
                        </div>
                        <div class="process-text"><span v-for="(item2, index2) in s[3]" :key="index2 + item2">{{ item2
                        }}</span></div>
                    </div>
                </youngProBar>
            </div>
            <div class="boxItem">
                <youngProBar title="生长疼痛预警指数" :info="painScore">
                    <div class="texts">
                        <div class="source"><span v-for="(item, index) in t[1]" :key="index + item">{{ item }}</span>
                        </div>
                        <div class="process-text"><span v-for="(item2, index2) in s[1]" :key="index2 + item2">{{ item2
                        }}</span></div>
                    </div>
                </youngProBar>

            </div>
            <div class="boxItem">
                <youngProBar title="骨骼平衡指数" :info="balanceScore">
                    <div class="texts">
                        <div class="source"><span v-for="(item, index) in t[4]" :key="index + item">{{ item }}</span>
                        </div>
                        <div class="process-text"><span class="moreText" v-for="(item2, index2) in s[4]"
                                :key="index2 + item2">{{ item2 }}</span></div>
                    </div>
                </youngProBar>
            </div>
            <div class="boxItem">
                <youngProBar title="脊柱侧弯风险评分" :info="scoliosisScore">
                    <div class="texts">
                        <div class="source"><span v-for="(item, index) in t[2]" :key="index + item">{{ item }}</span>
                        </div>
                        <div class="process-text"><span v-for="(item2, index2) in s[2]" :key="index2 + item2">{{ item2
                        }}</span></div>
                    </div>
                </youngProBar>
            </div>
            <div class="boxItem"></div>
        </div>
    </div>
</template>

<script>
import youngProBar from './youngProgessBar.vue'
const t = {
    // 青少年脊柱发育指数
    '0': [0, 11, 21, 31, 40],
    // 生长期疼痛预警指数
    '1': [0, 11, 26, 40, 55],

    // 脊柱侧弯风险评分 =====================
    '2': [0, 5, 15, 20],
    // 学习姿势负荷指数
    '3': [0, 16, 31, 46, 60],
    // 青春期骨骼平衡指数
    '4': [0, 16, 26, 35, 45]
}
const s = {
    '0': ['优良', '注意', '干预', '警示'],
    '1': ['安全', '注意', '警示', '危险'],
    '2': ['低风险', '中风险', '高风险'],
    '3': ['低负荷', '中负荷', '高负荷', '过载'],
    '4': ['平衡', '轻度', '中度', '严重'],
}
// 等级颜色
const c = ['#48d497', '#e6b12a', '#e45e15', '#ca4131']
export default {
    components: {
        youngProBar
    },
    props: {
        // 风险值
        riskValue: {
            type: Number,
            default: 6
        },
        youthSpineDetail: {
            type: Object,
            default: () => ({
                // 青少年脊柱发育指
                youthIndex: 0,
                // 生长期疼痛预警指数
                painScore: 0,
                // 脊柱侧弯风险评分
                scoliosisScore: 0,
                // 学习姿势负荷指数
                loadScore: 0,
                // 青春期骨骼平衡指数
                balanceScore: 0,
            })
        }
    },
    data() {
        return {
            t,
            s,
        }
    },
    computed: {
        youthIndex() {
            return this.format(this.youthSpineDetail.youthIndex, 0)
        },
        painScore() {
            return this.format(this.youthSpineDetail.painScore, 1)
        },
        scoliosisScore() {
            const source = Math.round(this.youthSpineDetail.scoliosisScore)
            const data = {
                color: 0,
                rank: 0,
                source: 0,
                level: 0,
                left: 0,
                content: '',
                type: 2
            }
            const base = 298 / 3
            if (source <= t[2][1]) {
                data.color = c[0]
                data.rank = s[0]
                data.source = Math.round(source)
                data.level = 0
                data.left = base * source / t[2][1]
            } else if (source > t[2][1] && source < t[2][2]) {
                data.color = c[1]
                data.rank = s[1]
                data.source = Math.round(source)
                data.level = 1
                data.left = base + base * ((source - t[2][1]) / (t[2][2] - t[2][1]))
            } else {
                data.color = c[3]
                data.rank = s[2]
                data.source = Math.round(source)
                data.level = 2
                data.left = 2 * base + base * ((source - t[2][2]) / (t[2][3] - t[2][2]))
                if (source >= t[2][3]) {
                    data.left = 298
                }
            }
            data.content = this.content(2, data.level)
            data.level++
            return data
        },
        loadScore() {
            return this.format(this.youthSpineDetail.loadScore, 3)
        },
        balanceScore() {
            return this.format(this.youthSpineDetail.balanceScore, 4)
        },
    },
    mounted() {
        // console.clear()
    },
    methods: {
        rank: function (value, type = 0) {
            if (value < t[type][1]) {
                return s[type][0]
            } else if (value >= t[type][1] && value < t[type][2]) {
                return s[type][1]
            } else if (value >= t[type][2] && value < t[type][3]) {
                return s[type][2]
            } else {
                return s[type][3]
            }
        },
        level: function (value, type = 0) {
            if (value < t[type][1]) {
                return 0
            } else if (value >= t[type][1] && value < t[type][2]) {
                return 1
            } else if (value >= t[type][2] && value < t[type][3]) {
                return 2
            } else {
                return 3
            }
        },
        color: function (value, type = 0) {
            if (value < t[type][1]) {
                return c[0]
            } else if (value >= t[type][1] && value < t[type][2]) {
                return c[1]
            } else if (value >= t[type][2] && value < t[type][3]) {
                return c[2]
            } else {
                return c[3]
            }
        },
        format(Osource, type = 0) {
            const source = Math.round(Osource)
            const data = {
                color: this.color(source, type),
                rank: this.rank(source, type),
                source: Math.round(source),
                level: this.level(source, type),
                left: this.colorWidth(source, type),
                type
            }
            data.content = this.content(type, data.level)
            return data
        },
        colorWidth(source, type = 0) {
            let left = 0
            const base = 298 / 4
            if (source < t[type][1]) {
                left = base * source / t[type][1]
            } else if (source >= t[type][1] && source < t[type][2]) {
                left = base + base * ((source - t[type][1]) / (t[type][2] - t[type][1]))
            } else if (source >= t[type][2] && source < t[type][3]) {
                left = 2 * base + base * ((source - t[type][2]) / (t[type][3] - t[type][2]))
            } else {
                left = 3 * base + base * ((source - t[type][3]) / (t[type][4] - t[type][3]))
                if (source >= t[type][4]) {
                    left = 298
                }
            }
            return Math.ceil(left)
        },
        content(type = 0, level) {
            const data = [
                ['脊柱发育正常，无明显结构问题', '存在轻微发育隐患，建议改善姿势习惯', '中度发育风险', '严重影响脊柱发育'],
                ['姿势良好，疼痛风险低', '轻度疼痛风险，建议姿势管理', '中度疼痛风险，需专业指导', '高度疼痛风险，可能已有不适感'],
                ['低风险，请保持良好姿势习惯', '中风险，可能需要进一步观察或干预', '高风险，需要及时就医进行专业医疗评估干预'],
                ['学习姿势良好，可长时间维持', '姿势有待改善，建议每45分钟休息', '存在明显姿势问题，需要定期拉伸', '学习姿势严重不良，或将影响学习效率和发育'],
                ['骨骼发育对称，姿势稳定', '存在轻微不对称，建议监测', '发育不均匀，需要纠正措施', '骨骼发育严重不对称，影响生长']
            ]
            return data[type][level]
        }
    }
}
</script>

<style lang="less" scoped>
.content {
    margin: 24px auto 0;

    .title {
        font-weight: 400;
        font-size: 24px;
        color: #333333;
        margin: 0;
        padding: 0px 0 8px;
    }

    .contBox {
        width: 863px;
        height: 315px;
        border: 1px solid #009FE8;
        display: grid;
        grid-template-columns: 431px 431px;
        grid-template-rows: 105px 105px 80px;
        box-sizing: border-box;

        .boxItem {
            border-bottom: 1px solid #CED7E0;
            border-right: 1px solid #CED7E0;

            &:nth-child(2),
            &:nth-child(4),
            &:nth-child(6) {
                border-right: none;
            }

            &:nth-child(5),
            &:nth-child(6) {
                border-bottom: none;
            }

            .boxTitle {
                img {
                    width: 23px;
                    height: 23px;
                }

                font-weight: 500;
                font-size: 15px;
                color: #333333;
                display: flex;
                align-items: center;
                padding: 12px 0 0 12px;
            }

            .processBox {
                width: 382px;
                height: 31px;
                display: flex;
                align-items: center;
                margin-left: 37px;
                margin-top: -4px;

                .processBar {
                    width: 298px;
                    height: 2px;
                    background: #CED7E0;
                    position: relative;

                    .processCurBar {
                        width: 30%;
                        height: 2px;
                        background-color: #E6B12A;
                        position: relative;

                        &::after {
                            content: "";
                            position: absolute;
                            width: 6px;
                            height: 6px;
                            border-radius: 4px;
                            background-color: #E6B12A;
                            right: 0;
                            top: -2px;
                        }
                    }

                }

                img {
                    width: 31px;
                    height: 31px;
                    margin: 0 3px 0 12px;
                }

                span {
                    font-weight: 400;
                    font-size: 9px;
                    color: #333333;
                    display: inline-flex;
                    width: 36px;
                    justify-content: flex-end;
                    align-items: flex-end;

                    b {
                        font-size: 18px;
                        color: #E6B12A;
                        margin-right: 2px;
                        line-height: 1;
                    }
                }
            }

            .processLine {
                width: 298px;
                height: 12px;
                margin-left: 37px;

                .texts {
                    position: relative;
                    margin-top: -9px;
                    width: 100%;
                    font-size: 12px;
                    line-height: 1;
                    color: #8AA3BE;

                    div.source {
                        position: relative;
                        width: 100%;
                        display: flex;

                        &>span {
                            position: relative;
                            flex: 1;

                            &:not(:first-child) {
                                left: -8px;
                            }

                            &:last-child {
                                display: none;
                            }
                        }
                    }

                    div.process-text {
                        position: absolute;
                        display: flex;
                        width: 100%;

                        &>span {
                            position: relative;
                            flex: 1;
                            text-align: center;
                        }
                    }
                }
            }

            .tips {
                height: 33px;
                width: 298px;
                border-top: 1px solid #CED7E0;
                font-size: 12px;
                color: #666;
                margin-left: 37px;
                margin-top: 8px;
                line-height: 31px;

                span {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: #5698F5;
                    text-align: center;
                    line-height: 12px;
                    padding: 2px;
                    color: #fff;
                    font-size: 12px;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>