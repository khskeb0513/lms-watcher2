import { Injectable } from "@nestjs/common";
import got from "got";
import * as cheerio from "cheerio";
import { SessionService } from "./session.service";
import { CommonService } from "./common.service";
import { DatabaseService } from "./database.service";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly commonService: CommonService,
    private readonly databaseService: DatabaseService
  ) {
  }

  private async getUsername(cookie: string) {
    const response = await got.get("https://lms.pknu.ac.kr/ilos/mp/myinfo_form.acl", {
      headers: {
        cookie
      }
    });
    const $ = cheerio.load(response.body);
    const str = $("#uploadForm > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(2)").html();
    return str ? str.slice(str.indexOf("(") + 1, str.length - 1) : null;
  }

  public async getByEClassId(id: string, cookie: string) {
    const body = await this.sessionService.moveKj(cookie, id) ? await got.get(
      "https://lms.pknu.ac.kr/ilos/st/course/online_list.acl",
      {
        headers: { cookie }
      }
    ) : null;
    const $ = cheerio.load(body.body);
    const percentArr = $("div#per_text")
      .toArray()
      .map((v) => {
        return { percent: $(v).html(), progressStr: $($(v).parent().children()[2]).html() };
      });
    let scheduleArr = $("span.site-mouseover-color")
      .toArray()
      .map((v) => {
        const name = $(v).html();
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
            name,
            item: item,
            kjKey: id
          };
        };
        return eval($(v).attr()["onclick"]);
      });
    for (const key in percentArr) {
      if (!!scheduleArr[key])
        scheduleArr[key] = {
          ...scheduleArr[key],
          percent: percentArr[key].percent,
          progressStr: percentArr[key].progressStr
        };
    }
    scheduleArr = id ? scheduleArr.map((v) => {
      return {
        ...v,
        edDt: this.commonService
          .dateParser(v.edDt)
          .format("YYYY년 MM월 DD일 HH:mm:ss"),
        d1:
          this.commonService
            .dateParser(v.edDt)
            .diff(this.commonService.dateParser(v.today).add(1, "d")) < 0,
        d2:
          this.commonService
            .dateParser(v.edDt)
            .diff(this.commonService.dateParser(v.today).add(2, "d")) < 0
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
    const ud = await this.getUsername(cookie);
    const seq = (await this.getVideo(kjKey, week, item, cookie))["link_seq"];
    await got.post("https://lms.pknu.ac.kr/ilos/st/course/online_view_at.acl", {
      headers: { cookie },
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
      headers: { cookie }
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
        headers: { cookie },
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
        headers: { cookie },
        form: {
          content_id: contentId,
          organization_id: 1,
          lecture_weeks: week,
          navi: "current",
          item_id: itemId,
          ky: kjKey,
          ud: await this.getUsername(cookie),
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
    ud,
    cookie: string
  ) {
    const video = await this.sessionService.moveKj(cookie, kjKey) ?
      await this.getVideo(kjKey, week, itemId, cookie) : null;
    const body = await got.post(
      "https://lms.pknu.ac.kr/ilos/st/course/online_view_hisno.acl",
      {
        headers: { cookie },
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
      return await this.issueHisCode(itemId, seq, kjKey, ud, cookie);
    }
  }
}
