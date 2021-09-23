import { Controller, Get, Query, Session } from "@nestjs/common";
import { EClassService } from "../../services/eClass.service";

@Controller("api/eClass")
export class EClassAPIController {
  constructor(private readonly eClassService: EClassService) {}

  @Get("/getList")
  public getList(
    @Session() session: Record<string, any>,
    @Query("year") year: number,
    @Query("term") term: number
  ) {
    if (!year && !term) {
      return this.eClassService.getList(session.cookieStr);
    } else {
      return this.eClassService.getList(session.cookieStr, year, term);
    }
  }
}
