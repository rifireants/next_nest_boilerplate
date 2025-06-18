import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './transaction.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private txRepo: Repository<Transaction>,
    private readonly usersService: UsersService,
  ) { }

  findAll() {
    return this.txRepo.find({ order: { createdAt: 'DESC' } })
  }

  async createRequest(userEmail: string, type: 'deposit' | 'withdrawal', amount: number) {
    const tx = this.txRepo.create({ userEmail, type, amount, status: 'pending' })
    return this.txRepo.save(tx)
  }

  async updateStatus(id: number, status: 'approved' | 'rejected') {
    const tx = await this.txRepo.findOne({ where: { id } })
    if (!tx) throw new Error("거래를 찾을 수 없습니다")

    // ✅ 포인트 변경 로직
    if (status === 'approved') {
      const delta = tx.type === 'deposit' ? tx.amount : -tx.amount
      await this.usersService.updatePoints(tx.userEmail, delta)
    }

    tx.status = status
    return this.txRepo.save(tx)
  }

  async findByEmail(email: string) {
    return this.txRepo.find({
      where: { userEmail: email },
      order: { createdAt: 'DESC' },
    })
  }
}
