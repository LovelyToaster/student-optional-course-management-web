<script setup lang="ts">
import {ButtonInfoArr} from "@/types";
import router from "@/router";
import {ref} from "vue";

let buttonInfo: ButtonInfoArr = [
  {
    index: 1,
    data: "首页",
    name: "home"
  }
]
let viewArray = ref(["首页"])

function getViews(name: string, index: number) {
  let viewData = buttonInfo[index - 1].data
  if (!viewArray.value.includes(viewData))
    viewArray.value.push(viewData)
  router.push({name: name})
}
</script>

<template>
  <div class="background">
    <div class="header">
      <span>学生选课管理系统</span>
      <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
    </div>
    <div class="sidebar">
      <div class="sidebar-title">功能菜单</div>
      <div class="sidebar-main">
        <button v-for="button in buttonInfo" :key="button.index" @click="getViews(button.name,button.index)">{{
            button.data
          }}
        </button>
      </div>
    </div>
    <div class="user">
      <div class="user-main">
        <div>
          <span v-for="view in viewArray">
            <a href="#">{{ view }}</a>
            <span>/</span>
          </span>
        </div>
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-color: #ededed;
  width: 100vw;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 8%;
  background-color: #0d0039;
}

.header > span {
  margin-left: 15px;
  margin-right: 15px;
  font-size: 20px;
  color: aliceblue;
}

.sidebar {
  background-color: white;
  margin: 10px 10px;
  height: calc(100% - 8% - 20px);
  width: 13%;
  border-radius: 15px;
  position: absolute;
}

.sidebar-title {
  padding: 10px 0 0 10px;
  color: cornflowerblue;
  font-weight: bold;
}

.sidebar-main > button {
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  height: 50px;
  border-left: 3px solid cornflowerblue;
  border-top: none;
  border-right: none;
  border-bottom: none;
  transition: background-color .5s;
}

.sidebar-main > button:hover {
  background-color: rgba(100, 149, 237, 0.2);
}

.user {
  background-color: white;
  margin: 10px 0 0 calc(20px + 13%);
  width: calc(100% - 13% - 30px);
  height: calc(100% - 8% - 20px);
  border-radius: 15px;
}

.user-main {
  padding: 10px 0 0 10px;
}

.user-main a {
  color: cornflowerblue;
  text-decoration: none;
}
</style>