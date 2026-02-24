<template>
    <!-- 分享 - 体态结果（体态评估） -->
    <div class="share-result-data">
        <div class="title">
            <h5>体态评估结果</h5>
        </div>
        <div class="result-model">
            <img v-if="fontImg" :src="fontImg" @load="imageLoadedSuc" @error="imageLoadedErr" alt="模型正面图片" />
        </div>
        <div class="result-items">
            <template v-for="(item, index) in shapeItems">
                <div class="result-item" v-bind:key="index">
                    <span class="item-name">{{ item.name }}</span>
                    <div>
                        <span
                            :class="['status', item.status === 1 ? 'success' : 'error']"
                        >{{ item.status === 1 ? '正常' : '异常' }}</span>
                        <span>{{ item.diff }} cm</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { bsEvalInfo, findBsScanFileInfos } from '@/assets/js/apolloGql.js'
import { toDecimal2, convertImgToBase64 } from '@/assets/js/util.js'
export default {
    data() {
        return {
            // 本次扫描信息
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            shapeItems: [
                { name: '头前引', status: 1 },
                { name: '圆肩', status: 1 },
                { name: '高低肩', status: 1 },
                { name: '骨盆前/后倾', status: 1 },
                { name: '长短腿', status: 1 }
            ],
            fontImg: '',
            dataResult: false
        }
    },
    created() {
        this.getBsInfo(() => {
            this.getBsFile()
        })
    },
    methods: {
        // 获取体态评估数据
        getBsInfo(fn) {
            this.$apollo
                .query({
                    query: bsEvalInfo,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    const data = res.data.bsEvalInfo
                    if (data.code === 200) {
                        const info = data.data
                        // 头前引判断
                        const diffHead = info.cavumConchae - info.acromionReference
                        this.shapeItems[0].diff = toDecimal2(diffHead, 1)
                        if (diffHead > 2) {
                            this.shapeItems[0].status = 0
                        }

                        // 圆肩判断
                        const diffShoulderMid = info.shoulderMidpoint - info.acromionReference
                        this.shapeItems[1].diff = toDecimal2(diffShoulderMid, 1)
                        if (diffShoulderMid > 0) {
                            this.shapeItems[1].status = 0
                        }

                        // 高低肩判断
                        const diffShoulder = info.leftShoulder - info.rightShoulder
                        this.shapeItems[2].diff = toDecimal2(diffShoulder, 1)
                        if (diffShoulder !== 0) {
                            this.shapeItems[2].status = 0
                        }

                        // 骨盆前/后倾判断
                        const diffHipJoint = info.hipJoint - info.acromionReference
                        this.shapeItems[3].diff = toDecimal2(diffHipJoint, 1)
                        if (diffHipJoint !== 0) {
                            this.shapeItems[3].status = 0
                        }

                        // 长短腿判断
                        const diffLeg = info.leftLeg - info.rightLeg
                        this.shapeItems[4].diff = toDecimal2(diffLeg, 1)
                        if (diffLeg !== 0) {
                            this.shapeItems[4].status = 0
                        }
                        this.dataResult = true
                        // this.checkData()
                    } else {
                        this.dataLoadErr('bsEvalInfo')
                    }
                    if (fn) {
                        fn()
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('bsEvalInfo')
                })
        },
        getBsFile() {
            let that = this
            this.$apollo
                .query({
                    query: findBsScanFileInfos,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBsScanFileInfos
                    if (data && data.code === 200) {
                        // 获取模型正面图片
                        this.$lodash.each(data.data, (model, index) => {
                            if (model.fileType.id === 6) {
                                // 图片转base64，防止拷贝dom时丢失图片
                                convertImgToBase64(model.filePath, function(base64Img) {
                                    that.fontImg = base64Img
                                })
                            }
                        })
                    } else {
                        this.checkData()
                        this.dataLoadErr('findBsScanFileInfos')
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.dataLoadErr('findBsScanFileInfos')
                })
        },
        // 模型图片加载完毕
        imageLoadedSuc() {
            this.checkData()
        },
        checkData() {
            if (this.fontImg && this.dataResult) {
                this.$nextTick(() => {
                    this.$emit('loadOver', 'BsData')
                })
            }
        },
        // 图片加载失败
        imageLoadedErr(e) {
            console.error('bsData中图片加载失败！失败src:', e.target.src)
            this.$nextTick(() => {
                this.$emit('loadError', 'BsData')
            })
        },
        // 接口加载失败
        dataLoadErr(name) {
            console.error('bsData中接口加载失败！失败接口:', name)
            this.$nextTick(() => {
                this.$emit('loadError', 'bsData')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.share-result-data {
    padding: 20px 0;
    text-align: left;
    .title {
        width: 90%;
        margin: 0 auto;
        display: flex;
        align-items: middle;
        justify-content: space-between;
        h5 {
            font-size: 4.7vw;
            font-weight: normal;
            color: rgba(0, 159, 232, 1);
        }
    }

    .result-model {
        text-align: center;
        background: url('../../assets/images/share/shape_floor.png') no-repeat bottom;
        background-size: contain;
        margin-bottom: 30px;
        img {
            width: 150px;
            height: auto;
            margin: 20px 0;
        }
    }

    .result-items {
        width: 90%;
        margin: 0 auto;
        padding: 2px;
        border-radius: 20px;
        border: 1px solid #1894ff;
        overflow: hidden;

        .result-item {
            display: flex;
            align-items: middle;
            justify-content: space-between;
            height: 40px;
            line-height: 40px;
            border-width: 0 0 1px 0;
            border-style: solid;
            border-color: #4a4a4a;
            margin: 0 20px;
            .item-name {
                font-size: 4.4vw;
                color: #ffffff;
            }
            div {
                span {
                    font-size: 13px;
                    color: #8b8b8b;
                    display: inline-block;
                    &:first-of-type {
                        margin-right: 40px;
                    }
                    &:last-of-type {
                        width: 65px;
                        margin-right: 5px;
                    }
                }
                .status {
                    // width: 24px;
                    // height: 16px;
                    font-size: 4vw;
                    padding: 1vw;
                    line-height: 14px;
                }
                .success {
                    color: #ffffff;
                    background: #136bbc;
                    border-radius: 2px;
                }
                .error {
                    color: #ffffff;
                    background: #d4551f;
                    border-radius: 2px;
                }
            }
            &:first-of-type {
                margin-top: 20px;
            }
            &:last-of-type {
                margin-bottom: 20px;
                border: none;
            }
        }
    }
}
</style>

