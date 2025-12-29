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
                            v-model="formData.coachId"
                            placeholder="请选择教练"
                            clearable
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                v-for="coach in coachList"
                                :key="coach.id"
                                :label="coach.name"
                                :value="coach.id"
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
                            @change="handlePartChange"
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
                            <ElFormItem label="适用型号" prop="tagIds">
                                <ElSelect
                                    v-model="formData.tagIds"
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
    import { fetchGetCoachList } from '@/api/coach'
    import { fetchUploadImage } from '@/api/upload'
    import { fetchUploadVideo } from '@/api/upload'
    import { fetchGetTagList } from '@/api/tag'
    import { fetchGetMuscleList } from '@/api/muscle'

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
        'uploadImage',
        'insertImage',
        'deleteImage',
        'editImage',
        'viewImageLink',
        'insertVideo',
        'uploadVideo',
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

    // 训练部位列表 - 改为响应式引用
    const partList = ref([
        { label: '全身', value: 1 },
        { label: '胸部', value: 2 },
        { label: '肩部', value: 3 },
        { label: '背部', value: 4 },
        { label: '臀部', value: 5 },
        { label: '腿部', value: 6 },
        { label: '手臂', value: 7 },
        { label: '腹部', value: 8 },
    ])

    // 肌肉列表
    const muscleGroupList = ref<Array<{ label: string; value: number }>>([])

    // 记录每个训练部位对应的肌肉群ID，用于取消选择时只清空相关的肌肉群
    const partMuscleMap = ref(new Map<number, number[]>())

    // 存储之前选中的训练部位，用于比较找出取消选择的部位
    const previousPart = ref<number[]>([])

    // 型号列表
    const modelList = ref<Array<{ label: string; value: number }>>([])

    /**
     * 获取训练部位对应的肌肉列表数据
     */
    const fetchMuscleGroupData = async (regionIds: number[]) => {
        try {
            if (!regionIds || regionIds.length === 0 || !Array.isArray(regionIds)) {
                console.warn('训练部位ID列表为空或格式错误，使用默认值')
                regionIds = [1]
            }

            const allMuscles: any[] = []
            const currentPartMuscleMap = new Map<number, number[]>()

            for (const regionId of regionIds) {
                console.log('regionId:', regionId)
                const response = await fetchGetMuscleList({ regionId })
                if (response && Array.isArray(response) && response.length > 0) {
                    allMuscles.push(...response)

                    // 记录当前训练部位对应的肌肉群ID
                    const muscleIds = response.filter(item => item && item.id !== undefined).map(item => item.id)
                    currentPartMuscleMap.set(regionId, muscleIds)
                }
            }

            console.log('所有肌肉分组数据:', allMuscles)
            console.log('当前训练部位肌肉映射:', currentPartMuscleMap)

            if (allMuscles.length === 0) {
                console.warn('肌肉分组数据为空，使用默认值')
                muscleGroupList.value = []
                partMuscleMap.value = new Map()
                return
            }

            const uniqueMusclesMap = new Map()
            for (const muscle of allMuscles) {
                if (muscle && muscle.name && muscle.id !== undefined) {
                    uniqueMusclesMap.set(muscle.id, muscle)
                }
            }

            const formattedData = Array.from(uniqueMusclesMap.values()).map(group => ({
                label: group.name,
                value: group.id,
            }))

            if (formattedData.length > 0) {
                muscleGroupList.value = formattedData

                // 更新训练部位肌肉映射，只保留当前选中部位的映射
                const newPartMuscleMap = new Map()
                for (const regionId of regionIds) {
                    if (currentPartMuscleMap.has(regionId)) {
                        newPartMuscleMap.set(regionId, currentPartMuscleMap.get(regionId)!)
                    }
                }
                partMuscleMap.value = newPartMuscleMap

                console.log('更新肌肉列表:', formattedData)
                console.log('更新训练部位肌肉映射:', partMuscleMap.value)
            } else {
                console.warn('转换后的肌肉分组数据无效，使用默认值')
                muscleGroupList.value = []
                partMuscleMap.value = new Map()
            }
        } catch (error) {
            console.error('获取肌肉分组数据失败:', error)
            // 保留默认值，确保组件正常工作
            ElMessage.warning('获取训练肌群数据失败，使用默认值')
            muscleGroupList.value = []
            partMuscleMap.value = new Map()
        }
    }

    /**
     * 获取肌肉列表数据
     */
    //const fetchMuscleListData = async () => {
    //    try {
    //        const response = await fetchGetMuscleList({})
    //        console.log('肌肉列表数据:', response)
    //
    //        // 增强的数据验证和错误处理
    //        if (!response || !response.list || !Array.isArray(response.list) || response.list.length === 0) {
    //            console.warn('肌肉列表数据为空或格式不正确，使用默认值')
    //            return // 保留默认值
    //        }
    //
    //        // 将肌肉列表数据转换为所需格式，并确保数据完整性
    //        const formattedData = response.list
    //            .filter(item => item && item.name && item.id !== undefined)
    //            .map(muscle => ({
    //                label: muscle.name,
    //                value: String(muscle.id), // 确保value是字符串格式
    //            }))
    //
    //        // 如果转换后的数据有效，才更新muscleGroupList
    //        if (formattedData.length > 0) {
    //            muscleGroupList.value = formattedData
    //        } else {
    //            console.warn('转换后的肌肉列表数据无效，使用默认值')
    //        }
    //    } catch (error) {
    //        console.error('获取肌肉列表数据失败:', error)
    //        // 保留默认值，确保组件正常工作
    //        ElMessage.warning('获取训练肌群数据失败，使用默认值')
    //    }
    //}

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

    // 教练列表
    const coachList = ref<Array<{ id: number; name: string }>>([])

    /**
     * 获取教练列表（从教练API获取）
     */
    const fetchCoachList = async () => {
        try {
            const response = await fetchGetCoachList({
                page: 1,
                size: 20, // 获取所有教练
            })
            // 将教练列表转换为教练列表格式
            coachList.value = response.list.map(coach => ({
                id: coach.id,
                name: coach.name,
            }))
        } catch (error) {
            console.error('获取教练列表失败:', error)
            // 如果获取失败，使用默认值
            coachList.value = []
        }
    }

    // 组件挂载时获取型号列表
    onMounted(() => {
        fetchModelList()
        fetchCoachList()
        // 调用获取肌肉分组数据方法，传递默认训练部位ID数组
        fetchMuscleGroupData([1])

        // 初始化之前选中的训练部位
        previousPart.value = [...formData.part]
    })

    //// 监听训练部位变化，更新对应的肌肉列表
    //watch(
    //    () => formData.part,
    //    newPart => {
    //        console.log('训练部位变化:', newPart)
    //        handlePartChange(newPart)
    //    },
    //    { immediate: true, deep: true },
    //)

    // 处理训练部位选择变化
    const handlePartChange = (newPart: number[]) => {
        console.log('当前选择的训练部位:', newPart)
        console.log('之前选择的训练部位:', previousPart.value)

        // 找出取消选择的训练部位
        const removedParts = previousPart.value.filter(part => !newPart.includes(part))
        console.log('取消选择的训练部位:', removedParts)

        if (removedParts.length > 0) {
            // 找出取消选择的部位对应的肌肉群ID
            const removedMuscleIds = new Set<number>()
            for (const partId of removedParts) {
                const muscleIds = partMuscleMap.value.get(partId)
                if (muscleIds) {
                    muscleIds.forEach(id => removedMuscleIds.add(id))
                }
            }
            console.log('需要移除的肌肉群ID:', removedMuscleIds)

            // 只清空与取消选择的部位相关的肌肉群
            formData.muscleGroup = formData.muscleGroup.filter(muscleId => !removedMuscleIds.has(muscleId))
            console.log('更新后的选中肌肉群:', formData.muscleGroup)
        }

        if (newPart && newPart.length > 0) {
            // 传递所有选中的部位ID获取新的肌肉列表
            fetchMuscleGroupData(newPart)
        } else {
            // 如果没有选择训练部位，清空肌肉列表和肌肉群映射
            muscleGroupList.value = []
            partMuscleMap.value = new Map()
            formData.muscleGroup = []
            console.log('没有选择训练部位，清空肌肉列表和肌肉群映射')
        }

        // 更新之前选中的训练部位记录
        previousPart.value = [...newPart]
    }

    // 表单初始数据
    const defaultFormData = {
        id: null as number | null, // 添加ID字段
        name: '',
        coverImage: '',
        video: '',
        equipment: [] as number[],
        coach: '',
        coachId: null as number | null,
        part: [] as number[],
        muscleIds: [] as number[],
        muscleGroup: [] as number[],
        aiAction: null as number | null,
        tagIds: [] as number[],
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
        tagIds: [{ required: true, message: '请选择适用型号', trigger: 'change' }],
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

        //const isEdit = props.type === 'edit' && props.actionData
        const row = props.actionData || {}

        // 处理封面图片：优先使用 picture 字段（API 返回的字段名）
        const coverImageUrl = row.picture || ''

        Object.assign(formData, {
            id: row.id || null, // 添加ID字段
            name: row.name || '',
            coverImage: coverImageUrl,
            video: row.video || '',
            equipment: row.instruments?.map(instrument => instrument.id) || [],
            coachId: row.coachId || null,
            part: row.muscleRegions?.map(region => region.id) || [],
            //muscleRegionIds: row.muscleRegions?.map(region => region.id) || [],
            muscleGroup: row.exerciseMuscles?.map(muscle => muscle.id) || [],
            aiAction: row.aiAction || null,
            tagIds: row.tags?.map(tag => tag.id) || [],
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
        selectedEquipment.value = (row.instruments || []).map((eq: any) => ({
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

        // 根据训练部位获取肌肉群列表
        if (formData.part && formData.part.length > 0) {
            fetchMuscleGroupData(formData.part)
        } else {
            muscleGroupList.value = []
            partMuscleMap.value = new Map()
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
            console.log('封面上传成功:', imageUrl.value)
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
        // formData.tagIds = Array.isArray(formData.model) ? formData.model.map(id => Number(id)) : []

        // 构建提交数据对象
        const actionDataBase: Api.Action.ActionUpdateBody | Api.Action.ActionCreateBody = {
            id: Number(formData.id), // 添加ID字段
            name: formData.name,
            picture: formData.coverImage,
            video: formData.video,
            instrumentIds: Array.isArray(formData.equipment) ? formData.equipment.map(id => Number(id)) : [],
            coachId: Number(formData.coachId),
            muscleRegionIds: formData.part,
            muscleIds: formData.muscleGroup,
            relatedActionId: formData.aiAction ? Number(formData.aiAction) : 0,
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
