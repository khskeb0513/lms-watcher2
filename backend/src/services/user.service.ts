import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {EClassService} from "./eClass.service";
import {ScheduleService} from "./schedule.service";
import {ReportService} from "./report.service";
import {SessionService} from "./session.service";
import {CalendarService} from "./calendar.service";
import got from "got";
import * as cheerio from "cheerio";
import {DatabaseService} from "./database.service";
import {BoardService} from "./board.service";

@Injectable()
export class UserService {
    constructor(
        private readonly sessionService: SessionService,
        private readonly eClassService: EClassService,
        private readonly reportService: ReportService,
        private readonly calendarService: CalendarService,
        @Inject(forwardRef(() => ScheduleService))
        private readonly scheduleService: ScheduleService,
        private readonly databaseService: DatabaseService,
        @Inject(forwardRef(() => BoardService))
        private readonly boardService: BoardService
    ) {
    }

    public async getAttendanceList(cookie: string) {
        const response = await this.eClassService.getList(cookie)
        return Promise.all(response.map(async v => ({
            ...v,
            attendance: await this.scheduleService.getAttendanceById(v.id, cookie)
        })))
    }

    public async getNoticeList(cookie: string) {
        const response = await this.eClassService.getList(cookie);
        const data = [];
        for (const v of response) {
            data.push({...v, board: await this.boardService.getNoticeListByEClassId(v.id, cookie)});
        }
        return data;
    }

    public async getMaterialList(cookie: string) {
        const response = await this.eClassService.getList(cookie);
        const data = [];
        for (const v of response) {
            data.push({...v, board: await this.boardService.getMaterialListByEClassId(v.id, cookie)});
        }
        return data;
    }

    public async requestHisStatus(item: string, seq: number, kjKey: string, cookie: string) {
        const his = await this.databaseService.getHisByUsernameItem(await this.getUsername(cookie), item);
        return {
            item,
            seq,
            kjKey,
            his: {
                hisCode: his.hisCode,
                timestamp: his.timestamp,
                localeTimestamp: new Date(his.timestamp).toLocaleString()
            }
        };
    }

    public async getUsername(cookie: string) {
        const response = await got.get("https://lms.pknu.ac.kr/ilos/mp/myinfo_form.acl", {
            headers: {
                cookie
            }
        });
        const $ = cheerio.load(response.body);
        const str = $("#uploadForm > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(2)").html();
        return str ? str.slice(str.indexOf("(") + 1, str.length - 1) : null;
    }

    public async getIncompleteSchedule(cookie: string) {
        const courseArr = await this.eClassService.getList(cookie);
        const data = [];
        for (let i = 0; i < courseArr.length; i++) {
            data.push({
                ...courseArr[i],
                incomplete: await this.scheduleService.getByEClassIdExceptComplete(
                    courseArr[i].id,
                    cookie
                )
            });
        }
        return data;
    }

    public async getSchedule(cookie: string, ...term: number[]) {
        const courseArr = term.length === 0 ? await this.eClassService.getList(cookie) : await this.eClassService.getList(cookie, term[0], term[1]);
        const data = [];
        for (let i = 0; i < courseArr.length; i++) {
            data.push({
                ...courseArr[i],
                incomplete: await this.scheduleService.getByEClassId(
                    courseArr[i].id,
                    cookie
                )
            });
        }
        return data;
    }

    public async getIncompleteReport(cookie: string) {
        const courseArr = await this.eClassService.getList(cookie);
        return Promise.all(
            courseArr.map(async (v) => {
                return {
                    ...v,
                    incomplete: await this.reportService.getByCourseIdExceptComplete(
                        v.id,
                        cookie
                    )
                };
            })
        );
    }

    public async getCalendar(cookie: string) {
        return (await this.calendarService.getCalendar(cookie))
            .filter((v) => new Date().setUTCDate(1).valueOf() < v.startDate.valueOf())
            .map((v) => {
                return {
                    ...v,
                    startDate: v.startDate.toLocaleString(),
                    endDate: v.endDate.toLocaleString(),
                    searchDate: v.searchDate.toLocaleString()
                };
            });
    }

    public async getReportCalendar(cookie: string) {
        return (await this.calendarService.getReportCalendar(cookie))
            .filter((v) => v.endDate.valueOf() > new Date().valueOf())
            .map((v) => {
                return {
                    ...v,
                    endDate: v.endDate ? v.endDate.format("~ YYYY/MM/DD HH:mm:ss") : null,
                    lateEndDate: v.lateEndDate
                        ? v.lateEndDate.format("~ YYYY/MM/DD HH:mm:ss")
                        : null
                };
            });
    }

    public async getEClassCalendar(cookie: any) {
        const response = await this.getCalendar(cookie);
        return response.filter(v => !!v.detail.name);
    }
}
