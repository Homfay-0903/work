<template>
    <div>
        <p class="boxTitle">
            <img :src="require(`@/assets/images/female/young/young${info.type}.png`)" alt="">{{ title }}
        </p>
        <div class="processBox">
            <div class="processBar">
                <div class="processCurBar" :style="{ width: info.left + 'px', background: info.color }">
                    <div :style="{ background: info.color }"></div>
                </div>
            </div>
            <img :src="require(`@/assets/images/female/young/level_${info.level}.png`)" alt="">
            <span><b :style="{color: info.color}">{{ info.source }}</b>分</span>
        </div>
        <div class="processLine">
            <slot></slot>
        </div>
        <div v-if="info.content !== ''" class="tips">
            <span>!</span>
            {{ info.content }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // Info
        info: {
            type: Object,
            default: () => ({
                color: '',
                rank: 0,
                source: 0,
                level: 0,
                left: 0,
                content: '',
            })
        },
        // title
        title: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
        }
    },
    computed: {
    },
}
</script>

<style lang="less" scoped>
.boxTitle {
    img {
        position: relative;
        width: 23px;
        height: 23px;
        left: -5px;
    }

    font-weight: 500;
    font-size: 15px;
    color: #333333;
    display: flex;
    align-items: center;
    padding: 12px 0 0 12px;
}

.processBox {
    width: 382px;
    height: 31px;
    display: flex;
    align-items: center;
    margin-left: 37px;
    margin-top: -4px;

    .processBar {
        width: 298px;
        height: 2px;
        background: #CED7E0;
        position: relative;

        .processCurBar {
            width: 30%;
            height: 2px;
            background-color: #E6B12A;
            position: relative;

            div {
                content: "";
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 4px;
                background-color: #E6B12A;
                right: -3px;
                top: -2px;
            }
        }

    }

    img {
        width: 31px;
        height: 31px;
        margin: 0 3px 0 12px;
    }

    span {
        font-weight: 400;
        font-size: 9px;
        color: #333333;
        display: inline-flex;
        width: 36px;
        justify-content: flex-end;
        align-items: flex-end;

        b {
            font-size: 18px;
            color: #E6B12A;
            margin-right: 2px;
            line-height: 1;
            position: relative;
            bottom: -2px;
        }
    }
}

.processLine {
    width: 298px;
    height: 12px;
    margin-left: 37px;

    .texts {
        margin-top: -9px;
        width: 100%;
        display: flex;
        font-size: 12px;
        line-height: 1;
        justify-content: space-between;
    }
}

.tips {
    height: 33px;
    width: 298px;
    border-top: 1px solid #CED7E0;
    font-size: 12px;
    color: #666;
    margin-left: 37px;
    margin-top: 8px;
    line-height: 31px;

    span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #5698F5;
        text-align: center;
        line-height: 12px;
        padding: 0px;
        color: #fff;
        font-size: 12px;
        border-radius: 50%;
    }
}
</style>