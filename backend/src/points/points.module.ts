import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointLog } from './pointlog.entity'
import { PointsService } from './points.service'
import { PointsGateway } from './points.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([PointLog])],
  providers: [PointsService, PointsGateway],
  exports: [PointsService, PointsGateway],
})
export class PointsModule {}
