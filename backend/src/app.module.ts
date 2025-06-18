import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { User } from './users/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest_auth_db',
      entities: [User],
      synchronize: true, // 개발 시 true (운영에서는 false)
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
