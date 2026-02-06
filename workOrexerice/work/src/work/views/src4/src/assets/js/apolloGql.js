import gql from 'graphql-tag'

// 用户登录
export const userLogin = gql`
    query userLogin($email: String!, $password: String!, $rememberMe: Boolean) {
        userLogin(email: $email, password: $password, rememberMe: $rememberMe) {
            code
            message
            bearerToken {
                token
                expiresIn
            }
        }
    }
`

// 密码设置
export const updatePassword = gql`
    mutation updatePassword($oldPassword: String!, $newPassword: String!) {
        updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
            code
            message
        }
    }
`

// 重置密码
export const resetPassword = gql`
    mutation resetPassword($email: String!) {
        resetPassword(email: $email) {
            code
            message
        }
    }
`

// 查询新合成任务数
export const findNewTaskCount = gql`
    query findNewTaskCount($lastTime: Int!) {
        findNewTaskCount(lastTime: $lastTime) {
            code
            message
            data {
                count
            }
        }
    }
`
// 查询新序列号合成任务数
export const findNewBindTaskCount = gql`
    query findNewBindTaskCount($lastTime: Int!) {
        findNewBindTaskCount(lastTime: $lastTime) {
            code
            message
            data {
                count
            }
        }
    }
`
// 查询任务状态
export const findTaskStatus = gql`
    query findTaskStatus($scanIds: [String]!) {
        findTaskStatus(scanIds: $scanIds) {
            code
            message
            data {
                scanId
                biaStatus
                bdaStatus
                evalStatus
                bsShoulderStatus
                bsSpineStatus
                scanMode
                questionReport
                weight
            }
        }
    }
`

// 查询任务列表
export const findTaskList = gql`
    query findTaskList($page: Int!, $take: Int!, $startDate: String, $endDate: String, $queryParam: String) {
        findTaskList(page: $page, take: $take, startDate: $startDate, endDate: $endDate, queryParam: $queryParam) {
            code
            message
            data {
                memberId
                memberSex
                memberAge
                memberMobile
                scanTime
                scanId
                biaStatus
                bdaStatus
                evalStatus
                memberBirthday
                memberNickName
                memberRemark
                wmId
                bsShoulderStatus
                memberName
                memberCode
                bsSpineStatus
                deviceId
                reportMode
                reptId
                memberType
                scanMode
                questionReport
                weight
                nutrition
                teenagerReport
                mpRecommend
                spineReport
                isNewMathTt
            }
            pagination {
                totalItems
                totalPages
                currentPage
            }
        }
    }
`
// 获取绑定任务列表
export const findBindTaskList = gql`
    query findBindTaskList($page: Int!, $take: Int!, $startDate: String, $endDate: String) {
        findBindTaskList(page: $page, take: $take, startDate: $startDate, endDate: $endDate) {
            code
            message
            data {
                reptId
                scanId
                scanTime
                biaMeasure
                staticEval
                bsShoulderStatus
                girthMeasure
                scanMode
                nutrition
                height
                teenagerReport
                spineReport
            }
            pagination {
                totalItems
                totalPages
                currentPage
            }
        }
    }
`

// 查询任务列表
export const findInterpretList = gql`
    query findInterpretList($page: Int!, $take: Int!, $startDate: String, $endDate: String, $queryParam: String) {
        findInterpretList(page: $page, take: $take, startDate: $startDate, endDate: $endDate, queryParam: $queryParam) {
            code
            message
            data {
                memberId
                memberSex
                memberAge
                memberMobile
                scanTime
                scanId
                biaStatus
                bdaStatus
                evalStatus
                memberBirthday
                memberNickName
                memberRemark
                wmId
                bsShoulderStatus
                memberName
                memberCode
                bsSpineStatus
                bmInterpretStatus
                bsInterpretStatus
                exerciseAdviceStatus
                dietAdviceStatus
            }
            pagination {
                totalItems
                totalPages
                currentPage
            }
        }
    }
`

// 查询任务状态
export const findInterpretStatus = gql`
    query findInterpretStatus($scanIds: [String]!) {
        findInterpretStatus(scanIds: $scanIds) {
            code
            message
            data {
                scanId
                bmInterpretStatus
                bsInterpretStatus
                exerciseAdviceStatus
                dietAdviceStatus
            }
        }
    }
`

// 获取本次和上次的身体成分(结果&&分析)数据
export const bmMassContrastInfo = gql`
    query bmMassContrastInfo($memberId: Int, $scanId: String, $scanTime: String) {
        bmMassContrastInfo(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                PROTEIN {
                    l
                    m
                    h
                    v
                    status
                }
                TM {
                    l
                    m
                    h
                    v
                    status
                }
                WT {
                    l
                    m
                    h
                    v
                    status
                }
                FFM {
                    l
                    m
                    h
                    v
                    status
                }
                BFM {
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
                TBW {
                    l
                    m
                    h
                    v
                    status
                }
                SM {
                    l
                    m
                    h
                    v
                    status
                }
                BMI {
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
                BMR {
                    l
                    m
                    h
                    v
                    status
                }
                WHR {
                    l
                    m
                    h
                    v
                    status
                }
                PTBW {
                    l
                    m
                    h
                    v
                    status
                }
                PLM {
                    l
                    m
                    h
                    v
                    status
                }
                ICW {
                    l
                    m
                    h
                    v
                    status
                }
                ECW {
                    l
                    m
                    h
                    v
                    status
                }
                METABOLICAGE {
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

// 获取消息列表
export const findCmsMessageList = gql`
    query findCmsMessageList($page: Int, $pageSize: Int) {
        findCmsMessageList(pageNumber: $page, pageSize: $pageSize) {
            code
            message
            data {
                cmsMessageArr {
                    id
                    adminId
                    title
                    intro
                    content
                    sendTime
                    readState
                    createTime
                }
                unreadSum
                count
            }
        }
    }
`
// 获取本次和上次的围度信息
export const bmGirthContrastInfo = gql`
    query bmGirthContrastInfo($memberId: Int, $scanId: String, $scanTime: String) {
        bmGirthContrastInfo(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                scanId
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
            }
        }
    }
`

// 获取体态相关扫描模型文件
export const bsScanFileInfos = gql`
    query bsScanFileInfos($scanId: String) {
        bsScanFileInfos(scanId: $scanId) {
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
            }
        }
    }
`
// 获取体态评估建议及结论
export const bsEvalConclusion = gql`
    query bsEvalConclusion($scanId: String!) {
        bsEvalConclusion(scanId: $scanId) {
            code
            message
            data {
                headForward {
                    conclusion
                }
                headSlant {
                    conclusion
                }
                roundShoulderLeft {
                    conclusion
                }
                roundShoulderRight {
                    conclusion
                }
                highLowShoudler {
                    conclusion
                }
                pelvisForward {
                    conclusion
                }
                leftKneeCheck {
                    conclusion
                }
                rightKneeCheck {
                    conclusion
                }
                legXo {
                    conclusion
                }
            }
        }
    }
`

// 获取用户信息
export const findUserInfo = gql`
    query findUserInfo {
        findUserInfo {
            code
            message
            data {
                userId
                perm {
                    app
                    api
                }
                managerName
                managerPhone
                email
                gymPhone
                gymAddr
                speAddress
                gymName
                vfId
                vfSecret
                logoUrl
                name
                dataStorageExpireDate
                createTime
                renewalStatus
                deviceId
                diffExpireDay
                companyName
                mode
                methodId
                enableAiReport
                reportListIdEncryption
                pdfIdEncryption
                reportMode,
                girthShowNumber,
                companyId,
                healthPackageEnable,
                postureProjectEnable,
                deviceId,
                spineReportEnabled,
                isTeenagerReport,
                mattressPillowRecommend,
                reportTitle
            }
        }
    }
`

// 更新用户信息
export const updateUserInfo = gql`
    mutation updateUserInfo(
        $managerName: String!
        $managerPhone: String!
        $gymPhone: String!
        $gymAddr: String!
        $gymName: String!
        $logoUrl: String!
        $speAddress: String!
        $reportListIdEncryption: Int
        $pdfIdEncryption: Int
        $girthShowNumber: Int
        $postureProjectEnable: Int
    ) {
        updateUserInfo(
            managerName: $managerName
            managerPhone: $managerPhone
            gymPhone: $gymPhone
            gymAddr: $gymAddr
            gymName: $gymName
            logoUrl: $logoUrl
            speAddress: $speAddress
            reportListIdEncryption: $reportListIdEncryption
            pdfIdEncryption: $pdfIdEncryption
            girthShowNumber: $girthShowNumber
            postureProjectEnable: $postureProjectEnable
        ) {
            code
            message
        }
    }
`

// 更新用户有效期时间
export const updateExpireDate = gql`
    mutation updateExpireDate($dataStorageExpireDate: String!) {
        updateExpireDate(dataStorageExpireDate: $dataStorageExpireDate) {
            code
            message
        }
    }
`

// 添加消息已读
export const addCmsMessageRead = gql`
    mutation addCmsMessageRead($messageId: Int!) {
        addCmsMessageRead(messageId: $messageId) {
            code
            message
        }
    }
`
// 获取对接当前公众号的设备数
export const getApiSnNum = gql`
    query getApiSnNum($typeId: Int!) {
        getApiSnNum(typeId: $typeId) {
            code
            message
            data {
                snNumber
            }
        }
    }
`

// 查询当前刚配置好的公众号
export const findDeviceTypeInfo = gql`
    query findDeviceTypeInfo($redirectUri: String) {
        findDeviceTypeInfo(redirectUri: $redirectUri) {
            code
            message
            data {
                id
                appId
                appSecret
                appName
                appType
                mpUrl
                qrcode
                jumpLink
                loginUrl
                synBodyInfoUrl
                tokenUrl
                userinfoUrl
                accessKey
                accessSecret
                dockingWechat
                dockingApi
                dockingCard
                dockingApp
                qrcodeUrl
                dockingUrl
                dockingEncoding
                dockingFace
                faceUrl
                reportFetchMode
                reportPushUrl
            }
        }
    }
`

// 获取pdf文件路径
export const getReportFileUrl = gql`
    query getReportFileUrl($scanId: String) {
        getReportFileUrl(scanId: $scanId) {
            code
            message
            data
        }
    }
`

// 信息配置接入
export const generateMemberAuthEntrance = gql`
    mutation generateMemberAuthEntrance($redirectUri: String!, $type: Int!, $deviceTypeInfo: DeviceTypeInfo!) {
        generateMemberAuthEntrance(redirectUri: $redirectUri, type: $type, deviceTypeInfo: $deviceTypeInfo) {
            code
            message
            data
        }
    }
`

// 修改接入绑定信息
export const editGenerateMemberAuthEntrance = gql`
    mutation editGenerateMemberAuthEntrance($redirectUri: String!, $type: Int!, $deviceTypeInfo: DeviceTypeInfo!) {
        editGenerateMemberAuthEntrance(redirectUri: $redirectUri, type: $type, deviceTypeInfo: $deviceTypeInfo) {
            code
            message
            data
        }
    }
`

// 解除绑定
export const removeDeviceTypeInfo = gql`
    mutation removeDeviceTypeInfo($dockingType: Int!) {
        removeDeviceTypeInfo(dockingType: $dockingType) {
            code
            message
        }
    }
`

// API对接设置
export const apiSetting = gql`
    mutation apiSetting(
        $tokenUrl: String!
        $reportFetchMode: Int!
        $faceUrl: String
        $loginUrl: String
        $synbodyinfoUrl: String!
        $qrcodeUrl: String
        $userinfoUrl: String
        $reportPushUrl: String
    ) {
        apiSetting(
            tokenUrl: $tokenUrl
            reportFetchMode: $reportFetchMode
            faceUrl: $faceUrl
            loginUrl: $loginUrl
            synbodyinfoUrl: $synbodyinfoUrl
            qrcodeUrl: $qrcodeUrl
            userinfoUrl: $userinfoUrl
            reportPushUrl: $reportPushUrl
        ) {
            code
            message
        }
    }
`

// APP对接设置
export const appSetting = gql`
    mutation appSetting($tokenUrl: String!, $userinfoUrl: String!) {
        appSetting(tokenUrl: $tokenUrl, userinfoUrl: $userinfoUrl) {
            code
            message
        }
    }
`

// 修改用户信息
export const updateMemberInfo = gql`
    mutation updateMemberInfo($wmId: Int!, $remark: String!) {
        updateMemberInfo(wmId: $wmId, remark: $remark) {
            code
            message
        }
    }
`

// 获取肩部评估风险
export const bsShoulderConclusion = gql`
    query bsShoulderConclusion($memberId: Int, $scanId: String!, $scanTime: String) {
        bsShoulderConclusion(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
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

// 获取用户信息根据绑定id（mobile）和设备id
export const getMemberInfoByBindId = gql`
    query getMemberInfoByBindId($mobile: String, $deviceId: String!) {
        getMemberInfoByBindId(mobile: $mobile, deviceId: $deviceId) {
            code
            message
            data {
                id
                mobile
                height
                sex
                birthday
                type
                name
                fatherHeight
                motherHeight
            }
        }
    }
`
// 绑定用户信息
export const bindMemberInfo = gql`
    mutation bindMemberInfo($scanId: String!, $member: MemberInput) {
        bindMemberInfo(scanId: $scanId, member: $member) {
            code
            message
        }
    }
`
// 更新序列号用户信息
export const updateBindMemberInfo = gql`
    mutation updateBindMemberInfo($id: Int!, $name: String!) {
        updateBindMemberInfo(id: $id, name: $name) {
            code
            message
        }
    }
`

// 修改标准设置
export const findDeviceIdStatus = gql`
    query findDeviceIdStatus($deviceId: String!) {
        findDeviceIdStatus(deviceId: $deviceId) {
            code
            message
            biaStandard
        }
    }
`

// 修改标准设置
export const findDeviceIdRecords = gql`
    query findDeviceIdRecords($deviceId: String!) {
        findDeviceIdRecords(deviceId: $deviceId) {
            code
            message
            data {
                operationTime
                preStandard
                currStandard
            }
        }
    }
`

// 修改标准设置
export const updateDeviceIdStatus = gql`
    mutation updateDeviceIdStatus($deviceId: String!, $biaStandard: Int!, $preStandard: Int!) {
        updateDeviceIdStatus(deviceId: $deviceId, biaStandard: $biaStandard, preStandard: $preStandard) {
            code
            message
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
        $wmId: Int
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
            wmId: $wmId
        ) {
            code
            message
            data
        }
    }
`
