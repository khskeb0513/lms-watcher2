import ScheduleService from "../../service/scheduleService";
import React, {useEffect, useState} from "react";
import GetAttendanceListDto from "../../domain/schedule/getAttendanceListDto";
import Common from "../common";
import AttendanceForm from "../attendanceForm";

const scheduleService = new ScheduleService()

const Attendance = () => {
    const [list, setList] = useState(new GetAttendanceListDto([]))
    useEffect(() => {
        scheduleService.getAttendanceList().then(r => setList(r))
    }, [])
    return (
        <>
            {list.attendanceList.length === 0 ? <Common.RenewSession/> : <AttendanceForm attendanceList={list}/>}
        </>
    )
}

export default Attendance
