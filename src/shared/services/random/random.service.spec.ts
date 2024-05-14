import { Test, TestingModule } from '@nestjs/testing';
import { RandomService } from './random.service';

describe('RandomService', () => {
  let service: RandomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomService],
    }).compile();

    service = module.get<RandomService>(RandomService);
  });

  describe('generateDigitString', () => {
    it('String of specified length', async () => {
      const length1 = 8;
      const length2 = 3;
      const result1 = await service.generateDigitString(length1);
      const result2 = await service.generateDigitString(length2);
      expect(result1.length).toBe(length1);
      expect(result2.length).toBe(length2);
    });

    it('Different results', async () => {
      const length = 6;
      const result1 = await service.generateDigitString(length);
      const result2 = await service.generateDigitString(length);
      expect(result1).not.toBe(result2);
    });

    it('Only digits', async () => {
      const length = 20;
      const result = await service.generateDigitString(length);
      const regex = /^[0-9]+$/;
      expect(regex.test(result)).toBe(true);
    });
  });
});
