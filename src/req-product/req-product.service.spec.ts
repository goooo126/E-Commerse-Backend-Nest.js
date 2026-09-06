import { Test, TestingModule } from '@nestjs/testing';
import { ReqProductService } from './req-product.service';

describe('ReqProductService', () => {
  let service: ReqProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqProductService],
    }).compile();

    service = module.get<ReqProductService>(ReqProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
