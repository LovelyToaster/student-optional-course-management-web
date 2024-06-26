<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {TeacherInfoArr, TeacherInfoInter} from "@/types";
import apiInstance from "@/hooks/apiInstance";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import code from "@/hooks/code";
import InfoTable from "@/components/InfoTable.vue";

let manCount = ref(0)
let womanCount = ref(0)
let totalCount = ref(0)
let info = ref<TeacherInfoArr>([])
let searchInfoStep = {
  teacherNo: undefined,
  teacherName: undefined,
  teacherSex: undefined,
  teacherAge: undefined,
  teacherDegree: undefined,
  teacherJob: undefined,
  teacherGraduateInstitutions: undefined,
  teacherHealth: undefined,
}
let searchInfo = reactive<TeacherInfoInter>({...searchInfoStep})
let isModify = ref(false)
let isDelete = ref(false)
let isSearch = ref(false)
let isRefresh = false
let modifyIndex = 0
let deleteIndex = 0
let titleMessage = ["教师编号", "教师姓名", "教师性别", "教师年龄", "教师学历", "教师工作", "毕业院校", "健康状态", "管理"]
let data = ref([])
let infoTable = ref()

function getData() {
  data.value.length = 0
  for (let i = 0; i < info.value.length; i++) {
    data.value.push([info.value[i].teacherNo, info.value[i].teacherName, info.value[i].teacherSex, info.value[i].teacherAge, info.value[i].teacherDegree, info.value[i].teacherJob, info.value[i].teacherGraduateInstitutions, info.value[i].teacherHealth])
  }
}

async function getInfo() {
  await apiInstance.get("/teacher/all")
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
  modifyIndex = index + (infoTable.value.page.current - 1) * infoTable.value.page.info
}

function clickDeleteInfo(index: number) {
  isDelete.value = true
  deleteIndex = index + (infoTable.value.page.current - 1) * infoTable.value.page.info
}

function confirmModify() {
  isModify.value = false
  apiInstance.post("/teacher/modify", info.value[modifyIndex])
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

function confirmDelete() {
  isDelete.value = false
  apiInstance.post("/teacher/delete", {
    teacherNo: info.value[deleteIndex].teacherNo
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
  apiInstance.post("/teacher/search", searchInfo)
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
    <h1>所有教师的信息</h1>
    <h3>共：{{ totalCount }}人&nbsp;&nbsp;&nbsp;男：{{ manCount }}人&nbsp;&nbsp;&nbsp;女：{{ womanCount }}人</h3>
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
        <span>教师编号：</span>
        <input type="text" v-model="info[modifyIndex].teacherNo" disabled>
      </div>
      <div class="modify-info">
        <span>教师姓名：</span>
        <input type="text" v-model="info[modifyIndex].teacherName">
      </div>
      <div class="modify-info">
        <span>教师性别：</span>
        <input type="radio" name="teacherSex" value="男" v-model="info[modifyIndex].teacherSex"
               :checked="info[modifyIndex].teacherSex==='男'">男
        <input type="radio" name="teacherSex" value="女" v-model="info[modifyIndex].teacherSex"
               :checked="info[modifyIndex].teacherSex==='女'">女
      </div>
      <div class=" modify-info">
        <span>教师年龄：</span>
        <input type="number" min="18" max="100" v-model="info[modifyIndex].teacherAge">
      </div>
      <div class="modify-info">
        <span>教师学历：</span>
        <input type="text" v-model="info[modifyIndex].teacherDegree">
      </div>
      <div class="modify-info">
        <span>教师工作：</span>
        <input type="text" v-model="info[modifyIndex].teacherJob">
      </div>
      <div class="modify-info">
        <span>毕业院校：</span>
        <input type="text" v-model="info[modifyIndex].teacherGraduateInstitutions">
      </div>
      <div class="modify-info">
        <span>健康状况：</span>
        <input type="radio" value="良好" name="teacherHealth"
               v-model="info[modifyIndex].teacherHealth"
               :checked="info[modifyIndex].teacherHealth==='良好'">良好
        <input type="radio" value="较差" name="teacherHealth"
               v-model="info[modifyIndex].teacherHealth"
               :checked="info[modifyIndex].teacherHealth==='较差'">较差
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
          您确定需要删除编号为{{ info[deleteIndex].teacherNo }},姓名为{{
            info[deleteIndex].teacherName
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
      <h2>信息修改</h2>
      <div class="search-info">
        <span>教师编号：</span>
        <input type="text" v-model="searchInfo.teacherNo">
      </div>
      <div class="search-info">
        <span>教师姓名：</span>
        <input type="text" v-model="searchInfo.teacherName">
      </div>
      <div class="search-info">
        <span>教师性别：</span>
        <input type="radio" name="teacherSex" value="男" v-model="searchInfo.teacherSex">男
        <input type="radio" name="teacherSex" value="女" v-model="searchInfo.teacherSex">女
      </div>
      <div class=" search-info">
        <span>教师年龄：</span>
        <input type="number" min="18" max="100" v-model="searchInfo.teacherAge">
      </div>
      <div class="search-info">
        <span>教师学历：</span>
        <input type="text" v-model="searchInfo.teacherDegree">
      </div>
      <div class="search-info">
        <span>教师工作：</span>
        <input type="text" v-model="searchInfo.teacherJob">
      </div>
      <div class="search-info">
        <span>毕业院校：</span>
        <input type="text" v-model="searchInfo.teacherGraduateInstitutions">
      </div>
      <div class="search-info">
        <span>健康状况：</span>
        <input type="radio" value="良好" name="teacherHealth" v-model="searchInfo.teacherHealth">良好
        <input type="radio" value="较差" name="teacherHealth" v-model="searchInfo.teacherHealth">较差
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