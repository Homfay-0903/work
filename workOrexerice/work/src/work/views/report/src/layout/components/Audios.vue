<template>
    <div class="content" hidden>
        <audio
            v-for="(item, idx) in audioList"
            :key="`audio-${idx}`"
            :id="`audio-${item.file}`"
            :src="`media-file://audio/${
                deviceInfo.teenagerIsOpen
                    ? 'teenager'
                    : (item.file === 'projectCK' || item.file === 'welcome_a') && deviceInfo.healthPackageEnable === 2
                    ? 'mailande'
                    : $i18n.locale
            }/${item.file}.mp3`"
            @ended="playEnd(item.file)"
            controls="controls"
            preload
            hidden
        ></audio>
        <audio
            v-for="(item, idx) in effectList"
            :key="`effect-${idx}`"
            :id="`audio-${item.file}`"
            :src="`media-file://audio/${item.file}.mp3`"
            controls="controls"
            preload
            hidden
        ></audio>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Audios',
    data() {
        return {
            // 当前播放的音频ID
            // 播放结束后会置为null
            playingFile: null,
            audioDuration: null,
            // 音效列表
            effectList: [
                {
                    msg: '按钮音效',
                    file: 'btnEffect'
                },
                {
                    msg: '手势识别音效',
                    file: 'gestureEffect'
                }
            ],
            // 音频列表
            audioList: [
                // 项目选择页
                {
                    msg: '上下键选择',
                    file: 'selectBtn'
                },
                {
                    msg: '仅身体成分',
                    file: 'bmSelectBtn'
                },
                {
                    msg: '动态实验室-仅肩部',
                    file: 'shoulderSelectShd'
                },
                // 项目选择引导页面
                {
                    msg: '体态评估、身体成分、肩部项目均正常',
                    file: 'selectGuideAllNormal'
                },
                {
                    msg: '体成分&体态',
                    file: 'selectGuideAllNormal2_touch'
                },
                {
                    msg: '仅身身体成分正常',
                    file: 'selectGuideOnlyBm'
                },
                {
                    msg: '仅身身体成分正常',
                    file: 'selectGuideOnlyBm'
                },
                {
                    msg: '除体重其他正常',
                    file: 'selectGuideOnlyBm_a'
                },
                {
                    msg: '体态&肩部功能正常',
                    file: 'selectGuideBsAndShd'
                },
                {
                    msg: '体成分&肩部',
                    file: 'selectGuideBmAndShd'
                },
                {
                    msg: '仅肩部正常',
                    file: 'selectGuideOnlyShd'
                },
                // 自检
                {
                    msg: '设备自检中',
                    file: 'checkSelfInit'
                },
                {
                    msg: '设备自检中, 请勿站上状态...',
                    file: 'checkSelfInit1'
                },
                {
                    msg: '设备初始化中, 请勿站上状态...',
                    file: 'deviceInt'
                },
                {
                    msg: '设备服务中',
                    file: 'deviceRec'
                },
                {
                    msg: '网络异常',
                    file: 'networkAnomaly'
                },
                {
                    msg: '欢迎体验维塑3D智能体测精灵',
                    file: 'welcome'
                },
                {
                    msg: '欢迎体验维塑3D智能体测镜',
                    file: 'welcome_a'
                },
                // 项目选择
                {
                    msg: '重复使用 - 金属电极片引导',
                    file: 'standPeopleGuide'
                },
                // 项目选择
                {
                    msg: '体成分测量 - 金属电极片引导',
                    file: 'standPeopleGuideForMass'
                },
                {
                    msg: '体重测量 - 动作引导',
                    file: 'weightGuide'
                },
                {
                    msg: '体重测量 - 保持静止',
                    file: 'weightStatic'
                },
                {
                    msg: '体重测量 - 体重测量成功',
                    file: 'weightSuccess'
                },
                {
                    msg: '身体成分测量 - 动作引导1',
                    file: 'massGuide1'
                },
                {
                    msg: '身体成分测量 - 动作引导2',
                    file: 'massGuide2'
                },
                {
                    msg: '身体成分测量 - 动作引导3',
                    file: 'massGuide3'
                },
                {
                    msg: '身体成分测量 - 动作引导4',
                    file: 'massGuide4'
                },
                {
                    msg: '身体成分测量 - 测量中背景音效',
                    file: 'massScanningBG'
                },
                // {
                //     msg: '身体成分测量 - 测量中提醒 - 保持身体静止',
                //     file: 'massScanningTip'
                // },
                // {
                //     msg: '身体成分测量 - 保持静止 - 体脂测量失败后再次提醒',
                //     file: 'massRemainStatic'
                // },
                {
                    msg: '身体成分测量 - 测量完成离开金属电极片',
                    file: 'massFinish'
                },
                // {
                //     msg: '身体成分测量 - 测量成功',
                //     file: 'massSuccess'
                // },
                // {
                //     msg: '重新测量 - 体重/体成分测量失败 站人情况下',
                //     file: 'massFail'
                // },
                // {
                //     msg: '重新测量 - 体重/体成分测量失败 未站人情况下',
                //     file: 'massFailNoStand'
                // },
                {
                    msg: '重复使用 - 测量失败，请按返回键结束测量',
                    file: 'scanErrorEndScan'
                },
                {
                    msg: '重复使用 - 测量失败，请按确认键查看测量报告',
                    file: 'scanErrorViewReportBtn'
                },
                {
                    msg: '重复使用 - 测量失败，请举起左右查看测量报告',
                    file: 'scanErrorViewReportGesture'
                },
                {
                    msg: '重复使用 - 体重/体成分测量失败可重新测量 站人情况下',
                    file: 'weightFail'
                },
                {
                    msg: '重复使用 - 体重/体成分测量失败可重新测量 未站人情况下',
                    file: 'weightFailNoStand'
                },
                // {
                //     msg: '身体成分测量 - 按钮选择',
                //     file: 'bodyBtn'
                // },
                {
                    msg: '身体成分测量 - 测量中',
                    file: 'bodyScaning'
                },
                {
                    msg: '重复使用 - 启动测量倒计时 - 3秒',
                    file: 'countDown'
                },
                {
                    msg: '保持静止',
                    file: 'bodyRemainStatic'
                },
                // {
                //     msg: '测量成功',
                //     file: 'bodySuccess'
                // },
                {
                    msg: '上下键选择',
                    file: 'continueScanBtn'
                },
                {
                    msg: '手势选择',
                    file: 'continueScanGesture_touch'
                },
                {
                    msg: '选择体围',
                    file: 'continueScanGirthBtn_touch'
                },
                {
                    msg: ' 继续测量选择页-手势模式-没有触屏 ',
                    file: 'continueScanGesture'
                },
                {
                    msg: ' 请举起对应手臂选择是否继续测量 ',
                    file: 'continueScanGesture_a'
                },
                // {
                //     msg: ' 继续测量选择页-手势模式 ',
                //     file: 'continueScanGesture2'
                // },
                {
                    msg: '体态评估引导静态语音',
                    file: 'guideTurntable'
                },
                {
                    msg: '请双手握拳并自然打开 30° 角、保持静止两秒',
                    file: 'aposeStayStill_a'
                },
                {
                    msg: '请缓慢地缩小双臂角度',
                    file: 'aposeFall'
                },
                {
                    msg: '请缓慢地增大双臂角度',
                    file: 'aposeRaise'
                },
                // 体态评估&体围
                {
                    msg: '重复使用 - 体态、体围启动测量倒计时 - 4秒',
                    file: 'shapeCountDown'
                },
                {
                    msg: '体态评估测量 - 周围站人提醒',
                    file: 'shapeAroundPeople'
                },
                {
                    msg: '体态评估测量 - 测量中 - 保持身体静止',
                    file: 'shapeScanningTip'
                },
                {
                    msg: '体围测量 - 测量中 - 保持身体静止',
                    file: 'girthScanningTip'
                },
                {
                    msg: '重复使用 - 体态、体围测量中背景音效',
                    file: 'shapeScanningBG'
                },
                {
                    msg: '重复使用 - 体态、体围测量一半后提醒语音 - 继续保持身体静止',
                    file: 'shapeScanningHalfTip'
                },
                {
                    msg: '体态评估测量 - 测量完成',
                    file: 'shapeFinish'
                },
                {
                    msg: '项目选择页 -- 体态评估正常',
                    file: 'bsSelectBtn'
                },
                {
                    msg: '项目引导选择页面 - 仅体态正常',
                    file: 'selectGuideOnlyBs'
                },
                // 肩部测量
                // {
                //     msg: '3、2、1 启动测量倒计时',
                //     file: 'shoulerCountDown'
                // },
                // {
                //     msg: '测量完成获取报告',
                //     file: 'scanFinish'
                // },
                {
                    msg: '请自然站立-静止2s',
                    file: 'shoulderStartEnter'
                },
                {
                    msg: '5s 后请自然站立-静止2s',
                    file: 'shoulderStartEnter1'
                },
                {
                    msg: '即将启动测量',
                    file: 'aboutToStart'
                },
                {
                    msg: '测量失败 - 请按返回键结束测量',
                    file: 'failEndScan'
                },
                // {
                //     msg: '测量失败 - 请按确认键查看测量报告',
                //     file: 'failViewReportBtn'
                // },
                // {
                //     msg: '测量失败 - 请按确认键查看测量报告',
                //     file: 'failViewReportGesture'
                // },
                {
                    msg: '测量失败 - 请按上下键选择是否重新测量',
                    file: 'failReScanBtn'
                },
                {
                    msg: '测量失败 - 请举起对应手臂选择是否重新测量',
                    file: 'failReScanGesture'
                },
                {
                    msg: '启动失败 - 请按上下键选择是否重新测量',
                    file: 'startUpErrorFailReScanBtn_touch'
                },
                {
                    msg: '启动失败 - 请举起对应手臂选择是否重新测量',
                    file: 'startUpErrorFailReScanGesture'
                },
                // {
                //     msg: '人离开 - 继续测量',
                //     file: 'leaveContinueScan'
                // },
                {
                    msg: '肩部测量 外展左启动测量引导',
                    file: 'shoulderAbductionLeftStart'
                },
                {
                    msg: '肩部测量 外展左启动测量引导（5s后）',
                    file: 'shoulderAbductionLeftStart5s'
                },
                {
                    msg: '肩部测量 外展右启动测量引导',
                    file: 'shoulderAbductionRightStart'
                },
                {
                    msg: '肩部测量 外展右启动测量引导（5s后）',
                    file: 'shoulderAbductionRightStart5s'
                },
                {
                    msg: '肩部测量 前屈右启动测量引导',
                    file: 'shoulderAntexionRightStart'
                },
                {
                    msg: '肩部测量 前屈右启动测量引导（5s后）',
                    file: 'shoulderAntexionRightStart5s'
                },
                {
                    msg: '获取报告 - 二维码 - 扫码成功打印报告',
                    file: 'printByQrcode'
                },
                {
                    msg: '获取报告 - 二维码 - 获取二维码失败',
                    file: 'getQrcodeFail'
                },
                {
                    msg: '肩部测量 测量结果展示',
                    file: 'shoulderScanResult'
                },
                {
                    msg: '肩部测量 前屈左启动测量引导',
                    file: 'shoulderAntexionLeftStart'
                },
                {
                    msg: '肩部测量 前屈左启动测量引导（5s后）',
                    file: 'shoulderAntexionLeftStart5s'
                },
                // {
                //     msg: '周围站人提醒',
                //     file: 'aroundPeople'
                // },
                {
                    msg: '肩部测量 外展测量完成 准备进入下一项',
                    file: 'shoulderAbductionSuccess'
                },
                // {
                //     msg: '肩部测量 前屈测量完成 准备进入下一项',
                //     file: 'shoulderAntexionSuccess'
                // },
                {
                    msg: '测量失败 - 查看报告',
                    file: 'failViewReport'
                },
                {
                    msg: '获取报告 - 手环',
                    file: 'getReportByCard'
                },

                // 继续测量选择页
                {
                    msg: '新用户 - 报告将在注册完成后生成 xxx',
                    file: 'addPrintNewUser'
                },
                {
                    msg: '老用户 - 已加入打印队列请耐心等待报告生成',
                    file: 'addPrintOldUser'
                },
                {
                    msg: '加入打印队列 - 打印机状态异常',
                    file: 'printError'
                },

                {
                    msg: '设备正在使用中',
                    file: 'shutDownInUse'
                },
                {
                    msg: '提醒有任务',
                    file: 'shutDownTask'
                },
                {
                    msg: '无任务正常关机',
                    file: 'shutDownNormal'
                },
                // {
                //     msg: '确认关机请再次按下关机键',
                //     file: 'shutDownConfirm'
                // },
                // 设置相关
                {
                    msg: '音量调试',
                    file: 'volumeNotification'
                },
                {
                    msg: '手势识别 - 识别左手',
                    file: 'gestureLeft'
                },
                {
                    msg: '手势识别 - 识别右手',
                    file: 'gestureRight'
                },
                {
                    msg: '手势识别 - 识别成功',
                    file: 'gestureSuccess'
                },
                // 获取报告相关
                // {
                //     msg: '获取报告 - 二维码 - 默认',
                //     file: 'getReportByDefaultQrcode'
                // },
                {
                    msg: '获取报告 - 二维码 - 默认',
                    file: 'getReportByThirdQrcode'
                },
                {
                    msg: '获取报告 - 二维码 - 默认',
                    file: 'getReportByThirdQrcode1'
                },
                {
                    msg: '获取报告 - 二维码 - 获取二维码失败',
                    file: 'printByQrcode'
                },
                {
                    msg: '获取报告 - 二维码 - 扫码成功打印报告',
                    file: 'getReportByCard'
                },
                {
                    msg: '获取报告 - 二维码 - 扫码成功打印报告',
                    file: 'getReportByCard_touch'
                },
                {
                    msg: '获取报告 - 手环 - 手环读取失败',
                    file: 'getCardFail'
                },
                {
                    msg: '获取报告 - 手环 - 读取成功打印报告',
                    file: 'printByCard'
                },
                {
                    msg: '获取报告 - 二维码&手环',
                    file: 'getReportByQrcodeOrCard'
                },
                {
                    msg: '无电流营养分析',
                    file: 'noDianliu'
                },
                {
                    file: 'PostpartumCareModelProject',
                    msg: 'vapro5产康模式全测量项目'
                },
                {
                    file: 'PostpartumCareModelProject5',
                    msg: 'vapro5产康模式全测量项目除去肩部语音'
                },
                {
                    file: 'StandardModeProject',
                    msg: 'vapro5标准模式全测量项目'
                },
                {
                    file: 'StandardModeProject5',
                    msg: 'vapro5标准模式全测量项目去肩部语音'
                },
                {
                    file: 'Singlebodycomponent',
                    msg: 'vapro5单体成分'
                },
                {
                    file: 'projectStart',
                    msg: 'vapro5标准模式项目选择'
                },
                {
                    file: 'projectError',
                    msg: 'vapro5标准模式体重异常项目选择'
                },
                {
                    file: 'projectCK',
                    msg: 'vapro5产康模式项目选择'
                },
                {
                    file: 'projectCKWeightError',
                    msg: 'vapro5产康模式体重异常项目选择'
                },
                {
                    file: 'zunBei',
                    msg: 'vapro5测量前准备'
                },
                {
                    file: 'zunBeiBtn',
                    msg: 'vapro5测量前按键准备'
                },
                {
                    file: 'getData',
                    msg: 'vapro5已获取相关数据'
                },
                {
                    file: 'runTime',
                    msg: '倒计时返回转台'
                },
                {
                    file: 'heightZunbei',
                    msg: '身高测量前准备'
                },
                {
                    file: '08',
                    msg: '身高调整'
                },
                {
                    file: '09',
                    msg: '身高测量中'
                },
                {
                    file: 'singlebodycomponentAndGrith',
                    msg: '身体成分围度测量'
                },
                {
                    file: 'welcome_a_j',
                    msg: '青少年jiaran'
                },
                {
                    file: 'welcome_nologo',
                    msg: '没有logoo的欢迎页面'
                },
                {
                    file: 'isFast',
                    msg: '快速测量站人语音'
                },
                {
                    file: 'quirckContinue',
                    msg: '快速继续测量语言'
                },
                {
                    file: 'girthScanningTipSum',
                    msg: '快速测量语言体态体围测量中'
                },
                {
                    file: 'isOnlyGirgh',
                    msg: '仅身体围度测量'
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['pageInfo', 'printQueue', 'meteTitle', 'deviceInfo', 'settingInfo', 'openShutDownView'])
    },
    methods: {
        // 播放事件
        // 音频和音效的区别
        // 音频会打断上一个正在播放的音频，而音效不会打断音频
        onPlayEvent(file, type = 1) {
            if (type === 1) {
                this.handlePlayAudio(file)
            } else if (type === 5) {
                this.settingAudio(file)
            } else {
                this.playEffect(file)
            }
        },
        // 停止音频
        onStopEvent() {
            this.stopAudio(this.playingFile)
        },
        // 设置语音循环播放
        settingAudio(file) {
            this.playAudio(file)
        },
        // 音频播放结束处理
        playEnd(file) {
            this.playingFile = null
            window.logger.info('音频结束:', file)
            this.$emit('on-audio-end', file)
            if (this.audioDuration !== null) {
                clearTimeout(this.audioDuration)
                this.audioDuration = null
            }
        },
        handlePlayAudio(file) {
            // 上个音频还在播放中
            if (this.playingFile !== null) {
                let audio = document.getElementById('audio-' + file)
                // 检测播放是否已暂停.audio.paused 在播放器播放时返回 false
                if (file === this.playingFile && !audio.paused) {
                    window.logger.debug('正在播放' + file + '，不再重复播放')
                } else {
                    // 停止正在播放的音频
                    this.stopAudio(this.playingFile)
                    this.playAudio(file)
                }
            } else {
                this.playAudio(file)
            }
        },
        playAudio(file) {
            let audio = document.getElementById('audio-' + file)
            if (audio !== null) {
                // 检测播放是否已暂停.audio.paused 在播放器播放时返回 false
                if (audio.paused) {
                    audio.play() // 播放
                } else {
                    window.logger.info('重载音频:', file)
                    audio.pause() // 暂停
                    audio.load() // 重载
                    audio.play() // 播放
                }
                window.logger.info('播放音频:', file)
                this.playingFile = file
                if (!audio.duration) {
                    window.logger.info('音频没有时长可能未找到')
                }
                window.logger.info('音频播放时长', audio.duration * 1000 + 3000)
                this.audioDuration = setTimeout(() => {
                    this.playEnd(file)
                    window.logger.info('音频超时结束:', file)
                }, audio.duration * 1000 + 3000)
            }
        },
        stopAudio(file) {
            window.logger.info('停止音频:', file)
            let audio = document.getElementById('audio-' + file)
            if (this.audioDuration !== null) {
                clearTimeout(this.audioDuration)
                this.audioDuration = null
            }
            if (audio !== null) {
                if (!audio.ended) {
                    audio.pause() // 暂停
                    audio.load() // 重载
                }
            }
        },
        // 播放音效
        playEffect(file) {
            let effect = document.getElementById('audio-' + file)
            if (effect !== null) {
                if (effect.paused) {
                    effect.play() // 播放
                } else {
                    effect.pause() // 暂停
                    effect.load() // 重载
                    effect.play() // 播放
                }
            }
        },
        // 停止播放音效
        stopEffect(file) {
            window.logger.info('停止音效:', file)
            const effect = document.getElementById('audio-' + file)
            if (effect !== null) {
                if (!effect.ended) {
                    effect.pause() // 暂停
                    effect.load() // 重载
                }
            }
        }
    }
}
</script>
