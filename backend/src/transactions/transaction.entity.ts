import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export type TransactionType = 'deposit' | 'withdrawal'
export type TransactionStatus = 'pending' | 'approved' | 'rejected'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userEmail: string

  @Column()
  type: TransactionType

  @Column('int')
  amount: number

  @Column({ default: 'pending' })
  status: TransactionStatus

  @CreateDateColumn()
  createdAt: Date
}
