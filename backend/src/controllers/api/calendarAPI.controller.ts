import { Controller, Get, Session } from "@nestjs/common";
import { CalendarService } from "../../services/calendar.service";

@Controller("api/calendar")
export class CalendarAPIController {
  constructor(private readonly calendarService: CalendarService) {
  }

  @Get("/getCalendar")
  public async getCalendar(@Session() session: Record<string, any>) {
    return this.calendarService.getCalendar(session.cookieStr);
  }

  @Get("/getReportCalendar")
  public async getReportCalendar(@Session() session: Record<string, any>) {
    return this.calendarService.getReportCalendar(session.cookieStr);
  }
}
