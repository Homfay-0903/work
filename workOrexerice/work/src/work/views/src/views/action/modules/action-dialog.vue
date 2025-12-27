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
                            :http-request="customUploadCover"
                            :before-upload="beforeUploadCover"
                            :on-success="handleCoverSuccess"
                            :on-remove="handleCoverRemove"
                            :show-file-list="false"
                            :disabled="dialogType === 'view'"
                        >
                            <img v-if="imageUrl" :src="imageUrl" class="coverImage" />
                            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                            <template #tip>
                                <div class="el-upload__tip">*建议上传10MB以内的JPG、PNG、JPEG格式</div>
                            </template>
                        </ElUpload>
                    </ElFormItem>

                    <ElFormItem label="动作视频" prop="video">
                        <ElUpload
                            class="upload-demo"
                            :http-request="customUploadVideo"
                            :before-upload="beforeUploadVideo"
                            :on-success="handleVideoSuccess"
                            :on-remove="handleVideoRemove"
                            :show-file-list="false"
                            :disabled="dialogType === 'view'"
                        >
                            <div v-if="videoUrl" class="video-preview">
                                <video :src="videoUrl" class="coverImage" controls preload="metadata" />
                            </div>
                            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
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
                    <ElRow :gutter="24">
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
                        </ElCol>
                        <ElCol :span="12">
                            <ElFormItem label="适用场景" prop="scene">
                                <ElSelect
                                    v-model="formData.scene"
                                    placeholder="请选择适用场景"
                                    :disabled="dialogType === 'view'"
                                >
                                    <ElOption label="力量训练" :value="1" />
                                    <ElOption label="普拉提" :value="2" />
                                    <ElOption label="有氧减脂" :value="3" />
                                    <ElOption label="拉伸康复" :value="4" />
                                </ElSelect>
                            </ElFormItem>
                        </ElCol>
                    </ElRow>

                    <ElRow :gutter="24">
                        <ElCol :span="12">
                            <ElFormItem label="难度" prop="difficulty">
                                <ElSelect
                                    v-model="formData.difficulty"
                                    placeholder="请选择难度"
                                    :disabled="dialogType === 'view'"
                                >
                                    <ElOption label="初级" :value="1" />
                                    <ElOption label="中级" :value="2" />
                                    <ElOption label="高级" :value="3" />
                                </ElSelect>
                            </ElFormItem>
                        </ElCol>
                        <ElCol :span="12">
                            <ElFormItem label="动作属性" prop="attribute">
                                <ElSelect
                                    v-model="formData.attribute"
                                    placeholder="请选择动作属性"
                                    @change="handleAttributeChange"
                                    :disabled="dialogType === 'view'"
                                >
                                    <ElOption label="按次数计算" :value="1" />
                                    <ElOption label="按时长计算" :value="2" />
                                    <ElOption label="按角度计算" :value="3" />
                                    <ElOption label="按长度计算" :value="4" />
                                    <ElOption label="按评估数值" :value="5" />
                                    <ElOption label="其他" :value="0" />
                                </ElSelect>
                            </ElFormItem>
                        </ElCol>
                    </ElRow>

                    <ElRow :gutter="24">
                        <ElCol :span="12">
                            <ElFormItem label="动作类型" prop="type">
                                <ElSelect
                                    v-model="formData.type"
                                    placeholder="请选择动作类型"
                                    @change="handleTypeChange"
                                    :disabled="dialogType === 'view'"
                                >
                                    <ElOption label="视频动作" :value="1" />
                                    <ElOption label="非视频动作" :value="2" />
                                    <ElOption label="片头" :value="3" />
                                    <ElOption label="片尾" :value="4" />
                                </ElSelect>
                            </ElFormItem>
                        </ElCol>
                        <ElCol :span="12" v-if="formData.attribute === 2">
                            <ElFormItem label="卡路里" prop="calories">
                                <ElInputNumber
                                    v-model="formData.calories"
                                    :min="0"
                                    :max="9999"
                                    :disabled="dialogType === 'view'"
                                />
                            </ElFormItem>
                        </ElCol>
                    </ElRow>

                    <ElFormItem label="动作介绍" prop="introduction" style="width: 100%">
                        <div
                            style="width: 100%"
                            v-if="dialogType === 'view'"
                            class="view-content"
                            v-html="formData.introduction"
                        ></div>
                        <ElInput
                            v-else
                            v-model="formData.introduction"
                            type="textarea"
                            :rows="4"
                            :maxlength="1000"
                            :show-word-limit="true"
                            placeholder="请输入动作介绍"
                        />
                    </ElFormItem>

                    <ElFormItem v-if="formData.type !== 4" label="其他" prop="other">
                        <div
                            style="width: 100%"
                            v-if="dialogType === 'view'"
                            class="view-content"
                            v-html="formData.other"
                        ></div>
                        <ArtWangEditor
                            ref="otherEditorRef"
                            v-else
                            v-model="formData.other"
                            :height="'100px'"
                            :toolbarKeys="toolbarKeys"
                            :placeholder="'(需包含安装示意、错误要点、呼吸建议等) 不建议上传带文字的图片类型'"
                        />
                    </ElFormItem>

                    <ElFormItem label="备注" prop="remark">
                        <ElInput
                            v-model="formData.remark"
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

        <!-- 器械/AI动作 关联选择弹窗 -->
        <ActionRelation
            v-model:visible="relationDialogVisible"
            :type="relationDialogType"
            :selected-equipment-ids="formData.equipment"
            :selected-ai-id="formData.aiAction"
            @confirm="handleRelationConfirm"
        />

        <template #footer>
            <div class="dialog-footer" v-if="dialogType !== 'view'">
                <ElButton @click="handleCancel">取消</ElButton>
                <ElButton type="primary" @click="handleSave">保存为草稿</ElButton>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
    import { ElMessage } from 'element-plus'
    import type { FormInstance, FormRules, UploadFile, UploadFiles, UploadProps } from 'element-plus'
    import ArtWangEditor from '@/components/core/forms/art-wang-editor/index.vue'
    import { Plus } from '@element-plus/icons-vue'
    import { fetchCreateAction, fetchUpdateAction } from '@/api/action'
    import { fetchUploadImage } from '@/api/upload'
    import { fetchUploadVideo } from '@/api/upload'
    import { fetchGetTagList } from '@/api/tag'

    import ActionRelation from './action-relation.vue'

    const imageUrl = ref('')
    const videoUrl = ref('')

    // 富文本编辑器引用
    const otherEditorRef = ref<InstanceType<typeof ArtWangEditor>>()

    const toolbarKeys = ref([
        'bold',
        'clearStyle',
        'color',
        'bgColor',
        '|',
        {
            key: 'group-image',
            title: '图片',
            iconSvg: '',
            menuKeys: ['uploadImage', 'insertImage', 'deleteImage', 'editImage', 'viewImageLink'],
        },
        {
            key: 'group-video',
            title: '视频',
            iconSvg: '',
            menuKeys: ['insertVideo', 'uploadVideo'],
        },
        'divider',
        'fontSize',
        'emotion',
        'blockquote',
        'headerSelect',
        'redo',
        'undo',
        'fullScreen',
    ])

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
    // const uploadAction = ref('') // 已注释，使用自定义上传方法替代

    // 文件列表
    const coverFileList = ref<UploadFiles>([])
    const videoFileList = ref<UploadFiles>([])

    // 选中的器械和AI动作
    const selectedEquipment = ref<Array<{ id: number; name: string }>>([])
    const selectedAiAction = ref<{ id: number; name: string } | null>(null)

    // 关联选择对话框
    const relationDialogVisible = ref(false)
    const relationDialogType = ref<'equipment' | 'ai'>('equipment')

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
    const modelList = ref<Array<{ label: string; value: number }>>([])

    /**
     * 获取型号列表（从标签API获取）
     */
    const fetchModelList = async () => {
        try {
            const response = await fetchGetTagList({
                page: 1,
                size: 20, // 获取所有标签
            })
            // 将标签列表转换为型号列表格式
            modelList.value = response.list.map(tag => ({
                label: tag.name,
                value: tag.id,
            }))
        } catch (error) {
            console.error('获取型号列表失败:', error)
            // 如果获取失败，使用默认值
            modelList.value = [
                { label: 'T5X', value: 1 },
                { label: 'Motionstation', value: 2 },
            ]
        }
    }

    // 组件挂载时获取型号列表
    onMounted(() => {
        fetchModelList()
    })

    // 教练列表（示例）
    const trainerList = ref<Array<{ id: number; name: string }>>([
        { id: 1, name: 'Andy' },
        { id: 2, name: 'Joy' },
    ])

    // 表单初始数据
    const defaultFormData = {
        id: null as number | null, // 添加ID字段
        name: '',
        coverImage: '',
        video: '',
        equipment: [] as number[],
        trainer: '',
        part: [] as string[],
        muscleGroup: [] as string[],
        aiAction: null as number | null,
        tagIds: [] as number[],
        model: [] as string[],
        scene: null as number | null,
        difficulty: null as number | null,
        attribute: null as number | null,
        type: null as number | null,
        calories: 0,
        introduction: '',
        other: '',
        remark: '',
    }

    // 表单数据
    const formData = reactive({ ...defaultFormData })

    // 表单验证规则
    const rules: FormRules = {
        name: [{ required: true, message: '请填写动作名称', trigger: 'blur' }],
        model: [{ required: true, message: '请选择适用型号', trigger: 'change' }],
        scene: [{ required: true, message: '请选择适用场景', trigger: 'change' }],
        type: [{ required: true, message: '请选择动作类型', trigger: 'change' }],
        difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
        attribute: [{ required: true, message: '请选择动作属性', trigger: 'change' }],
        // coverImage: [{ required: true, message: '请上传动作封面', trigger: 'change' }],
        // video: [{ required: true, message: '请上传动作视频', trigger: 'change' }],
        introduction: [{ required: true, message: '请填写动作介绍', trigger: 'blur' }],
        equipment: [{ required: true, message: '请选择器械', trigger: 'change' }],
        calories: [
            {
                required: false,
                validator: (rule, value, callback) => {
                    if (formData.attribute === 2 && (!value || value === 0)) {
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
        // 如果是添加动作，完全重置表单数据
        if (props.type === 'add') {
            // 重置formData到默认值
            Object.assign(formData, { ...defaultFormData })

            // 重置图片和视频预览
            imageUrl.value = ''
            videoUrl.value = ''

            // 重置选中的器械和AI动作
            selectedEquipment.value = []
            selectedAiAction.value = null

            // 清空富文本编辑器内容
            otherEditorRef.value?.clear()

            return
        }

        const isEdit = props.type === 'edit' && props.actionData
        const row = props.actionData || {}

        // 处理封面图片：优先使用 picture 字段（API 返回的字段名）
        const coverImageUrl = (row as any).picture || row.coverImage || ''

        Object.assign(formData, {
            id: row.id || null, // 添加ID字段
            name: row.name || '',
            coverImage: coverImageUrl,
            video: row.video || '',
            equipment:
                (row as any).instruments || row.equipmentList || row.equipment
                    ? Array.isArray(row.equipment)
                        ? row.equipment
                        : ((row as any).instruments || row.equipmentList || []).map((eq: any) => eq.id)
                    : [],
            trainer: row.trainer || '',
            part: row.part ? (Array.isArray(row.part) ? row.part : [row.part]) : [],
            muscleGroup: row.muscleGroup ? (Array.isArray(row.muscleGroup) ? row.muscleGroup : []) : [],
            aiAction: row.aiAction || null,
            tagIds: row.tagIds ? (Array.isArray(row.tagIds) ? row.tagIds : []) : [],
            model: row.tags?.map(tag => tag.name || '未知'),
            scene: row.scene || 1,
            difficulty: row.difficulty || 1,
            attribute: row.attribute || 0,
            type: row.type || 1,
            calories: row.calories || 0,
            introduction: row.introduction || '',
            other: row.other || '',
            remark: row.remark || '',
        })

        // 设置封面和视频预览URL
        imageUrl.value = coverImageUrl
        videoUrl.value = row.video || ''

        // 设置选中的器械和AI动作
        selectedEquipment.value = ((row as any).instruments || row.equipmentList || []).map((eq: any) => ({
            id: eq.id,
            name: eq.name,
        }))
        if (row.aiActionInfo) {
            selectedAiAction.value = {
                id: row.aiActionInfo.id,
                name: row.aiActionInfo.name,
            }
        } else {
            selectedAiAction.value = null
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
    const handleCoverSuccess = (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        // 接口返回的 data 字段包含 { filename, path, url }
        formData.coverImage = response?.url || file.url || ''
        if (response?.url) {
            imageUrl.value = response.url
        }
    }

    /**
     * 删除封面
     */
    const handleCoverRemove = () => {
        formData.coverImage = ''
        imageUrl.value = ''
        coverFileList.value = []
    }

    /**
     * 视频上传成功
     */
    const handleVideoSuccess = (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        // 接口返回的 data 字段包含 { filename, path, url }
        formData.video = response?.url || file.url || ''
        if (response?.url) {
            videoUrl.value = response.url
        }
    }

    /**
     * 删除视频
     */
    const handleVideoRemove = () => {
        formData.video = ''
        videoUrl.value = ''
        videoFileList.value = []
    }

    // 自定义上传方法，使用我们实现的上传接口
    const customUploadCover: UploadProps['httpRequest'] = ({ file, onSuccess, onError, onProgress }) => {
        fetchUploadImage({
            file,
            onUploadProgress: onProgress,
        })
            .then(response => {
                onSuccess(response, file)
            })
            .catch(error => {
                onError(error, file)
            })
    }

    // 自定义视频上传方法
    const customUploadVideo: UploadProps['httpRequest'] = ({ file, onSuccess, onError, onProgress }) => {
        fetchUploadVideo({
            file,
            onUploadProgress: onProgress,
        })
            .then(response => {
                onSuccess(response, file)
            })
            .catch(error => {
                onError(error, file)
            })
    }

    /**
     * 动作属性变化
     */
    const handleAttributeChange = () => {
        if (formData.attribute !== 2) {
            formData.calories = 0
        }
    }

    /**
     * 动作类型变化
     */
    const handleTypeChange = () => {
        if (formData.type === 2) {
            formData.other = ''
        }
    }

    /**
     * 显示器械选择对话框
     */
    const showEquipmentDialog = () => {
        relationDialogType.value = 'equipment'
        relationDialogVisible.value = true
    }

    /**
     * 显示AI动作选择对话框
     */
    const showAiActionDialog = () => {
        relationDialogType.value = 'ai'
        relationDialogVisible.value = true
    }

    /**
     * 处理关联选择确认
     */
    const handleRelationConfirm = (payload: {
        type: 'equipment' | 'ai'
        selections: Array<{ id: number; name: string }>
    }) => {
        if (payload.type === 'equipment') {
            selectedEquipment.value = payload.selections
            formData.equipment = payload.selections.map(item => item.id)
        } else {
            const first = payload.selections[0]
            selectedAiAction.value = first || null
            formData.aiAction = first ? first.id : null
        }
    }

    /**
     * 取消
     */
    const handleCancel = () => {
        dialogVisible.value = false
    }

    /**
     * 保存动作
     */
    const handleSave = async () => {
        if (!formRef.value) return
        await formRef.value.validate()

        // 将型号选择值同步到tagIds
        formData.tagIds = Array.isArray(formData.model) ? formData.model.map(id => Number(id)) : []

        // 构建提交数据对象
        const actionDataBase: Api.Action.ActionUpdateBody | Api.Action.ActionCreateBody = {
            id: Number(formData.id), // 添加ID字段
            name: formData.name,
            picture: formData.coverImage,
            video: formData.video,
            instrumentIds: Array.isArray(formData.equipment) ? formData.equipment.map(id => Number(id)) : [],
            coachId: formData.trainer ? Number(formData.trainer) : 0,
            part: formData.part,
            muscleLegionIds: formData.muscleGroup,
            relatedActionId: formData.aiAction ? Number(formData.aiAction) : 0,
            model: formData.model,
            tagIds: formData.tagIds,
            scene: Number(formData.scene), // 转换为数字或null
            difficulty: Number(formData.difficulty), // 转换为数字或null
            attribute: Number(formData.attribute), // 转换为数字或null
            type: Number(formData.type), // 转换为数字
            calories: formData.calories,
            introduction: formData.introduction,
            other: formData.other,
            remark: formData.remark,
        }

        try {
            // 确保instrumentIds是有效的数字数组
            if (!Array.isArray(actionDataBase.instrumentIds) || actionDataBase.instrumentIds.length === 0) {
                actionDataBase.instrumentIds = []
            }
            // 确保tagIds是有效的数字数组
            if (!Array.isArray(actionDataBase.tagIds) || actionDataBase.tagIds.length === 0) {
                actionDataBase.tagIds = []
            }

            if (dialogType.value === 'add') {
                await fetchCreateAction(actionDataBase as Api.Action.ActionCreateBody)
                emit('submit') // 新增时传递创建的数据
            } else {
                await fetchUpdateAction(actionDataBase as Api.Action.ActionUpdateBody)
                emit('submit') // 编辑时传递更新的数据
            }
            dialogVisible.value = false
        } catch (error) {
            console.error('保存失败:', error)
            ElMessage.error(dialogType.value === 'add' ? '创建失败' : '更新失败')
        }
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

    .upload-demo .coverImage {
        width: 150px;
        height: 150px;
        display: block;
        object-fit: cover;
    }

    .video-preview {
        position: relative;
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;
        border-radius: 6px;
        overflow: hidden;
    }

    .video-preview video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>

<style>
    .upload-demo .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .upload-demo .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        text-align: center;
    }
</style>
