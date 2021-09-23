import { Injectable } from "@nestjs/common";
import got from "got";
import * as cheerio from "cheerio";

@Injectable()
export class EClassService {
  public async getListByTerm(cookie: string, ...term: number[]) {
    const uri =
      term.length === 0
        ? "https://lms.pknu.ac.kr/ilos/mp/course_register_list_b.acl"
        : "https://lms.pknu.ac.kr/ilos/mp/course_register_list2.acl";
    const response = await got.post(uri, {
      headers: { cookie },
      searchParams: {
        YEAR: term[0],
        TERM: term[1],
        NON_TERM: "B"
      }
    });
    const $ = cheerio.load(response.body);
    return $("div.content-container")
      .toArray()
      .map((v) => {
        const title = $(v).find(".content-title").text().replace(/ /gi, "");
        const idEle = $(v).find("a.site-link");
        const id = idEle.attr("onclick")
          ? idEle.attr("onclick").split("'")[1]
          : null;
        return { title, id };
      });
  }

  public async getList(cookie: string, ...term: number[]) {
    return [
      ...(term.length === 0
        ? await this.getListByTerm(cookie, 2021, 3)
        : await this.getListByTerm(cookie, term[0], term[1])),
      ...(await this.getListByTerm(cookie))
    ];
  }
}
