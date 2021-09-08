class GetHisCodeDto {
    constructor(hisCode: number, timestamp: number) {
        this.hisCode = hisCode
        this.timestamp = timestamp
    }

    hisCode: number
    timestamp: number
}

export default GetHisCodeDto
