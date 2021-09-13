import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {SessionService} from "./session.service";
import got from "got";
import * as cheerio from "cheerio";
import {UserService} from "./user.service";

@Injectable()
export class BoardService {
    constructor(
        private readonly sessionService: SessionService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) {
    }

    public async getMaterialBody(id: string, url: string, attachmentId: string, cookie: string) {
        const response = await this.sessionService.moveKj(cookie, id) ?
                await got.get(`https://lms.pknu.ac.kr/${url}`, {headers: {cookie}}) : null,
            eFileResponse = await got.post('https://lms.pknu.ac.kr/ilos/co/efile_list.acl', {
                headers: {cookie},
                form: {
                    ud: await this.userService.getUsername(cookie),
                    ky: id,
                    pf_st_flag: 2,
                    CONTENT_SEQ: attachmentId,
                    encoding: 'utf-8'
                }
            })
        const body = cheerio.load(response.body)
        const eFile = cheerio.load(eFileResponse.body)
        return {
            body: body('td.textviewer').html(),
            attachment: eFile('a.site-link').toArray().map(v => {
                const single = eFile(v)
                return {
                    fileUrl: single.attr('href'),
                    name: single.html()
                }
            })
        }
    }

    public async getMaterialListByEClassId(id: string, cookie: string) {
        const response = await this.sessionService.moveKj(cookie, id) ?
            await got.get("https://lms.pknu.ac.kr/ilos/st/course/lecture_material_list.acl", {headers: {cookie}}) : null;
        const body = cheerio.load(response.body);
        return body("tbody").children("tr").toArray().map(v => {
            const detail = body(v).find("a.site-link");
            const dateStr = body(body(v).children("td")[4]).text();
            const url = body(v).find('td.left').attr('onclick')
            const attachmentId = body(v).find('img.download_icon').attr('onclick')
            return {
                no: body(body(v).children()[0]).text().replace(/ /ig, "").replace(/\n/ig, ""),
                detail: {
                    title: detail.find("div.subjt_top").text(),
                    writer: body(detail.find("div.subjt_bottom").children()[0]).text(),
                    watchCount: body(detail.find("div.subjt_bottom").children()[2]).text()
                },
                url: !url ? null : url.slice(url.indexOf("pageMove('") + 10, url.indexOf("', event")),
                attachmentId: !attachmentId ? null : attachmentId.slice(attachmentId.indexOf('downloadClick(\'') + 15, attachmentId.indexOf('\')')),
                date: new Date(dateStr.substr(0, 10))
            };
        }).filter(v => v.no !== "조회할자료가없습니다");
    }
}
