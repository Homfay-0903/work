<template>
    <!-- 07侧边栏 用户个人信息 -->
    <div class="side-cont">
        <user-avatar :color="this.sideMsg.color" :idenColor="this.sideMsg.idenColor" :iden="this.sideMsg.iden">
            <span slot="side-photo" class="side-photo" @click="uploadImage"></span>
        </user-avatar>
        <mt-actionsheet :actions="actions" v-model="sheetVisible" class="upload-side-sheet"></mt-actionsheet>
        <user-info
            :name="userInfo.name"
            :age="userInfo.age"
            :hei="userInfo.hei"
            :sex="userInfo.sex"
            :pho="userInfo.pho"
            :tel="userInfo.tel"
            :birthday="userInfo.birthday"
            :fatherHeight="userInfo.fatherHeight"
            :motherHeight="userInfo.motherHeight"
            @get-member-info="getMemberInfo"
            v-if="userInfo.pho"
        ></user-info>
        <router-link v-if="appLogin === 1" to="/report" class="go-back" tag="a">
            返回首页
            <i></i>
        </router-link>
    </div>
</template>

<script type="text/ecmascript-6">
import { getMemberInfo } from '@/assets/js/apolloGql.js'
import { hiddenPhone } from '@/assets/js/util.js'
import UserAvatar from '@/components/user/Avatar'
import UserInfo from '@/components/user/Info'
export default {
    components: {
        UserAvatar,
        UserInfo
    },
    data() {
        return {
            appLogin: JSON.parse(sessionStorage.getItem('isAppLogin')),
            sheetVisible: false,
            sideMsg: {
                color: 'color: #fff',
                idenColor: 'color: #fff',
                iden: '教练'
            },
            userInfo: {
                name: '',
                sex: '',
                age: '',
                hei: '',
                pho: '',
                birthday: '',
                motherHeight: '',
                fatherHeight: ''
            },
            actions: [
                {
                    name: '图片选自'
                },
                {
                    name: '拍照',
                    method: function() {}
                },
                {
                    name: '相册',
                    method: function() {}
                }
            ]
        }
    },
    mounted() {
        this.getMemberInfo()
    },
    methods: {
        uploadImage() {
            this.sheetVisible = true
        },
        // 侧边栏 个人中心获取用户信息
        getMemberInfo() {
            this.$apollo
                .query({
                    query: getMemberInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    if (data && data.code === 200) {
                        this.userInfo.name = data.data.nickName ? data.data.nickName : data.data.mobile
                        this.userInfo.age = data.data.age
                        this.userInfo.hei = data.data.height
                        this.userInfo.pho = hiddenPhone(data.data.mobile)
                        this.userInfo.tel = data.data.mobile
                        this.userInfo.birthday = data.data.birthday
                        this.userInfo.fatherHeight = data.data.fatherHeight || 0
                        this.userInfo.motherHeight = data.data.motherHeight || 0
                        this.userInfo.sex = data.data.sex === 1 ? '男' : '女'
                        // 更新缓存中memberInfo数据
                        window.localStorage.setItem('memberInfo', JSON.stringify(data.data))
                        window.localStorage.setItem('userHeight', this.userInfo.hei)
                    }
                })
        }
    }
}
</script>

<style scoped lang="less">
.side-cont {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #262849, #07090f);
    margin: 0 auto;
}
.side-photo {
    position: absolute;
    right: 0;
    margin-right: 15px;
    display: inline-block;
    width: 21px;
    height: 17px;
    background: url(../../../assets/images/sidebar/sidebar_Avatar_icon.png) no-repeat;
    margin-right: 15px;
}
.go-back {
    text-decoration: none;
    color: #ffffff;
    border: 1px solid #00c3d9;
    border-radius: 5px;
    background-color: inherit;
    background-image: linear-gradient(165deg, #00e3c9, #00a4e6), linear-gradient(270deg, #00a4e6, #00e3c9);
    font-size: 16px;
    margin-top: 70px;
    display: inline-block;
    text-align: center;
    height: 35px;
    line-height: 35px;
    padding: 0 30px;
}
</style>
