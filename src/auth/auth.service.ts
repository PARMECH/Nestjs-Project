import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const passwordValid = await bcrypt.compare(pass, user.password);
    if (!passwordValid) {
      return null;
    }
    return user;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(email, hashedPassword);
    return this.login(user);
  }
}
