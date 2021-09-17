import GetSchoolCalendarDto from "../domain/calendar/getSchoolCalendarDto";

class CalendarService {
    async getSchoolCalendar(): Promise<GetSchoolCalendarDto> {
        const response = await fetch('/api/user/getSchoolCalendar')
        const body = await response.json()
        return new GetSchoolCalendarDto(body.schoolCalendar)
    }

    async getSchoolAssignment(getSchoolCalendarDto: GetSchoolCalendarDto) {
        const body = getSchoolCalendarDto.schoolCalendar.filter(v => !!v.detail.name || !!v.detail.status)
        return new GetSchoolCalendarDto(body)
    }
}

export default CalendarService
