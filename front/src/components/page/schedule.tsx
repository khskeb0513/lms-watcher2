import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import ScheduleService from "../../service/scheduleService";
import {Container} from "react-bootstrap";
import Common from "../common";
import GetScheduleDto from "../../domain/schedule/getScheduleDto";
import ScheduleForm from "../scheduleForm";

const scheduleService = new ScheduleService()

interface ScheduleProps {
    modal: any,
    setModal: Dispatch<SetStateAction<any>>
}
const Schedule: React.FC<ScheduleProps> = ({setModal, modal}) => {
    const [list, setList] = useState(new GetScheduleDto([]))
    useEffect(() => {
        scheduleService.getIncompleteSchedule().then(r => {
            return setList(r);
        })
    }, [])
    return (
        <Container>
            <Common.Blank/>
            {list.courses.length === 0 ? <Common.RenewSession/> : <ScheduleForm modal={modal} setModal={setModal}  getSchedule={list}/>}
        </Container>
    )
}

export default Schedule
