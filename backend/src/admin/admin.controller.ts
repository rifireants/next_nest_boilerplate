import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '../auth/admin.guard'
import { UsersService } from '../users/users.service'
import { TransactionsService } from '../transactions/transactions.service'

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(
    private usersService: UsersService,
    private transactionsService: TransactionsService,
  ) { }

  @Get('dashboard')
  getAdminDashboard() {
    return { message: '관리자 대시보드입니다.' }
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers()
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      isAdmin: u.isAdmin,
    }))
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(parseInt(id))
    return { message: '삭제 완료' }
  }

  @Patch('users/:id/admin')
  async toggleAdmin(@Param('id') id: string, @Body() body: { isAdmin: boolean }) {
    await this.usersService.setAdmin(parseInt(id), body.isAdmin)
    return { message: '권한 변경 완료' }
  }

  @Get('transactions')
  async getTransactions() {
    return this.transactionsService.findAll()
  }

  @Patch('transactions/:id/status')
  async approveOrReject(
    @Param('id') id: string,
    @Body() body: { status: 'approved' | 'rejected' },
  ) {
    await this.transactionsService.updateStatus(parseInt(id), body.status)
    return { message: '처리 완료' }
  }
}
