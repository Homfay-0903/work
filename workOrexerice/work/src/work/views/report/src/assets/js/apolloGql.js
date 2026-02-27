import gql from 'graphql-tag'

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

// 获取各体成分指标数据
export const bmMassQuotaInfos = gql`
    query bmMassQuotaInfos($memberId: Int, $scanId: String, $scanTime: String) {
        bmMassQuotaInfos(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                bmMassResult {
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
                }
                bmMassAnalysis {
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
                }
            }
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

// 获取身体调节数据
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

// 获取节段（肌肉&&脂肪）数据
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

// 获取身体状态相关信息
export const bodyState = gql`
    query bodyState($memberId: Int, $scanId: String, $scanTime: String) {
        bodyState(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                bodyAge
                vaGrade
            }
        }
    }
`

// 获取身体分数和对比
export const bodyScore = gql`
    query bodyScore($memberId: Int, $scanId: String, $scanTime: String, $scanType: Int) {
        bodyScore(memberId: $memberId, scanId: $scanId, scanTime: $scanTime, scanType: $scanType) {
            code
            message
            data {
                massScore
                evalScore
                preMassScore
                preEvalScore
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
                girthShowNumber
                healthPackageEnable
            }
        }
    }
`
export const bmwaistContrasInfo = gql`
    query bmwaistContrasInfo($memberId: Int, $scanId: String, $scanTime: String) {
        bmwaistContrasInfo(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                latestBmWaist {
                    scanId
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
                    scanId
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
// 获取围度点位信息
export const bmBdaPointInfos = gql`
    query bmBdaPointInfos($memberId: Int, $scanId: String, $scanTime: String) {
        bmBdaPointInfos(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                bustGirthPoint
                waistGirthPoint
                hipGirthPoint
                leftUpperArmGirthPoint
                rightUpperArmGirthPoint
                leftThighGirthPoint
                rightThighGirthPoint
                leftCalfGirthPoint
                rightCalfGirthPoint
                neckGirthPoint
                leftMinThighGirthPoint
                rightMinThighGirthPoint
                midWaistGirthPoint
                lowWaistGirthPoint
                waistGirth2Point
                waistGirth3Point
                waistGirth5Point
                waistGirth6Point
                waistGirth4Point
                waistGirth7Point
                waistGirth8Point
                waistGirth9Point
                waistGirth10Point
                dataStatus
            }
        }
    }
`
// 扫描用户信息
export const getMemberInfo = gql`
    query getMemberInfo($scanId: String) {
        getMemberInfo(scanId: $scanId) {
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
                memberType
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
                isNewMath
            }
        }
    }
`

// 围度分析（bm_girth_analysis 表），各字段为 JSON 字符串
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
// 获取体态评估数据
export const bsEvalInfo = gql`
    query bsEvalInfo($memberId: Int, $scanId: String, $scanTime: String) {
        bsEvalInfo(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
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
            }
        }
    }
`

// 获取体态评估风险&结论&对比
export const getBsConclusion = gql`
    query bsEvalConclusion($memberId: Int, $scanId: String!, $scanTime: String) {
        bsEvalConclusion(memberId: $memberId, scanId: $scanId, scanTime: $scanTime) {
            code
            message
            data {
                headForward {
                    val
                    contrast
                    conclusion
                    risk
                }
                roundShoulderLeft {
                    val
                    contrast
                    conclusion
                    risk
                }
                roundShoulderRight {
                    val
                    contrast
                    conclusion
                    risk
                }
                headSlant {
                    val
                    contrast
                    conclusion
                    risk
                }
                highLowShoudler {
                    val
                    contrast
                    conclusion
                    risk
                }
                pelvisForward {
                    val
                    contrast
                    conclusion
                    risk
                }
                leftKneeCheck {
                    val
                    contrast
                    conclusion
                    risk
                }
                rightKneeCheck {
                    val
                    contrast
                    conclusion
                    risk
                }
                legXo {
                    leftVal
                    leftContrast
                    rightVal
                    rightContrast
                    conclusion
                    risk
                }
                pelvicForwardTilt {
                    status
                    val
                    contrast
                    conclusion
                    risk
                }
                legLengthDiff {
                    status
                    val
                    contrast
                    conclusion
                    risk
                }
                isNewMathTt
            }
        }
    }
`

// 获取围度趋势信息
export const bmGirthTrendInfo = gql`
    query bmGirthTrendInfo($memberId: Int, $scanTime: String, $deviceId: String) {
        bmGirthTrendInfo(memberId: $memberId, scanTime: $scanTime, deviceId: $deviceId) {
            code
            message
            data {
                scanTime
                result
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
                }
            }
        }
    }
`

// 获取身体成分趋势
export const bmMassTrendInfo = gql`
    query bmMassTrendInfo($memberId: Int, $scanTime: String, $deviceId: String, $scanId: String) {
        bmMassTrendInfo(memberId: $memberId, scanTime: $scanTime, deviceId: $deviceId, scanId: $scanId) {
            code
            message
            data {
                scanTime
                result
                data {
                    WT {
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
    }
`

// 获取体测相关扫描模型文件
export const bmScanFileInfos = gql`
    query bmScanFileInfos($scanId: String) {
        bmScanFileInfos(scanId: $scanId) {
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

// 用户登陆
export const userLogin = gql`
    query userLogin($email: String!, $password: String!) {
        userLogin(email: $email, password: $password) {
            code
            message
            bearerToken {
                token
                expiresIn
            }
        }
    }
`

// 通过scanId获取扫描相关信息
export const findScanAdditionalInfo = gql`
    query findScanAdditionalInfo($scanId: String!) {
        findScanAdditionalInfo(scanId: $scanId) {
            code
            message
            data {
                scanId
                memberId
                scanTime
                evalStatus
                biaStatus
                bdaStatus
                deviceId
                bsShoulderStatus
                bsSpineStatus
                reportMode
                scanMode
                questionReport
                weight
                nutrition
                spineReport
                teenagerReport
                mpRecommend
                reportTitle
                isNewMathTt
                athlete
            }
        }
    }
`

// 获取用户信息
export const findUserInfoByScanId = gql`
    query findUserInfoByScanId($scanId: String!) {
        findUserInfoByScanId(scanId: $scanId) {
            code
            message
            data {
                userId
                gymPhone
                gymAddr
                speAddress
                gymName
                qrcode
                logoUrl
                reportListIdEncryption
                pdfIdEncryption
                methodId
                girthShowNumber
                healthPackageEnable
                watermark
            }
        }
    }
`

// 获取体态肩关节评估风险评估
export const findBsShoulderConclusion = gql`
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

// 获取体态肩关节评估风险评估
export const findBsSpineConclusion = gql`
    query bsSpineConclusion($scanId: String) {
        bsSpineConclusion(scanId: $scanId) {
            code
            message
            data {
                scoliosis {
                    data {
                        shoulderHeightDiff
                        hipHeightDiff
                        headDeviation
                        torsoDeviation
                    }
                    abnormalItems
                    riskLevel
                    riskTip
                }
                muscleAnalysis {
                    abnormalPosture
                    muscle {
                        tenseMuscle
                        weakMuscle
                    }
                    advise
                }
            }
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
// 获取专项报告数据
// 25-06-03 作用于 脊柱专项报告 APIauthor: 范云波
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
                    highLowShoudlerState
                    legType
                    leftKneeCheckState
                    rightKneeCheckState
                    headForwardState
                    
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