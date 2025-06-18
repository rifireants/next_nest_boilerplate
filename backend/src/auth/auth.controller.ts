import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { UsersService } from 'src/users/users.service';
import { PointsService } from 'src/points/points.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private pointsService: PointsService,
  ) { }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password)
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('points')
  async getPoints(@Req() req: any) {
    const points = await this.usersService.getPoints(req.user.email)
    return { points }
  }

  @Get('pointlogs')
  @UseGuards(AuthGuard('jwt'))
  async getPointLogs(@Req() req: any) {
    return this.pointsService.findByEmail(req.user.email)
  }
}
