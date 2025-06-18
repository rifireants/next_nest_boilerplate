import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class PointLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column('int')
  before: number

  @Column('int')
  change: number

  @Column('int')
  after: number

  @Column()
  reason: string // 예: "입금 승인", "출금 승인", "베팅 결과: 승"

  @CreateDateColumn()
  createdAt: Date
}
