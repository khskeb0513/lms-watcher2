import {Button, Container, Form} from "react-bootstrap"
import Common from "../common"
import {useEffect, useState} from "react";
import AuthService from "../../service/authService";

const authService = new AuthService()
const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [cookieStr, setCookieStr] = useState('')
    const isUser = () => authService.isUser(username, password).then(r => {
        if (r.isUser) {
            window.location.href = '/'
        } else {
            alert('error! check user information')
        }
    })
    const setSessionValue = () => authService.setSessionValue(cookieStr).then(r => {
        if (r.set) {
            window.location.href = '/'
        } else {
            alert('error! check user information')
        }
    })
    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'development') authService.getSessionFromEnv().then(r => {
            if (r) window.location.href = '/'
            else alert('error! check user information')
        })
    }, [])
    return (
        <>
            <Container>
                <Common.Blank/>
                <div className={'row'}>
                    <div className={'col'}>
                        <h4>
                            Username login
                        </h4>
                        <Form className={'mt-4'}>
                            <Form.Group className="mb-3">
                                <Form.Control onChange={e => setUsername(e.target.value)} type="number"
                                              placeholder="Username"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control onChange={e => setPassword(e.target.value)} type="password"
                                              placeholder="Password"/>
                            </Form.Group>
                            <Button variant="primary" type="button" onClick={isUser}>
                                Submit
                            </Button>
                        </Form>
                        <hr className={'mt-4'}/>
                        <h4 className={'mt-4'}>
                            Set session value
                        </h4>
                        <Form className={'mt-4'}>
                            <Form.Group className="mb-3">
                                <Form.Control onChange={e => setCookieStr(e.target.value)} type="text"
                                              placeholder="JSESSIONID=..."/>
                            </Form.Group>
                            <Button variant="primary" type="button" onClick={setSessionValue}>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Login
