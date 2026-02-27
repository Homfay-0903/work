<!--
 * @Author: Don 18137802527@163.com
 * @Date: 2024-04-18 23:41:36
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2024-04-19 18:52:20
 * @FilePath: \vr-pro3-report-frontend\src\components\diet-table.vue
 * @Description:
-->
<template>
    <div class="body-table tbody-line">
                <table border="1" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr v-for="(item, ide) in diets" :key="ide" style="height: 66px;">
                            <td>
                               <div class="single-cell">
                                    <div class="left-icon">
                                        <img :src="showIcon(ide)" :width="30" style="max-height: 40px; object-fit: contain;">
                                    </div>
                                    <div class="right-content">
                                        <div>
                                            <span class="title">{{ item.title }}</span>
                                            <span class="detail">{{ item.detail }}</span>
                                        </div>
                                        <span class="content">{{ item.content }}</span>
                                    </div>
                               </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
</template>
<script>
export default {
    name: 'DietTable',
    props: {
        diets: Array
    },
    data() {
        return {
            icons: [
                require('../assets/images/nutrition/staple.png'),
                require('../assets/images/nutrition/egg.png'),
                require('../assets/images/nutrition/fruits.png'),
                require('../assets/images/nutrition/vegetable.png'),
                require('../assets/images/nutrition/oils.png'),
                require('../assets/images/nutrition/salt.png'),
                require('../assets/images/nutrition/water.png'),
                require('../assets/images/nutrition/vitamins.png'),
            ]
        }
    },
    methods: {
        showIcon(key) {
            return this.icons[key]
        }
    }
}
</script>
<style scoped lang="less" media="all">
.body-table {
        position: relative;

        .extra-bone {
            position: absolute;
            z-index: 1;
            width: 100%;
            bottom: 0;
            margin: 0;
            color: #5e687b;
            text-align: start;
            text-indent: 14px;
            font-size: 8px;

            &:after {
                position: absolute;
                display: block;
                content: '';
                z-index: -1;
                width: 100%;
                height: 4px;
                bottom: -1px;
                border-top: 1px dashed #b4d1f6;
                border-bottom: 1px dashed #b4d1f6;
                background: #f2f8ff;
            }
        }
        .single-cell {
            display: flex;
            flex-direction: row;
            align-items: center;
            .left-icon {
                margin-left: 14px;
                margin-right: 15px;
                max-height: 52px;
            }
            .right-content{
                margin-top: 8px;
                margin-right: 20px;
                .title {
                    font-family: OPPOSans, OPPOSans;
                    font-weight: normal;
font-size: 14px;
color: #333333;
line-height: 18px;
text-align: left;
font-style: normal;
                    margin-right: 5px;
                }
                .detail {
                    font-family: OPPOSans, OPPOSans;
                    font-weight: normal;
font-size: 14px;
color: #666666;
line-height: 23px;
text-align: left;
font-style: normal;
                }
                .content {
                    font-family: OPPOSans, OPPOSans;
font-weight: normal;
font-size: 14px;
color: #666666;
line-height: 19px;
text-align: left;
font-style: normal;
                }
            }
        }
    }
</style>
