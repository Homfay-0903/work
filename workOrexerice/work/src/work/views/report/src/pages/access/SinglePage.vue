<template>
    <!-- 公众号接入 -->
    <div class="page-access scrollbar">
        <div class="content-wrapper">
            <h3>公众号接入</h3>
            <p>维塑报告接入客户公众号显示（无需开发）</p>
            <div class="access-picture">
                <div class="item">
                    <img src="@/assets/images/public/public_image_f@2x.png" alt="公众号对接" />
                    <p>进入公众号 → 找到测量报告菜单</p>
                </div>
                <div class="item">
                    <img src="@/assets/images/public/Association@2x.png" alt="公众号对接" />
                </div>
                <div class="item">
                    <img src="@/assets/images/public/public_image_s@2x.png" alt="公众号对接" />
                    <p>通过菜单直接进入到维塑报告页面</p>
                </div>
            </div>
            <el-button type="primary" round @click="nextStep()">接入设置</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        nextStep() {
            this.$router.push({
                path: '/access/wechat'
            })
        }
    }
}
</script>
<style lang="less" scoped>
.page-access {
    display: flex;
    height: 100%;
    width: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;

    h3 {
        font-size: 26px;
        font-weight: normal;
        margin-bottom: 20px;

        ~ p {
            margin-bottom: 50px;
        }
    }

    .access-picture {
        .item {
            display: inline-block;
            vertical-align: middle;
            img {
                width: 120px;
                height: auto;
            }
        }
        margin-bottom: 10px;
    }
    button {
        margin-top: 50px;
    }
}
</style>

