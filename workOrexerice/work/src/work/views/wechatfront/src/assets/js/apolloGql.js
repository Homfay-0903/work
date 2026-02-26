import gql from 'graphql-tag'

// 微信公众号授权
export const memberAuthEntrance = gql`
    query memberAuthEntrance($appId: String!, $redirectUri: String!, $type: Int!) {
        memberAuthEntrance(appId: $appId, redirectUri: $redirectUri, type: $type) {
            code
            message
            data
        }
    }
`

// 注册发送验证码
export const getSmsCode = gql`
    query sendValidationCode($mobile: String!, $type: Int) {
        sendValidationCode(mobile: $mobile, type: $type) {
            code
            message
        }
    }
`

// 绑定手机号
export const bindMemberMobile = gql`
    mutation bindMemberMobile($mobile: String!, $code: String!) {
        bindMemberMobile(mobile: $mobile, code: $code) {
            code
            message
            data {
                height
            }
        }
    }
`

// 注册用户信息
export const registerMember = gql`
    mutation registerMember($mobile: String!, $sex: Int!, $height: Int!, $birthday: String!) {
        registerMember(mobile: $mobile, sex: $sex, height: $height, birthday: $birthday) {
            code
            message
        }
    }
`

// 微信端用户登录
export const memberLogin = gql`
    query memberLogin(
        $type: Int!
        $appId: String!
        $code: String!
        $deviceType: Int
        $scanId: String
        $deviceId: String
    ) {
        memberLogin(
            type: $type
            appId: $appId
            code: $code
            deviceType: $deviceType
            scanId: $scanId
            deviceId: $deviceId
        ) {
            code
            message
            data {
                token
                expiresIn
                healthPackageEnable
            }
        }
    }
`
// 微信端用户登录
export const memberTestLogin = gql`
    query memberTestLogin($type: Int!, $wmId: Int!, $deviceType: Int, $scanId: String, $deviceId: String) {
        memberTestLogin(type: $type, wmId: $wmId, deviceType: $deviceType, scanId: $scanId, deviceId: $deviceId) {
            code
            message
            data {
                token
                expiresIn
            }
        }
    }
`

// 用户APP登录
export const appLogin = gql`
    query appLogin($token: String, $mobile: String, $thirdUid: String) {
        appLogin(token: $token, mobile: $mobile, thirdUid: $thirdUid) {
            code
            message
            data {
                token
                expiresIn
                logoCloudEnable
                healthPackageEnable
                mId
            }
        }
    }
`

// 获取报告的ai解读状态
export const getAIState = gql`
    query getAIState($scanId: String) {
        getAIState(scanId: $scanId) {
            code
            message
            data {
                aiUrl
                abnormalKeywordInterpret
                abnormalConclusionInterpret
                abnormalOutlineInterpret
            }
        }
    }
`

// 获取最后一组扫描信息
export const findLatestScanTypeInfo = gql`
    query findLatestScanTypeInfo {
        findLatestScanTypeInfo {
            code
            message
            data {
                scanId
                memberId
                deviceId
                biaMeasure
                staticEval
                bsScanInfo {
                    scanId
                    percent
                    result
                    createTime
                    beginTime
                    endTime
                }
                bmBdaScanInfo {
                    scanId
                    percent
                    result
                    createTime
                    beginTime
                    endTime
                }
                bmBiaScanInfo {
                    result
                    percent
                }
                createTime
                viewStatus
                shoulderJointEval
                bsShoulderScanInfo {
                    result
                }
                girthMeasure
                scanMode
                questionReport
                nutrition
                teenagerReport
                mpRecommend
                spineReport
                bsSpineScanInfo{
                    result
                }
                isPillowRecommendReport
            }
        }
    }
`

// 获取当前扫描信息
export const findScanTypeInfo = gql`
    query findScanTypeInfo($scanId: String) {
        findScanTypeInfo(scanId: $scanId) {
            code
            message
            data {
                scanId
                memberId
                deviceId
                biaMeasure
                staticEval
                girthMeasure
                bsScanInfo {
                    scanId
                    percent
                    result
                    createTime
                    beginTime
                    endTime
                }
                bmBdaScanInfo {
                    scanId
                    percent
                    result
                    createTime
                    beginTime
                    endTime
                }
                bmBiaScanInfo {
                    result
                    percent
                }
                createTime
                viewStatus
                shoulderJointEval
                bsShoulderScanInfo {
                    result
                }
                girthMeasure
                scanMode
                questionReport
                nutrition
                teenagerReport
                mpRecommend
                spineReport
                isNewMathTt
                bsSpineScanInfo{
                    result
                }
                athlete
                isPillowRecommendReport
            }
        }
    }
`

// 模型生成失败判断是否拥有历史数据
export const findScanTrueHistory = gql`
    query findScanTrueHistory {
        findScanTrueHistory {
            code
            message
            data {
                scanId
                memberId
                memberId
                deviceId
                biaMeasure
                staticEval
                evalStatus
                bdaStatus
                biaStatus
                createTime
                bsShoulderStatus
                girthMeasure
                scanMode
                questionReport
                nutrition
                teenagerReport
                mpRecommend
                spineReport
                bsSpineStatus
                isPillowRecommendReport
            }
        }
    }
`

// 获取当前用户信息
export const getMemberInfo = gql`
    query getMemberInfo {
        getMemberInfo {
            code
            message
            data {
                id
                height
                age
                nickName
                avatar
                mobile
                sex
                birthday
                fatherHeight
                motherHeight
            }
        }
    }
`

// 根据扫描ID获取对应的用户信息
export const getMemberInfoByScanId = gql`
    query getMemberInfoByScanId($scanId: String) {
        getMemberInfoByScanId(scanId: $scanId) {
            code
            message
            data {
                memberId
                memberMobile
                memberSex
                memberAge
                memberHeight
                memberRemark
                memberName
                memberCode
                scanTime
                weight
            }
        }
    }
`

// 获取身体分数数据
export const findBodyScore = gql`
    query findBodyScore($scanId: String, $scanTime: Int, $scanType: Int) {
        findBodyScore(scanId: $scanId, scanTime: $scanTime, scanType: $scanType) {
            code
            message
            data {
                scanId
                bodyScore
                massLevel {
                    conclusion
                    advice
                }
                massScore
                evalLevel {
                    conclusion
                    advice
                }
                evalScore
                createTime
                massConScore
                evalConScore
            }
        }
    }
`

// 获取身体状态
export const findBodyState = gql`
    query findBodyState($scanId: String) {
        findBodyState(scanId: $scanId) {
            code
            message
            data {
                bodyShare
                WT {
                    l
                    m
                    h
                    v
                    status
                }
                PBF {
                    l
                    m
                    h
                    v
                    status
                }
                LM {
                    l
                    m
                    h
                    v
                    status
                }
            }
        }
    }
`

// 获取节段数据(脂肪&&肌肉)
export const bmSegInfo = gql`
    query bmSegInfo($scanId: String) {
        bmSegInfo(scanId: $scanId) {
            code
            message
            data {
                bmSegLM {
                    LMTR {
                        l
                        m
                        h
                        v
                        status
                    }
                    LMRA {
                        l
                        m
                        h
                        v
                        status
                    }
                    LMLA {
                        l
                        m
                        h
                        v
                        status
                    }
                    LMRL {
                        l
                        m
                        h
                        v
                        status
                    }
                    LMLL {
                        l
                        m
                        h
                        v
                        status
                    }
                }
                bmSegBFM {
                    BFMTR {
                        l
                        m
                        h
                        v
                        status
                    }
                    BFMRA {
                        l
                        m
                        h
                        v
                        status
                    }
                    BFMLA {
                        l
                        m
                        h
                        v
                        status
                    }
                    BFMRL {
                        l
                        m
                        h
                        v
                        status
                    }
                    BFMLL {
                        l
                        m
                        h
                        v
                        status
                    }
                }
            }
        }
    }
`

// 获取节段对比数据(脂肪&&肌肉)
export const bmSegContrastInfo = gql`
    query bmSegContrastInfo($memberId: Int, $scanId: String, $tcScanId: String) {
        bmSegContrastInfo(memberId: $memberId, scanId: $scanId, tcScanId: $tcScanId) {
            code
            message
            data {
                bmSegLMContrast {
                    LMTR {
                        v
                        tcV
                    }
                    LMRA {
                        v
                        tcV
                    }
                    LMLA {
                        v
                        tcV
                    }
                    LMRL {
                        v
                        tcV
                    }
                    LMLL {
                        v
                        tcV
                    }
                }
                bmSegBFMContrast {
                    BFMTR {
                        v
                        tcV
                    }
                    BFMRA {
                        v
                        tcV
                    }
                    BFMLA {
                        v
                        tcV
                    }
                    BFMRL {
                        v
                        tcV
                    }
                    BFMLL {
                        v
                        tcV
                    }
                }
            }
        }
    }
`
// vapro5获取体成分计算方式
export const findBmMassMeasureType = gql`
    query findBmMassMeasureType($scanId: String!) {
        findBmMassMeasureType(scanId: $scanId) {
            code
            message
            data
        }
    }
`

// 发起AI解读报告
export const solutions = gql`
    mutation solutions($scanId: String, $unit: String, $lang: String){
        solutions(scanId: $scanId, unit: $unit, lang: $lang) {
            code
            message
        }
    }
`

// 获取用户体测BIA合成成功历史记录
export const findBmBIAScanTrueHistory = gql`
    query findBmBIAScanTrueHistory($memberId: Int, $scanTime: Int, $measureType: Int) {
        findBmBIAScanTrueHistory(memberId: $memberId, scanTime: $scanTime, measureType: $measureType) {
            code
            message
            data {
                year
                data {
                    scanId
                    createDate
                    createTime
                    athlete
                }
            }
        }
    }
`

// 获取用户体态合成成功历史记录
export const findBsScanTrueHistory = gql`
    query findBsScanTrueHistory($memberId: Int, $scanTime: Int) {
        findBsScanTrueHistory(memberId: $memberId, scanTime: $scanTime) {
            code
            message
            data {
                year
                data {
                    scanId
                    createDate
                    createTime
                }
            }
        }
    }
`
// 获取用户腰腹合成成功历史记录
export const findBmWaistScanTrueHistory = gql`
    query findBmWaistScanTrueHistory($memberId: Int, $scanTime: Int) {
        findBmWaistScanTrueHistory(memberId: $memberId, scanTime: $scanTime) {
            code
            message
            data {
                year
                data {
                    scanId
                    createDate
                    createTime
                }
            }
        }
    }
`

// 获取围度对比信息
export const bmGirthContrasInfo = gql`
    query bmGirthContrasInfo($memberId: Int, $scanId: String, $tcScanId: String) {
        bmGirthContrasInfo(memberId: $memberId, scanId: $scanId, tcScanId: $tcScanId) {
            code
            message
            data {
                latestBmGirth {
                    bustGirth
                    waistGirth
                    hipGirth
                    leftUpperArmGirth
                    rightUpperArmGirth
                    leftThighGirth
                    rightThighGirth
                    leftCalfGirth
                    rightCalfGirth
                    height
                    neckGirth
                    leftMinThighGirth
                    rightMinThighGirth
                    midWaistGirth
                    lowWaistGirth
                    isNewMath
                }
                contrastBmGirth {
                    bustGirth
                    waistGirth
                    hipGirth
                    leftUpperArmGirth
                    rightUpperArmGirth
                    leftThighGirth
                    rightThighGirth
                    leftCalfGirth
                    rightCalfGirth
                    height
                    neckGirth
                    leftMinThighGirth
                    rightMinThighGirth
                    midWaistGirth
                    lowWaistGirth
                    isNewMath
                }
            }
        }
    }
`

export const bmwaistContrasInfo = gql`
    query bmwaistContrasInfo($memberId: Int, $scanId: String, $tcScanId: String) {
        bmwaistContrasInfo(memberId: $memberId, scanId: $scanId, tcScanId: $tcScanId) {
            code
            message
            data {
                latestBmWaist {
                    waistGirth1
                    waistGirth2
                    waistGirth3
                    waistGirth4
                    waistGirth5
                    waistGirth6
                    waistGirth7
                    waistGirth8
                    waistGirth9
                    waistGirth10
                    waistGirth11
                    waistVolume1
                    waistVolume2
                    waistVolume3
                    waistVolume4
                    waistVolume5
                    waistVolume6
                    waistVolume7
                    waistVolume8
                    waistVolume9
                    waistVolume10
                    backVolume
                    waistHipRatio
                    waistScore
                    hipGirth
                    pointList1
                    pointList2
                    pointList3
                    pointList4
                    pointList5
                    pointList6
                    pointList7
                    pointList8
                    pointList9
                    pointList10
                    pointList11
                    dataStatus
                }
                contrastBmWaist {
                    waistGirth1
                    waistGirth2
                    waistGirth3
                    waistGirth4
                    waistGirth5
                    waistGirth6
                    waistGirth7
                    waistGirth8
                    waistGirth9
                    waistGirth10
                    waistGirth11
                    waistVolume1
                    waistVolume2
                    waistVolume3
                    waistVolume4
                    waistVolume5
                    waistVolume6
                    waistVolume7
                    waistVolume8
                    waistVolume9
                    waistVolume10
                    backVolume
                    waistHipRatio
                    waistScore
                    hipGirth
                    pointList1
                    pointList2
                    pointList3
                    pointList4
                    pointList5
                    pointList6
                    pointList7
                    pointList8
                    pointList9
                    pointList10
                    pointList11
                    dataStatus
                }
            }
        }
    }
`

export const findBsDataStateInfo = gql`
query findBsDataStateInfo($scanId: String!) {
    findBsDataStateInfo(scanId: $scanId) {
        code
        message
        data {
            id
            scanId
            highLowShoudlerState
            headSlantState
            leftLegXoState
            rightLegXoState
            headForwardState
            pelvisForwardState
            legType
            leftKneeCheckState
            rightKneeCheckState
            leftRoundShoulderState
            rightRoundShoulderState
            hsVisualization
            pfsVisualization
        }
    }
}
`

// 根据scanId获取围度数据
export const bmGirthInfo = gql`
    query bmGirthInfo($scanId: String) {
        bmGirthInfo(scanId: $scanId) {
            code
            message
            data {
                bustGirth
                waistGirth
                hipGirth
                leftUpperArmGirth
                rightUpperArmGirth
                leftThighGirth
                rightThighGirth
                leftCalfGirth
                rightCalfGirth
                height
                neckGirth
                leftMinThighGirth
                rightMinThighGirth
                midWaistGirth
                lowWaistGirth
                isNewMath
            }
        }
    }
`

export const bmWaistInfo = gql`
    query bmWaistInfo($scanId: String) {
        bmWaistInfo(scanId: $scanId) {
            code
            message
            data {
                waistGirth1
                    waistGirth1
                    waistGirth2
                    waistGirth3
                    waistGirth4
                    waistGirth5
                    waistGirth6
                    waistGirth7
                    waistGirth8
                    waistGirth9
                    waistGirth10
                    waistGirth11
                    waistVolume1
                    waistVolume2
                    waistVolume3
                    waistVolume4
                    waistVolume5
                    waistVolume6
                    waistVolume7
                    waistVolume8
                    waistVolume9
                    waistVolume10
                    backVolume
                    waistHipRatio
                    waistScore
                    hipGirth
                    pointList1
                    pointList2
                    pointList3
                    pointList4
                    pointList5
                    pointList6
                    pointList7
                    pointList8
                    pointList9
                    pointList10
                    pointList11
                    dataStatus
                    oldUser
            }
        }
    }
`

// 获取体态评估数据
export const bsEvalInfo = gql`
    query bsEvalInfo($scanId: String) {
        bsEvalInfo(scanId: $scanId) {
            code
            message
            data {
                highLowShoudler
                headSlant
                headForward
                leftLegXo
                rightLegXo
                pelvisForward
                leftKneeCheck
                rightKneeCheck
                roundShoulderLeft
                roundShoulderRight
                pelvicForwardTilt
                legLengthDiff
                pelvicForwardTiltStatus
                isLegLengthDiff
            }
        }
    }
`

export const findBsEvalContrastInfo = gql`
    query findBsEvalContrastInfo($scanId: String!, $scanTime: Int!) {
        findBsEvalContrastInfo(scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                highLowShoudler
                headSlant
                headForward
                leftLegXo
                rightLegXo
                pelvisForward
                leftKneeCheck
                rightKneeCheck
                roundShoulderLeft
                roundShoulderRight
                pelvicForwardTilt
                legLengthDiff
                pelvicForwardTiltStatus
                isLegLengthDiff
            }
        }
    }
`

export const getScanIdGetInfo = gql`
    query getScanIdGetInfo($scanId: String!) {
        getScanIdGetInfo(scanId: $scanId) {
            code
            message
            data
        }
    }
`

// 获取身体调节数据(体型预测)
export const bodyAdjustInfo = gql`
    query bodyAdjustInfo($scanId: String) {
        bodyAdjustInfo(scanId: $scanId) {
            code
            message
            data {
                scanId
                weight
                bodyFat
                muscle
            }
        }
    }
`

// 获取体型预测合成结果
export const findBmPrediction = gql`
    query findBmPrediction($scanId: String) {
        findBmPrediction(scanId: $scanId) {
            code
            message
            data {
                result
            }
        }
    }
`

// 获取各体成分指标数据
export const findBmMassQuotaInfos = gql`
    query findBmMassQuotaInfos($memberId: Int!, $scanId: String!, $tcScanId: String) {
        findBmMassQuotaInfos(memberId: $memberId, scanId: $scanId, tcScanId: $tcScanId) {
            code
            message
            data {
                name
                dataColumn
                unit
                latestData {
                    l
                    m
                    h
                    v
                    status
                }
                contrastData {
                    l
                    m
                    h
                    v
                    status
                }
                order
            }
        }
    }
`

// 获取各体成分指标趋势对比数据
export const findBmMassQuotaTrend = gql`
    query findBmMassQuotaTrend($memberId: Int, $scanIds: [String]) {
        findBmMassQuotaTrend(memberId: $memberId, scanIds: $scanIds) {
            code
            message
            data {
                name
                dataColumn
                unit
                trendData {
                    l
                    m
                    h
                    v
                    status
                    measureTime
                    scanId
                }
                order
            }
        }
    }
`

// 获取围度趋势对比数据
export const findBmGirthTrend = gql`
    query getBmGirthTrend($scanIds: [String]!) {
        getBmGirthTrend(scanIds: $scanIds) {
            code
            message
            data {
                bustGirth {
                    value
                    scanTime
                }
                waistGirth {
                    value
                    scanTime
                }
                hipGirth {
                    value
                    scanTime
                }
                leftUpperArmGirth {
                    value
                    scanTime
                }
                rightUpperArmGirth {
                    value
                    scanTime
                }
                leftThighGirth {
                    value
                    scanTime
                }
                rightThighGirth {
                    value
                    scanTime
                }
                leftCalfGirth {
                    value
                    scanTime
                }
                rightCalfGirth {
                    value
                    scanTime
                }
                neckGirth {
                    value
                    scanTime
                }
                leftMinThighGirth {
                    value
                    scanTime
                }
                rightMinThighGirth {
                    value
                    scanTime
                }
                midWaistGirth {
                    value
                    scanTime
                }
                lowWaistGirth {
                    value
                    scanTime
                }
            }
        }
    }
`

// 根据scanId获取围度分析数据（返回各围度项目的 JSON 分析结果）
export const bmGirthAnalysis = gql`
    query bmGirthAnalysis($scanId: String) {
        bmGirthAnalysis(scanId: $scanId) {
            code
            message
            data {
                scanId
                bustAnalysis
                waistAnalysis
                hipAnalysis
                leftUpperArmAnalysis
                rightUpperArmAnalysis
                leftThighAnalysis
                rightThighAnalysis
                leftMidThighAnalysis
                rightMidThighAnalysis
                leftMinThighAnalysis
                rightMinThighAnalysis
                leftCalfAnalysis
                rightCalfAnalysis
                midWaistAnalysis
                lowWaistAnalysis
                neckAnalysis
            }
        }
    }
`

// 获取个性化设置列表
export const findAllQuotas = gql`
    query findAllQuotas($memberId: Int) {
        findAllQuotas(memberId: $memberId) {
            code
            message
            data {
                id
                memberId
                bmqId
                bmqName
                order
                state
            }
        }
    }
`

// 个性化设置列表选择操作
export const choiceQuota = gql`
    mutation choiceQuota($id: Int) {
        choiceQuota(id: $id) {
            code
            message
        }
    }
`

// 取消选择
export const deselectionQuota = gql`
    mutation deselectionQuota($id: Int, $order: Int, $memberId: Int) {
        deselectionQuota(id: $id, order: $order, memberId: $memberId) {
            code
            message
        }
    }
`

// 全选
export const checkAllQuota = gql`
    mutation checkAllQuota($memberId: Int) {
        checkAllQuota(memberId: $memberId) {
            code
            message
        }
    }
`

// 反选
export const deselectionAllQuota = gql`
    mutation deselectionAllQuota($memberId: Int) {
        deselectionAllQuota(memberId: $memberId) {
            code
            message
        }
    }
`

// 恢复默认
export const resetQuota = gql`
    mutation resetQuota($memberId: Int) {
        resetQuota(memberId: $memberId) {
            code
            message
        }
    }
`

// 拖动操作
export const dragQuota = gql`
    mutation dragQuota($memberId: Int, $id: Int, $order: Int, $targetOrder: Int) {
        dragQuota(memberId: $memberId, id: $id, order: $order, targetOrder: $targetOrder) {
            code
            message
        }
    }
`

// 模型接口
// 获取节段热力图信息
export const segTchartInfo = gql`
    query segTchartInfo($memberId: Int, $type: Int, $scanId: String, $tcScanId: String) {
        segTchartInfo(memberId: $memberId, type: $type, scanId: $scanId, tcScanId: $tcScanId) {
            code
            message
            data {
                stId
                scanId
                tcScanId
                compareDate
                result
                type
                fileFlag
                filePath
                picFlag
                picPath
                createtime
            }
        }
    }
`

// 获取体态模型文件
export const findBsScanFileInfos = gql`
    query findBsScanFileInfos($scanId: String) {
        findBsScanFileInfos(scanId: $scanId) {
            code
            message
            data {
                scanId
                fileFlag
                filePath
                fileType {
                    id
                    fileName
                    fileExt
                }
                createTime
            }
        }
    }
`

// 获取脊椎评估结论
export const findBsSpineData = gql`
    query findBsSpineData($scanId: String!) {
        findBsSpineData(scanId: $scanId) {
            code
            message
            data {
                c7Point
                s1Point
                gravityPoint
                backViewConclusion
                sideViewVonclusion
            }
        }
    }
`

// 获取体测模型文件
export const findBmScanFileInfos = gql`
    query findBmScanFileInfos($scanId: String) {
        findBmScanFileInfos(scanId: $scanId) {
            code
            message
            data {
                scanId
                fileFlag
                filePath
                fileType {
                    id
                    fileName
                    fileExt
                }
                createTime
            }
        }
    }
`

// 提交反馈内容
export const appFeedback = gql`
    mutation appFeedback($content: String!, $filePaths: [String]) {
        appFeedback(content: $content, filePaths: $filePaths) {
            code
            message
        }
    }
`

// 获取上传图片的授权信息
export const getPolicyAndSign = gql`
    query getPolicyAndSign($fileName: String!, $md5: String!) {
        getPolicyAndSign(fileName: $fileName, md5: $md5) {
            code
            message
            data {
                policy
                signature
                url
            }
        }
    }
`

// 更新微信用户个人信息
export const updateMemberInfo = gql`
    mutation updateMemberInfo(
        $nickName: String
        $sex: Int
        $height: Float
        $age: Int
        $mobile: String
        $birthday: String
        $fatherHeight: Int
        $motherHeight: Int
    ) {
        updateMemberInfo(
            nickName: $nickName
            sex: $sex
            height: $height
            age: $age
            mobile: $mobile
            birthday: $birthday
            fatherHeight: $fatherHeight
            motherHeight: $motherHeight
        ) {
            code
            message
        }
    }
`

// 修改手机号发送验证码
export const sendCode = gql`
    query sendCode($mobile: String!) {
        sendCode(mobile: $mobile) {
            code
            message
        }
    }
`

// 调用消息列表
export const findAppNoticeList = gql`
    query findAppNoticeList($pageNumber: Int, $pageSize: Int) {
        findAppNoticeList(pageNumber: $pageNumber, pageSize: $pageSize) {
            code
            message
            data {
                id
                title
                intro
                content
                sendTime
                readState
                createTime
            }
        }
    }
`

// 添加消息已读
export const addAppNoticeRead = gql`
    mutation addAppNoticeRead($noticeId: Int!) {
        addAppNoticeRead(noticeId: $noticeId) {
            code
            message
        }
    }
`

// 获取节段分布模型文件信息
export const getSegDisFileInfos = gql`
    query getSegDisFileInfos($scanId: String!) {
        getSegDisFileInfos(scanId: $scanId) {
            code
            message
            data {
                id
                scanId
                typeId
                fileFlag
                filePath
            }
        }
    }
`

// 获取节段对比模型文件信息
export const getSegConFileInfos = gql`
    query getSegConFileInfos($scanId: String!, $conDate: String!, $conScanId: String!) {
        getSegConFileInfos(scanId: $scanId, conDate: $conDate, conScanId: $conScanId) {
            code
            message
            data {
                id
                scanId
                typeId
                fileFlag
                filePath
            }
        }
    }
`

// 获取门店信息
export const findUserInfoByScanId = gql`
    query findUserInfoByScanId($scanId: String!) {
        findUserInfoByScanId(scanId: $scanId) {
            code
            message
            data {
                userId
                gymPhone
                gymAddr
                gymName
                qrcode
                enableAiReport
                girthShowNumber
            }
        }
    }
`

// 更新scanTypeInfo信息
export const updateScanTypeInfoRowByScanId = gql`
    query updateScanTypeInfoRowByScanId($scanId: String!, $viewStatus: Int) {
        updateScanTypeInfoRowByScanId(scanId: $scanId, viewStatus: $viewStatus) {
            code
            message
        }
    }
`

// 获取体态重心偏移数据
export const weightOffset = gql`
    query weightOffset($scanId: String) {
        weightOffset(scanId: $scanId) {
            code
            message
            data {
                weightA
                weightB
                weightC
                weightD
            }
        }
    }
`
// 获取肩部评估数据
export const findBsShoulderConclusion = gql`
    query findBsShoulderConclusion($scanId: String!, $scanTime: Int) {
        findBsShoulderConclusion(scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                shoulderInfo {
                    leftAbuction {
                        name
                        val
                        contrast
                        conclusion
                        limit
                    }
                    rightAbuction {
                        name
                        val
                        contrast
                        conclusion
                        limit
                    }
                    leftAntexion {
                        name
                        val
                        contrast
                        conclusion
                        limit
                    }
                    rightAntexion {
                        name
                        val
                        contrast
                        conclusion
                        limit
                    }
                }
                conclusion {
                    title
                    msg
                }
            }
        }
    }
`

// 生成AI报告解读
export const generateAiReport = gql`
    mutation generateAiReport($scanId: String!) {
        generateAiReport(scanId: $scanId) {
            code
            message
        }
    }
`

// 获取用户测量的历史记录
export const findUserMeasureHistory = gql`
    query findUserMeasureHistory {
        findUserMeasureHistory {
            code
            message
            data {
                year
                data {
                    scanId
                    createDate
                    createTime
                    biaMeasure
                    staticEval
                    shoulder
                    girthMeasure
                    biaStatus
                    bdaStatus
                    evalStatus
                    bsShoulderStatus
                    scanTime
                    deviceId
                    scanMode
                    questionReport
                    nutrition
                    
                    abnormalConclusionInterpret
                    abnormalOutlineInterpret
                    aiUrl

                    teenagerReport
                    mpRecommend
                    spineReport
                    bsSpineStatus
                    
                    isNewMathTt
                    isPillowRecommendReport
                }
            }
        }
    }
`
// 获取当前用户信息
export const findBmShapeInfo = gql`
    query findBmShapeInfo($scanId: String!) {
        findBmShapeInfo(scanId: $scanId) {
            code
            message
            data {
                row
                column
                shape
                description
                risk
            }
        }
    }
`

// 获取当前用户使用的设备信息
export const ifLogoCloudEnable = gql`
    query findDeviceInfo($deviceId: String) {
        findDeviceInfo(deviceId: $deviceId) {
            code
            message
            data {
                logoCloudEnable
                healthPackageEnable
                spineReportEnabled
                isPillowRecommendReport
            }
        }
    }
`

// 获取分享签名
export const getWechatSignature = gql`
    query getWechatSignature($url: String!) {
        getWechatSignature(url: $url) {
            code
            message
            data {
                url
                noncestr
                jsapi_ticket
                timestamp
                signature
                appid
                token
                title
                desc
                imgUrl
            }
        }
    }
`

// 获取分享签名 不带token 没有登录的界面获取微信签名
export const getSignature = gql`
    query getSignature($url: String!) {
        getSignature(url: $url) {
            code
            message
            data {
                url
                noncestr
                jsapi_ticket
                timestamp
                signature
                appid
                token
                title
                desc
                imgUrl
            }
        }
    }
`

// 根据scanId获取扫描记录
export const findScanTrueByScanId = gql`
    query findScanTrueByScanId($scanId: String!) {
        findScanTrueByScanId(scanId: $scanId) {
            code
            message
            data {
                scanId
                memberId
                deviceId
                biaMeasure
                staticEval
                girthMeasure
                bsScanInfo {
                    scanId
                    percent
                    result
                    createTime
                    beginTime
                    endTime
                }
                bmBdaScanInfo {
                    scanId
                    percent
                    result
                    createTime
                    beginTime
                    endTime
                }
                bmBiaScanInfo {
                    result
                    percent
                }
                createTime
                viewStatus
                shoulderJointEval
                bsShoulderScanInfo {
                    result
                }
                girthMeasure
                scanMode
                questionReport
            }
        }
    }
`

// 提交问卷信息
export const submitInfo = gql`
    query submitInfo(
        $scanId: String!
        $preStage: Int
        $gestationalAge: Float
        $postpartumDay: Int
        $isSuckle: Int
        $preWeight: Float
        $prenatalWeight: Float
        $studyTime: Int
        $otherTime: Int
        $exerciseTime: Int
        $exercisePatterns: String
        $gomutiMode: String
        $otherQuestion: String
    ) {
        submitInfo(
            scanId: $scanId
            preStage: $preStage
            gestationalAge: $gestationalAge
            postpartumDay: $postpartumDay
            isSuckle: $isSuckle
            preWeight: $preWeight
            prenatalWeight: $prenatalWeight
            studyTime: $studyTime
            otherTime: $otherTime
            exerciseTime: $exerciseTime
            exercisePatterns: $exercisePatterns
            gomutiMode: $gomutiMode
            otherQuestion: $otherQuestion
        ) {
            code
            message
            data
        }
    }
`

// 获取当前营养分析结论
export const getAnalysis = gql`
    query getAnalysis($scanId: String!) {
        getAnalysis(scanId: $scanId) {
            code
            message
            data {
                pregnancy
                BMR
                activityLevel
                activityRadio
                BMI
                weightAnalysis
                energyRequire
                fatRequire
                proteinRequire
                cRequires
                week
                stage
                nutritionAnalysis
                weightAdvice
                questionnaire {
                    otherQuestion
                }
            }
        }
    }
`
// 获取专项脊柱数据
export const obSpineConclusion = gql`
    query obSpineConclusion($scanId: String!) {
        obSpineConclusion(scanId: $scanId) {
            code
            message
            data {
                type
                structureAssessment{
                    spineScore,
                    spineStatus
                }
                spineDetail {
                    cervicalScore
                    cervicalStatus
                    thoracicScore
                    thoracicStatus
                    lumbarScore
                    lumbarStatus
                    headSlantState
                    headForwardState
                    highLowShoudlerState
                    legType
                    leftKneeCheckState
                    rightKneeCheckState
                }
                youthSpineDetail{
                    scoliosisScore,
                    scoliosisStatus,
                    youthIndex,
                    youthStatus,
                    loadScore,
                    postureStatus,
                    painScore,
                    painStatus,
                    balanceScore,
                    balanceStatus
                }
                mattressRec{
                    level
                    source
                    mattress
                }
                pillowRec{
                    pillowLevel
                    recommendation
                }
                painRisk {
                    cervicalPainScore
                    cervicalPainStatus
                    thoracicPainScore
                    thoracicPainStatus
                    lumbarPainScore
                    lumbarPainStatus
                }
                pelvicRisk {
                    pelvicTiltScore
                    pelvicTiltStatus
                    retroversionScore
                    retroversionStatus
                    rotationScore
                    rotationStatus
                }

            }
        }
    }
`
// 获取专项报告数据
// 25-06-03 作用于 脊柱专项报告 APIauthor: 范云波
export const getTeenagerReport = gql`
    query getTeenagerReport($scanId: String!) {
        getTeenagerReport(scanId: $scanId) {
            code
            message
            data {
                BMI,
                weightKg,
                conclusionLeval,
                sex,
                height,
                age,
                growthPotential{
                    fatherHeight
                    motherHeight
                    getGeneticScore
                    growthRateRatioScore
                    evalScore
                    BMIScore
                    geneticSpace
                    targetHeight
                    totalScore
                }
                suggestConclusion{
                    suggestion
                    personalizedRec
                    personExerciseRec
                }
            }
        }
    }
`



// 获取报告时的年龄
export const getScanIdAge = gql`
    query getScanIdAge($scanId: String) {
        getScanIdAge(scanId: $scanId) {
            code
            message
            data{
                age
            }
        }
    }
`


// 获取枕头问卷问题
export const getPillowQuestions = gql`
    query getPillowQuestions {
        getPillowQuestions {
            code
            message
            data {
                id
                question
                questionValue
                optionA
                optionAValue
                optionB
                optionBValue
                optionC
                optionCValue
                optionD
                optionDValue
                optionE
                optionEValue
                optionF
                optionFValue
                sortOrder
            }
        }
    }
`


// 提交枕头问卷
export const submitPillowQuestions = gql`
    query submitPillowQuestions(
        $scanId: String!
        $answers: String
    ) {
        submitPillowQuestions(
            scanId: $scanId
            answers: $answers
        ) {
            code
            message
            data
        }
    }
`

// 获取枕头问卷填写信息
export const getPillowReportQaByScanId = gql`
    query getPillowReportQaByScanId($scanId: String!) {
        getPillowReportQaByScanId(scanId: $scanId) {
            code
            message
            data {
                scanId,
                answers
            }
        }
    }
`

// 获取智眠报告数据
export const getPillowReportData = gql`
    query getPillowReportData(
        $scanId: String!
        $sleepPosition: String
        $mattressFirmness: String,
        $neckCurvature: String,
        $neckCurvatureQ1: String,
        $neckCurvatureQ2: String,
        $retry: Int
    ) {
        getPillowReportData(
            scanId: $scanId
            sleepPosition: $sleepPosition
            mattressFirmness: $mattressFirmness,
            neckCurvature: $neckCurvature,
            neckCurvatureQ1: $neckCurvatureQ1,
            neckCurvatureQ2: $neckCurvatureQ2,
            retry: $retry
        ) {
            code
            message
            data {
                spineScore
                spineStatus
                cervicalScore
                cervicalStatus
                thoracicScore
                thoracicStatus
                lumbarScore
                lumbarStatus
                measurements{
                    earWidth
                    neckWidth
                    shoulderWidth
                    headBackDistance
                    neckDepth
                    backDepth
                    headNeckHeight
                    headBackHeight
                }
                headWeight
                cervicalCurve
                pillowRecommendHeight
                pillowRecommendProducts{
                    series
                    image
                    productName
                    productCode
                    nominalHeight
                    description
                    mainMaterial
                    reboundClassification
                    matchScore
                    priority
                    userHealthData
                    id
                }
                status
            }
        }
    }
`

// 点赞获取报告
export const submitLike = gql`
    query submitLike($id: Int!, $userHealthData: Int!) {
        submitLike(id: $id, userHealthData: $userHealthData) {
            code
            message
        }
    }
`
