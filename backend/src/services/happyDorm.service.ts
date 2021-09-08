import { Injectable } from "@nestjs/common";
import got from "got";

@Injectable()
export class HappyDormService {
  public async isUser(
    username: string,
    password: string
  ) {
    const response = await got.post("https://busan.happydorm.or.kr/00/0000_login.kmc", {
      form: {
        admin_chk: "N",
        lf_locgbn: "DD",
        id: username,
        pw: password
      }
    });
    const cookieStr = response.headers["set-cookie"].toString();
    return {
      isUser: !response.body.includes("일치하지"),
      cookie: cookieStr.slice(cookieStr.indexOf("JSESSIONID"), cookieStr.length).split(";")[0]
    };
  }

  public async isSessionValid(cookie: string) {
    const response = await got.post("https://busan.happydorm.or.kr/student/getIPSaHwakIn_t2.kmc", {
      headers: { cookie }
    });
    return {
      cookie, status: !response.body.includes("종료")
    };
  }



  public async getFullInformation(cookie: string) {
    const response = await got.post("https://busan.happydorm.or.kr/student/getIPSaHwakIn_t2.kmc", {
      headers: { cookie }
    });
    return {
      status: !response.body.includes("종료"), body: JSON.parse(response.body)
    };
  }

  public async getRoom(cookie: string) {
    const response = await got.post("https://busan.happydorm.or.kr/student/getIPSaHwakIn_t2.kmc", {
      headers: { cookie }
    });
    return {
      status: !response.body.includes("종료"), body: JSON.parse(response.body)
    };
  }
}
