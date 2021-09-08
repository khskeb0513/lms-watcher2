import React from "react";
import {Container} from "react-bootstrap";

const Common = {
    Blank: () => (<div className={'mt-4'}/>),
    RenewSession: () => (<Container>
        <Common.Blank/>
        <h4>Data will soon loaded. When it not appear more than one minute, <a href={'/auth'}>renew session</a>.</h4>
    </Container>)
}


export default Common
