import {createRouter, createWebHistory} from "vue-router";
import Management from "../views/management/Management.vue";
import Login from "../components/Login.vue";
import Home from "../views/management/Home.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
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
                    component: Home
                }
            ]
        }
    ]
})

export default router