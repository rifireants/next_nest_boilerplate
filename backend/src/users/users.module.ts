import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { PointsModule } from '../points/points.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PointsModule
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
