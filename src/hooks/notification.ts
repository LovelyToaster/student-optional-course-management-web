import {ElNotification} from "element-plus";
import {ElLoading} from 'element-plus'

export function errorNotification(message: string) {
    ElNotification({
        title: "错误",
        message: message,
        type: "error",
        duration: 3000
    })
}

export function successNotification(message: string) {
    ElNotification({
        title: "成功",
        message: message,
        type: "success",
        duration: 3000
    })
}

export function loadingNotification() {
    let time = 0
    let options = {
        text: "加载中"
    }
    let loading = ElLoading.service(options)
    let stopInterval = setInterval(() => {
        time++
        if (time >= 6) {
            clearInterval(stopInterval)
            errorNotification("出现异常，请刷新重试")
        }
    }, 1000)
    return {
        loading,
        stopInterval
    }
}
