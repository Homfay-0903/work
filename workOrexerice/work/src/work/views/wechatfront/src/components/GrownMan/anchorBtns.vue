<template>
    <div class="anchor">
        <div class="lineBorder"></div>
        <div class="btns">
            <a href="#page1">
                <img src="../../assets/image/spine/handleIcon.png" alt="">
                <span>结构异常评估</span>
            </a>
            <a href="#page2">
                <img src="../../assets/image/spine/handleIcon.png" alt="">
                <span>疼痛风险评估</span>
            </a>
        </div>
    </div>
</template>

<script>

</script>

<style lang="less" scoped>
.anchor {
    width: 375px;
    height: 64px;
    position: fixed;
    background: #242D4F;
    border-radius: 0px 0px 0px 0px;
    left: 0;
    bottom: 0;

    // display: none;
    .lineBorder {
        width: 375px;
        height: 1px;
        background: linear-gradient(to right, #00E3C9 0%, #009FE8 100%);
    }

    .btns {
        width: 375px;
        height: 63px;
        display: flex;
        align-items: center;
        justify-content: center;

        a {
            width: 156px;
            height: 36px;
            background: linear-gradient(to bottom, #01E0CA 0%, #019FE8 100%);
            border-radius: 2px 2px 2px 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #FFFFFF;

            &:first-child {
                margin-right: 10px;
            }

            img {
                width: 16px;
                height: 16px;
                margin-right: 6px;
            }
        }
    }

}
</style>