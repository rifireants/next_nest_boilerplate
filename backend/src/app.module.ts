import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { User } from './users/user.entity'
import { AdminController } from './admin/admin.controller';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsController } from './transactions/transactions.controller'
import { Transaction } from './transactions/transaction.entity'
import { PointsModule } from './points/points.module';
import { PointLog } from './points/pointlog.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest_auth_db',
      entities: [
        User,
        Transaction,
        PointLog
      ],
      synchronize: true, // 개발 시 true (운영에서는 false)
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    PointsModule,
  ],
  controllers: [AdminController, TransactionsController],
})
export class AppModule { }
