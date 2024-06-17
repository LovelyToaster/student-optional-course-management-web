<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {CourseInfoArr, CourseInfoInter} from "@/types";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import InfoTable from "@/components/InfoTable.vue";

let totalCount = ref(0)
let isModify = ref(false)
let isDelete = ref(false)
let isSearch = ref(false)
let isRefresh = false
let modifyIndex = 0
let deleteIndex = 0
let info = ref<CourseInfoArr>([])
let searchInfoStep = {
  courseNo: undefined,
  courseName: undefined,
  teacherNo: undefined,
  teacherName: undefined,
}
let searchInfo = reactive<CourseInfoInter>({...searchInfoStep})
let teacherName = ref([])
let titleMessage = ["课程编号", "课程名称", "教师编号", "教师姓名", "管理"]
let data = ref([])
let infoTable = ref()

function getData() {
  data.value.length = 0
  for (let i = 0; i < info.value.length; i++) {
    data.value.push([info.value[i].courseNo, info.value[i].courseName, info.value[i].teacherNo, info.value[i].teacherName])
  }
}

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
  modifyIndex = index + (infoTable.value.page.current - 1) * infoTable.value.page.info
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
  deleteIndex = index + (infoTable.value.page.current - 1) * infoTable.value.page.info
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
  infoTable.value.isLoading = true
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
        infoTable.value.isLoading = false
        Object.assign(searchInfo, searchInfoStep)
      })
}

async function clickRefreshInfo() {
  infoTable.value.isLoading = true
  isRefresh = false
  await getInfo()
  if (isRefresh) {
    successNotification("刷新成功")
  } else {
    errorNotification("刷新失败")
  }
  infoTable.value.isLoading = false
}

watch(info, () => {
  getData()
})

onMounted(() => {
  getInfo()
})

</script>

<template>
  <div class="main">
    <h1>所有课程的信息</h1>
    <h3>共：{{ totalCount }}个</h3>
    <InfoTable ref="infoTable" :title-message="titleMessage" :info="data" :click-delete-info="clickDeleteInfo"
               :click-modify-info="clickModifyInfo"/>
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
@import '@/assets/css/management.css';
</style>