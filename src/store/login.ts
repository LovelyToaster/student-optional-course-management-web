import {defineStore} from "pinia";
import {reactive} from "vue";
import {LoginInter} from "../types";

export const useLoginStore = defineStore("login", () => {
    let userLoginInfo = reactive<LoginInter>({
        userName: undefined,
        permissions: undefined,
        avatarPath: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    })

    return {userLoginInfo}
})