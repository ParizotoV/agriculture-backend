import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';
import { ProducerService } from './producer.service';

type MockRepository<T extends object = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProducerService', () => {
  let service: ProducerService;
  let repo: MockRepository<Producer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
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

    service = module.get<ProducerService>(ProducerService);
    repo = module.get<MockRepository<Producer>>(getRepositoryToken(Producer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('deve criar e retornar um produtor', async () => {
      const dto: CreateProducerDto = {
        name: 'João Silva',
        cpfCnpj: '12345678909',
      };
      const createdEntity = { id: 'uuid-1', ...dto, farms: [] };
      repo.create!.mockReturnValue(createdEntity as Producer);
      repo.save!.mockResolvedValue(createdEntity as Producer);

      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(createdEntity);
    });
  });

  describe('findAll()', () => {
    it('deve retornar todos os produtores', async () => {
      const list: Producer[] = [
        { id: '1', name: 'A', cpfCnpj: '11111111111', farms: [] },
        { id: '2', name: 'B', cpfCnpj: '22222222222', farms: [] },
      ];
      repo.find!.mockResolvedValue(list);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['farms', 'farms.crops'],
      });
      expect(result).toEqual(list);
    });
  });

  describe('findOne()', () => {
    it('deve retornar produtor existente', async () => {
      const existing: Producer = {
        id: '123',
        name: 'Carlos',
        cpfCnpj: '12345678909',
        farms: [],
      };
      repo.findOne!.mockResolvedValue(existing);

      const result = await service.findOne('123');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['farms', 'farms.crops'],
      });
      expect(result).toEqual(existing);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findOne!.mockResolvedValue(undefined);
      await expect(service.findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'nope' },
        relations: ['farms', 'farms.crops'],
      });
    });
  });

  describe('update()', () => {
    it('deve atualizar produtor existente', async () => {
      const existing: Producer = {
        id: 'abc',
        name: 'Old Name',
        cpfCnpj: '12345678909',
        farms: [],
      };
      const dto: UpdateProducerDto = { name: 'New Name' };
      const updated: Producer = { ...existing, ...dto };
      repo.findOne!.mockResolvedValue(existing);
      repo.save!.mockResolvedValue(updated);

      const result = await service.update('abc', dto);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'abc' },
        relations: ['farms', 'farms.crops'],
      });
      expect(repo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.findOne!.mockResolvedValue(undefined);
      await expect(service.update('nonexistent', { name: 'X' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
        relations: ['farms', 'farms.crops'],
      });
    });
  });

  describe('remove()', () => {
    it('deve deletar produtor existente', async () => {
      repo.delete!.mockResolvedValue({ affected: 1 } as any);
      await expect(service.remove('id-1')).resolves.toEqual({
        message: 'Producer deleted successfully',
      });
      expect(repo.delete).toHaveBeenCalledWith('id-1');
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repo.delete!.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove('id-x')).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.delete).toHaveBeenCalledWith('id-x');
    });
  });
});
