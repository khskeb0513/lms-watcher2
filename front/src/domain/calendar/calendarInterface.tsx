interface Detail {
    status: string | null
    name: string | null
}

export default interface SchoolCalendar {
    title: string
    searchDate: string
    startDate: string
    endDate: string
    detail: Detail
}
