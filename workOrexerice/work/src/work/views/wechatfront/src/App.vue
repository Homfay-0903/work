<!--
 * @Description:
 * @Author: fanyunbo
 * @Date: 2022-02-11 10:31:42
 * @LastEditTime: 2026-01-06 10:52:23
 * @LastEditors: liutq
 * @Reference:
-->
<template>
    <div id="app">
        <router-view v-if="isAlive" />
    </div>
</template>

<script>
export default {
    name: 'App',
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            isAlive: true,
            logShowNum: 7,
            firstLogTouchTime: 0,
        }
    },
    created() {
        console.log('ver:', process.env.VERSION)
        window.localStorage.getItem('logoCloudEnable') === '1' && (document.title = 'Visbody')
    },
    mounted() {
        document.addEventListener('touchend', ev => {
            // this.logShowNum -= 1;
            // let now = Date.now();
            // // document.title = this.logShowNum;
            // if (this.firstLogTouchTime === 0){
            //     this.firstLogTouchTime = now;
            //     return
            // }else if(now - this.firstLogTouchTime > 3000) {
            //     this.firstLogTouchTime = now;
            //     this.logShowNum = 6;
            //     return
            // }
            // if (this.logShowNum > 0) { return }
            // if (now - this.firstLogTouchTime <= 3000 ){ // 距第一次touch事件是否在3秒以内
            //     let logStr = window.sessionStorage.getItem('debugLog') || '无日志';
            //     alert(logStr)
            // }
            // this.logShowNum = 7;
            // this.firstLogTouchTime = 0;
        })
    },
    methods: {
        reload() {
            this.isAlive = false
            this.$nextTick(function() {
                this.isAlive = true
            })
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin-top: 60px; */
    width: 100%;
    height: 100%;
}
.body-thermal-wrapper  {
    padding: 0 10px!important;
}
</style>
