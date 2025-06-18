import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from './transaction.entity'
import { TransactionsController } from './transactions.controller';
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UsersModule
  ],
  providers: [TransactionsService],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule { }
