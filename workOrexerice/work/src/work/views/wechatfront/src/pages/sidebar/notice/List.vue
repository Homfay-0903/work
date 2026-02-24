<template>
    <!-- 消息列表 -->
    <div class="about-nitice-list">
        <div class="nitice-list-inner" @scroll="dropdownScroll" ref="scrollView">
            <ul class="nitice-inner-ul">
                <li
                    class="nitice-inner-li"
                    v-for="(n, index) in newsList"
                    :key="index"
                    @click="[jumpDetail(n.id), addAppNoticeRead(n)]"
                >
                    <h3 class="nitice-inner-h3">
                        <span class="nitice-inner-title-box">
                            <span :class="['nitice-inner-icon', n.readState === 1 ? 'nitice-inner-icon-active' : '']"></span>
                            <span class="nitice-inner-title" v-if="n.title.length <= 16">{{n.title}}</span>
                            <span class="nitice-inner-title" v-else-if="n.title.length > 16">
                                {{n.title.substring(0, 16)}}
                                <br />
                                {{n.title.substring(16)}}
                            </span>
                        </span>
                        <span class="nitice-inner-time">{{n.sendTime}}</span>
                    </h3>
                    <p class="nitice-inner-content" v-if="n.intro.length > 49">{{n.intro.substring(0, 49)}}...</p>
                    <p class="nitice-inner-content" v-if="n.intro.length <= 49">{{n.intro}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { findAppNoticeList, addAppNoticeRead } from '@/assets/js/apolloGql.js'
import { formatTime } from '@/assets/js/util.js'
import InfiniteLoading from 'vue-infinite-loading'
export default {
    components: {
        InfiniteLoading
    },
    data() {
        return {
            cont:
                '公共信息内容，比如维塑大卖，挣它个两三亿，或者大卖几万台，更或者大家都加薪，或者，更或者，更或者，还可以再复制一遍',
            title: '公告信息公告信息公告信息公告信息公告',
            // 消息列表
            formDate: {
                pageNumber: 1,
                pageSize: 10
            },
            // 消息列表
            newsList: [],
            dropDown: true
        }
    },
    mounted() {
        this.findAppNoticeList()
        this.$refs.scrollView.addEventListener('scroll', this.dropdownScroll)
    },
    methods: {
        findAppNoticeList() {
            // 进行取值，所以此时不进行再次获取
            this.dropDown = !this.dropDown
            this.$apollo
                .query({
                    query: findAppNoticeList,
                    variables: this.formDate,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const newsCode = res.data.findAppNoticeList.code
                    if (newsCode === 200) {
                        // 这是消息列表
                        const data = res.data.findAppNoticeList.data
                        // 读取条数
                        this.lastDateLength = data.length
                        // 深拷贝
                        const newsList = JSON.parse(JSON.stringify(data))
                        // 转换日期格式
                        newsList.forEach(item => {
                            item.sendTime = formatTime(new Date(item.sendTime * 1000))
                        })
                        // 组合前后两次获取
                        this.newsList.push.apply(this.newsList, newsList)
                        this.dropDown = !this.dropDown
                    }
                })
        },
        // 滚动事件
        dropdownScroll(e) {
            let scrollTop = e.target.scrollTop
            let scrollHeight = e.target.scrollHeight
            let clientHeight = e.target.clientHeight
            const sumHeight = scrollTop + clientHeight
            if (sumHeight === scrollHeight) {
                if (this.formDate.pageNumber >= 1 && this.lastDateLength === this.formDate.pageSize) {
                    if (this.dropDown) {
                        // 假如上次取值没有结束那么Page不加，如果取值结束那么page++
                        ++this.formDate.pageNumber
                        this.findAppNoticeList()
                    }
                }
            }
        },
        // 消息已读
        addAppNoticeRead(n) {
            if (n.readState === 0) {
                this.$apollo
                    .mutate({
                        mutation: addAppNoticeRead,
                        variables: {
                            noticeId: n.id
                        }
                    })
                    .then(res => {
                        const code = res.data.addAppNoticeRead.code
                        if (code === 200) {
                            n.readState = 1
                        }
                    })
            }
        },
        // 跳转到公告详情
        jumpDetail(id) {
            const noticeQuery = {
                id: id,
                pageNumber: this.formDate.pageNumber,
                pageSize: this.formDate.pageSize
            }
            this.$router.push({
                path: '/notice/info',
                query: noticeQuery
            })
        }
    }
}
</script>

<style scoped lang="less">
.about-nitice-list {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #262849, #07090f);
    font-size: 14px;
    color: #fff;
    display: flex;
    flex-direction: column;
}
.nitice-list-inner {
    flex: 1;
    overflow-y: scroll;
    padding: 10px 15px;
}
.nitice-inner-li {
    list-style: none;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
span {
    display: inline-block;
}
.nitice-inner-h3 {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}
.nitice-inner-icon {
    width: 7px;
    height: 7px;
    background: red;
    border-radius: 50%;
    margin-right: 5px;
    vertical-align: middle;
    margin-top: -2px;
}
.nitice-inner-icon-active {
    display: none;
}
.nitice-inner-title {
    font-size: 16px;
    font-weight: 500;
    vertical-align: middle;
    margin-top: -2px;
    text-align: left;
}
.nitice-inner-time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    align-self: flex-end;
}
.nitice-inner-content {
    width: 90%;
    text-align: justify;
    font-size: 12px;
    line-height: 18px;
}
</style>