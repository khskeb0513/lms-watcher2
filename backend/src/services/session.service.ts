import { Injectable } from "@nestjs/common";
import got from "got";

@Injectable()
export class SessionService {

  public async isUser(username: string, password: string) {
    const request = await got.post("https://lms.pknu.ac.kr/ilos/lo/login.acl", {
      form: {
        usr_id: username,
        usr_pwd: password
      }
    });
    const cookieStr = String(request.headers["set-cookie"]);
    const cookie = cookieStr.slice(cookieStr.indexOf("JSESSIONID"), cookieStr.length).split(";")[0];
    console.log({ username, cookie });
    return {
      isUser: !request.body.includes("일치하지"),
      cookie
    };
  }

  public async isSessionValid(cookie: string) {
    const request = await got.get("https://lms.pknu.ac.kr/ilos/mp/user_image_view.acl", {
      headers: {
        cookie
      }
    });
    // 접속이 종료 되었습니다. 다시 로그인 하세요.
    return !request.body.includes("접속이 종료");
  }

  public async moveKj(cookie: string, kjKey: string) {
    const request = await got.post("https://lms.pknu.ac.kr/ilos/st/course/eclass_room2.acl", {
      headers: { cookie },
      searchParams: {
        KJKEY: kjKey,
        returnData: "json",
        returnURI: "%2Filos%2Fst%2Fcourse%2Fsubmain_form.acl",
        encoding: "utf-8"
      }
    });
    return request.statusCode
  }

  public getSessionFromEnv() {
    return process.env['COOKIE_STR']
  }
}
