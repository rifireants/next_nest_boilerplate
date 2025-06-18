import { Test, TestingModule } from '@nestjs/testing';
import { PointsGateway } from './points.gateway';

describe('PointsGateway', () => {
  let gateway: PointsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointsGateway],
    }).compile();

    gateway = module.get<PointsGateway>(PointsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
