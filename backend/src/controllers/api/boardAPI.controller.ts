import { Controller, Get, Query, Session } from "@nestjs/common";
import { BoardService } from "../../services/board.service";

@Controller("api/board")
export class BoardAPIController {
  constructor(
    private readonly boardService: BoardService
  ) {
  }

  @Get('/getMaterialListByEClassId')
  public async getMaterialListByEClassId(
    @Query("id") id: string,
    @Session() session: Record<string, any>
  ) {
    return this.boardService.getMaterialListByEClassId(id, session.cookieStr);
  }
}
