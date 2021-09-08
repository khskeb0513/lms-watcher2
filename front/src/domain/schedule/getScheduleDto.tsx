import ScheduleInterface from "./scheduleInterface";

interface Courses {
    title: string
    id: string
    incomplete: ScheduleInterface[]
}

class GetScheduleDto {
    constructor(courses: Courses[]) {
        this.courses = courses
    }

    courses: Courses[]
}

export default GetScheduleDto
