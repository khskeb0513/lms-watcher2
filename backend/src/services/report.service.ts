import { Injectable } from "@nestjs/common";
import { SessionService } from "./session.service";
import got from "got";
import * as cheerio from "cheerio";

@Injectable()
export class ReportService {
  constructor(private readonly sessionService: SessionService) {
  }

  public async getByCourseId(id: string, cookie: string) {
    await this.sessionService.moveKj(cookie, id);
    const body = (
      await got.get("https://lms.pknu.ac.kr/ilos/st/course/report_list.acl", {
        headers: { cookie }
      })
    ).body;
    const $ = cheerio.load(body);
    return $("table")
      .find("tr")
      .toArray()
      .map((element) => {
        const target = $(element),
          reportName = target.find(".subjt_top").html(),
          submitStatus = target.find("img").attr("alt"),
          subData = target.find(".number").toArray(),
          myScore = String($(subData[2]).html())
            .replace(/\n/gi, "")
            .replace(/ /gi, ""),
          setScore = String($(subData[3]).html())
            .replace(/\n/gi, "")
            .replace(/ /gi, ""),
          submitDate = String($(subData[4]).html())
            .replace(/\n/gi, "")
            .replace(/ /gi, "")
            .replace("오", " 오");
        return reportName
          ? { reportName, submitStatus, submitDate, myScore, setScore }
          : null;
      })
      .filter((v) => !!v);
  }

  public async getByCourseIdExceptComplete(
    id: string,
    cookie: string
  ) {
    return (await this.getByCourseId(id, cookie)).filter((v) => {
      return v.submitStatus.includes("미제출");
    });
  }
}
