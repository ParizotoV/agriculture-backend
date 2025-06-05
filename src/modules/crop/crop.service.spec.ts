import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

type MockRepository<T extends object = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CropService', () => {
  let service: CropService;
  let repo: MockRepository<Crop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: getRepositoryToken(Crop),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
    repo = module.get<MockRepository<Crop>>(getRepositoryToken(Crop));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('deve criar e retornar uma cultura', async () => {
      const dto: CreateCropDto = {
        season: 'Safra 2023',
        cultureName: 'Soja',
        farmId: 'farm-1',
      };
      const createdEntity = {
        id: 'crop-1',
        ...dto,
        farmId: 'farm-1',
        farm: {
          id: 'farm-1',
          name: 'Fazenda X',
          city: 'Cidade',
          state: 'PR',
          totalArea: 100,
          agriculturalArea: 60,
          vegetationArea: 30,
          producerId: 'prod-1',
          producer: {
            id: 'prod-1',
            name: 'Produtor X',
            cpfCnpj: '12345678909',
            farms: [],
          },
          crops: [],
        },
      } as Crop;
      repo.create!.mockReturnValue(createdEntity);
      repo.save!.mockResolvedValue(createdEntity);

      const result = await service.create({ ...dto, farmId: 'farm-1' } as any);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, farmId: 'farm-1' });
      expect(repo.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(createdEntity);
    });
  });

  describe('findAll()', () => {
    it('deve retornar todas as culturas', async () => {
      const list: Crop[] = [
        {
          id: '1',
          season: 'Safra 2022',
          cultureName: 'Milho',
          farmId: 'farm-1',
          farm: {
            id: 'farm-1',
            name: 'Fazenda A',
            city: 'A',
            state: 'PR',
            totalArea: 80,
            agriculturalArea: 50,
            vegetationArea: 20,
            producerId: 'p1',
            producer: {
              id: 'p1',
              name: 'Produtor A',
              cpfCnpj: '11111111111',
              farms: [],
            },
            crops: [],
          },
        },
        {
          id: '2',
          season: 'Safra 2023',
          cultureName: 'Café',
          farmId: 'farm-2',
          farm: {
            id: 'farm-2',
            name: 'Fazenda B',
            city: 'B',
            state: 'SP',
            totalArea: 90,
            agriculturalArea: 40,
            vegetationArea: 30,
            producerId: 'p2',
            producer: {
              id: 'p2',
              name: 'Produtor B',
              cpfCnpj: '22222222222',
              farms: [],
            },
            crops: [],
          },
        },
      ];
      repo.find!.mockResolvedValue(list);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith();
      expect(result).toEqual(list);
    });
  });

  describe('findOne()', () => {
    it('deve retornar cultura existente', async () => {
      const existing: Crop = {
        id: 'c1',
        season: 'Safra 2022',
        cultureName: 'Soja',
        farmId: 'farm-1',
        farm: {
          id: 'farm-1',
          name: 'Fazenda X',
          city: 'X',
          state: 'Y',
          totalArea: 80,
          agriculturalArea: 50,
          vegetationArea: 20,
          producerId: 'p1',
          producer: {
            id: 'p1',
            name: 'Produtor X',
            cpfCnpj: '33333333333',
            farms: [],
          },
          crops: [],
        },
      };
      repo.findOne!.mockResolvedValue(existing);

      const result = await service.findOne('c1');
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'c1' } });
      expect(result).toEqual(existing);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findOne!.mockResolvedValue(undefined);

      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'nope' } });
    });
  });

  describe('update()', () => {
    it('deve atualizar cultura existente', async () => {
      const existing: Crop = {
        id: 'c2',
        season: 'Safra 2022',
        cultureName: 'Milho',
        farmId: 'farm-2',
        farm: {
          id: 'farm-2',
          name: 'Fazenda Y',
          city: 'Y',
          state: 'SP',
          totalArea: 90,
          agriculturalArea: 40,
          vegetationArea: 30,
          producerId: 'p2',
          producer: {
            id: 'p2',
            name: 'Produtor Y',
            cpfCnpj: '44444444444',
            farms: [],
          },
          crops: [],
        },
      };
      const dto: UpdateCropDto = { cultureName: 'Soja' };
      const merged: Crop = { ...existing, ...dto };
      repo.findOne!.mockResolvedValue(existing);
      repo.save!.mockResolvedValue(merged);

      const result = await service.update('c2', dto as any);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'c2' } });
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual(merged);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findOne!.mockResolvedValue(undefined);
      await expect(service.update('nope', { season: 'X' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'nope' } });
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('deve deletar cultura existente', async () => {
      const deleteResult = { affected: 1 } as DeleteResult;
      repo.delete!.mockResolvedValue(deleteResult);

      const result = await service.remove('c3');
      expect(repo.delete).toHaveBeenCalledWith('c3');
      expect(result).toEqual(deleteResult);
    });

    it('deve retornar resultado mesmo que cultura não exista', async () => {
      const deleteResult = { affected: 0 } as DeleteResult;
      repo.delete!.mockResolvedValue(deleteResult);

      const result = await service.remove('nope');
      expect(repo.delete).toHaveBeenCalledWith('nope');
      expect(result).toEqual(deleteResult);
    });
  });
});
