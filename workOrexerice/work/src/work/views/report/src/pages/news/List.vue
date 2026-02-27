<template>
    <div class="news-list scrollbar">
        <div class="news-content">
            <div
                :class="['news-item', active.id === news.id ? 'news-item-active' : '']"
                v-for="(news, index) in newsList"
                :key="index"
                @click="[prpopNews(news), addCmsMessageRead(news)]"
            >
                <h1 class="news-title">
                    <span>
                        <span class="new-dot" v-if="news.readState === 0"></span>
                        {{news.title}}
                    </span>
                    <span class="news-date">{{news.sendTime}}</span>
                </h1>
                <p class="news-text" v-if="news.intro.length <= 187">{{news.intro}}</p>
                <p class="news-text" v-else-if="news.intro.length > 187">{{news.intro.substring(0, 187)}}...</p>
            </div>

            <!-- 分页 当前扫描列表不为空或只有1页时显示分页 -->
            <el-pagination
                v-if="newsList.length !== 0 && totalItems > take"
                background
                layout="prev, pager, next, total"
                :current-page="page"
                :page-size="take"
                :total="totalItems"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" width="60%">
            <div class="new-info">
                <h1 class="news-title">{{active.title}}</h1>
                <p class="news-date">{{active.sendTime}}</p>
            </div>
            <div class="news-text" v-html="active.content"></div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { findCmsMessageList, addCmsMessageRead } from '@/assets/js/apolloGql.js'
import { formatDate } from '@/assets/js/util.js'
export default {
    components: {},
    data() {
        return {
            dialogVisible: false,
            // 消息列表
            newsList: [],
            // 动态class
            active: '',
            // 分页信息
            take: 20,
            page: 1,
            totalItems: 0,
            // 未读消息
            unRead: 0
        }
    },
    mounted() {
        this.findCmsMessageList()
    },
    methods: {
        // 弹出框信息
        prpopNews(news) {
            this.active = news
            this.dialogVisible = true
        },
        // 分页改变
        handlePageChange(val) {
            this.page = val
            this.findCmsMessageList()
        },
        // 消息列表接口
        async findCmsMessageList() {
            await this.$apollo
                .query({
                    query: findCmsMessageList,
                    variables: {
                        page: this.page,
                        pageSize: this.take
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const newsCode = res.data.findCmsMessageList.code
                    if (newsCode === 200) {
                        // 这是消息列表
                        const data = res.data.findCmsMessageList.data
                        // 这是未读条数
                        this.unRead = data.unreadSum
                        this.totalItems = data.count
                        // 组合前后两次获取
                        this.newsList = data.cmsMessageArr
                        // 深拷贝
                        this.newsList = JSON.parse(JSON.stringify(this.newsList))
                        // 转换日期格式
                        this.newsList.forEach(item => {
                            item.sendTime = formatDate(new Date(item.sendTime * 1000))
                        })
                    } else if (newsCode === 500) {
                        console.log('这是报500的错:', res.data.findCmsMessageList.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 添加消息已读接口
        async addCmsMessageRead(news) {
            if (news.readState === 0) {
                this.$apollo
                    .mutate({
                        mutation: addCmsMessageRead,
                        variables: {
                            messageId: news.id
                        }
                    })
                    .then(res => {
                        news.readState = 1
                        this.unRead -= 1
                        this.$emit('updateUnReadCount', this.unRead)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }
}
</script>

<style scoped lang="less">
.news-list {
    width: 100%;
    height: 100%;
    padding: 60px 0;
    overflow-y: scroll;
    .news-content {
        width: 94%;
        margin: 0 auto;

        .news-item {
            height: 120px;
            cursor: pointer;
            background-color: #ffffff;
            padding: 24px 42px 30px 52px;
            text-align: left;
            margin-bottom: 40px;
            transition: all 0.3s;

            .news-title {
                font-size: 24px;
                font-weight: 500;
                line-height: 1.1;
                letter-spacing: 0.3px;
                color: #172b4d;
                padding-bottom: 16px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
            }

            .news-date {
                font-size: 16px;
                color: #8c8c8c;
            }

            .news-text {
                width: 75%;
                line-height: 1.3;
                font-size: 16px;
                text-align: justify;
                color: #8c8c8c;
            }

            .new-dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ff5230;
                border: solid 1px #ffffff;
                vertical-align: middle;
                margin-top: -2px;
                margin-right: 12px;
            }

            &:hover {
                -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);
                box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);
            }
        }

        .news-item-active {
            -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);
            box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.14);
        }

        .el-dialog__wrapper::-webkit-scrollbar {
            width: 13px;
        }

        .el-dialog__wrapper::-webkit-scrollbar-thumb {
            border: 3px solid rgba(0, 0, 0, 0);
            background-clip: padding-box;
            border-radius: 7px;
            min-height: 84px;
            background-color: rgba(0, 0, 0, 0.4);
        }

        .el-dialog__wrapper::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.5);
        }

        .el-dialog__wrapper::-webkit-scrollbar-track {
            background-color: rgba(248, 250, 252, 0);
        }

        .el-dialog__wrapper::-webkit-scrollbar-track:hover {
            background-color: rgba(248, 250, 252, 1);
        }
    }

    /deep/.el-dialog {
        text-align: left;

        .el-dialog__body {
            padding: 30px 60px 60px 60px;
        }

        .news-title {
            font-size: 29px;
            font-weight: 500;
            line-height: 1.1;
            letter-spacing: 0.3px;
            color: #172b4d;
            padding-bottom: 16px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
        }

        .news-date {
            font-size: 16px;
            color: #8c8c8c;
            margin-bottom: 30px;
        }
    }
}

@media screen and (min-width: 1025px) and (max-width: 1366px) {
    .news-list {
        padding-top: 48px;
    }
}
</style>
