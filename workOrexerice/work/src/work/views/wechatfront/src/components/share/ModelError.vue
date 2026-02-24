<template>
    <div class="error-model">
        <div class="model-svg left" :class="{'active': !shapeModelInfo.oldModel}">
            <img :src="modelImage" @load="imageLoadedSuc" @error="imageLoadedErr" alt="左模型" />
            <span class="faild-msg">暂无模型</span>
        </div>

        <div class="model-svg right" :class="{'active': !shapeModelInfo.newModel}">
            <img :src="modelImage" @load="imageLoadedSuc" @error="imageLoadedErr" alt="右模型" />
            <span class="faild-msg">暂无模型</span>
        </div>
    </div>
</template>
<script>
import womanModel from '@/assets/images/share/model_woman.png'
import manModel from '@/assets/images/share/model_man.png'
export default {
    data() {
        return {
            // 获取用户基本信息
            userInfo: JSON.parse(window.localStorage.getItem('memberInfo')),
            // 体态模型失败情况
            shapeModelInfo: JSON.parse(window.localStorage.getItem('shareModelInfo')),
            // 底部图标加载
            imgLoad: {
                total: 2,
                load: 0
            },
            // 失败模型图片
            modelImage: ''
        }
    },
    created() {
        // 判断性别
        this.modelImage = this.userInfo.sex === 2 ? womanModel : manModel
        // this.modelImage = this.userInfo.sex === 2 ? 'http://static.weqianduan.com/screenshot_20190516d466a934a563b.jpeg?timestap=' + new Date().getTime() : manModel

        this.chargeComponentLoaded()
    },
    methods: {
        // 判断加载完毕
        chargeComponentLoaded() {
            if (this.imgLoad.load === this.imgLoad.total) {
                this.$nextTick(() => {
                    this.$emit('loadOver', 'modelError')
                })
            }
        },
        // 图片加载完回调
        imageLoadedSuc() {
            this.imgLoad.load++
            this.chargeComponentLoaded()
        },
        // 图片加载失败
        imageLoadedErr(e) {
            console.error('ModelError中图片加载失败！失败src:', e.target.src)
            this.$nextTick(() => {
                this.$emit('loadError', 'modelError')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.error-model {
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    height: 73vw;
    justify-content: center;
    align-items: center;
    font-size: 12px;

    .model-svg {
        position: relative;
        margin-top: 5vw;
        height: 60vw;
        visibility: hidden;
        width: 50%;
        position: relative;

        &.active {
            visibility: visible;
        }

        &.left {
            margin-left: 20%;
            // margin-right: 10vw;
        }
        &.right {
            margin-right: 20%;
            // margin-left: 10vw;
        }
        img {
            height: 100%;
        }
        .faild-msg {
            position: absolute;
            // top: 0;
            bottom: 0;
            margin: auto;
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            color: #fff;
            top: -40px;
        }
    }
}
</style>