<!--
 * @Description: 节段显示
 * @Author: gaoyuanyuan
 * @Date: 2020-01-06 11:42:36
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2024-12-06 15:13:06
 -->
<template>
    <div :class="['segment-item', { 'vapro7': size === '014' }]">
        <h3>
            节段{{ type === 1 ? '脂肪' : '肌肉' }}
            <span>kg</span>
        </h3>
        <!-- 左上 -->
        <div :class="['left-up']">
            <span class="val">{{ toDecimal(leftUp.v, 1) }}</span>
            <span class="status">{{ getStatus(leftUp.status) }}</span>
        </div>
        <!-- 左上 -->
        <div class="left-down">
            <span class="val">{{ toDecimal(leftDown.v, 1) }}</span>
            <span class="status">{{ getStatus(leftDown.status) }}</span>
        </div>
        <!-- 中间 -->
        <div class="center">
            <span class="val">{{ toDecimal(center.v, 1) }}</span>
            <span class="status">{{ getStatus(center.status) }}</span>
        </div>
        <!-- 右上 -->
        <div class="right-up">
            <span class="val">{{ toDecimal(rightUp.v, 1) }}</span>
            <span class="status">{{ getStatus(rightUp.status) }}</span>
        </div>
        <!-- 右下 -->
        <div class="right-down">
            <span class="val">{{ toDecimal(rightDown.v, 1) }}</span>
            <span class="status">{{ getStatus(rightDown.status) }}</span>
        </div>
        <svg
            width="508px"
            height="504px"
            viewBox="0 0 508 504"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
        >
            <g id="打印报告" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="身体成分2" transform="translate(-1729.000000, -1746.000000)">
                    <g id="Group-2" transform="translate(1669.000000, 1673.000000)">
                        <g id="Group-4" transform="translate(60.000000, 73.000000)">
                            <path
                                d="M256,179 C272.016258,179 285,166.240115 285,150.5 C285,134.759885 272.016258,122 256,122 C239.983742,122 227,134.759885 227,150.5 C227,166.240115 239.983742,179 256,179 Z M293.998785,301 L294,428 L260,428 L260,301 L293.998785,301 Z M250,301 L250,428 L216,428 L216,301 L250,301 Z M289.816721,198 L301,236.043102 C297.366581,238.612289 294.99954,242.811382 294.99954,247.555422 L294.998343,298 L216.000459,298 L216.00046,247.555422 C216.00046,242.811382 213.633418,238.612289 210,236.043102 L221.182081,198 L289.816721,198 Z M399,198.001071 L399,233.889104 L309.26987,233.889104 C307.303316,233.889104 305.429112,234.284454 303.722417,235 L293,198 L399,198.001071 Z M217,198 L206.27866,235 C204.571946,234.284454 202.697721,233.889104 200.731147,233.889104 L111,233.889104 L111,198.001071 L217,198 Z"
                                id="形状-copy"
                                fill="#D9D9D9"
                            />
                            <polygon
                                id="肌肉量备份-74-copy"
                                fill="#B4D1F6"
                                transform="translate(256.000000, 252.000000) rotate(90.000000) translate(-256.000000, -252.000000) "
                                points="4 251 508 251 508 253 4 253"
                            />
                            <text
                                id="左-copy"
                                font-family="OPPOSans-R, OPPOSans"
                                font-size="32"
                                font-weight="normal"
                                fill="#9B9B9B"
                            >
                                <tspan x="203" y="56">左</tspan>
                            </text>
                            <text
                                id="右-copy"
                                font-family="OPPOSans-R, OPPOSans"
                                font-size="32"
                                font-weight="normal"
                                fill="#9B9B9B"
                            >
                                <tspan x="265.08" y="56">右</tspan>
                            </text>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </div>
</template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    name: 'Segment',
    props: {
        // 类型 1 节段脂肪 2 节段肌肉
        type: {
            type: Number,
            default: 1
        },
        // 左上肢
        leftUp: {
            type: Object,
            default: {
                v: 0,
                status: 2
            }
        },
        // 左下肢
        leftDown: {
            type: Object,
            default: {
                v: 0,
                status: 2
            }
        },
        // 躯干
        center: {
            type: Object,
            default: {
                v: 0,
                status: 2
            }
        },
        // 右上肢
        rightUp: {
            type: Object,
            default: {
                v: 0,
                status: 2
            }
        },
        // 右下肢
        rightDown: {
            type: Object,
            default: {
                v: 0,
                status: 2
            }
        },
        size: {
            type: String,
            default: '0'
        }
    },
    methods: {
        getStatus(status) {
            return status === 1 ? '低标准' : status === 2 ? '标准' : '超标准'
        },
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        }
    }
}
</script>
<style lang="less" scoped>
.segment-item {
    position: relative;
    text-align: center;
    &.vapro7 {
        height: 150px;
        width: 150px;
        svg{
            width: 150px;
            height: 150px;
        }
        .val{
            font-size: 10px;
            line-height: 12px;
        }
        .status{
            font-size: 10px;
            line-height: 12px;
        }
        .left-up{
            top:60px;
            right: 100px;
        }
        .left-down{
            right: 100px;
            top: 140px;
        }
        .center{
            top: 100px;
            right: 50px;
        }
        .right-down{
            top: 140px;
            left: 100px;
        }
        .right-up{
            top: 60px;
            left: 100px;
        }
    }
    h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #333333;
        line-height: 32px;
        text-align: left;
    }
    h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #333333;
        line-height: 28px;
        text-align: left;
        background: #f2f8ff;
        border: 1px solid #009fe8;
        padding-left: 13px;
    }
    span {
        font-size: 12px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #666666;
        line-height: 16px;
    }
    svg {
        width: auto;
        height: 232px;
        tspan {
            font-family: OPPOSans-R;
        }
    }
    .left-up {
        position: absolute;
        top: 107px;
        right: 215px;
        text-align: right;
    }
    .left-down {
        position: absolute;
        top: 193px;
        right: 166px;
        text-align: right;
    }
    .center {
        position: absolute;
        top: 133px;
        right: 111px;
        width: 3rem;
        text-align: center;
    }
    .right-up {
        position: absolute;
        top: 107px;
        left: 215px;
        text-align: left;
    }
    .right-down {
        position: absolute;
        top: 193px;
        left: 166px;
        text-align: left;
    }
    .val {
        display: block;
        font-size: 14px;
        font-family: OPPOSans M;
        color: #5698f5;
        line-height: 18px;
        font-weight: bold;
    }
    .status {
        display: block;
        font-size: 14px;
        font-family: OPPOSans M;
        font-weight: normal;
        color: #666666;
        line-height: 18px;
    }
}
</style>
