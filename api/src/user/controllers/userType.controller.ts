import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserTypeDto } from '../dto/create-user-type.dto';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { UserTypeService } from '../services/userType/userType.service';

@ApiTags('usertype')
@Controller('usertype')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserType(@Body() userType: CreateUserTypeDto) {
    await this.userTypeService.createUserType(userType);

    return {
      message: 'User type created',
      userType: {
        type: userType.type,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTypes() {
    const userTypes = await this.userTypeService.getAll();

    return {
      message: 'User types retrieved successfully',
      userTypes,
    };
  }
}
