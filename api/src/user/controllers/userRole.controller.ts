import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserRoleDto } from '../dto/create-user-role.dto';
import { UserRoleService } from '../services/userRole/userRole.service';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';

@ApiTags('userrole')
@Controller('userrole')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserRole(@Body() userRole: CreateUserRoleDto) {
    await this.userRoleService.createUserRole(userRole);

    return {
      message: 'User type created',
      userRole: {
        role: userRole.role,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getuserRoles() {
    const userRoles = await this.userRoleService.getAll();

    return {
      message: 'User roles retrieved successfully',
      userRoles,
    };
  }
}
