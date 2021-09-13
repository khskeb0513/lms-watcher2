import {Accordion, Button, Card, Container, FormControl, InputGroup, ListGroup, ListGroupItem} from "react-bootstrap";
import Common from "../common";
import AuthService from "../../service/authService";
import React, {useEffect, useState} from "react";

const authService = new AuthService()
const Account = () => {
    const [sessionStatus, setSessionStatus] = useState(false)
    const [cookieStr, setCookieStr] = useState('')
    useEffect(() => {
        authService.getSessionValue().then(r => {
            setSessionStatus(r.status)
            setCookieStr(r.status ? r.cookie : '')
        })
    }, [])
    const renewSession = () => authService.renewSession().then(r => {
        authService.getSessionValue().then(r => {
            setCookieStr(r.cookie)
            setSessionStatus(r.status)
        })
        if (!r.set) logout()
    })
    const logout = () => authService.logout().then(r => {
        if (r) {
            window.location.href = '/auth'
        } else {
            alert('error occurred! clear cookie required')
        }
    })
    const makeNotification = () => {
        Notification.requestPermission().then(r => {
            if (r === 'granted') {
                const notify = new Notification('TEST', {
                    body: 'permission granted.',
                    image: '/logo512.png',
                    icon: '/logo512.png'
                })
                notify.onshow = () => {
                    setTimeout(() => notify.close(), 3000)
                    new Audio('/notification.ogg').play()
                }
                notify.onclick = () => notify.close()
            } else {
                alert('permission denied.')
            }
        })
    }
    return (
        <>
            <Container>
                <Common.Blank/>
                <Card border={"dark"}>
                    <Card.Header>
                        Account Settings
                    </Card.Header>
                    <Card.Body>
                        <InputGroup>
                            <FormControl
                                placeholder="Cookie String" readOnly={true} value={cookieStr}
                            />
                            {sessionStatus ?
                                (<Button onClick={renewSession}>Renew Session</Button>) :
                                (<Button variant={"danger"} onClick={renewSession}>Renew Session Required</Button>)}
                        </InputGroup>
                        <small className={'mt-2 text-muted'}>
                            * Button changes to red if required to renew session
                        </small>
                        <hr/>
                        <Button variant={"outline-secondary"} onClick={logout}>
                            Logout
                        </Button>
                    </Card.Body>
                </Card>
                <Common.Blank/>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Test Field</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup variant={"flush"}>
                                <ListGroupItem>
                                    <Button variant={"outline-dark"} onClick={makeNotification}>
                                        Notification Test: check sound, dismiss in 3sec.
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </>
    )
}

export default Account
