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
    const [getScheduleDto, setGetScheduleDto] = useState(new GetScheduleDto([]))
    const [list, setList] = useState(getScheduleDto)
    const [showIncomplete, setShowIncomplete] = useState(true)
    useEffect(() => {
        scheduleService.getSchedule().then(r => {
            setGetScheduleDto(r)
            scheduleService.getIncompleteSchedule(r).then(r => {
                setList(r)
            })
        })
    }, [])
    const toggleIncomplete = () => {
        if (!showIncomplete) {
            scheduleService.getIncompleteSchedule(getScheduleDto).then(r => {
                setList(r)
            })
        } else {
            setList(getScheduleDto)
        }
        setShowIncomplete(!showIncomplete)
    }
    const requestGetSchedule = () => {
        scheduleService.getSchedule().then(r => {
            if (showIncomplete) {
                scheduleService.getIncompleteSchedule(r).then(r => {
                    setList(r)
                })
            } else {
                setList(r)
            }
            setGetScheduleDto(r)
        })
    }
    return (
        <Container>
            <Common.Blank/>
            {list.courses.length === 0 ?
                <Common.RenewSession/> :
                <ScheduleForm showIncomplete={showIncomplete} toggleIncomplete={toggleIncomplete}
                              requestGetSchedule={requestGetSchedule} modal={modal} setModal={setModal}
                              getSchedule={list}/>}
        </Container>
    )
}

export default Schedule
