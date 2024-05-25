<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {TeacherInfoArr, TeacherInfoInter} from "@/types";
import apiInstance from "@/hooks/apiInstance";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";

let manCount = ref(0)
let womanCount = ref(0)
let totalCount = ref(0)
let teacherInfo = ref<TeacherInfoArr>([])
let teacherSearchInfoStep = {
  teacherNo: undefined,
  teacherName: undefined,
  teacherSex: undefined,
  teacherAge: undefined,
  teacherDegree: undefined,
  teacherJob: undefined,
  teacherGraduateInstitutions: undefined,
  teacherHealth: undefined,
}
let teacherSearchInfo = reactive<TeacherInfoInter>({...teacherSearchInfoStep})
let isModify = ref(false)
let isDelete = ref(false)
let isSearch = ref(false)
let isRefresh = false
let teacherInfoModifyIndex = 0
let teacherInfoDeleteIndex = 0
let page = reactive({
  current: 1,
  max: 1,
  info: 8
})

async function getTeacherInfo() {
  await apiInstance.get("/teacher/all")
      .then((resp) => {
        manCount.value = resp.data.manCount
        womanCount.value = resp.data.womanCount
        totalCount.value = resp.data.totalCount
        teacherInfo.value = resp.data.data
        isRefresh = true
      })
}

function modifyTeacherInfo(index: number) {
  isModify.value = true
  teacherInfoModifyIndex = index + (page.current - 1) * page.info
}

function deleteTeacherInfo(index: number) {
  isDelete.value = true
  teacherInfoDeleteIndex = index + (page.current - 1) * page.info
}

function confirmModifyTeacher() {
  isModify.value = false
  apiInstance.post("/teacher/modify", teacherInfo.value[teacherInfoModifyIndex])
      .then((resp) => {
        if (resp.data.message) {
          successNotification("信息修改成功!")
          getTeacherInfo()
        } else {
          errorNotification("请检查信息输入是否正确")
        }
      })
}

function confirmDeleteTeacher() {
  isDelete.value = false
  apiInstance.post("/teacher/delete", {
    teacherNo: teacherInfo.value[teacherInfoDeleteIndex].teacherNo
  })
      .then((resp) => {
        if (resp.data.message) {
          successNotification("信息修改成功!")
          getTeacherInfo()
        } else {
          errorNotification("请检查信息输入是否正确")
        }
      })
}

function searchTeacherInfo() {
  isSearch.value = true
}

function confirmSearchTeacherInfo() {
  isSearch.value = false
  apiInstance.post("/teacher/search", teacherSearchInfo)
      .then((resp) => {
        if (resp.data.data) {
          teacherInfo.value = resp.data.data
          successNotification("查询成功，共" + resp.data.data.length + "条数据")
        } else {
          errorNotification("没有查到数据")
        }
        Object.assign(teacherSearchInfo, teacherSearchInfoStep)
      })
}

async function refreshInfo() {
  isRefresh = false
  await getTeacherInfo()
  if (isRefresh) {
    successNotification("刷新成功")
  } else {
    errorNotification("刷新失败")
  }
}

watch(teacherInfo, () => {
  page.max = Math.ceil(teacherInfo.value.length / page.info)
  if (page.current > page.max) {
    page.current = 1
  }
})

onMounted(() => {
  getTeacherInfo()
})

</script>

<template>
  <div class="main">
    <h1>所有教师的信息</h1>
    <h3>共：{{ totalCount }}人&nbsp;&nbsp;&nbsp;男：{{ manCount }}人&nbsp;&nbsp;&nbsp;女：{{ womanCount }}人</h3>
    <div class="main-info">
      <table class="main-table">
        <tr>
          <th>教师编号</th>
          <th>教师姓名</th>
          <th>教师性别</th>
          <th>教师年龄</th>
          <th>教师学历</th>
          <th>教师工作</th>
          <th>毕业院校</th>
          <th>健康状态</th>
          <th>管理</th>
        </tr>
        <tr v-for="(teacher,index) in teacherInfo.slice((page.current-1)*page.info,page.current*page.info)" :key="index"
            class="tr-hover">
          <td>{{ teacher.teacherNo }}</td>
          <td>{{ teacher.teacherName }}</td>
          <td>{{ teacher.teacherSex }}</td>
          <td>{{ teacher.teacherAge }}</td>
          <td>{{ teacher.teacherDegree }}</td>
          <td>{{ teacher.teacherJob }}</td>
          <td>{{ teacher.teacherGraduateInstitutions }}</td>
          <td>{{ teacher.teacherHealth }}</td>
          <td>
            <button @click="modifyTeacherInfo(index)">修改</button>
            <button @click="deleteTeacherInfo(index)">删除</button>
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
    <ManagementBottom :searchFunction="searchTeacherInfo" :refreshFunction="refreshInfo"/>
  </div>

  <!-- 修改界面 -->
  <div>
    <div v-if="isModify" class="alert-background" @click="()=>{isModify=false}"></div>
    <div v-if="isModify" class="alert-modify">
      <h2>信息修改</h2>
      <div class="modify-info">
        <span>教师编号：</span>
        <input type="text" v-model="teacherInfo[teacherInfoModifyIndex].teacherNo" disabled>
      </div>
      <div class="modify-info">
        <span>教师姓名：</span>
        <input type="text" v-model="teacherInfo[teacherInfoModifyIndex].teacherName">
      </div>
      <div class="modify-info">
        <span>教师性别：</span>
        <input type="radio" name="teacherSex" value="男" v-model="teacherInfo[teacherInfoModifyIndex].teacherSex"
               :checked="teacherInfo[teacherInfoModifyIndex].teacherSex==='男'">男
        <input type="radio" name="teacherSex" value="女" v-model="teacherInfo[teacherInfoModifyIndex].teacherSex"
               :checked="teacherInfo[teacherInfoModifyIndex].teacherSex==='女'">女
      </div>
      <div class=" modify-info">
        <span>教师年龄：</span>
        <input type="number" min="18" max="100" v-model="teacherInfo[teacherInfoModifyIndex].teacherAge">
      </div>
      <div class="modify-info">
        <span>教师学历：</span>
        <input type="text" v-model="teacherInfo[teacherInfoModifyIndex].teacherDegree">
      </div>
      <div class="modify-info">
        <span>教师工作：</span>
        <input type="text" v-model="teacherInfo[teacherInfoModifyIndex].teacherJob">
      </div>
      <div class="modify-info">
        <span>毕业院校：</span>
        <input type="text" v-model="teacherInfo[teacherInfoModifyIndex].teacherGraduateInstitutions">
      </div>
      <div class="modify-info">
        <span>健康状况：</span>
        <input type="radio" value="良好" name="teacherHealth"
               v-model="teacherInfo[teacherInfoModifyIndex].teacherHealth"
               :checked="teacherInfo[teacherInfoModifyIndex].teacherHealth==='良好'">良好
        <input type="radio" value="较差" name="teacherHealth"
               v-model="teacherInfo[teacherInfoModifyIndex].teacherHealth"
               :checked="teacherInfo[teacherInfoModifyIndex].teacherHealth==='较差'">较差
      </div>
      <div class="modify-button">
        <button @click="confirmModifyTeacher">确定</button>
        <button @click="()=>{isModify=false}">取消</button>
      </div>
    </div>
  </div>

  <!-- 删除界面 -->
  <div>
    <div class="alert-background" v-if="isDelete" @click="()=>{isDelete=false}"></div>
    <div class="alert-delete" v-if="isDelete">
      <div class="delete-info">
        <h3>
          您确定需要删除编号为{{ teacherInfo[teacherInfoDeleteIndex].teacherNo }},姓名为{{
            teacherInfo[teacherInfoDeleteIndex].teacherName
          }}的教师吗?
        </h3>
      </div>
      <div class="delete-button">
        <button @click="confirmDeleteTeacher">确定</button>
        <button @click="()=>{isDelete=false}">取消</button>
      </div>
    </div>
  </div>

  <!-- 查询界面 -->
  <div>
    <div class="alert-background" v-if="isSearch" @click="()=>{isSearch=false}"></div>
    <div v-if="isSearch" class="alert-search">
      <h2>信息修改</h2>
      <div class="search-info">
        <span>教师编号：</span>
        <input type="text" v-model="teacherSearchInfo.teacherNo">
      </div>
      <div class="search-info">
        <span>教师姓名：</span>
        <input type="text" v-model="teacherSearchInfo.teacherName">
      </div>
      <div class="search-info">
        <span>教师性别：</span>
        <input type="radio" name="teacherSex" value="男" v-model="teacherSearchInfo.teacherSex">男
        <input type="radio" name="teacherSex" value="女" v-model="teacherSearchInfo.teacherSex">女
      </div>
      <div class=" search-info">
        <span>教师年龄：</span>
        <input type="number" min="18" max="100" v-model="teacherSearchInfo.teacherAge">
      </div>
      <div class="search-info">
        <span>教师学历：</span>
        <input type="text" v-model="teacherSearchInfo.teacherDegree">
      </div>
      <div class="search-info">
        <span>教师工作：</span>
        <input type="text" v-model="teacherSearchInfo.teacherJob">
      </div>
      <div class="search-info">
        <span>毕业院校：</span>
        <input type="text" v-model="teacherSearchInfo.teacherGraduateInstitutions">
      </div>
      <div class="search-info">
        <span>健康状况：</span>
        <input type="radio" value="良好" name="teacherHealth" v-model="teacherSearchInfo.teacherHealth">良好
        <input type="radio" value="较差" name="teacherHealth" v-model="teacherSearchInfo.teacherHealth">较差
      </div>
      <div class="search-button">
        <button @click="confirmSearchTeacherInfo">查询</button>
        <button @click="()=>{isSearch=false}">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-info {
  width: 75%;
}

.page {
  margin-top: 10px;
  text-align: right;
}

.page > span {
  margin: 0 10px;
  color: cornflowerblue;
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


.alert-background {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);;
  width: 100vw;
  height: 100vh;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.alert-modify,
.alert-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: white;
  width: 50%;
  height: 70%;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.modify-info,
.search-info {
  margin-top: 20px;
  width: 300px;
}

.modify-button,
.search-button {
  display: flex;
  justify-content: space-evenly;
  width: 200px;
  margin-top: 20px;
}

.modify-button > button {
  height: 30px;
  width: 50px;
}

.alert-delete {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: white;
  width: 30%;
  height: 20%;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.delete-info {
  height: 50%;
  width: 100%;
  margin-left: 20px;
}

.delete-button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}

.delete-button > button {
  margin-right: 10px;
  height: 30px;
  width: 50px;
}
</style>