import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from '../crop/entities/crop.entity';
import { Farm } from '../farm/entities/farm.entity';
import { DashboardService } from './dashboard.service';

type MockRepository<T extends object = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('DashboardService (unit)', () => {
  let service: DashboardService;
  let farmRepository: MockRepository<Farm>;
  let cropRepository: MockRepository<Crop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Farm),
          useValue: {
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Crop),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    farmRepository = module.get<MockRepository<Farm>>(getRepositoryToken(Farm));
    cropRepository = module.get<MockRepository<Crop>>(getRepositoryToken(Crop));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSummary()', () => {
    it('deve retornar zeros quando não houver fazendas (repositório retorna 0 e raw undefined)', async () => {
      farmRepository.count!.mockResolvedValue(0);

      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      };
      farmRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getSummary();
      expect(result.totalFarms).toBe(0);
      expect(result.totalHectares).toBe(0);

      expect(farmRepository.count).toHaveBeenCalledTimes(1);
      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(fakeQB.select).toHaveBeenCalledWith('SUM(farm.total_area)', 'sum');
      expect(fakeQB.getRawOne).toHaveBeenCalledTimes(1);
    });

    it('deve retornar valores corretos quando existirem fazendas', async () => {
      farmRepository.count!.mockResolvedValue(3);

      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ sum: '150.75' }),
      };
      farmRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getSummary();
      expect(result.totalFarms).toBe(3);
      expect(result.totalHectares).toBe(150.75);

      expect(farmRepository.count).toHaveBeenCalled();
      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(fakeQB.select).toHaveBeenCalledWith('SUM(farm.total_area)', 'sum');
      expect(fakeQB.getRawOne).toHaveBeenCalled();
    });
  });

  describe('getByState()', () => {
    it('deve retornar lista vazia quando não houver fazendas', async () => {
      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      farmRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getByState();
      expect(result).toEqual([]);

      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(fakeQB.select).toHaveBeenCalledWith('farm.state', 'state');
      expect(fakeQB.addSelect).toHaveBeenCalledWith('COUNT(farm.id)', 'farmCount');
      expect(fakeQB.groupBy).toHaveBeenCalledWith('farm.state');
      expect(fakeQB.getRawMany).toHaveBeenCalled();
    });

    it('deve agrupar corretamente quando existirem fazendas em vários estados', async () => {
      const fakeRaw = [
        { state: 'PR', farmCount: '2' },
        { state: 'SP', farmCount: '5' },
      ];

      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(fakeRaw),
      };
      farmRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getByState();
      expect(result).toEqual([
        { state: 'PR', farmCount: 2 },
        { state: 'SP', farmCount: 5 },
      ]);

      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(fakeQB.select).toHaveBeenCalledWith('farm.state', 'state');
      expect(fakeQB.addSelect).toHaveBeenCalledWith('COUNT(farm.id)', 'farmCount');
      expect(fakeQB.groupBy).toHaveBeenCalledWith('farm.state');
      expect(fakeQB.getRawMany).toHaveBeenCalled();
    });
  });

  describe('getByCulture()', () => {
    it('deve retornar lista vazia quando não houver culturas', async () => {
      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      cropRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getByCulture();
      expect(result).toEqual([]);

      expect(cropRepository.createQueryBuilder).toHaveBeenCalledWith('crop');
      expect(fakeQB.select).toHaveBeenCalledWith('crop.culture_name', 'cultureName');
      expect(fakeQB.addSelect).toHaveBeenCalledWith('COUNT(crop.id)', 'count');
      expect(fakeQB.groupBy).toHaveBeenCalledWith('crop.culture_name');
      expect(fakeQB.getRawMany).toHaveBeenCalled();
    });

    it('deve agrupar corretamente quando existirem várias culturas', async () => {
      const fakeRaw = [
        { cultureName: 'Soja', count: '10' },
        { cultureName: 'Milho', count: '7' },
      ];

      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(fakeRaw),
      };
      cropRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getByCulture();
      expect(result).toEqual([
        { cultureName: 'Soja', count: 10 },
        { cultureName: 'Milho', count: 7 },
      ]);

      expect(cropRepository.createQueryBuilder).toHaveBeenCalledWith('crop');
      expect(fakeQB.select).toHaveBeenCalledWith('crop.culture_name', 'cultureName');
      expect(fakeQB.addSelect).toHaveBeenCalledWith('COUNT(crop.id)', 'count');
      expect(fakeQB.groupBy).toHaveBeenCalledWith('crop.culture_name');
      expect(fakeQB.getRawMany).toHaveBeenCalled();
    });
  });

  describe('getByLandUse()', () => {
    it('deve retornar zeros quando não houver fazendas', async () => {
      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      };
      farmRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getByLandUse();
      expect(result).toEqual({ agriculturalArea: 0, vegetationArea: 0 });

      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(fakeQB.select).toHaveBeenCalledWith('SUM(farm.agricultural_area)', 'agriculturalSum');
      expect(fakeQB.addSelect).toHaveBeenCalledWith('SUM(farm.vegetation_area)', 'vegetationSum');
      expect(fakeQB.getRawOne).toHaveBeenCalled();
    });

    it('deve somar corretamente áreas quando existirem fazendas', async () => {
      const fakeRaw = { agriculturalSum: '80.5', vegetationSum: '19.5' };

      const fakeQB = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(fakeRaw),
      };
      farmRepository.createQueryBuilder!.mockReturnValue(fakeQB as any);

      const result = await service.getByLandUse();
      expect(result).toEqual({ agriculturalArea: 80.5, vegetationArea: 19.5 });

      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(fakeQB.select).toHaveBeenCalledWith('SUM(farm.agricultural_area)', 'agriculturalSum');
      expect(fakeQB.addSelect).toHaveBeenCalledWith('SUM(farm.vegetation_area)', 'vegetationSum');
      expect(fakeQB.getRawOne).toHaveBeenCalled();
    });
  });
});
