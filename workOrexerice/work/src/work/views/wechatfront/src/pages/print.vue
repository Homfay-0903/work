<template>
    <div class="route-jump-cloth">
        {{ message }}
        <span class="spot spot1">.</span>
        <span class="spot spot2">.</span>
        <span class="spot spot3">.</span>
    </div>
</template>

<script type="text/ecmascript-6">
import { userLogin } from '@/assets/js/apolloGql.js'
import { clone } from '@/assets/js/util.js'
import { reportUrl } from '@/assets/js/config.js'
export default {
    components: {},
    data() {
        return {
            printInfo: {},
            token: '',
            message: ''
        }
    },
    beforeMount() {
        this.getUrlSearch()
    },
    methods: {
        // 获取url
        getUrlSearch() {
            let urls = window.location.search.split('?')[1]
            let printInfo = {}
            if (urls) {
                let url = urls.split('&')
                url.forEach(el => {
                    let key = el.split('=')[0]
                    let val = el.substring(el.indexOf('=') + 1)
                    printInfo[key] = decodeURIComponent(val)
                })

                this.printInfo = clone(printInfo)
                if (this.printInfo.email) {
                    this.message = '请稍候'
                    this.userLogin()
                }
            } else {
                this.message = '请先登录'
                setTimeout(() => {
                    window.location.href = reportUrl
                }, 2000)
            }
        },
        // 获取token
        async userLogin() {
            await this.$apollo
                .query({
                    query: userLogin,
                    variables: {
                        email: this.printInfo.email,
                        password: this.printInfo.password
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = clone(res.data.userLogin)
                    this.token = data.bearerToken.token
                    if (data.code === 200) {
                        window.localStorage.setItem('userToken', JSON.stringify(data.bearerToken))
                        // window.location.href = `http://localhost:8080/report?scanId=${this.printInfo.scanId}&token=${this.token}#/report`;
                        // 添加是否是单机版 0-false,1-true
                        const local = JSON.parse(this.printInfo.isPrivate || 'false') ? 1 : 0
                        window.location.href = `/visbody-report/index.html?scanId=${this.printInfo.scanId}&token=${this.token}&isPrivate=${local}#/report`
                    }
                })
                .catch(res => {
                    this.message = '用户登录错误, 请重新操作'
                })
        }
    }
}
</script>

<style scoped lang="less">
.route-jump-cloth {
    width: 100%;
    height: 50px;
    font-size: 30px;
    text-align: center;
    position: fixed;
    top: calc(50% - 25px);
    left: 0;
    color: #333;
    letter-spacing: 7px;
    .spot {
        display: inline-block;
        width: 15px;
        height: 10px;
        position: relative;
        top: 3px;
    }

    .spot1 {
        animation: spotjump 1s linear infinite;
    }

    .spot2 {
        animation: spotjump 1s linear 0.3s infinite;
    }

    .spot3 {
        animation: spotjump 1s linear 0.6s infinite;
    }
}

@keyframes spotjump {
    0% {
        top: 3px;
    }
    50% {
        top: -8px;
    }
    100% {
        top: 3px;
    }
}
</style>
