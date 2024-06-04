import axios from "axios";
import {errorNotification} from "./notification";
import code from "./code";

let isUse = false

const apiInstance = axios.create({
    baseURL: "http://localhost:8080"
})
apiInstance.defaults.withCredentials = true
apiInstance.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded"
apiInstance.interceptors.response.use((response) => {
    if (window.location.pathname != "/" && !isUse) {
        if (response.data.code === code.LOGIN_FAILED) {
            errorNotification(response.data.message)
            setTimeout(() => {
                window.location.replace(window.location.origin)
            }, 1000)
            isUse = true
        }
    }
    return response
})

export default apiInstance