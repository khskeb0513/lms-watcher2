import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Route, Switch} from "react-router-dom";
import Schedule from "./schedule";
import Calendar from "./calendar";
import Index from "./index";
import Board from "./board";

interface UserProps {
    modal: any,
    setModal: Dispatch<SetStateAction<any>>,
    promiseUsername: Promise<string>
}

const User: React.FC<UserProps> = ({setModal, modal, promiseUsername}) => {
    const [username, setUsername] = useState('')
    useEffect(() => {
        promiseUsername.then(r => {
            if (!r) window.location.href = '/auth'
            else setUsername(r)
        })
    }, [promiseUsername])
    return (
        <>
            {username ? (
                <Switch>
                    {/*
                    /user/schedule, /user/calendar, /user/board
                    */}
                    <Route path={'/user/schedule'}>
                        <Schedule modal={modal} setModal={setModal}/>
                    </Route>
                    <Route path={'/user/calendar'}>
                        <Calendar/>
                    </Route>
                    <Route path={'/user/board'}>
                        <Board modal={modal} setModal={setModal}/>
                    </Route>
                    <Route>
                        <Index/>
                    </Route>
                </Switch>
            ) : null}
        </>
    )
}

export default User
