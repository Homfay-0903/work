<template>
    <div class="containerBox">
        <!-- 数据可视化 -->
        <threeDView :structureAssessment="obSpineConclusionData.structureAssessment"
            :structureFileInfo="structureFileInfo" />
        <!-- 评估详情 -->
        <assessmentView :spineDetail="obSpineConclusionData.spineDetail" :sex="obSpineConclusionData.type === 0 ? 1 : obSpineConclusionData.type" :young="obSpineConclusionData.type === 0" />
        <!-- 需要在cmdb开启未成年报告， 并且在18岁年龄范围内 -->
        <template v-if="obSpineConclusionData.type === 0">
            <!-- 青少年脊柱专项风险评估 -->
            <youngRisk :youthSpineDetail="obSpineConclusionData.youthSpineDetail" />
        </template>
        <template v-else>
            <!-- 疼痛潜在风险评估 -->
            <painAssessment :painRisk="obSpineConclusionData.painRisk" />
            <!-- 骨盆专项风险评估 -->
            <pelvisAssessment v-if="obSpineConclusionData.type === 2" :pelvicRisk="obSpineConclusionData.pelvicRisk" />
        </template>
        <!-- 枕头床垫推荐 需要在cmdb开启枕头推荐开关 -->
        <recommend v-if="reportInfo.mpRecommend === 1" :pillowRec="obSpineConclusionData.pillowRec"
            :mattressRec="obSpineConclusionData.mattressRec" />
    </div>
</template>

<script>
import threeDView from '@/components/female/threeDView.vue'
import assessmentView from '@/components/female/assessmentView.vue'
import painAssessment from '@/components/female/painAssessment.vue'
import pelvisAssessment from '@/components/female/pelvisAssessment.vue'
import recommend from '@/components/female/recommend.vue'
import youngRisk from '@/components/female/youngRisk.vue'
import { obSpineConclusion, bsScanFileInfos } from '@/assets/js/apolloGql.js'
export default {
    components: {
        threeDView,
        assessmentView,
        painAssessment,
        pelvisAssessment,
        recommend,
        youngRisk
    },
    props: {
        // 报告信息 scanId、scanMode等记录信息
        reportInfo: {
            type: Object,
            default: null
        },
        // 记忆信息 性别、年龄、身高、体重等
        memberInfo: {
            type: Object,
            default: null
        },
        young: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            // 脊柱专项结论数据
            obSpineConclusionData: {},
            // 脊柱图片、模型、描述文件等
            structureFileInfo: {
                // 侧面
                side: null,
                // 背面
                back: null,
                // json点位剪裁数据
                jsons: null,
            }
        }
    },
    watch: {
        reportInfo(newVal) {
            if (newVal.scanId) {
                // 获取目标scanId脊柱专项结论
                this.getObSpineConclusion()
                this.getBsScanFileInfos()
            }
        },
    },
    mounted() {
        // 页面加载完成后可以执行一些初始化操作
        console.log('脊柱专项报告加载完成')
        if (this.reportInfo.scanId) {
            this.getObSpineConclusion()
            this.getBsScanFileInfos()
        }
    },
    methods: {
        // 获取脊柱专项结论
        async getObSpineConclusion() {
            // 处理数据的逻辑
            const resd = await this.$apollo
                .query({
                    query: obSpineConclusion,
                    variables: {
                        scanId: this.reportInfo.scanId
                    }
                }).catch(e => {
                })
            this.obSpineConclusionData = {
                ...resd.data.obSpineConclusion.data
            }
        },
        // 获取体态相关扫描模型文件 == 脊柱基于体态身高体重
        async getBsScanFileInfos() {
            const userinfo = {
                scanId: this.reportInfo.scanId
            }
            const resd = await this.$apollo
                .query({
                    query: bsScanFileInfos,
                    variables: userinfo
                })
            if (resd.data.bsScanFileInfos && resd.data.bsScanFileInfos.code === 200) {
                const fileInfo = resd.data.bsScanFileInfos.data
                // structureFileInfo
                fileInfo.forEach(item => {
                    if (item.fileType.id === 22) {
                        // 背面
                        this.structureFileInfo.back = item
                    } else if (item.fileType.id === 23) {
                        // 侧面
                        this.structureFileInfo.side = item
                    } else if (item.fileType.id === 45) {
                        this.structureFileInfo.jsons = item
                    }
                })
            }
        }
    }
}
</script>

<style scoped lang="less">
.containerBox {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    /deep/ p {
        margin: 0;
    }

    /deep/ i {
        line-height: 30px;
    }
}
</style>