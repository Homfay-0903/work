<script setup lang="ts">
import phy5 from "./components/phy-fix/phy5.vue";
import phy4 from "./components/phy-fix/phy4.vue";
//import phy-fix from './components/phy-fix/phy-fix.vue';

import fsm3 from "./components/fsm/fsm3.vue";
//import TrainingView from './components/muscle/TrainingView.vue';

import cicrle from "./components/quesOrexe/cicrle.vue";
import TodoItem from "./components/exercise/index.vue";

interface ListItem {
  id: number;
  title: string;
}
const todoList = ref<ListItem[]>([
  {
    id: 1,
    title: "Do the dishes",
  },
  {
    id: 2,
    title: "Take out the trash",
  },
  {
    id: 3,
    title: "Mow the lawn",
  },
]);


</script>

<template>
    <span>Add a todo:</span>
    <input type="text" v-model="aboutText" placeholder="....">
</template>

<style scoped></style>
