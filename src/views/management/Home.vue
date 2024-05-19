<script setup>
import {ref} from "vue";

let date = new Date()
let today = ref(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0"))
setInterval(() => {
  date = new Date()
  today.value=date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0")
}, 1000)

</script>

<template>
  <div class="main">
    <h1>欢迎登录学生选课管理系统</h1>
    <h3>用户：xxx&nbsp;&nbsp;&nbsp;权限：xxx</h3>
    <p>当前时间：{{ today }}</p>
  </div>
</template>

<style scoped>
.main {
  text-align: center;
}
</style>