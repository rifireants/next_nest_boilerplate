import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

interface User {
  id: number
  email: string
  password: string // hashed password
}

@Injectable()
export class UsersService {
  private users: User[] = []

  async createUser(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10)
    const user: User = {
      id: this.users.length + 1,
      email,
      password: hashed,
    }
    this.users.push(user)
    return { id: user.id, email: user.email }
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find((u) => u.email === email)
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, email: user.email }
    }
    return null
  }
}
