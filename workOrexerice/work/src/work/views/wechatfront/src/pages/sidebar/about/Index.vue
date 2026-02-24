<template>
    <div class="about-list">
        <!-- 关于我们 -->
        <div class="visbody-fit">
            <span v-if="isShowLogo" class="visbody-logo"></span>
            <div>
                <span class="version-number">当前版本 V3.4.1</span>
            </div>
        </div>
        <div class="notice-cont">
            <div class="notice-body">
                <!-- <router-link to="" class="router-link">
                    <div class="visbody-public">
                        <div>维塑公众号</div>
                        <div><span>维塑</span><span class="about-link-icon"></span></div>
                    </div>
                </router-link>
                <router-link to="" class="router-link">
                    <div class="visbody-public">
                        <div>官方微博</div>
                        <div><span>VisbodyFit</span><span class="about-link-icon"></span></div>
                    </div>
                </router-link>-->
                <router-link to="/notice/list" class="router-link">
                    <div class="visbody-public">
                        <div>
                            公告
                            <span class="unread-point" v-if="unreadNotice"></span>
                        </div>
                        <div>
                            <span></span>
                            <span class="about-link-icon"></span>
                        </div>
                    </div>
                </router-link>

                <!-- <router-link to="" class="router-link">
                    <div class="visbody-public">
                        <div>功能介绍

                        </div>
                        <div><span></span><span class="about-link-icon"></span></div>
                    </div>
                </router-link>-->
            </div>
        </div>
        <div class="bottom-rule">
            阅读
            <router-link to="/about/rule" class="font-rule">《用户使用协议》</router-link>和
            <router-link to="/about/secret" class="font-rule">《用户隐私协议》</router-link>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import '@/assets/styles/meui/about.less'
import { findAppNoticeList } from '@/assets/js/apolloGql.js'
import { clone } from '@/assets/js/util.js'
import { showLogo } from '@/types/device.js'
export default {
    data() {
        return {
            // 消息列表
            formDate: {
                pageNumber: 1,
                pageSize: 10
            },
            // 未读
            unreadNotice: false,
            isShowLogo: showLogo()
        }
    },
    mounted() {
        this.findAppNoticeList()
    },
    methods: {
        findAppNoticeList() {
            // 进行取值，所以此时不进行再次获取
            this.dropDown = !this.dropDown
            this.$apollo
                .query({
                    query: findAppNoticeList,
                    variables: this.formDate
                })
                .then(res => {
                    const data = clone(res.data.findAppNoticeList)
                    console.log(data)
                    this.unreadNotice = data.data.find(ele => {
                        return ele.readState === 0
                    })
                })
        }
    }
}
</script>

<style scoped lang="less">
.font-rule {
    color: #4a90e2;
    border: none;
    text-decoration: none;
}
.bottom-rule {
    position: absolute;
    bottom: 30px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    line-height: 17px;
}
.router-link {
    border: none;
    margin-top: 2px;
    background: rgba(255, 255, 255, 0.05);
    padding: 0 15px;
    border-radius: 6px;
    width: 100%;
}
.about-list {
    width: 100%;
    height: 100%;
    background: linear-gradient(top, #242646, #07090f);
    font-size: 14px;
    color: #fff;
    position: relative;
}
.visbody-fit {
    width: 100%;
    padding: 90px 0 60px;
    margin: 0 auto;
}
.visbody-logo {
    display: inline-block;
    width: 188px;
    height: 18px;
    background: url(../../../assets/images/sidebar/about/vf_logo.svg) no-repeat;
    background-size: cover;
    margin-bottom: 10px;
}
.version-number {
    font-size: 12px;
    color: #fff;
}
.notice-cont {
    padding: 0 15px;
    min-height: 50px;
}
.notice-body {
    width: 100%;
    border-radius: 6px;
    overflow: hiddle;
    min-height: 100px;
}
.visbody-public {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.about-link-icon {
    display: inline-block;
    width: 8px;
    height: 14px;
    margin-left: 12px;
    background: url(../../../assets/images/sidebar/about/edit_icon@2x.png) no-repeat;
    background-size: cover;
    vertical-align: middle;
    margin-top: -2px;
}
.unread-point {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: red;
    border-radius: 50%;
    position: relative;
    top: -7px;
    left: -6px;
}
</style>
