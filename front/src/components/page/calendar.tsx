import {useEffect, useState} from "react";
import Common from "../common";
import CalendarService from "../../service/calendarService";
import GetSchoolCalendarDto from "../../domain/calendar/getSchoolCalendarDto";
import CalendarForm from "../calendarForm";

const calendarService = new CalendarService()
const Calendar = () => {
    const [getSchoolCalendarDto, setGetSchoolCalendarDto] = useState(new GetSchoolCalendarDto([]))
    const [list, setList] = useState(new GetSchoolCalendarDto([]))
    const [showAssignment, setShowAssignment] = useState(true)
    useEffect(() => {
        calendarService.getSchoolCalendar().then(r => {
            setGetSchoolCalendarDto(r)
            calendarService.getSchoolAssignment(r).then(r => setList(r))
        })
    }, [])
    const toggleAssignment = () => {
        if (!showAssignment) {
            calendarService.getSchoolAssignment(getSchoolCalendarDto).then(r => setList(r))
        } else {
            setList(getSchoolCalendarDto)
        }
        setShowAssignment(!showAssignment)
    }
    return (
        <>
            {list.schoolCalendar.length === 0 ? <Common.RenewSession/> : <CalendarForm showAssignment={showAssignment} toggleAssignment={toggleAssignment} list={list.schoolCalendar}/>}
        </>
    )
}

export default Calendar
