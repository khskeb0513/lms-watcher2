import BoardService from "../../service/boardService";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Common from "../common";
import BoardForm from "../boardForm";
import GetMaterialListWithTypeDto from "../../domain/board/getMaterialListWithTypeDto";

interface BoardProps {
    modal: any,
    setModal: Dispatch<SetStateAction<any>>
}

const boardService = new BoardService()
const Board: React.FC<BoardProps> = ({modal, setModal}) => {
    const [list, setList] = useState(new GetMaterialListWithTypeDto([]))
    useEffect((() => {
        boardService.getMaterialList().then(materialList => {
            boardService.getNoticeList().then(noticeList => {
                setList(new GetMaterialListWithTypeDto(materialList.materialList.map(v => {
                    const notice = noticeList.materialList.find(material => material.id === v.id)
                    return {
                        ...v,
                        board: [
                            ...v.board.map(v => ({...v, type: 'material'})),
                            ...(notice ? notice.board.map(v => ({...v, type: 'notice'})) : [])
                        ]
                    }
                })))
            })
        })
    }), [])
    return (
        <>
            {list.materialList.length === 0 ? <Common.RenewSession/> :
                <BoardForm boardService={boardService} modal={modal} setModal={setModal} list={list.materialList}/>}
        </>
    )
}

export default Board
