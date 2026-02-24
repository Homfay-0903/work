<template>
    <van-row class="headBox" type="flex" justify="space-between" align="center">
        <van-col span="4" justify="center">
            <van-image width="26" height="26" :src="'../assets/image/public/timeIcon.png'"></van-image>
        </van-col>
        <van-col span="16"></van-col>
        <van-col span="4" justify="center">
            <van-image width="26" height="26" :src="'../assets/image/public/menuIcon.png'"></van-image>
        </van-col>
    </van-row>
</template>

<script>
</script>


<style scoped lang="less">
.headBox {
    width: 100%;
    height: 50px;
}

.van-col {
    display: flex;
    justify-content: center;
}
</style>