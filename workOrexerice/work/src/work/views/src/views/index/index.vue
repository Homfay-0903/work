<!-- 布局容器 -->
<template>
    <div class="app-layout">
        <aside id="app-sidebar">
            <ArtSidebarMenu />
        </aside>

        <main id="app-main">
            <div id="app-header">
                <ArtHeaderBar />
            </div>
            <div id="app-content" class="app-content-wrapper">
                <div v-if="routeLoading" class="content-loading-overlay">
                    <div class="loading-spinner"></div>
                </div>
                <ArtPageContent />
            </div>
        </main>

        <div id="app-global">
            <ArtGlobalComponent />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useSettingStore } from '@/store/modules/setting'
    import { storeToRefs } from 'pinia'

    defineOptions({ name: 'AppLayout' })

    const settingStore = useSettingStore()
    const { routeLoading } = storeToRefs(settingStore)
</script>

<style lang="scss" scoped>
    @use './style';

    .app-content-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .content-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        pointer-events: none;
    }

    .dark .content-loading-overlay {
        background-color: rgba(7, 7, 7, 0.7);
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--el-border-color);
        border-top-color: var(--el-color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
