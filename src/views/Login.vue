<script setup lang="ts">
import {reactive} from "vue";
import {LoginInter} from "@/types"
import errorNotification from "@/hooks/notification";
import {useLoginStore} from "@/store/login";
import apiInstance from "@/hooks/apiInstance";
import router from "@/router";

let userLoginInfo = reactive<LoginInter>({
  userName: undefined,
  userPassword: undefined
})
let patternName = /^[a-z0-9_-]{3,16}$/
let patternPassword = /^[a-z0-9_-]{6,18}$/
let loginStore = useLoginStore()

// 判断输入是否合法，以及验证登录
async function login() {
  if (patternName.test(userLoginInfo.userName) && userLoginInfo.userName) {
    if (patternPassword.test(userLoginInfo.userPassword) && userLoginInfo.userPassword) {
      await apiInstance.get("/user/login", {
        params: {
          userName: userLoginInfo.userName,
          userPassword: userLoginInfo.userPassword
        }
      }).then((resp) => {
        if (resp.data.verify) {
            loginStore.userLoginInfo.userName = resp.data.userName
            loginStore.userLoginInfo.permissions = resp.data.permissions === 1 ? "管理员" : "学生"
          router.push({name: "home", replace: true})
        } else {
          errorNotification("用户名或密码错误")
        }
      })
    } else {
      errorNotification("请检查密码格式")
    }
  } else {
    errorNotification("请检查用户名格式")
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