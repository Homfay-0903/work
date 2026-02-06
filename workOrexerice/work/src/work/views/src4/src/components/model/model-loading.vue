<template>
    <div class="model-loading">
        <div class="loading-content">
            <div class="dot-loading">
                <i></i>
                <i></i>
                <i></i>
            </div>
            <p>模型加载中，请稍等…</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
.model-loading {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    z-index: 10;
    background: #fff;
    .loading-content {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .dot-loading {
        i {
            position: relative;
            display: inline-block;
            width: 10px;
            height: 10px;
            will-change: transform;
            margin-right: 6px;
            &:before {
                position: absolute;
                display: block;
                content: '';
                width: 10px;
                height: 10px;
                border-radius: 100%;
                background-color: #0770cd;
            }
            &:first-child:before {
                animation: bubble 1.3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
            }
            &:nth-child(2):before {
                animation: bubble 1.3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
                animation-delay: 0.2s;
            }
            &:last-child:before {
                animation: bubble 1.3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
                animation-delay: 0.4s;
            }
        }
    }

    p {
        color: #4a4a4a;
        margin-top: 40px;
    }
}
@keyframes bubble {
    0% {
        transform: scale(0.2);
        opacity: 0.2;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.2);
        opacity: 0.2;
    }
}
</style>
