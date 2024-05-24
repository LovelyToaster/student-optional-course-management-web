//登录信息接口
export interface LoginInter {
    userName: string,
    userPassword?: string
    permissions?: string
}

//按钮接口
interface ButtonChildrenInfoInter {
    data: string,
    name: string
}

interface ButtonInfoInter {
    data: string,
    name: string,
    show: boolean,
    children?: Array<ButtonChildrenInfoInter>
}

export type ButtonInfoArr = Array<ButtonInfoInter>

//教师信息接口
export interface TeacherInfoInter {
    teacherNo: number,
    teacherName: string,
    teacherSex: string,
    teacherAge: number,
    teacherDegree: string,
    teacherJob: string,
    teacherGraduateInstitutions: string,
    teacherHealth: string,
}

export type TeacherInfoArr = Array<TeacherInfoInter>