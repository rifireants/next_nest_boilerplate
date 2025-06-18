import { Controller, Get, Body, Post, UseGuards, Request } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private txService: TransactionsService) {}

  @Post('request')
  async createRequest(@Body() body: { email: string; type: 'deposit' | 'withdrawal'; amount: number }) {
    return this.txService.createRequest(body.email, body.type, body.amount)
  }

  @Get('my')
  async getMyTransactions(@Request() req: any) {
    return this.txService.findByEmail(req.user.email)
  }
}
