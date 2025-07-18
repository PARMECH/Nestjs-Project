import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'viewer',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      repo.findOne.mockResolvedValue(mockUser);

      const user = await service.findByEmail('test@example.com');
      expect(user).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should throw if user not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('missing@example.com')).rejects.toThrow(
        'User with email missing@example.com not found',
      );
    });
  });

  describe('findById', () => {
    it('should return user by ID', async () => {
      repo.findOne.mockResolvedValue(mockUser);

      const user = await service.findById(1);
      expect(user).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw if user not found by ID', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toThrow('User with ID 99 not found');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repo.find.mockResolvedValue([mockUser]);

      const users = await service.findAll();
      expect(users).toEqual([mockUser]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);

      const user = await service.createUser('test@example.com', 'password123');
      expect(repo.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        role: 'viewer',
      });
      expect(repo.save).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('updateUserRole', () => {
    it('should update the user role', async () => {
      repo.findOne.mockResolvedValue({ ...mockUser });
      repo.save.mockImplementation(async (user: User) => user);

      const updatedUser = await service.updateUserRole(1, 'admin');
      expect(updatedUser.role).toBe('admin');
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ role: 'admin' }));
    });
  });
});
