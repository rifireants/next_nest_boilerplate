import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './transaction.entity'
import { UsersService } from '../users/users.service'
import { TransactionsGateway } from './transactions.gateway'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private txRepo: Repository<Transaction>,
    private readonly usersService: UsersService,
    private readonly transactionGateway: TransactionsGateway,
  ) { }

  // 유저 요청: 입출금 요청 생성 (pending 상태)
  async createRequest(email: string, type: 'deposit' | 'withdrawal', amount: number) {
    const tx = this.txRepo.create({
      userEmail: email,
      type,
      amount,
      status: 'pending',
    })
    const result = await this.txRepo.save(tx)
    this.transactionGateway.broadcastUpdate()
    this.transactionGateway.notifyUser(email)
    return result
  }

  // 관리자 처리: 상태 승인 또는 거절
  async updateStatus(id: number, status: 'approved' | 'rejected') {
    const tx = await this.txRepo.findOne({ where: { id } })
    if (!tx) throw new Error('거래를 찾을 수 없습니다')

    if (status === 'approved') {
      const delta = tx.type === 'deposit' ? tx.amount : -tx.amount
      await this.usersService.updatePoints(tx.userEmail, delta, `${tx.type === 'deposit' ? '입금' : '출금'} 승인`)
    }

    tx.status = status
    const result = await this.txRepo.save(tx)
    this.transactionGateway.broadcastUpdate()
    this.transactionGateway.notifyUser(tx.userEmail)
    return result
  }

  // 관리자: 전체 입출금 내역
  async findAll() {
    return this.txRepo.find({ order: { createdAt: 'DESC' } })
  }

  // 유저: 내 입출금 요청 내역
  async findByEmail(email: string) {
    return this.txRepo.find({
      where: { userEmail: email },
      order: { createdAt: 'DESC' },
    })
  }
}
