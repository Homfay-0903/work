<template>
    <div class="privacy-policy">
        <div class="policy-header">
            <h2>{{ $t('privacyPolicy.title') }}</h2>
            <p class="policy-date">{{ $t('privacyPolicy.lastUpdated') }}: {{ lastUpdatedDate }}</p>
        </div>

        <div class="policy-content">
            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.intro.title') }}</h3>
                <p>{{ $t('privacyPolicy.intro.content') }}</p>
            </section>

            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.dataCollection.title') }}</h3>
                <p>{{ $t('privacyPolicy.dataCollection.content.1') }}</p>
                <ul class="policy-list">
                    <li>{{ $t('privacyPolicy.dataCollection.content.2') }}</li>
                    <li>{{ $t('privacyPolicy.dataCollection.content.3') }}</li>
                    <li>{{ $t('privacyPolicy.dataCollection.content.4') }}</li>
                    <li>{{ $t('privacyPolicy.dataCollection.content.5') }}</li>
                </ul>
            </section>

            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.dataUse.title') }}</h3>
                <p>{{ $t('privacyPolicy.dataUse.content.1') }}</p>
                <ul class="policy-list">
                    <li>{{ $t('privacyPolicy.dataUse.content.2') }}</li>
                    <li>{{ $t('privacyPolicy.dataUse.content.3') }}</li>
                    <li>{{ $t('privacyPolicy.dataUse.content.4') }}</li>
                    <li>{{ $t('privacyPolicy.dataUse.content.5') }}</li>
                </ul>
            </section>

            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.dataProtection.title') }}</h3>
                <p>{{ $t('privacyPolicy.dataProtection.content') }}</p>
            </section>

            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.dataSharing.title') }}</h3>
                <p>{{ $t('privacyPolicy.dataSharing.content.1') }}</p>
                <ul class="policy-list">
                    <li>{{ $t('privacyPolicy.dataSharing.content.2') }}</li>
                    <li>{{ $t('privacyPolicy.dataSharing.content.3') }}</li>
                    <li>{{ $t('privacyPolicy.dataSharing.content.4') }}</li>
                </ul>
            </section>

            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.userRights.title') }}</h3>
                <p>{{ $t('privacyPolicy.userRights.content') }}</p>
            </section>

            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.policyUpdates.title') }}</h3>
                <p>{{ $t('privacyPolicy.policyUpdates.content') }}</p>
            </section>

            <section class="policy-section">
                <h3>{{ $t('privacyPolicy.contact.title') }}</h3>
                <p>{{ $t('privacyPolicy.contact.content') }}</p>
            </section>
        </div>

        <div class="policy-footer">
            <ElButton @click="handleDisagree" style="margin-right: 10px">不同意</ElButton>
            <ElButton type="primary" @click="handleAgree">同意</ElButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    //import { useI18n } from 'vue-i18n'

    defineOptions({ name: 'PrivacyPolicy' })

    //const { t } = useI18n()
    const lastUpdatedDate = '2026-01-01'

    // 定义事件
    const emit = defineEmits<{
        (e: 'agree'): void
        (e: 'disagree'): void
    }>()

    // 处理同意按钮点击
    const handleAgree = () => {
        emit('agree')
    }

    // 处理不同意按钮点击
    const handleDisagree = () => {
        emit('disagree')
    }
</script>

<style scoped>
    .privacy-policy {
        max-height: 500px;
        overflow-y: auto;
        padding: 0 20px;
    }

    .policy-header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--el-border-color);
    }

    .policy-header h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 10px;
        color: var(--el-text-color-primary);
    }

    .policy-date {
        font-size: 14px;
        color: var(--el-text-color-secondary);
    }

    .policy-content {
        line-height: 1.8;
        color: var(--el-text-color-primary);
    }

    .policy-section {
        margin-bottom: 30px;
    }

    .policy-section h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        color: var(--el-text-color-primary);
    }

    .policy-section p {
        margin-bottom: 15px;
        font-size: 14px;
        color: var(--el-text-color-regular);
    }

    .policy-list {
        margin-left: 20px;
        margin-bottom: 15px;
    }

    .policy-list li {
        margin-bottom: 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
    }

    /* 滚动条样式 */
    .privacy-policy::-webkit-scrollbar {
        width: 6px;
    }

    .privacy-policy::-webkit-scrollbar-track {
        background: var(--el-fill-color-light);
        border-radius: 3px;
    }

    .privacy-policy::-webkit-scrollbar-thumb {
        background: var(--el-border-color);
        border-radius: 3px;
    }

    .privacy-policy::-webkit-scrollbar-thumb:hover {
        background: var(--el-border-color-light);
    }

    .policy-footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid var(--el-border-color);
        display: flex;
        justify-content: center;
        gap: 10px;
    }
</style>
