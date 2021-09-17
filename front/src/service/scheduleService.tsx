import GetScheduleDto from "../domain/schedule/getScheduleDto";
import GetVideoDto from "../domain/schedule/getVideoDto";
import GetHisCodeDto from "../domain/schedule/getHisCodeDto";
import GetAttendanceListDto, {GetAttendance} from "../domain/schedule/getAttendanceListDto";

class ScheduleService {
    async getAttendanceList(): Promise<GetAttendanceListDto> {
        const response = await fetch('/api/user/getAttendanceList')
        const body: GetAttendance[] = await response.json()
        return new GetAttendanceListDto(body.filter(v => v.attendance.length !== 0))
    }

    async getSchedule(): Promise<GetScheduleDto> {
        const response = await fetch('/api/user/getSchedule')
        const body = await response.json()
        return new GetScheduleDto(body.courses)
    }

    async getIncompleteSchedule(getScheduleDto: GetScheduleDto): Promise<GetScheduleDto> {
        return new GetScheduleDto(getScheduleDto.courses.map(v => ({
            ...v, incomplete: v.incomplete.filter(v => v.percent !== '100%')
        })).filter(v => v.incomplete.length !== 0))
    }

    async getVideo(kjKey: string, seq: number, itemId: string): Promise<GetVideoDto> {
        const response = await fetch(`/api/schedule/getVideo?kjKey=${kjKey}&seq=${seq}&item=${itemId}`)
        const body = await response.json()
        return new GetVideoDto(body.cid, body.contentId)
    }

    async getHisCode(kjKey: string, seq: number, itemId: string): Promise<GetHisCodeDto> {
        const response = await fetch(`/api/schedule/getHisCode?kjKey=${kjKey}&seq=${seq}&item=${itemId}`)
        const body = await response.json()
        return new GetHisCodeDto(body.hisCode, body.timestamp)
    }

    async reissueHis(kjKey: string, seq: number, itemId: string): Promise<GetHisCodeDto> {
        const response = await fetch(`/api/schedule/issueHis?kjKey=${kjKey}&seq=${seq}&item=${itemId}`)
        const body = await response.json()
        return new GetHisCodeDto(body.hisCode, body.timestamp)
    }

    async requestHisStatus(kjKey: string, seq: number, itemId: string, his: number): Promise<number> {
        const response = await fetch(`/api/schedule/requestHisStatus?kjKey=${kjKey}&seq=${seq}&item=${itemId}&his=${his}`)
        return await response.json()
    }
}

export default ScheduleService
