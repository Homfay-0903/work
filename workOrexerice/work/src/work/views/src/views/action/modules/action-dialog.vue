<template>
    <ElDialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新建动作' : dialogType === 'view' ? '查看动作' : '编辑动作'"
        width="80%"
        align-center
        :close-on-click-modal="false"
        @close="handleDialogClose"
    >
        <ElForm ref="formRef" :model="formData" :rules="rules" label-width="120px">
            <!-- 第一行：动作名称 -->
            <ElRow :gutter="24">
                <ElCol :span="10">
                    <ElFormItem label="动作名称" prop="name">
                        <ElInput
                            v-model="formData.name"
                            placeholder="请输入动作名称"
                            :maxlength="1000"
                            :show-word-limit="true"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第二行：适用型号 和 难度 -->
            <ElRow :gutter="24">
                <ElCol :span="8">
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
                <ElCol :span="8">
                    <ElFormItem label="难度" prop="difficulty">
                        <ElSelect
                            v-model="formData.difficulty"
                            placeholder="请选择难度"
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                :label="
                                    DIFFICULTY_TRANSLATIONS[currentLangCode as keyof typeof DIFFICULTY_TRANSLATIONS][
                                        '初级'
                                    ]
                                "
                                :value="1"
                            />
                            <ElOption
                                :label="
                                    DIFFICULTY_TRANSLATIONS[currentLangCode as keyof typeof DIFFICULTY_TRANSLATIONS][
                                        '中级'
                                    ]
                                "
                                :value="2"
                            />
                            <ElOption
                                :label="
                                    DIFFICULTY_TRANSLATIONS[currentLangCode as keyof typeof DIFFICULTY_TRANSLATIONS][
                                        '高级'
                                    ]
                                "
                                :value="3"
                            />
                        </ElSelect>
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第三行：适用场景 和 动作属性 -->
            <ElRow :gutter="24">
                <ElCol :span="8">
                    <ElFormItem label="适用场景" prop="scene">
                        <ElSelect
                            v-model="formData.scene"
                            placeholder="请选择适用场景"
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                :label="
                                    SCENE_TRANSLATIONS[currentLangCode as keyof typeof SCENE_TRANSLATIONS]['力量训练']
                                "
                                :value="1"
                            />
                            <ElOption
                                :label="
                                    SCENE_TRANSLATIONS[currentLangCode as keyof typeof SCENE_TRANSLATIONS]['普拉提']
                                "
                                :value="2"
                            />
                            <ElOption
                                :label="
                                    SCENE_TRANSLATIONS[currentLangCode as keyof typeof SCENE_TRANSLATIONS]['有氧减脂']
                                "
                                :value="3"
                            />
                            <ElOption
                                :label="
                                    SCENE_TRANSLATIONS[currentLangCode as keyof typeof SCENE_TRANSLATIONS]['拉伸康复']
                                "
                                :value="4"
                            />
                            <ElOption
                                :label="
                                    SCENE_TRANSLATIONS[currentLangCode as keyof typeof SCENE_TRANSLATIONS]['评估筛查']
                                "
                                :value="5"
                            />
                        </ElSelect>
                    </ElFormItem>
                </ElCol>
                <ElCol :span="8">
                    <ElFormItem label="动作类型" prop="type">
                        <ElSelect
                            v-model="formData.type"
                            placeholder="请选择动作类型"
                            @change="handleTypeChange"
                            :disabled="dialogType === 'view'"
                        >
                            <ElOption
                                :label="
                                    ACTION_TYPES_TRANSLATIONS[
                                        currentLangCode as keyof typeof ACTION_TYPES_TRANSLATIONS
                                    ]['视频动作']
                                "
                                :value="1"
                            />
                            <ElOption
                                :label="
                                    ACTION_TYPES_TRANSLATIONS[
                                        currentLangCode as keyof typeof ACTION_TYPES_TRANSLATIONS
                                    ]['非视频动作']
                                "
                                :value="2"
                            />
                            <ElOption
                                :label="
                                    ACTION_TYPES_TRANSLATIONS[
                                        currentLangCode as keyof typeof ACTION_TYPES_TRANSLATIONS
                                    ]['片头']
                                "
                                :value="3"
                            />
                            <ElOption
                                :label="
                                    ACTION_TYPES_TRANSLATIONS[
                                        currentLangCode as keyof typeof ACTION_TYPES_TRANSLATIONS
                                    ]['片尾']
                                "
                                :value="4"
                            />
                        </ElSelect>
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第四行：动作类型 和 卡路里 -->
            <ElRow :gutter="24">
                <ElCol :span="8">
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

            <!-- 第五行：器械 和 关联AI动作 -->
            <ElRow :gutter="24">
                <ElCol :span="10">
                    <ElFormItem label="器械" prop="equipment">
                        <ElInput
                            v-model="equipmentDisplayText"
                            placeholder="请选择器械"
                            readonly
                            :disabled="dialogType === 'view'"
                        >
                            <template #append>
                                <ElButton @click="showEquipmentDialog" v-if="dialogType !== 'view'">选择</ElButton>
                            </template>
                        </ElInput>
                    </ElFormItem>
                </ElCol>
                <ElCol :span="10">
                    <ElFormItem label="关联AI动作" prop="aiAction">
                        <ElInput
                            v-model="aiActionDisplayText"
                            placeholder="请选择关联AI动作"
                            readonly
                            :disabled="dialogType === 'view'"
                        >
                            <template #append>
                                <ElButton @click="showAiActionDialog" v-if="dialogType !== 'view'">选择</ElButton>
                            </template>
                        </ElInput>
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第六行：选择教练 -->
            <ElRow :gutter="24">
                <ElCol :span="8">
                    <ElFormItem label="选择教练" prop="coach">
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
                </ElCol>
            </ElRow>

            <!-- 第七行和第八行：训练部位、训练肌群 和 动作介绍（动作介绍占据两行高度，位于右侧） -->
            <ElRow :gutter="24">
                <ElCol :span="8">
                    <!-- 第七行：训练部位 -->
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
                </ElCol>
                <ElCol :span="12">
                    <!-- 动作介绍：占据第七行和第八行的高度 -->
                    <ElFormItem label="动作介绍" prop="introduction">
                        <div v-if="dialogType === 'view'" class="view-content" v-html="formData.introduction"></div>
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
                </ElCol>
            </ElRow>

            <!-- 第九行：动作封面 -->
            <ElRow :gutter="24">
                <ElCol :span="24">
                    <ElFormItem label="动作封面" prop="coverImage">
                        <div class="flex-upload-container">
                            <ElUpload
                                class="upload-demo"
                                :http-request="customUploadCover"
                                :before-upload="beforeUploadCover"
                                :on-success="handleCoverSuccess"
                                :on-remove="handleCoverRemove"
                                :show-file-list="false"
                                :disabled="dialogType === 'view' || coverUploading"
                            >
                                <div v-if="coverUploading" class="upload-loading">
                                    <el-icon class="is-loading"><Loading /></el-icon>
                                    <span>上传中...</span>
                                </div>
                                <img v-else-if="imageUrl" :src="imageUrl" class="coverImage" />
                                <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                            </ElUpload>
                            <div class="flex-tip"> 建议上传1920*1080分辨率、10MB大小以内的JPG、PNG、JPEG格式图片 </div>
                        </div>
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第十行：动作视频 -->
            <ElRow :gutter="24" v-if="formData.type !== 2">
                <ElCol :span="12">
                    <ElFormItem label="动作视频" prop="videos">
                        <div class="video-upload-container">
                            <div v-if="videoUrl" class="video-preview">
                                <video :src="videoUrl.url" class="coverImage" controls preload="metadata" />
                            </div>
                            <div class="flex-upload-container">
                                <ElUpload
                                    v-if="!videoUrl"
                                    class="upload-demo video-upload"
                                    :http-request="customUploadVideo"
                                    :before-upload="beforeUploadVideo"
                                    :on-success="handleVideoSuccess"
                                    :show-file-list="false"
                                    :disabled="dialogType === 'view' || videoUploading"
                                >
                                    <div v-if="videoUploading" class="upload-loading">
                                        <el-icon class="is-loading"><Loading /></el-icon>
                                        <span>上传中...</span>
                                    </div>
                                    <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                                </ElUpload>
                                <div class="flex-tip"> 建议上传1920*1080分辨率、2GB大小以内的MP4格式视频 </div>
                            </div>
                            <div v-if="videoUrl && dialogType !== 'view'" class="video-actions">
                                <ElButton v-if="!videoUploading" type="primary" size="small" @click="handleReplaceVideo"
                                    >替换</ElButton
                                >
                                <ElButton v-else type="primary" size="small" :loading="videoUploading" disabled
                                    >替换中...</ElButton
                                >
                                <ElButton type="danger" size="small" @click="handleDeleteVideo">删除</ElButton>
                            </div>
                        </div>
                        <input
                            ref="replaceVideoInputRef"
                            type="file"
                            accept="video/mp4"
                            style="display: none"
                            @change="handleReplaceVideoChange"
                        />
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第十一行：动作要点 和 呼吸建议 -->
            <ElRow :gutter="24">
                <ElCol :span="12">
                    <ElFormItem label="动作要点" prop="actionDesc">
                        <ElInput
                            v-model="formData.actionDesc"
                            type="textarea"
                            :rows="3"
                            :maxlength="1000"
                            :show-word-limit="true"
                            placeholder="请输入动作要点"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                    <ElFormItem label="呼吸建议" prop="breathingSuggestion">
                        <ElInput
                            v-model="formData.breathingSuggestion"
                            type="textarea"
                            :rows="3"
                            :maxlength="1000"
                            :show-word-limit="true"
                            placeholder="请输入呼吸建议"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第十二行：动作要点图片/视频 和 错误要点 -->
            <ElRow :gutter="24">
                <ElCol :span="12">
                    <ElFormItem label="动作要点图片/视频" prop="actionMedia">
                        <div class="media-upload-container">
                            <!-- 视频预览 -->
                            <div
                                v-if="formData.actionMedia.length === 1 && formData.actionMedia[0].type === 'video'"
                                class="video-preview"
                            >
                                <video
                                    :src="formData.actionMedia[0].url"
                                    class="coverImage"
                                    controls
                                    preload="metadata"
                                />
                            </div>
                            <div
                                v-if="
                                    formData.actionMedia.length === 1 &&
                                    formData.actionMedia[0].type === 'video' &&
                                    dialogType !== 'view'
                                "
                                class="video-actions"
                            >
                                <ElButton
                                    v-if="!actionMediaUploading"
                                    type="primary"
                                    size="small"
                                    @click="handleReplaceActionMedia(0)"
                                    >替换</ElButton
                                >
                                <ElButton v-else type="primary" size="small" :loading="actionMediaUploading" disabled
                                    >替换中...</ElButton
                                >
                                <ElButton
                                    type="danger"
                                    size="small"
                                    @click="handleDeleteActionMedia(0)"
                                    :disabled="actionMediaUploading"
                                    >删除</ElButton
                                >
                            </div>

                            <!-- 图片列表 -->
                            <div
                                v-if="formData.actionMedia.length === 0 || formData.actionMedia[0].type === 'image'"
                                class="images-upload-container"
                            >
                                <div
                                    v-for="(media, index) in formData.actionMedia"
                                    :key="index"
                                    class="image-upload-item"
                                >
                                    <img :src="media.url" class="coverImage" />
                                    <div v-if="dialogType !== 'view'" class="image-actions">
                                        <ElButton size="small" @click="handleReplaceActionMedia(index)">替换</ElButton>
                                        <ElButton type="danger" size="small" @click="handleDeleteActionMedia(index)"
                                            >删除</ElButton
                                        >
                                    </div>
                                </div>
                                <!-- 统一的ElUpload，支持图片和视频 -->
                                <ElUpload
                                    v-if="
                                        formData.actionMedia.length === 0 ||
                                        (formData.actionMedia[0].type === 'image' && formData.actionMedia.length < 3)
                                    "
                                    class="upload-demo"
                                    :http-request="customUploadActionMedia"
                                    :before-upload="file => beforeUploadMedia(file, formData.actionMedia)"
                                    :on-success="handleActionMediaSuccess"
                                    :show-file-list="false"
                                    :disabled="dialogType === 'view' || actionMediaUploading"
                                    accept="image/jpeg,image/jpg,image/png,video/mp4"
                                >
                                    <div v-if="actionMediaUploading" class="upload-loading">
                                        <el-icon class="is-loading"><Loading /></el-icon>
                                        <span>上传中...</span>
                                    </div>
                                    <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                                    <template #tip>
                                        <div class="el-upload__tip">
                                            建议上传1920*1080分辨率、10MB大小以内的JPG、PNG、JPEG格式图片或2GB大小以内的MP4格式视频，PNG不带背景图效果更佳
                                            最多上传3张图片或1个视频文件
                                        </div>
                                    </template>
                                </ElUpload>
                            </div>
                        </div>
                        <input
                            ref="replaceActionMediaInputRef"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,video/mp4"
                            style="display: none"
                            @change="handleReplaceActionMediaChange"
                        />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                    <ElFormItem label="错误要点" prop="errorPoints">
                        <ElInput
                            v-model="formData.errorPoints"
                            type="textarea"
                            :rows="3"
                            :maxlength="1000"
                            :show-word-limit="true"
                            placeholder="请输入错误要点"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- 第十三行：安装示意 和 备注 -->
            <ElRow :gutter="24">
                <ElCol :span="12">
                    <ElFormItem label="安装示意" prop="instDesc">
                        <ElInput
                            v-model="formData.instDesc"
                            type="textarea"
                            :rows="3"
                            :maxlength="1000"
                            :show-word-limit="true"
                            placeholder="请输入安装示意"
                            :disabled="dialogType === 'view'"
                        />
                    </ElFormItem>
                </ElCol>
                <ElCol :span="12">
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

            <!-- 第十四行：安装示意图片/视频 -->
            <ElRow :gutter="24">
                <ElCol :span="12">
                    <ElFormItem label="安装示意图片/视频" prop="instMedia">
                        <div class="media-upload-container">
                            <!-- 视频预览 -->
                            <div
                                v-if="formData.instMedia.length === 1 && formData.instMedia[0].type === 'video'"
                                class="video-preview"
                            >
                                <video
                                    :src="formData.instMedia[0].url"
                                    class="coverImage"
                                    controls
                                    preload="metadata"
                                />
                            </div>
                            <div
                                v-if="
                                    formData.instMedia.length === 1 &&
                                    formData.instMedia[0].type === 'video' &&
                                    dialogType !== 'view'
                                "
                                class="video-actions"
                            >
                                <ElButton
                                    v-if="!instMediaUploading"
                                    type="primary"
                                    size="small"
                                    @click="handleReplaceInstMedia(0)"
                                    >替换</ElButton
                                >
                                <ElButton v-else type="primary" size="small" :loading="instMediaUploading" disabled
                                    >替换中...</ElButton
                                >
                                <ElButton
                                    type="danger"
                                    size="small"
                                    @click="handleDeleteInstMedia(0)"
                                    :disabled="instMediaUploading"
                                    >删除</ElButton
                                >
                            </div>

                            <!-- 图片列表 -->
                            <div
                                v-if="formData.instMedia.length === 0 || formData.instMedia[0].type === 'image'"
                                class="images-upload-container"
                            >
                                <div
                                    v-for="(media, index) in formData.instMedia"
                                    :key="index"
                                    class="image-upload-item"
                                >
                                    <img :src="media.url" class="coverImage" />
                                    <div v-if="dialogType !== 'view'" class="image-actions">
                                        <ElButton size="small" @click="handleReplaceInstMedia(index)">替换</ElButton>
                                        <ElButton type="danger" size="small" @click="handleDeleteInstMedia(index)"
                                            >删除</ElButton
                                        >
                                    </div>
                                </div>
                                <!-- 统一的ElUpload，支持图片和视频 -->
                                <ElUpload
                                    v-if="
                                        formData.instMedia.length === 0 ||
                                        (formData.instMedia[0].type === 'image' && formData.instMedia.length < 3)
                                    "
                                    class="upload-demo"
                                    :http-request="customUploadInstMedia"
                                    :before-upload="file => beforeUploadMedia(file, formData.instMedia)"
                                    :on-success="handleInstMediaSuccess"
                                    :show-file-list="false"
                                    :disabled="dialogType === 'view' || instMediaUploading"
                                    accept="image/jpeg,image/jpg,image/png,video/mp4"
                                >
                                    <div v-if="instMediaUploading" class="upload-loading">
                                        <el-icon class="is-loading"><Loading /></el-icon>
                                        <span>上传中...</span>
                                    </div>
                                    <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                                    <template #tip>
                                        <div class="el-upload__tip">
                                            建议上传1920*1080分辨率、10MB大小以内的JPG、PNG、JPEG格式图片或2GB大小以内的MP4格式视频，PNG不带背景图效果更佳
                                            最多上传3张图片或1个视频文件
                                        </div>
                                    </template>
                                </ElUpload>
                            </div>
                        </div>
                        <input
                            ref="replaceInstMediaInputRef"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,video/mp4"
                            style="display: none"
                            @change="handleReplaceInstMediaChange"
                        />
                    </ElFormItem>
                </ElCol>
            </ElRow>

            <!-- "其他"这一栏内容暂时删除不显示(注释掉即可) -->
            <!--
            <ElRow :gutter="24">
                <ElCol :span="24">
                    <ElFormItem label="其他" prop="other">
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
                </ElCol>
            </ElRow>
            -->
        </ElForm>

        <!-- 器械关联选择弹窗 -->
        <InstrumentRelation
            v-model:visible="equipmentDialogVisible"
            :selected-equipment-ids="formData.equipment"
            @confirm="handleEquipmentConfirm"
        />

        <!-- AI动作关联选择弹窗 -->
        <ActionRelation
            v-model:visible="aiActionDialogVisible"
            :selected-ai-id="formData.aiAction"
            @confirm="handleAiActionConfirm"
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
    import {
        MUSCLE_REGIONS_TRANSLATIONS,
        EXERCISE_MUSCLES_TRANSLATIONS,
        ACTION_TYPES_TRANSLATIONS,
        DIFFICULTY_TRANSLATIONS,
        SCENE_TRANSLATIONS,
    } from '@/utils/translations'
    import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
    import { ElMessage, ElLoading } from 'element-plus'
    import type { FormInstance, FormRules, UploadFile, UploadFiles, UploadProps } from 'element-plus'
    import ArtWangEditor from '@/components/core/forms/art-wang-editor/index.vue'
    import { Plus, Loading } from '@element-plus/icons-vue'
    import { fetchCreateAction, fetchUpdateAction } from '@/api/action'
    import { fetchGetCoachList } from '@/api/coach'
    import { fetchUploadImage } from '@/api/upload'
    import { fetchUploadVideo } from '@/api/upload'
    import { fetchGetTagList } from '@/api/tag'
    import { fetchGetMuscleList, fetchGetTrainingAreaList } from '@/api/muscle'
    import { fetchGetAiActionList } from '@/api/aiaction'

    import InstrumentRelation from './instrument-relation.vue'
    import ActionRelation from './action-relation.vue'

    const imageUrl = ref('')
    const videoUrl = ref<{ url: string; storageUrl?: string } | null>(null)
    const videoDuration = ref<number>(0)
    const replaceVideoInputRef = ref<HTMLInputElement | null>(null)

    // 动作要点媒体上传引用
    const replaceActionMediaInputRef = ref<HTMLInputElement | null>(null)
    const currentActionImageIndex = ref<number>(-1)

    // 安装示意媒体上传引用
    const replaceInstMediaInputRef = ref<HTMLInputElement | null>(null)
    const currentInstImageIndex = ref<number>(-1)

    const coverUploading = ref(false)
    const videoUploading = ref(false)
    const actionMediaUploading = ref(false)
    const instMediaUploading = ref(false)

    // 富文本编辑器引用
    const otherEditorRef = ref<InstanceType<typeof ArtWangEditor>>()

    // toolbarKeys 用于"其他"字段的富文本编辑器，该字段已暂时注释，保留以备将来恢复
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toolbarKeys = ref([
        'bold',
        'clearStyle',
        'color',
        'bgColor',
        '|',
        'uploadImage',
        //'insertImage',
        //'deleteImage',
        //'editImage',
        //'viewImageLink',
        //'insertVideo',
        'uploadVideo',
        '|',
        'divider',
        'fontSize',
        'fontFamily',
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

    // 获取当前语言
    const currentLangCode = computed(() => props.actionData?.langCode || 'zh-CN')

    const equipmentDisplayText = computed(() => {
        if (selectedEquipment.value.length === 0) return ''
        return selectedEquipment.value.map(e => e.name).join('、')
    })

    const aiActionDisplayText = computed(() => {
        if (!selectedAiAction.value) return ''
        return selectedAiAction.value.actionName || ''
    })

    const formRef = ref<FormInstance>()
    // const uploadAction = ref('') // 已注释，使用自定义上传方法替代

    const coverFileList = ref<UploadFiles>([])

    // 选中的器械和AI动作
    const selectedEquipment = ref<Array<{ id: number; name: string }>>([])
    const selectedAiAction = ref<{ actionId: number | null; actionName: string } | null>(null)

    // 关联选择对话框
    const equipmentDialogVisible = ref(false)
    const aiActionDialogVisible = ref(false)

    // 训练部位列表
    const partList = ref<Array<{ label: string; value: number }>>([])

    // 肌肉列表
    const muscleGroupList = ref<Array<{ label: string; value: number }>>([])

    // 记录每个训练部位对应的肌肉群ID，用于取消选择时只清空相关的肌肉群
    const partMuscleMap = ref(new Map<number, number[]>())

    // 存储之前选中的训练部位，用于比较找出取消选择的部位
    const previousPart = ref<number[]>([])

    // 型号列表
    const modelList = ref<Array<{ label: string; value: number }>>([])

    /**
     * 获取训练部位列表数据
     */
    const fetchPartList = async () => {
        try {
            const res = await fetchGetTrainingAreaList()
            if (res) {
                partList.value = (Array.isArray(res) ? res : []).map((region: any) => {
                    const regionName = region.name || '未知训练部位'
                    const translatedName =
                        (MUSCLE_REGIONS_TRANSLATIONS as Record<string, Record<string, string>>)[
                            currentLangCode.value
                        ]?.[regionName] || regionName
                    return {
                        label: translatedName,
                        value: region.id,
                    }
                })
            }
        } catch (error) {
            console.error('获取训练部位列表失败:', error)
        }
    }

    /**
     * 获取训练部位对应的肌肉列表数据
     */
    const fetchMuscleGroupData = async (regionIds: number[]) => {
        try {
            if (!regionIds || regionIds.length === 0 || !Array.isArray(regionIds)) {
                //console.warn('训练部位ID列表为空或格式错误，使用默认值')
                regionIds = [1]
            }

            const allMuscles: any[] = []
            const currentPartMuscleMap = new Map<number, number[]>()

            for (const regionId of regionIds) {
                //console.log('regionId:', regionId)
                const response = await fetchGetMuscleList({ regionId })
                if (response && Array.isArray(response) && response.length > 0) {
                    allMuscles.push(...response)

                    // 记录当前训练部位对应的肌肉群ID
                    const muscleIds = response.filter(item => item && item.id !== undefined).map(item => item.id)
                    currentPartMuscleMap.set(regionId, muscleIds)
                }
            }

            //console.log('所有肌肉分组数据:', allMuscles)
            //console.log('当前训练部位肌肉映射:', currentPartMuscleMap)

            if (allMuscles.length === 0) {
                //console.warn('肌肉分组数据为空，使用默认值')
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

            const formattedData = Array.from(uniqueMusclesMap.values()).map(group => {
                const muscleName = group.name
                const translatedName =
                    (EXERCISE_MUSCLES_TRANSLATIONS as Record<string, Record<string, string>>)[currentLangCode.value]?.[
                        muscleName
                    ] || muscleName
                return {
                    label: translatedName,
                    value: group.id,
                }
            })

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

                //console.log('更新肌肉列表:', formattedData)
                //console.log('更新训练部位肌肉映射:', partMuscleMap.value)
            } else {
                //console.warn('转换后的肌肉分组数据无效，使用默认值')
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
                status: 1, // 仅获取已启用教练
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
        fetchPartList()
        fetchModelList()
        fetchCoachList()
        // 调用获取肌肉分组数据方法，传递默认训练部位ID数组
        fetchMuscleGroupData([1])

        // 初始化之前选中的训练部位
        previousPart.value = [...formData.part]
    })

    // 处理训练部位选择变化
    const handlePartChange = (newPart: number[]) => {
        //console.log('当前选择的训练部位:', newPart)
        //console.log('之前选择的训练部位:', previousPart.value)

        // 找出取消选择的训练部位
        const removedParts = previousPart.value.filter(part => !newPart.includes(part))
        //console.log('取消选择的训练部位:', removedParts)

        if (removedParts.length > 0) {
            // 找出取消选择的部位对应的肌肉群ID
            const removedMuscleIds = new Set<number>()
            for (const partId of removedParts) {
                const muscleIds = partMuscleMap.value.get(partId)
                if (muscleIds) {
                    muscleIds.forEach(id => removedMuscleIds.add(id))
                }
            }
            //console.log('需要移除的肌肉群ID:', removedMuscleIds)

            // 只清空与取消选择的部位相关的肌肉群
            formData.muscleGroup = formData.muscleGroup.filter(muscleId => !removedMuscleIds.has(muscleId))
            //console.log('更新后的选中肌肉群:', formData.muscleGroup)
        }

        if (newPart && newPart.length > 0) {
            // 找出新添加的训练部位
            const addedParts = newPart.filter(part => !previousPart.value.includes(part))
            //console.log('新添加的训练部位:', addedParts)

            // 传递所有选中的部位ID获取新的肌肉列表
            fetchMuscleGroupData(newPart).then(() => {
                // 自动选择新添加部位对应的所有肌肉群
                if (addedParts.length > 0) {
                    const addedMuscleIds = new Set<number>()
                    for (const partId of addedParts) {
                        const muscleIds = partMuscleMap.value.get(partId)
                        if (muscleIds) {
                            muscleIds.forEach(id => addedMuscleIds.add(id))
                        }
                    }
                    //console.log('需要添加的肌肉群ID:', addedMuscleIds)

                    // 将新添加部位对应的肌肉群添加到已选择列表中
                    addedMuscleIds.forEach(id => {
                        if (!formData.muscleGroup.includes(id)) {
                            formData.muscleGroup.push(id)
                        }
                    })
                    //console.log('更新后的选中肌肉群:', formData.muscleGroup)
                }
            })
        } else {
            // 如果没有选择训练部位，清空肌肉列表和肌肉群映射
            muscleGroupList.value = []
            partMuscleMap.value = new Map()
            formData.muscleGroup = []
            //console.log('没有选择训练部位，清空肌肉列表和肌肉群映射')
        }

        // 更新之前选中的训练部位记录
        previousPart.value = [...newPart]
    }

    // 表单初始数据
    const defaultFormData = {
        id: null as number | null,
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
        breathingSuggestion: '',
        errorPoints: '',
        actionDesc: '',
        instDesc: '',
        actionMedia: [] as Array<{ url: string; storageUrl?: string; type: 'image' | 'video' }>,
        instMedia: [] as Array<{ url: string; storageUrl?: string; type: 'image' | 'video' }>,
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
        coverImage: [{ required: true, message: '请上传动作封面', trigger: 'change' }],
        videos: [
            {
                required: false,
                validator: (rule, value, callback) => {
                    if (!videoUrl.value) {
                        callback(new Error('请上传视频'))
                    } else {
                        callback()
                    }
                },
                trigger: 'change',
            },
        ],
        introduction: [{ required: true, message: '请填写动作介绍', trigger: 'blur' }],
        other: [{ required: true, message: '请填写其他内容', trigger: 'blur' }],
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
    const initFormData = async () => {
        if (props.type === 'add') {
            Object.assign(formData, { ...defaultFormData })
            imageUrl.value = ''
            videoUrl.value = null
            formData.actionMedia = []
            formData.instMedia = []
            selectedEquipment.value = []
            selectedAiAction.value = null
            otherEditorRef.value?.clear()
            otherEditorRef.value?.clearUrlMapping()
            return
        }

        const row = props.actionData || {}

        // 清空 URL 映射
        otherEditorRef.value?.clearUrlMapping()

        Object.assign(formData, {
            id: row.id || null,
            name: row.name || '',
            coverImage: (row as any)._picture || row.picture || '',
            video: (row as any)._video || row.video || '',
            equipment: row.instruments?.map(instrument => instrument.id) || [],
            coachId: row.coachId || null,
            part: row.muscleRegions?.map(region => region.id) || [],
            muscleGroup: row.exerciseMuscles?.map(muscle => muscle.id) || [],
            aiAction: row.relatedActionId || null,
            tagIds: row.tags?.map(tag => tag.id) || [],
            scene: row.scene || 1,
            difficulty: row.difficulty || 1,
            attribute: row.attribute || 0,
            type: row.type || 1,
            calories: row.calories || 0,
            introduction: row.introduction || '',
            other: (row as any).other || '',
            remark: row.remark || '',
            breathingSuggestion: row.breathingSuggestion || '',
            errorPoints: row.errorPoints || '',
            actionDesc: row.actionDesc || '',
            instDesc: row.instDesc || '',
        })

        // 初始化动作要点媒体
        const actionMediaUrls = row.actionMedia || []
        const actionMediaStorageUrls = row._actionMedia || []
        if (Array.isArray(actionMediaUrls) && actionMediaUrls.length > 0) {
            formData.actionMedia = actionMediaUrls.map((url: string, index: number) => ({
                url,
                storageUrl: actionMediaStorageUrls[index] || url,
                type: getMediaTypeFromUrl(url),
            }))
        } else {
            formData.actionMedia = []
        }

        // 初始化安装示意媒体
        const instMediaUrls = row.instMedia || []
        const instMediaStorageUrls = row._instMedia || []
        if (Array.isArray(instMediaUrls) && instMediaUrls.length > 0) {
            formData.instMedia = instMediaUrls.map((url: string, index: number) => ({
                url,
                storageUrl: instMediaStorageUrls[index] || url,
                type: getMediaTypeFromUrl(url),
            }))
        } else {
            formData.instMedia = []
        }

        // 处理翻译后的教练数据
        if (row.coach) {
            // 使用翻译后的教练ID和名称
            formData.coachId = row.coachId!
            // 检查翻译后的教练是否在列表中，如果不在则添加
            if (!coachList.value.find(coach => coach.id === row.coachId)) {
                coachList.value.push({
                    id: row.coachId!,
                    name: row.coach.name,
                })
            }
        } else if (formData.coachId && !coachList.value.find(coach => coach.id === formData.coachId)) {
            // 检查教练是否已被删除，如果教练不在列表中则清空 coachId
            formData.coachId = null
        }

        //console.log('[action-dialog] initFormData - row.relatedActionId:', row.relatedActionId)
        //console.log('[action-dialog] initFormData - formData.aiAction:', formData.aiAction)

        imageUrl.value = row.picture || ''

        const videoData = row.video || ''
        const videoStorageUrl = (row as any)._video || ''
        if (videoData) {
            videoUrl.value = { url: videoData, storageUrl: videoStorageUrl }
            // 优先使用后端存储的视频时长
            if (row.videoDuration) {
                videoDuration.value = row.videoDuration
            } else {
                // 否则获取视频时长
                getVideoDuration(videoData).then(duration => {
                    videoDuration.value = duration
                })
            }
        } else {
            videoUrl.value = null
            videoDuration.value = 0
        }

        selectedEquipment.value = (row.instruments || []).map((eq: any) => ({
            id: eq.id,
            name: eq.name,
        }))

        if (row.relatedActionId) {
            selectedAiAction.value = {
                actionId: row.relatedActionId,
                actionName: await getAiActionNameById(row.relatedActionId),
            }
        } else {
            selectedAiAction.value = null
        }

        if (formData.part && formData.part.length > 0) {
            fetchMuscleGroupData(formData.part)
        } else {
            muscleGroupList.value = []
            partMuscleMap.value = new Map()
        }
    }

    /**
     * 根据 AI 动作 ID 获取 AI 动作名称
     */
    const getAiActionNameById = async (actionId: number) => {
        try {
            const response = await fetchGetAiActionList({ actionId: actionId, page: 1, size: 20 })
            if (response) {
                return response.list[0].actionName || ''
            } else {
                return ''
            }
        } catch (error) {
            console.error('获取 AI 动作信息失败:', error)
            return ''
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
        const storageUrl = response?._url || response?.tmpUrl || ''
        const displayUrl = response?.url || file.url || ''

        formData.coverImage = storageUrl

        if (displayUrl) {
            imageUrl.value = displayUrl
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
     * 获取视频时长
     */
    const getVideoDuration = (videoUrl: string) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.src = videoUrl

        return new Promise<number>(resolve => {
            video.onloadedmetadata = () => {
                const duration = video.duration
                if (isNaN(duration)) {
                    resolve(0)
                    return
                }
                resolve(duration)
            }

            video.onerror = () => {
                resolve(0)
            }
        })
    }

    /**
     * 视频上传成功
     */
    const handleVideoSuccess = async (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        const storageUrl = response?._url || response?.tmpUrl || ''
        const displayUrl = response?.url || file.url || ''

        if (displayUrl) {
            videoUrl.value = { url: displayUrl, storageUrl }
            // 获取视频时长
            videoDuration.value = await getVideoDuration(displayUrl)
        }
    }

    /**
     * 删除视频
     */
    const handleDeleteVideo = () => {
        videoUrl.value = null
        videoDuration.value = 0
    }

    const handleReplaceVideo = () => {
        replaceVideoInputRef.value?.click()
    }

    const handleReplaceVideoChange = async (event: Event) => {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) {
            return
        }

        videoUploading.value = true

        try {
            const response = await fetchUploadVideo({
                file,
            })

            const storageUrl = response?._url || response?.tmpUrl || ''
            const displayUrl = response?.url || ''

            if (displayUrl) {
                videoUrl.value = { url: displayUrl, storageUrl }
                // 获取视频时长
                videoDuration.value = await getVideoDuration(displayUrl)
                ElMessage.success('视频替换成功')
            }
        } catch (error) {
            ElMessage.error('视频替换失败')
            console.error('替换视频失败:', error)
        } finally {
            videoUploading.value = false
            target.value = ''
        }
    }

    // 判断文件类型
    const getFileType = (file: File): 'image' | 'video' => {
        if (file.type.startsWith('image/')) {
            return 'image'
        } else if (file.type.startsWith('video/')) {
            return 'video'
        }
        // 通过文件扩展名判断
        const fileName = file.name.toLowerCase()
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')) {
            return 'image'
        } else if (fileName.endsWith('.mp4')) {
            return 'video'
        }
        return 'image' // 默认
    }

    // 通过URL判断媒体类型
    const getMediaTypeFromUrl = (url: string): 'image' | 'video' => {
        if (!url) return 'image'
        const urlLower = url.toLowerCase()
        // 检查URL中是否包含视频扩展名
        if (urlLower.includes('.mp4') || urlLower.includes('video')) {
            return 'video'
        }
        // 默认认为是图片
        return 'image'
    }

    // 统一的媒体上传前验证
    const beforeUploadMedia = (file: File, mediaList: Array<{ type: 'image' | 'video' }>) => {
        const fileType = getFileType(file)

        // 检查是否已有不同类型的媒体
        if (mediaList.length > 0) {
            const existingType = mediaList[0].type
            if (existingType !== fileType) {
                ElMessage.error(`已存在${existingType === 'image' ? '图片' : '视频'}，不能同时上传图片和视频`)
                return false
            }
        }

        // 图片验证
        if (fileType === 'image') {
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
            // 检查图片数量限制
            const imageCount = mediaList.filter(m => m.type === 'image').length
            if (imageCount >= 3) {
                ElMessage.error('最多只能上传3张图片')
                return false
            }
        } else {
            // 视频验证
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
            // 检查视频数量限制
            const videoCount = mediaList.filter(m => m.type === 'video').length
            if (videoCount >= 1) {
                ElMessage.error('最多只能上传1个视频')
                return false
            }
        }

        return true
    }

    // 动作要点媒体上传方法
    const customUploadActionMedia = async (options: any) => {
        try {
            // 创建新的控制器
            uploadControllers.value.actionMedia = new AbortController()
            actionMediaUploading.value = true
            const fileType = getFileType(options.file)
            let response
            if (fileType === 'image') {
                response = await fetchUploadImage({
                    file: options.file,
                    onUploadProgress: options.onProgress,
                    //signal: uploadControllers.value.actionMedia.signal,
                })
            } else {
                response = await fetchUploadVideo({
                    file: options.file,
                    onUploadProgress: options.onProgress,
                    //signal: uploadControllers.value.actionMedia.signal,
                })
            }
            options.onSuccess(response, options.file)
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                options.onError(error)
            }
        } finally {
            actionMediaUploading.value = false
            uploadControllers.value.actionMedia = null
        }
    }

    const handleActionMediaSuccess = (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        const storageUrl = response?._url || response?.tmpUrl || ''
        const displayUrl = response?.url || file.url || ''

        if (displayUrl) {
            const fileType = getFileType(file.raw as File)
            if (fileType === 'video') {
                // 视频只能有一个，替换现有内容
                formData.actionMedia = [{ url: displayUrl, storageUrl, type: 'video' }]
            } else {
                // 图片追加
                formData.actionMedia.push({ url: displayUrl, storageUrl, type: 'image' })
            }
        }
    }

    const handleReplaceActionMedia = (index: number) => {
        currentActionImageIndex.value = index
        replaceActionMediaInputRef.value?.click()
    }

    const handleReplaceActionMediaChange = async (event: Event) => {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file || currentActionImageIndex.value < 0) {
            return
        }

        const fileType = getFileType(file)
        const mediaItem = formData.actionMedia[currentActionImageIndex.value]

        // 验证类型是否匹配
        if (mediaItem.type !== fileType) {
            ElMessage.error('替换的文件类型必须与原有文件类型一致')
            target.value = ''
            return
        }

        try {
            actionMediaUploading.value = true
            let response
            if (fileType === 'image') {
                response = await fetchUploadImage({ file })
            } else {
                response = await fetchUploadVideo({ file })
            }

            const storageUrl = response?._url || response?.tmpUrl || ''
            const displayUrl = response?.url || ''

            if (displayUrl) {
                formData.actionMedia[currentActionImageIndex.value] = {
                    url: displayUrl,
                    storageUrl,
                    type: fileType,
                }
                ElMessage.success('替换成功')
            }
        } catch (error) {
            ElMessage.error('替换失败')
            console.error('替换失败:', error)
        } finally {
            actionMediaUploading.value = false
            target.value = ''
            currentActionImageIndex.value = -1
        }
    }

    const handleDeleteActionMedia = (index: number) => {
        formData.actionMedia.splice(index, 1)
    }

    // 安装示意媒体上传方法
    const customUploadInstMedia = async (options: any) => {
        try {
            // 创建新的控制器
            uploadControllers.value.instMedia = new AbortController()
            instMediaUploading.value = true
            const fileType = getFileType(options.file)
            let response
            if (fileType === 'image') {
                response = await fetchUploadImage({
                    file: options.file,
                    onUploadProgress: options.onProgress,
                    //signal: uploadControllers.value.instMedia.signal,
                })
            } else {
                response = await fetchUploadVideo({
                    file: options.file,
                    onUploadProgress: options.onProgress,
                    //signal: uploadControllers.value.instMedia.signal,
                })
            }
            options.onSuccess(response, options.file)
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                options.onError(error)
            }
        } finally {
            instMediaUploading.value = false
            uploadControllers.value.instMedia = null
        }
    }

    const handleInstMediaSuccess = (response: Api.Common.UploadFileResponse, file: UploadFile) => {
        const storageUrl = response?._url || response?.tmpUrl || ''
        const displayUrl = response?.url || file.url || ''

        if (displayUrl) {
            const fileType = getFileType(file.raw as File)
            if (fileType === 'video') {
                // 视频只能有一个，替换现有内容
                formData.instMedia = [{ url: displayUrl, storageUrl, type: 'video' }]
            } else {
                // 图片追加
                formData.instMedia.push({ url: displayUrl, storageUrl, type: 'image' })
            }
        }
    }

    const handleReplaceInstMedia = (index: number) => {
        currentInstImageIndex.value = index
        replaceInstMediaInputRef.value?.click()
    }

    const handleReplaceInstMediaChange = async (event: Event) => {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file || currentInstImageIndex.value < 0) {
            return
        }

        const fileType = getFileType(file)
        const mediaItem = formData.instMedia[currentInstImageIndex.value]

        // 验证类型是否匹配
        if (mediaItem.type !== fileType) {
            ElMessage.error('替换的文件类型必须与原有文件类型一致')
            target.value = ''
            return
        }

        try {
            instMediaUploading.value = true
            let response
            if (fileType === 'image') {
                response = await fetchUploadImage({ file })
            } else {
                response = await fetchUploadVideo({ file })
            }

            const storageUrl = response?._url || response?.tmpUrl || ''
            const displayUrl = response?.url || ''

            if (displayUrl) {
                formData.instMedia[currentInstImageIndex.value] = {
                    url: displayUrl,
                    storageUrl,
                    type: fileType,
                }
                ElMessage.success('替换成功')
            }
        } catch (error) {
            ElMessage.error('替换失败')
            console.error('替换失败:', error)
        } finally {
            instMediaUploading.value = false
            target.value = ''
            currentInstImageIndex.value = -1
        }
    }

    const handleDeleteInstMedia = (index: number) => {
        formData.instMedia.splice(index, 1)
    }

    // 上传控制器，用于中断上传
    const uploadControllers = ref({
        cover: null as AbortController | null,
        video: null as AbortController | null,
        actionMedia: null as AbortController | null,
        instMedia: null as AbortController | null,
    })

    // 自定义上传方法，使用我们实现的上传接口
    const customUploadCover: UploadProps['httpRequest'] = ({ file, onSuccess, onError, onProgress }) => {
        // 创建新的控制器
        uploadControllers.value.cover = new AbortController()
        coverUploading.value = true
        return fetchUploadImage({
            file,
            onUploadProgress: onProgress,
            //signal: uploadControllers.value.cover.signal,
        })
            .then(response => {
                onSuccess(response)
                return response
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    onError(error)
                    throw error
                }
            })
            .finally(() => {
                coverUploading.value = false
                uploadControllers.value.cover = null
            })
    }

    // 自定义视频上传方法
    const customUploadVideo: UploadProps['httpRequest'] = ({ file, onSuccess, onError, onProgress }) => {
        // 创建新的控制器
        uploadControllers.value.video = new AbortController()
        videoUploading.value = true
        return fetchUploadVideo({
            file,
            onUploadProgress: onProgress,
            //signal: uploadControllers.value.video.signal,
        })
            .then(response => {
                onSuccess(response)
                //return response
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    onError(error)
                    //throw error
                }
            })
            .finally(() => {
                videoUploading.value = false
                uploadControllers.value.video = null
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
        equipmentDialogVisible.value = true
    }

    /**
     * 显示AI动作选择对话框
     */
    const showAiActionDialog = () => {
        aiActionDialogVisible.value = true
    }

    /**
     * 处理器械选择确认
     */
    const handleEquipmentConfirm = (selections: Array<{ id: number; name: string }>) => {
        selectedEquipment.value = selections
        formData.equipment = selections.map(item => item.id)
    }

    /**
     * 处理AI动作选择确认
     */
    const handleAiActionConfirm = (selection: { actionId: number | null; actionName: string }) => {
        if (selection) {
            selectedAiAction.value = selection
            selectedAiAction.value.actionName = selection.actionName || ''
            formData.aiAction = selection.actionId
        } else {
            selectedAiAction.value = null
            formData.aiAction = null
        }
    }

    /**
     * 取消
     */
    const handleCancel = () => {
        dialogVisible.value = false
    }

    /**
     * 对话框关闭时的处理
     */
    const handleDialogClose = () => {
        // 中断所有正在进行的上传
        Object.values(uploadControllers.value).forEach(controller => {
            if (controller) {
                controller.abort()
            }
        })

        // 重置所有上传状态
        coverUploading.value = false
        videoUploading.value = false
        actionMediaUploading.value = false
        instMediaUploading.value = false

        // 清空上传控制器
        Object.keys(uploadControllers.value).forEach(key => {
            uploadControllers.value[key as keyof typeof uploadControllers.value] = null
        })

        // 对于新建动作，清空所有数据
        if (props.type === 'add') {
            Object.assign(formData, { ...defaultFormData })
            imageUrl.value = ''
            videoUrl.value = null
            formData.actionMedia = []
            formData.instMedia = []
            selectedEquipment.value = []
            selectedAiAction.value = null
        }
    }

    /**
     * 保存动作
     */
    const handleSave = async () => {
        if (!formRef.value) return
        await formRef.value.validate()

        const loadingInstance = ElLoading.service({
            lock: true,
            text: '正在保存...',
            background: 'rgba(0, 0, 0, 0.7)',
        })

        // 将型号选择值同步到tagIds
        // formData.tagIds = Array.isArray(formData.model) ? formData.model.map(id => Number(id)) : []

        // 获取转换后的富文本内容（将临时 URL 替换为永久 URL）
        const transformedOther = otherEditorRef.value?.getTransformedHtml() || formData.other

        // 构建提交数据对象
        const actionDataBase: Api.Action.ActionUpdateBody | Api.Action.ActionCreateBody = {
            id: Number(formData.id),
            name: formData.name,
            picture: formData.coverImage,
            video: videoUrl.value?.storageUrl || videoUrl.value?.url || '',
            videoDuration: videoDuration.value,
            instrumentIds: Array.isArray(formData.equipment) ? formData.equipment.map(id => Number(id)) : [],
            coachId: Number(formData.coachId),
            muscleRegionIds: formData.part,
            muscleIds: formData.muscleGroup,
            relatedActionId: formData.aiAction ? Number(formData.aiAction) : null,
            tagIds: formData.tagIds,
            scene: Number(formData.scene),
            difficulty: Number(formData.difficulty),
            attribute: Number(formData.attribute),
            type: Number(formData.type),
            calories: formData.calories,
            introduction: formData.introduction,
            other: transformedOther,
            remark: formData.remark,
            breathingSuggestion: formData.breathingSuggestion,
            errorPoints: formData.errorPoints,
            actionDesc: formData.actionDesc,
            instDesc: formData.instDesc,
            actionMedia: formData.actionMedia.map(media => media.storageUrl || media.url),
            instMedia: formData.instMedia.map(media => media.storageUrl || media.url),
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
                //console.log('更新成功:', actionDataBase.picture)
            }
            dialogVisible.value = false
        } catch (error) {
            console.error('保存失败:', error)
            ElMessage.error(dialogType.value === 'add' ? '创建失败' : '更新失败')
        } finally {
            loadingInstance.close()
        }
    }

    // 监听对话框状态和属性变化
    watch(
        () => [props.visible, props.type, props.actionData],
        async ([visible]) => {
            // 无论弹窗是否显示，只要类型或数据变化，就立即重置表单数据
            // 这样可以确保在弹窗显示前，表单数据已经被正确初始化
            await initFormData()

            if (visible) {
                // 弹窗显示时，获取最新的教练列表
                await fetchCoachList()
                nextTick(() => {
                    formRef.value?.clearValidate()
                })
            }
        },
        { immediate: true },
    )
</script>

<style lang="scss" scoped>
    .view-content {
        min-height: 60px;
        padding: 8px;
        border: 1px solid var(--el-border-color-light);
        border-radius: 4px;
        background-color: var(--el-fill-color-lighter);
    }

    :deep(.el-input-group__append) {
        padding: 0;
        background-color: transparent;
    }

    :deep(.el-input-group__append .el-button) {
        border: none;
        border-radius: 0 4px 4px 0;
        background-color: var(--el-color-primary);
        color: #fff;

        &:hover {
            background-color: var(--el-color-primary-light-3);
            color: #fff;
        }

        &:active {
            background-color: var(--el-color-primary-dark-2);
        }
    }

    :deep(.el-upload__tip) {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        line-height: 1.4;
        margin-top: 4px;
    }

    .flex-upload-container {
        display: flex;
        align-items: flex-end; /* 底部对齐 */
        gap: 12px; /* 元素间距 */
    }

    .flex-tip {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        line-height: 1.4;
        padding-bottom: 8px; /* 微调垂直对齐 */
        min-width: 0; /* 防止溢出 */
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

    .video-upload-container {
        width: 100%;
    }

    .video-list {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 16px;
    }

    .video-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .video-actions {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 150px;
        margin-top: 12px;
    }

    .video-index {
        font-size: 12px;
        color: var(--el-text-color-regular);
    }

    .action-buttons {
        display: flex;
        gap: 8px;
    }

    .images-upload-container {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: flex-start;
    }

    .image-upload-item {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .image-upload-item .coverImage {
        width: 150px;
        height: 150px;
        display: block;
        object-fit: cover;
    }

    .image-actions {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 150px;
    }

    .video-upload .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .video-upload .el-upload:hover {
        border-color: var(--el-color-primary);
    }
</style>

<style>
    .upload-demo .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
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

    .upload-loading {
        width: 150px;
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--el-color-primary);
    }

    .upload-loading .el-icon {
        font-size: 32px;
    }

    .upload-loading span {
        font-size: 14px;
    }
</style>
