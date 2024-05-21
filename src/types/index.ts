export interface LoginInter {
    userName: string,
    userPassword?: string
    permissions?: string
}

interface ButtonInfoInter {
    index: number,
    data: string,
    name: string
}

export type ButtonInfoArr = Array<ButtonInfoInter>