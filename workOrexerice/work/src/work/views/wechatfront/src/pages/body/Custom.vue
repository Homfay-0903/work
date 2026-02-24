<template>
    <!--身体成分添加个性数据-->
    <div class="composition-personal-data">
        <div class="color-list">
            <draggable
                v-model="listData"
                :options="{
                           group:'dragging',
                           handle: '.my-handle',
                           filter: '.ignore-elements',
                           draggable: '.item-draggle'
                       }"
                :move="checkMove"
                @start="drag = true"
                @end="datadragEnd"
            >
                <div
                    class="color-item"
                    :class="{'ignore-elements': !data.state, 'item-draggle': data.state}"
                    v-for="(data, index) in listData"
                    :key="index"
                >
                    <input
                        type="checkbox"
                        :name="data.bmqName"
                        v-model="data.state"
                        @change="handelChange(data)"
                        :class="{'input-check-success': data.state}"
                        class="input-check"
                    />
                    <p>{{ data.bmqName }}</p>
                    <div>
                        <p @click="openTip" class="my-handle" v-if="data.state"></p>
                    </div>
                </div>
            </draggable>
            <mt-popup v-model="popupVisible" class="popup-composition-data" popup-transition="popup-fade">
                <img src="@/assets/images/comp_pop_msg.png" alt />
            </mt-popup>
        </div>
        <div class="bottom-check-all">
            <div class="check-all">
                <input
                    type="checkbox"
                    name="全选"
                    id="checkAll"
                    v-model="checkAll"
                    @click="handelChangeAll()"
                    :class="{'input-check-all-success': checkAll}"
                    class="input-check-all"
                />
                <label for="checkAll">全选</label>
            </div>
            <div class="reset" @click="reset">
                <img src="@/assets/images/comp_reset.png" alt />
                恢复默认
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {
    findAllQuotas,
    choiceQuota,
    deselectionQuota,
    checkAllQuota,
    deselectionAllQuota,
    resetQuota,
    dragQuota
} from '@/assets/js/apolloGql.js'
import { clone } from '@/assets/js/util.js'

export default {
    components: {
        draggable
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            checkAll: false,
            listData: [],
            popupVisible: false,
            currentIndex: 0
        }
    },
    mounted() {
        const that = this
        // 获取个性化设置列表
        that.findAllQuotas()
    },
    methods: {
        // 拖动操作
        checkMove(evt) {
            this.currentIndex = evt.draggedContext.element.id
        },
        datadragEnd(evt) {
            const that = this
            that.$apollo
                .mutate({
                    mutation: dragQuota,
                    variables: {
                        memberId: that.modelInfo.memberId,
                        id: that.currentIndex,
                        order: evt.oldIndex + 1,
                        targetOrder: evt.newIndex + 1
                    }
                })
                .then(res => {
                    const data = res.data.dragQuota
                    if (data.code === 200) {
                        that.$toast({
                            message: data.message,
                            duration: 2000
                        })
                    }
                })
        },
        openTip() {
            this.popupVisible = true
        },
        // 获取个性化设置列表
        findAllQuotas() {
            const that = this
            that.$apollo
                .query({
                    query: findAllQuotas,
                    variables: {
                        memberId: that.modelInfo.memberId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findAllQuotas.data
                    that.listData = clone(data)
                    that.listData.forEach(item => {
                        if (item.state === 1) {
                            item.state = true
                        } else {
                            item.state = false
                        }
                    })
                    // 全选选中状态处理
                    const array = that.listData.findIndex(item => {
                        return item.state === false
                    })
                    this.checkAll = array === -1 ? true : false
                })
        },
        // 全选操作
        handelChangeAll() {
            // 反选
            if (this.checkAll) {
                this.$apollo
                    .mutate({
                        mutation: deselectionAllQuota,
                        variables: {
                            memberId: this.modelInfo.memberId
                        }
                    })
                    .then(res => {
                        const data = res.data.deselectionAllQuota
                        if (data.code === 200) {
                            this.findAllQuotas()
                            this.$toast({
                                message: '操作成功',
                                duration: 2000
                            })
                        }
                    })
                //  全选
            } else {
                this.$apollo
                    .mutate({
                        mutation: checkAllQuota,
                        variables: {
                            memberId: this.modelInfo.memberId
                        }
                    })
                    .then(res => {
                        const data = res.data.checkAllQuota
                        if (data.code === 200) {
                            this.findAllQuotas()
                            this.$toast({
                                message: '操作成功',
                                duration: 2000
                            })
                        }
                    })
            }
        },
        // 选择,取消选择操作
        handelChange(data) {
            if (!data.state) {
                this.$apollo
                    .mutate({
                        mutation: deselectionQuota,
                        variables: {
                            id: data.id,
                            order: data.order,
                            memberId: data.memberId
                        }
                    })
                    .then(res => {
                        const data = res.data.deselectionQuota
                        this.findAllQuotas()
                        if (data.code === 200) {
                            this.$toast({
                                message: '取消选择成功',
                                duration: 2000
                            })
                        } else if (data.code === 406) {
                            this.$toast({
                                message: data.message,
                                duration: 2000
                            })
                        }
                    })
            } else {
                this.$apollo
                    .mutate({
                        mutation: choiceQuota,
                        variables: {
                            id: data.id
                        }
                    })
                    .then(res => {
                        const data = res.data.choiceQuota
                        if (data.code === 200) {
                            this.findAllQuotas()
                            this.$toast({
                                message: '选择成功',
                                duration: 2000
                            })
                        }
                    })
            }
        },
        // 恢复默认操作
        reset() {
            this.$apollo
                .mutate({
                    mutation: resetQuota,
                    variables: {
                        memberId: this.modelInfo.memberId
                    }
                })
                .then(res => {
                    const data = res.data.resetQuota
                    if (data.code === 200) {
                        this.findAllQuotas()
                        this.$toast({
                            message: '恢复默认成功',
                            duration: 2000
                        })
                    }
                })
        }
    }
}
</script>
<style lang="less" scoped>
.composition-personal-data {
    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }
}
</style>
