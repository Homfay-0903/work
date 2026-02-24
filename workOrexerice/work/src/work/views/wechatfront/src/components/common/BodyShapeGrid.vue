<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-09-19 11:35:11
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-09-20 13:46:25
 * @FilePath: \vr-pro3-wechat-frontend\src\components\common\BodyShapeGrid.vue
 * @Description:
-->
<template>
    <div class="wrapper">
        <div :class="['gird-item',rowIndex >= 1 && rowIndex < 2 && colIndex >=1 && colIndex < 2 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_1.png" alt />
            <p>虚弱型</p>
        </div>
        <div :class="['gird-item',rowIndex >= 1 && rowIndex < 2 && colIndex >=2 && colIndex < 3 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_2.png" alt />
            <p>隐形肥胖</p>
        </div>
        <div :class="['gird-item',rowIndex >= 1 && rowIndex < 2 && colIndex >=3 && colIndex < 4 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_3.png" alt />
            <p>肥胖型</p>
        </div>
        <div :class="['gird-item',rowIndex >= 1 && rowIndex < 2 && colIndex >=4 && colIndex < 5 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_4.png" alt />
            <p>超体重肥胖</p>
        </div>
        <div :class="['gird-item',rowIndex >= 2 && rowIndex < 3 && colIndex >=1 && colIndex < 2 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_2.png" alt />
            <p>隐形肥胖</p>
        </div>
        <div :class="['gird-item', 'item-1',rowIndex >= 2 && rowIndex < 3 && colIndex >=2 && colIndex < 4 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_5.png" alt />
            <p>偏胖型</p>
        </div>
        <div :class="['gird-item', 'item-2',rowIndex >= 2 && rowIndex < 6 && colIndex >=4 && colIndex < 5 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_6.png" alt />
            <p>肥胖型</p>
        </div>
        <div :class="['gird-item', 'item-3',rowIndex >= 3 && rowIndex < 5 && colIndex >=1 && colIndex < 2 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_7.png" alt />
            <p>偏瘦型</p>
        </div>
        <div :class="['gird-item', 'item-5',rowIndex >= 3 && rowIndex < 4 && colIndex >=2 && colIndex < 4 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_8.png" alt />
            <p>标准型</p>
        </div>
        <div :class="['gird-item', 'item-6',rowIndex >= 4 && rowIndex < 5 && colIndex >=2 && colIndex < 3 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_9.png" alt />
            <p>苗条型</p>
        </div>
        <div :class="['gird-item', 'item-7',rowIndex >= 5 && rowIndex < 6 && colIndex >=1 && colIndex < 2 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_11.png" alt />
            <p>消瘦型</p>
        </div>
        <div :class="['gird-item', 'item-8',rowIndex >= 5 && rowIndex < 6 && colIndex >=2 && colIndex < 3 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_12.png" alt />
            <p>苗条肌肉型</p>
        </div>
        <div :class="['gird-item', 'item-9',rowIndex >= 4 && rowIndex < 6 && colIndex >=3 && colIndex < 4 ? 'select-background' : 'base-background']">
            <img src="@/assets/images/body-shape/body_shape_10.png" alt />
            <p>肌肉型</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        rowIndex: Number,
        colIndex: Number,
    },
    data () {
        return {
            select: true
        }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  width: 248px;
}
.base-background{
    background: rgba(255,255,255,0.08);
}
.select-background{
    background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
    padding: 0 0.01px;  /* 防止文本裁剪异常 */
}
.gird-item{
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
    margin-top: 4px;
    p{
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 14px;
    }
    img {
        width: 11px;
        height: 16px;
    }
}
.item-1{
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 2;
}
.item-2{
    grid-column-start: 4;
    grid-column-end: 5;
    grid-row-start: 2;
    grid-row-end: 6;
}
.item-3{
    grid-row-start: 3;
    grid-row-end: 5;
}
.item-5{
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 3;
    grid-row-end: 4;
}
.item-6{
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 4;
    grid-row-end: 5;
}
.item-7{
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 5;
    grid-row-end: 6;
}
.item-8{
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 5;
    grid-row-end: 6;
}
.item-9{
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 4;
    grid-row-end: 6;
}
</style>
