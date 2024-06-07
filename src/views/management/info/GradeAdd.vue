<script setup lang="ts">
import {ref} from "vue";
import {GradeInfoInter, StudentInfoInter} from "@/types";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import {errorNotification, successNotification} from "@/hooks/notification";

let addInfoStep = {
  no: undefined,
  studentNo: undefined,
  studentName: undefined,
  courseNo: undefined,
  courseName: undefined,
  grade: undefined
}
let addInfo = ref<GradeInfoInter>({...addInfoStep})

function confirmAddInfo() {
  apiInstance.post("/grade/add", addInfo.value)
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
    <h1>添加成绩信息</h1>
    <div class="add">
      <form action="#" @submit.prevent>
        <div>
          <span>学生编号：</span>
          <input type="text" required v-model="addInfo.studentNo">
        </div>
        <div>
          <span>课程编号：</span>
          <input type="text" required v-model="addInfo.courseNo">
        </div>
        <div>
          <span>课程成绩：</span>
          <input type="number" min="0" max="100" required v-model="addInfo.grade">
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
@import '@/assets/css/add.css';
</style>