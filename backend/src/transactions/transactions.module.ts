import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from './transaction.entity'
import { TransactionsController } from './transactions.controller';
import { UsersModule } from '../users/users.module'
import { TransactionsGateway } from './transactions.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UsersModule
  ],
  providers: [TransactionsService, TransactionsGateway],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule { }
