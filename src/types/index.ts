export interface LoginInter {
    userName: string,
    userPassword: string
}

interface ButtonInfoInter {
    index: number,
    data: string,
    name: string
}

export type ButtonInfoArr = Array<ButtonInfoInter>