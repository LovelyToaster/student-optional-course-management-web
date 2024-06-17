<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {GradeInfoArr, GradeInfoInter} from "@/types";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import {useLoginStore} from "@/store/login";
import InfoTable from "@/components/InfoTable.vue";

let totalCount = ref(0)
let isSearch = ref(false)
let isRefresh = false
let info = ref<GradeInfoArr>([])
let searchInfoStep = {
  no: undefined,
  studentNo: undefined,
  studentName: undefined,
  courseNo: undefined,
  courseName: undefined,
  grade: undefined
}
let searchInfo = reactive<GradeInfoInter>({...searchInfoStep})
let courseName = ref([])
let loginStore = useLoginStore()
let isDelete = ref(false)
let deleteIndex = 0
let titleMessage = ["成绩编号", "学生学号", "学生姓名", "课程编号", "课程名称", "课程成绩", "管理"]
let data = ref([])
let infoTable = ref()

function getData() {
  data.value.length = 0
  for (let i = 0; i < info.value.length; i++) {
    data.value.push([info.value[i].no, info.value[i].studentNo, info.value[i].studentName, info.value[i].courseNo, info.value[i].courseName, info.value[i].grade])
  }
}

async function getInfo() {
  await apiInstance.post("/grade/search", {
    studentNo: loginStore.userLoginInfo.userName
  })
      .then((resp) => {
        let allInfo = resp.data
        if (allInfo.code === code.SEARCH_SUCCESS) {
          totalCount.value = allInfo.data.length
          info.value = allInfo.data
          isRefresh = true
        }
      })
  await apiInstance.get("/course/all")
      .then((resp) => {
        let courseTemp = resp.data
        courseName.value.length = 0
        for (let data of courseTemp.data) {
          courseName.value.push(data.courseName)
        }
      })
}


function clickSearchInfo() {
  isSearch.value = true
}

function confirmSearchInfo() {
  infoTable.value.isLoading = true
  isSearch.value = false
  searchInfo.studentNo = loginStore.userLoginInfo.userName
  apiInstance.post("/grade/search", searchInfo)
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

function clickDeleteInfo(index: number) {
  isDelete.value = true
  deleteIndex = index + (infoTable.value.page.current - 1) * infoTable.value.page.info
}

function confirmDelete() {
  isDelete.value = false
  apiInstance.post("/grade/delete", {
    no: info.value[deleteIndex].no,
    studentNo: info.value[deleteIndex].studentNo
  })
      .then((resp) => {
        let deleteTemp = resp.data
        if (deleteTemp.code === code.DELETE_SUCCESS) {
          successNotification(deleteTemp.message)
          info.value.splice(deleteIndex, 1)
          getData()
        } else if (deleteTemp.code === code.DELETE_FAILED) {
          errorNotification(deleteTemp.message)
        }
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
    <h1>{{ loginStore.userLoginInfo.userName }}的成绩信息</h1>
    <h3>共：{{ totalCount }}个</h3>
    <InfoTable ref="infoTable" :title-message="titleMessage" :info="data" :click-delete-info="clickDeleteInfo"
               type="studentCourseManagement"/>
    <ManagementBottom :searchFunction="clickSearchInfo" :refreshFunction="clickRefreshInfo"/>

  </div>

  <!-- 查询界面 -->
  <div>
    <div class="alert-background" v-if="isSearch" @click="()=>{isSearch=false}"></div>
    <div v-if="isSearch" class="alert-search">
      <h2>信息查询</h2>
      <div class="modify-info">
        <span>成绩编号：</span>
        <input type="text" v-model="searchInfo.no">
      </div>
      <div class="modify-info">
        <span>课程编号：</span>
        <input type="text" v-model="searchInfo.courseNo">
      </div>
      <div class="modify-info">
        <span>课程名称：</span>
        <select name="" id="" v-model="searchInfo.courseName">
          <option v-for="(data,index) in courseName" :key="index" :value="data">{{ data }}</option>
        </select>
      </div>
      <div class="search-button">
        <button @click="confirmSearchInfo">查询</button>
        <button @click="()=>{isSearch=false}">取消</button>
      </div>
    </div>
  </div>

  <!-- 删除界面 -->
  <div>
    <div class="alert-background" v-if="isDelete" @click="()=>{isDelete=false}"></div>
    <div class="alert-delete" v-if="isDelete">
      <div class="delete-info">
        <h3>
          您确定退选课程编号为{{ info[deleteIndex].courseNo }},课程名称为{{
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
</template>

<style scoped>
@import '@/assets/css/management.css';
</style>