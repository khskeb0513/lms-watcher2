import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Card, Container, ListGroup} from "react-bootstrap";
import Common from "./common";
import GetMaterialListProps, {Board} from "../domain/board/getMaterialListProps";
import BoardService from "../service/boardService";

interface MaterialFormProps {
    list: GetMaterialListProps[],
    modal: any,
    setModal: Dispatch<SetStateAction<any>>,
    boardService: BoardService
}

const MaterialForm: React.FC<MaterialFormProps> = ({list, modal, setModal, boardService}) => {
    const [lastUpdated, setLastUpdated] = useState('')
    useEffect(() => {
        setLastUpdated(new Date().toLocaleString())
    }, [])
    const showModal = (material: Board, v: GetMaterialListProps) => {
        boardService.getMaterialBody(v.id, material.url, material.attachmentId).then(r => setModal({
            ...modal, show: true, title: v.title, body: (
                <>
                    <h5>{material.detail.title}</h5>
                    <small className={'text-muted'}>{new Date(material.date).toLocaleDateString()}</small>
                    <hr/>
                    <div dangerouslySetInnerHTML={{__html: r.body}}/>
                    <hr/>
                    <h6>첨부파일</h6>
                    <ul>
                        {r.attachment.map(value => (<li>
                            <small onClick={() => fileDownload(value.fileUrl, v.id)}>
                                {value.name.substring(2, value.name.length)}
                            </small>
                        </li>))}
                    </ul>
                </>
            )
        }))
    }
    const fileDownload = (url: string, kjKey: string) => {
        if (window.confirm('' +
            'LMS 페이지에 로그인 되었으며, 과목 접근 가능한 브라우저를 사용하십시오.\n' +
            '확실하지 않으면 접근권한을 부여하기 위해 취소를 선택하십시오.'
        )) {
            window.open(`https://lms.pknu.ac.kr${url}`)
        } else {
            window.open(`https://lms.pknu.ac.kr/ilos/st/course/eclass_room2.acl?KJKEY=${kjKey}`)
        }
    }
    return (
        <Container>
            <Common.Blank/>
            <Card border={"primary"}>
                <Card.Header>
                    Class Board
                </Card.Header>
                <Card.Body>
                    Last updated in {lastUpdated}
                </Card.Body>
            </Card>
            <Common.Blank/>
            {list.map((v) => (
                <>
                    <Card>
                        <Card.Body>
                            <Card.Title>{v.title}</Card.Title>
                            <Card.Text><span className={'text-muted'}>{v.id}</span></Card.Text>
                        </Card.Body>
                        <ListGroup variant="flush">
                            {v.board.map((material, i) => {
                                return (
                                    <ListGroup.Item eventKey={i.toString()} action={true}
                                                    onClick={() => showModal(material, v)}>
                                        {material.detail.title}
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    </Card>
                    <Common.Blank/>
                </>
            ))}
            <Common.Blank/>
        </Container>
    )
}

export default MaterialForm
