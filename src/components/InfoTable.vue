<script setup lang="ts">

import {errorNotification} from "@/hooks/notification.js";
import {reactive, ref, watch} from "vue";

let isLoading = ref(true)
let props = defineProps({
  titleMessage: Array,
  info: Array,
  infoMessage: Array,
  isSelect: Array,
  clickModifyInfo: Function,
  clickDeleteInfo: Function,
  clickSelectCourse: Function,
  type: String
})
let page = reactive({
  current: 1,
  max: 1,
  info: 8
})
defineExpose({
  page,
  isLoading
})


watch(() => props.info.length
    , () => {
      if (isLoading.value)
        isLoading.value = false
      page.max = Math.ceil(props.info.length / page.info)
      page.current = 1
    })
</script>

<template>
  <div class="main-info" v-loading="isLoading" element-loading-background="white">
    <table class="main-table">
      <tr>
        <th v-for="title in titleMessage">{{ title }}</th>
      </tr>
      <tr v-for="(dataArray,index) in info.slice((page.current-1)*page.info,page.current*page.info)" :key="index"
          class="tr-hover">
        <td v-for="data in dataArray">{{ data }}</td>
        <td v-if="!type">
          <button @click="clickModifyInfo(index)">修改</button>
          <button @click="clickDeleteInfo(index)">删除</button>
        </td>
        <td v-if="type==='studentCourseManagement'">
          <span v-if="dataArray[5]">已结课</span>
          <button v-if="!dataArray[5]" @click="clickDeleteInfo(index)">退课</button>
        </td>
        <td v-if="type==='studentCourseAdd'">
          <span v-if="isSelect[index]">已选此课</span>
          <button v-if="!isSelect[index]" @click="clickSelectCourse(index)">选课</button>
        </td>
      </tr>
    </table>
    <div class="page">
        <span @click="page.current===1?errorNotification('已经是第一页了'):page.current--"
              style="cursor: pointer;">上一页
        </span>
      <span>
          {{ page.current }}/{{ page.max }}
        </span>
      <span @click="page.current===page.max?errorNotification('已经是最后一页了'):page.current++"
            style="cursor: pointer;">下一页
        </span>
    </div>
  </div>
</template>

<style scoped>
.main-info {
  width: 75%;
}

.main-table {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  border: 1px solid black;
}

.main-table tr {
  height: 40px;
}

.main-table th, td {
  border: 1px solid black;
}

.tr-hover:hover {
  background-color: rgba(100, 149, 237, 0.4);
}

.tr-hover button {
  margin-left: 10px;
  margin-right: 10px;
  height: 30px;
  width: 50px;
}

.page {
  margin-top: 10px;
  text-align: right;
}

.page > span {
  margin: 0 10px;
  color: cornflowerblue;
}
</style>