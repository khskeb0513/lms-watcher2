interface Detail {
    status: string | null
    name: string | null
}

export interface SchoolCalendar {
    title: string
    searchDate: string
    startDate: string
    endDate: string
    detail: Detail
}


export default class GetSchoolCalendarDto {
    constructor(schoolCalendar: SchoolCalendar[]) {
        this.schoolCalendar = schoolCalendar
    }

    schoolCalendar: SchoolCalendar[]
}
