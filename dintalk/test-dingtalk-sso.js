const axios = require('axios');

// 测试钉钉登录 OAuth 接口
async function testDingTalkLogin() {
    console.log('开始测试钉钉登录 OAuth 接口...');
    
    try {
        // 替换为实际的后端 API 地址
        const apiUrl = 'https://motionstation-test.visbody.com/api/v1/oauth/dingtalk';
        
        console.log(`请求 URL: ${apiUrl}`);
        
        const response = await axios.get(apiUrl, {
            timeout: 10000
        });
        
        console.log('响应状态:', response.status);
        console.log('响应数据:', response.data);
        console.log('测试成功！');
    } catch (error) {
        console.error('测试失败:', error.message);
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        }
    }
}

// 运行测试
testDingTalkLogin();
