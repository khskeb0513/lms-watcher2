import SchoolCalendar from "./calendarInterface"

class GetSchoolCalendarDto {
    constructor(schoolCalendar: SchoolCalendar[]) {
        this.schoolCalendar = schoolCalendar
    }

    schoolCalendar: SchoolCalendar[]
}

export default GetSchoolCalendarDto
