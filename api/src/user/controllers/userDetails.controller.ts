import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDetailsDto } from '../dto/create-user-details.dto';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { UserDetailsService } from '../services/userDetails/userDetails.service';

@ApiTags('userdetails')
@Controller('userdetails')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserDetails(@Body() userDetails: CreateUserDetailsDto) {
    const { id, city, country } =
      await this.userDetailsService.createUserDetails(userDetails);

    return {
      message: 'User details created',
      userDetails: {
        id,
        city,
        country,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseInterceptors(CacheInterceptor)
  @Get()
  async getUserDetails() {
    const userDetails = await this.userDetailsService.getAll();

    return {
      message: 'User details retrieved successfully',
      userDetails,
    };
  }
}
