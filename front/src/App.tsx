import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import MyNavbar from "./components/myNavbar";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import AuthService from "./service/authService";
import Index from './components/page';
import User from "./components/page/user";
import Common from './components/common';
import {Offcanvas} from "react-bootstrap";
import Auth from "./components/page/auth";

const authService = new AuthService()
const App = () => {
    const [promiseUsername] = useState(authService.getUsername)
    const [modal, setModal] = useState({
        show: false,
        title: '',
        body: (<></>)
    })
    return (
        <>
            <MyNavbar promiseUsername={promiseUsername}/>
            <BrowserRouter>
                <Switch>
                    {/*
                    /user, /auth, index
                    */}
                    <Route path={'/user'}>
                        <User modal={modal} setModal={setModal} promiseUsername={promiseUsername}/>
                    </Route>
                    <Route path={'/auth'}>
                        <Auth promiseUsername={promiseUsername}/>
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
                <Offcanvas.Body>
                    <div style={{wordBreak: "break-all"}}>{modal.body}</div>
                </Offcanvas.Body>
            </Offcanvas>
            <Common.Blank/>
        </>
    );
}

export default App;
