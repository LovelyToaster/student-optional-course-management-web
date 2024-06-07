<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {LoginInfoArr, LoginInter} from "@/types";
import {errorNotification, successNotification} from "@/hooks/notification";
import ManagementBottom from "@/components/ManagementBottom.vue";
import apiInstance from "@/hooks/apiInstance";
import code from "@/hooks/code";

let totalCount = ref(0)
let isSearch = ref(false)
let isRefresh = false
let info = ref<LoginInfoArr>([])
let page = reactive({
  current: 1,
  max: 1,
  info: 8
})
let searchInfoStep = {
  userName: undefined,
  permissions: undefined,
}
let searchInfo = reactive<LoginInter>({...searchInfoStep})
let isResetPassword = ref(false)
let resetPasswordIndex = 0

async function getInfo() {
  await apiInstance.get("/user/all")
      .then((resp) => {
        let allInfo = resp.data
        if (allInfo.code === code.SEARCH_SUCCESS) {
          totalCount.value = allInfo.data.length
          info.value = allInfo.data
          isRefresh = true
        }
      })

}


function clickSearchInfo() {
  isSearch.value = true
}

function confirmSearchInfo() {
  isSearch.value = false
  apiInstance.post("/user/search", searchInfo)
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

function clickResetPasswordInfo(index: number) {
  isResetPassword.value = true
  resetPasswordIndex = index + (page.current - 1) * page.info
}

function confirmResetPassword() {
  isResetPassword.value = false
  apiInstance.post("/user/resetPassword", info.value[resetPasswordIndex])
      .then((resp) => {
        let resetPasswordInfo = resp.data
        if (resetPasswordInfo.code === code.MODIFY_SUCCESS) {
          successNotification(resetPasswordInfo.message)
        } else if (resetPasswordInfo.code === code.MODIFY_FAILED) {
          errorNotification(resetPasswordInfo.message)
        }
      })
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
    <h1>所有用户的信息</h1>
    <h3>共：{{ totalCount }}个</h3>
    <div class="main-info">
      <table class="main-table">
        <tr>
          <th>用户头像</th>
          <th>用户姓名</th>
          <th>用户权限</th>
          <th>管理</th>
        </tr>
        <tr v-for="(user,index) in info.slice((page.current-1)*page.info,page.current*page.info)" :key="index"
            class="tr-hover">
          <td>
            <el-avatar :size="60" :src="user.avatarPath"></el-avatar>
          </td>
          <td>{{ user.userName }}</td>
          <td>{{ user.permissions === 1 ? "管理员" : "学生" }}</td>
          <td>
            <button @click="clickResetPasswordInfo(index)">重置密码</button>
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
      <div class="search-info">
        <span>用户姓名：</span>
        <input type="text" v-model="searchInfo.userName">
      </div>
      <div class="search-info">
        <span> 用户权限：</span>
        <input type="radio" name="permissions" value="1" v-model="searchInfo.permissions">管理员
        <input type="radio" name="permissions" value="2" v-model="searchInfo.permissions">学生
      </div>
      <div class="search-button">
        <button @click="confirmSearchInfo">查询</button>
        <button @click="()=>{isSearch=false}">取消</button>
      </div>
    </div>
  </div>

  <!-- 重置密码界面 -->
  <div>
    <div class="alert-background" v-if="isResetPassword" @click="()=>{isResetPassword=false}"></div>
    <div class="alert-reset" v-if="isResetPassword">
      <div class="reset-info">
        <h3>
          您确定需要重置用户姓名为{{ info[resetPasswordIndex].userName }}的密码吗？
        </h3>
      </div>
      <div class="reset-button">
        <button @click="confirmResetPassword">确定</button>
        <button @click="()=>{isResetPassword=false}">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/management.css';

.tr-hover button {
  margin-left: 10px;
  margin-right: 10px;
  height: 30px;
  width: 60px;
}

.alert-reset {
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

.reset-info {
  height: 50%;
  width: 100%;
  margin-left: 20px;
}

.reset-button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}

.reset-button > button {
  margin-right: 10px;
  height: 30px;
  width: 50px;
}
</style>