import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { CreateUserRoleDto } from 'src/user/dto/create-user-role.dto';
import { Repository } from 'typeorm';
import { ASYNC_STORAGE } from '../../../global/constants';
import { UserRoleEntity } from '../../entities/user/userRole.entity';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserRoleService {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, any>>,
    @InjectRepository(UserRoleEntity, 'db1')
    private userRoleRepository1: Repository<UserRoleEntity>,
    @InjectRepository(UserRoleEntity, 'db2')
    private userRoleRepository2: Repository<UserRoleEntity>,
    private readonly jwtService: JwtService,
  ) {}

  getUserDetailsRepository(): Repository<UserRoleEntity> {
    const token = this.asyncLocalStorage.getStore()?.get('token');
    const { dbName } = this.jwtService.parse(token);
    return dbName === 'db1'
      ? this.userRoleRepository1
      : this.userRoleRepository2;
  }

  async isUserRoleExists(role: string): Promise<UserRoleEntity | null> {
    return this.getUserDetailsRepository().findOne({
      where: {
        role,
      },
    });
  }

  async createUserRole(
    userTypeDto: CreateUserRoleDto,
  ): Promise<UserRoleEntity> {
    // check if user role exists and send custom error message
    if (await this.isUserRoleExists(userTypeDto.role)) {
      throw new HttpException(
        'User role already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRolePayload = {
      role: userTypeDto.role,
    };

    const newUserRole = this.getUserDetailsRepository().create(userRolePayload);

    return await this.updateUserRole(newUserRole);
  }

  async updateUserRole(newUserRole: UserRoleEntity): Promise<UserRoleEntity> {
    return await this.getUserDetailsRepository().save(newUserRole);
  }

  public getAll(): Promise<UserRoleEntity[]> {
    return this.getUserDetailsRepository().find({
      relations: { users: true },
    });
  }
}
