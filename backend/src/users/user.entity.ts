import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: 0 })
  points: number

  @Column({ default: false }) // ✅ 관리자 여부 필드
  isAdmin: boolean
}
