<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {CourseInfoArr, CourseInfoInter} from "@/types";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";

let totalCount = ref(0)
let isModify = ref(false)
let isDelete = ref(false)
let isSearch = ref(false)
let isRefresh = false
let modifyIndex = 0
let deleteIndex = 0
let info = ref<CourseInfoArr>([])
let page = reactive({
  current: 1,
  max: 1,
  info: 8
})
let searchInfoStep = {
  courseNo: undefined,
  courseName: undefined,
  teacherNo: undefined,
  teacherName: undefined,
}
let searchInfo = reactive<CourseInfoInter>({...searchInfoStep})
let teacherName = ref([])

async function getInfo() {
  await apiInstance.get("/course/all")
      .then((resp) => {
        let allInfo = resp.data
        if (allInfo.code === code.SEARCH_SUCCESS) {
          totalCount.value = allInfo.data.length
          info.value = allInfo.data
          isRefresh = true
        }
      })
  await apiInstance.get("/teacher/all")
      .then((resp) => {
        let teacherTemp = resp.data
        teacherName.value.length = 0
        for (let data of teacherTemp.data.data) {
          teacherName.value.push(data.teacherName)
        }
      })

}

function clickModifyInfo(index: number) {
  isModify.value = true
  modifyIndex = index + (page.current - 1) * page.info
}

function confirmModify() {
  isModify.value = false
  apiInstance.post("/course/modify", info.value[modifyIndex])
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
  deleteIndex = index + (page.current - 1) * page.info
}

function confirmDelete() {
  isDelete.value = false
  apiInstance.post("/course/delete", {
    courseNo: info.value[deleteIndex].courseNo
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
  apiInstance.post("/course/search", searchInfo)
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
    <h1>所有课程的信息</h1>
    <h3>共：{{ totalCount }}个</h3>
    <div class="main-info">
      <table class="main-table">
        <tr>
          <th>课程编号</th>
          <th>课程名称</th>
          <th>教师编号</th>
          <th>教师名称</th>
          <th>管理</th>
        </tr>
        <tr v-for="(course,index) in info.slice((page.current-1)*page.info,page.current*page.info)" :key="index"
            class="tr-hover">
          <td>{{ course.courseNo }}</td>
          <td>{{ course.courseName }}</td>
          <td>{{ course.teacherNo }}</td>
          <td>{{ course.teacherName }}</td>
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
        <span>课程编号：</span>
        <input type="text" v-model="info[modifyIndex].courseNo" disabled>
      </div>
      <div class="modify-info">
        <span>课程名称：</span>
        <input type="text" v-model="info[modifyIndex].courseName">
      </div>
      <div class=" modify-info">
        <span>教师编号：</span>
        <input type="text" v-model="info[modifyIndex].teacherNo">
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
          您确定需要删除课程编号为{{ info[deleteIndex].courseNo }},课程名称为{{
            info[deleteIndex].courseName
          }}的课程吗?
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
        <span>课程编号：</span>
        <input type="text" v-model="searchInfo.courseNo">
      </div>
      <div class="search-info">
        <span>课程名称：</span>
        <input type="text" v-model="searchInfo.courseName">
      </div>
      <div class="search-info">
        <span>教师编号：</span>
        <input type="text" v-model="searchInfo.teacherNo">
      </div>
      <div class=" search-info">
        <span>教师名称：</span>
        <select name="" id="" v-model="searchInfo.teacherName">
          <option v-for="(data,index) in teacherName" :key="index" :value="data">{{ data }}</option>
        </select>
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