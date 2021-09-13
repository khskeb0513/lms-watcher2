import {Body, Controller, Get, Post, Session} from "@nestjs/common";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";
import IsUserResponseDto from "../../domain/dto/isUserResponseDto";

@Controller("api/user")
export class UserAPIController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly userService: UserService
    ) {
    }

    @Get('/getSessionFromEnv')
    public async getSessionFromEnv(@Session() session: Record<string, any>) {
        const cookie = this.sessionService.getSessionFromEnv()
        if (await this.sessionService.isSessionValid(cookie)) {
            session.cookieStr = cookie
            return {cookie, status: true}
        } else {
            return {cookie, status: false}
        }
    }

    @Get("/logout")
    public async logout(
        @Session() session: Record<string, any>
    ) {
        session.username = null;
        session.password = null;
        session.cookieStr = null;
        return true;
    }

    @Get("/getMaterialList")
    public async getMaterialList(@Session() session: Record<string, any>) {
        return this.userService.getMaterialList(session.cookieStr);
    }

    @Get("/getUsername")
    public async getUsername(
        @Session() session: Record<string, any>
    ) {
        return this.userService.getUsername(session.cookieStr);
    }

    @Post("/isUser")
    public async isUser(
        @Body("username") username: string,
        @Body("password") password: string,
        @Session() session: Record<string, any>
    ): Promise<IsUserResponseDto> {
        const response = await this.sessionService.isUser(username, password);
        if (response.isUser) {
            session.username = username;
            session.password = password;
            session.cookieStr = response.cookie;
        }
        return new IsUserResponseDto(response.isUser);
    }

    @Get("/isSessionValid")
    public async isSessionValid(
        @Session() session: Record<string, any>
    ) {
        const isSessionAvailable = await this.sessionService.isSessionValid(session.cookieStr);
        return {isSessionAvailable};
    }

    @Get("/getSessionValue")
    public async getSessionValue(
        @Session() session: Record<string, any>
    ) {
        const cookie = session.cookieStr;
        const status = await this.sessionService.isSessionValid(cookie);
        return {cookie, status};
    }

    @Get("/renewSession")
    public async renewSession(
        @Session() session: Record<string, any>
    ) {
        const newCookie = await this.sessionService.isUser(
            session.username, session.password
        );
        if (newCookie.isUser) {
            session.cookieStr = newCookie.cookie;
            return {
                set: true
            };
        } else {
            return {
                set: false
            };
        }
    }

    @Post("/setSessionValue")
    public async setSessionValue(
        @Body("cookieStr") cookieStr: string,
        @Session() session: Record<string, any>
    ) {
        if (await this.sessionService.isSessionValid(cookieStr)) {
            session.cookieStr = cookieStr;
            session.username = await this.userService.getUsername(cookieStr);
            return {
                cookie: cookieStr,
                set: true
            };
        } else {
            return {
                set: false
            };
        }
    }

    @Get("/getSchoolCalendar")
    public async getSchoolCalendar(
        @Session() session: Record<string, any>
    ) {
        return {
            schoolCalendar: await this.userService.getCalendar(session.cookieStr)
        };
    }

    @Get("/getSchedule")
    public async getSchedule(@Session() session: Record<string, any>) {
        return {
            courses: await this.userService.getSchedule(session.cookieStr)
        };
    }
}
