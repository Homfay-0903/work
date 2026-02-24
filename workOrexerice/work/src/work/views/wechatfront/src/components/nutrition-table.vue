<template>
    <div class="body-table tbody-line">
        <table border="1" cellspacing="0" cellpadding="0">
            <thead v-if="title">
                <tr>
                    <th style="border: 1px solid #009FE8FF;">
                        <div class="content-box">
                            <span class="top-title">食物</span>
                            <span class="top-title">{{title}}</span>
                        </div>
                    </th>
                        <th style="border: 1px solid #009FE8FF;">
                            <div class="content-box">
                                <span class="top-title">食物</span>
                                <span class="top-title">{{title}}</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                        <tr v-for="ide in showItemLength" :key="ide">
                            <td style="border: 1px solid #CED7E0FF;">
                                <div class="content-box">
                                    <span class="top-title">{{ contents[(ide-1)*2].title }}</span>
                                    <span class="top-title top-title-style">{{contents[(ide-1)*2].value}}</span>
                                </div>
                            </td>

                            <td v-if="(ide-1)*2+1 < contents.length" style="border: 1px solid #CED7E0FF;">
                                <div class="content-box">
                                    <span class="top-title">{{ contents[(ide-1)*2+1].title }}</span>
                                    <span class="top-title top-title-style">{{contents[(ide-1)*2+1].value}}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: 'NutritionTable',
    props: {
        title: String,
        contents: Array
    },
    computed: {
        showItemLength() {
            console.log(`当前数组长度${Math.ceil(this.contents.length / 2)}`)
            return Math.ceil(this.contents.length / 2)
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
    .content-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0 10px;
        .top-title {
            font-family: OPPOSans, OPPOSans;
            font-weight: normal;
            font-size: 14px;
            color: #333;
            line-height: 18px;
            text-align: left;
            font-style: normal;
        }
        .top-title-style{
            color: #5698F5;;
        }
    }

}
</style>
