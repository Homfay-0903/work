<template>
    <ElDialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新建动作' : dialogType === 'view' ? '查看动作' : '编辑动作'"
        width="80%"
        align-center
        :close-on-click-modal="false"
    >
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="120px">
            <ElRow :gutter="24">
                <!-- 左列 -->
                <ElCol :span="12">
                    <ElFormItem label="动作名称" prop="name">
                        <ElInput
                            v-model="formData.name"
                            placeholder="请输入动作名称"
                            :maxlength="1000"
                            :show-word-limit="true"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>

                    <ElFormItem label="动作封面" prop="coverImage">
                        <ElUpload
                            class="upload-demo"
                            :action="uploadAction"
                            :before-upload="beforeUploadCover"
                            :on-success="handleCoverSuccess"
                            :on-remove="handleCoverRemove"
                            :file-list="coverFileList"
                            list-type="picture"
                            :disabled="dialogType === 'view'"
                        >
                            <ElButton type="primary" :disabled="dialogType === 'view'">选择图片</ElButton>
                            <template #tip>
                                <div class="el-upload__tip">*建议上传10MB以内的JPG、PNG、JPEG格式</div>
                            </template>
                        </ElUpload>
                    </ElFormItem>

                    <ElFormItem label="动作视频" prop="video">
                        <ElUpload
                            class="upload-demo"
                            :action="uploadAction"
                            :before-upload="beforeUploadVideo"
                            :on-success="handleVideoSuccess"
                            :on-remove="handleVideoRemove"
                            :file-list="videoFileList"
                            :disabled="dialogType === 'view'"
                        >
                            <ElButton type="primary" :disabled="dialogType === 'view'">选择视频</ElButton>
                            <template #tip>
                                <div class="el-upload__tip">*建议上传2GB以内的MP4格式</div>
                            </template>
                        </ElUpload>
                    </ElFormItem>

                    <ElFormItem label="器械" prop="equipment">
                        <ElButton @click="showEquipmentDialog" :disabled="dialogType === 'view'">请选择</ElButton>
                        <span v-if="selectedEquipment.length > 0" class="selected-items">
                            {{ selectedEquipment.map(e => e.name).join('、') }}
                        </span>
                    </ElFormItem>

                    <ElFormItem label="选择教练" prop="trainer">
                        <ElSelect
                            v-model="formData.trainer"
                            placeholder="请选择教练"
                            clearable
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                v-for="trainer in trainerList"
                                :key="trainer.id"
                                :label="trainer.name"
                                :value="trainer.id"
                            />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="训练部位" prop="part">
                        <ElSelect
                            v-model="formData.part"
                            placeholder="请选择训练部位"
                            multiple
                            clearable
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                v-for="part in partList"
                                :key="part.value"
                                :label="part.label"
                                :value="part.value"
                            />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="训练肌群" prop="muscleGroup">
                        <ElSelect
                            v-model="formData.muscleGroup"
                            placeholder="请选择训练肌群"
                            multiple
                            clearable
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                v-for="muscle in muscleGroupList"
                                :key="muscle.value"
                                :label="muscle.label"
                                :value="muscle.value"
                            />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="关联AI动作" prop="aiAction">
                        <ElButton @click="showAiActionDialog" :disabled="dialogType === 'view'">请选择</ElButton>
                        <span v-if="selectedAiAction" class="selected-items">{{ selectedAiAction.name }}</span>
                    </ElFormItem>
                </ElCol>

                <!-- 右列 -->
                <ElCol :span="12">
                    <ElFormItem label="适用型号" prop="model">
                        <ElSelect
                            v-model="formData.model"
                            placeholder="请选择适用型号"
                            multiple
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                v-for="model in modelList"
                                :key="model.value"
                                :label="model.label"
                                :value="model.value"
                            />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="适用场景" prop="scene">
                        <ElSelect
                            v-model="formData.scene"
                            placeholder="请选择适用场景"
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption label="力量训练" value="strength" />
                            <ElOption label="普拉提" value="pilates" />
                            <ElOption label="有氧减脂" value="aerobic" />
                            <ElOption label="拉伸康复" value="stretch" />
                            <ElOption label="评估筛查" value="assessment" />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="难度" prop="difficulty">
                        <ElSelect
                            v-model="formData.difficulty"
                            placeholder="请选择难度"
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption label="初级" value="1" />
                            <ElOption label="中级" value="2" />
                            <ElOption label="高级" value="3" />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="动作属性" prop="attribute">
                        <ElSelect
                            v-model="formData.attribute"
                            placeholder="请选择动作属性"
                            @change="handleAttributeChange"
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption label="按次数计算" value="count" />
                            <ElOption label="按时长计算" value="duration" />
                            <ElOption label="按角度计算" value="angle" />
                            <ElOption label="按长度计算" value="length" />
                            <ElOption label="按评估数值" value="assessment" />
                            <ElOption label="其他" value="other" />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="动作类型" prop="type">
                        <ElSelect
                            v-model="formData.type"
                            placeholder="请选择动作类型"
                            @change="handleTypeChange"
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption label="视频动作" value="video" />
                            <ElOption label="非视频动作" value="non_video" />
                            <ElOption label="片头" value="intro" />
                            <ElOption label="片尾" value="outro" />
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem v-if="formData.attribute === 'duration'" label="卡路里" prop="calories">
                        <ElInputNumber
                            v-model="formData.calories"
                            :min="0"
                            :max="9999"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>

                    <ElFormItem label="动作介绍" prop="introduction">
                        <div v-if="dialogType === 'view'" class="view-content" v-html="formData.introduction"></div>
                        <div v-else>
                            <!-- TODO: 集成富文本编辑器 -->
                            <ElInput
                                v-model="formData.introduction"
                                type="textarea"
                                :rows="4"
                                :maxlength="1000"
                                :show-word-limit="true"
                                placeholder="请输入动作介绍"
                            />
                        </div>
                    </ElFormItem>

                    <ElFormItem v-if="formData.type !== 'non_video'" label="其他" prop="other">
                        <div v-if="dialogType === 'view'" class="view-content" v-html="formData.other"></div>
                        <div v-else>
                            <!-- TODO: 集成富文本编辑器 -->
                            <ElInput
                                v-model="formData.other"
                                type="textarea"
                                :rows="6"
                                placeholder="(需包含安装示意、错误要点、呼吸建议等) 不建议上传带文字的图片类型"
                            />
                        </div>
                    </ElFormItem>

                    <ElFormItem label="备注" prop="remarks">
                        <ElInput
                            v-model="formData.remarks"
                            type="textarea"
                            :rows="3"
                            :maxlength="1000"
                            :show-word-limit="true"
                            placeholder="请输入备注"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>
                </ElCol>
            </ElRow>
        </ElForm>

        <template #footer>
            <div class="dialog-footer" v-if="dialogType !== 'view'">
                <ElButton @click="handleCancel">取消</ElButton>
                <ElButton type="primary" @click="handleSave">保存为草稿</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, watch, nextTick } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import type { FormInstance, FormRules, UploadFile, UploadFiles } from 'element-plus'

    interface Props {
        visible: boolean
        type: string
        actionData?: Partial<Api.Action.ActionListItem>
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void
        (e: 'submit', payload?: any): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const dialogVisible = computed({
        get: () => props.visible,
        set: value => emit('update:visible', value),
    })

    const dialogType = computed(() => props.type)

    const formRef = ref<FormInstance>()
    const uploadAction = ref('') // TODO: 配置实际上传地址

    // 文件列表
    const coverFileList = ref<UploadFiles>([])
    const videoFileList = ref<UploadFiles>([])

    // 选中的器械和AI动作
    const selectedEquipment = ref<Array<{ id: number; name: string }>>([])
    const selectedAiAction = ref<{ id: number; name: string } | null>(null)

    // 训练部位列表
    const partList = [
        { label: '全身', value: 'whole_body' },
        { label: '胸部', value: 'chest' },
        { label: '肩部', value: 'shoulder' },
        { label: '背部', value: 'back' },
        { label: '臀部', value: 'glutes' },
        { label: '腿部', value: 'legs' },
        { label: '手臂', value: 'arms' },
        { label: '腹部', value: 'abdomen' },
    ]

    // 训练肌群列表（简化版，实际应该根据训练部位动态加载）
    const muscleGroupList = [
        { label: '全身', value: 'whole_body' },
        { label: '胸大肌', value: 'pectoralis_major' },
        { label: '三角肌前束', value: 'anterior_deltoid' },
        { label: '三角肌中束', value: 'medial_deltoid' },
        { label: '三角肌后束', value: 'posterior_deltoid' },
        { label: '背阔肌', value: 'latissimus_dorsi' },
        { label: '斜方肌', value: 'trapezius' },
        { label: '竖脊肌', value: 'erector_spinae' },
        { label: '臀大肌', value: 'gluteus_maximus' },
        { label: '股四头肌', value: 'quadriceps' },
        { label: '腘绳肌', value: 'hamstrings' },
        { label: '小腿三头肌', value: 'triceps_surae' },
        { label: '大腿内收肌', value: 'adductor' },
        { label: '肱二头肌', value: 'biceps' },
        { label: '肱三头肌', value: 'triceps' },
        { label: '前臂肌群', value: 'forearm' },
        { label: '腹肌', value: 'abdominal' },
    ]

    // 型号列表
    const modelList = [
        { label: 'T5X', value: 'T5X' },
        { label: 'Motionstation', value: 'Motionstation' },
    ]

    // 教练列表（示例）
    const trainerList = ref<Array<{ id: number; name: string }>>([
        { id: 1, name: 'Andy' },
        { id: 2, name: 'Joy' },
    ])

    // 表单数据
    const formData = reactive({
        name: '',
        coverImage: '',
        video: '',
        equipment: [] as number[],
        trainer: '',
        part: [] as string[],
        muscleGroup: [] as string[],
        aiAction: null as number | null,
        model: [] as string[],
        scene: '',
        difficulty: '',
        attribute: '',
        type: '',
        calories: 0,
        introduction: '',
        other: '',
        remarks: '',
    })

    // 表单验证规则
    const rules: FormRules = {
        name: [{ required: true, message: '请填写动作名称', trigger: 'blur' }],
        model: [{ required: true, message: '请选择适用型号', trigger: 'change' }],
        scene: [{ required: true, message: '请选择适用场景', trigger: 'change' }],
        type: [{ required: true, message: '请选择动作类型', trigger: 'change' }],
        difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
        attribute: [{ required: true, message: '请选择动作属性', trigger: 'change' }],
        coverImage: [{ required: true, message: '请上传动作封面', trigger: 'change' }],
        video: [{ required: true, message: '请上传动作视频', trigger: 'change' }],
        introduction: [{ required: true, message: '请填写动作介绍', trigger: 'blur' }],
        equipment: [{ required: true, message: '请选择器械', trigger: 'change' }],
        calories: [
            {
                required: false,
                validator: (rule, value, callback) => {
                    if (formData.attribute === 'duration' && (!value || value === 0)) {
                        callback(new Error('按时长计算时需要填写卡路里'))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur',
            },
        ],
    }

    /**
     * 初始化表单数据
     */
    const initFormData = () => {
        const isEdit = props.type === 'edit' && props.actionData
        const row = props.actionData || {}

        Object.assign(formData, {
            name: row.name || '',
            coverImage: row.coverImage || '',
            video: row.video || '',
            equipment: row.equipment ? (Array.isArray(row.equipment) ? row.equipment : []) : [],
            trainer: row.trainer || '',
            part: row.part ? (Array.isArray(row.part) ? row.part : [row.part]) : [],
            muscleGroup: row.muscleGroup ? (Array.isArray(row.muscleGroup) ? row.muscleGroup : []) : [],
            aiAction: row.aiAction || null,
            model: row.model ? (Array.isArray(row.model) ? row.model : [row.model]) : [],
            scene: row.scene || '',
            difficulty: row.difficulty || '',
            attribute: row.attribute || '',
            type: row.type || '',
            calories: row.calories || 0,
            introduction: row.introduction || '',
            other: row.other || '',
            remarks: row.remarks || '',
        })

        // 初始化文件列表
        if (row.coverImage) {
            coverFileList.value = [{ name: 'cover', url: row.coverImage }]
        }
        if (row.video) {
            videoFileList.value = [{ name: 'video', url: row.video }]
        }
    }

    /**
     * 上传封面前的验证
     */
    const beforeUploadCover = (file: File) => {
        const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
        const isLt10M = file.size / 1024 / 1024 < 10

        if (!isValidType) {
            ElMessage.error('请上传10MB以内JPG、PNG、JPEG格式图片')
            return false
        }
        if (!isLt10M) {
            ElMessage.error('图片大小不能超过10MB')
            return false
        }
        return true
    }

    /**
     * 上传视频前的验证
     */
    const beforeUploadVideo = (file: File) => {
        const isValidType = file.type === 'video/mp4'
        const isLt2G = file.size / 1024 / 1024 / 1024 < 2

        if (!isValidType) {
            ElMessage.error('请上传2GB以内MP4格式视频')
            return false
        }
        if (!isLt2G) {
            ElMessage.error('视频大小不能超过2GB')
            return false
        }
        return true
    }

    /**
     * 封面上传成功
     */
    const handleCoverSuccess = (response: any, file: UploadFile) => {
        formData.coverImage = response.url || file.url || ''
    }

    /**
     * 删除封面
     */
    const handleCoverRemove = () => {
        formData.coverImage = ''
    }

    /**
     * 视频上传成功
     */
    const handleVideoSuccess = (response: any, file: UploadFile) => {
        formData.video = response.url || file.url || ''
    }

    /**
     * 删除视频
     */
    const handleVideoRemove = () => {
        formData.video = ''
    }

    /**
     * 动作属性变化
     */
    const handleAttributeChange = () => {
        if (formData.attribute !== 'duration') {
            formData.calories = 0
        }
    }

    /**
     * 动作类型变化
     */
    const handleTypeChange = () => {
        if (formData.type === 'non_video') {
            formData.other = ''
        }
    }

    /**
     * 显示器械选择对话框
     */
    const showEquipmentDialog = () => {
        // TODO: 实现器械选择对话框
        ElMessage.info('器械选择功能开发中...')
    }

    /**
     * 显示AI动作选择对话框
     */
    const showAiActionDialog = () => {
        // TODO: 实现AI动作选择对话框
        ElMessage.info('AI动作选择功能开发中...')
    }

    /**
     * 取消
     */
    const handleCancel = () => {
        dialogVisible.value = false
    }

    /**
     * 保存
     */
    const handleSave = async () => {
        if (!formRef.value) return

        await formRef.value.validate(valid => {
            if (valid) {
                const payload = { ...formData }
                emit('submit', payload)
            }
        })
    }

    // 监听对话框状态
    watch(
        () => [props.visible, props.type, props.actionData],
        ([visible]) => {
            if (visible) {
                initFormData()
                nextTick(() => {
                    formRef.value?.clearValidate()
                })
            }
        },
        { immediate: true },
    )
</script>

<style lang="scss" scoped>
    .selected-items {
        margin-left: 8px;
        color: var(--el-text-color-regular);
    }

    .view-content {
        min-height: 60px;
        padding: 8px;
        border: 1px solid var(--el-border-color-light);
        border-radius: 4px;
        background-color: var(--el-fill-color-lighter);
    }

    :deep(.el-upload__tip) {
        color: var(--el-text-color-regular);
        font-size: 12px;
        margin-top: 4px;
    }
</style>
