<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {StudentInfoArr, StudentInfoInter} from "@/types";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";


let manCount = ref(0)
let womanCount = ref(0)
let totalCount = ref(0)
let isModify = ref(false)
let isDelete = ref(false)
let isSearch = ref(false)
let isRefresh = false
let modifyIndex = 0
let deleteIndex = 0
let info = ref<StudentInfoArr>([])
let page = reactive({
  current: 1,
  max: 1,
  info: 8
})
let searchInfoStep = {
  studentNo: undefined,
  studentName: undefined,
  studentSex: undefined,
  studentAge: undefined,
  studentFaculties: undefined,
  studentClass: undefined,
}
let searchInfo = reactive<StudentInfoInter>({...searchInfoStep})

async function getInfo() {
  await apiInstance.get("/student/all")
      .then((resp) => {
        let allInfo = resp.data
        if (allInfo.code === code.SEARCH_SUCCESS) {
          manCount.value = allInfo.data.manCount
          womanCount.value = allInfo.data.womanCount
          totalCount.value = allInfo.data.totalCount
          info.value = allInfo.data.data
          isRefresh = true
        }
      })
}

function clickModifyInfo(index: number) {
  isModify.value = true
  deleteIndex = index + (page.current - 1) * page.info
}

function confirmModify() {
  isModify.value = false
  apiInstance.post("/student/modify", info.value[modifyIndex])
      .then((resp) => {
        let modifyInfo = resp.data
        if (modifyInfo.code === code.MODIFY_SUCCESS) {
          successNotification(modifyInfo.message)
          getInfo()
        } else if (modifyInfo.code === code.MODIFY_FAILED) {
          errorNotification(modifyInfo.message)
        }
      })
}

function clickDeleteInfo(index: number) {
  isDelete.value = true
  modifyIndex = index + (page.current - 1) * page.info
}

function confirmDelete() {
  isDelete.value = false
  apiInstance.post("/student/delete", {
    studentNo: info.value[deleteIndex].studentNo
  })
      .then((resp) => {
        let deleteInfo = resp.data
        if (deleteInfo.code === code.DELETE_SUCCESS) {
          successNotification(deleteInfo.message)
          getInfo()
        } else if (deleteInfo.code === code.DELETE_FAILED) {
          errorNotification(deleteInfo.message)
        }
      })
}

function clickSearchInfo() {
  isSearch.value = true
}

function confirmSearchInfo() {
  isSearch.value = false
  apiInstance.post("/student/search", searchInfo)
      .then((resp) => {
        let searchTemp = resp.data
        if (searchTemp.code === code.SEARCH_SUCCESS) {
          info.value = searchTemp.data
          successNotification(searchTemp.message)
        } else if (searchTemp.code === code.SEARCH_FAILED) {
          errorNotification(searchTemp.message)
        }
        Object.assign(searchInfo, searchInfoStep)
      })
}

async function clickRefreshInfo() {
  isRefresh = false
  await getInfo()
  if (isRefresh) {
    successNotification("刷新成功")
  } else {
    errorNotification("刷新失败")
  }
}

watch(info, () => {
  page.max = Math.ceil(info.value.length / page.info)
  if (page.current > page.max) {
    page.current = 1
  }
})

onMounted(() => {
  getInfo()
})

</script>

<template>
  <div class="main">
    <h1>所有学生的信息</h1>
    <h3>共：{{ totalCount }}人&nbsp;&nbsp;&nbsp;男：{{ manCount }}人&nbsp;&nbsp;&nbsp;女：{{ womanCount }}人</h3>
    <div class="main-info">
      <table class="main-table">
        <tr>
          <th>学生编号</th>
          <th>学生姓名</th>
          <th>学生性别</th>
          <th>学生年龄</th>
          <th>学生院系</th>
          <th>学生班级</th>
          <th>管理</th>
        </tr>
        <tr v-for="(student,index) in info.slice((page.current-1)*page.info,page.current*page.info)" :key="index"
            class="tr-hover">
          <td>{{ student.studentNo }}</td>
          <td>{{ student.studentName }}</td>
          <td>{{ student.studentSex }}</td>
          <td>{{ student.studentAge }}</td>
          <td>{{ student.studentFaculties }}</td>
          <td>{{ student.studentClass }}</td>
          <td>
            <button @click="clickModifyInfo(index)">修改</button>
            <button @click="clickDeleteInfo(index)">删除</button>
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
    <ManagementBottom :searchFunction="clickSearchInfo" :refreshFunction="clickRefreshInfo"/>
  </div>

  <!-- 修改界面 -->
  <div>
    <div v-if="isModify" class="alert-background" @click="()=>{isModify=false;getInfo()}"></div>
    <div v-if="isModify" class="alert-modify">
      <h2>信息修改</h2>
      <div class="modify-info">
        <span>学生学号：</span>
        <input type="text" v-model="info[modifyIndex].studentNo" disabled>
      </div>
      <div class="modify-info">
        <span>学生姓名：</span>
        <input type="text" v-model="info[modifyIndex].studentName">
      </div>
      <div class="modify-info">
        <span>学生性别：</span>
        <input type="radio" name="teacherSex" value="男" v-model="info[modifyIndex].studentSex"
               :checked="info[modifyIndex].studentSex==='男'">男
        <input type="radio" name="teacherSex" value="女" v-model="info[modifyIndex].studentSex"
               :checked="info[modifyIndex].studentSex==='女'">女
      </div>
      <div class=" modify-info">
        <span>学生年龄：</span>
        <input type="number" min="18" max="100" v-model="info[modifyIndex].studentAge">
      </div>
      <div class="modify-info">
        <span>学生院系：</span>
        <input type="text" v-model="info[modifyIndex].studentFaculties">
      </div>
      <div class="modify-info">
        <span>学生班级：</span>
        <input type="text" v-model="info[modifyIndex].studentClass">
      </div>
      <div class="modify-button">
        <button @click="confirmModify">确定</button>
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
          您确定需要删除学号为{{ info[deleteIndex].studentNo }},姓名为{{
            info[deleteIndex].studentName
          }}的教师吗?
        </h3>
      </div>
      <div class="delete-button">
        <button @click="confirmDelete">确定</button>
        <button @click="()=>{isDelete=false}">取消</button>
      </div>
    </div>
  </div>

  <!-- 查询界面 -->
  <div>
    <div class="alert-background" v-if="isSearch" @click="()=>{isSearch=false}"></div>
    <div v-if="isSearch" class="alert-search">
      <h2>信息查询</h2>
      <div class="search-info">
        <span>学生学号：</span>
        <input type="text" v-model="searchInfo.studentNo">
      </div>
      <div class="search-info">
        <span>学生姓名：</span>
        <input type="text" v-model="searchInfo.studentName">
      </div>
      <div class="search-info">
        <span>学生性别：</span>
        <input type="radio" name="studentSex" value="男" v-model="searchInfo.studentSex">男
        <input type="radio" name="studentSex" value="女" v-model="searchInfo.studentSex">女
      </div>
      <div class=" search-info">
        <span>学生年龄：</span>
        <input type="number" min="18" max="100" v-model="searchInfo.studentAge">
      </div>
      <div class="search-info">
        <span>学生院系：</span>
        <input type="text" v-model="searchInfo.studentFaculties">
      </div>
      <div class="search-info">
        <span>学生班级：</span>
        <input type="text" v-model="searchInfo.studentClass">
      </div>
      <div class="search-button">
        <button @click="confirmSearchInfo">查询</button>
        <button @click="()=>{isSearch=false}">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './css/management.css';
</style>