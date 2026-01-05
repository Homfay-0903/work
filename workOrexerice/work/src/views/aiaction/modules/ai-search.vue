<template>
    <ArtSearchBar
        ref="searchBarRef"
        v-model="formData"
        :items="formItems"
        :rules="rules"
        :disabled-search="isSearchDisabled"
        @reset="handleReset"
        @search="handleSearch"
    >
    </ArtSearchBar>
</template>

<script setup lang="ts">
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

    const rules = {}

    // 搜索按钮不禁用（允许空搜索）
    const isSearchDisabled = computed(() => false)

    const formItems = computed(() => [
        {
            label: 'ID',
            key: 'id',
            type: 'input',
            props: {
                placeholder: '请输入ID',
                clearable: true,
            },
        },
        {
            label: '动作名称',
            key: 'name',
            type: 'input',
            props: {
                placeholder: '请输入动作名称',
                clearable: true,
            },
        },
    ])

    async function handleSearch() {
        await searchBarRef.value.validate()
        // 传递 plain object 的浅拷贝，避免将 reactive Proxy 直接传入父组件引起引用问题
        const payload = { ...(formData.value || {}) }
        emit('search', payload)
        console.log('表单数据', payload)
    }

    function handleReset() {
        formData.value = {}
        emit('reset')
    }
</script>

<style scoped></style>
