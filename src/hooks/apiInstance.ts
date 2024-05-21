import axios from "axios";

const apiInstance = axios.create({
    baseURL: "http://localhost:8080"
})
apiInstance.defaults.withCredentials = true
export default apiInstance