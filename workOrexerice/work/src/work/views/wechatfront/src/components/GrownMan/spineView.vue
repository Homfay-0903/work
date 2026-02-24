<!--
 * @Description:
 * @Author: fanyunbo
 * @Date: 2025-05-30 15:06:09
 * @LastEditTime: 2025-06-20 14:52:27
 * @LastEditors: liutq
 * @Reference:
-->
<template>
    <div class="cardBox">
        <img class="cardBg" src="../../assets/image/spine/bg1.png" alt="">
        <p class="cardTitle"><span>脊柱结构可视化</span> <span><label>{{textDes}}</label></span> </p>
         <spine-item :massInfo="massInfo" @changeStatus="changeStatus"></spine-item>
        <div class="tipsBox">
            <p><img src="../../assets/image/spine/rotateIcon.png" alt=""><span>拖动旋转视图</span></p>
            <p>*此模型仅供参考，实际评估以专业检测为准</p>
        </div>
    </div>
</template>

<script>
// 脊椎评估
import SpineItem from '../body/new-report/SpineItem.vue'
export default {
    components: {
       SpineItem
    },
    props: {
        massInfo: Object
    },
    data() {
        return {
            textDes: '背面'
        }
    },
      methods: {
        changeStatus(type) {
            // 1 正 2 右侧 3 背 4 左侧
            switch (type) {
                case 1:
                    this.textDes = "正视图"
                    break
                case 4:
                    this.textDes = "右视图"
                    break
                case 3:
                    this.textDes = "后视图"
                    break
                case 2:
                    this.textDes = "左视图"
                    break
            }
        }
    }
}
</script>
<style lang="less" scoped>
.cardBox{
    width: 351px;
    height: 414px;
    margin: 17px auto 18px;
    background: linear-gradient( 126deg, #1D1E3B 0%, rgba(16,38,80,0.95) 100%);
    border-radius: 6px 6px 6px 6px;
    border: 2px solid #3F537C;
    position: relative;
    // border-image: linear-gradient(193deg, rgba(99, 165, 193, 1), rgba(68, 74, 122, 1), rgba(64, 61, 113, 0)) 1 1;
    .cardBg{
        width: 100%;
        height: 434px;
        position: absolute;
        left: 0;
        top: 0;
    }
    .cardTitle{
        display: flex;
        justify-content: space-between;
        padding: 10px 12px;
        span{
            &:first-child{
                font-weight: 500;
                font-size: 16px;
                color: #FFFFFF;
            }
            &:last-child{
                padding: 4px 19px;
                // border: 1px solid rgba(255,255,255,0.5);
                border-radius: 2px;
                label {
                    font-weight: 400;
                    font-size: 14px;
                    background: linear-gradient(to right, #00E3C9, #009FE8);
                    /* 使用带 -webkit- 前缀的属性以确保兼容性 */
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    /* 标准属性 */
                    background-clip: text;
                    color: transparent; /* 确保非 WebKit 浏览器下的颜色透明，可选 */
                    transform-style: preserve-3d; /* 保持3D渲染上下文 */
                    backface-visibility: hidden; /* 隐藏背面避免双重渲染 */
                    -webkit-font-smoothing: antialiased; /* 优化字体抗锯齿 */
                }
            }
        }
    }
    .tipsBox{
        font-weight: 400;
        font-size: 12px;
        color: #8AA3BE;
        position: absolute;
        bottom: 10px;
        left: 14px;
        img{
            width: 24px;
            height: 24px;
            vertical-align: middle;
            margin-right: 4px;
        }
        span{
            vertical-align: middle;
        }
        p:first-child{
            text-align: left;
        }
        p:last-child{
            margin-top: 13px;
        }
    }
}
</style>