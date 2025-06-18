import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PointLog } from './pointlog.entity'

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointLog)
    private pointLogRepo: Repository<PointLog>,
  ) {}

  async log(email: string, before: number, change: number, reason: string) {
    const after = before + change
    const log = this.pointLogRepo.create({ email, before, change, after, reason })
    return this.pointLogRepo.save(log)
  }

  async findByEmail(email: string) {
    return this.pointLogRepo.find({
      where: { email },
      order: { createdAt: 'DESC' },
    })
  }
}
