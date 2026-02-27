<!--
 * @Description: 视频广告播放页
 * @Author: Nucleus He
 * @Date: 2025-10-21 14:01:21
-->
<template>
    <div class="customer-ad" @touchstart="backHomePage">
        <video
            id="customer-video"
            class="video-content"
            name="客户广告视频"
            preload="auto"
            :src="videoPath"
            autoplay
            loop
            @loadstart="handleEvent"
            @progress="handleEvent"
            @suspend="handleEvent"
            @abort="handleEvent"
            @error="handleEvent"
            @emptied="handleEvent"
            @stalled="handleEvent"
            @loadedmetadata="handleEvent"
            @loadeddata="handleEvent"
            @canplay="handleEvent"
            @canplaythrough="handleEvent"
            @playing="handleEvent"
            @waiting="handleEvent"
            @seeking="handleEvent"
            @seeked="handleEvent"
            @ended="handleEvent"
            @durationchange="handleEvent"
            @timeupdate="handleEvent"
            @play="handleEvent"
            @pause="handleEvent"
            @ratechange="handleEvent"
            @resize="handleEvent"
            @volumechange="handleEvent"
            controls
        >
            您的浏览器不支持 video 标签。
        </video>
    </div>
</template>

<script>
import AdVideo from '@/util/customAd'

export default {
    name: 'CustomerAd',
    data() {
        return {
            videoPath: ''
        }
    },
    created() {
        document.onkeydown = (event) => {
            if (!event) return
            this.backHomePage()
        }

        this.loadAdVideo()
    },
    mounted() {
        document.onkeyup = (event) => {
            if (!event) return
            this.backHomePage()
        }
    },
    // 离开页面
    beforeDestroy() {
        this.clearListener()
    },

    methods: {
        backHomePage() {
            this.$changeViewPage('Home')
        },

        clearListener() {
            document.onkeydown = null
        },

        loadAdVideo() {
            const adVideoPath = AdVideo.getAdVideo()

            if (adVideoPath) {
                // 如果有本地视频，则使用本地视频
                this.videoPath = adVideoPath
            } else {
                this.backHomePage()
            }
        },
        handleEvent(event) {
            if (event.type === 'timeupdate') return
            window.logger.debug('广告视频播放事件', event.type)
        }
    }
}
</script>

<style lang="less" scoped>
.customer-ad {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.video-content {
    width: 100%;
}
</style>
