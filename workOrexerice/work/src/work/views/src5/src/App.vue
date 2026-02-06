<template>
    <div id="app" v-cloak>
        <router-view />
    </div>
</template>

<script>
import '@/assets/css/common.css'
import { version } from '../package.json'
export default {
    name: 'App',
    created () {
        console.log(`report version = ${version}`)
    }
}
</script>
