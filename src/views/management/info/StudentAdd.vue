<script setup lang="ts">
import {ref} from "vue";
import {StudentInfoInter} from "@/types";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import {errorNotification, successNotification} from "@/hooks/notification";

let addInfoStep = {
  studentNo: undefined,
  studentName: undefined,
  studentSex: undefined,
  studentAge: undefined,
  studentFaculties: undefined,
  studentClass: undefined,
}
let addInfo = ref<StudentInfoInter>({...addInfoStep})

function confirmAddInfo() {
  apiInstance.post("/student/add", addInfo.value)
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
    <h1>添加学生信息</h1>
    <div class="add">
      <form action="#" @submit.prevent>
        <div>
          <span>学生姓名：</span>
          <input type="text" required v-model="addInfo.studentName">
        </div>
        <div>
          <span>学生性别：</span>
          <input type="radio" name="teacherSex" value="男" required v-model="addInfo.studentSex">男
          <input type="radio" name="teacherSex" value="女" required v-model="addInfo.studentSex">女
        </div>
        <div>
          <span>学生年龄：</span>
          <input type="number" min="18" max="80" required v-model="addInfo.studentAge">
        </div>
        <div>
          <span>学生院系：</span>
          <input type="text" required v-model="addInfo.studentFaculties">
        </div>
        <div>
          <span>学生班级：</span>
          <input type="text" required v-model="addInfo.studentClass">
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