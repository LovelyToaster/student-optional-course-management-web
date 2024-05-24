import axios from "axios";

const apiInstance = axios.create({
    baseURL: "http://localhost:8080"
})
apiInstance.defaults.withCredentials = true
apiInstance.defaults.headers.common["Content-Type"]="application/x-www-form-urlencoded"
export default apiInstance