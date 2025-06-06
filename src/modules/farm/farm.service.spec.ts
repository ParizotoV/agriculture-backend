import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';
import { FarmService } from './farm.service';

type MockRepository<T extends object = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('FarmService', () => {
  let service: FarmService;
  let repo: MockRepository<Farm>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
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

    service = module.get<FarmService>(FarmService);
    repo = module.get<MockRepository<Farm>>(getRepositoryToken(Farm));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('deve criar e retornar uma fazenda', async () => {
      const dto: CreateFarmDto = {
        name: 'Fazenda Teste',
        city: 'Colombo',
        state: 'PR',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 30,
        producerId: 'prod-1',
      };
      const createdEntity = {
        id: 'farm-1',
        ...dto,
        producerId: 'prod-1',
        producer: {
          id: 'prod-1',
          name: 'Produtor X',
          cpfCnpj: '12345678909',
          farms: [],
        },
        crops: [],
      } as Farm;

      repo.create!.mockReturnValue(createdEntity);
      repo.save!.mockResolvedValue(createdEntity);

      // Chamamos service.create() passando todos os campos esperados,
      // incluindo producerId (mesmo que o método original receba apenas DTO,
      // mas no teste adicionamos producerId manualmente).
      const result = await service.create({
        ...dto,
        producerId: 'prod-1',
      } as any);

      expect(repo.create).toHaveBeenCalledWith({
        ...dto,
        producerId: 'prod-1',
      });
      expect(repo.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(createdEntity);
    });
  });

  describe('findAll()', () => {
    it('deve retornar todas as fazendas', async () => {
      const list: Farm[] = [
        {
          id: 'f1',
          name: 'Fazenda A',
          city: 'A',
          state: 'PR',
          totalArea: 50,
          agriculturalArea: 30,
          vegetationArea: 10,
          producerId: 'p1',
          producer: {
            id: 'p1',
            name: 'Produtor A',
            cpfCnpj: '11111111111',
            farms: [],
          },
          crops: [],
        },
      ];
      repo.find!.mockResolvedValue(list);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({ relations: ['producer', 'crops'] });
      expect(result).toEqual(list);
    });
  });

  describe('findOne()', () => {
    it('deve retornar fazenda existente', async () => {
      const existing: Farm = {
        id: 'f1',
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
          cpfCnpj: '22222222222',
          farms: [],
        },
        crops: [],
      };
      repo.findOne!.mockResolvedValue(existing);

      const result = await service.findOne('f1');
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'f1' } });
      expect(result).toEqual(existing);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findOne!.mockResolvedValue(undefined);

      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'nope' } });
    });
  });

  describe('update()', () => {
    it('deve lançar NotFoundException se não existir', async () => {
      repo.findOne!.mockResolvedValue(undefined);
      await expect(service.update('nope', { name: 'X' } as any)).rejects.toThrow(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'nope' } });
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve atualizar fazenda existente', async () => {
      const existing: Farm = {
        id: 'f2',
        name: 'Old Farm',
        city: 'C1',
        state: 'S1',
        totalArea: 100,
        agriculturalArea: 40,
        vegetationArea: 30,
        producerId: 'p1',
        producer: {
          id: 'p1',
          name: 'Produtor B',
          cpfCnpj: '33333333333',
          farms: [],
        },
        crops: [],
      };
      const dto: UpdateFarmDto = {
        name: 'New Farm',
        agriculturalArea: 20,
        vegetationArea: 10,
      };
      const merged: Farm = { ...existing, ...dto };

      repo.findOne!.mockResolvedValue(existing);
      repo.save!.mockResolvedValue(merged);

      const result = await service.update('f2', dto as any);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'f2' } });
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual(merged);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findOne!.mockResolvedValue(undefined);
      await expect(service.update('nope', { name: 'X' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'nope' } });
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('deve deletar fazenda existente', async () => {
      repo.delete!.mockResolvedValue({ affected: 1 } as any);
      await expect(service.remove('f3')).resolves.toEqual({
        message: 'Farm deleted successfully',
      });
      expect(repo.delete).toHaveBeenCalledWith('f3');
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.delete!.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove('nope')).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.delete).toHaveBeenCalledWith('nope');
    });
  });
});
