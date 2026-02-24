<template>
    <div class="model-loading" :class="{'open-overlay': openOverlay}">
        <div class="model-loading-content">
            <div class="icon">
                <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="24px"
                    height="30px"
                    viewBox="0 0 24 30"
                    style="enable-background:new 0 0 50 50;"
                    xml:space="preserve"
                >
                    <rect x="0" y="7.21092" width="4" height="16.5782" fill="#449acd">
                        <animate
                            attributeName="height"
                            attributeType="XML"
                            values="5;21;5"
                            begin="0s"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="y"
                            attributeType="XML"
                            values="13; 5; 13"
                            begin="0s"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    </rect>
                    <rect x="10" y="6.78908" width="4" height="17.4218" fill="#449acd">
                        <animate
                            attributeName="height"
                            attributeType="XML"
                            values="5;21;5"
                            begin="0.15s"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="y"
                            attributeType="XML"
                            values="13; 5; 13"
                            begin="0.15s"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    </rect>
                    <rect x="20" y="10.7891" width="4" height="9.42183" fill="#449acd">
                        <animate
                            attributeName="height"
                            attributeType="XML"
                            values="5;21;5"
                            begin="0.3s"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="y"
                            attributeType="XML"
                            values="13; 5; 13"
                            begin="0.3s"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    </rect>
                </svg>
            </div>
            <span v-if="!loadingType" class="text">模型加载中...</span>
            <span v-if="loadingType" class="text">模型合成中...</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        loadingType: String,
        openOverlay: {
            type: Boolean,
            default: true
        }
    }
}
</script>
<style lang="less" scoped>
.model-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 330px;
    z-index: 2;
    .model-loading-content {
        padding-top: 130px;
    }
    .text {
        padding-left: 10px;
        font-size: 12px;
        color: #fff;
    }
    .icon {
        display: inline-block;
        vertical-align: middle;
    }
    .fl {
        float: left;
    }
}

.open-overlay {
    background-image: linear-gradient(0deg, #05070d 0%, #27294a 100%);
}
</style>
