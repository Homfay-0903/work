<template>
    <div class="doc-list">
        <div class="doc-tree scrollbar">
            <el-tree
                node-key="id"
                :data="docTree"
                class="doc-pad"
                ref="tree"
                :props="defaultProps"
                :default-expand-all="true"
                :highlight-current="true"
                @node-click="handleNodeClick"
            ></el-tree>
        </div>
        <div class="doc-content scrollbar">
            <div class="doc-page">
                <div class="is-content" v-if="pageIndex == 1">
                    <!-- 1.1 -->
                    <!-- API接口概览 -->
                    <h2 id="1-1">1 API接口概览和测试数据</h2>
                    <h3 id="1-1">1.1 API接口概览</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>接口</th>
                                <th>接口功能</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>获取第三方凭证接口</td>
                                <td>获取可访问第三方接口凭证的地址。由第三方客户提供，接口格式、传入返回参数参照3.1.1</td>
                            </tr>
                            <tr>
                                <td>请求第三方二维码接口</td>
                                <td>用户在设备端完成测量后的结果二维码，由第三方客户提供，接口格式、传入返回参数参照3.1.2</td>
                            </tr>
                            <tr>
                                <td>第三方刷卡（手环）登录验证</td>
                                <td>维塑服务调用此接口向第三方进行刷卡或手环用户身份验证。由第三方客户提供，接口格式、传入返回参数参照3.1.3</td>
                            </tr>
                            <tr>
                                <td>维塑推送合成通知消息</td>
                                <td>体测、体态、节段分布结果及扫描相关信息，调用此接口向第三方服务推送信息。由第三方客户提供，接口格式、传入返回参数参照3.1.4</td>
                            </tr>
                            <tr>
                                <td>获取维塑接口凭证</td>
                                <td>第三方客户调用此接口获取维塑相关接口凭证，vfid和vfsecret从维塑管理平台获取</td>
                            </tr>
                            <tr>
                                <td>用户信息绑定</td>
                                <td>第三方 app 扫描设备端二维码后，在第三方后台验证用户和设备或第三方验证 RFID（手环）用户身份通过后，调用此接口通知维塑后台服务从而发起合成请求</td>
                            </tr>
                            <tr>
                                <td>体测数据接口</td>
                                <td>体成分合成成功，第三方客户调用此接口获取体测模型和数据</td>
                            </tr>
                            <tr>
                                <td>体态文件数据接口</td>
                                <td>体态模型合成成功，第三方客户调用此接口获取体态模型和数据</td>
                            </tr>
                            <tr>
                                <td>节段数据接口</td>
                                <td>体成分合成成功后，第三方客户调用此接口获取节段数据</td>
                            </tr>
                            <tr>
                                <td>返回状态码说明</td>
                                <td>状态码说明</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="1-2">1.2 测试数据</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>参数值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>key</td>
                                <td>vfB30p9qaCvTmCjH</td>
                            </tr>
                            <tr>
                                <td>secret</td>
                                <td>XUpz0XB39GHylWVsiCeHOQjjprWbPcFE</td>
                            </tr>
                            <tr>
                                <td>scanid</td>
                                <td>34041912080005-f2e97d41-d348-11eb-b70b-300ed5520889</td>
                            </tr>
                            <tr>
                                <td>third_uid</td>
                                <td>123456</td>
                            </tr>
                            <tr>
                                <td>mobile</td>
                                <td>13800000000</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="1-3">1.3 二维码对接流程图</h3>
                    <img src="@/assets/images/doc/5ddf84367d2a9.jpg" alt="二维码对接流程图">
                    <h3 id="1-4">1.4 手环对接流程图</h3>
                    <img src="@/assets/images/doc/5ddf8441dedf6.jpg" alt="手环对接流程图">
                </div>
                <div class="is-content" v-if="pageIndex == 2">
                    <!-- 接口命名规则 -->
                    <h2 id="2-1">2.接口命名规则</h2>
                    <h3 id="2-1">2.1 命名规则</h3>
                    <p>https://[域名]/[版本号]/[接口名]</p>
                    <p>例：http://api.rpro3.visbody.com/v1/token</p>
                    <table>
                        <thead>
                            <tr>
                                <th>实例</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>api.rpro3.visbody.com</td>
                                <td>域名</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>接口名</td>
                            </tr>
                            <tr>
                                <td>v1</td>
                                <td>版本号</td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 版本控制 -->
                    <h3 id="2-2">2.2 版本控制</h3>
                    <p>接口版本通过路由控制</p>
                    <p style="margin-top:1em">HTTP GET:</p>
                    <p>http://api.rpro3.visbody.com/v1/token</p>
                    <!-- <p style="margin-top:1em">v2版本</p> -->
                    <p>http://api.rpro3.visbody.com/v2/token</p>
                    <h3 id="2-3">2.3 POST提交方式</h3>
                    <p>Content-Type: application/json</p>
                </div>

                <div class="is-content" v-if="pageIndex == 3">
                    <!-- 产品二维码获取接口文档 -->
                    <h2 id="3-1">3.接口说明</h2>
                    <h3 id="3-1">3.1 第三方客户对接说明</h3>
                    <p>目前支持公众号对接、API对接、二维码对接、手环对接4种方式。</p>
                    <ol class="ol-list">
                        <li>
                            公众号对接
                            <br />可通过维塑管理平台自行配置
                        </li>
                        <li>
                            API对接
                            <br />申请API对接权限后，需第三方提供3.1.1及3.1.3接口,如需对接刷卡（手环）还需提供3.1.2接口；
                            <br />
                        </li>
                        <li>
                            二维码对接
                            <br />申请二维码对接权限后，支持替换设备显示的二维码，扫描后跳转到客户自己的APP或小程序等其他平台，需第三方提供3.1.2接口，二维码对接后无法使用维塑公众号查看报告，必须同时配合API对接，自行开发报告查看系统。
                        </li>
                        <li>
                            手环对接
                            <br />申请手环对接权限后，手环可替代用户扫码，需第三方提供3.1.3接口,如需对接刷卡（手环）还需提供3.1.2接口，手环对接后无法使用维塑公众号查看报告，必须同时配合API对接，自行开发报告查看系统。
                        </li>
                    </ol>
                    <h3 id="3-1-1">3.1.1获取第三方接口凭证</h3>
                    <h3>接口描述</h3>
                    <p>获取可访问第三方接口凭证的地址</p>
                    <h3>请求URL：</h3>
                    <p>•https://[域名]/token</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>key</td>
                                <td>是</td>
                                <td>string</td>
                                <td>用户唯一凭证,由第三方提供</td>
                            </tr>
                            <tr>
                                <td>secret</td>
                                <td>是</td>
                                <td>string</td>
                                <td>用户唯一凭证密钥,由第三方提供</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>正常时返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "token": "TOKEN",
        "expires_in": 7200
    }
}

                </code></pre>
                    <p>错误时返回示例</p>
                    <pre>
                <code>
{
    "code": 30001,
    "error_msg": 'ERROR_MSG'
}

                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>code</td>
                                <td>int</td>
                                <td>状态码,返回状态码参考3.1.5说明</td>
                            </tr>
                            <tr>
                                <td>error_msg</td>
                                <td>string</td>
                                <td>错误信息</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>expires_in</td>
                                <td>int</td>
                                <td>凭证有效时间</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-1-2">3.1.2 第三方二维码接口</h3>
                    <h3>接口描述</h3>
                    <p>用户在设备端完成测量后的结果二维码，由第三方提供</p>
                    <h3>请求URL：</h3>
                    <p>•https://[域名]/getQrCode</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                            <tr>
                                <td>device_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>设备ID</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>第三方接口凭证</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>正常时返回示例</p>
                    <pre>
<code>
{
    "code": 0,
    "data": {
        "url": "qrCodeUrl"
    }
}

                </code></pre>
                    <p>错误时返回示例</p>
                    <pre>
                <code>
{
    "code": 30001,
    "error_msg": 'ERROR_MSG'
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>code</td>
                                <td>int</td>
                                <td>状态码 ,返回状态码参考3.1.5说明</td>
                            </tr>
                            <tr>
                                <td>error_msg</td>
                                <td>string</td>
                                <td>错误信息</td>
                            </tr>
                            <tr>
                                <td>url</td>
                                <td>string</td>
                                <td>二维码地址</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-1-3">3.1.3 第三方刷卡（手环）登录验证</h3>
                    <h3>接口描述</h3>
                    <p>用户在设备端使用第三方客户的会员卡或手环进行登录时，调用此接口向第三方服务进行用户身份验证</p>
                    <h3>请求URL：</h3>
                    <p>•https://[域名]/login</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>card_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>卡或手环ID</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                            <tr>
                                <td>device_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>设备ID</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>第三方接口凭证</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>正常时返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "name": "Name",
        "sex":1,
        "birthday":"2009-10-10",
        "height": 170,
        "mobile":"13800000000"
    }
}

                </code></pre>
                    <p>错误时返回示例</p>
                    <pre>
                <code>
{
    "code": 30001,
    "error_msg": 'ERROR_MSG'
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>code</td>
                                <td>int</td>
                                <td>状态码,返回状态码参考3.1.5说明</td>
                            </tr>
                            <tr>
                                <td>error_msg</td>
                                <td>string</td>
                                <td>错误信息</td>
                            </tr>
                            <tr>
                                <td>name</td>
                                <td>string</td>
                                <td>用户名</td>
                            </tr>
                            <tr>
                                <td>sex</td>
                                <td>int</td>
                                <td>性别 1 男 2 女</td>
                            </tr>
                            <tr>
                                <td>birthday</td>
                                <td>string</td>
                                <td>用户生日，如2009-10-10</td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td>string</td>
                                <td>用户身高</td>
                            </tr>
                            <tr>
                                <td>mobile</td>
                                <td>string</td>
                                <td>用户手机号</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-1-4">3.1.4 维塑推送合成通知消息</h3>
                    <h3>接口描述</h3>
                    <p>用户在设备端使用第三方客户的会员卡或手环进行登录成功后，体测、体态、肩部结果及扫描相关信息，调用此接口向第三方服务推送信息</p>
                    <h3>请求URL：</h3>
                    <p>•https://[域名]/notify</p>
                    <h3>请求方式：</h3>
                    <p>•POST</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                            <tr>
                                <td>device_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>设备ID</td>
                            </tr>
                            <tr>
                                <td>time</td>
                                <td>是</td>
                                <td>date</td>
                                <td>完成时间 时间格式 2018-06-25 10:10:10</td>
                            </tr>
                            <tr>
                                <td>data</td>
                                <td>否</td>
                                <td>object</td>
                                <td>用户信息</td>
                            </tr>
                            <tr>
                                <td>age</td>
                                <td>否</td>
                                <td>int</td>
                                <td>年龄</td>
                            </tr>
                            <tr>
                                <td>birthday</td>
                                <td>否</td>
                                <td>string</td>
                                <td>生日</td>
                            </tr>
                            <tr>
                                <td>phone</td>
                                <td>否</td>
                                <td>string</td>
                                <td>手机</td>
                            </tr>
                            <tr>
                                <td>sex</td>
                                <td>否</td>
                                <td>string</td>
                                <td>f 女，m 男</td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td>否</td>
                                <td>int</td>
                                <td>身高</td>
                            </tr>
                            <tr>
                                <td>action_status</td>
                                <td>是</td>
                                <td>object</td>
                                <td>状态信息</td>
                            </tr>
                            <tr>
                                <td>girth_status</td>
                                <td>否</td>
                                <td>int</td>
                                <td>体围的合成状态，０失败，１成功，２超时</td>
                            </tr>
                            <tr>
                                <td>eval_status</td>
                                <td>否</td>
                                <td>int</td>
                                <td>体态的合成状态，０失败，１成功，２超时</td>
                            </tr>
                            <tr>
                                <td>bia_status</td>
                                <td>否</td>
                                <td>int</td>
                                <td>体成分的合成状态，０失败，１成功，２超时</td>
                            </tr>
                            <tr>
                                <td>eval_shoulder_status</td>
                                <td>否</td>
                                <td>int</td>
                                <td>肩部的合成状态，０失败，１成功，２超时</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>第三方接口凭证</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>格式如下</p>
                    <pre>
                <code>
{
    "data": {
        "age": 26,
        "birthday": "1992-12-12",
        "height": 178,
        "phone": "13812345678",
        "sex": "f"
    },
    "action_status":{
        "eval_status":0,
        "bia_status":0,
        "girth_status":0,
        "eval_shoulder_status":0
    },
    "device_id": "20041910080001",
    "scan_id": "20041910080001-a210136e-1bfb-11ea-b711-00d861a9ecd9",
    "time": "2019-12-11 17:56:15",
    "token": "TOKEN"
}
                </code></pre>
                    <p>正常时返回示例</p>
                    <pre>
                <code>
{
    "code": 0
}

                </code></pre>
                    <p>错误时返回示例</p>
                    <pre>
                <code>
{
    "code": 30001,
    "error_msg": 'ERROR_MSG'
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>code</td>
                                <td>int</td>
                                <td>状态码,返回状态码参考3.1.5说明</td>
                            </tr>
                            <tr>
                                <td>error_msg</td>
                                <td>string</td>
                                <td>错误信息</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-1-5">3.1.5 第三方状态码</h3>
                    <h3>描述:</h3>
                    <p>以上接口第三方客户请按以下状态码返回相关状态信息</p>
                    <table>
                        <thead>
                            <tr>
                                <th>状态码</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>0</td>
                                <td>请求成功</td>
                            </tr>
                            <tr>
                                <td>30001</td>
                                <td>无效的token</td>
                            </tr>
                            <tr>
                                <td>30002</td>
                                <td>手环用户不存在（未绑定）</td>
                            </tr>
                            <tr>
                                <td>30003</td>
                                <td>手环用户信息不完整</td>
                            </tr>
                            <tr>
                                <td>30004</td>
                                <td>会籍已过期</td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 id="3-2">3.2 获取维塑接口凭证</h2>
                    <h3 id="3-2-1">3.2.1 获取维塑接口凭证</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取维塑接口凭证</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/token</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>key</td>
                                <td>是</td>
                                <td>string</td>
                                <td>第三方用户唯一凭证，即vfid</td>
                            </tr>
                            <tr>
                                <td>secret</td>
                                <td>是</td>
                                <td>string</td>
                                <td>第三方用户唯一凭证密钥，即vfsecret</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>正常时返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "token": "TOKEN",
        "expires_in": 7200
    }
}


                </code></pre>
                    <p>错误时返回示例</p>
                    <pre>
                <code>
{
    "code": 40001,
    "error_msg": 'ERROR_MSG'
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>code</td>
                                <td>int</td>
                                <td>状态码,返回状态码参考3.8说明</td>
                            </tr>
                            <tr>
                                <td>error_msg</td>
                                <td>string</td>
                                <td>错误信息</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>expires_in</td>
                                <td>int</td>
                                <td>凭证有效时间</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3>token的使用方式</h3>
                    <p>1.在通过POST或GET请求中以普通参数传入。</p>
                    <p>2.在请求头中添加Authorization Bearer Token, 以php为例。</p>
                    <pre>
                <code>
{
    $headers[]  =  "Content-Type: application/json";
    $headers[]  =  "Authorization: Bearer ". $vfToken;
}
                </code></pre>
                    <h3 id="3-2-2">3.2.2 用户信息绑定</h3>
                    <h3>接口描述</h3>
                    <p>•第三方 app 扫描设备端二维码后，在第三方后台验证用户和设备或第三方验证 RFID（手环）用户身份通过后，调用此接口通知维塑后台服务从而发起合成请求</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/dataBind</p>
                    <h3>请求方式：</h3>
                    <p>•POST</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                            <tr>
                                <td>device_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>设备ID</td>
                            </tr>
                            <tr>
                                <td>third_uid</td>
                                <td>是</td>
                                <td>string</td>
                                <td>第三方用户Id 数字与字母组合</td>
                            </tr>
                            <tr>
                                <td>mobile</td>
                                <td>是</td>
                                <td>string</td>
                                <td>手机号</td>
                            </tr>
                            <tr>
                                <td>sex</td>
                                <td>是</td>
                                <td>int</td>
                                <td>性别 1男 2女</td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td>是</td>
                                <td>int</td>
                                <td>身高 110 ~ 205 单位cm</td>
                            </tr>
                            <tr>
                                <td>birthday</td>
                                <td>是</td>
                                <td>string</td>
                                <td>生日 格式 yyyy-MM-dd 注意周岁范围需在 10 ~ 70之间</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>正常时返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "result": TRUE
    }
}


                </code></pre>
                    <p>错误时返回示例</p>
                    <pre>
                <code>
{
    "code": 40001,
    "error_msg": 'ERROR_MSG'
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>code</td>
                                <td>int</td>
                                <td>状态码,返回状态码参考3.8说明</td>
                            </tr>
                            <tr>
                                <td>error_msg</td>
                                <td>string</td>
                                <td>错误信息</td>
                            </tr>
                            <tr>
                                <td>result</td>
                                <td>boolean</td>
                                <td>发起合成结果</td>
                            </tr>
                            <tr>
                                <td>expires_in</td>
                                <td>int</td>
                                <td>凭证有效时间</td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 id="3-3">3.3 获取体测数据</h2>
                    <h3 id="3-3-1">3.3.1 获取体成分数据</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取体测体成分数据</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/measure/mass</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "WT": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "FFM": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "BFM": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "LM": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "TBW": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "BMI": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "PBF": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "BMR": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "WHR": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "SM": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "TM": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "PROTEIN": {"l":10,"m":15,"h":20,"v":30.3,"status":3}
    }
}

                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>WT</td>
                                <td>object</td>
                                <td>体重（kg）</td>
                            </tr>
                            <tr>
                                <td>FFM</td>
                                <td>object</td>
                                <td>去脂体重（kg）</td>
                            </tr>
                            <tr>
                                <td>BFM</td>
                                <td>object</td>
                                <td>体脂肪量（kg）</td>
                            </tr>
                            <tr>
                                <td>LM</td>
                                <td>object</td>
                                <td>肌肉量（kg）</td>
                            </tr>
                            <tr>
                                <td>WT</td>
                                <td>object</td>
                                <td>体重（kg）</td>
                            </tr>
                            <tr>
                                <td>TBW</td>
                                <td>object</td>
                                <td>身体水分（kg）</td>
                            </tr>
                            <tr>
                                <td>BMI</td>
                                <td>object</td>
                                <td>身体质量</td>
                            </tr>
                            <tr>
                                <td>PBF</td>
                                <td>object</td>
                                <td>体脂肪率（%）</td>
                            </tr>
                            <tr>
                                <td>BMR</td>
                                <td>object</td>
                                <td>基础代谢量（kcal/d）</td>
                            </tr>
                            <tr>
                                <td>WHR</td>
                                <td>object</td>
                                <td>腰臀比</td>
                            </tr>
                            <tr>
                                <td>SM</td>
                                <td>object</td>
                                <td>骨骼肌（kg）</td>
                            </tr>
                            <tr>
                                <td>TM</td>
                                <td>object</td>
                                <td>无机盐（kg）</td>
                            </tr>
                            <tr>
                                <td>PROTEIN</td>
                                <td>object</td>
                                <td>蛋白质（kg）</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>体成分范围说明：</p>
                    <pre>
                <code>
{
    "l":10,        // 下限值
    "m":15,        // 标准值
    "h":20,        // 上限值
    "v":30.3,      // 测量值
    "status":3     // 状态 1低，2正常，3高
}
                </code></pre>
                    <h3 id="3-3-2">3.3.2 获取用户脂肪等级</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取用户脂肪等级</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/body/state</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "va_grade":9,
        "body_age":18,
        "body_share":3
    }
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>va_grade</td>
                                <td>int</td>
                                <td>内脏脂肪等级(1~10正常，10~14过高，14~17高，>17超高)</td>
                            </tr>
                            <tr>
                                <td>body_age</td>
                                <td>int</td>
                                <td>身体年龄</td>
                            </tr>
                            <tr>
                                <td>body_share</td>
                                <td>int</td>
                                <td>体型判断(１虚弱型，２肌肉型，３肥胖型，４健康型)</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-3-3">3.3.3 获取用户身体评分</h3>
                    <h3>接口描述</h3>
                    <p>•用于用户身体评分</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/body/score</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                            <tr>
                                <td>scan_type</td>
                                <td>是</td>
                                <td>int</td>
                                <td>扫描类型 1体测 2体态</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "score": 98
    }
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>score</td>
                                <td>int</td>
                                <td>项目评分</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-3-4">3.3.4 获取身体成分调节数据</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取身体成分调节量</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/forecast/adjust</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "weight":1.8,
        "body_fat":-2.6,
        "muscle":-2.6,
        "gr_weight":75,
        "gr_body_fat":12.3,
        "gr_muscle":15.1
    }
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>weight</td>
                                <td>double</td>
                                <td>体重调节量</td>
                            </tr>
                            <tr>
                                <td>body_fat</td>
                                <td>double</td>
                                <td>体脂肪调节量</td>
                            </tr>
                            <tr>
                                <td>muscle</td>
                                <td>double</td>
                                <td>肌肉调节量</td>
                            </tr>
                            <tr>
                                <td>gr_weight</td>
                                <td>double</td>
                                <td>体重黄金比例</td>
                            </tr>
                            <tr>
                                <td>gr_body_fat</td>
                                <td>double</td>
                                <td>体脂肪黄金比例</td>
                            </tr>
                            <tr>
                                <td>gr_muscle</td>
                                <td>double</td>
                                <td>肌肉黄金比例</td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 id="3-4">3.4 获取体态文件及数据</h2>
                    <h3 id="3-4-1">3.4.1 获取体态文件</h3>
                    <h3>接口描述</h3>
                    <p>用于获取体态模型、关键点json文件及体态拍照图片</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/shape/file</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "model_url": "MODEL_URL",
        "json_url": "JSON_URL",
        "pic_front_url": "PIC_FRONT_URL",
        "pic_left_url": "PIC_LEFT_URL",
        "pic_right_url": "PIC_RIGHT_URL",
        "pic_top_url": "PIC_TOP_URL",
        "expires_in": 7200
    }
}

                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>model_url</td>
                                <td>string</td>
                                <td>体态模型文件路径，文件格式.obj</td>
                            </tr>
                            <tr>
                                <td>json_url</td>
                                <td>string</td>
                                <td>体态关键点json文件路径，文件格式.txt (用于体态模型效果关节点展示)</td>
                            </tr>
                            <tr>
                                <td>pic_front_url</td>
                                <td>string</td>
                                <td>体态正面图片文件路径，文件格式.jpg</td>
                            </tr>
                            <tr>
                                <td>pic_left_url</td>
                                <td>string</td>
                                <td>体态左视图图片文件路径，文件格式.jpg</td>
                            </tr>
                            <tr>
                                <td>pic_right_url</td>
                                <td>string</td>
                                <td>体态右视图图片文件路径，文件格式.jpg</td>
                            </tr>
                            <tr>
                                <td>pic_top_url</td>
                                <td>string</td>
                                <td>体态顶视图图片文件路径，文件格式.jpg</td>
                            </tr>
                            <tr>
                                <td>expires_in</td>
                                <td>int</td>
                                <td>文件路径有效时间</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-4-2">3.4.2 获取体态数据</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取体态评估身体数据</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/shape/points</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "high_low_shoudler": {
            "val": 15.96,
            "conclusion": "高低肩(左高)",
            "risk": "高低肩可引发颈肩部的慢性疼痛，常伴随脊柱侧弯、骨盆位移、长短腿等情况出现"
        },
        "head_slant": {
            "val": 15.96,
            "conclusion": "正常",
            "risk": "--"
        },
        "head_forward": {
            "val": 15.96,
            "conclusion": "正常",
            "risk": "--"
        },
        "leg_xo": {
            "left_val": 184.3,
            "right_val": 187.2,
            "conclusion": "正常",
            "risk": "--"
        },
        "pelvis_forward": {
            "val": 15.96,
            "conclusion": "正常",
            "risk": "--"
        },
        "left_knee_check": {
            "val": 175.4,
            "conclusion": "正常",
            "risk": "--"
        },
        "right_knee_check": {
            "val": 187.7,
            "conclusion": "正常",
            "risk": "--"
        },
        "round_shoulder_left": {
            "val": 15.6,
            "conclusion": "正常",
            "risk": "--"
        },
        "round_shoulder_right": {
            "val": 15.6,
            "conclusion": "正常",
            "risk": "--"
        }
    }
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>high_low_shoudler</td>
                                <td>object</td>
                                <td>高低肩 单位cm</td>
                            </tr>
                            <tr>
                                <td>head_slant</td>
                                <td>object</td>
                                <td>头侧歪 单位°</td>
                            </tr>
                            <tr>
                                <td>head_forward</td>
                                <td>object</td>
                                <td>头前引 单位°</td>
                            </tr>
                            <tr>
                                <td>leg_xo</td>
                                <td>object</td>
                                <td>腿型 单位°</td>
                            </tr>
                            <tr>
                                <td>pelvis_forward</td>
                                <td>object</td>
                                <td>骨盆前后移 单位°</td>
                            </tr>
                            <tr>
                                <td>left_knee_check</td>
                                <td>object</td>
                                <td>左膝盖分析 单位°</td>
                            </tr>
                            <tr>
                                <td>right_knee_check</td>
                                <td>object</td>
                                <td>右膝盖分析 单位°</td>
                            </tr>
                            <tr>
                                <td>round_shoulder_left</td>
                                <td>object</td>
                                <td>左圆肩 单位°</td>
                            </tr>
                            <tr>
                                <td>round_shoulder_right</td>
                                <td>object</td>
                                <td>右圆肩 单位°</td>
                            </tr>
                            <tr>
                                <td>val</td>
                                <td>double</td>
                                <td>测量值</td>
                            </tr>
                            <tr>
                                <td>left_val</td>
                                <td>double</td>
                                <td>左腿测量值</td>
                            </tr>
                            <tr>
                                <td>right_val</td>
                                <td>double</td>
                                <td>右腿测量值</td>
                            </tr>
                            <tr>
                                <td>conclusion</td>
                                <td>double</td>
                                <td>评估结论</td>
                            </tr>
                            <tr>
                                <td>risk</td>
                                <td>double</td>
                                <td>风险提示 正常则显示 “—“</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-4-3">3.4.3 获取围度文件</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取体围模型、围度json、模型围度图片文件</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/measure/file</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "model_url": "MODEL_URL",
        "json_url": "JSON_URL",
        "pic_measure_url": "PIC_MEASURE_URL",
        "expires_in": 7200
    }
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>model_url</td>
                                <td>string</td>
                                <td>围度模型文件路径，文件格式.obj</td>
                            </tr>
                            <tr>
                                <td>json_url</td>
                                <td>string</td>
                                <td>围度json文件路径，文件格式.json,可配合模型文件展示围度的位置以及数据</td>
                            </tr>
                            <tr>
                                <td>pic_measure_url</td>
                                <td>string</td>
                                <td>模型围度图片文件路径，文件格式.jpg</td>
                            </tr>
                            <tr>
                                <td>expires_in</td>
                                <td>int</td>
                                <td>文件路径有效时间</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-4-4">3.4.4 获取围度数据</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取体测围度数据</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/measure/girth</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "bust_girth": 30.6,
        "waist_girth": 30.8,
        "hip_girth": 93.8,
        "left_upper_arm_girth": 90,
        "right_upper_arm_girth": 99.8,
        "left_thigh_girth": 58,
        "right_thigh_girth": 56.2,
        "left_calf_girth": 37.1,
        "right_calf_girth": 34.5,
        "height": 161.1
    }
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>bust_girth</td>
                                <td>double</td>
                                <td>胸围(cm)</td>
                            </tr>
                            <tr>
                                <td>waist_girth</td>
                                <td>double</td>
                                <td>腰围(cm)</td>
                            </tr>
                            <tr>
                                <td>hip_girth</td>
                                <td>double</td>
                                <td>臀围(cm)</td>
                            </tr>
                            <tr>
                                <td>left_upper_arm_girth</td>
                                <td>double</td>
                                <td>左上臂围(cm)</td>
                            </tr>
                            <tr>
                                <td>right_upper_arm_girth</td>
                                <td>double</td>
                                <td>右上臂围(cm)</td>
                            </tr>
                            <tr>
                                <td>left_thigh_girth</td>
                                <td>double</td>
                                <td>左大腿围(cm)</td>
                            </tr>
                            <tr>
                                <td>right_thigh_girth</td>
                                <td>double</td>
                                <td>右大腿围(cm)</td>
                            </tr>
                            <tr>
                                <td>left_calf_girth</td>
                                <td>double</td>
                                <td>左小腿围(cm)</td>
                            </tr>
                            <tr>
                                <td>right_calf_girth</td>
                                <td>double</td>
                                <td>右小腿围(cm)</td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td>double</td>
                                <td>输入身高(cm)</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 id="3-4-5">3.4.5 获取肩部检测数据及结论</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取肩部检测数据及结论</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/shoulder/data</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "left_abuction": {
            "val": 25.5,
            "conclusion": "受限",
            "limit": "[150.0°~180.0°]"
        },
        "right_abuction": {
            "val": 25.5,
            "conclusion": "受限",
            "limit": "[150.0°~180.0°]"
        },
        "left_antexion": {
            "val": 45.5,
            "conclusion": "过大",
            "limit": "[120.0°~180.0°]"
        },
        "right_antexion": {
            "val": "--",
            "conclusion": "--",
            "limit": "--"
        },
        "conclusions": [
            {
                "title": "肩关节活动度受限",
                "analysis": "肩关节活动受限，多由肌肉紧张，锁骨肩胛骨活动度不足，头颈肩胛不在中立位等原因引起。会影响正常运动模式（导致运动损伤），以及引起相关病理问题（如肩周炎、含胸驼背、颈椎酸痛等现象），长期忽视易导致各类肩关节疾病的发生。",
                "advice": "找专业人士对具体原因做进一步筛查及治疗。"
            },
            {
                "title": "肩关节活动度过大",
                "analysis": "肩关节活动度过大，多由韧带松弛导致（女性多见），如经常肩部柔韧性训练，也会出现活动过大的现象。",
                "advice": "找专业人士对具体原因做进一步筛查及治疗。"
            }
        ]
    }
  }
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>left_abuction</td>
                                <td>object</td>
                                <td>外展上举-左手</td>
                            </tr>
                            <tr>
                                <td>right_abuction</td>
                                <td>object</td>
                                <td>外展上举-右手</td>
                            </tr>
                            <tr>
                                <td>left_antexion</td>
                                <td>object</td>
                                <td>前屈上举-左手</td>
                            </tr>
                            <tr>
                                <td>right_antexion</td>
                                <td>object</td>
                                <td>前屈上举-右手</td>
                            </tr>
                            <tr>
                                <td>val</td>
                                <td>double</td>
                                <td>测量值 单位（°） 若本项失败则为 —</td>
                            </tr>
                            <tr>
                                <td>limit</td>
                                <td>string</td>
                                <td>正常范围 若本项失败则为 —</td>
                            </tr>
                            <tr>
                                <td>conclusion</td>
                                <td>string</td>
                                <td>评估结论 若本项失败则为 —</td>
                            </tr>
                            <tr>
                                <td>conclusions</td>
                                <td>array</td>
                                <td>本次检测的所有结论 根据检测情况会出现单个结论或多个结论情况</td>
                            </tr>
                            <tr>
                                <td>title</td>
                                <td>string</td>
                                <td>结论标题</td>
                            </tr>
                            <tr>
                                <td>analysis</td>
                                <td>string</td>
                                <td>结论分析 若所有项均正常则返回空字符串</td>
                            </tr>
                            <tr>
                                <td>advice</td>
                                <td>string</td>
                                <td>结论标题</td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 id="3-5">3.5 获取节段数据</h2>
                    <h3 id="3-5-1">3.5.1 获取节段数据</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取节段数据</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/seg/spread/data</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "BFMLA": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "BFMRA": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "BFMTR": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "BFMLL": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "BFMRL": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "LMLA": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "LMRA": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "LMTR": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "LMLL": {"l":10,"m":15,"h":20,"v":30.3,"status":3},
        "LMRL": {"l":10,"m":15,"h":20,"v":30.3,"status":3}
    }
}
                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>BFMLA</td>
                                <td>object</td>
                                <td>左上肢节段脂肪（kg）</td>
                            </tr>
                            <tr>
                                <td>BFMRA</td>
                                <td>object</td>
                                <td>右上肢节段脂肪（kg）</td>
                            </tr>
                            <tr>
                                <td>BFMTR</td>
                                <td>object</td>
                                <td>躯干节段脂肪（kg）</td>
                            </tr>
                            <tr>
                                <td>BFMLL</td>
                                <td>object</td>
                                <td>左下肢节段脂肪（kg）</td>
                            </tr>
                            <tr>
                                <td>BFMRL</td>
                                <td>object</td>
                                <td>右下肢节段脂肪（kg）</td>
                            </tr>
                            <tr>
                                <td>BFMLA</td>
                                <td>object</td>
                                <td>左上肢节段肌肉（kg）</td>
                            </tr>
                            <tr>
                                <td>LMRA</td>
                                <td>object</td>
                                <td>右上肢节段肌肉（kg）</td>
                            </tr>
                            <tr>
                                <td>LMTR</td>
                                <td>object</td>
                                <td>躯干节段肌肉（kg）</td>
                            </tr>
                            <tr>
                                <td>LMLL</td>
                                <td>object</td>
                                <td>左下肢节段肌肉（kg）</td>
                            </tr>
                            <tr>
                                <td>LMRL</td>
                                <td>object</td>
                                <td>右下肢节段肌肉（kg）</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>节段范围说明</p>
                    <pre>
                <code>
{
    "l":10,        // 下限值
    "m":15,        // 标准值
    "h":20,        // 上限值
    "v":30.3,      // 测量值
    "status":3     // 状态 1 低，２正常，３高
}
                </code></pre>
                    <h2 id="3-6">3.6 获取测量结论及pdf文件报告信息</h2>
                    <h3 id="3-6-1">3.6.1 获取测量结论及建议</h3>
                    <h3>接口描述</h3>
                    <p>•用于获取本次测量的结论及建议</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/report/msg</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "advice":[
            "别偷懒，加速养成良好的运动饮食习惯",
            "严重的体态问题将会影响您的正常生活，请教练对您的体态做进一步的评估",
            "请找专业人士对肩部做进一步筛查。"
        ],
        "conclusion":[
            "您目前的体成分状况一般，体型为肌肉型，体脂率偏高，体重正常。",
            "您目前的体态状况较差,存在长短腿,高低肩,头前引,圆肩,骨盆前/后倾的可能性。",
            "外展上举-右手肩关节活动度过大。"
        ]
    }
}

                </code></pre>
                    <p>返回参数说明:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>advice</td>
                                <td>array</td>
                                <td>建议</td>
                            </tr>
                            <tr>
                                <td>conclusion</td>
                                <td>array</td>
                                <td>结论</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>注：若只做单个项目则只返回单个项目结论及建议</p>
                    <h3 id="3-6-2">3.6.2 获取pdf文件报告信息</h3>
                    <h3>接口描述：</h3>
                    <p>•用于获取测量报告的pdf文件信息</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1/report/pdf</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>scan_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>扫描ID</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "url": "https://print.visbodyfit.com/report/vr-pro3/pdf/3404191208001290dcc82d-eddd-11eb-a7ae-704d7b2aef30-vrpro3-test.pdf?_upt=00f370fa1642650127.657",
        "expires_in": 7200
    }
}
                </code></pre>
                <p>返回参数说明</p>
                <table>
                    <thead>
                        <tr>
                            <th>参数名</th>
                            <th>类型</th>
                            <th>说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>url</td>
                            <td>string</td>
                            <td>pdf文件路径</td>
                        </tr>
                        <tr>
                            <td>expires_in</td>
                            <td>int</td>
                            <td>路径有效时间(单位/秒)</td>
                        </tr>
                    </tbody>
                </table>
                    <h2 id="3-7">3.7 获取报告历史记录</h2>
                    <h3>接口描述：</h3>
                    <p>•获取报告历史记录，这是一个分页接口，可自定义每页数量，每页数量最大100条</p>
                    <h3>请求URL：</h3>
                    <p>•http://api.rpro3.visbody.com/v1//history/data</p>
                    <h3>请求方式：</h3>
                    <p>•GET</p>
                    <h3>参数：</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>必选</th>
                                <th>类型</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>token</td>
                                <td>是</td>
                                <td>string</td>
                                <td>接口凭证</td>
                            </tr>
                            <tr>
                                <td>device_id</td>
                                <td>是</td>
                                <td>string</td>
                                <td>设备ID</td>
                            </tr>
                            <tr>
                                <td>page</td>
                                <td>是</td>
                                <td>int</td>
                                <td>页码</td>
                            </tr>
                            <tr>
                                <td>size</td>
                                <td>否</td>
                                <td>int</td>
                                <td>每页数量（默认100条），最大值100</td>
                            </tr>
                            <tr>
                                <td>phone_number</td>
                                <td>否</td>
                                <td>string</td>
                                <td>手机号码，若带上手机号，则返回该手机号的历史scanid</td>
                            </tr>
                            <tr>
                                <td>start_data</td>
                                <td>否</td>
                                <td>string</td>
                                <td>开始时间，若带上时间范围，则返回该时间范围内的数据</td>
                            </tr>
                            <tr>
                                <td>end_data</td>
                                <td>否</td>
                                <td>string</td>
                                <td>结束时间，若带上时间范围，则返回该时间范围内的数据</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>返回示例</p>
                    <pre>
                <code>
{
    "code": 0,
    "data": {
        "scanIdArray": [
            "34041912080013-fe14541f-bd22-11eb-a249-300ed5517747",
            "34041912080013-034af912-bd22-11eb-a249-300ed5517747",
            "34041912080013-312ed677-bd1e-11eb-beeb-300ed5517747",
            "34041912080013-cadff1c4-bd1d-11eb-beeb-300ed5517747",
            "34041912080013-7e22e106-bd1d-11eb-beeb-300ed5517747",
            "34041912080013-804c181e-bd0e-11eb-beeb-300ed5517747",
            "34041912080013-338d2b02-bd0e-11eb-beeb-300ed5517747",
            "34041912080013-cea3e9a6-bd0c-11eb-beeb-300ed5517747",
            "34041912080013-8a634611-bd0c-11eb-beeb-300ed5517747",
            "34041912080013-737b5c04-bd09-11eb-beeb-300ed5517747"
        ],
        "count": 40
    }
}
                </code></pre>
                <p>返回参数说明</p>
                <table>
                    <thead>
                        <tr>
                            <th>参数名</th>
                            <th>类型</th>
                            <th>说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>scanIdArray</td>
                            <td>arrat</td>
                            <td>返回用户历史记录数据</td>
                        </tr>
                        <tr>
                            <td>count</td>
                            <td>number</td>
                            <td>共有多少条数据</td>
                        </tr>
                    </tbody>
                </table>

                    <h2 id="3-8">3.8 维塑返回状态码说明</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>状态码</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>-1</td>
                                <td>系统繁忙</td>
                            </tr>
                            <tr>
                                <td>0</td>
                                <td>请求成功</td>
                            </tr>
                            <tr>
                                <td>40001</td>
                                <td>无效的请求路径</td>
                            </tr>
                            <tr>
                                <td>40002</td>
                                <td>无效的vfid或secret</td>
                            </tr>
                            <tr>
                                <td>40003</td>
                                <td>无效的token</td>
                            </tr>
                            <tr>
                                <td>40004</td>
                                <td>参数错误</td>
                            </tr>
                            <tr>
                                <td>40005</td>
                                <td>未绑定设备信息</td>
                            </tr>
                            <tr>
                                <td>40006</td>
                                <td>无效的扫描ID（扫描ID不属于该账号或本次扫描未成功或扫描数据过期）</td>
                            </tr>
                            <tr>
                                <td>40008</td>
                                <td>无接口权限</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            docTree: [
                {
                    label: '1.API接口概览和测试数据',
                    id: '1-1',
                    page: 1,
                    children: [
                        { label: '1.1 API接口概览', id: '1-1' },
                        { label: '1.2 测试数据', id: '1-2' },
                        { label: '1.3 二维码对接流程图', id: '1-3' },
                        { label: '1.4 手环对接流程图', id: '1-4' }
                    ]
                },
                {
                    label: '2. 接口命名规则',
                    id: '2-1',
                    page: 2,
                    children: [
                        { label: '2.1 命名规则', id: '2-1' },
                        { label: '2.2 版本控制', id: '2-2' },
                        { label: '2.3 POST提交方式', id: '2-3' }
                    ]
                },
                {
                    label: '3.接口说明',
                    id: '3-1',
                    page: 3,
                    children: [
                        {
                            label: '3.1 第三方客户对接说明',
                            id: '3-1',
                            children: [
                                { label: '3.1.1 第三方接口凭证获取', id: '3-1-1' },
                                { label: '3.1.2 第三方二维码接口', id: '3-1-2' },
                                { label: '3.1.3 第三方刷卡（手环）登录验证', id: '3-1-3' },
                                { label: '3.1.4 维塑推送合成通知消息', id: '3-1-4' },
                                { label: '3.1.5 第三方状态码', id: '3-1-5' }
                            ]
                        },
                        {
                            label: '3.2 获取维塑接口凭证',
                            id: '3-2',
                            children: [
                                { label: '3.2.1 获取维塑接口凭证', id: '3-2-1' },
                                { label: '3.2.2 用户信息绑定', id: '3-2-2' }
                            ]
                        },
                        {
                            label: '3.3 获取体测数据',
                            id: '3-3',
                            children: [
                                { label: '3.3.1 获取体成分数据', id: '3-3-1' },
                                { label: '3.3.2 获取用户脂肪等级', id: '3-3-2' },
                                { label: '3.3.3 获取身体评分', id: '3-3-3' },
                                { label: '3.3.4 获取身体成分调节数据', id: '3-3-4' }
                            ]
                        },
                        {
                            label: '3.4 获取体态文件及数据',
                            id: '3-4',
                            children: [
                                { label: '3.4.1 获取体态文件', id: '3-4-1' },
                                { label: '3.4.2 获取体态数据', id: '3-4-2' },
                                { label: '3.4.3 获取围度文件', id: '3-4-3' },
                                { label: '3.4.4 获取围度数据', id: '3-4-4' },
                                { label: '3.4.5 获取肩部检测数据', id: '3-4-5' }
                            ]
                        },
                        {
                            label: '3.5 获取节段文件数据',
                            id: '3-5',
                            children: [
                                { label: '3.5.1 获取节段数据', id: '3-5-1' }
                            ]
                        },
                        {
                            label: '3.6 获取测量结论及建议',
                            id: '3-6',
                            children: [
                                { label: '3.6.1 获取测量结论及建议', id: '3-6-1' },
                                { label: '3.6.2 获取pdf文件报告信息', id: '3-6-2' }
                            ]
                        },
                        {
                            label: '3.7 获取报告历史记录',
                            id: '3-7'
                        },
                        {
                            label: '3.8 维塑返回状态码说明',
                            id: '3-8'
                        }
                    ]
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            pageIndex: 1,
            activeIndex: '2'
        }
    },
    mounted() {
        if (this.$route.params.id) {
            let id = this.$route.params.id
            let index = id.split('-')[0]
            if (index && index > 0 && index < 4) {
                this.pageIndex = index
                this.$nextTick(function() {
                    let anchor = document.getElementById(id)
                    if (anchor) {
                        this.$refs.tree.setCurrentKey(id)
                        this.scrollAnimation(id)
                    } else {
                        this.$refs.tree.setCurrentKey(index + '-1')
                    }
                })
            } else {
                this.$refs.tree.setCurrentKey('1-1')
            }
        }
    },
    methods: {
        getParentPage(tree) {
            if (typeof tree.data.page === 'undefined') {
                this.getParentPage(tree.parent)
            } else {
                this.pageIndex = tree.data.page
            }
        },
        handleNodeClick(data, Node) {
            this.getParentPage(Node)
            this.$nextTick(function() {
                this.scrollAnimation(data.id)
            })
        },
        scrollAnimation(id) {
            let anchor = document.getElementById(id)
            let total = anchor.offsetTop - 100
            let distance = document.querySelector('.doc-content').scrollTop
            let step = total / 50
            if (total > distance) {
                this.smoothOver(distance, total, step, 'down')
            } else {
                let newTotal = distance - total
                step = newTotal / 50
                this.smoothOver(distance, total, step, 'up')
            }
        },

        smoothOver(distance, total, step, direction) {
            let distances = distance
            if (distances < total) {
                if (direction === 'up') {
                    distances -= step
                } else {
                    distances += step
                }
                document.querySelector('.doc-content').scrollTop = distances
                setTimeout(this.smoothOver(distances, total, step, direction), 100)
            } else {
                document.querySelector('.doc-content').scrollTop = total
            }
        }
    }
}
</script>
<style scoped lang="less">
.doc-list {
    padding: 20px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: stretch;
    justify-content: space-around;

    .doc-tree {
        width: 20%;
        background: #ffffff;
        padding: 50px 20px;
        overflow-y: scroll;

        .el-tree-node__content {
            margin-bottom: 16px;
        }
    }

    .doc-content {
        width: 76%;
        background: #ffffff;
        text-align: left;
        overflow-y: scroll;

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            margin-top: 2em;
            margin-bottom: 0.5em;
            font-weight: 400;
        }

        img {
            width: 80%;
            height: auto;
            max-width: 100%;
        }

        code {
            font-family: 'PingFang SC', 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans CJK SC';
            background: #f6f8f9;
            display: block;
            padding: 20px;
            border: 1px solid #cdced2;
            border-radius: 6px;
        }

        .doc-page {
            background: #ffffff;
            padding: 20px 50px 50px 50px;
            table {
                display: table;
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                overflow: auto;
                margin-top: 1em;
                margin-bottom: 3em;
                border-bottom: 1px solid #e7e7eb;
                thead {
                    tr {
                        &:first-child {
                            background-color: #f6f8f9;
                            border: none;
                        }
                    }
                }
                tr {
                    background-color: #fff;
                    border-top: 1px solid #ccc;

                    td {
                        height: 60px;
                        padding: 5px 10px;
                        border-right: 1px solid #ccc;
                        &:last-child {
                            border: none;
                        }
                    }
                }

                th {
                    font-weight: 400;
                    color: #8d8d8d;
                    text-align: left;
                    height: 40px;
                    padding: 6px 20px;
                    white-space: nowrap;
                    border: none;
                }
            }

            .line-table {
                td {
                    height: 40px;
                }
            }

            .ol-list {
                padding-left: 1rem;
                li {
                    list-style-type: decimal;
                }
            }
        }
    }
}

@media screen and (min-width: 1025px) and (max-width: 1366px) {
    .doc-tree {
        padding: 30px 5px;
    }
    .el-tree {
        overflow: auto;
    }
    .doc-tree {
        display: inline-block;
    }
}

@media screen and (max-width: 1024px) {
    .doc-list {
        font-size: 12px;

        .doc-tree {
            overflow-x: scroll;
            padding: 10px 10px;
            /deep/.el-tree-node__label {
                font-size: 12px;
            }
        }

        .doc-content {
            .doc-page {
                padding: 20px;
                table tr td {
                    height: 40px;
                }
            }
        }
    }
}
</style>
