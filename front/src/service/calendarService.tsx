import GetSchoolCalendarDto from "../domain/calendar/getSchoolCalendarDto";

class CalendarService {
    async getSchoolCalendar(): Promise<GetSchoolCalendarDto> {
        const response = await fetch('/api/user/getSchoolCalendar')
        const body = await response.json()
        return new GetSchoolCalendarDto(body.schoolCalendar)
    }
}

export default CalendarService
