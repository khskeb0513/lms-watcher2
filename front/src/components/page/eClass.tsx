import {useEffect, useState} from "react";
import EClassService from "../../service/eClassService";

const eClassService = new EClassService()
const EClass = () => {
    const [list, setList] = useState([])
    useEffect(() => {
        eClassService.getEClasses().then(r => {
            setList(r)
        })
    })
    return (
        <>
            {list}
        </>
    )
}

export default EClass
