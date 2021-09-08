import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import MyNavbar from "./components/myNavbar";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./components/page/login";
import AuthService from "./service/authService";
import Account from "./components/page/account";
import Index from './components/page';
import User from "./components/page/user";
import Common from './components/common';
import {Offcanvas} from "react-bootstrap";

const authService = new AuthService()
const App = () => {
    const [username, setUsername] = useState('')
    const [modal, setModal] = useState({
        show: false,
        title: 'modal',
        body: (<span>body</span>)
    })
    useEffect(() => {
        authService.getUsername().then(r => {
            setUsername(r)
        })
    }, [])
    return (
        <>
            <MyNavbar username={username}/>
            <BrowserRouter>
                <Switch>
                    <Route path={'/user'}>
                        <User modal={modal} setModal={setModal}/>
                    </Route>
                    <Route path={'/auth'}>
                        {username ? <Account/> : <Login/>}
                    </Route>
                    <Route>
                        <Index/>
                    </Route>
                </Switch>
            </BrowserRouter>
            <Offcanvas show={modal.show} onHide={() => setModal({...modal, show: false})}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{modal.title}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>{modal.body}</Offcanvas.Body>
            </Offcanvas>
            <Common.Blank/>
        </>
    );
}

export default App;
