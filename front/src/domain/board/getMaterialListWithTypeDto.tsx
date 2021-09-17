interface Detail {
    title: string
    writer: string
    watchCount: string
}

export interface Board {
    url: string
    no: number
    detail: Detail
    attachmentId: string
    date: Date
    type: string
}

export interface GetMaterialListWithTypeProps {
    title: string
    id: string
    board: Board[]
}


class GetMaterialListWithTypeDto {
    constructor(materialList: GetMaterialListWithTypeProps[]) {
        this.materialList = materialList
    }
    materialList: GetMaterialListWithTypeProps[]
}

export default GetMaterialListWithTypeDto
