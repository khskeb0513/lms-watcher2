import {Button, Container, Nav, Navbar} from "react-bootstrap"
import React from "react";

interface MyNavbarProps {
    username: string | null
}

const MyNavbar: React.FC<MyNavbarProps> = ({username}) => {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand={"md"}>
                <Container>
                    <Navbar.Brand href="/">
                        LMS Watcher
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link href="/user/schedule">Schedule</Nav.Link>
                            <Nav.Link href="/user/calendar">Calendar</Nav.Link>
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
