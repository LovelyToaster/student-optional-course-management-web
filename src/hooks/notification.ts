import {ElNotification} from "element-plus";

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
