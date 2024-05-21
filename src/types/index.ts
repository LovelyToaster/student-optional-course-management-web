export interface LoginInter {
    userName: string,
    userPassword?: string
    permissions?: string
}

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