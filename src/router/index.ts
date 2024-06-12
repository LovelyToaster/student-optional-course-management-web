import {createRouter, createWebHistory} from "vue-router";
import Management from "../views/management/Management.vue";
import Login from "../views/Login.vue";
import Home from "../views/management/Home.vue";
import apiInstance from "../hooks/apiInstance";
import {useLoginStore} from "../store/login";
import TeacherManagement from "../views/management/info/TeacherManagement.vue";
import StudentManagement from "../views/management/info/StudentManagement.vue";
import code from "../hooks/code";
import CourseManagement from "../views/management/info/CourseManagement.vue";
import GradeManagement from "../views/management/info/GradeManagement.vue";
import TeacherAdd from "../views/management/info/TeacherAdd.vue";
import StudentAdd from "../views/management/info/StudentAdd.vue";
import CourseAdd from "../views/management/info/CourseAdd.vue";
import User from "../views/management/User.vue";
import AllUserManagement from "../views/management/info/AllUserManagement.vue";
import StudentCourseManagement from "../views/management/studentInfo/StudentCourseManagement.vue";
import StudentCourseAdd from "../views/management/studentInfo/StudentCourseAdd.vue";

async function loginStatus() {
    let loginStore = useLoginStore()
    let loginVerify = undefined
    await apiInstance.get("/user/status")
        .then((resp) => {
            let loginInfo = resp.data
            if (loginInfo.code === code.LOGIN_SUCCESS) {
                loginVerify = true
                loginStore.userLoginInfo.userName = loginInfo.data.userName
                loginStore.userLoginInfo.permissions = loginInfo.data.permissions === 1 ? "管理员" : "学生"
                loginStore.userLoginInfo.avatarPath = loginInfo.data.avatarPath + "?" + Date.now()
            } else {
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
                            component: TeacherManagement,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "studentManagement",
                            name: "studentManagement",
                            component: StudentManagement,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "courseManagement",
                            name: "courseManagement",
                            component: CourseManagement,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "gradeManagement",
                            name: "gradeManagement",
                            component: GradeManagement,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "teacherAdd",
                            name: "teacherAdd",
                            component: TeacherAdd,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "studentAdd",
                            name: "studentAdd",
                            component: StudentAdd,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "courseAdd",
                            name: "courseAdd",
                            component: CourseAdd,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "allUserManagement",
                            name: "allUserManagement",
                            component: AllUserManagement,
                            meta: {
                                isVerify: true
                            }

                        }
                    ]
                },
                {
                    path: "studentInfo",
                    name: "studentInfo",
                    children: [
                        {
                            path: "studentCourseManagement",
                            name: "studentCourseManagement",
                            component: StudentCourseManagement,
                            meta: {
                                isVerify: true
                            }
                        },
                        {
                            path: "studentCourseAdd",
                            name: "studentCourseAdd",
                            component: StudentCourseAdd,
                            meta: {
                                isVerify: true
                            }
                        }
                    ]
                },
                {
                    path: "user",
                    name: "user",
                    component: User,
                    meta: {
                        isVerify: true
                    }
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