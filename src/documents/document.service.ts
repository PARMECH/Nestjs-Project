import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
  ) {}

  async create(document: Partial<Document>) {
    const doc = this.repo.create(document);
    return await this.repo.save(doc);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findById(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Document>) {
    const result = await this.repo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return result;
  }
}
