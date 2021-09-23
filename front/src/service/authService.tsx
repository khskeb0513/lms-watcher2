import IsUserDto from "../domain/auth/isUserDto";
import RenewSessionDto from "../domain/auth/renewSessionDto";
import GetSessionValueDto from "../domain/auth/getSessionValueDto";
import SetSessionValueDto from "../domain/auth/setSessionValueDto";

class AuthService {
    async getSessionFromEnv():Promise<boolean> {
        const response = await fetch('/api/user/getSessionFromEnv')
        const body = await response.json()
        return body.status
    }

    async getUsername(): Promise<string> {
        const response = await fetch('/api/user/getUsername')
        return response.text(

        )
    }

    async isUser(username: string, password: string): Promise<IsUserDto> {
        if (!username || !password) {
            return new IsUserDto(false)
        } else {
            const response = await fetch('/api/user/isUser', {
                method: 'post',
                headers: {"content-type": "application/json"},
                body: JSON.stringify({username, password})
            })
            const body = await response.json()
            return new IsUserDto(body.isUser)
        }
    }

    async getSessionValue(): Promise<GetSessionValueDto> {
        const response = await fetch('/api/user/getSessionValue')
        const body = await response.json()
        return new GetSessionValueDto(body.status, body.cookie)
    }

    async renewSession(): Promise<RenewSessionDto> {
        const response = await fetch('/api/user/renewSession')
        const body = await response.json()
        return new RenewSessionDto(body.set)
    }

    async setSessionValue(cookieStr: string): Promise<SetSessionValueDto> {
        const response = await fetch('/api/user/setSessionValue', {
            method: 'post',
            headers: {"content-type": "application/json"},
            body: JSON.stringify({cookieStr})
        })
        const body = await response.json()
        return new SetSessionValueDto(body.cookie, body.set)
    }

    async logout(): Promise<boolean> {
        const response = await fetch('/api/user/logout')
        return await response.json()
    }
}

export default AuthService
