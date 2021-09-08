import { Body, Controller, Get, Post, Session } from "@nestjs/common";
import { HappyDormService } from "../../services/happyDorm.service";

@Controller("api/happyDorm")
export class HappyDormAPIController {
  constructor(
    private readonly happyDormService: HappyDormService
  ) {
  }

  @Post("/isUser")
  public async isUser(
    @Body("username") username: string,
    @Body("password") password: string,
    @Session() session: Record<string, any>
  ) {
    const response = await this.happyDormService.isUser(username, password);
    session.happyDormCookieStr = response.cookie;
    return response;
  }

  @Get("/getSessionValue")
  public async getSessionValue(
    @Session() session: Record<string, any>
  ) {
    return this.happyDormService.isSessionValid(session.cookieStr);
  }

  @Get('getFullInformation')
  public async getFullInformation(
    @Session() session: Record<string, any>
  ) {
    return
  }
}
