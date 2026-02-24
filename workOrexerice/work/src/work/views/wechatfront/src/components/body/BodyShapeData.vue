<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-09-19 10:55:21
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-09-20 10:06:03
 * @FilePath: \vr-pro3-wechat-frontend\src\components\body\BodyShapeData.vue
 * @Description:
-->
<template>
    <div class="bg">
        <p class="title">您的体型评估结果</p>
        <div class="content">
            <div :id="`${index}`" :key="index" v-for="(item, index) in showList">
                <div class="content-detail-bg">
                    <img :src="item.icon" alt width="18" height="18"/>
                    <div class="content-detail">
                        <p class="content-title">{{ item.title }}</p>
                        <p class="content-bottom">{{ item.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import conclusionImg from '@/assets/images/conclusion@3x.png'
import riskImg from '@/assets/images/risk@3x.png'

export default {
    props: {
        bodyShape: Object
    },
    computed: {
        showList() {
            const list = [{
                icon: conclusionImg,
                title: this.bodyShape.shape,
                content: this.bodyShape.description
            }]
            if (this.bodyShape.risk !== '') {
                list.push({
                    icon: riskImg,
                    title: '风险',
                    content: this.bodyShape.risk
                })
            }
            return list
        }
    },
}
</script>
<style lang="less" scoped>
    .bg {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .title{
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 22px;
            margin-left: 25px;
        }
        .content{
            background: #1D1F34;
            border-radius: 4px;
            margin: 12px 15px 24px 15px;
            padding-bottom: 16px;
            .content-detail-bg {
                display: flex;
                margin: 16px 16px 0px 10px;
                flex-direction: row;
                .content-detail {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin-left: 7px;
                    .content-title{
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 20px;
                    }
                    .content-bottom{
                        margin-top: 4px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 17px;
                        text-align: left;
                    }
                }

            }
        }
    }
</style>
