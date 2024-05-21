import {defineStore} from "pinia";
import {reactive} from "vue";
import {LoginInter} from "../types";

export const useLoginStore = defineStore("login", () => {
    let userLoginInfo = reactive<LoginInter>({
        userName: undefined,
        permissions: undefined
    })

    return {userLoginInfo}
})