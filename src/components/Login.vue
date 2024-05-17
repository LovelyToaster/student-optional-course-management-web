<script setup lang="ts">
import {reactive} from "vue";
import {ElNotification} from "element-plus";
import {LoginInter} from "@/types/index.js"

let userLoginInfo = reactive<LoginInter>({
  userName: null,
  userPassword: null
})
let patternName = /^[a-z0-9_-]{3,16}$/
let patternPassword = /^[a-z0-9_-]{6,18}$/

// 判断输入是否合法，以及验证登录
function login() {
  if (patternName.test(userLoginInfo.userName) && userLoginInfo.userName) {
    if (patternPassword.test(userLoginInfo.userPassword) && userLoginInfo.userPassword) {
      console.log(userLoginInfo.userName, userLoginInfo.userPassword)
    } else {
      ElNotification({
        title: "错误",
        message: "请检查密码格式",
        type: "error",
        duration: 3000
      })
    }
  } else {
    ElNotification({
      title: "错误",
      message: "请检查用户名格式",
      type: "error",
      duration: 3000
    })
  }
}
</script>

<template>
  <div class="main">
    <div class="border">
      <div>
        <h1>欢迎登陆学生选课管理系统</h1>
      </div>
      <div class="userInfo">
        <span>用户名：</span>
        <input type="text" placeholder="请输入用户名" name="userName" v-model="userLoginInfo.userName">
      </div>
      <div class="userInfo">
        <span>密&nbsp;&nbsp;&nbsp;码：</span>
        <input type="text" placeholder="请输入密码" name="userPassword" v-model="userLoginInfo.userPassword">
      </div>
      <div class="button">
        <button @click="login">登录</button>
        <button>忘记密码?</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  background-image: url("@/assets/login/background.jpeg");
  background-size: 100dvw 100dvh;
}

.border {
  width: 40%;
  height: 40%;
  border-radius: 15px;
  backdrop-filter: blur(25px);
  border: black 3px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.userInfo {
  display: flex;
}

.userInfo > span {
  font-size: 20px;
  width: 80px;
}

.userInfo > input {
  height: 28px;
  border-radius: 15px;
  border: black 3px solid;
  padding-left: 10px;
}

.button {
  width: 50%;
  display: flex;
  justify-content: space-around;
}

.button > button {
  font-weight: bold;
  width: 90px;
  height: 40px;
  border-radius: 15px;
  border: black 3px solid;
}

.button > button:hover {
  border: black 4px solid;
}

.button > button:focus {
  border: black 5px solid;
}

.button > button:active {
  border: black 6px solid;
}
</style>