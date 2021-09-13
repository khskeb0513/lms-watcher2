import Account from "./account";
import Login from "./login";
import React, {useEffect, useState} from "react";

interface AuthProps {
    promiseUsername: Promise<string>
}

const Auth: React.FC<AuthProps> = ({promiseUsername}) => {
    const [username, setUsername] = useState('')
    useEffect(() => {
        promiseUsername.then(r => setUsername(r))
    })
    return (
        <>
            {username ? <Account/> : <Login/>}
        </>
    )
}

export default Auth
