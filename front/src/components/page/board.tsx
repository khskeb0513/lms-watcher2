import BoardService from "../../service/boardService";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import getMaterialListDto from "../../domain/board/getMaterialListDto";
import Common from "../common";
import MaterialForm from "../MaterialForm";

interface BoardProps {
    modal: any,
    setModal: Dispatch<SetStateAction<any>>
}

const boardService = new BoardService()
const Board: React.FC<BoardProps> = ({modal, setModal}) => {
    const [list, setList] = useState(new getMaterialListDto([]))
    useEffect((() => {
        boardService.getMaterialList().then(r => {
            setList(r)
        })
    }), [])
    return (
        <>
            {list.materialList.length === 0 ? <Common.RenewSession/> : <MaterialForm boardService={boardService} modal={modal} setModal={setModal} list={list.materialList}/>}
        </>
    )
}

export default Board
