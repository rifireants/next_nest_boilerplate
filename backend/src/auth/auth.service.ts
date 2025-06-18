import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(email: string, password: string, isAdmin = false) {
  return this.usersService.createUser(email, password, isAdmin)
}

  async login(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password)
    if (!user) throw new UnauthorizedException('잘못된 로그인 정보입니다')

    const payload = { sub: user.id, email: user.email }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      email: user.email,
      isAdmin: user.isAdmin,
    }
  }
}
