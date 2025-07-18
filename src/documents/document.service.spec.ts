import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Document, DocumentStatus } from './entities/document.entity';
import { DocumentService } from './document.service';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('DocumentService', () => {
  let service: DocumentService;
  let repo: MockRepository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: createMockRepository<Document>(),
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    repo = module.get<MockRepository<Document>>(getRepositoryToken(Document));
  });

  describe('create', () => {
    it('should create and save a document', async () => {
      const input: Partial<Document> = {
        filename: 'test.pdf',
        uploaderId: 1,
        status: DocumentStatus.Pending,
      };
      const createdDoc = { id: 1, ...input };

      repo.create!.mockReturnValue(createdDoc);
      repo.save!.mockResolvedValue(createdDoc);

      const result = await service.create(input);

      expect(repo.create).toHaveBeenCalledWith(input);
      expect(repo.save).toHaveBeenCalledWith(createdDoc);
      expect(result).toEqual(createdDoc);
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
      const docs = [
        { id: 1, filename: 'doc1.pdf', status: DocumentStatus.Pending },
        { id: 2, filename: 'doc2.pdf', status: DocumentStatus.Complete },
      ];
      repo.find!.mockResolvedValue(docs);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(docs);
    });
  });

  describe('findById', () => {
    it('should return a document by id', async () => {
      const doc = { id: 1, filename: 'doc.pdf', status: DocumentStatus.Pending };
      repo.findOne!.mockResolvedValue(doc);

      const result = await service.findById(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(doc);
    });
  });

  describe('update', () => {
    it('should update and return the updated document', async () => {
      const id = 1;
      const data: Partial<Document> = { status: DocumentStatus.Complete };
      const updatedDoc = { id, filename: 'doc.pdf', status: DocumentStatus.Complete };

      repo.update!.mockResolvedValue({ affected: 1 });
      repo.findOne!.mockResolvedValue(updatedDoc);

      const result = await service.update(id, data);

      expect(repo.update).toHaveBeenCalledWith(id, data);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(updatedDoc);
    });

    it('should throw if no document updated', async () => {
      repo.update!.mockResolvedValue({ affected: 0 });

      await expect(service.update(1, { status: DocumentStatus.Failed })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a document', async () => {
      repo.delete!.mockResolvedValue({ affected: 1 });

      const result = await service.delete(1);

      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw if no document deleted', async () => {
      repo.delete!.mockResolvedValue({ affected: 0 });

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
