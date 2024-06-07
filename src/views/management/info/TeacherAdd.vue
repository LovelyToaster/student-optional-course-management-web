<script setup lang="ts">
import {ref} from "vue";
import {TeacherInfoInter} from "@/types";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import {errorNotification, successNotification} from "@/hooks/notification";

let addInfoStep = {
  teacherNo: undefined,
  teacherName: undefined,
  teacherSex: undefined,
  teacherAge: undefined,
  teacherDegree: undefined,
  teacherJob: undefined,
  teacherGraduateInstitutions: undefined,
  teacherHealth: undefined,
}
let addInfo = ref<TeacherInfoInter>({...addInfoStep})

function confirmAddInfo() {
  apiInstance.post("/teacher/add", addInfo.value)
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
    <h1>添加教师信息</h1>
    <div class="add">
      <form action="#" @submit.prevent>
        <div>
          <span>教师姓名：</span>
          <input type="text" required v-model="addInfo.teacherName">
        </div>
        <div>
          <span>教师性别：</span>
          <input type="radio" name="teacherSex" value="男" required v-model="addInfo.teacherSex">男
          <input type="radio" name="teacherSex" value="女" required v-model="addInfo.teacherSex">女
        </div>
        <div>
          <span>教师年龄：</span>
          <input type="number" min="18" max="80" required v-model="addInfo.teacherAge">
        </div>
        <div>
          <span>教师学历：</span>
          <input type="text" required v-model="addInfo.teacherDegree">
        </div>
        <div>
          <span>教师工作：</span>
          <input type="text" required v-model="addInfo.teacherJob">
        </div>
        <div>
          <span>毕业院校：</span>
          <input type="text" required v-model="addInfo.teacherGraduateInstitutions">
        </div>
        <div>
          <span>健康状态：</span>
          <input type="radio" name="teacherHealth" value="良好" required v-model="addInfo.teacherHealth">良好
          <input type="radio" name="teacherHealth" value="较差" required v-model="addInfo.teacherHealth">较差
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