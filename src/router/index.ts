import {createRouter, createWebHistory} from "vue-router";
import Management from "../views/management/Management.vue";
import Login from "../views/Login.vue";
import Home from "../views/management/Home.vue";
import apiInstance from "../hooks/apiInstance";
import {useLoginStore} from "../store/login";
import teacherManagement from "../views/management/info/TeacherManagement.vue";

async function loginStatus() {
    let loginStore = useLoginStore()
    let loginVerify = undefined
    await apiInstance.get("/user/login/status")
        .then((resp) => {
            loginVerify = true
            loginStore.userLoginInfo.userName = resp.data.userName
            loginStore.userLoginInfo.permissions = resp.data.permissions === 1 ? "管理员" : "学生"
        })
        .catch((e) => {
            if (e.response.status === 301) {
                loginVerify = false
            }
        })
    return loginVerify
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "login",
            component: Login
        },
        {
            path: "/management",
            name: "management",
            component: Management,
            children: [
                {
                    path: "home",
                    name: "home",
                    component: Home,
                    meta: {
                        isVerify: true
                    }
                },
                {
                    path: "info",
                    name: "info",
                    children: [
                        {
                            path: "teacherManagement",
                            name: "teacherManagement",
                            component: teacherManagement,
                            meta: {
                                isVerify: true
                            }
                        }
                    ]
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    let loginVerify = undefined
    if (to.meta.isVerify && from.name != "login") {
        loginStatus().then((value) => {
            loginVerify = value
            if (loginVerify) {
                next()
            } else {
                next({name: "login", replace: true})
            }
        })
    } else if (to.name === "login") {
        loginStatus().then((value) => {
            loginVerify = value
            if (loginVerify) {
                next({name: "home", replace: true})
            } else {
                next()
            }
        })
    } else {
        next()
    }
})

export default router