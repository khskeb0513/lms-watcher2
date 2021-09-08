import { Controller, Get, Query, Session } from "@nestjs/common";
import { ScheduleService } from "../../services/schedule.service";
import { UserService } from "../../services/user.service";

@Controller("api/schedule")
export class ScheduleAPIController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly userService: UserService
  ) {
  }

  @Get("/getByCourseId")
  public getByCourseId(
    @Query("id") id: string,
    @Session() session: Record<string, any>
  ) {
    return this.scheduleService.getByEClassId(
      id,
      session.cookieStr
    );
  }

  @Get("/getByCourseIdExceptComplete")
  public getByCourseIdExceptComplete(
    @Query("id") id: string,
    @Session() session: Record<string, any>
  ) {
    return this.scheduleService.getByEClassIdExceptComplete(
      id,
      session.cookieStr
    );
  }

  @Get("/getVideo")
  public async getVideo(
    @Query("kjKey") kjKey: string,
    @Query("seq") seq: number,
    @Query("item") itemId: string,
    @Session() session: Record<string, any>
  ) {
    const response = await this.scheduleService.getVideo(kjKey, seq, itemId, session.cookieStr);
    return {
      cid: response["cid"],
      contentId: response["content_id"]
    };
  }

  @Get("/issueHis")
  public async issueHis(
    @Query("item") item: number,
    @Query("seq") seq: number,
    @Query("kjKey") kjKey: string,
    @Session() session: Record<string, any>
  ) {
    return this.scheduleService.issueHisCode(item, seq, kjKey, session.username, session.cookieStr);
  }

  @Get("/requestHisStatus")
  public async requestHisStatus(
    @Query("item") item: string,
    @Query("seq") week: number,
    @Query("kjKey") kjKey: string,
    @Query("his") his: number,
    @Session() session: Record<string, any>
  ) {
    return this.scheduleService.requestHisStatus(week, item, his, kjKey, session.cookieStr);
  }

  @Get("/getHisCode")
  public async getHisCode(
    @Query("item") item: number,
    @Query("seq") seq: number,
    @Query("kjKey") kjKey: string,
    @Session() session: Record<string, any>
  ) {
    const ud = await this.userService.getUsername(session.cookieStr);
    return this.scheduleService.getHisCode(
      item,
      seq,
      kjKey,
      ud,
      session.cookieStr
    );
  }
}
