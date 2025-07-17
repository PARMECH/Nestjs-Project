import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
  ) {}

  create(document: Partial<Document>) {
    const doc = this.repo.create(document);
    return this.repo.save(doc);
  }

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Document>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
