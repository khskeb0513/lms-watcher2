import GetMaterialListDto from '../domain/board/getMaterialListDto'
import GetMaterialListProps from "../domain/board/getMaterialListProps";

interface MaterialAttachment {
    fileUrl: string
    name: string
}

interface GetMaterialBodyInterface {
    body: string
    attachment: MaterialAttachment[]
}

class BoardService {
    async getMaterialList(): Promise<GetMaterialListDto> {
        const response = await fetch('/api/user/getMaterialList')
        const body: GetMaterialListProps[] = await response.json()
        return new GetMaterialListDto(body.filter(v => v.board.length !== 0))
    }

    async getMaterialBody(id: string, url: string, attachmentId: string): Promise<GetMaterialBodyInterface> {
        const response = await fetch(
            `/api/board/getMaterialBody?id=${id}&url=${url}&attachmentId=${attachmentId}`)
        return response.json()
    }
}

export default BoardService
