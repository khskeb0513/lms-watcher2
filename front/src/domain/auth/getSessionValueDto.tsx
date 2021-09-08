class GetSessionValueDto {
    constructor(
        status: boolean, cookie: string
    ) {
        this.status = status
        this.cookie = cookie
    }

    status: boolean
    cookie: string
}

export default GetSessionValueDto
