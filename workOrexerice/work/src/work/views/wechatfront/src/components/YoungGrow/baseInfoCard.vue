<template>
    <div class="cardBox">
        <p class="cardName">李强</p>
        <div class="cardInfo">
            <div class="cardItem">
                <p class="cardItemTitle"><img class="cardIcon" src="../../assets/image/spine/sex.png" alt=""> 性别</p>
                <p class="cardItemValue">男</p>
            </div>
            <div class="cardItem">
                <p class="cardItemTitle"><img class="cardIcon" src="../../assets/image/spine/birthday.png" alt=""> 年龄
                </p>
                <p class="cardItemValue">35岁</p>
            </div>
            <div class="cardItem">
                <p class="cardItemTitle"><img class="cardIcon" src="../../assets/image/spine/calendar.png" alt=""> 评估日期
                </p>
                <p class="cardItemValue">2025.06.18</p>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style lang="less" scoped>
.cardBox {
    margin: 18px auto;
    width: 351px;
    height: 94px;
    background: linear-gradient(126deg, #1D1E3B 0%, rgba(16, 38, 80, 0.95) 100%);
    border-radius: 6px;
    border: 1px solid #63A5C1;
    color: #fff;

    // border-image: url('../../assets/svg/border.svg')  1 repeat;
    .cardName {
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        padding: 9px 16px 16px;
    }

    .cardInfo {
        display: flex;
        justify-content: space-between;
        text-align: center;
        padding: 0 35px;

        .cardItemTitle {
            font-weight: 400;
            font-size: 12px;
            color: #8AA3BE;
            line-height: 14px;

            .cardIcon {
                width: 16px;
                height: 16px;
                margin-right: 2px;
                vertical-align: sub;
            }
        }

        .cardItemValue {
            margin-top: 8px;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 14px;
        }
    }
}
</style>