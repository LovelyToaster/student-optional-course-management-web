//登录信息接口
export interface LoginInter {
    userName: string,
    userPassword?: string,
    permissions?: string | number,
    avatarPath?: string
}

export type LoginInfoArr = Array<LoginInter>

//密码重置接口
export interface SetPasswordInter {
    userName: string,
    userPassword: string,
    newPassword: string,
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
    teacherNo: string,
    teacherName: string,
    teacherSex: string,
    teacherAge: number,
    teacherDegree: string,
    teacherJob: string,
    teacherGraduateInstitutions: string,
    teacherHealth: string,
}

export type TeacherInfoArr = Array<TeacherInfoInter>

export interface StudentInfoInter {
    studentNo: string,
    studentName: string,
    studentSex: string,
    studentAge: number,
    studentFaculties: string,
    studentClass: string,
}

export type StudentInfoArr = Array<StudentInfoInter>

export interface CourseInfoInter {
    courseNo: string,
    courseName: string,
    teacherNo: string,
    teacherName: string,
    isSelect?: boolean
}

export type CourseInfoArr = Array<CourseInfoInter>

export interface GradeInfoInter {
    no: string,
    studentNo: string,
    studentName: string,
    courseNo: string,
    courseName: string,
    grade: number
}

export type GradeInfoArr = Array<GradeInfoInter>