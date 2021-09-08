import { Injectable } from "@nestjs/common";
import got from "got";
import * as cheerio from "cheerio";
import * as moment from "moment";

@Injectable()
export class CalendarService {

  public async getCalendarByDate(date: string, cookie: string) {
    const body = (
      await got.post(
        "https://lms.pknu.ac.kr/ilos/main/main_schedule_view.acl",
        {
          headers: { cookie },
          searchParams: { viewDt: date }
        }
      )
    ).body;
    const $ = cheerio.load(body);
    return $("div.schedule-show-control")
      .toArray()
      .map((v) => {
        const dateStr = $(v).parent().children().last().children().last().text();
        const title = $(v).text().replace(/ /ig, "").replace(/\n/ig, "");
        const name = $(v).parent().children().last().children().first().children().first().text()
          .replace(/ /ig, "").replace(/\n/ig, "");
        const searchDate = new Date(`${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`);
        if (dateStr.length === 23) {
          const [startDateStr, endDateStr] = dateStr.split(" ~ ");
          return {
            title,
            searchDate,
            startDate: new Date(startDateStr),
            endDate: new Date(endDateStr),
            detail: {
              status: null,
              name
            }
          };
        } else {
          const status = $(v).parent().children().last().children().first().text()
            .replace(/ /ig, '').replace(/\n/ig, "");
          const submitDate = $($(v).parent().children().last().children().first().children().toArray()[1]).text().replace("마감일 : ", "");
          return {
            title,
            searchDate,
            submitDate,
            startDate: searchDate,
            endDate: searchDate,
            detail: {
              status: status.includes("상태") ? (status.includes("미제출") ? "미제출" : "제출") : null,
              name
            }
          };
        }
      })
      .filter((v) => !!v)
      .sort((a, b) => a.startDate.valueOf() - b.startDate.valueOf());
  }

  public async getCalendar(cookie: string) {
    const request = async (month: number) => {
      const body = (await got.post(
        "https://lms.pknu.ac.kr/ilos/main/main_schedule.acl",
        {
          headers: { cookie },
          searchParams: { month }
        }
      )).body;
      const $ = cheerio.load(body);
      const children = [];
      for (let i = 1; i < 32; i++) {
        const schoolSchedule = $(`#${month}_${i}_0`).length !== 0;
        const courseSchedule = $(`#${month}_${i}_1`).length !== 0;
        if (schoolSchedule || courseSchedule) {
          (await this.getCalendarByDate(
            `2021${month.toString().length === 1 ? `0${month}` : month}${i.toString().length === 1 ? `0${i}` : i}`,
            cookie
          )).forEach(v => {
            children.push(v);
          });
        }
      }
      return children;
    };
    return [
      ...await request(1),
      ...await request(2),
      ...await request(3),
      ...await request(4),
      ...await request(5),
      ...await request(6),
      ...await request(7),
      ...await request(8),
      ...await request(9),
      ...await request(10),
      ...await request(11),
      ...await request(12)
    ];
  }

  public async getReportCalendar(cookie: string) {
    const body = (
      await got.post(
        "https://lms.pknu.ac.kr/ilos/main/main_schedule_view.acl",
        {
          headers: { cookie }
        }
      )
    ).body;
    const $ = cheerio.load(body);
    return $("a.site-link")
      .toArray()
      .map((v) => {
        const detailArr = $(v)
          .children()
          .toArray()
          .map((v) => {
            return $(v).text();
          });
        const submitStatusStr = detailArr.find((v) => v.includes("상태 : ")),
          submitStatus = !!submitStatusStr
            ? submitStatusStr.includes(" 제출")
            : null;
        const parseDate = (str: string) => {
          const onlyNumber = [...str]
            .map((v) => parseInt(v, 10))
            .filter((v) => !!v || v === 0)
            .join("");
          if (onlyNumber.length === 0) return null;
          else {
            if (onlyNumber.length === 12) {
              const date = moment.utc(onlyNumber, "YYYYMMDDHHmmss");
              return str.includes("오전") ? date : date.add(12, "hours");
            } else {
              const date = moment.utc(
                onlyNumber.slice(0, 8) + "0" + onlyNumber.slice(8, 11),
                "YYYYMMDDHHmm"
              );
              return str.includes("오전") ? date : date.add(12, "hours");
            }
          }
        };
        const endDate = parseDate(
          String(detailArr.find((v) => v.includes("마감일")))
        );
        const lateEndDate = parseDate(
          String(detailArr.find((v) => v.includes("지각")))
        );
        const reportTitle = String(
          $(v)
            .parent()
            .parent()
            .first()
            .find("div.schedule-show-control")
            .text()
        )
          .replace(/\n/gi, "")
          .replace(/ {2}/g, "");
        return {
          reportTitle,
          courseTitle: String(detailArr[0])
            .replace(/\n/gi, "")
            .replace(/ {2}/g, ""),
          endDate,
          lateEndDate,
          submitStatus
        };
      })
      .sort((a, b) => a.endDate.valueOf() - b.endDate.valueOf());
  }
}
