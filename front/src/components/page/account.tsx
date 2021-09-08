import {Button, Container} from "react-bootstrap";
import Common from "../common";
import AuthService from "../../service/authService";
import React, {useEffect, useState} from "react";

const authService = new AuthService()
const Account = () => {
    const [sessionStatus, setSessionStatus] = useState(false)
    useEffect(() => {
        authService.getSessionValue().then(r => {
            setSessionStatus(r.status)
        })
    }, [])
    const renewSession = () => authService.renewSession().then(r => {
        if (r.set) {
            window.location.href = '/'
        } else {
            alert('session renew failed! clear cookie required')
        }
    })
    const logout = () => authService.logout().then(r => {
        if (r) {
            window.location.href = '/'
        } else {
            alert('error occurred! clear cookie required')
        }
    })
    return (
        <>
            <Container>
                <Common.Blank/>
                <Button variant={"outline-dark"} onClick={logout}>
                    Logout
                </Button>{' '}
                {sessionStatus ?
                    (<Button onClick={renewSession}>Renew Session</Button>) :
                    (<Button variant={"danger"} onClick={renewSession}>Renew Session Required</Button>)}
            </Container>
        </>
    )
}

export default Account
