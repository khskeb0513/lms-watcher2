import React, {Dispatch, SetStateAction} from "react";
import {Route, Switch} from "react-router-dom";
import Schedule from "./schedule";
import Calendar from "./calendar";

interface UserProps {
    modal: any,
    setModal: Dispatch<SetStateAction<any>>
}

const User: React.FC<UserProps> = ({setModal, modal}) => {
    return (
        <>
            <Switch>
                <Route path={'/user/schedule'}>
                    <Schedule modal={modal} setModal={setModal}/>
                </Route>
                <Route path={'/user/calendar'}>
                    <Calendar/>
                </Route>
            </Switch>
        </>
    )
}

export default User
