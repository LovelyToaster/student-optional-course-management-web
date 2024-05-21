import {ElNotification} from "element-plus";

function errorNotification(message: string) {
    ElNotification({
        title: "错误",
        message: message,
        type: "error",
        duration: 3000
    })
}

export default errorNotification