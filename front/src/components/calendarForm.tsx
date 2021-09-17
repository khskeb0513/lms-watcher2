import {SchoolCalendar} from "../domain/calendar/getSchoolCalendarDto";
import React, {useState} from "react";
import Common from "./common";
import {Accordion, Badge, Button, ButtonGroup, Card, Container, ListGroup} from "react-bootstrap";

interface CalendarFormProps {
    list: SchoolCalendar[]
    toggleAssignment: () => void
    showAssignment: boolean
}

const CalendarForm: React.FC<CalendarFormProps> = ({list, toggleAssignment, showAssignment}) => {
    const [lastUpdated] = useState(new Date().toLocaleString())
    return (
        <Container>
            <Common.Blank/>
            <Card border={"dark"}>
                <Card.Header>
                    Calendar
                </Card.Header>
                <Card.Body>
                    Last updated in {lastUpdated}
                </Card.Body>
            </Card>
            <Common.Blank/>
            <ButtonGroup>
                <Button disabled={showAssignment} onClick={toggleAssignment} variant="outline-dark">Only Assignments</Button>
                <Button disabled={!showAssignment} onClick={toggleAssignment} variant="outline-dark">All</Button>
            </ButtonGroup>
            <Common.Blank/>
            <Card border={"dark"}>
                <Card.Body>
                    <Accordion flush>
                        {list.map((v, i) => (
                            <Accordion.Item eventKey={i.toString()}>
                                <Badge bg="primary">{v.searchDate.split(',')[0]}</Badge>
                                <Accordion.Header>
                                    <span
                                        style={{
                                            color: !v.detail.name || !v.detail.status ? "black" : (v.detail.status === '제출' ? 'navy' : 'darkred')
                                        }}>{v.title}</span>
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
                                                    style={{
                                                        color: v.detail.status === '미제출' ? 'darkred' : 'black'
                                                    }}>
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
