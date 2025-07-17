import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findByEmail(email: string): Promise<User> {
    return this.repo.findOne({ where: { email } }).then(user => {
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return user;
    });
  }

  findById(id: number): Promise<User> {
    return this.repo.findOne({ where: { id } }).then(user => {
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    });
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  createUser(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password, role: 'viewer' });
    return this.repo.save(user);
  }

  async updateUserRole(id: number, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    return this.repo.save(user);
  }
}
