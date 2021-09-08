import { Controller, Get, Query, Render, Session } from "@nestjs/common";
import { UserService } from "../services/user.service";

@Controller("ui/user")
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Get("/requestHisStatus")
  @Render("user/requestHisStatus")
  public async requestHisStatus(
    @Query("item") item: string,
    @Query("seq") seq: number,
    @Query("kjKey") kjKey: string,
    @Session() session: Record<string, any>
  ) {
    return this.userService.requestHisStatus(item, seq, kjKey, session.cookieStr);
  }

  @Get("/getIncompleteSchedule")
  @Render("user/getIncompleteSchedule")
  public async getIncompleteSchedule(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getIncompleteSchedule(session.cookieStr)
    };
  }

  @Get("/getSchedule")
  @Render("user/getSchedule")
  public async getSchedule(
    @Query("year") year: number,
    @Query("term") term: number,
    @Session() session: Record<string, any>
  ) {
    return {
      courses: !!year && !!term ? await this.userService.getSchedule(session.cookieStr, year, term) : await this.userService.getSchedule(session.cookieStr)
    };
  }

  @Get("/getIncompleteReport")
  @Render("user/getIncompleteReport")
  public async getIncompleteReport(@Session() session: Record<string, any>) {
    return {
      courses: await this.userService.getIncompleteReport(session.cookieStr)
    };
  }

  @Get("/setBrowserLoginSession")
  @Render("user/setBrowserLoginSession")
  public async setBrowserLoginSession() {
    return;
  }

  @Get("/getCalendar")
  @Render("user/getCalendar")
  public async getCalendar(@Session() session: Record<string, any>) {
    return {
      calendars: await this.userService.getCalendar(session.cookieStr)
    };
  }

  @Get("/getEClassCalendar")
  @Render("user/getEClassCalendar")
  public async getEClassCalendar(@Session() session: Record<string, any>) {
    return {
      calendars: await this.userService.getEClassCalendar(session.cookieStr)
    };
  }

  @Get("/getReportCalendar")
  @Render("user/getReportCalendar")
  public async getReportCalendar(@Session() session: Record<string, any>) {
    return {
      calendars: await this.userService.getReportCalendar(session.cookieStr)
    };
  }
}
