import { Injectable } from "@nestjs/common";
import { SessionService } from "./session.service";
import got from "got";
import * as cheerio from "cheerio";

@Injectable()
export class BoardService {
  constructor(
    private readonly sessionService: SessionService
  ) {
  }

  public async getMaterialListByEClassId(id: string, cookie: string) {
    const response = await this.sessionService.moveKj(cookie, id) ?
      await got.get("https://lms.pknu.ac.kr/ilos/st/course/lecture_material_list.acl", { headers: { cookie } }) : null;
    const body = cheerio.load(response.body);
    return body("tbody").children("tr").toArray().map(v => {
      const detail = body(v).find("a.site-link");
      const dateStr = body(body(v).children("td")[4]).text();
      return {
        no: body(body(v).children()[0]).text().replace(/ /ig, "").replace(/\n/ig, ""),
        detail: {
          title: detail.find("div.subjt_top").text(),
          writer: body(detail.find("div.subjt_bottom").children()[0]).text(),
          watchCount: body(detail.find("div.subjt_bottom").children()[2]).text()
        },
        attachment: body(body(v).children("td")[3]).children().length !== 0,
        date: new Date(dateStr.substr(0, 10))
      };
    }).filter(v => v.no !== "조회할자료가없습니다");
  }
}
