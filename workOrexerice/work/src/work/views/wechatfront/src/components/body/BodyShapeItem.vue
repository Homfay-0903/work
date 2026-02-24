<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-09-19 11:29:53
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-09-25 11:30:22
 * @FilePath: \vr-pro3-wechat-frontend\src\components\body\BodyShapeItem.vue
 * @Description:
-->
<template>
    <div class="bg">
        <p class="title">体脂率</p>
        <div class="grid-container">
            <div class="vertical-axis">
                <div :id="`${index}`" :key="index" v-for="(item, index) in vColors">
                    <div class="vertical-axis-item">
                        <p>{{ item.title }}</p>
                        <div class="vertical-content" :style="{background: item.color}"></div>
                    </div>
                </div>
            </div>
            <body-shape-grid :row-index="rowIndex" :col-index="colIndex"></body-shape-grid>
        </div>
        <div class="horizontal">
            <div class="horizontal-axis">
                <div :id="`${index}`" :key="index" v-for="(item, index) in hColors">
                    <div class="horizontal-axis-item">
                        <div class="horizontal-content" :style="{background: item.color}"></div>
                        <p>{{ item.title }}</p>
                    </div>
                </div>
            </div>
            <span>BMI</span>
        </div>
    </div>
</template>
<script>
import BodyShapeGrid from '@/components/common/BodyShapeGrid.vue'
export default {
    components: {
        BodyShapeGrid
    },
    props: {
        bodyShape: Object
    },
    data() {
        return {
            // 横向颜色
            hColors: [{
                color: '#9E38D2',
                title: '偏低'
            }, {
                color: '#3868D2',
                title: '标准'
            }, {
                color: '#38D275',
                title: '肥胖（1度）'
            }, {
                color: '#EEA05F',
                title: '肥胖（2度）'
            }],
            // 纵向颜色
            vColors: [{
                color: '#EEA05F',
                title: '高'
            }, {
                color: '#38D275',
                title: '偏高'
            }, {
                color: '#3868D2',
                title: '标准'
            }, {
                color: '#6538D2',
                title: '偏低'
            }, {
                color: '#9E38D2',
                title: '低'
            }]
        }
    },
    computed: {
        rowIndex() {
            const index = this.vColors.findIndex((item) => {
                return item.title === this.bodyShape.column
            })
            console.log(`传入参数${this.bodyShape.column} ${index}`)
            return index > -1 ? index + 1 : index
        },
        colIndex() {
            const index = this.hColors.findIndex((item) => {
                return item.title === this.bodyShape.row
            })
            console.log(`传入参数${this.bodyShape.row} ${index}`)
            return index > -1 ? index + 1 : index
        }
    }
}
</script>
<style lang="less" scoped>
.bg {
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 44px;
    align-items: flex-start;
    background: url('../../assets/images/body-shape/grid_line.png') no-repeat;
    background-size: 100% 100%;
    .title{
        margin-top: 33px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
    }
    .grid-container{
        display: flex;
        flex-direction: row;
    }
    .vertical-axis {
        display: flex;
        flex-direction: column;
        .vertical-axis-item{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 4px;
            p {
                width: 8px;
                font-size: 8px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #BABAC7;
                line-height: 15px;
            }
            .vertical-content{
                margin-left: 7px;
                width: 2px;
                height: 45px;
            }
        }
    }
    .horizontal{
        display: flex;
        flex-direction: row;
        span{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 20px;
            margin-right: 8px;
        }
    }
    .horizontal-axis{
        display: flex;
        flex-direction: row;
        margin-top: 4px;
        margin-left: 21px;
        .horizontal-axis-item{
            display: flex;
            flex-direction: column;
           align-items: center;
            p {
                font-size: 8px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #BABAC7;
                line-height: 9px;
                margin-top: 5px;
            }
            .horizontal-content{
                margin-right: 4px;
                height: 2px;
                width: 58px;
            }
        }
    }
}
</style>
