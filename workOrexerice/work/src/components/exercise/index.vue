<template>
    <p>{{ prop.index }}: {{ prop.desc }}</p>
    <button @click="$emit('remove')">Remove</button>
</template>

<script setup lang="ts">
    interface Prop {
        index: number,
        desc: string
    }
    interface Emit {
        "remove": []
    }

    const prop = defineProps<Prop>()
    const emit = defineEmits<Emit>()
</script>