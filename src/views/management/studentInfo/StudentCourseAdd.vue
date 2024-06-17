<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {CourseInfoArr, CourseInfoInter} from "@/types";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";
import {useLoginStore} from "@/store/login";
import InfoTable from "@/components/InfoTable.vue";

let totalCount = ref(0)
let isSearch = ref(false)
let isRefresh = false
let info = ref<CourseInfoArr>([])
let searchInfoStep = {
  courseNo: undefined,
  courseName: undefined,
  teacherNo: undefined,
  teacherName: undefined,
}
let searchInfo = reactive<CourseInfoInter>({...searchInfoStep})
let courseName = ref([])
let teacherName = ref([])
let loginStore = useLoginStore()
let isSelectCourse = ref(false)
let selectIndex = 0
let titleMessage = ["课程编号", "课程名称", "教师编号", "教师名称", "管理"]
let data = ref([])
let infoTable = ref()
let isSelect = ref([])

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
          courseName.value.length = 0
          for (let data of allInfo.data) {
            courseName.value.push(data.courseName)
          }
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
  await apiInstance.post("/grade/search", {
    studentNo: loginStore.userLoginInfo.userName
  })
      .then((resp) => {
        let searchTemp = resp.data
        let index = 0
        for (let temp of info.value) {
          searchTemp.data.find((array: CourseInfoInter) => {
            if (temp.courseNo === array.courseNo) {
              isSelect.value[index] = true
            }
          })
          index++
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

function clickSelectCourse(index: number) {
  isSelectCourse.value = true
  selectIndex = index + (infoTable.value.page.current - 1) * infoTable.value.page.info
}

function confirmSelectCourse() {
  isSelectCourse.value = false
  apiInstance.post("/grade/add", {
    studentNo: loginStore.userLoginInfo.userName,
    courseNo: info.value[selectIndex].courseNo
  })
      .then((resp) => {
        let addTemp = resp.data
        if (addTemp.code === code.ADD_SUCCESS) {
          successNotification(addTemp.message)
          isSelect.value[selectIndex] = true
        } else if (addTemp.code === code.ADD_FAILED) {
          errorNotification(addTemp.message)
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
    <h1>所有课程信息</h1>
    <h3>共：{{ totalCount }}个</h3>
    <InfoTable ref="infoTable" :title-message="titleMessage" :info="data" :click-select-course="clickSelectCourse"
               type="studentCourseAdd" :is-select="isSelect"/>
    <ManagementBottom :searchFunction="clickSearchInfo" :refreshFunction="clickRefreshInfo"/>

  </div>

  <!-- 查询界面 -->
  <div>
    <div class="alert-background" v-if="isSearch" @click="()=>{isSearch=false}"></div>
    <div v-if="isSearch" class="alert-search">
      <h2>信息查询</h2>
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

  <!-- 确定选课 -->
  <div>
    <div class="alert-background" v-if="isSelectCourse" @click="()=>{isSelectCourse=false}"></div>
    <div class="alert-select" v-if="isSelectCourse">
      <div class="select-info">
        <h3>
          您确定需要选择课程编号为{{ info[selectIndex].courseNo }},课程名称为{{
            info[selectIndex].courseName
          }}的课程吗?
        </h3>
      </div>
      <div class="select-button">
        <button @click="confirmSelectCourse">确定</button>
        <button @click="()=>{isSelectCourse=false}">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/management.css';

.alert-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: white;
  width: 40%;
  height: 20%;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.select-info {
  height: 50%;
  width: 100%;
  margin-left: 20px;
}

.select-button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}

.select-button > button {
  margin-right: 10px;
  height: 30px;
  width: 50px;
}
</style>