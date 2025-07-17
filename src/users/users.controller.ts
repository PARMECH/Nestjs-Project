import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class UpdateRoleDto {
  role: 'admin' | 'editor' | 'viewer';
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Request() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException();
    return this.userService.findAll();
  }

  @Patch(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
    @Request() req,
  ) {
    if (req.user.role !== 'admin') throw new ForbiddenException();
    return this.userService.updateUserRole(+id, body.role);
  }
}
