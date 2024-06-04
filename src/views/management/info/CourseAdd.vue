<script setup lang="ts">
import {ref} from "vue";
import {CourseInfoInter} from "@/types";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import {errorNotification, successNotification} from "@/hooks/notification";

let addInfoStep = {
  courseNo: undefined,
  courseName: undefined,
  teacherNo: undefined,
  teacherName: undefined
}
let addInfo = ref<CourseInfoInter>({...addInfoStep})

function confirmAddInfo() {
  apiInstance.post("/course/add", addInfo.value)
      .then((resp) => {
        let addResp = resp.data
        if (addResp.code === code.ADD_SUCCESS) {
          successNotification(addResp.message)
          addInfo.value = addInfoStep
        } else {
          errorNotification(addResp.message)
        }
      })
}
</script>

<template>
  <div class="main">
    <h1>添加课程信息</h1>
    <div class="add">
      <form action="#" @submit.prevent>
        <div>
          <span>课程名称：</span>
          <input type="text" required v-model="addInfo.courseName">
        </div>
        <div>
          <span>教师编号：</span>
          <input type="text" required v-model="addInfo.teacherNo">
        </div>
        <div class="add-button">
          <input type="submit" @click="confirmAddInfo">
          <input type="reset">
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import './css/add.css';
</style>