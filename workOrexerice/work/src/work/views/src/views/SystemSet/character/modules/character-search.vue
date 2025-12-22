<template>
    <ArtSearchBar
        ref="searchBarRef"
        v-model="formData"
        :items="formItems"
        :rules="rules"
        @reset="handleReset"
        @search="handleSearch"
    >
    </ArtSearchBar>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'

    interface Props {
        modelValue: Record<string, any>
    }
    interface Emits {
        (e: 'update:modelValue', value: Record<string, any>): void
        (e: 'search', params: Record<string, any>): void
        (e: 'reset'): void
    }
    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    // 表单数据双向绑定
    const searchBarRef = ref()
    const formData = computed({
        get: () => props.modelValue,
        set: val => emit('update:modelValue', val),
    })

    // 校验规则
    const rules = {}

    // 表单配置
    const formItems = computed(() => [
        {
            label: '角色名称',
            key: 'name',
            type: 'input',
            placeholder: '请输入角色名称',
            clearable: true,
        },
    ])

    // 事件处理
    function handleReset() {
        console.log('重置表单')
        emit('reset')
    }

    async function handleSearch() {
        await searchBarRef.value.validate()
        // 传递 plain object 的浅拷贝，避免将 reactive Proxy 直接传入父组件引起引用问题
        const payload = { ...(formData.value || {}) }
        emit('search', payload)
        console.log('表单数据', payload)
    }
</script>
