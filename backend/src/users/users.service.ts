import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10)
    const user = this.userRepo.create({ email, password: hashed })
    await this.userRepo.save(user)
    return { id: user.id, email: user.email }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } })
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, email: user.email }
    }
    return null
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } })
    if (!user) return null
    return { id: user.id, email: user.email }
  }
}
