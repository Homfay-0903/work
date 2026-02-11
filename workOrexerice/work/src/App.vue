//
<!---
<script setup lang="ts">
//import Select from './work/views/src3/src/views/girth/select.vue';

//import phy5 from "./components/phy-fix/phy5.vue";
//import phy4 from "./components/phy-fix/phy4.vue";
////import phy-fix from './components/phy-fix/phy-fix.vue';
//
//import fsm3 from "./components/fsm/fsm3.vue";
////import TrainingView from './components/muscle/TrainingView.vue';
//
//import cicrle from "./components/quesOrexe/cicrle.vue";
//import TodoItem from "./components/exercise/index.vue";
//import { ref } from 'vue'
//
//interface ListItem {
//  id: number;
//  title: string;
//}
//const todoList = ref<ListItem[]>([
//  {
//    id: 1,
//    title: "Do the dishes",
//  },
//  {
//    id: 2,
//    title: "Take out the trash",
//  },
//  {
//    id: 3,
//    title: "Mow the lawn",
//  },
//]);
//
//const aboutText = ref("");
//const aboutId = ref(4);
//
//const handleTodoList = () => {
//  todoList.value.push({
//    id: aboutId.value++,
//    title: aboutText.value,
//  });
//  aboutText.value = ''
//};
//
/
-->


<template>
  <select v-model="seleted">
    <option v-for="option in options"></option>
  </select>
</template>

<script setup lang="ts">
import { ref } from "vue";

const seleted = ref("");

const options = ref([
  { text: "One", value: "A" },
  { text: "Two", value: "B" },
  { text: "Three", value: "C" },
]);
</script>

<style></style>
