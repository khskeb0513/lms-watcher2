class SetSessionValueDto {

    constructor(cookie: string | null, set: boolean) {
        this.cookie = cookie
        this.set = set
    }

    cookie: string | null
    set: boolean
}

export default SetSessionValueDto
