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
}

export default interface GetMaterialListProps {
    title: string
    id: string
    board: Board[]
}
