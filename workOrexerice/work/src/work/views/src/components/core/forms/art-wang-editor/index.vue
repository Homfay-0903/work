<!-- WangEditor 富文本编辑器 插件地址：https://www.wangeditor.com/ -->
<template>
    <div class="editor-wrapper">
        <Toolbar class="editor-toolbar" :editor="editorRef" :mode="mode" :defaultConfig="toolbarConfig" />
        <Editor
            :style="{ height: height, overflowY: 'hidden' }"
            v-model="modelValue"
            :mode="mode"
            :defaultConfig="editorConfig"
            @onCreated="onCreateEditor"
        />
    </div>
</template>

<script setup lang="ts">
    import '@wangeditor/editor/dist/css/style.css'
    import { onBeforeUnmount, onMounted, shallowRef, computed, ref } from 'vue'
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
    import { ElMessage, ElLoading } from 'element-plus'
    import { fetchUploadImage, fetchUploadVideo } from '@/api/upload'
    import EmojiText from '@/utils/ui/emojo'
    import { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor'

    defineOptions({ name: 'ArtWangEditor' })

    interface Props {
        /** 编辑器高度 */
        height?: string
        /** 自定义工具栏配置 */
        toolbarKeys?: string[]
        /** 插入新工具到指定位置 */
        insertKeys?: { index: number; keys: string[] }
        /** 排除的工具栏项 */
        excludeKeys?: string[]
        /** 编辑器模式 */
        mode?: 'default' | 'simple'
        /** 占位符文本 */
        placeholder?: string
        /** 上传配置 */
        uploadConfig?: {
            maxFileSize?: number
            maxNumberOfFiles?: number
            imageMaxFileSize?: number // 新增：单独控制图片大小限制
            videoMaxFileSize?: number // 新增：单独控制视频大小限制
            imageAllowedFileTypes?: string[] // 新增：图片允许的文件类型
            videoAllowedFileTypes?: string[] // 新增：视频允许的文件类型
            server?: string
        }
    }

    const props = withDefaults(defineProps<Props>(), {
        height: '500px',
        mode: 'default',
        placeholder: '请输入内容...',
        excludeKeys: () => ['fontFamily'],
    })

    const modelValue = defineModel<string>({ required: true })

    // 编辑器实例
    const editorRef = shallowRef<IDomEditor>()

    // 临时 URL 到永久 URL 的映射
    const urlMapping = ref<Map<string, string>>(new Map())

    // 常量配置
    const DEFAULT_UPLOAD_CONFIG = {
        maxFileSize: 20 * 1024 * 1024, // 20MB - 默认最大文件大小
        maxNumberOfFiles: 10,
        fieldName: 'file',
        imageMaxFileSize: 10 * 1024 * 1024, // 10MB - 图片默认最大大小
        videoMaxFileSize: 50 * 1024 * 1024, // 50MB - 视频默认最大大小
        imageAllowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'], // 图片允许的类型
        videoAllowedFileTypes: ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime'], // 视频允许的类型
    } as const

    // 合并上传配置
    const mergedUploadConfig = computed(() => ({
        ...DEFAULT_UPLOAD_CONFIG,
        ...props.uploadConfig,
    }))

    // 工具栏配置
    const toolbarConfig = computed((): Partial<IToolbarConfig> => {
        const config: Partial<IToolbarConfig> = {}

        // 完全自定义工具栏
        if (props.toolbarKeys && props.toolbarKeys.length > 0) {
            config.toolbarKeys = props.toolbarKeys
        }

        // 插入新工具
        if (props.insertKeys) {
            config.insertKeys = props.insertKeys
        }

        // 排除工具
        if (props.excludeKeys && props.excludeKeys.length > 0) {
            config.excludeKeys = props.excludeKeys
        }

        return config
    })

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: props.placeholder,
        MENU_CONF: {
            uploadImage: {
                fieldName: mergedUploadConfig.value.fieldName,
                maxFileSize: mergedUploadConfig.value.imageMaxFileSize || mergedUploadConfig.value.maxFileSize, // 优先使用图片专用配置
                maxNumberOfFiles: mergedUploadConfig.value.maxNumberOfFiles,
                allowedFileTypes: mergedUploadConfig.value.imageAllowedFileTypes, // 图片文件类型
                customUpload(file: File, insertFn: (url: string, alt: string, href: string) => void) {
                    const formData = new FormData()
                    formData.append('file', file)

                    const loadingInstance = ElLoading.service({
                        lock: true,
                        text: '正在上传图片...',
                        background: 'rgba(0, 0, 0, 0.7)',
                    })

                    fetchUploadImage({
                        file,
                    })
                        .then((response: any) => {
                            const displayUrl = response?.url || response?.tmpUrl || ''
                            const storageUrl = response?._url || ''

                            if (displayUrl && storageUrl) {
                                // 保存临时 URL 到永久 URL 的映射
                                urlMapping.value.set(displayUrl, storageUrl)
                                // 使用临时 URL 显示图片
                                insertFn(displayUrl, file.name, displayUrl)
                                ElMessage.success(`图片上传成功 ${EmojiText[200]}`)
                            } else {
                                throw new Error('上传响应中没有返回图片URL')
                            }
                        })
                        .catch((error: any) => {
                            console.error('图片上传失败:', error)
                            ElMessage.error(`图片上传失败 ${EmojiText[500]}`)
                        })
                        .finally(() => {
                            loadingInstance.close()
                        })
                },
            },
            uploadVideo: {
                fieldName: mergedUploadConfig.value.fieldName,
                maxFileSize: mergedUploadConfig.value.videoMaxFileSize || mergedUploadConfig.value.maxFileSize, // 优先使用视频专用配置
                maxNumberOfFiles: mergedUploadConfig.value.maxNumberOfFiles,
                allowedFileTypes: mergedUploadConfig.value.videoAllowedFileTypes, // 视频文件类型
                customUpload(file: File, insertFn: (url: string, alt: string, href: string) => void) {
                    const formData = new FormData()
                    formData.append('file', file)

                    const loadingInstance = ElLoading.service({
                        lock: true,
                        text: '正在上传视频...',
                        background: 'rgba(0, 0, 0, 0.7)',
                    })

                    fetchUploadVideo({
                        file,
                    })
                        .then((response: any) => {
                            const displayUrl = response?.url || response?.tmpUrl || ''
                            const storageUrl = response?._url || ''

                            if (displayUrl && storageUrl) {
                                // 保存临时 URL 到永久 URL 的映射
                                urlMapping.value.set(displayUrl, storageUrl)
                                // 使用临时 URL 显示图片
                                insertFn(displayUrl, file.name, displayUrl)
                                ElMessage.success(`视频上传成功 ${EmojiText[200]}`)
                            } else {
                                throw new Error('上传响应中没有返回视频URL')
                            }
                        })
                        .catch((error: any) => {
                            console.error('视频上传失败:', error)
                            ElMessage.error(`视频上传失败 ${EmojiText[500]}`)
                        })
                        .finally(() => {
                            loadingInstance.close()
                        })
                },
            },
        },
    }

    // 编辑器创建回调
    const onCreateEditor = (editor: IDomEditor) => {
        editorRef.value = editor

        // 监听全屏事件
        editor.on('fullScreen', () => {
            console.log('编辑器进入全屏模式')
        })

        // 确保在编辑器创建后应用自定义图标
        applyCustomIcons()
    }

    // 应用自定义图标（带重试机制）
    const applyCustomIcons = () => {
        let retryCount = 0
        const maxRetries = 10
        const retryDelay = 100

        const tryApplyIcons = () => {
            const editor = editorRef.value
            if (!editor) {
                if (retryCount < maxRetries) {
                    retryCount++
                    setTimeout(tryApplyIcons, retryDelay)
                }
                return
            }

            // 获取当前编辑器的工具栏容器
            const editorContainer = editor.getEditableContainer().closest('.editor-wrapper')
            if (!editorContainer) {
                if (retryCount < maxRetries) {
                    retryCount++
                    setTimeout(tryApplyIcons, retryDelay)
                }
                return
            }

            const toolbar = editorContainer.querySelector('.w-e-toolbar')
            const toolbarButtons = editorContainer.querySelectorAll('.w-e-bar-item button[data-menu-key]')

            if (toolbar && toolbarButtons.length > 0) {
                return
            }

            // 如果工具栏还没渲染完成，继续重试
            if (retryCount < maxRetries) {
                retryCount++
                setTimeout(tryApplyIcons, retryDelay)
            } else {
                console.warn('工具栏渲染超时，无法应用自定义图标 - 编辑器实例:', editor.id)
            }
        }

        // 使用 requestAnimationFrame 确保在下一帧执行
        requestAnimationFrame(tryApplyIcons)
    }

    // 暴露编辑器实例和方法
    defineExpose({
        /** 获取编辑器实例 */
        getEditor: () => editorRef.value,
        /** 设置编辑器内容 */
        setHtml: (html: string) => editorRef.value?.setHtml(html),
        /** 获取编辑器内容 */
        getHtml: () => editorRef.value?.getHtml(),
        /** 清空编辑器 */
        clear: () => editorRef.value?.clear(),
        /** 聚焦编辑器 */
        focus: () => editorRef.value?.focus(),
        /** 获取转换后的 HTML（将临时 URL 替换为永久 URL） */
        getTransformedHtml: () => {
            const html = editorRef.value?.getHtml() || ''
            let transformedHtml = html

            // 将所有临时 URL 替换为永久 URL
            urlMapping.value.forEach((storageUrl, displayUrl) => {
                const regex = new RegExp(escapeRegExp(displayUrl), 'g')
                transformedHtml = transformedHtml.replace(regex, storageUrl)
            })

            return transformedHtml
        },
        /** 清空 URL 映射 */
        clearUrlMapping: () => {
            urlMapping.value.clear()
        },
    })

    // 转义正则表达式特殊字符
    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    // 生命周期
    onMounted(() => {
        // 图标替换已在 onCreateEditor 中处理
    })

    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor) {
            editor.destroy()
        }
    })
</script>

<style lang="scss">
    @use './style';
</style>
