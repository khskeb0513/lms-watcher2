class GetVideoDto {
    constructor(cid: string, contentId: string) {
        this.cid = cid
        this.contentId = contentId
    }

    cid: string
    contentId: string
}

export default GetVideoDto
