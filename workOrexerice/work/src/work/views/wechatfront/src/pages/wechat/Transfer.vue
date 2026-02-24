<template>
    <!-- 公众号迁移提醒 -->
    <div class="transfer">
        <div class="header">
            <h1>维塑3D体型追踪仪</h1>
            <p>为提供更好的服务，体测报告入口已迁移至脂肪管理局公众号，您可根据以下提示继续查看，感谢支持。</p>
        </div>
        <div class="content">
            <img alt="公众号二维码" src="@/assets/images/qrcode.jpg" />
            <p>请长按识别上方二维码</p>
            <p class="tip">关注公众号后查看报告</p>
            <h2>脂肪管理局</h2>
            <p>或搜索公众号名称关注</p>
        </div>
        <div class="footer">
            <p>关注后进入公众号，点击公众号底部菜单栏</p>
            <p>
                <span>「查看报告」</span> 进入报告
            </p>
            <svg height="84" viewBox="0 0 301 84" width="301" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
                    <rect fill="#FFF" height="46" rx="4" stroke="#D7D7DA" width="299" y="36" />
                    <polygon fill="#D8D8D8" points="160.396 67 160.396 75 152.396 75" />
                    <polygon fill="#D8D8D8" points="290 67 290 75 282 75" />
                    <polygon fill="#9B9B9B" points="24 46 27 49 21 49" />
                    <rect
                        fill="#FFF"
                        height="17.5"
                        rx="2"
                        stroke="#979797"
                        stroke-width=".5"
                        width="25.5"
                        x="11.25"
                        y="53.25"
                    />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="7" x="20.5" y="65.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="17.5" y="57.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="17.5" y="61.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="21.5" y="57.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="21.5" y="61.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="25.5" y="57.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="25.5" y="61.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="29.5" y="57.5" />
                    <rect fill="#D8D8D8" height="1" rx=".5" stroke="#979797" width="1" x="29.5" y="61.5" />
                    <text
                        fill="#000"
                        font-family=".PingFangSC-Regular, .PingFang SC"
                        font-size="14.165"
                        letter-spacing=".708"
                    >
                        <tspan x="200" y="66">查看报告</tspan>
                    </text>
                    <text
                        fill="#000"
                        font-family=".PingFangSC-Regular, .PingFang SC"
                        font-size="14.165"
                        letter-spacing=".708"
                    >
                        <tspan x="76.396" y="66">文章目录</tspan>
                    </text>
                </g>
            </svg>
        </div>
    </div>
</template>
<style lang="less" scoped>
.transfer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    padding: 0 9vw;
    color: #000000;
    font-size: 3.6vw;
    font-weight: 400;
    background: #ffffff;

    .header {
        text-align: left;
        margin-top: 6.5vw;

        h1 {
            font-size: 4.8vw;
            font-weight: 500;
            line-height: 6.8vw;
            margin-bottom: 6.5vw;
        }
    }

    .content {
        p {
            font-size: 4.4vw;
        }
        .tip {
            font-size: 3.8vw;
            color: #9b9b9b;
        }

        h2 {
            font-size: 5vw;
            font-weight: 600;
            line-height: 6.8vw;
            color: #1890ff;
            margin: 5vw 0 1vw 0;
        }

        img {
            width: 36vw;
            margin-bottom: 1vw;
        }
    }

    .footer {
        margin-bottom: 5vw;

        svg {
            width: 100%;
        }

        p {
            color: #9b9b9b;
            &:nth-child(2) {
                margin-bottom: 2vw;
            }

            span {
                color: #1890ff;
            }
        }
    }
}
</style>
