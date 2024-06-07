<script setup lang="ts">
import {Edit} from "@element-plus/icons-vue";
import {useLoginStore} from "@/store/login";
import {ref} from "vue";
import {SetPasswordInter} from "@/types";
import apiInstance from "@/hooks/apiInstance";
import {errorNotification, successNotification} from "@/hooks/notification";
import code from "@/hooks/code";
import 'vue-cropper/dist/index.css';
import {VueCropper} from "vue-cropper";

let loginStore = useLoginStore()
let newPasswordAgain = ref()
let setPassword = ref<SetPasswordInter>({
  userName: undefined,
  userPassword: undefined,
  newPassword: undefined
})
let currentAvatar = ref<string | ArrayBuffer>("https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png")
let cropAvatar = ref(loginStore.userLoginInfo.avatarPath)
let upload_avatar = ref()
let isCrop = ref()
let cropper = ref()


function confirmSetPassword() {
  setPassword.value.userName = loginStore.userLoginInfo.userName
  if (setPassword.value.newPassword === newPasswordAgain.value) {
    apiInstance.post("/user/setPassword", setPassword.value)
        .then((resp) => {
          let setPasswordInfo = resp.data
          if (setPasswordInfo.code === code.MODIFY_SUCCESS) {
            successNotification(setPasswordInfo.message)
          } else if (setPasswordInfo.code === code.MODIFY_FAILED) {
            errorNotification(setPasswordInfo.message)
          }
        })
  } else {
    errorNotification("两次密码不同，请重新输入")
  }
}

function showAvatar() {
  let file = upload_avatar.value.files[0]
  if (file) {
    let reader = new FileReader()
    reader.readAsDataURL(upload_avatar.value.files[0])
    reader.onload = (event) => {
      currentAvatar.value = event.target.result
      isCrop.value = true
    }
    upload_avatar.value.value = ""
  }
}

function uploadAvatar() {
  cropper.value.startCrop()
  cropper.value.getCropData((data: any) => {
    cropAvatar.value = data
    isCrop.value = false
  })
  cropper.value.getCropBlob((data: any) => {
    let param = new FormData(); //创建form对象
    param.append('file', data);//通过append向form对象添加数据
    let upload: any
    if (loginStore.userLoginInfo.permissions === "管理员")
      upload = param
    else
      upload = {
        file: data,
        studentNo: loginStore.userLoginInfo.userName
      }
    apiInstance.post("/user/setAvatar", upload, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
        .then((resp) => {
          let avatarInfo = resp.data
          if (avatarInfo.code === code.MODIFY_SUCCESS) {
            loginStore.userLoginInfo.avatarPath = avatarInfo.data + "?" + Date.now()
            successNotification(avatarInfo.message)
          } else if (avatarInfo.code === code.MODIFY_FAILED) {
            errorNotification(avatarInfo.message)
          }
        })
  })
}

</script>

<template>
  <div class="user-main">
    <h1>修改个人信息</h1>
    <div class="user-avatar">
      <el-avatar :size="100" :src="cropAvatar"></el-avatar>
      <label for="upload_avatar">
        <el-icon :size="20">
          <Edit/>
        </el-icon>
        <input id="upload_avatar" ref="upload_avatar" type="file" accept="image/*" style="display: none"
               @change="showAvatar">
      </label>
    </div>
    <div class="user-info">
      <form action="#" @submit.prevent>
        <span>用户名：{{ loginStore.userLoginInfo.userName }}</span>
        <br>
        <span>当前密码：</span>
        <input type="password" v-model="setPassword.userPassword">
        <br>
        <span>新的密码：</span>
        <input type="password" v-model="setPassword.newPassword">
        <br>
        <span>确认密码：</span>
        <input type="password" v-model="newPasswordAgain">
        <div class="confirm-button">
          <input type="submit" @click="confirmSetPassword" value="修改密码">
          <input type="reset">
        </div>
      </form>
    </div>

    <div v-if="isCrop" class="avatar-crop-background">
      <div v-if="isCrop" class="avatar-crop">
        <VueCropper ref="cropper" :img="currentAvatar" autoCrop centerBox/>
        <div class="crop-button">
          <button @click="uploadAvatar">更新头像</button>
          <button @click="isCrop=false">取消</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.user-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.user-avatar,
.user-info,
.user-info * {
  margin-top: 20px;
}

.user-avatar .el-icon {
  position: absolute;
  cursor: pointer;
}

.user-info span {
  font-size: 20px;
  font-weight: bold;
}

.confirm-button {
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
}

.confirm-button > input,
.crop-button > button {
  height: 30px;
  width: 60px;
}

.avatar-crop-background {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);;
  width: 100vw;
  height: 100vh;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.avatar-crop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: white;
  width: 40%;
  height: 60%;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.crop-button {
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
</style>