import {forwardRef, Inject, Injectable} from "@nestjs/common";
import got from "got";
import * as cheerio from "cheerio";
import {SessionService} from "./session.service";
import {CommonService} from "./common.service";
import {DatabaseService} from "./database.service";
import {UserService} from "./user.service";
import {ElementType} from "domelementtype";

@Injectable()
export class ScheduleService {
    constructor(
        private readonly sessionService: SessionService,
        private readonly commonService: CommonService,
        private readonly databaseService: DatabaseService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) {
    }

    public async getAttendanceById(id: string, cookie: string) {
        const response = await this.sessionService.moveKj(cookie, id) ?
            await got.get('https://lms.pknu.ac.kr/ilos/st/course/attendance_list.acl', {
                headers: {cookie},
                searchParams: {
                    ud: await this.userService.getUsername(cookie),
                    ky: id,
                    encoding: 'utf-8'
                }
            }) : null
        const body = cheerio.load(response.body)
        const status = (str: string) => {
            switch (str) {
                case 'attend_box_1':
                    //출석
                    return 'attend'
                case 'attend_box_2':
                    //결석
                    return 'absent'
                case 'attend_box_3':
                    //지각
                    return 'late'
                case 'attend_box_4':
                    //미체크
                    return 'none'
                case 'attend_box_6':
                    //미진행
                    return 'inTime'
                default:
                    return null
            }
        }
        return body('ul').toArray().map(v => {
            return {
                week: body(v).parent().parent().find('p').text(),
                schedules: body(v).children('li').toArray().map(v => {
                    const progressStr = [
                        body(v).find('em').text(),
                        body(v).contents().filter((i, e) => e.type === ElementType.Text).text().trim()
                    ].join(' ').split('(')
                    const name = progressStr.slice(0, progressStr.length - 1).join('')
                    const progress = progressStr[progressStr.length - 1]
                    return {
                        name: name.replace(')', ''),
                        progress: progress.slice(0, progress.length - 1),
                        date: body(v).find('span').text(),
                        status: status(body(v).attr('class'))
                    }
                })
            }
        })
    }

    public async getByEClassId(id: string, cookie: string) {
        const body = await this.sessionService.moveKj(cookie, id) ? await got.get(
            "https://lms.pknu.ac.kr/ilos/st/course/online_list.acl",
            {
                headers: {cookie}
            }
        ) : null;
        const $ = cheerio.load(body.body);
        let scheduleArr = $("span.site-mouseover-color")
            .toArray()
            .map((v) => {
                const progress = $($(v).parent().parent().parent().children('div').toArray()[1])
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const viewGo = (
                    week: string,
                    seq: string,
                    edDt: string,
                    today: string,
                    item: string
                ) => {
                    return {
                        seq: Number(seq),
                        edDt: edDt,
                        today: today,
                        name: $(v).html(),
                        item: item,
                        percent: progress.children('div#per_text').html(),
                        progressStr: $(progress.children('div').toArray()[2]).html(),
                        kjKey: id
                    };
                };
                return eval($(v).attr()["onclick"]);
            });
        scheduleArr = id ? scheduleArr.map((v) => {
            return {
                ...v,
                edDt: this.commonService
                    .dateParser(v.edDt)
                    .format("YYYY년 MM월 DD일 HH:mm:ss")
            };
        }) : [];
        return scheduleArr;
    }

    public async getByEClassIdExceptComplete(
        id: string,
        cookie: string
    ) {
        return (await this.getByEClassId(id, cookie)).filter((v) => v.percent !== "100%");
    }

    public async requestHisStatus(
        week: number,
        item: string,
        his: number,
        kjKey: string,
        cookie: string
    ) {
        const ud = await this.userService.getUsername(cookie);
        const seq = (await this.getVideo(kjKey, week, item, cookie))["link_seq"];
        await got.post("https://lms.pknu.ac.kr/ilos/st/course/online_view_at.acl", {
            headers: {cookie},
            form: {
                lecture_weeks: week,
                item_id: item,
                link_seq: seq,
                his_no: his,
                ky: kjKey,
                ud,
                trigger_yn: "N",
                returnData: "json",
                encoding: "utf-8"
            }
        });
        const response = await got.post("https://lms.pknu.ac.kr/ilos/st/course/online_view_status.acl", {
            form: {
                lecture_weeks: week,
                item_id: item,
                link_seq: seq,
                his_no: his,
                ky: kjKey,
                ud,
                returnData: "json",
                encoding: "utf-8"
            },
            headers: {cookie}
        });
        return response.statusCode;
    }

    public async getVideo(
        kjKey: string,
        week: number,
        itemId: string,
        cookie: string
    ) {
        const formAcl = await this.sessionService.moveKj(cookie, kjKey) ? await got.get(
            "https://lms.pknu.ac.kr/ilos/st/course/online_view_form.acl", {
                headers: {cookie},
                searchParams: {
                    lecture_week: week,
                    _KJKEY: kjKey
                }
            }
        ) : null;
        const contentId = formAcl.body.slice(
            formAcl.body.indexOf("cv.load(\""),
            formAcl.body.indexOf(");", formAcl.body.indexOf("cv.load(\""))
        ).split("\", \"")[2];
        const naviAcl = await got.post(
            "https://lms.pknu.ac.kr/ilos/st/course/online_view_navi.acl", {
                headers: {cookie},
                form: {
                    content_id: contentId,
                    organization_id: 1,
                    lecture_weeks: week,
                    navi: "current",
                    item_id: itemId,
                    ky: kjKey,
                    ud: await this.userService.getUsername(cookie),
                    returnData: "json",
                    encoding: "utf-8"
                }
            }
        );
        const naviAclBody = JSON.parse(naviAcl.body);
        await this.databaseService.setContent(kjKey, itemId, naviAclBody["cid"], naviAclBody["content_id"]);
        return JSON.parse(naviAcl.body);
    }

    public async issueHisCode(
        itemId,
        week,
        kjKey,
        cookie: string
    ) {
        const ud = await this.userService.getUsername(cookie)
        const video = await this.sessionService.moveKj(cookie, kjKey) ?
            await this.getVideo(kjKey, week, itemId, cookie) : null;
        const body = await got.post(
            "https://lms.pknu.ac.kr/ilos/st/course/online_view_hisno.acl",
            {
                headers: {cookie},
                form: {
                    lecture_weeks: week,
                    item_id: itemId,
                    link_seq: video["link_seq"],
                    kjkey: kjKey,
                    _KJKEY: kjKey,
                    ky: kjKey,
                    ud,
                    returnData: "json",
                    encoding: "utf-8"
                }
            }
        );
        const his = parseInt(JSON.parse(body.body)["his_no"]);
        return this.databaseService.setHis(his, ud, itemId);
    }

    public async getHisCode(
        itemId,
        seq,
        kjKey,
        ud,
        cookie: string
    ) {
        const dbResponse = await this.databaseService.getHisByUsernameItem(ud, itemId);
        if (dbResponse) {
            return dbResponse;
        } else {
            return await this.issueHisCode(itemId, seq, kjKey, cookie);
        }
    }
}
