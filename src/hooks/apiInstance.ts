import axios from "axios";
import {errorNotification} from "./notification";

const apiInstance = axios.create({
    baseURL: "http://localhost:8080"
})
apiInstance.defaults.withCredentials = true
apiInstance.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded"
apiInstance.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response.status === 301 && window.location.pathname != "/") {
        let url = window.location.origin
        errorNotification("Token错误或已过期,稍后会返回登录界面")
        setTimeout(() => {
            window.location.replace(url)
        }, 1500)
    }
    return Promise.reject(error)
})
export default apiInstance