import {Controller, Get, Query, Session} from "@nestjs/common";
import {BoardService} from "../../services/board.service";

@Controller("api/board")
export class BoardAPIController {
    constructor(
        private readonly boardService: BoardService
    ) {
    }

    @Get('/getMaterialBody')
    public async getMaterialBody(
        @Query('id') id: string,
        @Query('url') url: string,
        @Query('attachmentId') attachmentId: string,
        @Session() session: Record<string, any>
    ) {
      return this.boardService.getMaterialBody(id, url, attachmentId, session.cookieStr)
    }

    @Get('/getMaterialListByEClassId')
    public async getMaterialListByEClassId(
        @Query("id") id: string,
        @Session() session: Record<string, any>
    ) {
        return this.boardService.getMaterialListByEClassId(id, session.cookieStr);
    }
}
