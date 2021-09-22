import GetMaterialListDto from '../domain/board/getMaterialListDto'
import GetMaterialListProps from "../domain/board/getMaterialListProps";
import {GetMaterialListWithTypeProps} from "../domain/board/getMaterialListWithTypeDto";

interface MaterialAttachment {
    fileUrl: string
    name: string
}

interface GetBodyInterface {
    body: string
    attachment: MaterialAttachment[]
}

interface GetCountInterface {
    material: number
    notice: number
}

class BoardService {
    getCount(list: GetMaterialListWithTypeProps): GetCountInterface {
        return {
            material: list.board.filter(value => value.type === 'material').length,
            notice: list.board.filter(value => value.type === 'notice').length
        }
    }

    async getMaterialList(): Promise<GetMaterialListDto> {
        const response = await fetch('/api/user/getMaterialList')
        const body: GetMaterialListProps[] = await response.json()
        return new GetMaterialListDto(body.filter(v => v.board.length !== 0))
    }

    async getNoticeList(): Promise<GetMaterialListDto> {
        const response = await fetch('/api/user/getNoticeList')
        const body: GetMaterialListProps[] = await response.json()
        return new GetMaterialListDto(body.filter(v => v.board.length !== 0))
    }

    async getBody(id: string, url: string, attachmentId: string): Promise<GetBodyInterface> {
        const response = await fetch(
            attachmentId ?
                `/api/board/getBody?id=${id}&url=${url}&attachmentId=${attachmentId}` :
                `/api/board/getBody?id=${id}&url=${url}`
        )
        return response.json()
    }
}

export default BoardService
