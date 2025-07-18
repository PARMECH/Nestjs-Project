import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'viewer',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if email and password match', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userService.findByEmail.mockRejectedValue(new Error('User with email not found'));


      const result = await service.validateUser('notfound@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(mockUser.email, 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', () => {
      jwtService.sign.mockReturnValue('jwt-token');

      const result = service.login(mockUser);
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });
  });

  describe('register', () => {
    it('should throw if user already exists', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(mockUser.email, 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create new user and return login result', async () => {
      userService.findByEmail.mockRejectedValue(new Error('User with email not found'));
      const newUser = { ...mockUser, password: 'newhashed' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
      userService.createUser.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue('newtoken');

      const result = await service.register('new@example.com', 'password123');
      expect(result.access_token).toBe('newtoken');
      expect(result.user).toEqual({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
    });
  });
});
