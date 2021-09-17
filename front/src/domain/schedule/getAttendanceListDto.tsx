interface Schedule {
    name: string
    progress: string
    date: string
    status: string
}

interface Attendance {
    week: string
    schedules: Schedule[]
}

export interface GetAttendance {
    title: string
    id: string
    attendance: Attendance[]
}

export default class GetAttendanceListDto {
    constructor(attendanceList: GetAttendance[]) {
        this.attendanceList = attendanceList
    }

    attendanceList: GetAttendance[]
}
