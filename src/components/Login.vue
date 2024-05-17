<script setup>

</script>

<template>
  <div class="main">
    <div class="border">
      <div>
        <h1>欢迎登陆学生选课管理系统</h1>
      </div>
      <div class="userInfo">
        <span>用户名：</span>
        <input type="text" placeholder="请输入用户名" name="userName">
      </div>
      <div class="userInfo">
        <span>密&nbsp;&nbsp;&nbsp;码：</span>
        <input type="text" placeholder="请输入密码" name="userName">
      </div>
      <div class="button">
        <button>登录</button>
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