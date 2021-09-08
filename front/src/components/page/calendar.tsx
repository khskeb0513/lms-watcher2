import {useEffect, useState} from "react";
import Common from "../common";
import CalendarService from "../../service/calendarService";
import GetSchoolCalendarDto from "../../domain/calendar/getSchoolCalendarDto";
import CalendarForm from "../calendarForm";

const calendarService = new CalendarService()
const Calendar = () => {
    const [list, setList] = useState(new GetSchoolCalendarDto([]))
    useEffect(() => {
        calendarService.getSchoolCalendar().then(r => setList(r))
    }, [])
    return (
        <>
            {list.schoolCalendar.length === 0 ? <Common.RenewSession/> : <CalendarForm list={list.schoolCalendar}/>}
        </>
    )
}

export default Calendar
