import { Test, TestingModule } from '@nestjs/testing';
import { ReqProductController } from './req-product.controller';
import { ReqProductService } from './req-product.service';

describe('ReqProductController', () => {
  let controller: ReqProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReqProductController],
      providers: [ReqProductService],
    }).compile();

    controller = module.get<ReqProductController>(ReqProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
