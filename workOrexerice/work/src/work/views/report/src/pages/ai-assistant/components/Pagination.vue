<template>
    <div class="pagination">
        <span>{{ num }}</span>
    </div>
</template>
<script>
export default {
    name: 'Pagination',
    props: {
        // 页码下标
        num: {
            type: Number,
            default: 1
        }
    },
}
</script>
<style lang="less" scoped>
.pagination {
    position: absolute;
    right: 89px;
    bottom: 47px;
    font-size: 17px;
    font-family: OPPOSans-R, OPPOSans;
    font-weight: normal;
    color: #8E8E93;
    line-height: 30px;
}
</style>
