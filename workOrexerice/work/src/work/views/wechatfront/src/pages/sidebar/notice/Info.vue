<template>
    <!-- 消息详情 -->
    <div class="visbody-notice">
        <div class="notice-title">
            <div class="title-border">
                <p class="notice-name">{{notice.title}}</p>
                <p class="notice-time">{{notice.sendTime}}</p>
            </div>
        </div>
        <div class="notice-cont-text">{{notice.content}}</div>
    </div>
</template>

<script type="text/ecmascript-6">
import { findAppNoticeList } from '@/assets/js/apolloGql.js'
import { formatTime } from '@/assets/js/util.js'
export default {
    data() {
        return {
            notice: {}
        }
    },
    mounted() {
        this.findAppNoticeList()
    },
    methods: {
        findAppNoticeList() {
            const formDate = {
                pageNumber: this.$route.query.pageNumber,
                pageSize: this.$route.query.pageSize
            }
            // const size = this.$route.query.length + 1;
            const id = Number(this.$route.query.id)
            this.$apollo
                .query({
                    query: findAppNoticeList,
                    variables: formDate
                })
                .then(res => {
                    const newsCode = res.data.findAppNoticeList.code
                    if (newsCode === 200) {
                        // 这是消息列表
                        const data = res.data.findAppNoticeList.data
                        data.forEach(element => {
                            if (element.id === id) {
                                this.notice = element
                                // 深拷贝
                                this.notice = JSON.parse(JSON.stringify(this.notice))
                                this.notice.sendTime = formatTime(new Date(this.notice.sendTime * 1000))
                            }
                        })
                    }
                })
        }
    }
}
</script>

<style scoped lang="less">
.visbody-notice {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #262849, #07090f);
    font-size: 14px;
    color: #fff;
}
.notice-title {
    padding: 0 15px;
}
.notice-name {
    font-size: 17px;
    margin-bottom: 5px;
}
.notice-time {
    font-size: 12px;
    color: #999999;
}
.title-border {
    padding: 15px 0;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
}
.notice-cont-text {
    padding: 15px 20px;
    text-align: justify;
    line-height: 1.71;
}
</style>
