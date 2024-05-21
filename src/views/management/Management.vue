<script setup lang="ts">
import {ButtonInfoArr} from "@/types";
import router from "@/router";
import {reactive, ref} from "vue";

let buttonInfo = reactive<ButtonInfoArr>([
  {
    data: "首页",
    name: "home",
    show: false,
  },
  {
    data: "查看所有信息",
    name: "info",
    show: false,
    children: [
      {
        data: "查看教师信息",
        name: "teacherInfo"
      },
      {
        data: "查看学生信息",
        name: "studentInfo"
      },
      {
        data: "查看课程信息",
        name: "courseInfo"
      },
      {
        data: "查看成绩信息",
        name: "scoreInfo"
      }
    ]
  }
])
let viewArray = reactive(["首页"])

router.push({name: "home"})

//获取要访问页面的信息，同时跳转
function getViews(name: string, index: number, childrenData?: string) {//没有孩子信息的导航栏
  if (childrenData === undefined)
    buttonInfo[index].show = !buttonInfo[index].show
  if (buttonInfo[index].children === undefined) {
    if (index === 0) {
      viewArray.length = 0
    } else if (viewArray.length != 1) {
      viewArray.length = 1
    }
    viewArray.push(buttonInfo[index].data)
    router.push({name: name})
  }
  if (childrenData != undefined) {
    viewArray.length = 1
    viewArray.push(childrenData)
    router.push({name: name})
  }
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
        <div v-for="(button,index) in buttonInfo" :key="index">
          <button @click="getViews(button.name,index)">{{
              button.data
            }}
          </button>
          <Transition name="buttonChildrenList">
            <ul v-show="button.show">
              <li v-for="children in button.children" :key="index"
                  @click="getViews(children.name,index,children.data)">{{
                  children.data
                }}
              </li>
            </ul>
          </Transition>
        </div>
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

.sidebar-main {
  margin-top: 10px;
}

.sidebar-main button {
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

.sidebar-main button:hover {
  background-color: rgba(100, 149, 237, 0.2);
}

.sidebar-main li {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  transition: background-color .5s;
  background-color: buttonface;
}

.sidebar-main li:hover {
  background-color: rgba(100, 149, 237, 0.2);
}

/*v-show 过渡动画*/

.buttonChildrenList-enter-active,
.buttonChildrenList-leave-active {
  transition: all 0.5s ease;
}

.buttonChildrenList-enter-from,
.buttonChildrenList-leave-to {
  transform: translateY(-20px);
  height: 0;
  opacity: 0;
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