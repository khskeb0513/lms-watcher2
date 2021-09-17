import {Button, Container, Nav, Navbar} from "react-bootstrap"
import React, {useEffect, useState} from "react";

interface MyNavbarProps {
    promiseUsername: Promise<string>
}

const MyNavbar: React.FC<MyNavbarProps> = ({promiseUsername}) => {
    const [username, setUsername] = useState('')
    useEffect(() => {
        promiseUsername.then(r => setUsername(r))
    }, [promiseUsername])
    return (
        <>
            <Navbar bg="dark" variant="dark" expand={"md"}>
                <Container>
                    <Navbar.Brand href="/">
                        {process.env.REACT_APP_ENV === 'development' ? 'study1' : 'LMS Watcher'}
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link href="/user/schedule">Schedule</Nav.Link>
                            <Nav.Link href="/user/attendance">Attendance</Nav.Link>
                            <Nav.Link href="/user/calendar">Calendar</Nav.Link>
                            <Nav.Link href="/user/board">ClassBoard</Nav.Link>
                        </Nav>
                        <Nav>
                            <Button variant={"outline-light"} size={"sm"} href={'/auth'}>
                                {username ? `User: ${username}` : 'LMS Login'}
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default MyNavbar
