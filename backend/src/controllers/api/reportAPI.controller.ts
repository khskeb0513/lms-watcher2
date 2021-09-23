import { Controller, Get, Query, Session } from "@nestjs/common";
import { ReportService } from "../../services/report.service";

@Controller("api/report")
export class ReportAPIController {
  constructor(private readonly reportService: ReportService) {}

  @Get("/getByCourseId")
  public getByCourseId(
    @Query("id") kjKey: string,
    @Session() session: Record<string, any>
  ) {
    return this.reportService.getByCourseId(kjKey, session.cookieStr);
  }

  @Get("/getByCourseIdExceptComplete")
  public getByCourseIdExceptComplete(
    @Query("id") kjKey: string,
    @Session() session: Record<string, any>
  ) {
    return this.reportService.getByCourseIdExceptComplete(
      kjKey,
      session.cookieStr
    );
  }
}
