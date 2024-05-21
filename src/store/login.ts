import {defineStore} from "pinia";
import {ref} from "vue";

export const useLoginStore = defineStore("login", () => {
    let userName = ref(undefined)

    return {
        userName,
    }
})