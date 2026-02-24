<template>
    <div class="container">
        <div class="itemView leftView">
            <div class="itemTitle">
                <span>脊柱结构可视化</span>
                <span>*模型仅供参考，实际评估以专业检测为准</span>
            </div>
            <div class="itemContent">
                <div class="item3d">
                    <p>后视图</p>
                    <canvas ref="backCanvas" class="canvas-container" />
                    <div v-if="(loadJsonStatus === 1 && loadRearviewImgStatus !== 3) || (loadJsonStatus !== 3 && loadRearviewImgStatus === 1)"
                        class="loadJsonError">
                        <div>
                            <img src="@/assets/images/female/loadJsonError.svg" alt="123">
                            <span>加载中...</span>
                        </div>
                    </div>
                    <div v-if="loadJsonStatus === 3 || loadRearviewImgStatus === 3" class="loadJsonError">
                        <div>
                            <img src="@/assets/images/female/loadJsonError.svg" alt="123">
                            <span>加载失败</span>
                        </div>
                    </div>
                </div>
                <div class="item3d">
                    <p>右视图</p>
                    <canvas ref="sideCanvas" class="canvas-container" />
                    <div v-if="loadJsonStatus === 1 || loadRightviewImgStatus === 1" class="loadJsonError">
                        <div>
                            <img src="@/assets/images/female/loadJsonError.svg" alt="123">
                            <span>加载中...</span>
                        </div>
                    </div>
                    <div v-if="loadJsonStatus === 3 || loadRightviewImgStatus === 3" class="loadJsonError">
                        <div>
                            <img src="@/assets/images/female/loadJsonError.svg" alt="123">
                            <span>加载失败</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="itemView ">
            <div class="itemTitle">
                <span>脊柱结构异常评估</span>
                <span> </span>
            </div>
            <div class="itemContent">
                <rateEcharts :spineScore="structureAssessment.spineScore"
                    :spineStatus="structureAssessment.spineStatus" />
            </div>
        </div>
    </div>
</template>

<script>
import rateEcharts from '@/components/female/rateEcharts.vue'
export default {
    components: {
        rateEcharts,
    },
    props: {
        structureAssessment: {
            type: Object,
            default: () => ({
                spineScore: 0,
                spineStatus: 0,
            }),
        },
        structureFileInfo: {
            type: Object,
            default: () => ({
                back: null,
                side: null,
                jsons: null,
            })
        }
    },
    data() {
        return {
            json: {
                'upper_boundary_2d_back': 0,
                'lower_boundary_2d_back': 1920,
                'upper_boundary_2d_side': 0,
                'lower_boundary_2d_side': 1920,
            },
            // 裁剪JSON的加载状态
            loadJsonStatus: 1, // 0未加载、1正在加载、2加载完成、3加载失败
            // 后视图
            loadRearviewImgStatus: 1, // 0未加载、1正在加载、2加载完成、3加载失败
            // 右视图
            loadRightviewImgStatus: 1, // 0未加载、1正在加载、2加载完成、3加载失败
        }
    },
    computed: {
    },
    watch: {
        'structureFileInfo.jsons': function (newVal) {
            this.getJson()
        },
        'structureFileInfo.back': function (newVal) {
        },
    },
    mounted() {
        this.getJson()
    },
    methods: {
        // 获取裁剪数据
        getJson() {
            if (this.structureFileInfo.jsons) {
                // JSON正在加载
                this.loadJsonStatus = 1
                fetch(this.structureFileInfo.jsons.filePath)
                    .then((response) => {
                        // 检查响应是否成功
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`)
                        }
                        // 解析 JSON 数据
                        return response.json()
                    })
                    .then((jsonData) => {
                        // 打印 JSON 数据
                        // 可以在这里对 jsonData 进行进一步处理
                        this.json = {
                            'upper_boundary_2d_back': jsonData['upper_boundary_2d_back'],
                            'lower_boundary_2d_back': jsonData['lower_boundary_2d_back'],
                            'upper_boundary_2d_side': jsonData['upper_boundary_2d_side'],
                            'lower_boundary_2d_side': jsonData['lower_boundary_2d_side'],
                        }
                        this.setCanvas()
                        // JSON加载完成
                        this.loadJsonStatus = 2
                    })
                    .catch((error) => {
                        // 捕获并处理错误
                        // JSON加载失败
                        this.loadJsonStatus = 3
                        console.error('下载 JSON 文件时出错:', error)
                    })
            } else {
                return null
            }
        },
        // 执行裁剪
        setCanvas() {
            if (this.structureFileInfo.back && this.structureFileInfo.side) {
                console.log('Module JSON Data: ', this.json.upper_boundary_2d_back, this.json.lower_boundary_2d_back, this.json.upper_boundary_2d_side, this.json.lower_boundary_2d_side)
                this.a(this.structureFileInfo.back.filePath, this.$refs.backCanvas, this.json.upper_boundary_2d_back, this.json.lower_boundary_2d_back, 1)
                this.a(this.structureFileInfo.side.filePath, this.$refs.sideCanvas, this.json.upper_boundary_2d_side, this.json.lower_boundary_2d_side, 2)
            }
        },
        // 剪裁方法
        a(imgUrl, canvas, cropYStart, cropYEnd, type = 1) {
            let name = ''
            if (type === 1) {
                name = 'loadRearviewImgStatus'
            } else {
                name = 'loadRightviewImgStatus'
            }
            this[name] = 1
            // 获取Canvas元素和绘图上下文
            const ctx = canvas.getContext('2d')

            const image = new Image()

            let loadImageTimeout = setTimeout(() => {
                if (this[name] === 1) {
                    this[name] = 3
                    this.loadOver()
                }
            }, 3000)

            // 设置图片源

            image.src = imgUrl

            // 图片加载完成后处理
            image.onload = () => {
                if (this[name] === 1) {
                    drawCroppedImage()
                    this[name] = 2
                    clearTimeout(loadImageTimeout)
                    this.loadOver()
                }
            }

            // 错误处理
            image.onerror = () => {
                drawErrorText('图片加载失败，请检查图片链接')
                if (this[name] === 1) {
                    this[name] = 3
                    this.loadOver()
                }
            }

            // 绘制裁剪后的图片并居中显示
            function drawCroppedImage() {
                // 图片和裁剪参数
                const cropHeight = cropYEnd - cropYStart
                // 计算Canvas尺寸，保持裁剪后的比例
                const container = canvas.parentElement
                const containerWidth = container.clientWidth
                const containerHeight = container.clientHeight

                // 裁剪后的尺寸
                const croppedWidth = image.naturalWidth
                const croppedHeight = cropHeight

                // 计算保持比例的Canvas尺寸
                let canvasWidth = croppedWidth
                let canvasHeight = croppedHeight

                if (canvasWidth > containerWidth) {
                    const ratio = containerWidth / canvasWidth
                    canvasWidth = containerWidth
                    canvasHeight = croppedHeight * ratio
                }

                if (canvasHeight > containerHeight) {
                    const ratio = containerHeight / canvasHeight
                    canvasHeight = containerHeight
                    canvasWidth = croppedWidth * ratio
                }

                // 设置Canvas尺寸
                canvas.width = canvasWidth
                canvas.height = canvasHeight

                // 清空Canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                // 计算裁剪区域在原始图片中的位置和大小
                const sx = 0
                const sy = cropYStart
                const sWidth = image.naturalWidth
                const sHeight = cropHeight

                // 绘制裁剪后的图片
                ctx.drawImage(
                    image, // 源图片
                    sx,
                    sy, // 源图片裁剪起点
                    sWidth,
                    sHeight, // 源图片裁剪区域大小
                    0,
                    0, // 目标Canvas绘制起点
                    canvasWidth,
                    canvasHeight // 目标Canvas绘制大小
                )
            }

            // 绘制错误提示
            function drawErrorText(message) {
                canvas.width = 500
                canvas.height = 200

                ctx.clearRect(0, 0, canvas.width, canvas.height)

                ctx.font = '18px Arial'
                ctx.fillStyle = '#333'
                ctx.textAlign = 'center'
                ctx.fillText(
                    '图片处理错误',
                    canvas.width / 2,
                    canvas.height / 2 - 20
                )

                ctx.font = '14px Arial'
                ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 10)
            }
        },
        // 加载完成
        loadOver() {
            if ([2, 3].indexOf(this.loadJsonStatus) > -1 && [2, 3].indexOf(this.loadRearviewImgStatus) > -1 && [2, 3].indexOf(this.loadRightviewImgStatus) > -1) {
                console.log('SPINE_REPORT_OVER')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    display: flex;
    width: 863px;
    height: 216px;
    margin-top: 15px;

    .itemView {
        height: 216px;
        border: 1px solid #009FE8;

        &:last-child {
            width: 291px;
            margin-left: 9px;
        }

        .itemTitle {
            width: 100%;
            height: 44px;
            background: #F2F8FF;
            border-bottom: 1px solid #009FE8;
            line-height: 44px;
            padding: 0 12px;
            font-size: 24px;
            color: #333333;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;

            span {
                &:last-child {
                    font-size: 12px;
                    color: #9B9B9B;
                }
            }
        }

        .itemContent {
            width: 100%;
            height: 172px;
            display: flex;

            .item3d {
                position: relative;
                width: 50%;
                height: 100%;
                display: flex;

                p {
                    position: absolute;
                    font-size: 15px;
                    color: #666666;
                    padding: 6px 12px;
                }

                background: url("/assets/images/female/public/gird@2x.png") 0 0;
                background-size: 100% 100%;

                img {
                    height: 100%;
                    width: auto;
                    margin: 0 auto;
                }
            }
        }
    }

    .leftView {
        width: 563px;
    }

}


.canvas-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    background: url("../../assets/images/girth.svg") no-repeat;
    background-size: 100% 200%;
    background-position: center right;

    border-right: 1px solid #009FE8;
}

.loadJsonError {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    &>div {
        position: relative;
        display: flex;
        align-items: center;
        color: #7f7f84;

        &>img {
            width: 52px !important;
        }
    }
}
</style>