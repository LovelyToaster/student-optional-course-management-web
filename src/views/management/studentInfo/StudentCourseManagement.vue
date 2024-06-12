<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {GradeInfoArr, GradeInfoInter} from "@/types";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import {useLoginStore} from "@/store/login";

let totalCount = ref(0)
let isSearch = ref(false)
let isRefresh = false
let info = ref<GradeInfoArr>([])
let page = reactive({
  current: 1,
  max: 1,
  info: 8
})
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
        Object.assign(searchInfo, searchInfoStep)
      })
}

function clickDeleteInfo(index: number) {
  isDelete.value = true
  deleteIndex = index
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
        } else if (deleteTemp.code === code.DELETE_FAILED) {
          errorNotification(deleteTemp.message)
        }
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
    <h1>{{ loginStore.userLoginInfo.userName }}的成绩信息</h1>
    <h3>共：{{ totalCount }}个</h3>
    <div class="main-info">
      <table class="main-table">
        <tr>
          <th>成绩编号</th>
          <th>学生学号</th>
          <th>学生姓名</th>
          <th>课程编号</th>
          <th>课程名称</th>
          <th>课程成绩</th>
          <th>管理</th>
        </tr>
        <tr v-for="(grade,index) in info.slice((page.current-1)*page.info,page.current*page.info)" :key="index"
            class="tr-hover">
          <td>{{ grade.no }}</td>
          <td>{{ grade.studentNo }}</td>
          <td>{{ grade.studentName }}</td>
          <td>{{ grade.courseNo }}</td>
          <td>{{ grade.courseName }}</td>
          <td>{{ grade.grade === 0 ? "暂无成绩" : grade.grade }}</td>
          <td>
            <span v-if="grade.grade">已结课</span>
            <button v-if="!grade.grade" @click="clickDeleteInfo(index)">退课</button>
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