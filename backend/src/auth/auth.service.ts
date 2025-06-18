import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(email: string, password: string) {
    return this.usersService.createUser(email, password)
  }

  async login(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password)
    if (!user) throw new UnauthorizedException('잘못된 로그인 정보입니다')
    return user
  }
}
