import SchoolCalendar from "../domain/calendar/calendarInterface";
import React, {useState} from "react";
import Common from "./common";
import {Accordion, Card, Container, ListGroup} from "react-bootstrap";

interface CalendarFormProps {
    list: SchoolCalendar[]
}

const CalendarForm:React.FC<CalendarFormProps> = ({list}) => {
    const [lastUpdated] = useState(new Date().toLocaleString())
    return (
        <Container>
            <Common.Blank/>
            <Card border={"primary"}>
                <Card.Body>
                    Last updated in {lastUpdated}
                </Card.Body>
            </Card>
            <Common.Blank/>
            <Card>
                <Card.Body>
                    <Accordion flush>
                        {list.map((v, i) => (
                            <Accordion.Item eventKey={i.toString()}>
                                <Accordion.Header>
                                        <span
                                            style={{
                                                color: !v.detail.name || !v.detail.status ? "black" : "navy",
                                                fontWeight: !v.detail.name || !v.detail.status ? "normal" : "bold"
                                            }}
                                        >
                                        {v.title}
                                        </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Start date: {v.startDate}</ListGroup.Item>
                                        <ListGroup.Item>End date: {v.endDate}</ListGroup.Item>
                                        {!v.detail.name ? null :
                                            <ListGroup.Item>EClass name: {v.detail.name}</ListGroup.Item>}
                                        {!v.detail.status ? null :
                                            <ListGroup.Item>Submit status:{' '}
                                                <span
                                                    style={{fontWeight: "bold", color: v.detail.status === '미제출' ? 'darkred' : 'black'}}>
                                                    {v.detail.status}
                                                </span>
                                            </ListGroup.Item>}
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Card.Body>
            </Card>
            <Common.Blank/>
        </Container>
    )
}

export default CalendarForm
