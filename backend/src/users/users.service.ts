import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'
import { PointsService } from 'src/points/points.service'
import { PointsGateway } from 'src/points/points.gateway'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly pointsService: PointsService,
    private readonly pointsGateway: PointsGateway,
  ) { }

  async createUser(email: string, password: string, isAdmin: boolean = false) {
    const hashed = await bcrypt.hash(password, 10)
    const user = this.userRepo.create({ email, password: hashed, isAdmin })
    await this.userRepo.save(user)
    return { id: user.id, email: user.email, isAdmin: user.isAdmin }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } })
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, email: user.email, isAdmin: user.isAdmin }
    }
    return null
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } })
    if (!user) return null
    return { id: user.id, email: user.email, isAdmin: user.isAdmin }
  }

  async getAllUsers() {
    return this.userRepo.find()
  }

  async deleteUser(id: number) {
    await this.userRepo.delete({ id })
  }

  async setAdmin(id: number, isAdmin: boolean) {
    await this.userRepo.update({ id }, { isAdmin })
  }

  async updatePoints(email: string, delta: number, reason: string) {
    const user = await this.userRepo.findOne({ where: { email } })
    if (!user) throw new Error("유저를 찾을 수 없습니다")

    const before = user.points
    user.points += delta
    await this.pointsService.log(email, before, delta, reason)
    await this.userRepo.save(user)

    // ✅ 웹소켓 푸시
    this.pointsGateway.notifyPointUpdate(email, user.points)

    return user
  }

  async getPoints(email: string) {
    const user = await this.userRepo.findOne({ where: { email } })
    return user?.points ?? 0
  }
}
