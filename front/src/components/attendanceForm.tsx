import React, {useState} from "react";
import GetAttendanceListDto from "../domain/schedule/getAttendanceListDto";
import Common from "./common";
import {Badge, Card, Col, Container, ListGroup, Row} from "react-bootstrap";

interface AttendanceFormProps {
    attendanceList: GetAttendanceListDto
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({attendanceList}) => {
    const [lastUpdated] = useState(new Date().toLocaleString())
    const setColor = (str: string) => {
        switch (str) {
            case 'attend':
                return '#96d452'
            case 'absent':
                return '#f44336'
            case 'late':
                return '#fd9500'
            case 'none':
                return 'white'
            case 'inTime':
                return '#ddd'
            default:
                return 'white'
        }
    }
    return (
        <Container>
            <Common.Blank/>
            <Card border={"dark"}>
                <Card.Body>
                    Last updated in {lastUpdated}
                </Card.Body>
            </Card>
            <Common.Blank/>
            {attendanceList.attendanceList.map(kj => {
                return (
                    <>
                        <Card border={"dark"}>
                            <Card.Header>
                                {kj.title}
                                <br/>
                                <small className={'text-muted'}>{kj.id}</small>
                            </Card.Header>
                            <Card.Body className={'p-0'}>
                                <ListGroup variant="flush">
                                    {kj.attendance.map(v => (
                                        <ListGroup.Item>
                                            <ListGroup horizontal>
                                                <ListGroup.Item style={{border: "none"}}>
                                                    <Badge pill>{v.week}</Badge>
                                                </ListGroup.Item>
                                                <ListGroup.Item style={{border: "none"}}>
                                                    <Row>
                                                        {v.schedules.map(v => (
                                                            <Col className={'ps-2 pe-2 me-1 mt-1 col-auto'}
                                                                 style={{
                                                                     border: '1px solid lightgray',
                                                                     color: 'black',
                                                                     textAlign: "center",
                                                                     backgroundColor: setColor(v.status),
                                                                     whiteSpace: "nowrap"
                                                                 }}>
                                                                <span style={{fontSize: "small"}}>
                                                                    {v.name} ({v.progress})
                                                                </span>
                                                                <br/>
                                                                <span style={{fontSize: "smaller"}}>
                                                                    {v.date}
                                                                </span>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                        <Common.Blank/>
                    </>
                )
            })}
        </Container>
    )
}

export default AttendanceForm
