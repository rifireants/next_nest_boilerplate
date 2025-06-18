import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user?.isAdmin) {
      throw new ForbiddenException('관리자만 접근 가능합니다')
    }
    return true
  }
}
