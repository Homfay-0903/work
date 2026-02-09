<template>
    <div class="setting">
        <div
            :class="active === index ? 'page-size-active' : 'page-size'"
            v-for="(item, index) in data"
            :key="index"
            @touchend="confirmSelection(index)"
        >
            <span class="title">{{ item.size }}</span>
            <img
                :src="require(`@img/setting/${index === pageActive ? 'selected' : 'not_selected'}.svg`)"
                class="icon-right"
                alt
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            data: [
                {
                    size: 'Letter'
                },
                {
                    size: 'Legal'
                },
                {
                    size: 'Executive'
                },
                {
                    size: 'A4'
                }
            ],
            active: 0,
            pageActive: 0
        }
    },
    computed: mapGetters({
        settingInfo: 'settingInfo'
    }),
    created() {
        this.active = this.pageActive = this.settingInfo.pageSize - 1
    },
    methods: {
        confirmSelection(index) {
            this.active = index
            this.setPage(index)
        },
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                if (this.active === 0) {
                    this.active = this.data.length - 1
                } else {
                    this.active--
                }
                // 下
            } else if (btnType === 2) {
                if (this.active === this.data.length - 1) {
                    this.active = 0
                } else {
                    this.active++
                }
                // 确定
            } else if (btnType === 3) {
                this.setPage(this.active)
                // 返回
            } else if (btnType === 7) {
                this.$changeViewPage('PrintSetting')
            }
            if (this.active !== 0) {
                this.$store.commit('CHANGE_PAGE_INFO', {
                    btnList: [
                        {
                            btn: 'select',
                            msg: '选择'
                        },
                        {
                            btn: 'check',
                            msg: '确认'
                        },
                        {
                            btn: 'return',
                            msg: '返回'
                        }
                    ]
                })
            }
        },
        // 设置纸张大小
        setPage(index) {
            this.pageActive = index
            this.$store.commit('CHANGE_SETTING_INFO', {
                pageSize: index + 1
            })
        }
    }
}
</script>

<style lang="less" scoped>
.setting {
    position: absolute;
    top: 432px;
    margin: 0 60px;
    .page-size,
    .page-size-active {
        width: 960px;
        height: 192px;
        background: #333333;
        border-radius: 32px;
        position: relative;
        margin-bottom: 24px;
        .title {
            font-size: 48px;
            font-family: OPPOSansR;
            display: inline-block;
            width: 100%;
            margin: 60px 48px;
            font-weight: normal;
            color: #e7e9f0;
            line-height: 72px;
        }
        .icon-right {
            position: absolute;
            top: 52px;
            right: 48px;
            width: 64px;
            height: 64px;
            transition: all 0.3s;
        }
    }
    .page-size-active {
        background: #104ebb;
        border-radius: 32px;
        border: 2px solid #649cff;
    }
}
</style>
